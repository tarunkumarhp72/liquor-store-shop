import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Star, ShieldCheck, Truck, Clock, ArrowLeft, Check, AlertCircle, ExternalLink, MapPin, Phone } from 'lucide-react';
import { query } from '@/lib/db';
import ProductCard, { Product } from '@/components/ProductCard';
import ProductOrderCTAs from './ProductOrderCTAs';

interface ProductDetailProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getProduct(slug: string): Promise<Product | null> {
  try {
    // 1. Exact slug match
    let rows = await query<Product>(`
      SELECT p.*, c.name as category_name
      FROM public.products p
      LEFT JOIN public.categories c ON p.category_slug = c.slug
      WHERE p.slug = $1
      LIMIT 1;
    `, [slug]);

    // 2. If not found, try prefix / fuzzy match
    if (rows.length === 0) {
      rows = await query<Product>(`
        SELECT p.*, c.name as category_name
        FROM public.products p
        LEFT JOIN public.categories c ON p.category_slug = c.slug
        WHERE p.slug ILIKE $1 OR p.slug ILIKE $2
        ORDER BY p.rating DESC
        LIMIT 1;
      `, [`${slug}-%`, `%${slug}%`]);
    }

    // 3. If UUID format, try querying by ID
    if (rows.length === 0 && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug)) {
      rows = await query<Product>(`
        SELECT p.*, c.name as category_name
        FROM public.products p
        LEFT JOIN public.categories c ON p.category_slug = c.slug
        WHERE p.id = $1::uuid
        LIMIT 1;
      `, [slug]);
    }

    return rows[0] || null;
  } catch (err) {
    console.error('Error fetching product by slug:', err);
    return null;
  }
}

async function getRelatedProducts(categorySlug: string, currentId: string): Promise<Product[]> {
  try {
    return await query<Product>(`
      SELECT id, name, slug, category_slug, price, stock_quantity,
             is_in_stock, rating, review_count, abv, volume, country, region, image_url
      FROM public.products
      WHERE category_slug = $1 AND id != $2 AND is_in_stock = true
      ORDER BY rating DESC
      LIMIT 4;
    `, [categorySlug, currentId]);
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: ProductDetailProps) {
  const resolvedParams = await params;
  const slug = decodeURIComponent(resolvedParams?.slug || '');
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: 'Product Not Found | MH2 Liquor Store',
    };
  }

  return {
    title: `${product.name} | MH2 Wine & Liquor Store`,
    description: product.short_description || `Find ${product.name} at MH2 Liquor Store Calgary. Open daily 10 AM to 2 AM with 15-minute pickup and local Uber Eats delivery.`,
  };
}

