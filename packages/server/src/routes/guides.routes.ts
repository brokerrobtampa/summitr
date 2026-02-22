import type { FastifyInstance } from 'fastify';
import * as guideService from '../services/guide.service.js';

export async function guidesRoutes(app: FastifyInstance) {
  // ── Individual Guides ──────────────────────────────

  // GET /api/v1/guides — list/search individual guides
  app.get('/', async (request) => {
    return guideService.getGuides(request.query as Record<string, unknown>);
  });

  // GET /api/v1/guides/:id — guide profile detail
  app.get<{ Params: { id: string } }>('/:id', async (request, reply) => {
    const id = parseInt(request.params.id, 10);
    if (isNaN(id)) return reply.code(400).send({ error: { message: 'Invalid guide ID' } });
    const guide = await guideService.getGuideById(id);
    if (!guide) return reply.code(404).send({ error: { message: 'Guide not found' } });
    return { data: guide };
  });

  // ── Guide Companies ────────────────────────────────

  // GET /api/v1/guides/companies — list/search companies
  app.get('/companies', async (request) => {
    return guideService.getGuideCompanies(request.query as Record<string, unknown>);
  });

  // GET /api/v1/guides/companies/:id — company detail with guides + peaks
  app.get<{ Params: { id: string } }>('/companies/:id', async (request, reply) => {
    const id = parseInt(request.params.id, 10);
    if (isNaN(id)) return reply.code(400).send({ error: { message: 'Invalid company ID' } });
    const company = await guideService.getGuideCompanyById(id);
    if (!company) return reply.code(404).send({ error: { message: 'Company not found' } });
    return { data: company };
  });

  // ── Peak/Route Lookups ─────────────────────────────

  // GET /api/v1/guides/peaks — all peaks with guide services
  app.get('/peaks', async () => {
    const peaks = await guideService.getAllGuidedPeaks();
    return { data: peaks };
  });

  // GET /api/v1/guides/peaks/:peakId — guides + companies for a specific peak
  app.get<{ Params: { peakId: string } }>('/peaks/:peakId', async (request, reply) => {
    const peakId = parseInt(request.params.peakId, 10);
    if (isNaN(peakId)) return reply.code(400).send({ error: { message: 'Invalid peak ID' } });
    const data = await guideService.getGuidesByPeak(peakId);
    return { data };
  });

  // GET /api/v1/guides/routes/:routeId — guides for a specific route
  app.get<{ Params: { routeId: string } }>('/routes/:routeId', async (request, reply) => {
    const routeId = parseInt(request.params.routeId, 10);
    if (isNaN(routeId)) return reply.code(400).send({ error: { message: 'Invalid route ID' } });
    const data = await guideService.getGuidesByRoute(routeId);
    return { data };
  });
}
