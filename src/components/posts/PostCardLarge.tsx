'use client';

import React, { useState } from 'react';
import { IPost } from '@/types/post';
import { motion } from 'framer-motion';
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
  Sparkles,
  Check,
  Building,
  Clock,
  GraduationCap,
  Footprints,
} from 'lucide-react';

interface PostCardLargeProps {
  post: IPost;
}

export default function PostCardLarge({ post }: PostCardLargeProps) {
  const { currentTheme, isDark } = useTheme();
  const [copied, setCopied] = useState(false);

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

  return (
    <motion.article
      id={post._id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-all overflow-hidden p-4 sm:p-7 space-y-4 sm:space-y-6 scroll-mt-28"
    >
      {/* 1. Author & Post Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
        {/* Left Header Side: Author & Meta */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Avatar */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.author?.avatarUrl || 'https://res.cloudinary.com/demo/image/upload/v1689246197/cld-sample.jpg'}
            alt={post.author?.name || 'SEU Student'}
            style={{ borderColor: currentTheme.hex }}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover border-2 shrink-0 shadow-xs"
          />

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-slate-900 dark:text-white text-base sm:text-lg leading-tight truncate">
                {post.author?.name || 'SEU Student'}
              </span>

              {/* Mobile Gender Pill (aligned right next to name on mobile) */}
              <span
                className={`sm:hidden px-2 py-0.5 rounded-lg text-[11px] font-black uppercase tracking-wide border shadow-2xs shrink-0 ${
                  post.gender === 'Male'
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                    : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                }`}
              >
                {post.gender} Only
              </span>
            </div>

            {/* Clean Professional Meta: Department & Relative Time */}
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 flex-wrap">
              <span
                style={{ color: currentTheme.hex }}
                className="font-bold flex items-center gap-1.5 whitespace-nowrap"
              >
                <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>{post.department || 'SEU'} Dept</span>
              </span>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span className="flex items-center gap-1 whitespace-nowrap text-slate-500 dark:text-slate-400 font-medium">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{formatTimeAgo(post.createdAt)}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right Header Side: Rent Badge (and desktop Gender Pill) */}
        <div className="flex items-center sm:items-end justify-between sm:justify-start sm:flex-col shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800/80">
          {/* Desktop Gender Pill & Rent Row */}
          <div className="hidden sm:flex items-center gap-2 sm:gap-2.5">
            <span
              className={`px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wide border shadow-2xs shrink-0 ${
                post.gender === 'Male'
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                  : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
              }`}
            >
              {post.gender} Only
            </span>

            <div
              style={{ color: currentTheme.hex }}
              className="text-xl sm:text-3xl font-black leading-none whitespace-nowrap"
            >
              {formatBDT(post.rentAmount)}
            </div>
          </div>

          {/* Mobile Rent Amount Display */}
          <div className="sm:hidden flex items-baseline gap-1.5">
            <span
              style={{ color: currentTheme.hex }}
              className="text-2xl font-black leading-none whitespace-nowrap"
            >
              {formatBDT(post.rentAmount)}
            </span>
          </div>

          {/* Sub-row: Negotiable badge + Bills info */}
          <div className="flex items-center gap-1.5 mt-1 sm:mt-1.5">
            {post.rentType === 'negotiable' && (
              <span className="badge badge-warning badge-xs font-bold text-[10px] sm:text-xs">
                Negotiable
              </span>
            )}
            <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">
              {post.serviceChargeIncluded ? 'Bills included' : '+ Utility/Bills'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Key Room Facts at a Glance (Seat & Month Highlighted; Area & Distance Clean & Neutral) */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Seat Count / Room Type (HIGHLIGHTED) */}
        <span
          style={{
            backgroundColor: isDark ? `${currentTheme.hex}22` : currentTheme.lightHex,
            color: isDark ? currentTheme.hex : currentTheme.textHex,
            borderColor: isDark ? `${currentTheme.hex}40` : `${currentTheme.hex}35`,
          }}
          className="px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold border flex items-center gap-1.5 shrink-0 shadow-2xs"
        >
          <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" style={{ color: currentTheme.hex }} />
          <span>
            {post.seatCount} {post.seatCount > 1 ? 'Seats' : 'Seat'} ({post.roomType})
          </span>
        </span>

        {/* Availability Month (HIGHLIGHTED) */}
        <span
          style={{
            backgroundColor: isDark ? `${currentTheme.hex}22` : currentTheme.lightHex,
            color: isDark ? currentTheme.hex : currentTheme.textHex,
            borderColor: isDark ? `${currentTheme.hex}40` : `${currentTheme.hex}35`,
          }}
          className="px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold border flex items-center gap-1.5 shrink-0 shadow-2xs"
        >
          <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" style={{ color: currentTheme.hex }} />
          <span>From {post.availableFromMonth}</span>
        </span>

        {/* Area (Neutral, Clean) */}
        <span className="px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 shrink-0">
          <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
          <span>{post.area}</span>
        </span>

        {/* Distance from Campus (Neutral, Clean) */}
        {post.distanceFromCampus && (
          <span className="px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 shrink-0">
            <Footprints className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
            <span>{post.distanceFromCampus}</span>
          </span>
        )}
      </div>

      {/* 3. Address (Clean 1-liner if provided) */}
      {post.addressDetails && (
        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          <Building className="w-4 h-4 shrink-0 text-slate-400" />
          <span>
            <strong className="text-slate-800 dark:text-slate-200 font-semibold">Address:</strong>{' '}
            {post.addressDetails}
          </span>
        </div>
      )}

      {/* 4. Room & Mess Amenities */}
      <AmenitiesBadges amenities={post.amenities} />

      {/* 5. Description (Placed directly above the media viewer / action buttons) */}
      {post.description && (
        <p className="text-slate-700 dark:text-slate-200 text-sm sm:text-base leading-relaxed whitespace-pre-line">
          {post.description}
        </p>
      )}

      {/* 6. Media Carousel (Placed directly below description; hidden if no images) */}
      <MediaViewer
        images={post.media?.images}
        title={post.title}
      />

      {/* 6. Action Triggers Bar */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="grid grid-cols-2 gap-2.5 sm:flex sm:items-center sm:gap-2.5 w-full sm:w-auto">
          {/* Call button */}
          <a
            href={`tel:${post.contactNumber}`}
            style={{ backgroundColor: currentTheme.hex }}
            className="h-10 px-3 sm:px-4 text-white border-none rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm hover:opacity-90 transition shrink-0"
          >
            <Phone className="w-4 h-4 shrink-0" />
            <span className="truncate">Call: {post.contactNumber}</span>
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
            className="h-10 px-3 sm:px-4 border rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 transition shrink-0"
          >
            <MessageCircle className="w-4 h-4 shrink-0" style={{ color: currentTheme.hex }} />
            <span className="truncate">WhatsApp</span>
          </a>
        </div>

        <div className="flex items-center justify-end gap-2">
          {/* Share Button */}
          <button
            onClick={handleShare}
            className="w-full sm:w-auto h-10 px-3.5 flex items-center justify-center gap-1.5 rounded-xl text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs transition"
            title="Copy link to this post"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" style={{ color: currentTheme.hex }} />
                <span style={{ color: currentTheme.hex }}>Link Copied</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.article>
  );
}
