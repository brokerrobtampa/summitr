import { peakQuerySchema, peakBoundsSchema, peakNearbySchema } from '@summit/shared';
import { prisma } from '../lib/prisma.js';
import { NotFoundError, ValidationError } from '../lib/errors.js';
import type { Prisma } from '@prisma/client';

export async function listPeaks(query: unknown) {
  const parsed = peakQuerySchema.safeParse(query);
  if (!parsed.success) throw new ValidationError(parsed.error.issues[0].message);

  const { page, limit, country, range, minElevation, maxElevation, q, sort } = parsed.data;

  const where: Prisma.PeakWhereInput = {};
  if (country) where.country = country;
  if (range) where.range = { contains: range, mode: 'insensitive' };
  if (minElevation !== undefined) where.elevation = { ...((where.elevation as object) || {}), gte: minElevation };
  if (maxElevation !== undefined) where.elevation = { ...((where.elevation as object) || {}), lte: maxElevation };
  if (q) {
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { country: { contains: q, mode: 'insensitive' } },
      { range: { contains: q, mode: 'insensitive' } },
    ];
  }

  const orderBy: Prisma.PeakOrderByWithRelationInput = (() => {
    switch (sort) {
      case 'elevation_desc': return { elevation: 'desc' };
      case 'elevation_asc': return { elevation: 'asc' };
      case 'name_desc': return { name: 'desc' };
      case 'name_asc':
      default: return { name: 'asc' };
    }
  })();

  const [peaks, total] = await Promise.all([
    prisma.peak.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: { _count: { select: { routes: true } } },
    }),
    prisma.peak.count({ where }),
  ]);

  return {
    data: peaks.map((p) => ({
      id: p.id,
      name: p.name,
      latitude: p.latitude,
      longitude: p.longitude,
      elevation: p.elevation,
      country: p.country,
      range: p.range,
      routeCount: p._count.routes,
      imageUrl: p.imageUrl,
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getPeakById(id: number) {
  const peak = await prisma.peak.findUnique({
    where: { id },
    include: {
      _count: { select: { routes: true } },
      routes: {
        include: { reviews: { select: { rating: true } } },
      },
      guideCompanies: {
        include: {
          guideCompany: true,
        },
      },
    },
  });

  if (!peak) throw new NotFoundError('Peak');

  const allRatings = peak.routes.flatMap((r) => r.reviews.map((rev) => rev.rating));
  const averageRating =
    allRatings.length > 0 ? allRatings.reduce((a, b) => a + b, 0) / allRatings.length : null;

  const { routes: _, _count, alternateNames, guideCompanies, ...rest } = peak;
  return {
    ...rest,
    alternateNames: alternateNames ? JSON.parse(alternateNames) : null,
    routeCount: _count.routes,
    averageRating: averageRating ? Math.round(averageRating * 10) / 10 : null,
    guideServices: guideCompanies.map((gc) => ({
      id: gc.guideCompany.id,
      name: gc.guideCompany.name,
      website: gc.guideCompany.website,
      description: gc.guideCompany.description,
      priceRange: gc.guideCompany.priceRange,
      contactEmail: gc.guideCompany.contactEmail,
      contactPhone: gc.guideCompany.contactPhone,
      location: gc.guideCompany.location,
      specialties: gc.guideCompany.specialties ? JSON.parse(gc.guideCompany.specialties) : [],
      logoUrl: gc.guideCompany.logoUrl,
      rating: gc.guideCompany.rating,
    })),
    hasGuideServices: guideCompanies.length > 0,
  };
}

export async function getPeakRoutes(peakId: number, query: unknown) {
  const peak = await prisma.peak.findUnique({ where: { id: peakId } });
  if (!peak) throw new NotFoundError('Peak');

  const routes = await prisma.route.findMany({
    where: { peakId, isPublic: true },
    include: {
      author: { select: { username: true } },
      _count: { select: { reviews: true } },
      reviews: { select: { rating: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return routes.map((r) => {
    const avgRating =
      r.reviews.length > 0
        ? Math.round((r.reviews.reduce((a, rev) => a + rev.rating, 0) / r.reviews.length) * 10) / 10
        : null;
    return {
      id: r.id,
      name: r.name,
      peakId: r.peakId,
      peakName: peak.name,
      difficulty: r.difficulty,
      gradeSystem: r.gradeSystem,
      activityType: r.activityType,
      summary: r.summary,
      imageUrl: r.imageUrl,
      elevationGain: r.elevationGain,
      estimatedTime: r.estimatedTime,
      reviewCount: r._count.reviews,
      averageRating: avgRating,
      authorUsername: r.author.username,
    };
  });
}

export async function getPeaksByBounds(query: unknown) {
  const parsed = peakBoundsSchema.safeParse(query);
  if (!parsed.success) throw new ValidationError(parsed.error.issues[0].message);

  const { north, south, east, west, limit } = parsed.data;

  const peaks = await prisma.peak.findMany({
    where: {
      latitude: { gte: south, lte: north },
      longitude: { gte: west, lte: east },
    },
    take: limit,
    orderBy: { elevation: 'desc' },
    include: { _count: { select: { routes: true } } },
  });

  return peaks.map((p) => ({
    id: p.id,
    name: p.name,
    latitude: p.latitude,
    longitude: p.longitude,
    elevation: p.elevation,
    country: p.country,
    range: p.range,
    routeCount: p._count.routes,
    imageUrl: p.imageUrl,
  }));
}

export async function getPeakRouteGeometries(peakId: number) {
  const peak = await prisma.peak.findUnique({ where: { id: peakId } });
  if (!peak) throw new NotFoundError('Peak');

  const routes = await prisma.route.findMany({
    where: { peakId, isPublic: true, geoJson: { not: null } },
    select: { id: true, name: true, difficulty: true, geoJson: true },
  });

  return routes.map((r) => ({
    id: r.id,
    name: r.name,
    difficulty: r.difficulty,
    geoJson: r.geoJson ? JSON.parse(r.geoJson) : null,
  }));
}

export async function getNearbyPeaks(query: unknown) {
  const parsed = peakNearbySchema.safeParse(query);
  if (!parsed.success) throw new ValidationError(parsed.error.issues[0].message);

  const { lat, lng, radiusKm, limit } = parsed.data;

  // Haversine distance query for PostgreSQL
  const latDelta = radiusKm / 111.0;
  const lngDelta = radiusKm / (111.0 * Math.cos((lat * Math.PI) / 180));

  const peaks = await prisma.$queryRawUnsafe<
    Array<{
      id: number;
      name: string;
      latitude: number;
      longitude: number;
      elevation: number;
      country: string | null;
      range: string | null;
      distance_km: number;
    }>
  >(
    `SELECT * FROM (
       SELECT id, name, latitude, longitude, elevation, country, "range",
         (6371 * acos(
           LEAST(1.0, cos(radians($1)) * cos(radians(latitude)) *
           cos(radians(longitude) - radians($2)) +
           sin(radians($3)) * sin(radians(latitude)))
         )) AS distance_km
       FROM "Peak"
       WHERE latitude BETWEEN $4 AND $5
         AND longitude BETWEEN $6 AND $7
     ) AS nearby
     WHERE distance_km <= $8
     ORDER BY distance_km ASC
     LIMIT $9`,
    lat, lng, lat,
    lat - latDelta, lat + latDelta,
    lng - lngDelta, lng + lngDelta,
    radiusKm, limit,
  );

  return peaks;
}
