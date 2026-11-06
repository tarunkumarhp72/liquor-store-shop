'use client';

import React from 'react';
import Link from 'next/link';
import { Truck, Phone, Wine, MapPin, ExternalLink } from 'lucide-react';

export default function MobileBottomBar() {
  const uberEatsUrl = process.env.NEXT_PUBLIC_UBER_EATS_URL || 'https://www.ubereats.com/ca/store/mh2-liquor-store/FurwEWDqXG2txmJ3L1Kcig';

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-cellar-border shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-3 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))]">
      <div className="max-w-md mx-auto grid grid-cols-3 gap-2 items-center">
        {/* 1. Shop Catalog */}
        <Link
          href="/shop"
          className="flex flex-col items-center justify-center py-1.5 px-2 text-cellar-charcoal hover:text-wine-700 active:scale-95 transition rounded-sm"
        >
          <Wine className="w-5 h-5 text-gold-700 mb-0.5" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Catalog</span>
        </Link>

        {/* 2. Call for 15-min Pickup */}
        <a
          href="tel:+14037690061"
          className="flex flex-col items-center justify-center py-1.5 px-2 text-cellar-charcoal hover:text-wine-700 active:scale-95 transition rounded-sm"
        >
          <Phone className="w-5 h-5 text-wine-700 mb-0.5" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Call Pickup</span>
        </a>

        {/* 3. Primary: Order on Uber Eats */}
        <a
          href={uberEatsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 py-2.5 px-2.5 bg-wine-700 hover:bg-wine-800 active:scale-95 text-white rounded-sm font-bold text-[11px] uppercase tracking-wider shadow-sm"
        >
          <Truck className="w-4 h-4 shrink-0" />
          <span>Uber Eats</span>
        </a>
      </div>
    </div>
  );
}

