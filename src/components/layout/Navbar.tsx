'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import SEUBasaLogo from './SEUBasaLogo';
import { motion, useScroll, useSpring } from 'framer-motion';
import {
  Plus,
  User,
  Shield,
  LogOut,
  Menu,
  X,
  FileText,
  ChevronDown,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { user, isAdmin, logout } = useAuth();
  const { currentTheme, isDark } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Framer Motion scroll progress for seamless reading depth indicator
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  interface NavItem {
    name: string;
    href: string;
    badge?: string;
  }

  const isDashboardActive = pathname.startsWith('/dashboard');

  const navLinks: NavItem[] = [
    { name: 'Home', href: '/' },
    { name: 'Rent Posts', href: '/posts' },
    { name: 'Create Banner', href: '/create-banner' },
    { name: 'About Us', href: '/about-us' },
    { name: 'Contact Us', href: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#080f0c]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl min-[1680px]:max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Left: Branded SEU Logo */}
          <div className="flex-shrink-0">
            <SEUBasaLogo />
          </div>

          {/* Center: Sleek Capsule Pill Navigation (Light in light mode, Dark in dark mode) */}
          <nav className="hidden md:flex items-center bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-2 py-1.5 rounded-full border border-slate-200/90 dark:border-slate-800 shadow-xs transition-colors duration-200">
            {navLinks.map((link) => {
              const active = isActive(link.href);

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  style={{
                    backgroundColor: active
                      ? isDark
                        ? currentTheme.hex
                        : currentTheme.lightHex
                      : undefined,
                    color: active
                      ? isDark
                        ? '#ffffff'
                        : currentTheme.textHex
                      : undefined,
                  }}
                  className={`relative px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                    active
                      ? 'shadow-xs font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-white/10'
                  }`}
                >
                  <span>{link.name}</span>
                  {link.badge && (
                    <span
                      style={{
                        backgroundColor: active
                          ? isDark
                            ? `${currentTheme.hoverHex}`
                            : `${currentTheme.borderHex}`
                          : undefined,
                        color: active
                          ? isDark
                            ? '#ffffff'
                            : currentTheme.textHex
                          : undefined,
                      }}
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        active
                          ? ''
                          : 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-300/40 dark:border-amber-400/30'
                      }`}
                    >
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right: Actions & User Authentication */}
          <div className="hidden md:flex items-center gap-3">
            {/* Post Ad Button */}
            <Link
              href="/posts/create"
              style={{ backgroundColor: currentTheme.hex }}
              className="inline-flex items-center gap-1.5 px-4.5 py-2 rounded-xl text-white text-sm font-bold shadow-sm hover:opacity-90 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Post Ad</span>
            </Link>

            {!mounted ? (
              <div className="w-28 h-9 rounded-full bg-slate-100 dark:bg-slate-800/60 animate-pulse" />
            ) : user ? (
              /* User Dropdown with Dashboard Text & Active State Indicator */
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  style={{
                    backgroundColor: isDashboardActive
                      ? isDark
                        ? `${currentTheme.hex}22`
                        : currentTheme.lightHex
                      : undefined,
                    color: isDashboardActive
                      ? isDark
                        ? '#ffffff'
                        : currentTheme.textHex
                      : undefined,
                    borderColor: isDashboardActive
                      ? currentTheme.hex
                      : undefined,
                    boxShadow: isDashboardActive
                      ? `0 0 0 1.5px ${currentTheme.hex}40`
                      : undefined,
                  }}
                  className={`flex items-center gap-2.5 pl-3.5 pr-2 py-1 rounded-full border transition-all duration-200 cursor-pointer select-none group ${
                    isDashboardActive
                      ? 'font-bold shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white/60 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <span className="text-xs sm:text-sm font-bold tracking-tight">Dashboard</span>
                  <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-slate-200/80 dark:border-slate-700">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={user.avatarUrl || 'https://res.cloudinary.com/demo/image/upload/v1689246197/cld-sample.jpg'}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                    {isDashboardActive && (
                      <span
                        style={{ backgroundColor: currentTheme.hex }}
                        className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-1.5 ring-white dark:ring-slate-900 animate-pulse"
                      />
                    )}
                  </div>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 opacity-60 group-hover:opacity-100 ${
                      isDashboardActive ? 'text-current' : 'text-slate-400'
                    }`}
                  />
                </div>
                <ul
                  tabIndex={0}
                  onClick={() => (document.activeElement as HTMLElement)?.blur()}
                  className="mt-3 z-[1] p-2 shadow-xl menu menu-sm dropdown-content bg-white dark:bg-slate-900 rounded-2xl w-60 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200"
                >
                  <li className="menu-title px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="font-bold text-slate-900 dark:text-white text-sm">{user.name}</p>
                    <span
                      className="text-xs font-medium"
                      style={{ color: currentTheme.hex }}
                    >
                      {user.department} Dept {user.studentId ? `• ${user.studentId}` : ''}
                    </span>
                  </li>
                  <li>
                    <Link
                      href="/dashboard"
                      onClick={() => (document.activeElement as HTMLElement)?.blur()}
                      style={{
                        backgroundColor: pathname === '/dashboard' ? (isDark ? `${currentTheme.hex}22` : currentTheme.lightHex) : undefined,
                        color: pathname === '/dashboard' ? (isDark ? '#ffffff' : currentTheme.textHex) : undefined,
                        fontWeight: pathname === '/dashboard' ? 'bold' : undefined,
                      }}
                      className="py-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-500" />
                        <span>My Dashboard</span>
                      </div>
                      {pathname === '/dashboard' && (
                        <span
                          style={{ backgroundColor: currentTheme.hex }}
                          className="w-2 h-2 rounded-full"
                        />
                      )}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard/my-posts"
                      onClick={() => (document.activeElement as HTMLElement)?.blur()}
                      style={{
                        backgroundColor: pathname === '/dashboard/my-posts' ? (isDark ? `${currentTheme.hex}22` : currentTheme.lightHex) : undefined,
                        color: pathname === '/dashboard/my-posts' ? (isDark ? '#ffffff' : currentTheme.textHex) : undefined,
                        fontWeight: pathname === '/dashboard/my-posts' ? 'bold' : undefined,
                      }}
                      className="py-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-500" />
                        <span>My Rent Posts</span>
                      </div>
                      {pathname === '/dashboard/my-posts' && (
                        <span
                          style={{ backgroundColor: currentTheme.hex }}
                          className="w-2 h-2 rounded-full"
                        />
                      )}
                    </Link>
                  </li>
                  {isAdmin && (
                    <li>
                      <Link
                        href="/admin"
                        onClick={() => (document.activeElement as HTMLElement)?.blur()}
                        style={{
                          backgroundColor: pathname.startsWith('/admin') ? (isDark ? `${currentTheme.hex}22` : currentTheme.lightHex) : undefined,
                          color: pathname.startsWith('/admin') ? (isDark ? '#ffffff' : currentTheme.textHex) : undefined,
                          fontWeight: pathname.startsWith('/admin') ? 'bold' : undefined,
                        }}
                        className="py-2.5 text-indigo-600 dark:text-indigo-400 font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-xl flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4" />
                          <span>Admin Moderation</span>
                        </div>
                        {pathname.startsWith('/admin') && (
                          <span
                            style={{ backgroundColor: currentTheme.hex }}
                            className="w-2 h-2 rounded-full"
                          />
                        )}
                      </Link>
                    </li>
                  )}
                  <div className="divider my-1 border-slate-100 dark:border-slate-800"></div>
                  <li>
                    <button
                      onClick={() => {
                        (document.activeElement as HTMLElement)?.blur();
                        logout();
                      }}
                      className="py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-700 rounded-xl w-full flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              /* Clean Login Button */
              <Link
                href="/login"
                style={{
                  backgroundColor: isDark ? `${currentTheme.hex}25` : currentTheme.lightHex,
                  color: isDark ? currentTheme.hex : currentTheme.textHex,
                  borderColor: isDark ? `${currentTheme.hex}50` : currentTheme.borderHex,
                }}
                className="px-4.5 py-2 text-sm font-bold border rounded-xl hover:opacity-90 transition shadow-xs"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/posts/create"
              style={{ backgroundColor: currentTheme.hex }}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-white text-xs font-semibold rounded-lg shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Post</span>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-3 pb-6 space-y-1.5 shadow-xl animate-in slide-in-from-top-2 duration-150">
          {navLinks.map((link) => {
            const active = isActive(link.href);

            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  backgroundColor: active
                    ? isDark
                      ? currentTheme.hex
                      : currentTheme.lightHex
                    : undefined,
                  color: active
                    ? isDark
                      ? '#ffffff'
                      : currentTheme.textHex
                    : undefined,
                }}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition ${
                  active
                    ? 'font-semibold shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                <span>{link.name}</span>
                {link.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="divider my-2 border-slate-200 dark:border-slate-800"></div>

          {!mounted ? (
            <div className="h-10 rounded-lg bg-slate-100 dark:bg-slate-800/60 animate-pulse" />
          ) : user ? (
            <div className="space-y-1.5">
              <div className="px-3.5 py-2 bg-slate-50 dark:bg-slate-900 rounded-lg">
                <p className="font-bold text-slate-900 dark:text-white text-sm">{user.name}</p>
                <p
                  className="text-xs font-semibold"
                  style={{ color: currentTheme.hex }}
                >
                  {user.department} Dept
                </p>
              </div>
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  backgroundColor: pathname === '/dashboard' ? (isDark ? `${currentTheme.hex}22` : currentTheme.lightHex) : undefined,
                  color: pathname === '/dashboard' ? (isDark ? '#ffffff' : currentTheme.textHex) : undefined,
                  fontWeight: pathname === '/dashboard' ? 'bold' : undefined,
                }}
                className="flex items-center justify-between px-3.5 py-2 text-sm font-medium rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900"
              >
                <div className="flex items-center gap-2.5">
                  <User className="w-4 h-4 text-slate-400" />
                  <span>My Dashboard</span>
                </div>
                {pathname === '/dashboard' && (
                  <span
                    style={{ backgroundColor: currentTheme.hex }}
                    className="w-2 h-2 rounded-full"
                  />
                )}
              </Link>
              <Link
                href="/dashboard/my-posts"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  backgroundColor: pathname === '/dashboard/my-posts' ? (isDark ? `${currentTheme.hex}22` : currentTheme.lightHex) : undefined,
                  color: pathname === '/dashboard/my-posts' ? (isDark ? '#ffffff' : currentTheme.textHex) : undefined,
                  fontWeight: pathname === '/dashboard/my-posts' ? 'bold' : undefined,
                }}
                className="flex items-center justify-between px-3.5 py-2 text-sm font-medium rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-slate-400" />
                  <span>My Rent Posts</span>
                </div>
                {pathname === '/dashboard/my-posts' && (
                  <span
                    style={{ backgroundColor: currentTheme.hex }}
                    className="w-2 h-2 rounded-full"
                  />
                )}
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-lg"
                >
                  <Shield className="w-4 h-4" />
                  <span>Admin Moderation</span>
                </Link>
              )}
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2.5 w-full px-3.5 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="pt-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  backgroundColor: isDark ? `${currentTheme.hex}25` : currentTheme.lightHex,
                  color: isDark ? currentTheme.hex : currentTheme.textHex,
                  borderColor: isDark ? `${currentTheme.hex}50` : currentTheme.borderHex,
                }}
                className="block py-2.5 text-center text-sm font-bold border rounded-xl hover:opacity-90 transition"
              >
                Login
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Framer Motion Scroll Progress Indicator */}
      <motion.div
        className="h-[2px] origin-left"
        style={{
          scaleX,
          background: `linear-gradient(to right, ${currentTheme.hex}, #f59e0b)`,
        }}
      />
    </header>
  );
}
