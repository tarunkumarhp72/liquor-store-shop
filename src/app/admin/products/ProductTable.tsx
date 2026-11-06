'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Search, 
  Star, 
  ExternalLink, 
  Trash2, 
  Check, 
  X, 
  Plus, 
  Pencil, 
  Save, 
  Loader2, 
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Upload,
  Image as ImageIcon
} from 'lucide-react';

export default function ProductTable({ initialProducts }: { initialProducts: any[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Pagination states (Prevents loading 130+ Supabase images simultaneously)
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  // Edit Modal State
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [editError, setEditError] = useState('');
  const [successToast, setSuccessToast] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = Array.from(new Set(initialProducts.map((p) => p.category_slug)));

  // Filter products
  const filtered = products.filter((p) => {
    const matchesSearch = 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.country?.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'all' || p.category_slug === selectedCategory;
    return matchesSearch && matchesCat;
  });

  // Reset page when filter or page size changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory, pageSize]);

  // Compute pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filtered.length);
  const paginatedProducts = filtered.slice(startIndex, endIndex);

  const toggleStock = async (id: string, currentStatus: boolean) => {
    setUpdatingId(id);
    try {
      const res = await fetch('/api/admin/products/toggle-stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_in_stock: !currentStatus }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, is_in_stock: !currentStatus } : p))
        );
        showToast('Stock status updated!');
      }
    } catch (err) {
      console.error('Error toggling stock:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const updateQuantity = async (id: string, newQty: number) => {
    if (newQty < 0 || isNaN(newQty)) return;
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
        showToast('Stock quantity saved!');
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
        showToast('Bottle deleted from catalog');
      }
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3000);
  };

  // Handle direct file upload for product image
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProduct) return;

    setUploadingImage(true);
    setEditError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to upload image');

      setEditingProduct({ ...editingProduct, image_url: data.url });
      showToast('Image uploaded successfully!');
    } catch (err: any) {
      setEditError(err.message || 'Image upload failed');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setSavingEdit(true);
    setEditError('');

    try {
      const res = await fetch('/api/admin/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProduct),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update bottle');

      // Update in local state
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? { ...p, ...editingProduct } : p))
      );

      setEditingProduct(null);
      showToast('Bottle changes saved successfully!');
    } catch (err: any) {
      setEditError(err.message || 'Failed to save changes');
    } finally {
      setSavingEdit(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-800 text-white px-4 py-2.5 rounded-md shadow-xl text-xs font-bold flex items-center gap-2 animate-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-emerald-300" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Search, Category Filter, and Per Page Selector */}
      <div className="bg-white border border-cellar-border p-3.5 sm:p-4 rounded-lg flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by bottle name or country..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-cellar-cream border border-cellar-border rounded-md focus:outline-none focus:border-gold-600 min-h-[38px]"
          />
          <Search className="w-4 h-4 text-cellar-muted absolute left-3 top-2.5" />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs bg-cellar-cream border border-cellar-border rounded-md px-3 py-2 text-cellar-charcoal focus:outline-none uppercase font-semibold min-h-[38px] flex-1 sm:flex-initial"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Page Size Dropdown */}
          <select
            value={pageSize}
            onChange={(e) => setPageSize(parseInt(e.target.value, 10))}
            className="text-xs bg-cellar-cream border border-cellar-border rounded-md px-2.5 py-2 text-cellar-charcoal focus:outline-none font-semibold min-h-[38px]"
            title="Bottles per page"
          >
            <option value={15}>15 / page</option>
            <option value={25}>25 / page</option>
            <option value={50}>50 / page</option>
          </select>

          {/* New Bottle CTA */}
          <Link
            href="/admin/products/new"
            className="px-4 py-2 bg-wine-700 hover:bg-wine-800 active:scale-98 text-white text-xs font-bold uppercase tracking-wider rounded-md transition flex items-center justify-center gap-1.5 whitespace-nowrap shadow-xs min-h-[38px] flex-1 sm:flex-initial"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Bottle</span>
          </Link>
        </div>
      </div>

      {/* Products Table with Responsive Horizontal Scroll */}
      <div className="bg-white border border-cellar-border rounded-lg shadow-xs overflow-hidden">
        <div className="p-3.5 sm:p-4 border-b border-cellar-border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-cellar-muted">
          <span>
            Showing <strong>{filtered.length === 0 ? 0 : startIndex + 1}–{endIndex}</strong> of <strong>{filtered.length}</strong> bottles in catalog (Page {validCurrentPage} of {totalPages})
          </span>
          <span className="hidden sm:inline">
            Fast batch view: images load on-demand
          </span>
        </div>

        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-xs min-w-[760px]">
            <thead>
              <tr className="bg-cellar-cream border-b border-cellar-border text-cellar-muted uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3 sm:px-4 font-semibold">Bottle</th>
                <th className="py-3 px-3 sm:px-4 font-semibold">Category</th>
                <th className="py-3 px-3 sm:px-4 font-semibold">Price ($)</th>
                <th className="py-3 px-3 sm:px-4 font-semibold">Stock Qty</th>
                <th className="py-3 px-3 sm:px-4 font-semibold">Stock Status</th>
                <th className="py-3 px-3 sm:px-4 font-semibold">Rating</th>
                <th className="py-3 px-3 sm:px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cellar-border/60">
              {paginatedProducts.map((p) => (
                <tr key={p.id} className="hover:bg-cellar-cream/40 transition">
                  {/* Thumbnail & Title */}
                  <td className="py-3 px-3 sm:px-4 flex items-center gap-2.5 sm:gap-3">
                    <div className="w-10 h-12 bg-white shrink-0 flex items-center justify-center p-0.5 border border-cellar-border rounded-sm">
                      <Image
                        src={p.image_url}
                        alt={p.name}
                        width={40}
                        height={50}
                        loading="lazy"
                        className="max-h-full w-auto object-contain"
                      />
                    </div>
                    <div className="min-w-0 max-w-[200px] sm:max-w-xs">
                      <div className="font-bold text-cellar-charcoal truncate" title={p.name}>
                        {p.name}
                      </div>
                      <div className="text-[10px] text-cellar-muted truncate">
                        {p.volume || '750 ml'} &bull; {p.abv || '13.5%'} &bull; {p.country || 'Imported'}
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-3 sm:px-4 font-semibold text-cellar-muted uppercase text-[11px] whitespace-nowrap">
                    {p.category_name || p.category_slug}
                  </td>

                  {/* Price */}
                  <td className="py-3 px-3 sm:px-4 font-mono font-bold text-wine-800 whitespace-nowrap">
                    ${parseFloat(p.price).toFixed(2)}
                  </td>

                  {/* Quantity editor */}
                  <td className="py-3 px-3 sm:px-4">
                    <input
                      type="number"
                      min="0"
                      defaultValue={p.stock_quantity}
                      onBlur={(e) => updateQuantity(p.id, parseInt(e.target.value, 10))}
                      className="w-16 p-1 bg-cellar-cream border border-cellar-border rounded-sm text-xs font-mono text-center focus:border-gold-600 focus:outline-none"
                    />
                  </td>

                  {/* In-stock toggle */}
                  <td className="py-3 px-3 sm:px-4">
                    <button
                      onClick={() => toggleStock(p.id, p.is_in_stock)}
                      disabled={updatingId === p.id}
                      className={`px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer shadow-2xs whitespace-nowrap ${
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
                  <td className="py-3 px-3 sm:px-4">
                    <div className="flex items-center gap-1 font-semibold text-cellar-charcoal whitespace-nowrap">
                      <Star className="w-3.5 h-3.5 fill-gold-500 text-gold-500" />
                      <span>{p.rating}</span>
                    </div>
                  </td>

                  {/* Actions: Edit, View Storefront, Delete */}
                  <td className="py-3 px-3 sm:px-4 text-right whitespace-nowrap space-x-1.5">
                    {/* EDIT BOTTLE BUTTON */}
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProduct({ ...p });
                        setEditError('');
                      }}
                      className="p-1.5 text-cellar-charcoal hover:text-wine-700 hover:bg-wine-50 rounded-sm transition inline-flex items-center gap-1 border border-cellar-border"
                      title="Edit bottle details"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span className="hidden xl:inline text-[11px] font-semibold">Edit</span>
                    </button>

                    {/* Live View */}
                    <Link
                      href={`/shop/${p.slug}`}
                      target="_blank"
                      className="p-1.5 text-cellar-muted hover:text-wine-700 hover:bg-cellar-cream rounded-sm transition inline-block border border-transparent"
                      title="View bottle on live storefront"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => deleteProduct(p.id)}
                      className="p-1.5 text-cellar-muted hover:text-red-600 hover:bg-red-50 rounded-sm transition inline-block border border-transparent"
                      title="Delete bottle"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION CONTROLS */}
        {totalPages > 1 && (
          <div className="p-3.5 sm:p-4 bg-cellar-cream/40 border-t border-cellar-border flex items-center justify-between gap-3 text-xs">
            {/* Prev Button */}
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={validCurrentPage <= 1}
              className="px-3 py-1.5 border border-cellar-border bg-white rounded-md text-cellar-charcoal font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-50 flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {/* Page Number Chips */}
            <div className="hidden sm:flex items-center gap-1">
              {Array.from({ length: totalPages }).map((_, i) => {
                const pNum = i + 1;
                const isCurrent = pNum === validCurrentPage;
                if (pNum !== 1 && pNum !== totalPages && Math.abs(pNum - validCurrentPage) > 2) {
                  if (Math.abs(pNum - validCurrentPage) === 3) {
                    return <span key={pNum} className="px-1 text-cellar-muted">&hellip;</span>;
                  }
                  return null;
                }
                return (
                  <button
                    key={pNum}
                    type="button"
                    onClick={() => setCurrentPage(pNum)}
                    className={`w-7 h-7 rounded-md font-bold text-xs transition ${
                      isCurrent
                        ? 'bg-wine-700 text-white shadow-2xs'
                        : 'bg-white border border-cellar-border text-cellar-charcoal hover:bg-zinc-100'
                    }`}
                  >
                    {pNum}
                  </button>
                );
              })}
            </div>

            <div className="sm:hidden font-bold text-cellar-charcoal">
              {validCurrentPage} / {totalPages}
            </div>

            {/* Next Button */}
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={validCurrentPage >= totalPages}
              className="px-3 py-1.5 border border-cellar-border bg-white rounded-md text-cellar-charcoal font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-50 flex items-center gap-1"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* EDIT PRODUCT MODAL DIALOG WITH IMAGE UPLOAD & PREVIEW */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          {/* Backdrop */}
          <div
            onClick={() => setEditingProduct(null)}
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
          />

          {/* Modal Card */}
          <div className="relative w-full max-w-2xl bg-white border border-cellar-border rounded-lg shadow-2xl p-5 sm:p-7 z-10 my-8 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-cellar-border mb-4">
              <div>
                <h3 className="disp text-xl sm:text-2xl font-bold text-cellar-charcoal">
                  Edit Bottle Details
                </h3>
                <p className="text-xs text-cellar-muted mt-0.5">
                  Update inventory, pricing, bottle image, category, and tasting notes.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="w-8 h-8 rounded-full bg-cellar-cream hover:bg-zinc-200 text-cellar-charcoal flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {editError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{editError}</span>
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              {/* IMAGE UPLOAD & PREVIEW SECTION */}
              <div className="p-3.5 bg-cellar-cream/60 border border-cellar-border rounded-lg space-y-3">
                <label className="block font-semibold text-cellar-charcoal">
                  Bottle Photo / Image
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Live Thumbnail Preview */}
                  <div className="w-20 h-24 bg-white border border-cellar-border rounded-md p-1 flex items-center justify-center shrink-0 shadow-xs relative overflow-hidden">
                    {editingProduct.image_url ? (
                      <Image
                        src={editingProduct.image_url}
                        alt="Preview"
                        width={60}
                        height={80}
                        className="max-h-full w-auto object-contain"
                      />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-zinc-300" />
                    )}
                  </div>

                  <div className="flex-1 w-full space-y-2">
                    {/* Upload File Button */}
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/png,image/jpeg,image/webp,image/svg+xml"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="bottle-image-upload"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingImage}
                        className="px-3.5 py-2 bg-white border border-cellar-border hover:border-gold-600 rounded-md text-xs font-bold text-cellar-charcoal flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
                      >
                        {uploadingImage ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-wine-700" />
                            <span>Uploading File...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-3.5 h-3.5 text-wine-700" />
                            <span>Upload New Photo</span>
                          </>
                        )}
                      </button>
                      <span className="text-[11px] text-cellar-muted">PNG, JPG, WEBP up to 8MB</span>
                    </div>

                    {/* Direct Image URL input */}
                    <div>
                      <input
                        type="text"
                        value={editingProduct.image_url || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, image_url: e.target.value })}
                        placeholder="Or enter direct image URL..."
                        className="w-full p-2 bg-white border border-cellar-border rounded-md focus:border-gold-600 focus:outline-none font-mono text-[11px]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Name */}
              <div>
                <label className="block font-semibold text-cellar-charcoal mb-1">Bottle Name *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full p-2.5 bg-cellar-cream border border-cellar-border rounded-md focus:border-gold-600 focus:outline-none"
                />
              </div>

              {/* Grid 2-col: Category & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block font-semibold text-cellar-charcoal mb-1">Category *</label>
                  <select
                    value={editingProduct.category_slug}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, category_slug: e.target.value })
                    }
                    className="w-full p-2.5 bg-cellar-cream border border-cellar-border rounded-md focus:border-gold-600 focus:outline-none uppercase font-semibold"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-cellar-charcoal mb-1">Price ($ CAD) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full p-2.5 bg-cellar-cream border border-cellar-border rounded-md focus:border-gold-600 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Grid 3-col: Stock Qty, ABV, Volume */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <label className="block font-semibold text-cellar-charcoal mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    min="0"
                    value={editingProduct.stock_quantity}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        stock_quantity: parseInt(e.target.value, 10) || 0,
                      })
                    }
                    className="w-full p-2.5 bg-cellar-cream border border-cellar-border rounded-md focus:border-gold-600 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-cellar-charcoal mb-1">Alcohol By Vol (ABV)</label>
                  <input
                    type="text"
                    value={editingProduct.abv || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, abv: e.target.value })}
                    placeholder="e.g. 13.5%"
                    className="w-full p-2.5 bg-cellar-cream border border-cellar-border rounded-md focus:border-gold-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-cellar-charcoal mb-1">Volume</label>
                  <input
                    type="text"
                    value={editingProduct.volume || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, volume: e.target.value })}
                    placeholder="e.g. 750 ml"
                    className="w-full p-2.5 bg-cellar-cream border border-cellar-border rounded-md focus:border-gold-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Grid 2-col: Country & Region */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block font-semibold text-cellar-charcoal mb-1">Country</label>
                  <input
                    type="text"
                    value={editingProduct.country || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, country: e.target.value })}
                    placeholder="e.g. France, Mexico, Canada"
                    className="w-full p-2.5 bg-cellar-cream border border-cellar-border rounded-md focus:border-gold-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-cellar-charcoal mb-1">Region / Appellation</label>
                  <input
                    type="text"
                    value={editingProduct.region || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, region: e.target.value })}
                    placeholder="e.g. Champagne, Jalisco, Okanagan"
                    className="w-full p-2.5 bg-cellar-cream border border-cellar-border rounded-md focus:border-gold-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Tasting Notes */}
              <div>
                <label className="block font-semibold text-cellar-charcoal mb-1">Short Description / Notes</label>
                <textarea
                  rows={3}
                  value={editingProduct.short_description || ''}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, short_description: e.target.value })
                  }
                  placeholder="Tasting notes, aroma profile, or pairing recommendations..."
                  className="w-full p-2.5 bg-cellar-cream border border-cellar-border rounded-md focus:border-gold-600 focus:outline-none"
                />
              </div>

              {/* Checkboxes: In Stock & Featured */}
              <div className="flex flex-wrap items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.is_in_stock}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, is_in_stock: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-wine-700"
                  />
                  <span className="font-semibold text-cellar-charcoal">Available In Stock</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.featured}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, featured: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-wine-700"
                  />
                  <span className="font-semibold text-cellar-charcoal">Featured on Homepage</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-cellar-border">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 bg-cellar-cream hover:bg-zinc-200 text-cellar-charcoal rounded-md font-bold uppercase tracking-wider text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit || uploadingImage}
                  className="px-5 py-2 bg-wine-700 hover:bg-wine-800 text-white rounded-md font-bold uppercase tracking-wider text-xs transition flex items-center gap-1.5 shadow-sm disabled:bg-gray-400 cursor-pointer"
                >
                  {savingEdit ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
