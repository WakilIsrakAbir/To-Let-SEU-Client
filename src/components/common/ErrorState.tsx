'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import {
  AlertTriangle,
  RefreshCw,
  Home,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  LifeBuoy,
} from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  showHomeButton?: boolean;
  compact?: boolean;
  errorDetails?: string | null;
  digest?: string;
}

export default function ErrorState({
  title = 'Something Went Wrong',
  message = 'An unexpected error occurred while loading this section. Please try again.',
  onRetry,
  retryLabel = 'Try Again',
  showHomeButton = true,
  compact = false,
  errorDetails,
  digest,
}: ErrorStateProps) {
  const { currentTheme } = useTheme();
  const [retrying, setRetrying] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleRetry = () => {
    if (!onRetry) return;
    setRetrying(true);
    try {
      onRetry();
    } finally {
      setTimeout(() => setRetrying(false), 500);
    }
  };

  const handleCopyDetails = () => {
    const textToCopy = `Error: ${title}\nMessage: ${message}\nDigest: ${digest || 'N/A'}\nDetails: ${
      errorDetails || 'N/A'
    }\nURL: ${typeof window !== 'undefined' ? window.location.href : ''}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (compact) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/40 my-4">
        <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-3">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">{title}</h4>
        <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mb-3">{message}</p>
        {onRetry && (
          <button
            onClick={handleRetry}
            disabled={retrying}
            className="btn btn-xs rounded-lg text-white font-bold inline-flex items-center gap-1.5"
            style={{ backgroundColor: currentTheme.hex }}
          >
            <RefreshCw className={`w-3 h-3 ${retrying ? 'animate-spin' : ''}`} />
            <span>{retrying ? 'Retrying...' : retryLabel}</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-center p-6 min-h-[460px]">
      <div className="relative w-full max-w-lg mx-auto">
        {/* Soft Ambient Rose Halo */}
        <div className="absolute -inset-4 rounded-3xl bg-rose-500/10 dark:bg-rose-500/15 blur-2xl pointer-events-none" />

        {/* Clean Glassmorphic Card */}
        <div className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-8 sm:p-10 shadow-xl text-center overflow-hidden">
          {/* Subtle Top Red/Rose Accent Border */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-amber-500 to-rose-500" />

          {/* Warning Icon Badge */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-500 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 shadow-inner mb-6">
            <AlertTriangle className="w-8 h-8 stroke-[2.2]" />
          </div>

          {/* Heading */}
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
            {title}
          </h2>

          {/* Description */}
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed mb-6">
            {message}
          </p>

          {/* Action Buttons Group */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {onRetry && (
              <button
                onClick={handleRetry}
                disabled={retrying}
                style={{ backgroundColor: currentTheme.hex }}
                className="btn text-white rounded-xl font-bold border-none hover:opacity-90 shadow-md transition flex items-center gap-2 px-5"
              >
                <RefreshCw className={`w-4 h-4 ${retrying ? 'animate-spin' : ''}`} />
                <span>{retrying ? 'Reloading...' : retryLabel}</span>
              </button>
            )}

            {showHomeButton && (
              <Link
                href="/"
                className="btn btn-ghost rounded-xl font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center gap-2 px-5"
              >
                <Home className="w-4 h-4" />
                <span>Back to Home</span>
              </Link>
            )}

            <Link
              href="/contact"
              className="btn btn-ghost btn-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1.5"
            >
              <LifeBuoy className="w-3.5 h-3.5" />
              <span>Contact Support</span>
            </Link>
          </div>

          {/* Optional Collapsible Technical Debug Details */}
          {(errorDetails || digest) && (
            <div className="mt-8 pt-6 border-t border-slate-200/80 dark:border-slate-800 text-left">
              <button
                type="button"
                onClick={() => setShowDebug(!showDebug)}
                className="flex items-center justify-between w-full text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition"
              >
                <span>Technical Error Details</span>
                {showDebug ? (
                  <ChevronUp className="w-4 h-4 ml-1" />
                ) : (
                  <ChevronDown className="w-4 h-4 ml-1" />
                )}
              </button>

              {showDebug && (
                <div className="mt-3 relative rounded-xl bg-slate-950 p-4 font-mono text-[11px] text-slate-300 overflow-x-auto shadow-inner border border-slate-800">
                  <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800">
                    <span className="text-slate-400 font-bold uppercase text-[10px]">
                      Digest: {digest || 'N/A'}
                    </span>
                    <button
                      onClick={handleCopyDetails}
                      className="inline-flex items-center gap-1 text-[10px] text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-800 transition"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Log</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="whitespace-pre-wrap break-all text-rose-300">
                    {errorDetails || 'No stack trace provided.'}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
