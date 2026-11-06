'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Wine, Lock, Mail, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@mh2liquor.com');
  const [password, setPassword] = useState('MH2Liquor2026!Admin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cellar-charcoal flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white border border-gold-600/40 rounded-sm shadow-2xl p-8 sm:p-10 relative">
        {/* Brand Crest */}
        <div className="w-16 h-16 rounded-full border-2 border-gold-600 flex items-center justify-center mx-auto mb-4 bg-wine-50 text-wine-700">
          <Wine className="w-8 h-8" />
        </div>

        <div className="text-center mb-6">
          <h1 className="disp text-3xl font-bold text-cellar-charcoal">Admin Portal</h1>
          <p className="text-xs text-cellar-muted mt-1 uppercase tracking-wider font-semibold text-gold-700">
            MH2 Wine & Spirits Management
          </p>
        </div>

        {/* Credentials Reminder Box */}
        <div className="mb-6 p-3.5 bg-cellar-cream border border-cellar-border rounded-sm text-xs text-cellar-muted">
          <div className="flex items-center gap-1.5 font-bold text-cellar-charcoal mb-1">
            <KeyRound className="w-3.5 h-3.5 text-wine-700" />
            <span>Store Admin Access:</span>
          </div>
          <div className="font-mono text-[11px] text-wine-900 space-y-0.5">
            <div>Email: <strong className="select-all">admin@mh2liquor.com</strong></div>
            <div>Password: <strong className="select-all">MH2Liquor2026!Admin</strong></div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-cellar-charcoal mb-1">Admin Email</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-cellar-cream border border-cellar-border rounded-sm focus:border-gold-600 focus:outline-none"
              />
              <Mail className="w-4 h-4 text-cellar-muted absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-cellar-charcoal mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-cellar-cream border border-cellar-border rounded-sm focus:border-gold-600 focus:outline-none"
              />
              <Lock className="w-4 h-4 text-cellar-muted absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-wine-700 hover:bg-wine-800 text-white font-bold text-xs uppercase tracking-widest rounded-sm transition shadow-md disabled:bg-gray-400 mt-2"
          >
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-cellar-border text-center">
          <Link
            href="/"
            className="text-xs text-cellar-muted hover:text-wine-700 transition font-medium"
          >
            &larr; Return to Customer Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}

