import React from 'react';
import ProductCardSkeleton from '@/components/ProductCardSkeleton';

export default function Loading() {
  return (
    <div className="space-y-6 sm:space-y-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 animate-pulse-subtle">
      {/* 1. Hero Banner Skeleton */}
      <div className="w-full h-56 sm:h-80 lg:h-96 rounded-sm bg-[#EFE9DD] animate-shimmer relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>

      {/* 2. Highlights Strip Skeleton */}
      <div className="bg-white border border-cellar-border rounded-sm shadow-xs overflow-hidden">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-cellar-border/60 p-2 sm:p-4 gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-2">
              <div className="w-9 h-9 rounded-full bg-[#EFE9DD] animate-shimmer shrink-0" />
              <div className="space-y-1.5 flex-1">
                <div className="h-3 w-3/4 rounded-xs bg-[#EFE9DD] animate-shimmer" />
                <div className="h-2.5 w-1/2 rounded-xs bg-[#EFE9DD] animate-shimmer" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Section Title & Tabs Skeleton */}
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="h-2.5 w-28 rounded-xs bg-[#EFE9DD] animate-shimmer" />
          <div className="h-6 sm:h-8 w-64 rounded-xs bg-[#EFE9DD] animate-shimmer" />
        </div>

        {/* Category Tabs Track Skeleton */}
        <div className="flex items-center gap-2 overflow-hidden py-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="h-9 w-28 rounded-full bg-[#EFE9DD] animate-shimmer shrink-0"
            />
          ))}
        </div>

        {/* 8-Card Product Skeleton Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 pt-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

