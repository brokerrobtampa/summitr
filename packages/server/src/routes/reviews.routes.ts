import type { FastifyInstance } from 'fastify';
import {
  getReviewsForRoute,
  createReview,
  updateReview,
  deleteReview,
  getTipsForRoute,
  createTip,
  deleteTip,
  getGearForRoute,
  createGearRec,
  updateGearRec,
  deleteGearRec,
} from '../services/review.service.js';
import { authenticate } from '../hooks/authenticate.js';
import { AppError } from '../lib/errors.js';

export async function reviewRoutes(app: FastifyInstance) {
  // ─── Reviews ─────────────────────────────────
  app.get('/routes/:routeId/reviews', async (request, reply) => {
    try {
      const { routeId } = request.params as { routeId: string };
      const { page, limit } = request.query as { page?: string; limit?: string };
      const result = await getReviewsForRoute(
        parseInt(routeId, 10),
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

  app.post('/routes/:routeId/reviews', { preValidation: [authenticate] }, async (request, reply) => {
    try {
      const { routeId } = request.params as { routeId: string };
      const userId = (request.user as { id: number }).id;
      const data = await createReview(parseInt(routeId, 10), request.body, userId);
      return reply.status(201).send({ success: true, data });
    } catch (err) {
      if (err instanceof AppError) {
        return reply.status(err.statusCode).send({ success: false, error: { code: err.code, message: err.message } });
      }
      throw err;
    }
  });

  app.put('/reviews/:id', { preValidation: [authenticate] }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const userId = (request.user as { id: number }).id;
      const data = await updateReview(parseInt(id, 10), request.body, userId);
      return reply.send({ success: true, data });
    } catch (err) {
      if (err instanceof AppError) {
        return reply.status(err.statusCode).send({ success: false, error: { code: err.code, message: err.message } });
      }
      throw err;
    }
  });

  app.delete('/reviews/:id', { preValidation: [authenticate] }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const userId = (request.user as { id: number }).id;
      await deleteReview(parseInt(id, 10), userId);
      return reply.status(204).send();
    } catch (err) {
      if (err instanceof AppError) {
        return reply.status(err.statusCode).send({ success: false, error: { code: err.code, message: err.message } });
      }
      throw err;
    }
  });

  // ─── Tips ────────────────────────────────────
  app.get('/routes/:routeId/tips', async (request, reply) => {
    try {
      const { routeId } = request.params as { routeId: string };
      const data = await getTipsForRoute(parseInt(routeId, 10));
      return reply.send({ success: true, data });
    } catch (err) {
      if (err instanceof AppError) {
        return reply.status(err.statusCode).send({ success: false, error: { code: err.code, message: err.message } });
      }
      throw err;
    }
  });

  app.post('/routes/:routeId/tips', { preValidation: [authenticate] }, async (request, reply) => {
    try {
      const { routeId } = request.params as { routeId: string };
      const userId = (request.user as { id: number }).id;
      const data = await createTip(parseInt(routeId, 10), request.body, userId);
      return reply.status(201).send({ success: true, data });
    } catch (err) {
      if (err instanceof AppError) {
        return reply.status(err.statusCode).send({ success: false, error: { code: err.code, message: err.message } });
      }
      throw err;
    }
  });

  app.delete('/tips/:id', { preValidation: [authenticate] }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const userId = (request.user as { id: number }).id;
      await deleteTip(parseInt(id, 10), userId);
      return reply.status(204).send();
    } catch (err) {
      if (err instanceof AppError) {
        return reply.status(err.statusCode).send({ success: false, error: { code: err.code, message: err.message } });
      }
      throw err;
    }
  });

  // ─── Gear Recommendations ───────────────────
  app.get('/routes/:routeId/gear', async (request, reply) => {
    try {
      const { routeId } = request.params as { routeId: string };
      const data = await getGearForRoute(parseInt(routeId, 10));
      return reply.send({ success: true, data });
    } catch (err) {
      if (err instanceof AppError) {
        return reply.status(err.statusCode).send({ success: false, error: { code: err.code, message: err.message } });
      }
      throw err;
    }
  });

  app.post('/routes/:routeId/gear', { preValidation: [authenticate] }, async (request, reply) => {
    try {
      const { routeId } = request.params as { routeId: string };
      const userId = (request.user as { id: number }).id;
      const data = await createGearRec(parseInt(routeId, 10), request.body, userId);
      return reply.status(201).send({ success: true, data });
    } catch (err) {
      if (err instanceof AppError) {
        return reply.status(err.statusCode).send({ success: false, error: { code: err.code, message: err.message } });
      }
      throw err;
    }
  });

  app.put('/gear/:id', { preValidation: [authenticate] }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const userId = (request.user as { id: number }).id;
      const data = await updateGearRec(parseInt(id, 10), request.body, userId);
      return reply.send({ success: true, data });
    } catch (err) {
      if (err instanceof AppError) {
        return reply.status(err.statusCode).send({ success: false, error: { code: err.code, message: err.message } });
      }
      throw err;
    }
  });

  app.delete('/gear/:id', { preValidation: [authenticate] }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const userId = (request.user as { id: number }).id;
      await deleteGearRec(parseInt(id, 10), userId);
      return reply.status(204).send();
    } catch (err) {
      if (err instanceof AppError) {
        return reply.status(err.statusCode).send({ success: false, error: { code: err.code, message: err.message } });
      }
      throw err;
    }
  });
}
