import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Venue } from '../../types';
import { useFavorites } from '../../context/FavoritesContext';
import { useComparison } from '../../context/ComparisonContext';
import { useToast } from '../../context/ToastContext';
import { ImageWithFallback } from '../common/ImageWithFallback';
import { StarRating } from '../common/StarRating';
import { Badge } from '../common/Badge';
import { QuickEnquiryModal } from './QuickEnquiryModal';
import {
  Heart,
  Scale,
  MapPin,
  Users,
  UtensilsCrossed,
  Wind,
  Car,
  CheckCircle2,
  CalendarDays,
  ArrowRight
} from 'lucide-react';

interface VenueCardProps {
  venue: Venue;
  layout?: 'grid' | 'list';
}

export const VenueCard: React.FC<VenueCardProps> = ({ venue, layout = 'grid' }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isInCompare, addToCompare, removeFromCompare } = useComparison();
  const { showToast } = useToast();
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  const favorited = isFavorite(venue.id);
  const compared = isInCompare(venue.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(venue.id);
    showToast(
      favorited ? 'info' : 'success',
      favorited ? 'Removed from favorites' : 'Saved to favorites',
      venue.name
    );
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (compared) {
      removeFromCompare(venue.id);
      showToast('info', 'Removed from comparison', venue.name);
    } else {
      const added = addToCompare(venue.id);
      if (added) {
        showToast('success', 'Added to comparison list', `${venue.name} (view at /compare)`);
      } else {
        showToast('warning', 'Comparison limit reached', 'You can compare up to 3 wedding halls at once.');
      }
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'traditional_kalyana_mantapa':
        return 'Kalyana Mantapa';
      case 'luxury_convention_center':
        return 'Luxury Convention';
      case 'modern_banquet_hall':
        return 'Banquet Hall';
      case 'heritage_palace_lawn':
        return 'Palace Lawn';
      case 'resort_wedding_venue':
        return 'Resort Venue';
      default:
        return 'Mini Hall';
    }
  };

  return (
    <>
      <div
        className={`group bg-white rounded-2xl border border-stone-200/90 shadow-card hover:shadow-elevated transition-all duration-300 overflow-hidden flex flex-col ${
          layout === 'list' ? 'md:flex-row' : ''
        }`}
      >
        {/* Photo Section */}
        <div className={`relative overflow-hidden ${layout === 'list' ? 'md:w-72 lg:w-80 shrink-0 h-64 md:h-auto' : 'h-56'}`}>
          <Link to={`/venues/${venue.id}`} className="block h-full w-full">
            <ImageWithFallback
              src={venue.featuredImage || venue.images[0]}
              alt={venue.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </Link>

          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 pointer-events-none">
            <Badge variant="emerald" size="sm">
              {getCategoryLabel(venue.category)}
            </Badge>
            {venue.isVerified && (
              <Badge variant="blue" size="sm" icon={<CheckCircle2 className="w-3 h-3 text-sky-600" />}>
                Verified
              </Badge>
            )}
          </div>

          {/* Floating Actions: Favorite & Compare */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            <button
              onClick={handleCompareClick}
              aria-label={compared ? 'Remove from compare' : 'Add to compare'}
              className={`p-2 rounded-full backdrop-blur-md shadow-xs transition-transform active:scale-90 ${
                compared
                  ? 'bg-brand-800 text-white'
                  : 'bg-white/90 text-stone-700 hover:bg-white hover:text-brand-800'
              }`}
              title={compared ? 'Remove from compare' : 'Compare up to 3 venues'}
            >
              <Scale className="w-4 h-4" />
            </button>

            <button
              onClick={handleFavoriteClick}
              aria-label={favorited ? 'Remove favorite' : 'Save favorite'}
              className={`p-2 rounded-full backdrop-blur-md shadow-xs transition-transform active:scale-90 ${
                favorited
                  ? 'bg-rose-50 text-rose-600'
                  : 'bg-white/90 text-stone-700 hover:bg-white hover:text-rose-600'
              }`}
            >
              <Heart className={`w-4 h-4 ${favorited ? 'fill-rose-600' : ''}`} />
            </button>
          </div>

          {/* Location pill on photo */}
          <div className="absolute bottom-3 left-3 bg-stone-900/80 backdrop-blur-xs text-white text-[11px] font-medium px-2.5 py-1 rounded-md flex items-center gap-1">
            <MapPin className="w-3 h-3 text-gold-400" />
            <span>{venue.locality}, {venue.city}</span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <Link to={`/venues/${venue.id}`} className="group-hover:text-brand-800 transition-colors">
                <h3 className="font-serif text-lg font-bold text-stone-900 leading-snug line-clamp-1">
                  {venue.name}
                </h3>
              </Link>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <StarRating rating={venue.rating} reviewCount={venue.reviewCount} size="sm" />
              <span className="text-stone-300">•</span>
              <span className="text-xs text-stone-500 capitalize">{venue.cateringType.replace('_', ' ')}</span>
            </div>

            <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-4">
              {venue.description}
            </p>

            {/* Amenity Badges Grid */}
            <div className="grid grid-cols-2 gap-2 py-3 border-y border-stone-100 text-xs text-stone-600 mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span className="truncate">{venue.guestCapacityMin} - {venue.guestCapacityMax} Guests</span>
              </div>
              <div className="flex items-center gap-2">
                <UtensilsCrossed className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span className="truncate">{venue.diningCapacity} Seater Dining</span>
              </div>
              <div className="flex items-center gap-2">
                <Wind className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span>{venue.hasAC ? 'Central AC' : 'Non-AC'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Car className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span>{venue.hasParking ? `${venue.parkingCapacity} Cars` : 'Street Parking'}</span>
              </div>
            </div>
          </div>

          {/* Pricing and Action Buttons */}
          <div className="flex items-center justify-between pt-1 gap-3">
            <div>
              <span className="text-[11px] text-stone-500 block leading-tight">Starting from</span>
              <span className="text-base font-bold text-brand-900 font-serif">
                {formatPrice(venue.startingPrice)}
              </span>
              <span className="text-[10px] text-stone-500 font-normal"> / {venue.pricingType.replace('_', ' ')}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setEnquiryOpen(true)}
                className="px-3 py-2 text-xs font-semibold rounded-xl bg-brand-50 text-brand-800 hover:bg-brand-100 border border-brand-200 transition-colors flex items-center gap-1.5"
              >
                <CalendarDays className="w-3.5 h-3.5" />
                <span>Enquire</span>
              </button>

              <Link
                to={`/venues/${venue.id}`}
                className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-brand-800 hover:bg-brand-900 text-white transition-colors shadow-xs flex items-center gap-1"
              >
                <span>Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <QuickEnquiryModal
        isOpen={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
        venue={venue}
      />
    </>
  );
};
