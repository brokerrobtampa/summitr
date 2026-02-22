import { tripPlannerQuerySchema, CONTINENTS } from '@summit/shared';
import { prisma } from '../lib/prisma.js';
import { ValidationError } from '../lib/errors.js';
import type { Prisma } from '@prisma/client';

const DIFFICULTY_ORDER: Record<string, number> = {
  easy: 1,
  moderate: 2,
  difficult: 3,
  very_difficult: 4,
  extreme: 5,
};

export async function searchTrips(query: unknown) {
  const parsed = tripPlannerQuerySchema.safeParse(query);
  if (!parsed.success) throw new ValidationError(parsed.error.issues[0].message);

  const {
    minElevation, maxElevation, country, continent, range,
    difficulty, activityTypes, seasons, gradeSystem,
    iceClimbing, permitRequired, guidesAvailable,
    minDistance, maxDistance, minElevationGain, maxElevationGain,
    maxEstimatedTime, commitment,
    q, page, limit, sort,
  } = parsed.data;

  // Build peak WHERE
  const peakWhere: Prisma.PeakWhereInput = {};

  if (minElevation !== undefined) peakWhere.elevation = { ...((peakWhere.elevation as object) || {}), gte: minElevation };
  if (maxElevation !== undefined) peakWhere.elevation = { ...((peakWhere.elevation as object) || {}), lte: maxElevation };

  if (country) peakWhere.country = { equals: country, mode: 'insensitive' };

  if (continent) {
    const countriesInContinent = CONTINENTS[continent];
    if (countriesInContinent && countriesInContinent.length > 0) {
      peakWhere.country = { in: countriesInContinent, mode: 'insensitive' };
    }
  }

  if (range) peakWhere.range = { contains: range, mode: 'insensitive' };

  if (q) {
    peakWhere.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { country: { contains: q, mode: 'insensitive' } },
      { range: { contains: q, mode: 'insensitive' } },
      { routes: { some: { name: { contains: q, mode: 'insensitive' } } } },
    ];
  }

  // Build route WHERE
  const routeWhere: Prisma.RouteWhereInput = {
    isPublic: true,
  };

  if (difficulty && difficulty.length > 0) {
    routeWhere.difficulty = { in: difficulty, mode: 'insensitive' };
  }

  if (activityTypes && activityTypes.length > 0) {
    routeWhere.activityType = { in: activityTypes };
  }

  if (iceClimbing === true) {
    routeWhere.activityType = { in: ['ice', 'alpine'] };
  }

  if (seasons && seasons.length > 0) {
    routeWhere.OR = [
      ...(routeWhere.OR ? (routeWhere.OR as Prisma.RouteWhereInput[]) : []),
      ...seasons.map((s) => ({ season: { contains: s, mode: 'insensitive' as const } })),
      { season: { contains: 'year-round', mode: 'insensitive' as const } },
    ];
  }

  if (gradeSystem) {
    routeWhere.gradeSystem = gradeSystem;
  }

  if (permitRequired === 'yes') {
    routeWhere.permitRequired = true;
  } else if (permitRequired === 'no') {
    routeWhere.permitRequired = false;
  }

  if (minDistance !== undefined) routeWhere.distance = { ...((routeWhere.distance as object) || {}), gte: minDistance };
  if (maxDistance !== undefined) routeWhere.distance = { ...((routeWhere.distance as object) || {}), lte: maxDistance };

  if (minElevationGain !== undefined) routeWhere.elevationGain = { ...((routeWhere.elevationGain as object) || {}), gte: minElevationGain };
  if (maxElevationGain !== undefined) routeWhere.elevationGain = { ...((routeWhere.elevationGain as object) || {}), lte: maxElevationGain };

  if (maxEstimatedTime !== undefined) {
    routeWhere.estimatedTime = { lte: maxEstimatedTime };
  }

  if (commitment && commitment.length > 0) {
    routeWhere.commitment = { in: commitment };
  }

  // Combine: find routes matching both peak and route criteria
  const combinedWhere: Prisma.RouteWhereInput = {
    ...routeWhere,
    peak: peakWhere,
  };

  // Build orderBy
  const orderBy: Prisma.RouteOrderByWithRelationInput = (() => {
    switch (sort) {
      case 'elevation_desc': return { peak: { elevation: 'desc' } };
      case 'elevation_asc': return { peak: { elevation: 'asc' } };
      case 'rating_desc': return { reviews: { _count: 'desc' } };
      case 'distance_asc': return { distance: 'asc' };
      case 'distance_desc': return { distance: 'desc' };
      case 'name_asc': return { peak: { name: 'asc' } };
      default: return { peak: { elevation: 'desc' } };
    }
  })();

  // Execute query
  const [routes, total] = await Promise.all([
    prisma.route.findMany({
      where: combinedWhere,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        peak: {
          select: {
            id: true,
            name: true,
            elevation: true,
            country: true,
            range: true,
            imageUrl: true,
            latitude: true,
            longitude: true,
          },
        },
        _count: { select: { reviews: true } },
        reviews: { select: { rating: true } },
      },
    }),
    prisma.route.count({ where: combinedWhere }),
  ]);

  // Get guide service counts for the peaks in results
  const peakIds = [...new Set(routes.map((r) => r.peakId))];
  const guideServiceCounts = peakIds.length > 0
    ? await prisma.guideService.groupBy({
        by: ['peakId'],
        _count: { id: true },
        where: { peakId: { in: peakIds } },
      })
    : [];

  const guideCountMap = new Map(guideServiceCounts.map((g) => [g.peakId, g._count.id]));

  // Get filter counts for sidebar
  const [totalPeaks, totalRoutes, countriesRaw] = await Promise.all([
    prisma.peak.count({ where: peakWhere }),
    prisma.route.count({ where: combinedWhere }),
    prisma.peak.findMany({
      where: { ...peakWhere, country: { not: null } },
      select: { country: true },
      distinct: ['country'],
      orderBy: { country: 'asc' },
    }),
  ]);

  const countries = countriesRaw
    .map((p) => p.country)
    .filter((c): c is string => !!c);

  // Determine which continents are represented
  const continentsFound = new Set<string>();
  for (const c of countries) {
    for (const [cont, contCountries] of Object.entries(CONTINENTS)) {
      if (contCountries.some((cc) => cc.toLowerCase() === c.toLowerCase())) {
        continentsFound.add(cont);
        break;
      }
    }
  }

  // Map results
  let results = routes.map((r) => {
    const avgRating =
      r.reviews.length > 0
        ? Math.round((r.reviews.reduce((a, rev) => a + rev.rating, 0) / r.reviews.length) * 10) / 10
        : null;

    const guideCount = guideCountMap.get(r.peakId) || 0;

    return {
      id: r.id,
      routeId: r.id,
      routeName: r.name,
      peakId: r.peak.id,
      peakName: r.peak.name,
      peakElevation: r.peak.elevation,
      peakCountry: r.peak.country,
      peakRange: r.peak.range,
      peakImageUrl: r.peak.imageUrl,
      peakLatitude: r.peak.latitude,
      peakLongitude: r.peak.longitude,
      difficulty: r.difficulty,
      gradeSystem: r.gradeSystem,
      activityType: r.activityType,
      summary: r.summary,
      distance: r.distance,
      elevationGain: r.elevationGain,
      estimatedTime: r.estimatedTime,
      approachTime: r.approachTime,
      commitment: r.commitment,
      season: r.season,
      hazards: r.hazards ? JSON.parse(r.hazards) : null,
      permitRequired: r.permitRequired,
      permitInfo: r.permitInfo,
      closestAirport: r.closestAirport,
      basecamp: r.basecamp,
      averageRating: avgRating,
      reviewCount: r._count.reviews,
      hasGuideServices: guideCount > 0,
      guideServiceCount: guideCount,
    };
  });

  // Sort by difficulty if needed (in-memory because difficulty ordering isn't numeric in DB)
  if (sort === 'difficulty_asc' || sort === 'difficulty_desc') {
    results.sort((a, b) => {
      const aOrder = DIFFICULTY_ORDER[a.difficulty || ''] || 0;
      const bOrder = DIFFICULTY_ORDER[b.difficulty || ''] || 0;
      return sort === 'difficulty_asc' ? aOrder - bOrder : bOrder - aOrder;
    });
  }

  // Filter by guide availability in-memory (requires join data)
  if (guidesAvailable === true) {
    results = results.filter((r) => r.hasGuideServices);
  }

  return {
    results,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    filterCounts: {
      totalPeaks,
      totalRoutes,
      countries,
      continents: [...continentsFound].sort(),
    },
  };
}
