import React from 'react';
import Link from 'next/link';
import { Search, SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight, X, Check } from 'lucide-react';
import ProductCard, { Product } from '@/components/ProductCard';
import { query } from '@/lib/db';

interface ShopSearchParams {
  category?: string;
  search?: string;
  sort?: string;
  in_stock?: string;
  page?: string;
}

interface ShopProps {
  searchParams: Promise<ShopSearchParams>;
}

const PAGE_SIZE = 16;

async function getCategories() {
  try {
    return await query(`SELECT * FROM public.categories ORDER BY sort_order ASC;`);
  } catch {
    return [];
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

    if (params.category && params.category !== 'all') {
      whereClause += ` AND category_slug = $${pIdx++}`;
      sqlParams.push(params.category);
    }

    if (params.search && params.search.trim()) {
      whereClause += ` AND (name ILIKE $${pIdx} OR short_description ILIKE $${pIdx} OR country ILIKE $${pIdx} OR region ILIKE $${pIdx})`;
      sqlParams.push(`%${params.search.trim()}%`);
      pIdx++;
    }

    if (params.in_stock === 'true') {
      whereClause += ` AND is_in_stock = true`;
    }

    // 1. Get total count
    const countSql = `SELECT COUNT(*) as count FROM public.products ${whereClause};`;
    const countRows = await query(countSql, sqlParams);
    const totalCount = parseInt(countRows[0]?.count || '0', 10);
    const totalPages = Math.ceil(totalCount / PAGE_SIZE) || 1;

    // 2. Sorting
    let orderClause = 'ORDER BY featured DESC, rating DESC, name ASC';
    if (params.sort === 'price_asc') {
      orderClause = 'ORDER BY price ASC';
    } else if (params.sort === 'price_desc') {
      orderClause = 'ORDER BY price DESC';
    } else if (params.sort === 'rating') {
      orderClause = 'ORDER BY rating DESC';
    }

    // 3. Paginated query
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
  const currentCategory = resolvedParams.category || 'all';
  const currentSearch = resolvedParams.search || '';
  const currentSort = resolvedParams.sort || 'featured';
  const inStockOnly = resolvedParams.in_stock === 'true';

  const [categories, data] = await Promise.all([
    getCategories(),
    getProductsData(resolvedParams),
  ]);

  const { products, totalCount, totalPages, currentPage } = data;
  const activeCategoryObj = categories.find((c: any) => c.slug === currentCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
      {/* Category Header */}
      <div className="mb-6 sm:mb-8 border-b border-cellar-border pb-4 sm:pb-6">
        <div className="text-[11px] sm:text-xs font-bold tracking-widest uppercase text-gold-700 mb-1">
          MH2 Bottle Shop & Cellar Catalog
        </div>
        <h1 className="disp text-3xl sm:text-5xl font-bold text-cellar-charcoal">
          {activeCategoryObj ? activeCategoryObj.name : 'All Bottles & Spirits'}
        </h1>
        <p className="text-xs sm:text-sm text-cellar-muted mt-1.5 max-w-2xl leading-relaxed">
          {activeCategoryObj?.description ||
            'Explore our collection of fine wines, champagnes, rare whiskeys, sipping tequilas, and cold beers available for 15-minute pickup and Uber Eats delivery.'}
        </p>
      </div>

      {/* Filter & Toolbar */}
      <div className="bg-white border border-cellar-border p-3 sm:p-5 rounded-sm shadow-xs mb-8 space-y-4">
        {/* Category Horizontal Scroll Pills (Apple Touch Smooth) */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1.5 scrollbar-none -mx-1 px-1 touch-pan-x">
          <Link
            href={`/shop?${new URLSearchParams({
              ...resolvedParams,
              category: 'all',
              page: '1',
            }).toString()}`}
            className={`min-h-[38px] px-3.5 sm:px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wider whitespace-nowrap transition flex items-center ${
              currentCategory === 'all'
                ? 'bg-wine-700 text-white shadow-xs'
                : 'bg-cellar-cream text-cellar-charcoal hover:bg-wine-100'
            }`}
          >
            All Items ({totalCount})
          </Link>
          {categories.map((cat: any) => (
            <Link
              key={cat.id}
              href={`/shop?${new URLSearchParams({
                ...resolvedParams,
                category: cat.slug,
                page: '1',
              }).toString()}`}
              className={`min-h-[38px] px-3.5 sm:px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wider whitespace-nowrap transition flex items-center ${
                currentCategory === cat.slug
                  ? 'bg-wine-700 text-white shadow-xs'
                  : 'bg-cellar-cream text-cellar-charcoal hover:bg-wine-100'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Search, Filter & Sort Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-cellar-border/60">
          {/* Search Input (No iOS auto-zoom) */}
          <form method="GET" action="/shop" className="relative w-full sm:w-80">
            {currentCategory !== 'all' && (
              <input type="hidden" name="category" value={currentCategory} />
            )}
            <input
              type="text"
              name="search"
              defaultValue={currentSearch}
              placeholder="Search by name, region, grape..."
              className="w-full pl-9 pr-8 py-2 text-base sm:text-xs bg-cellar-cream border border-cellar-border rounded-sm focus:outline-none focus:border-gold-600 text-cellar-charcoal min-h-[42px] sm:min-h-[38px]"
            />
            <Search className="w-4 h-4 text-cellar-muted absolute left-3 top-2.5 sm:top-2.5" />
            {currentSearch && (
              <Link
                href={`/shop?${new URLSearchParams({
                  ...resolvedParams,
                  search: '',
                  page: '1',
                }).toString()}`}
                className="absolute right-2.5 top-2.5 text-cellar-muted hover:text-cellar-charcoal"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </Link>
            )}
          </form>

          {/* In-Stock & Sort Controls */}
          <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2.5">
            <Link
              href={`/shop?${new URLSearchParams({
                ...resolvedParams,
                in_stock: inStockOnly ? 'false' : 'true',
                page: '1',
              }).toString()}`}
              className={`min-h-[38px] text-xs font-semibold px-3 py-2 rounded-sm border transition flex items-center gap-1.5 ${
                inStockOnly
                  ? 'bg-emerald-50 border-emerald-600 text-emerald-800 font-bold'
                  : 'bg-white border-cellar-border text-cellar-muted hover:border-gold-600'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${inStockOnly ? 'bg-emerald-600' : 'bg-gray-300'}`} />
              <span>In-Stock Only</span>
            </Link>

            {/* Sort Options */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-cellar-muted font-medium hidden sm:inline">Sort:</span>
              <div className="flex gap-1 overflow-x-auto">
                {[
                  { label: 'Featured', val: 'featured' },
                  { label: '$ Low', val: 'price_asc' },
                  { label: '$ High', val: 'price_desc' },
                  { label: 'Rating', val: 'rating' },
                ].map((s) => (
                  <Link
                    key={s.val}
                    href={`/shop?${new URLSearchParams({
                      ...resolvedParams,
                      sort: s.val,
                      page: '1',
                    }).toString()}`}
                    className={`min-h-[38px] px-2.5 py-2 rounded-sm font-semibold transition flex items-center ${
                      currentSort === s.val
                        ? 'bg-cellar-charcoal text-white font-bold'
                        : 'text-cellar-muted hover:text-cellar-charcoal bg-cellar-cream/60'
                    }`}
                  >
                    {s.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Header Count */}
      <div className="flex items-center justify-between text-xs text-cellar-muted mb-4 px-1">
        <div>
          Showing <strong>{products.length}</strong> of <strong>{totalCount}</strong> bottles
          {currentSearch && <span> for &ldquo;{currentSearch}&rdquo;</span>}
        </div>
        <div>
          Page {currentPage} of {totalPages}
        </div>
      </div>

      {/* 2-Column Mobile Grid, 3-Col Tablet, 4-Col Desktop */}
      {products.length === 0 ? (
        <div className="bg-white border border-cellar-border p-12 text-center rounded-sm space-y-3">
          <p className="disp text-2xl font-bold text-cellar-charcoal">No bottles found</p>
          <p className="text-xs text-cellar-muted max-w-sm mx-auto">
            Try clearing filters or search terms to browse our full wine and spirits catalog.
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="px-5 py-2.5 bg-wine-700 text-white text-xs font-bold uppercase rounded-sm inline-block"
            >
              Reset Filters
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-10 sm:mt-14 pt-6 border-t border-cellar-border flex items-center justify-between gap-4">
          {/* Previous Page Button */}
          {currentPage > 1 ? (
            <Link
              href={`/shop?${new URLSearchParams({
                ...resolvedParams,
                page: String(currentPage - 1),
              }).toString()}`}
              className="min-h-[42px] px-4 py-2 border border-cellar-border bg-white hover:border-gold-600 text-cellar-charcoal text-xs font-bold uppercase tracking-wider rounded-sm flex items-center gap-1.5 transition"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </Link>
          ) : (
            <span className="min-h-[42px] px-4 py-2 border border-cellar-border/40 bg-gray-50 text-gray-400 text-xs font-bold uppercase tracking-wider rounded-sm flex items-center gap-1.5 cursor-not-allowed">
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </span>
          )}

          {/* Page Number Chips */}
          <div className="hidden sm:flex items-center gap-1.5">
            {Array.from({ length: totalPages }).map((_, i) => {
              const pNum = i + 1;
              const isCurrent = pNum === currentPage;
              // Show pages near current page
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
                  className={`w-9 h-9 flex items-center justify-center rounded-sm text-xs font-bold transition ${
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
              className="min-h-[42px] px-4 py-2 border border-cellar-border bg-white hover:border-gold-600 text-cellar-charcoal text-xs font-bold uppercase tracking-wider rounded-sm flex items-center gap-1.5 transition"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          ) : (
            <span className="min-h-[42px] px-4 py-2 border border-cellar-border/40 bg-gray-50 text-gray-400 text-xs font-bold uppercase tracking-wider rounded-sm flex items-center gap-1.5 cursor-not-allowed">
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </span>
          )}
        </div>
      )}
    </div>
  );
}
