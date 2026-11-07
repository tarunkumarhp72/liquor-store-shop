import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Wine, Clock, Star, MapPin, Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Our Cellar | Neighbourhood Bottle Shop in Calgary NW',
  description:
    'Learn about MH2 Liquor Store on 4th Street NW, Calgary. Our heritage, curated bottle allocations, and commitment to service open late 7 days a week until 2 AM.',
  alternates: {
    canonical: 'https://www.mh2liquorstore.ca/about',
  },
  openGraph: {
    title: 'About MH2 Liquor Store | NW Calgary Bottle Shop',
    description:
      'Learn about MH2 Liquor Store on 4th Street NW, Calgary. Curated wines, spirits, and craft beers open late.',
    url: 'https://www.mh2liquorstore.ca/about',
  },
};

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      <div className="border-b border-cellar-border pb-6 max-w-3xl">
        <div className="text-xs font-bold tracking-widest uppercase text-gold-700 mb-1">
          Our Heritage & Passion
        </div>
        <h1 className="disp text-3xl sm:text-5xl font-bold text-cellar-charcoal">
          About MH2 Liquor Store
        </h1>
        <p className="text-base text-cellar-muted mt-3 leading-relaxed">
          More than just a bottle shop—we are your neighbourhood cellar dedicated to quality, late-night convenience, and personal recommendations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6 text-cellar-muted text-sm sm:text-base leading-relaxed">
          <h2 className="disp text-3xl font-bold text-cellar-charcoal">
            Rooted in NW Calgary, Serving Enthusiasts Everywhere
          </h2>
          <p>
            Located at <strong>3106 A 4th Street NW</strong>, MH2 Liquor Store was built on a simple philosophy: providing an exceptional, well-curated beverage selection with extended, reliable hours. Whether you need a crisp craft beer on a Tuesday evening or a rare Champagne vintage for New Year&apos;s Eve, our doors stay open until <strong>2:00 AM every single night of the year</strong>.
          </p>
          <p>
            We take pride in stocking diverse selections that cater to every taste and budget. From iconic European terroirs (Bordeaux, Burgundy, Rioja, and Tuscany) to California classics, rare Irish whiskeys, artisanal mezcals, and local craft breweries, our shelves are constantly refreshed with new releases and customer favorites.
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-block px-7 py-3.5 bg-wine-700 hover:bg-wine-800 text-white font-bold text-xs uppercase tracking-wider rounded-sm transition shadow-sm"
            >
              Explore Cellar Inventory
            </Link>
          </div>
        </div>

        <div className="lg:col-span-5 bg-white border border-cellar-border p-8 rounded-sm shadow-xs space-y-6">
          <div className="disp text-2xl font-bold text-cellar-charcoal border-b border-cellar-border pb-3">
            Why Our Customers Love Us
          </div>
          <div className="space-y-4 text-xs sm:text-sm text-cellar-muted">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-gold-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-cellar-charcoal">Open Until 2:00 AM Daily:</strong> Never get caught empty-handed when hosting dinners or celebrations.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Star className="w-5 h-5 text-gold-600 flex-shrink-0 mt-0.5 fill-gold-500" />
              <div>
                <strong className="text-cellar-charcoal">4.6 Star Rating:</strong> Backed by over 130+ happy customers on Uber Eats and Google.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gold-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-cellar-charcoal">Hassle-Free Parking:</strong> Convenient parking directly in front of the store beside Pad Thai.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Wine className="w-5 h-5 text-gold-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-cellar-charcoal">Curated Allocations:</strong> Knowledgeable staff ready to assist with wine pairings and cocktail ingredients.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

