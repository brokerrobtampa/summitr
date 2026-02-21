import crypto from 'node:crypto';
import { prisma } from '../lib/prisma.js';
import { hashPassword } from '../lib/auth.js';
import { sendPasswordResetEmail } from './email.service.js';
import { ValidationError } from '../lib/errors.js';
import { forgotPasswordSchema, resetPasswordSchema } from '@summit/shared';

export async function requestPasswordReset(body: unknown) {
  const parsed = forgotPasswordSchema.safeParse(body);
  if (!parsed.success) {
    throw new ValidationError(parsed.error.issues.map((i) => i.message).join(', '));
  }
  const { email } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });

  // Always return success to avoid email enumeration
  if (!user) return;

  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordResetToken: token,
      passwordResetTokenExpiresAt: expiresAt,
    },
  });

  await sendPasswordResetEmail(user.email, user.displayName || user.username, token);
}

export async function resetPassword(body: unknown) {
  const parsed = resetPasswordSchema.safeParse(body);
  if (!parsed.success) {
    throw new ValidationError(parsed.error.issues.map((i) => i.message).join(', '));
  }
  const { token, password } = parsed.data;

  const user = await prisma.user.findFirst({
    where: {
      passwordResetToken: token,
      passwordResetTokenExpiresAt: { gt: new Date() },
    },
  });

  if (!user) {
    throw new ValidationError('Invalid or expired reset token');
  }

  const passwordHash = await hashPassword(password);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      passwordResetToken: null,
      passwordResetTokenExpiresAt: null,
    },
  });
}
