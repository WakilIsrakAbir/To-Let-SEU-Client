'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { IPost } from '@/types/post';
import {
  Building2,
  Trash2,
  Edit,
  Sparkles,
  CheckCircle,
  Eye,
  PlusCircle,
  MapPin,
  Calendar,
  AlertTriangle,
  X,
  ArrowRight,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export default function MyPostsPage() {
  const { user, loading: authLoading } = useAuth();
  const { currentTheme, isDark } = useTheme();
  const router = useRouter();

  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [editingPost, setEditingPost] = useState<IPost | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editRent, setEditRent] = useState(0);
  const [editDescription, setEditDescription] = useState('');
  const [editStatus, setEditStatus] = useState<'active' | 'booked' | 'archived'>('active');
  const [savingEdit, setSavingEdit] = useState(false);

  // Delete Modal State
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchMyPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/posts/my-posts');
      if (res.data?.data?.posts) {
        setPosts(res.data.data.posts);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (user) {
      fetchMyPosts();
    }
  }, [user, authLoading, router, fetchMyPosts]);

  // Open Edit Modal
  const handleOpenEdit = (post: IPost) => {
    setEditingPost(post);
    setEditTitle(post.title);
    setEditRent(post.rentAmount);
    setEditDescription(post.description);
    setEditStatus(post.status);
  };

  // Submit Edit
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;

    setSavingEdit(true);
    try {
      await api.put(`/posts/${editingPost._id}`, {
        title: editTitle,
        rentAmount: Number(editRent),
        description: editDescription,
        status: editStatus,
      });
      setEditingPost(null);
      fetchMyPosts();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update post.');
    } finally {
      setSavingEdit(false);
    }
  };

  // Toggle Status directly (Active <-> Booked)
  const handleToggleStatus = async (post: IPost) => {
    const newStatus = post.status === 'active' ? 'booked' : 'active';
    try {
      await api.put(`/posts/${post._id}`, { status: newStatus });
      fetchMyPosts();
    } catch (err: any) {
      alert('Error updating status.');
    }
  };

  // Confirm Delete
  const handleDelete = async () => {
    if (!deletingPostId) return;
    setDeleting(true);
    try {
      await api.delete(`/posts/${deletingPostId}`);
      setDeletingPostId(null);
      fetchMyPosts();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete post.');
    } finally {
      setDeleting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner text-emerald-700 loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            My Bachelor Rent Listings
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Manage your ads, update rent, mark as rented, or export banner flyers
          </p>
        </div>

        <Link
          href="/posts/create"
          style={{ backgroundColor: currentTheme.hex }}
          className="btn text-white rounded-xl font-bold flex items-center gap-2 border-none hover:opacity-90 transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post Another Room</span>
        </Link>
      </div>

      {posts.length === 0 ? (
        /* Empty State */
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-4 max-w-lg mx-auto">
          <div
            style={{
              backgroundColor: isDark ? `${currentTheme.hex}25` : currentTheme.lightHex,
              color: currentTheme.hex,
            }}
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto"
          >
            <Building2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            You haven&apos;t published any rooms yet
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Have an open seat or bachelor room near SEU? Post your first ad now.
          </p>
          <Link
            href="/posts/create"
            style={{ backgroundColor: currentTheme.hex }}
            className="btn text-white rounded-xl font-bold inline-flex items-center gap-2 border-none hover:opacity-90 transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post First Ad</span>
          </Link>
        </div>
      ) : (
        /* Posts Table / Cards */
        <div className="space-y-4">
          {posts.map((post) => {
            const bannerLink = `/create-banner?title=${encodeURIComponent(
              post.title
            )}&rent=${post.rentAmount}&area=${encodeURIComponent(
              post.area
            )}&gender=${post.gender}&month=${encodeURIComponent(
              post.availableFromMonth
            )}&seats=${post.seatCount}&phone=${encodeURIComponent(
              post.contactNumber
            )}`;

            return (
              <div
                key={post._id}
                className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm hover:shadow transition flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                {/* Info */}
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span
                      className={`badge badge-sm font-bold ${
                        post.status === 'active'
                          ? 'badge-success text-white'
                          : 'badge-warning text-slate-900'
                      }`}
                    >
                      {post.status.toUpperCase()}
                    </span>
                    <span className="text-xs font-bold text-slate-400">•</span>
                    <span className="text-xs font-semibold text-slate-500">
                      {post.gender} Only
                    </span>
                    <span className="text-xs font-bold text-slate-400">•</span>
                    <span className="text-xs font-semibold flex items-center gap-1" style={{ color: currentTheme.hex }}>
                      <MapPin className="w-3 h-3" />
                      {post.area}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                    {post.title}
                  </h3>

                  <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400 flex-wrap">
                    <span className="font-extrabold text-sm" style={{ color: currentTheme.hex }}>
                      BDT {post.rentAmount.toLocaleString()} / mo
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {post.availableFromMonth}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                      {post.viewsCount || 0} views
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 self-stretch md:self-center justify-end">
                  {/* Status Toggle */}
                  <button
                    onClick={() => handleToggleStatus(post)}
                    style={{
                      borderColor: post.status === 'active' ? '#f59e0b' : currentTheme.hex,
                      color: post.status === 'active' ? '#b45309' : currentTheme.hex,
                    }}
                    className={`btn btn-sm rounded-xl font-bold border transition ${
                      post.status === 'active'
                        ? 'hover:bg-amber-50'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>
                      {post.status === 'active' ? 'Mark Booked' : 'Mark Active'}
                    </span>
                  </button>

                  {/* Make Banner */}
                  <Link
                    href={bannerLink}
                    className="btn btn-sm bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl flex items-center gap-1.5 shadow-xs"
                    title="Generate Facebook banner"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Make Poster</span>
                  </Link>

                  {/* Edit */}
                  <button
                    onClick={() => handleOpenEdit(post)}
                    className="btn btn-sm btn-ghost text-slate-700 hover:bg-slate-100 rounded-xl"
                    title="Edit post"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => setDeletingPostId(post._id)}
                    className="btn btn-sm btn-ghost text-red-600 hover:bg-red-50 rounded-xl"
                    title="Delete post"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Modal */}
      {editingPost && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-lg">Edit Rent Post</h3>
              <button
                onClick={() => setEditingPost(null)}
                className="btn btn-sm btn-ghost btn-circle"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="label text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="input input-bordered w-full rounded-xl bg-slate-50 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Rent Amount (BDT)
                  </label>
                  <input
                    type="number"
                    required
                    value={editRent}
                    onChange={(e) => setEditRent(Number(e.target.value))}
                    className="input input-bordered w-full rounded-xl bg-slate-50 text-slate-900"
                  />
                </div>

                <div>
                  <label className="label text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e: any) => setEditStatus(e.target.value)}
                    className="select select-bordered w-full rounded-xl bg-slate-50 text-slate-900"
                  >
                    <option value="active">Active</option>
                    <option value="booked">Booked</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="label text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  rows={4}
                  required
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="textarea textarea-bordered w-full rounded-xl bg-slate-50 text-slate-900"
                ></textarea>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingPost(null)}
                  className="btn btn-sm btn-ghost rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  style={{ backgroundColor: currentTheme.hex }}
                  className="btn btn-sm text-white rounded-xl font-bold border-none hover:opacity-90 transition"
                >
                  {savingEdit ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingPostId && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Delete this Post?</h3>
            <p className="text-slate-500 text-xs">
              This action cannot be undone. All linked photos and video walkthrough will be permanently purged from Cloudinary.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingPostId(null)}
                className="btn btn-sm btn-ghost flex-1 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="btn btn-sm bg-red-600 hover:bg-red-700 text-white flex-1 rounded-xl font-bold"
              >
                {deleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
