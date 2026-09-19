'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X, Moon, Sun, Zap, Check, Sliders, Sparkles } from 'lucide-react';
import { useTheme, SchemeType, AccentColorType, ACCENT_THEMES } from '@/context/ThemeContext';

export default function SettingsDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const {
    accentColor,
    setAccentColor,
    scheme,
    setScheme,
    currentTheme,
    isDark,
  } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const themeList = (Object.keys(ACCENT_THEMES) as AccentColorType[]).map((key) => ({
    id: key,
    ...ACCENT_THEMES[key],
  }));

  const schemes: {
    id: SchemeType;
    label: string;
    desc: string;
    icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  }[] = [
    { id: 'light', label: 'Light Mode', desc: 'Fresh Mountain Sage', icon: Sun },
    { id: 'dark', label: 'Dark Mode', desc: 'Obsidian Tech Night', icon: Moon },
    { id: 'auto', label: 'Auto', desc: 'System Preference', icon: Zap },
  ];

  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* Floating Gear Button (Adapts to Active Theme Accent Color; bottom corner on mobile, middle edge on desktop) */}
      <div className="fixed right-3 bottom-6 sm:right-0 sm:top-1/2 sm:-translate-y-1/2 sm:bottom-auto z-[9990] pointer-events-auto">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen((prev) => !prev);
          }}
          aria-label="Open Theme Settings"
          id="seu-settings-gear-btn"
          style={{ backgroundColor: currentTheme.hex }}
          className="group relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 active:scale-95 text-white rounded-full sm:rounded-l-2xl sm:rounded-r-none shadow-2xl transition-all duration-300 cursor-pointer border border-white/25 sm:border-r-0 select-none hover:opacity-95"
          title="Customize Theme & Colors"
        >
          <Settings className="w-5 h-5 sm:w-6 sm:h-6 animate-gear-spin group-hover:rotate-90 transition-transform duration-500 pointer-events-none" />
          <span className="sr-only">Theme Settings</span>
        </button>
      </div>

      {/* Slide-over Settings Drawer (Light in light mode, Dark in dark mode) */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[9999] overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-xs cursor-pointer"
            />

            {/* Slide-out Drawer Panel */}
            <div className="fixed inset-y-0 right-0 max-w-full flex pl-8 sm:pl-10 pointer-events-none">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: '0%' }}
                exit={{ x: '100%' }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="w-screen max-w-md bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col pointer-events-auto relative z-10 transition-colors duration-200"
              >
                {/* Drawer Header */}
                <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
                      style={{
                        backgroundColor: isDark ? `${currentTheme.hex}25` : currentTheme.lightHex,
                        color: currentTheme.hex,
                        borderColor: isDark ? `${currentTheme.hex}50` : currentTheme.borderHex,
                        borderWidth: 1,
                      }}
                    >
                      <Sliders className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                        Theme & Color Settings
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Personalize To Let SEU Experience
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                    aria-label="Close settings"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Drawer Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-7 custom-scrollbar">
                  {/* Section 1: Display Scheme Mode */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles
                        className="w-4 h-4 transition-colors"
                        style={{ color: currentTheme.hex }}
                      />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Display Scheme Mode
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {schemes.map((s) => {
                        const Icon = s.icon;
                        const isSelected = scheme === s.id;

                        return (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => setScheme(s.id)}
                            style={{
                              borderColor: isSelected ? currentTheme.hex : undefined,
                              backgroundColor: isSelected
                                ? isDark
                                  ? `${currentTheme.hex}18`
                                  : currentTheme.lightHex
                                : undefined,
                            }}
                            className={`relative p-3 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                              isSelected
                                ? 'shadow-xs font-semibold'
                                : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100/80 dark:hover:bg-slate-900/70'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <Icon
                                className="w-4 h-4"
                                style={{
                                  color: isSelected ? currentTheme.hex : undefined,
                                }}
                              />
                              {isSelected && (
                                <Check
                                  className="w-3.5 h-3.5"
                                  style={{ color: currentTheme.hex }}
                                />
                              )}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-900 dark:text-white">
                                {s.label}
                              </p>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                                {s.desc}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Section 2: Accent Colors */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Sliders
                        className="w-4 h-4 transition-colors"
                        style={{ color: currentTheme.hex }}
                      />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Accent Colors
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {themeList.map((t) => {
                        const isSelected = accentColor === t.id;

                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => setAccentColor(t.id)}
                            style={{
                              borderColor: isSelected ? t.hex : undefined,
                              backgroundColor: isSelected
                                ? isDark
                                  ? `${t.hex}18`
                                  : t.lightHex
                                : undefined,
                            }}
                            className={`p-3 rounded-2xl border transition-all text-left flex items-center justify-between cursor-pointer ${
                              isSelected
                                ? 'shadow-xs font-semibold'
                                : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100/80 dark:hover:bg-slate-900/70'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span
                                className="w-4 h-4 rounded-full shrink-0 shadow-sm"
                                style={{ backgroundColor: t.hex }}
                              />
                              <div>
                                <p className="text-xs font-bold text-slate-900 dark:text-white">
                                  {t.label}
                                </p>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                                  {t.desc}
                                </p>
                              </div>
                            </div>

                            {isSelected && (
                              <Check
                                className="w-4 h-4 shrink-0"
                                style={{ color: t.hex }}
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Drawer Footer */}
                <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 text-center">
                  <p
                    className="text-[11px] font-semibold transition-colors"
                    style={{ color: currentTheme.hex }}
                  >
                    To Let SEU • SEU UMS Theme Engine
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
