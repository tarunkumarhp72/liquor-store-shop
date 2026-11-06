import { Pool } from 'pg';
import { handleFallbackQuery } from './fallbackDb';

declare global {
  // eslint-disable-next-line no-var
  var _pgPool: Pool | undefined;
}

const hasDbUrl = Boolean(process.env.DATABASE_URL && process.env.DATABASE_URL.trim());

let pool: Pool | null = null;

if (hasDbUrl) {
  try {
    pool =
      globalThis._pgPool ||
      new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false,
        },
        max: 5,
        idleTimeoutMillis: 15000,
        connectionTimeoutMillis: 5000,
      });

    pool.on('error', (err) => {
      console.warn('PostgreSQL pool background error:', err.message);
    });

    if (process.env.NODE_ENV !== 'production') {
      globalThis._pgPool = pool;
    }
  } catch (err) {
    console.warn('Failed to initialize PostgreSQL pool:', (err as Error).message);
    pool = null;
  }
}

export default pool;

export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
  if (!pool) {
    return handleFallbackQuery<T>(text, params);
  }

  try {
    const res = await pool.query(text, params);
    return res.rows;
  } catch (err) {
    console.warn('Database query failed, using local fallback:', (err as Error).message);
    return handleFallbackQuery<T>(text, params);
  }
}
