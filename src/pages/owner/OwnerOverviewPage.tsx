import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { venueService } from '../../services/venueService';
import { enquiryService } from '../../services/enquiryService';
import { bookingService } from '../../services/bookingService';
import { Badge } from '../../components/common/Badge';
import {
  Building2,
  Inbox,
  CalendarDays,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Plus,
  Eye,
  IndianRupee,
  Sparkles
} from 'lucide-react';

export const OwnerOverviewPage: React.FC = () => {
  const { user } = useAuth();
  const ownerId = user?.id || 'user_owner_1';

  const venues = venueService.getVenuesByOwner(ownerId);
  const enquiries = enquiryService.getEnquiriesByOwner(ownerId);
  const bookings = bookingService.getBookingsByOwner(ownerId);

  const publishedCount = venues.filter(v => v.status === 'published').length;
  const newEnquiriesCount = enquiries.filter(e => e.status === 'new').length;
  const followUpCount = enquiries.filter(e => !!e.followUpDate).length;
  const convertedCount = enquiries.filter(e => e.status === 'converted').length;

  const recentEnquiries = enquiries.slice(0, 5);
  const upcomingBookings = bookings.slice(0, 4);

  // Status breakdown calculations
  const statusCounts = {
    new: enquiries.filter(e => e.status === 'new').length,
    contacted: enquiries.filter(e => e.status === 'contacted').length,
    visit_scheduled: enquiries.filter(e => e.status === 'visit_scheduled').length,
    quotation_shared: enquiries.filter(e => e.status === 'quotation_shared').length,
    converted: enquiries.filter(e => e.status === 'converted').length,
  };

  const formatPrice = (p: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(p);
  };

  return (
    <div className="space-y-8">
      
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800 font-mono">
            Owner Operations Hub
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
            Dashboard Overview
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Welcome back, {user?.name}. Monitor enquiries, manage muhurtham dates, and track conversion.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/owner/enquiries"
            className="px-4 py-2 rounded-xl bg-white border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-50 transition-colors shadow-subtle"
          >
            Review Enquiries ({newEnquiriesCount})
          </Link>
          <Link
            to="/owner/venues/new"
            className="px-4 py-2 rounded-xl bg-brand-800 hover:bg-brand-900 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Venue</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-subtle">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-stone-500">Total Venues</span>
            <Building2 className="w-4 h-4 text-stone-400" />
          </div>
          <span className="font-serif text-2xl font-bold text-stone-900 block">{venues.length}</span>
          <span className="text-[10px] text-emerald-700 font-medium">{publishedCount} active online</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-subtle">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-stone-500">New Enquiries</span>
            <Inbox className="w-4 h-4 text-amber-500" />
          </div>
          <span className="font-serif text-2xl font-bold text-amber-900 block">{newEnquiriesCount}</span>
          <span className="text-[10px] text-stone-400">Needs customer contact</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-subtle">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-stone-500">Follow-ups</span>
            <Clock className="w-4 h-4 text-sky-500" />
          </div>
          <span className="font-serif text-2xl font-bold text-stone-900 block">{followUpCount}</span>
          <span className="text-[10px] text-sky-700 font-medium">Pending schedule</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-subtle">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-stone-500">Bookings</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="font-serif text-2xl font-bold text-emerald-950 block">{bookings.length}</span>
          <span className="text-[10px] text-emerald-700 font-medium">Tokens confirmed</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-subtle">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-stone-500">Total Enquiries</span>
            <TrendingUp className="w-4 h-4 text-stone-400" />
          </div>
          <span className="font-serif text-2xl font-bold text-stone-900 block">{enquiries.length}</span>
          <span className="text-[10px] text-stone-400">All-time received</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-subtle">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-stone-500">Conversion</span>
            <Sparkles className="w-4 h-4 text-gold-500" />
          </div>
          <span className="font-serif text-2xl font-bold text-brand-900 block">
            {enquiries.length > 0 ? `${Math.round((convertedCount / enquiries.length) * 100)}%` : '0%'}
          </span>
          <span className="text-[10px] text-stone-400">Enquiry-to-booking</span>
        </div>

      </div>

      {/* Visual Pipeline Distribution */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-subtle space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif font-bold text-base text-stone-900">Enquiry Funnel Pipeline</h2>
          <span className="text-xs text-stone-400 font-mono">Live Demo Mock State</span>
        </div>

        {/* Visual progress bar representation */}
        <div className="h-4 rounded-full overflow-hidden flex bg-stone-100 gap-0.5">
          <div style={{ width: `${(statusCounts.new / enquiries.length) * 100}%` }} className="bg-sky-500" title={`New: ${statusCounts.new}`} />
          <div style={{ width: `${(statusCounts.contacted / enquiries.length) * 100}%` }} className="bg-amber-400" title={`Contacted: ${statusCounts.contacted}`} />
          <div style={{ width: `${(statusCounts.visit_scheduled / enquiries.length) * 100}%` }} className="bg-purple-500" title={`Visits: ${statusCounts.visit_scheduled}`} />
          <div style={{ width: `${(statusCounts.quotation_shared / enquiries.length) * 100}%` }} className="bg-gold-500" title={`Quotes: ${statusCounts.quotation_shared}`} />
          <div style={{ width: `${(statusCounts.converted / enquiries.length) * 100}%` }} className="bg-emerald-600" title={`Converted: ${statusCounts.converted}`} />
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
            <span className="text-stone-600">New ({statusCounts.new})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="text-stone-600">Contacted ({statusCounts.contacted})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            <span className="text-stone-600">Visits ({statusCounts.visit_scheduled})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-gold-500" />
            <span className="text-stone-600">Quotations ({statusCounts.quotation_shared})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <span className="text-stone-600">Converted ({statusCounts.converted})</span>
          </div>
        </div>
      </div>

      {/* Two Column Section: Recent Enquiries & Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Enquiries (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-200 shadow-card overflow-hidden">
          <div className="p-6 border-b border-stone-200 flex items-center justify-between">
            <h2 className="font-serif font-bold text-lg text-stone-900">Recent Enquiries</h2>
            <Link
              to="/owner/enquiries"
              className="text-xs font-semibold text-brand-800 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-mono">
                <tr>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Venue</th>
                  <th className="py-3 px-4">Muhurtham Date</th>
                  <th className="py-3 px-4">Guests</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {recentEnquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-semibold text-stone-900 block">{enq.customerName}</span>
                      <span className="text-[11px] text-stone-500 font-mono">{enq.customerPhone}</span>
                    </td>
                    <td className="py-3 px-4 font-medium text-stone-700 max-w-[140px] truncate">
                      {enq.venueName}
                    </td>
                    <td className="py-3 px-4 font-medium text-stone-800">
                      {enq.eventDate}
                    </td>
                    <td className="py-3 px-4 text-stone-600">
                      {enq.guestCount}
                    </td>
                    <td className="py-3 px-4">
                      <span className="capitalize px-2 py-0.5 rounded-full text-[10px] font-semibold bg-stone-100 text-stone-700">
                        {enq.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to="/owner/enquiries"
                        className="text-brand-800 hover:text-brand-900 font-semibold text-xs"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Confirmed Bookings (1 col) */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h2 className="font-serif font-bold text-lg text-stone-900">Upcoming Events</h2>
            <Link to="/owner/calendar" className="text-xs font-semibold text-brand-800 hover:underline">
              Calendar
            </Link>
          </div>

          {upcomingBookings.length === 0 ? (
            <p className="text-xs text-stone-400 italic">No confirmed bookings recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {upcomingBookings.map((bkg) => (
                <div key={bkg.id} className="p-3.5 rounded-xl border border-stone-200/80 bg-stone-50/40 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-stone-900">{bkg.customerName}</span>
                    <span className="font-mono text-[10px] text-brand-900 font-bold bg-brand-50 px-1.5 py-0.5 rounded">
                      {bkg.referenceNo}
                    </span>
                  </div>
                  <div className="text-stone-500 text-[11px] truncate">
                    {bkg.venueName}
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-stone-100 text-[11px]">
                    <span className="text-emerald-800 font-semibold">{bkg.eventDate}</span>
                    <span className="font-serif font-bold text-stone-800">{formatPrice(bkg.agreedPrice)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
