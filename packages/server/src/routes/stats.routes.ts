import type { FastifyInstance } from 'fastify';
import { prisma } from '../lib/prisma.js';

export async function statsRoutes(app: FastifyInstance) {
  // GET /api/v1/stats — public site-wide counts
  app.get('/stats', async (_request, reply) => {
    const [peakCount, routeCount, guidedPeakCount] = await Promise.all([
      prisma.peak.count(),
      prisma.route.count(),
      prisma.guideCompanyPeak.groupBy({
        by: ['peakId'],
      }).then((groups: any[]) => groups.length),
    ]);

    return reply.send({
      success: true,
      data: {
        peaks: peakCount,
        routes: routeCount,
        guidedPeaks: guidedPeakCount,
        continents: 7, // Always 7 continents
      },
    });
  });
}
