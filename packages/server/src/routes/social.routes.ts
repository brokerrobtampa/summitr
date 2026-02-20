import type { FastifyInstance } from 'fastify';
import {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  getActivityFeed,
  getDiscoverFeed,
  addComment,
  getComments,
  deleteComment,
} from '../services/social.service.js';
import { authenticate } from '../hooks/authenticate.js';
import { AppError } from '../lib/errors.js';

export async function socialRoutes(app: FastifyInstance) {
  // POST /api/v1/users/:userId/follow
  app.post('/users/:userId/follow', { preValidation: [authenticate] }, async (request, reply) => {
    try {
      const { userId } = request.params as { userId: string };
      const followerId = (request.user as { id: number }).id;
      await followUser(followerId, parseInt(userId, 10));
      return reply.send({ success: true });
    } catch (err) {
      if (err instanceof AppError) {
        return reply.status(err.statusCode).send({ success: false, error: { code: err.code, message: err.message } });
      }
      throw err;
    }
  });

  // DELETE /api/v1/users/:userId/follow
  app.delete('/users/:userId/follow', { preValidation: [authenticate] }, async (request, reply) => {
    try {
      const { userId } = request.params as { userId: string };
      const followerId = (request.user as { id: number }).id;
      await unfollowUser(followerId, parseInt(userId, 10));
      return reply.send({ success: true });
    } catch (err) {
      if (err instanceof AppError) {
        return reply.status(err.statusCode).send({ success: false, error: { code: err.code, message: err.message } });
      }
      throw err;
    }
  });

  // GET /api/v1/users/:userId/followers
  app.get('/users/:userId/followers', async (request, reply) => {
    try {
      const { userId } = request.params as { userId: string };
      const { page } = request.query as { page?: string };
      const result = await getFollowers(parseInt(userId, 10), page ? parseInt(page, 10) : 1);
      return reply.send({ success: true, ...result });
    } catch (err) {
      if (err instanceof AppError) {
        return reply.status(err.statusCode).send({ success: false, error: { code: err.code, message: err.message } });
      }
      throw err;
    }
  });

  // GET /api/v1/users/:userId/following
  app.get('/users/:userId/following', async (request, reply) => {
    try {
      const { userId } = request.params as { userId: string };
      const { page } = request.query as { page?: string };
      const result = await getFollowing(parseInt(userId, 10), page ? parseInt(page, 10) : 1);
      return reply.send({ success: true, ...result });
    } catch (err) {
      if (err instanceof AppError) {
        return reply.status(err.statusCode).send({ success: false, error: { code: err.code, message: err.message } });
      }
      throw err;
    }
  });

  // GET /api/v1/feed — personal feed (auth required)
  app.get('/feed', { preValidation: [authenticate] }, async (request, reply) => {
    try {
      const userId = (request.user as { id: number }).id;
      const { page, limit } = request.query as { page?: string; limit?: string };
      const data = await getActivityFeed(userId, page ? parseInt(page, 10) : 1, limit ? parseInt(limit, 10) : 20);
      return reply.send({ success: true, data });
    } catch (err) {
      if (err instanceof AppError) {
        return reply.status(err.statusCode).send({ success: false, error: { code: err.code, message: err.message } });
      }
      throw err;
    }
  });

  // GET /api/v1/feed/discover — global public feed
  app.get('/feed/discover', async (request, reply) => {
    try {
      const { page, limit } = request.query as { page?: string; limit?: string };
      const data = await getDiscoverFeed(page ? parseInt(page, 10) : 1, limit ? parseInt(limit, 10) : 20);
      return reply.send({ success: true, data });
    } catch (err) {
      if (err instanceof AppError) {
        return reply.status(err.statusCode).send({ success: false, error: { code: err.code, message: err.message } });
      }
      throw err;
    }
  });

  // POST /api/v1/climbs/:climbLogId/comments
  app.post('/climbs/:climbLogId/comments', { preValidation: [authenticate] }, async (request, reply) => {
    try {
      const { climbLogId } = request.params as { climbLogId: string };
      const authorId = (request.user as { id: number }).id;
      const { body } = request.body as { body: string };
      const comment = await addComment(parseInt(climbLogId, 10), authorId, body);
      return reply.status(201).send({ success: true, data: comment });
    } catch (err) {
      if (err instanceof AppError) {
        return reply.status(err.statusCode).send({ success: false, error: { code: err.code, message: err.message } });
      }
      throw err;
    }
  });

  // GET /api/v1/climbs/:climbLogId/comments
  app.get('/climbs/:climbLogId/comments', async (request, reply) => {
    try {
      const { climbLogId } = request.params as { climbLogId: string };
      const { page } = request.query as { page?: string };
      const result = await getComments(parseInt(climbLogId, 10), page ? parseInt(page, 10) : 1);
      return reply.send({ success: true, ...result });
    } catch (err) {
      if (err instanceof AppError) {
        return reply.status(err.statusCode).send({ success: false, error: { code: err.code, message: err.message } });
      }
      throw err;
    }
  });

  // DELETE /api/v1/comments/:commentId
  app.delete('/comments/:commentId', { preValidation: [authenticate] }, async (request, reply) => {
    try {
      const { commentId } = request.params as { commentId: string };
      const userId = (request.user as { id: number }).id;
      await deleteComment(parseInt(commentId, 10), userId);
      return reply.status(204).send();
    } catch (err) {
      if (err instanceof AppError) {
        return reply.status(err.statusCode).send({ success: false, error: { code: err.code, message: err.message } });
      }
      throw err;
    }
  });
}
