import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { venueService } from '../services/venueService';
import { SearchBar } from '../components/customer/SearchBar';
import { VenueCard } from '../components/customer/VenueCard';
import {
  Sparkles,
  ShieldCheck,
  CalendarCheck2,
  Clock,
  HeartHandshake,
  Building,
  CheckCircle,
  ArrowRight,
  MapPin,
  Palmtree,
  Landmark,
  Crown,
  Users
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const featuredVenues = venueService.getPublicVenues().filter(v => v.isFeatured).slice(0, 6);

  const categories = [
    {
      id: 'traditional_kalyana_mantapa',
      title: 'Traditional Kalyana Mantapa',
      desc: 'Authentic Vedic architecture with sacred havan shalas & banana leaf dining',
      icon: <Landmark className="w-6 h-6 text-brand-700" />,
      count: '8+ Venues',
    },
    {
      id: 'luxury_convention_center',
      title: 'Luxury Convention Hall',
      desc: 'Massive pillarless halls with centralized air conditioning & high guest capacity',
      icon: <Crown className="w-6 h-6 text-gold-600" />,
      count: '6+ Venues',
    },
    {
      id: 'heritage_palace_lawn',
      title: 'Palace Lawns & Courtyards',
      desc: 'Royal open-air settings reminiscent of Mysore & Bengaluru royal legacy',
      icon: <Sparkles className="w-6 h-6 text-amber-700" />,
      count: '4+ Venues',
    },
    {
      id: 'modern_banquet_hall',
      title: 'Modern Banquet Hall',
      desc: 'Cosmopolitan styling with automated stage lighting and acoustic design',
      icon: <Building className="w-6 h-6 text-emerald-700" />,
      count: '5+ Venues',
    },
    {
      id: 'resort_wedding_venue',
      title: 'Destination Wedding Resorts',
      desc: 'Coastal retreats and lakeside getaways with luxury rooms for families',
      icon: <Palmtree className="w-6 h-6 text-teal-700" />,
      count: '4+ Venues',
    },
    {
      id: 'community_mini_hall',
      title: 'Community Mini Halls',
      desc: 'Intimate spaces for engagement, upanayana, and family celebrations',
      icon: <Users className="w-6 h-6 text-stone-600" />,
      count: '3+ Venues',
    },
  ];

  const popularCities = [
    { name: 'Bengaluru', tag: 'South & North BLR', count: '8 Venues', image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=600&q=80' },
    { name: 'Mysuru', tag: 'Royal Heritage', count: '4 Venues', image: 'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=600&q=80' },
    { name: 'Hubballi', tag: 'Commercial Hub', count: '3 Venues', image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=600&q=80' },
    { name: 'Belagavi', tag: 'Western Gateway', count: '2 Venues', image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80' },
    { name: 'Mangaluru', tag: 'Coastal Weddings', count: '3 Venues', image: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=600&q=80' },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-gradient-to-b from-ivory-200 via-ivory-100 to-ivory-50 border-b border-stone-200/60">
        {/* Subtle decorative background accents */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-gold-100/40 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-brand-100/50 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-gold-200/80 shadow-subtle text-xs font-semibold text-brand-900 mb-6 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-gold-600" />
            <span>Verified Kalyana Mantapas & Banquet Halls in Karnataka</span>
          </div>

          {/* Main Title */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-brand-950 tracking-tight max-w-4xl mx-auto leading-[1.15] mb-5">
            {t('heroTitle')}
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed mb-10">
            {t('heroSubtitle')}
          </p>

          {/* Interactive Search Bar */}
          <div className="mb-8">
            <SearchBar variant="hero" />
          </div>

          {/* Location Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-stone-600">
            <span className="font-medium text-stone-500">{t('popularCities')}</span>
            {['Bengaluru', 'Mysuru', 'Hubballi', 'Belagavi', 'Mangaluru'].map((city) => (
              <button
                key={city}
                onClick={() => navigate(`/venues?city=${city}`)}
                className="px-3 py-1 rounded-full bg-white hover:bg-brand-50 hover:text-brand-800 border border-stone-200 text-stone-700 font-medium transition-all shadow-2xs"
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Locations in Karnataka */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gold-700 font-mono">
              Explore By Region
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              Top Karnataka Wedding Destinations
            </h2>
          </div>
          <Link
            to="/venues"
            className="text-xs font-semibold text-brand-800 hover:text-brand-900 flex items-center gap-1 group"
          >
            <span>View All Karnataka Halls</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
          {popularCities.map((c) => (
            <button
              key={c.name}
              onClick={() => navigate(`/venues?city=${c.name}`)}
              className="group relative rounded-2xl overflow-hidden aspect-[4/5] text-left shadow-subtle hover:shadow-card transition-all"
            >
              <img
                src={c.image}
                alt={c.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/30 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <span className="text-[10px] uppercase font-bold tracking-wider text-gold-300 block">
                  {c.tag}
                </span>
                <h3 className="font-serif font-bold text-base sm:text-lg leading-tight">
                  {c.name}
                </h3>
                <span className="text-[11px] text-stone-300 font-medium">
                  {c.count}
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Venues Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gold-700 font-mono">
              Handpicked & Verified
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              Featured Kalyana Mantapas & Convention Centres
            </h2>
          </div>
          <Link
            to="/venues"
            className="text-xs font-semibold text-brand-800 hover:text-brand-900 flex items-center gap-1 group"
          >
            <span>Explore All {venueService.getPublicVenues().length} Venues</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredVenues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} layout="grid" />
          ))}
        </div>
      </section>

      {/* Popular Categories Grid */}
      <section className="bg-ivory-200/60 py-16 border-y border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-gold-700 font-mono">
              Specialized Wedding Types
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              Find the Venue Tailored to Your Tradition
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-2">
              From pure vegetarian traditional kalyana mantapas with banana-leaf dining to modern tech-city banquets.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => navigate(`/venues?category=${cat.id}`)}
                className="group bg-white p-6 rounded-2xl border border-stone-200/80 shadow-subtle hover:shadow-card hover:border-brand-300 text-left transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-ivory-100 flex items-center justify-center mb-4 group-hover:bg-brand-50 transition-colors">
                    {cat.icon}
                  </div>
                  <h3 className="font-serif font-bold text-base text-stone-900 group-hover:text-brand-900 transition-colors mb-1.5">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-stone-500 leading-relaxed mb-4">
                    {cat.desc}
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs font-semibold text-brand-800 pt-3 border-t border-stone-100">
                  <span>{cat.count}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-gold-700 font-mono">
            Seamless Booking Journey
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
            How KalyanaSpace Works for Families
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-2">
            Eliminating broker fees and endless phone calls with transparent information and direct owner quotes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          <div className="bg-white p-7 rounded-2xl border border-stone-200/80 shadow-subtle relative text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-brand-800 text-white font-serif font-bold text-lg flex items-center justify-center mb-4 shadow-xs">
              1
            </div>
            <h3 className="font-serif font-bold text-lg text-stone-900 mb-2">
              Discover & Compare
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Filter by Karnataka cities, guest capacity, pure-veg compliance, dining arrangements, and verified amenities. Compare up to 3 halls side-by-side.
            </p>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-stone-200/80 shadow-subtle relative text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-brand-800 text-white font-serif font-bold text-lg flex items-center justify-center mb-4 shadow-xs">
              2
            </div>
            <h3 className="font-serif font-bold text-lg text-stone-900 mb-2">
              Send Direct Enquiry
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Submit your auspicious Muhurtham dates, expected guest count, and special requirements. Your enquiry goes straight to the venue manager with zero spam.
            </p>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-stone-200/80 shadow-subtle relative text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-brand-800 text-white font-serif font-bold text-lg flex items-center justify-center mb-4 shadow-xs">
              3
            </div>
            <h3 className="font-serif font-bold text-lg text-stone-900 mb-2">
              Visit & Finalize Dates
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Receive a customized quotation, schedule an in-person walkthrough of the mandapa, and finalize your booking with complete confidence.
            </p>
          </div>
        </div>
      </section>

      {/* Trust & Guarantee Indicators */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-900 text-white rounded-3xl p-8 sm:p-12 shadow-elevated relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-brand-800/60 blur-2xl pointer-events-none" />
          
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-start gap-3.5">
              <ShieldCheck className="w-8 h-8 text-gold-300 shrink-0" />
              <div>
                <h4 className="font-bold text-sm text-white mb-1">100% Verified Details</h4>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Real photos, inspected dining capacities, and genuine pricing cards.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <CalendarCheck2 className="w-8 h-8 text-gold-300 shrink-0" />
              <div>
                <h4 className="font-bold text-sm text-white mb-1">Enquiry Tracking</h4>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Track your enquiries, site visit schedules, and quotes in your dashboard.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <HeartHandshake className="w-8 h-8 text-gold-300 shrink-0" />
              <div>
                <h4 className="font-bold text-sm text-white mb-1">Direct Owner Pricing</h4>
                <p className="text-xs text-stone-300 leading-relaxed">
                  No hidden middleman markups. Directly negotiate terms with venue trustees.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <Clock className="w-8 h-8 text-gold-300 shrink-0" />
              <div>
                <h4 className="font-bold text-sm text-white mb-1">Prompt Response</h4>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Hall managers typically respond with date availability within 24 business hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hall Owner Call-To-Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-ivory-200 to-amber-50 rounded-3xl p-8 sm:p-12 border border-gold-200/80 shadow-card flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-gold-700 font-mono">
              For Venue Trustees & Owners
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1 mb-3">
              List Your Kalyana Mantapa on KalyanaSpace
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-4">
              Get genuine inquiries from families actively planning auspicious events in Karnataka. Manage your availability calendar and quotations from one unified dashboard.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-stone-700">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-700" />
                <span>Zero Listing Setup Fee</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-700" />
                <span>Direct Customer Phone Contacts</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-700" />
                <span>Integrated Availability Calendar</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <Link
              to="/owner"
              className="px-6 py-3.5 rounded-xl bg-brand-800 hover:bg-brand-900 text-white font-semibold text-xs sm:text-sm text-center shadow-xs transition-colors"
            >
              Access Owner Dashboard
            </Link>
            <Link
              to="/owner/venues"
              className="px-6 py-3.5 rounded-xl bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 font-semibold text-xs sm:text-sm text-center shadow-xs transition-colors"
            >
              Add New Venue Listing
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
