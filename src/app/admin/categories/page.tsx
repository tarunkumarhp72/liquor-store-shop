'use client';

import React, { useState, useEffect } from 'react';
import { 
  Tag, 
  Plus, 
  Check, 
  FolderPlus, 
  Pencil, 
  Trash2, 
  X, 
  AlertCircle, 
  RotateCcw, 
  Save, 
  Loader2,
  CheckCircle,
  Eye,
  EyeOff,
  Palette,
  Sparkles
} from 'lucide-react';

// Preset luxury color card tones for categories
export const COLOR_CARDS = [
  {
    id: 'tone-wine',
    name: 'Pale Burgundy',
    type: 'Wine & Rosé',
    hex: '#EBDADD',
    accent: '#722F37',
    border: '#D8BAC0',
  },
  {
    id: 'tone-spirits',
    name: 'Platinum Silver',
    type: 'Spirits & Hard Liquor',
    hex: '#E3E5E4',
    accent: '#2D3748',
    border: '#CCD0CF',
  },
  {
    id: 'tone-beer',
    name: 'Golden Malt',
    type: 'Beer, Ales & Stouts',
    hex: '#F0E6D0',
    accent: '#B45309',
    border: '#E2D1B2',
  },
  {
    id: 'tone-coolers',
    name: 'Pale Sage',
    type: 'Coolers & Seltzers',
    hex: '#E0E6DF',
    accent: '#047857',
    border: '#C5D3C4',
  },
  {
    id: 'tone-champagne',
    name: 'Champagne Gold',
    type: 'Sparkling & Brut',
    hex: '#F3ECDD',
    accent: '#92400E',
    border: '#E6DCBF',
  },
  {
    id: 'tone-agave',
    name: 'Agave Sand',
    type: 'Tequila & Mezcal',
    hex: '#EDE4D8',
    accent: '#78350F',
    border: '#DBCFC1',
  },
  {
    id: 'tone-rose',
    name: 'Blush Rosé',
    type: 'Rosé & Aperitifs',
    hex: '#FCE7F3',
    accent: '#BE185D',
    border: '#F9A8D4',
  },
  {
    id: 'tone-cider',
    name: 'Crisp Amber',
    type: 'Ciders & RTDs',
    hex: '#FDF2E9',
    accent: '#C2410C',
    border: '#FBD5B5',
  },
];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [toneClass, setToneClass] = useState('tone-wine');
  const [isActive, setIsActive] = useState(true);

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
    setIsActive(cat.is_active !== false);
    setMessage('');
    setErrorMessage('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName('');
    setSlug('');
    setDescription('');
    setToneClass('tone-wine');
    setIsActive(true);
    setMessage('');
    setErrorMessage('');
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    setTogglingId(id);
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_active: !currentStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        setCategories((prev) =>
          prev.map((c) => (c.id === id ? { ...c, is_active: !currentStatus } : c))
        );
        setMessage(`Category status updated to ${!currentStatus ? 'Active' : 'Inactive'}!`);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to toggle status');
    } finally {
      setTogglingId(null);
    }
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
          body: JSON.stringify({ 
            id: editingId, 
            name, 
            slug, 
            description, 
            tone_class: toneClass,
            is_active: isActive 
          }),
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
          body: JSON.stringify({ 
            name, 
            slug, 
            description, 
            tone_class: toneClass,
            is_active: isActive 
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to add category');

        setMessage('Category created successfully!');
        setName('');
        setSlug('');
        setDescription('');
        setIsActive(true);
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

  // Find currently selected color card metadata
  const selectedColorCard = COLOR_CARDS.find((c) => c.id === toneClass) || COLOR_CARDS[0];

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
          Create, edit, choose visual color cards, toggle active/inactive status, or manage product categories.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left Column: Create or Edit Category Form */}
        <div className="lg:col-span-6 bg-white border border-cellar-border p-4 sm:p-6 rounded-lg shadow-xs">
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
                className="text-xs text-cellar-muted hover:text-cellar-charcoal flex items-center gap-1 font-semibold cursor-pointer"
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

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
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

            {/* COLOR CARDS PICKER */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-semibold text-cellar-charcoal flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-wine-700" />
                  <span>Category Color Card Theme</span>
                </label>
                <span className="text-[10px] text-cellar-muted font-mono">
                  {selectedColorCard.hex}
                </span>
              </div>
              <p className="text-[11px] text-cellar-muted mb-2.5">
                Select a visual card tone for background accents and storefront product badges:
              </p>

              {/* Grid of Selectable Color Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {COLOR_CARDS.map((card) => {
                  const isSelected = toneClass === card.id;
                  return (
                    <button
                      key={card.id}
                      type="button"
                      onClick={() => setToneClass(card.id)}
                      style={{
                        backgroundColor: card.hex,
                        borderColor: isSelected ? card.accent : card.border,
                      }}
                      className={`relative text-left p-2.5 rounded-lg border-2 transition-all cursor-pointer shadow-2xs hover:shadow-xs flex flex-col justify-between min-h-[72px] ${
                        isSelected
                          ? 'ring-2 ring-offset-1 ring-wine-700 scale-[1.02]'
                          : 'opacity-85 hover:opacity-100 hover:scale-[1.01]'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span 
                          className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0" 
                          style={{ backgroundColor: card.accent }} 
                        />
                        {isSelected && (
                          <span 
                            className="w-4 h-4 rounded-full flex items-center justify-center text-white"
                            style={{ backgroundColor: card.accent }}
                          >
                            <Check className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </div>
                      <div className="mt-2">
                        <div className="font-bold text-[11px] text-cellar-charcoal leading-tight">
                          {card.name}
                        </div>
                        <div className="text-[9px] text-cellar-muted truncate font-medium">
                          {card.type}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Live Preview Card */}
              <div className="mt-3 p-3 bg-cellar-cream border border-cellar-border rounded-md">
                <div className="text-[10px] font-bold uppercase tracking-wider text-cellar-muted mb-1.5 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-gold-600" />
                  <span>Storefront Live Tile Preview:</span>
                </div>
                <div
                  style={{ backgroundColor: selectedColorCard.hex, borderColor: selectedColorCard.border }}
                  className="p-3 rounded-md border flex items-center justify-between shadow-2xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-xs"
                      style={{ backgroundColor: selectedColorCard.accent }}
                    >
                      {name ? name.charAt(0).toUpperCase() : 'C'}
                    </span>
                    <div>
                      <div className="font-bold text-xs text-cellar-charcoal">
                        {name || 'Category Name'}
                      </div>
                      <div className="text-[10px] text-cellar-muted font-medium">
                        {selectedColorCard.name} Tone ({selectedColorCard.hex})
                      </div>
                    </div>
                  </div>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: selectedColorCard.accent }}
                  >
                    Active
                  </span>
                </div>
              </div>
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

            <div className="pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-wine-700"
                />
                <span className="font-semibold text-cellar-charcoal">Category is Active in Storefront</span>
              </label>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-2.5 bg-wine-700 hover:bg-wine-800 text-white font-bold text-xs uppercase tracking-wider rounded-md transition shadow-sm disabled:bg-gray-400 flex items-center justify-center gap-1.5 min-h-[42px] cursor-pointer"
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
                  className="py-2.5 px-4 bg-cellar-cream hover:bg-zinc-200 text-cellar-charcoal font-bold text-xs uppercase rounded-md transition min-h-[42px] cursor-pointer"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right Column: Existing Categories List */}
        <div className="lg:col-span-6 bg-white border border-cellar-border p-4 sm:p-6 rounded-lg shadow-xs">
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
                  <th className="py-2.5 px-3 font-semibold">Category & Tone Card</th>
                  <th className="py-2.5 px-3 font-semibold">Slug</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Status</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Bottles</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cellar-border/60">
                {categories.map((c) => {
                  const isCurrentEditing = editingId === c.id;
                  const active = c.is_active !== false;
                  const catCard = COLOR_CARDS.find((card) => card.id === c.tone_class) || COLOR_CARDS[0];

                  return (
                    <tr
                      key={c.id}
                      className={`transition ${
                        isCurrentEditing ? 'bg-amber-50/70' : 'hover:bg-cellar-cream/40'
                      }`}
                    >
                      {/* Name & Tone Card Preview */}
                      <td className="py-3 px-3 font-bold text-cellar-charcoal">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0 shadow-2xs"
                            style={{ backgroundColor: catCard.hex }}
                            title={`${catCard.name} (${catCard.hex})`}
                          />
                          <span className="font-bold">{c.name}</span>
                          {isCurrentEditing && (
                            <span className="text-[9px] bg-amber-200 text-amber-900 px-1 rounded-sm uppercase font-bold">
                              Editing
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[9px] text-cellar-muted font-normal">
                            Card: <span className="font-medium text-stone-700">{catCard.name}</span>
                          </span>
                          <span className="text-[9px] text-stone-400 font-mono">({catCard.hex})</span>
                        </div>
                      </td>

                      {/* Slug */}
                      <td className="py-3 px-3 font-mono text-[11px] text-cellar-muted whitespace-nowrap">
                        {c.slug}
                      </td>

                      {/* Active / Inactive Status Toggle Pill */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(c.id, active)}
                          disabled={togglingId === c.id}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 transition cursor-pointer shadow-2xs ${
                            active
                              ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300'
                              : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600 border border-zinc-300'
                          }`}
                          title="Click to toggle Active / Inactive status"
                        >
                          {active ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-700" />
                              <span>Active</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3 text-zinc-500" />
                              <span>Inactive</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Bottle Count */}
                      <td className="py-3 px-3 text-center font-bold text-wine-800 whitespace-nowrap">
                        <span className="px-2 py-0.5 bg-cellar-cream rounded-sm font-mono">
                          {c.product_count || 0}
                        </span>
                      </td>

                      {/* Actions: Edit & Delete */}
                      <td className="py-3 px-3 text-right whitespace-nowrap space-x-1.5">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(c)}
                          className="p-1.5 text-cellar-charcoal hover:text-wine-700 hover:bg-wine-50 rounded-sm transition inline-flex items-center gap-1 border border-cellar-border cursor-pointer"
                          title="Edit category"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline text-[11px] font-semibold">Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(c.id, c.name)}
                          className="p-1.5 text-cellar-muted hover:text-red-600 hover:bg-red-50 rounded-sm transition inline-block border border-transparent cursor-pointer"
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
