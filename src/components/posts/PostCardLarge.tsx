'use client';

import React, { useState } from 'react';
import { IPost } from '@/types/post';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import MediaViewer from './MediaViewer';
import AmenitiesBadges from './AmenitiesBadges';
import {
  Phone,
  MessageCircle,
  MapPin,
  Calendar,
  Users,
  Share2,
  Check,
  Building,
  Clock,
  GraduationCap,
  Footprints,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface PostCardLargeProps {
  post: IPost;
}

export default function PostCardLarge({ post }: PostCardLargeProps) {
  const { currentTheme, isDark } = useTheme();
  const [copied, setCopied] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const formatBDT = (val: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleShare = () => {
    const postUrl = `${window.location.origin}/posts#${post._id}`;
    navigator.clipboard.writeText(postUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getWhatsAppLink = () => {
    const phoneClean = post.whatsappNumber || post.contactNumber;
    const digits = phoneClean.replace(/[^0-9]/g, '');
    const internationalPhone = digits.startsWith('880') ? digits : `880${digits.replace(/^0/, '')}`;
    const text = encodeURIComponent(
      `Salam! I am a student of SEU and saw your room ad "${post.title}" on To Let SEU (${post.area}). Is it still available?`
    );
    return `https://wa.me/${internationalPhone}?text=${text}`;
  };

  const formatTimeAgo = (dateInput: string | Date | undefined) => {
    if (!dateInput) return 'Recently';
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return 'Recently';
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays}d ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}w ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  // Abbreviate month names to 3 letters (e.g. September 2026 -> Sep 2026)
  const formatShortMonth = (monthStr: string | undefined): string => {
    if (!monthStr) return 'Immediate';
    const trimmed = monthStr.trim();
    if (trimmed.toLowerCase() === 'immediate') return 'Immediate';

    const monthMap: Record<string, string> = {
      january: 'Jan',
      february: 'Feb',
      march: 'Mar',
      april: 'Apr',
      may: 'May',
      june: 'Jun',
      july: 'Jul',
      august: 'Aug',
      september: 'Sep',
      october: 'Oct',
      november: 'Nov',
      december: 'Dec',
    };

    const parts = trimmed.split(/\s+/);
    const monthKey = parts[0]?.toLowerCase();
    const shortMonth = monthMap[monthKey] || (parts[0]?.length > 3 ? parts[0].slice(0, 3) : parts[0]);
    const year = parts[1] ? ` ${parts[1]}` : '';
    return `${shortMonth}${year}`;
  };

  // Full room & seat label (e.g. 2 Seats (3 Person Room) or 1 Seat (Single Room))
  const formatRoomLabel = (seatCount: number, roomType?: string): string => {
    const s = seatCount > 1 ? `${seatCount} Seats` : `${seatCount} Seat`;
    if (!roomType) return s;
    return `${s} (${roomType})`;
  };

  return (
    <motion.article
      id={post._id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-all overflow-hidden p-4 sm:p-5 space-y-3.5 scroll-mt-28"
    >
      {/* 1. Header: Avatar + (Name & Gender badge on same horizontal line, Dept & Time right underneath) */}
      <div className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={post.author?.avatarUrl || 'https://res.cloudinary.com/demo/image/upload/v1689246197/cld-sample.jpg'}
          alt={post.author?.name || 'SEU Student'}
          style={{ borderColor: currentTheme.hex }}
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border-2 shrink-0 shadow-xs"
        />

        <div className="min-w-0 flex-1">
          {/* Top Line: Poster Name (left) & Gender Pill (right) */}
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg leading-tight truncate">
              {post.author?.name || 'SEU Student'}
            </h3>

            {/* Compact, clean Male / Female Only Badge */}
            <span
              className={`px-2 py-0.5 rounded-lg text-[10px] sm:text-[11px] font-black uppercase tracking-wider shrink-0 border ${
                post.gender === 'Male'
                  ? 'bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                  : 'bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
              }`}
            >
              {post.gender} Only
            </span>
          </div>

          {/* Bottom Line: Dept & Relative Time (tight single line) */}
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex-nowrap">
            <span
              style={{ color: currentTheme.hex }}
              className="font-bold flex items-center gap-1 shrink-0"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>{post.department || 'SEU'} Dept</span>
            </span>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <span className="flex items-center gap-1 text-slate-400 dark:text-slate-500 shrink-0">
              <Clock className="w-3 h-3" />
              <span>{formatTimeAgo(post.createdAt)}</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Specs Row: Spans full width across 4 equal columns on large screen; 2 items per line on small devices */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {/* 1. Room Info */}
        <div
          style={{
            backgroundColor: isDark ? `${currentTheme.hex}20` : currentTheme.lightHex,
            color: isDark ? currentTheme.hex : currentTheme.textHex,
            borderColor: isDark ? `${currentTheme.hex}35` : `${currentTheme.hex}30`,
          }}
          className="px-2 sm:px-2.5 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold border flex items-center justify-center gap-1.5 shadow-2xs min-w-0"
        >
          <Users className="w-3.5 h-3.5 shrink-0" style={{ color: currentTheme.hex }} />
          <span className="truncate">{formatRoomLabel(post.seatCount, post.roomType)}</span>
        </div>

        {/* 2. Available Date */}
        <div
          style={{
            backgroundColor: isDark ? `${currentTheme.hex}20` : currentTheme.lightHex,
            color: isDark ? currentTheme.hex : currentTheme.textHex,
            borderColor: isDark ? `${currentTheme.hex}35` : `${currentTheme.hex}30`,
          }}
          className="px-2 sm:px-2.5 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold border flex items-center justify-center gap-1 shadow-2xs whitespace-nowrap min-w-0"
        >
          <Calendar className="w-3.5 h-3.5 shrink-0" style={{ color: currentTheme.hex }} />
          <span className="truncate">From {formatShortMonth(post.availableFromMonth)}</span>
        </div>

        {/* 3. Location */}
        <div className="px-2 sm:px-2.5 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1.5 shadow-2xs min-w-0">
          <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
          <span className="truncate">{post.area}</span>
        </div>

        {/* 4. See More Button */}
        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          className="px-2 sm:px-2.5 py-1.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5 transition shadow-2xs min-w-0"
        >
          <span>{showDetails ? 'Hide Info' : 'See More'}</span>
          {showDetails ? (
            <ChevronUp className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          )}
        </button>
      </div>

      {/* Collapsible Details Content (Walking Distance, Full Address, Amenities Badges, Poster Description) */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-2.5 overflow-hidden pt-1"
          >
            {/* Campus Walking Distance: Inside See More as requested */}
            {post.distanceFromCampus && (
              <div className="p-2.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 text-xs text-blue-900 dark:text-blue-300 font-medium flex items-center gap-2">
                <Footprints className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <div>
                  <strong className="font-bold text-blue-950 dark:text-blue-200">SEU Campus Distance:</strong>{' '}
                  <span>{post.distanceFromCampus}</span>
                </div>
              </div>
            )}

            {/* Full Address Details: Explicitly labeled "Full Address" */}
            {post.addressDetails && (
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs sm:text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2">
                <Building className="w-4 h-4 shrink-0 text-slate-400 mt-0.5" />
                <div>
                  <strong className="font-bold text-slate-900 dark:text-white">Full Address:</strong>{' '}
                  <span>{post.addressDetails}</span>
                </div>
              </div>
            )}

            {/* Amenities Badges */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5 block">
                Included Amenities & Facilities
              </span>
              <AmenitiesBadges amenities={post.amenities} />
            </div>

            {/* Poster's Extended Description */}
            {post.description && (
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1 block">
                  Note / Details from Poster
                </span>
                <p className="text-slate-700 dark:text-slate-200 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                  {post.description}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Media Carousel (Room Images) */}
      <MediaViewer
        images={post.media?.images}
        title={post.title}
        showThumbnails={true}
      />

      {/* 5. Rent Bar (Directly below Image) */}
      <div className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-slate-50 dark:from-emerald-950/35 dark:via-slate-800/60 dark:to-slate-900 border border-emerald-500/20 dark:border-emerald-500/20 shadow-xs">
        {/* Main Row: Rent Amount and Utility/Bills Badge on the exact same straight row */}
        <div className="flex items-center justify-between gap-2">
          {/* Left: Rent Amount */}
          <div className="flex items-baseline gap-1.5 shrink-0">
            <span
              style={{ color: currentTheme.hex }}
              className="text-xl sm:text-2xl font-black tracking-tight leading-none whitespace-nowrap"
            >
              {formatBDT(post.rentAmount)}
            </span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-none whitespace-nowrap">
              / month
            </span>
          </div>

          {/* Right: Utility / Bills Badge directly across on the same row */}
          <div className="shrink-0">
            <span
              className={`px-2 py-0.5 rounded-md text-[11px] sm:text-xs font-bold border flex items-center gap-1 shadow-2xs whitespace-nowrap ${
                post.serviceChargeIncluded
                  ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700'
                  : 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
              }`}
            >
              {post.serviceChargeIncluded ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Bills Included</span>
                </>
              ) : (
                <span>+ Utility / Bills</span>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* 6. Action Triggers Bar (Call, WhatsApp, Share) */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
        {/* Large Screen View (sm: and above): Phone, WhatsApp, and Share in the EXACT SAME ROW */}
        <div className="hidden sm:flex items-center gap-1.5 sm:gap-2">
          {/* Call button: icon + phone number only */}
          <a
            href={`tel:${post.contactNumber}`}
            style={{ backgroundColor: currentTheme.hex }}
            className="flex-1 min-w-0 h-9 sm:h-10 px-2 sm:px-2.5 xl:px-3 text-white border-none rounded-xl text-[11px] sm:text-xs xl:text-sm font-bold flex items-center justify-center gap-1 sm:gap-1.5 shadow-xs hover:opacity-90 transition"
          >
            <Phone className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{post.contactNumber}</span>
          </a>

          {/* WhatsApp Button */}
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              backgroundColor: currentTheme.lightHex,
              color: currentTheme.textHex,
              borderColor: currentTheme.borderHex,
            }}
            className="flex-1 min-w-0 h-9 sm:h-10 px-2 sm:px-2.5 xl:px-3 border rounded-xl text-[11px] sm:text-xs xl:text-sm font-bold flex items-center justify-center gap-1 sm:gap-1.5 hover:opacity-90 transition"
          >
            <MessageCircle className="w-3.5 h-3.5 shrink-0" style={{ color: currentTheme.hex }} />
            <span className="truncate">WhatsApp</span>
          </a>

          {/* Share Button (Same Row on large screens) */}
          <button
            onClick={handleShare}
            className="shrink-0 h-9 sm:h-10 px-2.5 sm:px-3 xl:px-3.5 flex items-center justify-center gap-1 sm:gap-1.5 rounded-xl text-[11px] sm:text-xs xl:text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs transition"
            title="Copy link to this post"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" style={{ color: currentTheme.hex }} />
                <span style={{ color: currentTheme.hex }}>Copied</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Share</span>
              </>
            )}
          </button>
        </div>

        {/* Mobile View (sm:hidden): Call & WhatsApp in Row 1, Full-width Share in Row 2 */}
        <div className="sm:hidden space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <a
              href={`tel:${post.contactNumber}`}
              style={{ backgroundColor: currentTheme.hex }}
              className="h-10 px-2 text-white border-none rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs hover:opacity-90 transition min-w-0"
            >
              <Phone className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{post.contactNumber}</span>
            </a>

            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: currentTheme.lightHex,
                color: currentTheme.textHex,
                borderColor: currentTheme.borderHex,
              }}
              className="h-10 px-2 border rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 hover:opacity-90 transition min-w-0"
            >
              <MessageCircle className="w-3.5 h-3.5 shrink-0" style={{ color: currentTheme.hex }} />
              <span className="truncate">WhatsApp</span>
            </a>
          </div>

          <button
            onClick={handleShare}
            className="w-full h-8 flex items-center justify-center gap-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs transition"
            title="Copy link to this post"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" style={{ color: currentTheme.hex }} />
                <span style={{ color: currentTheme.hex }}>Link Copied</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Share</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.article>
  );
}
