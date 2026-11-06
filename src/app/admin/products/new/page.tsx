'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Plus, Check, Upload, Loader2, Image as ImageIcon, Sparkles } from 'lucide-react';

export default function NewProductPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState('');

  // Form fields
  const [name, setName] = useState('');
  const [categorySlug, setCategorySlug] = useState('wine');
  const [price, setPrice] = useState('29.99');
  const [stockQuantity, setStockQuantity] = useState('24');
  const [inStock, setInStock] = useState(true);
  const [rating, setRating] = useState('4.8');
  const [abv, setAbv] = useState('13.5%');
  const [volume, setVolume] = useState('750 ml');
  const [country, setCountry] = useState('France');
  const [region, setRegion] = useState('Bordeaux');
  const [imageUrl, setImageUrl] = useState('https://oaszetyzonehuvsrnquu.supabase.co/storage/v1/object/public/wine-shop/4860_Ayala%20Brut%20Majeur_1.jpg');
  const [shortDesc, setShortDesc] = useState('');
  const [fullDesc, setFullDesc] = useState('');

  useEffect(() => {
    fetch('/api/admin/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) setCategories(data.categories);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError('');
    setUploadSuccess('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to upload image');

      setImageUrl(data.url);
      setUploadSuccess('Image uploaded successfully!');
    } catch (err: any) {
      setError(err.message || 'Image upload failed');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          category_slug: categorySlug,
          price: parseFloat(price),
          stock_quantity: parseInt(stockQuantity, 10),
          is_in_stock: inStock,
          rating: parseFloat(rating),
          abv,
          volume,
          country,
          region,
          image_url: imageUrl,
          short_description: shortDesc,
          full_description: fullDesc,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add product');

      router.push('/admin/products');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Error creating product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-cellar-muted hover:text-wine-700 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Products</span>
      </Link>

      <div className="border-b border-cellar-border pb-4">
        <h1 className="disp text-3xl font-bold text-cellar-charcoal">Add New Bottle</h1>
        <p className="text-xs text-cellar-muted mt-1">
          Insert a new wine, spirit, or craft beer into the catalog with custom photo upload or Supabase storage link.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 text-xs rounded-sm border border-red-200">
          {error}
        </div>
      )}

      {uploadSuccess && (
        <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-sm border border-emerald-200 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{uploadSuccess}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-cellar-border p-6 sm:p-8 rounded-sm shadow-xs space-y-6 text-xs">
        {/* Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block font-semibold text-cellar-charcoal mb-1">Product / Bottle Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Domaine Leflaive Puligny-Montrachet 2021"
              className="w-full p-2.5 bg-cellar-cream border border-cellar-border rounded-sm focus:border-gold-600 focus:outline-none text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-cellar-charcoal mb-1">Category *</label>
            <select
              value={categorySlug}
              onChange={(e) => setCategorySlug(e.target.value)}
              className="w-full p-2.5 bg-cellar-cream border border-cellar-border rounded-sm focus:border-gold-600 focus:outline-none uppercase font-semibold text-xs min-h-[38px]"
            >
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-cellar-charcoal mb-1">Price ($ USD) *</label>
            <input
              type="number"
              step="0.01"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full p-2.5 bg-cellar-cream border border-cellar-border rounded-sm focus:border-gold-600 focus:outline-none text-xs font-mono"
            />
          </div>
        </div>

        {/* Stock & Rating Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-cellar-border/60 pt-4">
          <div>
            <label className="block font-semibold text-cellar-charcoal mb-1">Initial Stock Quantity</label>
            <input
              type="number"
              min="0"
              required
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
              className="w-full p-2.5 bg-cellar-cream border border-cellar-border rounded-sm focus:border-gold-600 focus:outline-none text-xs font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-cellar-charcoal mb-1">Rating (e.g. 4.8)</label>
            <input
              type="number"
              step="0.1"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="w-full p-2.5 bg-cellar-cream border border-cellar-border rounded-sm focus:border-gold-600 focus:outline-none text-xs font-mono"
            />
          </div>

          <div className="flex items-center pt-5">
            <label className="flex items-center gap-2 cursor-pointer font-semibold text-cellar-charcoal">
              <input
                type="checkbox"
                checked={inStock}
                onChange={(e) => setInStock(e.target.checked)}
                className="rounded-sm text-wine-700 focus:ring-wine-700"
              />
              <span>Immediately In-Stock for Purchase</span>
            </label>
          </div>
        </div>

        {/* Specifications */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 border-t border-cellar-border/60 pt-4">
          <div>
            <label className="block font-semibold text-cellar-charcoal mb-1">Volume</label>
            <input
              type="text"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
              placeholder="e.g. 750 ml"
              className="w-full p-2.5 bg-cellar-cream border border-cellar-border rounded-sm focus:border-gold-600 focus:outline-none text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-cellar-charcoal mb-1">ABV %</label>
            <input
              type="text"
              value={abv}
              onChange={(e) => setAbv(e.target.value)}
              placeholder="e.g. 13.5%"
              className="w-full p-2.5 bg-cellar-cream border border-cellar-border rounded-sm focus:border-gold-600 focus:outline-none text-xs font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-cellar-charcoal mb-1">Country</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="e.g. France, United States"
              className="w-full p-2.5 bg-cellar-cream border border-cellar-border rounded-sm focus:border-gold-600 focus:outline-none text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-cellar-charcoal mb-1">Region</label>
            <input
              type="text"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="e.g. Napa Valley, Burgundy"
              className="w-full p-2.5 bg-cellar-cream border border-cellar-border rounded-sm focus:border-gold-600 focus:outline-none text-xs"
            />
          </div>
        </div>

        {/* Product Image: Upload or Direct URL */}
        <div className="border-t border-cellar-border/60 pt-4">
          <label className="block font-semibold text-cellar-charcoal mb-2">Bottle Image</label>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
            {/* Live Thumbnail Preview */}
            <div className="md:col-span-3 flex flex-col items-center p-3 bg-cellar-cream border border-cellar-border rounded-md text-center">
              <div className="relative w-28 h-36 bg-white rounded border border-cellar-border/70 flex items-center justify-center overflow-hidden mb-2 shadow-2xs">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Bottle Preview"
                    className="object-contain max-h-full max-w-full p-1"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="%23999" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/></svg>';
                    }}
                  />
                ) : (
                  <ImageIcon className="w-8 h-8 text-stone-300" />
                )}
              </div>
              <span className="text-[10px] text-cellar-muted font-semibold">Live Preview</span>
            </div>

            {/* Upload Button & URL Field */}
            <div className="md:col-span-9 space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/png, image/jpeg, image/webp, image/avif, image/svg+xml"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  className="px-4 py-2 bg-cellar-charcoal hover:bg-black text-white text-xs font-bold rounded-md flex items-center gap-2 transition cursor-pointer shadow-xs disabled:bg-gray-400"
                >
                  {uploadingImage ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-gold-400" />
                      <span>Uploading File...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5 text-gold-400" />
                      <span>Upload Bottle Photo</span>
                    </>
                  )}
                </button>
                <span className="text-[11px] text-cellar-muted">
                  Supports PNG, JPG, WEBP, AVIF (Max 8MB)
                </span>
              </div>

              <div>
                <label className="block text-[11px] text-cellar-muted mb-1 font-medium">
                  Or enter Direct Image URL / Supabase Public URL:
                </label>
                <input
                  type="text"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://...supabase.co/... or /uploads/filename.webp"
                  className="w-full p-2.5 bg-cellar-cream border border-cellar-border rounded-sm focus:border-gold-600 focus:outline-none text-xs font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Descriptions */}
        <div className="border-t border-cellar-border/60 pt-4 space-y-4">
          <div>
            <label className="block font-semibold text-cellar-charcoal mb-1">Short Description / Tasting Notes</label>
            <textarea
              rows={3}
              value={shortDesc}
              onChange={(e) => setShortDesc(e.target.value)}
              placeholder="Aromas of dark cherries, blackberry crumble, toasted cedar, and velvet tannins..."
              className="w-full p-2.5 bg-cellar-cream border border-cellar-border rounded-sm focus:border-gold-600 focus:outline-none text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-cellar-charcoal mb-1">Full Detailed Description</label>
            <textarea
              rows={4}
              value={fullDesc}
              onChange={(e) => setFullDesc(e.target.value)}
              placeholder="Detailed producer background, terroir notes, pairing suggestions, and vintage details..."
              className="w-full p-2.5 bg-cellar-cream border border-cellar-border rounded-sm focus:border-gold-600 focus:outline-none text-xs"
            />
          </div>
        </div>

        <div className="border-t border-cellar-border pt-4 flex justify-end gap-3">
          <Link
            href="/admin/products"
            className="px-6 py-2.5 border border-cellar-border text-cellar-charcoal hover:bg-cellar-cream rounded-sm font-semibold transition text-xs"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-2.5 bg-wine-700 hover:bg-wine-800 text-white font-bold text-xs uppercase tracking-wider rounded-sm transition shadow-sm disabled:bg-gray-400 cursor-pointer"
          >
            {loading ? 'Saving...' : 'Add Bottle to Catalog'}
          </button>
        </div>
      </form>
    </div>
  );
}
