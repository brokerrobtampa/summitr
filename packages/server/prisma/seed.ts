import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/lib/auth.js';
import { generateAllRouteGeo } from './generate-route-geo.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const prisma = new PrismaClient();

interface SeedPeak {
  name: string;
  alternateNames: string[] | null;
  latitude: number;
  longitude: number;
  elevation: number;
  prominence: number | null;
  country: string | null;
  region: string | null;
  range: string | null;
  description: string | null;
  source: string;
  // New enrichment fields
  imageUrl?: string | null;
  closestAirport?: string | null;
  closestAirportDistance?: string | null;
  permitRequired?: boolean;
  permitInfo?: string | null;
  bestMonths?: string | null;
}

interface SeedTip {
  content: string;
  category: string;
}

interface SeedGearLink {
  retailer: string;
  productName: string;
  url: string;
  price: number | null;
}

interface SeedGear {
  itemName: string;
  category: string;
  isEssential: boolean;
  notes: string | null;
  weight?: string | null;
  priceRange?: string | null;
  specificProduct?: string | null;
  links?: SeedGearLink[];
}

interface SeedReview {
  rating: number;
  title: string | null;
  body: string;
  conditions: string | null;
}

interface SeedRoute {
  name: string;
  difficulty: string | null;
  gradeSystem: string | null;
  activityType: string;
  description: string | null;
  distance: number | null;
  elevationGain: number | null;
  estimatedTime: number | null;
  season: string | null;
  hazards: string | null;
  tips: SeedTip[];
  gear: SeedGear[];
  reviews: SeedReview[];
  // New enrichment fields
  summary?: string | null;
  imageUrl?: string | null;
  technicalGrade?: string | null;
  commitment?: string | null;
  approachTime?: number | null;
  descentTime?: number | null;
  basecamp?: string | null;
  safetyNotes?: string | null;
  permitRequired?: boolean;
  permitInfo?: string | null;
  closestAirport?: string | null;
}

interface SeedPeakRoutes {
  peakName: string;
  routes: SeedRoute[];
}

