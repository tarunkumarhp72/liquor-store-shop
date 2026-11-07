import crypto from 'crypto';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'mh2_admin_session';
const SECRET = process.env.ADMIN_JWT_SECRET || 'mh2_wine_liquor_secret_session_key_2026';

// PBKDF2 hash verification matching our python seed
export function verifyPassword(password: string, storedHash?: string | null): boolean {
  if (!password || !storedHash || typeof storedHash !== 'string') {
    return false;
  }
  try {
    const parts = storedHash.split(':');
    if (parts.length !== 2) return false;
    const [saltHex, keyHex] = parts;
    const salt = Buffer.from(saltHex, 'hex');
    const derivedKey = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512');
    return derivedKey.toString('hex') === keyHex;
  } catch (err) {
    console.error('Password verification error:', err);
    return false;
  }
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16);
  const derivedKey = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512');
  return `${salt.toString('hex')}:${derivedKey.toString('hex')}`;
}

// Signed session token with timestamp and expiry (7 days)
export function createSessionToken(payload: { id: string; email: string; role: string }): string {
  const data = JSON.stringify({
    ...payload,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
  });
  const dataB64 = Buffer.from(data).toString('base64url');
  const signature = crypto.createHmac('sha256', SECRET).update(dataB64).digest('base64url');
  return `${dataB64}.${signature}`;
}

export function verifySessionToken(token: string): { id: string; email: string; role: string } | null {
  try {
    const [dataB64, signature] = token.split('.');
    if (!dataB64 || !signature) return null;

    const expectedSignature = crypto.createHmac('sha256', SECRET).update(dataB64).digest('base64url');
    if (signature !== expectedSignature) return null;

    const parsed = JSON.parse(Buffer.from(dataB64, 'base64url').toString('utf-8'));
    if (parsed.exp && parsed.exp < Date.now()) {
      return null; // Expired
    }
    return parsed;
  } catch {
    return null;
  }
}

export async function getAdminSession(req?: Request) {
  if (req) {
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const verified = verifySessionToken(token);
      if (verified) return verified;
    }
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}
