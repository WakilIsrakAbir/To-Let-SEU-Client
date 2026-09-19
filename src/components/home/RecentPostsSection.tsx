'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { IPost } from '@/types/post';
import { useTheme } from '@/context/ThemeContext';
import {
  MapPin,
  ArrowRight,
  ArrowUpRight,
  Users,
  Wifi,
  Bath,
  SunMedium,
  ChefHat,
  Refrigerator,
  Zap,
  ArrowUpDown,
  Droplets,
  Sparkles,
  Phone,
  MessageCircle,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { getDefaultRoomImage } from '@/lib/constants';

const getActiveAmenities = (amenities?: any) => {
  if (!amenities) return [];
  const list = [];
  if (amenities.wifi) list.push({ key: 'wifi', label: 'WiFi', icon: Wifi });
  if (amenities.attachedBath) list.push({ key: 'bath', label: 'Attached Bath', icon: Bath });
  if (amenities.balcony) list.push({ key: 'balcony', label: 'Balcony', icon: SunMedium });
  if (amenities.khalaMaid) list.push({ key: 'cook', label: 'Khala / Cook', icon: ChefHat });
  if (amenities.fridge) list.push({ key: 'fridge', label: 'Fridge', icon: Refrigerator });
  if (amenities.generatorIPS) list.push({ key: 'ips', label: 'Generator / IPS', icon: Zap });
  if (amenities.lift) list.push({ key: 'lift', label: 'Lift', icon: ArrowUpDown });
  if (amenities.filterWater) list.push({ key: 'water', label: 'Filter Water', icon: Droplets });
  return list;
};

const getWhatsAppLink = (post: Partial<IPost>) => {
  const rawNumber = post.whatsappNumber || post.contactNumber || '';
  const digits = rawNumber.replace(/[^0-9]/g, '');
  if (!digits) return 'https://wa.me/';
  const internationalPhone = digits.startsWith('880') ? digits : `880${digits.replace(/^0/, '')}`;
  const text = encodeURIComponent(
    `Salam! I am an SEU student interested in your room listing in ${post.area || 'SEU Area'}. Is it available?`
  );
  return `https://wa.me/${internationalPhone}?text=${text}`;
};


// Interactive Sliding Image Component for Cards with multiple photos
function PostCardImageSlider({
  post,
  fallbackImage,
  roomAndSeatsLabel,
}: {
  post: Partial<IPost>;
  fallbackImage: string;
  roomAndSeatsLabel: string;
}) {
  const images = (post.media?.images || []).filter(
    (img) => img && img.url && !img.url.startsWith('blob:')
  );
  const hasMultiple = images.length > 1;
  const [currentIdx, setCurrentIdx] = useState(0);

  const prevSlide = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  const nextSlide = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIdx((prev) => (prev + 1) % images.length);
  };

  const displayUrl = hasMultiple ? images[currentIdx]?.url : (images[0]?.url || fallbackImage);
  const postTargetUrl = post._id ? `/posts#${post._id}` : '/posts';

  return (
    <Link
      href={postTargetUrl}
      className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800 block group/slider"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={currentIdx}
        src={displayUrl}
        alt={`${roomAndSeatsLabel} in ${post.area || 'SEU Area'}`}
        className="w-full h-full object-cover group-hover/slider:scale-105 transition-transform duration-500 ease-out select-none"
      />

      {/* Left Side: Seat Count FIRST, then Room Type */}
      <div className="absolute top-3 left-3 z-10">
        <span className="px-2.5 sm:px-3 py-1 rounded-xl text-xs font-bold text-white shadow-md backdrop-blur-md bg-slate-900/80 border border-white/20 flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-slate-300 shrink-0" />
          <span>{roomAndSeatsLabel}</span>
        </span>
      </div>

      {/* Right Side: Male / Female Only in Blue */}
      <div className="absolute top-3 right-3 z-10">
        <span className="px-2.5 sm:px-3 py-1 rounded-xl text-xs font-bold text-white shadow-md backdrop-blur-md bg-blue-600 border border-blue-400/30">
          {post.gender === 'Female' ? 'Female Only' : 'Male Only'}
        </span>
      </div>

      {/* Slide Navigation Arrows (only visible when post has multiple pictures) */}
      {hasMultiple && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-all backdrop-blur-xs shadow-lg hover:scale-110 active:scale-95"
            title="Previous photo"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-all backdrop-blur-xs shadow-lg hover:scale-110 active:scale-95"
            title="Next photo"
            aria-label="Next photo"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Dot Indicators */}
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 bg-black/50 backdrop-blur-xs px-2.5 py-1 rounded-full border border-white/10 shadow-sm">
            {images.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentIdx === i ? 'w-4 bg-white shadow-xs' : 'w-1.5 bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}

      {/* Hover Quick Cue - Centered (visible when not hovering arrows) */}
      {!hasMultiple && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300 bg-black/30">
          <span className="bg-white text-slate-900 text-sm font-bold px-5 py-2 rounded-xl shadow-lg flex items-center gap-1.5">
            <span>View Post</span>
            <ArrowUpRight className="w-4 h-4" />
          </span>
        </div>
      )}
    </Link>
  );
}

