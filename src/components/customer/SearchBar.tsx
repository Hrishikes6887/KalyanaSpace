import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { MapPin, Calendar, Users, IndianRupee, Search } from 'lucide-react';
import { KarnatakaCity } from '../../types';

interface SearchBarProps {
  initialCity?: string;
  initialGuests?: number;
  initialBudget?: number;
  initialDate?: string;
  variant?: 'hero' | 'compact';
}

export const SearchBar: React.FC<SearchBarProps> = ({
  initialCity = '',
  initialGuests,
  initialBudget,
  initialDate = '',
  variant = 'hero',
}) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [city, setCity] = useState(initialCity);
  const [eventDate, setEventDate] = useState(initialDate);
  const [guests, setGuests] = useState<string>(initialGuests ? String(initialGuests) : '');
  const [budget, setBudget] = useState<string>(initialBudget ? String(initialBudget) : '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city && city !== 'All') params.set('city', city);
    if (eventDate) params.set('date', eventDate);
    if (guests) params.set('minGuests', guests);
    if (budget) params.set('maxPrice', budget);

    navigate(`/venues?${params.toString()}`);
  };

  if (variant === 'compact') {
    return (
      <form
        onSubmit={handleSearch}
        className="bg-white rounded-2xl p-2.5 shadow-subtle border border-stone-200 flex flex-wrap items-center gap-2"
      >
        <div className="flex-1 min-w-[140px] flex items-center gap-2 px-3 py-2 bg-stone-50 rounded-xl border border-stone-100">
          <MapPin className="w-4 h-4 text-brand-700 shrink-0" />
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full text-xs font-medium text-stone-800 bg-transparent focus:outline-none"
          >
            <option value="">All Karnataka Cities</option>
            <option value="Bengaluru">Bengaluru</option>
            <option value="Mysuru">Mysuru</option>
            <option value="Hubballi">Hubballi</option>
            <option value="Belagavi">Belagavi</option>
            <option value="Mangaluru">Mangaluru</option>
          </select>
        </div>

        <div className="w-36 flex items-center gap-2 px-3 py-2 bg-stone-50 rounded-xl border border-stone-100">
          <Users className="w-4 h-4 text-brand-700 shrink-0" />
          <input
            type="number"
            placeholder="Min Guests"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="w-full text-xs text-stone-800 bg-transparent focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-brand-800 hover:bg-brand-900 text-white font-semibold text-xs flex items-center gap-2 transition-colors shadow-xs"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Update</span>
        </button>
      </form>
    );
  }

  return (
    <form
      onSubmit={handleSearch}
      className="bg-white/95 backdrop-blur-md rounded-2xl p-3 sm:p-4 shadow-elevated border border-stone-200/90 max-w-4xl mx-auto"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* City Select */}
        <div className="flex flex-col text-left px-3.5 py-2 rounded-xl bg-stone-50/80 border border-stone-200/60 focus-within:ring-2 focus-within:ring-brand-700 focus-within:border-transparent transition-all">
          <label className="text-[10px] font-semibold tracking-wider uppercase text-stone-500 mb-0.5">
            City / Region
          </label>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-brand-700 shrink-0" />
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full text-xs font-semibold text-stone-900 bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="">All Karnataka Locations</option>
              <option value="Bengaluru">Bengaluru (Capital)</option>
              <option value="Mysuru">Mysuru (Heritage)</option>
              <option value="Hubballi">Hubballi (North KA)</option>
              <option value="Belagavi">Belagavi (Western KA)</option>
              <option value="Mangaluru">Mangaluru (Coastal)</option>
            </select>
          </div>
        </div>

        {/* Date */}
        <div className="flex flex-col text-left px-3.5 py-2 rounded-xl bg-stone-50/80 border border-stone-200/60 focus-within:ring-2 focus-within:ring-brand-700 focus-within:border-transparent transition-all">
          <label className="text-[10px] font-semibold tracking-wider uppercase text-stone-500 mb-0.5">
            Event Date
          </label>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-brand-700 shrink-0" />
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full text-xs font-medium text-stone-900 bg-transparent focus:outline-none"
            />
          </div>
        </div>

        {/* Guests */}
        <div className="flex flex-col text-left px-3.5 py-2 rounded-xl bg-stone-50/80 border border-stone-200/60 focus-within:ring-2 focus-within:ring-brand-700 focus-within:border-transparent transition-all">
          <label className="text-[10px] font-semibold tracking-wider uppercase text-stone-500 mb-0.5">
            Expected Guests
          </label>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-brand-700 shrink-0" />
            <input
              type="number"
              placeholder="e.g. 800"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="w-full text-xs font-medium text-stone-900 bg-transparent focus:outline-none"
            />
          </div>
        </div>

        {/* Budget */}
        <div className="flex flex-col text-left px-3.5 py-2 rounded-xl bg-stone-50/80 border border-stone-200/60 focus-within:ring-2 focus-within:ring-brand-700 focus-within:border-transparent transition-all">
          <label className="text-[10px] font-semibold tracking-wider uppercase text-stone-500 mb-0.5">
            Max Budget
          </label>
          <div className="flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-brand-700 shrink-0" />
            <input
              type="number"
              step="25000"
              placeholder="₹ Max Budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full text-xs font-medium text-stone-900 bg-transparent focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-end">
        <button
          type="submit"
          className="w-full sm:w-auto px-8 py-3 rounded-xl bg-brand-800 hover:bg-brand-900 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-card hover:shadow-elevated active:scale-98"
        >
          <Search className="w-4 h-4 text-gold-300" />
          <span>{t('searchButton')}</span>
        </button>
      </div>
    </form>
  );
};
