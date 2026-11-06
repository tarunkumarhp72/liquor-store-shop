'use client';

import React, { useState, useEffect } from 'react';
import { Tag, Plus, Check, FolderPlus } from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [toneClass, setToneClass] = useState('tone-wine');

  const fetchCategories = () => {
    fetch('/api/admin/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) setCategories(data.categories);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setMessage('');

    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, slug, description, tone_class: toneClass }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add category');

      setMessage('Category added successfully!');
      setName('');
      setSlug('');
      setDescription('');
      fetchCategories();
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-cellar-border pb-4">
        <div className="text-xs font-bold tracking-widest uppercase text-gold-700 mb-1">
          Catalog Taxonomy
        </div>
        <h1 className="disp text-3xl sm:text-4xl font-bold text-cellar-charcoal">
          Manage Cellar Categories
        </h1>
        <p className="text-xs text-cellar-muted mt-1">
          Add new product categories, define background tones, and view catalog distributions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Add Category Form */}
        <div className="lg:col-span-5 bg-white border border-cellar-border p-6 rounded-sm shadow-xs">
          <div className="flex items-center gap-2 border-b border-cellar-border pb-3 mb-4">
            <FolderPlus className="w-5 h-5 text-wine-700" />
            <h2 className="disp text-2xl font-bold text-cellar-charcoal">Create Category</h2>
          </div>

          {message && (
            <div className={`p-3 text-xs rounded-sm mb-4 border ${
              message.startsWith('Error')
                ? 'bg-red-50 text-red-700 border-red-200'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleAddCategory} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-cellar-charcoal mb-1">Category Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!slug) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                }}
                placeholder="e.g. Seltzers & Coolers, Scotch"
                className="w-full p-2.5 bg-cellar-cream border border-cellar-border rounded-sm focus:border-gold-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-cellar-charcoal mb-1">Slug URL Identifier *</label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. seltzers-and-coolers"
                className="w-full p-2.5 bg-cellar-cream border border-cellar-border rounded-sm focus:border-gold-600 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-cellar-charcoal mb-1">Card Background Tone</label>
              <select
                value={toneClass}
                onChange={(e) => setToneClass(e.target.value)}
                className="w-full p-2.5 bg-cellar-cream border border-cellar-border rounded-sm focus:border-gold-600 focus:outline-none"
              >
                <option value="tone-wine">Wine Accent (Pale Burgundy #EBDADD)</option>
                <option value="tone-spirits">Spirits Accent (Pale Platinum #E3E5E4)</option>
                <option value="tone-beer">Beer Accent (Pale Malt #F0E6D0)</option>
                <option value="tone-coolers">Coolers Accent (Pale Sage #E0E6DF)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-cellar-charcoal mb-1">Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary displayed on category banners and catalog headers..."
                className="w-full p-2.5 bg-cellar-cream border border-cellar-border rounded-sm focus:border-gold-600 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={creating}
              className="w-full py-3 bg-wine-700 hover:bg-wine-800 text-white font-bold text-xs uppercase tracking-wider rounded-sm transition shadow-sm disabled:bg-gray-400"
            >
              {creating ? 'Saving...' : 'Add Category'}
            </button>
          </form>
        </div>

        {/* Right: Existing Categories List */}
        <div className="lg:col-span-7 bg-white border border-cellar-border p-6 rounded-sm shadow-xs">
          <div className="flex items-center justify-between border-b border-cellar-border pb-3 mb-4">
            <h2 className="disp text-2xl font-bold text-cellar-charcoal">Existing Categories</h2>
            <span className="text-xs text-cellar-muted font-semibold">{categories.length} Total</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-cellar-border text-cellar-muted uppercase text-[10px] tracking-wider">
                  <th className="pb-3 font-semibold">Name</th>
                  <th className="pb-3 font-semibold">Slug</th>
                  <th className="pb-3 font-semibold">Tone</th>
                  <th className="pb-3 font-semibold text-right">Bottles</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cellar-border/60">
                {categories.map((c) => (
                  <tr key={c.id} className="hover:bg-cellar-cream/40">
                    <td className="py-3 font-bold text-cellar-charcoal">
                      <div>{c.name}</div>
                      <div className="text-[10px] text-cellar-muted font-normal line-clamp-1">{c.description}</div>
                    </td>
                    <td className="py-3 font-mono text-[11px] text-cellar-muted">
                      {c.slug}
                    </td>
                    <td className="py-3">
                      <span className={`inline-block px-2 py-0.5 rounded-xs text-[10px] font-semibold ${c.tone_class}`}>
                        {c.tone_class}
                      </span>
                    </td>
                    <td className="py-3 text-right font-bold text-wine-800">
                      {c.product_count || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

