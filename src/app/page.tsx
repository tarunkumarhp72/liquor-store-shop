import React from 'react';
import Link from 'next/link';
import { Clock, Truck, Car, Star, ArrowRight, ShieldCheck, MapPin, Sparkles } from 'lucide-react';
import HeroSlider from '@/components/HeroSlider';
import HomeShopTabs from '@/components/HomeShopTabs';
import CategoryCarousel from '@/components/CategoryCarousel';
import CustomerReviews from '@/components/CustomerReviews';
import { query } from '@/lib/db';
import { Product } from '@/components/ProductCard';

export const revalidate = 60; // ISR cache revalidation every minute

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const products = await query<Product>(`
      SELECT id, name, slug, category_slug, price, stock_quantity,
             is_in_stock, rating, review_count, abv, volume, country, region, image_url
      FROM public.products
      WHERE is_in_stock = true
      ORDER BY featured DESC, rating DESC
      LIMIT 24;
    `);
    return products;
  } catch (err) {
    console.error('Failed to load featured products:', err);
    return [];
  }
}

async function getCategories() {
  try {
    return await query(`
      SELECT c.*, COUNT(p.id) as product_count
      FROM public.categories c
      LEFT JOIN public.products p ON c.slug = p.category_slug
      GROUP BY c.id
      ORDER BY c.sort_order ASC;
    `);
  } catch (err) {
    console.error('Failed to load categories:', err);
    return [];
  }
}

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ]);

  const uberEatsUrl = process.env.NEXT_PUBLIC_UBER_EATS_URL || 'https://www.ubereats.com/ca/store/mh2-liquor-store/FurwEWDqXG2txmJ3L1Kcig';

  return (
    <div className="space-y-6 sm:space-y-12 pb-16">
      {/* 1. Hero Carousel - GotoLiquorStore-style neat, clean promotional banner */}
      <HeroSlider />

      {/* 2. Highlights Strip - 2x2 on Mobile, 4 columns on Desktop (Unclipped & Crisp) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-cellar-border rounded-sm shadow-xs overflow-hidden">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-cellar-border/60">
            <div className="p-2.5 sm:p-5 flex items-center gap-2.5 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-wine-50 text-wine-700 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-[11px] sm:text-sm text-cellar-charcoal leading-tight">Open 10 AM – 2 AM</h3>
                <p className="text-[10px] sm:text-xs text-cellar-muted leading-tight mt-0.5">Daily late nights</p>
              </div>
            </div>

            <div className="p-2.5 sm:p-5 flex items-center gap-2.5 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-wine-50 text-wine-700 flex items-center justify-center shrink-0">
                <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-[11px] sm:text-sm text-cellar-charcoal leading-tight">Uber Eats & Pickup</h3>
                <p className="text-[10px] sm:text-xs text-cellar-muted leading-tight mt-0.5">15-min curbside</p>
              </div>
            </div>

            <div className="p-2.5 sm:p-5 flex items-center gap-2.5 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-wine-50 text-wine-700 flex items-center justify-center shrink-0">
                <Car className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-[11px] sm:text-sm text-cellar-charcoal leading-tight">Free Store Parking</h3>
                <p className="text-[10px] sm:text-xs text-cellar-muted leading-tight mt-0.5">Right in front on 4th</p>
              </div>
            </div>

            <div className="p-2.5 sm:p-5 flex items-center gap-2.5 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-wine-50 text-wine-700 flex items-center justify-center shrink-0">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-gold-500 text-gold-500" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-[11px] sm:text-sm text-cellar-charcoal leading-tight">Rated 4.6 on Uber</h3>
                <p className="text-[10px] sm:text-xs text-cellar-muted leading-tight mt-0.5">130+ reviews</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Interactive Category Tabs & Products Showcase (Right Liquor Model) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="text-[11px] sm:text-xs font-bold tracking-widest uppercase text-gold-700 mb-1">
            Browse Cellar Bottles
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <h2 className="disp text-2xl sm:text-4xl font-bold text-cellar-charcoal">
              Our Cellar & Bottle Shop
            </h2>
            <Link
              href="/shop"
              className="text-xs font-bold text-wine-700 hover:text-wine-800 transition flex items-center gap-1"
            >
              <span>View All 130+ Bottles</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Live Tabbed Filter Component */}
        <HomeShopTabs categories={categories} products={featuredProducts} />
      </section>

      {/* 4. Cellar Categories Carousel - Squeezed, sleek & compact horizontal slider */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CategoryCarousel categories={categories} />
      </section>

      {/* 5. Customer Reviews Scraped from Google Maps & Uber Eats */}
      <section>
        <CustomerReviews />
      </section>

      {/* 6. Our Story Section */}
      <section className="bg-white border-y border-cellar-border py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-5 bg-[#ECE6DA] p-6 sm:p-10 rounded-sm border border-cellar-border text-center flex flex-col items-center justify-center">
              <div className="disp text-4xl sm:text-5xl font-bold text-wine-700 mb-1">MH2</div>
              <div className="w-12 h-0.5 bg-gold-600 mb-3" />
              <div className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-cellar-charcoal">
                3106 4th Street NW
              </div>
              <div className="text-xs text-cellar-muted mt-0.5">Calgary, Alberta</div>
              <div className="mt-4 text-xs bg-white/90 border border-cellar-border px-3.5 py-1.5 rounded-full font-semibold text-emerald-800">
                Open until 2:00 AM Daily
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <div className="text-[11px] sm:text-xs font-bold tracking-widest uppercase text-gold-700">
                The Neighbourhood Bottle Shop
              </div>
              <h2 className="disp text-2xl sm:text-4xl font-bold text-cellar-charcoal leading-tight">
                Your reliable local cellar on 4th Street.
              </h2>
              <p className="text-xs sm:text-sm text-cellar-muted leading-relaxed">
                MH2 Liquor Store keeps its doors open until 2 AM every day of the week, so a last-minute dinner, a weekend party, or a quiet night in never runs short. Conveniently located beside Pad Thai and across from the cemetery, we offer dedicated parking directly in front of the store.
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  href="/about"
                  className="min-h-[44px] px-5 py-2.5 bg-wine-700 hover:bg-wine-800 text-white font-bold text-xs uppercase tracking-wider rounded-sm transition flex items-center justify-center"
                >
                  About Our Store
                </Link>
                <a
                  href={uberEatsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] px-5 py-2.5 border border-cellar-border hover:border-gold-600 text-cellar-charcoal font-bold text-xs uppercase tracking-wider rounded-sm transition flex items-center justify-center gap-1.5"
                >
                  <Truck className="w-4 h-4 text-wine-700" />
                  <span>Order on Uber Eats</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Holiday Banner */}
      <section className="bg-wine-700 text-white py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-1.5">
            <h2 className="disp text-2xl sm:text-4xl font-bold">Open Through All Major Holidays</h2>
            <p className="text-wine-100 text-xs sm:text-sm max-w-xl">
              10:00 AM to 2:00 AM on Christmas Eve, Christmas Day, New Year&apos;s Eve, and New Year&apos;s Day.
            </p>
          </div>
          <a
            href={uberEatsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[44px] px-7 py-3 bg-gold-500 hover:bg-gold-400 text-cellar-charcoal font-bold text-xs uppercase tracking-widest rounded-sm transition shadow-md shrink-0 flex items-center justify-center"
          >
            Order Delivery
          </a>
        </div>
      </section>
    </div>
  );
}