// Global in-memory cache for instant subsequent mounts (SWR pattern)
let cachedRecentPosts: Partial<IPost>[] | null = null;

// Skeleton Card matching exact dimensions of the real post card
function PostCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-xs flex flex-col animate-pulse select-none">
      {/* Aspect Ratio 16/10 Image Placeholder with Badges */}
      <div className="relative aspect-[16/10] bg-slate-200/80 dark:bg-slate-800/80 w-full overflow-hidden">
        {/* Shimmering Badge Skeletons */}
        <div className="absolute top-3 left-3 w-28 sm:w-32 h-6 rounded-xl bg-slate-300 dark:bg-slate-700/80" />
        <div className="absolute top-3 right-3 w-20 sm:w-24 h-6 rounded-xl bg-slate-300 dark:bg-slate-700/80" />
      </div>

      {/* Content Area Skeleton */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Location & Date row placeholder */}
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <div className="w-28 h-6 rounded-lg bg-slate-200 dark:bg-slate-700/70 border border-slate-200/50 dark:border-slate-700/50" />
            <div className="w-24 h-6 rounded-lg bg-slate-200 dark:bg-slate-700/70 border border-slate-200/50 dark:border-slate-700/50" />
          </div>

          {/* Amenities placeholders */}
          <div className="my-2 min-h-[30px] flex items-center gap-1.5 flex-wrap">
            <div className="w-16 h-6 rounded-lg bg-slate-200 dark:bg-slate-700/70" />
            <div className="w-20 h-6 rounded-lg bg-slate-200 dark:bg-slate-700/70" />
            <div className="w-16 h-6 rounded-lg bg-slate-200 dark:bg-slate-700/70" />
          </div>

          {/* Call / WhatsApp Buttons row placeholder */}
          <div className="my-2.5 pt-2.5 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2">
            <div className="h-8 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50" />
            <div className="h-8 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50" />
          </div>
        </div>

        {/* Price & View Details button placeholder */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="w-24 h-6 rounded-md bg-slate-200 dark:bg-slate-700" />
          <div className="w-24 h-7 rounded-xl bg-slate-200/90 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60" />
        </div>
      </div>
    </div>
  );
}

