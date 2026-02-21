import { registerSchema, loginSchema } from '@summit/shared';
import { prisma } from '../lib/prisma.js';
import { hashPassword, verifyPassword } from '../lib/auth.js';
import { ConflictError, UnauthorizedError, ValidationError } from '../lib/errors.js';
import { sendWelcomeEmail } from './email.service.js';

export async function registerUser(body: unknown) {
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    throw new ValidationError(parsed.error.issues.map((i) => i.message).join(', '));
  }

  const { email, username, password, displayName } = parsed.data;

  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
  });

  if (existing) {
    if (existing.email === email) throw new ConflictError('Email already in use');
    throw new ConflictError('Username already taken');
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: { email, username, passwordHash, displayName },
    select: {
      id: true,
      email: true,
      username: true,
      displayName: true,
      bio: true,
      avatarUrl: true,
      location: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  // Fire-and-forget welcome email
  sendWelcomeEmail(email, user.displayName || user.username).catch(() => {});

  return user;
}

export async function loginUser(body: unknown) {
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    throw new ValidationError(parsed.error.issues.map((i) => i.message).join(', '));
  }

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new UnauthorizedError('Invalid email or password');

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) throw new UnauthorizedError('Invalid email or password');

  const { passwordHash: _, ...safeUser } = user;
  return safeUser;
}

export async function getUserById(id: number) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      username: true,
      displayName: true,
      bio: true,
      avatarUrl: true,
      location: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
}
