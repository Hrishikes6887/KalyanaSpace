import { storage } from './storage';
import { VenueAvailability } from '../types';

export const availabilityService = {
  getVenueAvailability(venueId: string): VenueAvailability[] {
    return storage.getAvailability().filter(a => a.venueId === venueId);
  },

  getDateStatus(venueId: string, dateStr: string): VenueAvailability | undefined {
    return storage.getAvailability().find(a => a.venueId === venueId && a.date === dateStr);
  },

  blockDate(venueId: string, dateStr: string, notes = 'Owner blocked date'): { success: boolean; error?: string; record?: VenueAvailability } {
    const list = storage.getAvailability();
    const existing = list.find(a => a.venueId === venueId && a.date === dateStr);

    if (existing && existing.status === 'booked') {
      return {
        success: false,
        error: `Cannot modify this date: already confirmed for booking ${existing.bookingRef || ''}.`,
      };
    }

    if (existing) {
      existing.status = 'blocked';
      existing.notes = notes;
      storage.setAvailability(list);
      return { success: true, record: existing };
    }

    const newRecord: VenueAvailability = {
      id: `av_${Date.now()}`,
      venueId,
      date: dateStr,
      status: 'blocked',
      notes,
    };

    list.push(newRecord);
    storage.setAvailability(list);
    return { success: true, record: newRecord };
  },

  unblockDate(venueId: string, dateStr: string): { success: boolean; error?: string } {
    const list = storage.getAvailability();
    const existing = list.find(a => a.venueId === venueId && a.date === dateStr);

    if (!existing) {
      return { success: true }; // already free
    }

    if (existing.status === 'booked') {
      return {
        success: false,
        error: 'Cannot unblock this date! A confirmed customer booking is registered for this date.',
      };
    }

    const filtered = list.filter(a => !(a.venueId === venueId && a.date === dateStr));
    storage.setAvailability(filtered);
    return { success: true };
  }
};
