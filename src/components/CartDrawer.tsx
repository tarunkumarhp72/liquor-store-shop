'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useCart } from '@/lib/cart';

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, clearCart, subtotal, totalCount } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-[#F8F5EF] shadow-2xl flex flex-col border-l border-cellar-border"
          >
            {/* Drawer Header */}
            <div className="p-5 border-b border-cellar-border bg-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-wine-700" />
                <h3 className="disp text-2xl text-cellar-charcoal font-semibold">Your Selection</h3>
                <span className="text-xs bg-wine-50 text-wine-800 font-bold px-2 py-0.5 rounded-full border border-wine-200">
                  {totalCount} {totalCount === 1 ? 'item' : 'items'}
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-cellar-muted hover:text-cellar-charcoal rounded-sm hover:bg-cellar-light transition"
                aria-label="Close cart"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-cellar-muted">
                  <ShoppingBag className="w-16 h-16 text-cellar-borderDark mb-4 stroke-1" />
                  <p className="disp text-2xl text-cellar-charcoal mb-1">Your cart is empty</p>
                  <p className="text-sm max-w-xs mb-6">Explore our curated cellar of fine wines, rare whiskeys, and cold beers.</p>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-6 py-2.5 bg-wine-700 text-white text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-wine-800 transition"
                  >
                    Browse Cellar
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3.5 p-3.5 bg-white border border-cellar-border rounded-sm shadow-sm"
                  >
                    {/* Bottle thumbnail */}
                    <div className="w-16 h-20 bg-wine-50/50 flex-shrink-0 flex items-center justify-center p-1 border border-cellar-border/60 rounded-sm">
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        width={60}
                        height={80}
                        className="max-h-full w-auto object-contain"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-cellar-charcoal truncate">{item.name}</h4>
                        <div className="text-[11px] text-cellar-muted mt-0.5">
                          {item.volume} &bull; {item.abv}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-cellar-border rounded-sm bg-cellar-cream">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1 hover:bg-white text-cellar-charcoal transition"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2.5 text-xs font-bold text-cellar-charcoal">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1 hover:bg-white text-cellar-charcoal transition"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-wine-700">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-cellar-muted hover:text-red-600 transition p-1"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Drawer Footer */}
            {items.length > 0 && (
              <div className="p-5 border-t border-cellar-border bg-white space-y-3">
                {/* 21+ Notice */}
                <div className="flex items-center gap-2 text-[11px] text-cellar-muted bg-wine-50/60 p-2 border border-wine-100 rounded-sm">
                  <ShieldCheck className="w-4 h-4 text-wine-700 flex-shrink-0" />
                  <span>21+ ID verification required upon order delivery or pickup.</span>
                </div>

                {/* Subtotal */}
                <div className="flex justify-between items-center text-sm text-cellar-charcoal">
                  <span>Subtotal</span>
                  <span className="font-bold text-lg text-wine-800">${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex flex-col gap-2 pt-1">
                  <Link
                    href="/cart"
                    onClick={() => setIsOpen(false)}
                    className="w-full py-3.5 bg-wine-700 hover:bg-wine-800 text-white font-bold text-xs uppercase tracking-wider text-center rounded-sm transition shadow-md"
                  >
                    Proceed to Reserve Order
                  </Link>
                  <button
                    onClick={clearCart}
                    className="text-xs text-cellar-muted hover:text-cellar-charcoal text-center py-1 transition"
                  >
                    Clear All Items
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

