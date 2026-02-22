/**
 * Generate realistic mountain route GeoJSON coordinates and waypoints
 * for all seeded routes that currently lack coordinate data.
 *
 * Run: pnpm --filter @summit/server exec tsx prisma/generate-route-geo.ts
 * Also called at the end of seed.ts after all routes are created.
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Simple deterministic hash from a string to produce a number 0-1
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash) / 2147483647; // Normalize to 0-1
}

/**
 * Seeded pseudo-random number generator (mulberry32)
 */
function createRng(seed: number) {
  let t = seed + 0x6d2b79f5;
  return () => {
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface RoutePoint {
  lon: number;
  lat: number;
  elevation: number;
}

interface GeneratedWaypoint {
  orderIndex: number;
  latitude: number;
  longitude: number;
  elevation: number;
  name: string;
  waypointType: string;
}

/**
 * Generate a realistic mountain route path from trailhead to summit.
 */
function generateRouteCoordinates(
  peakLon: number,
  peakLat: number,
  peakElevation: number,
  elevationGain: number | null,
  distance: number | null,
  routeNameHash: number,
): { coordinates: [number, number, number][]; waypoints: GeneratedWaypoint[] } {
  const rng = createRng(Math.floor(routeNameHash * 1000000));

  // Determine elevation gain — use provided or estimate from peak elevation
  const gain = elevationGain || peakElevation * 0.35;
  const startElevation = Math.max(peakElevation - gain, peakElevation * 0.2);

  // Determine distance and straight-line offset from summit
  const routeDistance = distance || (gain / 1000) * 8; // ~8km per 1000m gain if not specified
  const straightLineKm = routeDistance * 0.35; // Routes are winding

  // Approach bearing (deterministic from route name)
  const bearing = routeNameHash * 2 * Math.PI;

  // Convert distance offset to lat/lon degrees
  const cosLat = Math.cos(peakLat * Math.PI / 180);
  const dLat = (straightLineKm / 111.0) * Math.cos(bearing);
  const dLon = (straightLineKm / (111.0 * cosLat)) * Math.sin(bearing);

  const trailheadLon = peakLon + dLon;
  const trailheadLat = peakLat + dLat;

  // Number of points based on route length
  const numPoints = Math.min(40, Math.max(15, Math.round(routeDistance * 1.5)));

  const coordinates: [number, number, number][] = [];

  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints; // 0 to 1 progress

    // Base position: linear interpolation from trailhead to summit
    let lon = trailheadLon + (peakLon - trailheadLon) * t;
    let lat = trailheadLat + (peakLat - trailheadLat) * t;

    // Add lateral switchback oscillation (stronger at lower/mid elevations, less near summit)
    const switchbackAmplitude = 0.003 * (1 - t * t) * (routeDistance / 10);
    const switchbackFrequency = 3 + rng() * 2;

    // Perpendicular direction to the main path
    const perpAngle = bearing + Math.PI / 2;
    const lateralOffset = switchbackAmplitude * Math.sin(t * switchbackFrequency * Math.PI * 2);
    lon += lateralOffset * Math.sin(perpAngle) / cosLat;
    lat += lateralOffset * Math.cos(perpAngle);

    // Add small random noise for path irregularity
    const noiseScale = 0.0005 * (1 - t * 0.7);
    lon += (rng() - 0.5) * noiseScale / cosLat;
    lat += (rng() - 0.5) * noiseScale;

    // Elevation: non-linear profile (steeper near top, gentler at base)
    // Use power curve: more gradual start, steeper finish
    const elevProgress = Math.pow(t, 0.7);
    let elevation = startElevation + gain * elevProgress;

    // Add small elevation variations for realism (ridges, dips)
    const eleNoise = gain * 0.02 * Math.sin(t * 8 + rng() * 2) * (1 - t * 0.8);
    elevation += eleNoise;

    // Ensure last point is exactly the peak
    if (i === numPoints) {
      lon = peakLon;
      lat = peakLat;
      elevation = peakElevation;
    }

    // Ensure first point is exactly the trailhead
    if (i === 0) {
      lon = trailheadLon;
      lat = trailheadLat;
      elevation = startElevation;
    }

    coordinates.push([
      Math.round(lon * 100000) / 100000,
      Math.round(lat * 100000) / 100000,
      Math.round(elevation),
    ]);
  }

  // Generate waypoints
  const waypoints: GeneratedWaypoint[] = [];

  // Trailhead
  waypoints.push({
    orderIndex: 0,
    latitude: coordinates[0][1],
    longitude: coordinates[0][0],
    elevation: coordinates[0][2],
    name: 'Trailhead',
    waypointType: 'trailhead',
  });

  // Camp 1 (around 30-40% progress)
  const camp1Idx = Math.floor(numPoints * (0.3 + rng() * 0.1));
  const camp1Coord = coordinates[camp1Idx];
  waypoints.push({
    orderIndex: 1,
    latitude: camp1Coord[1],
    longitude: camp1Coord[0],
    elevation: camp1Coord[2],
    name: gain > 1500 ? 'Base Camp' : 'Camp 1',
    waypointType: 'camp',
  });

  // Camp 2 (around 60-70% progress, only for big routes)
  if (gain > 2000) {
    const camp2Idx = Math.floor(numPoints * (0.6 + rng() * 0.1));
    const camp2Coord = coordinates[camp2Idx];
    waypoints.push({
      orderIndex: 2,
      latitude: camp2Coord[1],
      longitude: camp2Coord[0],
      elevation: camp2Coord[2],
      name: gain > 3000 ? 'High Camp' : 'Camp 2',
      waypointType: 'camp',
    });
  }

  // Camp 3 for very high routes (Himalayan 8000ers)
  if (gain > 4000) {
    const camp3Idx = Math.floor(numPoints * (0.8 + rng() * 0.05));
    const camp3Coord = coordinates[camp3Idx];
    waypoints.push({
      orderIndex: waypoints.length,
      latitude: camp3Coord[1],
      longitude: camp3Coord[0],
      elevation: camp3Coord[2],
      name: 'Summit Camp',
      waypointType: 'camp',
    });
  }

  // Summit
  const summitCoord = coordinates[coordinates.length - 1];
  waypoints.push({
    orderIndex: waypoints.length,
    latitude: summitCoord[1],
    longitude: summitCoord[0],
    elevation: summitCoord[2],
    name: 'Summit',
    waypointType: 'summit',
  });

  return { coordinates, waypoints };
}

export async function generateAllRouteGeo() {
  console.log('\n── Generating route coordinates ──');

  // Get all routes that lack geoJson, with their peak data
  const routes = await prisma.route.findMany({
    where: {
      OR: [
        { geoJson: null },
        { geoJson: '' },
      ],
    },
    include: {
      peak: { select: { latitude: true, longitude: true, elevation: true, name: true } },
    },
  });

  console.log(`  Found ${routes.length} routes without coordinates`);

  if (routes.length === 0) {
    console.log('  All routes already have coordinates, skipping');
    return;
  }

  let generated = 0;
  let errors = 0;

  for (const route of routes) {
    try {
      const nameHash = hashString(`${route.name}-${route.peak.name}-${route.id}`);

      const { coordinates, waypoints } = generateRouteCoordinates(
        route.peak.longitude,
        route.peak.latitude,
        route.peak.elevation,
        route.elevationGain,
        route.distance,
        nameHash,
      );

      const geoJson = JSON.stringify({
        type: 'LineString',
        coordinates,
      });

      // Delete existing waypoints for this route (idempotent)
      await prisma.waypoint.deleteMany({ where: { routeId: route.id } });

      // Update route with geoJson and create waypoints
      await prisma.$transaction([
        prisma.route.update({
          where: { id: route.id },
          data: { geoJson },
        }),
        prisma.waypoint.createMany({
          data: waypoints.map((wp) => ({
            routeId: route.id,
            ...wp,
          })),
        }),
      ]);

      generated++;
    } catch (err) {
      console.error(`  ERROR generating geo for route "${route.name}" (id=${route.id}):`, err);
      errors++;
    }
  }

  console.log(`  Generated coordinates for ${generated} routes (${errors} errors)`);
}

// If run directly (not imported)
const isMain = process.argv[1]?.endsWith('generate-route-geo.ts') ||
  process.argv[1]?.endsWith('generate-route-geo.js');

if (isMain) {
  generateAllRouteGeo()
    .then(async () => {
      await prisma.$disconnect();
      console.log('\nRoute geo generation complete!');
    })
    .catch(async (e) => {
      console.error('Route geo generation error:', e);
      await prisma.$disconnect();
      process.exit(1);
    });
}
