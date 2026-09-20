'use client';

import React, { useState, useEffect } from 'react';
import { IMediaItem } from '@/types/post';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface MediaViewerProps {
  images?: IMediaItem[];
  video?: IMediaItem; // Optional for backwards compatibility
  title: string;
  showThumbnails?: boolean;
  showOverlayArrows?: boolean;
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.97,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      x: { type: 'spring' as const, stiffness: 350, damping: 32 },
      opacity: { duration: 0.2 },
      scale: { duration: 0.2 },
    },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    scale: 0.97,
    transition: {
      x: { type: 'spring' as const, stiffness: 350, damping: 32 },
      opacity: { duration: 0.2 },
      scale: { duration: 0.2 },
    },
  }),
};

export default function MediaViewer({
  images = [],
  title,
  showThumbnails = false,
  showOverlayArrows = !showThumbnails,
}: MediaViewerProps) {
  const { currentTheme } = useTheme();
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Filter out any stale/temporary local blob URLs from legacy posts
  const validImages = (images || []).filter(
    (img) => img && img.url && !img.url.startsWith('blob:')
  );
  const hasImages = validImages.length > 0;

  const paginate = (newDirection: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (validImages.length <= 1) return;
    setDirection(newDirection);
    setCurrentImgIndex((prev) => {
      const next = prev + newDirection;
      if (next < 0) return validImages.length - 1;
      if (next >= validImages.length) return 0;
      return next;
    });
  };

  const goToSlide = (idx: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (idx === currentImgIndex) return;
    setDirection(idx > currentImgIndex ? 1 : -1);
    setCurrentImgIndex(idx);
  };

  // Keyboard navigation & scroll lock when Lightbox is active
  useEffect(() => {
    if (!lightboxOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        paginate(1);
      } else if (e.key === 'ArrowLeft') {
        paginate(-1);
      } else if (e.key === 'Escape') {
        setLightboxOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxOpen, validImages.length]);

  // If there are no images, do not render the media section
  if (!hasImages) {
    return null;
  }

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 text-white">
      {/* Main Display Area (Standard 16:9 Aspect Ratio) */}
      <div className="relative aspect-video w-full bg-slate-900 flex items-center justify-center group overflow-hidden">
        {/* Animated Sliding Image Container */}
        <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.img
              key={currentImgIndex}
              src={validImages[currentImgIndex]?.url}
              alt={`${title} - Photo ${currentImgIndex + 1}`}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              drag={validImages.length > 1 ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.8}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = Math.abs(offset.x) * velocity.x;
                if (offset.x < -50 || swipe < -8000) {
                  paginate(1);
                } else if (offset.x > 50 || swipe > 8000) {
                  paginate(-1);
                }
              }}
              className="w-full h-full object-cover cursor-pointer select-none"
              onClick={() => setLightboxOpen(true)}
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </AnimatePresence>
        </div>

        {/* Overlay Left Arrow Button for Multiple Photos */}
        {showOverlayArrows && validImages.length > 1 && (
          <button
            type="button"
            onClick={(e) => paginate(-1, e)}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-black/85 active:scale-95 text-white p-1.5 sm:p-2 rounded-full backdrop-blur-md border border-white/20 transition-all hover:scale-110 shadow-lg flex items-center justify-center cursor-pointer opacity-90 hover:opacity-100"
            aria-label="Previous image"
            title="Previous image"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </button>
        )}

        {/* Overlay Right Arrow Button for Multiple Photos */}
        {showOverlayArrows && validImages.length > 1 && (
          <button
            type="button"
            onClick={(e) => paginate(1, e)}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-black/85 active:scale-95 text-white p-1.5 sm:p-2 rounded-full backdrop-blur-md border border-white/20 transition-all hover:scale-110 shadow-lg flex items-center justify-center cursor-pointer opacity-90 hover:opacity-100"
            aria-label="Next image"
            title="Next image"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </button>
        )}

        {/* Photo Counter Pill */}
        <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-xs font-bold border border-white/10 flex items-center gap-1.5 z-10 pointer-events-none">
          <ImageIcon className="w-3.5 h-3.5" />
          <span>
            {currentImgIndex + 1} / {validImages.length}
          </span>
        </div>

        {/* Lightbox Zoom Button */}
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white p-2 rounded-xl backdrop-blur-md transition opacity-0 group-hover:opacity-100 z-10 hover:scale-105"
          title="Expand photo lightbox"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Optional Thumbnail Bar (only if explicitly enabled, e.g. details page) */}
      {showThumbnails && validImages.length > 1 && (
        <div className="flex items-center gap-2 p-2.5 bg-slate-900/90 overflow-x-auto border-t border-slate-800">
          {validImages.map((img, idx) => (
            <button
              key={img.publicId || idx}
              type="button"
              onClick={(e) => goToSlide(idx, e)}
              style={{
                borderColor: currentImgIndex === idx ? currentTheme.hex : 'transparent',
              }}
              className={`relative shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition ${
                currentImgIndex === idx
                  ? 'scale-105 shadow-md ring-2 ring-white/20'
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={`Thumb ${idx + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.opacity = '0.3';
                }}
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Sliding Lightbox Modal (z-[100000] to sit strictly above floating settings and headers) */}
      {lightboxOpen && hasImages && (
        <div
          className="fixed inset-0 z-[100000] bg-black/95 flex items-center justify-center p-4 select-none backdrop-blur-sm"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Close Lightbox Button */}
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2.5 z-[100010] bg-black/60 hover:bg-white/20 rounded-full backdrop-blur-md transition-all hover:scale-110 active:scale-95 border border-white/10"
            title="Close Lightbox (Esc)"
          >
            <X className="w-7 h-7 sm:w-8 sm:h-8" />
          </button>

          {/* Prominent Left Arrow Slide Button */}
          {validImages.length > 1 && (
            <button
              type="button"
              onClick={(e) => paginate(-1, e)}
              className="absolute left-4 sm:left-8 md:left-12 top-1/2 -translate-y-1/2 z-[100010] bg-black/75 hover:bg-black/95 active:scale-95 text-white p-3.5 sm:p-5 rounded-full backdrop-blur-md border border-white/25 hover:scale-110 transition-all shadow-2xl flex items-center justify-center cursor-pointer group hover:border-white/50"
              aria-label="Previous image"
              title="Previous image (Left Arrow / Swipe Right)"
            >
              <ChevronLeft className="w-7 h-7 sm:w-9 sm:h-9 text-white group-hover:-translate-x-1 transition-transform" />
            </button>
          )}

          {/* Center Sliding Image with Framer Motion and Touch Swipe */}
          <div
            className="relative max-w-6xl w-full max-h-[85vh] px-14 sm:px-24 flex items-center justify-center overflow-hidden z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.img
                key={currentImgIndex}
                src={validImages[currentImgIndex]?.url}
                alt={`${title} - Photo ${currentImgIndex + 1}`}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                drag={validImages.length > 1 ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.8}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = Math.abs(offset.x) * velocity.x;
                  if (offset.x < -60 || swipe < -10000) {
                    paginate(1);
                  } else if (offset.x > 60 || swipe > 10000) {
                    paginate(-1);
                  }
                }}
                className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl select-none cursor-grab active:cursor-grabbing"
              />
            </AnimatePresence>
          </div>

          {/* Prominent Right Arrow Slide Button (Positioned safely and above settings button) */}
          {validImages.length > 1 && (
            <button
              type="button"
              onClick={(e) => paginate(1, e)}
              className="absolute right-4 sm:right-8 md:right-12 top-1/2 -translate-y-1/2 z-[100010] bg-black/75 hover:bg-black/95 active:scale-95 text-white p-3.5 sm:p-5 rounded-full backdrop-blur-md border border-white/25 hover:scale-110 transition-all shadow-2xl flex items-center justify-center cursor-pointer group hover:border-white/50"
              aria-label="Next image"
              title="Next image (Right Arrow / Swipe Left)"
            >
              <ChevronRight className="w-7 h-7 sm:w-9 sm:h-9 text-white group-hover:translate-x-1 transition-transform" />
            </button>
          )}

          {/* Bottom Info Bar: Counter & Dot Indicators */}
          <div className="absolute bottom-5 left-0 right-0 z-[100010] flex flex-col items-center gap-2 pointer-events-none">
            {/* Slide Counter Pill */}
            <div className="text-white text-xs sm:text-sm font-bold bg-black/70 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 shadow-lg pointer-events-auto">
              {currentImgIndex + 1} of {validImages.length}
            </div>

            {/* Quick Dot Indicators */}
            {validImages.length > 1 && (
              <div className="flex items-center gap-1.5 pointer-events-auto bg-black/50 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 shadow-md">
                {validImages.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => goToSlide(idx, e)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentImgIndex === idx
                        ? 'w-6 bg-white shadow-sm'
                        : 'w-2 bg-white/40 hover:bg-white/80'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