export default async function ProductDetailPage({ params }: ProductDetailProps) {
  const resolvedParams = await params;
  const rawSlug = resolvedParams?.slug;

  if (!rawSlug) {
    notFound();
  }

  const slug = decodeURIComponent(rawSlug);
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const related = await getRelatedProducts(product.category_slug, product.id);
  const priceNum = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
  const uberEatsUrl = process.env.NEXT_PUBLIC_UBER_EATS_URL || 'https://www.ubereats.com/ca/store/mh2-liquor-store/FurwEWDqXG2txmJ3L1Kcig';

  // Background tone class based on category
  let toneClass = 'bg-[#EBDADD]';
  if (product.category_slug === 'beer') toneClass = 'bg-[#F0E6D0]';
  else if (['whiskey', 'tequila', 'vodka', 'gins', 'rums'].includes(product.category_slug)) toneClass = 'bg-[#E3E5E4]';
  else if (product.category_slug === 'champagne') toneClass = 'bg-[#F3ECDD]';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
      {/* Breadcrumb Navigation */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2 text-xs">
        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wider text-cellar-muted hover:text-wine-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </Link>

        <div className="text-cellar-muted flex items-center gap-2">
          <Link href="/" className="hover:text-cellar-charcoal transition">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-cellar-charcoal transition">Shop</Link>
          <span>/</span>
          <span className="capitalize font-semibold text-cellar-charcoal">{product.category_slug}</span>
        </div>
      </div>

      {/* Main Product Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 bg-white border border-cellar-border p-4 sm:p-8 lg:p-10 rounded-sm shadow-xs mb-12">
        {/* Left Column: Bottle Presentation */}
        <div className={`lg:col-span-5 ${toneClass} rounded-sm p-6 sm:p-8 flex items-center justify-center min-h-[300px] sm:min-h-[420px] relative overflow-hidden border border-black/5`}>
          <Image
            src={product.image_url}
            alt={product.name}
            width={340}
            height={440}
            className="max-h-[280px] sm:max-h-[390px] w-auto object-contain drop-shadow-xl"
            priority
          />
        </div>

        {/* Right Column: Specs & Purchasing CTAs */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-gold-700 mb-2">
              <span>{product.category_slug}</span>
              <span>&bull;</span>
              <span className="text-cellar-muted font-normal lowercase">{product.volume}</span>
            </div>

            <h1 className="disp text-2xl sm:text-4xl lg:text-5xl font-bold text-cellar-charcoal leading-tight mb-3">
              {product.name}
            </h1>

            {/* Rating & In-Stock row */}
            <div className="flex flex-wrap items-center gap-3 text-xs mb-5">
              <div className="flex items-center gap-1 bg-cellar-cream px-2.5 py-1 rounded-full border border-cellar-border font-bold text-cellar-charcoal">
                <Star className="w-3.5 h-3.5 fill-gold-500 text-gold-500" />
                <span>{product.rating}</span>
                <span className="text-cellar-muted font-normal">({product.review_count || 24} ratings)</span>
              </div>

              {product.is_in_stock ? (
                <div className="flex items-center gap-1 text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <Check className="w-3.5 h-3.5" />
                  <span>In Stock at Calgary Store</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-red-800 font-bold bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Temporarily Out of Stock</span>
                </div>
              )}
            </div>

            {/* Price Display */}
            <div className="text-3xl sm:text-4xl font-bold text-wine-800 mb-4">
              ${priceNum.toFixed(2)}
              <span className="text-xs text-cellar-muted font-normal ml-2">USD/CAD (local taxes apply)</span>
            </div>

            {/* Tasting Notes / Description */}
            <div className="prose text-xs sm:text-sm text-cellar-muted leading-relaxed mb-6 bg-cellar-cream/60 p-4 rounded-sm border border-cellar-border/60">
              <div className="text-[10px] font-bold uppercase tracking-wider text-cellar-charcoal mb-1">
                Tasting Notes & Profile
              </div>
              <p>
                {product.short_description ||
                  'Carefully selected bottle from our temperature-controlled cellar inventory in Calgary. Hand-picked for outstanding balance, aromatics, and terroir authenticity.'}
              </p>
            </div>

            {/* Bottle Specifications Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 py-3 border-y border-cellar-border text-xs mb-6">
              <div className="p-2.5 bg-cellar-cream rounded-sm">
                <div className="text-cellar-muted font-semibold uppercase text-[10px]">Volume</div>
                <div className="font-bold text-cellar-charcoal mt-0.5">{product.volume || '750 ml'}</div>
              </div>
              <div className="p-2.5 bg-cellar-cream rounded-sm">
                <div className="text-cellar-muted font-semibold uppercase text-[10px]">Alcohol By Vol</div>
                <div className="font-bold text-cellar-charcoal mt-0.5">{product.abv || '13.5%'}</div>
              </div>
              <div className="p-2.5 bg-cellar-cream rounded-sm">
                <div className="text-cellar-muted font-semibold uppercase text-[10px]">Origin</div>
                <div className="font-bold text-cellar-charcoal mt-0.5 truncate">{product.country || 'Imported'}</div>
              </div>
              <div className="p-2.5 bg-cellar-cream rounded-sm">
                <div className="text-cellar-muted font-semibold uppercase text-[10px]">Region</div>
                <div className="font-bold text-cellar-charcoal mt-0.5 truncate">{product.region || 'Artisanal Estate'}</div>
              </div>
            </div>

            {/* Direct Ordering CTAs (Right Liquor Model) */}
            <ProductOrderCTAs uberEatsUrl={uberEatsUrl} />
          </div>

          {/* Fulfillment Perks & Compliance */}
          <div className="space-y-2 pt-4 border-t border-cellar-border/60 text-xs text-cellar-muted">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-wine-700 shrink-0" />
              <span><strong>18+ ID Verification:</strong> Valid government photo ID verified upon delivery or pickup.</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-wine-700 shrink-0" />
              <span><strong>15-Minute Pickup:</strong> In-store pickup ready within 15 minutes of calling.</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-wine-700 shrink-0" />
              <span><strong>Store Address:</strong> 3106 A 4 St NW, Calgary, AB T2M 3A4 (Beside Pad Thai).</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {related.length > 0 && (
        <section className="mt-12 sm:mt-16">
          <div className="mb-6">
            <div className="text-xs font-bold tracking-widest uppercase text-gold-700 mb-1">
              Complementary Selections
            </div>
            <h2 className="disp text-2xl sm:text-3xl font-bold text-cellar-charcoal">
              You May Also Like
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
