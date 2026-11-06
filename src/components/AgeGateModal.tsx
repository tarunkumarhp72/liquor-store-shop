'use client';

import React, { useState, useEffect } from 'react';
import { ShieldAlert, Wine } from 'lucide-react';

export default function AgeGateModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [underage, setUnderage] = useState(false);

  useEffect(() => {
    try {
      const verified = localStorage.getItem('mh2_age_verified');
      if (!verified) {
        setIsOpen(true);
      }
    } catch {
      setIsOpen(true);
    }
  }, []);

  const handleConfirmAge = () => {
    try {
      localStorage.setItem('mh2_age_verified', 'true');
    } catch (e) {
      console.error(e);
    }
    setIsOpen(false);
  };

  const handleUnderage = () => {
    setUnderage(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-cellar-charcoal/90 backdrop-blur-md">
      <div className="relative w-full max-w-lg p-5 sm:p-8 bg-[#F8F5EF] border border-gold-600 shadow-2xl text-center rounded-sm max-h-[92dvh] overflow-y-auto">
        {/* Crest */}
        <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-gold-600 flex items-center justify-center mb-3 sm:mb-5 bg-wine-50 text-wine-700">
          <Wine className="w-6 h-6 sm:w-8 sm:h-8 text-wine-700" />
        </div>

        {!underage ? (
          <>
            <div className="text-[10px] sm:text-xs font-bold tracking-widest text-gold-700 uppercase mb-1.5">
              Legal Drinking Age Verification (21+)
            </div>
            <h2 className="disp text-2xl sm:text-3xl text-cellar-charcoal mb-2 sm:mb-3 font-bold">
              Welcome to MH2 Wine & Spirits
            </h2>
            <p className="text-xs sm:text-sm text-cellar-muted leading-relaxed mb-5">
              In accordance with beverage control laws, you must be at least <strong>21 years of age</strong> (18+ in Alberta, Canada) to view our catalog and purchase alcoholic beverages.
            </p>

            <div className="flex flex-col sm:flex-row gap-2.5 justify-center mb-3">
              <button
                onClick={handleConfirmAge}
                className="w-full sm:w-auto min-h-[44px] px-6 py-3 bg-wine-700 hover:bg-wine-800 text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition rounded-sm shadow-md active:scale-98"
              >
                I AM 21 OR OLDER
              </button>
              <button
                onClick={handleUnderage}
                className="w-full sm:w-auto min-h-[44px] px-5 py-3 border border-cellar-border text-cellar-charcoal hover:bg-white font-bold text-xs sm:text-sm uppercase tracking-wider transition rounded-sm active:scale-98"
              >
                I AM UNDER 21
              </button>
            </div>

            <div className="text-[10px] text-cellar-muted/80 leading-normal pt-1">
              Valid government-issued photo ID is required for all in-store pickups and Uber Eats deliveries.
            </div>
          </>
        ) : (
          <div className="py-2">
            <ShieldAlert className="w-10 h-10 text-wine-700 mx-auto mb-3" />
            <h3 className="disp text-xl sm:text-2xl text-cellar-charcoal mb-2 font-bold">Access Restricted</h3>
            <p className="text-xs sm:text-sm text-cellar-muted mb-5">
              You must be of legal drinking age to view this store. We promote responsible beverage consumption.
            </p>
            <a
              href="https://www.responsibility.org"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block min-h-[44px] px-6 py-2.5 bg-wine-700 text-white text-xs font-bold uppercase rounded-sm"
            >
              Learn More at Responsibility.org
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
