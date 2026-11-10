'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { BottleSkeleton } from '@/components/ProductCardSkeleton';
import { Wine, Beer, Sparkles } from 'lucide-react';

interface ProductDetailImageProps {
  imageUrl?: string | null;
  productName: string;
  toneClass: string;
  categorySlug?: string;
}

export default function ProductDetailImage({
  imageUrl,
  productName,
  toneClass,
  categorySlug = 'wine',
}: ProductDetailImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const hasValidImage =
    imageUrl &&
    typeof imageUrl === 'string' &&
    imageUrl.trim().length > 0 &&
    (imageUrl.startsWith('http') || imageUrl.startsWith('/'));

  const getCategoryIcon = () => {
    switch (categorySlug) {
      case 'beer':
        return <Beer className="w-8 h-8 text-gold-600/70" />;
      case 'champagne':
        return <Sparkles className="w-8 h-8 text-gold-600/70" />;
      default:
        return <Wine className="w-8 h-8 text-wine-700/70" />;
    }
  };

  return (
    <div
      className={`lg:col-span-5 ${toneClass} rounded-sm p-6 sm:p-8 flex items-center justify-center min-h-[320px] sm:min-h-[440px] relative overflow-hidden border border-black/5 select-none`}
    >
      {/* 1. Shimmering Bottle Skeleton while high-res image is fetching */}
      {!imageLoaded && !imageError && (
        <BottleSkeleton size="large" className="z-0" />
      )}

      {/* 2. Main Product Image with Smooth Luxury Fade-in */}
      {hasValidImage && !imageError ? (
        <Image
          src={imageUrl}
          alt={productName}
          width={360}
          height={460}
          priority
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 400px"
          quality={90}
          className={`max-h-[290px] sm:max-h-[400px] w-auto object-contain drop-shadow-2xl transition-all duration-500 relative z-10 ${
            imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
        />
      ) : (
        /* 3. Luxury Fallback Bottle Card when Image is missing or fails to load */
        <div className="flex flex-col items-center justify-center text-center p-6 space-y-4 relative z-10 animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-white/70 backdrop-blur-xs border border-gold-500/30 flex items-center justify-center shadow-md">
            {getCategoryIcon()}
          </div>
          <div className="space-y-1 max-w-[240px]">
            <div className="text-[11px] font-bold uppercase tracking-widest text-gold-800">
              {categorySlug} Collection
            </div>
            <div className="disp text-sm font-semibold text-cellar-charcoal line-clamp-2">
              {productName}
            </div>
            <div className="text-[10px] text-cellar-muted">
              Bottle Photo Updating Soon
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

