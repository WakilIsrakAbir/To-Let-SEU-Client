'use client';

import React from 'react';
import { Search, MessageSquare, KeyRound } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export default function HowItWorksSection() {
  const { currentTheme, isDark } = useTheme();

  const steps = [
    {
      step: '01',
      icon: Search,
      title: 'Search & Filter',
      desc: 'Browse seats by walking distance to Tejgaon campus, preferred neighborhood (Mohakhali, Banani, Nakhalpara), gender, and budget.',
    },
    {
      step: '02',
      icon: MessageSquare,
      title: 'Direct Student Contact',
      desc: 'Connect directly with fellow SEU student hosts via WhatsApp or phone call without any broker or mediator fee.',
    },
    {
      step: '03',
      icon: KeyRound,
      title: 'Visit In-Person & Move In',
      desc: 'Inspect the room and building amenities in person, review house rules, and confirm your seat safely.',
    },
  ];

  return (
    <section className="relative py-14 sm:py-18 lg:py-22 px-4 sm:px-6 lg:px-8 max-w-7xl min-[1680px]:max-w-[1450px] mx-auto w-full">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">

        <h2 className="text-2xl sm:text-3xl min-[1680px]:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          How Does <span style={{ color: currentTheme.hex }}>TO-LET SEU</span> Work?
        </h2>
        <p className="mt-2 text-xs sm:text-sm min-[1680px]:text-base text-slate-500 dark:text-slate-400">
          The fastest and most reliable way to find safe, verified, and budget-friendly bachelor seats near Tejgaon campus.
        </p>
      </div>

      {/* 3 Step Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        {steps.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="relative bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Step number badge in corner */}
              <span className="absolute top-5 right-6 text-3xl font-black text-slate-200 dark:text-slate-800 select-none">
                {item.step}
              </span>

              <div>
                {/* Icon Container */}
                <div
                  style={{
                    backgroundColor: isDark ? `${currentTheme.hex}20` : currentTheme.lightHex,
                    color: currentTheme.hex,
                  }}
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 shadow-2xs group-hover:scale-105 transition-transform"
                >
                  <Icon className="w-6 h-6" />
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
