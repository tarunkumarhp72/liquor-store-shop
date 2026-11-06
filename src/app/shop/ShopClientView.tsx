'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  Check, 
  ChevronDown, 
  RotateCcw, 
  Phone, 
  Wine, 
  Sparkles,
  CheckSquare,
  Square,
  Filter
} from 'lucide-react';
import CallStoreModal from '@/components/CallStoreModal';

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
  currentPage: number;
  totalPages: number;
  children: React.ReactNode;
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
  currentPage,
  totalPages,
  children,
}: ShopClientViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');

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
    params.set('page', '1'); // Reset to page 1 on filter change
    router.push(`/shop?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParam('search', searchInput.trim() || null);
  };

  const clearAllFilters = () => {
    router.push('/shop');
    setSearchInput('');
    setMobileDrawerOpen(false);
  };

  const activeCategoryObj = categories.find((c) => c.slug === currentCategory);

  // Reusable Filter Content (Used in Desktop Left Sidebar & Mobile Slide-Out Drawer)
  const FilterContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className="space-y-6">
      {/* Category Section - Amazon / Right Liquor Style */}
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
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
            {/* Search Input Bar - Top Full Width / Left on desktop */}
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
              {/* Mobile Filter Button (Opens Left Slide-Out Drawer) */}
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

        {/* 2-Column Main Layout: Desktop Left Sidebar + Right Products Grid */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          {/* Desktop Left Sidebar (Amazon & Right Liquor Style) */}
          <aside className="hidden lg:block w-64 xl:w-72 shrink-0 bg-white border border-cellar-border rounded-lg p-5 shadow-xs sticky top-24">
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

          {/* Right Product Grid Area */}
          <main className="flex-1 min-w-0 w-full">
            {/* Results Counter Bar */}
            <div className="flex items-center justify-between text-xs text-cellar-muted mb-4 px-1">
              <div>
                Showing <strong>{totalFilteredCount}</strong> bottle{totalFilteredCount === 1 ? '' : 's'}
                {currentSearch && <span> matching &ldquo;{currentSearch}&rdquo;</span>}
              </div>
              <div>
                Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
              </div>
            </div>

            {/* The Products (Rendered Server-side) */}
            {children}
          </main>
        </div>
      </div>

      {/* Mobile Slide-Out Left Drawer (Right Liquor Mobile Style) */}
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
