'use client';

import React, { useState } from 'react';
import { ILocation } from '@/types/post';
import { MapPin, Navigation, Check, Building2 } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface LocationPickerProps {
  location: ILocation;
  onChange: (loc: ILocation) => void;
}

const SEU_LANDMARKS = [
  { name: 'SEU Tejgaon Permanent Campus', lat: 23.7639, lng: 90.3995 },
  { name: 'Mohakhali Wireless Gate', lat: 23.7788, lng: 90.4054 },
  { name: 'Nakhalpara Rail Gate', lat: 23.7682, lng: 90.3951 },
  { name: 'Farmgate Ananda Cinema', lat: 23.7571, lng: 90.3888 },
  { name: 'Banani Road 11', lat: 23.7937, lng: 90.4066 },
  { name: 'Bijoy Sarani Metro Station', lat: 23.7656, lng: 90.3872 },
];

export default function LocationPicker({ location, onChange }: LocationPickerProps) {
  const { currentTheme, isDark } = useTheme();
  const [detecting, setDetecting] = useState(false);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onChange({
          lat: Number(pos.coords.latitude.toFixed(5)),
          lng: Number(pos.coords.longitude.toFixed(5)),
          formattedAddress: 'My Live GPS Location',
        });
        setDetecting(false);
      },
      (err) => {
        alert(`Location error: ${err.message}`);
        setDetecting(false);
      }
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="label p-0 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <MapPin className="w-4 h-4" style={{ color: currentTheme.hex }} />
          <span>Live Location & Proximity Pin</span>
        </label>

        <button
          type="button"
          onClick={handleGetCurrentLocation}
          disabled={detecting}
          style={{
            backgroundColor: isDark ? `${currentTheme.hex}25` : currentTheme.lightHex,
            color: isDark ? currentTheme.hex : currentTheme.textHex,
            borderColor: isDark ? `${currentTheme.hex}50` : currentTheme.borderHex,
          }}
          className="btn btn-xs rounded-lg flex items-center gap-1 font-bold border transition hover:opacity-90"
        >
          <Navigation className="w-3 h-3" />
          <span>{detecting ? 'Locating...' : 'Use My GPS Location'}</span>
        </button>
      </div>

      {/* Quick Landmark Buttons */}
      <div>
        <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
          Quick Preset Nearby SEU Campus:
        </span>
        <div className="flex flex-wrap gap-2">
          {SEU_LANDMARKS.map((landmark) => {
            const isSelected =
              Math.abs(location.lat - landmark.lat) < 0.001 &&
              Math.abs(location.lng - landmark.lng) < 0.001;

            return (
              <button
                key={landmark.name}
                type="button"
                onClick={() =>
                  onChange({
                    lat: landmark.lat,
                    lng: landmark.lng,
                    formattedAddress: landmark.name,
                  })
                }
                style={{
                  backgroundColor: isSelected ? currentTheme.hex : undefined,
                  borderColor: isSelected ? currentTheme.hex : undefined,
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 ${
                  isSelected
                    ? 'text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                <Building2 className="w-3 h-3" />
                <span>{landmark.name}</span>
                {isSelected && <Check className="w-3 h-3 text-white" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Lat & Lng Input Row */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label text-[11px] font-bold text-slate-600">
            Latitude
          </label>
          <input
            type="number"
            step="0.0001"
            value={location.lat}
            onChange={(e) =>
              onChange({ ...location, lat: parseFloat(e.target.value) || 0 })
            }
            className="input input-sm input-bordered w-full rounded-xl bg-slate-50 text-xs font-mono"
          />
        </div>

        <div>
          <label className="label text-[11px] font-bold text-slate-600">
            Longitude
          </label>
          <input
            type="number"
            step="0.0001"
            value={location.lng}
            onChange={(e) =>
              onChange({ ...location, lng: parseFloat(e.target.value) || 0 })
            }
            className="input input-sm input-bordered w-full rounded-xl bg-slate-50 text-xs font-mono"
          />
        </div>
      </div>
    </div>
  );
}
