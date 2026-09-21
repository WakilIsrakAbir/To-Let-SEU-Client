'use client';

import React from 'react';
import {
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  profileLink: string;
}

const teamMembers: TeamMember[] = [
  {
    id: 'abir',
    name: 'Wakil Israk Abir',
    role: 'Developer',
    image: '/team/abir.svg',
    profileLink: 'https://www.instagram.com/wakil_israk_abir/',
  },
  {
    id: 'nasir',
    name: 'Md. Nasir Uddin',
    role: 'Advisor',
    image: '/team/nasir.svg',
    profileLink: 'https://www.instagram.com/nasir_ahamed_71/',
  },
  {
    id: 'ovi',
    name: 'Saiful Islam Ovi',
    role: 'Quality Assurance',
    image: '/team/ovi.svg',
    profileLink: 'https://www.instagram.com/saiful_islam_ovi_001/',
  },
  {
    id: 'mission',
    name: 'Mission',
    role: 'Admin',
    image: '/team/mission.svg',
    profileLink: 'https://www.facebook.com/MISON.7O9/',
  },
  {
    id: 'irfan',
    name: 'Sharier Irfan',
    role: 'Moderator',
    image: '/team/irfan.svg',
    profileLink: 'https://www.instagram.com/shahreer_irfan/',
  },
  {
    id: 'shihab',
    name: 'Toriqul Islam Shihab',
    role: 'Brand Ambassador',
    image: '/team/shihab.svg',
    profileLink: 'https://www.instagram.com/tariqul.shihab/',
  },
];

export default function AboutUsPage() {
  const { currentTheme, isDark } = useTheme();

  return (
    <div className="min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-12">
      {/* 1. TOP SECTION: Contributors / Core Team */}
      <section>
        {/* Clean Header */}
        <div className="mb-6">
          <div
            style={{
              backgroundColor: isDark ? `${currentTheme.hex}18` : currentTheme.lightHex,
              color: isDark ? currentTheme.hex : currentTheme.textHex,
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold mb-2 shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5" style={{ color: currentTheme.hex }} />
            <span>Southeast University Student Contributors</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            The Team Behind <span style={{ color: currentTheme.hex }}>To Let SEU</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
            Students who designed, developed, and currently maintain the platform for SEU peers.
          </p>
        </div>

        {/* 6 Team Cards (3 Columns x 2 Rows) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition duration-200 flex items-center gap-6 sm:gap-7 group"
            >
              {/* Bigger Profile Avatar */}
              <div className="relative w-24 h-28 sm:w-28 sm:h-32 rounded-2xl overflow-hidden shadow-xs border border-slate-200 dark:border-slate-700 bg-slate-950 shrink-0 group-hover:scale-105 transition-transform duration-300">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover select-none"
                />
              </div>

              {/* Member Details: 3 Clear Lines (Name, Role, Profile Link) */}
              <div className="flex-1 min-w-0 flex flex-col justify-center space-y-2 py-0.5">
                {/* Line 1: Name */}
                <h3
                  className="font-black text-base sm:text-lg text-slate-900 dark:text-white truncate leading-snug"
                  title={member.name}
                >
                  {member.name}
                </h3>

                {/* Line 2: Role (Clean text, no background/border/padding) */}
                <div
                  style={{ color: currentTheme.hex }}
                  className="text-xs sm:text-sm font-bold tracking-wide"
                >
                  {member.role}
                </div>

                {/* Line 3: Profile Link (Clean text link, no background/border/padding) */}
                <div>
                  <a
                    href={member.profileLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: isDark ? `${currentTheme.hex}cc` : currentTheme.textHex,
                    }}
                    className="inline-flex items-center gap-1 text-xs font-semibold hover:underline opacity-80 hover:opacity-100 transition"
                  >
                    <span>Profile Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. BOTTOM SECTION: Our Story & Mission (Full-width balanced layout) */}
      <section className="w-full rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 lg:p-10 shadow-xs space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-100/60 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60">
            Our Story & Mission
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Solving Bachelor Housing for <span style={{ color: currentTheme.hex }}>SEU Students</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-4xl">
            To Let SEU is a 100% non-profit, student-led initiative established to eliminate the hassle and exploitation of bachelor seat hunting around the Southeast University Tejgaon Campus.
          </p>
        </div>

        {/* 2 Balanced Narrative Columns filling the full container width */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 pt-2 border-t border-slate-200/80 dark:border-slate-800">
          <div className="space-y-2.5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: currentTheme.hex }} />
              <span>The Problem We Faced (Our Story)</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Every semester, students at Southeast University face the daunting task of wandering through Nakhalpara, Mohakhali, Begunbari, and Farmgate searching for bachelor rooms. Torn paper wall posters, misleading broker listings, and unauthorized middlemen demanding hefty commissions make finding safe accommodation stressful and expensive. Having experienced these exact struggles firsthand when first arriving at campus, our team came together to build a modern, unified platform dedicated entirely to our student community.
            </p>
          </div>

          <div className="space-y-2.5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: currentTheme.hex }} />
              <span>What We Stand For (Our Mission)</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Our mission is simple: provide a 100% free, direct, and transparent rental network exclusively for SEU students across all academic departments. By connecting flatmates directly through verified phone numbers and WhatsApp, we eliminate third-party broker fees and hidden charges completely. Whether you need a single room within walking distance of Tejgaon campus or a seat in a friendly mess, To Let SEU ensures your search is safe, reliable, and effortless.
            </p>
          </div>
        </div>

        {/* 3 Full-Width Community Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-4 border-t border-slate-200/80 dark:border-slate-800">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-1 shadow-2xs">
            <div className="font-extrabold text-sm" style={{ color: currentTheme.hex }}>
              100% Non-Profit
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Zero broker fees, no commissions, and completely free for all SEU students.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-1 shadow-2xs">
            <div className="font-extrabold text-sm" style={{ color: currentTheme.hex }}>
              Direct Student Contact
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Direct WhatsApp chat & phone calls with fellow verified SEU classmates.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-1 shadow-2xs">
            <div className="font-extrabold text-sm" style={{ color: currentTheme.hex }}>
              Tejgaon Campus Centric
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tailored specifically for bachelor rooms within walking distance of campus.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
