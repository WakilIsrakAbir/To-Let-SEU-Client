'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import {
  Mail,
  MapPin,
  MessageCircle,
  Send,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  HelpCircle,
  FileText,
  PlusCircle,
} from 'lucide-react';
import ContactFaqSection from '@/components/contact/ContactFaqSection';

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

      {/* Main Content Grid: Contact Details Left & Form Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left Column (5 cols): Direct Channels & Campus Info */}
        <div className="lg:col-span-5 space-y-5">
          {/* Campus Location Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-xs">
            <div className="flex items-start gap-4">
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: isDark ? `${currentTheme.hex}20` : currentTheme.lightHex,
                  color: currentTheme.hex,
                }}
              >
                <MapPin className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Campus Location</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Southeast University Permanent Campus
                  <br />
                  251/A & 252, Tejgaon I/A, Dhaka-1208
                </p>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Southeast+University+Permanent+Campus+Tejgaon"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: currentTheme.hex }}
                  className="inline-flex items-center gap-1 text-xs font-bold mt-2.5 hover:underline"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Direct Email Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-xs">
            <div className="flex items-start gap-4">
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
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-xs">
            <div className="flex items-start gap-4">
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
          <div className="rounded-3xl p-5 border border-amber-500/30 bg-amber-500/10 dark:bg-amber-950/20 text-xs text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-400 mb-1">
              <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>Reporting a Fake Post or Advance Money Scam?</span>
            </div>
            <p className="leading-relaxed text-slate-600 dark:text-slate-400">
              If anyone asks for advance money on bKash/Nagad before showing the room, immediately report the post ID
              or phone number using this form with category <strong>Report Fake / Scam Ad</strong>.
            </p>
          </div>
        </div>

        {/* Right Column (7 cols): Clean Contact & Feedback Form */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 lg:p-10 shadow-sm">
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

      {/* Frequently Asked Questions Section */}
      <ContactFaqSection />

      {/* Helpful Quick Links Footer Cards */}
      <div className="mt-16 pt-10 border-t border-slate-200/80 dark:border-slate-800">
        <h3 className="text-center font-bold text-slate-900 dark:text-white text-base sm:text-lg mb-6">
          Looking for Something Else?
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <Link
            href="/posts"
            className="group p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs hover:shadow-md transition flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: isDark ? `${currentTheme.hex}20` : currentTheme.lightHex,
                  color: currentTheme.hex,
                }}
              >
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-primary transition">
                  Browse Rent Posts
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Explore 50+ bachelor seats</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/posts/create"
            className="group p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs hover:shadow-md transition flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <PlusCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-primary transition">
                  Post an Empty Room
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Find student roommates fast</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/create-banner"
            className="group p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs hover:shadow-md transition flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-primary transition">
                  Printable Mess Poster
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Generate 1-click flyers</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
