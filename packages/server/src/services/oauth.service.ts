import { prisma } from '../lib/prisma.js';
import { config } from '../config.js';
import { UnauthorizedError, ValidationError } from '../lib/errors.js';
import { sendWelcomeEmail } from './email.service.js';

interface OAuthProfile {
  providerId: string;
  email: string;
  name: string | null;
  picture: string | null;
}

// ─── GOOGLE ──────────────────────────────────────────────

export async function verifyGoogleToken(idToken: string): Promise<OAuthProfile> {
  const res = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`);
  if (!res.ok) throw new UnauthorizedError('Invalid Google token');

  const data = await res.json() as {
    sub: string;
    email: string;
    email_verified: string;
    name?: string;
    picture?: string;
    aud: string;
  };

  // Verify the token was issued for our app
  if (config.googleClientId && data.aud !== config.googleClientId) {
    throw new UnauthorizedError('Google token not issued for this application');
  }

  if (data.email_verified !== 'true') {
    throw new UnauthorizedError('Google email not verified');
  }

  return {
    providerId: data.sub,
    email: data.email,
    name: data.name || null,
    picture: data.picture || null,
  };
}

// ─── FACEBOOK ────────────────────────────────────────────

export async function verifyFacebookToken(accessToken: string): Promise<OAuthProfile> {
  // First verify the token is valid and issued for our app
  if (config.facebookAppId && config.facebookAppSecret) {
    const debugRes = await fetch(
      `https://graph.facebook.com/debug_token?input_token=${encodeURIComponent(accessToken)}&access_token=${config.facebookAppId}|${config.facebookAppSecret}`,
    );
    if (debugRes.ok) {
      const debugData = await debugRes.json() as { data: { is_valid: boolean; app_id: string } };
      if (!debugData.data.is_valid) throw new UnauthorizedError('Invalid Facebook token');
      if (debugData.data.app_id !== config.facebookAppId) {
        throw new UnauthorizedError('Facebook token not issued for this application');
      }
    }
  }

  // Get user profile
  const res = await fetch(
    `https://graph.facebook.com/me?fields=id,name,email,picture.type(large)&access_token=${encodeURIComponent(accessToken)}`,
  );
  if (!res.ok) throw new UnauthorizedError('Invalid Facebook token');

  const data = await res.json() as {
    id: string;
    name?: string;
    email?: string;
    picture?: { data?: { url?: string } };
  };

  if (!data.email) {
    throw new ValidationError('Facebook account must have an email address');
  }

  return {
    providerId: data.id,
    email: data.email,
    name: data.name || null,
    picture: data.picture?.data?.url || null,
  };
}

// ─── APPLE ───────────────────────────────────────────────

export async function verifyAppleToken(idToken: string): Promise<OAuthProfile> {
  // Decode the JWT payload (Apple ID tokens are JWTs)
  const parts = idToken.split('.');
  if (parts.length !== 3) throw new UnauthorizedError('Invalid Apple token format');

  try {
    const payload = JSON.parse(
      Buffer.from(parts[1], 'base64url').toString('utf-8'),
    ) as {
      sub: string;
      email?: string;
      email_verified?: string | boolean;
      iss: string;
      aud: string;
      exp: number;
    };

    // Verify issuer
    if (payload.iss !== 'https://appleid.apple.com') {
      throw new UnauthorizedError('Invalid Apple token issuer');
    }

    // Verify audience if configured
    if (config.appleClientId && payload.aud !== config.appleClientId) {
      throw new UnauthorizedError('Apple token not issued for this application');
    }

    // Check expiration
    if (payload.exp * 1000 < Date.now()) {
      throw new UnauthorizedError('Apple token expired');
    }

    if (!payload.email) {
      throw new ValidationError('Apple account must share email address');
    }

    return {
      providerId: payload.sub,
      email: payload.email,
      name: null, // Apple provides name only on first auth, handled by client
      picture: null, // Apple doesn't provide profile pictures
    };
  } catch (err) {
    if (err instanceof UnauthorizedError || err instanceof ValidationError) throw err;
    throw new UnauthorizedError('Invalid Apple token');
  }
}

