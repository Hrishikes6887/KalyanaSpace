import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { venueService } from '../../services/venueService';
import { userService } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Venue, VenueStatus } from '../../types';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { ImageWithFallback } from '../../components/common/ImageWithFallback';
import {
  Building2,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Eye,
  Star,
  ShieldCheck,
  MapPin,
  ExternalLink
} from 'lucide-react';

export const AdminVenuesPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [venues, setVenues] = useState<Venue[]>(() => venueService.getAllVenues());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [cityFilter, setCityFilter] = useState<string>('all');

  // Rejection Dialog State
  const [rejectModalVenue, setRejectModalVenue] = useState<Venue | null>(null);
  const [rejectionReason, setRejectionReason] = useState('Fire NOC and structural safety certificate not provided.');

  // Venue View Modal
  const [viewVenue, setViewVenue] = useState<Venue | null>(null);

  const refreshList = () => {
    setVenues(venueService.getAllVenues());
    if (viewVenue) {
      setViewVenue(venueService.getVenueById(viewVenue.id) || null);
    }
  };

  const handleApprove = (venueId: string) => {
    const updated = venueService.updateVenueStatus(venueId, 'published', undefined, user?.name || 'Admin');
    if (updated) {
      refreshList();
      showToast('success', 'Venue Approved!', `${updated.name} is now published live on KalyanaSpace marketplace.`);
    }
  };

  const handleRejectSubmit = () => {
    if (!rejectModalVenue || !rejectionReason.trim()) return;
    const updated = venueService.updateVenueStatus(rejectModalVenue.id, 'rejected', rejectionReason.trim(), user?.name || 'Admin');
    if (updated) {
      refreshList();
      showToast('info', 'Venue Rejected', `${updated.name} has been rejected with documented reason.`);
    }
    setRejectModalVenue(null);
  };

  const handleSuspendToggle = (venue: Venue) => {
    const nextStatus = venue.status === 'suspended' ? 'published' : 'suspended';
    const updated = venueService.updateVenueStatus(venue.id, nextStatus, undefined, user?.name || 'Admin');
    if (updated) {
      refreshList();
      showToast(
        nextStatus === 'suspended' ? 'warning' : 'success',
        `Listing ${nextStatus === 'suspended' ? 'Suspended' : 'Reactivated'}`,
        `${venue.name} status updated.`
      );
    }
  };

  const handleToggleFeatured = (venueId: string) => {
    const updated = venueService.toggleFeatured(venueId);
    if (updated) {
      refreshList();
      showToast('info', `Featured Status Toggled`, `${updated.name} is ${updated.isFeatured ? 'now featured' : 'unfeatured'}.`);
    }
  };

  const getStatusBadge = (status: VenueStatus) => {
    switch (status) {
      case 'published':
        return <Badge variant="emerald" size="sm">Published</Badge>;
      case 'pending_approval':
        return <Badge variant="gold" size="sm">Pending Approval</Badge>;
      case 'rejected':
        return <Badge variant="red" size="sm">Rejected</Badge>;
      case 'suspended':
        return <Badge variant="red" size="sm">Suspended</Badge>;
      default:
        return <Badge variant="gray" size="sm">Draft</Badge>;
    }
  };

  const filteredVenues = venues.filter((v) => {
    const matchesQuery =
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.locality.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || v.status === statusFilter;
    const matchesCity = cityFilter === 'all' || v.city === cityFilter;

    return matchesQuery && matchesStatus && matchesCity;
  });

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-rose-800 font-mono">
            Listing Verification
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
            Venue Administration ({venues.length})
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Inspect venue credentials, approve new submissions, manage suspension, and curate featured venues.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-subtle">
        <div className="relative max-w-sm w-full">
          <input
            type="text"
            placeholder="Search venue name, locality, city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3.5 py-2 pl-9 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-700"
          />
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
        </div>

        <div className="flex items-center gap-3 text-xs">
          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-stone-200 bg-white font-medium cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="pending_approval">Pending Approval</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="suspended">Suspended</option>
            <option value="rejected">Rejected</option>
          </select>

          {/* City filter */}
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-stone-200 bg-white font-medium cursor-pointer"
          >
            <option value="all">All Cities</option>
            <option value="Bengaluru">Bengaluru</option>
            <option value="Mysuru">Mysuru</option>
            <option value="Hubballi">Hubballi</option>
            <option value="Belagavi">Belagavi</option>
            <option value="Mangaluru">Mangaluru</option>
          </select>
        </div>
      </div>

      {/* Venues Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-mono uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Venue & City</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Capacity</th>
                <th className="py-3 px-4">Starting Price</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Featured</th>
                <th className="py-3 px-4 text-right">Administrative Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredVenues.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400 italic">
                    No venues found matching current filter parameters.
                  </td>
                </tr>
              ) : (
                filteredVenues.map((v) => (
                  <tr key={v.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                          <ImageWithFallback src={v.featuredImage} alt={v.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <span className="font-semibold text-stone-900 block">{v.name}</span>
                          <span className="text-[11px] text-stone-500">{v.locality}, {v.city}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-stone-700 capitalize">
                      {v.category.replace(/_/g, ' ')}
                    </td>
                    <td className="py-3.5 px-4 text-stone-700">
                      {v.guestCapacityMin} - {v.guestCapacityMax} Guests
                    </td>
                    <td className="py-3.5 px-4 font-serif font-bold text-stone-900">
                      ₹{v.startingPrice.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4">
                      {getStatusBadge(v.status)}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleFeatured(v.id)}
                        className={`p-1 rounded-lg transition-colors ${
                          v.isFeatured ? 'text-amber-500 hover:text-amber-600' : 'text-stone-300 hover:text-stone-500'
                        }`}
                        title="Toggle Featured on Marketplace"
                      >
                        <Star className={`w-4 h-4 ${v.isFeatured ? 'fill-current' : ''}`} />
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => setViewVenue(v)}
                        className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {v.status === 'pending_approval' && (
                        <>
                          <button
                            onClick={() => handleApprove(v.id)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px]"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => setRejectModalVenue(v)}
                            className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold text-[11px]"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {v.status === 'published' && (
                        <button
                          onClick={() => handleSuspendToggle(v)}
                          className="px-2.5 py-1 rounded-lg text-rose-600 hover:bg-rose-50 font-semibold text-[11px]"
                        >
                          Suspend
                        </button>
                      )}

                      {v.status === 'suspended' && (
                        <button
                          onClick={() => handleSuspendToggle(v)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-semibold text-[11px]"
                        >
                          Reactivate
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject Reason Form Modal */}
      {rejectModalVenue && (
        <Modal
          isOpen={!!rejectModalVenue}
          onClose={() => setRejectModalVenue(null)}
          title={`Reject Listing: ${rejectModalVenue.name}`}
          subtitle="Document reason for venue rejection to notify owner"
          maxWidth="md"
        >
          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Reason for Rejection <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-rose-500"
                required
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setRejectModalVenue(null)}
                className="px-4 py-2 rounded-lg bg-stone-100 text-stone-700 font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRejectSubmit}
                className="px-4 py-2 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-700"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* View Details Modal */}
      {viewVenue && (
        <Modal
          isOpen={!!viewVenue}
          onClose={() => setViewVenue(null)}
          title={viewVenue.name}
          subtitle={`${viewVenue.locality}, ${viewVenue.city}`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs">
            <div className="aspect-[16/9] rounded-xl overflow-hidden border border-stone-200">
              <ImageWithFallback src={viewVenue.featuredImage} alt={viewVenue.name} className="w-full h-full object-cover" />
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 bg-stone-50 rounded-xl">
              <div>
                <span className="text-stone-500 block text-[11px]">Owner ID</span>
                <span className="font-mono font-semibold">{viewVenue.ownerId}</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[11px]">Category</span>
                <span className="font-semibold capitalize">{viewVenue.category.replace(/_/g, ' ')}</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[11px]">Capacity</span>
                <span className="font-semibold">{viewVenue.guestCapacityMin} - {viewVenue.guestCapacityMax} Guests</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[11px]">Price</span>
                <span className="font-serif font-bold">₹{viewVenue.startingPrice.toLocaleString('en-IN')} / {viewVenue.pricingType}</span>
              </div>
            </div>

            <p className="text-stone-600 leading-relaxed">{viewVenue.description}</p>

            {viewVenue.rejectionReason && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-900">
                <span className="font-bold block mb-0.5">Rejection Record:</span>
                <p>{viewVenue.rejectionReason}</p>
              </div>
            )}

            <div className="pt-3 border-t border-stone-100 flex justify-between items-center">
              <Link
                to={`/venues/${viewVenue.id}`}
                target="_blank"
                className="text-emerald-700 font-semibold flex items-center gap-1 hover:underline"
              >
                <span>View Public Page</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => setViewVenue(null)}
                className="px-4 py-2 rounded-lg bg-stone-800 text-white font-semibold"
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
