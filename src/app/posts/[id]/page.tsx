'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { IPost } from '@/types/post';
import { useTheme } from '@/context/ThemeContext';
import MediaViewer from '@/components/posts/MediaViewer';
import AmenitiesBadges from '@/components/posts/AmenitiesBadges';
import LoadingState from '@/components/common/LoadingState';
import ErrorState from '@/components/common/ErrorState';
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
  ArrowLeft,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Eye,
  AlertCircle,
} from 'lucide-react';

// Fallback listings in case mock post or offline
const MOCK_POSTS: Record<string, Partial<IPost>> = {
  'mock-1': {
    _id: 'mock-1',
    title: 'Male Bachelor Seat Available Near SEU Campus',
    area: 'Tejgaon (Near SEU Campus)',
    distanceFromCampus: '4 mins walk',
    addressDetails: 'Near Southeast University Permanent Campus, Tejgaon I/A',
    rentAmount: 3500,
    gender: 'Male',
    seatCount: 1,
    roomType: '2 Person Room',
    availableFromMonth: 'September 2026',
    contactNumber: '01711-223344',
    whatsappNumber: '01711-223344',
    department: 'CSE',
    description: 'Very peaceful study environment, friendly flatmates from SEU CSE and BBA departments. Filter water, 24/7 high speed WiFi, fridge, daily Khala meals available. 11 PM night gate lock.',
    amenities: {
      wifi: true,
      attachedBath: true,
      khalaMaid: true,
      fridge: true,
      balcony: true,
      generatorIPS: false,
      lift: true,
      filterWater: true,
    },
    media: {
      images: [
        { url: '/default-room-1.jpg', publicId: 'demo-1' },
        { url: '/default-room-2.jpg', publicId: 'demo-2' },
      ],
    },
    author: {
      _id: 'mock-author-1',
      name: 'SEU Student Resident',
      email: 'resident@seu.edu.bd',
      phone: '01711-223344',
      department: 'CSE',
      isVerifiedStudent: true,
    },
  },
  'mock-2': {
    _id: 'mock-2',
    title: 'Female Bachelor Single Room in Mohakhali',
    area: 'Mohakhali',
    distanceFromCampus: '8 mins walk',
    addressDetails: 'Wireless Gate, Mohakhali, Dhaka',
    rentAmount: 4500,
    gender: 'Female',
    seatCount: 1,
    roomType: 'Single Room',
    availableFromMonth: 'Immediate',
    contactNumber: '01899-887766',
    whatsappNumber: '01899-887766',
    department: 'Pharmacy',
    description: 'Fully secure flat with female security, generator IPS, clean attached washroom and private balcony. Perfect for SEU female students.',
    amenities: {
      wifi: true,
      attachedBath: true,
      khalaMaid: true,
      fridge: true,
      balcony: true,
      generatorIPS: true,
      lift: true,
      filterWater: true,
    },
    media: {
      images: [
        { url: '/default-room-2.jpg', publicId: 'demo-2' },
        { url: '/default-room-3.jpg', publicId: 'demo-3' },
      ],
    },
    author: {
      _id: 'mock-author-2',
      name: 'SEU Female Resident',
      email: 'female.student@seu.edu.bd',
      phone: '01899-887766',
      department: 'Pharmacy',
      isVerifiedStudent: true,
    },
  },
  'mock-3': {
    _id: 'mock-3',
    title: 'Male Shared Seat in Nakhalpara',
    area: 'Nakhalpara',
    distanceFromCampus: '10 mins walk',
    addressDetails: 'East Nakhalpara, Near SEU Campus',
    rentAmount: 3200,
    gender: 'Male',
    seatCount: 2,
    roomType: 'Shared Seat',
    availableFromMonth: 'October 2026',
    contactNumber: '01655-443322',
    whatsappNumber: '01655-443322',
    department: 'EEE',
    description: 'Affordable seat with all basic utilities included. Filter water and cook khala system active.',
    amenities: {
      wifi: true,
      attachedBath: false,
      khalaMaid: true,
      fridge: true,
      balcony: false,
      generatorIPS: true,
      lift: false,
      filterWater: true,
    },
    media: {
      images: [
        { url: '/default-room-3.jpg', publicId: 'demo-3' },
        { url: '/default-room-1.jpg', publicId: 'demo-1' },
      ],
    },
    author: {
      _id: 'mock-author-3',
      name: 'SEU EEE Student',
      email: 'eee.student@seu.edu.bd',
      phone: '01655-443322',
      department: 'EEE',
      isVerifiedStudent: true,
    },
  },
};

