'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight, Wine, Sparkles, Flame, GlassWater, Beer } from 'lucide-react';

export interface CategoryItem {
  id: number;
  name: string;
  slug: string;
  description?: string;
  product_count?: number | string;
}

interface CategoryCarouselProps {
  categories: CategoryItem[];
}

// Visual icons and tones for each category
const categoryMetadata: Record<string, { icon: string; tone: string; borderTone: string; accent: string }> = {
  wine: {
    icon: '🍷',
    tone: 'from-rose-50 to-stone-50',
    borderTone: 'group-hover:border-rose-400',
    accent: 'text-rose-900',
  },
  champagne: {
    icon: '🍾',
    tone: 'from-amber-50 to-stone-50',
    borderTone: 'group-hover:border-amber-400',
    accent: 'text-amber-900',
  },
  whiskey: {
    icon: '🥃',
    tone: 'from-orange-50 to-stone-50',
    borderTone: 'group-hover:border-orange-400',
    accent: 'text-orange-950',
  },
  tequila: {
    icon: '🌵',
    tone: 'from-lime-50 to-stone-50',
    borderTone: 'group-hover:border-lime-500',
    accent: 'text-emerald-950',
  },
  vodka: {
    icon: '🍸',
    tone: 'from-sky-50 to-stone-50',
    borderTone: 'group-hover:border-sky-400',
    accent: 'text-sky-950',
  },
  gins: {
    icon: '🌿',
    tone: 'from-teal-50 to-stone-50',
    borderTone: 'group-hover:border-teal-400',
    accent: 'text-teal-950',
  },
  rums: {
    icon: '🍹',
    tone: 'from-amber-50 to-yellow-50',
    borderTone: 'group-hover:border-amber-500',
    accent: 'text-amber-950',
  },
  beer: {
    icon: '🍺',
    tone: 'from-amber-50 to-stone-50',
    borderTone: 'group-hover:border-amber-400',
    accent: 'text-amber-900',
  },
  'artisanal-seltzers': {
    icon: '🥤',
    tone: 'from-emerald-50 to-stone-50',
    borderTone: 'group-hover:border-emerald-400',
    accent: 'text-emerald-900',
  },
};

export default function CategoryCarousel({ categories }: CategoryCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [categories]);

  // Automated right-to-left carousel slide
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      if (!scrollRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

      // Loop smoothly back to beginning if at the end
      if (scrollLeft + clientWidth >= scrollWidth - 15) {
        scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        // Scroll right by 230px (one card width + gap) so cards slide in right-to-left
        scrollRef.current.scrollBy({ left: 230, behavior: 'smooth' });
      }
      setTimeout(checkScroll, 350);
    }, 3000); // 3 seconds interval

    return () => clearInterval(interval);
  }, [isPaused, categories]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = direction === 'left' ? -280 : 280;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    setTimeout(checkScroll, 300);
  };

  return (
    <div className="relative">
      {/* Section Header with Carousel Arrows */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-[11px] sm:text-xs font-bold tracking-widest uppercase text-gold-700">
            Curated Departments
          </div>
          <h2 className="disp text-2xl sm:text-3xl font-bold text-cellar-charcoal">
            Browse By Category
          </h2>
        </div>

        {/* Carousel Prev / Next Controls */}
        <div className="flex items-center gap-2">
          <Link
            href="/shop"
            className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-wine-700 hover:text-wine-800 transition mr-2"
          >
            <span>All Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            aria-label="Previous categories"
            className={`w-9 h-9 rounded-full flex items-center justify-center border transition ${
              canScrollLeft
                ? 'bg-white border-cellar-border text-cellar-charcoal hover:border-gold-600 hover:text-wine-700 shadow-2xs cursor-pointer'
                : 'bg-stone-100 border-stone-200 text-stone-300 cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            aria-label="Next categories"
            className={`w-9 h-9 rounded-full flex items-center justify-center border transition ${
              canScrollRight
                ? 'bg-white border-cellar-border text-cellar-charcoal hover:border-gold-600 hover:text-wine-700 shadow-2xs cursor-pointer'
                : 'bg-stone-100 border-stone-200 text-stone-300 cursor-not-allowed'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Squeezed Horizontal Scrollable Carousel Container */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        className="flex items-stretch gap-3 sm:gap-4 overflow-x-auto scrollbar-none scroll-smooth pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {categories.map((cat) => {
          const meta = categoryMetadata[cat.slug] || {
            icon: '🍾',
            tone: 'from-stone-50 to-amber-50',
            borderTone: 'group-hover:border-gold-500',
            accent: 'text-cellar-charcoal',
          };
          const count = cat.product_count || 0;

          return (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className={`group flex-shrink-0 w-[190px] sm:w-[220px] p-3.5 sm:p-4 rounded-md bg-gradient-to-br ${meta.tone} border border-cellar-border ${meta.borderTone} shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between snap-start active:scale-98`}
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="text-2xl sm:text-3xl filter drop-shadow-xs group-hover:scale-110 transition-transform duration-200">
                  {meta.icon}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/90 text-cellar-muted border border-cellar-border/60">
                  {count} {Number(count) === 1 ? 'Bottle' : 'Bottles'}
                </span>
              </div>

              <div>
                <h3 className={`disp text-base sm:text-lg font-bold ${meta.accent} group-hover:text-wine-700 transition leading-snug truncate`}>
                  {cat.name}
                </h3>
                <div className="flex items-center justify-between text-[11px] font-semibold text-cellar-muted group-hover:text-wine-700 mt-1">
                  <span>Explore</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

