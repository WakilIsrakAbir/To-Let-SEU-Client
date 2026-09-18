'use client';

import React from 'react';
import { IAmenities } from '@/types/post';
import { useTheme } from '@/context/ThemeContext';
import {
  ChefHat,
  Refrigerator,
  Wifi,
  Bath,
  SunMedium,
  Zap,
  ArrowUpDown,
  Droplets,
} from 'lucide-react';

interface AmenitiesBadgesProps {
  amenities?: IAmenities;
}

export default function AmenitiesBadges({ amenities }: AmenitiesBadgesProps) {
  const { currentTheme, isDark } = useTheme();

  if (!amenities) return null;

  const items = [
    { key: 'khalaMaid', label: 'Khala / Cook Maid', icon: ChefHat, active: amenities.khalaMaid },
    { key: 'fridge', label: 'Fridge', icon: Refrigerator, active: amenities.fridge },
    { key: 'wifi', label: 'WiFi', icon: Wifi, active: amenities.wifi },
    { key: 'attachedBath', label: 'Attached Bath', icon: Bath, active: amenities.attachedBath },
    { key: 'balcony', label: 'Balcony', icon: SunMedium, active: amenities.balcony },
    { key: 'generatorIPS', label: 'Generator / IPS', icon: Zap, active: amenities.generatorIPS },
    { key: 'lift', label: 'Lift', icon: ArrowUpDown, active: amenities.lift },
    { key: 'filterWater', label: 'Filter Water', icon: Droplets, active: amenities.filterWater },
  ];

  const activeAmenities = items.filter((item) => item.active);

  if (activeAmenities.length === 0) {
    return (
      <span className="text-xs text-slate-400 italic">No specific amenities listed</span>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {activeAmenities.map((item) => {
        const Icon = item.icon;
        return (
          <span
            key={item.key}
            style={{
              backgroundColor: isDark ? `${currentTheme.hex}18` : currentTheme.lightHex,
              color: isDark ? currentTheme.hex : currentTheme.textHex,
              borderColor: isDark ? `${currentTheme.hex}40` : currentTheme.borderHex,
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold border shadow-xs transition-colors"
          >
            <Icon className="w-3.5 h-3.5" style={{ color: currentTheme.hex }} />
            <span>{item.label}</span>
          </span>
        );
      })}
    </div>
  );
}
