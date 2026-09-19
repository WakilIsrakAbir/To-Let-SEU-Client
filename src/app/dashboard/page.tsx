'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { api } from '@/lib/api';
import { IPost } from '@/types/post';
import { SEU_DEPARTMENTS } from '@/lib/constants';
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
  Camera,
  Loader2,
  X,
  Check,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import LoadingState from '@/components/common/LoadingState';

export default function DashboardPage() {
  const { user, loading: authLoading, updateUser } = useAuth();
  const { toast } = useToast();
  const { currentTheme, isDark } = useTheme();
  const router = useRouter();

  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: '',
    department: 'CSE',
    phone: '',
    studentId: '',
  });
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      setProfileForm({
        name: user.name || '',
        department: user.department || 'CSE',
        phone: user.phone || '',
        studentId: user.studentId || '',
      });

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

  // Upload Profile Picture directly to Cloudinary in to-let-seu/profile-pictures folder
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image exceeds 10MB limit. Please choose a smaller photo.');
      return;
    }

    setUploadingAvatar(true);
    toast.info('Uploading profile picture to Cloudinary...');

    try {
      // 1. Get signed signature for 'avatar' / 'to-let-seu/profile-pictures'
      const signRes = await api.get('/media/sign-upload', {
        params: { type: 'avatar' },
      });
      const { timestamp, signature, apiKey, cloudName, folder } = signRes.data.data;

      // 2. Prepare FormData
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', apiKey);
      formData.append('timestamp', timestamp.toString());
      formData.append('signature', signature);
      formData.append('folder', folder);

      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
      const res = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        throw new Error(errJson?.error?.message || 'Cloudinary upload failed.');
      }

      const data = await res.json();
      const secureUrl = data.secure_url;

      // 3. Save new avatar URL to user profile
      const updateRes = await api.put('/auth/profile', { avatarUrl: secureUrl });
      if (updateRes.data?.data?.user) {
        updateUser(updateRes.data.data.user);
      }

      toast.success('Profile picture updated successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Error updating profile picture.');
    } finally {
      setUploadingAvatar(false);
      e.target.value = '';
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await api.put('/auth/profile', profileForm);
      if (res.data?.data?.user) {
        updateUser(res.data.data.user);
      }
      setEditProfileOpen(false);
      toast.success('Profile updated successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  if (loading || authLoading) {
    return (
      <LoadingState
        message="Loading Student Dashboard..."
        subMessage="Fetching your profile, posts, and housing statistics..."
        fullscreen={true}
      />
    );
  }

  const activePosts = posts.filter((p) => p.status === 'active');
  const bookedPosts = posts.filter((p) => p.status === 'booked');
  const totalViews = posts.reduce((acc, curr) => acc + (curr.viewsCount || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Dashboard Sub Navigation Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-slate-200 dark:border-slate-800 pb-3">
        <Link
          href="/dashboard"
          style={{
            backgroundColor: isDark ? `${currentTheme.hex}22` : currentTheme.lightHex,
            color: isDark ? '#ffffff' : currentTheme.textHex,
            borderColor: isDark ? `${currentTheme.hex}50` : currentTheme.borderHex,
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border transition shadow-xs"
        >
          <User className="w-4 h-4" />
          <span>Overview & Profile</span>
        </Link>
        <Link
          href="/dashboard/my-posts"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <FileText className="w-4 h-4" />
          <span>My Rent Posts</span>
          <span
            style={{ backgroundColor: `${currentTheme.hex}20`, color: currentTheme.hex }}
            className="text-[10px] px-2 py-0.5 rounded-full font-bold ml-1"
          >
            {posts.length}
          </span>
        </Link>
      </div>

      {/* Student Profile Card Header */}
      <div
        style={{
          background: `linear-gradient(135deg, ${currentTheme.hoverHex}, #0f172a)`,
        }}
        className="text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
      >
        <div className="flex items-center gap-4">
          {/* Interactive Profile Picture Container */}
          <div className="relative group shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={user?.avatarUrl || 'https://res.cloudinary.com/demo/image/upload/v1689246197/cld-sample.jpg'}
              alt={user?.name}
              style={{ borderColor: currentTheme.hex }}
              className="w-18 h-18 sm:w-20 sm:h-20 rounded-full object-cover border-2 shadow-lg"
            />

            {/* Desktop Hover Overlay */}
            <label
              htmlFor="avatar-upload-header"
              className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer text-white backdrop-blur-2xs"
              title="Change Profile Picture"
            >
              {uploadingAvatar ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Camera className="w-5 h-5" />
                  <span className="text-[10px] font-bold mt-0.5">Change</span>
                </>
              )}
            </label>

            {/* Always-visible Badge on mobile/desktop corner */}
            <label
              htmlFor="avatar-upload-header"
              style={{ backgroundColor: currentTheme.hex }}
              className="absolute -bottom-1 -right-1 p-1.5 rounded-full text-white shadow-md cursor-pointer hover:opacity-90 transition border-2 border-slate-900"
              title="Change Profile Picture"
            >
              {uploadingAvatar ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Camera className="w-3.5 h-3.5" />
              )}
            </label>

            <input
              id="avatar-upload-header"
              type="file"
              accept="image/png, image/jpeg, image/webp"
              className="hidden"
              disabled={uploadingAvatar}
              onChange={handleAvatarUpload}
            />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
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

        <div className="grid grid-cols-2 gap-2.5 w-full sm:w-auto sm:flex sm:items-center sm:gap-3">
          <button
            onClick={() => setEditProfileOpen(true)}
            className="btn btn-sm sm:btn-md btn-outline border-white/30 text-white hover:bg-white/20 rounded-xl font-bold flex items-center justify-center gap-2"
          >
            <User className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
          <Link
            href="/posts/create"
            style={{ backgroundColor: currentTheme.hex }}
            className="btn btn-sm sm:btn-md text-white border-none rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 shadow-md"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post New Ad</span>
          </Link>
        </div>
      </div>

      {/* Overview Metric Stats - 2x2 on mobile, 4 columns on desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 mb-8 sm:mb-10">
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div
            style={{
              backgroundColor: isDark ? `${currentTheme.hex}25` : currentTheme.lightHex,
              color: currentTheme.hex,
            }}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center mb-2.5 sm:mb-3"
          >
            <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
            Total My Posts
          </span>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-0.5 sm:mt-1">{posts.length}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 flex items-center justify-center mb-2.5 sm:mb-3">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
            Active Listings
          </span>
          <p className="text-2xl sm:text-3xl font-black text-blue-700 dark:text-blue-400 mt-0.5 sm:mt-1">{activePosts.length}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 flex items-center justify-center mb-2.5 sm:mb-3">
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
            Booked / Rented
          </span>
          <p className="text-2xl sm:text-3xl font-black text-amber-700 dark:text-amber-400 mt-0.5 sm:mt-1">{bookedPosts.length}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 flex items-center justify-center mb-2.5 sm:mb-3">
            <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
            Total Views
          </span>
          <p className="text-2xl sm:text-3xl font-black text-purple-700 dark:text-purple-400 mt-0.5 sm:mt-1">{totalViews}</p>
        </div>
      </div>

      {/* Quick Navigation to My Posts Management */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Manage Your Rent Posts</h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-0.5">
            Edit pricing, toggle booked status, or delete your rental ads
          </p>
        </div>
        <Link
          href="/dashboard/my-posts"
          style={{ backgroundColor: currentTheme.hex }}
          className="btn btn-sm sm:btn-md w-full sm:w-auto text-white rounded-xl font-bold flex items-center justify-center gap-2 border-none hover:opacity-90 transition"
        >
          <span>View All My Posts</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Edit Profile Modal */}
      {editProfileOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
              <div>
                <h3 className="font-black text-slate-900 dark:text-white text-lg sm:text-xl">
                  Edit Profile & Photo
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Update your display name, department, phone, or change your Cloudinary avatar
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditProfileOpen(false)}
                className="btn btn-sm btn-ghost btn-circle text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <form onSubmit={handleSaveProfile} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
              {/* Profile Picture Upload Section */}
              <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="relative shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={user?.avatarUrl || 'https://res.cloudinary.com/demo/image/upload/v1689246197/cld-sample.jpg'}
                    alt={user?.name}
                    style={{ borderColor: currentTheme.hex }}
                    className="w-16 h-16 rounded-full object-cover border-2 shadow-md"
                  />
                  {uploadingAvatar && (
                    <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center text-white">
                      <Loader2 className="w-5 h-5 animate-spin" />
                    </div>
                  )}
                </div>

                <div className="text-center sm:text-left flex-1">
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    Profile Picture
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-2">
                    Stored in Cloudinary (to-let-seu/profile-pictures)
                  </span>
                  <label
                    htmlFor="avatar-modal-input"
                    style={{ backgroundColor: currentTheme.hex }}
                    className="btn btn-xs text-white rounded-lg font-bold border-none hover:opacity-90 inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    {uploadingAvatar ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Camera className="w-3.5 h-3.5" />
                    )}
                    <span>{uploadingAvatar ? 'Uploading...' : 'Upload New Photo'}</span>
                  </label>
                  <input
                    id="avatar-modal-input"
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    className="hidden"
                    disabled={uploadingAvatar}
                    onChange={handleAvatarUpload}
                  />
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="label text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="input input-bordered w-full rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>

              {/* Department */}
              <div>
                <label className="label text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Department
                </label>
                <select
                  value={profileForm.department}
                  onChange={(e) => setProfileForm((prev) => ({ ...prev, department: e.target.value as any }))}
                  className="select select-bordered w-full rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                >
                  {SEU_DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              {/* Phone & Student ID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="label text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm((prev) => ({ ...prev, phone: e.target.value }))}
                    className="input input-bordered w-full rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="label text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    SEU Student ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2022000000037"
                    value={profileForm.studentId}
                    onChange={(e) => setProfileForm((prev) => ({ ...prev, studentId: e.target.value }))}
                    className="input input-bordered w-full rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditProfileOpen(false)}
                  className="btn btn-sm btn-ghost rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProfile || uploadingAvatar}
                  style={{ backgroundColor: currentTheme.hex }}
                  className="btn btn-sm text-white rounded-xl font-bold border-none hover:opacity-90 transition px-5 flex items-center gap-1.5"
                >
                  {savingProfile ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  <span>{savingProfile ? 'Saving...' : 'Save Profile'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
