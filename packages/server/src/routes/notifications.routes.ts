import type { FastifyInstance } from 'fastify';
import { authenticate } from '../hooks/authenticate.js';
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllRead,
} from '../services/notification.service.js';

export async function notificationRoutes(app: FastifyInstance) {
  // GET /api/v1/notifications — paginated list
  app.get('/notifications', { preValidation: [authenticate] }, async (request, reply) => {
    const userId = (request.user as { id: number }).id;
    const { page, limit, unreadOnly } = request.query as {
      page?: string;
      limit?: string;
      unreadOnly?: string;
    };
    const result = await getNotifications(
      userId,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
      unreadOnly === 'true',
    );
    return reply.send({ success: true, ...result });
  });

  // GET /api/v1/notifications/unread-count
  app.get('/notifications/unread-count', { preValidation: [authenticate] }, async (request, reply) => {
    const userId = (request.user as { id: number }).id;
    const count = await getUnreadCount(userId);
    return reply.send({ success: true, data: { count } });
  });

  // PATCH /api/v1/notifications/:id/read — mark one as read
  app.patch('/notifications/:id/read', { preValidation: [authenticate] }, async (request, reply) => {
    const userId = (request.user as { id: number }).id;
    const { id } = request.params as { id: string };
    const result = await markAsRead(parseInt(id, 10), userId);
    if (!result) {
      return reply.status(404).send({ success: false, error: { code: 'NOT_FOUND', message: 'Notification not found' } });
    }
    return reply.send({ success: true });
  });

  // PATCH /api/v1/notifications/read-all — mark all as read
  app.patch('/notifications/read-all', { preValidation: [authenticate] }, async (request, reply) => {
    const userId = (request.user as { id: number }).id;
    await markAllRead(userId);
    return reply.send({ success: true });
  });
}
