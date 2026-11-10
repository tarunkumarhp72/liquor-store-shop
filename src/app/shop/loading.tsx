import React from 'react';
import ProductCardSkeleton from '@/components/ProductCardSkeleton';

export default function ShopLoading() {
  return (
    <div className="max-w-[1680px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-4 sm:py-8 animate-pulse-subtle">
      {/* 1. Header & Breadcrumbs Skeleton */}
      <div className="mb-4 sm:mb-6 space-y-2">
        <div className="h-3 w-40 rounded-xs bg-[#EFE9DD] animate-shimmer" />
        <div className="h-7 sm:h-9 w-64 sm:w-80 rounded-xs bg-[#EFE9DD] animate-shimmer" />
        <div className="h-4 w-full max-w-lg rounded-xs bg-[#EFE9DD] animate-shimmer" />
      </div>

      {/* 2. Search & Sort Bar Skeleton */}
      <div className="mb-6 p-2 sm:p-2.5 bg-white border border-cellar-border rounded-sm shadow-xs flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
        <div className="flex-1 h-10 rounded-sm bg-[#EFE9DD] animate-shimmer" />
        <div className="w-full sm:w-48 h-10 rounded-sm bg-[#EFE9DD] animate-shimmer shrink-0" />
      </div>

      {/* 3. Catalog 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8 items-start">
        {/* Left Sticky Sidebar Skeleton (Desktop) */}
        <aside className="hidden lg:block lg:col-span-1 space-y-5">
          <div className="bg-white border border-cellar-border rounded-sm p-4 space-y-4 shadow-xs">
            {/* Filter Title */}
            <div className="h-3 w-28 rounded-xs bg-[#EFE9DD] animate-shimmer border-b border-cellar-border/60 pb-3" />

            {/* Category Skeleton List */}
            <div className="space-y-2 pt-2">
              <div className="h-2.5 w-24 rounded-xs bg-[#EFE9DD] animate-shimmer" />
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-xs bg-[#FBF8F3]">
                  <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 rounded-xs bg-[#EFE9DD] animate-shimmer" />
                    <div className="h-3 w-20 rounded-xs bg-[#EFE9DD] animate-shimmer" />
                  </div>
                  <div className="w-5 h-4 rounded-full bg-[#EFE9DD] animate-shimmer" />
                </div>
              ))}
            </div>

            {/* Availability Toggle Skeleton */}
            <div className="pt-3 border-t border-cellar-border/60 space-y-2">
              <div className="h-2.5 w-24 rounded-xs bg-[#EFE9DD] animate-shimmer" />
              <div className="h-9 w-full rounded-xs bg-[#FBF8F3] border border-cellar-border/40" />
            </div>

            {/* Price Ranges Skeleton */}
            <div className="pt-3 border-t border-cellar-border/60 space-y-2">
              <div className="h-2.5 w-20 rounded-xs bg-[#EFE9DD] animate-shimmer" />
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2 py-1">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#EFE9DD] animate-shimmer" />
                  <div className="h-3 w-24 rounded-xs bg-[#EFE9DD] animate-shimmer" />
                </div>
              ))}
            </div>
          </div>

          {/* Quick Pickup Card Skeleton */}
          <div className="h-36 rounded-sm bg-[#1F1B18] animate-shimmer" />
        </aside>

        {/* Right Main Grid Skeleton */}
        <section className="lg:col-span-3 space-y-4">
          {/* Top Bar Skeleton */}
          <div className="flex items-center justify-between py-1">
            <div className="h-3 w-36 rounded-xs bg-[#EFE9DD] animate-shimmer" />
            <div className="h-2.5 w-28 rounded-xs bg-[#EFE9DD] animate-shimmer" />
          </div>

          {/* 10-Card Responsive Product Skeleton Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 gap-3 sm:gap-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <ProductCardSkeleton key={`shop-load-skel-${i}`} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

