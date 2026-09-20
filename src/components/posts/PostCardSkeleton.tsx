'use client';

import React from 'react';

export default function PostCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm p-5 sm:p-7 space-y-5 relative overflow-hidden animate-pulse select-none">
      {/* 1. Header: Author & Department & Timestamp */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0" />
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-32 h-4 rounded-md bg-slate-200 dark:bg-slate-800" />
              <div className="w-16 h-4 rounded-md bg-slate-200 dark:bg-slate-800" />
            </div>
            <div className="w-24 h-3 rounded-md bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
        <div className="w-20 h-7 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0" />
      </div>

      {/* 2. Title & Location */}
      <div className="space-y-2">
        <div className="w-3/4 h-6 rounded-lg bg-slate-200 dark:bg-slate-800" />
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-md bg-slate-200 dark:bg-slate-800 shrink-0" />
          <div className="w-1/2 h-4 rounded-md bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>

      {/* 3. Specs / Badges row */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="w-24 h-7 rounded-xl bg-slate-200 dark:bg-slate-800" />
        <div className="w-24 h-7 rounded-xl bg-slate-200 dark:bg-slate-800" />
        <div className="w-28 h-7 rounded-xl bg-slate-200 dark:bg-slate-800" />
      </div>

      {/* 4. Photo Container (16:9) */}
      <div className="relative aspect-video w-full rounded-2xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200/50 dark:border-slate-700/50 overflow-hidden flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-slate-300 dark:text-slate-600">
          <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-slate-400 dark:text-slate-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
          <div className="w-28 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700" />
        </div>
      </div>

      {/* 5. Rent bar */}
      <div className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80">
        <div className="space-y-1.5">
          <div className="w-16 h-3 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="w-28 h-6 rounded-md bg-slate-200 dark:bg-slate-700" />
        </div>
        <div className="w-24 h-7 rounded-xl bg-slate-200 dark:bg-slate-700" />
      </div>

      {/* 6. Action buttons row */}
      <div className="flex items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
        <div className="flex-1 h-11 rounded-xl bg-slate-200 dark:bg-slate-800" />
        <div className="flex-1 h-11 rounded-xl bg-slate-200 dark:bg-slate-800" />
        <div className="w-28 h-11 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0" />
      </div>
    </div>
  );
}
