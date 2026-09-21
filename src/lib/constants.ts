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
  'East Nakhalpara',
  'West Nakhalpara',
  'Mohakhali',
  'Banani',
  'Begunbari',
  'Kunipara',
  'Modhubag',
  'Mogbazar',
  'Niketon',
  'Niketon Bazar Gate',
  'Farmgate',
  'Bijoy Sarani',
  'Panthapath',
  'Rampura',
  'Badda',
  'Mirpur',
  'Uttara',
  'Khilkhet',
  'Nikunja',
] as const;

export const DHAKA_AREAS = PREDEFINED_DHAKA_AREAS;

export const parseAreaValue = (area: string | undefined | null) => {
  if (!area) return { baseArea: '', customArea: '' };

  const trimmed = area.trim();
  const matchedPredefined = PREDEFINED_DHAKA_AREAS.find(
    (a) => a.toLowerCase() === trimmed.toLowerCase() || trimmed.toLowerCase().includes(a.toLowerCase())
  );
  if (matchedPredefined) {
    return { baseArea: matchedPredefined, customArea: '' };
  }

  return { baseArea: trimmed, customArea: '' };
};

export const formatAreaValue = (baseArea: string, customArea?: string) => {
  if (baseArea && baseArea !== 'Other') return baseArea.trim();
  if (customArea && customArea.trim()) return customArea.trim();
  return baseArea?.trim() || '';
};

export const getAvailableMonths = (count = 4): string[] => {
  const months: string[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const monthName = d.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
    months.push(monthName);
  }

  return months;
};

export const MONTHS_LIST: string[] = getAvailableMonths(4);

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

export const ROOM_TYPES = [
  'Single Room',
  '2 Person Room',
  '3 Person Room',
] as const;

export type RoomType = (typeof ROOM_TYPES)[number];

export const DEFAULT_ROOM_IMAGES = [
  '/default-room-1.jpg',
  '/default-room-2.jpg',
  '/default-room-3.jpg',
] as const;

export const getDefaultRoomImage = (identifier?: string | number): string => {
  if (typeof identifier === 'number') {
    return DEFAULT_ROOM_IMAGES[Math.abs(identifier) % DEFAULT_ROOM_IMAGES.length];
  }
  if (typeof identifier === 'string' && identifier.trim().length > 0) {
    let hash = 0;
    for (let i = 0; i < identifier.length; i++) {
      hash = (hash << 5) - hash + identifier.charCodeAt(i);
      hash |= 0;
    }
    return DEFAULT_ROOM_IMAGES[Math.abs(hash) % DEFAULT_ROOM_IMAGES.length];
  }
  return DEFAULT_ROOM_IMAGES[0];
};
