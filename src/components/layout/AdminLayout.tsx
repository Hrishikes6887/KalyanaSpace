import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { venueService } from '../../services/venueService';
import { enquiryService } from '../../services/enquiryService';
import {
  ShieldCheck,
  Building2,
  Users,
  Inbox,
  CalendarCheck,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Sparkles,
  ChevronRight,
  Layers
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const pendingVenues = venueService.getAllVenues().filter(v => v.status === 'pending_approval');
  const allEnquiries = enquiryService.getAllEnquiries();

  const navLinks = [
    {
      title: 'Platform Overview',
      path: '/admin',
      icon: <Layers className="w-4 h-4" />,
      exact: true,
    },
    {
      title: 'Venues Management',
      path: '/admin/venues',
      icon: <Building2 className="w-4 h-4" />,
      badge: pendingVenues.length > 0 ? `${pendingVenues.length} pending` : undefined,
      badgeColor: 'bg-rose-500 text-white font-bold',
    },
    {
      title: 'User Accounts',
      path: '/admin/users',
      icon: <Users className="w-4 h-4" />,
    },
    {
      title: 'All Enquiries',
      path: '/admin/enquiries',
      icon: <Inbox className="w-4 h-4" />,
      badge: allEnquiries.length,
    },
    {
      title: 'Confirmed Bookings',
      path: '/admin/bookings',
      icon: <CalendarCheck className="w-4 h-4" />,
    },
    {
      title: 'Settings & Data Reset',
      path: '/admin/settings',
      icon: <Settings className="w-4 h-4" />,
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
    <div className="flex flex-col h-full justify-between bg-stone-900 text-stone-200">
      <div>
        {/* Brand */}
        <div className="p-6 border-b border-stone-800">
          <Link to="/" className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="font-serif font-bold text-lg text-white">
              Kalyana<span className="text-gold-400 font-sans">Space</span>
            </span>
          </Link>

          <div className="bg-stone-800/90 rounded-xl p-3 border border-stone-700">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 block font-mono">
              Internal Administration
            </span>
            <div className="font-semibold text-xs text-white mt-0.5 truncate">
              {user?.name || 'Pooja Hegde (Admin)'}
            </div>
            <div className="text-[11px] text-stone-400 truncate">
              Platform Operations
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
                    ? 'bg-emerald-700 text-white font-semibold shadow-xs'
                    : 'text-stone-300 hover:bg-stone-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.title}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full ${
                      item.badgeColor || 'bg-stone-800 text-stone-400'
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
      <div className="p-4 border-t border-stone-800 space-y-2">
        <Link
          to="/"
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-stone-400 hover:bg-stone-800 hover:text-white transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
            <span>Public Marketplace</span>
          </span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-rose-400 hover:bg-stone-800 transition-colors font-medium"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Exit Admin Portal</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col md:flex-row">
      
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-stone-900 border-b border-stone-800 px-4 py-3 flex items-center justify-between sticky top-0 z-30 text-white">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-1.5 rounded-lg text-stone-300 hover:bg-stone-800"
            aria-label="Open administration sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-serif font-bold text-sm">Platform Admin</span>
        </div>
        <Link to="/" className="text-xs text-emerald-400 font-semibold">Marketplace</Link>
      </div>

      {/* Mobile Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw] h-full bg-stone-900 shadow-elevated">
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-stone-400 hover:text-white"
              aria-label="Close administration sidebar"
            >
              <X className="w-5 h-5" />
            </button>
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 shrink-0 sticky top-0 h-screen overflow-y-auto">
        {sidebarContent}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>
    </div>
  );
};
