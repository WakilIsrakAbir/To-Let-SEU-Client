'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { KeyRound, Mail, AlertCircle, CheckCircle2, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const { currentTheme } = useTheme();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const normalizedEmail = email.toLowerCase().trim();
    if (!normalizedEmail.endsWith('@gmail.com') && !normalizedEmail.endsWith('@seu.edu.bd')) {
      setError('Please enter a valid @gmail.com or @seu.edu.bd address associated with your account.');
      return;
    }

    setLoading(true);
    const res = await resetPassword(normalizedEmail);
    setLoading(false);

    if (res.success) {
      setSuccess(true);
    } else {
      setError(res.message || 'Failed to send reset email. Please verify the address.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950 p-4 transition-colors">
      <div className="card w-full max-w-md bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-8">
        {/* Header Icon & Title */}
        <div className="text-center mb-6">
          <div
            style={{ backgroundColor: currentTheme.hex }}
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl text-white mb-3 shadow-lg"
          >
            <KeyRound className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Reset Your Password
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Enter your registered Gmail or SEU student email address to receive a secure recovery link
          </p>
        </div>

        {error && (
          <div className="alert alert-error bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl mb-6 p-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="space-y-6">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-2xl text-sm flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-base mb-1">Password reset email sent!</p>
                <p>
                  Check your inbox for <strong>{email}</strong> for instructions to reset your password. The link expires in 1 hour.
                </p>
              </div>
            </div>

            <Link
              href="/login"
              style={{ backgroundColor: currentTheme.hex }}
              className="btn w-full border-none text-white rounded-xl py-3 text-base font-semibold shadow-lg flex items-center justify-center gap-2 hover:opacity-90 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Login</span>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Mail className="w-5 h-5" />
                </span>
                <input
                  type="email"
                  required
                  placeholder="yourname@gmail.com or @seu.edu.bd"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input input-bordered w-full pl-11 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 rounded-xl text-slate-800 dark:text-slate-200 text-sm"
                />
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Must be an active @seu.edu.bd or @gmail.com address
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ backgroundColor: currentTheme.hex }}
              className="btn w-full border-none text-white rounded-xl py-3 mt-4 text-base font-semibold shadow-lg flex items-center justify-center gap-2 hover:opacity-90 transition cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Sending reset link...</span>
                </>
              ) : (
                <>
                  <span>Send Reset Link</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="pt-4 text-center">
              <Link
                href="/login"
                className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:underline inline-flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Remember your password? Back to Login</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
