'use client';

import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 350) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      className={`fixed z-40 flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 border border-cellar-border shadow-md hover:shadow-lg hover:border-gold-500 text-cellar-charcoal hover:text-wine-700 transition-all duration-300 transform active:scale-90 cursor-pointer ${
        visible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none'
      } bottom-20 right-4 sm:bottom-8 sm:right-8`}
      title="Back to Top"
    >
      <ChevronUp className="w-5 h-5 text-[#332E2A] hover:text-wine-800 transition" />
    </button>
  );
}
