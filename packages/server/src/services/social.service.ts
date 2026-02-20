import { prisma } from '../lib/prisma.js';

export async function followUser(followerId: number, followingId: number) {
  if (followerId === followingId) throw new Error('Cannot follow yourself');
  return prisma.userFollow.create({
    data: { followerId, followingId },
  });
}

export async function unfollowUser(followerId: number, followingId: number) {
  return prisma.userFollow.deleteMany({
    where: { followerId, followingId },
  });
}

export async function isFollowing(followerId: number, followingId: number): Promise<boolean> {
  const follow = await prisma.userFollow.findUnique({
    where: { followerId_followingId: { followerId, followingId } },
  });
  return !!follow;
}

export async function getFollowers(userId: number, page = 1, limit = 20) {
  const [follows, total] = await Promise.all([
    prisma.userFollow.findMany({
      where: { followingId: userId },
      include: {
        follower: {
          select: { id: true, username: true, displayName: true, avatarUrl: true, bio: true, location: true, experienceLevel: true, createdAt: true },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.userFollow.count({ where: { followingId: userId } }),
  ]);
  return {
    data: follows.map((f) => ({ ...f.follower, createdAt: f.follower.createdAt.toISOString() })),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

export async function getFollowing(userId: number, page = 1, limit = 20) {
  const [follows, total] = await Promise.all([
    prisma.userFollow.findMany({
      where: { followerId: userId },
      include: {
        following: {
          select: { id: true, username: true, displayName: true, avatarUrl: true, bio: true, location: true, experienceLevel: true, createdAt: true },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.userFollow.count({ where: { followerId: userId } }),
  ]);
  return {
    data: follows.map((f) => ({ ...f.following, createdAt: f.following.createdAt.toISOString() })),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

export async function getActivityFeed(userId: number, page = 1, limit = 20) {
  const skip = (page - 1) * limit;

  // Get followed user IDs
  const following = await prisma.userFollow.findMany({
    where: { followerId: userId },
    select: { followingId: true },
  });
  const followedIds = following.map((f) => f.followingId);
  if (followedIds.length === 0) return [];

  // Fetch recent climbs, reviews, routes from followed users in parallel
  const [climbs, reviews, routes] = await Promise.all([
    prisma.climbLog.findMany({
      where: { userId: { in: followedIds }, isPublic: true },
      include: {
        user: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
        peak: { select: { id: true, name: true, elevation: true } },
        route: { select: { id: true, name: true } },
        _count: { select: { comments: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: limit * 2,
    }),
    prisma.review.findMany({
      where: { authorId: { in: followedIds } },
      include: {
        author: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
        route: { select: { id: true, name: true, peak: { select: { name: true } } } },
      },
      orderBy: { createdAt: 'desc' },
      take: limit * 2,
    }),
    prisma.route.findMany({
      where: { authorId: { in: followedIds } },
      include: {
        author: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
        peak: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: limit * 2,
    }),
  ]);

  // Merge and sort
  const items: any[] = [];

  for (const c of climbs) {
    items.push({
      id: `climb-${c.id}`,
      type: 'climb',
      userId: c.user.id,
      username: c.user.username,
      displayName: c.user.displayName,
      avatarUrl: c.user.avatarUrl,
      timestamp: c.createdAt.toISOString(),
      climbLog: {
        id: c.id,
        peakName: c.peak.name,
        peakId: c.peak.id,
        routeName: c.route?.name || null,
        routeId: c.route?.id || null,
        success: c.success,
        photos: c.photos ? JSON.parse(c.photos) : null,
        notes: c.notes,
        elevation: c.peak.elevation,
        commentCount: c._count.comments,
        date: c.date.toISOString(),
      },
    });
  }

  for (const r of reviews) {
    items.push({
      id: `review-${r.id}`,
      type: 'review',
      userId: r.author.id,
      username: r.author.username,
      displayName: r.author.displayName,
      avatarUrl: r.author.avatarUrl,
      timestamp: r.createdAt.toISOString(),
      review: {
        id: r.id,
        routeId: r.route.id,
        routeName: r.route.name,
        peakName: r.route.peak.name,
        rating: r.rating,
        title: r.title,
        snippet: r.body.slice(0, 200),
      },
    });
  }

  for (const rt of routes) {
    items.push({
      id: `route-${rt.id}`,
      type: 'route',
      userId: rt.author.id,
      username: rt.author.username,
      displayName: rt.author.displayName,
      avatarUrl: rt.author.avatarUrl,
      timestamp: rt.createdAt.toISOString(),
      route: {
        id: rt.id,
        name: rt.name,
        peakName: rt.peak.name,
        difficulty: rt.difficulty,
        summary: rt.summary,
      },
    });
  }

  // Sort by timestamp descending
  items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return items.slice(skip, skip + limit);
}

export async function getDiscoverFeed(page = 1, limit = 20) {
  const skip = (page - 1) * limit;

  const [climbs, reviews, routes] = await Promise.all([
    prisma.climbLog.findMany({
      where: { isPublic: true },
      include: {
        user: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
        peak: { select: { id: true, name: true, elevation: true } },
        route: { select: { id: true, name: true } },
        _count: { select: { comments: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: limit * 2,
    }),
    prisma.review.findMany({
      include: {
        author: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
        route: { select: { id: true, name: true, peak: { select: { name: true } } } },
      },
      orderBy: { createdAt: 'desc' },
      take: limit * 2,
    }),
    prisma.route.findMany({
      include: {
        author: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
        peak: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: limit * 2,
    }),
  ]);

  const items: any[] = [];

  for (const c of climbs) {
    items.push({
      id: `climb-${c.id}`,
      type: 'climb',
      userId: c.user.id,
      username: c.user.username,
      displayName: c.user.displayName,
      avatarUrl: c.user.avatarUrl,
      timestamp: c.createdAt.toISOString(),
      climbLog: {
        id: c.id,
        peakName: c.peak.name,
        peakId: c.peak.id,
        routeName: c.route?.name || null,
        routeId: c.route?.id || null,
        success: c.success,
        photos: c.photos ? JSON.parse(c.photos) : null,
        notes: c.notes,
        elevation: c.peak.elevation,
        commentCount: c._count.comments,
        date: c.date.toISOString(),
      },
    });
  }

  for (const r of reviews) {
    items.push({
      id: `review-${r.id}`,
      type: 'review',
      userId: r.author.id,
      username: r.author.username,
      displayName: r.author.displayName,
      avatarUrl: r.author.avatarUrl,
      timestamp: r.createdAt.toISOString(),
      review: {
        id: r.id,
        routeId: r.route.id,
        routeName: r.route.name,
        peakName: r.route.peak.name,
        rating: r.rating,
        title: r.title,
        snippet: r.body.slice(0, 200),
      },
    });
  }

  for (const rt of routes) {
    items.push({
      id: `route-${rt.id}`,
      type: 'route',
      userId: rt.author.id,
      username: rt.author.username,
      displayName: rt.author.displayName,
      avatarUrl: rt.author.avatarUrl,
      timestamp: rt.createdAt.toISOString(),
      route: {
        id: rt.id,
        name: rt.name,
        peakName: rt.peak.name,
        difficulty: rt.difficulty,
        summary: rt.summary,
      },
    });
  }

  items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  return items.slice(skip, skip + limit);
}

export async function addComment(climbLogId: number, authorId: number, body: string) {
  return prisma.comment.create({
    data: { climbLogId, authorId, body },
    include: {
      author: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
    },
  });
}

export async function getComments(climbLogId: number, page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  return prisma.comment.findMany({
    where: { climbLogId },
    include: {
      author: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
    },
    orderBy: { createdAt: 'desc' },
    skip,
    take: limit,
  });
}

export async function deleteComment(commentId: number, userId: number) {
  const comment = await prisma.comment.findUnique({ where: { id: commentId } });
  if (!comment || comment.authorId !== userId) throw new Error('Not authorized');
  return prisma.comment.delete({ where: { id: commentId } });
}
