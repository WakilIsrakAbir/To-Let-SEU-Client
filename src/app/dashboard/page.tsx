'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { IPost } from '@/types/post';
import {
  Building2,
  Eye,
  CheckCircle,
  Clock,
  PlusCircle,
  FileText,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  User,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const { currentTheme, isDark } = useTheme();
  const router = useRouter();

  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      api
        .get('/posts/my-posts')
        .then((res) => {
          if (res.data?.data?.posts) {
            setPosts(res.data.data.posts);
          }
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [user, authLoading, router]);

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg" style={{ color: currentTheme.hex }}></span>
      </div>
    );
  }

  const activePosts = posts.filter((p) => p.status === 'active');
  const bookedPosts = posts.filter((p) => p.status === 'booked');
  const totalViews = posts.reduce((acc, curr) => acc + (curr.viewsCount || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Student Profile Card Header */}
      <div
        style={{
          background: `linear-gradient(135deg, ${currentTheme.hoverHex}, #0f172a)`,
        }}
        className="text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
      >
        <div className="flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={user?.avatarUrl || 'https://res.cloudinary.com/demo/image/upload/v1689246197/cld-sample.jpg'}
            alt={user?.name}
            style={{ borderColor: currentTheme.hex }}
            className="w-16 h-16 rounded-full object-cover border-2"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black">{user?.name}</h1>
              {user?.isVerifiedStudent && (
                <span
                  style={{
                    backgroundColor: `${currentTheme.hex}25`,
                    color: '#ffffff',
                    borderColor: `${currentTheme.hex}40`,
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified SEU Student</span>
                </span>
              )}
            </div>
            <p className="text-white/80 text-sm mt-0.5">
              {user?.department} Department {user?.studentId ? `• ID: ${user?.studentId}` : ''}
            </p>
            <p className="text-xs text-white/60 mt-1">{user?.email} • {user?.phone}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/posts/create"
            style={{ backgroundColor: currentTheme.hex }}
            className="btn text-white border-none rounded-xl font-bold flex items-center gap-2 hover:opacity-90 shadow-md"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post New Ad</span>
          </Link>
          <Link
            href="/create-banner"
            className="btn bg-amber-500 hover:bg-amber-600 text-slate-950 border-none rounded-xl font-bold flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Auto Poster</span>
          </Link>
        </div>
      </div>

      {/* Overview Metric Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-10">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div
            style={{
              backgroundColor: isDark ? `${currentTheme.hex}25` : currentTheme.lightHex,
              color: currentTheme.hex,
            }}
            className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
          >
            <Building2 className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Total My Posts
          </span>
          <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">{posts.length}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 flex items-center justify-center mb-3">
            <Clock className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Active Listings
          </span>
          <p className="text-3xl font-black text-blue-700 dark:text-blue-400 mt-1">{activePosts.length}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 flex items-center justify-center mb-3">
            <CheckCircle className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Booked / Rented
          </span>
          <p className="text-3xl font-black text-amber-700 dark:text-amber-400 mt-1">{bookedPosts.length}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 flex items-center justify-center mb-3">
            <Eye className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Total Views
          </span>
          <p className="text-3xl font-black text-purple-700 dark:text-purple-400 mt-1">{totalViews}</p>
        </div>
      </div>

      {/* Quick Navigation to My Posts Management */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Manage Your Rent Posts</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
            Edit pricing, toggle booked status, delete ads, or generate promotional flyers
          </p>
        </div>
        <Link
          href="/dashboard/my-posts"
          style={{ backgroundColor: currentTheme.hex }}
          className="btn text-white rounded-xl font-bold flex items-center gap-2 border-none hover:opacity-90 transition"
        >
          <span>View All My Posts</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
