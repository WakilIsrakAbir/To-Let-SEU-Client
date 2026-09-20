export type RentType = 'fixed' | 'negotiable';
export type GenderPreference = 'Male' | 'Female' | 'Any';
export type RoomType =
  | '2 Person Room'
  | '3 Person Room'
  | 'Single Room'
  | 'Sublet'
  | 'Shared Seat'
  | 'Master Bed'
  | string;

export interface IAmenities {
  khalaMaid: boolean;
  fridge: boolean;
  wifi: boolean;
  attachedBath: boolean;
  balcony: boolean;
  generatorIPS: boolean;
  lift: boolean;
  filterWater: boolean;
}

export interface ILocation {
  lat: number;
  lng: number;
  formattedAddress?: string;
}

export interface IMediaItem {
  url: string;
  publicId: string;
  sizeBytes?: number;
}

export interface IPost {
  _id: string;
  title: string;
  author: {
    _id: string;
    name: string;
    email: string;
    department?: string;
    avatarUrl?: string;
    isVerifiedStudent?: boolean;
    phone?: string;
  };
  department: string;
  contactNumber: string;
  whatsappNumber?: string;
  area: string;
  addressDetails: string;
  distanceFromCampus?: string;
  
  rentType: RentType;
  rentAmount: number;
  serviceChargeIncluded?: boolean;
  
  gender: 'Male' | 'Female';
  availableFromMonth: string;
  seatCount: number;
  roomType: RoomType;
  
  description: string;
  amenities: IAmenities;
  location: ILocation;
  
  media: {
    images: IMediaItem[]; // max 5, auto-compressed WebP (<450KB each)
    video?: IMediaItem; // Optional / legacy backwards compatibility
  };
  
  status: 'active' | 'booked' | 'archived';
  viewsCount: number;
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IPostFilterQuery {
  area?: string;
  gender?: string;
  minRent?: number;
  maxRent?: number;
  isNegotiable?: boolean;
  month?: string;
  roomType?: string;
  amenities?: string[];
  sort?: 'newest' | 'rent_asc' | 'rent_desc';
  page?: number;
  limit?: number;
}
