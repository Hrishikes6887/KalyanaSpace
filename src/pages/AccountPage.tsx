import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { enquiryService } from '../services/enquiryService';
import { Enquiry, EnquiryStatus } from '../types';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import {
  User,
  CalendarCheck2,
  Mail,
  Phone,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  Trash2,
  MapPin,
  IndianRupee,
  Users,
  Calendar
} from 'lucide-react';

export const AccountPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const customerId = user?.id || 'user_customer_1';
  const enquiries = enquiryService.getEnquiriesByCustomer(customerId);

  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [withdrawTargetId, setWithdrawTargetId] = useState<string | null>(null);

  const handleWithdraw = (id: string) => {
    const updated = enquiryService.withdrawEnquiry(id, customerId);
    setWithdrawTargetId(null);
    if (updated) {
      showToast('info', 'Enquiry Withdrawn', `Enquiry ${id} has been marked as withdrawn.`);
      if (selectedEnquiry && selectedEnquiry.id === id) {
        setSelectedEnquiry(updated);
      }
    }
  };

  const getStatusBadge = (status: EnquiryStatus) => {
    switch (status) {
      case 'new':
        return <Badge variant="blue">New (Awaiting Review)</Badge>;
      case 'contacted':
        return <Badge variant="amber">Contacted by Owner</Badge>;
      case 'visit_scheduled':
        return <Badge variant="purple">Site Visit Scheduled</Badge>;
      case 'quotation_shared':
        return <Badge variant="gold">Quotation Received</Badge>;
      case 'converted':
        return <Badge variant="emerald">Confirmed Booking</Badge>;
      case 'withdrawn':
        return <Badge variant="gray">Withdrawn</Badge>;
      case 'closed':
        return <Badge variant="red">Closed</Badge>;
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

  return (
    <div className="bg-ivory-100 min-h-screen py-10 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Profile Header */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-brand-200"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-brand-800 text-white font-serif font-bold text-2xl flex items-center justify-center">
                {user ? user.name.charAt(0) : 'C'}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                  {user?.name || 'Ananya & Karthik Rao'}
                </h1>
                <span className="px-2 py-0.5 rounded bg-brand-50 text-brand-800 text-[10px] font-bold uppercase border border-brand-200">
                  Demo Customer
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500 mt-1">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-stone-400" />
                  {user?.email || 'customer@kalyanaspace.demo'}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-stone-400" />
                  {user?.phone || '+91 98450 12345'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/favorites"
              className="px-4 py-2 rounded-xl bg-ivory-100 hover:bg-ivory-200 text-stone-800 text-xs font-semibold border border-stone-200 transition-colors"
            >
              Saved Venues
            </Link>
            <Link
              to="/venues"
              className="px-4 py-2 rounded-xl bg-brand-800 hover:bg-brand-900 text-white text-xs font-semibold transition-colors shadow-xs"
            >
              Explore More Halls
            </Link>
          </div>
        </div>

        {/* Enquiry History Section */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-card overflow-hidden">
          <div className="p-6 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-serif text-xl font-bold text-stone-900">
                My Wedding Hall Enquiries ({enquiries.length})
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Real-time status of your enquiries submitted to venue managers.
              </p>
            </div>
          </div>

          {enquiries.length === 0 ? (
            <div className="p-12 text-center">
              <CalendarCheck2 className="w-10 h-10 text-stone-300 mx-auto mb-2" />
              <p className="text-xs text-stone-500 mb-4">You have not submitted any venue enquiries yet.</p>
              <Link
                to="/venues"
                className="px-4 py-2 rounded-lg bg-brand-800 text-white text-xs font-semibold"
              >
                Find & Enquire Wedding Halls
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50/70 border-b border-stone-200 font-mono uppercase text-stone-500 tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Enquiry ID</th>
                    <th className="py-3 px-4">Venue & City</th>
                    <th className="py-3 px-4">Event Date</th>
                    <th className="py-3 px-4">Guests</th>
                    <th className="py-3 px-4">Est. Budget</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {enquiries.map((enq) => (
                    <tr key={enq.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-semibold text-brand-900">
                        {enq.id}
                      </td>
                      <td className="py-3.5 px-4">
                        <Link
                          to={`/venues/${enq.venueId}`}
                          className="font-medium text-stone-900 hover:text-brand-800 transition-colors block"
                        >
                          {enq.venueName}
                        </Link>
                        <span className="text-[11px] text-stone-500">{enq.venueCity}</span>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-stone-700">
                        {enq.eventDate}
                        <span className="block text-[10px] text-stone-400 capitalize">{enq.eventType}</span>
                      </td>
                      <td className="py-3.5 px-4 text-stone-700">
                        {enq.guestCount}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-stone-900 font-serif">
                        {formatPrice(enq.estimatedBudget)}
                      </td>
                      <td className="py-3.5 px-4">
                        {getStatusBadge(enq.status)}
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => setSelectedEnquiry(enq)}
                          className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors"
                          title="View Details"
                          aria-label="View Enquiry Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {enq.status !== 'withdrawn' && enq.status !== 'closed' && (
                          <button
                            onClick={() => setWithdrawTargetId(enq.id)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Withdraw Enquiry"
                            aria-label="Withdraw Enquiry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* Enquiry Details Modal */}
      {selectedEnquiry && (
        <Modal
          isOpen={!!selectedEnquiry}
          onClose={() => setSelectedEnquiry(null)}
          title={`Enquiry: ${selectedEnquiry.id}`}
          subtitle={selectedEnquiry.venueName}
          maxWidth="md"
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <span className="text-stone-500">Current Status:</span>
              <div>{getStatusBadge(selectedEnquiry.status)}</div>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 bg-stone-50 rounded-xl">
              <div>
                <span className="text-stone-500 block text-[11px]">Event Date</span>
                <span className="font-semibold text-stone-900">{selectedEnquiry.eventDate}</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[11px]">Event Occasion</span>
                <span className="font-semibold text-stone-900 capitalize">{selectedEnquiry.eventType}</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[11px]">Guest Count</span>
                <span className="font-semibold text-stone-900">{selectedEnquiry.guestCount} Guests</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[11px]">Estimated Budget</span>
                <span className="font-semibold text-stone-900">{formatPrice(selectedEnquiry.estimatedBudget)}</span>
              </div>
            </div>

            {selectedEnquiry.quotationAmount && (
              <div className="p-3 bg-gold-50 border border-gold-200 rounded-xl">
                <span className="text-gold-800 block text-[11px] font-semibold">Official Quote from Venue:</span>
                <span className="font-serif text-lg font-bold text-gold-900">
                  {formatPrice(selectedEnquiry.quotationAmount)}
                </span>
              </div>
            )}

            {selectedEnquiry.visitDate && (
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl">
                <span className="text-purple-800 block text-[11px] font-semibold">Scheduled Site Visit:</span>
                <span className="font-semibold text-purple-900">
                  {new Date(selectedEnquiry.visitDate).toLocaleString()}
                </span>
              </div>
            )}

            {selectedEnquiry.additionalRequirements && (
              <div>
                <span className="text-stone-500 block font-semibold mb-1">Your Requirements:</span>
                <p className="p-2.5 rounded-lg bg-stone-50 text-stone-700 leading-relaxed">
                  {selectedEnquiry.additionalRequirements}
                </p>
              </div>
            )}

            {/* Notes Log */}
            {selectedEnquiry.notes.length > 0 && (
              <div className="pt-2 border-t border-stone-100">
                <span className="text-stone-500 font-semibold block mb-2">Coordinator Communications:</span>
                <div className="space-y-2">
                  {selectedEnquiry.notes.map((n) => (
                    <div key={n.id} className="p-2.5 rounded-lg bg-stone-50 text-[11px]">
                      <div className="flex justify-between font-semibold text-stone-800 mb-0.5">
                        <span>{n.authorName}</span>
                        <span className="text-[10px] text-stone-400">{new Date(n.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-stone-600">{n.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
              {selectedEnquiry.status !== 'withdrawn' && selectedEnquiry.status !== 'closed' && (
                <button
                  onClick={() => handleWithdraw(selectedEnquiry.id)}
                  className="text-rose-600 hover:text-rose-700 font-semibold text-xs"
                >
                  Withdraw Enquiry
                </button>
              )}
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="ml-auto px-4 py-2 bg-stone-800 text-white rounded-lg text-xs font-semibold hover:bg-stone-900"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Withdraw Confirmation */}
      <ConfirmDialog
        isOpen={!!withdrawTargetId}
        title="Withdraw Enquiry?"
        message="Are you sure you want to withdraw this venue enquiry? The hall owner will be notified that you are no longer exploring this date."
        confirmLabel="Withdraw"
        cancelLabel="Keep Enquiry"
        isDestructive={true}
        onConfirm={() => withdrawTargetId && handleWithdraw(withdrawTargetId)}
        onCancel={() => setWithdrawTargetId(null)}
      />
    </div>
  );
};
