import React from 'react';
import ProductCardSkeleton, { BottleSkeleton } from '@/components/ProductCardSkeleton';

export default function ProductDetailLoading() {
  return (
    <div className="max-w-[1680px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6 sm:py-12 animate-pulse-subtle">
      {/* 1. Breadcrumb Navigation Skeleton */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="h-4 w-32 rounded-xs bg-[#EFE9DD] animate-shimmer" />
        <div className="h-4 w-44 rounded-xs bg-[#EFE9DD] animate-shimmer" />
      </div>

      {/* 2. Main Product Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 bg-white border border-cellar-border p-4 sm:p-8 lg:p-10 rounded-sm shadow-xs mb-12">
        {/* Left Column: Big Bottle Showcase with Shimmering Bottle Skeleton */}
        <div className="lg:col-span-5 bg-[#F8F5EF] rounded-sm p-6 sm:p-8 flex items-center justify-center min-h-[300px] sm:min-h-[440px] relative overflow-hidden border border-black/5">
          <BottleSkeleton size="large" />
        </div>

        {/* Right Column: Specs & Purchasing CTAs Skeleton */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div>
            {/* Category & Volume */}
            <div className="h-3 w-36 rounded-xs bg-[#EFE9DD] animate-shimmer mb-3" />

            {/* Product Title */}
            <div className="space-y-2 mb-4">
              <div className="h-7 sm:h-10 w-4/5 rounded-xs bg-[#EFE9DD] animate-shimmer" />
              <div className="h-7 sm:h-10 w-1/2 rounded-xs bg-[#EFE9DD] animate-shimmer" />
            </div>

            {/* Rating & In-Stock Badges */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <div className="h-6 w-28 rounded-full bg-[#EFE9DD] animate-shimmer" />
              <div className="h-6 w-44 rounded-full bg-[#EFE9DD] animate-shimmer" />
            </div>

            {/* Price Display Skeleton */}
            <div className="h-9 w-36 rounded-xs bg-[#EFE9DD] animate-shimmer mb-6" />

            {/* Tasting Notes Box Skeleton */}
            <div className="p-4 rounded-sm border border-cellar-border/60 bg-cellar-cream/40 space-y-2 mb-6">
              <div className="h-2.5 w-32 rounded-xs bg-[#EFE9DD] animate-shimmer" />
              <div className="h-3 w-full rounded-xs bg-[#EFE9DD] animate-shimmer" />
              <div className="h-3 w-4/5 rounded-xs bg-[#EFE9DD] animate-shimmer" />
            </div>

            {/* Bottle Specifications Matrix (4 items) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 py-3 border-y border-cellar-border mb-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-2.5 bg-cellar-cream rounded-sm space-y-1">
                  <div className="h-2.5 w-12 rounded-xs bg-[#EFE9DD] animate-shimmer" />
                  <div className="h-3.5 w-16 rounded-xs bg-[#EFE9DD] animate-shimmer" />
                </div>
              ))}
            </div>

            {/* Order Buttons Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div className="h-12 rounded-sm bg-[#5C1D24]/30 animate-shimmer" />
              <div className="h-12 rounded-sm bg-[#EFE9DD] animate-shimmer" />
            </div>
          </div>

          {/* Compliance & Store Perks */}
          <div className="space-y-2 pt-4 border-t border-cellar-border/60">
            <div className="h-3 w-3/4 rounded-xs bg-[#EFE9DD] animate-shimmer" />
            <div className="h-3 w-2/3 rounded-xs bg-[#EFE9DD] animate-shimmer" />
            <div className="h-3 w-4/5 rounded-xs bg-[#EFE9DD] animate-shimmer" />
          </div>
        </div>
      </div>

      {/* 3. Related Products Skeleton Section */}
      <section className="mt-12 sm:mt-16">
        <div className="mb-6 space-y-1.5">
          <div className="h-3 w-36 rounded-xs bg-[#EFE9DD] animate-shimmer" />
          <div className="h-6 sm:h-8 w-56 rounded-xs bg-[#EFE9DD] animate-shimmer" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductCardSkeleton key={`rel-skel-${i}`} />
          ))}
        </div>
      </section>
    </div>
  );
}

