import React, { useState } from 'react';
import { bookingService } from '../../services/bookingService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Booking, BookingStatus } from '../../types';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import {
  CalendarCheck,
  Search,
  CheckCircle2,
  Clock,
  IndianRupee,
  Users,
  Building2
} from 'lucide-react';

export const AdminBookingsPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [bookings, setBookings] = useState<Booking[]>(() => bookingService.getAllBookings());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const refreshList = () => {
    setBookings(bookingService.getAllBookings());
  };

  const handleUpdateStatus = (bookingId: string, status: BookingStatus) => {
    const updated = bookingService.updateBookingStatus(bookingId, status, user?.name || 'Administrator');
    if (updated) {
      refreshList();
      showToast('success', 'Booking Updated', `Booking status changed to ${status.toUpperCase()}`);
      if (selectedBooking && selectedBooking.id === bookingId) {
        setSelectedBooking(updated);
      }
    }
  };

  const formatPrice = (p: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(p);
  };

  const filteredBookings = bookings.filter((b) =>
    b.referenceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.venueName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-rose-800 font-mono">
            Transaction Ledger
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
            Confirmed Bookings ({bookings.length})
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Confirmed wedding token reservations and mock advance payment records.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-subtle flex items-center justify-between gap-4">
        <div className="relative max-w-sm w-full">
          <input
            type="text"
            placeholder="Search booking ref, customer, or hall name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3.5 py-2 pl-9 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-700"
          />
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-mono uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Booking Ref</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Venue</th>
                <th className="py-3 px-4">Muhurtham Date</th>
                <th className="py-3 px-4">Agreed Price</th>
                <th className="py-3 px-4">Advance Paid</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredBookings.map((b) => (
                <tr key={b.id} className="hover:bg-stone-50/50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-900">
                    {b.referenceNo}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-stone-900 block">{b.customerName}</span>
                    <span className="text-[11px] text-stone-500 font-mono">{b.customerPhone}</span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-stone-800">
                    {b.venueName}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-stone-900">
                    {b.eventDate}
                  </td>
                  <td className="py-3.5 px-4 font-serif font-bold text-stone-900">
                    {formatPrice(b.agreedPrice)}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-emerald-700">
                    {formatPrice(b.advancePaid)}
                    <span className="text-[10px] text-stone-400 block font-normal capitalize">
                      {b.advancePaymentStatus.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${
                        b.status === 'confirmed'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : b.status === 'completed'
                          ? 'bg-stone-100 text-stone-700'
                          : 'bg-rose-50 text-rose-800'
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedBooking(b)}
                      className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 font-semibold text-xs"
                    >
                      View / Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <Modal
          isOpen={!!selectedBooking}
          onClose={() => setSelectedBooking(null)}
          title={`Booking: ${selectedBooking.referenceNo}`}
          subtitle={`${selectedBooking.venueName} • ${selectedBooking.eventDate}`}
          maxWidth="md"
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 p-3 bg-stone-50 rounded-xl">
              <div>
                <span className="text-stone-500 block text-[11px]">Customer</span>
                <span className="font-bold text-stone-900">{selectedBooking.customerName}</span>
                <span className="text-[11px] text-stone-500 block">{selectedBooking.customerPhone}</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[11px]">Venue & Location</span>
                <span className="font-bold text-stone-900">{selectedBooking.venueName}</span>
                <span className="text-[11px] text-stone-500 block">{selectedBooking.venueCity}</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[11px]">Agreed Price</span>
                <span className="font-serif font-bold text-stone-900 text-sm">{formatPrice(selectedBooking.agreedPrice)}</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[11px]">Advance Token</span>
                <span className="font-semibold text-emerald-800">{formatPrice(selectedBooking.advancePaid)} (Paid)</span>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Update Booking Status</label>
              <div className="grid grid-cols-2 gap-2">
                {(['confirmed', 'in_progress', 'completed', 'cancelled'] as BookingStatus[]).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleUpdateStatus(selectedBooking.id, st)}
                    className={`py-2 rounded-lg font-semibold capitalize border text-xs ${
                      selectedBooking.status === st
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 flex justify-end">
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};
