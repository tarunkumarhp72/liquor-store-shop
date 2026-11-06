'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Wine, Lock, Mail, ShieldCheck, ArrowLeft } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
        body: JSON.stringify({ email: email.trim(), password }),
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
      <div className="w-full max-w-md bg-white border border-gold-500/30 rounded-lg shadow-2xl p-7 sm:p-10 relative">
        {/* Brand Crest */}
        <div className="w-16 h-16 rounded-full border-2 border-gold-500/60 flex items-center justify-center mx-auto mb-4 bg-wine-50 text-wine-700 shadow-xs">
          <Wine className="w-8 h-8" />
        </div>

        <div className="text-center mb-6">
          <h1 className="disp text-3xl font-bold text-cellar-charcoal">Admin Portal</h1>
          <p className="text-xs text-cellar-muted mt-1 uppercase tracking-wider font-semibold text-gold-700">
            MH2 Wine & Spirits Management
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md">
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
                placeholder="admin@mh2liquor.com"
                autoComplete="email"
                className="w-full pl-9 pr-3 py-2.5 bg-cellar-cream border border-cellar-border rounded-md focus:border-gold-600 focus:outline-none text-cellar-charcoal text-xs"
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
                placeholder="••••••••••••"
                autoComplete="current-password"
                className="w-full pl-9 pr-3 py-2.5 bg-cellar-cream border border-cellar-border rounded-md focus:border-gold-600 focus:outline-none text-cellar-charcoal text-xs"
              />
              <Lock className="w-4 h-4 text-cellar-muted absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-wine-700 hover:bg-wine-800 active:scale-98 text-white font-bold text-xs uppercase tracking-widest rounded-md transition shadow-md disabled:bg-gray-400 mt-2 min-h-[42px] cursor-pointer"
          >
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
          </button>
        </form>

        {/* Security badge */}
        <div className="mt-6 pt-4 border-t border-cellar-border flex items-center justify-between text-[11px] text-cellar-muted">
          <Link
            href="/"
            className="hover:text-wine-700 transition flex items-center gap-1 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Storefront</span>
          </Link>
          <div className="flex items-center gap-1 text-emerald-800">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Encrypted Session</span>
          </div>
        </div>
      </div>
    </div>
  );
}
