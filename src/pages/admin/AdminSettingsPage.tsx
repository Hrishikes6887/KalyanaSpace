import React, { useState } from 'react';
import { storage } from '../../services/storage';
import { useToast } from '../../context/ToastContext';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import {
  RotateCcw,
  Database,
  ShieldCheck,
  Server,
  HardDrive,
  FileCode,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const { showToast } = useToast();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const venuesCount = storage.getVenues().length;
  const usersCount = storage.getUsers().length;
  const enquiriesCount = storage.getEnquiries().length;
  const bookingsCount = storage.getBookings().length;
  const reviewsCount = storage.getReviews().length;

  const handleResetData = () => {
    storage.resetAllToSeed();
    setShowResetConfirm(false);
    showToast('success', 'Database Reset Complete', 'All seed records restored to initial values.');
    setTimeout(() => {
      window.location.reload();
    }, 600);
  };

  return (
    <div className="space-y-8 max-w-4xl pb-12">
      
      {/* Header */}
      <div className="pb-6 border-b border-stone-200">
        <span className="text-xs font-bold uppercase tracking-wider text-rose-800 font-mono">
          System Configuration
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
          Demo Settings & Data Architecture
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Review local mock persistence, storage health, and system reset controls.
        </p>
      </div>

      {/* Local Store Health */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-card space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-emerald-700" />
            <h2 className="font-serif font-bold text-lg text-stone-900">Local Demo Database Status</h2>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            Schema v1.0.0 (Healthy)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
            <span className="text-[10px] text-stone-500 block uppercase font-mono">Venues</span>
            <span className="font-bold text-lg text-stone-900">{venuesCount}</span>
          </div>
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
            <span className="text-[10px] text-stone-500 block uppercase font-mono">Users</span>
            <span className="font-bold text-lg text-stone-900">{usersCount}</span>
          </div>
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
            <span className="text-[10px] text-stone-500 block uppercase font-mono">Enquiries</span>
            <span className="font-bold text-lg text-stone-900">{enquiriesCount}</span>
          </div>
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
            <span className="text-[10px] text-stone-500 block uppercase font-mono">Bookings</span>
            <span className="font-bold text-lg text-stone-900">{bookingsCount}</span>
          </div>
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
            <span className="text-[10px] text-stone-500 block uppercase font-mono">Reviews</span>
            <span className="font-bold text-lg text-stone-900">{reviewsCount}</span>
          </div>
        </div>

        <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 space-y-1">
          <span className="font-bold block">Persistent Browser Storage Note:</span>
          <p className="leading-relaxed">
            All records, customer submissions, owner calendar blocks, and admin approvals are stored in browser localStorage. You can refresh or close your browser without losing test data.
          </p>
        </div>
      </div>

      {/* Reset Section */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-card space-y-4">
        <h2 className="font-serif font-bold text-lg text-rose-900">Re-initialize Seed Database</h2>
        <p className="text-xs text-stone-600 leading-relaxed max-w-xl">
          If you want to return the application back to the pristine demonstration state with original seed wedding halls, inquiries, and demo users, you can trigger a full seed reset.
        </p>
        <button
          onClick={() => setShowResetConfirm(true)}
          className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs flex items-center gap-2 shadow-xs transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Data to Initial Seed</span>
        </button>
      </div>

      {/* Future Supabase Architecture Map */}
      <div className="bg-stone-900 text-white rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-gold-400">
          <Server className="w-5 h-5" />
          <h2 className="font-serif font-bold text-lg">Production Backend Roadmap (Supabase Ready)</h2>
        </div>
        <p className="text-xs text-stone-300 leading-relaxed max-w-2xl">
          The application uses clean, decoupled service interfaces (<code className="font-mono text-gold-300">authService</code>, <code className="font-mono text-gold-300">venueService</code>, <code className="font-mono text-gold-300">enquiryService</code>, <code className="font-mono text-gold-300">bookingService</code>). To connect Supabase, replace the localStorage calls inside the service layer with Supabase client RPCs/queries without touching UI components.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-3 bg-stone-800 rounded-xl border border-stone-700">
            <span className="font-bold text-emerald-400 block mb-1">Postgres Schemas</span>
            <span className="text-stone-400 text-[11px]">Direct 1:1 mapping with TypeScript domain interfaces in <code className="font-mono">src/types</code>.</span>
          </div>
          <div className="p-3 bg-stone-800 rounded-xl border border-stone-700">
            <span className="font-bold text-emerald-400 block mb-1">Row Level Security</span>
            <span className="text-stone-400 text-[11px]">Owner venues isolated by <code className="font-mono">owner_id</code>, customer enquiries isolated by <code className="font-mono">customer_id</code>.</span>
          </div>
          <div className="p-3 bg-stone-800 rounded-xl border border-stone-700">
            <span className="font-bold text-emerald-400 block mb-1">Storage Buckets</span>
            <span className="text-stone-400 text-[11px]">Ready for Supabase Storage bucket <code className="font-mono">venue-photos</code>.</span>
          </div>
        </div>
      </div>

      {/* Confirm Reset Dialog */}
      <ConfirmDialog
        isOpen={showResetConfirm}
        title="Reset All Local Demo Records?"
        message="This will overwrite your browser's local store with the original 16 seed wedding halls across Bengaluru, Mysuru, Hubballi, Belagavi, Mangaluru, along with initial enquiries and demo accounts."
        confirmLabel="Reset Everything"
        cancelLabel="Cancel"
        isDestructive={true}
        onConfirm={handleResetData}
        onCancel={() => setShowResetConfirm(false)}
      />

    </div>
  );
};
