'use client';

import React from 'react';
import Link from 'next/link';
import { Users, ShieldCheck, HeartHandshake, ArrowRight } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export default function AboutUsPage() {
  const { currentTheme, isDark } = useTheme();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Connecting <span style={{ color: currentTheme.hex }}>SEU Students</span> with Safe, Affordable Bachelor Homes
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
          To Let SEU was founded to solve the messy to-let search for students studying at the Southeast University Tejgaon Campus. No more hunting through Facebook spam or tearing down paper posters in the rain.
        </p>
      </div>

      {/* Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white dark:bg-slate-900 p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition">
          <div
            style={{
              backgroundColor: isDark ? `${currentTheme.hex}25` : currentTheme.lightHex,
              color: currentTheme.hex,
            }}
            className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
          >
            <Users className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-2">SEU Peer Network</h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            Room with classmates from your own department (CSE, BBA, EEE, Textile, Law, English) for better study groups and shared class schedules.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 flex items-center justify-center mb-5">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-2">Verified Listings</h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            Every ad includes optimized room photos, clear rent values or negotiable flags, and live pin locations near Tejgaon campus.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 flex items-center justify-center mb-5">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-2">Zero Broker Fees</h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            Direct student-to-student and landlord-to-student communication via direct phone calls and WhatsApp messaging. 100% free for all students.
          </p>
        </div>
      </div>

      {/* Facebook Community Card */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50/40 to-slate-50 dark:from-slate-900 dark:via-blue-950/20 dark:to-slate-900 border border-blue-200/80 dark:border-blue-900/40 rounded-3xl p-6 sm:p-8 mb-16 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="flex items-start sm:items-center gap-4 sm:gap-5">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#1877F2] text-white flex items-center justify-center shrink-0 shadow-md">
            <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300 text-xs font-bold mb-1.5">
              <span>Official Student Community</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Join Southeast University Facebook Group
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1 max-w-xl">
              Connect with fellow SEU students, explore room & roommate requests, discuss campus life, and share your generated rent banners directly with the community.
            </p>
          </div>
        </div>
        <a
          href="https://www.facebook.com/groups/595436001496374/"
          target="_blank"
          rel="noopener noreferrer"
          className="btn bg-[#1877F2] hover:bg-blue-700 text-white font-bold border-none rounded-xl px-6 shrink-0 shadow hover:shadow-lg transition flex items-center gap-2"
        >
          <span>Join SEU Group</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>

      {/* CTA Box */}
      <div
        style={{
          background: `linear-gradient(135deg, ${currentTheme.hoverHex}, #0f172a)`,
        }}
        className="text-white rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-xl"
      >
        <div className="relative z-10 max-w-xl mx-auto space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold">Have a seat or room available?</h2>
          <p className="text-white/80 text-sm sm:text-base">
            Post your ad in 2 minutes, upload up to 5 room photos, and automatically generate a rent poster for your social media.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              href="/posts/create"
              style={{ color: currentTheme.textHex }}
              className="btn bg-white hover:bg-slate-100 border-none font-bold rounded-xl px-6 shadow-md"
            >
              Post a Free Ad
            </Link>
            <Link
              href="/create-banner"
              className="btn bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold border-none rounded-xl px-6 flex items-center gap-2"
            >
              <span>Try Poster Generator</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
