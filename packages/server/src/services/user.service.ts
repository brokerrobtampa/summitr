import { updateProfileSchema, createClimbLogSchema, updateClimbLogSchema } from '@summit/shared';
import { prisma } from '../lib/prisma.js';
import { NotFoundError, ForbiddenError, ValidationError } from '../lib/errors.js';

export async function getPublicProfile(username: string) {
  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      displayName: true,
      bio: true,
      avatarUrl: true,
      location: true,
      experienceLevel: true,
      createdAt: true,
      _count: { select: { routes: true, climbLogs: true, reviews: true, followers: true, following: true } },
    },
  });

  if (!user) throw new NotFoundError('User');

  const { _count, ...rest } = user;
  return {
    ...rest,
    routeCount: _count.routes,
    climbCount: _count.climbLogs,
    reviewCount: _count.reviews,
    followersCount: _count.followers,
    followingCount: _count.following,
  };
}

export async function updateProfile(userId: number, body: unknown) {
  const parsed = updateProfileSchema.safeParse(body);
  if (!parsed.success) throw new ValidationError(parsed.error.issues.map((i) => i.message).join(', '));

  const { climbingStyles, socialLinks, ...rest } = parsed.data;

  return prisma.user.update({
    where: { id: userId },
    data: {
      ...rest,
      climbingStyles: climbingStyles !== undefined ? JSON.stringify(climbingStyles) : undefined,
      socialLinks: socialLinks !== undefined ? JSON.stringify(socialLinks) : undefined,
    },
    select: {
      id: true,
      email: true,
      username: true,
      displayName: true,
      bio: true,
      avatarUrl: true,
      location: true,
      experienceLevel: true,
      climbingStyles: true,
      socialLinks: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function getClimbLogs(userId: number, page = 1, limit = 20) {
  const [logs, total] = await Promise.all([
    prisma.climbLog.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        peak: { select: { name: true, elevation: true } },
        route: { select: { name: true } },
      },
    }),
    prisma.climbLog.count({ where: { userId } }),
  ]);

  return {
    data: logs.map((l) => ({
      id: l.id,
      userId: l.userId,
      peakId: l.peakId,
      routeId: l.routeId,
      date: l.date.toISOString(),
      notes: l.notes,
      conditions: l.conditions,
      success: l.success,
      duration: l.duration,
      photos: l.photos ? JSON.parse(l.photos) : null,
      rating: l.rating,
      isPublic: l.isPublic,
      elevationGain: l.elevationGain,
      createdAt: l.createdAt.toISOString(),
      peakName: l.peak.name,
      peakElevation: l.peak.elevation,
      routeName: l.route?.name ?? null,
    })),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

export async function getPublicClimbLogs(userId: number, page = 1, limit = 20) {
  const [logs, total] = await Promise.all([
    prisma.climbLog.findMany({
      where: { userId, isPublic: true },
      orderBy: { date: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        peak: { select: { name: true, elevation: true } },
        route: { select: { name: true } },
      },
    }),
    prisma.climbLog.count({ where: { userId, isPublic: true } }),
  ]);

  return {
    data: logs.map((l) => ({
      id: l.id,
      userId: l.userId,
      peakId: l.peakId,
      routeId: l.routeId,
      date: l.date.toISOString(),
      notes: l.notes,
      conditions: l.conditions,
      success: l.success,
      duration: l.duration,
      photos: l.photos ? JSON.parse(l.photos) : null,
      rating: l.rating,
      isPublic: l.isPublic,
      elevationGain: l.elevationGain,
      createdAt: l.createdAt.toISOString(),
      peakName: l.peak.name,
      peakElevation: l.peak.elevation,
      routeName: l.route?.name ?? null,
    })),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

export async function createClimbLog(userId: number, body: unknown) {
  const parsed = createClimbLogSchema.safeParse(body);
  if (!parsed.success) throw new ValidationError(parsed.error.issues.map((i) => i.message).join(', '));

  const peak = await prisma.peak.findUnique({ where: { id: parsed.data.peakId } });
  if (!peak) throw new NotFoundError('Peak');

  if (parsed.data.routeId) {
    const route = await prisma.route.findUnique({ where: { id: parsed.data.routeId } });
    if (!route) throw new NotFoundError('Route');
  }

  const { photos, ...rest } = parsed.data;

  return prisma.climbLog.create({
    data: {
      ...rest,
      date: new Date(rest.date),
      photos: photos ? JSON.stringify(photos) : null,
      userId,
    },
    include: {
      peak: { select: { name: true, elevation: true } },
      route: { select: { name: true } },
    },
  });
}

export async function updateClimbLog(id: number, userId: number, body: unknown) {
  const existing = await prisma.climbLog.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError('Climb log');
  if (existing.userId !== userId) throw new ForbiddenError('You can only edit your own climb logs');

  const parsed = updateClimbLogSchema.safeParse(body);
  if (!parsed.success) throw new ValidationError(parsed.error.issues.map((i) => i.message).join(', '));

  const { photos, date, ...rest } = parsed.data;

  return prisma.climbLog.update({
    where: { id },
    data: {
      ...rest,
      date: date ? new Date(date) : undefined,
      photos: photos !== undefined ? JSON.stringify(photos) : undefined,
    },
    include: {
      peak: { select: { name: true, elevation: true } },
      route: { select: { name: true } },
    },
  });
}

export async function deleteClimbLog(id: number, userId: number) {
  const existing = await prisma.climbLog.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError('Climb log');
  if (existing.userId !== userId) throw new NotFoundError('Climb log');

  await prisma.climbLog.delete({ where: { id } });
}

export async function getSavedRoutes(userId: number) {
  const saved = await prisma.savedRoute.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      route: {
        include: {
          peak: { select: { name: true } },
          author: { select: { username: true } },
          _count: { select: { reviews: true } },
        },
      },
    },
  });

  return saved.map((s) => ({
    id: s.route.id,
    name: s.route.name,
    peakId: s.route.peakId,
    peakName: s.route.peak.name,
    difficulty: s.route.difficulty,
    gradeSystem: s.route.gradeSystem,
    activityType: s.route.activityType,
    summary: s.route.summary,
    imageUrl: s.route.imageUrl,
    elevationGain: s.route.elevationGain,
    estimatedTime: s.route.estimatedTime,
    reviewCount: s.route._count.reviews,
    averageRating: null,
    authorUsername: s.route.author.username,
    savedAt: s.createdAt.toISOString(),
  }));
}

export async function getUserStats(userId: number) {
  const climbLogs = await prisma.climbLog.findMany({
    where: { userId, success: true },
    include: {
      peak: { select: { elevation: true, name: true } },
      route: { select: { elevationGain: true } },
    },
  });

  const uniquePeakIds = new Set(climbLogs.map((l) => l.peakId));
  const totalElevationGain = climbLogs.reduce((sum, l) => {
    return sum + (l.elevationGain ?? l.route?.elevationGain ?? 0);
  }, 0);

  // Find highest peak
  let highestPeak: { name: string; elevation: number } | null = null;
  for (const log of climbLogs) {
    if (!highestPeak || log.peak.elevation > highestPeak.elevation) {
      highestPeak = { name: log.peak.name, elevation: log.peak.elevation };
    }
  }

  const climbsByYear: Record<number, number> = {};
  const elevationByYear: Record<number, number> = {};
  for (const log of climbLogs) {
    const year = log.date.getFullYear();
    climbsByYear[year] = (climbsByYear[year] || 0) + 1;
    elevationByYear[year] = (elevationByYear[year] || 0) + (log.elevationGain ?? log.route?.elevationGain ?? 0);
  }

  return {
    totalPeaks: uniquePeakIds.size,
    totalClimbs: climbLogs.length,
    totalElevationGain: Math.round(totalElevationGain),
    highestPeak,
    climbsByYear,
    elevationByYear,
  };
}
