/**
 * Client-Side Image Compressor Utility
 *
 * Compresses images in the browser before sending them to Cloudinary.
 * Converts heavy raw camera photos (4MB - 12MB) into lightweight WebP format (typically 200KB - 450KB)
 * while preserving high perceived visual clarity at Full HD resolution (max dimension: 1920px).
 */

export interface CompressionResult {
  file: File;
  originalSize: number;
  compressedSize: number;
  savedPercentage: number;
  width: number;
  height: number;
}

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 to 1.0 (default 0.8)
  preferredFormat?: 'image/webp' | 'image/jpeg';
}

/**
 * Checks if the browser supports WebP format canvas export.
 */
function supportsWebP(): boolean {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('image/webp') === 5;
  } catch {
    return false;
  }
}

/**
 * Compresses a single File object using HTML5 Canvas.
 * Automatically respects EXIF orientation if supported by the browser.
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<CompressionResult> {
  const {
    maxWidth = 1920,
    maxHeight = 1920,
    quality = 0.8,
    preferredFormat = 'image/webp',
  } = options;

  const originalSize = file.size;

  // If the file is not an image (e.g. invalid type), return as is
  if (!file.type.startsWith('image/')) {
    return {
      file,
      originalSize,
      compressedSize: originalSize,
      savedPercentage: 0,
      width: 0,
      height: 0,
    };
  }

  // Load image into an ImageBitmap or HTMLImageElement
  let imgBitmap: ImageBitmap | HTMLImageElement;
  let srcWidth: number;
  let srcHeight: number;

  try {
    if (typeof createImageBitmap === 'function') {
      imgBitmap = await createImageBitmap(file);
      srcWidth = imgBitmap.width;
      srcHeight = imgBitmap.height;
    } else {
      imgBitmap = await loadImageElement(file);
      srcWidth = imgBitmap.naturalWidth;
      srcHeight = imgBitmap.naturalHeight;
    }
  } catch {
    // If bitmap creation fails, fallback to HTMLImageElement
    imgBitmap = await loadImageElement(file);
    srcWidth = imgBitmap.naturalWidth;
    srcHeight = imgBitmap.naturalHeight;
  }

  // Calculate new scaled dimensions preserving aspect ratio
  let targetWidth = srcWidth;
  let targetHeight = srcHeight;

  if (targetWidth > maxWidth || targetHeight > maxHeight) {
    const ratio = Math.min(maxWidth / targetWidth, maxHeight / targetHeight);
    targetWidth = Math.round(targetWidth * ratio);
    targetHeight = Math.round(targetHeight * ratio);
  }

  // Draw on off-screen canvas
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    // If canvas context is unavailable, return original file
    return {
      file,
      originalSize,
      compressedSize: originalSize,
      savedPercentage: 0,
      width: srcWidth,
      height: srcHeight,
    };
  }

  // Use high-quality image smoothing
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(imgBitmap, 0, 0, targetWidth, targetHeight);

  // Free bitmap memory if available
  if ('close' in imgBitmap && typeof (imgBitmap as ImageBitmap).close === 'function') {
    (imgBitmap as ImageBitmap).close();
  }

  // Determine export format (WebP preferred, fallback to JPEG)
  const format = supportsWebP() ? preferredFormat : 'image/jpeg';
  const extension = format === 'image/webp' ? '.webp' : '.jpg';

  const blob: Blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else reject(new Error('Canvas toBlob conversion failed'));
      },
      format,
      quality
    );
  });

  // Generate clean filename
  const baseName = file.name.replace(/\.[^/.]+$/, '');
  const compressedFileName = `${baseName}-opt${extension}`;

  const compressedFile = new File([blob], compressedFileName, {
    type: format,
    lastModified: Date.now(),
  });

  const compressedSize = compressedFile.size;
  const savedPercentage = Math.max(
    0,
    Math.round(((originalSize - compressedSize) / originalSize) * 100)
  );

  return {
    file: compressedFile,
    originalSize,
    compressedSize,
    savedPercentage,
    width: targetWidth,
    height: targetHeight,
  };
}

/**
 * Fallback loader for HTMLImageElement
 */
function loadImageElement(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(img);
    };

    img.onerror = (err) => {
      URL.revokeObjectURL(objectUrl);
      reject(err);
    };

    img.src = objectUrl;
  });
}

/**
 * Format bytes into human readable format (e.g., 3.4 MB or 280 KB)
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
