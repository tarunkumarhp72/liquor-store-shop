import { MetadataRoute } from 'next';
import { query } from '@/lib/db';
import { getFallbackProducts } from '@/lib/fallbackDb';

export const revalidate = 3600; // Revalidate sitemap every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.mh2liquorstore.ca';

  // 1. Static Core Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/delivery`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  // 2. Category Landing Pages
  const categories = [
    'beer',
    'vodka',
    'non-alcoholic',
    'wine',
    'whiskey',
    'tequila',
    'champagne',
    'gins',
    'rums',
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${baseUrl}/shop?category=${cat}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  // 3. Dynamic Products
  let productSlugs: string[] = [];

  try {
    const products = await query<{ slug: string }>(
      'SELECT slug FROM public.products WHERE is_in_stock = true LIMIT 500;'
    );
    if (products && products.length > 0) {
      productSlugs = products.map((p) => p.slug);
    }
  } catch {
    // Fallback if DB is disconnected
    const fallback = getFallbackProducts();
    productSlugs = fallback.map((p) => p.slug);
  }

  const productRoutes: MetadataRoute.Sitemap = productSlugs.map((slug) => ({
    url: `${baseUrl}/shop/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}

