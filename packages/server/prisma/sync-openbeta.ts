/**
 * OpenBeta Route Sync Script
 *
 * Fetches real climbing route data from OpenBeta's free GraphQL API
 * and imports it into the SummitR database, matched to existing peaks.
 *
 * Strategy:
 * 1. Load all 185 peaks from DB
 * 2. For each peak, query cragsNear with peak coordinates
 * 3. For each area returned, fetch climbs
 * 4. Map OpenBeta climb → SummitR Route model
 * 5. Upsert routes (dedup by openbetaId)
 *
 * Run: npx tsx prisma/sync-openbeta.ts
 * Or: node dist/prisma/sync-openbeta.js (after build)
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const OPENBETA_API = 'https://api.openbeta.io';
const USER_AGENT = 'SummitR/1.0 (open-source climbing platform)';

// Delay between API requests (ms) to be polite
const REQUEST_DELAY = 800;

// Search radius per peak (meters). Smaller peaks get smaller radius.
function getSearchRadius(elevation: number): number {
  if (elevation > 7000) return 30000; // 30km for Himalayan giants
  if (elevation > 4000) return 40000; // 40km for major peaks
  return 50000; // 50km for smaller peaks (more climbing areas nearby)
}

// System user ID for OpenBeta-sourced routes
let systemUserId: number;

interface OpenBetaCrag {
  uuid: string;
  area_name: string;
  totalClimbs: number;
  metadata: { lat: number; lng: number };
}

interface OpenBetaClimb {
  uuid: string;
  name: string;
  fa: string | null;
  length: number;
  grades: {
    yds: string | null;
    french: string | null;
    uiaa: string | null;
  };
  type: {
    sport: boolean | null;
    trad: boolean | null;
    bouldering: boolean | null;
    alpine: boolean | null;
    aid: boolean | null;
    ice: boolean | null;
    mixed: boolean | null;
  };
  safety: string | null;
  content: {
    description: string | null;
    location: string | null;
    protection: string | null;
  };
  metadata: {
    lat: number | null;
    lng: number | null;
  };
}

async function graphqlRequest<T>(query: string): Promise<T> {
  const response = await fetch(OPENBETA_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': USER_AGENT,
      Accept: 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenBeta API error ${response.status}: ${text.slice(0, 200)}`);
  }

  const json = (await response.json()) as { data: T; errors?: Array<{ message: string }> };
  if (json.errors?.length) {
    throw new Error(`GraphQL errors: ${json.errors.map((e) => e.message).join(', ')}`);
  }
  return json.data;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function mapActivityType(type: OpenBetaClimb['type']): string {
  if (type.alpine) return 'alpine';
  if (type.ice) return 'ice';
  if (type.mixed) return 'mixed';
  if (type.aid) return 'aid';
  if (type.trad) return 'trad';
  if (type.sport) return 'rock';
  if (type.bouldering) return 'bouldering';
  return 'alpine';
}

function mapDifficulty(grades: OpenBetaClimb['grades']): string | null {
  // Prefer YDS, then French, then UIAA
  return grades.yds || grades.french || grades.uiaa || null;
}

function buildGeoJson(lat: number | null, lng: number | null): string | null {
  if (lat == null || lng == null) return null;
  return JSON.stringify({
    type: 'LineString',
    coordinates: [[lng, lat]],
  });
}

async function getCragsNear(
  lat: number,
  lng: number,
  maxDistance: number,
): Promise<OpenBetaCrag[]> {
  const query = `{ cragsNear(lnglat: { lat: ${lat}, lng: ${lng} }, maxDistance: ${maxDistance}, includeCrags: true) { count crags { uuid area_name totalClimbs metadata { lat lng } } } }`;

  const data = await graphqlRequest<{
    cragsNear: Array<{ count: number; crags: OpenBetaCrag[] }>;
  }>(query);

  const crags: OpenBetaCrag[] = [];
  for (const group of data.cragsNear) {
    for (const crag of group.crags) {
      if (crag.totalClimbs > 0) {
        crags.push(crag);
      }
    }
  }
  return crags;
}

async function getAreaClimbs(uuid: string): Promise<{
  area_name: string;
  climbs: OpenBetaClimb[];
}> {
  const query = `{ area(uuid: "${uuid}") { area_name climbs { uuid name fa length grades { yds french uiaa } type { sport trad bouldering alpine aid ice mixed } safety content { description location protection } metadata { lat lng } } } }`;

  const data = await graphqlRequest<{
    area: { area_name: string; climbs: OpenBetaClimb[] };
  }>(query);

  return data.area;
}

async function ensureSystemUser(): Promise<number> {
  const existing = await prisma.user.findUnique({
    where: { username: 'openbeta-sync' },
  });
  if (existing) return existing.id;

  const user = await prisma.user.create({
    data: {
      email: 'openbeta-sync@summitr.app',
      username: 'openbeta-sync',
      displayName: 'OpenBeta',
      bio: 'Routes imported from OpenBeta.io — the open-source climbing database',
      passwordHash: null,
    },
  });
  return user.id;
}

async function syncPeak(
  peak: { id: number; name: string; latitude: number; longitude: number; elevation: number },
  existingOpenBetaIds: Set<string>,
): Promise<number> {
  const radius = getSearchRadius(peak.elevation);

  let crags: OpenBetaCrag[];
  try {
    crags = await getCragsNear(peak.latitude, peak.longitude, radius);
  } catch (err: any) {
    console.error(`  [ERROR] Failed to fetch crags for ${peak.name}: ${err.message}`);
    return 0;
  }

  if (crags.length === 0) return 0;

  let imported = 0;
  const totalCrags = crags.length;

  // Limit to 50 areas per peak to avoid huge imports
  const limitedCrags = crags.slice(0, 50);

  for (let i = 0; i < limitedCrags.length; i++) {
    const crag = limitedCrags[i];
    await sleep(REQUEST_DELAY);

    let areaData;
    try {
      areaData = await getAreaClimbs(crag.uuid);
    } catch (err: any) {
      console.error(`    [ERROR] Failed to fetch area ${crag.area_name}: ${err.message}`);
      continue;
    }

    for (const climb of areaData.climbs) {
      // Skip if already imported
      if (existingOpenBetaIds.has(climb.uuid)) continue;

      // Skip unnamed or bogus entries
      if (!climb.name || climb.name === 'Unknown' || climb.name.length < 2) continue;

      try {
        await prisma.route.create({
          data: {
            name: climb.name,
            peakId: peak.id,
            authorId: systemUserId,
            difficulty: mapDifficulty(climb.grades),
            gradeSystem: climb.grades.yds ? 'YDS' : climb.grades.french ? 'French' : climb.grades.uiaa ? 'UIAA' : null,
            activityType: mapActivityType(climb.type),
            description: climb.content?.description || null,
            safetyNotes: climb.safety || null,
            protection: climb.content?.protection || null,
            firstAscent: climb.fa || null,
            lengthMeters: climb.length > 0 ? climb.length : null,
            gradeYds: climb.grades.yds || null,
            gradeFrench: climb.grades.french || null,
            gradeUiaa: climb.grades.uiaa || null,
            geoJson: buildGeoJson(climb.metadata.lat ?? crag.metadata.lat, climb.metadata.lng ?? crag.metadata.lng),
            openbetaId: climb.uuid,
            source: 'openbeta',
            isPublic: true,
          },
        });

        existingOpenBetaIds.add(climb.uuid);
        imported++;
      } catch (err: any) {
        // Unique constraint or other error — skip
        if (!err.message?.includes('Unique constraint')) {
          console.error(`    [ERROR] Failed to import ${climb.name}: ${err.message}`);
        }
      }
    }
  }

  if (totalCrags > 50) {
    console.log(`    (limited to 50 of ${totalCrags} areas)`);
  }

  return imported;
}

export async function syncOpenBetaRoutes(): Promise<void> {
  console.log('=== OpenBeta Route Sync ===\n');

  // Ensure system user exists
  systemUserId = await ensureSystemUser();
  console.log(`System user ID: ${systemUserId}`);

  // Load existing OpenBeta route IDs to avoid duplicates
  const existingRoutes = await prisma.route.findMany({
    where: { openbetaId: { not: null } },
    select: { openbetaId: true },
  });
  const existingIds = new Set(existingRoutes.map((r) => r.openbetaId!));
  console.log(`Existing OpenBeta routes in DB: ${existingIds.size}`);

  // Load all peaks
  const peaks = await prisma.peak.findMany({
    select: { id: true, name: true, latitude: true, longitude: true, elevation: true },
    orderBy: { elevation: 'desc' },
  });
  console.log(`Peaks to sync: ${peaks.length}\n`);

  let totalImported = 0;
  let peaksWithRoutes = 0;

  for (let i = 0; i < peaks.length; i++) {
    const peak = peaks[i];
    const progress = `[${i + 1}/${peaks.length}]`;

    process.stdout.write(`${progress} ${peak.name} (${peak.elevation}m)... `);

    const imported = await syncPeak(peak, existingIds);

    if (imported > 0) {
      console.log(`+${imported} routes`);
      peaksWithRoutes++;
    } else {
      console.log('no new routes');
    }

    totalImported += imported;

    // Slightly longer delay between peaks
    await sleep(300);
  }

  console.log(`\n=== Sync Complete ===`);
  console.log(`Total new routes imported: ${totalImported}`);
  console.log(`Peaks with new routes: ${peaksWithRoutes}/${peaks.length}`);
  console.log(`Total OpenBeta routes in DB: ${existingIds.size}`);
}

// Run directly
syncOpenBetaRoutes()
  .then(() => {
    console.log('\nDone!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Sync failed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
