import { query } from '@/lib/db';
import { Product } from '@/components/ProductCard';

export interface ShopSearchParams {
  category?: string;
  search?: string;
  sort?: string;
  in_stock?: string;
  price_range?: string;
  page?: string;
  limit?: string;
}

export interface CategoryWithCount {
  id: string;
  name: string;
  slug: string;
  description?: string;
  product_count: number;
}

export const DEFAULT_PAGE_SIZE = 16;

export async function getCategoriesWithCounts(): Promise<CategoryWithCount[]> {
  try {
    const rows = await query<any>(`
      SELECT c.id, c.name, c.slug, c.description, COUNT(p.id)::int as product_count
      FROM public.categories c
      LEFT JOIN public.products p ON c.slug = p.category_slug
      WHERE COALESCE(c.is_active, true) = true
      GROUP BY c.id, c.name, c.slug, c.description, c.sort_order
      ORDER BY c.sort_order ASC;
    `);
    return rows.map((r) => ({
      id: String(r.id),
      name: String(r.name),
      slug: String(r.slug),
      description: r.description ? String(r.description) : undefined,
      product_count: Number(r.product_count) || 0,
    }));
  } catch (err) {
    console.error('Failed to get categories with counts:', err);
    return [];
  }
}

export async function getAllBottlesCount(): Promise<number> {
  try {
    const rows = await query<any>(`SELECT COUNT(*)::int as count FROM public.products;`);
    return Number(rows[0]?.count) || 0;
  } catch {
    return 0;
  }
}

export async function getProductsData(params: ShopSearchParams): Promise<{
  products: Product[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  hasMore: boolean;
}> {
  try {
    const pageSize = Math.max(1, parseInt(params.limit || String(DEFAULT_PAGE_SIZE), 10));
    const page = Math.max(1, parseInt(params.page || '1', 10));
    const offset = (page - 1) * pageSize;

    let whereClause = 'WHERE 1=1';
    const sqlParams: any[] = [];
    let pIdx = 1;

    // 1. Category Filter
    if (params.category && params.category !== 'all') {
      whereClause += ` AND category_slug = $${pIdx++}`;
      sqlParams.push(params.category);
    }

    // 2. Search Filter
    if (params.search && params.search.trim()) {
      whereClause += ` AND (name ILIKE $${pIdx} OR short_description ILIKE $${pIdx} OR country ILIKE $${pIdx} OR region ILIKE $${pIdx})`;
      sqlParams.push(`%${params.search.trim()}%`);
      pIdx++;
    }

    // 3. Stock Filter
    if (params.in_stock === 'true') {
      whereClause += ` AND is_in_stock = true`;
    }

    // 4. Price Range Filter
    if (params.price_range) {
      if (params.price_range === 'under_30') {
        whereClause += ` AND price < 30`;
      } else if (params.price_range === '30_60') {
        whereClause += ` AND price >= 30 AND price <= 60`;
      } else if (params.price_range === '60_100') {
        whereClause += ` AND price >= 60 AND price <= 100`;
      } else if (params.price_range === 'over_100') {
        whereClause += ` AND price > 100`;
      }
    }

    // Total Count
    const countSql = `SELECT COUNT(*)::int as count FROM public.products ${whereClause};`;
    const countRows = await query<any>(countSql, sqlParams);
    const totalCount = Number(countRows[0]?.count) || 0;
    const totalPages = Math.ceil(totalCount / pageSize) || 1;

    // Order By
    let orderClause = 'ORDER BY featured DESC, rating DESC, name ASC';
    if (params.sort === 'price_asc') {
      orderClause = 'ORDER BY price ASC';
    } else if (params.sort === 'price_desc') {
      orderClause = 'ORDER BY price DESC';
    } else if (params.sort === 'rating') {
      orderClause = 'ORDER BY rating DESC';
    }

    // Paginated Data
    const dataSql = `
      SELECT id, name, slug, category_slug, price, stock_quantity,
             is_in_stock, rating, review_count, abv, volume, country, region, image_url
      FROM public.products
      ${whereClause}
      ${orderClause}
      LIMIT $${pIdx++} OFFSET $${pIdx++};
    `;
    const queryParams = [...sqlParams, pageSize, offset];
    const products = await query<Product>(dataSql, queryParams);

    const hasMore = offset + products.length < totalCount;

    return {
      products,
      totalCount,
      totalPages,
      currentPage: page,
      hasMore,
    };
  } catch (err) {
    console.error('Error fetching shop products:', err);
    return {
      products: [],
      totalCount: 0,
      totalPages: 1,
      currentPage: 1,
      hasMore: false,
    };
  }
}
