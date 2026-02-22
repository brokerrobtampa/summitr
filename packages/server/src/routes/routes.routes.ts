import type { FastifyInstance } from 'fastify';
import {
  listRoutes,
  getRouteById,
  createRoute,
  updateRoute,
  deleteRoute,
  saveRoute,
  unsaveRoute,
  getRoutesByBounds,
} from '../services/route.service.js';
import { generateGPX } from '../services/gpx.service.js';
import { authenticate, optionalAuth } from '../hooks/authenticate.js';
import { AppError } from '../lib/errors.js';

export async function routeRoutes(app: FastifyInstance) {
  app.get('/routes', async (request, reply) => {
    try {
      const result = await listRoutes(request.query);
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

  app.get('/routes/bounds', async (request, reply) => {
    try {
      const data = await getRoutesByBounds(request.query as Record<string, unknown>);
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

  app.get('/routes/:id', { preValidation: [optionalAuth] }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const userId = (request.user as { id: number } | undefined)?.id;
      const data = await getRouteById(parseInt(id, 10), userId);
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

  app.post('/routes', { preValidation: [authenticate] }, async (request, reply) => {
    try {
      const userId = (request.user as { id: number }).id;
      const data = await createRoute(request.body, userId);
      return reply.status(201).send({ success: true, data });
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

  app.put('/routes/:id', { preValidation: [authenticate] }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const userId = (request.user as { id: number }).id;
      const data = await updateRoute(parseInt(id, 10), request.body, userId);
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

  app.delete('/routes/:id', { preValidation: [authenticate] }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const userId = (request.user as { id: number }).id;
      await deleteRoute(parseInt(id, 10), userId);
      return reply.status(204).send();
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

  app.post('/routes/:id/save', { preValidation: [authenticate] }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const userId = (request.user as { id: number }).id;
      await saveRoute(parseInt(id, 10), userId);
      return reply.send({ success: true, data: { saved: true } });
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

  app.delete('/routes/:id/save', { preValidation: [authenticate] }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const userId = (request.user as { id: number }).id;
      await unsaveRoute(parseInt(id, 10), userId);
      return reply.send({ success: true, data: { saved: false } });
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

  // GET /api/v1/routes/:id/gpx — download GPX file for a route
  app.get('/routes/:id/gpx', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const routeId = parseInt(id, 10);
      const route = await getRouteById(routeId);
      const gpxXml = await generateGPX(routeId);

      const safeName = route.name.replace(/[^a-zA-Z0-9_-]/g, '-').toLowerCase();

      return reply
        .header('Content-Type', 'application/gpx+xml')
        .header('Content-Disposition', `attachment; filename="${safeName}.gpx"`)
        .send(gpxXml);
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
