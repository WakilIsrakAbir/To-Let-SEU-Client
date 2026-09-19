'use client';

import React from 'react';
import { DHAKA_AREAS, MONTHS_LIST } from '@/lib/constants';
import { Filter, RotateCcw, Sliders, MapPin, DollarSign, Users, Calendar } from 'lucide-react';
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
  isMobileDrawer?: boolean;
}

export default function FilterSidebar({
  filters,
  onChange,
  onReset,
  totalResults,
  isMobileDrawer = false,
}: FilterSidebarProps) {
  const { currentTheme, isDark } = useTheme();
  const selectedAreas = filters.area
    ? filters.area.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  const handleAreaToggle = (areaName: string) => {
    let nextAreas: string[];
    if (selectedAreas.includes(areaName)) {
      nextAreas = selectedAreas.filter((a) => a !== areaName);
    } else {
      nextAreas = [...selectedAreas, areaName];
    }
    onChange({
      ...filters,
      area: nextAreas.join(','),
    });
  };

  const filterControls = (
    <>
      {/* 1. Gender Preference */}
      <div>
        <label className="label text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <Users className="w-4 h-4" style={{ color: currentTheme.hex }} />
          <span>Rent For (Gender)</span>
        </label>
        <div className="grid grid-cols-3 gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-xl">
          {['All', 'Male', 'Female'].map((gender) => {
            const isSelected = (gender === 'All' && !filters.gender) || filters.gender === gender;
            return (
              <button
                key={gender}
                type="button"
                onClick={() =>
                  onChange({
                    ...filters,
                    gender: gender === 'All' ? '' : gender,
                  })
                }
                style={{
                  backgroundColor: isSelected
                    ? currentTheme.hex
                    : undefined,
                  color: isSelected
                    ? '#ffffff'
                    : undefined,
                }}
                className={`py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                  isSelected
                    ? 'shadow-sm text-white font-extrabold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {gender}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Available Month */}
      <div>
        <label className="label text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <Calendar className="w-4 h-4" style={{ color: currentTheme.hex }} />
          <span>Available From</span>
        </label>
        <select
          value={filters.month}
          onChange={(e) => onChange({ ...filters, month: e.target.value })}
          className="select select-bordered select-sm sm:select-md w-full rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-slate-200"
        >
          <option value="">Any Month</option>
          {MONTHS_LIST.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      {/* 3. Top Areas near SEU */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="label text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider p-0 flex items-center gap-1.5">
            <MapPin className="w-4 h-4" style={{ color: currentTheme.hex }} />
            <span>Area / Location</span>
          </label>
          {selectedAreas.length > 0 && (
            <button
              onClick={() => onChange({ ...filters, area: '' })}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 underline font-medium"
            >
              Clear
            </button>
          )}
        </div>
        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
          {DHAKA_AREAS.map((area) => {
            const isChecked = selectedAreas.includes(area);
            const isOther = area === 'Other';
            return (
              <label
                key={area}
                style={{
                  backgroundColor: isChecked ? (isDark ? `${currentTheme.hex}25` : currentTheme.lightHex) : undefined,
                  color: isChecked ? (isDark ? currentTheme.hex : currentTheme.textHex) : undefined,
                  borderColor: isChecked ? currentTheme.borderHex : undefined,
                }}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium cursor-pointer transition ${
                  isChecked
                    ? 'font-bold border'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleAreaToggle(area)}
                  className="checkbox checkbox-sm checkbox-primary rounded-md"
                />
                <div className="flex flex-col min-w-0">
                  <span className="truncate">{area}</span>
                  {isOther && (
                    <span className="text-xs opacity-75 font-normal">
                      Areas outside top 9 (Badda, Uttara, etc.)
                    </span>
                  )}
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* 4. Rent Price Range */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="label p-0 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <DollarSign className="w-4 h-4" style={{ color: currentTheme.hex }} />
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

        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
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
            className="toggle toggle-sm toggle-primary"
          />
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Show Negotiable Only
          </span>
        </label>
      </div>
    </>
  );

  if (isMobileDrawer) {
    return <div className="space-y-6 pb-2">{filterControls}</div>;
  }

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
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base sm:text-lg">Filter Rooms</h3>
            <span
              style={{ color: currentTheme.hex }}
              className="text-xs sm:text-sm font-bold"
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

      {filterControls}
    </aside>
  );
}
