'use client';

import React from 'react';
import { ShieldAlert, CheckCircle, Eye, Lock } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export default function SafetyWarningBanner() {
  const { currentTheme } = useTheme();

  return (
    <section className="relative py-8 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl min-[1680px]:max-w-[1450px] mx-auto w-full">
      <div className="relative rounded-3xl overflow-hidden border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent dark:from-amber-950/40 dark:via-slate-900 dark:to-slate-950 p-6 sm:p-8 lg:p-10 shadow-sm">
        {/* Subtle decorative glow */}
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top: Warning Header with full width so text never breaks */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-800 dark:text-amber-400 border border-amber-500/30 mb-3">
            <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>SEU Student Safety & Anti-Fraud Notice</span>
          </div>

          <h3 className="text-xl sm:text-2xl min-[1680px]:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
            Warning: Never send advance booking money without visiting the room in person!
          </h3>

          <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            For Southeast University student safety: Never transfer booking money via bKash or Nagad over phone or WhatsApp calls.<br /> Always visit the room in person and verify the host&apos;s student identity.
          </p>
        </div>

        {/* Bottom: 3 Equal Guidance Cards in a Clean Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 sm:mt-8">
          {/* Rule 1 */}
          <div className="bg-white/80 dark:bg-slate-900/90 backdrop-blur-xs p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                  <Eye className="w-4 h-4" />
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  1. Visit In-Person
                </h4>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Visit the flat in Tejgaon or Mohakhali directly. Inspect the room and living environment before making any decision.
              </p>
            </div>
          </div>

          {/* Rule 2 */}
          <div className="bg-white/80 dark:bg-slate-900/90 backdrop-blur-xs p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-xl bg-blue-500/15 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  2. Verify Student ID
                </h4>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Check the host&apos;s SEU student ID card and department details to ensure authentic student-to-student housing.
              </p>
            </div>
          </div>

          {/* Rule 3 */}
          <div className="bg-white/80 dark:bg-slate-900/90 backdrop-blur-xs p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                  <Lock className="w-4 h-4" />
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  3. Clarify Bills & Rules
                </h4>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Confirm maid bill, electricity, WiFi, and main gate entry/closing times upfront with roommates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
