import type { FastifyInstance } from 'fastify';
import { searchTrips } from '../services/tripPlanner.service.js';

export async function tripPlannerRoutes(app: FastifyInstance) {
  app.get('/trip-planner', async (request, reply) => {
    const result = await searchTrips(request.query);
    return reply.send({ success: true, ...result });
  });
}