async function main() {
  console.log('Seeding database...\n');

  // ── 1. Seed peaks ──────────────────────────────────────
  const peaksPath = path.join(__dirname, 'seed-data', 'peaks-world.json');
  const rawPeaks: SeedPeak[] = JSON.parse(fs.readFileSync(peaksPath, 'utf-8'));

  let peaksCreated = 0;
  let peaksUpdated = 0;

  for (const peak of rawPeaks) {
    const existing = await prisma.peak.findFirst({
      where: { name: peak.name, latitude: peak.latitude, longitude: peak.longitude },
    });

    if (existing) {
      // Update existing peak with enrichment data
      await prisma.peak.update({
        where: { id: existing.id },
        data: {
          description: peak.description ?? existing.description,
          imageUrl: peak.imageUrl ?? existing.imageUrl,
          closestAirport: peak.closestAirport ?? existing.closestAirport,
          closestAirportDistance: peak.closestAirportDistance ?? existing.closestAirportDistance,
          permitRequired: peak.permitRequired ?? existing.permitRequired,
          permitInfo: peak.permitInfo ?? existing.permitInfo,
          bestMonths: peak.bestMonths ?? existing.bestMonths,
        },
      });
      peaksUpdated++;
      continue;
    }

    await prisma.peak.create({
      data: {
        name: peak.name,
        alternateNames: peak.alternateNames ? JSON.stringify(peak.alternateNames) : null,
        latitude: peak.latitude,
        longitude: peak.longitude,
        elevation: peak.elevation,
        prominence: peak.prominence,
        country: peak.country,
        region: peak.region,
        range: peak.range,
        description: peak.description,
        source: peak.source || 'manual',
        imageUrl: peak.imageUrl ?? null,
        closestAirport: peak.closestAirport ?? null,
        closestAirportDistance: peak.closestAirportDistance ?? null,
        permitRequired: peak.permitRequired ?? false,
        permitInfo: peak.permitInfo ?? null,
        bestMonths: peak.bestMonths ?? null,
      },
    });
    peaksCreated++;
  }

  console.log(`Peaks: ${peaksCreated} created, ${peaksUpdated} updated`);
  console.log(`Total peaks in database: ${await prisma.peak.count()}`);

  // ── 2. Create seed user ────────────────────────────────
  const seedEmail = 'alpine.guide@summitr.app';
  let seedUser = await prisma.user.findUnique({ where: { email: seedEmail } });

  if (!seedUser) {
    seedUser = await prisma.user.create({
      data: {
        email: seedEmail,
        username: 'alpine_guide',
        passwordHash: await hashPassword('SummitR2024!'),
        displayName: 'Alpine Guide',
        bio: 'Curated route information from established mountaineering sources. Routes compiled from public guidebooks, trip reports, and community knowledge.',
        location: 'Worldwide',
        experienceLevel: 'expert',
      },
    });
    console.log('\nSeed user created: alpine_guide');
  } else {
    console.log('\nSeed user already exists: alpine_guide');
  }

  // ── 3. Seed routes with tips, gear, and reviews ────────
  // Batch approach: pre-load all peaks & existing routes into memory,
  // then process each route file in a single transaction per file.
  const routeFiles = [
    'routes-world.json',
    'routes-himalaya.json',
    'routes-alps.json',
    'routes-usa.json',
    'routes-world-expanded.json',
    'routes-colorado.json',
    'routes-andes-expanded.json',
    'routes-alps-expanded.json',
    'routes-alaska-canada.json',
    'routes-usa-expanded.json',
    'routes-world-remaining.json',
  ];

  // Pre-load all peaks into a name→peak map (single query)
  const allPeaks = await prisma.peak.findMany();
  const peakMap = new Map<string, typeof allPeaks[0]>();
  for (const p of allPeaks) peakMap.set(p.name, p);

  // Pre-load all existing routes into a "peakId-routeName" → route map (single query)
  const allExistingRoutes = await prisma.route.findMany({ select: { id: true, name: true, peakId: true } });
  const existingRouteMap = new Map<string, number>();
  for (const r of allExistingRoutes) existingRouteMap.set(`${r.peakId}-${r.name}`, r.id);

  let routesCreated = 0;
  let routesSkipped = 0;

  for (const file of routeFiles) {
    const filePath = path.join(__dirname, 'seed-data', file);
    if (!fs.existsSync(filePath)) {
      console.log(`  Skipping ${file} (not found)`);
      continue;
    }

    try {
      console.log(`  Processing ${file}...`);
      const data: SeedPeakRoutes[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      let fileRouteCount = 0;

      for (const peakEntry of data) {
        const peak = peakMap.get(peakEntry.peakName);
        if (!peak) {
          console.log(`  WARNING: Peak "${peakEntry.peakName}" not found, skipping`);
          continue;
        }

        // Filter to only NEW routes (not already in DB)
        const newRoutes = peakEntry.routes.filter(
          (r) => !existingRouteMap.has(`${peak.id}-${r.name}`)
        );
        routesSkipped += peakEntry.routes.length - newRoutes.length;

        if (newRoutes.length === 0) continue;

        // Process each new route inside a transaction (batches the inserts)
        for (const routeData of newRoutes) {
          try {
            await prisma.$transaction(async (tx) => {
              const route = await tx.route.create({
                data: {
                  name: routeData.name,
                  peakId: peak.id,
                  authorId: seedUser.id,
                  difficulty: routeData.difficulty,
                  gradeSystem: routeData.gradeSystem,
                  activityType: routeData.activityType,
                  description: routeData.description,
                  distance: routeData.distance,
                  elevationGain: routeData.elevationGain,
                  estimatedTime: routeData.estimatedTime,
                  season: routeData.season,
                  hazards: routeData.hazards,
                  isPublic: true,
                  summary: routeData.summary ?? null,
                  imageUrl: routeData.imageUrl ?? null,
                  technicalGrade: routeData.technicalGrade ?? null,
                  commitment: routeData.commitment ?? null,
                  approachTime: routeData.approachTime ?? null,
                  descentTime: routeData.descentTime ?? null,
                  basecamp: routeData.basecamp ?? null,
                  safetyNotes: routeData.safetyNotes ?? null,
                  permitRequired: routeData.permitRequired ?? false,
                  permitInfo: routeData.permitInfo ?? null,
                  closestAirport: routeData.closestAirport ?? null,
                },
              });

              // Batch create tips
              if (routeData.tips?.length) {
                await tx.tip.createMany({
                  data: routeData.tips.map((tip) => ({
                    routeId: route.id,
                    authorId: seedUser.id,
                    content: tip.content,
                    category: tip.category,
                  })),
                });
              }

              // Create gear recommendations (need IDs back for gear links)
              for (const gear of routeData.gear || []) {
                const gearRec = await tx.gearRecommendation.create({
                  data: {
                    routeId: route.id,
                    authorId: seedUser.id,
                    itemName: gear.itemName,
                    category: gear.category,
                    isEssential: gear.isEssential,
                    notes: gear.notes,
                    weight: gear.weight ?? null,
                    priceRange: gear.priceRange ?? null,
                    specificProduct: gear.specificProduct ?? null,
                  },
                });

                if (gear.links?.length) {
                  await tx.gearLink.createMany({
                    data: gear.links.map((link) => ({
                      gearId: gearRec.id,
                      retailer: link.retailer,
                      productName: link.productName,
                      url: link.url,
                      price: link.price,
                    })),
                  });
                }
              }

              // Batch create reviews
              if (routeData.reviews?.length) {
                await tx.review.createMany({
                  data: routeData.reviews.map((review) => ({
                    routeId: route.id,
                    authorId: seedUser.id,
                    rating: review.rating,
                    title: review.title,
                    body: review.body,
                    conditions: review.conditions,
                  })),
                });
              }
            });

            // Track in our map so duplicates across files are caught
            existingRouteMap.set(`${peak.id}-${routeData.name}`, -1);
            routesCreated++;
            fileRouteCount++;
          } catch (err) {
            console.error(`  ERROR creating route "${routeData.name}" for "${peakEntry.peakName}":`, err);
          }
        }
      }

      console.log(`  ${file}: ${fileRouteCount} routes created`);
    } catch (fileErr) {
      console.error(`  FATAL ERROR processing file ${file}:`, fileErr);
      // Continue with remaining files instead of crashing
      continue;
    }
  }

  console.log(`\nRoutes: ${routesCreated} created, ${routesSkipped} already existed`);
  console.log(`Total routes in database: ${await prisma.route.count()}`);

  // ── 4. Seed guide services ─────────────────────────────
  const guidesPath = path.join(__dirname, 'seed-data', 'guide-services.json');
  if (fs.existsSync(guidesPath)) {
    interface SeedGuide {
      name: string;
      website: string;
      description?: string;
      priceRange?: string;
      contactEmail?: string;
      location?: string;
      specialties?: string[];
    }
    interface SeedGuidePeak {
      peakName: string;
      guides: SeedGuide[];
    }

    const rawGuides: SeedGuidePeak[] = JSON.parse(fs.readFileSync(guidesPath, 'utf-8'));
    let guidesCreated = 0;
    let guidesSkipped = 0;

    // Pre-load existing guide services in one query
    const existingGuides = await prisma.guideService.findMany({ select: { peakId: true, name: true } });
    const guideSet = new Set(existingGuides.map((g) => `${g.peakId}-${g.name}`));

    for (const entry of rawGuides) {
      const peak = peakMap.get(entry.peakName);
      if (!peak) {
        console.log(`  WARNING: Peak "${entry.peakName}" not found for guide services, skipping`);
        continue;
      }

      for (const guide of entry.guides) {
        if (guideSet.has(`${peak.id}-${guide.name}`)) {
          guidesSkipped++;
          continue;
        }

        await prisma.guideService.create({
          data: {
            peakId: peak.id,
            name: guide.name,
            website: guide.website,
            description: guide.description ?? null,
            priceRange: guide.priceRange ?? null,
            contactEmail: guide.contactEmail ?? null,
            location: guide.location ?? null,
            specialties: guide.specialties ? JSON.stringify(guide.specialties) : null,
          },
        });
        guidesCreated++;
        guideSet.add(`${peak.id}-${guide.name}`);
      }
    }

    console.log(`\nGuide services: ${guidesCreated} created, ${guidesSkipped} already existed`);
    console.log(`Total guide services: ${await prisma.guideService.count()}`);
  } else {
    console.log('\nNo guide-services.json found, skipping guide services seeding');
  }

  // ── 5. Seed forum categories ─────────────────────────
  // Delete old forum categories to rebuild with new structure
  await prisma.forumCategory.deleteMany({});
  console.log('\nCleared existing forum categories for rebuild');

  // 5a. Topic categories (parentId=null, peakId=null)
  const topicCategories = [
    { name: 'General Discussion', slug: 'general-discussion', description: 'Talk about anything mountaineering-related', sortOrder: 1 },
    { name: 'Gear Strategy & Tips', slug: 'gear-strategy-tips', description: 'Discuss gear choices, equipment reviews, and packing strategies', sortOrder: 2 },
    { name: 'Route Planning & Beta', slug: 'route-planning-beta', description: 'Share route conditions, beta, and planning advice', sortOrder: 3 },
    { name: 'Guide Companies & Reviews', slug: 'guide-companies-reviews', description: 'Reviews and discussions about guiding services and outfitters', sortOrder: 4 },
    { name: 'Trip Reports', slug: 'trip-reports', description: 'Share your climbing trip reports and experiences', sortOrder: 5 },
    { name: 'Safety & Weather', slug: 'safety-weather', description: 'Discuss safety practices, weather patterns, and route hazards', sortOrder: 6 },
    { name: 'Training & Fitness', slug: 'training-fitness', description: 'Tips on training, conditioning, and preparation for climbs', sortOrder: 7 },
    { name: 'Photography & Media', slug: 'photography-media', description: 'Share your mountain photography, videos, and creative work', sortOrder: 8 },
  ];

  for (const cat of topicCategories) {
    await prisma.forumCategory.create({ data: cat });
  }
  console.log(`Topic categories: ${topicCategories.length} created`);

  // 5b. Continent parent categories + peak subcategories
  const countryToContinent: Record<string, string> = {
    'Nepal': 'Asia', 'China': 'Asia', 'Nepal/China': 'Asia', 'Pakistan': 'Asia',
    'Pakistan/China': 'Asia', 'Nepal/India': 'Asia', 'Japan': 'Asia', 'Iran': 'Asia',
    'Malaysia': 'Asia', 'Georgia/Russia': 'Asia', 'Turkey': 'Asia', 'Indonesia': 'Asia',
    'Kyrgyzstan': 'Asia', 'India': 'Asia',
    'France': 'Europe', 'Italy': 'Europe', 'Switzerland': 'Europe', 'Austria': 'Europe',
    'Germany/Austria': 'Europe', 'France/Italy': 'Europe', 'Switzerland/Italy': 'Europe',
    'Greece': 'Europe', 'Slovenia': 'Europe', 'Spain': 'Europe',
    'United Kingdom': 'Europe', 'Russia': 'Europe', 'Norway': 'Europe', 'Poland': 'Europe',
    'United States': 'North America', 'Canada': 'North America',
    'United States/Canada': 'North America', 'Mexico': 'North America',
    'Argentina': 'South America', 'Peru': 'South America', 'Ecuador': 'South America',
    'Bolivia': 'South America', 'Argentina/Chile': 'South America', 'Chile': 'South America',
    'Colombia': 'South America', 'Venezuela': 'South America',
    'Tanzania': 'Africa', 'Kenya': 'Africa',
    'Democratic Republic of the Congo/Uganda': 'Africa', 'Morocco': 'Africa',
    'Uganda': 'Africa', 'Ethiopia': 'Africa',
    'Australia': 'Oceania', 'New Zealand': 'Oceania',
    'Papua New Guinea': 'Oceania', 'Indonesia/Papua New Guinea': 'Oceania',
    'Antarctica': 'Antarctica',
  };

  const continentDefs = [
    { name: 'Asia', slug: 'continent-asia', description: 'Peaks in the Himalayas, Karakoram, and other Asian ranges', sortOrder: 10 },
    { name: 'Europe', slug: 'continent-europe', description: 'Peaks in the Alps, Pyrenees, Caucasus, and other European ranges', sortOrder: 11 },
    { name: 'North America', slug: 'continent-north-america', description: 'Peaks in the Rockies, Cascades, Alaska Range, Sierra Nevada, and more', sortOrder: 12 },
    { name: 'South America', slug: 'continent-south-america', description: 'Peaks in the Andes and Patagonia', sortOrder: 13 },
    { name: 'Africa', slug: 'continent-africa', description: 'Peaks including Kilimanjaro, Mount Kenya, and the Rwenzori', sortOrder: 14 },
    { name: 'Oceania', slug: 'continent-oceania', description: 'Peaks in Australia, New Zealand, and the Pacific Islands', sortOrder: 15 },
    { name: 'Antarctica', slug: 'continent-antarctica', description: 'Peaks on the frozen continent', sortOrder: 16 },
  ];

  // Create continent parent categories
  const continentMap = new Map<string, number>();
  for (const cont of continentDefs) {
    const created = await prisma.forumCategory.create({ data: cont });
    continentMap.set(cont.name, created.id);
  }
  console.log(`Continent categories: ${continentDefs.length} created`);

  // Create peak subcategories under continents
  let peakCatsCreated = 0;
  for (const peak of allPeaks) {
    const continent = countryToContinent[peak.country ?? ''];
    const parentId = continent ? continentMap.get(continent) : undefined;
    if (!parentId) {
      // Skip peaks with unknown countries
      continue;
    }

    const slug = `peak-${peak.id}-${peak.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '')}`;
    try {
      await prisma.forumCategory.create({
        data: {
          name: peak.name,
          slug,
          description: `Discussion about ${peak.name}`,
          peakId: peak.id,
          parentId,
          sortOrder: 0,
        },
      });
      peakCatsCreated++;
    } catch (err) {
      // Skip duplicates silently
    }
  }
  console.log(`Peak subcategories: ${peakCatsCreated} created under continents`);

  // ── 6. Generate route coordinates ───────────────────────
  await generateAllRouteGeo();
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('\nSeed complete!');
  })
  .catch(async (e) => {
    console.error('Seed error:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
