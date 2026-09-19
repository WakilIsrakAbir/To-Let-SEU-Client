'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import QRCode from 'qrcode';
import { toPng, toJpeg } from 'html-to-image';
import {
  Sparkles,
  Download,
  Building2,
  Phone,
  Calendar,
  Users,
  MapPin,
  DollarSign,
  Palette,
  Check,
  Share2,
} from 'lucide-react';
import { DHAKA_AREAS, MONTHS_LIST } from '@/lib/constants';

function BannerGeneratorContent() {
  const searchParams = useSearchParams();

  const [headline, setHeadline] = useState(
    searchParams.get('title') || 'Male Bachelor Seat Available Near SEU Campus'
  );
  const [area, setArea] = useState(searchParams.get('area') || 'Tejgaon (Near SEU Campus)');
  const [rent, setRent] = useState(searchParams.get('rent') || '3,500');
  const [rentType, setRentType] = useState('Fixed');
  const [gender, setGender] = useState(searchParams.get('gender') || 'Male');
  const [month, setMonth] = useState(searchParams.get('month') || MONTHS_LIST[0]);
  const [seats, setSeats] = useState(searchParams.get('seats') || '1 Seat');
  const [phone, setPhone] = useState(searchParams.get('phone') || '017XXXXXXXX');
  const [billsIncluded, setBillsIncluded] = useState(true);

  // Perks
  const [perks, setPerks] = useState({
    khalaMaid: true,
    wifi: true,
    fridge: true,
    attachedBath: false,
    balcony: true,
    generator: false,
  });

  // Themes: 'seu-emerald' | 'dark-slate' | 'clean-white'
  const [theme, setTheme] = useState<'seu-emerald' | 'dark-slate' | 'clean-white'>('seu-emerald');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [downloading, setDownloading] = useState(false);

  // Generate QR Code
  useEffect(() => {
    const postLink = typeof window !== 'undefined' ? window.location.origin + '/posts' : 'https://toletseu.com';
    QRCode.toDataURL(postLink, {
      width: 140,
      margin: 1,
      color: {
        dark: theme === 'clean-white' ? '#0f172a' : '#042f2e',
        light: '#ffffff',
      },
    }).then(setQrCodeUrl);
  }, [theme]);

  const togglePerk = (key: keyof typeof perks) => {
    setPerks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const bannerRef = useRef<HTMLDivElement>(null);

  // Synchronized Canvas Fallback (1:1 visual match with Live Preview)
  const fallbackCanvasDownload = (format: 'png' | 'jpeg') => {
    const canvas = document.createElement('canvas');
    const width = 1200;
    const height = 675; // Standard 16:9 Landscape ratio
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setDownloading(false);
      return;
    }

    // Helper: Safely draw rounded rectangle without path pollution
    const fillRoundedRect = (
      x: number,
      y: number,
      w: number,
      h: number,
      r: number,
      fillStyle: string | CanvasGradient,
      strokeStyle?: string,
      strokeWidth?: number
    ) => {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, r);
      ctx.fillStyle = fillStyle;
      ctx.fill();
      if (strokeStyle && strokeWidth) {
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = strokeWidth;
        ctx.stroke();
      }
      ctx.restore();
    };

    // Vector Icon Drawers
    const drawPinIcon = (cx: number, cy: number, color: string) => {
      ctx.save();
      ctx.fillStyle = color;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy - 4, 7, Math.PI * 0.75, Math.PI * 2.25, false);
      ctx.lineTo(cx, cy + 9);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.fillStyle = theme === 'clean-white' ? '#f1f5f9' : '#042f2e';
      ctx.arc(cx, cy - 4, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const drawCalendarIcon = (cx: number, cy: number, color: string) => {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(cx - 9, cy - 8, 18, 16, 3);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx - 9, cy - 2);
      ctx.lineTo(cx + 9, cy - 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx - 5, cy - 11);
      ctx.lineTo(cx - 5, cy - 7);
      ctx.moveTo(cx + 5, cy - 11);
      ctx.lineTo(cx + 5, cy - 7);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy + 3, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const drawUsersIcon = (cx: number, cy: number, color: string) => {
      ctx.save();
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(cx - 4, cy - 4, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx - 4, cy + 8, 7, Math.PI * 1.15, Math.PI * 1.85);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx + 5, cy - 2, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx + 5, cy + 8, 5.5, Math.PI * 1.2, Math.PI * 1.8);
      ctx.fill();
      ctx.restore();
    };

    const drawPhoneIcon = (cx: number, cy: number, color: string) => {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(cx - 7, cy - 13, 14, 26, 4);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx - 3, cy - 9);
      ctx.lineTo(cx + 3, cy - 9);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy + 8, 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const renderPoster = (qrImg?: HTMLImageElement) => {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(12, 12, width - 24, height - 24, 32);
      ctx.clip();

      if (theme === 'seu-emerald') {
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, '#064e3b');
        grad.addColorStop(0.45, '#065f46');
        grad.addColorStop(1, '#020617');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      } else if (theme === 'dark-slate') {
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, '#1e293b');
        grad.addColorStop(0.5, '#0f172a');
        grad.addColorStop(1, '#090d16');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        const glowTop = ctx.createRadialGradient(width - 50, 50, 20, width - 50, 50, 380);
        glowTop.addColorStop(0, 'rgba(16, 185, 129, 0.18)');
        glowTop.addColorStop(1, 'rgba(16, 185, 129, 0)');
        ctx.fillStyle = glowTop;
        ctx.fillRect(0, 0, width, height);

        const glowBottom = ctx.createRadialGradient(60, height - 60, 20, 60, height - 60, 350);
        glowBottom.addColorStop(0, 'rgba(37, 99, 235, 0.15)');
        glowBottom.addColorStop(1, 'rgba(37, 99, 235, 0)');
        ctx.fillStyle = glowBottom;
        ctx.fillRect(0, 0, width, height);
      } else {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
      }

      // Outer border stroke
      ctx.beginPath();
      ctx.roundRect(12, 12, width - 24, height - 24, 32);
      ctx.strokeStyle =
        theme === 'clean-white'
          ? '#059669'
          : theme === 'dark-slate'
          ? '#475569'
          : 'rgba(52, 211, 153, 0.4)';
      ctx.lineWidth = theme === 'clean-white' ? 4 : theme === 'dark-slate' ? 4 : 6;
      ctx.stroke();
      ctx.restore();

      const contentX = 48;
      const contentW = width - 2 * contentX;

      // Top Header Brand Bar
      const headerY = 32;

      ctx.font = '900 34px Arial, sans-serif';
      ctx.fillStyle = theme === 'clean-white' ? '#0f172a' : '#ffffff';
      ctx.fillText('TO LET ', contentX, headerY + 32);
      const toLetWidth = ctx.measureText('TO LET ').width;

      ctx.fillStyle = theme === 'clean-white' ? '#059669' : '#34d399';
      ctx.fillText('SEU', contentX + toLetWidth, headerY + 32);

      ctx.font = 'bold 13px Arial, sans-serif';
      ctx.fillStyle = theme === 'clean-white' ? '#64748b' : '#94a3b8';
      ctx.fillText('SOUTHEAST UNIVERSITY STUDENT MESS', contentX, headerY + 54);

      // Gender Badge Pill
      const badgeW = 180;
      const badgeH = 40;
      const badgeX = contentX + contentW - badgeW;
      const badgeY = headerY + 12;
      const badgeBg = gender === 'Male' ? '#2563eb' : '#e11d48';
      fillRoundedRect(badgeX, badgeY, badgeW, badgeH, 12, badgeBg);

      ctx.font = '900 17px Arial, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText(`${gender.toUpperCase()} ONLY`, badgeX + badgeW / 2, badgeY + 26);
      ctx.textAlign = 'left';

      // Header bottom divider line
      const dividerY = headerY + 70;
      ctx.beginPath();
      ctx.moveTo(contentX, dividerY);
      ctx.lineTo(contentX + contentW, dividerY);
      ctx.strokeStyle =
        theme === 'clean-white'
          ? '#e2e8f0'
          : theme === 'dark-slate'
          ? 'rgba(148, 163, 184, 0.25)'
          : 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // 2-Column Split Layout
      const leftX = contentX;
      const leftW = 670;
      const rightX = leftX + leftW + 36;
      const rightW = contentX + contentW - rightX;

      // ================= LEFT COLUMN =================
      const headlineY = dividerY + 38;
      ctx.font = '900 28px Arial, sans-serif';
      ctx.fillStyle = theme === 'clean-white' ? '#0f172a' : '#ffffff';

      const words = headline.split(' ');
      let currentLine = '';
      const lines: string[] = [];
      for (let n = 0; n < words.length; n++) {
        const testLine = currentLine ? `${currentLine} ${words[n]}` : words[n];
        if (ctx.measureText(testLine).width > leftW && currentLine) {
          lines.push(currentLine);
          currentLine = words[n];
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) lines.push(currentLine);

      const headlineLines = lines.slice(0, 2);
      headlineLines.forEach((l, idx) => {
        ctx.fillText(l, leftX, headlineY + idx * 36);
      });
      const endHeadlineY = headlineY + (headlineLines.length - 1) * 36;

      // Rent Highlight Card
      const rentY = Math.max(endHeadlineY + 24, 196);
      const rentH = 104;
      if (theme === 'clean-white') {
        const rentGrad = ctx.createLinearGradient(leftX, rentY, leftX + leftW, rentY);
        rentGrad.addColorStop(0, '#065f46');
        rentGrad.addColorStop(1, '#115e59');
        fillRoundedRect(leftX, rentY, leftW, rentH, 16, rentGrad);
      } else if (theme === 'dark-slate') {
        const rentGrad = ctx.createLinearGradient(leftX, rentY, leftX + leftW, rentY);
        rentGrad.addColorStop(0, '#f59e0b');
        rentGrad.addColorStop(0.5, '#fbbf24');
        rentGrad.addColorStop(1, '#f59e0b');
        fillRoundedRect(leftX, rentY, leftW, rentH, 16, rentGrad);
      } else {
        const rentBg = '#f59e0b';
        fillRoundedRect(leftX, rentY, leftW, rentH, 16, rentBg);
      }

      // Rent Left Text
      ctx.font = 'bold 14px Arial, sans-serif';
      ctx.fillStyle =
        theme === 'clean-white'
          ? 'rgba(255, 255, 255, 0.88)'
          : 'rgba(15, 23, 42, 0.75)';
      ctx.fillText('MONTHLY RENT', leftX + 24, rentY + 34);

      ctx.font = '900 44px Arial, sans-serif';
      ctx.fillStyle = theme === 'clean-white' ? '#ffffff' : '#0f172a';
      ctx.fillText(`BDT ${rent}`, leftX + 24, rentY + 84);

      // Rent Right Pill (Bills Included)
      const pillText = billsIncluded ? '⚡ Bills Included' : '+ Utility Bills';
      ctx.font = 'bold 17px Arial, sans-serif';
      const pillW = ctx.measureText(pillText).width + 32;
      const pillH = 38;
      const pillX = leftX + leftW - 24 - pillW;
      const pillY = rentY + (rentH - pillH) / 2;
      const pillBg =
        theme === 'clean-white'
          ? '#fbbf24'
          : theme === 'dark-slate'
          ? 'rgba(69, 26, 3, 0.2)'
          : 'rgba(0, 0, 0, 0.15)';
      fillRoundedRect(pillX, pillY, pillW, pillH, 10, pillBg);

      ctx.fillStyle = theme === 'clean-white' ? '#78350f' : '#0f172a';
      ctx.fillText(pillText, pillX + 16, pillY + 25);

      // Specs Grid (Area, Month, Seats)
      const specsY = rentY + rentH + 16;
      const specsH = 80;
      const specGap = 12;
      const specCardW = (leftW - 2 * specGap) / 3;

      const specCardsData = [
        { val: area, icon: drawPinIcon },
        { val: month, icon: drawCalendarIcon },
        { val: seats, icon: drawUsersIcon },
      ];

      specCardsData.forEach((spec, i) => {
        const cardX = leftX + i * (specCardW + specGap);
        const cardBg =
          theme === 'clean-white'
            ? '#f8fafc'
            : theme === 'dark-slate'
            ? '#1e293b'
            : 'rgba(255, 255, 255, 0.10)';
        const cardBorder =
          theme === 'clean-white'
            ? '#e2e8f0'
            : theme === 'dark-slate'
            ? '#334155'
            : 'rgba(255, 255, 255, 0.08)';

        fillRoundedRect(cardX, specsY, specCardW, specsH, 14, cardBg, cardBorder, 1);

        spec.icon(cardX + specCardW / 2, specsY + 26, theme === 'clean-white' ? '#059669' : '#34d399');

        let displayVal = spec.val;
        ctx.font = 'bold 16px Arial, sans-serif';
        if (ctx.measureText(displayVal).width > specCardW - 20) {
          while (ctx.measureText(displayVal + '...').width > specCardW - 20 && displayVal.length > 3) {
            displayVal = displayVal.slice(0, -1);
          }
          displayVal += '...';
        }

        ctx.fillStyle = theme === 'clean-white' ? '#0f172a' : '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(displayVal, cardX + specCardW / 2, specsY + 62);
        ctx.textAlign = 'left';
      });

      // Perks Badges (Exactly matching Live Preview labels!)
      const activePerksList: string[] = [];
      if (perks.khalaMaid) activePerksList.push('🍳 Khala');
      if (perks.wifi) activePerksList.push('📶 WiFi');
      if (perks.fridge) activePerksList.push('🧊 Fridge');
      if (perks.attachedBath) activePerksList.push('🚿 Bath');
      if (perks.balcony) activePerksList.push('🌿 Balcony');
      if (perks.generator) activePerksList.push('⚡ IPS');

      let perkX = leftX;
      let perkY = specsY + specsH + 16;
      ctx.font = 'bold 14px Arial, sans-serif';

      activePerksList.forEach((perk) => {
        const textWidth = ctx.measureText(perk).width;
        const pillWidth = textWidth + 24;
        const pillHeight = 32;

        if (perkX + pillWidth > leftX + leftW) {
          perkX = leftX;
          perkY += 38;
        }

        const pBg =
          theme === 'clean-white'
            ? '#ecfdf5'
            : theme === 'dark-slate'
            ? 'rgba(6, 78, 59, 0.4)'
            : 'rgba(16, 185, 129, 0.20)';
        const pBorder =
          theme === 'clean-white'
            ? '#a7f3d0'
            : theme === 'dark-slate'
            ? 'rgba(52, 211, 153, 0.35)'
            : 'rgba(52, 211, 153, 0.35)';

        fillRoundedRect(perkX, perkY, pillWidth, pillHeight, 8, pBg, pBorder, 1);

        ctx.fillStyle = theme === 'clean-white' ? '#065f46' : '#6ee7b7';
        ctx.fillText(perk, perkX + 12, perkY + 21);

        perkX += pillWidth + 8;
      });

      // ================= RIGHT COLUMN =================
      // Right Card 1: Contact Host Card (Matching Live Preview!)
      const contactY = dividerY + 28;
      const contactH = 104;
      const contactBg =
        theme === 'clean-white'
          ? '#f0fdf4'
          : theme === 'dark-slate'
          ? '#1e293b'
          : 'rgba(0, 0, 0, 0.40)';
      const contactBorder =
        theme === 'clean-white'
          ? '#a7f3d0'
          : theme === 'dark-slate'
          ? '#334155'
          : 'rgba(255, 255, 255, 0.12)';

      fillRoundedRect(rightX, contactY, rightW, contactH, 18, contactBg, contactBorder, 1.5);

      ctx.font = 'bold 12px Arial, sans-serif';
      ctx.fillStyle = theme === 'clean-white' ? '#065f46' : '#34d399';
      ctx.fillText('CONTACT HOST:', rightX + 20, contactY + 28);

      // Phone icon and number
      drawPhoneIcon(rightX + 30, contactY + 54, theme === 'clean-white' ? '#059669' : '#34d399');

      ctx.font = '900 24px Arial, sans-serif';
      ctx.fillStyle = theme === 'clean-white' ? '#0f172a' : '#ffffff';
      ctx.fillText(phone, rightX + 50, contactY + 62);

      ctx.font = 'bold 11px Arial, sans-serif';
      ctx.fillStyle = theme === 'clean-white' ? '#64748b' : '#94a3b8';
      ctx.fillText('Call or WhatsApp', rightX + 20, contactY + 88);

      // Verified host pill
      const hostBg =
        theme === 'clean-white'
          ? '#dcfce7'
          : theme === 'dark-slate'
          ? 'rgba(6, 78, 59, 0.8)'
          : 'rgba(16, 185, 129, 0.20)';
      const hostBorder =
        theme === 'clean-white'
          ? '#86efac'
          : theme === 'dark-slate'
          ? 'rgba(52, 211, 153, 0.4)'
          : 'rgba(52, 211, 153, 0.35)';
      const hostBadgeW = 110;
      const hostBadgeX = rightX + rightW - 20 - hostBadgeW;
      fillRoundedRect(hostBadgeX, contactY + 74, hostBadgeW, 20, 6, hostBg, hostBorder, 1);
      ctx.font = 'bold 11px Arial, sans-serif';
      ctx.fillStyle = theme === 'clean-white' ? '#065f46' : '#34d399';
      ctx.fillText('✓ Direct Host', hostBadgeX + 16, contactY + 88);

      // Right Card 2: QR Code Card (Horizontal Layout exactly matching Live Preview!)
      const qrBoxY = contactY + contactH + 16;
      const qrBoxH = 100;
      const qrCardBg =
        theme === 'clean-white'
          ? '#f8fafc'
          : theme === 'dark-slate'
          ? '#1e293b'
          : 'rgba(0, 0, 0, 0.40)';
      const qrCardBorder =
        theme === 'clean-white'
          ? '#e2e8f0'
          : theme === 'dark-slate'
          ? '#334155'
          : 'rgba(255, 255, 255, 0.12)';
      fillRoundedRect(rightX, qrBoxY, rightW, qrBoxH, 18, qrCardBg, qrCardBorder, 1.5);

      // QR Code Container on Left
      const qrSize = 72;
      const qrInnerX = rightX + 14;
      const qrInnerY = qrBoxY + 14;

      fillRoundedRect(qrInnerX, qrInnerY, qrSize, qrSize, 12, '#ffffff', theme === 'clean-white' ? '#e2e8f0' : undefined, 1);

      if (qrImg) {
        ctx.drawImage(qrImg, qrInnerX + 4, qrInnerY + 4, qrSize - 8, qrSize - 8);
      }

      // Texts on Right of QR code
      const qrTextX = qrInnerX + qrSize + 16;
      ctx.font = '900 15px Arial, sans-serif';
      ctx.fillStyle = theme === 'clean-white' ? '#065f46' : '#34d399';
      ctx.textAlign = 'left';
      ctx.fillText('SCAN FOR POST', qrTextX, qrBoxY + 38);

      ctx.font = 'bold 12px Arial, sans-serif';
      ctx.fillStyle = theme === 'clean-white' ? '#64748b' : '#cbd5e1';
      ctx.fillText('Southeast University', qrTextX, qrBoxY + 58);

      ctx.font = 'bold 13px Arial, sans-serif';
      ctx.fillStyle = theme === 'clean-white' ? '#047857' : '#6ee7b7';
      ctx.fillText('toletseu.vercel.app', qrTextX, qrBoxY + 78);

      // Subtle Bottom Footer (Matching Live Preview!)
      const footerY = height - 32;
      ctx.font = 'bold 12px Arial, sans-serif';
      ctx.fillStyle = theme === 'clean-white' ? '#94a3b8' : 'rgba(255, 255, 255, 0.4)';
      ctx.fillText('Official Student Mess Portal • SEU', contentX, footerY);

      ctx.textAlign = 'right';
      ctx.fillText('Verified Student Housing', contentX + contentW, footerY);
      ctx.textAlign = 'left';

      // Trigger Download
      const mime = format === 'png' ? 'image/png' : 'image/jpeg';
      const fileExt = format === 'png' ? 'png' : 'jpg';
      const dataUrl = canvas.toDataURL(mime, 0.95);
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `SEU_Rent_Banner_${area.replace(/[^a-zA-Z0-9]/g, '_')}.${fileExt}`;
      a.click();
      setDownloading(false);
    };

    if (qrCodeUrl) {
      const qrImg = new Image();
      qrImg.crossOrigin = 'anonymous';
      qrImg.onload = () => renderPoster(qrImg);
      qrImg.onerror = () => renderPoster();
      qrImg.src = qrCodeUrl;
    } else {
      renderPoster();
    }
  };

  // Primary High-Resolution Export: Guaranteed standard 1200x675 HD Canvas flyer on mobile & desktop
  const handleDownload = async (format: 'png' | 'jpeg') => {
    setDownloading(true);

    // On mobile screens (width < 768px), always use the pixel-perfect 1200x675 canvas generator to prevent squished mobile DOM screenshots
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      fallbackCanvasDownload(format);
      return;
    }

    if (!bannerRef.current) {
      fallbackCanvasDownload(format);
      return;
    }

    try {
      const element = bannerRef.current;
      const currentWidth = element.offsetWidth || 640;
      const pixelRatio = Math.max(2, Math.min(3, Math.round(1400 / currentWidth)));

      const downloadFn = format === 'png' ? toPng : toJpeg;
      const dataUrl = await downloadFn(element, {
        quality: 0.98,
        pixelRatio,
        cacheBust: true,
      });

      const fileExt = format === 'png' ? 'png' : 'jpg';
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `SEU_Rent_Banner_${area.replace(/[^a-zA-Z0-9]/g, '_')}.${fileExt}`;
      a.click();
      setDownloading(false);
    } catch (err) {
      console.warn('html-to-image failed, falling back to synchronized canvas generator:', err);
      fallbackCanvasDownload(format);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Banner */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Create & Download Rent Banner
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Customize your room details and download high-resolution flyers in <strong>JPG</strong> or <strong>PNG</strong> format for SEU Facebook groups & campus notice boards.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Form: Inputs & Customization (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="font-extrabold text-slate-900 text-base">Poster Information</h3>
            <div className="flex items-center gap-1">
              <Palette className="w-4 h-4 text-emerald-700" />
              <span className="text-xs font-bold text-slate-600">Theme</span>
            </div>
          </div>

          {/* Theme Selector */}
          <div>
            <label className="label text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Color Style
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTheme('seu-emerald')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border ${
                  theme === 'seu-emerald'
                    ? 'bg-emerald-800 text-white border-emerald-800 shadow-sm'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                }`}
              >
                <span>SEU Green</span>
                {theme === 'seu-emerald' && <Check className="w-3 h-3" />}
              </button>

              <button
                type="button"
                onClick={() => setTheme('dark-slate')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border ${
                  theme === 'dark-slate'
                    ? 'bg-slate-950 text-white border-slate-950 shadow-sm'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <span>Dark Sleek</span>
                {theme === 'dark-slate' && <Check className="w-3 h-3" />}
              </button>

              <button
                type="button"
                onClick={() => setTheme('clean-white')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border ${
                  theme === 'clean-white'
                    ? 'bg-white text-emerald-800 border-emerald-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                <span>Print White</span>
                {theme === 'clean-white' && <Check className="w-3 h-3" />}
              </button>
            </div>
          </div>

          {/* Headline */}
          <div>
            <label className="label text-xs font-bold text-slate-700 uppercase tracking-wider">
              Main Headline
            </label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="input input-sm input-bordered w-full rounded-xl bg-slate-50 text-slate-800 font-semibold"
            />
          </div>

          {/* Area & Rent */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="label text-xs font-bold text-slate-700 uppercase tracking-wider">
                Area
              </label>
              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="select select-sm select-bordered w-full rounded-xl bg-slate-50 text-xs text-slate-800"
              >
                {DHAKA_AREAS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label text-xs font-bold text-slate-700 uppercase tracking-wider">
                Rent (BDT)
              </label>
              <input
                type="text"
                value={rent}
                onChange={(e) => setRent(e.target.value)}
                className="input input-sm input-bordered w-full rounded-xl bg-slate-50 text-slate-800 font-bold"
              />
            </div>
          </div>

          {/* Gender & Available Month */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="label text-xs font-bold text-slate-700 uppercase tracking-wider">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="select select-sm select-bordered w-full rounded-xl bg-slate-50 text-xs text-slate-800"
              >
                <option value="Male">Male Students Only</option>
                <option value="Female">Female Students Only</option>
              </select>
            </div>

            <div>
              <label className="label text-xs font-bold text-slate-700 uppercase tracking-wider">
                Available Month
              </label>
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="select select-sm select-bordered w-full rounded-xl bg-slate-50 text-xs text-slate-800"
              >
                {!MONTHS_LIST.includes(month) && Boolean(month) && (
                  <option value={month}>{month}</option>
                )}
                {MONTHS_LIST.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Seat count & Contact Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="label text-xs font-bold text-slate-700 uppercase tracking-wider">
                Capacity / Seats
              </label>
              <input
                type="text"
                value={seats}
                onChange={(e) => setSeats(e.target.value)}
                className="input input-sm input-bordered w-full rounded-xl bg-slate-50 text-slate-800"
              />
            </div>

            <div>
              <label className="label text-xs font-bold text-slate-700 uppercase tracking-wider">
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input input-sm input-bordered w-full rounded-xl bg-slate-50 text-slate-800"
              />
            </div>
          </div>

          {/* Bills included checkbox */}
          <label className="label cursor-pointer justify-start gap-2.5 p-0">
            <input
              type="checkbox"
              checked={billsIncluded}
              onChange={(e) => setBillsIncluded(e.target.checked)}
              className="checkbox checkbox-xs checkbox-primary rounded"
            />
            <span className="text-xs font-semibold text-slate-700">
              Show &quot;Bills Included&quot; on poster
            </span>
          </label>

          {/* Perks Switches */}
          <div>
            <label className="label text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Perks to Highlight on Banner
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: 'khalaMaid', label: 'Khala / Cook' },
                { key: 'wifi', label: 'WiFi Service' },
                { key: 'fridge', label: 'Refrigerator' },
                { key: 'attachedBath', label: 'Attached Bath' },
                { key: 'balcony', label: 'Balcony' },
                { key: 'generator', label: 'Generator/IPS' },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => togglePerk(item.key as any)}
                  className={`py-1.5 px-2.5 rounded-lg text-xs font-medium border text-left flex items-center justify-between transition ${
                    perks[item.key as keyof typeof perks]
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-300 font-bold'
                      : 'bg-slate-50 text-slate-500 border-slate-200'
                  }`}
                >
                  <span>{item.label}</span>
                  {perks[item.key as keyof typeof perks] && (
                    <Check className="w-3.5 h-3.5 text-emerald-700" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Download Triggers */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => handleDownload('png')}
              disabled={downloading}
              className="btn btn-sm sm:btn-md flex-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-md shadow-emerald-700/20"
            >
              <Download className="w-4 h-4" />
              <span>Download PNG</span>
            </button>

            <button
              onClick={() => handleDownload('jpeg')}
              disabled={downloading}
              className="btn btn-sm sm:btn-md flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md shadow-amber-500/20"
            >
              <Download className="w-4 h-4" />
              <span>Download JPG</span>
            </button>
          </div>

          {/* Facebook Community Share Prompt */}
          <div className="mt-4 p-3.5 rounded-2xl bg-blue-50 border border-blue-200/70 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <svg className="w-4 h-4 fill-[#1877F2] shrink-0" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>Download & post directly into the <strong>SEU Facebook Group</strong>!</span>
            </div>
            <a
              href="https://www.facebook.com/groups/595436001496374/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 hover:text-blue-900 font-bold underline shrink-0"
            >
              Open Group ↗
            </a>
          </div>
        </div>

        {/* Right Preview Card (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-3 px-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Live Preview (16:9 Landscape)</span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">Fits Post Cards 100%</span>
          </div>

          {/* Dynamic HTML Poster Preview that matches export */}
          <div
            ref={bannerRef}
            className={`w-full aspect-video rounded-2xl sm:rounded-3xl p-2.5 sm:p-6 flex flex-col justify-between shadow-2xl transition-all duration-300 relative overflow-hidden ${
              theme === 'seu-emerald'
                ? 'bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-950 text-white border-2 sm:border-4 border-emerald-500/40'
                : theme === 'dark-slate'
                ? 'bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 text-white border-2 sm:border-[3px] border-slate-700/80 shadow-2xl ring-1 ring-white/10'
                : 'bg-white text-slate-900 border-2 sm:border-[3px] border-emerald-600/80 shadow-xl ring-1 ring-slate-900/5'
            }`}
          >
            {/* Ambient Background Glows for Modern Aesthetic */}
            {theme === 'dark-slate' && (
              <>
                <div className="absolute -top-16 -right-16 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
              </>
            )}
            {theme === 'seu-emerald' && (
              <div className="absolute -top-16 -right-16 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
            )}

            {/* Header Brand Bar */}
            <div className={`flex items-center justify-between pb-1.5 sm:pb-3 border-b relative z-10 ${
              theme === 'clean-white'
                ? 'border-slate-200'
                : theme === 'dark-slate'
                ? 'border-slate-700/80'
                : 'border-white/10'
            }`}>
              <div>
                <div className="flex items-center gap-1.5 font-black text-xs sm:text-lg">
                  <span className={theme === 'clean-white' ? 'text-slate-900' : 'text-white'}>TO LET</span>
                  <span className={theme === 'clean-white' ? 'text-emerald-600' : 'text-emerald-400'}>SEU</span>
                </div>
                <p className={`text-[7px] sm:text-[10px] font-semibold uppercase tracking-wider ${
                  theme === 'clean-white' ? 'text-slate-500' : 'text-slate-400'
                }`}>
                  Southeast University Student Mess
                </p>
              </div>

              <span
                className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg sm:rounded-xl text-[9px] sm:text-xs font-black shadow ${
                  gender === 'Male'
                    ? 'bg-blue-600 text-white'
                    : 'bg-rose-600 text-white'
                }`}
              >
                {gender.toUpperCase()} ONLY
              </span>
            </div>

            {/* 2-Column Body */}
            <div className="grid grid-cols-12 gap-2 sm:gap-4 my-auto items-center relative z-10">
              {/* Left Column (7 cols): Headline, Rent, Specs, Perks */}
              <div className="col-span-7 space-y-1.5 sm:space-y-2.5">
                <h2 className={`text-[10px] sm:text-sm md:text-base font-black leading-snug line-clamp-2 ${
                  theme === 'clean-white' ? 'text-slate-900' : 'text-white'
                }`}>
                  {headline}
                </h2>

                {/* Rent Card */}
                <div
                  className={`p-1.5 sm:p-3 rounded-lg sm:rounded-2xl flex items-center justify-between shadow-md ${
                    theme === 'clean-white'
                      ? 'bg-gradient-to-r from-emerald-800 to-teal-800 text-white'
                      : theme === 'dark-slate'
                      ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                      : 'bg-amber-500 text-slate-950'
                  }`}
                >
                  <div>
                    <span className={`text-[7px] sm:text-[9px] font-extrabold uppercase tracking-wider block leading-none ${
                      theme === 'clean-white' ? 'text-emerald-100/90' : 'text-slate-950/80'
                    }`}>
                      Monthly Rent
                    </span>
                    <span className="text-xs sm:text-xl font-black leading-tight">
                      BDT {rent}
                    </span>
                  </div>
                  <span className={`text-[7.5px] sm:text-[11px] font-bold px-1 sm:px-2 py-0.5 rounded-md sm:rounded-lg ${
                    theme === 'clean-white'
                      ? 'bg-amber-400 text-amber-950 shadow-xs'
                      : theme === 'dark-slate'
                      ? 'bg-amber-950/20 text-amber-950 font-extrabold border border-amber-950/10'
                      : 'bg-black/15'
                  }`}>
                    {billsIncluded ? '⚡ Bills Included' : '+ Utility'}
                  </span>
                </div>

                {/* Specs Badges */}
                <div className="grid grid-cols-3 gap-1 text-center">
                  <div
                    className={`p-1 sm:p-1.5 rounded-md sm:rounded-lg text-[8px] sm:text-[10px] font-semibold ${
                      theme === 'clean-white'
                        ? 'bg-slate-50 border border-slate-200/90 text-slate-800'
                        : theme === 'dark-slate'
                        ? 'bg-slate-800/90 border border-slate-700 text-slate-100 shadow-sm'
                        : 'bg-white/10 text-white'
                    }`}
                  >
                    <MapPin className={`w-2.5 h-2.5 sm:w-3 sm:h-3 mx-auto mb-0.5 ${theme === 'clean-white' ? 'text-emerald-700' : 'text-emerald-400'}`} />
                    <span className="block font-bold truncate">{area}</span>
                  </div>

                  <div
                    className={`p-1 sm:p-1.5 rounded-md sm:rounded-lg text-[8px] sm:text-[10px] font-semibold ${
                      theme === 'clean-white'
                        ? 'bg-slate-50 border border-slate-200/90 text-slate-800'
                        : theme === 'dark-slate'
                        ? 'bg-slate-800/90 border border-slate-700 text-slate-100 shadow-sm'
                        : 'bg-white/10 text-white'
                    }`}
                  >
                    <Calendar className={`w-2.5 h-2.5 sm:w-3 sm:h-3 mx-auto mb-0.5 ${theme === 'clean-white' ? 'text-emerald-700' : 'text-emerald-400'}`} />
                    <span className="block font-bold truncate">{month}</span>
                  </div>

                  <div
                    className={`p-1 sm:p-1.5 rounded-md sm:rounded-lg text-[8px] sm:text-[10px] font-semibold ${
                      theme === 'clean-white'
                        ? 'bg-slate-50 border border-slate-200/90 text-slate-800'
                        : theme === 'dark-slate'
                        ? 'bg-slate-800/90 border border-slate-700 text-slate-100 shadow-sm'
                        : 'bg-white/10 text-white'
                    }`}
                  >
                    <Users className={`w-2.5 h-2.5 sm:w-3 sm:h-3 mx-auto mb-0.5 ${theme === 'clean-white' ? 'text-emerald-700' : 'text-emerald-400'}`} />
                    <span className="block font-bold truncate">{seats}</span>
                  </div>
                </div>

                {/* Perks Badges */}
                <div className="flex flex-wrap gap-0.5 sm:gap-1">
                  {perks.khalaMaid && (
                    <span className={`text-[7.5px] sm:text-[9px] px-1 sm:px-1.5 py-0.5 rounded font-bold border ${
                      theme === 'clean-white'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200 shadow-2xs'
                        : theme === 'dark-slate'
                        ? 'bg-slate-800/90 text-emerald-300 border border-slate-700 shadow-2xs'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    }`}>
                      🍳 Khala
                    </span>
                  )}
                  {perks.wifi && (
                    <span className={`text-[7.5px] sm:text-[9px] px-1 sm:px-1.5 py-0.5 rounded font-bold border ${
                      theme === 'clean-white'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200 shadow-2xs'
                        : theme === 'dark-slate'
                        ? 'bg-slate-800/90 text-emerald-300 border border-slate-700 shadow-2xs'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    }`}>
                      📶 WiFi
                    </span>
                  )}
                  {perks.fridge && (
                    <span className={`text-[7.5px] sm:text-[9px] px-1 sm:px-1.5 py-0.5 rounded font-bold border ${
                      theme === 'clean-white'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200 shadow-2xs'
                        : theme === 'dark-slate'
                        ? 'bg-slate-800/90 text-emerald-300 border border-slate-700 shadow-2xs'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    }`}>
                      🧊 Fridge
                    </span>
                  )}
                  {perks.attachedBath && (
                    <span className={`text-[7.5px] sm:text-[9px] px-1 sm:px-1.5 py-0.5 rounded font-bold border ${
                      theme === 'clean-white'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200 shadow-2xs'
                        : theme === 'dark-slate'
                        ? 'bg-slate-800/90 text-emerald-300 border border-slate-700 shadow-2xs'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    }`}>
                      🚿 Bath
                    </span>
                  )}
                  {perks.balcony && (
                    <span className={`text-[7.5px] sm:text-[9px] px-1 sm:px-1.5 py-0.5 rounded font-bold border ${
                      theme === 'clean-white'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200 shadow-2xs'
                        : theme === 'dark-slate'
                        ? 'bg-slate-800/90 text-emerald-300 border border-slate-700 shadow-2xs'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    }`}>
                      🌿 Balcony
                    </span>
                  )}
                  {perks.generator && (
                    <span className={`text-[7.5px] sm:text-[9px] px-1 sm:px-1.5 py-0.5 rounded font-bold border ${
                      theme === 'clean-white'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200 shadow-2xs'
                        : theme === 'dark-slate'
                        ? 'bg-slate-800/90 text-emerald-300 border border-slate-700 shadow-2xs'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    }`}>
                      ⚡ IPS
                    </span>
                  )}
                </div>
              </div>

              {/* Right Column (5 cols): Contact & QR Code */}
              <div className="col-span-5 space-y-1 sm:space-y-2">
                {/* Contact Card */}
                <div className={`p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl space-y-0.5 sm:space-y-1 ${
                  theme === 'clean-white'
                    ? 'bg-gradient-to-br from-emerald-50/70 to-slate-50 border border-emerald-200/80 shadow-2xs'
                    : theme === 'dark-slate'
                    ? 'bg-slate-800/90 border border-slate-700/90 shadow-md ring-1 ring-white/5'
                    : 'bg-black/40 backdrop-blur-md border border-white/10'
                }`}>
                  <span className={`text-[7px] sm:text-[9px] font-extrabold uppercase tracking-wider block ${
                    theme === 'clean-white' ? 'text-emerald-800' : 'text-emerald-400'
                  }`}>
                    Contact Host:
                  </span>
                  <p className={`text-[10px] sm:text-sm font-black tracking-tight flex items-center gap-1 ${
                    theme === 'clean-white' ? 'text-slate-900' : 'text-white'
                  }`}>
                    <Phone className={`w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 shrink-0 ${
                      theme === 'clean-white' ? 'text-emerald-700' : 'text-emerald-400'
                    }`} />
                    <span className="truncate">{phone}</span>
                  </p>
                  <div className="flex items-center justify-between gap-1 pt-0.5">
                    <p className={`text-[7px] sm:text-[8px] font-medium ${theme === 'clean-white' ? 'text-slate-500' : 'text-slate-400'}`}>
                      Call / WA
                    </p>
                    <span className={`text-[7px] sm:text-[8px] font-bold px-1 sm:px-1.5 py-0.5 rounded ${
                      theme === 'clean-white'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200/70'
                        : theme === 'dark-slate'
                        ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                        : 'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      ✓ Direct
                    </span>
                  </div>
                </div>

                {/* QR Box */}
                <div className={`p-1 sm:p-2 rounded-lg sm:rounded-xl flex items-center gap-1.5 sm:gap-2.5 ${
                  theme === 'clean-white'
                    ? 'bg-slate-50 border border-slate-200/90 shadow-2xs'
                    : theme === 'dark-slate'
                    ? 'bg-slate-800/90 border border-slate-700/90 shadow-md ring-1 ring-white/5'
                    : 'bg-black/40 backdrop-blur-md border border-white/10'
                }`}>
                  {qrCodeUrl && (
                    <div className={`bg-white p-0.5 rounded-lg shadow-2xs shrink-0 ${
                      theme === 'clean-white'
                        ? 'border border-slate-200'
                        : theme === 'dark-slate'
                        ? 'shadow-md ring-1 ring-white/10'
                        : ''
                    }`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={qrCodeUrl} alt="QR" className="w-8 h-8 sm:w-12 sm:h-12" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <span className={`text-[7px] sm:text-[9px] font-black block leading-tight ${
                      theme === 'clean-white' ? 'text-emerald-800' : 'text-emerald-400'
                    }`}>
                      SCAN FOR POST
                    </span>
                    <p className={`text-[7px] sm:text-[8px] truncate ${theme === 'clean-white' ? 'text-slate-600' : 'text-slate-300'}`}>
                      SEU Housing
                    </p>
                    <p className={`text-[7px] sm:text-[8px] font-bold truncate ${theme === 'clean-white' ? 'text-emerald-700' : 'text-emerald-300'}`}>
                      toletseu.vercel.app
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer watermark */}
            <div className={`pt-2 border-t flex items-center justify-between text-[8px] sm:text-[9px] font-semibold ${
              theme === 'clean-white'
                ? 'border-slate-200 text-slate-400'
                : theme === 'dark-slate'
                ? 'border-slate-700/80 text-slate-400'
                : 'border-white/10 text-slate-400'
            }`}>
              <span>Official Student Mess Portal • SEU</span>
              <span>Verified Student Housing</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CreateBannerPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <span className="loading loading-spinner text-emerald-700 loading-lg"></span>
        </div>
      }
    >
      <BannerGeneratorContent />
    </Suspense>
  );
}
