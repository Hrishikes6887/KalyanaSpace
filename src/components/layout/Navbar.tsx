import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useComparison } from '../../context/ComparisonContext';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import {
  Menu,
  X,
  Heart,
  Scale,
  User as UserIcon,
  LogOut,
  Sparkles,
  Store,
  ShieldCheck,
  CalendarCheck,
  ChevronDown
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { t } = useLanguage();
  const { user, role, logout } = useAuth();
  const { favorites } = useFavorites();
  const { compareIds } = useComparison();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-30 bg-ivory-50/95 backdrop-blur-md border-b border-stone-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-brand-800 text-gold-300 flex items-center justify-center font-serif text-xl font-bold shadow-subtle group-hover:bg-brand-900 transition-colors">
                <Sparkles className="w-5 h-5 text-gold-300" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl font-bold tracking-tight text-brand-950 group-hover:text-brand-800 transition-colors">
                  Kalyana<span className="text-gold-600 font-sans font-semibold">Space</span>
                </span>
                <span className="text-[10px] tracking-widest uppercase font-semibold text-stone-500 hidden sm:block -mt-1">
                  Karnataka Wedding Venues
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-stone-700">
            <Link
              to="/venues"
              className={`transition-colors hover:text-brand-800 ${isActive('/venues') ? 'text-brand-800 font-semibold' : ''}`}
            >
              {t('navExplore')}
            </Link>
            <a
              href="/#how-it-works"
              className="transition-colors hover:text-brand-800"
            >
              {t('navHowItWorks')}
            </a>

            {/* Compare Pill */}
            <Link
              to="/compare"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all border ${
                isActive('/compare')
                  ? 'bg-brand-50 border-brand-300 text-brand-800 font-semibold'
                  : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
              }`}
            >
              <Scale className="w-3.5 h-3.5 text-brand-700" />
              <span>{t('navCompare')}</span>
              {compareIds.length > 0 && (
                <span className="w-4.5 h-4.5 rounded-full bg-brand-800 text-white text-[10px] font-bold flex items-center justify-center">
                  {compareIds.length}
                </span>
              )}
            </Link>

            {/* Favorites Pill */}
            <Link
              to="/favorites"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all border ${
                isActive('/favorites')
                  ? 'bg-rose-50 border-rose-200 text-rose-800 font-semibold'
                  : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${favorites.length > 0 ? 'text-rose-600 fill-rose-600' : 'text-stone-400'}`} />
              <span>{t('navFavorites')}</span>
              {favorites.length > 0 && (
                <span className="w-4.5 h-4.5 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>
          </nav>

          {/* Right Action Icons & Auth */}
          <div className="hidden lg:flex items-center gap-4">
            <LanguageSwitcher variant="pill" />

            {/* Role Links */}
            {role === 'owner' ? (
              <Link
                to="/owner"
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-lg bg-amber-50 text-amber-900 border border-amber-200/90 hover:bg-amber-100 transition-colors"
              >
                <Store className="w-3.5 h-3.5 text-amber-700" />
                <span>Owner Dashboard</span>
              </Link>
            ) : role === 'admin' ? (
              <Link
                to="/admin"
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-lg bg-stone-900 text-white hover:bg-stone-800 transition-colors shadow-xs"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Admin Portal</span>
              </Link>
            ) : (
              <Link
                to="/owner"
                className="text-xs font-medium text-stone-600 hover:text-brand-800 transition-colors"
              >
                For Hall Owners
              </Link>
            )}

            {/* User Dropdown / Login */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pl-2.5 rounded-full border border-stone-200 bg-white hover:border-stone-300 shadow-xs transition-all text-xs font-medium"
                >
                  <span className="max-w-[120px] truncate text-stone-800 font-semibold">{user.name.split(' ')[0]}</span>
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="w-7 h-7 rounded-full object-cover border border-stone-200" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-800 flex items-center justify-center font-bold">
                      {user.name.charAt(0)}
                    </div>
                  )}
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                </button>

                {userDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-20" onClick={() => setUserDropdownOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-stone-200 shadow-elevated py-2 z-30 text-xs text-stone-700 animate-in fade-in-50">
                      <div className="px-4 py-2 border-b border-stone-100">
                        <p className="font-semibold text-stone-900 truncate">{user.name}</p>
                        <p className="text-stone-500 text-[11px] truncate">{user.email}</p>
                        <div className="mt-1">
                          <span className="inline-block px-2 py-0.5 rounded bg-brand-50 text-brand-800 text-[10px] font-semibold uppercase">
                            {user.role} account
                          </span>
                        </div>
                      </div>

                      <Link
                        to="/account"
                        onClick={() => setUserDropdownOpen(false)}
                        className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-stone-50 transition-colors"
                      >
                        <CalendarCheck className="w-4 h-4 text-stone-400" />
                        <span>My Enquiries & Account</span>
                      </Link>

                      {user.role === 'owner' && (
                        <Link
                          to="/owner"
                          onClick={() => setUserDropdownOpen(false)}
                          className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-stone-50 transition-colors"
                        >
                          <Store className="w-4 h-4 text-amber-600" />
                          <span>Venue Management Dashboard</span>
                        </Link>
                      )}

                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-stone-50 transition-colors"
                        >
                          <ShieldCheck className="w-4 h-4 text-stone-700" />
                          <span>Admin Console</span>
                        </Link>
                      )}

                      <div className="border-t border-stone-100 mt-1 pt-1">
                        <button
                          onClick={() => {
                            logout();
                            setUserDropdownOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left flex items-center gap-2 text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-800 text-white font-medium text-xs hover:bg-brand-900 transition-colors shadow-xs"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>{t('navSignIn')}</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <LanguageSwitcher variant="minimal" />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-ivory-50 px-4 pt-3 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2 pb-2">
            <Link
              to="/compare"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-white border border-stone-200 text-xs font-medium text-stone-700"
            >
              <Scale className="w-4 h-4 text-brand-700" />
              <span>Compare ({compareIds.length})</span>
            </Link>
            <Link
              to="/favorites"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-white border border-stone-200 text-xs font-medium text-stone-700"
            >
              <Heart className="w-4 h-4 text-rose-600 fill-rose-600" />
              <span>Favorites ({favorites.length})</span>
            </Link>
          </div>

          <div className="flex flex-col space-y-2 text-sm font-medium text-stone-700">
            <Link
              to="/venues"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-stone-100 text-stone-900"
            >
              {t('navExplore')}
            </Link>
            <a
              href="/#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-stone-100 text-stone-900"
            >
              {t('navHowItWorks')}
            </a>
            <Link
              to="/account"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-stone-100 text-stone-900"
            >
              My Enquiries & Account
            </Link>
            <Link
              to="/owner"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg bg-amber-50 text-amber-900 font-semibold"
            >
              Hall Owner Dashboard
            </Link>
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg bg-stone-900 text-white font-semibold"
            >
              Admin Portal
            </Link>
          </div>

          <div className="pt-3 border-t border-stone-200">
            {user ? (
              <div className="flex items-center justify-between">
                <div className="text-xs">
                  <div className="font-semibold text-stone-900">{user.name}</div>
                  <div className="text-stone-500">{user.email}</div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-600 text-xs font-semibold hover:bg-rose-50"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 rounded-xl bg-brand-800 text-white font-medium text-center block text-sm shadow-xs"
              >
                Sign In to KalyanaSpace
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
