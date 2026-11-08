import { createHmac, timingSafeEqual } from 'crypto';

/**
 * تسجيل دخول الأدمن (حساب واحد).
 * المتغيرات دي لازم تكون في .env.local:
 *   ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_SESSION_SECRET
 */

export const ADMIN_COOKIE = 'bosla_admin';

const SESSION_PAYLOAD = 'admin';

const getSecret = (): string => {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error('ADMIN_SESSION_SECRET مش موجود في .env.local');
  return secret;
};

const sign = (value: string): string =>
  createHmac('sha256', getSecret()).update(value).digest('hex');

/** مقارنة نصين بشكل آمن (من غير ما الوقت يكشف الفرق) */
const safeEqual = (a: string, b: string): boolean => {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);
  if (bufferA.length !== bufferB.length) return false;
  return timingSafeEqual(bufferA, bufferB);
};

export const checkAdminCredentials = (email: string, password: string): boolean => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) return false;
  return safeEqual(email.trim().toLowerCase(), adminEmail.toLowerCase()) &&
    safeEqual(password, adminPassword);
};

export const createAdminToken = (): string => `${SESSION_PAYLOAD}.${sign(SESSION_PAYLOAD)}`;

export const isValidAdminToken = (token: string | undefined): boolean => {
  if (!token) return false;
  const [payload, signature] = token.split('.');
  if (payload !== SESSION_PAYLOAD || !signature) return false;
  return safeEqual(signature, sign(payload));
};
