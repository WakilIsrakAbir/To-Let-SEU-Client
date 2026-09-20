'use client';

import React, { useState } from 'react';
import { api } from '@/lib/api';
import { IMediaItem } from '@/types/post';
import { compressImage, formatFileSize } from '@/utils/imageCompressor';
import {
  UploadCloud,
  Image as ImageIcon,
  X,
  AlertCircle,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface CloudinaryUploaderProps {
  images: IMediaItem[];
  onImagesChange: (images: IMediaItem[]) => void;
}

const MAX_RAW_FILE_SIZE = 15 * 1024 * 1024; // 15MB before compression

export default function CloudinaryUploader({
  images,
  onImagesChange,
}: CloudinaryUploaderProps) {
  const { currentTheme, isDark } = useTheme();
  const [uploadingImage, setUploadingImage] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);

  const uploadFileToCloudinary = async (file: File): Promise<IMediaItem> => {
    // 1. Request signed signature from Express backend
    const signRes = await api.get('/media/sign-upload', {
      params: { type: 'image' },
    });
    const { timestamp, signature, apiKey, cloudName, folder } = signRes.data.data;

    // 2. Prepare FormData for Cloudinary
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
      const errMsg =
        errJson?.error?.message ||
        `Cloudinary upload failed with status code ${res.status}`;
      throw new Error(errMsg);
    }

    const data = await res.json();
    return {
      url: data.secure_url,
      publicId: data.public_id,
      sizeBytes: file.size,
    };
  };

  // Image Handler with Client-Side Auto-Compression
  const handleImageFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (images.length + files.length > 5) {
      setErrorMessage('You can upload a maximum of 5 images per post.');
      return;
    }

    for (const file of files) {
      if (file.size > MAX_RAW_FILE_SIZE) {
        setErrorMessage(
          `Image "${file.name}" exceeds the 15MB maximum size limit (${(file.size / (1024 * 1024)).toFixed(1)}MB).`
        );
        return;
      }
    }

    setUploadingImage(true);
    try {
      const uploadedList: IMediaItem[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Step A: Client-side compression to WebP (<450KB)
        setUploadProgress(
          `Optimizing photo ${i + 1} of ${files.length} (${formatFileSize(file.size)})...`
        );
        const compressionResult = await compressImage(file, {
          maxWidth: 1920,
          maxHeight: 1920,
          quality: 0.8,
        });

        // Step B: Upload the compressed WebP file to Cloudinary
        setUploadProgress(
          `Uploading photo ${i + 1} of ${files.length} (${formatFileSize(compressionResult.compressedSize)})...`
        );
        const item = await uploadFileToCloudinary(compressionResult.file);
        uploadedList.push(item);
      }
      onImagesChange([...images, ...uploadedList]);
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Error uploading images to Cloudinary. Check connection.';
      setErrorMessage(msg);
    } finally {
      setUploadingImage(false);
      setUploadProgress(null);
      e.target.value = ''; // reset input
    }
  };

  const removeImage = (indexToRemove: number) => {
    onImagesChange(images.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="space-y-4">
      {errorMessage && (
        <div className="alert alert-error bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl p-3.5 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Room Photos Section */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <label className="label p-0 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4" style={{ color: currentTheme.hex }} />
            <span>Room Photos (Max 5)</span>
          </label>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 shrink-0">
            {images.length}/5 uploaded
          </span>
        </div>

        {/* Thumbnail Preview Grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-3">
            {images.map((img, idx) => (
              <div
                key={img.publicId || idx}
                className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 group"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={`Upload ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-1.5 left-1.5 bg-black/70 backdrop-blur-xs text-[10px] text-emerald-400 font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1 pointer-events-none">
                  <CheckCircle className="w-3 h-3" />
                  <span>Cloud</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1.5 right-1.5 bg-black/70 hover:bg-red-600 text-white p-1 rounded-full backdrop-blur-xs transition"
                  title="Remove image"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Image Dropzone */}
        {images.length < 5 && (
          <label
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl cursor-pointer transition p-4 text-center hover:opacity-90"
            style={{
              backgroundColor: isDark ? `${currentTheme.hex}10` : currentTheme.lightHex,
            }}
          >
            {uploadingImage ? (
              <div className="flex flex-col items-center gap-2" style={{ color: currentTheme.hex }}>
                <Loader2 className="w-7 h-7 animate-spin" />
                <span className="text-xs font-bold">{uploadProgress || 'Processing photos...'}</span>
              </div>
            ) : (
              <>
                <UploadCloud className="w-8 h-8 mb-1.5" style={{ color: currentTheme.hex }} />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Click or drag room photos here
                </span>
                <span className="text-[11px] text-slate-500 mt-0.5">
                  PNG, JPG, WebP up to 10MB (Saved to Cloudinary)
                </span>
              </>
            )}
            <input
              type="file"
              accept="image/png, image/jpeg, image/webp"
              multiple
              disabled={uploadingImage}
              onChange={handleImageFiles}
              className="hidden"
            />
          </label>
        )}
      </div>
    </div>
  );
}
