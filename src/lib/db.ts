import { Pool } from 'pg';

declare global {
  // eslint-disable-next-line no-var
  var _pgPool: Pool | undefined;
}

// Create a singleton connection pool to Supabase PostgreSQL pooler
// Cache on globalThis to prevent connection leaks during Next.js hot reload / SSR
const pool =
  globalThis._pgPool ||
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
    max: 5, // Keep conservative for Supabase free-tier connection limits
    idleTimeoutMillis: 15000,
    connectionTimeoutMillis: 5000,
  });

if (process.env.NODE_ENV !== 'production') {
  globalThis._pgPool = pool;
}

export default pool;

export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
  const res = await pool.query(text, params);
  return res.rows;
}
