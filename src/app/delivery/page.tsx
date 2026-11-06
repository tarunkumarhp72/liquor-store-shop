import React from 'react';
import Link from 'next/link';
import { Truck, Store, Clock, ShieldCheck, MapPin, Phone, ExternalLink } from 'lucide-react';

export default function DeliveryPage() {
  const uberEatsUrl = process.env.NEXT_PROD_UBER_EATS_URL || process.env.NEXT_PUBLIC_UBER_EATS_URL || 'https://www.ubereats.com/ca/store/mh2-liquor-store/FurwEWDqXG2txmJ3L1Kcig';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      <div className="border-b border-cellar-border pb-6">
        <div className="text-xs font-bold tracking-widest uppercase text-gold-700 mb-1">
          Fulfillment Services
        </div>
        <h1 className="disp text-3xl sm:text-5xl font-bold text-cellar-charcoal">
          Pickup and Delivery Options
        </h1>
        <p className="text-sm text-cellar-muted mt-2 max-w-2xl">
          Whether you need a chilled six-pack for dinner, celebration champagne, or your favorite spirits, we offer flexible fulfillment every day until 2:00 AM.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Option 1: In-Store Pickup */}
        <div className="bg-white border border-cellar-border p-8 rounded-sm shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-full bg-wine-50 text-wine-700 flex items-center justify-center mb-6">
              <Store className="w-6 h-6" />
            </div>
            <h2 className="disp text-3xl font-bold text-cellar-charcoal mb-3">
              Fast In-Store Pickup
            </h2>
            <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-sm inline-block mb-4">
              100% Free &bull; Ready within 15 minutes
            </div>
            <ul className="space-y-3 text-sm text-cellar-muted mb-6">
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-wine-700 flex-shrink-0 mt-0.5" />
                <span>Pickup available daily from 10:00 AM to 2:00 AM.</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-wine-700 flex-shrink-0 mt-0.5" />
                <span>Dedicated customer parking stalls directly in front of the shop.</span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-wine-700 flex-shrink-0 mt-0.5" />
                <span>Photo ID (18+) required when picking up your reserved items.</span>
              </li>
            </ul>
          </div>
          <Link
            href="/shop"
            className="w-full py-3.5 bg-wine-700 hover:bg-wine-800 text-white font-bold text-xs uppercase tracking-wider text-center rounded-sm transition shadow-sm"
          >
            Browse Bottles for Pickup
          </Link>
        </div>

        {/* Option 2: Local Delivery & Uber Eats */}
        <div className="bg-white border border-cellar-border p-8 rounded-sm shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-full bg-wine-50 text-wine-700 flex items-center justify-center mb-6">
              <Truck className="w-6 h-6" />
            </div>
            <h2 className="disp text-3xl font-bold text-cellar-charcoal mb-3">
              Delivery to Your Door
            </h2>
            <div className="text-xs font-bold text-wine-700 bg-wine-50 px-2.5 py-1 rounded-sm inline-block mb-4">
              Rated 4.6 Stars on Uber Eats (130+ Reviews)
            </div>
            <ul className="space-y-3 text-sm text-cellar-muted mb-6">
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-wine-700 flex-shrink-0 mt-0.5" />
                <span>Instant delivery via our official Uber Eats store partner.</span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-wine-700 flex-shrink-0 mt-0.5" />
                <span>Recipient must be present with valid 18+ government photo ID. Packages cannot be left unattended.</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-wine-700 flex-shrink-0 mt-0.5" />
                <span>Have a large event or special corporate order? Call us at (403) 769-0061.</span>
              </li>
            </ul>
          </div>
          <a
            href={uberEatsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 bg-cellar-charcoal hover:bg-black text-white font-bold text-xs uppercase tracking-wider text-center rounded-sm transition flex items-center justify-center gap-2 shadow-sm"
          >
            <span>Order on Uber Eats</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}

