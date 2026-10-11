import React from 'react';
import { Link } from 'react-router-dom';
import { useComparison } from '../context/ComparisonContext';
import { venueService } from '../services/venueService';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { StarRating } from '../components/common/StarRating';
import { Badge } from '../components/common/Badge';
import {
  X,
  Scale,
  Check,
  MapPin,
  Users,
  UtensilsCrossed,
  Wind,
  Car,
  Home,
  ShieldCheck,
  Plus,
  ArrowRight
} from 'lucide-react';

export const ComparePage: React.FC = () => {
  const { compareIds, removeFromCompare, clearCompare } = useComparison();

  const venues = compareIds
    .map(id => venueService.getVenueById(id))
    .filter((v): v is NonNullable<typeof v> => v !== undefined);

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
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gold-700 font-mono">
              Side-by-Side Comparison
            </span>
            <h1 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900 mt-1">
              Compare Wedding Venues ({venues.length}/3)
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Evaluate pricing, capacity, catering policies, and amenities to find the right fit for your family.
            </p>
          </div>

          {venues.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                onClick={clearCompare}
                className="text-xs font-medium text-stone-500 hover:text-stone-800 transition-colors"
              >
                Clear All
              </button>
              <Link
                to="/venues"
                className="px-4 py-2 rounded-xl bg-brand-800 text-white text-xs font-semibold hover:bg-brand-900 transition-colors shadow-xs"
              >
                + Add More Venues
              </Link>
            </div>
          )}
        </div>

        {venues.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center border border-stone-200 shadow-subtle max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-4">
              <Scale className="w-8 h-8" />
            </div>
            <h3 className="font-serif font-bold text-xl text-stone-900 mb-2">
              No Venues in Comparison Yet
            </h3>
            <p className="text-xs text-stone-500 mb-6 leading-relaxed">
              You can select up to 3 wedding halls to compare side-by-side by clicking the balance scale icon on any venue card.
            </p>
            <Link
              to="/venues"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-800 text-white text-xs font-semibold hover:bg-brand-900 transition-colors shadow-xs"
            >
              <span>Explore Wedding Halls</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-stone-200 shadow-card overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50/50">
                  <th className="p-4 w-48 text-xs font-bold uppercase tracking-wider text-stone-500 font-mono">
                    Criteria
                  </th>
                  {venues.map((venue) => (
                    <th key={venue.id} className="p-4 w-72 align-top">
                      <div className="relative group">
                        <button
                          onClick={() => removeFromCompare(venue.id)}
                          className="absolute -top-1 -right-1 p-1 bg-white hover:bg-rose-50 text-stone-400 hover:text-rose-600 rounded-full border border-stone-200 shadow-xs transition-colors z-10"
                          title="Remove from comparison"
                          aria-label={`Remove ${venue.name} from comparison`}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                        <div className="aspect-[16/10] rounded-xl overflow-hidden mb-3 border border-stone-200">
                          <ImageWithFallback
                            src={venue.featuredImage}
                            alt={venue.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h3 className="font-serif font-bold text-sm text-stone-900 line-clamp-1">
                          {venue.name}
                        </h3>
                        <p className="text-[11px] text-stone-500 mb-2">{venue.locality}, {venue.city}</p>
                        <Link
                          to={`/venues/${venue.id}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-brand-800 hover:text-brand-900"
                        >
                          <span>View Full Page</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </th>
                  ))}
                  {/* Empty Slot Placeholder if < 3 */}
                  {venues.length < 3 && (
                    <th className="p-4 w-72 align-middle text-center bg-stone-50/30 border-l border-stone-100">
                      <Link
                        to="/venues"
                        className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-stone-200 rounded-xl text-stone-400 hover:border-brand-500 hover:text-brand-800 transition-colors"
                      >
                        <Plus className="w-6 h-6 mb-1" />
                        <span className="text-xs font-semibold">Add 3rd Venue</span>
                      </Link>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs">
                {/* Starting Price */}
                <tr className="hover:bg-stone-50/50">
                  <td className="p-4 font-semibold text-stone-700 bg-stone-50/40">Starting Price</td>
                  {venues.map((v) => (
                    <td key={v.id} className="p-4 font-serif font-bold text-base text-brand-900">
                      {formatPrice(v.startingPrice)}
                      <span className="text-[10px] text-stone-500 font-sans font-normal block">
                        per {v.pricingType.replace('_', ' ')}
                      </span>
                    </td>
                  ))}
                  {venues.length < 3 && <td className="p-4 bg-stone-50/20" />}
                </tr>

                {/* Rating */}
                <tr className="hover:bg-stone-50/50">
                  <td className="p-4 font-semibold text-stone-700 bg-stone-50/40">Customer Rating</td>
                  {venues.map((v) => (
                    <td key={v.id} className="p-4">
                      <StarRating rating={v.rating} reviewCount={v.reviewCount} size="sm" />
                    </td>
                  ))}
                  {venues.length < 3 && <td className="p-4 bg-stone-50/20" />}
                </tr>

                {/* Guest Capacity */}
                <tr className="hover:bg-stone-50/50">
                  <td className="p-4 font-semibold text-stone-700 bg-stone-50/40">Guest Capacity</td>
                  {venues.map((v) => (
                    <td key={v.id} className="p-4 font-medium text-stone-800">
                      {v.guestCapacityMin} - {v.guestCapacityMax} Guests
                    </td>
                  ))}
                  {venues.length < 3 && <td className="p-4 bg-stone-50/20" />}
                </tr>

                {/* Dining Capacity */}
                <tr className="hover:bg-stone-50/50">
                  <td className="p-4 font-semibold text-stone-700 bg-stone-50/40">Dining Seating</td>
                  {venues.map((v) => (
                    <td key={v.id} className="p-4 font-medium text-stone-800">
                      {v.diningCapacity} Seater simultaneous
                    </td>
                  ))}
                  {venues.length < 3 && <td className="p-4 bg-stone-50/20" />}
                </tr>

                {/* AC Availability */}
                <tr className="hover:bg-stone-50/50">
                  <td className="p-4 font-semibold text-stone-700 bg-stone-50/40">Air Conditioning</td>
                  {venues.map((v) => (
                    <td key={v.id} className="p-4">
                      {v.hasAC ? (
                        <span className="inline-flex items-center gap-1 font-semibold text-emerald-800">
                          <Check className="w-3.5 h-3.5" /> Central AC
                        </span>
                      ) : (
                        <span className="text-stone-400">Non-AC (Natural Ventilation)</span>
                      )}
                    </td>
                  ))}
                  {venues.length < 3 && <td className="p-4 bg-stone-50/20" />}
                </tr>

                {/* Parking */}
                <tr className="hover:bg-stone-50/50">
                  <td className="p-4 font-semibold text-stone-700 bg-stone-50/40">Dedicated Parking</td>
                  {venues.map((v) => (
                    <td key={v.id} className="p-4">
                      {v.hasParking ? `${v.parkingCapacity} Cars` : 'Street Parking Only'}
                    </td>
                  ))}
                  {venues.length < 3 && <td className="p-4 bg-stone-50/20" />}
                </tr>

                {/* Catering Compliance */}
                <tr className="hover:bg-stone-50/50">
                  <td className="p-4 font-semibold text-stone-700 bg-stone-50/40">Catering Policy</td>
                  {venues.map((v) => (
                    <td key={v.id} className="p-4">
                      <span className="capitalize font-medium text-stone-800">
                        {v.cateringType.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] text-stone-500 block">
                        {v.allowOutsideCatering ? 'Outside Caterers Allowed' : 'In-House Only'}
                      </span>
                    </td>
                  ))}
                  {venues.length < 3 && <td className="p-4 bg-stone-50/20" />}
                </tr>

                {/* Guest Rooms */}
                <tr className="hover:bg-stone-50/50">
                  <td className="p-4 font-semibold text-stone-700 bg-stone-50/40">AC Guest Rooms</td>
                  {venues.map((v) => (
                    <td key={v.id} className="p-4 font-medium text-stone-800">
                      {v.roomsCount} Rooms
                    </td>
                  ))}
                  {venues.length < 3 && <td className="p-4 bg-stone-50/20" />}
                </tr>

                {/* Verification */}
                <tr className="hover:bg-stone-50/50">
                  <td className="p-4 font-semibold text-stone-700 bg-stone-50/40">Verification Status</td>
                  {venues.map((v) => (
                    <td key={v.id} className="p-4">
                      {v.isVerified ? (
                        <span className="inline-flex items-center gap-1 text-sky-800 font-semibold">
                          <ShieldCheck className="w-4 h-4 text-sky-600" /> Inspected & Verified
                        </span>
                      ) : (
                        <span className="text-stone-400">Standard Listing</span>
                      )}
                    </td>
                  ))}
                  {venues.length < 3 && <td className="p-4 bg-stone-50/20" />}
                </tr>
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
};
