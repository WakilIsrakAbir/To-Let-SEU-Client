'use client';

import React, { useState } from 'react';
import {
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Users,
  ShieldAlert,
  Search,
  FileText,
  MapPin,
  HelpCircle,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface FAQItem {
  id: string;
  category: string;
  icon: React.ElementType;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'broker-fee',
    category: 'Platform & Cost',
    icon: ShieldCheck,
    question: 'Is there any broker fee or service charge to use TO-LET SEU?',
    answer:
      'No, absolutely not! TO-LET SEU is a 100% student-to-student platform. Posting ads, browsing bachelor seats, and connecting directly with fellow classmates involves zero hidden fees or third-party mediator charges.',
  },
  {
    id: 'female-safety',
    category: 'Safety & Female Hostel',
    icon: Users,
    question: 'Can female students filter specifically for female-only hostels and sublets?',
    answer:
      'Yes, definitely. Filtering by "Female Only" on the Rent Posts page displays secure student flats, single rooms, and sublets designated exclusively for female students. Security details and house rules are specified on each listing.',
  },
  {
    id: 'auto-poster',
    category: 'Flyer Generator',
    icon: Sparkles,
    question: 'How does the Auto Poster feature work?',
    answer:
      'Simply enter your room details and Auto Poster generates a high-resolution branded banner in 1 click, formatted for Facebook groups and campus bulletin boards. It automatically embeds a QR code that leads directly to your post.',
  },
  {
    id: 'scam-warning',
    category: 'Safety Warning',
    icon: ShieldAlert,
    question: 'What safety precautions should I take before booking a room?',
    answer:
      'Never send advance booking money via bKash or Nagad after only a phone conversation. Always visit the room in person, clarify maid charges, utilities, and gate timings with current roommates, and verify the host’s SEU student ID.',
  },
  {
    id: 'edit-post',
    category: 'Post Management',
    icon: FileText,
    question: 'How can I edit my listing or delete it once the seat is booked?',
    answer:
      'Sign in to your account and navigate to "My Rent Posts" from your profile menu. You can easily click "Edit" to modify details or "Delete / Mark Booked" once the room is taken.',
  },
  {
    id: 'areas-walking',
    category: 'Campus & Location',
    icon: MapPin,
    question: 'Which residential areas are closest to the Tejgaon permanent campus?',
    answer:
      'Popular student residential areas within 2 to 10 minutes walking distance include Tejgaon I/A residential lanes, Kunipara, East & West Nakhalpara, and Wireless Gate (Mohakhali).',
  },
];

export default function ContactFaqSection() {
  const { currentTheme, isDark } = useTheme();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const filteredFaqs = FAQ_ITEMS.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="mt-16 pt-12 border-t border-slate-200/80 dark:border-slate-800">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-2.5 shadow-2xs"
          style={{
            backgroundColor: isDark ? `${currentTheme.hex}18` : currentTheme.lightHex,
            color: isDark ? currentTheme.hex : currentTheme.textHex,
          }}
        >
          <Sparkles className="w-3.5 h-3.5" style={{ color: currentTheme.hex }} />
          <span>Quick Answers</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Frequently Asked <span style={{ color: currentTheme.hex }}>Questions</span>
        </h2>

        <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Answers to the most common questions asked by Southeast University students.
        </p>

        {/* Quick Instant Search */}
        <div className="relative max-w-md mx-auto mt-5">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions (e.g. broker fee, female, poster)..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 transition"
            style={{
              // ring color handled on focus
            }}
          />
        </div>
      </div>

      {/* Accordion Cards */}
      <div className="max-w-3xl mx-auto space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-8 text-xs sm:text-sm text-slate-400 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
            No matching questions found for &quot;{searchQuery}&quot;. Please send us a message above!
          </div>
        ) : (
          filteredFaqs.map((item, index) => {
            const isOpen = openIndex === index;
            const ItemIcon = item.icon;

            return (
              <div
                key={item.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 shadow-md'
                    : 'bg-white/80 dark:bg-slate-900/70 border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
                style={{
                  borderLeftColor: isOpen ? currentTheme.hex : undefined,
                  borderLeftWidth: isOpen ? '4px' : undefined,
                }}
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: isOpen
                          ? isDark
                            ? `${currentTheme.hex}25`
                            : currentTheme.lightHex
                          : isDark
                          ? '#1e293b'
                          : '#f1f5f9',
                        color: isOpen ? currentTheme.hex : '#64748b',
                      }}
                    >
                      <ItemIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                        {item.category}
                      </span>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug">
                        {item.question}
                      </h3>
                    </div>
                  </div>

                  <div
                    style={{
                      backgroundColor: isOpen ? currentTheme.hex : isDark ? '#1e293b' : '#f1f5f9',
                      color: isOpen ? '#ffffff' : isDark ? '#94a3b8' : '#64748b',
                    }}
                    className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200"
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 mt-1 pl-15">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
