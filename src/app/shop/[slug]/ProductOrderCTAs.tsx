'use client';

import React, { useState } from 'react';
import { Truck, Phone, ExternalLink } from 'lucide-react';
import CallStoreModal from '@/components/CallStoreModal';

interface ProductOrderCTAsProps {
  uberEatsUrl: string;
}

export default function ProductOrderCTAs({ uberEatsUrl }: ProductOrderCTAsProps) {
  const [callModalOpen, setCallModalOpen] = useState(false);

  return (
    <>
      <CallStoreModal isOpen={callModalOpen} onClose={() => setCallModalOpen(false)} />

      <div className="space-y-3 pt-2">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <a
            href={uberEatsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[46px] px-6 py-3 bg-wine-700 hover:bg-wine-800 active:scale-98 text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-md transition flex items-center justify-center gap-2 shadow-sm text-center"
          >
            <Truck className="w-4 h-4 text-gold-400" />
            <span>Order Delivery on Uber Eats</span>
            <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-80" />
          </a>

          <button
            type="button"
            onClick={() => setCallModalOpen(true)}
            className="min-h-[46px] px-6 py-3 bg-cellar-cream hover:bg-white text-cellar-charcoal border border-cellar-border hover:border-gold-600 font-bold text-xs sm:text-sm uppercase tracking-wider rounded-md transition flex items-center justify-center gap-2 text-center cursor-pointer shadow-2xs"
          >
            <Phone className="w-4 h-4 text-wine-700" />
            <span>Call to Reserve: (403) 769-0061</span>
          </button>
        </div>

        <p className="text-[11px] text-cellar-muted">
          *In-store pickup available daily 10 AM to 2 AM at 3106 A 4 St NW, Calgary. Free parking directly in front.
        </p>
      </div>
    </>
  );
}

