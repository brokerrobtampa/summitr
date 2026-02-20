import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import path from 'node:path';
import { registerCors } from './plugins/cors.plugin.js';
import { registerAuth } from './plugins/auth.plugin.js';
import { authRoutes } from './routes/auth.routes.js';
import { peakRoutes } from './routes/peaks.routes.js';
import { routeRoutes } from './routes/routes.routes.js';
import { reviewRoutes } from './routes/reviews.routes.js';
import { userRoutes } from './routes/users.routes.js';
import { searchRoutes } from './routes/search.routes.js';
import { guidesRoutes } from './routes/guides.routes.js';
import { socialRoutes } from './routes/social.routes.js';
import { config } from './config.js';

export async function createApp() {
  const loggerConfig =
    config.nodeEnv === 'production'
      ? { level: 'info' }
      : {
          transport: {
            target: 'pino-pretty',
            options: { colorize: true },
          },
        };

  const app = Fastify({ logger: loggerConfig });

  // Plugins
  await registerCors(app);
  await registerAuth(app);

  // API routes — all under /api/v1
  await app.register(
    async (api) => {
      await api.register(authRoutes);
      await api.register(peakRoutes);
      await api.register(routeRoutes);
      await api.register(reviewRoutes);
      await api.register(userRoutes);
      await api.register(searchRoutes);
      await api.register(guidesRoutes, { prefix: '/guides' });
      await api.register(socialRoutes);
    },
    { prefix: '/api/v1' },
  );

  // Health check
  app.get('/health', async () => ({ status: 'ok' }));

  // In production, serve the client SPA from packages/client/dist
  if (config.nodeEnv === 'production') {
    const clientDist = path.join(config.projectRoot, '..', 'client', 'dist');
    await app.register(fastifyStatic, {
      root: clientDist,
      wildcard: false,
    });

    // SPA fallback: serve index.html for non-API routes
    app.setNotFoundHandler(async (req, reply) => {
      if (req.url.startsWith('/api/')) {
        return reply.status(404).send({ error: 'Not found' });
      }
      return reply.sendFile('index.html');
    });
  }

  return app;
}
