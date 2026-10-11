import React from 'react';
import { Link } from 'react-router-dom';
import { userService } from '../../services/userService';
import { venueService } from '../../services/venueService';
import { enquiryService } from '../../services/enquiryService';
import { bookingService } from '../../services/bookingService';
import { storage } from '../../services/storage';
import { Badge } from '../../components/common/Badge';
import {
  Users,
  Building2,
  Inbox,
  CalendarCheck,
  ShieldCheck,
  AlertCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  Activity,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const AdminOverviewPage: React.FC = () => {
  const users = userService.getAllUsers();
  const venues = venueService.getAllVenues();
  const enquiries = enquiryService.getAllEnquiries();
  const bookings = bookingService.getAllBookings();
  const activityLogs = storage.getActivityLogs().slice(0, 6);

  const customerCount = users.filter(u => u.role === 'customer').length;
  const ownerCount = users.filter(u => u.role === 'owner').length;
  const publishedCount = venues.filter(v => v.status === 'published').length;
  const pendingApprovals = venues.filter(v => v.status === 'pending_approval');
  const newEnquiriesCount = enquiries.filter(e => e.status === 'new').length;

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-rose-800 font-mono">
            Platform Master Console
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
            System Administration Overview
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Oversee venue verification, user registrations, and platform operations across Karnataka.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {pendingApprovals.length > 0 && (
            <Link
              to="/admin/venues"
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{pendingApprovals.length} Venues Awaiting Approval</span>
            </Link>
          )}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3.5">
        
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-subtle">
          <span className="text-[11px] font-semibold text-stone-500 block mb-1">Total Venues</span>
          <span className="font-serif text-2xl font-bold text-stone-900">{venues.length}</span>
          <span className="text-[10px] text-emerald-700 font-medium block mt-1">{publishedCount} live online</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-subtle">
          <span className="text-[11px] font-semibold text-stone-500 block mb-1">Pending Review</span>
          <span className="font-serif text-2xl font-bold text-rose-600">{pendingApprovals.length}</span>
          <span className="text-[10px] text-stone-400 block mt-1">Action required</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-subtle">
          <span className="text-[11px] font-semibold text-stone-500 block mb-1">Customers</span>
          <span className="font-serif text-2xl font-bold text-stone-900">{customerCount}</span>
          <span className="text-[10px] text-stone-400 block mt-1">Active users</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-subtle">
          <span className="text-[11px] font-semibold text-stone-500 block mb-1">Hall Owners</span>
          <span className="font-serif text-2xl font-bold text-stone-900">{ownerCount}</span>
          <span className="text-[10px] text-stone-400 block mt-1">Verified partners</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-subtle">
          <span className="text-[11px] font-semibold text-stone-500 block mb-1">Total Enquiries</span>
          <span className="font-serif text-2xl font-bold text-stone-900">{enquiries.length}</span>
          <span className="text-[10px] text-amber-700 font-medium block mt-1">{newEnquiriesCount} new today</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-subtle">
          <span className="text-[11px] font-semibold text-stone-500 block mb-1">Confirmed Bookings</span>
          <span className="font-serif text-2xl font-bold text-emerald-950">{bookings.length}</span>
          <span className="text-[10px] text-emerald-700 font-medium block mt-1">Advance token logged</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-subtle">
          <span className="text-[11px] font-semibold text-stone-500 block mb-1">Cities Active</span>
          <span className="font-serif text-2xl font-bold text-stone-900">5</span>
          <span className="text-[10px] text-stone-400 block mt-1">Karnataka coverage</span>
        </div>

      </div>

      {/* Pending Approvals Alert Banner */}
      {pendingApprovals.length > 0 && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <div>
              <span className="font-bold">Pending Approval Action:</span> {pendingApprovals.map(v => v.name).join(', ')} is awaiting administrator inspection.
            </div>
          </div>
          <Link
            to="/admin/venues"
            className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold transition-colors"
          >
            Review Listings
          </Link>
        </div>
      )}

      {/* Two Column Section: Recent Platform Activity & Recent Enquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Activity Log */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-700" />
              <h2 className="font-serif font-bold text-base text-stone-900">Live Platform Audit Logs</h2>
            </div>
            <span className="text-[10px] text-stone-400 font-mono">Real-time local state</span>
          </div>

          <div className="space-y-3">
            {activityLogs.map((log) => (
              <div key={log.id} className="p-3 rounded-xl bg-stone-50/70 border border-stone-100 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-900">{log.actorName}</span>
                  <span className="text-[10px] text-stone-400 font-mono">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-stone-600 text-[11px] leading-relaxed">{log.description}</p>
                <div className="pt-0.5">
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-stone-200/60 text-stone-600">
                    {log.action}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Platform Enquiries */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h2 className="font-serif font-bold text-base text-stone-900">Latest Marketplace Enquiries</h2>
            <Link to="/admin/enquiries" className="text-xs font-semibold text-emerald-700 hover:underline">
              View All ({enquiries.length})
            </Link>
          </div>

          <div className="space-y-3">
            {enquiries.slice(0, 5).map((enq) => (
              <div key={enq.id} className="p-3 rounded-xl border border-stone-100 bg-stone-50/50 text-xs flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-stone-900">{enq.customerName}</span>
                    <span className="text-[10px] font-mono text-stone-400">({enq.id})</span>
                  </div>
                  <span className="text-stone-500 text-[11px] block truncate max-w-xs">{enq.venueName} • {enq.eventDate}</span>
                </div>

                <div className="text-right shrink-0">
                  <span className="capitalize text-[10px] font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
                    {enq.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
