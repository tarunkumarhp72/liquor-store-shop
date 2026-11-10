'use client';

import React from 'react';

export function BottleSkeleton({
  className = '',
  size = 'default',
}: {
  className?: string;
  size?: 'default' | 'large';
}) {
  const isLarge = size === 'large';
  return (
    <div className={`absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none ${className}`}>
      {/* Luxury Shimmer Background */}
      <div className="absolute inset-0 animate-shimmer opacity-70" />

      {/* Elegant Bottle Silhouette Outline */}
      <div
        className={`relative z-10 opacity-35 flex flex-col items-center animate-pulse-subtle transition-transform ${
          isLarge ? 'scale-150 sm:scale-[1.9]' : ''
        }`}
      >
        {/* Cork / Cap */}
        <div className="w-2.5 h-3.5 bg-gold-700/60 rounded-t-xs" />
        {/* Neck */}
        <div className="w-3.5 h-8 bg-gold-700/50" />
        {/* Shoulder */}
        <div className="w-10 h-6 bg-gold-700/40 rounded-t-2xl" />
        {/* Body */}
        <div className="w-10 h-24 sm:h-28 bg-gold-700/35 rounded-b-xs" />
      </div>
    </div>
  );
}

export default function ProductCardSkeleton() {
  return (
    <div className="flex flex-col bg-white border border-cellar-border/60 rounded-sm overflow-hidden h-full shadow-2xs">
      {/* Top Image Showcase Skeleton */}
      <div className="relative h-44 sm:h-56 w-full flex items-center justify-center p-3 sm:p-4 bg-[#F8F5EF] overflow-hidden">
        {/* Bottle Skeleton with Shimmer */}
        <BottleSkeleton />

        {/* Rating Pill Skeleton */}
        <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 w-12 h-5 rounded-full bg-white/70 backdrop-blur-xs border border-cellar-border/40 z-20" />
      </div>

      {/* Product Details Skeleton */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between bg-white space-y-3">
        <div className="space-y-2">
          {/* Category & Volume */}
          <div className="flex items-center justify-between">
            <div className="h-2.5 w-16 rounded-xs bg-[#EFE9DD] animate-shimmer" />
            <div className="h-2 w-10 rounded-xs bg-[#EFE9DD] animate-shimmer" />
          </div>

          {/* Title Line 1 & Line 2 */}
          <div className="h-3.5 w-4/5 rounded-xs bg-[#EFE9DD] animate-shimmer mt-1.5" />
          <div className="h-3.5 w-2/3 rounded-xs bg-[#EFE9DD] animate-shimmer" />

          {/* Origin & ABV */}
          <div className="flex items-center gap-2 pt-1">
            <div className="h-2.5 w-16 rounded-xs bg-[#EFE9DD] animate-shimmer" />
            <div className="w-1 h-1 rounded-full bg-cellar-border" />
            <div className="h-2.5 w-10 rounded-xs bg-[#EFE9DD] animate-shimmer" />
          </div>
        </div>

        {/* Price & Action Skeleton */}
        <div className="pt-3 border-t border-cellar-border/60 flex items-center justify-between gap-2">
          <div className="space-y-1">
            <div className="h-2 w-8 rounded-xs bg-[#EFE9DD] animate-shimmer" />
            <div className="h-4 w-14 rounded-xs bg-[#EFE9DD] animate-shimmer" />
          </div>
          <div className="h-8 w-16 rounded-sm bg-[#EFE9DD] animate-shimmer" />
        </div>
      </div>
    </div>
  );
}
