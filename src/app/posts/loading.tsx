import React from 'react';
import PostCardSkeleton from '@/components/posts/PostCardSkeleton';

export default function PostsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 animate-pulse select-none">
      {/* Top Banner / Feed Title Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div className="space-y-2">
          <div className="w-64 sm:w-80 h-8 rounded-xl bg-slate-200 dark:bg-slate-800" />
          <div className="w-48 sm:w-60 h-4 rounded-md bg-slate-200 dark:bg-slate-800" />
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-24 h-9 rounded-xl bg-slate-200 dark:bg-slate-800" />
          <div className="w-36 h-9 rounded-xl bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>

      {/* Main Grid: Left Filter Sidebar Skeleton + Right Social Feed Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Desktop Left Sidebar (4 columns) */}
        <div className="hidden md:block md:col-span-4 lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="w-28 h-5 rounded-md bg-slate-200 dark:bg-slate-800" />
              <div className="w-16 h-4 rounded-md bg-slate-200 dark:bg-slate-800" />
            </div>
            {/* Area Filter */}
            <div className="space-y-2.5">
              <div className="w-24 h-4 rounded-md bg-slate-200 dark:bg-slate-800" />
              <div className="w-full h-10 rounded-xl bg-slate-200 dark:bg-slate-800" />
            </div>
            {/* Gender Filter */}
            <div className="space-y-2.5">
              <div className="w-20 h-4 rounded-md bg-slate-200 dark:bg-slate-800" />
              <div className="grid grid-cols-2 gap-2">
                <div className="h-10 rounded-xl bg-slate-200 dark:bg-slate-800" />
                <div className="h-10 rounded-xl bg-slate-200 dark:bg-slate-800" />
              </div>
            </div>
            {/* Rent Range */}
            <div className="space-y-2.5">
              <div className="w-32 h-4 rounded-md bg-slate-200 dark:bg-slate-800" />
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800" />
              <div className="flex justify-between">
                <div className="w-12 h-3 rounded bg-slate-200 dark:bg-slate-800" />
                <div className="w-16 h-3 rounded bg-slate-200 dark:bg-slate-800" />
              </div>
            </div>
            {/* Room Type */}
            <div className="space-y-2.5">
              <div className="w-28 h-4 rounded-md bg-slate-200 dark:bg-slate-800" />
              <div className="grid grid-cols-2 gap-2">
                <div className="h-10 rounded-xl bg-slate-200 dark:bg-slate-800" />
                <div className="h-10 rounded-xl bg-slate-200 dark:bg-slate-800" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Feed (8 columns) */}
        <div className="md:col-span-8 lg:col-span-8 space-y-6">
          {/* Universal Instant Search Bar Skeleton */}
          <div className="h-12 w-full rounded-2xl bg-slate-200 dark:bg-slate-800" />

          {/* Feed Post Skeletons */}
          <div className="space-y-8">
            <PostCardSkeleton />
            <PostCardSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}
