'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import {
  AlertTriangle,
  RefreshCw,
  Home,
  Compass,
  LifeBuoy,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
} from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalErrorPage({ error, reset }: ErrorProps) {
  const { currentTheme } = useTheme();
  const [retrying, setRetrying] = React.useState(false);
  const [showDebug, setShowDebug] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    // Log unexpected runtime error to developer console
    console.error('Next.js App Error caught in error.tsx boundary:', error);
  }, [error]);

  const handleRetry = () => {
    setRetrying(true);
    try {
      reset();
    } catch {
      window.location.reload();
    } finally {
      setTimeout(() => setRetrying(false), 500);
    }
  };

  const handleCopyLogs = () => {
    const errorSummary = `[TO-LET SEU ERROR LOG]\nMessage: ${error?.message || 'Unknown error'}\nDigest: ${
      error?.digest || 'N/A'
    }\nStack: ${error?.stack || 'No stack trace'}\nLocation: ${
      typeof window !== 'undefined' ? window.location.href : 'Unknown'
    }\nTime: ${new Date().toISOString()}`;

    navigator.clipboard.writeText(errorSummary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="relative w-full max-w-xl mx-auto">
        {/* Ambient Warm Gradient Halo */}
        <div className="absolute -inset-4 rounded-3xl bg-rose-500/10 dark:bg-rose-500/15 blur-2xl pointer-events-none" />

        {/* Clean Glassmorphism Card */}
        <div className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-8 sm:p-12 shadow-2xl text-center overflow-hidden">
          {/* Top Decorative Border Accent */}
          <div
            className="absolute top-0 left-0 right-0 h-1.5"
            style={{
              background: `linear-gradient(90deg, #f43f5e, ${currentTheme.hex}, #f59e0b)`,
            }}
          />

          {/* Clean Alert Badge */}
          <div className="relative inline-flex items-center justify-center mb-6">
            <div className="w-20 h-20 rounded-3xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 flex items-center justify-center shadow-lg">
              <AlertTriangle className="w-10 h-10 stroke-[2.2]" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500"></span>
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
            Something Went Wrong
          </h1>

          {/* Friendly Bengali Subtitle */}
          <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 mb-3">
            কিছু একটা অপ্রত্যাশিত সমস্যা হয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।
          </p>

          {/* Reassuring Explanation */}
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed mb-8">
            An unexpected glitch occurred while loading this page. Your session and saved data
            are safe. You can refresh the view or navigate back to the campus housing listings.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
            <button
              onClick={handleRetry}
              disabled={retrying}
              style={{ backgroundColor: currentTheme.hex }}
              className="w-full sm:w-auto btn text-white rounded-xl font-bold border-none hover:opacity-90 shadow-md transition flex items-center justify-center gap-2 px-6"
            >
              <RefreshCw className={`w-4 h-4 ${retrying ? 'animate-spin' : ''}`} />
              <span>{retrying ? 'Reloading...' : 'Try Again'}</span>
            </button>

            <Link
              href="/"
              className="w-full sm:w-auto btn btn-ghost rounded-xl font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2 px-5"
            >
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>

            <Link
              href="/posts"
              className="w-full sm:w-auto btn btn-ghost rounded-xl font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2 px-5"
            >
              <Compass className="w-4 h-4" />
              <span>Browse Posts</span>
            </Link>
          </div>

          {/* Quick Help Link */}
          <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span>Facing persistent issues?</span>
            <Link
              href="/contact"
              style={{ color: currentTheme.hex }}
              className="font-bold hover:underline inline-flex items-center gap-1"
            >
              <LifeBuoy className="w-3.5 h-3.5" />
              <span>Report to Support</span>
            </Link>
          </div>

          {/* Developer Debug Details Accordion */}
          <div className="mt-8 pt-6 border-t border-slate-200/80 dark:border-slate-800 text-left">
            <button
              type="button"
              onClick={() => setShowDebug(!showDebug)}
              className="flex items-center justify-between w-full text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition py-1"
            >
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                <span>Developer Diagnostics & Error Details</span>
              </span>
              {showDebug ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {showDebug && (
              <div className="mt-3 rounded-2xl bg-slate-950 p-4 font-mono text-[11px] text-slate-300 border border-slate-800 shadow-inner">
                <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-900/50">
                      Digest
                    </span>
                    <span className="text-slate-400">{error?.digest || 'Client-Side Runtime'}</span>
                  </div>
                  <button
                    onClick={handleCopyLogs}
                    className="inline-flex items-center gap-1 text-[11px] text-slate-300 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 transition"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400 font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Error</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="space-y-1.5">
                  <p className="text-rose-400 font-semibold break-all">
                    {error?.message || 'No explicit error message provided.'}
                  </p>
                  {error?.stack && (
                    <pre className="text-[10px] text-slate-500 max-h-40 overflow-y-auto whitespace-pre-wrap break-all mt-2 pt-2 border-t border-slate-900">
                      {error.stack}
                    </pre>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
