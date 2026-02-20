import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/lib/auth.js';
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
  const routeFiles = [
    'routes-world.json',
    'routes-himalaya.json',
    'routes-alps.json',
    'routes-usa.json',
    'routes-world-expanded.json',
  ];

  const rawRoutes: SeedPeakRoutes[] = [];
  for (const file of routeFiles) {
    const filePath = path.join(__dirname, 'seed-data', file);
    if (fs.existsSync(filePath)) {
      const data: SeedPeakRoutes[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      rawRoutes.push(...data);
      console.log(`  Loaded ${data.length} peak entries from ${file}`);
    } else {
      console.log(`  Skipping ${file} (not found)`);
    }
  }

  let routesCreated = 0;
  let routesUpdated = 0;
  let tipsCreated = 0;
  let gearCreated = 0;
  let gearLinksCreated = 0;
  let reviewsCreated = 0;

  for (const peakEntry of rawRoutes) {
    const peak = await prisma.peak.findFirst({
      where: { name: peakEntry.peakName },
    });

    if (!peak) {
      console.log(`  WARNING: Peak "${peakEntry.peakName}" not found, skipping routes`);
      continue;
    }

    for (const routeData of peakEntry.routes) {
      const existingRoute = await prisma.route.findFirst({
        where: { name: routeData.name, peakId: peak.id },
      });

      if (existingRoute) {
        // Update existing route with enrichment data
        await prisma.route.update({
          where: { id: existingRoute.id },
          data: {
            summary: routeData.summary ?? existingRoute.summary,
            imageUrl: routeData.imageUrl ?? existingRoute.imageUrl,
            technicalGrade: routeData.technicalGrade ?? existingRoute.technicalGrade,
            commitment: routeData.commitment ?? existingRoute.commitment,
            approachTime: routeData.approachTime ?? existingRoute.approachTime,
            descentTime: routeData.descentTime ?? existingRoute.descentTime,
            basecamp: routeData.basecamp ?? existingRoute.basecamp,
            safetyNotes: routeData.safetyNotes ?? existingRoute.safetyNotes,
            permitRequired: routeData.permitRequired ?? existingRoute.permitRequired,
            permitInfo: routeData.permitInfo ?? existingRoute.permitInfo,
            closestAirport: routeData.closestAirport ?? existingRoute.closestAirport,
            description: routeData.description ?? existingRoute.description,
          },
        });
        routesUpdated++;

        // Update gear with new fields and links
        for (const gear of routeData.gear || []) {
          const existingGear = await prisma.gearRecommendation.findFirst({
            where: { routeId: existingRoute.id, itemName: gear.itemName },
          });
          if (existingGear) {
            await prisma.gearRecommendation.update({
              where: { id: existingGear.id },
              data: {
                weight: gear.weight ?? existingGear.weight,
                priceRange: gear.priceRange ?? existingGear.priceRange,
                specificProduct: gear.specificProduct ?? existingGear.specificProduct,
                notes: gear.notes ?? existingGear.notes,
              },
            });
            // Create gear links if they don't exist
            if (gear.links) {
              const existingLinks = await prisma.gearLink.count({ where: { gearId: existingGear.id } });
              if (existingLinks === 0) {
                for (const link of gear.links) {
                  await prisma.gearLink.create({
                    data: {
                      gearId: existingGear.id,
                      retailer: link.retailer,
                      productName: link.productName,
                      url: link.url,
                      price: link.price,
                    },
                  });
                  gearLinksCreated++;
                }
              }
            }
          } else {
            // Create new gear item
            const newGear = await prisma.gearRecommendation.create({
              data: {
                routeId: existingRoute.id,
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
            gearCreated++;
            if (gear.links) {
              for (const link of gear.links) {
                await prisma.gearLink.create({
                  data: {
                    gearId: newGear.id,
                    retailer: link.retailer,
                    productName: link.productName,
                    url: link.url,
                    price: link.price,
                  },
                });
                gearLinksCreated++;
              }
            }
          }
        }

        continue;
      }

      // Create new route
      const route = await prisma.route.create({
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
      routesCreated++;

      // Create tips
      for (const tip of routeData.tips || []) {
        await prisma.tip.create({
          data: {
            routeId: route.id,
            authorId: seedUser.id,
            content: tip.content,
            category: tip.category,
          },
        });
        tipsCreated++;
      }

      // Create gear recommendations with links
      for (const gear of routeData.gear || []) {
        const gearRec = await prisma.gearRecommendation.create({
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
        gearCreated++;

        // Create gear links
        if (gear.links) {
          for (const link of gear.links) {
            await prisma.gearLink.create({
              data: {
                gearId: gearRec.id,
                retailer: link.retailer,
                productName: link.productName,
                url: link.url,
                price: link.price,
              },
            });
            gearLinksCreated++;
          }
        }
      }

      // Create reviews
      for (const review of routeData.reviews || []) {
        await prisma.review.create({
          data: {
            routeId: route.id,
            authorId: seedUser.id,
            rating: review.rating,
            title: review.title,
            body: review.body,
            conditions: review.conditions,
          },
        });
        reviewsCreated++;
      }
    }
  }

  console.log(`\nRoutes: ${routesCreated} created, ${routesUpdated} updated`);
  console.log(`Tips: ${tipsCreated} created`);
  console.log(`Gear recommendations: ${gearCreated} created`);
  console.log(`Gear links: ${gearLinksCreated} created`);
  console.log(`Reviews: ${reviewsCreated} created`);
  console.log(`\nTotal routes in database: ${await prisma.route.count()}`);
  console.log(`Total tips: ${await prisma.tip.count()}`);
  console.log(`Total gear recs: ${await prisma.gearRecommendation.count()}`);
  console.log(`Total gear links: ${await prisma.gearLink.count()}`);
  console.log(`Total reviews: ${await prisma.review.count()}`);

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

    for (const entry of rawGuides) {
      const peak = await prisma.peak.findFirst({ where: { name: entry.peakName } });
      if (!peak) {
        console.log(`  WARNING: Peak "${entry.peakName}" not found for guide services, skipping`);
        continue;
      }

      for (const guide of entry.guides) {
        const existing = await prisma.guideService.findFirst({
          where: { peakId: peak.id, name: guide.name },
        });
        if (existing) {
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
      }
    }

    console.log(`\nGuide services: ${guidesCreated} created, ${guidesSkipped} already existed`);
    console.log(`Total guide services: ${await prisma.guideService.count()}`);
  } else {
    console.log('\nNo guide-services.json found, skipping guide services seeding');
  }
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
