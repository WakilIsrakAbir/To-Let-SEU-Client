'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { Sparkles } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  subMessage?: string;
  fullscreen?: boolean;
  compact?: boolean;
  showTips?: boolean;
}

const STUDENT_TIPS = [
  'Searching verified bachelor rooms & seats near SEU campus...',
  'Tip: Check properties in Tejgaon, Mohakhali & Banani for easy commute.',
  'Tip: Always contact landlords directly via call or WhatsApp.',
  'Tip: You can use the Auto Poster Generator to create printable flyers!',
  'Loading the latest accommodation listings for SEU students...',
];

export default function LoadingState({
  message = 'Loading Accommodation...',
  subMessage,
  fullscreen = false,
  compact = false,
  showTips = true,
}: LoadingStateProps) {
  const { currentTheme } = useTheme();
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    if (!showTips) return;
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % STUDENT_TIPS.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [showTips]);

  if (compact) {
    return (
      <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
        <div className="relative flex items-center justify-center w-12 h-12 mb-3">
          <span
            className="absolute inset-0 rounded-full animate-ping opacity-25"
            style={{ backgroundColor: currentTheme.hex }}
          />
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shadow-md text-white"
            style={{ backgroundColor: currentTheme.hex }}
          >
            <span className="loading loading-spinner loading-sm"></span>
          </div>
        </div>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{message}</p>
        {subMessage && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">{subMessage}</p>
        )}
      </div>
    );
  }

  return (
    <div
      className={`w-full flex items-center justify-center p-6 ${
        fullscreen ? 'min-h-[85vh]' : 'min-h-[420px]'
      }`}
    >
      <div className="relative w-full max-w-md mx-auto">
        {/* Soft Ambient Glow Halo */}
        <div
          className="absolute -inset-4 rounded-3xl opacity-20 dark:opacity-30 blur-2xl pointer-events-none transition-all duration-700"
          style={{
            background: `radial-gradient(circle, ${currentTheme.hex} 0%, transparent 70%)`,
          }}
        />

        {/* Clean Glassmorphic Card */}
        <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-8 shadow-xl text-center overflow-hidden">
          {/* Subtle Top Accent Border line */}
          <div
            className="absolute top-0 left-0 right-0 h-1"
            style={{
              background: `linear-gradient(90deg, transparent, ${currentTheme.hex}, transparent)`,
            }}
          />

          {/* Branded Pulsing Housing Emblem */}
          <div className="relative inline-flex items-center justify-center mb-6">
            {/* Outer expanding ripple */}
            <motion.div
              animate={{
                scale: [1, 1.4, 1.6],
                opacity: [0.35, 0.15, 0],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: 'easeOut',
              }}
              className="absolute w-20 h-20 rounded-2xl"
              style={{ backgroundColor: currentTheme.hex }}
            />

            {/* Inner Glowing Badge */}
            <div
              style={{
                background: `linear-gradient(135deg, ${currentTheme.hex} 0%, #0f172a 100%)`,
                boxShadow: `0 10px 25px -5px ${currentTheme.hex}40`,
              }}
              className="relative w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg ring-1 ring-white/30"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 text-white animate-pulse"
              >
                {/* Left Residence Building */}
                <rect
                  x="3"
                  y="8"
                  width="7.5"
                  height="13"
                  rx="1.2"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  fill="currentColor"
                  fillOpacity="0.22"
                />
                {/* Right Taller Campus Tower */}
                <rect
                  x="11.5"
                  y="3"
                  width="9.5"
                  height="18"
                  rx="1.4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  fill="currentColor"
                  fillOpacity="0.14"
                />
                {/* Windows */}
                <rect x="5" y="10.5" width="1.5" height="1.5" rx="0.3" fill="currentColor" />
                <rect x="7.5" y="10.5" width="1.5" height="1.5" rx="0.3" fill="currentColor" />
                <rect x="5" y="13.5" width="1.5" height="1.5" rx="0.3" fill="currentColor" />
                <rect x="7.5" y="13.5" width="1.5" height="1.5" rx="0.3" fill="currentColor" />
                <rect x="13.5" y="6" width="1.6" height="1.6" rx="0.3" fill="currentColor" />
                <rect x="17" y="6" width="1.6" height="1.6" rx="0.3" fill="currentColor" />
                <rect x="13.5" y="9.5" width="1.6" height="1.6" rx="0.3" fill="currentColor" />
                <rect x="17" y="9.5" width="1.6" height="1.6" rx="0.3" fill="currentColor" />
                <rect x="13.5" y="13" width="1.6" height="1.6" rx="0.3" fill="currentColor" />
                <rect x="17" y="13" width="1.6" height="1.6" rx="0.3" fill="currentColor" />
                {/* Baseline */}
                <line x1="2" y1="21" x2="22" y2="21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* Brand Heading */}
          <div className="flex items-center justify-center gap-1.5 mb-1.5">
            <span className="text-base font-black tracking-tight text-slate-900 dark:text-white">
              TO LET
            </span>
            <span
              style={{ color: currentTheme.hex }}
              className="text-base font-black tracking-tight"
            >
              SEU
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 ml-1">
              Portal
            </span>
          </div>

          {/* Primary Message */}
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">
            {message}
          </h3>

          {/* Indeterminate Shimmer Progress Bar */}
          <div className="w-48 h-1.5 mx-auto bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden my-4 relative">
            <motion.div
              className="absolute top-0 bottom-0 rounded-full"
              style={{
                background: `linear-gradient(90deg, transparent, ${currentTheme.hex}, #f59e0b, transparent)`,
              }}
              animate={{
                left: ['-100%', '100%'],
                width: ['40%', '50%'],
              }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>

          {/* Dynamic rotating tip or subMessage */}
          {subMessage ? (
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
              {subMessage}
            </p>
          ) : showTips ? (
            <div className="min-h-[38px] flex items-center justify-center">
              <motion.p
                key={tipIndex}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.35 }}
                className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed flex items-center justify-center gap-1.5"
              >
                <Sparkles
                  className="w-3.5 h-3.5 shrink-0"
                  style={{ color: currentTheme.hex }}
                />
                <span>{STUDENT_TIPS[tipIndex]}</span>
              </motion.p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
