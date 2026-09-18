'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';

export default function HeroBackground() {
  const { currentTheme, isDark } = useTheme();

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0"
    >
      {/* 1. Ultra-Subtle Architectural Micro-Grid Vignette (Confined, clean, non-intrusive texture) */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: isDark
            ? `linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)`
            : `linear-gradient(to right, rgba(15, 23, 42, 0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(15, 23, 42, 0.035) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, black 20%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, black 20%, transparent 80%)',
        }}
      />

      {/* 2. Soft Atmospheric Studio Mesh Glows (Eliminates empty feeling with warm, gentle ambiance) */}
      {/* Left-side subtle theme aura */}
      <div
        style={{
          background: `radial-gradient(ellipse at center, ${currentTheme.hex}18 0%, transparent 68%)`,
        }}
        className="absolute -top-24 -left-16 w-[560px] h-[480px] rounded-full blur-[100px]"
      />

      {/* Right-side warm ambient room light glow */}
      <div
        style={{
          background: `radial-gradient(ellipse at center, #f59e0b1c 0%, ${currentTheme.hex}10 40%, transparent 70%)`,
        }}
        className="absolute top-12 right-0 w-[580px] h-[520px] rounded-full blur-[110px]"
      />

      {/* Center soft fill to ensure smooth, cohesive warmth */}
      <div
        style={{
          background: `radial-gradient(circle at 50% 50%, ${currentTheme.hex}0c 0%, transparent 60%)`,
        }}
        className="absolute top-1/3 left-1/3 w-[450px] h-[350px] rounded-full blur-[90px]"
      />
    </div>
  );
}
