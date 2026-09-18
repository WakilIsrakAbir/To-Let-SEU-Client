'use client';

import React, { useState } from 'react';
import { IMediaItem } from '@/types/post';
import {
  Image as ImageIcon,
  Video as VideoIcon,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Play,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface MediaViewerProps {
  images?: IMediaItem[];
  video?: IMediaItem;
  title: string;
}

export default function MediaViewer({ images = [], video, title }: MediaViewerProps) {
  const { currentTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'photos' | 'video'>('photos');
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const hasImages = images.length > 0;
  const hasVideo = !!video && !!video.url;

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (images.length > 1) {
      setCurrentImgIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (images.length > 1) {
      setCurrentImgIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  if (!hasImages && !hasVideo) {
    return (
      <div className="w-full h-64 sm:h-80 bg-slate-100 rounded-2xl flex flex-col items-center justify-center text-slate-400 border border-slate-200">
        <ImageIcon className="w-12 h-12 mb-2 stroke-1" />
        <span className="text-sm font-medium">No photos or video uploaded for this room</span>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 text-white">
      {/* Media Type Tabs (if both photos and video exist) */}
      {hasImages && hasVideo && (
        <div className="flex items-center justify-center gap-2 p-2 bg-slate-900 border-b border-slate-800">
          <button
            onClick={() => setActiveTab('photos')}
            style={{
              backgroundColor: activeTab === 'photos' ? currentTheme.hex : undefined,
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'photos'
                ? 'text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Photos ({images.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('video')}
            style={{
              backgroundColor: activeTab === 'video' ? currentTheme.hex : undefined,
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'video'
                ? 'text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <VideoIcon className="w-4 h-4" />
            <span>Room Walkthrough Video</span>
          </button>
        </div>
      )}

      {/* Main Display Area */}
      <div className="relative aspect-video sm:aspect-[16/10] bg-slate-900 flex items-center justify-center group overflow-hidden">
        {activeTab === 'photos' && hasImages ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[currentImgIndex]?.url}
              alt={`${title} - Photo ${currentImgIndex + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02] cursor-pointer"
              onClick={() => setLightboxOpen(true)}
            />

            {/* Photo Counter Pill */}
            <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-xs font-bold border border-white/10 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5" />
              <span>
                {currentImgIndex + 1} / {images.length}
              </span>
            </div>

            {/* Lightbox Zoom Button */}
            <button
              onClick={() => setLightboxOpen(true)}
              className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white p-2 rounded-xl backdrop-blur-md transition opacity-0 group-hover:opacity-100"
              title="Expand photo"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            {/* Next / Prev Buttons */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/90 text-white p-2 rounded-full backdrop-blur-md transition opacity-80 group-hover:opacity-100"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/90 text-white p-2 rounded-full backdrop-blur-md transition opacity-80 group-hover:opacity-100"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </>
        ) : (
          /* Video Player */
          <div className="w-full h-full flex flex-col items-center justify-center bg-black">
            {video?.url ? (
              <video
                src={video.url}
                controls
                className="w-full h-full max-h-[480px] object-contain"
                playsInline
                preload="metadata"
              />
            ) : (
              <div className="text-slate-500 flex flex-col items-center">
                <VideoIcon className="w-10 h-10 mb-2" />
                <span>No video available</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Thumbnail Bar (if multiple photos) */}
      {activeTab === 'photos' && images.length > 1 && (
        <div className="flex items-center gap-2 p-2.5 bg-slate-900/90 overflow-x-auto border-t border-slate-800">
          {images.map((img, idx) => (
            <button
              key={img.publicId || idx}
              onClick={() => setCurrentImgIndex(idx)}
              style={{
                borderColor: currentImgIndex === idx ? currentTheme.hex : 'transparent',
              }}
              className={`relative shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition ${
                currentImgIndex === idx
                  ? 'scale-105 shadow-md'
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={`Thumb ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {lightboxOpen && hasImages && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-red-400 p-2 z-50"
          >
            <X className="w-8 h-8" />
          </button>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[currentImgIndex]?.url}
            alt={`${title} - Lightbox`}
            className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
          />

          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 text-white p-3 rounded-full"
              >
                <ChevronLeft className="w-7 h-7" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 text-white p-3 rounded-full"
              >
                <ChevronRight className="w-7 h-7" />
              </button>
            </>
          )}

          <div className="absolute bottom-6 text-white text-sm bg-black/60 px-4 py-1.5 rounded-full border border-white/20">
            {currentImgIndex + 1} of {images.length}
          </div>
        </div>
      )}
    </div>
  );
}
