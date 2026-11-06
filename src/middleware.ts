import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const COOKIE_NAME = 'mh2_admin_session';
const SECRET = process.env.ADMIN_JWT_SECRET || 'mh2_wine_liquor_secret_session_key_2026';

// Edge-compatible HMAC-SHA256 signature verification using Web Crypto API
async function verifyToken(token: string): Promise<any | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [dataB64, signature] = parts;

    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      enc.encode(SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const sigBytes = await crypto.subtle.sign('HMAC', key, enc.encode(dataB64));
    const bytes = new Uint8Array(sigBytes);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const computedSignature = btoa(binary)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    if (computedSignature !== signature) return null;

    // Decode payload
    const jsonStr = atob(dataB64.replace(/-/g, '+').replace(/_/g, '/'));
    const payload = JSON.parse(jsonStr);

    if (payload.exp && payload.exp < Date.now()) {
      return null; // Expired
    }

    return payload;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect Admin API routes
  if (pathname.startsWith('/api/admin')) {
    const authHeader = request.headers.get('authorization');
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
    const cookieToken = request.cookies.get(COOKIE_NAME)?.value;
    const token = bearerToken || cookieToken;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = await verifyToken(token);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized: Invalid or expired token' }, { status: 401 });
    }

    return NextResponse.next();
  }

  // Protect Admin Dashboard Web Routes (/admin/*)
  if (pathname.startsWith('/admin')) {
    const cookieToken = request.cookies.get(COOKIE_NAME)?.value;
    const session = cookieToken ? await verifyToken(cookieToken) : null;

    const isLoginPage = pathname === '/admin/login';

    if (isLoginPage) {
      // If already logged in, redirect away from login page to dashboard
      if (session) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      return NextResponse.next();
    }

    // Any other /admin page requires an active session
    if (!session) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
  ],
};

