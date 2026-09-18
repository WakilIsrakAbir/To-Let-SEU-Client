'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { IPost } from '@/types/post';
import PostCardLarge from '@/components/posts/PostCardLarge';
import FilterSidebar, { FilterState } from '@/components/filters/FilterSidebar';
import {
  SlidersHorizontal,
  ArrowUpDown,
  Search,
  Sparkles,
  Inbox,
  Loader2,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

const initialFilters: FilterState = {
  area: '',
  gender: '',
  minRent: 0,
  maxRent: 20000,
  isNegotiable: false,
  month: '',
  roomType: '',
  amenities: [],
};

export default function PostsFeedPage() {
  const { currentTheme, isDark } = useTheme();
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [sort, setSort] = useState<'newest' | 'rent_asc' | 'rent_desc' | 'views'>('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {
        page,
        limit: 10,
        sort,
      };

      if (filters.area) params.area = filters.area;
      if (filters.gender) params.gender = filters.gender;
      if (filters.maxRent && filters.maxRent < 20000) params.maxRent = filters.maxRent;
      if (filters.isNegotiable) params.isNegotiable = true;
      if (filters.month) params.month = filters.month;
      if (filters.roomType) params.roomType = filters.roomType;
      if (filters.amenities.length > 0) params.amenities = filters.amenities.join(',');

      const res = await api.get('/posts', { params });
      if (res.data?.data) {
        setPosts(res.data.data.posts);
        setTotalPages(res.data.data.pagination.totalPages || 1);
        setTotalPosts(res.data.data.pagination.totalPosts || 0);
      }
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setLoading(false);
    }
  }, [filters, sort, page]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Top Banner / Feed Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div
            style={{
              backgroundColor: isDark ? `${currentTheme.hex}20` : currentTheme.lightHex,
              color: isDark ? currentTheme.hex : currentTheme.textHex,
              borderColor: isDark ? `${currentTheme.hex}40` : currentTheme.borderHex,
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-2 border transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" style={{ color: currentTheme.hex }} />
            <span>Southeast University Bachelor Feed</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Available Bachelor Rooms & Seats
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
            Tejgaon Campus, Mohakhali, Banani, Nakhalpara & neighboring areas
          </p>
        </div>

        {/* Sort & Mobile Filter Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="btn btn-outline btn-sm md:hidden rounded-xl flex items-center gap-1.5 border-slate-300 dark:border-slate-700"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>

          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-xs">
            <ArrowUpDown className="w-4 h-4" style={{ color: currentTheme.hex }} />
            <span className="hidden sm:inline">Sort by:</span>
            <select
              value={sort}
              onChange={(e: any) => setSort(e.target.value)}
              className="bg-transparent font-bold text-slate-900 dark:text-white focus:outline-none cursor-pointer"
            >
              <option value="newest">Latest Posted</option>
              <option value="rent_asc">Rent: Low to High</option>
              <option value="rent_desc">Rent: High to Low</option>
              <option value="views">Most Viewed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Filter Sidebar + Right Social Feed */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Desktop Left Sidebar (4 columns) */}
        <div className="hidden md:block md:col-span-4 lg:col-span-4">
          <FilterSidebar
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleResetFilters}
            totalResults={totalPosts}
          />
        </div>

        {/* Right Feed (8 columns) */}
        <div className="md:col-span-8 lg:col-span-8 space-y-8">
          {loading ? (
            /* Loading State */
            <div className="space-y-6">
              {[1, 2].map((n) => (
                <div
                  key={n}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 animate-pulse"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                    <div className="space-y-2">
                      <div className="w-40 h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
                      <div className="w-24 h-3 bg-slate-200 dark:bg-slate-800 rounded"></div>
                    </div>
                  </div>
                  <div className="w-full h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            /* Empty State */
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-4">
              <div
                style={{
                  backgroundColor: isDark ? `${currentTheme.hex}20` : currentTheme.lightHex,
                  color: currentTheme.hex,
                }}
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto"
              >
                <Inbox className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                No rooms match your filter criteria
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mx-auto">
                Try widening your rent price range or clearing specific amenity filters to view more listings.
              </p>
              <button
                onClick={handleResetFilters}
                style={{ backgroundColor: currentTheme.hex }}
                className="btn btn-sm text-white rounded-xl font-bold border-none hover:opacity-90"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            /* List of Large Social Posts */
            <div className="space-y-8">
              {posts.map((post) => (
                <PostCardLarge key={post._id} post={post} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-6">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="btn btn-sm btn-outline rounded-xl border-slate-300 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                <span>Prev</span>
              </button>

              <span className="text-xs font-bold text-slate-700 px-3 py-1 bg-white border border-slate-200 rounded-lg">
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="btn btn-sm btn-outline rounded-xl border-slate-300 disabled:opacity-40"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Modal / Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex justify-end md:hidden p-0">
          <div className="w-full max-w-sm bg-white h-full overflow-y-auto p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-lg">Filter Rooms</h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="btn btn-sm btn-ghost btn-circle"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <FilterSidebar
              filters={filters}
              onChange={handleFilterChange}
              onReset={handleResetFilters}
              totalResults={totalPosts}
            />

            <button
              onClick={() => setMobileFilterOpen(false)}
              style={{ backgroundColor: currentTheme.hex }}
              className="btn w-full text-white rounded-xl font-bold mt-4 border-none hover:opacity-90"
            >
              Apply Filters ({totalPosts} results)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
