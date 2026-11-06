'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Star, ExternalLink, Trash2, Check, X, Plus } from 'lucide-react';

export default function ProductTable({ initialProducts }: { initialProducts: any[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const categories = Array.from(new Set(initialProducts.map((p) => p.category_slug)));

  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                          p.country?.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'all' || p.category_slug === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const toggleStock = async (id: string, currentStatus: boolean) => {
    setUpdatingId(id);
    try {
      const res = await fetch('/api/admin/products/toggle-stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_in_stock: !currentStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, is_in_stock: !currentStatus } : p))
        );
      }
    } catch (err) {
      console.error('Error toggling stock:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const updateQuantity = async (id: string, newQty: number) => {
    if (newQty < 0) return;
    setUpdatingId(id);
    try {
      const res = await fetch('/api/admin/products/toggle-stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, stock_quantity: newQty }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, stock_quantity: newQty } : p))
        );
      }
    } catch (err) {
      console.error('Error updating quantity:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this bottle from the catalog?')) return;
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Category Filters */}
      <div className="bg-white border border-cellar-border p-4 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by bottle name or country..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-cellar-cream border border-cellar-border rounded-sm focus:outline-none focus:border-gold-600"
          />
          <Search className="w-4 h-4 text-cellar-muted absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs bg-cellar-cream border border-cellar-border rounded-sm px-3 py-2 text-cellar-charcoal focus:outline-none uppercase font-semibold"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <Link
            href="/admin/products/new"
            className="px-4 py-2 bg-wine-700 hover:bg-wine-800 text-white text-xs font-bold uppercase tracking-wider rounded-sm transition flex items-center gap-1.5 whitespace-nowrap shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Bottle</span>
          </Link>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-cellar-border rounded-sm shadow-xs overflow-hidden">
        <div className="p-4 border-b border-cellar-border flex justify-between items-center text-xs text-cellar-muted">
          <span>Showing <strong>{filtered.length}</strong> items in catalog</span>
          <span>Click on status pill to instantly toggle In-Stock / Out-of-Stock</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-cellar-cream border-b border-cellar-border text-cellar-muted uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4 font-semibold">Bottle</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">Price ($)</th>
                <th className="py-3 px-4 font-semibold">Stock Qty</th>
                <th className="py-3 px-4 font-semibold">Stock Status</th>
                <th className="py-3 px-4 font-semibold">Rating</th>
                <th className="py-3 px-4 font-semibold">Last Updated</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cellar-border/60">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-cellar-cream/40 transition">
                  {/* Thumbnail & Title */}
                  <td className="py-3 px-4 flex items-center gap-3">
                    <div className="w-10 h-12 bg-white flex-shrink-0 flex items-center justify-center p-0.5 border border-cellar-border rounded-xs">
                      <Image
                        src={p.image_url}
                        alt={p.name}
                        width={40}
                        height={50}
                        className="max-h-full w-auto object-contain"
                      />
                    </div>
                    <div className="min-w-0 max-w-xs">
                      <div className="font-bold text-cellar-charcoal truncate">{p.name}</div>
                      <div className="text-[10px] text-cellar-muted">
                        {p.volume} &bull; {p.abv}
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4 font-semibold text-cellar-muted uppercase text-[11px]">
                    {p.category_name || p.category_slug}
                  </td>

                  {/* Price */}
                  <td className="py-3 px-4 font-mono font-bold text-wine-800">
                    ${parseFloat(p.price).toFixed(2)}
                  </td>

                  {/* Quantity editor */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 font-mono">
                      <input
                        type="number"
                        min="0"
                        defaultValue={p.stock_quantity}
                        onBlur={(e) => updateQuantity(p.id, parseInt(e.target.value, 10))}
                        className="w-16 p-1 bg-cellar-cream border border-cellar-border rounded-xs text-xs font-mono text-center focus:border-gold-600 focus:outline-none"
                      />
                    </div>
                  </td>

                  {/* In-stock toggle */}
                  <td className="py-3 px-4">
                    <button
                      onClick={() => toggleStock(p.id, p.is_in_stock)}
                      disabled={updatingId === p.id}
                      className={`px-3 py-1 rounded-xs text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer shadow-2xs ${
                        p.is_in_stock
                          ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300'
                          : 'bg-red-100 hover:bg-red-200 text-red-800 border border-red-300'
                      }`}
                      title="Click to toggle in-stock status"
                    >
                      {p.is_in_stock ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      <span>{p.is_in_stock ? 'In Stock' : 'Out of Stock'}</span>
                    </button>
                  </td>

                  {/* Rating */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1 font-semibold text-cellar-charcoal">
                      <Star className="w-3.5 h-3.5 fill-gold-500 text-gold-500" />
                      <span>{p.rating}</span>
                    </div>
                  </td>

                  {/* Updated At */}
                  <td className="py-3 px-4 text-cellar-muted text-[11px]">
                    {new Date(p.updated_at || p.created_at).toLocaleDateString()}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right space-x-2">
                    <Link
                      href={`/shop/${p.slug}`}
                      target="_blank"
                      className="p-1.5 text-cellar-muted hover:text-wine-700 transition inline-block"
                      title="View bottle on live storefront"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => deleteProduct(p.id)}
                      className="p-1.5 text-cellar-muted hover:text-red-600 transition inline-block"
                      title="Delete bottle"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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

