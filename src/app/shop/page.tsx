import React from 'react';
import type { Metadata } from 'next';
import ShopClientView from './ShopClientView';
import {
  getCategoriesWithCounts,
  getAllBottlesCount,
  getProductsData,
  ShopSearchParams,
} from '@/lib/products';

interface ShopProps {
  searchParams: Promise<ShopSearchParams>;
}

const categoryMetaMap: Record<string, { title: string; desc: string }> = {
  wine: {
    title: 'Fine Wines & Rosé Bottles | Calgary NW',
    desc: 'Shop curated red, white, sparkling, and rosé wines in Calgary NW. Available for 15-minute pickup or late-night delivery until 2 AM at MH2 Liquor Store.',
  },
  champagne: {
    title: 'Champagne & Sparkling Wine | Calgary NW',
    desc: 'Vintage champagnes, prosecco, and sparkling wines for celebrations in Calgary. Order for 15-minute curbside pickup or delivery until 2 AM.',
  },
  whiskey: {
    title: 'Whiskey, Scotch & Bourbon Selection | Calgary NW',
    desc: 'Explore single malt scotch, Irish whiskeys, and Kentucky bourbon at MH2 Liquor Store in Calgary. Open daily until 2:00 AM.',
  },
  tequila: {
    title: 'Tequila & Artisanal Mezcal | Calgary NW',
    desc: 'Premium blanco, reposado, añejo tequilas and mezcal bottles in Calgary NW. Fast pickup & late delivery open 365 days a year.',
  },
  vodka: {
    title: 'Vodka & Premium Gins | Calgary NW',
    desc: 'Browse domestic and imported vodka, London dry gin, and botanical spirits at MH2 Liquor Store Calgary.',
  },
  beer: {
    title: 'Cold Craft Beer & Ciders | Calgary NW',
    desc: 'Ice cold craft IPAs, local Alberta craft beers, ciders, and domestic packs ready for 15-minute pickup on 4th St NW Calgary.',
  },
  gins: {
    title: 'Craft Gin Selection | Calgary NW',
    desc: 'Artisanal and imported gins in Calgary NW. Curated botanical and dry gins open late at MH2 Liquor Store.',
  },
  rums: {
    title: 'Spiced & Aged Rum Collection | Calgary NW',
    desc: 'Dark, spiced, and white rums for cocktails and sipping. Order online from MH2 Liquor Store Calgary.',
  },
  'non-alcoholic': {
    title: 'Non-Alcoholic Drinks, Sodas & Mixers | Calgary NW',
    desc: 'Chilled energy drinks, juices, sodas, and cocktail mixers ready for 15-minute pickup or late delivery at MH2 Liquor Store.',
  },
};

export async function generateMetadata({ searchParams }: ShopProps): Promise<Metadata> {
  const resolvedParams = await searchParams;
  const cat = resolvedParams?.category?.toLowerCase();

  if (cat && categoryMetaMap[cat]) {
    const meta = categoryMetaMap[cat];
    const canonical = `https://www.mh2liquorstore.ca/shop?category=${cat}`;
    return {
      title: meta.title,
      description: meta.desc,
      alternates: {
        canonical,
      },
      openGraph: {
        title: `${meta.title} | MH2 Liquor Store`,
        description: meta.desc,
        url: canonical,
      },
    };
  }

  return {
    title: 'Shop All Bottles | Wine, Spirits & Cold Beer in Calgary NW',
    description:
      'Browse our full cellar catalog of curated fine wines, rare whiskeys, tequila, cold craft beers, and ready-to-drink spirits. Order online for 15-min pickup or delivery in Calgary.',
    alternates: {
      canonical: 'https://www.mh2liquorstore.ca/shop',
    },
    openGraph: {
      title: 'Shop Wine, Spirits & Craft Beer | MH2 Liquor Store Calgary',
      description:
        'Browse 130+ bottles of fine wine, bourbon, tequila, and craft beer open late in Calgary NW.',
      url: 'https://www.mh2liquorstore.ca/shop',
    },
  };
}

export default async function ShopPage({ searchParams }: ShopProps) {
  const resolvedParams = (await searchParams) || {};

  const [categories, allBottlesCount, data] = await Promise.all([
    getCategoriesWithCounts(),
    getAllBottlesCount(),
    getProductsData(resolvedParams),
  ]);

  const { products, totalCount, hasMore } = data;

  return (
    <ShopClientView
      categories={categories}
      allBottlesCount={allBottlesCount}
      totalFilteredCount={totalCount}
      initialProducts={products}
      initialHasMore={hasMore}
    />
  );
}