// ─── LOGIN OR CREATE ─────────────────────────────────────

type OAuthProvider = 'google' | 'facebook' | 'apple';

const PROVIDER_ID_FIELD: Record<OAuthProvider, 'googleId' | 'facebookId' | 'appleId'> = {
  google: 'googleId',
  facebook: 'facebookId',
  apple: 'appleId',
};

export async function loginOrCreateOAuthUser(
  provider: OAuthProvider,
  profile: OAuthProfile,
) {
  const idField = PROVIDER_ID_FIELD[provider];

  // 1. Try to find by provider ID
  const existingByProvider = await prisma.user.findUnique({
    where: { [idField]: profile.providerId } as any,
  });

  if (existingByProvider) {
    // Update avatar if changed
    if (profile.picture && profile.picture !== existingByProvider.avatarUrl) {
      await prisma.user.update({
        where: { id: existingByProvider.id },
        data: { avatarUrl: profile.picture },
      });
    }

    const { passwordHash: _, ...safeUser } = existingByProvider;
    return safeUser;
  }

  // 2. Try to find by email — link provider to existing account
  const existingByEmail = await prisma.user.findUnique({
    where: { email: profile.email },
  });

  if (existingByEmail) {
    const updated = await prisma.user.update({
      where: { id: existingByEmail.id },
      data: {
        [idField]: profile.providerId,
        ...(profile.picture && !existingByEmail.avatarUrl ? { avatarUrl: profile.picture } : {}),
      },
    });
    const { passwordHash: _, ...safeUser } = updated;
    return safeUser;
  }

  // 3. Create new user
  const username = await generateUniqueUsername(profile.email, profile.name);

  const newUser = await prisma.user.create({
    data: {
      email: profile.email,
      username,
      displayName: profile.name,
      avatarUrl: profile.picture,
      [idField]: profile.providerId,
    },
  });

  // Fire-and-forget welcome email
  sendWelcomeEmail(profile.email, profile.name || username).catch(() => {});

  const { passwordHash: _, ...safeUser } = newUser;
  return safeUser;
}

async function generateUniqueUsername(email: string, name: string | null): Promise<string> {
  // Try name-based username first
  let base = name
    ? name.toLowerCase().replace(/[^a-z0-9]/g, '.').replace(/\.+/g, '.').replace(/^\.+|\.+$/g, '')
    : email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '.').replace(/\.+/g, '.').replace(/^\.+|\.+$/g, '');

  // Ensure minimum length
  if (base.length < 3) base = base + 'user';

  // Truncate if too long
  if (base.length > 25) base = base.substring(0, 25);

  // Check if available
  const existing = await prisma.user.findUnique({ where: { username: base } });
  if (!existing) return base;

  // Add numeric suffix
  for (let i = 1; i < 100; i++) {
    const candidate = `${base}${i}`;
    const taken = await prisma.user.findUnique({ where: { username: candidate } });
    if (!taken) return candidate;
  }

  // Fallback: random suffix
  return `${base}${Date.now().toString(36)}`;
}

export async function handleOAuthLogin(provider: string, token: string) {
  if (!['google', 'facebook', 'apple'].includes(provider)) {
    throw new ValidationError(`Unsupported OAuth provider: ${provider}`);
  }

  let profile: OAuthProfile;

  switch (provider) {
    case 'google':
      profile = await verifyGoogleToken(token);
      break;
    case 'facebook':
      profile = await verifyFacebookToken(token);
      break;
    case 'apple':
      profile = await verifyAppleToken(token);
      break;
    default:
      throw new ValidationError('Unsupported provider');
  }

  return loginOrCreateOAuthUser(provider as OAuthProvider, profile);
}