export default function RecentPostsSection() {
  const router = useRouter();
  const { currentTheme, isDark } = useTheme();
  const [posts, setPosts] = useState<Partial<IPost>[]>(() => cachedRecentPosts || []);
  const [loading, setLoading] = useState<boolean>(() => !cachedRecentPosts);

  useEffect(() => {
    let isMounted = true;
    const loadRecentPosts = async () => {
      // Only set loading true if we have no cached data to avoid flashing
      if (!cachedRecentPosts) {
        setLoading(true);
      }
      try {
        const res = await api.get('/posts', {
          params: { limit: 18, sort: 'newest' },
        });
        const serverPosts = res.data?.data?.posts || [];
        if (isMounted) {
          cachedRecentPosts = serverPosts;
          setPosts(serverPosts);
        }
      } catch (err) {
        console.error('Failed to load recent posts:', err);
        if (isMounted && !cachedRecentPosts) {
          setPosts([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadRecentPosts();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="relative py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl min-[1680px]:max-w-[1450px] mx-auto w-full border-t border-slate-200/80 dark:border-slate-800/80">
      {/* Clean Header */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Recent Available Rooms near <span style={{ color: currentTheme.hex }}>SEU Campus</span>
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Handpicked latest bachelor seats and flats posted by Southeast University students.
        </p>
      </div>

      {/* Loading Skeleton Grid (6 cards) or Empty State or Real Posts Grid */}
      {loading && posts.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <PostCardSkeleton key={idx} />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/40 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 p-8">
          <p className="text-slate-500 dark:text-slate-400 font-medium">No recent room posts available right now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post, idx) => {
            const coverImage = post.media?.images?.[0]?.url || getDefaultRoomImage(post._id || idx);
            const activeFacilities = getActiveAmenities(post.amenities);
            const seatsCount = post.seatCount || 1;
            const seatsText = `${seatsCount} ${seatsCount > 1 ? 'Seats' : 'Seat'}`;
            const roomTypeText = post.roomType || 'Room';
            // Order: Seat count FIRST, then room type (e.g. "1 Seat • 2 Person Room")
            const roomAndSeatsLabel = `${seatsText} • ${roomTypeText}`;
            const postUrl = post._id ? `/posts#${post._id}` : '/posts';

          return (
            <div
              key={post._id || idx}
              onClick={() => router.push(postUrl)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  router.push(postUrl);
                }
              }}
              className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 flex flex-col transform hover:-translate-y-1 cursor-pointer select-none"
            >
              {/* Image Area with Sliding capability if multiple images, plus Badges */}
              <PostCardImageSlider
                post={post}
                fallbackImage={coverImage}
                roomAndSeatsLabel={roomAndSeatsLabel}
              />

              {/* Clean Content Area */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  {/* Location (with border) & Available From Date Row */}
                  <Link
                    href={postUrl}
                    onClick={(e) => e.stopPropagation()}
                    className="block group/loc mb-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      {/* Location Badge with border */}
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-50 dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 shadow-2xs group-hover/loc:border-slate-300 dark:group-hover/loc:border-slate-600 transition-colors min-w-0 max-w-[54%]">
                        <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: currentTheme.hex }} />
                        <span className="truncate">{post.area || 'Tejgaon (Near SEU)'}</span>
                      </div>

                      {/* Availability From Date Badge (Right of location) */}
                      <div
                        style={{
                          backgroundColor: isDark ? `${currentTheme.hex}18` : currentTheme.lightHex,
                          color: isDark ? currentTheme.hex : currentTheme.textHex,
                          borderColor: isDark ? `${currentTheme.hex}45` : currentTheme.borderHex,
                        }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-extrabold border shadow-2xs transition-colors shrink-0 whitespace-nowrap"
                      >
                        <Calendar className="w-3.5 h-3.5 shrink-0" style={{ color: currentTheme.hex }} />
                        <span className="truncate">From {post.availableFromMonth || 'Immediate'}</span>
                      </div>
                    </div>
                  </Link>

                  {/* Facilities / Amenities in place of Title */}
                  <Link
                    href={postUrl}
                    onClick={(e) => e.stopPropagation()}
                    className="block"
                  >
                    <div className="my-2 min-h-[30px] flex flex-wrap items-center gap-1.5">
                      {activeFacilities.length > 0 ? (
                        <>
                          {activeFacilities.slice(0, 2).map((item) => {
                            const Icon = item.icon;
                            return (
                              <span
                                key={item.key}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs shrink-0"
                              >
                                <Icon className="w-3 h-3 text-slate-400 dark:text-slate-400 shrink-0" />
                                <span>{item.label}</span>
                              </span>
                            );
                          })}
                          {/* 3rd facility shown if there are <= 3 total facilities */}
                          {activeFacilities.length === 3 && (
                            <span
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs shrink-0"
                            >
                              {(() => {
                                const Icon = activeFacilities[2].icon;
                                return <Icon className="w-3 h-3 text-slate-400 dark:text-slate-400 shrink-0" />;
                              })()}
                              <span>{activeFacilities[2].label}</span>
                            </span>
                          )}
                          {/* If more than 3 total, show +X more cleanly right next to the 2 items on 1 row */}
                          {activeFacilities.length > 3 && (
                            <span
                              style={{
                                color: isDark ? currentTheme.hex : currentTheme.textHex,
                                borderColor: isDark ? `${currentTheme.hex}40` : currentTheme.borderHex,
                                backgroundColor: isDark ? `${currentTheme.hex}15` : currentTheme.lightHex,
                              }}
                              className="text-[11px] font-bold px-2 py-1 rounded-lg border shadow-2xs shrink-0 whitespace-nowrap"
                            >
                              +{activeFacilities.length - 2} more
                            </span>
                          )}
                        </>
                      ) : (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium py-0.5">
                          <Sparkles className="w-3.5 h-3.5 shrink-0" style={{ color: currentTheme.hex }} />
                          <span>Student Friendly Perks & Utilities</span>
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Direct Contact Row: Balanced Equal-Width Phone & WhatsApp Buttons */}
                  <div className="my-2.5 pt-2.5 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2">
                    {/* Call Button */}
                    <a
                      href={`tel:${post.contactNumber || ''}`}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition border border-slate-200/80 dark:border-slate-700/80 shadow-2xs cursor-pointer"
                      title={`Call ${post.contactNumber || ''}`}
                    >
                      <Phone className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                      <span className="truncate">{post.contactNumber || 'Call'}</span>
                    </a>

                    {/* WhatsApp Button - Neutral button with highlighted WhatsApp icon */}
                    <a
                      href={getWhatsAppLink(post)}
                      onClick={(e) => e.stopPropagation()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition border border-slate-200/80 dark:border-slate-700/80 shadow-2xs cursor-pointer"
                      title="Chat on WhatsApp"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-[#25D366] shrink-0" />
                      <span className="truncate">{post.whatsappNumber || post.contactNumber || 'WhatsApp'}</span>
                    </a>
                  </div>
                </div>

                {/* Price & View Details Action Row */}
                <Link
                  href={postUrl}
                  onClick={(e) => e.stopPropagation()}
                  className="block pt-3 border-t border-slate-100 dark:border-slate-800"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-baseline gap-1 shrink-0 whitespace-nowrap">
                      <span
                        className="text-lg sm:text-xl font-black text-slate-900 dark:text-white"
                        style={{ color: currentTheme.hex }}
                      >
                        Tk {post.rentAmount?.toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-400 font-medium whitespace-nowrap">/month</span>
                    </div>

                    {/* View Details Button */}
                    <div
                      style={{
                        backgroundColor: currentTheme.hex,
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white shadow-xs group-hover:shadow-md transition-all group-hover:translate-x-0.5 shrink-0 whitespace-nowrap"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    )}

      {/* Main Explore CTA */}
      <div className="mt-10 text-center">
        <Link
          href="/posts"
          style={{ backgroundColor: currentTheme.hex }}
          className="btn btn-md sm:btn-lg text-white rounded-2xl font-bold shadow-md hover:opacity-90 border-none px-8 transition inline-flex items-center gap-2"
        >
          <span>Explore All Rent Posts</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
