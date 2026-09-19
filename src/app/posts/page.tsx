'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { IPost } from '@/types/post';
import PostCardLarge from '@/components/posts/PostCardLarge';
import FilterSidebar, { FilterState } from '@/components/filters/FilterSidebar';
import {
  SlidersHorizontal,
  ArrowUpDown,
  Search,
  Inbox,
  Loader2,
  ChevronLeft,
  ChevronRight,
  X,
  Sliders,
  RotateCcw,
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

function PostsFeedInner() {
  const { currentTheme, isDark } = useTheme();
  const searchParams = useSearchParams();
  const router = useRouter();

  const urlArea = searchParams.get('area') || '';
  const urlGender = searchParams.get('gender') || '';
  const urlSearch = searchParams.get('search') || '';

  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    ...initialFilters,
    area: urlArea,
    gender: urlGender,
  });
  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [activeSearch, setActiveSearch] = useState(urlSearch);
  const [sort, setSort] = useState<'newest' | 'rent_asc' | 'rent_desc' | 'views'>('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync initial URL search params on mount or param change
  useEffect(() => {
    if (urlArea || urlGender) {
      setFilters((prev) => ({
        ...prev,
        area: urlArea || prev.area,
        gender: urlGender || prev.gender,
      }));
    }
    if (urlSearch) {
      setSearchQuery(urlSearch);
      setActiveSearch(urlSearch);
    }
  }, [urlArea, urlGender, urlSearch]);

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
      if (activeSearch.trim()) params.search = activeSearch.trim();

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
  }, [filters, sort, page, activeSearch]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Smooth scroll & pulse highlight when arriving with #postId or ?highlight=postId
  useEffect(() => {
    if (loading || posts.length === 0) return;

    const targetId =
      searchParams.get('highlight') ||
      (typeof window !== 'undefined' ? window.location.hash.replace('#', '') : '');

    if (!targetId) return;

    const timer = setTimeout(() => {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        el.style.transition = 'all 0.4s ease';
        el.style.boxShadow = `0 0 0 4px ${currentTheme.hex}80, 0 25px 30px -5px rgba(0, 0, 0, 0.15)`;
        setTimeout(() => {
          if (el) el.style.boxShadow = '';
        }, 3500);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [loading, posts, searchParams, currentTheme.hex]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
    setSearchQuery('');
    setActiveSearch('');
    setPage(1);
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setActiveSearch(searchQuery.trim());
    setPage(1);
  };

  const handleSearchClear = () => {
    setSearchQuery('');
    setActiveSearch('');
    setPage(1);
  };

  const hasActiveFilters =
    Boolean(activeSearch) ||
    Boolean(filters.area) ||
    Boolean(filters.gender) ||
    filters.isNegotiable ||
    Boolean(filters.month) ||
    Boolean(filters.roomType) ||
    filters.amenities.length > 0 ||
    filters.maxRent < 20000;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Top Banner / Feed Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Available Bachelor Rooms & Seats
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
            Tejgaon Campus, Mohakhali, Banani, Nakhalpara & neighboring areas
          </p>
        </div>

        {/* Sort & Mobile Filter Button */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setMobileFilterOpen(true)}
            style={{
              backgroundColor: hasActiveFilters ? (isDark ? `${currentTheme.hex}25` : currentTheme.lightHex) : undefined,
              borderColor: hasActiveFilters ? currentTheme.hex : undefined,
              color: hasActiveFilters ? (isDark ? '#ffffff' : currentTheme.textHex) : undefined,
            }}
            className="btn btn-sm md:hidden rounded-xl flex items-center gap-1.5 border border-slate-300 dark:border-slate-700 font-bold"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span
                style={{ backgroundColor: currentTheme.hex }}
                className="w-2 h-2 rounded-full"
              />
            )}
          </button>

          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-xs">
            <ArrowUpDown className="w-4 h-4" style={{ color: currentTheme.hex }} />
            <span className="hidden sm:inline">Sort:</span>
            <select
              value={sort}
              onChange={(e: any) => setSort(e.target.value)}
              className="bg-transparent font-bold text-slate-900 dark:text-white focus:outline-none cursor-pointer"
            >
              <option value="newest" className="dark:bg-slate-900">Latest Posted</option>
              <option value="rent_asc" className="dark:bg-slate-900">Rent: Low to High</option>
              <option value="rent_desc" className="dark:bg-slate-900">Rent: High to Low</option>
              <option value="views" className="dark:bg-slate-900">Most Viewed</option>
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
        <div className="md:col-span-8 lg:col-span-8 space-y-6">
          {/* Universal Instant Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="flex items-center gap-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-1.5 shadow-xs focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <div className="pl-3 text-slate-400">
                <Search className="w-4 h-4" style={{ color: currentTheme.hex }} />
              </div>
              <input
                type="text"
                placeholder="Search by title, location, landmark (e.g. Nakhalpara, Master Bed, 3500)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none px-1"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleSearchClear}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="submit"
                style={{ backgroundColor: currentTheme.hex }}
                className="px-4 py-2 rounded-xl text-white font-bold text-xs shadow-xs hover:opacity-95 transition shrink-0"
              >
                Search
              </button>
            </div>
          </form>

          {/* Active Filter Chips / Badges */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="text-slate-400 font-medium">Active:</span>

              {activeSearch && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold border border-slate-200 dark:border-slate-700">
                  <span>&ldquo;{activeSearch}&rdquo;</span>
                  <button onClick={handleSearchClear} className="hover:text-red-500">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {filters.area && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold border border-slate-200 dark:border-slate-700">
                  <span>Area: {filters.area}</span>
                  <button onClick={() => handleFilterChange({ ...filters, area: '' })} className="hover:text-red-500">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {filters.gender && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold border border-slate-200 dark:border-slate-700">
                  <span>{filters.gender} Only</span>
                  <button onClick={() => handleFilterChange({ ...filters, gender: '' })} className="hover:text-red-500">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {filters.roomType && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold border border-slate-200 dark:border-slate-700">
                  <span>{filters.roomType}</span>
                  <button onClick={() => handleFilterChange({ ...filters, roomType: '' })} className="hover:text-red-500">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {filters.isNegotiable && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold border border-slate-200 dark:border-slate-700">
                  <span>Negotiable</span>
                  <button onClick={() => handleFilterChange({ ...filters, isNegotiable: false })} className="hover:text-red-500">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              <button
                onClick={handleResetFilters}
                className="text-xs font-bold text-red-500 hover:text-red-600 underline ml-auto"
              >
                Reset All
              </button>
            </div>
          )}

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
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-4 max-w-lg mx-auto shadow-xs">
              <div
                style={{
                  backgroundColor: isDark ? `${currentTheme.hex}25` : currentTheme.lightHex,
                  color: currentTheme.hex,
                }}
                className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto text-2xl"
              >
                <Inbox className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  No rooms match your filter criteria
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                  Try widening your rent price range, changing location or clearing specific filters.
                </p>
              </div>
              <button
                onClick={handleResetFilters}
                style={{ backgroundColor: currentTheme.hex }}
                className="btn text-white rounded-xl font-bold px-6 border-none hover:opacity-90"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            /* Posts Feed List */
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
                className="btn btn-sm btn-outline rounded-xl border-slate-300 dark:border-slate-700 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                <span>Prev</span>
              </button>

              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg">
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="btn btn-sm btn-outline rounded-xl border-slate-300 dark:border-slate-700 disabled:opacity-40"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Professional Mobile Slide-Over Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-[99999] flex justify-end md:hidden">
          {/* Backdrop */}
          <div
            onClick={() => setMobileFilterOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          />

          {/* Drawer Container */}
          <div className="relative w-full max-w-sm sm:max-w-md bg-white dark:bg-slate-900 h-full flex flex-col shadow-2xl z-10 animate-in slide-in-from-right duration-200 border-l border-slate-200 dark:border-slate-800">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800 shrink-0 bg-white dark:bg-slate-900">
              <div className="flex items-center gap-2">
                <div
                  style={{
                    backgroundColor: isDark ? `${currentTheme.hex}25` : currentTheme.lightHex,
                    color: currentTheme.hex,
                  }}
                  className="w-8 h-8 rounded-xl flex items-center justify-center font-bold"
                >
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base sm:text-lg">Filter Rooms</h3>
                  <span style={{ color: currentTheme.hex }} className="text-xs sm:text-sm font-bold">
                    {totalPosts} {totalPosts === 1 ? 'room' : 'rooms'} found
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleResetFilters}
                  className="btn btn-ghost btn-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white flex items-center gap-1 font-semibold rounded-lg"
                  title="Reset all filters"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="btn btn-sm btn-ghost btn-circle text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
                  aria-label="Close filters"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Filter Body - Clean, no duplicate card or borders */}
            <div className="flex-1 overflow-y-auto px-5 py-5 custom-scrollbar">
              <FilterSidebar
                filters={filters}
                onChange={handleFilterChange}
                onReset={handleResetFilters}
                totalResults={totalPosts}
                isMobileDrawer={true}
              />
            </div>

            {/* Fixed Sticky Bottom Action Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 shrink-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
              <button
                onClick={() => setMobileFilterOpen(false)}
                style={{ backgroundColor: currentTheme.hex }}
                className="btn w-full text-white rounded-xl font-bold border-none hover:opacity-90 shadow-md py-3 text-sm flex items-center justify-center gap-2"
              >
                <span>Apply Filters ({totalPosts} {totalPosts === 1 ? 'Room' : 'Rooms'})</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PostsFeedPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      }
    >
      <PostsFeedInner />
    </Suspense>
  );
}
