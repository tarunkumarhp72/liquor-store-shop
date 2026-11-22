import React from 'react';
import Link from 'next/link';
import { ArrowRight, MapPin, Phone } from 'lucide-react';
import ProductCard, { Product } from '@/components/ProductCard';
import CategoryGrid, { CategoryItem } from '@/components/CategoryGrid';
import CustomerReviews from '@/components/CustomerReviews';
import OpenStatus from '@/components/OpenStatus';
import { query } from '@/lib/db';
import { STORE } from '@/lib/store';

export const revalidate = 300;

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const products = await query<Product>(`
      SELECT id, name, slug, category_slug, price, stock_quantity,
             is_in_stock, rating, review_count, abv, volume, country, region, image_url
      FROM public.products
      WHERE is_in_stock = true
      ORDER BY featured DESC, name ASC
      LIMIT 8;
    `);
    return products.slice(0, 8);
  } catch (err) {
    console.error('Failed to load featured products:', err);
    return [];
  }
}

async function getCategories(): Promise<CategoryItem[]> {
  try {
    return await query<CategoryItem>(`
      SELECT c.*, COUNT(p.id) as product_count
      FROM public.categories c
      LEFT JOIN public.products p ON c.slug = p.category_slug
      WHERE COALESCE(c.is_active, true) = true
      GROUP BY c.id
      ORDER BY c.sort_order ASC;
    `);
  } catch (err) {
    console.error('Failed to load categories:', err);
    return [];
  }
}

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([getFeaturedProducts(), getCategories()]);

  return (
    <div className="space-y-12 pb-14 sm:space-y-16 sm:pb-20">
      {/* Hero: who we are, where we are, are we open */}
      <section className="bg-cellar-charcoal text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[1.3fr_1fr] lg:items-center lg:gap-14 lg:px-8 lg:py-16">
          <div>
            <h1 className="disp text-4xl font-bold leading-[1.1] sm:text-5xl lg:text-6xl">
              Wine, beer and spirits on 4th Street NW.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-[#D4CCC0] sm:text-lg">
              Calgary&apos;s neighbourhood liquor store, open until 2 AM every night. Park out front, or get it delivered.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="inline-flex min-h-[48px] items-center gap-2 rounded-sm bg-gold-500 px-6 text-sm font-bold text-cellar-charcoal transition hover:bg-gold-400"
              >
                Browse the shop <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <a
                href={STORE.uberEatsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[48px] items-center rounded-sm border border-white/30 px-6 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Order on Uber Eats
              </a>
            </div>
          </div>

          {/* Visit card */}
          <div className="rounded-sm bg-cellar-cream p-5 text-cellar-charcoal sm:p-6">
            <div className="text-sm">
              <OpenStatus />
            </div>
            <dl className="mt-4 space-y-4 text-sm">
              <div className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-wine-700" aria-hidden="true" />
                <div>
                  <dt className="sr-only">Address</dt>
                  <dd>
                    {STORE.street}
                    <br />
                    {STORE.cityLine}
                    <br />
                    <span className="text-cellar-muted">{STORE.landmark}</span>
                  </dd>
                </div>
              </div>
              <div className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-wine-700" aria-hidden="true" />
                <div>
                  <dt className="sr-only">Phone</dt>
                  <dd>
                    <a href={STORE.phoneHref} className="font-semibold hover:text-wine-700">
                      {STORE.phone}
                    </a>
                    <br />
                    <span className="text-cellar-muted">Call ahead and we&apos;ll have it ready for pickup.</span>
                  </dd>
                </div>
              </div>
            </dl>
            <div className="mt-5 flex items-center justify-between gap-3 border-t border-cellar-border pt-4 text-sm">
              <a
                href={STORE.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-wine-700 hover:text-wine-800"
              >
                Get directions
              </a>
              <span className="text-xs text-cellar-muted">Open on holidays too</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-5 text-xl font-bold text-cellar-charcoal sm:text-2xl">Shop by category</h2>
        <CategoryGrid categories={categories} />
      </section>

      {/* Products */}
      {featuredProducts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-5 flex items-baseline justify-between gap-4">
            <h2 className="text-xl font-bold text-cellar-charcoal sm:text-2xl">In stock now</h2>
            <Link href="/shop" className="inline-flex items-center gap-1 text-sm font-semibold text-wine-700 hover:text-wine-800">
              See everything <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
            {featuredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* How to get it */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-5 text-xl font-bold text-cellar-charcoal sm:text-2xl">Three ways to get your order</h2>
        <div className="grid gap-px overflow-hidden rounded-sm border border-cellar-border bg-cellar-border md:grid-cols-3">
          <div className="bg-white p-5 sm:p-6">
            <h3 className="font-bold text-cellar-charcoal">Come in</h3>
            <p className="mt-2 text-sm leading-relaxed text-cellar-muted">
              {STORE.hoursLabel}. Free parking in front of the store.
            </p>
          </div>
          <div className="bg-white p-5 sm:p-6">
            <h3 className="font-bold text-cellar-charcoal">Curbside pickup</h3>
            <p className="mt-2 text-sm leading-relaxed text-cellar-muted">
              Call{' '}
              <a href={STORE.phoneHref} className="font-semibold text-wine-700 hover:text-wine-800">
                {STORE.phone}
              </a>{' '}
              and we&apos;ll bring it out to your car.
            </p>
          </div>
          <div className="bg-white p-5 sm:p-6">
            <h3 className="font-bold text-cellar-charcoal">Delivery</h3>
            <p className="mt-2 text-sm leading-relaxed text-cellar-muted">
              Order through{' '}
              <a
                href={STORE.uberEatsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-wine-700 hover:text-wine-800"
              >
                Uber Eats
              </a>
              . Have your photo ID ready, we check ID on every delivery.
            </p>
          </div>
        </div>
        <p className="mt-3 text-xs text-cellar-muted">
          You must be 18 or older. Government photo ID is required for pickup and delivery.{' '}
          <Link href="/delivery" className="font-semibold text-wine-700 hover:text-wine-800">
            Pickup and delivery details
          </Link>
        </p>
      </section>

      <CustomerReviews />
    </div>
  );
}
