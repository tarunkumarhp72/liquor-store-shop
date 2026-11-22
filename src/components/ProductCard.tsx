'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Wine } from 'lucide-react';
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

function BottlePlaceholder() {
  return (
    <div className="flex h-full w-full items-center justify-center" aria-hidden="true">
      <Wine className="h-12 w-12 text-stone-400" strokeWidth={1.25} />
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
        {/* Stock badge */}
        {!product.is_in_stock && (
          <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 bg-red-800 text-white px-2 py-0.5 rounded-sm text-[9px] sm:text-[10px] font-bold uppercase tracking-wider z-30 shadow-xs whitespace-nowrap pointer-events-none">
            Out of Stock
          </div>
        )}

        {/* Bottle image, or a plain placeholder */}
        {!hasValidImageUrl || imageError ? (
          <BottlePlaceholder />
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
              className={`bottle-img max-h-36 sm:max-h-48 w-auto object-contain drop-shadow-md group-hover:scale-105 transition-all duration-300 relative z-0 ${
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
