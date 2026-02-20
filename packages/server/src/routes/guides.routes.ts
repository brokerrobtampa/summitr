import type { FastifyInstance } from 'fastify';
import * as guideService from '../services/guide.service.js';

export async function guidesRoutes(app: FastifyInstance) {
  // GET /api/v1/guides/peaks/:peakId
  app.get<{ Params: { peakId: string } }>('/peaks/:peakId', async (request, reply) => {
    const peakId = parseInt(request.params.peakId, 10);
    if (isNaN(peakId)) return reply.code(400).send({ error: { message: 'Invalid peak ID' } });
    const services = await guideService.getGuideServicesByPeak(peakId);
    return { data: services };
  });

  // GET /api/v1/guides/peaks
  app.get('/peaks', async () => {
    const peaks = await guideService.getAllGuidedPeaks();
    return { data: peaks };
  });
}
