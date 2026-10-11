import React, { useState } from 'react';
import { enquiryService } from '../../services/enquiryService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Enquiry, EnquiryStatus } from '../../types';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import {
  Inbox,
  Search,
  Filter,
  Eye,
  UserCheck,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';

export const AdminEnquiriesPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [enquiries, setEnquiries] = useState<Enquiry[]>(() => enquiryService.getAllEnquiries());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);

  // Modal editing
  const [assignedCoordinator, setAssignedCoordinator] = useState('');
  const [newStatus, setNewStatus] = useState<EnquiryStatus>('new');
  const [adminNote, setAdminNote] = useState('');

  const refreshList = () => {
    const list = enquiryService.getAllEnquiries();
    setEnquiries(list);
    if (selectedEnquiry) {
      setSelectedEnquiry(list.find(e => e.id === selectedEnquiry.id) || null);
    }
  };

  const handleOpenModal = (enq: Enquiry) => {
    setSelectedEnquiry(enq);
    setAssignedCoordinator(enq.assignedCoordinator || 'Pooja Hegde (Admin Concierge)');
    setNewStatus(enq.status);
    setAdminNote('');
  };

  const handleSaveModal = () => {
    if (!selectedEnquiry) return;

    if (assignedCoordinator !== selectedEnquiry.assignedCoordinator) {
      enquiryService.assignCoordinator(selectedEnquiry.id, assignedCoordinator);
    }

    if (newStatus !== selectedEnquiry.status || adminNote.trim()) {
      enquiryService.updateStatus(
        selectedEnquiry.id,
        newStatus,
        adminNote.trim(),
        user?.name || 'Administrator',
        'admin'
      );
    }

    refreshList();
    showToast('success', 'Enquiry Updated', `Saved administrative changes for ${selectedEnquiry.id}`);
    setSelectedEnquiry(null);
  };

  const filteredEnquiries = enquiries.filter((e) => {
    const matchesQuery =
      e.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.venueName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-rose-800 font-mono">
            Platform Transactions
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
            All Marketplace Enquiries ({enquiries.length})
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Cross-venue enquiry queue, coordinator assignments, and audit tracking.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-subtle">
        <div className="relative max-w-sm w-full">
          <input
            type="text"
            placeholder="Search by ID, customer name, or venue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3.5 py-2 pl-9 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-700"
          />
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto text-xs">
          {['all', 'new', 'contacted', 'visit_scheduled', 'quotation_shared', 'converted', 'closed'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl capitalize font-medium whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? 'bg-stone-900 text-white font-semibold'
                  : 'bg-stone-50 text-stone-600 hover:bg-stone-100 border border-stone-200'
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
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Target Venue</th>
                <th className="py-3 px-4">Date & Occasion</th>
                <th className="py-3 px-4">Coordinator</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredEnquiries.map((enq) => (
                <tr key={enq.id} className="hover:bg-stone-50/50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-stone-900">
                    {enq.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-stone-900 block">{enq.customerName}</span>
                    <span className="text-[11px] text-stone-500 font-mono">{enq.customerPhone}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-medium text-stone-900 block">{enq.venueName}</span>
                    <span className="text-[11px] text-stone-500">{enq.venueCity}</span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-stone-800">
                    {enq.eventDate}
                    <span className="block text-[10px] text-stone-400 capitalize">{enq.eventType}</span>
                  </td>
                  <td className="py-3.5 px-4 text-stone-600">
                    {enq.assignedCoordinator || 'Unassigned'}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="capitalize px-2 py-0.5 rounded-full text-[10px] font-semibold bg-stone-100 text-stone-800">
                      {enq.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleOpenModal(enq)}
                      className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 font-semibold text-stone-700 text-xs"
                    >
                      Inspect / Assign
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin Enquiry Modal */}
      {selectedEnquiry && (
        <Modal
          isOpen={!!selectedEnquiry}
          onClose={() => setSelectedEnquiry(null)}
          title={`Administrative Inspection: ${selectedEnquiry.id}`}
          subtitle={`${selectedEnquiry.venueName} • ${selectedEnquiry.customerName}`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 p-3 bg-stone-50 rounded-xl">
              <div>
                <span className="text-stone-500 block text-[11px]">Customer Contact</span>
                <span className="font-semibold">{selectedEnquiry.customerPhone} ({selectedEnquiry.customerEmail})</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[11px]">Event Date & Type</span>
                <span className="font-semibold">{selectedEnquiry.eventDate} ({selectedEnquiry.eventType})</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[11px]">Guests & Budget</span>
                <span className="font-semibold">{selectedEnquiry.guestCount} guests / ₹{selectedEnquiry.estimatedBudget.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[11px]">Venue Owner ID</span>
                <span className="font-mono font-semibold">{selectedEnquiry.ownerId}</span>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Assign Platform Coordinator
              </label>
              <input
                type="text"
                value={assignedCoordinator}
                onChange={(e) => setAssignedCoordinator(e.target.value)}
                placeholder="e.g. Pooja Hegde (Concierge Team)"
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Override Status (Admin)
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as EnquiryStatus)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs bg-white"
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="visit_scheduled">Visit Scheduled</option>
                <option value="quotation_shared">Quotation Shared</option>
                <option value="converted">Confirmed Booking</option>
                <option value="closed">Closed</option>
                <option value="withdrawn">Withdrawn</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Internal Administrative Note
              </label>
              <textarea
                rows={2}
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="Log notes about customer callback, owner coordination..."
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs"
              />
            </div>

            <div className="pt-3 border-t border-stone-100 flex justify-end gap-2">
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="px-4 py-2 rounded-lg bg-stone-100 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveModal}
                className="px-5 py-2 rounded-lg bg-stone-900 text-white font-semibold"
              >
                Save Changes
              </button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};
