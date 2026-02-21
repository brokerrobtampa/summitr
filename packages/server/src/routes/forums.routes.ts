import type { FastifyInstance } from 'fastify';
import {
  getCategories,
  getCategoryBySlug,
  getPeakCategory,
  getThreads,
  getThread,
  createThread,
  getReplies,
  createReply,
} from '../services/forum.service.js';
import { authenticate } from '../hooks/authenticate.js';
import { AppError } from '../lib/errors.js';

export async function forumRoutes(app: FastifyInstance) {
  // GET /api/v1/forums/categories — list general categories
  app.get('/forums/categories', async (_request, reply) => {
    try {
      const data = await getCategories();
      return reply.send({ success: true, data });
    } catch (err) {
      if (err instanceof AppError) {
        return reply.status(err.statusCode).send({ success: false, error: { code: err.code, message: err.message } });
      }
      throw err;
    }
  });

  // GET /api/v1/forums/categories/:slug — get category by slug
  app.get('/forums/categories/:slug', async (request, reply) => {
    try {
      const { slug } = request.params as { slug: string };
      const data = await getCategoryBySlug(slug);
      return reply.send({ success: true, data });
    } catch (err) {
      if (err instanceof AppError) {
        return reply.status(err.statusCode).send({ success: false, error: { code: err.code, message: err.message } });
      }
      throw err;
    }
  });

  // GET /api/v1/forums/peaks/:peakId — get/create peak-specific category
  app.get('/forums/peaks/:peakId', async (request, reply) => {
    try {
      const { peakId } = request.params as { peakId: string };
      const data = await getPeakCategory(parseInt(peakId, 10));
      return reply.send({ success: true, data });
    } catch (err) {
      if (err instanceof AppError) {
        return reply.status(err.statusCode).send({ success: false, error: { code: err.code, message: err.message } });
      }
      throw err;
    }
  });

  // GET /api/v1/forums/categories/:categoryId/threads — list threads
  app.get('/forums/categories/:categoryId/threads', async (request, reply) => {
    try {
      const { categoryId } = request.params as { categoryId: string };
      const { page, limit } = request.query as { page?: string; limit?: string };
      const result = await getThreads(
        parseInt(categoryId, 10),
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

  // POST /api/v1/forums/categories/:categoryId/threads — create thread (auth)
  app.post('/forums/categories/:categoryId/threads', { preValidation: [authenticate] }, async (request, reply) => {
    try {
      const { categoryId } = request.params as { categoryId: string };
      const authorId = (request.user as { id: number }).id;
      const data = await createThread(parseInt(categoryId, 10), authorId, request.body);
      return reply.status(201).send({ success: true, data });
    } catch (err) {
      if (err instanceof AppError) {
        return reply.status(err.statusCode).send({ success: false, error: { code: err.code, message: err.message } });
      }
      throw err;
    }
  });

  // GET /api/v1/forums/threads/:threadId — get thread detail
  app.get('/forums/threads/:threadId', async (request, reply) => {
    try {
      const { threadId } = request.params as { threadId: string };
      const data = await getThread(parseInt(threadId, 10));
      return reply.send({ success: true, data });
    } catch (err) {
      if (err instanceof AppError) {
        return reply.status(err.statusCode).send({ success: false, error: { code: err.code, message: err.message } });
      }
      throw err;
    }
  });

  // GET /api/v1/forums/threads/:threadId/replies — list replies
  app.get('/forums/threads/:threadId/replies', async (request, reply) => {
    try {
      const { threadId } = request.params as { threadId: string };
      const { page, limit } = request.query as { page?: string; limit?: string };
      const result = await getReplies(
        parseInt(threadId, 10),
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

  // POST /api/v1/forums/threads/:threadId/replies — create reply (auth)
  app.post('/forums/threads/:threadId/replies', { preValidation: [authenticate] }, async (request, reply) => {
    try {
      const { threadId } = request.params as { threadId: string };
      const authorId = (request.user as { id: number }).id;
      const data = await createReply(parseInt(threadId, 10), authorId, request.body);
      return reply.status(201).send({ success: true, data });
    } catch (err) {
      if (err instanceof AppError) {
        return reply.status(err.statusCode).send({ success: false, error: { code: err.code, message: err.message } });
      }
      throw err;
    }
  });
}
