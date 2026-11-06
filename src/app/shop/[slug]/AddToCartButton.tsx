'use client';

import React, { useState } from 'react';
import { ShoppingBag, Plus, Minus, Check } from 'lucide-react';
import { useCart } from '@/lib/cart';
import { Product } from '@/components/ProductCard';

export default function AddToCartButton({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const priceNum = typeof product.price === 'string' ? parseFloat(product.price) : product.price;

  const handleAdd = () => {
    if (!product.is_in_stock) return;
    addItem(
      {
        id: product.id,
        name: product.name,
        price: priceNum,
        volume: product.volume || '750 ml',
        abv: product.abv || '13.5%',
        image_url: product.image_url,
      },
      qty
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* Quantity Selector */}
      <div className="flex items-center border border-cellar-border rounded-sm bg-cellar-cream">
        <button
          onClick={() => setQty((prev) => Math.max(1, prev - 1))}
          className="p-3 hover:bg-white text-cellar-charcoal transition"
          aria-label="Decrease quantity"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="px-4 text-sm font-bold text-cellar-charcoal min-w-[3rem] text-center">
          {qty}
        </span>
        <button
          onClick={() => setQty((prev) => prev + 1)}
          className="p-3 hover:bg-white text-cellar-charcoal transition"
          aria-label="Increase quantity"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Add Button */}
      <button
        onClick={handleAdd}
        disabled={!product.is_in_stock}
        className={`flex-1 sm:flex-none px-8 py-3.5 rounded-sm text-sm font-bold tracking-wider uppercase transition flex items-center justify-center gap-2 shadow-md ${
          added
            ? 'bg-emerald-700 text-white'
            : product.is_in_stock
            ? 'bg-wine-700 hover:bg-wine-800 text-white'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        {added ? (
          <>
            <Check className="w-4 h-4" />
            <span>Added to Bag</span>
          </>
        ) : (
          <>
            <ShoppingBag className="w-4 h-4" />
            <span>{product.is_in_stock ? 'Add to Bag' : 'Out of Stock'}</span>
          </>
        )}
      </button>
    </div>
  );
}

