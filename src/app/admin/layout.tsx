import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { Wine, LayoutDashboard, Package, Tag, ShoppingCart, LogOut, ExternalLink, Shield } from 'lucide-react';
import { getAdminSession } from '@/lib/auth';
import AdminLogoutButton from './AdminLogoutButton';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  
  // If on login page, render without admin sidebar chrome
  if (!session) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#F4F1EA] flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-cellar-charcoal text-[#D9D2C6] border-r border-white/10 flex flex-col justify-between p-5 flex-shrink-0">
        <div>
          {/* Admin Header / Brand */}
          <div className="flex items-center gap-3 pb-6 border-b border-white/10 mb-6">
            <div className="disp w-10 h-10 border border-gold-500 text-gold-400 flex items-center justify-center text-lg font-bold rounded-full">
              MH2
            </div>
            <div>
              <div className="disp text-lg text-white font-bold leading-tight">Admin Console</div>
              <div className="text-[10px] text-gold-400 tracking-wider uppercase font-semibold">Store Operations</div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 text-xs font-semibold">
            <Link
              href="/admin"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-sm text-[#CFC7B8] hover:text-white hover:bg-white/5 transition"
            >
              <LayoutDashboard className="w-4 h-4 text-gold-400" />
              <span>Dashboard Overview</span>
            </Link>

            <Link
              href="/admin/products"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-sm text-[#CFC7B8] hover:text-white hover:bg-white/5 transition"
            >
              <Package className="w-4 h-4 text-gold-400" />
              <span>Manage Products</span>
            </Link>

            <Link
              href="/admin/categories"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-sm text-[#CFC7B8] hover:text-white hover:bg-white/5 transition"
            >
              <Tag className="w-4 h-4 text-gold-400" />
              <span>Categories</span>
            </Link>

            <Link
              href="/admin/orders"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-sm text-[#CFC7B8] hover:text-white hover:bg-white/5 transition"
            >
              <ShoppingCart className="w-4 h-4 text-gold-400" />
              <span>Customer Orders</span>
            </Link>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-6 border-t border-white/10 space-y-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 text-xs text-gold-400 hover:text-gold-300 hover:bg-white/5 rounded-sm transition"
          >
            <span>View Storefront</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <div className="px-3 py-2 bg-black/40 rounded-sm text-[11px] text-[#A89E92]">
            <div className="truncate font-semibold text-white">{session.email}</div>
            <div className="text-[10px] text-gold-500 uppercase mt-0.5">Role: {session.role}</div>
          </div>

          <AdminLogoutButton />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
