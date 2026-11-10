'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

interface Slide {
  id: number;
  badge: string;
  badgeColor: string;
  title: string;
  highlight: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
  bgGradient: string;
  icon: string;
}

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const uberEatsUrl = process.env.NEXT_PROD_UBER_EATS_URL || process.env.NEXT_PUBLIC_UBER_EATS_URL || '#';

  const slides: Slide[] = [
    {
      id: 0,
      badge: 'Open Daily 10 AM – 2 AM',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      title: 'Late Night Wine &',
      highlight: 'Cold Craft Beer.',
      subtitle: 'Curated bottles, chilled craft packs & everyday essentials in NW Calgary.',
      ctaText: 'Shop All Bottles',
      ctaHref: '/shop',
      bgGradient: 'radial-gradient(ellipse at 85% 35%, #5E2638 0%, #2B181F 55%, #151012 100%)',
      icon: '🍷',
    },
    {
      id: 1,
      badge: 'Fast Delivery & Pickup',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      title: 'Doorstep Delivery or',
      highlight: '15-Minute Pickup.',
      subtitle: 'Order right to your door on Uber Eats or call ahead for curbside pickup.',
      ctaText: 'Order on Uber Eats',
      ctaHref: uberEatsUrl,
      bgGradient: 'radial-gradient(ellipse at 85% 35%, #1F4538 0%, #172922 55%, #0E1614 100%)',
      icon: '🚗',
    },
    {
      id: 2,
      badge: 'Prestige Cellar Allocations',
      badgeColor: 'bg-gold-500/20 text-gold-300 border-gold-500/30',
      title: 'Rare Whiskeys &',
      highlight: 'Vintage Champagnes.',
      subtitle: 'Grand Cru cuvées, rare bourbon, and collectible sipping spirits.',
      ctaText: 'Explore Champagne & Bourbon',
      ctaHref: '/shop?category=champagne',
      bgGradient: 'radial-gradient(ellipse at 85% 35%, #52381E 0%, #291F14 55%, #14100C 100%)',
      icon: '🍾',
    },
  ];

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  const slide = slides[current];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-6">
      {/* GotoLiquorStore-Style Clean Compact Promotional Card Banner */}
      <div
        className="relative rounded-lg sm:rounded-xl overflow-hidden shadow-xl border border-white/10"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.01 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.x < -35) {
                setCurrent((prev) => (prev + 1) % slides.length);
              } else if (info.offset.x > 35) {
                setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
              }
            }}
            className="relative min-h-[210px] sm:min-h-[270px] lg:min-h-[310px] flex items-center p-5 sm:p-8 lg:p-12"
            style={{ background: slide.bgGradient }}
          >
            {/* Background Decorative Ambient Blur & Subtle Grid */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C9AE72_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

            {/* Content Container: Clean, uncluttered, neat */}
            <div className="relative z-10 max-w-xl">
              {/* Badge */}
              <div className={`inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border mb-2 sm:mb-3 backdrop-blur-md ${slide.badgeColor}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                <span>{slide.badge}</span>
              </div>

              {/* Title: Fluid, bold, punchy */}
              <h1 className="disp text-2xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight sm:leading-[1.15]">
                {slide.title}{' '}
                <span className="text-gold-400 block sm:inline">{slide.highlight}</span>
              </h1>

              {/* Subtitle: Short, 1-2 lines */}
              <p className="text-xs sm:text-sm lg:text-base text-[#D4CCC0] mt-1.5 sm:mt-2.5 max-w-md leading-relaxed line-clamp-2 sm:line-clamp-none">
                {slide.subtitle}
              </p>

              {/* Single Primary Action CTA Button */}
              <div className="mt-3.5 sm:mt-5">
                <Link
                  href={slide.ctaHref}
                  target={slide.ctaHref.startsWith('http') ? '_blank' : '_self'}
                  rel={slide.ctaHref.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-gold-500 hover:bg-gold-400 active:scale-95 text-cellar-charcoal font-bold text-xs uppercase tracking-wider rounded-sm transition-all shadow-md"
                >
                  <span>{slide.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Right Side Visual Graphic Emblem */}
            <div className="absolute right-4 sm:right-8 lg:right-16 top-1/2 -translate-y-1/2 pointer-events-none opacity-20 sm:opacity-30 lg:opacity-40">
              <span className="text-7xl sm:text-9xl filter drop-shadow-2xl select-none">
                {slide.icon}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Minimalist Slide Progress Dots (Bottom Center) */}
        <div className="absolute bottom-2.5 sm:bottom-4 left-0 right-0 flex justify-center items-center gap-1.5 z-20">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrent(idx)}
              className={`h-1.5 sm:h-2 transition-all rounded-full cursor-pointer ${
                current === idx
                  ? 'w-6 sm:w-8 bg-gold-400'
                  : 'w-1.5 sm:w-2 bg-white/35 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Subtle Prev/Next Arrow Buttons (Hidden on small mobile, visible on tablet/desktop) */}
        <button
          onClick={() => setCurrent((prev) => (prev - 1 + slides.length) % slides.length)}
          className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/30 hover:bg-black/60 text-white border border-white/20 items-center justify-center transition cursor-pointer"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => setCurrent((prev) => (prev + 1) % slides.length)}
          className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/30 hover:bg-black/60 text-white border border-white/20 items-center justify-center transition cursor-pointer"
          aria-label="Next slide"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}
