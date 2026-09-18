'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import QRCode from 'qrcode';
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
  const [month, setMonth] = useState(searchParams.get('month') || 'Immediate');
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
    const postLink = typeof window !== 'undefined' ? window.location.origin + '/posts' : 'https://seubasa.org';
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

  // High-Resolution Canvas Export (JPG / PNG)
  const handleDownload = (format: 'png' | 'jpeg') => {
    setDownloading(true);

    const canvas = document.createElement('canvas');
    const width = 1080;
    const height = 1350; // Ideal Instagram / Facebook poster ratio 4:5
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
      fillStyle: string,
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

    // Vector Icon Drawers (Crisp Canvas Drawing)
    const drawPinIcon = (cx: number, cy: number, color: string) => {
      ctx.save();
      ctx.fillStyle = color;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(cx, cy - 5, 9, Math.PI * 0.75, Math.PI * 2.25, false);
      ctx.lineTo(cx, cy + 12);
      ctx.closePath();
      ctx.fill();
      // Inner dot
      ctx.beginPath();
      ctx.fillStyle = theme === 'clean-white' ? '#f1f5f9' : '#042f2e';
      ctx.arc(cx, cy - 5, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const drawCalendarIcon = (cx: number, cy: number, color: string) => {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(cx - 12, cy - 10, 24, 22, 4);
      ctx.stroke();
      // Top header bar
      ctx.beginPath();
      ctx.moveTo(cx - 12, cy - 2);
      ctx.lineTo(cx + 12, cy - 2);
      ctx.stroke();
      // Binder loops
      ctx.beginPath();
      ctx.moveTo(cx - 6, cy - 14);
      ctx.lineTo(cx - 6, cy - 9);
      ctx.moveTo(cx + 6, cy - 14);
      ctx.lineTo(cx + 6, cy - 9);
      ctx.stroke();
      // Inner dot
      ctx.beginPath();
      ctx.arc(cx, cy + 4, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const drawUsersIcon = (cx: number, cy: number, color: string) => {
      ctx.save();
      ctx.fillStyle = color;
      // Main user head
      ctx.beginPath();
      ctx.arc(cx - 5, cy - 5, 5.5, 0, Math.PI * 2);
      ctx.fill();
      // Main user shoulder
      ctx.beginPath();
      ctx.arc(cx - 5, cy + 11, 9, Math.PI * 1.15, Math.PI * 1.85);
      ctx.fill();
      // Second user head
      ctx.beginPath();
      ctx.arc(cx + 7, cy - 3, 4.5, 0, Math.PI * 2);
      ctx.fill();
      // Second user shoulder
      ctx.beginPath();
      ctx.arc(cx + 7, cy + 11, 7, Math.PI * 1.2, Math.PI * 1.8);
      ctx.fill();
      ctx.restore();
    };

    const drawPhoneIcon = (cx: number, cy: number, color: string) => {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(cx - 9, cy - 16, 18, 32, 5);
      ctx.stroke();
      // Speaker line
      ctx.beginPath();
      ctx.moveTo(cx - 4, cy - 11);
      ctx.lineTo(cx + 4, cy - 11);
      ctx.stroke();
      // Home dot
      ctx.beginPath();
      ctx.arc(cx, cy + 10, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const renderPoster = (qrImg?: HTMLImageElement) => {
      // 1. Poster Background & Outer Rounded Frame
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(14, 14, width - 28, height - 28, 48);
      ctx.clip();

      if (theme === 'seu-emerald') {
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, '#064e3b'); // emerald-900
        grad.addColorStop(0.45, '#065f46'); // emerald-800
        grad.addColorStop(1, '#020617'); // slate-950
        ctx.fillStyle = grad;
      } else if (theme === 'dark-slate') {
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, '#0f172a');
        grad.addColorStop(0.5, '#020617');
        grad.addColorStop(1, '#000000');
        ctx.fillStyle = grad;
      } else {
        ctx.fillStyle = '#ffffff';
      }
      ctx.fillRect(0, 0, width, height);

      // Outer border stroke
      ctx.beginPath();
      ctx.roundRect(14, 14, width - 28, height - 28, 48);
      ctx.strokeStyle =
        theme === 'clean-white'
          ? '#059669'
          : theme === 'dark-slate'
          ? '#334155'
          : 'rgba(52, 211, 153, 0.4)';
      ctx.lineWidth = 8;
      ctx.stroke();
      ctx.restore();

      const contentX = 72;
      const contentW = width - 2 * contentX;

      // 2. Top Header Brand Bar
      const headerY = 68;

      // Brand Title "TO LET SEU"
      ctx.font = '900 42px Arial, sans-serif';
      ctx.fillStyle = theme === 'clean-white' ? '#065f46' : '#ffffff';
      ctx.fillText('TO LET ', contentX, headerY + 42);
      const toLetWidth = ctx.measureText('TO LET ').width;

      ctx.fillStyle = theme === 'clean-white' ? '#059669' : '#34d399';
      ctx.fillText('SEU', contentX + toLetWidth, headerY + 42);

      // Subtitle
      ctx.font = 'bold 18px Arial, sans-serif';
      ctx.fillStyle = theme === 'clean-white' ? '#047857' : '#94a3b8';
      ctx.fillText('SOUTHEAST UNIVERSITY STUDENT MESS', contentX, headerY + 76);

      // Gender Badge Pill
      const badgeW = 210;
      const badgeH = 50;
      const badgeX = contentX + contentW - badgeW;
      const badgeY = headerY + 22;
      const badgeBg = gender === 'Male' ? '#2563eb' : '#e11d48';
      fillRoundedRect(badgeX, badgeY, badgeW, badgeH, 16, badgeBg);

      ctx.font = '900 22px Arial, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText(`${gender.toUpperCase()} ONLY`, badgeX + badgeW / 2, badgeY + 33);
      ctx.textAlign = 'left';

      // Header bottom divider line
      const dividerY = headerY + 104;
      ctx.beginPath();
      ctx.moveTo(contentX, dividerY);
      ctx.lineTo(contentX + contentW, dividerY);
      ctx.strokeStyle =
        theme === 'clean-white' ? '#e2e8f0' : 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // 3. Main Headline
      const headlineY = dividerY + 54;
      ctx.font = '900 46px Arial, sans-serif';
      ctx.fillStyle = theme === 'clean-white' ? '#0f172a' : '#ffffff';

      const words = headline.split(' ');
      let currentLine = '';
      const lines: string[] = [];
      for (let n = 0; n < words.length; n++) {
        const testLine = currentLine ? `${currentLine} ${words[n]}` : words[n];
        if (ctx.measureText(testLine).width > contentW && currentLine) {
          lines.push(currentLine);
          currentLine = words[n];
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) lines.push(currentLine);

      const headlineLines = lines.slice(0, 3);
      headlineLines.forEach((l, idx) => {
        ctx.fillText(l, contentX, headlineY + idx * 56);
      });
      const endHeadlineY = headlineY + (headlineLines.length - 1) * 56;

      // 4. Rent Highlight Card
      const rentY = Math.max(endHeadlineY + 44, 385);
      const rentH = 150;
      const rentBg = theme === 'clean-white' ? '#047857' : '#f59e0b';
      fillRoundedRect(contentX, rentY, contentW, rentH, 24, rentBg);

      // Rent Left Text
      ctx.font = 'bold 20px Arial, sans-serif';
      ctx.fillStyle =
        theme === 'clean-white'
          ? 'rgba(255, 255, 255, 0.85)'
          : 'rgba(15, 23, 42, 0.75)';
      ctx.fillText('MONTHLY RENT', contentX + 36, rentY + 50);

      ctx.font = '900 58px Arial, sans-serif';
      ctx.fillStyle = theme === 'clean-white' ? '#ffffff' : '#0f172a';
      ctx.fillText(`BDT ${rent}`, contentX + 36, rentY + 118);

      // Rent Right Pill (Bills Included)
      const pillText = billsIncluded ? '⚡ Bills Included' : '+ Utility Bills';
      ctx.font = 'bold 23px Arial, sans-serif';
      const pillW = ctx.measureText(pillText).width + 44;
      const pillH = 48;
      const pillX = contentX + contentW - 36 - pillW;
      const pillY = rentY + (rentH - pillH) / 2;
      const pillBg =
        theme === 'clean-white'
          ? 'rgba(255, 255, 255, 0.22)'
          : 'rgba(0, 0, 0, 0.15)';
      fillRoundedRect(pillX, pillY, pillW, pillH, 14, pillBg);

      ctx.fillStyle = theme === 'clean-white' ? '#ffffff' : '#0f172a';
      ctx.fillText(pillText, pillX + 22, pillY + 33);

      // 5. Specs Grid (Area, Month, Capacity)
      const specsY = rentY + rentH + 26;
      const specsH = 125;
      const gap = 18;
      const cardW = (contentW - 2 * gap) / 3;

      const specCardsData = [
        { val: area, icon: drawPinIcon },
        { val: month, icon: drawCalendarIcon },
        { val: seats, icon: drawUsersIcon },
      ];

      specCardsData.forEach((spec, i) => {
        const cardX = contentX + i * (cardW + gap);
        const cardBg =
          theme === 'clean-white' ? '#f1f5f9' : 'rgba(255, 255, 255, 0.10)';
        const cardBorder =
          theme === 'clean-white' ? '#e2e8f0' : 'rgba(255, 255, 255, 0.08)';

        fillRoundedRect(cardX, specsY, cardW, specsH, 20, cardBg, cardBorder, 1.5);

        // Centered Icon
        spec.icon(cardX + cardW / 2, specsY + 42, '#34d399');

        // Truncated value to fit neatly
        let displayVal = spec.val;
        ctx.font = 'bold 23px Arial, sans-serif';
        if (ctx.measureText(displayVal).width > cardW - 28) {
          while (ctx.measureText(displayVal + '...').width > cardW - 28 && displayVal.length > 3) {
            displayVal = displayVal.slice(0, -1);
          }
          displayVal += '...';
        }

        ctx.fillStyle = theme === 'clean-white' ? '#0f172a' : '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(displayVal, cardX + cardW / 2, specsY + 98);
        ctx.textAlign = 'left';
      });

      // 6. Perks Included Section
      const perksLabelY = specsY + specsH + 34;
      ctx.font = 'bold 19px Arial, sans-serif';
      ctx.fillStyle = theme === 'clean-white' ? '#64748b' : '#94a3b8';
      ctx.fillText('PERKS INCLUDED:', contentX, perksLabelY);

      const activePerksList: string[] = [];
      if (perks.khalaMaid) activePerksList.push('🍳 Khala / Cook');
      if (perks.wifi) activePerksList.push('📶 WiFi');
      if (perks.fridge) activePerksList.push('🧊 Fridge');
      if (perks.attachedBath) activePerksList.push('🚿 Attached Bath');
      if (perks.balcony) activePerksList.push('🌿 Balcony');
      if (perks.generator) activePerksList.push('⚡ Generator');

      let perkX = contentX;
      let perkY = perksLabelY + 16;
      ctx.font = 'bold 21px Arial, sans-serif';

      activePerksList.forEach((perk) => {
        const textWidth = ctx.measureText(perk).width;
        const pillWidth = textWidth + 36;
        const pillHeight = 44;

        if (perkX + pillWidth > contentX + contentW) {
          perkX = contentX;
          perkY += 54;
        }

        const pBg =
          theme === 'clean-white' ? '#ecfdf5' : 'rgba(16, 185, 129, 0.20)';
        const pBorder =
          theme === 'clean-white' ? '#a7f3d0' : 'rgba(52, 211, 153, 0.35)';

        fillRoundedRect(perkX, perkY, pillWidth, pillHeight, 12, pBg, pBorder, 1.5);

        ctx.fillStyle = theme === 'clean-white' ? '#065f46' : '#6ee7b7';
        ctx.fillText(perk, perkX + 18, perkY + 30);

        perkX += pillWidth + 12;
      });

      // 7. Contact / Visiting Box (Footer)
      const footerH = 190;
      const footerY = height - 60 - footerH;
      const footerBg =
        theme === 'clean-white' ? '#0f172a' : 'rgba(0, 0, 0, 0.45)';
      const footerBorder =
        theme === 'clean-white' ? '#1e293b' : 'rgba(255, 255, 255, 0.12)';

      fillRoundedRect(contentX, footerY, contentW, footerH, 24, footerBg, footerBorder, 1.5);

      // Contact texts
      ctx.font = 'bold 18px Arial, sans-serif';
      ctx.fillStyle = '#34d399';
      ctx.fillText('CONTACT / ROOM VISIT:', contentX + 36, footerY + 48);

      // Phone icon and number
      drawPhoneIcon(contentX + 50, footerY + 102, '#34d399');

      ctx.font = '900 44px Arial, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(phone, contentX + 78, footerY + 114);

      ctx.font = 'bold 18px Arial, sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('Scan QR code for online listing', contentX + 36, footerY + 158);

      // QR Code Container
      const qrBoxSize = 150;
      const qrBoxX = contentX + contentW - 24 - qrBoxSize;
      const qrBoxY = footerY + (footerH - qrBoxSize) / 2;

      fillRoundedRect(qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, 18, '#ffffff');

      if (qrImg) {
        ctx.drawImage(qrImg, qrBoxX + 10, qrBoxY + 10, qrBoxSize - 20, qrBoxSize - 20);
      }

      // 8. Trigger Download
      const mime = format === 'png' ? 'image/png' : 'image/jpeg';
      const fileExt = format === 'png' ? 'png' : 'jpg';
      const dataUrl = canvas.toDataURL(mime, 0.95);
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `SEU_Rent_Banner_${area.replace(/[^a-zA-Z0-9]/g, '_')}.${fileExt}`;
      a.click();
      setDownloading(false);
    };

    // Load QR Code before triggering export
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
          <div className="grid grid-cols-2 gap-3">
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
          <div className="grid grid-cols-2 gap-3">
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
                {MONTHS_LIST.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Seat count & Contact Phone */}
          <div className="grid grid-cols-2 gap-3">
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
          {/* Dynamic HTML Poster Preview that matches export */}
          <div
            className={`w-full max-w-lg aspect-[4/5] rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl transition-all duration-300 relative overflow-hidden border-4 ${
              theme === 'seu-emerald'
                ? 'bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-950 text-white border-emerald-500/40'
                : theme === 'dark-slate'
                ? 'bg-gradient-to-br from-slate-900 via-slate-950 to-black text-white border-slate-700'
                : 'bg-white text-slate-900 border-emerald-600'
            }`}
          >
            {/* Header Brand Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <div className="flex items-center gap-1.5 font-black text-lg sm:text-xl">
                  <span>TO LET</span>
                  <span className="text-emerald-400">SEU</span>
                </div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Southeast University Student Mess
                </p>
              </div>

              <span
                className={`px-3 py-1 rounded-xl text-xs font-black shadow ${
                  gender === 'Male'
                    ? 'bg-blue-600 text-white'
                    : 'bg-rose-600 text-white'
                }`}
              >
                {gender.toUpperCase()} ONLY
              </span>
            </div>

            {/* Headline */}
            <div className="my-3">
              <h2 className="text-xl sm:text-2xl font-black leading-snug line-clamp-3">
                {headline}
              </h2>
            </div>

            {/* Rent Card */}
            <div
              className={`p-4 rounded-2xl flex items-center justify-between shadow-lg ${
                theme === 'clean-white'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-amber-500 text-slate-950'
              }`}
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider block opacity-80">
                  Monthly Rent
                </span>
                <span className="text-2xl sm:text-3xl font-black">
                  BDT {rent}
                </span>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-xl bg-black/15">
                {billsIncluded ? '⚡ Bills Included' : '+ Utility Bills'}
              </span>
            </div>

            {/* 3 Specs Badges */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div
                className={`p-2.5 rounded-xl text-xs font-semibold ${
                  theme === 'clean-white' ? 'bg-slate-100 text-slate-800' : 'bg-white/10 text-white'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 mx-auto mb-1 text-emerald-400" />
                <span className="block font-bold truncate">{area}</span>
              </div>

              <div
                className={`p-2.5 rounded-xl text-xs font-semibold ${
                  theme === 'clean-white' ? 'bg-slate-100 text-slate-800' : 'bg-white/10 text-white'
                }`}
              >
                <Calendar className="w-3.5 h-3.5 mx-auto mb-1 text-emerald-400" />
                <span className="block font-bold">{month}</span>
              </div>

              <div
                className={`p-2.5 rounded-xl text-xs font-semibold ${
                  theme === 'clean-white' ? 'bg-slate-100 text-slate-800' : 'bg-white/10 text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5 mx-auto mb-1 text-emerald-400" />
                <span className="block font-bold">{seats}</span>
              </div>
            </div>

            {/* Amenities Grid */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                Perks Included:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {perks.khalaMaid && (
                  <span className="text-[11px] px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                    🍳 Khala / Cook
                  </span>
                )}
                {perks.wifi && (
                  <span className="text-[11px] px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                    📶 WiFi
                  </span>
                )}
                {perks.fridge && (
                  <span className="text-[11px] px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                    🧊 Fridge
                  </span>
                )}
                {perks.attachedBath && (
                  <span className="text-[11px] px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                    🚿 Attached Bath
                  </span>
                )}
                {perks.balcony && (
                  <span className="text-[11px] px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                    🌿 Balcony
                  </span>
                )}
              </div>
            </div>

            {/* Footer Contact + QR Code */}
            <div className="p-3.5 rounded-2xl bg-black/40 backdrop-blur-md flex items-center justify-between border border-white/10 mt-2">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                  Contact / Room Visit:
                </span>
                <p className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>{phone}</span>
                </p>
                <p className="text-[10px] text-slate-400">
                  Scan QR code for online listing
                </p>
              </div>

              {qrCodeUrl && (
                <div className="bg-white p-1 rounded-xl shadow shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={qrCodeUrl} alt="QR" className="w-16 h-16" />
                </div>
              )}
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
