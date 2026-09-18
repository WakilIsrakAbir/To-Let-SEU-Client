'use client';

import React from 'react';
import { DHAKA_AREAS, MONTHS_LIST, AMENITIES_LIST } from '@/lib/constants';
import { Filter, RotateCcw, Sliders, MapPin, DollarSign, Users, Calendar, Sparkles } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export interface FilterState {
  area: string;
  gender: string;
  minRent: number;
  maxRent: number;
  isNegotiable: boolean;
  month: string;
  roomType: string;
  amenities: string[];
}

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (newFilters: FilterState) => void;
  onReset: () => void;
  totalResults: number;
}

export default function FilterSidebar({
  filters,
  onChange,
  onReset,
  totalResults,
}: FilterSidebarProps) {
  const { currentTheme, isDark } = useTheme();
  const handleAreaToggle = (areaName: string) => {
    onChange({
      ...filters,
      area: filters.area === areaName ? '' : areaName,
    });
  };

  const handleAmenityToggle = (amenityId: string) => {
    const exists = filters.amenities.includes(amenityId);
    const newAmenities = exists
      ? filters.amenities.filter((a) => a !== amenityId)
      : [...filters.amenities, amenityId];

    onChange({
      ...filters,
      amenities: newAmenities,
    });
  };

  return (
    <aside className="w-full bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm space-y-6 sticky top-24 transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div
            style={{
              backgroundColor: isDark ? `${currentTheme.hex}25` : currentTheme.lightHex,
              color: currentTheme.hex,
            }}
            className="w-8 h-8 rounded-xl flex items-center justify-center font-bold"
          >
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Filter Rooms</h3>
            <span
              style={{ color: currentTheme.hex }}
              className="text-[11px] font-semibold"
            >
              {totalResults} {totalResults === 1 ? 'room' : 'rooms'} found
            </span>
          </div>
        </div>

        <button
          onClick={onReset}
          className="btn btn-ghost btn-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white flex items-center gap-1 font-semibold"
          title="Reset all filters"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* 1. Gender Preference */}
      <div>
        <label className="label text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5" style={{ color: currentTheme.hex }} />
          <span>Rent For (Gender)</span>
        </label>
        <div className="grid grid-cols-3 gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
          {['All', 'Male', 'Female'].map((gender) => {
            const isSelected = (gender === 'All' && !filters.gender) || filters.gender === gender;
            return (
              <button
                key={gender}
                type="button"
                onClick={() =>
                  onChange({ ...filters, gender: gender === 'All' ? '' : gender })
                }
                style={{
                  backgroundColor: isSelected ? (isDark ? currentTheme.hex : '#ffffff') : undefined,
                  color: isSelected ? (isDark ? '#ffffff' : currentTheme.textHex) : undefined,
                }}
                className={`py-1.5 rounded-lg text-xs font-bold transition ${
                  isSelected
                    ? 'shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {gender}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Top Areas near SEU */}
      <div>
        <label className="label text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5" style={{ color: currentTheme.hex }} />
          <span>Area / Location</span>
        </label>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
          {DHAKA_AREAS.map((area) => {
            const isChecked = filters.area === area;
            return (
              <label
                key={area}
                style={{
                  backgroundColor: isChecked ? (isDark ? `${currentTheme.hex}25` : currentTheme.lightHex) : undefined,
                  color: isChecked ? (isDark ? currentTheme.hex : currentTheme.textHex) : undefined,
                  borderColor: isChecked ? currentTheme.borderHex : undefined,
                }}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition ${
                  isChecked
                    ? 'font-bold border'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleAreaToggle(area)}
                  className="checkbox checkbox-xs checkbox-primary rounded"
                />
                <span className="truncate">{area}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 3. Rent Price Range */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="label p-0 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5" style={{ color: currentTheme.hex }} />
            <span>Max Rent: BDT {filters.maxRent.toLocaleString()}</span>
          </label>
        </div>

        <input
          type="range"
          min={1500}
          max={20000}
          step={500}
          value={filters.maxRent}
          onChange={(e) =>
            onChange({ ...filters, maxRent: Number(e.target.value) })
          }
          className="range range-xs range-primary"
        />

        <div className="flex justify-between text-[10px] text-slate-400 font-medium mt-1">
          <span>BDT 1,500</span>
          <span>BDT 10,000</span>
          <span>BDT 20,000</span>
        </div>

        {/* Negotiable Only Toggle */}
        <label className="label cursor-pointer justify-start gap-2.5 mt-2.5 p-0">
          <input
            type="checkbox"
            checked={filters.isNegotiable}
            onChange={(e) =>
              onChange({ ...filters, isNegotiable: e.target.checked })
            }
            className="toggle toggle-xs toggle-primary"
          />
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Show Negotiable Only
          </span>
        </label>
      </div>

      {/* 4. Available Month */}
      <div>
        <label className="label text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" style={{ color: currentTheme.hex }} />
          <span>Available From</span>
        </label>
        <select
          value={filters.month}
          onChange={(e) => onChange({ ...filters, month: e.target.value })}
          className="select select-bordered select-sm w-full rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200"
        >
          <option value="">Any Month</option>
          {MONTHS_LIST.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      {/* 5. Amenities Checkboxes */}
      <div>
        <label className="label text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" style={{ color: currentTheme.hex }} />
          <span>Perks & Amenities</span>
        </label>
        <div className="grid grid-cols-1 gap-1.5">
          {AMENITIES_LIST.map((amenity) => {
            const isChecked = filters.amenities.includes(amenity.id);
            return (
              <label
                key={amenity.id}
                style={{
                  backgroundColor: isChecked ? (isDark ? `${currentTheme.hex}25` : currentTheme.lightHex) : undefined,
                  color: isChecked ? (isDark ? currentTheme.hex : currentTheme.textHex) : undefined,
                }}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition ${
                  isChecked
                    ? 'font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleAmenityToggle(amenity.id)}
                  className="checkbox checkbox-xs checkbox-primary rounded"
                />
                <span>{amenity.label}</span>
              </label>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
