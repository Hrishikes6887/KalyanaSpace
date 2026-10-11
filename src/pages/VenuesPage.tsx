import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { venueService } from '../services/venueService';
import { VenueFilterCriteria, Venue } from '../types';
import { VenueCard } from '../components/customer/VenueCard';
import { FilterDrawer } from '../components/customer/FilterDrawer';
import { useLanguage } from '../context/LanguageContext';
import {
  LayoutGrid,
  List,
  SlidersHorizontal,
  Search,
  Sparkles,
  MapPin,
  RotateCcw
} from 'lucide-react';

export const VenuesPage: React.FC = () => {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  // State from URL or defaults
  const cityParam = searchParams.get('city') || undefined;
  const categoryParam = searchParams.get('category') || undefined;
  const minGuestsParam = searchParams.get('minGuests') ? Number(searchParams.get('minGuests')) : undefined;
  const maxPriceParam = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;

  const [criteria, setCriteria] = useState<VenueFilterCriteria>({
    city: cityParam,
    category: categoryParam,
    minGuests: minGuestsParam,
    maxPrice: maxPriceParam,
    sortBy: 'recommended',
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(9);

  // Sync searchQuery with criteria
  const handleQueryChange = (val: string) => {
    setSearchQuery(val);
    setCriteria(prev => ({ ...prev, searchQuery: val }));
  };

  const handleFilterUpdate = (partial: Partial<VenueFilterCriteria>) => {
    setCriteria(prev => ({ ...prev, ...partial }));
    setVisibleCount(9); // Reset pagination
  };

  const handleResetFilters = () => {
    setCriteria({
      sortBy: 'recommended',
    });
    setSearchQuery('');
    setSearchParams({});
    setVisibleCount(9);
  };

  // Fetch filtered venues
  const filteredVenues: Venue[] = useMemo(() => {
    return venueService.getPublicVenues(criteria);
  }, [criteria]);

  const displayedVenues = filteredVenues.slice(0, visibleCount);
  const hasMore = visibleCount < filteredVenues.length;

  return (
    <div className="bg-ivory-100 min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title & Search Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-stone-200">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-gold-700 font-mono">
                Karnataka Venue Directory
              </span>
              <h1 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900 mt-1">
                Explore Wedding Halls & Kalyana Mantapas
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                Showing verified listings across Bengaluru, Mysuru, Hubballi, Belagavi, and Mangaluru.
              </p>
            </div>

            {/* Quick Text Search Bar */}
            <div className="w-full md:w-80">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search hall name, locality, city..."
                  value={searchQuery}
                  onChange={(e) => handleQueryChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 pl-9 text-xs rounded-xl bg-white border border-stone-200 shadow-subtle focus:outline-none focus:ring-2 focus:ring-brand-700"
                />
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                {searchQuery && (
                  <button
                    onClick={() => handleQueryChange('')}
                    className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600 text-xs"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Results Summary & Sorting / Layout Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-stone-200 text-xs font-semibold text-stone-800 shadow-subtle"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-brand-800" />
                <span>Filters</span>
              </button>

              <span className="text-xs font-semibold text-stone-700">
                <strong className="text-brand-900">{filteredVenues.length}</strong> {t('resultsFound')}
                {criteria.city && (
                  <span className="ml-1 text-brand-800 font-medium">in {criteria.city}</span>
                )}
              </span>
            </div>

            <div className="flex items-center gap-3 ml-auto">
              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-stone-500 hidden sm:inline">{t('sortBy')}:</span>
                <select
                  value={criteria.sortBy || 'recommended'}
                  onChange={(e) => handleFilterUpdate({ sortBy: e.target.value as any })}
                  className="px-3 py-2 rounded-xl bg-white border border-stone-200 text-xs font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-brand-700 cursor-pointer shadow-subtle"
                >
                  <option value="recommended">{t('sortRecommended')}</option>
                  <option value="price_asc">{t('sortPriceAsc')}</option>
                  <option value="price_desc">{t('sortPriceDesc')}</option>
                  <option value="rating">{t('sortRating')}</option>
                  <option value="capacity_desc">{t('sortCapacityDesc')}</option>
                </select>
              </div>

              {/* Grid / List View Toggle */}
              <div className="hidden sm:flex items-center bg-white rounded-xl border border-stone-200 p-0.5 shadow-subtle">
                <button
                  onClick={() => setLayout('grid')}
                  aria-label="Grid layout"
                  className={`p-1.5 rounded-lg transition-colors ${
                    layout === 'grid'
                      ? 'bg-brand-50 text-brand-900'
                      : 'text-stone-400 hover:text-stone-700'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setLayout('list')}
                  aria-label="List layout"
                  className={`p-1.5 rounded-lg transition-colors ${
                    layout === 'list'
                      ? 'bg-brand-50 text-brand-900'
                      : 'text-stone-400 hover:text-stone-700'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Layout: Sidebar Filters + Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Filters Sidebar (Desktop) & Mobile Drawer */}
          <div className="lg:col-span-1">
            <FilterDrawer
              filters={criteria}
              onFilterChange={handleFilterUpdate}
              onReset={handleResetFilters}
              isMobileOpen={mobileFilterOpen}
              onMobileClose={() => setMobileFilterOpen(false)}
            />
          </div>

          {/* Venues Grid / List */}
          <div className="lg:col-span-3">
            {filteredVenues.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 shadow-subtle">
                <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="font-serif font-bold text-xl text-stone-900 mb-2">
                  No Venues Match Your Current Filters
                </h3>
                <p className="text-xs text-stone-500 max-w-md mx-auto mb-6 leading-relaxed">
                  We couldn't find any wedding halls matching all selected criteria. Try widening your price range, guest count, or clearing city filters.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-800 text-white text-xs font-semibold hover:bg-brand-900 transition-colors shadow-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                <div
                  className={
                    layout === 'grid'
                      ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                      : 'space-y-4'
                  }
                >
                  {displayedVenues.map((venue) => (
                    <VenueCard key={venue.id} venue={venue} layout={layout} />
                  ))}
                </div>

                {/* Load More Button */}
                {hasMore && (
                  <div className="text-center pt-4">
                    <button
                      onClick={() => setVisibleCount((prev) => prev + 6)}
                      className="px-6 py-3 rounded-xl bg-white hover:bg-stone-50 text-stone-800 border border-stone-200 text-xs font-semibold shadow-subtle transition-all"
                    >
                      Load More Wedding Halls ({filteredVenues.length - visibleCount} remaining)
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
