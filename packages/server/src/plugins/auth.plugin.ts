import jwt from '@fastify/jwt';
import type { FastifyInstance } from 'fastify';
import { config } from '../config.js';

export async function registerAuth(app: FastifyInstance) {
  await app.register(jwt, {
    secret: config.jwtSecret,
    sign: { expiresIn: '7d' },
  });
}
