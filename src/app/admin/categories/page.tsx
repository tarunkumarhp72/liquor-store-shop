'use client';

import React, { useState, useEffect } from 'react';
import { Tag, Plus, Check, FolderPlus, Pencil, Trash2, X, AlertCircle, RotateCcw, Save, Loader2 } from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);

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

  const handleStartEdit = (cat: any) => {
    setEditingId(cat.id);
    setName(cat.name || '');
    setSlug(cat.slug || '');
    setDescription(cat.description || '');
    setToneClass(cat.tone_class || 'tone-wine');
    setMessage('');
    setErrorMessage('');
    // Scroll form into view on mobile
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName('');
    setSlug('');
    setDescription('');
    setToneClass('tone-wine');
    setMessage('');
    setErrorMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    setErrorMessage('');

    try {
      if (editingId) {
        // UPDATE CATEGORY (PUT)
        const res = await fetch('/api/admin/categories', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, name, slug, description, tone_class: toneClass }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to update category');

        setMessage('Category updated successfully!');
        handleCancelEdit();
        fetchCategories();
      } else {
        // CREATE CATEGORY (POST)
        const res = await fetch('/api/admin/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, slug, description, tone_class: toneClass }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to add category');

        setMessage('Category created successfully!');
        setName('');
        setSlug('');
        setDescription('');
        fetchCategories();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id: string, catName: string) => {
    if (!confirm(`Are you sure you want to delete category "${catName}"?`)) return;

    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete category');

      setMessage(`Category "${catName}" deleted successfully`);
      fetchCategories();
    } catch (err: any) {
      setErrorMessage(err.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="border-b border-cellar-border pb-4">
        <div className="text-[11px] sm:text-xs font-bold tracking-widest uppercase text-gold-700 mb-1">
          Catalog Taxonomy
        </div>
        <h1 className="disp text-2xl sm:text-4xl font-bold text-cellar-charcoal">
          Manage Cellar Categories
        </h1>
        <p className="text-xs text-cellar-muted mt-1 max-w-2xl">
          Create, edit, or remove product categories, customize card tone themes, and track bottle distributions across the cellar.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left Column: Create or Edit Category Form */}
        <div className="lg:col-span-5 bg-white border border-cellar-border p-4 sm:p-6 rounded-lg shadow-xs sticky top-20">
          <div className="flex items-center justify-between border-b border-cellar-border pb-3 mb-4">
            <div className="flex items-center gap-2">
              <FolderPlus className="w-5 h-5 text-wine-700" />
              <h2 className="disp text-xl sm:text-2xl font-bold text-cellar-charcoal">
                {editingId ? 'Edit Category' : 'Create Category'}
              </h2>
            </div>
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="text-xs text-cellar-muted hover:text-cellar-charcoal flex items-center gap-1 font-semibold"
              >
                <X className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </button>
            )}
          </div>

          {message && (
            <div className="p-3 text-xs rounded-md mb-4 border bg-emerald-50 text-emerald-800 border-emerald-200 flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{message}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 text-xs rounded-md mb-4 border bg-red-50 text-red-700 border-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-cellar-charcoal mb-1">Category Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!editingId && !slug) {
                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                  }
                }}
                placeholder="e.g. Rare Whiskeys, Sparkling Wine"
                className="w-full p-2.5 bg-cellar-cream border border-cellar-border rounded-md focus:border-gold-600 focus:outline-none min-h-[40px]"
              />
            </div>

            <div>
              <label className="block font-semibold text-cellar-charcoal mb-1">Slug URL Identifier *</label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. rare-whiskeys"
                className="w-full p-2.5 bg-cellar-cream border border-cellar-border rounded-md focus:border-gold-600 focus:outline-none font-mono text-xs min-h-[40px]"
              />
            </div>

            <div>
              <label className="block font-semibold text-cellar-charcoal mb-1">Card Background Tone</label>
              <select
                value={toneClass}
                onChange={(e) => setToneClass(e.target.value)}
                className="w-full p-2.5 bg-cellar-cream border border-cellar-border rounded-md focus:border-gold-600 focus:outline-none min-h-[40px]"
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
                placeholder="Brief summary displayed on category headers and filter lists..."
                className="w-full p-2.5 bg-cellar-cream border border-cellar-border rounded-md focus:border-gold-600 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-2.5 bg-wine-700 hover:bg-wine-800 text-white font-bold text-xs uppercase tracking-wider rounded-md transition shadow-sm disabled:bg-gray-400 flex items-center justify-center gap-1.5 min-h-[42px]"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : editingId ? (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Update Category</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Category</span>
                  </>
                )}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="py-2.5 px-4 bg-cellar-cream hover:bg-zinc-200 text-cellar-charcoal font-bold text-xs uppercase rounded-md transition min-h-[42px]"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right Column: Existing Categories List */}
        <div className="lg:col-span-7 bg-white border border-cellar-border p-4 sm:p-6 rounded-lg shadow-xs">
          <div className="flex items-center justify-between border-b border-cellar-border pb-3 mb-4">
            <h2 className="disp text-xl sm:text-2xl font-bold text-cellar-charcoal">
              Existing Categories
            </h2>
            <span className="text-xs text-cellar-muted font-semibold bg-cellar-cream px-2 py-0.5 rounded-sm">
              {categories.length} Total
            </span>
          </div>

          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-left text-xs min-w-[500px]">
              <thead>
                <tr className="border-b border-cellar-border text-cellar-muted uppercase text-[10px] tracking-wider bg-cellar-cream/60">
                  <th className="py-2.5 px-3 font-semibold">Name & Details</th>
                  <th className="py-2.5 px-3 font-semibold">Slug</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Bottles</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cellar-border/60">
                {categories.map((c) => {
                  const isCurrentEditing = editingId === c.id;
                  return (
                    <tr
                      key={c.id}
                      className={`transition ${
                        isCurrentEditing ? 'bg-amber-50/70' : 'hover:bg-cellar-cream/40'
                      }`}
                    >
                      {/* Name & Description */}
                      <td className="py-3 px-3 font-bold text-cellar-charcoal">
                        <div className="flex items-center gap-1.5">
                          <span>{c.name}</span>
                          {isCurrentEditing && (
                            <span className="text-[9px] bg-amber-200 text-amber-900 px-1 rounded-sm uppercase font-bold">
                              Editing
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-cellar-muted font-normal line-clamp-1 mt-0.5">
                          {c.description || 'No description provided.'}
                        </div>
                      </td>

                      {/* Slug */}
                      <td className="py-3 px-3 font-mono text-[11px] text-cellar-muted whitespace-nowrap">
                        {c.slug}
                      </td>

                      {/* Bottle Count */}
                      <td className="py-3 px-3 text-center font-bold text-wine-800 whitespace-nowrap">
                        <span className="px-2 py-0.5 bg-cellar-cream rounded-sm">
                          {c.product_count || 0}
                        </span>
                      </td>

                      {/* Actions: Edit & Delete */}
                      <td className="py-3 px-3 text-right whitespace-nowrap space-x-1.5">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(c)}
                          className="p-1.5 text-cellar-charcoal hover:text-wine-700 hover:bg-wine-50 rounded-sm transition inline-flex items-center gap-1 border border-cellar-border"
                          title="Edit category"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline text-[11px] font-semibold">Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(c.id, c.name)}
                          className="p-1.5 text-cellar-muted hover:text-red-600 hover:bg-red-50 rounded-sm transition inline-block border border-transparent"
                          title="Delete category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
