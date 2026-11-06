'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, MapPin, Truck } from 'lucide-react';
import BrandLogo from '@/components/BrandLogo';
import CallStoreModal from '@/components/CallStoreModal';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [callModalOpen, setCallModalOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Shop Catalog', href: '/shop' },
    { label: 'Pickup & Delivery', href: '/delivery' },
    { label: 'About Store', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const uberEatsUrl = process.env.NEXT_PUBLIC_UBER_EATS_URL || 'https://www.ubereats.com/ca/store/mh2-liquor-store/FurwEWDqXG2txmJ3L1Kcig';

  return (
    <>
      <CallStoreModal isOpen={callModalOpen} onClose={() => setCallModalOpen(false)} />

      {/* Top Utility Bar */}
      <div className="bg-cellar-charcoal text-[#D9D2C6] text-xs py-1.5 px-4 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-2">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 font-medium text-[11px] sm:text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Open daily 10:00 AM – 2:00 AM
            </span>
            <span className="hidden md:inline-flex items-center gap-1 text-[#CFC7B8] text-xs">
              <MapPin className="w-3.5 h-3.5 text-gold-500" />
              3106 A 4 St NW, Calgary, AB
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCallModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-white font-semibold hover:text-gold-400 transition text-[11px] sm:text-xs min-h-[32px] cursor-pointer"
              title="Call MH2 Liquor Store"
            >
              <Phone className="w-3 h-3 text-gold-500" />
              <span>(403) 769-0061</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Sticky Header - Frosted luxury glassmorphic bar */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#14100E]/85 border-b border-white/[0.08] shadow-md transition-all duration-200">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-3">
          {/* Logo & Brand - Scaled for high mobile elegance */}
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group shrink-0">
            <BrandLogo size={40} className="group-hover:scale-105 transition-transform sm:w-[44px] sm:h-[44px]" />
            <div className="flex flex-col">
              <span className="disp text-base xs:text-lg sm:text-xl md:text-2xl leading-none text-white font-bold tracking-tight group-hover:text-gold-300 transition">
                MH2 Liquor Store
              </span>
              <span className="text-[8px] sm:text-[9px] md:text-[10px] tracking-widest uppercase font-semibold text-gold-400 mt-0.5">
                Wine, Beer & Spirits
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => {
              const active = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs font-bold tracking-wider uppercase py-1 transition border-b-2 ${
                    active
                      ? 'text-gold-400 border-gold-500'
                      : 'text-zinc-300 hover:text-white border-transparent hover:border-gold-500/50'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Header Action Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Soft-rounded Uber Eats Button */}
            <a
              href={uberEatsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 bg-wine-700 hover:bg-wine-600 active:scale-95 text-white text-[11px] sm:text-xs font-bold tracking-wider uppercase rounded-md transition shadow-sm min-h-[36px] border border-wine-500/30"
            >
              <Truck className="w-3.5 h-3.5 text-gold-400 shrink-0" />
              <span>Uber Eats</span>
            </a>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-9 h-9 flex items-center justify-center text-white hover:text-gold-400 bg-white/10 hover:bg-white/15 border border-gold-500/40 rounded-md active:scale-95 transition focus:outline-none focus:ring-2 focus:ring-gold-500/50"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4 text-gold-400" strokeWidth={2.5} />
              ) : (
                <Menu className="w-4 h-4 text-white" strokeWidth={2.5} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#14100E]/95 backdrop-blur-2xl border-t border-gold-900/40 px-5 py-4 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`min-h-[44px] flex items-center text-sm font-bold tracking-wide px-3 rounded-md transition ${
                      active ? 'bg-gold-500/15 text-gold-400' : 'text-zinc-200 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}

              <div className="pt-3 border-t border-white/10 space-y-2 mt-2">
                <a
                  href={uberEatsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] w-full py-2.5 bg-wine-700 hover:bg-wine-600 text-white text-center text-xs font-bold uppercase rounded-md tracking-wide flex items-center justify-center gap-2 shadow-xs transition"
                >
                  <Truck className="w-3.5 h-3.5 text-gold-400" />
                  <span>Order on Uber Eats</span>
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setCallModalOpen(true);
                  }}
                  className="min-h-[44px] w-full py-2.5 bg-white/10 hover:bg-white/15 text-white text-center text-xs font-bold uppercase rounded-md tracking-wide flex items-center justify-center gap-2 border border-gold-500/30 transition cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-gold-400" />
                  <span>Call Store: (403) 769-0061</span>
                </button>
                <Link
                  href="/admin/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="min-h-[40px] text-[11px] text-center text-zinc-400 hover:text-gold-400 flex items-center justify-center transition"
                >
                  Staff Admin Sign In
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
