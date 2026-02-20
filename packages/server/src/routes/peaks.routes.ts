import type { FastifyInstance } from 'fastify';
import {
  listPeaks,
  getPeakById,
  getPeakRoutes,
  getPeaksByBounds,
  getNearbyPeaks,
} from '../services/peak.service.js';
import { AppError } from '../lib/errors.js';

export async function peakRoutes(app: FastifyInstance) {
  app.get('/peaks', async (request, reply) => {
    try {
      const result = await listPeaks(request.query);
      return reply.send({ success: true, ...result });
    } catch (err) {
      if (err instanceof AppError) {
        return reply.status(err.statusCode).send({
          success: false,
          error: { code: err.code, message: err.message },
        });
      }
      throw err;
    }
  });

  app.get('/peaks/bounds', async (request, reply) => {
    try {
      const data = await getPeaksByBounds(request.query);
      return reply.send({ success: true, data });
    } catch (err) {
      if (err instanceof AppError) {
        return reply.status(err.statusCode).send({
          success: false,
          error: { code: err.code, message: err.message },
        });
      }
      throw err;
    }
  });

  app.get('/peaks/nearby', async (request, reply) => {
    try {
      const data = await getNearbyPeaks(request.query);
      return reply.send({ success: true, data });
    } catch (err) {
      if (err instanceof AppError) {
        return reply.status(err.statusCode).send({
          success: false,
          error: { code: err.code, message: err.message },
        });
      }
      throw err;
    }
  });

  app.get('/peaks/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const data = await getPeakById(parseInt(id, 10));
      return reply.send({ success: true, data });
    } catch (err) {
      if (err instanceof AppError) {
        return reply.status(err.statusCode).send({
          success: false,
          error: { code: err.code, message: err.message },
        });
      }
      throw err;
    }
  });

  app.get('/peaks/:id/routes', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const data = await getPeakRoutes(parseInt(id, 10), request.query);
      return reply.send({ success: true, data });
    } catch (err) {
      if (err instanceof AppError) {
        return reply.status(err.statusCode).send({
          success: false,
          error: { code: err.code, message: err.message },
        });
      }
      throw err;
    }
  });
}
