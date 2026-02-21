import { createThreadSchema, createReplySchema } from '@summit/shared';
import { prisma } from '../lib/prisma.js';
import { createNotification } from './notification.service.js';
import { sendForumReplyEmail } from './email.service.js';
import { config } from '../config.js';
import { ValidationError, NotFoundError, ForbiddenError } from '../lib/errors.js';

// ─── CATEGORIES ─────────────────────────────────────

export async function getCategories() {
  const categories = await prisma.forumCategory.findMany({
    where: { peakId: null },
    orderBy: { sortOrder: 'asc' },
    include: {
      _count: { select: { threads: true } },
      threads: {
        orderBy: { lastActivityAt: 'desc' },
        take: 1,
        select: { lastActivityAt: true },
      },
    },
  });

  return categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    peakId: c.peakId,
    sortOrder: c.sortOrder,
    threadCount: c._count.threads,
    lastActivity: c.threads[0]?.lastActivityAt?.toISOString() ?? null,
    createdAt: c.createdAt.toISOString(),
  }));
}

export async function getCategoryBySlug(slug: string) {
  const category = await prisma.forumCategory.findUnique({
    where: { slug },
    include: {
      _count: { select: { threads: true } },
      threads: {
        orderBy: { lastActivityAt: 'desc' },
        take: 1,
        select: { lastActivityAt: true },
      },
    },
  });
  if (!category) throw new NotFoundError('Forum category');

  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    peakId: category.peakId,
    sortOrder: category.sortOrder,
    threadCount: category._count.threads,
    lastActivity: category.threads[0]?.lastActivityAt?.toISOString() ?? null,
    createdAt: category.createdAt.toISOString(),
  };
}

export async function getPeakCategory(peakId: number) {
  const peak = await prisma.peak.findUnique({ where: { id: peakId } });
  if (!peak) throw new NotFoundError('Peak');

  let category = await prisma.forumCategory.findFirst({
    where: { peakId },
    include: {
      _count: { select: { threads: true } },
      threads: {
        orderBy: { lastActivityAt: 'desc' },
        take: 1,
        select: { lastActivityAt: true },
      },
    },
  });

  if (!category) {
    const slug = `peak-${peakId}-${peak.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '')}`;
    const created = await prisma.forumCategory.create({
      data: {
        name: peak.name,
        slug,
        description: `Discussion about ${peak.name}`,
        peakId,
        sortOrder: 0,
      },
      include: {
        _count: { select: { threads: true } },
        threads: {
          orderBy: { lastActivityAt: 'desc' },
          take: 1,
          select: { lastActivityAt: true },
        },
      },
    });
    category = created;
  }

  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    peakId: category.peakId,
    sortOrder: category.sortOrder,
    threadCount: category._count.threads,
    lastActivity: category.threads[0]?.lastActivityAt?.toISOString() ?? null,
    createdAt: category.createdAt.toISOString(),
  };
}

// ─── THREADS ────────────────────────────────────────

