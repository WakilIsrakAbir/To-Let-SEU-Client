'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LogIn, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import GoogleAuthButton from '@/components/auth/GoogleAuthButton';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { currentTheme } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const normalizedEmail = email.toLowerCase().trim();
    if (!normalizedEmail.endsWith('@gmail.com') && !normalizedEmail.endsWith('@seu.edu.bd')) {
      setError('Only valid @gmail.com or @seu.edu.bd accounts are permitted.');
      return;
    }

    setLoading(true);
    const res = await login(normalizedEmail, password);
    setLoading(false);

    if (res.success) {
      router.push('/posts');
    } else {
      setError(res.message || 'Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950 p-4 transition-colors">
      <div className="card w-full max-w-md bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div
            style={{ backgroundColor: currentTheme.hex }}
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl text-white mb-3 shadow-lg"
          >
            <LogIn className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Welcome Back to <span style={{ color: currentTheme.hex }}>To Let SEU</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Log in with your Gmail or SEU student email account
          </p>
        </div>

        {error && (
          <div className="alert alert-error bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl mb-6 p-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 1-Click Google Sign In */}
        <div className="mb-5">
          <GoogleAuthButton label="Continue with Google" />
        </div>

        <div className="divider text-[11px] font-bold text-slate-400 uppercase tracking-wider my-4">
          or sign in with password
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Gmail Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Mail className="w-5 h-5" />
              </span>
              <input
                type="email"
                required
                placeholder="yourname@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input input-bordered w-full pl-11 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 rounded-xl text-slate-800 dark:text-slate-200 text-sm"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="label text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider p-0">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Lock className="w-5 h-5" />
              </span>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input input-bordered w-full pl-11 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 rounded-xl text-slate-800 dark:text-slate-200 text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ backgroundColor: currentTheme.hex }}
            className="btn w-full border-none text-white rounded-xl py-3 mt-4 text-base font-semibold shadow-lg flex items-center justify-center gap-2 hover:opacity-90 transition cursor-pointer"
          >
            {loading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          Don&apos;t have an account yet?{' '}
          <Link
            href="/register"
            style={{ color: currentTheme.hex }}
            className="font-bold hover:underline inline-flex items-center gap-1"
          >
            Register as SEU Student
          </Link>
        </p>
      </div>
    </div>
  );
}

