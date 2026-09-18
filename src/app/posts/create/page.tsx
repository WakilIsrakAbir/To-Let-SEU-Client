'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import CloudinaryUploader from '@/components/upload/CloudinaryUploader';
import LocationPicker from '@/components/maps/LocationPicker';
import { DHAKA_AREAS, MONTHS_LIST, ROOM_TYPES, SEU_DEPARTMENTS, AMENITIES_LIST, formatAreaValue } from '@/lib/constants';
import { IMediaItem, ILocation, IAmenities } from '@/types/post';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlusCircle,
  Building,
  DollarSign,
  Users,
  Calendar,
  Phone,
  FileText,
  AlertCircle,
  ArrowRight,
  LogIn,
  CheckCircle,
  X,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export default function CreatePostPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { currentTheme, isDark } = useTheme();

  const [formData, setFormData] = useState({
    title: '',
    department: user?.department || 'CSE',
    contactNumber: user?.phone || '',
    whatsappNumber: user?.phone || '',
    area: DHAKA_AREAS[0] as string,
    addressDetails: '',
    distanceFromCampus: '',
    rentType: 'fixed' as 'fixed' | 'negotiable',
    rentAmount: 3500,
    serviceChargeIncluded: false,
    gender: 'Male' as 'Male' | 'Female',
    availableFromMonth: MONTHS_LIST[0],
    seatCount: 1,
    roomType: ROOM_TYPES[0] as string,
    description: '',
  });

  const [customArea, setCustomArea] = useState('');

  const [amenities, setAmenities] = useState<IAmenities>({
    khalaMaid: true,
    fridge: true,
    wifi: true,
    attachedBath: false,
    balcony: false,
    generatorIPS: false,
    lift: false,
    filterWater: true,
  });

  const [location, setLocation] = useState<ILocation>({
    lat: 23.7639, // SEU Tejgaon
    lng: 90.3995,
    formattedAddress: 'SEU Tejgaon Permanent Campus Area',
  });

  const [images, setImages] = useState<IMediaItem[]>([]);
  const [video, setVideo] = useState<IMediaItem | undefined>(undefined);

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auto-dismiss error toast after 5 seconds
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAmenityToggle = (key: keyof IAmenities) => {
    setAmenities((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!user) {
      setErrorMessage('Please log in first before submitting a post.');
      return;
    }

    setSubmitting(true);
    try {
      const finalArea = formatAreaValue(formData.area, customArea);
      const payload = {
        ...formData,
        area: finalArea,
        title: formData.title.trim() || 'Bachelor Seat / Room',
        department: formData.department || user.department || 'General',
        contactNumber: formData.contactNumber || user.phone || 'N/A',
        addressDetails: formData.addressDetails.trim() || 'Near Campus Area',
        description: formData.description.trim() || '',
        rentAmount: Number(formData.rentAmount) || 0,
        seatCount: Number(formData.seatCount) || 1,
        amenities,
        location,
        media: {
          images,
          video,
        },
      };

      const res = await api.post('/posts', payload);
      if (res.data?.success) {
        router.push('/posts');
      }
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message || 'Failed to publish post. Please check all fields.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg" style={{ color: currentTheme.hex }}></span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 flex items-center justify-center mx-auto">
          <LogIn className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Sign In Required</h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          To maintain safety and trust in the SEU bachelor community, only logged in students can publish rental listings.
        </p>
        <div className="pt-2 flex flex-col gap-2">
          <Link
            href="/login"
            style={{ backgroundColor: currentTheme.hex }}
            className="btn text-white rounded-xl font-bold border-none hover:opacity-90"
          >
            Sign In to Post Ad
          </Link>
          <Link
            href="/register"
            className="btn btn-outline border-slate-300 dark:border-slate-700 rounded-xl font-bold text-slate-700 dark:text-slate-300"
          >
            Create SEU Account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 relative">
      {/* Floating Error Toast Notification */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="fixed top-20 right-4 sm:right-8 z-50 max-w-md w-[calc(100vw-2rem)]"
          >
            <div className="bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/60 rounded-2xl shadow-2xl p-4 flex items-start gap-3 text-slate-800 dark:text-slate-100 ring-1 ring-rose-500/15">
              <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0 pr-1">
                <p className="text-xs font-extrabold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                  Submission Error
                </p>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mt-0.5 break-words">
                  {errorMessage}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setErrorMessage(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition shrink-0"
                aria-label="Close error toast"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-10 space-y-8">
        {/* Header */}
        <div className="border-b border-slate-100 dark:border-slate-800 pb-6">
          <div
            style={{
              backgroundColor: isDark ? `${currentTheme.hex}20` : currentTheme.lightHex,
              color: isDark ? currentTheme.hex : currentTheme.textHex,
              borderColor: isDark ? `${currentTheme.hex}40` : currentTheme.borderHex,
            }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-2 border transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" style={{ color: currentTheme.hex }} />
            <span>Southeast University Bachelor Listing</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Publish a Bachelor Room or Seat
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Fill in the details below. You can upload up to 5 photos and 1 video walkthrough.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Basic Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Building className="w-4 h-4" style={{ color: currentTheme.hex }} />
              <span>1. Basic Details</span>
            </h3>

            {/* Title */}
            <div>
              <label className="label text-xs font-bold text-slate-700 uppercase tracking-wider">
                Listing Title *
              </label>
              <input
                type="text"
                name="title"
                required
                placeholder="e.g. 1 Male Seat Available in Master Bed with Balcony (5 min from SEU)"
                value={formData.title}
                onChange={handleInputChange}
                className="input input-bordered w-full rounded-xl bg-slate-50 border-slate-200 focus:bg-white text-slate-900"
              />
            </div>

            {/* Area & Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Area
                </label>
                <select
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  className="select select-bordered w-full rounded-xl bg-slate-50 border-slate-200 text-slate-900"
                >
                  {DHAKA_AREAS.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>

                {formData.area === 'Other' && (
                  <div className="mt-2.5 animate-in fade-in slide-in-from-top-1 duration-150">
                    <label className="label text-[11px] font-bold text-slate-600 uppercase tracking-wider py-0.5">
                      Specify Area Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Badda, Rampura, Dhanmondi, Uttara"
                      value={customArea}
                      onChange={(e) => setCustomArea(e.target.value)}
                      className="input input-bordered input-sm w-full rounded-xl bg-white border-slate-300 text-slate-900 font-medium"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      Will be saved and displayed as &ldquo;Other ({customArea.trim() || 'Custom Area'})&rdquo;
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="label text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Distance from SEU Campus
                </label>
                <input
                  type="text"
                  name="distanceFromCampus"
                  placeholder="e.g. 5 mins walking distance from SEU campus"
                  value={formData.distanceFromCampus}
                  onChange={handleInputChange}
                  className="input input-bordered w-full rounded-xl bg-slate-50 border-slate-200 text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="label text-xs font-bold text-slate-700 uppercase tracking-wider">
                Full Address / Landmark Details
              </label>
              <input
                type="text"
                name="addressDetails"
                placeholder="e.g. House #14, Road #3, Behind South Breeze, Tejgaon"
                value={formData.addressDetails}
                onChange={handleInputChange}
                className="input input-bordered w-full rounded-xl bg-slate-50 border-slate-200 text-slate-900"
              />
            </div>
          </div>

          {/* Section 2: Rent & Capacity */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <DollarSign className="w-4 h-4" style={{ color: currentTheme.hex }} />
              <span>2. Rent & Cost Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Rent Amount */}
              <div>
                <label className="label text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Rent Amount (BDT) *
                </label>
                <input
                  type="number"
                  name="rentAmount"
                  required
                  min={0}
                  value={formData.rentAmount}
                  onChange={handleInputChange}
                  className="input input-bordered w-full rounded-xl bg-slate-50 border-slate-200 text-slate-900 font-bold"
                />
              </div>

              {/* Rent Type */}
              <div>
                <label className="label text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Price Policy
                </label>
                <select
                  name="rentType"
                  value={formData.rentType}
                  onChange={handleInputChange}
                  className="select select-bordered w-full rounded-xl bg-slate-50 border-slate-200 text-slate-900"
                >
                  <option value="fixed">Fixed Price</option>
                  <option value="negotiable">Negotiable</option>
                </select>
              </div>

              {/* Gender */}
              <div>
                <label className="label text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Rent For (Gender) *
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="select select-bordered w-full rounded-xl bg-slate-50 border-slate-200 text-slate-900 font-bold"
                >
                  <option value="Male">Male Students Only</option>
                  <option value="Female">Female Students Only</option>
                </select>
              </div>
            </div>

            {/* Service Charge & Available Month */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              <div>
                <label className="label text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Available From Month *
                </label>
                <select
                  name="availableFromMonth"
                  value={formData.availableFromMonth}
                  onChange={handleInputChange}
                  className="select select-bordered w-full rounded-xl bg-slate-50 border-slate-200 text-slate-900"
                >
                  {MONTHS_LIST.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Seats Available *
                </label>
                <input
                  type="number"
                  name="seatCount"
                  min={1}
                  max={10}
                  value={formData.seatCount}
                  onChange={handleInputChange}
                  className="input input-bordered w-full rounded-xl bg-slate-50 border-slate-200 text-slate-900"
                />
              </div>

              <div>
                <label className="label text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Room Type
                </label>
                <select
                  name="roomType"
                  value={formData.roomType}
                  onChange={handleInputChange}
                  className="select select-bordered w-full rounded-xl bg-slate-50 border-slate-200 text-slate-900"
                >
                  {ROOM_TYPES.map((rt) => (
                    <option key={rt} value={rt}>
                      {rt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Bills Included checkbox */}
            <label className="label cursor-pointer justify-start gap-2.5">
              <input
                type="checkbox"
                name="serviceChargeIncluded"
                checked={formData.serviceChargeIncluded}
                onChange={handleInputChange}
                className="checkbox checkbox-primary checkbox-sm rounded"
              />
              <span className="text-xs font-semibold text-slate-700">
                Utility & electricity bills are included in rent amount
              </span>
            </label>
          </div>

          {/* Section 3: Contact Info */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Phone className="w-4 h-4" style={{ color: currentTheme.hex }} />
              <span>3. Contact Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="label text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Contact Phone *
                </label>
                <input
                  type="tel"
                  name="contactNumber"
                  required
                  placeholder="017XXXXXXXX"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  className="input input-bordered w-full rounded-xl bg-slate-50 border-slate-200 text-slate-900"
                />
              </div>

              <div>
                <label className="label text-xs font-bold text-slate-700 uppercase tracking-wider">
                  WhatsApp Number
                </label>
                <input
                  type="tel"
                  name="whatsappNumber"
                  placeholder="017XXXXXXXX"
                  value={formData.whatsappNumber}
                  onChange={handleInputChange}
                  className="input input-bordered w-full rounded-xl bg-slate-50 border-slate-200 text-slate-900"
                />
              </div>

              <div>
                <label className="label text-xs font-bold text-slate-700 uppercase tracking-wider">
                  SEU Department
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="select select-bordered w-full rounded-xl bg-slate-50 border-slate-200 text-slate-900"
                >
                  {SEU_DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Amenities Checklist */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <CheckCircle className="w-4 h-4" style={{ color: currentTheme.hex }} />
              <span>4. Perks & Amenities</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {AMENITIES_LIST.map((item) => {
                const checked = amenities[item.id as keyof IAmenities];
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleAmenityToggle(item.id as keyof IAmenities)}
                    style={{
                      backgroundColor: checked ? (isDark ? `${currentTheme.hex}25` : currentTheme.lightHex) : undefined,
                      color: checked ? (isDark ? currentTheme.hex : currentTheme.textHex) : undefined,
                      borderColor: checked ? currentTheme.borderHex : undefined,
                    }}
                    className={`p-3 rounded-2xl border text-xs font-bold transition flex items-center gap-2 text-left ${
                      checked
                        ? 'shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <input
                      type="checkbox"
                      readOnly
                      checked={checked}
                      className="checkbox checkbox-xs checkbox-primary rounded pointer-events-none"
                    />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 5: Description */}
          <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <label className="label text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4" style={{ color: currentTheme.hex }} />
              <span>5. Detailed Description *</span>
            </label>
            <textarea
              name="description"
              required
              rows={4}
              placeholder="Describe the room, sunlight, ventilation, flatmates culture, gate lock time (e.g. 11 PM), smoking rules, etc."
              value={formData.description}
              onChange={handleInputChange}
              className="textarea textarea-bordered w-full rounded-2xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:bg-white text-sm"
            ></textarea>
          </div>

          {/* Section 6: Media Upload (Cloudinary) */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <CloudinaryUploader
              images={images}
              video={video}
              onImagesChange={setImages}
              onVideoChange={setVideo}
            />
          </div>

          {/* Section 7: Live Location Picker */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <LocationPicker location={location} onChange={setLocation} />
          </div>

          {/* Submit Button */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
            <button
              type="submit"
              disabled={submitting}
              style={{ backgroundColor: currentTheme.hex }}
              className="btn w-full text-white rounded-2xl py-4 text-base font-bold shadow-xl border-none flex items-center justify-center gap-2 hover:opacity-90 transition"
            >
              {submitting ? (
                <span className="loading loading-spinner"></span>
              ) : (
                <>
                  <span>Publish SEU Bachelor Post</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
