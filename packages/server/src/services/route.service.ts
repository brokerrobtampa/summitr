import { createRouteSchema, updateRouteSchema, routeQuerySchema } from '@summit/shared';
import { prisma } from '../lib/prisma.js';
import { NotFoundError, ForbiddenError, ValidationError } from '../lib/errors.js';

export async function listRoutes(query: unknown) {
  const parsed = routeQuerySchema.safeParse(query);
  if (!parsed.success) throw new ValidationError(parsed.error.issues[0].message);

  const { page, limit, peakId, activityType, sort } = parsed.data;

  const where: Record<string, unknown> = { isPublic: true };
  if (peakId) where.peakId = peakId;
  if (activityType) where.activityType = activityType;

  const orderBy = (() => {
    switch (sort) {
      case 'oldest': return { createdAt: 'asc' as const };
      case 'rating': return { reviews: { _count: 'desc' as const } };
      default: return { createdAt: 'desc' as const };
    }
  })();

  const [routes, total] = await Promise.all([
    prisma.route.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        author: { select: { username: true } },
        peak: { select: { name: true } },
        _count: { select: { reviews: true } },
        reviews: { select: { rating: true } },
      },
    }),
    prisma.route.count({ where }),
  ]);

  return {
    data: routes.map((r) => {
      const avgRating =
        r.reviews.length > 0
          ? Math.round((r.reviews.reduce((a, rev) => a + rev.rating, 0) / r.reviews.length) * 10) / 10
          : null;
      return {
        id: r.id,
        name: r.name,
        peakId: r.peakId,
        peakName: r.peak.name,
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
    }),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

export async function getRouteById(id: number, userId?: number) {
  const route = await prisma.route.findUnique({
    where: { id },
    include: {
      author: {
        select: { id: true, username: true, displayName: true, bio: true, avatarUrl: true, location: true, experienceLevel: true, createdAt: true },
      },
      peak: { select: { name: true, elevation: true, imageUrl: true } },
      waypoints: { orderBy: { orderIndex: 'asc' } },
      _count: { select: { reviews: true } },
      reviews: { select: { rating: true } },
    },
  });

  if (!route) throw new NotFoundError('Route');

  const avgRating =
    route.reviews.length > 0
      ? Math.round((route.reviews.reduce((a, rev) => a + rev.rating, 0) / route.reviews.length) * 10) / 10
      : null;

  let isSaved = false;
  if (userId) {
    const saved = await prisma.savedRoute.findUnique({
      where: { userId_routeId: { userId, routeId: id } },
    });
    isSaved = !!saved;
  }

  const { reviews: _, _count, peak, ...rest } = route;
  return {
    ...rest,
    geoJson: rest.geoJson ? JSON.parse(rest.geoJson) : null,
    hazards: rest.hazards ? JSON.parse(rest.hazards) : null,
    peakName: peak.name,
    peakElevation: peak.elevation,
    peakImageUrl: peak.imageUrl,
    reviewCount: _count.reviews,
    averageRating: avgRating,
    isSaved,
  };
}

export async function createRoute(body: unknown, authorId: number) {
  const parsed = createRouteSchema.safeParse(body);
  if (!parsed.success) throw new ValidationError(parsed.error.issues.map((i) => i.message).join(', '));

  const { waypoints, geoJson, hazards, ...data } = parsed.data;

  const peak = await prisma.peak.findUnique({ where: { id: data.peakId } });
  if (!peak) throw new NotFoundError('Peak');

  const route = await prisma.route.create({
    data: {
      ...data,
      authorId,
      geoJson: geoJson ? JSON.stringify(geoJson) : null,
      hazards: hazards ? JSON.stringify(hazards) : null,
      waypoints: waypoints
        ? { create: waypoints }
        : undefined,
    },
    include: { waypoints: true },
  });

  return route;
}

export async function updateRoute(id: number, body: unknown, userId: number) {
  const existing = await prisma.route.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError('Route');
  if (existing.authorId !== userId) throw new ForbiddenError('You can only edit your own routes');

  const parsed = updateRouteSchema.safeParse(body);
  if (!parsed.success) throw new ValidationError(parsed.error.issues.map((i) => i.message).join(', '));

  const { waypoints, geoJson, hazards, ...data } = parsed.data;

  const route = await prisma.route.update({
    where: { id },
    data: {
      ...data,
      geoJson: geoJson !== undefined ? JSON.stringify(geoJson) : undefined,
      hazards: hazards !== undefined ? JSON.stringify(hazards) : undefined,
    },
  });

  if (waypoints) {
    await prisma.waypoint.deleteMany({ where: { routeId: id } });
    await prisma.waypoint.createMany({
      data: waypoints.map((w) => ({ ...w, routeId: id })),
    });
  }

  return route;
}

export async function deleteRoute(id: number, userId: number) {
  const existing = await prisma.route.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError('Route');
  if (existing.authorId !== userId) throw new ForbiddenError('You can only delete your own routes');

  await prisma.route.delete({ where: { id } });
}

export async function saveRoute(routeId: number, userId: number) {
  const route = await prisma.route.findUnique({ where: { id: routeId } });
  if (!route) throw new NotFoundError('Route');

  await prisma.savedRoute.upsert({
    where: { userId_routeId: { userId, routeId } },
    create: { userId, routeId },
    update: {},
  });
}

export async function unsaveRoute(routeId: number, userId: number) {
  await prisma.savedRoute.deleteMany({ where: { userId, routeId } });
}
