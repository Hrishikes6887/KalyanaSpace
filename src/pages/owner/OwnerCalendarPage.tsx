import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { venueService } from '../../services/venueService';
import { availabilityService } from '../../services/availabilityService';
import { bookingService } from '../../services/bookingService';
import { VenueAvailability, Booking } from '../../types';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Lock,
  Unlock,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Sparkles,
  Info
} from 'lucide-react';

export const OwnerCalendarPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const ownerId = user?.id || 'user_owner_1';

  const venues = venueService.getVenuesByOwner(ownerId);
  const [selectedVenueId, setSelectedVenueId] = useState<string>(venues[0]?.id || 'venue_1');

  // Month navigation: using Year & Month (0-indexed)
  const [currentDate, setCurrentDate] = useState(() => new Date(2024, 10, 1)); // Nov 2024

  // Block / Unblock Modal State
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);
  const [blockReason, setBlockReason] = useState('Hall maintenance & painting');
  const [bookingDetailModal, setBookingDetailModal] = useState<Booking | null>(null);
  const [unblockWarningModal, setUnblockWarningModal] = useState<string | null>(null);

  const selectedVenue = venues.find(v => v.id === selectedVenueId) || venues[0];
  const availabilityRecords = availabilityService.getVenueAvailability(selectedVenueId);
  const venueBookings = bookingService.getBookingsByOwner(ownerId).filter(b => b.venueId === selectedVenueId);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Calendar calculations
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sun

  const getDateKey = (day: number) => {
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  };

  const handleDayClick = (day: number) => {
    const dateKey = getDateKey(day);
    const existing = availabilityRecords.find(a => a.date === dateKey);

    if (existing && existing.status === 'booked') {
      // Find associated booking
      const bkg = venueBookings.find(b => b.eventDate === dateKey);
      if (bkg) {
        setBookingDetailModal(bkg);
      } else {
        showToast('info', 'Booked Date', `This date is confirmed under reference ${existing.bookingRef || 'N/A'}.`);
      }
      return;
    }

    if (existing && existing.status === 'blocked') {
      // Prompt unblock
      setUnblockWarningModal(dateKey);
      return;
    }

    // Free date -> open block modal
    setSelectedDateStr(dateKey);
  };

  const handleConfirmBlock = () => {
    if (!selectedDateStr) return;
    const res = availabilityService.blockDate(selectedVenueId, selectedDateStr, blockReason);
    if (res.success) {
      showToast('success', 'Date Blocked', `${selectedDateStr} marked as unavailable.`);
    } else {
      showToast('error', 'Action Failed', res.error);
    }
    setSelectedDateStr(null);
  };

  const handleConfirmUnblock = () => {
    if (!unblockWarningModal) return;
    const res = availabilityService.unblockDate(selectedVenueId, unblockWarningModal);
    if (res.success) {
      showToast('success', 'Date Unblocked', `${unblockWarningModal} is now marked available.`);
    } else {
      showToast('error', 'Cannot Unblock', res.error);
    }
    setUnblockWarningModal(null);
  };

  return (
    <div className="space-y-8">
      
      {/* Header & Venue Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800 font-mono">
            Muhurtham & Event Dates
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
            Availability Calendar
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Block renovation slots, review booked muhurthams, and maintain dates.
          </p>
        </div>

        {/* Venue Selector */}
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-stone-400 shrink-0" />
          <select
            value={selectedVenueId}
            onChange={(e) => setSelectedVenueId(e.target.value)}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-white border border-stone-200 text-stone-800 shadow-subtle focus:outline-none focus:ring-2 focus:ring-brand-700 cursor-pointer"
          >
            {venues.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name} ({v.city})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Calendar Card */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-card p-6 sm:p-8 space-y-6">
        
        {/* Month Navigation & Legend */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <h2 className="font-serif font-bold text-xl sm:text-2xl text-stone-900">
              {monthNames[month]} {year}
            </h2>
            <div className="flex items-center gap-1">
              <button
                onClick={handlePrevMonth}
                className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 transition-colors"
                aria-label="Previous Month"
              >
                <ChevronLeft className="w-4 h-4 text-stone-600" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 transition-colors"
                aria-label="Next Month"
              >
                <ChevronRight className="w-4 h-4 text-stone-600" />
              </button>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-50 border border-emerald-300" />
              <span className="text-stone-600">Available</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-amber-500" />
              <span className="text-stone-600">Confirmed Booking</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-stone-300" />
              <span className="text-stone-600">Blocked by Owner</span>
            </div>
          </div>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className="font-mono uppercase font-bold text-stone-400 py-2">
              {d}
            </div>
          ))}

          {/* Empty cells before 1st of month */}
          {Array.from({ length: firstDayIndex }).map((_, idx) => (
            <div key={`empty-${idx}`} className="h-24 rounded-xl bg-stone-50/50" />
          ))}

          {/* Days of Month */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const dateKey = getDateKey(dayNum);
            const statusRecord = availabilityRecords.find(a => a.date === dateKey);

            let bgClass = 'bg-white hover:bg-emerald-50/60 border-stone-200 hover:border-emerald-300 text-stone-800';
            let label = 'Available';
            let badgeIcon = null;

            if (statusRecord?.status === 'booked') {
              bgClass = 'bg-amber-50 border-amber-300 text-amber-950 font-bold';
              label = 'Booked';
              badgeIcon = <Lock className="w-3 h-3 text-amber-600" />;
            } else if (statusRecord?.status === 'blocked') {
              bgClass = 'bg-stone-100 border-stone-300 text-stone-600';
              label = 'Blocked';
              badgeIcon = <AlertTriangle className="w-3 h-3 text-stone-500" />;
            }

            return (
              <button
                key={dayNum}
                onClick={() => handleDayClick(dayNum)}
                className={`h-24 p-2 rounded-xl border text-left flex flex-col justify-between transition-all ${bgClass}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm">{dayNum}</span>
                  {badgeIcon}
                </div>

                <div className="truncate">
                  <span className="text-[10px] block truncate font-medium">
                    {statusRecord?.notes || label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="pt-2 text-xs text-stone-500 flex items-center gap-1.5">
          <Info className="w-4 h-4 text-brand-700" />
          <span>Click any available date to block it for maintenance. Click a booked date to view customer details.</span>
        </div>

      </div>

      {/* Block Date Modal */}
      {selectedDateStr && (
        <Modal
          isOpen={!!selectedDateStr}
          onClose={() => setSelectedDateStr(null)}
          title={`Block Date: ${selectedDateStr}`}
          subtitle={selectedVenue.name}
          maxWidth="sm"
        >
          <div className="space-y-4 text-xs">
            <p className="text-stone-600">
              Mark this date as unavailable for customer enquiries and booking requests.
            </p>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Reason for Blocking</label>
              <input
                type="text"
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                placeholder="e.g. Facility maintenance, private family event"
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setSelectedDateStr(null)}
                className="px-4 py-2 rounded-lg bg-stone-100 text-stone-700 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBlock}
                className="px-4 py-2 rounded-lg bg-brand-800 text-white font-semibold"
              >
                Confirm Block
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Unblock Confirm Dialog */}
      <ConfirmDialog
        isOpen={!!unblockWarningModal}
        title="Unblock This Date?"
        message={`Are you sure you want to mark ${unblockWarningModal} as available for new customer enquiries?`}
        confirmLabel="Unblock Date"
        cancelLabel="Keep Blocked"
        onConfirm={handleConfirmUnblock}
        onCancel={() => setUnblockWarningModal(null)}
      />

      {/* Confirmed Booking Detail Modal */}
      {bookingDetailModal && (
        <Modal
          isOpen={!!bookingDetailModal}
          onClose={() => setBookingDetailModal(null)}
          title={`Confirmed Booking: ${bookingDetailModal.referenceNo}`}
          subtitle={`${bookingDetailModal.venueName} • ${bookingDetailModal.eventDate}`}
          maxWidth="md"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-2 text-emerald-900">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
              <span>
                Confirmed Wedding Ceremony. Date is locked in your marketplace calendar.
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 bg-stone-50 rounded-xl">
              <div>
                <span className="text-stone-500 block text-[11px]">Customer Name</span>
                <span className="font-bold text-stone-900">{bookingDetailModal.customerName}</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[11px]">Contact Phone</span>
                <span className="font-mono font-semibold text-stone-900">{bookingDetailModal.customerPhone}</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[11px]">Agreed Price</span>
                <span className="font-serif font-bold text-stone-900">₹{bookingDetailModal.agreedPrice.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[11px]">Advance Token</span>
                <span className="font-semibold text-emerald-700">₹{bookingDetailModal.advancePaid.toLocaleString('en-IN')} (Paid)</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setBookingDetailModal(null)}
                className="px-4 py-2 rounded-lg bg-stone-800 text-white font-semibold text-xs"
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
