import React from 'react';
import Link from 'next/link';

export interface CategoryItem {
  id: number | string;
  name: string;
  slug: string;
  product_count?: number | string;
}

export default function CategoryGrid({ categories }: { categories: CategoryItem[] }) {
  if (categories.length === 0) return null;

  return (
    <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-5">
      {categories.map((cat) => {
        const count = Number(cat.product_count) || 0;
        return (
          <li key={cat.id}>
            <Link
              href={`/shop?category=${cat.slug}`}
              className="flex min-h-[64px] h-full flex-col justify-center rounded-sm border border-cellar-border bg-white px-4 py-3 transition hover:border-wine-700 hover:bg-wine-50"
            >
              <span className="text-sm font-bold leading-snug text-cellar-charcoal">{cat.name}</span>
              {count > 0 && <span className="mt-0.5 text-xs text-cellar-muted">{count} in stock</span>}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
