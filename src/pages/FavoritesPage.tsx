import React from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { venueService } from '../services/venueService';
import { VenueCard } from '../components/customer/VenueCard';
import { Heart, ArrowRight } from 'lucide-react';

export const FavoritesPage: React.FC = () => {
  const { favorites, clearFavorites } = useFavorites();

  const favoriteVenues = favorites
    .map((id) => venueService.getVenueById(id))
    .filter((v): v is NonNullable<typeof v> => v !== undefined && v.status === 'published');

  return (
    <div className="bg-ivory-100 min-h-screen py-10 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gold-700 font-mono">
              Saved Shortlist
            </span>
            <h1 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900 mt-1">
              Your Favorite Venues ({favoriteVenues.length})
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Halls you have shortlisted for your family discussion and enquiry.
            </p>
          </div>

          {favoriteVenues.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                onClick={clearFavorites}
                className="text-xs font-medium text-stone-500 hover:text-stone-800 transition-colors"
              >
                Clear All Favorites
              </button>
              <Link
                to="/venues"
                className="px-4 py-2 rounded-xl bg-brand-800 text-white text-xs font-semibold hover:bg-brand-900 transition-colors shadow-xs"
              >
                Explore More Halls
              </Link>
            </div>
          )}
        </div>

        {favoriteVenues.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center border border-stone-200 shadow-subtle max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="font-serif font-bold text-xl text-stone-900 mb-2">
              No Favorite Venues Saved Yet
            </h3>
            <p className="text-xs text-stone-500 mb-6 leading-relaxed">
              Browse our verified kalyana mantapas and click the heart icon on any venue card to build your wedding shortlist.
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteVenues.map((venue) => (
              <VenueCard key={venue.id} venue={venue} layout="grid" />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
