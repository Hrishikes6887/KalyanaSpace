import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { venueService } from '../../services/venueService';
import { enquiryService } from '../../services/enquiryService';
import { bookingService } from '../../services/bookingService';
import {
  BarChart3,
  TrendingUp,
  Users,
  Building2,
  CalendarCheck,
  CheckCircle2,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

export const OwnerAnalyticsPage: React.FC = () => {
  const { user } = useAuth();
  const ownerId = user?.id || 'user_owner_1';

  const venues = venueService.getVenuesByOwner(ownerId);
  const enquiries = enquiryService.getEnquiriesByOwner(ownerId);
  const bookings = bookingService.getBookingsByOwner(ownerId);

  const totalEnquiries = enquiries.length;
  const visitCount = enquiries.filter(e => e.status === 'visit_scheduled' || e.status === 'converted').length;
  const convertedCount = enquiries.filter(e => e.status === 'converted').length;

  const visitConversion = totalEnquiries > 0 ? Math.round((visitCount / totalEnquiries) * 100) : 0;
  const bookingConversion = totalEnquiries > 0 ? Math.round((convertedCount / totalEnquiries) * 100) : 0;

  // Monthly distribution mock
  const monthlyData = [
    { month: 'Oct 2023', enquiries: 4, bookings: 1 },
    { month: 'Nov 2023', enquiries: 7, bookings: 2 },
    { month: 'Dec 2023', enquiries: 9, bookings: 3 },
    { month: 'Jan 2024', enquiries: 8, bookings: 2 },
    { month: 'Feb 2024', enquiries: 11, bookings: 3 },
    { month: 'Mar 2024', enquiries: 14, bookings: 4 },
  ];

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="pb-6 border-b border-stone-200">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-800 font-mono">
          Performance & Reporting
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
          Venue Analytics & Conversion
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Metrics calculated from your current local demo venue and enquiry records.
        </p>
      </div>

      {/* Top Conversion KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-subtle">
          <span className="text-xs font-semibold text-stone-500 block mb-1">Total Enquiries</span>
          <span className="font-serif text-3xl font-bold text-stone-900">{totalEnquiries}</span>
          <div className="mt-2 text-[11px] text-emerald-700 font-medium flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+24% vs last wedding season</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-subtle">
          <span className="text-xs font-semibold text-stone-500 block mb-1">Enquiry to Site Visit</span>
          <span className="font-serif text-3xl font-bold text-purple-900">{visitConversion}%</span>
          <div className="mt-2 text-[11px] text-stone-500">
            {visitCount} of {totalEnquiries} scheduled in-person visits
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-subtle">
          <span className="text-xs font-semibold text-stone-500 block mb-1">Enquiry to Booking</span>
          <span className="font-serif text-3xl font-bold text-emerald-900">{bookingConversion}%</span>
          <div className="mt-2 text-[11px] text-stone-500">
            {convertedCount} confirmed wedding token deposits
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-subtle">
          <span className="text-xs font-semibold text-stone-500 block mb-1">Avg Response Time</span>
          <span className="font-serif text-3xl font-bold text-stone-900">4.2 hrs</span>
          <div className="mt-2 text-[11px] text-emerald-700 font-medium">
            Faster than Karnataka 24h avg
          </div>
        </div>

      </div>

      {/* Monthly Enquiry Growth Chart Bar Visualization */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-card space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div>
            <h2 className="font-serif font-bold text-lg text-stone-900">
              Monthly Enquiry Growth & Bookings
            </h2>
            <p className="text-xs text-stone-500">
              Seasonal peaks during Karnataka Muhurtham periods (Nov-Jan and Feb-May).
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-brand-800" />
              <span>Enquiries</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-gold-500" />
              <span>Confirmed</span>
            </div>
          </div>
        </div>

        {/* CSS Bar Chart */}
        <div className="space-y-4 pt-2">
          {monthlyData.map((d) => (
            <div key={d.month} className="space-y-1.5 text-xs">
              <div className="flex justify-between font-medium text-stone-700">
                <span>{d.month}</span>
                <span>{d.enquiries} enquiries ({d.bookings} booked)</span>
              </div>
              <div className="h-4 rounded-full bg-stone-100 overflow-hidden flex">
                <div
                  style={{ width: `${(d.enquiries / 16) * 100}%` }}
                  className="bg-brand-800 h-full rounded-full"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Performing Venues */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-card space-y-4">
        <h2 className="font-serif font-bold text-lg text-stone-900 pb-2 border-b border-stone-100">
          Venue Performance Summary
        </h2>

        <div className="space-y-3">
          {venues.map((venue) => {
            const venueEnquiries = enquiries.filter(e => e.venueId === venue.id);
            const venueBookings = bookings.filter(b => b.venueId === venue.id);

            return (
              <div
                key={venue.id}
                className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
              >
                <div>
                  <h3 className="font-serif font-bold text-sm text-stone-900">{venue.name}</h3>
                  <span className="text-stone-500">{venue.locality}, {venue.city}</span>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <span className="text-stone-400 block text-[10px]">ENQUIRIES</span>
                    <span className="font-bold text-stone-900 text-sm">{venueEnquiries.length}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-stone-400 block text-[10px]">BOOKINGS</span>
                    <span className="font-bold text-emerald-800 text-sm">{venueBookings.length}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-stone-400 block text-[10px]">RATING</span>
                    <span className="font-bold text-amber-700 text-sm">★ {venue.rating}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
