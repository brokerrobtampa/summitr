import { prisma } from '../lib/prisma.js';

export async function globalSearch(q: string, type: string = 'all', page = 1, limit = 20) {
  const searchTerm = `%${q}%`;

  const results: { peaks: unknown[]; routes: unknown[]; reviews: unknown[]; users: unknown[] } = {
    peaks: [],
    routes: [],
    reviews: [],
    users: [],
  };

  if (type === 'all' || type === 'peak') {
    results.peaks = await prisma.peak.findMany({
      where: {
        OR: [
          { name: { contains: q } },
          { country: { contains: q } },
          { range: { contains: q } },
          { region: { contains: q } },
        ],
      },
      take: limit,
      orderBy: { elevation: 'desc' },
      include: { _count: { select: { routes: true } } },
    }).then((peaks) =>
      peaks.map((p) => ({
        id: p.id,
        name: p.name,
        latitude: p.latitude,
        longitude: p.longitude,
        elevation: p.elevation,
        country: p.country,
        range: p.range,
        routeCount: p._count.routes,
      })),
    );
  }

  if (type === 'all' || type === 'route') {
    results.routes = await prisma.route.findMany({
      where: {
        isPublic: true,
        OR: [
          { name: { contains: q } },
          { description: { contains: q } },
        ],
      },
      take: limit,
      include: {
        peak: { select: { name: true } },
        author: { select: { username: true } },
        _count: { select: { reviews: true } },
      },
    }).then((routes) =>
      routes.map((r) => ({
        id: r.id,
        name: r.name,
        peakId: r.peakId,
        peakName: r.peak.name,
        difficulty: r.difficulty,
        gradeSystem: r.gradeSystem,
        activityType: r.activityType,
        elevationGain: r.elevationGain,
        estimatedTime: r.estimatedTime,
        reviewCount: r._count.reviews,
        averageRating: null,
        authorUsername: r.author.username,
      })),
    );
  }

  if (type === 'all' || type === 'review') {
    results.reviews = await prisma.review.findMany({
      where: {
        OR: [
          { body: { contains: q } },
          { title: { contains: q } },
        ],
      },
      take: limit,
      include: {
        route: {
          select: { name: true, peak: { select: { name: true } } },
        },
        author: { select: { username: true } },
      },
    }).then((reviews) =>
      reviews.map((r) => ({
        id: r.id,
        routeId: r.routeId,
        routeName: r.route.name,
        peakName: r.route.peak.name,
        snippet: r.body.substring(0, 200),
        rating: r.rating,
        authorUsername: r.author.username,
      })),
    );
  }

  if (type === 'all' || type === 'user') {
    results.users = await prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: q } },
          { displayName: { contains: q } },
        ],
      },
      take: limit,
      select: {
        id: true,
        username: true,
        displayName: true,
        avatarUrl: true,
        bio: true,
        location: true,
        experienceLevel: true,
        _count: { select: { routes: true, climbLogs: true, reviews: true } },
      },
    }).then((users) =>
      users.map((u) => ({
        id: u.id,
        username: u.username,
        displayName: u.displayName,
        avatarUrl: u.avatarUrl,
        bio: u.bio,
        location: u.location,
        experienceLevel: u.experienceLevel,
        routeCount: u._count.routes,
        climbCount: u._count.climbLogs,
        reviewCount: u._count.reviews,
      })),
    );
  }

  return results;
}

export async function autocomplete(q: string, limit = 10) {
  const [peaks, routes] = await Promise.all([
    prisma.peak.findMany({
      where: { name: { contains: q } },
      take: Math.ceil(limit / 2),
      orderBy: { elevation: 'desc' },
      select: { id: true, name: true, country: true, elevation: true },
    }),
    prisma.route.findMany({
      where: { isPublic: true, name: { contains: q } },
      take: Math.floor(limit / 2),
      include: { peak: { select: { name: true } } },
    }),
  ]);

  return [
    ...peaks.map((p) => ({
      type: 'peak' as const,
      id: p.id,
      name: p.name,
      subtitle: `${p.elevation}m — ${p.country ?? 'Unknown'}`,
    })),
    ...routes.map((r) => ({
      type: 'route' as const,
      id: r.id,
      name: r.name,
      subtitle: r.peak.name,
    })),
  ];
}
