import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import ProductCard, { Product } from '@/components/ProductCard';
import ShopClientView, { CategoryWithCount } from './ShopClientView';
import { query } from '@/lib/db';

interface ShopSearchParams {
  category?: string;
  search?: string;
  sort?: string;
  in_stock?: string;
  price_range?: string;
  page?: string;
}

interface ShopProps {
  searchParams: Promise<ShopSearchParams>;
}

const PAGE_SIZE = 16;

async function getCategoriesWithCounts(): Promise<CategoryWithCount[]> {
  try {
    const rows = await query<any>(`
      SELECT c.id, c.name, c.slug, c.description, COUNT(p.id)::int as product_count
      FROM public.categories c
      LEFT JOIN public.products p ON c.slug = p.category_slug
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

async function getAllBottlesCount(): Promise<number> {
  try {
    const rows = await query<any>(`SELECT COUNT(*)::int as count FROM public.products;`);
    return Number(rows[0]?.count) || 0;
  } catch {
    return 0;
  }
}

async function getProductsData(params: ShopSearchParams): Promise<{
  products: Product[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}> {
  try {
    const page = Math.max(1, parseInt(params.page || '1', 10));
    const offset = (page - 1) * PAGE_SIZE;

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
    const totalPages = Math.ceil(totalCount / PAGE_SIZE) || 1;

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
    const queryParams = [...sqlParams, PAGE_SIZE, offset];
    const products = await query<Product>(dataSql, queryParams);

    return {
      products,
      totalCount,
      totalPages,
      currentPage: page,
    };
  } catch (err) {
    console.error('Error fetching shop products:', err);
    return {
      products: [],
      totalCount: 0,
      totalPages: 1,
      currentPage: 1,
    };
  }
}

export default async function ShopPage({ searchParams }: ShopProps) {
  const resolvedParams = (await searchParams) || {};

  const [categories, allBottlesCount, data] = await Promise.all([
    getCategoriesWithCounts(),
    getAllBottlesCount(),
    getProductsData(resolvedParams),
  ]);

  const { products, totalCount, totalPages, currentPage } = data;

  return (
    <ShopClientView
      categories={categories}
      allBottlesCount={allBottlesCount}
      totalFilteredCount={totalCount}
      currentPage={currentPage}
      totalPages={totalPages}
    >
      {/* Product Grid Area */}
      {products.length === 0 ? (
        <div className="bg-white border border-cellar-border p-8 sm:p-12 text-center rounded-lg space-y-3">
          <p className="disp text-2xl font-bold text-cellar-charcoal">No bottles found</p>
          <p className="text-xs text-cellar-muted max-w-sm mx-auto">
            Try adjusting your search query, selecting another category, or resetting all filters.
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="px-5 py-2.5 bg-wine-700 hover:bg-wine-800 text-white text-xs font-bold uppercase rounded-md inline-flex items-center gap-1.5 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-5">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-8 sm:mt-12 pt-6 border-t border-cellar-border flex items-center justify-between gap-4">
          {/* Previous Page Button */}
          {currentPage > 1 ? (
            <Link
              href={`/shop?${new URLSearchParams({
                ...resolvedParams,
                page: String(currentPage - 1),
              }).toString()}`}
              className="min-h-[40px] px-3.5 py-2 border border-cellar-border bg-white hover:border-gold-600 text-cellar-charcoal text-xs font-bold uppercase tracking-wider rounded-md flex items-center gap-1.5 transition shadow-2xs"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </Link>
          ) : (
            <span className="min-h-[40px] px-3.5 py-2 border border-cellar-border/40 bg-gray-50 text-gray-400 text-xs font-bold uppercase tracking-wider rounded-md flex items-center gap-1.5 cursor-not-allowed">
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </span>
          )}

          {/* Page Numbers */}
          <div className="hidden sm:flex items-center gap-1">
            {Array.from({ length: totalPages }).map((_, i) => {
              const pNum = i + 1;
              const isCurrent = pNum === currentPage;
              if (pNum !== 1 && pNum !== totalPages && Math.abs(pNum - currentPage) > 2) {
                if (Math.abs(pNum - currentPage) === 3) {
                  return <span key={pNum} className="px-2 text-cellar-muted text-xs">&hellip;</span>;
                }
                return null;
              }

              return (
                <Link
                  key={pNum}
                  href={`/shop?${new URLSearchParams({
                    ...resolvedParams,
                    page: String(pNum),
                  }).toString()}`}
                  className={`w-8 h-8 flex items-center justify-center rounded-md text-xs font-bold transition ${
                    isCurrent
                      ? 'bg-wine-700 text-white shadow-xs'
                      : 'bg-white border border-cellar-border text-cellar-charcoal hover:border-gold-600'
                  }`}
                >
                  {pNum}
                </Link>
              );
            })}
          </div>

          <div className="sm:hidden text-xs font-bold text-cellar-charcoal">
            {currentPage} / {totalPages}
          </div>

          {/* Next Page Button */}
          {currentPage < totalPages ? (
            <Link
              href={`/shop?${new URLSearchParams({
                ...resolvedParams,
                page: String(currentPage + 1),
              }).toString()}`}
              className="min-h-[40px] px-3.5 py-2 border border-cellar-border bg-white hover:border-gold-600 text-cellar-charcoal text-xs font-bold uppercase tracking-wider rounded-md flex items-center gap-1.5 transition shadow-2xs"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          ) : (
            <span className="min-h-[40px] px-3.5 py-2 border border-cellar-border/40 bg-gray-50 text-gray-400 text-xs font-bold uppercase tracking-wider rounded-md flex items-center gap-1.5 cursor-not-allowed">
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </span>
          )}
        </div>
      )}
    </ShopClientView>
  );
}
