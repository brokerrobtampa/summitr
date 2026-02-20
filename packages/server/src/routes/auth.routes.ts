import type { FastifyInstance } from 'fastify';
import { registerUser, loginUser, getUserById } from '../services/auth.service.js';
import { authenticate } from '../hooks/authenticate.js';
import { AppError } from '../lib/errors.js';

export async function authRoutes(app: FastifyInstance) {
  app.post('/auth/register', async (request, reply) => {
    try {
      const user = await registerUser(request.body);
      const token = app.jwt.sign({ id: user.id, username: user.username });
      return reply.status(201).send({ success: true, data: { token, user } });
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

  app.post('/auth/login', async (request, reply) => {
    try {
      const user = await loginUser(request.body);
      const token = app.jwt.sign({ id: user.id, username: user.username });
      return reply.send({ success: true, data: { token, user } });
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

  app.get('/auth/me', { preValidation: [authenticate] }, async (request, reply) => {
    const payload = request.user as { id: number };
    const user = await getUserById(payload.id);
    if (!user) {
      return reply.status(404).send({
        success: false,
        error: { code: 'NOT_FOUND', message: 'User not found' },
      });
    }
    return reply.send({ success: true, data: user });
  });
}
