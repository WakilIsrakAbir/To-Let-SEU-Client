export const SEU_DEPARTMENTS = [
  'CSE',
  'EEE',
  'BBA',
  'Textile Engineering',
  'English',
  'Law',
  'Pharmacy',
  'Economics',
  'Other',
] as const;

export const PREDEFINED_DHAKA_AREAS = [
  'Tejgaon (Near SEU Campus)',
  'Mohakhali',
  'Banani',
  'Nakhalpara',
  'Farmgate',
  'Bijoy Sarani',
  'Monipuripara',
  'Panthapath',
  'Mirpur 10/11',
] as const;

export const DHAKA_AREAS = [
  ...PREDEFINED_DHAKA_AREAS,
  'Other',
] as const;

export const parseAreaValue = (area: string | undefined | null) => {
  if (!area) return { baseArea: 'Tejgaon (Near SEU Campus)', customArea: '' };

  const trimmed = area.trim();
  const matchedPredefined = PREDEFINED_DHAKA_AREAS.find(
    (a) => a.toLowerCase() === trimmed.toLowerCase() || trimmed.toLowerCase().includes(a.toLowerCase())
  );
  if (matchedPredefined) {
    return { baseArea: matchedPredefined, customArea: '' };
  }

  // Check if format is "Other (Custom Area)" or "Other - Custom Area" or "Other: Custom Area"
  const otherWithCustom = trimmed.match(/^Other\s*[\(-:\s]+\s*([^\)]+)[\)]?$/i);
  if (otherWithCustom && otherWithCustom[1]) {
    return { baseArea: 'Other', customArea: otherWithCustom[1].trim() };
  }

  if (trimmed.toLowerCase() === 'other') {
    return { baseArea: 'Other', customArea: '' };
  }

  // If it's a custom area name (e.g. "Badda", "Uttara", "Dhanmondi")
  return { baseArea: 'Other', customArea: trimmed };
};

export const formatAreaValue = (baseArea: string, customArea?: string) => {
  if (baseArea !== 'Other') return baseArea;
  const trimmedCustom = customArea?.trim();
  if (!trimmedCustom) return 'Other';
  return `Other (${trimmedCustom})`;
};

export const MONTHS_LIST = [
  'Immediate',
  'November 2026',
  'December 2026',
  'January 2027',
  'February 2027',
  'March 2027',
  'April 2027',
  'May 2027',
  'June 2027',
  'July 2027',
  'August 2027',
  'September 2027',
  'October 2027',
] as const;

export const AMENITIES_LIST = [
  { id: 'khalaMaid', label: 'Khala / Cook Service', icon: 'ChefHat' },
  { id: 'fridge', label: 'Refrigerator', icon: 'Refrigerator' },
  { id: 'wifi', label: 'High Speed WiFi', icon: 'Wifi' },
  { id: 'attachedBath', label: 'Attached Washroom', icon: 'Bath' },
  { id: 'balcony', label: 'Balcony / Veranda', icon: 'SunMedium' },
  { id: 'generatorIPS', label: 'Generator / IPS Backup', icon: 'Zap' },
  { id: 'lift', label: 'Lift / Elevator', icon: 'ArrowUpDown' },
  { id: 'filterWater', label: 'Pure Filter Drinking Water', icon: 'Droplets' },
] as const;
