import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Package, Tag, ShoppingBag, AlertTriangle, Plus, ExternalLink, Star } from 'lucide-react';
import { query } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

async function getDashboardStats() {
  try {
    const [pStats, cStats, oStats, recentProducts] = await Promise.all([
      query(`
        SELECT 
          COUNT(*) as total,
          COUNT(*) FILTER (WHERE is_in_stock = true) as in_stock,
          COUNT(*) FILTER (WHERE is_in_stock = false) as out_of_stock,
          COUNT(*) FILTER (WHERE stock_quantity <= 10) as low_stock
        FROM public.products;
      `),
      query(`SELECT COUNT(*) as total FROM public.categories;`),
      query(`SELECT COUNT(*) as total, COALESCE(SUM(total_amount), 0) as revenue FROM public.orders;`),
      query(`
        SELECT p.id, p.name, p.slug, p.category_slug, p.price, p.stock_quantity,
               p.is_in_stock, p.rating, p.updated_at, c.name as category_name
        FROM public.products p
        LEFT JOIN public.categories c ON p.category_slug = c.slug
        ORDER BY p.updated_at DESC
        LIMIT 6;
      `),
    ]);

    return {
      products: pStats[0],
      categories: cStats[0],
      orders: oStats[0],
      recent: recentProducts,
    };
  } catch (err) {
    console.error('Error loading dashboard stats:', err);
    return {
      products: { total: 0, in_stock: 0, out_of_stock: 0, low_stock: 0 },
      categories: { total: 0 },
      orders: { total: 0, revenue: 0 },
      recent: [],
    };
  }
}

export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect('/admin/login');
  }

  const stats = await getDashboardStats();

  return (
    <div className="space-y-8">
      {/* Page Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cellar-border pb-6">
        <div>
          <div className="text-xs font-bold tracking-widest uppercase text-gold-700 mb-1">
            Store Management
          </div>
          <h1 className="disp text-3xl sm:text-4xl font-bold text-cellar-charcoal">
            Operations Dashboard
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/products/new"
            className="px-4 py-2.5 bg-wine-700 hover:bg-wine-800 text-white font-bold text-xs uppercase tracking-wider rounded-sm transition flex items-center gap-2 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </Link>
          <Link
            href="/admin/categories"
            className="px-4 py-2.5 bg-white border border-cellar-border hover:border-gold-600 text-cellar-charcoal font-bold text-xs uppercase tracking-wider rounded-sm transition flex items-center gap-2"
          >
            <Tag className="w-4 h-4 text-wine-700" />
            <span>Categories</span>
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-cellar-border p-5 rounded-sm shadow-xs">
          <div className="flex items-center justify-between text-cellar-muted text-xs font-semibold uppercase mb-2">
            <span>Total Catalog</span>
            <Package className="w-4 h-4 text-wine-700" />
          </div>
          <div className="text-3xl font-bold text-cellar-charcoal">{stats.products.total}</div>
          <div className="text-[11px] text-emerald-700 mt-1 font-semibold">
            {stats.products.in_stock} currently active & in stock
          </div>
        </div>

        <div className="bg-white border border-cellar-border p-5 rounded-sm shadow-xs">
          <div className="flex items-center justify-between text-cellar-muted text-xs font-semibold uppercase mb-2">
            <span>Out of Stock</span>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-3xl font-bold text-red-700">{stats.products.out_of_stock}</div>
          <div className="text-[11px] text-cellar-muted mt-1">
            {stats.products.low_stock} items with &le; 10 units
          </div>
        </div>

        <div className="bg-white border border-cellar-border p-5 rounded-sm shadow-xs">
          <div className="flex items-center justify-between text-cellar-muted text-xs font-semibold uppercase mb-2">
            <span>Cellar Categories</span>
            <Tag className="w-4 h-4 text-gold-600" />
          </div>
          <div className="text-3xl font-bold text-cellar-charcoal">{stats.categories.total}</div>
          <div className="text-[11px] text-cellar-muted mt-1">
            Wine, Champagne, Spirits & Beer
          </div>
        </div>

        <div className="bg-white border border-cellar-border p-5 rounded-sm shadow-xs">
          <div className="flex items-center justify-between text-cellar-muted text-xs font-semibold uppercase mb-2">
            <span>Online Orders</span>
            <ShoppingBag className="w-4 h-4 text-wine-700" />
          </div>
          <div className="text-3xl font-bold text-cellar-charcoal">{stats.orders.total}</div>
          <div className="text-[11px] text-emerald-700 mt-1 font-semibold">
            ${parseFloat(stats.orders.revenue || 0).toFixed(2)} USD in reservations
          </div>
        </div>
      </div>

      {/* Recent Catalog Activity Table */}
      <div className="bg-white border border-cellar-border rounded-sm shadow-xs p-6">
        <div className="flex items-center justify-between border-b border-cellar-border pb-4 mb-4">
          <div>
            <h2 className="disp text-2xl font-bold text-cellar-charcoal">Recently Updated Products</h2>
            <p className="text-xs text-cellar-muted">Direct stock control and quick inventory adjustments</p>
          </div>
          <Link
            href="/admin/products"
            className="text-xs font-bold text-wine-700 hover:text-wine-800 transition"
          >
            View All ({stats.products.total}) &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-xs min-w-[620px]">
            <thead>
              <tr className="border-b border-cellar-border text-cellar-muted uppercase text-[10px] tracking-wider">
                <th className="pb-3 font-semibold">Product Name</th>
                <th className="pb-3 font-semibold">Category</th>
                <th className="pb-3 font-semibold">Price</th>
                <th className="pb-3 font-semibold">Stock Qty</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Rating</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cellar-border/60">
              {stats.recent.map((p: any) => (
                <tr key={p.id} className="hover:bg-cellar-cream/50 transition">
                  <td className="py-3 font-bold text-cellar-charcoal max-w-xs truncate">
                    {p.name}
                  </td>
                  <td className="py-3 text-cellar-muted uppercase text-[11px]">
                    {p.category_name || p.category_slug}
                  </td>
                  <td className="py-3 font-mono font-semibold text-wine-800">
                    ${parseFloat(p.price).toFixed(2)}
                  </td>
                  <td className="py-3 font-mono text-cellar-charcoal">
                    {p.stock_quantity}
                  </td>
                  <td className="py-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-xs text-[10px] font-bold uppercase tracking-wider ${
                        p.is_in_stock
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-red-50 text-red-800 border border-red-200'
                      }`}
                    >
                      {p.is_in_stock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-gold-500 text-gold-500" />
                      <span>{p.rating}</span>
                    </div>
                  </td>
                  <td className="py-3 text-right">
                    <Link
                      href={`/shop/${p.slug}`}
                      target="_blank"
                      className="text-cellar-muted hover:text-wine-700 p-1 inline-block transition"
                      title="View on store"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

