'use client';

import React from 'react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';

interface SEUBasaLogoProps {
  className?: string;
  showTagline?: boolean;
}

export default function SEUBasaLogo({
  className = '',
  showTagline = true,
}: SEUBasaLogoProps) {
  const { currentTheme } = useTheme();

  return (
    <Link href="/" className={`inline-flex items-center gap-3 group ${className}`}>
      {/* Modern Student Residence / Apartment Building Icon Badge */}
      <div
        style={{
          background: `linear-gradient(135deg, ${currentTheme.hex} 0%, #0f172a 100%)`,
        }}
        className="flex items-center justify-center w-10.5 h-10.5 rounded-xl text-white shadow-md ring-1 ring-white/20 group-hover:scale-105 group-hover:shadow-lg transition-all duration-300 shrink-0"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-5.5 h-5.5 text-white"
        >
          {/* Left Residence Building */}
          <rect
            x="2.8"
            y="8"
            width="8"
            height="13"
            rx="1.2"
            stroke="currentColor"
            strokeWidth="1.8"
            fill="currentColor"
            fillOpacity="0.22"
          />

          {/* Right Taller High-Rise Campus Tower */}
          <rect
            x="11.2"
            y="3"
            width="10"
            height="18"
            rx="1.4"
            stroke="currentColor"
            strokeWidth="1.8"
            fill="currentColor"
            fillOpacity="0.14"
          />

          {/* Left Building Windows */}
          <rect x="4.8" y="10.5" width="1.6" height="1.6" rx="0.3" fill="currentColor" />
          <rect x="7.4" y="10.5" width="1.6" height="1.6" rx="0.3" fill="currentColor" />
          <rect x="4.8" y="13.5" width="1.6" height="1.6" rx="0.3" fill="currentColor" />
          <rect x="7.4" y="13.5" width="1.6" height="1.6" rx="0.3" fill="currentColor" />

          {/* Left Building Entrance Door */}
          <path
            d="M5.8 21V18H7.8V21"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Right Tower Windows (2x4 Grid) */}
          <rect x="13.4" y="5.6" width="1.8" height="1.8" rx="0.3" fill="currentColor" />
          <rect x="16.8" y="5.6" width="1.8" height="1.8" rx="0.3" fill="currentColor" />
          <rect x="13.4" y="9.2" width="1.8" height="1.8" rx="0.3" fill="currentColor" />
          <rect x="16.8" y="9.2" width="1.8" height="1.8" rx="0.3" fill="currentColor" />
          <rect x="13.4" y="12.8" width="1.8" height="1.8" rx="0.3" fill="currentColor" />
          <rect x="16.8" y="12.8" width="1.8" height="1.8" rx="0.3" fill="currentColor" />
          <rect x="13.4" y="16.4" width="1.8" height="1.8" rx="0.3" fill="currentColor" />
          <rect x="16.8" y="16.4" width="1.8" height="1.8" rx="0.3" fill="currentColor" />

          {/* Ground Baseline */}
          <line
            x1="1.5"
            y1="21"
            x2="22.5"
            y2="21"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Brand Text: TO LET SEU */}
      <div className="flex flex-col">
        <div className="flex items-baseline leading-none">
          <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white transition-colors">
            TO LET
          </span>
          <span
            style={{ color: currentTheme.hex }}
            className="text-xl font-black tracking-tight ml-1.5 transition-colors duration-200"
          >
            SEU
          </span>
        </div>
        {showTagline && (
          <span className="text-[9.5px] font-extrabold tracking-[0.16em] text-slate-400 dark:text-slate-500 uppercase mt-1">
            Southeast University
          </span>
        )}
      </div>
    </Link>
  );
}
