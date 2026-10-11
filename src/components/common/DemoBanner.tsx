import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { storage } from '../../services/storage';
import { UserRole } from '../../types';
import { RotateCcw, UserCheck, ShieldCheck, Store, User as UserIcon, ChevronDown, Check } from 'lucide-react';
import { ConfirmDialog } from './ConfirmDialog';

export const DemoBanner: React.FC = () => {
  const { user, role, switchRole } = useAuth();
  const { showToast } = useToast();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleRoleChange = (targetRole: UserRole) => {
    switchRole(targetRole);
    setIsDropdownOpen(false);
    showToast(
      'info',
      `Switched to ${targetRole.toUpperCase()} mode`,
      `Active demo user: ${targetRole === 'customer' ? 'Ananya & Karthik (Customer)' : targetRole === 'owner' ? 'Suresh Gowda (Hall Owner)' : 'Pooja Hegde (Platform Admin)'}`
    );
  };

  const handleResetData = () => {
    storage.resetAllToSeed();
    setShowResetConfirm(false);
    showToast('success', 'Demo data reset successfully', 'All seed venues, enquiries, and demo accounts restored.');
    setTimeout(() => {
      window.location.reload();
    }, 600);
  };

  const getRoleIcon = (r: UserRole | null) => {
    switch (r) {
      case 'admin':
        return <ShieldCheck className="w-3.5 h-3.5 text-rose-300" />;
      case 'owner':
        return <Store className="w-3.5 h-3.5 text-amber-300" />;
      default:
        return <UserIcon className="w-3.5 h-3.5 text-emerald-300" />;
    }
  };

  return (
    <>
      <div className="bg-stone-900 text-stone-200 text-xs px-3 sm:px-6 py-1.5 flex flex-wrap items-center justify-between gap-2 border-b border-stone-800 z-40 relative">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60 uppercase tracking-wider text-[10px]">
            Demo Prototype
          </span>
          <span className="hidden md:inline text-stone-400 text-[11px]">
            Karnataka Wedding Hall Marketplace MVP (Local Browser Storage)
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="inline-flex items-center gap-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 px-2.5 py-1 rounded-md transition-colors border border-stone-700 text-xs font-medium"
              title="Click to quickly switch demo roles"
            >
              {getRoleIcon(role)}
              <span>Role: <strong className="text-white capitalize">{role || 'Guest'}</strong></span>
              {user && <span className="hidden sm:inline text-stone-400">({user.name.split(' ')[0]})</span>}
              <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
            </button>

            {isDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setIsDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-1 w-64 bg-stone-900 border border-stone-700 rounded-xl shadow-elevated py-1.5 z-40 text-xs">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-stone-400 border-b border-stone-800">
                    Switch Active Demo Role:
                  </div>

                  <button
                    onClick={() => handleRoleChange('customer')}
                    className="w-full px-3 py-2 text-left flex items-center justify-between hover:bg-stone-800 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-emerald-400" />
                      <div>
                        <div className="font-medium text-white">Customer</div>
                        <div className="text-[10px] text-stone-400">Ananya & Karthik (Enquirer)</div>
                      </div>
                    </div>
                    {role === 'customer' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>

                  <button
                    onClick={() => handleRoleChange('owner')}
                    className="w-full px-3 py-2 text-left flex items-center justify-between hover:bg-stone-800 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Store className="w-4 h-4 text-amber-400" />
                      <div>
                        <div className="font-medium text-white">Hall Owner</div>
                        <div className="text-[10px] text-stone-400">Suresh Gowda (6 Venues)</div>
                      </div>
                    </div>
                    {role === 'owner' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </button>

                  <button
                    onClick={() => handleRoleChange('admin')}
                    className="w-full px-3 py-2 text-left flex items-center justify-between hover:bg-stone-800 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-rose-400" />
                      <div>
                        <div className="font-medium text-white">Platform Admin</div>
                        <div className="text-[10px] text-stone-400">Pooja Hegde (Platform Ops)</div>
                      </div>
                    </div>
                    {role === 'admin' && <Check className="w-3.5 h-3.5 text-rose-400" />}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Reset Demo Data Button */}
          <button
            onClick={() => setShowResetConfirm(true)}
            className="inline-flex items-center gap-1 text-stone-400 hover:text-rose-400 px-2 py-1 rounded transition-colors text-[11px]"
            title="Reset all demo data back to default seed"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset Seed</span>
          </button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showResetConfirm}
        title="Reset Demo Database?"
        message="This will re-initialize localStorage with the default seed venues, customer enquiries, bookings, and demo accounts. Any new mock data you created will be reset."
        confirmLabel="Reset Everything"
        cancelLabel="Cancel"
        isDestructive={true}
        onConfirm={handleResetData}
        onCancel={() => setShowResetConfirm(false)}
      />
    </>
  );
};
