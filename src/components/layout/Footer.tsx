'use client';

import React from 'react';
import Link from 'next/link';
import SEUBasaLogo from './SEUBasaLogo';
import { Heart, MapPin, Mail, Phone } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export default function Footer() {
  const { currentTheme } = useTheme();

  return (
    <footer className="bg-white dark:bg-[#070d0a] text-slate-600 dark:text-slate-400 border-t border-slate-200/90 dark:border-slate-800/80 mt-auto transition-colors duration-200">
      <div className="max-w-7xl min-[1680px]:max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <SEUBasaLogo />
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm max-w-sm leading-relaxed">
              The premier bachelor accommodation network engineered specifically for Southeast University students in Dhaka. Connecting fellow classmates with verified seats, flats, and roommates.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <MapPin className="w-4 h-4 shrink-0" style={{ color: currentTheme.hex }} />
              <span>Tejgaon Permanent Campus Area, Dhaka, Bangladesh</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-slate-900 dark:text-white text-xs sm:text-sm font-extrabold uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link
                  href="/posts"
                  className="hover:text-slate-900 dark:hover:text-white transition"
                  onMouseEnter={(e) => (e.currentTarget.style.color = currentTheme.hex)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '')}
                >
                  Browse All Posts
                </Link>
              </li>
              <li>
                <Link
                  href="/posts/create"
                  className="hover:text-slate-900 dark:hover:text-white transition"
                  onMouseEnter={(e) => (e.currentTarget.style.color = currentTheme.hex)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '')}
                >
                  Post Room / Seat Ad
                </Link>
              </li>
              <li>
                <Link
                  href="/create-banner"
                  className="hover:text-amber-500 transition font-medium"
                >
                  Auto Poster Generator
                </Link>
              </li>
              <li>
                <Link
                  href="/about-us"
                  className="hover:text-slate-900 dark:hover:text-white transition"
                  onMouseEnter={(e) => (e.currentTarget.style.color = currentTheme.hex)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '')}
                >
                  About TO-LET SEU
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-slate-900 dark:hover:text-white transition"
                  onMouseEnter={(e) => (e.currentTarget.style.color = currentTheme.hex)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '')}
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Community */}
          <div>
            <h4 className="text-slate-900 dark:text-white text-xs sm:text-sm font-extrabold uppercase tracking-wider mb-4">
              SEU Community
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              <li className="flex items-center gap-2">
                <a
                  href="https://www.facebook.com/groups/595436001496374/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition"
                >
                  <svg
                    className="w-4 h-4 shrink-0"
                    viewBox="0 0 24 24"
                    style={{ fill: currentTheme.hex }}
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span>SEU Facebook Group</span>
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0" style={{ color: currentTheme.hex }} />
                <span>support@seubasa.org</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0" style={{ color: currentTheme.hex }} />
                <span>018XXXXXXXX</span>
              </li>
              <li className="pt-2 text-xs text-slate-400 dark:text-slate-500">
                Created by and for Southeast University Students.
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800/80 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-500">
          <p>© {new Date().getFullYear()} TO-LET SEU Platform. All rights reserved.</p>
          <p className="flex items-center gap-1 mt-2 sm:mt-0">
            Engineered with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for SEU Tigers
          </p>
        </div>
      </div>
    </footer>
  );
}
