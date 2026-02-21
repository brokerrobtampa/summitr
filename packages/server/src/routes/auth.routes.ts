import type { FastifyInstance } from 'fastify';
import { registerUser, loginUser, getUserById } from '../services/auth.service.js';
import { requestPasswordReset, resetPassword } from '../services/password-reset.service.js';
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

  // POST /auth/forgot-password
  app.post('/auth/forgot-password', async (request, reply) => {
    try {
      await requestPasswordReset(request.body);
      // Always return success to avoid email enumeration
      return reply.send({
        success: true,
        data: { message: 'If an account with that email exists, a reset link has been sent.' },
      });
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

  // POST /auth/reset-password
  app.post('/auth/reset-password', async (request, reply) => {
    try {
      await resetPassword(request.body);
      return reply.send({
        success: true,
        data: { message: 'Password has been reset successfully.' },
      });
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
