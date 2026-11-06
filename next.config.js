/** @type {import('next').NextConfig} */
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https://rightliquor.ca https://www.rightliquor.ca https://oaszetyzonehuvsrnquu.supabase.co https://oaszetyzonehuvsrnquu.storage.supabase.co https://images.unsplash.com; connect-src 'self' https://oaszetyzonehuvsrnquu.supabase.co; frame-ancestors 'none';",
  },
];

const nextConfig = {
  env: {
    NEXT_PROD_SUPABASE_URL: process.env.NEXT_PROD_SUPABASE_URL,
    NEXT_PROD_SUPABASE_ANON_KEY: process.env.NEXT_PROD_SUPABASE_ANON_KEY,
    NEXT_PROD_STORE_NAME: process.env.NEXT_PROD_STORE_NAME,
    NEXT_PROD_STORE_PHONE: process.env.NEXT_PROD_STORE_PHONE,
    NEXT_PROD_STORE_ADDRESS: process.env.NEXT_PROD_STORE_ADDRESS,
    NEXT_PROD_STORE_HOURS: process.env.NEXT_PROD_STORE_HOURS,
    NEXT_PROD_GOOGLE_MAPS_URL: process.env.NEXT_PROD_GOOGLE_MAPS_URL,
    NEXT_PROD_UBER_EATS_URL: process.env.NEXT_PROD_UBER_EATS_URL,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'rightliquor.ca',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.rightliquor.ca',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'oaszetyzonehuvsrnquu.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'oaszetyzonehuvsrnquu.storage.supabase.co',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = nextConfig;
