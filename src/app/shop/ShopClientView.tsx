'use client';

import React, { useState, useEffect, useRef, useCallback, useTransition } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  RotateCcw, 
  Phone, 
  Wine, 
  ArrowUp
} from 'lucide-react';
import CallStoreModal from '@/components/CallStoreModal';
import ProductCard, { Product } from '@/components/ProductCard';
import ProductCardSkeleton from '@/components/ProductCardSkeleton';

export interface CategoryWithCount {
  id: string;
  name: string;
  slug: string;
  description?: string;
  product_count: number;
}

interface ShopClientViewProps {
  categories: CategoryWithCount[];
  allBottlesCount: number;
  totalFilteredCount: number;
  initialProducts: Product[];
  initialHasMore: boolean;
}

const priceRanges = [
  { label: 'All Prices', val: 'all' },
  { label: 'Under $30', val: 'under_30' },
  { label: '$30 to $60', val: '30_60' },
  { label: '$60 to $100', val: '60_100' },
  { label: '$100 & Above', val: 'over_100' },
];

const sortOptions = [
  { label: 'Featured Selection', val: 'featured' },
  { label: 'Price: Low to High', val: 'price_asc' },
  { label: 'Price: High to Low', val: 'price_desc' },
  { label: 'Customer Rating', val: 'rating' },
];

