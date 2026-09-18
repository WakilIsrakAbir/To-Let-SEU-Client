'use client';

import React from 'react';
import Link from 'next/link';
import { PlusCircle, Download, Sparkles, ArrowRight } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export default function HostCtaBanner() {
  const { currentTheme, isDark } = useTheme();

  return (
    <section className="relative py-14 sm:py-18 lg:py-22 px-4 sm:px-6 lg:px-8 max-w-7xl min-[1680px]:max-w-[1450px] mx-auto w-full">
      <div
        style={{
          background: isDark
            ? `linear-gradient(135deg, ${currentTheme.hex}15 0%, #0f172a 100%)`
            : `linear-gradient(135deg, ${currentTheme.hex}12 0%, #ffffff 100%)`,
        }}
        className="relative rounded-3xl p-8 sm:p-12 lg:p-14 border border-slate-200/90 dark:border-slate-800 shadow-xl overflow-hidden text-center max-w-5xl mx-auto"
      >
        {/* Glow */}
        <div
          style={{
            background: `radial-gradient(circle, ${currentTheme.hex}25 0%, transparent 70%)`,
          }}
          className="absolute -bottom-24 -left-24 w-72 h-72 blur-3xl pointer-events-none"
        />

        <div className="relative z-10 max-w-2xl mx-auto space-y-4 sm:space-y-5">
          <div
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold shadow-2xs"
            style={{
              backgroundColor: isDark ? `${currentTheme.hex}20` : currentTheme.lightHex,
              color: isDark ? currentTheme.hex : currentTheme.textHex,
            }}
          >
            <Sparkles className="w-3.5 h-3.5" style={{ color: currentTheme.hex }} />
            <span>Have an Empty Seat in Your Mess?</span>
          </div>

          <h2 className="text-2xl sm:text-3xl min-[1680px]:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Looking for a <span style={{ color: currentTheme.hex }}>Trusted Roommate</span> for Your Bachelor Flat?
          </h2>

          <p className="text-xs sm:text-sm min-[1680px]:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
            Post your vacant seat in under 2 minutes with zero broker fees and connect directly with verified classmates across Southeast University.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/posts/create"
              style={{ backgroundColor: currentTheme.hex }}
              className="btn btn-md sm:btn-lg text-white rounded-2xl font-bold shadow-md hover:opacity-90 border-none px-6 transition inline-flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post a Room Ad Now</span>
            </Link>

            <Link
              href="/create-banner"
              className="btn btn-md sm:btn-lg btn-outline border-slate-300 dark:border-slate-700 hover:bg-slate-900 hover:text-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-2xl font-bold px-6 inline-flex items-center gap-2"
            >
              <Download className="w-4 h-4" style={{ color: currentTheme.hex }} />
              <span>Create Facebook Banner</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
