import {
  createReviewSchema,
  updateReviewSchema,
  createTipSchema,
  createGearRecSchema,
  updateGearRecSchema,
} from '@summit/shared';
import { prisma } from '../lib/prisma.js';
import { NotFoundError, ForbiddenError, ValidationError } from '../lib/errors.js';

const authorSelect = {
  id: true, username: true, displayName: true, bio: true, avatarUrl: true, location: true, experienceLevel: true, createdAt: true,
};

// ─── REVIEWS ────────────────────────────────────────────

export async function getReviewsForRoute(routeId: number, page = 1, limit = 20) {
  const route = await prisma.route.findUnique({ where: { id: routeId } });
  if (!route) throw new NotFoundError('Route');

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where: { routeId },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: { author: { select: authorSelect } },
    }),
    prisma.review.count({ where: { routeId } }),
  ]);

  return {
    data: reviews,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

export async function createReview(routeId: number, body: unknown, authorId: number) {
  const parsed = createReviewSchema.safeParse(body);
  if (!parsed.success) throw new ValidationError(parsed.error.issues.map((i) => i.message).join(', '));

  const route = await prisma.route.findUnique({ where: { id: routeId } });
  if (!route) throw new NotFoundError('Route');

  return prisma.review.create({
    data: { ...parsed.data, routeId, authorId },
    include: { author: { select: authorSelect } },
  });
}

export async function updateReview(id: number, body: unknown, userId: number) {
  const existing = await prisma.review.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError('Review');
  if (existing.authorId !== userId) throw new ForbiddenError('You can only edit your own reviews');

  const parsed = updateReviewSchema.safeParse(body);
  if (!parsed.success) throw new ValidationError(parsed.error.issues.map((i) => i.message).join(', '));

  return prisma.review.update({ where: { id }, data: parsed.data });
}

export async function deleteReview(id: number, userId: number) {
  const existing = await prisma.review.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError('Review');
  if (existing.authorId !== userId) throw new ForbiddenError('You can only delete your own reviews');

  await prisma.review.delete({ where: { id } });
}

// ─── TIPS ───────────────────────────────────────────────

export async function getTipsForRoute(routeId: number) {
  const route = await prisma.route.findUnique({ where: { id: routeId } });
  if (!route) throw new NotFoundError('Route');

  return prisma.tip.findMany({
    where: { routeId },
    orderBy: { createdAt: 'desc' },
    include: { author: { select: authorSelect } },
  });
}

export async function createTip(routeId: number, body: unknown, authorId: number) {
  const parsed = createTipSchema.safeParse(body);
  if (!parsed.success) throw new ValidationError(parsed.error.issues.map((i) => i.message).join(', '));

  const route = await prisma.route.findUnique({ where: { id: routeId } });
  if (!route) throw new NotFoundError('Route');

  return prisma.tip.create({
    data: { ...parsed.data, routeId, authorId },
    include: { author: { select: authorSelect } },
  });
}

export async function deleteTip(id: number, userId: number) {
  const existing = await prisma.tip.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError('Tip');
  if (existing.authorId !== userId) throw new ForbiddenError('You can only delete your own tips');

  await prisma.tip.delete({ where: { id } });
}

// ─── GEAR RECOMMENDATIONS ───────────────────────────────

export async function getGearForRoute(routeId: number) {
  const route = await prisma.route.findUnique({ where: { id: routeId } });
  if (!route) throw new NotFoundError('Route');

  return prisma.gearRecommendation.findMany({
    where: { routeId },
    orderBy: [{ isEssential: 'desc' }, { category: 'asc' }],
    include: {
      author: { select: authorSelect },
      links: { orderBy: { price: 'asc' } },
    },
  });
}

export async function createGearRec(routeId: number, body: unknown, authorId: number) {
  const parsed = createGearRecSchema.safeParse(body);
  if (!parsed.success) throw new ValidationError(parsed.error.issues.map((i) => i.message).join(', '));

  const route = await prisma.route.findUnique({ where: { id: routeId } });
  if (!route) throw new NotFoundError('Route');

  const { links, ...gearData } = parsed.data;

  return prisma.gearRecommendation.create({
    data: {
      ...gearData,
      routeId,
      authorId,
      links: links ? { create: links } : undefined,
    },
    include: {
      author: { select: authorSelect },
      links: { orderBy: { price: 'asc' } },
    },
  });
}

export async function updateGearRec(id: number, body: unknown, userId: number) {
  const existing = await prisma.gearRecommendation.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError('Gear recommendation');
  if (existing.authorId !== userId) throw new ForbiddenError('You can only edit your own gear recommendations');

  const parsed = updateGearRecSchema.safeParse(body);
  if (!parsed.success) throw new ValidationError(parsed.error.issues.map((i) => i.message).join(', '));

  const { links, ...gearData } = parsed.data;

  await prisma.gearRecommendation.update({
    where: { id },
    data: gearData,
  });

  if (links) {
    await prisma.gearLink.deleteMany({ where: { gearId: id } });
    await prisma.gearLink.createMany({
      data: links.map((l) => ({ ...l, gearId: id })),
    });
  }

  return prisma.gearRecommendation.findUnique({
    where: { id },
    include: {
      author: { select: authorSelect },
      links: { orderBy: { price: 'asc' } },
    },
  });
}

export async function deleteGearRec(id: number, userId: number) {
  const existing = await prisma.gearRecommendation.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError('Gear recommendation');
  if (existing.authorId !== userId) throw new ForbiddenError('You can only delete your own gear recommendations');

  await prisma.gearRecommendation.delete({ where: { id } });
}
