'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { IPost, IAmenities, IMediaItem } from '@/types/post';
import { DHAKA_AREAS, MONTHS_LIST, ROOM_TYPES, SEU_DEPARTMENTS, parseAreaValue, formatAreaValue } from '@/lib/constants';
import CloudinaryUploader from '@/components/upload/CloudinaryUploader';
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
  Check,
  AlertCircle,
  DollarSign,
  Users,
  User,
  Phone,
  FileText,
  Image as ImageIcon,
  Building,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import LoadingState from '@/components/common/LoadingState';

export default function MyPostsPage() {
  const { user, loading: authLoading } = useAuth();
  const { currentTheme, isDark } = useTheme();
  const router = useRouter();

  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Full Edit Modal State
  const [editingPost, setEditingPost] = useState<IPost | null>(null);
  const [editCustomArea, setEditCustomArea] = useState('');
  const [editForm, setEditForm] = useState({
    title: '',
    department: 'CSE' as string,
    contactNumber: '',
    whatsappNumber: '',
    area: DHAKA_AREAS[0] as string,
    addressDetails: '',
    distanceFromCampus: '',
    rentType: 'fixed' as 'fixed' | 'negotiable',
    rentAmount: 3500,
    serviceChargeIncluded: false,
    gender: 'Male' as 'Male' | 'Female',
    availableFromMonth: MONTHS_LIST[0] as string,
    seatCount: 1,
    roomType: ROOM_TYPES[0] as string,
    description: '',
    status: 'active' as 'active' | 'booked' | 'archived',
  });
  const [editAmenities, setEditAmenities] = useState<IAmenities>({
    khalaMaid: false,
    fridge: false,
    wifi: false,
    attachedBath: false,
    balcony: false,
    generatorIPS: false,
    lift: false,
    filterWater: false,
  });
  const [editImages, setEditImages] = useState<IMediaItem[]>([]);
  const [editVideo, setEditVideo] = useState<IMediaItem | undefined>(undefined);
  const [toastError, setToastError] = useState<string | null>(null);
  const [toastSuccess, setToastSuccess] = useState<string | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);

  // Auto-dismiss toasts
  useEffect(() => {
    if (toastError) {
      const timer = setTimeout(() => setToastError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toastError]);

  useEffect(() => {
    if (toastSuccess) {
      const timer = setTimeout(() => setToastSuccess(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastSuccess]);

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

  // Open Edit Modal with all attributes
  const handleOpenEdit = (post: IPost) => {
    setEditingPost(post);
    setToastError(null);
    const { baseArea, customArea } = parseAreaValue(post.area);
    setEditCustomArea(customArea);
    setEditForm({
      title: post.title || '',
      department: post.department || 'CSE',
      contactNumber: post.contactNumber || '',
      whatsappNumber: post.whatsappNumber || '',
      area: baseArea,
      addressDetails: post.addressDetails || '',
      distanceFromCampus: post.distanceFromCampus || '',
      rentType: post.rentType || 'fixed',
      rentAmount: post.rentAmount || 0,
      serviceChargeIncluded: post.serviceChargeIncluded || false,
      gender: post.gender || 'Male',
      availableFromMonth: post.availableFromMonth || MONTHS_LIST[0],
      seatCount: post.seatCount || 1,
      roomType: post.roomType || 'Shared Seat',
      description: post.description || '',
      status: post.status || 'active',
    });
    setEditAmenities({
      khalaMaid: post.amenities?.khalaMaid || false,
      fridge: post.amenities?.fridge || false,
      wifi: post.amenities?.wifi || false,
      attachedBath: post.amenities?.attachedBath || false,
      balcony: post.amenities?.balcony || false,
      generatorIPS: post.amenities?.generatorIPS || false,
      lift: post.amenities?.lift || false,
      filterWater: post.amenities?.filterWater || false,
    });
    setEditImages(post.media?.images || []);
    setEditVideo(post.media?.video || undefined);
  };

  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setEditForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setEditForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEditAmenityToggle = (key: keyof IAmenities) => {
    setEditAmenities((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Submit Edit with all updated fields
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;
    setToastError(null);

    setSavingEdit(true);
    try {
      const finalArea = formatAreaValue(editForm.area, editCustomArea);
      await api.put(`/posts/${editingPost._id}`, {
        ...editForm,
        area: finalArea,
        title: editForm.title.trim() || editingPost.title || 'Bachelor Seat / Room',
        addressDetails: editForm.addressDetails.trim() || editingPost.addressDetails || 'Near Campus Area',
        description: editForm.description.trim() || '',
        rentAmount: Number(editForm.rentAmount) || 0,
        seatCount: Number(editForm.seatCount) || 1,
        amenities: editAmenities,
        media: {
          images: editImages || [],
          video: editVideo || undefined,
        },
      });
      setEditingPost(null);
      setToastSuccess('Post updated successfully!');
      fetchMyPosts();
    } catch (err: any) {
      setToastError(err.response?.data?.message || 'Failed to update post.');
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
      <LoadingState
        message="Loading Your Rent Listings..."
        subMessage="Fetching your active, booked, and archived posts..."
        fullscreen={true}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Floating Toast Notifications */}
      {toastError && (
        <div className="fixed top-6 right-6 z-[9999] max-w-md w-full animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="bg-red-600 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-3 border border-red-500">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 shrink-0 text-white" />
              <span className="text-xs sm:text-sm font-semibold leading-snug">{toastError}</span>
            </div>
            <button
              type="button"
              onClick={() => setToastError(null)}
              className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-red-700 transition shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {toastSuccess && (
        <div className="fixed top-6 right-6 z-[9999] max-w-md w-full animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="bg-emerald-600 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-3 border border-emerald-500">
            <div className="flex items-center gap-2.5">
              <CheckCircle className="w-5 h-5 shrink-0 text-white" />
              <span className="text-xs sm:text-sm font-semibold leading-snug">{toastSuccess}</span>
            </div>
            <button
              type="button"
              onClick={() => setToastSuccess(null)}
              className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-emerald-700 transition shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      {/* Dashboard Sub Navigation Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-slate-200 dark:border-slate-800 pb-3">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <User className="w-4 h-4" />
          <span>Overview & Profile</span>
        </Link>
        <Link
          href="/dashboard/my-posts"
          style={{
            backgroundColor: isDark ? `${currentTheme.hex}22` : currentTheme.lightHex,
            color: isDark ? '#ffffff' : currentTheme.textHex,
            borderColor: isDark ? `${currentTheme.hex}50` : currentTheme.borderHex,
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border transition shadow-xs"
        >
          <FileText className="w-4 h-4" />
          <span>My Rent Posts</span>
          <span
            style={{ backgroundColor: currentTheme.hex }}
            className="text-[10px] text-white px-2 py-0.5 rounded-full font-bold ml-1"
          >
            {posts.length}
          </span>
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            My Bachelor Rent Listings
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
            Manage your ads, update rent, mark as rented, or export banner flyers
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Link
            href="/dashboard"
            className="btn btn-outline border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl font-bold flex items-center gap-2 text-sm"
          >
            <User className="w-4 h-4" />
            <span>Overview</span>
          </Link>
          <Link
            href="/posts/create"
            style={{ backgroundColor: currentTheme.hex }}
            className="btn text-white rounded-xl font-bold flex items-center gap-2 border-none hover:opacity-90 transition shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post Another Room</span>
          </Link>
        </div>
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

      {/* Comprehensive Full Edit Modal */}
      {editingPost && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
              <div>
                <h3 className="font-black text-slate-900 dark:text-white text-lg sm:text-xl">
                  Edit Bachelor Rent Listing
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Update all details, pricing, amenities, photos, and availability status.
                </p>
              </div>
              <button
                onClick={() => setEditingPost(null)}
                className="btn btn-sm btn-ghost btn-circle text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <form onSubmit={handleSaveEdit} className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
              {/* 1. Basic Details */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5" style={{ color: currentTheme.hex }} />
                  <span>1. Basic Information</span>
                </h4>

                <div>
                  <label className="label text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Listing Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={editForm.title}
                    onChange={handleEditInputChange}
                    className="input input-bordered w-full rounded-xl bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="label text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Department
                    </label>
                    <select
                      name="department"
                      value={editForm.department}
                      onChange={handleEditInputChange}
                      className="select select-bordered w-full rounded-xl bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                    >
                      {SEU_DEPARTMENTS.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="label text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Area
                    </label>
                    <select
                      name="area"
                      value={editForm.area}
                      onChange={handleEditInputChange}
                      className="select select-bordered w-full rounded-xl bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                    >
                      {DHAKA_AREAS.map((a) => (
                        <option key={a} value={a}>
                          {a}
                        </option>
                      ))}
                    </select>

                    {editForm.area === 'Other' && (
                      <div className="mt-2.5 animate-in fade-in slide-in-from-top-1 duration-150">
                        <label className="label text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider py-0.5">
                          Specify Area Name
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Badda, Rampura, Dhanmondi, Uttara"
                          value={editCustomArea}
                          onChange={(e) => setEditCustomArea(e.target.value)}
                          className="input input-bordered input-sm w-full rounded-xl bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-medium"
                        />
                        <span className="text-[10px] text-slate-500 mt-1 block">
                          Will be saved as &ldquo;Other ({editCustomArea.trim() || 'Custom Area'})&rdquo;
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="label text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Distance from SEU Campus
                    </label>
                    <input
                      type="text"
                      name="distanceFromCampus"
                      placeholder="e.g. 5 mins walking distance from SEU campus"
                      value={editForm.distanceFromCampus}
                      onChange={handleEditInputChange}
                      className="input input-bordered w-full rounded-xl bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="label text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Full Address Details
                    </label>
                    <input
                      type="text"
                      name="addressDetails"
                      value={editForm.addressDetails}
                      onChange={handleEditInputChange}
                      className="input input-bordered w-full rounded-xl bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Rent, Pricing & Status */}
              <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5" style={{ color: currentTheme.hex }} />
                  <span>2. Rent, Pricing & Status</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="label text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Rent Amount (BDT)
                    </label>
                    <input
                      type="number"
                      name="rentAmount"
                      min={0}
                      value={editForm.rentAmount}
                      onChange={handleEditInputChange}
                      className="input input-bordered w-full rounded-xl bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold"
                    />
                  </div>

                  <div>
                    <label className="label text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Price Policy
                    </label>
                    <select
                      name="rentType"
                      value={editForm.rentType}
                      onChange={handleEditInputChange}
                      className="select select-bordered w-full rounded-xl bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                    >
                      <option value="fixed">Fixed Price</option>
                      <option value="negotiable">Negotiable</option>
                    </select>
                  </div>

                  <div>
                    <label className="label text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Listing Status
                    </label>
                    <select
                      name="status"
                      value={editForm.status}
                      onChange={handleEditInputChange}
                      className="select select-bordered w-full rounded-xl bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold"
                    >
                      <option value="active">Active (Available)</option>
                      <option value="booked">Booked (Taken)</option>
                      <option value="archived">Archived (Hidden)</option>
                    </select>
                  </div>
                </div>

                <label className="label cursor-pointer justify-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    name="serviceChargeIncluded"
                    checked={editForm.serviceChargeIncluded}
                    onChange={handleEditInputChange}
                    className="checkbox checkbox-xs checkbox-primary rounded"
                  />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Service charge / utility bills included in rent
                  </span>
                </label>
              </div>

              {/* 3. Room & Tenant Details */}
              <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" style={{ color: currentTheme.hex }} />
                  <span>3. Room & Tenant Preferences</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="label text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={editForm.gender}
                      onChange={handleEditInputChange}
                      className="select select-bordered w-full rounded-xl bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold"
                    >
                      <option value="Male">Male Only</option>
                      <option value="Female">Female Only</option>
                    </select>
                  </div>

                  <div>
                    <label className="label text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Available From
                    </label>
                    <select
                      name="availableFromMonth"
                      value={editForm.availableFromMonth}
                      onChange={handleEditInputChange}
                      className="select select-bordered w-full rounded-xl bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                    >
                      {!MONTHS_LIST.includes(editForm.availableFromMonth) && Boolean(editForm.availableFromMonth) && (
                        <option value={editForm.availableFromMonth}>
                          {editForm.availableFromMonth}
                        </option>
                      )}
                      {MONTHS_LIST.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="label text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Seat Count
                    </label>
                    <input
                      type="number"
                      name="seatCount"
                      min={1}
                      max={10}
                      value={editForm.seatCount}
                      onChange={handleEditInputChange}
                      className="input input-bordered w-full rounded-xl bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="label text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Room Type
                    </label>
                    <select
                      name="roomType"
                      value={editForm.roomType}
                      onChange={handleEditInputChange}
                      className="select select-bordered w-full rounded-xl bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                    >
                      {!ROOM_TYPES.includes(editForm.roomType as any) && Boolean(editForm.roomType) && (
                        <option value={editForm.roomType}>{editForm.roomType}</option>
                      )}
                      {ROOM_TYPES.map((rt) => (
                        <option key={rt} value={rt}>
                          {rt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* 4. Contact Information */}
              <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" style={{ color: currentTheme.hex }} />
                  <span>4. Contact Information</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="label text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Contact Phone
                    </label>
                    <input
                      type="text"
                      name="contactNumber"
                      value={editForm.contactNumber}
                      onChange={handleEditInputChange}
                      className="input input-bordered w-full rounded-xl bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="label text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      WhatsApp Number
                    </label>
                    <input
                      type="text"
                      name="whatsappNumber"
                      value={editForm.whatsappNumber}
                      onChange={handleEditInputChange}
                      className="input input-bordered w-full rounded-xl bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>
              </div>

              {/* 5. Description */}
              <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" style={{ color: currentTheme.hex }} />
                  <span>5. Description</span>
                </h4>
                <textarea
                  name="description"
                  rows={4}
                  value={editForm.description}
                  onChange={handleEditInputChange}
                  className="textarea textarea-bordered w-full rounded-xl bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                ></textarea>
              </div>

              {/* 6. Amenities & Perks */}
              <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" style={{ color: currentTheme.hex }} />
                  <span>6. Amenities & Included Perks</span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { key: 'khalaMaid', label: 'Khala / Cook' },
                    { key: 'fridge', label: 'Refrigerator' },
                    { key: 'wifi', label: 'WiFi Service' },
                    { key: 'attachedBath', label: 'Attached Bath' },
                    { key: 'balcony', label: 'Balcony' },
                    { key: 'generatorIPS', label: 'Generator/IPS' },
                    { key: 'lift', label: 'Lift / Elevator' },
                    { key: 'filterWater', label: 'Filter Water' },
                  ].map((amenity) => (
                    <button
                      key={amenity.key}
                      type="button"
                      onClick={() => handleEditAmenityToggle(amenity.key as keyof IAmenities)}
                      className={`py-2 px-3 rounded-xl text-xs font-medium border text-left flex items-center justify-between transition cursor-pointer ${
                        editAmenities[amenity.key as keyof IAmenities]
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 font-bold'
                          : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <span>{amenity.label}</span>
                      {editAmenities[amenity.key as keyof IAmenities] && (
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* 7. Media (Photos & Video Walkthrough) */}
              <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5" style={{ color: currentTheme.hex }} />
                  <span>7. Photos & Video Walkthrough</span>
                </h4>
                <CloudinaryUploader
                  images={editImages}
                  video={editVideo}
                  onImagesChange={setEditImages}
                  onVideoChange={setEditVideo}
                />
              </div>

              {/* Modal Footer (Sticky within form) */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2 sticky bottom-0 bg-white dark:bg-slate-900 py-2">
                <button
                  type="button"
                  onClick={() => setEditingPost(null)}
                  className="btn btn-sm btn-ghost rounded-xl text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  style={{ backgroundColor: currentTheme.hex }}
                  className="btn btn-sm text-white rounded-xl font-bold border-none hover:opacity-90 transition px-5"
                >
                  {savingEdit ? 'Saving All Changes...' : 'Save Changes'}
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
