import { storage } from './storage';
import { Booking, BookingStatus } from '../types';

export const bookingService = {
  getAllBookings(): Booking[] {
    return storage.getBookings();
  },

  getBookingsByOwner(ownerId: string): Booking[] {
    return storage.getBookings().filter(b => b.ownerId === ownerId);
  },

  getBookingsByCustomer(customerId: string): Booking[] {
    return storage.getBookings().filter(b => b.customerId === customerId);
  },

  getBookingById(id: string): Booking | undefined {
    return storage.getBookings().find(b => b.id === id);
  },

  createBookingFromEnquiry(params: {
    enquiryId: string;
    venueId: string;
    venueName: string;
    venueCity: string;
    ownerId: string;
    customerId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    eventDate: string;
    guestCount: number;
    agreedPrice: number;
    advancePaid: number;
  }): Booking {
    const bookings = storage.getBookings();
    const refNo = `BKG-2024-${Math.floor(500 + Math.random() * 500)}`;

    const newBooking: Booking = {
      id: `bkg_${Date.now()}`,
      referenceNo: refNo,
      ...params,
      advancePaymentStatus: params.advancePaid >= params.agreedPrice ? 'paid' : (params.advancePaid > 0 ? 'partially_paid' : 'pending'),
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    bookings.unshift(newBooking);
    storage.setBookings(bookings);

    // Also mark date in availability as booked!
    const avail = storage.getAvailability();
    const existingIndex = avail.findIndex(a => a.venueId === params.venueId && a.date === params.eventDate);
    if (existingIndex !== -1) {
      avail[existingIndex].status = 'booked';
      avail[existingIndex].bookingRef = refNo;
      avail[existingIndex].notes = `Confirmed wedding booking: ${params.customerName}`;
    } else {
      avail.push({
        id: `av_${Date.now()}`,
        venueId: params.venueId,
        date: params.eventDate,
        status: 'booked',
        notes: `Confirmed wedding booking: ${params.customerName}`,
        bookingRef: refNo,
      });
    }
    storage.setAvailability(avail);

    storage.addActivityLog({
      actorId: params.ownerId,
      actorName: 'Hall Owner',
      action: 'booking_created',
      targetType: 'booking',
      targetId: newBooking.id,
      description: `Created booking ${refNo} for ${params.customerName} at ${params.venueName}`,
    });

    return newBooking;
  },

  updateBookingStatus(id: string, status: BookingStatus, adminOrOwnerName = 'Admin'): Booking | null {
    const bookings = storage.getBookings();
    const index = bookings.findIndex(b => b.id === id);
    if (index === -1) return null;

    bookings[index].status = status;
    storage.setBookings(bookings);

    storage.addActivityLog({
      actorId: 'admin_or_owner',
      actorName: adminOrOwnerName,
      action: `booking_${status}`,
      targetType: 'booking',
      targetId: id,
      description: `Booking ${bookings[index].referenceNo} updated to ${status}`,
    });

    return bookings[index];
  }
};
