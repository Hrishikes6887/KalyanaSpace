import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { enquiryService } from '../../services/enquiryService';
import { venueService } from '../../services/venueService';
import {
  LayoutDashboard,
  Building2,
  Inbox,
  CalendarDays,
  BarChart3,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Sparkles,
  ChevronRight,
  UserCheck
} from 'lucide-react';

export const OwnerLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const ownerId = user?.id || 'user_owner_1';
  const ownerVenues = venueService.getVenuesByOwner(ownerId);
  const ownerEnquiries = enquiryService.getEnquiriesByOwner(ownerId);
  const newEnquiriesCount = ownerEnquiries.filter(e => e.status === 'new').length;

  const navLinks = [
    {
      title: 'Overview',
      path: '/owner',
      icon: <LayoutDashboard className="w-4 h-4" />,
      exact: true,
    },
    {
      title: 'My Venues',
      path: '/owner/venues',
      icon: <Building2 className="w-4 h-4" />,
      badge: ownerVenues.length,
    },
    {
      title: 'Enquiries',
      path: '/owner/enquiries',
      icon: <Inbox className="w-4 h-4" />,
      badge: newEnquiriesCount > 0 ? `${newEnquiriesCount} new` : undefined,
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-200',
    },
    {
      title: 'Availability Calendar',
      path: '/owner/calendar',
      icon: <CalendarDays className="w-4 h-4" />,
    },
    {
      title: 'Analytics & Insights',
      path: '/owner/analytics',
      icon: <BarChart3 className="w-4 h-4" />,
    },
  ];

  const isLinkActive = (path: string, exact?: boolean) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between">
      <div>
        {/* Portal Header */}
        <div className="p-6 border-b border-stone-200">
          <Link to="/" className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-brand-800 text-gold-300 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4 text-gold-300" />
            </div>
            <span className="font-serif font-bold text-lg text-stone-900">
              Kalyana<span className="text-gold-600 font-sans">Space</span>
            </span>
          </Link>
          <div className="bg-amber-50 rounded-xl p-3 border border-amber-200/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
              Venue Owner Portal
            </span>
            <div className="font-semibold text-xs text-stone-900 mt-0.5 truncate">
              {user?.businessName || user?.name || 'Sri Krishna Hospitality'}
            </div>
            <div className="text-[11px] text-stone-500 truncate">
              {user?.email}
            </div>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="p-4 space-y-1 text-xs">
          {navLinks.map((item) => {
            const active = isLinkActive(item.path, item.exact);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileSidebarOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-all ${
                  active
                    ? 'bg-brand-800 text-white font-semibold shadow-xs'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.title}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      active
                        ? 'bg-white/20 text-white border-white/30'
                        : item.badgeColor || 'bg-stone-100 text-stone-700 border-stone-200'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer controls */}
      <div className="p-4 border-t border-stone-200 space-y-2">
        <Link
          to="/"
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-stone-600 hover:bg-stone-100 transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
            <span>Public Marketplace</span>
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-rose-600 hover:bg-rose-50 transition-colors font-medium"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col md:flex-row">
      
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-white border-b border-stone-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-1.5 rounded-lg text-stone-600 hover:bg-stone-100"
            aria-label="Open sidebar navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-serif font-bold text-stone-900 text-sm">Owner Portal</span>
        </div>
        <Link to="/" className="text-xs text-brand-800 font-semibold">Marketplace</Link>
      </div>

      {/* Mobile Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw] h-full bg-white shadow-elevated">
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-stone-400 hover:text-stone-700"
              aria-label="Close sidebar navigation"
            >
              <X className="w-5 h-5" />
            </button>
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 bg-white border-r border-stone-200 shrink-0 sticky top-0 h-screen overflow-y-auto">
        {sidebarContent}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 max-w-6xl mx-auto w-full">
        <Outlet />
      </main>
    </div>
  );
};
