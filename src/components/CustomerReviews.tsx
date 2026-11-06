'use client';

import React, { useState } from 'react';
import { Star, CheckCircle, ExternalLink, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  source: 'Google Maps' | 'Uber Eats';
  badge?: string;
  text: string;
}

const reviewsData: Review[] = [
  {
    id: '1',
    author: 'Zachary Wall',
    rating: 5,
    date: '3 months ago',
    source: 'Google Maps',
    badge: 'Local Guide',
    text: 'Great selection of cold beers, coolers, and high-end spirits. Friendly staff always ready to help and recommend excellent wines!',
  },
  {
    id: '2',
    author: 'Joshua Ferguson',
    rating: 5,
    date: '1 month ago',
    source: 'Google Maps',
    badge: 'Verified Buyer',
    text: 'Open late till 2:00 AM every single day. Super convenient location on 4th St NW, clean store, and great prices. Highly recommended in Calgary NW!',
  },
  {
    id: '3',
    author: 'Adrian Cornish',
    rating: 5,
    date: '2 months ago',
    source: 'Google Maps',
    badge: 'Local Customer',
    text: 'Fast 15-minute pickup, free parking right in front of the door, and wide variety of tequila and chilled beer. Best liquor store in the neighborhood.',
  },
  {
    id: '4',
    author: 'JOd Devil',
    rating: 5,
    date: '4 months ago',
    source: 'Google Maps',
    badge: 'Verified Customer',
    text: 'Quick curbside pickup and very polite, helpful service every time I visit. Highly reliable for late-night liquor orders.',
  },
  {
    id: '5',
    author: 'Navneet K',
    rating: 5,
    date: 'Recent',
    source: 'Google Maps',
    badge: 'Verified Buyer',
    text: 'Top notch service, great location right beside Pad Thai. Always find my favorite chilled champagne and wine without hassle.',
  },
  {
    id: '6',
    author: 'Sean O’Connor',
    rating: 5,
    date: 'Recent',
    source: 'Uber Eats',
    badge: 'Delivery Order',
    text: 'Lightning fast Uber Eats delivery. Cold beers arrived ice-cold and bottles were packed securely with care.',
  },
];

export default function CustomerReviews() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const googleMapsUrl = process.env.NEXT_PROD_GOOGLE_MAPS_URL || process.env.NEXT_PUBLIC_GOOGLE_MAPS_URL || 'https://maps.app.goo.gl/3STi9P9FtXK4aUL28?g_st=aw';
  const uberEatsUrl = process.env.NEXT_PROD_UBER_EATS_URL || process.env.NEXT_PUBLIC_UBER_EATS_URL || 'https://www.ubereats.com/ca/store/mh2-liquor-store/FurwEWDqXG2txmJ3L1Kcig';

  return (
    <div className="bg-[#FAF7F2] border-y border-cellar-border py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-12">
          <div>
            <div className="text-[11px] sm:text-xs font-bold tracking-widest uppercase text-gold-700 mb-1 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified Customer Feedback</span>
            </div>
            <h2 className="disp text-2xl sm:text-4xl font-bold text-cellar-charcoal">
              Trusted by Calgary Liquor Lovers
            </h2>
            <p className="text-xs sm:text-sm text-cellar-muted mt-1 max-w-xl">
              Real reviews from neighbours on 4th St NW and satisfied delivery customers across Calgary.
            </p>
          </div>

          {/* Social Proof Stats Cards */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Google Rating Badge */}
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border border-cellar-border hover:border-gold-500 rounded-lg p-3 shadow-xs flex items-center gap-3 transition group"
            >
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-base shrink-0 group-hover:scale-105 transition-transform">
                G
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-sm text-cellar-charcoal">4.0</span>
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
                <div className="text-[10px] text-cellar-muted flex items-center gap-1">
                  <span>46+ on Google Maps</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </div>
              </div>
            </a>

            {/* Uber Eats Rating Badge */}
            <a
              href={uberEatsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border border-cellar-border hover:border-wine-500 rounded-lg p-3 shadow-xs flex items-center gap-3 transition group"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-base shrink-0 group-hover:scale-105 transition-transform">
                ★
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-sm text-cellar-charcoal">4.7</span>
                  <div className="flex text-emerald-600">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-emerald-500 text-emerald-500" />
                    ))}
                  </div>
                </div>
                <div className="text-[10px] text-cellar-muted flex items-center gap-1">
                  <span>140+ on Uber Eats</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </div>
              </div>
            </a>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {reviewsData.map((rev) => (
            <div
              key={rev.id}
              className="bg-white border border-cellar-border rounded-lg p-5 sm:p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                {/* Rating stars & Quote */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cellar-muted px-2 py-0.5 bg-cellar-cream rounded-sm">
                    {rev.source}
                  </span>
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-cellar-charcoal leading-relaxed italic text-zinc-700">
                  &ldquo;{rev.text}&rdquo;
                </p>
              </div>

              {/* Reviewer Details */}
              <div className="pt-4 mt-4 border-t border-cellar-border/60 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-cellar-charcoal">{rev.author}</h4>
                  <span className="text-[10px] text-cellar-muted">{rev.badge || rev.date}</span>
                </div>
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-bold" title="Verified Customer">
                  ✓
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View on Google Maps Link */}
        <div className="mt-8 text-center">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-bold text-wine-700 hover:text-wine-800 transition"
          >
            <span>Read all customer reviews on Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}

