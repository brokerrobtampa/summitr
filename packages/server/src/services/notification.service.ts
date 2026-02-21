import { prisma } from '../lib/prisma.js';
import { wsManager } from '../lib/ws-manager.js';
import type { NotificationType } from '@summit/shared';

interface CreateNotificationData {
  recipientId: number;
  actorId?: number;
  type: NotificationType;
  entityType?: string;
  entityId?: number;
  title: string;
  body?: string;
  metadata?: Record<string, unknown>;
}

export async function createNotification(data: CreateNotificationData) {
  // Don't notify yourself
  if (data.actorId && data.actorId === data.recipientId) return null;

  const notification = await prisma.notification.create({
    data: {
      recipientId: data.recipientId,
      actorId: data.actorId ?? null,
      type: data.type,
      entityType: data.entityType ?? null,
      entityId: data.entityId ?? null,
      title: data.title,
      body: data.body ?? null,
      metadata: data.metadata ? JSON.stringify(data.metadata) : null,
    },
    include: {
      actor: {
        select: { id: true, username: true, displayName: true, avatarUrl: true },
      },
    },
  });

  // Push real-time via WebSocket
  wsManager.sendToUser(data.recipientId, {
    type: 'notification',
    payload: formatNotification(notification),
    timestamp: new Date().toISOString(),
  });

  return notification;
}

export async function getNotifications(
  userId: number,
  page = 1,
  limit = 20,
  unreadOnly = false,
) {
  const where: any = { recipientId: userId };
  if (unreadOnly) where.isRead = false;

  const [data, total] = await Promise.all([
    prisma.notification.findMany({
      where,
      include: {
        actor: {
          select: { id: true, username: true, displayName: true, avatarUrl: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.notification.count({ where }),
  ]);

  return {
    data: data.map(formatNotification),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getUnreadCount(userId: number): Promise<number> {
  return prisma.notification.count({
    where: { recipientId: userId, isRead: false },
  });
}

export async function markAsRead(notificationId: number, userId: number) {
  const notification = await prisma.notification.findFirst({
    where: { id: notificationId, recipientId: userId },
  });
  if (!notification) return null;

  return prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true, readAt: new Date() },
  });
}

export async function markAllRead(userId: number) {
  return prisma.notification.updateMany({
    where: { recipientId: userId, isRead: false },
    data: { isRead: true, readAt: new Date() },
  });
}

function formatNotification(n: any) {
  return {
    id: n.id,
    recipientId: n.recipientId,
    actorId: n.actorId,
    actor: n.actor ?? null,
    type: n.type,
    entityType: n.entityType,
    entityId: n.entityId,
    title: n.title,
    body: n.body,
    isRead: n.isRead,
    readAt: n.readAt?.toISOString() ?? null,
    metadata: n.metadata ? JSON.parse(n.metadata) : null,
    createdAt: n.createdAt.toISOString(),
  };
}
