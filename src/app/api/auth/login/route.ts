import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { query } from '@/lib/db';
import { verifyPassword, createSessionToken } from '@/lib/auth';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

// Dummy hash for constant-time comparison when user does not exist (prevents timing attacks)
const DUMMY_SALT = crypto.randomBytes(16).toString('hex');
const DUMMY_KEY = crypto.pbkdf2Sync('dummy_password_timing_defense', Buffer.from(DUMMY_SALT, 'hex'), 100000, 64, 'sha512').toString('hex');
const DUMMY_HASH = `${DUMMY_SALT}:${DUMMY_KEY}`;

export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);

    // 1. Enforce Rate Limiting (Max 5 attempts per 5 minutes per IP)
    const rateCheck = checkRateLimit(`login:${clientIp}`, 5, 5 * 60 * 1000);
    if (!rateCheck.success) {
      const waitSeconds = Math.ceil((rateCheck.resetTime - Date.now()) / 1000);
      return NextResponse.json(
        {
          error: `Too many login attempts. Access temporarily locked for security. Please try again in ${waitSeconds} seconds.`,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(waitSeconds),
          },
        }
      );
    }

    const { email, password } = await req.json();

    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    // 2. Query database for admin user
    const rows = await query(`
      SELECT id, email, password_hash, role, name
      FROM public.admin_users
      WHERE email = $1
      LIMIT 1;
    `, [cleanEmail]);

    let isValid = false;
    let admin = null;

    if (rows.length === 0) {
      // Execute dummy password verification to maintain uniform response time (timing-attack prevention)
      verifyPassword(password, DUMMY_HASH);
    } else {
      admin = rows[0];
      isValid = verifyPassword(password, admin.password_hash);
    }

    if (!isValid || !admin) {
      return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 });
    }

    // 3. Generate signed session token
    const token = createSessionToken({
      id: admin.id,
      email: admin.email,
      role: admin.role,
    });

    const res = NextResponse.json({
      success: true,
      token,
      user: { id: admin.id, email: admin.email, name: admin.name },
    });

    // 4. Set secure HTTP-only session cookie
    res.cookies.set('mh2_admin_session', token, {
      httpOnly: true,
      secure: req.nextUrl.protocol === 'https:',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return res;
  } catch (err: any) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Authentication failed due to server error' }, { status: 500 });
  }
}
