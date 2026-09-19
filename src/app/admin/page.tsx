'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { IUser } from '@/types/user';
import { IPost } from '@/types/post';
import {
  ShieldAlert,
  Users,
  Building2,
  Trash2,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Search,
  Lock,
  Clock,
  Database,
  RotateCw,
  Info,
  CheckCircle2,
  Calendar,
  X,
  Flame,
  Check,
} from 'lucide-react';
import LoadingState from '@/components/common/LoadingState';
import DailyPostsChart from '@/components/admin/DailyPostsChart';

export default function AdminPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'users' | 'posts'>('users');
  const [stats, setStats] = useState<any>(null);
  const [usersList, setUsersList] = useState<IUser[]>([]);
  const [postsList, setPostsList] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [userSearch, setUserSearch] = useState('');
  const [postSearch, setPostSearch] = useState('');

  // Delete Action states
  const [deletingUser, setDeletingUser] = useState<IUser | null>(null);
  const [deletingPost, setDeletingPost] = useState<IPost | null>(null);
  const [actionInProgress, setActionInProgress] = useState(false);

  // Auto-purge states
  const [isAutoPurgeModalOpen, setIsAutoPurgeModalOpen] = useState(false);
  const [selectedPurgeDays, setSelectedPurgeDays] = useState<number>(60);
  const [previewMatchingCount, setPreviewMatchingCount] = useState<number | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [cleanupLoading, setCleanupLoading] = useState(false);
  const [cleanupSuccessNotice, setCleanupSuccessNotice] = useState<string | null>(null);

  const fetchAdminData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, postsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/posts?limit=50'),
      ]);

      setStats(statsRes.data?.data);
      setUsersList(usersRes.data?.data?.users || []);
      setPostsList(postsRes.data?.data?.posts || []);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push('/login');
      return;
    }

    if (user && isAdmin) {
      fetchAdminData();
    }
  }, [user, isAdmin, authLoading, router, fetchAdminData]);

  // Fetch live matching preview whenever modal opens or days selection changes
  useEffect(() => {
    if (!isAutoPurgeModalOpen) return;
    let isCancelled = false;
    setLoadingPreview(true);

    api
      .get(`/admin/cleanup-preview?days=${selectedPurgeDays}`)
      .then((res) => {
        if (!isCancelled) {
          setPreviewMatchingCount(res.data?.data?.matchCount ?? 0);
        }
      })
      .catch((err) => {
        console.warn('Failed to fetch preview count:', err?.message);
        if (!isCancelled) setPreviewMatchingCount(0);
      })
      .finally(() => {
        if (!isCancelled) setLoadingPreview(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [isAutoPurgeModalOpen, selectedPurgeDays]);

  // Handle Role Promotion / Demotion
  const handleRoleChange = async (targetUser: IUser, newRole: string) => {
    try {
      await api.put(`/admin/users/${targetUser._id}/role`, { role: newRole });
      fetchAdminData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update user role.');
    }
  };

  // Toggle Verification
  const handleToggleVerification = async (targetUser: IUser) => {
    try {
      await api.put(`/admin/users/${targetUser._id}/verify`);
      fetchAdminData();
    } catch (err: any) {
      alert('Error updating student verification.');
    }
  };

  // Delete User (including Cloudinary media and all posts)
  const handleConfirmDeleteUser = async () => {
    if (!deletingUser) return;
    setActionInProgress(true);
    try {
      await api.delete(`/admin/users/${deletingUser._id}`);
      setDeletingUser(null);
      await fetchAdminData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete user.');
    } finally {
      setActionInProgress(false);
    }
  };

  // Delete Post (including Cloudinary media)
  const handleConfirmDeletePost = async () => {
    if (!deletingPost) return;
    setActionInProgress(true);
    try {
      await api.delete(`/admin/posts/${deletingPost._id}`);
      setDeletingPost(null);
      await fetchAdminData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete post.');
    } finally {
      setActionInProgress(false);
    }
  };

  // Confirm and Execute Auto Purge
  const handleExecutePurge = async () => {
    setCleanupLoading(true);
    setCleanupSuccessNotice(null);
    try {
      const res = await api.post('/admin/cleanup-expired-posts', { days: selectedPurgeDays });
      const result = res.data?.data;
      const count = result?.deletedPostsCount ?? 0;
      const imgs = result?.deletedImagesCount ?? 0;
      const vids = result?.deletedVideosCount ?? 0;

      setCleanupSuccessNotice(
        count > 0
          ? `Successfully purged ${count} expired listings and permanently removed ${imgs} images and ${vids} videos from Cloudinary.`
          : `Auto-purge check completed. No listings older than ${selectedPurgeDays} days were found in the database.`
      );
      setIsAutoPurgeModalOpen(false);
      await fetchAdminData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to execute auto-purge routine.');
    } finally {
      setCleanupLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <LoadingState
        message="Loading Administrative Controls..."
        subMessage="Fetching moderation logs, reported posts, and student records..."
        fullscreen={true}
      />
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400 flex items-center justify-center mx-auto">
          <Lock className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Access Restricted</h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          You do not have administrator permissions to view this moderation portal.
        </p>
        <Link href="/posts" className="btn bg-emerald-700 text-white rounded-xl font-bold">
          Return to Feed
        </Link>
      </div>
    );
  }

  // Filtered lists
  const filteredUsers = usersList.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.department?.toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.studentId && u.studentId.includes(userSearch))
  );

  const filteredPosts = postsList.filter(
    (p) =>
      p.title.toLowerCase().includes(postSearch.toLowerCase()) ||
      p.area.toLowerCase().includes(postSearch.toLowerCase()) ||
      p.contactNumber.includes(postSearch)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold mb-2.5 border border-indigo-500/30">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Master Moderation Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Administrator Control Suite
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            User governance, daily activity trends, and automated 60-day Cloudinary media cleanup
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-2xl border border-white/10 text-xs font-bold">
            <span className="text-slate-300">Admin:</span>
            <span className="text-emerald-400">{user?.name}</span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Users */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Total Users
              </span>
              <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                {stats.totalUsers ?? 0}
              </p>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-1">
                <Database className="w-3 h-3" /> Permanently preserved
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>

          {/* Card 2: Total Posts */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Total Listings
              </span>
              <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                {stats.totalPosts ?? 0}
              </p>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mt-1 block">
                Active & Booked combined
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
          </div>

          {/* Card 3: Active Listings */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Active Listings
              </span>
              <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                {stats.activePosts ?? 0}
              </p>
              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold mt-1 block">
                {stats.bookedPosts ?? 0} Rented / Booked
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>

          {/* Card 4: 60-Day Auto Purge System */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-5 rounded-2xl border border-indigo-900/50 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  Auto-Purge (60 Days)
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-sm font-bold text-slate-200 mt-2">
                Posts older than 60 days auto-deleted
              </p>
              <p className="text-[10.5px] text-slate-400 mt-0.5">
                Cloudinary images & videos purged
              </p>
            </div>

            <button
              onClick={() => setIsAutoPurgeModalOpen(true)}
              className="mt-3 w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Configure & Run Auto-Purge</span>
            </button>
          </div>
        </div>
      )}

      {/* Auto-Purge Success Toast Notice */}
      {cleanupSuccessNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 flex items-center justify-between gap-3 text-xs sm:text-sm animate-in fade-in duration-300">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span className="font-semibold">{cleanupSuccessNotice}</span>
          </div>
          <button
            onClick={() => setCleanupSuccessNotice(null)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs font-bold px-2 py-1 rounded-lg cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Daily Posts Interactive Chart */}
      <DailyPostsChart data={stats?.dailyPostStats || []} />

      {/* Permanent User Protection Guarantee */}
      <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 flex items-start gap-3 text-xs text-blue-900 dark:text-blue-200">
        <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="font-bold">Database Safety Policy:</strong> Student account records (name, email, phone, verification badge) are permanently preserved and never deleted by auto-cleanup. Only rental listings older than 60 days (2 months) and their associated Cloudinary media files are purged.
        </div>
      </div>

      {/* Navigation Tabs: Users Management vs Post Moderation */}
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-5 py-2.5 rounded-xl text-sm font-extrabold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'users'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Registered Users ({usersList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('posts')}
          className={`px-5 py-2.5 rounded-xl text-sm font-extrabold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'posts'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>All Rental Listings ({postsList.length})</span>
        </button>
      </div>

      {/* TAB 1: USERS MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name, email, department, ID..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="input input-sm input-bordered pl-9 w-full rounded-xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Showing {filteredUsers.length} of {usersList.length} users
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="table table-sm w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
                  <th>User</th>
                  <th>Department / Student ID</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Student Verification</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-800 dark:text-slate-200">
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                    <td>
                      <div className="flex items-center gap-2.5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={u.avatarUrl || 'https://res.cloudinary.com/demo/image/upload/v1689246197/cld-sample.jpg'}
                          alt={u.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{u.name}</p>
                          <p className="text-[11px] text-slate-400">{u.email}</p>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="font-bold text-emerald-800 dark:text-emerald-400">{u.department}</span>
                      {u.studentId && (
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">ID: {u.studentId}</p>
                      )}
                    </td>

                    <td className="font-mono text-slate-700 dark:text-slate-300">{u.phone}</td>

                    <td>
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u, e.target.value)}
                        className={`select select-xs rounded-lg font-bold border ${
                          u.role === 'admin'
                            ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-800'
                            : u.role === 'moderator'
                            ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <option value="user">User</option>
                        <option value="moderator">Moderator</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>

                    <td>
                      <button
                        onClick={() => handleToggleVerification(u)}
                        className={`btn btn-xs rounded-lg font-bold flex items-center gap-1 cursor-pointer ${
                          u.isVerifiedStudent
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100'
                            : 'btn-ghost text-slate-400 hover:text-slate-600'
                        }`}
                        title="Click to toggle SEU student verification badge"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{u.isVerifiedStudent ? 'Verified' : 'Unverified'}</span>
                      </button>
                    </td>

                    <td className="text-right">
                      <button
                        onClick={() => setDeletingUser(u)}
                        disabled={u._id === user?._id}
                        className="btn btn-xs btn-ghost text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg disabled:opacity-30 cursor-pointer"
                        title="Delete User and all their listings"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: POSTS MODERATION */}
      {activeTab === 'posts' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search listings by title, area, phone number..."
                value={postSearch}
                onChange={(e) => setPostSearch(e.target.value)}
                className="input input-sm input-bordered pl-9 w-full rounded-xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Showing {filteredPosts.length} of {postsList.length} listings
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="table table-sm w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
                  <th>Listing Title</th>
                  <th>Area</th>
                  <th>Rent (BDT)</th>
                  <th>Status</th>
                  <th>Media Assets</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-800 dark:text-slate-200">
                {filteredPosts.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                    <td className="max-w-xs truncate font-bold text-slate-900 dark:text-white">
                      <Link
                        href={`/posts#${p._id}`}
                        target="_blank"
                        className="hover:text-emerald-700 dark:hover:text-emerald-400 hover:underline"
                      >
                        {p.title}
                      </Link>
                    </td>

                    <td className="font-semibold text-emerald-800 dark:text-emerald-400">{p.area}</td>

                    <td className="font-black text-slate-950 dark:text-white">
                      BDT {p.rentAmount.toLocaleString()}
                    </td>

                    <td>
                      <span
                        className={`badge badge-xs font-bold ${
                          p.status === 'active'
                            ? 'badge-success text-white'
                            : 'badge-warning text-slate-900'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>

                    <td className="text-slate-500 dark:text-slate-400 font-medium">
                      {p.media?.images?.length || 0} pics {p.media?.video ? '+ 1 video' : ''}
                    </td>

                    <td className="text-right">
                      <button
                        onClick={() => setDeletingPost(p)}
                        className="btn btn-xs bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 hover:bg-red-100 border border-red-200 dark:border-red-900/50 rounded-lg font-bold flex items-center gap-1 ml-auto cursor-pointer"
                        title="Delete listing and purge Cloudinary media"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* AUTO-PURGE CUSTOM MODAL */}
      {isAutoPurgeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 max-w-md w-full space-y-5 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-lg leading-tight">
                    Auto-Purge Configuration
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Purge expired posts & destroy Cloudinary assets
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAutoPurgeModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Threshold Selector Tabs */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                <span>Select Age Threshold:</span>
              </label>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { days: 60, title: '60 Days (2 Months)', badge: 'Default Policy' },
                  { days: 30, title: '30 Days (1 Month)' },
                  { days: 7, title: '7 Days (1 Week)' },
                  { days: 1, title: '1 Day (24+ Hours)' },
                  { days: 0, title: 'All Posts (Instant Test)', colSpan: true },
                ].map((item) => (
                  <button
                    key={item.days}
                    type="button"
                    onClick={() => setSelectedPurgeDays(item.days)}
                    className={`p-2.5 rounded-xl text-xs font-bold transition-all border text-left cursor-pointer ${
                      item.colSpan ? 'col-span-2' : ''
                    } ${
                      selectedPurgeDays === item.days
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{item.title}</span>
                      {selectedPurgeDays === item.days && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    {item.badge && (
                      <span className="text-[9.5px] uppercase tracking-wider opacity-85 block mt-0.5 font-semibold">
                        ★ {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Real-time Match Preview Banner */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-600 dark:text-slate-300">
                  Matching Database Listings:
                </span>
                {loadingPreview ? (
                  <span className="text-xs text-indigo-500 animate-pulse font-bold flex items-center gap-1">
                    <RotateCw className="w-3 h-3 animate-spin" /> Counting...
                  </span>
                ) : (
                  <span
                    className={`font-black text-sm px-2 py-0.5 rounded-lg ${
                      (previewMatchingCount ?? 0) > 0
                        ? 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400'
                        : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                    }`}
                  >
                    {previewMatchingCount ?? 0} {previewMatchingCount === 1 ? 'Post' : 'Posts'}
                  </span>
                )}
              </div>

              {/* Contextual Notice */}
              {previewMatchingCount === 0 && !loadingPreview && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed pt-1">
                  💡 No listings older than {selectedPurgeDays} days found in the database. (Posts created today are less than 24 hours old. To test deleting posts created today, select <strong>&quot;All Posts (Instant Test)&quot;</strong> above).
                </p>
              )}

              {previewMatchingCount !== null && previewMatchingCount > 0 && !loadingPreview && (
                <p className="text-[11px] text-red-600 dark:text-red-400 font-medium leading-relaxed pt-1 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 flex-shrink-0" />
                  These {previewMatchingCount} listings and all attached Cloudinary images/videos will be permanently destroyed.
                </p>
              )}
            </div>

            {/* Permanent User Protection Guarantee */}
            <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 flex-shrink-0 text-emerald-600 mt-0.5" />
              <span className="leading-tight">
                <strong>User Protection Guarantee:</strong> Student user accounts are permanently preserved and will NEVER be removed by auto-cleanup.
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setIsAutoPurgeModalOpen(false)}
                className="btn btn-sm btn-ghost flex-1 rounded-xl text-slate-700 dark:text-slate-300 font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={cleanupLoading}
                onClick={handleExecutePurge}
                className="btn btn-sm bg-indigo-600 hover:bg-indigo-700 text-white flex-1 rounded-xl font-bold shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {cleanupLoading ? (
                  <>
                    <RotateCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Purging...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Execute Purge</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl text-center border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Delete User &quot;{deletingUser.name}&quot;?
            </h3>
            <div className="text-slate-600 dark:text-slate-400 text-xs space-y-1.5">
              <p>
                This student account will be permanently removed.
              </p>
              <p className="text-red-600 dark:text-red-400 font-bold bg-red-50 dark:bg-red-950/40 p-2 rounded-xl border border-red-200 dark:border-red-900/50">
                ⚠️ All rental listings published by this user and all associated Cloudinary images/videos will be permanently destroyed.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                className="btn btn-sm btn-ghost flex-1 rounded-xl text-slate-700 dark:text-slate-300 font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionInProgress}
                onClick={handleConfirmDeleteUser}
                className="btn btn-sm bg-red-600 hover:bg-red-700 text-white flex-1 rounded-xl font-bold cursor-pointer"
              >
                {actionInProgress ? 'Deleting...' : 'Delete User'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Post Confirmation Modal */}
      {deletingPost && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl text-center border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Delete Rental Listing?
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-xs line-clamp-2">
              &quot;{deletingPost.title}&quot;
            </p>
            <p className="text-red-600 dark:text-red-400 font-bold text-xs bg-red-50 dark:bg-red-950/40 p-2 rounded-xl border border-red-200 dark:border-red-900/50">
              ⚠️ This listing will be removed from the database and all Cloudinary images/videos will be permanently destroyed.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingPost(null)}
                className="btn btn-sm btn-ghost flex-1 rounded-xl text-slate-700 dark:text-slate-300 font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionInProgress}
                onClick={handleConfirmDeletePost}
                className="btn btn-sm bg-red-600 hover:bg-red-700 text-white flex-1 rounded-xl font-bold cursor-pointer"
              >
                {actionInProgress ? 'Deleting...' : 'Delete Listing'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
