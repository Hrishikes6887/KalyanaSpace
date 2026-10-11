import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { venueService } from '../../services/venueService';
import { Venue } from '../../types';
import { Badge } from '../../components/common/Badge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { ImageWithFallback } from '../../components/common/ImageWithFallback';
import {
  Building2,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Eye,
  MapPin,
  Users,
  Search,
  CheckCircle2,
  Globe,
  FileText
} from 'lucide-react';

export const OwnerVenuesPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const ownerId = user?.id || 'user_owner_1';

  const [venues, setVenues] = useState<Venue[]>(() => venueService.getVenuesByOwner(ownerId));
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const refreshVenues = () => {
    setVenues(venueService.getVenuesByOwner(ownerId));
  };

  const handleTogglePublish = (venue: Venue) => {
    const nextStatus = venue.status === 'published' ? 'draft' : 'published';
    const updated = venueService.updateVenue(venue.id, { status: nextStatus });
    if (updated) {
      refreshVenues();
      showToast(
        'success',
        `Listing status changed to ${nextStatus.toUpperCase()}`,
        `${venue.name} is now ${nextStatus === 'published' ? 'visible to the public' : 'saved as a draft'}.`
      );
    }
  };

  const handleDeleteConfirm = () => {
    if (!deleteTargetId) return;
    const ok = venueService.deleteVenue(deleteTargetId);
    setDeleteTargetId(null);
    if (ok) {
      refreshVenues();
      showToast('info', 'Venue deleted', 'The venue listing has been removed.');
    }
  };

  const filteredVenues = venues.filter((v) =>
    v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.locality.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatPrice = (p: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(p);
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800 font-mono">
            Properties Portfolio
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
            My Venue Listings ({venues.length})
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage your hall listings, pricing cards, photos, and public visibility.
          </p>
        </div>

        <Link
          to="/owner/venues/new"
          className="px-4 py-2.5 rounded-xl bg-brand-800 hover:bg-brand-900 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Wedding Hall</span>
        </Link>
      </div>

      {/* Search Filter */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative max-w-sm w-full">
          <input
            type="text"
            placeholder="Search venue by name, locality, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3.5 py-2 pl-9 text-xs rounded-xl bg-white border border-stone-200 shadow-subtle focus:outline-none focus:ring-2 focus:ring-brand-700"
          />
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
        </div>
      </div>

      {/* Venues Grid / List */}
      {filteredVenues.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 shadow-subtle">
          <Building2 className="w-10 h-10 text-stone-300 mx-auto mb-2" />
          <h3 className="font-serif font-bold text-base text-stone-900 mb-1">No Venues Found</h3>
          <p className="text-xs text-stone-500 mb-4">No venues match your search query.</p>
          <button
            onClick={() => setSearchQuery('')}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-stone-100 hover:bg-stone-200"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredVenues.map((venue) => (
            <div
              key={venue.id}
              className="bg-white rounded-2xl border border-stone-200 shadow-subtle hover:shadow-card transition-all p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
            >
              <div className="flex items-start gap-4 flex-1">
                <div className="w-24 h-20 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                  <ImageWithFallback
                    src={venue.featuredImage}
                    alt={venue.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-serif font-bold text-base text-stone-900">{venue.name}</h3>
                    {venue.status === 'published' ? (
                      <Badge variant="emerald" size="sm">Published (Live)</Badge>
                    ) : venue.status === 'pending_approval' ? (
                      <Badge variant="gold" size="sm">Pending Approval</Badge>
                    ) : (
                      <Badge variant="gray" size="sm">Draft</Badge>
                    )}
                    {venue.isFeatured && (
                      <Badge variant="gold" size="sm">Featured</Badge>
                    )}
                  </div>

                  <p className="text-xs text-stone-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-stone-400" />
                    <span>{venue.locality}, {venue.city}</span>
                    <span className="text-stone-300">•</span>
                    <span>{venue.category.replace(/_/g, ' ')}</span>
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-stone-600 pt-1">
                    <span className="font-semibold text-brand-900 font-serif">
                      {formatPrice(venue.startingPrice)} / {venue.pricingType.replace('_', ' ')}
                    </span>
                    <span className="text-stone-300">•</span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-stone-400" />
                      {venue.guestCapacityMin} - {venue.guestCapacityMax} Guests
                    </span>
                    <span className="text-stone-300">•</span>
                    <span>★ {venue.rating} ({venue.reviewCount} reviews)</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 self-end md:self-center">
                <Link
                  to={`/venues/${venue.id}`}
                  className="p-2 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors"
                  title="Preview Public Listing"
                >
                  <Eye className="w-4 h-4" />
                </Link>

                <button
                  onClick={() => handleTogglePublish(venue)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                    venue.status === 'published'
                      ? 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  {venue.status === 'published' ? 'Unpublish (Draft)' : 'Publish Live'}
                </button>

                <Link
                  to={`/owner/venues/edit/${venue.id}`}
                  className="p-2 rounded-lg text-brand-800 hover:bg-brand-50 transition-colors border border-stone-200"
                  title="Edit Venue"
                >
                  <Edit className="w-4 h-4" />
                </Link>

                <button
                  onClick={() => setDeleteTargetId(venue.id)}
                  className="p-2 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                  title="Delete Venue"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        title="Delete Venue Listing?"
        message="Are you sure you want to delete this wedding hall from your portfolio? This will remove it from the public marketplace."
        confirmLabel="Delete Listing"
        cancelLabel="Cancel"
        isDestructive={true}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTargetId(null)}
      />

    </div>
  );
};
