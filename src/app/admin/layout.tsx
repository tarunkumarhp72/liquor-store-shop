import React from 'react';
import { getAdminSession } from '@/lib/auth';
import AdminNavigation from './AdminNavigation';

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
      {/* Responsive Admin Navigation (Desktop Sidebar + Mobile/Tablet Topbar & Drawer) */}
      <AdminNavigation session={session} />

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-10 overflow-x-hidden min-w-0">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
