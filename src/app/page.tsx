'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Search,
  PlusCircle,
  Sparkles,
  MapPin,
  ShieldCheck,
  Download,
  Users,
  ArrowRight,
  Building2,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { DHAKA_AREAS } from '@/lib/constants';
import RecentPostsSection from '@/components/home/RecentPostsSection';
import SafetyWarningBanner from '@/components/home/SafetyWarningBanner';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import StudentReviewsSection from '@/components/home/StudentReviewsSection';
import HostCtaBanner from '@/components/home/HostCtaBanner';
import HeroBackground from '@/components/home/HeroBackground';

export default function Home() {
  const { currentTheme, isDark } = useTheme();
  const router = useRouter();

  const [selectedArea, setSelectedArea] = useState('');
  const [selectedGender, setSelectedGender] = useState('');

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedArea) params.append('area', selectedArea);
    if (selectedGender) params.append('gender', selectedGender);
    router.push(`/posts?${params.toString()}`);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col justify-between relative bg-white dark:bg-[#070d0a] text-slate-900 dark:text-white transition-colors duration-200">
      {/* 1. Main Standalone Hero Section with Isolated Atmospheric Studio Background */}
      <div className="relative overflow-hidden w-full bg-gradient-to-b from-slate-50/70 via-white to-slate-100/40 dark:from-[#070d0a] dark:via-slate-950 dark:to-[#070d0a] border-b border-slate-200/60 dark:border-slate-800/60">
        <HeroBackground />

        <section className="min-h-[calc(100vh-64px)] flex items-center relative z-10 px-4 sm:px-6 lg:px-8 py-10 sm:py-14 min-[1680px]:py-20 max-w-7xl min-[1680px]:max-w-[1450px] mx-auto w-full">
        <div className="w-full space-y-6 sm:space-y-8 min-[1680px]:space-y-10">
          {/* Top Micro Badge */}
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="flex justify-center lg:justify-start"
          >
            <div
              style={{
                backgroundColor: isDark ? `${currentTheme.hex}18` : currentTheme.lightHex,
                borderColor: isDark ? `${currentTheme.hex}35` : currentTheme.borderHex,
                color: isDark ? currentTheme.hex : currentTheme.textHex,
              }}
              className="inline-flex items-center gap-2 px-3.5 py-1 min-[1680px]:px-4 min-[1680px]:py-1.5 rounded-full text-xs min-[1680px]:text-sm font-bold border transition-colors shadow-2xs"
            >
              <span className="flex h-2 w-2 relative">
                <span
                  style={{ backgroundColor: currentTheme.hex }}
                  className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                />
                <span
                  style={{ backgroundColor: currentTheme.hex }}
                  className="relative inline-flex rounded-full h-2 w-2"
                />
              </span>
              <Sparkles className="w-3.5 h-3.5" style={{ color: currentTheme.hex }} />
              <span>Official SEU Bachelor Housing • Tejgaon Campus</span>
            </div>
          </motion.div>

          {/* 2-Column Grid: Clean Text on Left, Clean High-Res Image on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 min-[1680px]:gap-16 items-center">
            {/* Left Column: Clean Typography, Single Search Capsule, and Action CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="lg:col-span-7 text-center lg:text-left space-y-5 min-[1680px]:space-y-7"
            >
              {/* Clean, Impactful Headline - Original on laptop, scaled only on PC displays >= 1680px */}
              <h1 className="text-3xl sm:text-4xl lg:text-[46px] min-[1680px]:text-[56px] font-black tracking-tight leading-[1.18] min-[1680px]:leading-[1.14] text-slate-900 dark:text-white">
                Find Your{' '}
                <span style={{ color: currentTheme.hex }}>Bachelor Seat</span> <br />
                Near SEU Campus
              </h1>

              {/* Clean Concise Description - Original on laptop, scaled only on PC displays >= 1680px */}
              <p className="text-sm sm:text-base min-[1680px]:text-lg text-slate-600 dark:text-slate-300 max-w-xl min-[1680px]:max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Direct student-to-student bachelor accommodation for Southeast University. Connect with verified classmates across all departments with walking distance to Tejgaon campus and zero broker fees.
              </p>

              {/* Clean 1-Line Search Capsule - Original on laptop, scaled only on PC displays >= 1680px */}
              <form
                onSubmit={handleHeroSearch}
                className="hidden sm:flex flex-col sm:flex-row bg-white dark:bg-slate-900 p-2 min-[1680px]:p-2.5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-lg items-center gap-2 max-w-xl min-[1680px]:max-w-2xl mx-auto lg:mx-0"
              >
                {/* Location Select */}
                <div className="flex-1 flex items-center gap-2 px-3 py-1.5 w-full">
                  <MapPin className="w-4 h-4 shrink-0" style={{ color: currentTheme.hex }} />
                  <select
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm min-[1680px]:text-base font-semibold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
                  >
                    <option value="">Any Location near SEU</option>
                    {DHAKA_AREAS.map((area) => (
                      <option key={area} value={area} className="dark:bg-slate-900">
                        {area}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="hidden sm:block w-px h-6 bg-slate-200 dark:bg-slate-700" />

                {/* Gender Select */}
                <div className="flex-1 flex items-center gap-2 px-3 py-1.5 w-full">
                  <Users className="w-4 h-4 shrink-0 text-slate-400" />
                  <select
                    value={selectedGender}
                    onChange={(e) => setSelectedGender(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm min-[1680px]:text-base font-semibold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
                  >
                    <option value="">Gender (Any)</option>
                    <option value="Male" className="dark:bg-slate-900">Male Only</option>
                    <option value="Female" className="dark:bg-slate-900">Female Only</option>
                  </select>
                </div>

                {/* Primary Search Button */}
                <button
                  type="submit"
                  style={{ backgroundColor: currentTheme.hex }}
                  className="w-full sm:w-auto px-5 py-2.5 min-[1680px]:px-7 min-[1680px]:py-3 rounded-xl text-white font-bold text-xs sm:text-sm min-[1680px]:text-base shadow-sm hover:opacity-95 transition flex items-center justify-center gap-1.5 border-none shrink-0 cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </button>
              </form>

              {/* Clean Action Buttons - Original on laptop, scaled only on PC displays >= 1680px */}
              <div className="hidden sm:flex flex-wrap items-center justify-center lg:justify-start gap-3 min-[1680px]:gap-4 pt-1">
                <Link
                  href="/posts"
                  style={{ backgroundColor: currentTheme.hex }}
                  className="btn btn-sm sm:btn-md min-[1680px]:btn-lg text-white rounded-xl font-bold shadow-md hover:opacity-90 border-none px-5 min-[1680px]:px-7 transition min-[1680px]:text-base"
                >
                  <span>Browse All Posts</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/posts/create"
                  className="btn btn-sm sm:btn-md min-[1680px]:btn-lg btn-outline border-slate-300 dark:border-slate-700 hover:bg-slate-900 hover:text-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl font-bold px-4 min-[1680px]:px-6 min-[1680px]:text-base"
                >
                  <PlusCircle className="w-4 h-4" style={{ color: currentTheme.hex }} />
                  <span>Post a Room</span>
                </Link>

                <Link
                  href="/create-banner"
                  className="btn btn-sm sm:btn-md min-[1680px]:btn-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold border-none rounded-xl px-4 min-[1680px]:px-6 shadow-2xs flex items-center gap-1.5 min-[1680px]:text-base"
                >
                  <Download className="w-4 h-4" />
                  <span>Auto Poster</span>
                </Link>
              </div>
            </motion.div>

            {/* Right Column: Clean, Stunning High-Res Image - Original on laptop, scaled on PC >= 1680px */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="lg:col-span-5 max-w-lg min-[1680px]:max-w-xl mx-auto w-full relative group"
            >
              {/* Radiant, visible floor light bloom beneath the image */}
              <div
                style={{
                  background: `radial-gradient(ellipse at 50% 0%, ${currentTheme.hex}80 0%, #f59e0b60 45%, transparent 80%)`,
                }}
                className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[92%] h-24 blur-2xl pointer-events-none -z-10 transition-all duration-500"
              />

              {/* Gentle ambient backlight radiating softly behind the card */}
              <div
                style={{
                  background: `radial-gradient(ellipse at 50% 65%, ${currentTheme.hex}40 0%, #f59e0b28 45%, transparent 75%)`,
                }}
                className="absolute -inset-4 sm:-inset-6 rounded-[36px] blur-2xl sm:blur-3xl pointer-events-none -z-10 transition-all duration-500 group-hover:scale-105"
              />

              <div className="relative rounded-3xl overflow-hidden border border-slate-200/90 dark:border-slate-800 shadow-2xl bg-white dark:bg-slate-900 aspect-[4/3]">
                {/* Clean High Quality Room Image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/hero-room.jpg"
                  alt="Modern SEU Student Bachelor Room"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />

                {/* Minimal Clean Tag on Image */}
                <div className="absolute top-3.5 left-3.5 bg-black/70 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 min-[1680px]:text-sm min-[1680px]:px-4 min-[1680px]:py-2 rounded-xl flex items-center gap-1.5 shadow-md">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>Walking Distance to Tejgaon Campus</span>
                </div>

                {/* Minimal Verified Student Tag on Bottom */}
                <div className="absolute bottom-3.5 right-3.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-slate-900 dark:text-white text-xs font-bold px-3 py-1.5 min-[1680px]:text-sm min-[1680px]:px-4 min-[1680px]:py-2 rounded-xl shadow-md flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" style={{ color: currentTheme.hex }} />
                  <span>Verified SEU Student Host</span>
                </div>
              </div>

            </motion.div>
          </div>
        </div>
      </section>
    </div>

      {/* 2. Recent Available Rooms (3 Compact Post Cards + Direct Redirect to /posts) */}
      <RecentPostsSection />

      {/* 3. Highlights / Features Section */}
      <section className="relative py-10 sm:py-12 min-[1680px]:py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/60">
        <div className="max-w-7xl min-[1680px]:max-w-[1450px] mx-auto">
          {/* 3 Highlight Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-[1680px]:gap-8">
            {/* Card 1 */}
            <div className="bg-white dark:bg-slate-900/90 p-6 sm:p-7 min-[1680px]:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 flex flex-col items-start gap-4 min-[1680px]:gap-5">
              <div
                style={{
                  backgroundColor: isDark ? `${currentTheme.hex}20` : currentTheme.lightHex,
                  color: currentTheme.hex,
                }}
                className="w-12 h-12 min-[1680px]:w-14 min-[1680px]:h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs"
              >
                <MapPin className="w-6 h-6 min-[1680px]:w-7 min-[1680px]:h-7" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg min-[1680px]:text-xl font-bold text-slate-900 dark:text-white">
                  Tejgaon Campus Walking Distance
                </h3>
                <p className="mt-2 text-xs sm:text-sm min-[1680px]:text-base text-slate-500 dark:text-slate-400 leading-relaxed">
                  Near Mohakhali, Banani, Nakhalpara & Farmgate within 5–15 mins walk. No more daily traffic hassle.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white dark:bg-slate-900/90 p-6 sm:p-7 min-[1680px]:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 flex flex-col items-start gap-4 min-[1680px]:gap-5">
              <div className="w-12 h-12 min-[1680px]:w-14 min-[1680px]:h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 shadow-2xs">
                <ShieldCheck className="w-6 h-6 min-[1680px]:w-7 min-[1680px]:h-7" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg min-[1680px]:text-xl font-bold text-slate-900 dark:text-white">
                  100% Student Verified
                </h3>
                <p className="mt-2 text-xs sm:text-sm min-[1680px]:text-base text-slate-500 dark:text-slate-400 leading-relaxed">
                  Directly room with verified classmates across all departments of Southeast University with safe student environments.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white dark:bg-slate-900/90 p-6 sm:p-7 min-[1680px]:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 flex flex-col items-start gap-4 min-[1680px]:gap-5">
              <div className="w-12 h-12 min-[1680px]:w-14 min-[1680px]:h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 shadow-2xs">
                <Building2 className="w-6 h-6 min-[1680px]:w-7 min-[1680px]:h-7" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg min-[1680px]:text-xl font-bold text-slate-900 dark:text-white">
                  Zero Broker Fees
                </h3>
                <p className="mt-2 text-xs sm:text-sm min-[1680px]:text-base text-slate-500 dark:text-slate-400 leading-relaxed">
                  Direct WhatsApp & phone contact with fellow students. No hidden mediator or third-party commission charges.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Mess Host CTA Banner */}
      <HostCtaBanner />

      {/* 5. How It Works for SEU Students (3 Simple Steps) */}
      <HowItWorksSection />

      {/* 6. Student Safety & Anti-Scam Warning Notice */}
      <SafetyWarningBanner />

      {/* 7. What Our Users Say (Infinite Marquee with Hover Pause + Dynamic Review Submission) */}
      <StudentReviewsSection />
    </div>
  );
}
