import React, { useState } from 'react';
import { userService } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { User, UserRole, UserStatus } from '../../types';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import {
  Users,
  Search,
  UserCheck,
  ShieldCheck,
  Store,
  Lock,
  Unlock,
  AlertTriangle,
  Mail,
  Phone,
  Building
} from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const { user: currentAdmin } = useAuth();
  const { showToast } = useToast();

  const [users, setUsers] = useState<User[]>(() => userService.getAllUsers());
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const refreshList = () => {
    setUsers(userService.getAllUsers());
  };

  const handleToggleStatus = (u: User) => {
    const nextStatus: UserStatus = u.status === 'active' ? 'suspended' : 'active';
    const res = userService.updateUserStatus(u.id, nextStatus, currentAdmin?.id);

    if (res.success && res.user) {
      refreshList();
      showToast(
        nextStatus === 'suspended' ? 'warning' : 'success',
        `User ${nextStatus === 'suspended' ? 'Suspended' : 'Activated'}`,
        `${u.name} is now ${nextStatus}.`
      );
    } else {
      showToast('error', 'Operation Blocked', res.error || 'Failed to update user status.');
    }
  };

  const handleChangeRole = (u: User, newRole: UserRole) => {
    const res = userService.updateUserRole(u.id, newRole, currentAdmin?.id);
    if (res.success && res.user) {
      refreshList();
      showToast('success', 'User Role Changed', `${u.name} role changed to ${newRole.toUpperCase()}.`);
    } else {
      showToast('error', 'Operation Blocked', res.error);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesQuery =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone.includes(searchQuery);

    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesQuery && matchesRole;
  });

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-rose-800 font-mono">
            Access Governance
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
            User Accounts & Roles ({users.length})
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage customer accounts, venue owner businesses, and administrator permissions.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-subtle">
        <div className="relative max-w-sm w-full">
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3.5 py-2 pl-9 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-700"
          />
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-stone-500 font-medium">Role:</span>
          {['all', 'customer', 'owner', 'admin'].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-xl capitalize font-medium transition-colors ${
                roleFilter === r
                  ? 'bg-stone-900 text-white font-semibold'
                  : 'bg-stone-50 text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-mono uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">User Details</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Associated Business</th>
                <th className="py-3 px-4">Registered Date</th>
                <th className="py-3 px-4">Account Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-stone-50/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      {u.avatarUrl ? (
                        <img src={u.avatarUrl} alt={u.name} className="w-8 h-8 rounded-full object-cover border border-stone-200" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center font-bold">
                          {u.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <span className="font-semibold text-stone-900 block">{u.name}</span>
                        <span className="text-[11px] text-stone-500 font-mono">{u.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <select
                      value={u.role}
                      onChange={(e) => handleChangeRole(u, e.target.value as UserRole)}
                      disabled={u.id === 'user_admin_1'}
                      className="px-2 py-1 rounded-lg border border-stone-200 bg-white text-[11px] font-semibold capitalize cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="customer">Customer</option>
                      <option value="owner">Hall Owner</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-4 text-stone-600">
                    {u.businessName || '—'}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-stone-500">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${
                        u.status === 'active'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {u.id === 'user_admin_1' ? (
                      <span className="text-[10px] text-stone-400 italic">Protected Superadmin</span>
                    ) : (
                      <button
                        onClick={() => handleToggleStatus(u)}
                        className={`px-3 py-1.5 rounded-lg font-semibold text-[11px] transition-colors ${
                          u.status === 'active'
                            ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        {u.status === 'active' ? 'Suspend Account' : 'Activate Account'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
