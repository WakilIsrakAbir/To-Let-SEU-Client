'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
  ShieldCheck,
  Share2,
  Sparkles,
  ExternalLink,
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
  const { currentTheme } = useTheme();
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
      `Salam! I am a student of SEU and saw your room ad "${post.title}" on SEU Basa (${post.area}). Is it still available?`
    );
    return `https://wa.me/${internationalPhone}?text=${text}`;
  };

  const getMapLink = () => {
    if (post.location?.lat && post.location?.lng) {
      return `https://www.google.com/maps/search/?api=1&query=${post.location.lat},${post.location.lng}`;
    }
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(post.area + ' Dhaka')}`;
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

  const bannerLink = `/create-banner?title=${encodeURIComponent(post.title)}&rent=${post.rentAmount}&area=${encodeURIComponent(post.area)}&gender=${post.gender}&month=${encodeURIComponent(post.availableFromMonth)}&seats=${post.seatCount}&phone=${encodeURIComponent(post.contactNumber)}`;

  return (
    <motion.article
      id={post._id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-all overflow-hidden p-4 sm:p-7 space-y-4 sm:space-y-6"
    >
      {/* 1. Author & Post Header */}
      <div className="flex items-start justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
          {/* Avatar */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.author?.avatarUrl || 'https://res.cloudinary.com/demo/image/upload/v1689246197/cld-sample.jpg'}
            alt={post.author?.name || 'SEU Student'}
            style={{ borderColor: currentTheme.hex }}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 shrink-0"
          />

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span className="font-bold text-slate-900 dark:text-white text-base sm:text-lg leading-tight truncate max-w-full">
                {post.author?.name || 'SEU Student'}
              </span>
              {post.author?.isVerifiedStudent && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-200 dark:border-blue-800 shrink-0 whitespace-nowrap">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified SEU</span>
                </span>
              )}
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

        {/* Rent Badge */}
        <div className="text-right shrink-0 ml-1 sm:ml-2">
          <div
            style={{ color: currentTheme.hex }}
            className="text-xl sm:text-3xl font-black leading-tight whitespace-nowrap"
          >
            {post.rentType === 'negotiable' ? (
              <div className="flex flex-col items-end">
                <span>{formatBDT(post.rentAmount)}</span>
                <span className="badge badge-warning badge-xs sm:badge-sm font-bold text-[10px] sm:text-xs mt-0.5">
                  Negotiable
                </span>
              </div>
            ) : (
              <span>{formatBDT(post.rentAmount)}</span>
            )}
          </div>
          <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap block mt-0.5">
            {post.serviceChargeIncluded ? 'Bills included' : '+ Utility/Bills'}
          </span>
        </div>
      </div>

      {/* 2. Title & Key Specs Tag Bar */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-snug">
          {post.title}
        </h2>

        <div className="flex flex-wrap items-center gap-2 mt-3">
          {/* Gender */}
          <span
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold border shrink-0 ${
              post.gender === 'Male'
                ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                : 'bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800'
            }`}
          >
            {post.gender} Only
          </span>

          {/* Seat Count / Room Type */}
          <span className="px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 shrink-0">
            <Users className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
            <span>
              {post.seatCount} {post.seatCount > 1 ? 'Seats' : 'Seat'} ({post.roomType})
            </span>
          </span>

          {/* Availability Month */}
          <span className="px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 shrink-0">
            <Calendar className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
            <span>From {post.availableFromMonth}</span>
          </span>

          {/* Area */}
          <span
            style={{
              backgroundColor: `${currentTheme.hex}18`,
              color: currentTheme.hex,
              borderColor: `${currentTheme.hex}35`,
            }}
            className="px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold border flex items-center gap-1.5 shrink-0"
          >
            <MapPin className="w-4 h-4 shrink-0" style={{ color: currentTheme.hex }} />
            <span>{post.area}</span>
          </span>

          {/* Distance from Campus */}
          {post.distanceFromCampus && (
            <span className="px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5 shrink-0">
              <Footprints className="w-4 h-4 shrink-0" />
              <span>{post.distanceFromCampus}</span>
            </span>
          )}
        </div>
      </div>

      {/* 3. Media Carousel / Video Player */}
      <MediaViewer
        images={post.media?.images}
        video={post.media?.video}
        title={post.title}
      />

      {/* 4. Description & Address */}
      <div className="space-y-3">
        <p className="text-slate-700 dark:text-slate-200 text-sm sm:text-base whitespace-pre-line leading-relaxed">
          {post.description}
        </p>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-200 flex items-center justify-between flex-wrap gap-2.5">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 shrink-0" style={{ color: currentTheme.hex }} />
            <span className="font-medium">
              <span className="font-bold">Address:</span> {post.addressDetails}
            </span>
          </div>

          <a
            href={getMapLink()}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: currentTheme.hex }}
            className="font-bold hover:underline inline-flex items-center gap-1.5"
          >
            <span>View on Map</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* 5. Amenities Badges */}
      <div>
        <h4 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
          Room & Mess Amenities
        </h4>
        <AmenitiesBadges amenities={post.amenities} />
      </div>

      {/* 6. Action Triggers Bar */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Call button */}
          <a
            href={`tel:${post.contactNumber}`}
            style={{ backgroundColor: currentTheme.hex }}
            className="h-10 px-4 text-white border-none rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm hover:opacity-90 transition"
          >
            <Phone className="w-4 h-4" />
            <span>Call: {post.contactNumber}</span>
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
            className="h-10 px-4 border rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 hover:opacity-90 transition"
          >
            <MessageCircle className="w-4 h-4" style={{ color: currentTheme.hex }} />
            <span>WhatsApp</span>
          </a>
        </div>

        <div className="flex items-center gap-2">
          {/* Auto Banner Button */}
          <Link
            href={bannerLink}
            className="h-10 px-4 bg-amber-500 hover:bg-amber-600 text-slate-950 border-none rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs transition"
            title="Generate printable poster from this post"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">Make Poster</span>
          </Link>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="h-10 w-10 flex items-center justify-center rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Copy link"
          >
            {copied ? (
              <Check className="w-4 h-4" style={{ color: currentTheme.hex }} />
            ) : (
              <Share2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </motion.article>
  );
}
