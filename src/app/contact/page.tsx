'use client';

import React, { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import {
  Mail,
  MessageCircle,
  Send,
  CheckCircle2,
  Sparkles,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';

export default function ContactPage() {
  const { currentTheme, isDark } = useTheme();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'CSE',
    category: 'general',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Simulate sending with smooth UX feedback
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        department: 'CSE',
        category: 'general',
        message: '',
      });
    }, 800);
  };

  const getWhatsAppLink = () => {
    const text = encodeURIComponent(
      'Salam! I am a Southeast University student and I have an inquiry regarding To Let SEU platform.'
    );
    return `https://wa.me/8801700000000?text=${text}`;
  };

  return (
    <div className="min-h-screen py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
        <div
          style={{
            backgroundColor: isDark ? `${currentTheme.hex}18` : currentTheme.lightHex,
            color: isDark ? currentTheme.hex : currentTheme.textHex,
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold mb-3 shadow-2xs"
        >
          <Sparkles className="w-3.5 h-3.5" style={{ color: currentTheme.hex }} />
          <span>We are Here to Help</span>
        </div>

        <h1 className="text-3xl sm:text-4xl min-[1680px]:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Get in Touch with <span style={{ color: currentTheme.hex }}>To Let SEU Team</span>
        </h1>

        <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          Have questions about finding a bachelor seat, need help with your listing, or want to report an issue?
          Our student moderation team is ready to assist you.
        </p>
      </div>

      {/* Main Content Grid: Equal 2 Columns with Matching Height */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
        {/* Left Column: Direct Channels & Safety Alert (3 Equal Height Cards) */}
        <div className="flex flex-col justify-between gap-4 sm:gap-5 h-full">
          {/* Direct Email Card */}
          <div className="flex-1 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-xs flex items-center">
            <div className="flex items-start gap-4 w-full">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Email Support</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  For formal inquiries, technical help, or feedback.
                </p>
                <a
                  href="mailto:support@toletseu.com"
                  className="inline-block text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-primary mt-2 font-mono"
                >
                  support@toletseu.com
                </a>
              </div>
            </div>
          </div>

          {/* WhatsApp Direct Chat */}
          <div className="flex-1 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-xs flex items-center">
            <div className="flex items-start gap-4 w-full">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">WhatsApp Helpline</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Quick assistance from student moderator volunteers.
                </p>
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-3 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Anti-Fraud / Safety Help Alert */}
          <div className="flex-1 rounded-3xl p-5 sm:p-6 border border-amber-500/30 bg-amber-500/10 dark:bg-amber-950/20 text-xs text-slate-700 dark:text-slate-300 flex items-center">
            <div className="w-full">
              <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-400 mb-1">
                <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span className="font-bold text-xs sm:text-sm">Reporting a Fake Post or Advance Money Scam?</span>
              </div>
              <p className="leading-relaxed text-slate-600 dark:text-slate-400 mt-1">
                If anyone asks for advance money on bKash/Nagad before showing the room, immediately report the post ID
                or phone number using this form with category <strong>Report Fake / Scam Ad</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Clean Contact & Feedback Form */}
        <div className="h-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 lg:p-10 shadow-sm flex flex-col justify-between">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                style={{
                  backgroundColor: isDark ? `${currentTheme.hex}25` : currentTheme.lightHex,
                  color: currentTheme.hex,
                }}
              >
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">Message Sent Successfully!</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                Thank you for reaching out. One of our Southeast University student volunteer moderators will review
                your message and get back to you shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                style={{ backgroundColor: currentTheme.hex }}
                className="btn btn-sm text-white rounded-xl font-bold border-none px-6 mt-4"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  Send Us a Message
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Fill out the details below and we will respond to your email.
                </p>
              </div>

              {/* Name & Email Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Your Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Tanvir Hossain"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 transition"
                    style={{
                      // focus ring style
                    }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Your Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@seu.edu.bd or gmail"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 transition"
                  />
                </div>
              </div>

              {/* Department & Inquiry Category Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    SEU Department
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 transition"
                  >
                    <option value="CSE">CSE (Computer Science & Eng)</option>
                    <option value="BBA">BBA / MBA</option>
                    <option value="EEE">EEE (Electrical & Electronic)</option>
                    <option value="Pharmacy">Pharmacy</option>
                    <option value="Textile">Textile Engineering</option>
                    <option value="Law">Law & Human Rights</option>
                    <option value="English">English</option>
                    <option value="Economics">Economics</option>
                    <option value="Other">Other / Prospective Student</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Inquiry Topic
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 transition"
                  >
                    <option value="general">General Question</option>
                    <option value="finding_room">Need Help Finding a Room</option>
                    <option value="listing_help">Help with My Rent Post</option>
                    <option value="report_scam">🚨 Report Fake / Scam Listing</option>
                    <option value="feedback">Feedback & Feature Request</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Your Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Please describe how we can assist you..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 transition resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                style={{ backgroundColor: currentTheme.hex }}
                className="w-full py-3 px-6 text-white rounded-xl text-sm font-bold shadow-md hover:opacity-90 disabled:opacity-50 transition flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <span className="loading loading-spinner loading-xs" />
                    <span>Sending Message...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Official Facebook Student Community Card */}
      <div className="mt-12 bg-gradient-to-br from-blue-50 via-indigo-50/40 to-slate-50 dark:from-slate-900 dark:via-blue-950/20 dark:to-slate-900 border border-blue-200/80 dark:border-blue-900/40 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="flex items-start sm:items-center gap-4 sm:gap-5">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#1877F2] text-white flex items-center justify-center shrink-0 shadow-md">
            <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300 text-xs font-bold mb-1.5">
              <span>Official Student Community</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Join Southeast University Facebook Group
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1 max-w-xl">
              Connect with fellow SEU students, explore room & roommate requests, discuss campus life, and share your generated rent banners directly with the community.
            </p>
          </div>
        </div>
        <a
          href="https://www.facebook.com/groups/595436001496374/"
          target="_blank"
          rel="noopener noreferrer"
          className="btn bg-[#1877F2] hover:bg-blue-700 text-white font-bold border-none rounded-xl px-6 shrink-0 shadow hover:shadow-lg transition flex items-center gap-2"
        >
          <span>Join SEU Group</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
