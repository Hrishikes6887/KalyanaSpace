import React from 'react';
import { VenueFilterCriteria, VenueCategory } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { Filter, RotateCcw, Check, Sparkles, X } from 'lucide-react';

interface FilterDrawerProps {
  filters: VenueFilterCriteria;
  onFilterChange: (updated: Partial<VenueFilterCriteria>) => void;
  onReset: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  filters,
  onFilterChange,
  onReset,
  isMobileOpen = false,
  onMobileClose,
}) => {
  const { t } = useLanguage();

  const categories: { label: string; value: VenueCategory | 'all' }[] = [
    { label: 'All Categories', value: 'all' },
    { label: 'Traditional Kalyana Mantapa', value: 'traditional_kalyana_mantapa' },
    { label: 'Luxury Convention Hall', value: 'luxury_convention_center' },
    { label: 'Modern Banquet Hall', value: 'modern_banquet_hall' },
    { label: 'Heritage Palace & Lawns', value: 'heritage_palace_lawn' },
    { label: 'Resort Wedding Venue', value: 'resort_wedding_venue' },
    { label: 'Community & Mini Hall', value: 'community_mini_hall' },
  ];

  const cities = ['All', 'Bengaluru', 'Mysuru', 'Hubballi', 'Belagavi', 'Mangaluru'];

  const content = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-200">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-brand-800" />
          <h3 className="font-serif font-bold text-stone-900 text-base">{t('filterHeading')}</h3>
        </div>
        <button
          onClick={onReset}
          className="text-xs font-medium text-brand-800 hover:text-brand-900 flex items-center gap-1 hover:underline"
        >
          <RotateCcw className="w-3 h-3" />
          <span>{t('clearAll')}</span>
        </button>
      </div>

      {/* City */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2 font-mono">
          {t('filterCity')}
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {cities.map((cityOption) => {
            const isSelected =
              cityOption === 'All'
                ? !filters.city || filters.city === 'All'
                : filters.city === cityOption;
            return (
              <button
                key={cityOption}
                type="button"
                onClick={() => onFilterChange({ city: cityOption === 'All' ? undefined : cityOption })}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium text-left transition-all ${
                  isSelected
                    ? 'bg-brand-800 text-white font-semibold shadow-xs'
                    : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border border-stone-200/60'
                }`}
              >
                {cityOption}
              </button>
            );
          })}
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2 font-mono">
          {t('filterVenueType')}
        </label>
        <div className="space-y-1">
          {categories.map((cat) => {
            const isSelected = (filters.category || 'all') === cat.value;
            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => onFilterChange({ category: cat.value === 'all' ? undefined : cat.value })}
                className={`w-full px-3 py-2 rounded-lg text-xs font-medium text-left flex items-center justify-between transition-colors ${
                  isSelected
                    ? 'bg-brand-50 text-brand-900 font-semibold border border-brand-200'
                    : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                <span>{cat.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-brand-700" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-700 font-mono">
            {t('filterPriceRange')}
          </label>
          <span className="text-xs font-semibold text-brand-900">
            Up to ₹{(filters.maxPrice || 400000).toLocaleString('en-IN')}
          </span>
        </div>
        <input
          type="range"
          min="40000"
          max="400000"
          step="20000"
          value={filters.maxPrice || 400000}
          onChange={(e) => onFilterChange({ maxPrice: Number(e.target.value) })}
          className="w-full accent-brand-800 cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-stone-400 mt-1">
          <span>₹40,000</span>
          <span>₹4,00,000+</span>
        </div>
      </div>

      {/* Guest Capacity */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-700 font-mono">
            {t('filterGuestCapacity')}
          </label>
          <span className="text-xs font-semibold text-brand-900">
            Min {filters.minGuests || 100} Guests
          </span>
        </div>
        <input
          type="range"
          min="100"
          max="2500"
          step="100"
          value={filters.minGuests || 100}
          onChange={(e) => onFilterChange({ minGuests: Number(e.target.value) })}
          className="w-full accent-brand-800 cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-stone-400 mt-1">
          <span>100</span>
          <span>2,500+</span>
        </div>
      </div>

      {/* Amenities & Toggles */}
      <div className="space-y-3 pt-2 border-t border-stone-200">
        <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 font-mono">
          Features & Standards
        </label>

        <label className="flex items-center gap-2.5 text-xs text-stone-700 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={!!filters.hasAC}
            onChange={(e) => onFilterChange({ hasAC: e.target.checked || undefined })}
            className="w-4 h-4 rounded border-stone-300 text-brand-800 focus:ring-brand-500"
          />
          <span>{t('filterAC')}</span>
        </label>

        <label className="flex items-center gap-2.5 text-xs text-stone-700 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={!!filters.hasParking}
            onChange={(e) => onFilterChange({ hasParking: e.target.checked || undefined })}
            className="w-4 h-4 rounded border-stone-300 text-brand-800 focus:ring-brand-500"
          />
          <span>{t('filterParkingAvail')}</span>
        </label>

        <label className="flex items-center gap-2.5 text-xs text-stone-700 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={!!filters.isVerified}
            onChange={(e) => onFilterChange({ isVerified: e.target.checked || undefined })}
            className="w-4 h-4 rounded border-stone-300 text-brand-800 focus:ring-brand-500"
          />
          <span>{t('filterVerifiedOnly')}</span>
        </label>
      </div>

      {/* Catering Preference */}
      <div className="pt-2 border-t border-stone-200">
        <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2 font-mono">
          Catering Compliance
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={() => onFilterChange({ cateringType: undefined })}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
              !filters.cateringType
                ? 'bg-brand-800 text-white font-semibold'
                : 'bg-stone-50 text-stone-700 border border-stone-200'
            }`}
          >
            All Catering
          </button>
          <button
            type="button"
            onClick={() => onFilterChange({ cateringType: 'veg_only' })}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
              filters.cateringType === 'veg_only'
                ? 'bg-brand-800 text-white font-semibold'
                : 'bg-stone-50 text-stone-700 border border-stone-200'
            }`}
          >
            Pure Veg Only
          </button>
        </div>
      </div>

      {/* Minimum Rating */}
      <div className="pt-2 border-t border-stone-200">
        <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2 font-mono">
          Customer Rating
        </label>
        <div className="flex gap-1.5">
          {[4.5, 4.0, 3.5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onFilterChange({ minRating: filters.minRating === star ? undefined : star })}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium text-center border ${
                filters.minRating === star
                  ? 'bg-brand-50 border-brand-300 text-brand-900 font-bold'
                  : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
              }`}
            >
              ★ {star}+
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Filter Panel */}
      <div className="hidden lg:block bg-white p-5 rounded-2xl border border-stone-200 shadow-subtle sticky top-24">
        {content}
      </div>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden overflow-y-auto">
          <div
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
            onClick={onMobileClose}
          />
          <div className="relative min-h-full flex flex-col justify-end">
            <div className="relative bg-white rounded-t-3xl p-6 shadow-elevated border-t border-stone-200 max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-100">
                <span className="font-serif font-bold text-base text-stone-900">Search Filters</span>
                <button
                  onClick={onMobileClose}
                  className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {content}
              <div className="mt-6 pt-4 border-t border-stone-200">
                <button
                  onClick={onMobileClose}
                  className="w-full py-3 bg-brand-800 text-white rounded-xl text-sm font-semibold shadow-xs"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