export default function PostDetailPage() {
  const { currentTheme, isDark } = useTheme();
  const params = useParams();
  const router = useRouter();
  const postId = params?.id as string;

  const [post, setPost] = useState<IPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!postId) return;

    const fetchPost = async () => {
      setLoading(true);
      setError(null);

      // Check if it's a mock fallback ID
      if (MOCK_POSTS[postId]) {
        setPost(MOCK_POSTS[postId] as IPost);
        setLoading(false);
        return;
      }

      try {
        const res = await api.get(`/posts/detail/${postId}`);
        if (res.data?.data?.post) {
          setPost(res.data.data.post);
        } else {
          setError('Room listing not found or may have been removed.');
        }
      } catch (err: any) {
        console.error('Failed to load post:', err);
        // If mock post fallback exists
        if (MOCK_POSTS[postId]) {
          setPost(MOCK_POSTS[postId] as IPost);
        } else {
          setError(
            err.response?.data?.message ||
              'Unable to load this rental listing. Please check your internet connection.'
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const formatBDT = (val?: number) => {
    if (val === undefined || val === null) return 'Tk 0';
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getWhatsAppLink = () => {
    if (!post) return '#';
    const phoneClean = post.whatsappNumber || post.contactNumber || '';
    const digits = phoneClean.replace(/[^0-9]/g, '');
    const internationalPhone = digits.startsWith('880') ? digits : `880${digits.replace(/^0/, '')}`;
    const text = encodeURIComponent(
      `Salam! I am an SEU student interested in your room listing (${post.roomType} in ${post.area}) listed on TO-LET SEU. Is it still available?`
    );
    return `https://wa.me/${internationalPhone}?text=${text}`;
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-20 px-4">
        <LoadingState
          message="Loading Room Details..."
          subMessage="Fetching photos, contact details, and facilities for this Southeast University listing."
        />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-20 px-4">
        <ErrorState
          title="Listing Not Found"
          message={error || 'This bachelor room listing could not be found or has expired.'}
          onRetry={() => window.location.reload()}
          retryLabel="Try Again"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-[#080f0c] text-slate-900 dark:text-white pb-20">
      {/* Top Breadcrumb & Action Bar */}
      <div className="border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-16 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition px-2.5 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 truncate max-w-xs sm:max-w-md">
            <Link href="/" className="hover:text-slate-700 dark:hover:text-slate-300">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            <Link href="/posts" className="hover:text-slate-700 dark:hover:text-slate-300">
              Rent Posts
            </Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">
              {post.area || 'Room Details'}
            </span>
          </div>

          {/* Quick Share Button */}
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition border border-slate-200 dark:border-slate-700 shadow-2xs"
            title="Copy share link"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Share</span>
              </>
            )}
          </button>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6 sm:space-y-8">
        {/* Top Header Card */}
        <div className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-8 shadow-xs space-y-5">
          {/* Header Row: Room & Seats + Gender Badge + Rent */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                {/* Gender Badge */}
                <span
                  className={`px-3 py-1 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wide border shadow-2xs ${
                    post.gender === 'Female'
                      ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                      : 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                  }`}
                >
                  {post.gender} Only
                </span>

                {/* Seat Count & Room Type Highlight Badge */}
                <span
                  style={{
                    backgroundColor: isDark ? `${currentTheme.hex}22` : currentTheme.lightHex,
                    color: isDark ? currentTheme.hex : currentTheme.textHex,
                    borderColor: isDark ? `${currentTheme.hex}40` : `${currentTheme.hex}35`,
                  }}
                  className="px-3 py-1 rounded-xl text-xs sm:text-sm font-bold border flex items-center gap-1.5 shadow-2xs"
                >
                  <Users className="w-3.5 h-3.5 shrink-0" style={{ color: currentTheme.hex }} />
                  <span>
                    {post.seatCount} {post.seatCount > 1 ? 'Seats' : 'Seat'} • {post.roomType}
                  </span>
                </span>

                {/* Availability Month */}
                <span
                  style={{
                    backgroundColor: isDark ? `${currentTheme.hex}22` : currentTheme.lightHex,
                    color: isDark ? currentTheme.hex : currentTheme.textHex,
                    borderColor: isDark ? `${currentTheme.hex}40` : `${currentTheme.hex}35`,
                  }}
                  className="px-3 py-1 rounded-xl text-xs sm:text-sm font-bold border flex items-center gap-1.5 shadow-2xs"
                >
                  <Calendar className="w-3.5 h-3.5 shrink-0" style={{ color: currentTheme.hex }} />
                  <span>From {post.availableFromMonth || 'Immediate'}</span>
                </span>
              </div>

              {/* Location & Walking distance */}
              <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 flex-wrap pt-1">
                <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                  <MapPin className="w-4 h-4" style={{ color: currentTheme.hex }} />
                  <span>{post.area}</span>
                </div>
                {post.distanceFromCampus && (
                  <>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
                      <Footprints className="w-4 h-4 text-slate-400" />
                      <span>{post.distanceFromCampus}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Price Box */}
            <div className="flex flex-col sm:items-end shrink-0 bg-slate-50 dark:bg-slate-800/60 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">Monthly Rent</span>
              <div
                style={{ color: currentTheme.hex }}
                className="text-2xl sm:text-4xl font-black leading-none my-1"
              >
                {formatBDT(post.rentAmount)}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                {post.rentType === 'negotiable' && (
                  <span className="badge badge-warning badge-xs font-bold text-[10px]">
                    Negotiable
                  </span>
                )}
                <span>{post.serviceChargeIncluded ? 'Bills Included' : '+ Utility / Bills'}</span>
              </div>
            </div>
          </div>

          {/* Detailed Address Note */}
          {post.addressDetails && (
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
              <Building className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                <strong className="font-semibold text-slate-800 dark:text-slate-200">Address:</strong>{' '}
                {post.addressDetails}
              </span>
            </div>
          )}
        </div>

        {/* Media Viewer Section (Photos Slider, Touch Swipe, Lightbox & Walkthrough Video) */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Room Photos & Walkthrough
          </h2>
          <MediaViewer
            images={post.media?.images}
            video={post.media?.video}
            title={post.title || `${post.seatCount} Seat ${post.roomType}`}
          />
        </div>

        {/* Facilities & Amenities Badges */}
        <div className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-4">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5" style={{ color: currentTheme.hex }} />
            <span>Room & Mess Facilities</span>
          </h2>
          <AmenitiesBadges amenities={post.amenities} />
        </div>

        {/* Detailed Room Description */}
        {post.description && (
          <div className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              About this Room & Living Culture
            </h2>
            <p className="text-slate-700 dark:text-slate-200 text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {post.description}
            </p>
          </div>
        )}

        {/* Author / Room Poster Card & Direct Contact Bar */}
        <div className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  post.author?.avatarUrl ||
                  'https://res.cloudinary.com/demo/image/upload/v1689246197/cld-sample.jpg'
                }
                alt={post.author?.name || 'SEU Student'}
                style={{ borderColor: currentTheme.hex }}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 shrink-0 shadow-sm"
              />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                    {post.author?.name || 'SEU Student Resident'}
                  </span>
                  {post.author?.isVerifiedStudent && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      <span>Verified SEU Student</span>
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  <span style={{ color: currentTheme.hex }} className="font-semibold flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>{post.department || post.author?.department || 'SEU'} Department</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Call & WhatsApp Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Direct Call Button */}
            <a
              href={`tel:${post.contactNumber}`}
              style={{ backgroundColor: currentTheme.hex }}
              className="w-full py-3.5 px-6 rounded-2xl text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-lg hover:opacity-90 active:scale-[0.99] transition cursor-pointer"
            >
              <Phone className="w-5 h-5" />
              <span>Call: {post.contactNumber}</span>
            </a>

            {/* Direct WhatsApp Button with Highlighted Logo */}
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-6 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 border border-slate-200 dark:border-slate-700 shadow-sm active:scale-[0.99] transition cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 text-[#25D366] shrink-0" />
              <span>Chat on WhatsApp ({post.whatsappNumber || post.contactNumber})</span>
            </a>
          </div>
        </div>

        {/* Bottom Explore All Button */}
        <div className="text-center pt-6">
          <Link
            href="/posts"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Explore All Available Bachelor Rooms & Seats</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
