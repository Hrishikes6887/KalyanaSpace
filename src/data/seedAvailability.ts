import { VenueAvailability } from '../types';

export const SEED_AVAILABILITY: VenueAvailability[] = [
  // Sri Krishna Grand (venue_1)
  {
    id: 'av_1',
    venueId: 'venue_1',
    date: '2024-11-21',
    status: 'booked',
    notes: 'Confirmed booking for Sanjay & Meera Hebbar Wedding (BKG-2024-504)',
    bookingRef: 'BKG-2024-504',
  },
  {
    id: 'av_2',
    venueId: 'venue_1',
    date: '2024-11-22',
    status: 'booked',
    notes: 'Confirmed booking post-wedding reception',
    bookingRef: 'BKG-2024-504',
  },
  {
    id: 'av_3',
    venueId: 'venue_1',
    date: '2024-12-08',
    status: 'blocked',
    notes: 'Hall closed for annual facility maintenance and chandelier polishing',
  },
  {
    id: 'av_4',
    venueId: 'venue_1',
    date: '2024-12-09',
    status: 'blocked',
    notes: 'Hall closed for annual facility maintenance',
  },
  {
    id: 'av_5',
    venueId: 'venue_1',
    date: '2025-01-24',
    status: 'blocked',
    notes: 'Tentative reservation for Ananya & Karthik Rao enquiry',
  },
  // Tamara Palace (venue_2)
  {
    id: 'av_6',
    venueId: 'venue_2',
    date: '2024-12-12',
    status: 'booked',
    notes: 'Royal reception for Vikramaditya & Sahana (BKG-2024-505)',
    bookingRef: 'BKG-2024-505',
  },
  {
    id: 'av_7',
    venueId: 'venue_2',
    date: '2024-12-13',
    status: 'blocked',
    notes: 'Lawn rehabilitation following mega wedding',
  },
  // Malleshwaram Samskruthi (venue_7)
  {
    id: 'av_8',
    venueId: 'venue_7',
    date: '2024-11-10',
    status: 'booked',
    notes: 'Engagement ceremony for Ananya & Karthik Rao (BKG-2024-501)',
    bookingRef: 'BKG-2024-501',
  },
  // Whitefield Grand (venue_10)
  {
    id: 'av_9',
    venueId: 'venue_10',
    date: '2024-12-28',
    status: 'booked',
    notes: 'Sangeet extravaganza for Priyanka Pai (BKG-2024-502)',
    bookingRef: 'BKG-2024-502',
  },
  // Silent Shores (venue_8)
  {
    id: 'av_10',
    venueId: 'venue_8',
    date: '2025-01-18',
    status: 'booked',
    notes: 'Wedding ceremony for Priyanka Pai (BKG-2024-503)',
    bookingRef: 'BKG-2024-503',
  }
];
