'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { IPost } from '@/types/post';
import { useTheme } from '@/context/ThemeContext';
import { MapPin, ArrowRight, ArrowUpRight } from 'lucide-react';

// Clean fallback listings so the 3 teaser cards always render
const FALLBACK_POSTS: Partial<IPost>[] = [
  {
    _id: 'mock-1',
    title: '1 Male Bachelor Seat Near SEU Campus',
    area: 'Tejgaon',
    distanceFromCampus: '4 mins walk',
    rentAmount: 4800,
    gender: 'Male',
    roomType: 'Shared Seat',
    media: {
      images: [{ url: '/hero-room.jpg', publicId: 'demo-1' }],
    },
  },
  {
    _id: 'mock-2',
    title: 'Single Room for Female Student with Balcony',
    area: 'Mohakhali',
    distanceFromCampus: '8 mins walk',
    rentAmount: 6500,
    gender: 'Female',
    roomType: 'Single Room',
    media: {
      images: [
        {
          url: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80',
          publicId: 'demo-2',
        },
      ],
    },
  },
  {
    _id: 'mock-3',
    title: 'Master Bed Seat with Attached Washroom & WiFi',
    area: 'Nakhalpara',
    distanceFromCampus: '10 mins walk',
    rentAmount: 4200,
    gender: 'Male',
    roomType: 'Master Bed',
    media: {
      images: [
        {
          url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
          publicId: 'demo-3',
        },
      ],
    },
  },
];

export default function RecentPostsSection() {
  const { currentTheme, isDark } = useTheme();
  const [posts, setPosts] = useState<Partial<IPost>[]>([]);

  useEffect(() => {
    const loadRecentPosts = async () => {
      try {
        const res = await api.get('/posts', {
          params: { limit: 3, sort: 'newest' },
        });
        const serverPosts = res.data?.data?.posts || [];
        if (serverPosts.length >= 3) {
          setPosts(serverPosts.slice(0, 3));
        } else if (serverPosts.length > 0) {
          const combined = [...serverPosts, ...FALLBACK_POSTS.slice(serverPosts.length)];
          setPosts(combined.slice(0, 3));
        } else {
          setPosts(FALLBACK_POSTS);
        }
      } catch {
        setPosts(FALLBACK_POSTS);
      }
    };

    loadRecentPosts();
  }, []);

  const displayList = posts.length >= 3 ? posts.slice(0, 3) : FALLBACK_POSTS;

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

      {/* 3 Clean Teaser Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {displayList.map((post, idx) => {
          const coverImage = post.media?.images?.[0]?.url || '/hero-room.jpg';

          return (
            <Link
              key={post._id || idx}
              href={`/posts#${post._id}`}
              className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 flex flex-col transform hover:-translate-y-1"
            >
              {/* Image Area with Single Clean Tag */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coverImage}
                  alt={post.title || 'SEU Room'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />

                {/* Minimal Single Tag (Gender & Room Type) */}
                <div className="absolute top-3 left-3">
                  <span
                    className="px-3 py-1 rounded-xl text-xs font-bold text-white shadow-md backdrop-blur-md"
                    style={{ backgroundColor: post.gender === 'Female' ? 'rgba(219, 39, 119, 0.9)' : `${currentTheme.hex}e6` }}
                  >
                    {post.gender === 'Female' ? 'Female Only' : 'Male Only'} • {post.roomType || 'Seat'}
                  </span>
                </div>

                {/* Hover Quick Cue - Centered */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30">
                  <span
                    className="bg-white text-slate-900 text-sm font-bold px-5 py-2 rounded-xl shadow-lg flex items-center gap-1.5"
                  >
                    <span>See Details</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>
              </div>

              {/* Clean Content Area */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  {/* Location & Walking Distance */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 mb-1.5">
                    <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: currentTheme.hex }} />
                    <span className="font-semibold text-slate-600 dark:text-slate-300">
                      {post.area || 'Tejgaon'}
                    </span>
                    <span>•</span>
                    <span>{post.distanceFromCampus || 'Near Campus'}</span>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white line-clamp-1">
                    {post.title}
                  </h3>
                </div>

                {/* Price & Action Row */}
                <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span
                      className="text-xl font-black text-slate-900 dark:text-white"
                      style={{ color: currentTheme.hex }}
                    >
                      Tk {post.rentAmount?.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">/month</span>
                  </div>

                  <div className="text-xs font-medium text-slate-400 dark:text-slate-500">
                    From {post.availableFromMonth || 'Now'}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

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
