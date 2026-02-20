import type { FastifyInstance } from 'fastify';
import {
  getPublicProfile,
  updateProfile,
  getClimbLogs,
  getPublicClimbLogs,
  createClimbLog,
  updateClimbLog,
  deleteClimbLog,
  getSavedRoutes,
  getUserStats,
} from '../services/user.service.js';
import { isFollowing } from '../services/social.service.js';
import { authenticate, optionalAuth } from '../hooks/authenticate.js';
import { AppError } from '../lib/errors.js';

export async function userRoutes(app: FastifyInstance) {
  app.get('/users/:username', { preValidation: [optionalAuth] }, async (request, reply) => {
    try {
      const { username } = request.params as { username: string };
      const data = await getPublicProfile(username);
      const currentUserId = (request.user as { id: number } | undefined)?.id;
      let following = false;
      if (currentUserId && currentUserId !== data.id) {
        following = await isFollowing(currentUserId, data.id);
      }
      return reply.send({ success: true, data: { ...data, isFollowing: following } });
    } catch (err) {
      if (err instanceof AppError) {
        return reply.status(err.statusCode).send({ success: false, error: { code: err.code, message: err.message } });
      }
      throw err;
    }
  });

  // GET /api/v1/users/:username/climbs — public climb logs for a user
  app.get('/users/:username/climbs', async (request, reply) => {
    try {
      const { username } = request.params as { username: string };
      const { page, limit } = request.query as { page?: string; limit?: string };
      const profile = await getPublicProfile(username);
      const result = await getPublicClimbLogs(
        profile.id,
        page ? parseInt(page, 10) : 1,
        limit ? parseInt(limit, 10) : 20,
      );
      return reply.send({ success: true, ...result });
    } catch (err) {
      if (err instanceof AppError) {
        return reply.status(err.statusCode).send({ success: false, error: { code: err.code, message: err.message } });
      }
      throw err;
    }
  });

  app.put('/users/me', { preValidation: [authenticate] }, async (request, reply) => {
    try {
      const userId = (request.user as { id: number }).id;
      const data = await updateProfile(userId, request.body);
      return reply.send({ success: true, data });
    } catch (err) {
      if (err instanceof AppError) {
        return reply.status(err.statusCode).send({ success: false, error: { code: err.code, message: err.message } });
      }
      throw err;
    }
  });

  app.get('/users/me/climbs', { preValidation: [authenticate] }, async (request, reply) => {
    try {
      const userId = (request.user as { id: number }).id;
      const { page, limit } = request.query as { page?: string; limit?: string };
      const result = await getClimbLogs(userId, page ? parseInt(page, 10) : 1, limit ? parseInt(limit, 10) : 20);
      return reply.send({ success: true, ...result });
    } catch (err) {
      if (err instanceof AppError) {
        return reply.status(err.statusCode).send({ success: false, error: { code: err.code, message: err.message } });
      }
      throw err;
    }
  });

  app.post('/users/me/climbs', { preValidation: [authenticate] }, async (request, reply) => {
    try {
      const userId = (request.user as { id: number }).id;
      const data = await createClimbLog(userId, request.body);
      return reply.status(201).send({ success: true, data });
    } catch (err) {
      if (err instanceof AppError) {
        return reply.status(err.statusCode).send({ success: false, error: { code: err.code, message: err.message } });
      }
      throw err;
    }
  });

  app.put('/users/me/climbs/:id', { preValidation: [authenticate] }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const userId = (request.user as { id: number }).id;
      const data = await updateClimbLog(parseInt(id, 10), userId, request.body);
      return reply.send({ success: true, data });
    } catch (err) {
      if (err instanceof AppError) {
        return reply.status(err.statusCode).send({ success: false, error: { code: err.code, message: err.message } });
      }
      throw err;
    }
  });

  app.delete('/users/me/climbs/:id', { preValidation: [authenticate] }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const userId = (request.user as { id: number }).id;
      await deleteClimbLog(parseInt(id, 10), userId);
      return reply.status(204).send();
    } catch (err) {
      if (err instanceof AppError) {
        return reply.status(err.statusCode).send({ success: false, error: { code: err.code, message: err.message } });
      }
      throw err;
    }
  });

  app.get('/users/me/saved', { preValidation: [authenticate] }, async (request, reply) => {
    try {
      const userId = (request.user as { id: number }).id;
      const data = await getSavedRoutes(userId);
      return reply.send({ success: true, data });
    } catch (err) {
      if (err instanceof AppError) {
        return reply.status(err.statusCode).send({ success: false, error: { code: err.code, message: err.message } });
      }
      throw err;
    }
  });

  app.get('/users/me/stats', { preValidation: [authenticate] }, async (request, reply) => {
    try {
      const userId = (request.user as { id: number }).id;
      const data = await getUserStats(userId);
      return reply.send({ success: true, data });
    } catch (err) {
      if (err instanceof AppError) {
        return reply.status(err.statusCode).send({ success: false, error: { code: err.code, message: err.message } });
      }
      throw err;
    }
  });
}
