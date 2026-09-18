'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type SchemeType = 'light' | 'dark' | 'auto';
export type AccentColorType = 'green' | 'teal' | 'indigo' | 'brand' | 'rose' | 'purple' | 'amber';

export interface AccentThemeConfig {
  label: string;
  hex: string;
  hoverHex: string;
  lightHex: string;
  textHex: string;
  borderHex: string;
  desc: string;
}

export const ACCENT_THEMES: Record<AccentColorType, AccentThemeConfig> = {
  green: {
    label: 'Emerald Pine',
    hex: '#10b981',
    hoverHex: '#059669',
    lightHex: '#ecfdf5',
    textHex: '#047857',
    borderHex: '#a7f3d0',
    desc: 'Mountain Forest',
  },
  teal: {
    label: 'Teal UMS',
    hex: '#14b8a6',
    hoverHex: '#0d9488',
    lightHex: '#f0fdfa',
    textHex: '#0f766e',
    borderHex: '#99f6e4',
    desc: 'Campus Theme',
  },
  indigo: {
    label: 'Indigo',
    hex: '#6366f1',
    hoverHex: '#4f46e5',
    lightHex: '#eef2ff',
    textHex: '#4338ca',
    borderHex: '#c7d2fe',
    desc: 'Classic Blue',
  },
  brand: {
    label: 'Brand Sky',
    hex: '#0284c7',
    hoverHex: '#0369a1',
    lightHex: '#f0f9ff',
    textHex: '#0369a1',
    borderHex: '#bae6fd',
    desc: 'Vibrant Cyan',
  },
  rose: {
    label: 'Rose',
    hex: '#f43f5e',
    hoverHex: '#e11d48',
    lightHex: '#fff1f2',
    textHex: '#be123c',
    borderHex: '#fecdd3',
    desc: 'Coral Crimson',
  },
  purple: {
    label: 'Purple',
    hex: '#9333ea',
    hoverHex: '#7e22ce',
    lightHex: '#faf5ff',
    textHex: '#7e22ce',
    borderHex: '#e9d5ff',
    desc: 'Royal Violet',
  },
  amber: {
    label: 'Amber',
    hex: '#d97706',
    hoverHex: '#b45309',
    lightHex: '#fffbeb',
    textHex: '#b45309',
    borderHex: '#fde68a',
    desc: 'Warm Gold',
  },
};

interface ThemeContextType {
  scheme: SchemeType;
  setScheme: (scheme: SchemeType) => void;
  accentColor: AccentColorType;
  setAccentColor: (accent: AccentColorType) => void;
  currentTheme: AccentThemeConfig;
  isDark: boolean;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  scheme: 'light',
  setScheme: () => {},
  accentColor: 'green',
  setAccentColor: () => {},
  currentTheme: ACCENT_THEMES.green,
  isDark: false,
  mounted: false,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [scheme, setScheme] = useState<SchemeType>('light');
  const [accentColor, setAccentColor] = useState<AccentColorType>('green');
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedScheme = (localStorage.getItem('seu-basa-scheme') as SchemeType) || 'light';
    const savedAccent = (localStorage.getItem('seu-basa-accent') as AccentColorType) || 'green';

    setScheme(savedScheme);
    setAccentColor(savedAccent);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const resolveIsDark = () => {
      if (scheme === 'dark') return true;
      if (scheme === 'light') return false;
      return mediaQuery.matches;
    };

    const effectiveDark = resolveIsDark();
    setIsDark(effectiveDark);

    if (effectiveDark) {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }

    // Apply active Accent Theme CSS variables
    const currentTheme = ACCENT_THEMES[accentColor] || ACCENT_THEMES.green;
    root.setAttribute('data-accent', accentColor);
    root.style.setProperty('--primary', currentTheme.hex);
    root.style.setProperty('--primary-hover', currentTheme.hoverHex);
    root.style.setProperty(
      '--primary-light',
      effectiveDark ? `${currentTheme.hex}25` : currentTheme.lightHex
    );
    root.style.setProperty(
      '--primary-text',
      effectiveDark ? currentTheme.hex : currentTheme.textHex
    );
    root.style.setProperty(
      '--primary-border',
      effectiveDark ? `${currentTheme.hex}50` : currentTheme.borderHex
    );

    localStorage.setItem('seu-basa-scheme', scheme);
    localStorage.setItem('seu-basa-accent', accentColor);

    const listener = () => {
      if (scheme === 'auto') {
        const autoDark = mediaQuery.matches;
        setIsDark(autoDark);
        if (autoDark) {
          root.classList.add('dark');
          root.setAttribute('data-theme', 'dark');
        } else {
          root.classList.remove('dark');
          root.setAttribute('data-theme', 'light');
        }
      }
    };

    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, [scheme, accentColor, mounted]);

  const currentTheme = ACCENT_THEMES[accentColor] || ACCENT_THEMES.green;

  return (
    <ThemeContext.Provider
      value={{
        scheme,
        setScheme,
        accentColor,
        setAccentColor,
        currentTheme,
        isDark,
        mounted,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
