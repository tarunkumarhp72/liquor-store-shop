'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  Tag, 
  ShoppingCart, 
  ExternalLink, 
  Menu, 
  X, 
  ShieldCheck, 
  LogOut 
} from 'lucide-react';
import AdminLogoutButton from './AdminLogoutButton';

interface AdminNavigationProps {
  session: {
    email: string;
    role: string;
  };
}

export default function AdminNavigation({ session }: AdminNavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { label: 'Dashboard Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Manage Products', href: '/admin/products', icon: Package },
    { label: 'Categories', href: '/admin/categories', icon: Tag },
    { label: 'Customer Orders', href: '/admin/orders', icon: ShoppingCart },
  ];

  return (
    <>
      {/* 1. Mobile & Tablet Top Header Bar (< md) */}
      <div className="md:hidden sticky top-0 z-40 bg-cellar-charcoal text-[#D9D2C6] border-b border-white/10 px-4 py-3 flex items-center justify-between shadow-md">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full border border-gold-500 text-gold-400 flex items-center justify-center text-xs font-bold bg-white/5">
            MH2
          </div>
          <div>
            <div className="disp text-sm font-bold text-white leading-tight">Admin Console</div>
            <div className="text-[9px] text-gold-400 uppercase font-semibold">Store Management</div>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className="p-1.5 text-gold-400 hover:text-white rounded-md bg-white/5 border border-white/10 text-xs"
            title="View live storefront"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-8 h-8 flex items-center justify-center text-white bg-white/10 hover:bg-white/20 border border-gold-500/40 rounded-md transition"
            aria-label="Toggle admin navigation"
          >
            {mobileMenuOpen ? <X className="w-4 h-4 text-gold-400" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 2. Mobile Drawer (< md) */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#181311] border-b border-white/15 px-4 py-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <nav className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-md text-xs font-semibold transition ${
                    active
                      ? 'bg-wine-700 text-white font-bold'
                      : 'text-[#CFC7B8] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-gold-300' : 'text-gold-400'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-white/10 space-y-2.5">
            <div className="px-3 py-2 bg-black/40 rounded-md text-[11px] text-[#A89E92] flex items-center justify-between">
              <span className="truncate text-white font-medium">{session.email}</span>
              <span className="text-[10px] text-gold-400 uppercase font-bold">{session.role}</span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <Link
                href="/"
                target="_blank"
                className="flex-1 text-center py-2 bg-white/10 text-gold-400 text-xs font-semibold rounded-md border border-white/10"
              >
                Storefront
              </Link>
              <div className="flex-1">
                <AdminLogoutButton />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Desktop Left Sidebar (>= md) - Stretches full container height to eliminate bottom gap */}
      <aside className="hidden md:block w-64 bg-cellar-charcoal text-[#D9D2C6] border-r border-white/10 shrink-0 self-stretch">
        <div className="sticky top-0 flex flex-col justify-between p-5 min-h-screen max-h-screen overflow-y-auto">
          <div>
            {/* Brand */}
            <div className="flex items-center gap-3 pb-6 border-b border-white/10 mb-6">
              <div className="disp w-10 h-10 border border-gold-500 text-gold-400 flex items-center justify-center text-lg font-bold rounded-full bg-white/5">
                MH2
              </div>
              <div>
                <div className="disp text-lg text-white font-bold leading-tight">Admin Console</div>
                <div className="text-[10px] text-gold-400 tracking-wider uppercase font-semibold">
                  Store Operations
                </div>
              </div>
            </div>

            {/* Links */}
            <nav className="space-y-1 text-xs font-semibold">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-md transition ${
                      active
                        ? 'bg-wine-700 text-white font-bold shadow-xs'
                        : 'text-[#CFC7B8] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-gold-300' : 'text-gold-400'}`} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Footer */}
          <div className="pt-6 border-t border-white/10 space-y-3">
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-between px-3 py-2 text-xs text-gold-400 hover:text-gold-300 hover:bg-white/5 rounded-md transition border border-white/10"
            >
              <span>View Storefront</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <div className="px-3 py-2 bg-black/40 rounded-md text-[11px] text-[#A89E92]">
              <div className="truncate font-semibold text-white">{session.email}</div>
              <div className="text-[10px] text-gold-500 uppercase mt-0.5">Role: {session.role}</div>
            </div>

            <AdminLogoutButton />
          </div>
        </div>
      </aside>
    </>
  );
}

