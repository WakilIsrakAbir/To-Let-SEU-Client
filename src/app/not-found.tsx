'use client';

import React from 'react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import { Home, Compass, PlusCircle, Search, ArrowLeft, Building2 } from 'lucide-react';

export default function NotFound() {
  const { currentTheme } = useTheme();

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="relative w-full max-w-xl mx-auto">
        {/* Soft Theme Ambient Glow */}
        <div
          className="absolute -inset-4 rounded-3xl opacity-15 dark:opacity-20 blur-3xl pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${currentTheme.hex} 0%, transparent 70%)`,
          }}
        />

        {/* Clean Glassmorphic Card */}
        <div className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-8 sm:p-12 shadow-2xl text-center overflow-hidden">
          {/* Subtle Top Gradient Accent */}
          <div
            className="absolute top-0 left-0 right-0 h-1.5"
            style={{
              background: `linear-gradient(90deg, ${currentTheme.hex}, #f59e0b, ${currentTheme.hoverHex})`,
            }}
          />

          {/* Clean 404 Badge with House Motif */}
          <div className="relative inline-flex items-center justify-center mb-6">
            <div
              style={{
                backgroundColor: `${currentTheme.hex}15`,
                color: currentTheme.hex,
                borderColor: `${currentTheme.hex}30`,
              }}
              className="px-5 py-2 rounded-2xl border text-sm font-black tracking-widest uppercase flex items-center gap-2 shadow-inner"
            >
              <Building2 className="w-4 h-4" />
              <span>404 &bull; Page Not Found</span>
            </div>
          </div>

          {/* Large Stylized 404 Number */}
          <div className="relative mb-2">
            <h1 className="text-7xl sm:text-8xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">
              4
              <span
                style={{ color: currentTheme.hex }}
                className="transition-colors duration-200"
              >
                0
              </span>
              4
            </h1>
          </div>

          {/* Friendly Bengali Subtitle */}
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
            রুম বা পেইজটি খুঁজে পাওয়া যায়নি
          </p>

          {/* English Description */}
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed mb-8">
            The bachelor accommodation, post, or link you are trying to visit might have been rented out,
            expired, or removed by the landlord.
          </p>

          {/* Action Navigation Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
            <Link
              href="/"
              style={{ backgroundColor: currentTheme.hex }}
              className="w-full sm:w-auto btn text-white rounded-xl font-bold border-none hover:opacity-90 shadow-md transition flex items-center justify-center gap-2 px-6"
            >
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>

            <Link
              href="/posts"
              className="w-full sm:w-auto btn btn-ghost rounded-xl font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2 px-5"
            >
              <Compass className="w-4 h-4" />
              <span>Browse All Rooms</span>
            </Link>

            <Link
              href="/posts/create"
              className="w-full sm:w-auto btn btn-ghost rounded-xl font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2 px-5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post Rent Ad</span>
            </Link>
          </div>

          {/* Quick Shortcuts Bar */}
          <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <Link
              href="/about-us"
              className="hover:text-slate-900 dark:hover:text-white transition"
            >
              About TO-LET SEU
            </Link>
            <span>&bull;</span>
            <Link
              href="/create-banner"
              className="hover:text-slate-900 dark:hover:text-white transition"
            >
              Create Banner
            </Link>
            <span>&bull;</span>
            <Link
              href="/contact"
              className="hover:text-slate-900 dark:hover:text-white transition"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
