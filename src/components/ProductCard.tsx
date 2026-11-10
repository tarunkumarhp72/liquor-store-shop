'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ArrowRight, Wine, Sparkles } from 'lucide-react';
import { BottleSkeleton } from './ProductCardSkeleton';

export interface Product {
  id: string;
  name: string;
  slug: string;
  category_slug: string;
  price: number | string;
  stock_quantity: number;
  is_in_stock: boolean;
  rating: number;
  review_count: number;
  abv: string;
  volume: string;
  country: string;
  region: string;
  image_url: string;
  category_name?: string;
  short_description?: string;
  tone_class?: string;
}

function LuxuryBottlePlaceholder({ categorySlug }: { categorySlug: string }) {
  let categoryLabel = 'CURATED BOTTLE';
  if (categorySlug === 'wine') categoryLabel = 'ESTATE WINE';
  else if (categorySlug === 'champagne') categoryLabel = 'CHAMPAGNE RESERVE';
  else if (categorySlug === 'whiskey') categoryLabel = 'BOURBON & SCOTCH';
  else if (categorySlug === 'tequila') categoryLabel = 'ARTISANAL AGAVE';
  else if (categorySlug === 'beer') categoryLabel = 'COLD CRAFT BREW';
  else if (categorySlug === 'vodka' || categorySlug === 'gins' || categorySlug === 'rums') categoryLabel = 'PREMIUM SPIRIT';

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-2 sm:p-3 select-none">
      {/* Background Radial Luxury Glow */}
      <div className="absolute inset-0 bg-radial from-white/70 via-transparent to-transparent opacity-80" />

      {/* Luxury Bottle Silhouette with Metallic Gold Detailing */}
      <div className="relative z-10 flex flex-col items-center transition-transform duration-300 group-hover:scale-105 group-hover:-translate-y-1">
        {/* Embossed Luxury Bottle Seal */}
        <div className="relative w-24 h-36 sm:w-28 sm:h-40 rounded-t-3xl rounded-b-sm border border-gold-600/40 bg-gradient-to-b from-white/95 via-[#FAF7F0] to-[#EFE8DA] shadow-sm flex flex-col items-center justify-between p-2">
          {/* Top Foil Cap */}
          <div className="w-6 h-3 -mt-3.5 bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600 rounded-t-xs shadow-2xs border-t border-gold-300" />

          {/* Neck Gold Ring */}
          <div className="w-8 h-1 bg-gold-600/50 my-0.5 rounded-full" />

          {/* Center Monogram Crest */}
          <div className="flex flex-col items-center my-auto px-1 text-center">
            <div className="w-9 h-9 rounded-full border border-gold-500/60 bg-white/95 flex items-center justify-center shadow-2xs mb-1.5">
              {categorySlug === 'champagne' ? (
                <Sparkles className="w-4 h-4 text-gold-600" />
              ) : (
                <Wine className="w-4 h-4 text-wine-800" />
              )}
            </div>
            <span className="text-[8px] font-bold tracking-widest uppercase text-gold-800 font-mono">
              MH2 CELLAR
            </span>
            <span className="text-[6.5px] sm:text-[7px] tracking-wider uppercase text-cellar-muted font-semibold mt-0.5 max-w-[85px] truncate">
              {categoryLabel}
            </span>
          </div>

          {/* Bottom Vintage Stamp */}
          <div className="w-full pt-1 border-t border-gold-500/30 flex items-center justify-between px-1 text-[7px] text-gold-700 font-mono">
            <span>CALGARY</span>
            <span>&bull;</span>
            <span>NW</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductCard({ product }: { product: Product }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const priceNum = typeof product.price === 'string' ? parseFloat(product.price) : product.price;

  // Determine background tone
  let toneClass = 'bg-[#EBDADD]'; // default wine
  if (product.category_slug === 'beer') toneClass = 'bg-[#F0E6D0]';
  else if (['whiskey', 'tequila', 'vodka', 'gins', 'rums'].includes(product.category_slug)) toneClass = 'bg-[#E3E5E4]';
  else if (product.category_slug === 'champagne') toneClass = 'bg-[#F3ECDD]';

  const hasValidImageUrl = Boolean(product.image_url && product.image_url.trim().length > 5);

  return (
    <div className="product-card group flex flex-col bg-white border border-cellar-border hover:border-gold-600 rounded-sm overflow-hidden h-full transition duration-200 shadow-2xs hover:shadow-md">
      {/* Top Image Showcase */}
      <Link
        href={`/shop/${product.slug}`}
        className={`relative h-44 sm:h-56 w-full flex items-center justify-center p-3 sm:p-4 ${toneClass} overflow-hidden cursor-pointer`}
      >
        {/* Rating pill */}
        <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold text-cellar-charcoal flex items-center gap-1 shadow-xs z-10 border border-black/5">
          <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-gold-500 text-gold-500" />
          <span>{product.rating}</span>
        </div>

        {/* Stock badge */}
        {!product.is_in_stock && (
          <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 bg-red-800 text-white px-2 py-0.5 rounded-sm text-[9px] sm:text-[10px] font-bold uppercase tracking-wider z-10 shadow-xs">
            Out of Stock
          </div>
        )}

        {/* Bottle Image OR Luxury Fallback Placeholder */}
        {!hasValidImageUrl || imageError ? (
          <LuxuryBottlePlaceholder categorySlug={product.category_slug} />
        ) : (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Bottle skeleton with shimmer while image loads */}
            {!imageLoaded && <BottleSkeleton />}
            <Image
              src={product.image_url}
              alt={product.name}
              width={160}
              height={200}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              quality={85}
              className={`bottle-img max-h-36 sm:max-h-48 w-auto object-contain drop-shadow-md group-hover:scale-105 transition-all duration-300 relative z-10 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          </div>
        )}
      </Link>

      {/* Product Details */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between bg-white">
        <div>
          <div className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-gold-700 mb-1 flex items-center justify-between">
            <span className="truncate">{product.category_slug}</span>
            <span className="text-cellar-muted font-normal lowercase ml-1 shrink-0 text-[10px]">{product.volume}</span>
          </div>

          <Link href={`/shop/${product.slug}`} className="block">
            <h3 className="disp text-sm sm:text-base font-bold text-cellar-charcoal leading-snug group-hover:text-wine-700 transition line-clamp-2 min-h-[2.5rem] sm:min-h-[2.75rem]">
              {product.name}
            </h3>
          </Link>

          <div className="text-[11px] text-cellar-muted mt-1 flex items-center gap-1.5 truncate">
            <span className="truncate">{product.country || 'Imported'}</span>
            <span>&bull;</span>
            <span className="font-mono text-[10px] shrink-0">{product.abv}</span>
          </div>
        </div>

        {/* Price & Primary Action */}
        <div className="mt-3 pt-2.5 border-t border-cellar-border/60 flex items-center justify-between gap-2">
          <div>
            <div className="text-[9px] sm:text-[10px] text-cellar-muted uppercase font-medium">Price</div>
            <div className="text-sm sm:text-base font-bold text-wine-800">${priceNum.toFixed(2)}</div>
          </div>

          <Link
            href={`/shop/${product.slug}`}
            className="min-h-[36px] sm:min-h-[38px] px-2.5 sm:px-3 py-1.5 rounded-sm text-[10px] sm:text-xs font-bold tracking-wider uppercase transition flex items-center gap-1 bg-cellar-cream hover:bg-wine-700 hover:text-white text-cellar-charcoal border border-cellar-border hover:border-wine-700 active:scale-98"
          >
            <span>View</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
