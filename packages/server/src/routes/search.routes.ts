import type { FastifyInstance } from 'fastify';
import { globalSearch, autocomplete } from '../services/search.service.js';

export async function searchRoutes(app: FastifyInstance) {
  app.get('/search', async (request, reply) => {
    const { q, type, page, limit } = request.query as {
      q?: string;
      type?: string;
      page?: string;
      limit?: string;
    };

    if (!q || q.trim().length === 0) {
      return reply.status(400).send({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Search query is required' },
      });
    }

    const results = await globalSearch(
      q.trim(),
      type || 'all',
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
    return reply.send({ success: true, data: results });
  });

  app.get('/search/autocomplete', async (request, reply) => {
    const { q, limit } = request.query as { q?: string; limit?: string };

    if (!q || q.trim().length === 0) {
      return reply.send({ success: true, data: [] });
    }

    const results = await autocomplete(q.trim(), limit ? parseInt(limit, 10) : 10);
    return reply.send({ success: true, data: results });
  });
}
