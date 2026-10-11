import { ActivityLog } from '../types';

export const SEED_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'act_1',
    actorId: 'user_admin_1',
    actorName: 'Pooja Hegde (Admin)',
    action: 'venue_approved',
    targetType: 'venue',
    targetId: 'venue_1',
    description: 'Verified documents and approved Sri Krishna Grand Convention Centre for public marketplace.',
    timestamp: '2024-03-01T10:00:00Z',
  },
  {
    id: 'act_2',
    actorId: 'user_customer_1',
    actorName: 'Ananya & Karthik Rao',
    action: 'enquiry_created',
    targetType: 'enquiry',
    targetId: 'ENQ-2024-8192',
    description: 'Submitted enquiry for Sri Krishna Grand Convention Centre for 2025-01-24.',
    timestamp: '2024-02-28T14:22:00Z',
  },
  {
    id: 'act_3',
    actorId: 'user_owner_1',
    actorName: 'Suresh Gowda (Owner)',
    action: 'status_updated',
    targetType: 'enquiry',
    targetId: 'ENQ-2024-8192',
    description: 'Scheduled site visit with customer parents on 2024-03-16.',
    timestamp: '2024-03-02T11:00:00Z',
  },
  {
    id: 'act_4',
    actorId: 'user_owner_1',
    actorName: 'Suresh Gowda (Owner)',
    action: 'booking_confirmed',
    targetType: 'booking',
    targetId: 'bkg_1',
    description: 'Recorded advance token of ₹92,500 and confirmed booking BKG-2024-501.',
    timestamp: '2024-03-05T10:00:00Z',
  },
  {
    id: 'act_5',
    actorId: 'user_admin_1',
    actorName: 'Pooja Hegde (Admin)',
    action: 'venue_flagged',
    targetType: 'venue',
    targetId: 'venue_14',
    description: 'Placed Kanakadasa Smaraka Convention Centre in pending review queue awaiting fire NOC.',
    timestamp: '2024-03-01T09:00:00Z',
  }
];
