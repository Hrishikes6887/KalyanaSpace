import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { enquiryService } from '../../services/enquiryService';
import { bookingService } from '../../services/bookingService';
import { Enquiry, EnquiryStatus } from '../../types';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import {
  Inbox,
  Search,
  Filter,
  Eye,
  Calendar,
  IndianRupee,
  Phone,
  Mail,
  Users,
  MessageSquare,
  CheckCircle2,
  Clock,
  Sparkles,
  UserCheck
} from 'lucide-react';

export const OwnerEnquiriesPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const ownerId = user?.id || 'user_owner_1';

  const [enquiries, setEnquiries] = useState<Enquiry[]>(() => enquiryService.getEnquiriesByOwner(ownerId));
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
  // Selected enquiry for details modal
  const [activeEnquiry, setActiveEnquiry] = useState<Enquiry | null>(null);

  // Form states inside modal
  const [newStatus, setNewStatus] = useState<EnquiryStatus>('new');
  const [newNote, setNewNote] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [visitDateTime, setVisitDateTime] = useState('');
  const [quoteAmount, setQuoteAmount] = useState<string>('');

  const [showConvertConfirm, setShowConvertConfirm] = useState(false);

  const refreshEnquiries = () => {
    const list = enquiryService.getEnquiriesByOwner(ownerId);
    setEnquiries(list);
    if (activeEnquiry) {
      const updatedActive = list.find(e => e.id === activeEnquiry.id);
      if (updatedActive) setActiveEnquiry(updatedActive);
    }
  };

  const handleOpenDetails = (enq: Enquiry) => {
    setActiveEnquiry(enq);
    setNewStatus(enq.status);
    setFollowUpDate(enq.followUpDate || '');
    setVisitDateTime(enq.visitDate || '');
    setQuoteAmount(enq.quotationAmount ? String(enq.quotationAmount) : '');
    setNewNote('');
  };

  const handleSaveModalUpdates = () => {
    if (!activeEnquiry) return;

    // 1. Status update with optional note
    if (newStatus !== activeEnquiry.status || newNote.trim()) {
      enquiryService.updateStatus(
        activeEnquiry.id,
        newStatus,
        newNote.trim(),
        user?.name || 'Owner',
        ownerId
      );
    }

    // 2. Follow-up date
    if (followUpDate && followUpDate !== activeEnquiry.followUpDate) {
      enquiryService.updateFollowUp(activeEnquiry.id, followUpDate);
    }

    // 3. Site visit
    if (visitDateTime && visitDateTime !== activeEnquiry.visitDate) {
      enquiryService.scheduleVisit(activeEnquiry.id, visitDateTime, user?.name || 'Owner');
    }

    // 4. Quotation
    if (quoteAmount && Number(quoteAmount) !== activeEnquiry.quotationAmount) {
      enquiryService.setQuotation(activeEnquiry.id, Number(quoteAmount), user?.name || 'Owner');
    }

    refreshEnquiries();
    showToast('success', 'Enquiry Updated', `Changes saved for ${activeEnquiry.id}.`);
    setActiveEnquiry(null);
  };

  const handleConvertBooking = () => {
    if (!activeEnquiry) return;

    // Create confirmed booking!
    const agreed = Number(quoteAmount) || activeEnquiry.estimatedBudget;
    const advance = Math.round(agreed * 0.35); // 35% advance

    bookingService.createBookingFromEnquiry({
      enquiryId: activeEnquiry.id,
      venueId: activeEnquiry.venueId,
      venueName: activeEnquiry.venueName,
      venueCity: activeEnquiry.venueCity,
      ownerId,
      customerId: activeEnquiry.customerId,
      customerName: activeEnquiry.customerName,
      customerEmail: activeEnquiry.customerEmail,
      customerPhone: activeEnquiry.customerPhone,
      eventDate: activeEnquiry.eventDate,
      guestCount: activeEnquiry.guestCount,
      agreedPrice: agreed,
      advancePaid: advance,
    });

    // Mark enquiry converted
    enquiryService.updateStatus(
      activeEnquiry.id,
      'converted',
      `Converted to confirmed booking with advance token ₹${advance.toLocaleString('en-IN')}`,
      user?.name || 'Owner',
      ownerId
    );

    setShowConvertConfirm(false);
    refreshEnquiries();
    setActiveEnquiry(null);
    showToast('success', 'Booking Confirmed!', `Customer booking confirmed and locked in your availability calendar.`);
  };

  const getStatusBadge = (status: EnquiryStatus) => {
    switch (status) {
      case 'new':
        return <Badge variant="blue">New</Badge>;
      case 'contacted':
        return <Badge variant="amber">Contacted</Badge>;
      case 'followup_required':
        return <Badge variant="gold">Follow-up Required</Badge>;
      case 'visit_scheduled':
        return <Badge variant="purple">Visit Scheduled</Badge>;
      case 'quotation_shared':
        return <Badge variant="gold">Quote Shared</Badge>;
      case 'converted':
        return <Badge variant="emerald">Converted (Booked)</Badge>;
      case 'closed':
        return <Badge variant="red">Closed</Badge>;
      case 'withdrawn':
        return <Badge variant="gray">Withdrawn</Badge>;
      default:
        return <Badge variant="gray">{status}</Badge>;
    }
  };

  const formatPrice = (p: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(p);
  };

  const filteredEnquiries = enquiries.filter((e) => {
    const matchesQuery =
      e.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.venueName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.customerPhone.includes(searchQuery);

    const matchesStatus = selectedStatus === 'all' || e.status === selectedStatus;
    return matchesQuery && matchesStatus;
  });

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800 font-mono">
            Direct Lead Inbox
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
            Customer Enquiries ({enquiries.length})
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Follow up with families, schedule site visits, share quotations and convert bookings.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative max-w-sm w-full">
          <input
            type="text"
            placeholder="Search by ID, customer name, phone, or venue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3.5 py-2 pl-9 text-xs rounded-xl bg-white border border-stone-200 shadow-subtle focus:outline-none focus:ring-2 focus:ring-brand-700"
          />
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 text-xs">
          {['all', 'new', 'contacted', 'visit_scheduled', 'quotation_shared', 'converted'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap capitalize transition-colors ${
                selectedStatus === st
                  ? 'bg-brand-800 text-white font-semibold shadow-xs'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-mono uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Ref ID</th>
                <th className="py-3 px-4">Customer Details</th>
                <th className="py-3 px-4">Venue</th>
                <th className="py-3 px-4">Event Date</th>
                <th className="py-3 px-4">Guests</th>
                <th className="py-3 px-4">Budget</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredEnquiries.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-stone-400 italic">
                    No enquiries found matching this filter.
                  </td>
                </tr>
              ) : (
                filteredEnquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-brand-900">
                      {enq.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-stone-900 block">{enq.customerName}</span>
                      <span className="text-[11px] text-stone-500 font-mono">{enq.customerPhone}</span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-stone-800 max-w-[140px] truncate">
                      {enq.venueName}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-stone-800">
                      {enq.eventDate}
                      <span className="block text-[10px] text-stone-400 capitalize">{enq.eventType}</span>
                    </td>
                    <td className="py-3.5 px-4 text-stone-600">
                      {enq.guestCount}
                    </td>
                    <td className="py-3.5 px-4 font-serif font-bold text-stone-900">
                      {formatPrice(enq.estimatedBudget)}
                    </td>
                    <td className="py-3.5 px-4">
                      {getStatusBadge(enq.status)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenDetails(enq)}
                        className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-brand-50 hover:text-brand-800 font-semibold text-stone-700 text-xs transition-colors"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enquiry Management Detail Modal */}
      {activeEnquiry && (
        <Modal
          isOpen={!!activeEnquiry}
          onClose={() => setActiveEnquiry(null)}
          title={`Enquiry: ${activeEnquiry.id}`}
          subtitle={`Customer: ${activeEnquiry.customerName} • Venue: ${activeEnquiry.venueName}`}
          maxWidth="2xl"
        >
          <div className="space-y-5 text-xs">
            
            {/* Customer Details Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-stone-50 rounded-xl border border-stone-200">
              <div>
                <span className="text-[11px] text-stone-500 block">Phone</span>
                <span className="font-mono font-semibold text-stone-900">{activeEnquiry.customerPhone}</span>
              </div>
              <div>
                <span className="text-[11px] text-stone-500 block">Email</span>
                <span className="font-semibold text-stone-900 truncate block">{activeEnquiry.customerEmail}</span>
              </div>
              <div>
                <span className="text-[11px] text-stone-500 block">Event Date</span>
                <span className="font-semibold text-stone-900">{activeEnquiry.eventDate} ({activeEnquiry.eventType})</span>
              </div>
              <div>
                <span className="text-[11px] text-stone-500 block">Guests & Budget</span>
                <span className="font-semibold text-stone-900">{activeEnquiry.guestCount} pax / {formatPrice(activeEnquiry.estimatedBudget)}</span>
              </div>
            </div>

            {activeEnquiry.additionalRequirements && (
              <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 text-amber-950">
                <span className="font-semibold block mb-0.5">Customer Requirements:</span>
                <p>{activeEnquiry.additionalRequirements}</p>
              </div>
            )}

            {/* Action Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              
              {/* Status Update */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Update Enquiry Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as EnquiryStatus)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white font-medium text-xs focus:ring-2 focus:ring-brand-700"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted via Phone</option>
                  <option value="followup_required">Follow-up Required</option>
                  <option value="visit_scheduled">Site Visit Scheduled</option>
                  <option value="quotation_shared">Quotation Shared</option>
                  <option value="converted">Confirmed Booking</option>
                  <option value="closed">Closed / Not Interested</option>
                </select>
              </div>

              {/* Quotation Amount */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Quotation Amount (₹)
                </label>
                <input
                  type="number"
                  step="5000"
                  value={quoteAmount}
                  onChange={(e) => setQuoteAmount(e.target.value)}
                  placeholder="e.g. 265000"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-serif font-bold text-stone-900"
                />
              </div>

              {/* Site Visit Schedule */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Schedule Site Visit Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={visitDateTime}
                  onChange={(e) => setVisitDateTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs bg-white"
                />
              </div>

              {/* Follow up Date */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Set Next Follow-Up Date
                </label>
                <input
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs bg-white"
                />
              </div>
            </div>

            {/* Internal Staff Notes */}
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Add Internal Coordinator Note
              </label>
              <textarea
                rows={2}
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="e.g. Called customer, parents will visit Saturday morning to inspect banana-leaf dining hall..."
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-brand-700"
              />
            </div>

            {/* Note History */}
            {activeEnquiry.notes.length > 0 && (
              <div className="pt-2 border-t border-stone-100">
                <span className="font-semibold text-stone-700 block mb-2">Internal Note History:</span>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {activeEnquiry.notes.map((n) => (
                    <div key={n.id} className="p-2.5 rounded-lg bg-stone-50 border border-stone-200 text-[11px]">
                      <div className="flex justify-between font-semibold text-stone-800">
                        <span>{n.authorName}</span>
                        <span className="text-[10px] text-stone-400">{new Date(n.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="text-stone-600 mt-0.5">{n.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer Actions */}
            <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
              {activeEnquiry.status !== 'converted' ? (
                <button
                  type="button"
                  onClick={() => setShowConvertConfirm(true)}
                  className="px-3 py-2 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 font-semibold text-xs flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Mark as Converted Booking</span>
                </button>
              ) : (
                <span className="text-emerald-700 font-semibold text-xs flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Booking Already Confirmed</span>
                </span>
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveEnquiry(null)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveModalUpdates}
                  className="px-5 py-2 rounded-xl bg-brand-800 hover:bg-brand-900 text-white font-semibold text-xs shadow-xs"
                >
                  Save Updates
                </button>
              </div>
            </div>

          </div>
        </Modal>
      )}

      {/* Convert to Booking Confirmation */}
      <ConfirmDialog
        isOpen={showConvertConfirm}
        title="Confirm Booking & Lock Muhurtham Date?"
        message={`Are you sure you want to mark ${activeEnquiry?.id} as converted? This will generate a confirmed booking record and lock the date ${activeEnquiry?.eventDate} in your availability calendar.`}
        confirmLabel="Confirm Booking"
        cancelLabel="Not yet"
        onConfirm={handleConvertBooking}
        onCancel={() => setShowConvertConfirm(false)}
      />

    </div>
  );
};
