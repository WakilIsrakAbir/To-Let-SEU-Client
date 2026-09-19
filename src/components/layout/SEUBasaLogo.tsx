'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
      {/* Southeast University Official Logo */}
      <div className="relative flex items-center justify-center w-11 h-11 rounded-full bg-white dark:bg-slate-800 shadow-sm ring-1 ring-slate-200/90 dark:ring-slate-700 p-0.5 group-hover:scale-105 group-hover:shadow-md transition-all duration-300 shrink-0">
        <Image
          src="/seu-logo.png"
          alt="Southeast University"
          width={44}
          height={44}
          className="w-full h-full object-contain rounded-full"
          priority
        />
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
