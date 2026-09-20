'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { IPost } from '@/types/post';
import { useTheme } from '@/context/ThemeContext';
import { ArrowRight } from 'lucide-react';
import HomePostCard from './HomePostCard';

// Global in-memory cache for instant subsequent mounts (SWR pattern, 6 posts)
let cachedRecentPosts: IPost[] | null = null;

// Clean Skeleton matching exact HomePostCard structure
function HomePostCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 space-y-3 animate-pulse select-none">
      {/* Header skeleton */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0" />
        <div className="flex-1 space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <div className="w-24 h-4 rounded-md bg-slate-200 dark:bg-slate-800" />
            <div className="w-16 h-4 rounded-md bg-slate-200 dark:bg-slate-800" />
          </div>
          <div className="w-32 h-3 rounded-md bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>

      {/* Specs row 1: Room & Available Date */}
      <div className="flex items-center gap-1.5">
        <div className="flex-1 h-7 rounded-xl bg-slate-200 dark:bg-slate-800" />
        <div className="w-24 h-7 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0" />
      </div>

      {/* Specs row 2: Location & See More */}
      <div className="flex items-center justify-between gap-2">
        <div className="w-20 h-6 rounded-xl bg-slate-200 dark:bg-slate-800" />
        <div className="w-20 h-6 rounded-xl bg-slate-200 dark:bg-slate-800" />
      </div>

      {/* Photo carousel skeleton */}
      <div className="aspect-[16/10] rounded-2xl bg-slate-200 dark:bg-slate-800 w-full" />

      {/* Rent bar skeleton */}
      <div className="h-10 rounded-xl bg-slate-200 dark:bg-slate-800 w-full" />

      {/* Action buttons skeleton: 3 in 1 line */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5">
        <div className="flex-1 h-9 rounded-xl bg-slate-200 dark:bg-slate-800" />
        <div className="w-20 h-9 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0" />
        <div className="w-16 h-9 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0" />
      </div>
    </div>
  );
}

export default function RecentPostsSection() {
  const { currentTheme } = useTheme();
  const [posts, setPosts] = useState<IPost[]>(() => cachedRecentPosts || []);
  const [loading, setLoading] = useState<boolean>(() => !cachedRecentPosts);

  useEffect(() => {
    let isMounted = true;
    const loadRecentPosts = async () => {
      if (!cachedRecentPosts) {
        setLoading(true);
      }
      try {
        const res = await api.get('/posts', {
          params: { limit: 6, sort: 'newest' },
        });
        const serverPosts: IPost[] = res.data?.data?.posts || [];
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

      {/* Loading Skeleton Grid (6 cards) or Empty State or Real Posts 3-Column Grid */}
      {loading && posts.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <HomePostCardSkeleton key={idx} />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/40 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 p-8">
          <p className="text-slate-500 dark:text-slate-400 font-medium">No recent room posts available right now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.slice(0, 6).map((post) => (
            <HomePostCard key={post._id} post={post} />
          ))}
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
