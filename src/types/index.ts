export type UserRole = 'customer' | 'owner' | 'admin';

export type UserStatus = 'active' | 'suspended' | 'pending';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  avatarUrl?: string;
  businessName?: string;
}

export type VenueCategory = 
  | 'traditional_kalyana_mantapa'
  | 'luxury_convention_center'
  | 'modern_banquet_hall'
  | 'heritage_palace_lawn'
  | 'resort_wedding_venue'
  | 'community_mini_hall';

export type VenueStatus = 'published' | 'draft' | 'pending_approval' | 'rejected' | 'suspended';

export type KarnatakaCity = 'Bengaluru' | 'Mysuru' | 'Hubballi' | 'Belagavi' | 'Mangaluru';

export interface VenueAmenity {
  id: string;
  name: string;
  icon?: string;
  category: 'general' | 'dining' | 'rooms' | 'parking' | 'audio_stage';
}

export interface VenuePhoto {
  id: string;
  url: string;
  caption: string;
  isPrimary?: boolean;
}

export interface Venue {
  id: string;
  ownerId: string;
  name: string;
  tagline: string;
  category: VenueCategory;
  city: KarnatakaCity;
  locality: string;
  address: string;
  pinCode: string;
  googleMapsUrl?: string;
  description: string;
  
  // Capacity & Pricing
  guestCapacityMin: number;
  guestCapacityMax: number;
  diningCapacity: number;
  roomsCount: number;
  startingPrice: number; // In INR per day/slot
  pricingType: 'per_day' | 'per_plate' | 'morning_slot' | 'evening_slot';
  pricingNotes: string;
  advancePercentage: number;
  cancellationPolicy: string;

  // Features
  hasAC: boolean;
  hasParking: boolean;
  parkingCapacity: number;
  hasInhouseCatering: boolean;
  allowOutsideCatering: boolean;
  cateringType: 'veg_only' | 'veg_and_nonveg';
  hasPowerBackup: boolean;
  hasBridalRooms: boolean;
  hasDecorationInhouse: boolean;

  // Visuals
  images: string[];
  featuredImage: string;

  // Ratings & Status
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  isFeatured: boolean;
  status: VenueStatus;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export type EnquiryStatus = 
  | 'new'
  | 'contacted'
  | 'followup_required'
  | 'visit_scheduled'
  | 'quotation_shared'
  | 'converted'
  | 'closed'
  | 'withdrawn';

export interface EnquiryNote {
  id: string;
  authorId: string;
  authorName: string;
  note: string;
  createdAt: string;
}

export interface Enquiry {
  id: string;
  venueId: string;
  venueName: string;
  venueCity: string;
  ownerId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  eventType: 'wedding' | 'reception' | 'engagement' | 'sangeet' | 'thread_ceremony' | 'anniversary' | 'other';
  eventDate: string; // YYYY-MM-DD
  guestCount: number;
  estimatedBudget: number; // in INR
  additionalRequirements?: string;
  status: EnquiryStatus;
  notes: EnquiryNote[];
  followUpDate?: string;
  visitDate?: string;
  quotationAmount?: number;
  assignedCoordinator?: string;
  createdAt: string;
  updatedAt: string;
}

export type BookingStatus = 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  referenceNo: string;
  enquiryId?: string;
  venueId: string;
  venueName: string;
  venueCity: string;
  ownerId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  eventDate: string; // YYYY-MM-DD
  guestCount: number;
  agreedPrice: number;
  advancePaid: number;
  advancePaymentStatus: 'paid' | 'pending' | 'partially_paid';
  status: BookingStatus;
  createdAt: string;
}

export interface VenueAvailability {
  id: string;
  venueId: string;
  date: string; // YYYY-MM-DD
  status: 'available' | 'booked' | 'blocked';
  notes?: string;
  bookingRef?: string;
}

export interface Review {
  id: string;
  venueId: string;
  customerId: string;
  customerName: string;
  customerCity?: string;
  rating: number; // 1-5
  comment: string;
  eventDate: string;
  createdAt: string;
  verifiedBooking: boolean;
}

export interface ActivityLog {
  id: string;
  actorId: string;
  actorName: string;
  action: string;
  targetType: 'venue' | 'enquiry' | 'booking' | 'user';
  targetId: string;
  description: string;
  timestamp: string;
}

export interface VenueFilterCriteria {
  city?: string;
  searchQuery?: string;
  minPrice?: number;
  maxPrice?: number;
  minGuests?: number;
  category?: string;
  hasAC?: boolean;
  hasParking?: boolean;
  cateringType?: string;
  isVerified?: boolean;
  minRating?: number;
  sortBy?: 'recommended' | 'price_asc' | 'price_desc' | 'rating' | 'capacity_desc';
}
