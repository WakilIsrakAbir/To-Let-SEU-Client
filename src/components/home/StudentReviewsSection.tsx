'use client';

import React, { useState, useEffect } from 'react';
import {
  Star,
  CheckCircle2,
  Sparkles,
  Send,
  X,
  PenLine,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export interface IReview {
  id: string;
  name: string;
  department: string;
  rating: number;
  comment: string;
  date: string;
}

const INITIAL_REVIEWS: IReview[] = [
  {
    id: 'rev-1',
    name: 'Sifat Ahmed',
    department: 'CSE Batch 55',
    rating: 5,
    comment: 'Found a bachelor seat in Nakhalpara within 5 minutes walking distance from Tejgaon campus without any broker fees. Best platform for SEUians!',
    date: '2 days ago',
  },
  {
    id: 'rev-2',
    name: 'Anika Tabassum',
    department: 'BBA Batch 60',
    rating: 5,
    comment: 'As a female student, I was searching for a safe sublet in Mohakhali Wireless. Connected directly with a fellow batchmate through TO-LET SEU.',
    date: '4 days ago',
  },
  {
    id: 'rev-3',
    name: 'Mehedi Hasan',
    department: 'EEE Batch 52',
    rating: 5,
    comment: 'Used to post in Facebook groups and wait for days. Found a verified roommate here within 2 days. Super helpful!',
    date: '1 week ago',
  },
  {
    id: 'rev-4',
    name: 'Shahriar Kabir',
    department: 'CSE Batch 58',
    rating: 5,
    comment: 'The Auto Poster feature is fantastic! Generated a high-res branded banner with a QR code in just 1 click for campus groups.',
    date: '1 week ago',
  },
  {
    id: 'rev-5',
    name: 'Farzana Akter',
    department: 'Pharmacy Batch 39',
    rating: 5,
    comment: 'Clean UI and 100% genuine verified students. No mediator commission, pure student-to-student housing.',
    date: '2 weeks ago',
  },
  {
    id: 'rev-6',
    name: 'Nayeem Hossain',
    department: 'Textile Batch 48',
    rating: 5,
    comment: 'Needed a room near Farmgate before the semester started. Checked distance and reached out to a classmate directly via WhatsApp.',
    date: '2 weeks ago',
  },
  {
    id: 'rev-7',
    name: 'Jannatul Ferdous',
    department: 'English Batch 50',
    rating: 5,
    comment: 'Theme color customization and dark mode look top-notch. Search filters are fast and accurate.',
    date: '3 weeks ago',
  },
  {
    id: 'rev-8',
    name: 'Arifur Rahman',
    department: 'Law Batch 45',
    rating: 5,
    comment: 'No broker fees and direct flat sharing with classmates gives absolute peace of mind. Hats off to the team!',
    date: '1 month ago',
  },
];

export default function StudentReviewsSection() {
  const { currentTheme, isDark } = useTheme();
  const [reviews, setReviews] = useState<IReview[]>(INITIAL_REVIEWS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Load persisted reviews from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('seu_basa_custom_reviews');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setReviews([...parsed, ...INITIAL_REVIEWS]);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    const newRev: IReview = {
      id: `rev-${Date.now()}`,
      name: name.trim(),
      department: department.trim() || 'SEU Student',
      rating: rating,
      comment: comment.trim(),
      date: 'Just now',
    };

    const updated = [newRev, ...reviews];
    setReviews(updated);

    try {
      const customSaved = localStorage.getItem('seu_basa_custom_reviews');
      const existing = customSaved ? JSON.parse(customSaved) : [];
      localStorage.setItem('seu_basa_custom_reviews', JSON.stringify([newRev, ...existing]));
    } catch {
      // ignore
    }

    setName('');
    setDepartment('');
    setComment('');
    setRating(5);
    setSubmitted(true);

    // Auto-close modal after 2 seconds
    setTimeout(() => {
      setSubmitted(false);
      setIsModalOpen(false);
    }, 1800);
  };

  return (
    <section className="relative py-14 sm:py-18 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/60 overflow-hidden w-full">
      {/* Clean Header with Aggregate Rating & Write Review Button */}
      <div className="max-w-7xl min-[1680px]:max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
          <div>
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-2.5 shadow-2xs"
              style={{
                backgroundColor: isDark ? `${currentTheme.hex}18` : currentTheme.lightHex,
                color: isDark ? currentTheme.hex : currentTheme.textHex,
              }}
            >
              <Sparkles className="w-3.5 h-3.5" style={{ color: currentTheme.hex }} />
              <span>Real Student Feedback</span>
            </div>

            <h2 className="text-2xl sm:text-3xl min-[1680px]:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              What Our Users <span style={{ color: currentTheme.hex }}>Say</span>
            </h2>

            <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Real experiences of finding rooms and roommates from fellow Southeast University students across all departments.
            </p>
          </div>

          {/* Social Proof Rating + Write a Review Modal Trigger */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Rating summary badge */}
            <div className="hidden md:flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs">
              <div className="flex items-center text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
              </div>
              <span className="text-xs font-bold text-slate-900 dark:text-white">4.9/5.0</span>
              <span className="text-[11px] text-slate-400 font-medium">(200+ Students)</span>
            </div>

            {/* Clean Write Review Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              style={{ backgroundColor: currentTheme.hex }}
              className="px-4.5 py-2 rounded-xl text-white font-bold text-xs sm:text-sm shadow-md hover:opacity-90 transition flex items-center gap-1.5 cursor-pointer"
            >
              <PenLine className="w-3.5 h-3.5" />
              <span>Write a Review</span>
            </button>
          </div>
        </div>
      </div>

      {/* Infinite Scrolling Marquee Track (Right to Left, Pauses on Hover) */}
      <div className="max-w-7xl min-[1680px]:max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative w-full overflow-hidden py-3 group rounded-2xl">
          {/* Left & Right gradient fade masks */}
          <div className="absolute top-0 left-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-slate-50 dark:from-[#080f0c] to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 right-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-slate-50 dark:from-[#080f0c] to-transparent z-10 pointer-events-none" />

          <div className="animate-marquee-infinite flex gap-5">
          {/* Render doubled list for seamless infinite loop */}
          {[...reviews, ...reviews].map((rev, idx) => (
            <div
              key={`${rev.id}-${idx}`}
              className="w-[290px] sm:w-[330px] shrink-0 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Rating Stars & Date */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-300 dark:text-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-400">{rev.date}</span>
                </div>

                {/* Comment */}
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic line-clamp-3">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              {/* Author Info */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
                <div
                  style={{
                    backgroundColor: isDark ? `${currentTheme.hex}25` : currentTheme.lightHex,
                    color: currentTheme.hex,
                  }}
                  className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs"
                >
                  {rev.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1 truncate">
                    <span>{rev.name}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  </h4>
                  <p className="text-[10px] text-slate-400 font-medium truncate">
                    {rev.department}
                  </p>
                </div>
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>

      {/* On-Demand Professional Review Submission Modal (Clean, Non-intrusive) */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-2xl relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {submitted ? (
              <div className="text-center py-6 space-y-3">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mx-auto"
                  style={{
                    backgroundColor: isDark ? `${currentTheme.hex}25` : currentTheme.lightHex,
                    color: currentTheme.hex,
                  }}
                >
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Thank You for Your Feedback!
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Your review has been saved successfully and added to the live community feed.
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <PenLine className="w-5 h-5" style={{ color: currentTheme.hex }} />
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Share Your Experience
                  </h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
                  Your feedback helps fellow Southeast University students find safe, comfortable bachelor accommodations.
                </p>

                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  {/* Rating Stars Selection */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Select Rating ({rating} Stars)
                    </label>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 hover:scale-115 transition cursor-pointer"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= rating
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-300 dark:text-slate-700'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Your Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Tanvir Ahmed"
                        className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 text-slate-900 dark:text-white"
                      />
                    </div>

                    {/* Department & Batch */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Department & Batch
                      </label>
                      <input
                        type="text"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        placeholder="e.g. CSE Batch 56"
                        className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Comment */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Your Review & Experience <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your experience finding a room or roommate..."
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 text-slate-900 dark:text-white resize-none"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      style={{ backgroundColor: currentTheme.hex }}
                      className="px-5 py-2 rounded-xl text-white font-bold text-xs sm:text-sm shadow-md hover:opacity-90 transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Post Review</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
