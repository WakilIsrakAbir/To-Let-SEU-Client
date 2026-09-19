'use client';

import React from 'react';
import { IAmenities } from '@/types/post';
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
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {activeAmenities.map((item) => {
        const Icon = item.icon;
        return (
          <span
            key={item.key}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 transition-colors"
          >
            <Icon className="w-3.5 h-3.5 shrink-0 text-slate-400 dark:text-slate-500" />
            <span>{item.label}</span>
          </span>
        );
      })}
    </div>
  );
}
