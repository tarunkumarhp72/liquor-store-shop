'use client';

import React, { useState, useEffect } from 'react';
import { Phone, Copy, Check, X, Clock, MapPin, Sparkles } from 'lucide-react';

interface CallStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CallStoreModal({ isOpen, onClose }: CallStoreModalProps) {
  const [copied, setCopied] = useState(false);
  const phoneNumber = '(403) 769-0061';
  const rawPhone = '+14037690061';

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(phoneNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-sm bg-[#1A1412] text-white border border-gold-500/40 rounded-lg shadow-2xl p-5 sm:p-6 z-10 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white flex items-center justify-center transition focus:outline-none"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Icon */}
        <div className="w-12 h-12 rounded-full bg-wine-700/80 border border-gold-500/50 flex items-center justify-center text-gold-400 mx-auto mb-3 shadow-md">
          <Phone className="w-5 h-5 animate-pulse" />
        </div>

        {/* Titles */}
        <div className="text-center mb-4">
          <span className="text-[10px] font-bold tracking-widest uppercase text-gold-400">
            MH2 Liquor Store Pickup
          </span>
          <h3 className="disp text-xl sm:text-2xl font-bold text-white mt-0.5">
            Call for Curbside Pickup
          </h3>
          <p className="text-xs text-zinc-300 mt-1">
            Ready for 15-minute pickup at our 4th Street NW location.
          </p>
        </div>

        {/* Phone Card */}
        <div className="bg-[#241C18] border border-white/10 rounded-md p-3.5 mb-4 text-center">
          <span className="text-[11px] text-zinc-400 font-medium block">Direct Store Line</span>
          <div className="text-2xl font-bold tracking-wider text-gold-300 my-1 font-mono">
            {phoneNumber}
          </div>
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Open Now (10:00 AM – 2:00 AM)</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          {/* 1-Click Copy Button */}
          <button
            onClick={handleCopy}
            className="w-full min-h-[42px] px-4 py-2.5 bg-gold-600 hover:bg-gold-500 text-cellar-charcoal font-bold text-xs uppercase tracking-wider rounded-md flex items-center justify-center gap-2 transition active:scale-98 shadow-sm"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-900" />
                <span>Number Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Phone Number</span>
              </>
            )}
          </button>

          {/* Direct Dial Link */}
          <a
            href={`tel:${rawPhone}`}
            className="w-full min-h-[42px] px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider rounded-md flex items-center justify-center gap-2 border border-white/15 transition active:scale-98"
          >
            <Phone className="w-4 h-4 text-gold-400" />
            <span>Dial {phoneNumber}</span>
          </a>
        </div>

        {/* Info Badges */}
        <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-zinc-400 space-y-1.5">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-gold-500 shrink-0" />
            <span>Daily Late Nights: 10:00 AM – 2:00 AM</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-gold-500 shrink-0" />
            <span>3106 A 4 St NW, Calgary, AB (Beside Pad Thai)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

