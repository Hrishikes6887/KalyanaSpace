import React, { useState } from 'react';
import { Venue, Enquiry } from '../../types';
import { Modal } from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { enquiryService } from '../../services/enquiryService';
import { CheckCircle2, Calendar, Users, IndianRupee, Sparkles, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface QuickEnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  venue: Venue;
}

export const QuickEnquiryModal: React.FC<QuickEnquiryModalProps> = ({
  isOpen,
  onClose,
  venue,
}) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [fullName, setFullName] = useState(user?.name || 'Ananya Rao');
  const [email, setEmail] = useState(user?.email || 'customer@kalyanaspace.demo');
  const [phone, setPhone] = useState(user?.phone || '+91 98450 12345');
  const [eventType, setEventType] = useState<Enquiry['eventType']>('wedding');
  const [eventDate, setEventDate] = useState('2025-02-18');
  const [guestCount, setGuestCount] = useState<number>(venue.guestCapacityMin || 500);
  const [budget, setBudget] = useState<number>(venue.startingPrice || 200000);
  const [notes, setNotes] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedEnquiry, setSubmittedEnquiry] = useState<Enquiry | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = 'Full name is required';
    if (!email.trim() && !phone.trim()) errs.contact = 'Email or phone number is required';
    if (!eventDate) errs.eventDate = 'Event date is required';
    if (!guestCount || guestCount <= 0) errs.guestCount = 'Valid guest count is required';
    if (!budget || budget <= 0) errs.budget = 'Estimated budget is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const created = enquiryService.createEnquiry({
        venueId: venue.id,
        venueName: venue.name,
        venueCity: venue.city,
        ownerId: venue.ownerId,
        customerId: user?.id || 'user_customer_1',
        customerName: fullName.trim(),
        customerEmail: email.trim(),
        customerPhone: phone.trim(),
        eventType,
        eventDate,
        guestCount: Number(guestCount),
        estimatedBudget: Number(budget),
        additionalRequirements: notes.trim(),
      });

      setIsSubmitting(false);
      setSubmittedEnquiry(created);
      showToast(
        'success',
        'Enquiry generated successfully!',
        `Enquiry reference: ${created.id}. Recorded for ${venue.name}.`
      );
    }, 400);
  };

  const handleResetAndClose = () => {
    setSubmittedEnquiry(null);
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleResetAndClose}
      title={submittedEnquiry ? 'Enquiry Confirmed' : `Enquire with ${venue.name}`}
      subtitle={submittedEnquiry ? undefined : `${venue.locality}, ${venue.city}`}
      maxWidth="lg"
    >
      {submittedEnquiry ? (
        <div className="py-4 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <h3 className="text-xl font-bold font-serif text-stone-900 mb-1">
            Enquiry Sent to Venue Manager!
          </h3>
          <p className="text-xs text-stone-600 mb-6 max-w-md mx-auto">
            Your enquiry has been assigned Reference ID{' '}
            <strong className="text-brand-900 font-mono text-sm bg-stone-100 px-2 py-0.5 rounded">
              {submittedEnquiry.id}
            </strong>
            . In this prototype, it has been saved to local state and is now visible in the Owner and Admin dashboards.
          </p>

          <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 text-left text-xs space-y-2 mb-6">
            <div className="flex justify-between">
              <span className="text-stone-500">Venue:</span>
              <span className="font-semibold text-stone-900">{submittedEnquiry.venueName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Event Date:</span>
              <span className="font-semibold text-stone-900">{submittedEnquiry.eventDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Event Type:</span>
              <span className="font-semibold capitalize text-stone-900">{submittedEnquiry.eventType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Expected Guests:</span>
              <span className="font-semibold text-stone-900">{submittedEnquiry.guestCount} guests</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Status:</span>
              <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                New Enquiry (Pending Venue Owner Review)
              </span>
            </div>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-900 mb-6 flex items-start gap-2 text-left">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong>Availability Disclaimer:</strong> Final availability and muhurtham slot reservation is confirmed directly by the venue owner upon advance token agreement.
            </span>
          </div>

          <div className="flex items-center justify-center gap-3">
            <Link
              to="/account"
              onClick={handleResetAndClose}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-stone-100 text-stone-800 hover:bg-stone-200 transition-colors"
            >
              View in My Enquiries
            </Link>
            <button
              onClick={handleResetAndClose}
              className="px-5 py-2 text-xs font-semibold rounded-lg bg-brand-800 text-white hover:bg-brand-900 transition-colors shadow-xs"
            >
              Done
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3 text-xs text-emerald-950 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Direct Venue Connection:</span> Submit your event requirements to check Muhurtham dates, catering terms, and receive a customized quote.
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Your Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Ananya & Karthik Rao"
                className={`w-full px-3 py-2 text-xs rounded-lg border ${
                  errors.fullName ? 'border-rose-400 focus:ring-rose-200' : 'border-stone-200 focus:ring-brand-500'
                } focus:outline-none focus:ring-2`}
              />
              {errors.fullName && <p className="text-[11px] text-rose-500 mt-1">{errors.fullName}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98450 12345"
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="customer@kalyanaspace.demo"
              className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            {errors.contact && <p className="text-[11px] text-rose-500 mt-1">{errors.contact}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Event Type
              </label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value as Enquiry['eventType'])}
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
              >
                <option value="wedding">Traditional Wedding (Muhurtham)</option>
                <option value="reception">Evening Wedding Reception</option>
                <option value="engagement">Engagement Ceremony</option>
                <option value="sangeet">Sangeet / Mehendi</option>
                <option value="thread_ceremony">Upanayana / Thread Ceremony</option>
                <option value="other">Other Auspicious Occasion</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Preferred Event Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
              />
              {errors.eventDate && <p className="text-[11px] text-rose-500 mt-1">{errors.eventDate}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Expected Guests <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="50"
                  step="50"
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-500 pl-8"
                />
                <Users className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Estimated Budget (₹) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="25000"
                  step="10000"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-500 pl-8"
                />
                <IndianRupee className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Special Requirements or Timings (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Need 8 guest rooms, Satvik vegetarian kitchen setup, and morning muhurtham acoustics..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-stone-100">
            <button
              type="button"
              onClick={handleResetAndClose}
              className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-semibold text-white bg-brand-800 hover:bg-brand-900 rounded-lg transition-colors shadow-xs disabled:opacity-50 flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Submitting Enquiry...</span>
                </>
              ) : (
                <span>Submit Free Enquiry</span>
              )}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