export default function ShopClientView({
  categories,
  allBottlesCount,
  totalFilteredCount,
  initialProducts,
  initialHasMore,
}: ShopClientViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isFilterPending, startTransition] = useTransition();

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');

  // Infinite Scroll States
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Synchronous guard refs to prevent duplicate fetches & race conditions
  const isFetchingRef = useRef(false);
  const pageRef = useRef(page);
  const hasMoreRef = useRef(hasMore);

  useEffect(() => {
    pageRef.current = page;
  }, [page]);

  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  const currentCategory = searchParams.get('category') || 'all';
  const currentSearch = searchParams.get('search') || '';
  const currentSort = searchParams.get('sort') || 'featured';
  const inStockOnly = searchParams.get('in_stock') === 'true';
  const currentPriceRange = searchParams.get('price_range') || 'all';

  // Count active filters (excluding default sort & all categories)
  const activeFiltersCount = 
    (currentCategory !== 'all' ? 1 : 0) +
    (currentSearch ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (currentPriceRange !== 'all' ? 1 : 0) +
    (currentSort !== 'featured' ? 1 : 0);

  // Sync products when initialProducts change (e.g. filter change via router.push)
  useEffect(() => {
    setProducts(initialProducts);
    setPage(1);
    pageRef.current = 1;
    setHasMore(initialHasMore);
    hasMoreRef.current = initialHasMore;
    setIsLoadingMore(false);
    isFetchingRef.current = false;
  }, [initialProducts, initialHasMore]);

  // Sync search input with URL
  useEffect(() => {
    setSearchInput(searchParams.get('search') || '');
  }, [searchParams]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileDrawerOpen]);

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== 'all') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete('page'); // Reset pagination to initial batch

    // If user scrolled down far, smoothly scroll to top of catalog
    if (typeof window !== 'undefined' && window.scrollY > 350) {
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }

    startTransition(() => {
      router.push(`/shop?${params.toString()}`, { scroll: false });
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParam('search', searchInput.trim() || null);
  };

  const clearAllFilters = () => {
    if (typeof window !== 'undefined' && window.scrollY > 350) {
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
    setSearchInput('');
    setMobileDrawerOpen(false);
    startTransition(() => {
      router.push('/shop', { scroll: false });
    });
  };

  // Cursor / Infinite Scroll Loading Logic (Flicker-Free & Loop-Protected)
  const loadMoreProducts = useCallback(async () => {
    // Guard against race conditions and redundant fetches
    if (isFetchingRef.current || !hasMoreRef.current) return;

    isFetchingRef.current = true;
    setIsLoadingMore(true);
    const nextPage = pageRef.current + 1;

    try {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', String(nextPage));
      params.set('limit', '16');

      const response = await fetch(`/api/products?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to load more products');

      const data = await response.json();
      const newItems: Product[] = data.products || [];

      if (newItems.length === 0) {
        setHasMore(false);
        hasMoreRef.current = false;
      } else {
        let reachedEnd = false;
        setProducts((prev) => {
          const seen = new Set(prev.map((p) => p.id));
          const uniqueNew = newItems.filter((p) => !seen.has(p.id));

          // If all returned items were already in list, we reached the end
          if (uniqueNew.length === 0) {
            reachedEnd = true;
            return prev;
          }

          const combined = [...prev, ...uniqueNew];
          if (combined.length >= (data.totalCount || totalFilteredCount) || !data.hasMore) {
            reachedEnd = true;
          }
          return combined;
        });

        if (reachedEnd || !data.hasMore) {
          setHasMore(false);
          hasMoreRef.current = false;
        } else {
          setPage(nextPage);
          pageRef.current = nextPage;
        }
      }
    } catch (err) {
      console.error('Error in cursor scroll pagination:', err);
      setHasMore(false);
      hasMoreRef.current = false;
    } finally {
      setIsLoadingMore(false);
      isFetchingRef.current = false;
    }
  }, [searchParams, totalFilteredCount]);

  // IntersectionObserver to auto-trigger ahead of time (Flicker-Free)
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingRef.current && hasMoreRef.current) {
          loadMoreProducts();
        }
      },
      {
        rootMargin: '250px 0px', // Fetch smoothly before bottom without oscillation
        threshold: 0.1,
      }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [loadMoreProducts, hasMore, products.length]);

  const activeCategoryObj = categories.find((c) => c.slug === currentCategory);

  // Reusable Filter Content (Used in Desktop Left Sidebar & Mobile Slide-Out Drawer)
  const FilterContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className="space-y-6">
      {/* Category Section */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-cellar-charcoal flex items-center gap-1.5">
            <Wine className="w-3.5 h-3.5 text-gold-600" />
            <span>Shop by Category</span>
          </h3>
          {currentCategory !== 'all' && (
            <button
              onClick={() => updateParam('category', 'all')}
              className="text-[11px] text-wine-700 hover:underline font-semibold"
            >
              Reset
            </button>
          )}
        </div>

        <div className="space-y-1">
          {/* All Bottles */}
          <button
            type="button"
            onClick={() => {
              updateParam('category', 'all');
              if (isMobile) setMobileDrawerOpen(false);
            }}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition text-left ${
              currentCategory === 'all'
                ? 'bg-wine-700 text-white font-bold shadow-xs'
                : 'text-cellar-charcoal hover:bg-wine-50'
            }`}
          >
            <span className="flex items-center gap-2">
              <span
                className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center text-[10px] ${
                  currentCategory === 'all'
                    ? 'border-white bg-white text-wine-700'
                    : 'border-zinc-300 bg-white'
                }`}
              >
                {currentCategory === 'all' && '✓'}
              </span>
              <span>All Bottles</span>
            </span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-sm ${
                currentCategory === 'all' ? 'bg-wine-800 text-white' : 'text-cellar-muted bg-cellar-cream'
              }`}
            >
              {allBottlesCount}
            </span>
          </button>

          {/* Category List */}
          {categories.map((cat) => {
            const isSelected = currentCategory === cat.slug;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  updateParam('category', cat.slug);
                  if (isMobile) setMobileDrawerOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition text-left ${
                  isSelected
                    ? 'bg-wine-700 text-white font-bold shadow-xs'
                    : 'text-cellar-charcoal hover:bg-wine-50'
                }`}
              >
                <span className="flex items-center gap-2 truncate pr-2">
                  <span
                    className={`w-3.5 h-3.5 rounded-sm border shrink-0 flex items-center justify-center text-[10px] ${
                      isSelected
                        ? 'border-white bg-white text-wine-700'
                        : 'border-zinc-300 bg-white'
                    }`}
                  >
                    {isSelected && '✓'}
                  </span>
                  <span className="truncate">{cat.name}</span>
                </span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-sm shrink-0 ${
                    isSelected ? 'bg-wine-800 text-white' : 'text-cellar-muted bg-cellar-cream'
                  }`}
                >
                  {cat.product_count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Availability - In-Stock Checkbox */}
      <div className="pt-4 border-t border-cellar-border/60">
        <h3 className="text-xs font-bold uppercase tracking-wider text-cellar-charcoal mb-2.5">
          Availability
        </h3>
        <label
          className={`flex items-center justify-between p-2.5 rounded-md border cursor-pointer transition text-xs ${
            inStockOnly
              ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold'
              : 'bg-white border-cellar-border text-cellar-charcoal hover:border-gold-500'
          }`}
        >
          <div className="flex items-center gap-2">
            <span
              className={`w-4 h-4 rounded-sm border flex items-center justify-center text-xs ${
                inStockOnly
                  ? 'border-emerald-600 bg-emerald-600 text-white'
                  : 'border-zinc-300 bg-white'
              }`}
            >
              {inStockOnly && '✓'}
            </span>
            <span>In-Stock Only</span>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <input
            type="checkbox"
            className="sr-only"
            checked={inStockOnly}
            onChange={(e) => {
              updateParam('in_stock', e.target.checked ? 'true' : null);
              if (isMobile) setMobileDrawerOpen(false);
            }}
          />
        </label>
      </div>

      {/* Price Range Filter */}
      <div className="pt-4 border-t border-cellar-border/60">
        <h3 className="text-xs font-bold uppercase tracking-wider text-cellar-charcoal mb-2.5">
          Price Range
        </h3>
        <div className="space-y-1">
          {priceRanges.map((pr) => {
            const isSelected = currentPriceRange === pr.val;
            return (
              <button
                key={pr.val}
                type="button"
                onClick={() => {
                  updateParam('price_range', pr.val);
                  if (isMobile) setMobileDrawerOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs transition text-left ${
                  isSelected
                    ? 'bg-cellar-charcoal text-white font-bold'
                    : 'text-cellar-charcoal hover:bg-zinc-100'
                }`}
              >
                <span
                  className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center text-[8px] ${
                    isSelected ? 'border-white bg-gold-500 text-cellar-charcoal' : 'border-zinc-300 bg-white'
                  }`}
                >
                  {isSelected && '●'}
                </span>
                <span>{pr.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Curbside Help Card */}
      <div className="pt-4 border-t border-cellar-border/60">
        <div className="bg-[#1C1714] text-white p-3.5 rounded-lg border border-gold-500/30 space-y-2">
          <div className="flex items-center gap-1.5 text-gold-400 font-bold text-xs uppercase tracking-wider">
            <Phone className="w-3.5 h-3.5" />
            <span>Need Fast Pickup?</span>
          </div>
          <p className="text-[11px] text-zinc-300 leading-snug">
            Call our staff directly. We pack and have your bottles ready at curbside in 15 mins.
          </p>
          <button
            type="button"
            onClick={() => setCallModalOpen(true)}
            className="w-full py-1.5 px-3 bg-wine-700 hover:bg-wine-600 text-white rounded-md text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition"
          >
            <span>Call (403) 769-0061</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <CallStoreModal isOpen={callModalOpen} onClose={() => setCallModalOpen(false)} />

      {/* Main Container */}
      <div className="max-w-[1680px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-4 sm:py-8">
        {/* Top Header / Breadcrumbs */}
        <div className="mb-4 sm:mb-6">
          <div className="text-[11px] font-bold tracking-widest uppercase text-gold-700 mb-1 flex items-center gap-2">
            <Link href="/" className="hover:underline">Home</Link>
            <span>&rsaquo;</span>
            <span className="text-cellar-charcoal">Shop Catalog</span>
            {activeCategoryObj && (
              <>
                <span>&rsaquo;</span>
                <span className="text-wine-700 font-bold">{activeCategoryObj.name}</span>
              </>
            )}
          </div>
          <h1 className="disp text-2xl sm:text-4xl font-bold text-cellar-charcoal">
            {activeCategoryObj ? activeCategoryObj.name : 'All Bottles & Spirits'}
          </h1>
          <p className="text-xs sm:text-sm text-cellar-muted mt-1 max-w-2xl">
            {activeCategoryObj?.description ||
              'Explore 130+ fine wines, vintage champagnes, rare single malts, and cold craft beers for 15-minute curbside pickup and Uber Eats delivery.'}
          </p>
        </div>

        {/* Top Search & Filter Bar (Web & Mobile) */}
        <div className="bg-white border border-cellar-border rounded-lg p-2.5 sm:p-4 mb-6 shadow-xs">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-4">
            {/* Search Input Bar */}
            <form onSubmit={handleSearchSubmit} className="relative flex-1">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search wine, whiskey, tequila, beer, region..."
                className="w-full pl-9 pr-20 py-2 text-xs sm:text-sm bg-cellar-cream border border-cellar-border rounded-md focus:outline-none focus:border-gold-600 text-cellar-charcoal min-h-[40px]"
              />
              <Search className="w-4 h-4 text-cellar-muted absolute left-3 top-3" />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput('');
                    updateParam('search', null);
                  }}
                  className="absolute right-16 top-3 text-cellar-muted hover:text-cellar-charcoal"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 px-3 py-1.5 bg-wine-700 hover:bg-wine-600 text-white rounded-md text-xs font-bold uppercase tracking-wider transition"
              >
                Find
              </button>
            </form>

            {/* Mobile Filter Trigger Button & Sort Dropdown */}
            <div className="flex items-center justify-between sm:justify-end gap-2">
              {/* Mobile Filter Button */}
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-cellar-cream border border-cellar-border hover:border-gold-500 rounded-md text-xs font-bold text-cellar-charcoal transition min-h-[40px]"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-wine-700" />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-wine-700 text-white text-[10px] font-bold flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-cellar-muted font-medium hidden sm:inline">Sort:</span>
                <select
                  value={currentSort}
                  onChange={(e) => updateParam('sort', e.target.value)}
                  className="bg-cellar-cream border border-cellar-border text-cellar-charcoal text-xs font-semibold rounded-md px-2.5 py-2 focus:outline-none focus:border-gold-600 min-h-[40px] cursor-pointer"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.val} value={opt.val}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Active Filter Chips / Badges */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-3 mt-3 border-t border-cellar-border/60">
              <span className="text-[11px] text-cellar-muted font-medium">Active Filters:</span>

              {currentCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-wine-50 border border-wine-200 text-wine-800 text-[11px] font-semibold rounded-md">
                  <span>Category: {activeCategoryObj?.name || currentCategory}</span>
                  <button
                    onClick={() => updateParam('category', 'all')}
                    className="hover:text-wine-950 ml-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {currentSearch && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-wine-50 border border-wine-200 text-wine-800 text-[11px] font-semibold rounded-md">
                  <span>Search: &ldquo;{currentSearch}&rdquo;</span>
                  <button
                    onClick={() => {
                      setSearchInput('');
                      updateParam('search', null);
                    }}
                    className="hover:text-wine-950 ml-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {inStockOnly && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 border border-emerald-300 text-emerald-800 text-[11px] font-semibold rounded-md">
                  <span>In-Stock Only</span>
                  <button
                    onClick={() => updateParam('in_stock', null)}
                    className="hover:text-emerald-950 ml-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {currentPriceRange !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 border border-amber-300 text-amber-900 text-[11px] font-semibold rounded-md">
                  <span>Price: {priceRanges.find((p) => p.val === currentPriceRange)?.label}</span>
                  <button
                    onClick={() => updateParam('price_range', null)}
                    className="hover:text-amber-950 ml-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              <button
                onClick={clearAllFilters}
                className="text-[11px] text-wine-700 hover:underline font-bold ml-1 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear All</span>
              </button>
            </div>
          )}
        </div>

        {/* 2-Column Main Layout: Sticky Desktop Left Sidebar + Right Products Grid */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start relative">
          {/* Desktop Left Sidebar: Sticky & Pin-Fixed in Viewport */}
          <aside className="hidden lg:block w-64 xl:w-72 shrink-0 bg-white border border-cellar-border rounded-lg p-5 shadow-xs sticky top-20 self-start max-h-[calc(100vh-5.5rem)] overflow-y-auto overscroll-contain pr-1.5 scrollbar-thin z-20">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-cellar-border">
              <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-cellar-charcoal">
                <SlidersHorizontal className="w-4 h-4 text-wine-700" />
                <span>Filter Bottles</span>
              </div>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-[11px] text-wine-700 hover:underline font-semibold"
                >
                  Clear All
                </button>
              )}
            </div>

            <FilterContent />
          </aside>

          {/* Right Product Grid Area: Cursor / Infinite Scroll Feed */}
          <main className="flex-1 min-w-0 w-full">
            {/* Results Counter Bar */}
            <div className="flex items-center justify-between text-xs text-cellar-muted mb-4 px-1">
              <div>
                Showing <strong>{products.length}</strong> of <strong>{totalFilteredCount}</strong> bottle{totalFilteredCount === 1 ? '' : 's'}
                {currentSearch && <span> matching &ldquo;{currentSearch}&rdquo;</span>}
              </div>
              <div className="flex items-center gap-2">
                {isLoadingMore || isFilterPending ? (
                  <span className="inline-flex items-center gap-1.5 text-wine-700 font-semibold text-xs animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-wine-700 animate-ping" />
                    Loading cellar bottles...
                  </span>
                ) : hasMore ? (
                  <span className="text-[11px] text-cellar-muted">
                    Scroll down for more
                  </span>
                ) : (
                  <span className="text-[11px] text-emerald-700 font-semibold">
                    All {totalFilteredCount} bottles displayed
                  </span>
                )}
              </div>
            </div>

            {/* Product Cards Grid Area with Flicker-Free Skeleton Loading */}
            {isFilterPending ? (
              /* Shimmering Skeletons when transitioning filters */
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 gap-3 sm:gap-5">
                {Array.from({ length: 10 }).map((_, i) => (
                  <ProductCardSkeleton key={`filter-skel-${i}`} />
                ))}
              </div>
            ) : products.length === 0 && !isLoadingMore ? (
              <div className="bg-white border border-cellar-border p-8 sm:p-12 text-center rounded-lg space-y-3">
                <p className="disp text-2xl font-bold text-cellar-charcoal">No bottles found</p>
                <p className="text-xs text-cellar-muted max-w-sm mx-auto">
                  Try adjusting your search query, selecting another category, or resetting all filters.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="px-5 py-2.5 bg-wine-700 hover:bg-wine-800 text-white text-xs font-bold uppercase rounded-md inline-flex items-center gap-1.5 transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset All Filters</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 gap-3 sm:gap-5">
                {products.map((p) => (
                  <div key={p.id} className="h-full">
                    <ProductCard product={p} />
                  </div>
                ))}

                {/* Luxury Shimmering Product Card Skeletons during Infinite Scroll */}
                {isLoadingMore && (
                  <>
                    <ProductCardSkeleton />
                    <ProductCardSkeleton />
                    <ProductCardSkeleton />
                    <ProductCardSkeleton />
                    <ProductCardSkeleton />
                  </>
                )}
              </div>
            )}

            {/* Infinite Scroll Sentinel Trigger (Only in DOM when more items exist) */}
            {hasMore && (
              <div ref={sentinelRef} className="w-full h-12 pointer-events-none" />
            )}

            {/* End of Collection Status */}
            {!hasMore && products.length > 0 && (
              <div className="w-full border-t border-cellar-border/60 mt-8 pt-6 text-center space-y-2">
                <p className="text-xs font-semibold text-cellar-muted">
                  Showing all {products.length} bottles &bull; You&apos;ve reached the end
                </p>
                <button
                  type="button"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-wine-700 hover:text-wine-900 transition py-1.5 px-4 rounded-md bg-wine-50 border border-wine-200 hover:bg-wine-100 shadow-2xs"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                  <span>Back to Top</span>
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Slide-Out Left Drawer */}
      {mobileDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop Blur Overlay */}
          <div
            onClick={() => setMobileDrawerOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          />

          {/* Drawer Slide-in Panel from Left */}
          <div className="relative w-[85%] max-w-xs bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-250">
            {/* Drawer Header */}
            <div className="p-4 bg-[#14100E] text-white flex items-center justify-between border-b border-gold-500/30">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-gold-400" />
                <span className="font-bold text-sm tracking-wide">Filters & Categories</span>
              </div>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
                aria-label="Close filters"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Body (Scrollable) */}
            <div className="p-4 overflow-y-auto flex-1 space-y-4">
              <FilterContent isMobile={true} />
            </div>

            {/* Drawer Sticky Footer */}
            <div className="p-3 border-t border-cellar-border bg-[#FAF7F2] flex items-center gap-2">
              <button
                type="button"
                onClick={clearAllFilters}
                className="w-1/3 py-2.5 px-2 bg-white border border-cellar-border text-cellar-charcoal text-xs font-bold uppercase rounded-md text-center"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="w-2/3 py-2.5 px-3 bg-wine-700 hover:bg-wine-600 text-white text-xs font-bold uppercase rounded-md text-center shadow-xs"
              >
                Apply ({totalFilteredCount})
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
