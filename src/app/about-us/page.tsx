'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ExternalLink,
  Users,
  BadgePercent,
  FileSpreadsheet,
  ArrowRight,
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

      {/* 2. BOTTOM SECTION: Our Story & Mission */}
      <section className="w-full rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 lg:p-10 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column (7 cols): Short Story */}
          <div className="lg:col-span-7 space-y-3.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-100/60 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60">
              Our Story & Mission
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Solving Bachelor Housing for <span style={{ color: currentTheme.hex }}>SEU Students</span>
            </h2>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              To Let SEU is a 100% non-profit, student-led initiative built to eliminate the chaos of bachelor seat hunting around the Southeast University Tejgaon Campus. We replace paper wall posters, misleading ads, and unauthorized broker commissions with a single verified peer network.
            </p>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Every listing connects students directly via direct phone calls or WhatsApp. It is completely free for students, made by students who faced the exact same search when they first arrived at campus.
            </p>
          </div>

          {/* Right Column (5 cols): 3 Compact Feature Pills */}
          <div className="lg:col-span-5 space-y-3">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center gap-3.5">
              <div
                style={{
                  backgroundColor: isDark ? `${currentTheme.hex}20` : currentTheme.lightHex,
                  color: currentTheme.hex,
                }}
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              >
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                  Verified SEU Peer Network
                </h4>
                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                  Room directly with classmates from CSE, BBA, Law, Textile, & EEE.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <BadgePercent className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                  Zero Broker Fees & Commissions
                </h4>
                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                  100% free direct calls & WhatsApp messaging. No middlemen fees.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                  Instant Mess Poster Generator
                </h4>
                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                  Auto-create printable social banners to paste on campus boards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Community CTA Box */}
      <section
        style={{
          background: `linear-gradient(135deg, ${currentTheme.hoverHex}, #0f172a)`,
        }}
        className="text-white rounded-3xl p-6 sm:p-8 text-center relative overflow-hidden shadow-lg"
      >
        <div className="relative z-10 max-w-xl mx-auto space-y-3">
          <h3 className="text-xl sm:text-2xl font-black tracking-tight">Have a seat or room available?</h3>
          <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
            Help an SEU classmate find a bachelor home near campus. Post a free ad in 2 minutes or generate a printable flyer.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Link
              href="/posts/create"
              style={{ color: currentTheme.textHex }}
              className="btn btn-sm bg-white hover:bg-slate-100 border-none font-bold rounded-xl px-5 shadow-sm"
            >
              Post a Free Ad
            </Link>
            <Link
              href="/create-banner"
              className="btn btn-sm bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold border-none rounded-xl px-5 flex items-center gap-1.5 shadow-sm"
            >
              <span>Try Poster Generator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
