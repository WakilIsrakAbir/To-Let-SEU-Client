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
  Eye,
  AlertTriangle,
  Search,
  Sliders,
  Sparkles,
  Lock,
} from 'lucide-react';

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

  // Delete User
  const handleConfirmDeleteUser = async () => {
    if (!deletingUser) return;
    setActionInProgress(true);
    try {
      await api.delete(`/admin/users/${deletingUser._id}`);
      setDeletingUser(null);
      fetchAdminData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete user.');
    } finally {
      setActionInProgress(false);
    }
  };

  // Delete Post
  const handleConfirmDeletePost = async () => {
    if (!deletingPost) return;
    setActionInProgress(true);
    try {
      await api.delete(`/admin/posts/${deletingPost._id}`);
      setDeletingPost(null);
      fetchAdminData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete post.');
    } finally {
      setActionInProgress(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner text-emerald-700 loading-lg"></span>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white border border-slate-200 rounded-3xl shadow-xl text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center mx-auto">
          <Lock className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">Access Restricted</h2>
        <p className="text-slate-600 text-sm">
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
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold mb-2 border border-indigo-500/30">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>SEU Basa Master Moderation Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Administrator Control Suite
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage users, promote moderators, verify SEU student IDs, and moderate listings
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-2xl border border-white/10 text-xs font-bold">
          <span>Logged in as:</span>
          <span className="text-emerald-400">{user?.name} (Admin)</span>
        </div>
      </div>

      {/* Metrics Row */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Students
            </span>
            <p className="text-2xl font-black text-slate-900 mt-1">{stats.totalUsers}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Posts
            </span>
            <p className="text-2xl font-black text-slate-900 mt-1">{stats.totalPosts}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Active Rooms
            </span>
            <p className="text-2xl font-black text-emerald-700 mt-1">{stats.activePosts}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Rented / Booked
            </span>
            <p className="text-2xl font-black text-amber-600 mt-1">{stats.bookedPosts}</p>
          </div>
        </div>
      )}

      {/* Navigation Tabs: Users Management vs Post Moderation */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-5 py-2.5 rounded-xl text-sm font-extrabold transition flex items-center gap-2 ${
            activeTab === 'users'
              ? 'bg-emerald-700 text-white shadow'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Registered Users ({usersList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('posts')}
          className={`px-5 py-2.5 rounded-xl text-sm font-extrabold transition flex items-center gap-2 ${
            activeTab === 'posts'
              ? 'bg-emerald-700 text-white shadow'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>All Rental Posts ({postsList.length})</span>
        </button>
      </div>

      {/* TAB 1: USERS MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name, email, department, ID..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="input input-sm input-bordered pl-9 w-full rounded-xl bg-slate-50 text-xs"
              />
            </div>

            <span className="text-xs font-bold text-slate-500">
              Showing {filteredUsers.length} of {usersList.length} users
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="table table-sm w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 text-[11px] uppercase tracking-wider">
                  <th>User</th>
                  <th>Department / ID</th>
                  <th>Contact Phone</th>
                  <th>Role</th>
                  <th>Verification</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/80">
                    <td>
                      <div className="flex items-center gap-2.5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={u.avatarUrl || 'https://res.cloudinary.com/demo/image/upload/v1689246197/cld-sample.jpg'}
                          alt={u.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{u.name}</p>
                          <p className="text-[11px] text-slate-400">{u.email}</p>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="font-bold text-emerald-800">{u.department}</span>
                      {u.studentId && (
                        <p className="text-[10px] text-slate-500">ID: {u.studentId}</p>
                      )}
                    </td>

                    <td className="font-mono text-slate-700">{u.phone}</td>

                    <td>
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u, e.target.value)}
                        className={`select select-xs rounded-lg font-bold border ${
                          u.role === 'admin'
                            ? 'bg-purple-50 text-purple-700 border-purple-300'
                            : u.role === 'moderator'
                            ? 'bg-blue-50 text-blue-700 border-blue-300'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
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
                        className={`btn btn-xs rounded-lg font-bold flex items-center gap-1 ${
                          u.isVerifiedStudent
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                            : 'btn-ghost text-slate-400'
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
                        className="btn btn-xs btn-ghost text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-30"
                        title="Delete User"
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
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search listings by title, area, phone..."
                value={postSearch}
                onChange={(e) => setPostSearch(e.target.value)}
                className="input input-sm input-bordered pl-9 w-full rounded-xl bg-slate-50 text-xs"
              />
            </div>

            <span className="text-xs font-bold text-slate-500">
              Showing {filteredPosts.length} of {postsList.length} posts
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="table table-sm w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 text-[11px] uppercase tracking-wider">
                  <th>Listing Title</th>
                  <th>Area</th>
                  <th>Rent (BDT)</th>
                  <th>Status</th>
                  <th>Photos / Video</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
                {filteredPosts.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/80">
                    <td className="max-w-xs truncate font-bold text-slate-900">
                      <Link
                        href={`/posts#${p._id}`}
                        target="_blank"
                        className="hover:text-emerald-700 hover:underline"
                      >
                        {p.title}
                      </Link>
                    </td>

                    <td className="font-semibold text-emerald-800">{p.area}</td>

                    <td className="font-black">BDT {p.rentAmount.toLocaleString()}</td>

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

                    <td className="text-slate-500 font-medium">
                      {p.media?.images?.length || 0} pics {p.media?.video ? '+ 1 video' : ''}
                    </td>

                    <td className="text-right">
                      <button
                        onClick={() => setDeletingPost(p)}
                        className="btn btn-xs bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 rounded-lg font-bold flex items-center gap-1 ml-auto"
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

      {/* Delete User Confirmation Modal */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">
              Delete User &quot;{deletingUser.name}&quot;?
            </h3>
            <p className="text-slate-500 text-xs">
              This will permanently delete this student account and remove all rental posts they have published.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                className="btn btn-sm btn-ghost flex-1 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionInProgress}
                onClick={handleConfirmDeleteUser}
                className="btn btn-sm bg-red-600 hover:bg-red-700 text-white flex-1 rounded-xl font-bold"
              >
                {actionInProgress ? 'Deleting...' : 'Delete User'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Post Confirmation Modal */}
      {deletingPost && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Admin Delete Post?</h3>
            <p className="text-slate-500 text-xs line-clamp-2">
              &quot;{deletingPost.title}&quot; will be permanently deleted and all media purged from Cloudinary.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingPost(null)}
                className="btn btn-sm btn-ghost flex-1 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionInProgress}
                onClick={handleConfirmDeletePost}
                className="btn btn-sm bg-red-600 hover:bg-red-700 text-white flex-1 rounded-xl font-bold"
              >
                {actionInProgress ? 'Deleting...' : 'Delete Post'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
