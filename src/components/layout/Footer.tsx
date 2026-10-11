import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, MapPin, Phone, Mail, ShieldCheck, Heart } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-700 text-gold-300 flex items-center justify-center font-serif text-lg font-bold">
                <Sparkles className="w-4 h-4 text-gold-300" />
              </div>
              <span className="font-serif text-2xl font-bold text-white tracking-tight">
                Kalyana<span className="text-gold-400 font-sans font-semibold">Space</span>
              </span>
            </Link>
            <p className="text-sm text-stone-400 max-w-sm leading-relaxed">
              Karnataka’s premier wedding venue discovery and enquiry platform. Helping couples find verified traditional kalyana mantapas and modern banquet centers with transparent pricing and direct owner connection.
            </p>
            <div className="pt-2 flex flex-col gap-2 text-xs text-stone-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Headquarters: Indiranagar, Bengaluru, Karnataka 560038</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Enquiry Helpline: +91 80 4910 8800 (Mon-Sat, 9am - 7pm)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Concierge: support@kalyanaspace.demo</span>
              </div>
            </div>
          </div>

          {/* Karnataka Cities */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-200 mb-4 font-mono">
              Locations in Karnataka
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li>
                <Link to="/venues?city=Bengaluru" className="hover:text-emerald-400 transition-colors">
                  Bengaluru Wedding Halls
                </Link>
              </li>
              <li>
                <Link to="/venues?city=Mysuru" className="hover:text-emerald-400 transition-colors">
                  Mysuru Heritage Mantapas
                </Link>
              </li>
              <li>
                <Link to="/venues?city=Hubballi" className="hover:text-emerald-400 transition-colors">
                  Hubballi Convention Halls
                </Link>
              </li>
              <li>
                <Link to="/venues?city=Belagavi" className="hover:text-emerald-400 transition-colors">
                  Belagavi Banquet Venues
                </Link>
              </li>
              <li>
                <Link to="/venues?city=Mangaluru" className="hover:text-emerald-400 transition-colors">
                  Mangaluru Beach Resorts
                </Link>
              </li>
            </ul>
          </div>

          {/* Venue Categories */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-200 mb-4 font-mono">
              Venue Categories
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li>
                <Link to="/venues?category=traditional_kalyana_mantapa" className="hover:text-emerald-400 transition-colors">
                  Traditional Kalyana Mantapa
                </Link>
              </li>
              <li>
                <Link to="/venues?category=luxury_convention_center" className="hover:text-emerald-400 transition-colors">
                  Luxury Convention Centers
                </Link>
              </li>
              <li>
                <Link to="/venues?category=heritage_palace_lawn" className="hover:text-emerald-400 transition-colors">
                  Palace Lawns & Courtyards
                </Link>
              </li>
              <li>
                <Link to="/venues?category=modern_banquet_hall" className="hover:text-emerald-400 transition-colors">
                  Modern Banquet Halls
                </Link>
              </li>
              <li>
                <Link to="/venues?category=resort_wedding_venue" className="hover:text-emerald-400 transition-colors">
                  Destination Wedding Resorts
                </Link>
              </li>
            </ul>
          </div>

          {/* For Venue Owners & Operations */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-200 mb-4 font-mono">
              For Hall Owners
            </h4>
            <div className="bg-stone-800/80 p-4 rounded-xl border border-stone-700/80 space-y-3">
              <p className="text-xs text-stone-300">
                Own a kalyana mantapa or banquet venue in Karnataka? Receive direct enquiries without intermediary commissions.
              </p>
              <Link
                to="/owner"
                className="block text-center text-xs font-semibold px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
              >
                Owner Dashboard
              </Link>
              <Link
                to="/login"
                className="block text-center text-xs font-medium text-stone-400 hover:text-stone-200 transition-colors"
              >
                Demo Role Logins
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>KalyanaSpace Frontend MVP — Karnataka Market Launch Preview</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for Karnataka Weddings</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
