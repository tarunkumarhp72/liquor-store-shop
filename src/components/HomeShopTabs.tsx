'use client';

import React, { useState, useRef, useEffect, useTransition } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, ArrowRight, X, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard, { Product } from './ProductCard';
import ProductCardSkeleton from './ProductCardSkeleton';

interface HomeShopTabsProps {
  categories: any[];
  products: Product[];
}

export default function HomeShopTabs({ categories, products }: HomeShopTabsProps) {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPending, startTransition] = useTransition();
  const tabsRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkTabScroll = () => {
    if (!tabsRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = tabsRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  };

  useEffect(() => {
    checkTabScroll();
    window.addEventListener('resize', checkTabScroll);
    return () => window.removeEventListener('resize', checkTabScroll);
  }, [categories]);

  const scrollTabs = (direction: 'left' | 'right') => {
    if (!tabsRef.current) return;
    const amount = direction === 'left' ? -220 : 220;
    tabsRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    setTimeout(checkTabScroll, 250);
  };

  const handleTabChange = (slug: string) => {
    startTransition(() => {
      setActiveTab(slug);
    });
  };

  // Filter products by selected tab and search
  const filteredProducts = products.filter((p) => {
    const matchesTab = activeTab === 'all' || p.category_slug === activeTab;
    const matchesSearch =
      !searchQuery.trim() ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.country && p.country.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.region && p.region.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Category Tabs & Quick Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-cellar-border pb-4">
        {/* Horizontal Category Tabs with Smooth Scroll Controls & No-Cut Padding */}
        <div className="relative flex-1 min-w-0 flex items-center">
          {/* Left Arrow Button with subtle gradient backdrop */}
          {canScrollLeft && (
            <div className="hidden sm:flex absolute left-0 top-0 bottom-0 z-10 items-center pr-3 bg-gradient-to-r from-[#F8F5EF] via-[#F8F5EF]/95 to-transparent">
              <button
                type="button"
                onClick={() => scrollTabs('left')}
                className="w-7 h-7 rounded-full bg-white border border-cellar-border shadow-md flex items-center justify-center text-cellar-charcoal hover:text-wine-700 hover:border-gold-500 transition active:scale-95"
                aria-label="Scroll categories left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Scrollable Tabs Track with adequate padding so content is never cut off */}
          <div
            ref={tabsRef}
            onScroll={checkTabScroll}
            className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none px-2 sm:px-10 touch-pan-x scroll-smooth w-full"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            <button
              type="button"
              onClick={() => handleTabChange('all')}
              className={`min-h-[38px] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition whitespace-nowrap active:scale-95 shrink-0 ${
                activeTab === 'all'
                  ? 'bg-wine-700 text-white shadow-xs'
                  : 'bg-white border border-cellar-border text-cellar-charcoal hover:bg-wine-50'
              }`}
            >
              All Bottles ({products.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleTabChange(cat.slug)}
                className={`min-h-[38px] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition whitespace-nowrap active:scale-95 shrink-0 ${
                  activeTab === cat.slug
                    ? 'bg-wine-700 text-white shadow-xs'
                    : 'bg-white border border-cellar-border text-cellar-charcoal hover:bg-wine-50'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Right Arrow Button with subtle gradient backdrop */}
          {canScrollRight && (
            <div className="hidden sm:flex absolute right-0 top-0 bottom-0 z-10 items-center pl-3 bg-gradient-to-l from-[#F8F5EF] via-[#F8F5EF]/95 to-transparent">
              <button
                type="button"
                onClick={() => scrollTabs('right')}
                className="w-7 h-7 rounded-full bg-white border border-cellar-border shadow-md flex items-center justify-center text-cellar-charcoal hover:text-wine-700 hover:border-gold-500 transition active:scale-95"
                aria-label="Scroll categories right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Quick Filter Search Input */}
        <div className="relative w-full lg:w-64 shrink-0">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter bottles..."
            className="w-full pl-8 pr-8 py-1.5 text-base sm:text-xs bg-white border border-cellar-border rounded-full focus:outline-none focus:border-gold-600 text-cellar-charcoal min-h-[40px] sm:min-h-[36px]"
          />
          <Search className="w-3.5 h-3.5 text-cellar-muted absolute left-3 top-3 sm:top-2.5" />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5 sm:top-2 text-stone-400 hover:text-cellar-charcoal p-0.5"
              aria-label="Clear filter"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Skeletons when transitioning tabs OR Products Grid */}
      {isPending ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={`home-skel-${i}`} />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="p-10 bg-white border border-cellar-border text-center rounded-sm text-cellar-muted text-xs">
          No bottles found matching your filter.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {filteredProducts.slice(0, 8).map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="h-full"
            >
              <ProductCard product={p} />
            </motion.div>
          ))}
        </div>
      )}

      {/* View All Button */}
      <div className="pt-4 text-center">
        <Link
          href={activeTab === 'all' ? '/shop' : `/shop?category=${activeTab}`}
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-cellar-charcoal hover:bg-wine-700 text-white font-bold text-xs uppercase tracking-widest rounded-sm transition shadow-sm active:scale-98"
        >
          <span>View All {activeTab === 'all' ? '130+ Bottles' : `${activeTab} Bottles`}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
