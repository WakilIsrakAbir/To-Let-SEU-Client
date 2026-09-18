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
    if (!ctx) return;

    // 1. Background Fill
    if (theme === 'seu-emerald') {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#064e3b'); // emerald-900
      grad.addColorStop(0.5, '#047857'); // emerald-700
      grad.addColorStop(1, '#0f172a'); // slate-900
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    } else if (theme === 'dark-slate') {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#0f172a');
      grad.addColorStop(1, '#020617');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    } else {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
    }

    // Border decorative frame
    ctx.strokeStyle = theme === 'clean-white' ? '#0d9488' : '#34d399';
    ctx.lineWidth = 14;
    ctx.strokeRect(30, 30, width - 60, height - 60);

    // 2. Top Header Brand Bar
    ctx.fillStyle = theme === 'clean-white' ? '#f0fdf4' : 'rgba(255, 255, 255, 0.08)';
    ctx.roundRect(60, 60, width - 120, 140, 24);
    ctx.fill();

    // Brand Logo & Title
    ctx.fillStyle = theme === 'clean-white' ? '#065f46' : '#ffffff';
    ctx.font = 'bold 44px Arial, sans-serif';
    ctx.fillText('TO LET SEU • Bachelor Housing', 90, 130);

    ctx.fillStyle = theme === 'clean-white' ? '#047857' : '#34d399';
    ctx.font = 'bold 22px Arial, sans-serif';
    ctx.fillText('SOUTHEAST UNIVERSITY STUDENT HOUSING', 90, 168);

    // Gender Tag Top Right
    ctx.fillStyle = gender === 'Male' ? '#2563eb' : '#e11d48';
    ctx.roundRect(width - 320, 95, 220, 70, 18);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 30px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${gender.toUpperCase()} ONLY`, width - 210, 142);
    ctx.textAlign = 'left';

    // 3. Main Headline
    ctx.fillStyle = theme === 'clean-white' ? '#0f172a' : '#ffffff';
    ctx.font = 'bold 52px Arial, sans-serif';

    // Word wrap headline
    const words = headline.split(' ');
    let line = '';
    let y = 280;
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > width - 180 && n > 0) {
        ctx.fillText(line, 90, y);
        line = words[n] + ' ';
        y += 64;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 90, y);

    // 4. Rent Highlight Box
    const rentBoxY = Math.max(y + 40, 420);
    ctx.fillStyle = theme === 'clean-white' ? '#047857' : '#f59e0b';
    ctx.roundRect(90, rentBoxY, width - 180, 160, 24);
    ctx.fill();

    ctx.fillStyle = theme === 'clean-white' ? '#ffffff' : '#0f172a';
    ctx.font = 'bold 30px Arial, sans-serif';
    ctx.fillText('MONTHLY RENT', 130, rentBoxY + 55);

    ctx.font = 'black 66px Arial, sans-serif';
    ctx.fillText(`BDT ${rent} / mo`, 130, rentBoxY + 125);

    ctx.font = 'bold 26px Arial, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(
      billsIncluded ? '⚡ Bills Included' : '+ Utility Bills',
      width - 130,
      rentBoxY + 125
    );
    ctx.textAlign = 'left';

    // 5. Specs Grid (Area, Available Month, Seats)
    const specsY = rentBoxY + 200;
    const specCards = [
      { label: 'AREA / LOCATION', val: area },
      { label: 'AVAILABLE FROM', val: month },
      { label: 'ROOM / CAPACITY', val: `${seats} Available` },
    ];

    specCards.forEach((spec, i) => {
      const cardX = 90 + i * ((width - 180 - 40) / 3 + 20);
      const cardW = (width - 180 - 40) / 3;

      ctx.fillStyle =
        theme === 'clean-white' ? '#f8fafc' : 'rgba(255, 255, 255, 0.07)';
      ctx.roundRect(cardX, specsY, cardW, 130, 20);
      ctx.fill();

      ctx.fillStyle = theme === 'clean-white' ? '#64748b' : '#94a3b8';
      ctx.font = 'bold 20px Arial, sans-serif';
      ctx.fillText(spec.label, cardX + 24, specsY + 45);

      ctx.fillStyle = theme === 'clean-white' ? '#0f172a' : '#ffffff';
      ctx.font = 'bold 28px Arial, sans-serif';
      ctx.fillText(spec.val.substring(0, 18), cardX + 24, specsY + 95);
    });

    // 6. Amenities Badges Row
    const amenY = specsY + 175;
    ctx.fillStyle = theme === 'clean-white' ? '#334155' : '#e2e8f0';
    ctx.font = 'bold 28px Arial, sans-serif';
    ctx.fillText('PERKS & AMENITIES INCLUDED:', 90, amenY);

    const activePerkLabels = Object.entries(perks)
      .filter(([_, active]) => active)
      .map(([k]) => {
        if (k === 'khalaMaid') return '🍳 Khala / Cook';
        if (k === 'wifi') return '📶 High-Speed WiFi';
        if (k === 'fridge') return '🧊 Refrigerator';
        if (k === 'attachedBath') return '🚿 Attached Bath';
        if (k === 'balcony') return '🌿 Balcony';
        if (k === 'generator') return '⚡ Generator Backup';
        return k;
      });

    let perkX = 90;
    let perkY = amenY + 40;
    activePerkLabels.forEach((label) => {
      ctx.font = 'bold 24px Arial, sans-serif';
      const textW = ctx.measureText(label).width;

      if (perkX + textW + 50 > width - 90) {
        perkX = 90;
        perkY += 60;
      }

      ctx.fillStyle =
        theme === 'clean-white' ? '#ecfdf5' : 'rgba(16, 185, 129, 0.2)';
      ctx.roundRect(perkX, perkY - 32, textW + 36, 48, 14);
      ctx.fill();

      ctx.fillStyle = theme === 'clean-white' ? '#065f46' : '#34d399';
      ctx.fillText(label, perkX + 18, perkY);
      perkX += textW + 50;
    });

    // 7. Contact & QR Code Footer Box
    const footerY = 1060;
    ctx.fillStyle = theme === 'clean-white' ? '#0f172a' : '#03251e';
    ctx.roundRect(90, footerY, width - 180, 210, 26);
    ctx.fill();

    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 26px Arial, sans-serif';
    ctx.fillText('FOR DETAILS & VISITING ROOM, CALL:', 130, footerY + 60);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'black 54px Arial, sans-serif';
    ctx.fillText(`📞 ${phone}`, 130, footerY + 130);

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 22px Arial, sans-serif';
    ctx.fillText('Southeast University Verified Bachelor Mess', 130, footerY + 175);

    // Draw QR Code onto Canvas
    if (qrCodeUrl) {
      const qrImg = new Image();
      qrImg.src = qrCodeUrl;
      qrImg.onload = () => {
        ctx.fillStyle = '#ffffff';
        ctx.roundRect(width - 270, footerY + 30, 150, 150, 16);
        ctx.fill();
        ctx.drawImage(qrImg, width - 260, footerY + 40, 130, 130);

        // Finish and download
        const mime = format === 'png' ? 'image/png' : 'image/jpeg';
        const fileExt = format === 'png' ? 'png' : 'jpg';
        const dataUrl = canvas.toDataURL(mime, 0.95);
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `SEU_Basa_Rent_Poster_${area.replace(/[^a-zA-Z0-9]/g, '_')}.${fileExt}`;
        a.click();
        setDownloading(false);
      };
      return;
    }

    // Fallback if no QR
    const mime = format === 'png' ? 'image/png' : 'image/jpeg';
    const dataUrl = canvas.toDataURL(mime, 0.95);
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `SEU_Basa_Rent_Poster.${format}`;
    a.click();
    setDownloading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Banner */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-3 border border-amber-200">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Auto Rent Poster & Flyer Generator</span>
        </div>
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
          <div className="w-full flex items-center justify-between mb-3 px-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Live Flyer Preview (Auto-Synced)</span>
            </span>

            <span className="text-xs text-slate-500 font-semibold">
              300 DPI Export Ready
            </span>
          </div>

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
