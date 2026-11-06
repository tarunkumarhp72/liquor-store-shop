import React from 'react';
import { redirect } from 'next/navigation';
import { query } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
import ProductTable from './ProductTable';

export const dynamic = 'force-dynamic';

async function getAdminProducts() {
  try {
    return await query(`
      SELECT p.*, c.name as category_name
      FROM public.products p
      LEFT JOIN public.categories c ON p.category_slug = c.slug
      ORDER BY p.updated_at DESC;
    `);
  } catch (err) {
    console.error('Error fetching admin products:', err);
    return [];
  }
}

export default async function AdminProductsPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect('/admin/login');
  }

  const products = await getAdminProducts();

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-bold tracking-widest uppercase text-gold-700 mb-1">
          Catalog Inventory
        </div>
        <h1 className="disp text-3xl sm:text-4xl font-bold text-cellar-charcoal">
          Manage Bottles & Spirits
        </h1>
        <p className="text-xs text-cellar-muted mt-1">
          Update in-stock status, adjust quantity, set ratings, and add new product entries.
        </p>
      </div>

      <ProductTable initialProducts={products} />
    </div>
  );
}