export async function getThreads(categoryId: number, page = 1, limit = 20) {
  const skip = (page - 1) * limit;

  const [threads, total] = await Promise.all([
    prisma.forumThread.findMany({
      where: { categoryId },
      include: {
        author: {
          select: { id: true, username: true, displayName: true, avatarUrl: true },
        },
      },
      orderBy: [{ isPinned: 'desc' }, { lastActivityAt: 'desc' }],
      skip,
      take: limit,
    }),
    prisma.forumThread.count({ where: { categoryId } }),
  ]);

  return {
    data: threads.map((t) => ({
      id: t.id,
      categoryId: t.categoryId,
      title: t.title,
      author: t.author,
      replyCount: t.replyCount,
      isPinned: t.isPinned,
      isLocked: t.isLocked,
      lastActivityAt: t.lastActivityAt.toISOString(),
      createdAt: t.createdAt.toISOString(),
    })),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

export async function getThread(threadId: number) {
  const thread = await prisma.forumThread.findUnique({
    where: { id: threadId },
    include: {
      author: {
        select: { id: true, username: true, displayName: true, avatarUrl: true },
      },
      category: {
        select: { id: true, name: true, slug: true },
      },
    },
  });
  if (!thread) throw new NotFoundError('Forum thread');

  return {
    id: thread.id,
    categoryId: thread.categoryId,
    category: thread.category,
    author: thread.author,
    title: thread.title,
    body: thread.body,
    isPinned: thread.isPinned,
    isLocked: thread.isLocked,
    replyCount: thread.replyCount,
    lastActivityAt: thread.lastActivityAt.toISOString(),
    createdAt: thread.createdAt.toISOString(),
    updatedAt: thread.updatedAt.toISOString(),
  };
}

export async function createThread(categoryId: number, authorId: number, body: unknown) {
  const parsed = createThreadSchema.safeParse(body);
  if (!parsed.success) {
    throw new ValidationError(parsed.error.issues.map((i) => i.message).join(', '));
  }

  const category = await prisma.forumCategory.findUnique({ where: { id: categoryId } });
  if (!category) throw new NotFoundError('Forum category');

  const thread = await prisma.forumThread.create({
    data: {
      categoryId,
      authorId,
      title: parsed.data.title,
      body: parsed.data.body,
    },
    include: {
      author: {
        select: { id: true, username: true, displayName: true, avatarUrl: true },
      },
      category: {
        select: { id: true, name: true, slug: true },
      },
    },
  });

  return {
    id: thread.id,
    categoryId: thread.categoryId,
    category: thread.category,
    author: thread.author,
    title: thread.title,
    body: thread.body,
    isPinned: thread.isPinned,
    isLocked: thread.isLocked,
    replyCount: thread.replyCount,
    lastActivityAt: thread.lastActivityAt.toISOString(),
    createdAt: thread.createdAt.toISOString(),
    updatedAt: thread.updatedAt.toISOString(),
  };
}

// ─── REPLIES ────────────────────────────────────────

export async function getReplies(threadId: number, page = 1, limit = 20) {
  const skip = (page - 1) * limit;

  const [replies, total] = await Promise.all([
    prisma.forumReply.findMany({
      where: { threadId },
      include: {
        author: {
          select: { id: true, username: true, displayName: true, avatarUrl: true },
        },
      },
      orderBy: { createdAt: 'asc' },
      skip,
      take: limit,
    }),
    prisma.forumReply.count({ where: { threadId } }),
  ]);

  return {
    data: replies.map((r) => ({
      id: r.id,
      threadId: r.threadId,
      author: r.author,
      parentReplyId: r.parentReplyId,
      body: r.body,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    })),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

export async function createReply(threadId: number, authorId: number, body: unknown) {
  const parsed = createReplySchema.safeParse(body);
  if (!parsed.success) {
    throw new ValidationError(parsed.error.issues.map((i) => i.message).join(', '));
  }

  const thread = await prisma.forumThread.findUnique({
    where: { id: threadId },
    include: {
      author: { select: { id: true, email: true, username: true, displayName: true } },
      category: { select: { slug: true } },
    },
  });
  if (!thread) throw new NotFoundError('Forum thread');
  if (thread.isLocked) throw new ForbiddenError('Thread is locked');

  // Validate parentReplyId if provided
  if (parsed.data.parentReplyId) {
    const parentReply = await prisma.forumReply.findFirst({
      where: { id: parsed.data.parentReplyId, threadId },
    });
    if (!parentReply) throw new NotFoundError('Parent reply');
  }

  const reply = await prisma.forumReply.create({
    data: {
      threadId,
      authorId,
      body: parsed.data.body,
      parentReplyId: parsed.data.parentReplyId ?? null,
    },
    include: {
      author: {
        select: { id: true, username: true, displayName: true, avatarUrl: true },
      },
    },
  });

  // Update thread reply count and last activity
  await prisma.forumThread.update({
    where: { id: threadId },
    data: {
      replyCount: { increment: 1 },
      lastActivityAt: new Date(),
    },
  });

  // Notify thread author (in-app + email), fire-and-forget
  if (thread.author.id !== authorId) {
    const actorName = reply.author.displayName || reply.author.username;
    const threadUrl = `${config.appUrl}/forums/threads/${threadId}`;

    createNotification({
      recipientId: thread.author.id,
      actorId: authorId,
      type: 'forum_reply',
      entityType: 'forumThread',
      entityId: threadId,
      title: `${actorName} replied to "${thread.title}"`,
      body: parsed.data.body.length > 100 ? parsed.data.body.slice(0, 100) + '...' : parsed.data.body,
    }).catch(() => {});

    sendForumReplyEmail(
      thread.author.email,
      thread.author.displayName || thread.author.username,
      thread.title,
      actorName,
      parsed.data.body.length > 200 ? parsed.data.body.slice(0, 200) + '...' : parsed.data.body,
      threadUrl,
    ).catch(() => {});
  }

  return {
    id: reply.id,
    threadId: reply.threadId,
    author: reply.author,
    parentReplyId: reply.parentReplyId,
    body: reply.body,
    createdAt: reply.createdAt.toISOString(),
    updatedAt: reply.updatedAt.toISOString(),
  };
}
