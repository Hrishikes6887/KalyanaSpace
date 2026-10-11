import { storage } from './storage';
import { User, UserRole, UserStatus } from '../types';

export const userService = {
  getAllUsers(): User[] {
    return storage.getUsers();
  },

  getUserById(id: string): User | undefined {
    return storage.getUsers().find(u => u.id === id);
  },

  updateUserStatus(id: string, status: UserStatus, currentAdminId?: string): { success: boolean; error?: string; user?: User } {
    if (id === 'user_admin_1' && status === 'suspended') {
      return {
        success: false,
        error: 'Safety restriction: Primary system administrator account cannot be suspended.',
      };
    }

    if (currentAdminId && id === currentAdminId && status === 'suspended') {
      return {
        success: false,
        error: 'Safety restriction: You cannot suspend your own active administrator account.',
      };
    }

    const users = storage.getUsers();
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return { success: false, error: 'User not found' };

    users[index].status = status;
    storage.setUsers(users);

    storage.addActivityLog({
      actorId: currentAdminId || 'admin',
      actorName: 'Administrator',
      action: `user_status_${status}`,
      targetType: 'user',
      targetId: id,
      description: `User ${users[index].name} (${users[index].email}) status changed to ${status}`,
    });

    return { success: true, user: users[index] };
  },

  updateUserRole(id: string, newRole: UserRole, currentAdminId?: string): { success: boolean; error?: string; user?: User } {
    if (id === 'user_admin_1' && newRole !== 'admin') {
      return {
        success: false,
        error: 'Safety restriction: The primary administrator account role cannot be changed.',
      };
    }

    const users = storage.getUsers();
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return { success: false, error: 'User not found' };

    users[index].role = newRole;
    storage.setUsers(users);

    storage.addActivityLog({
      actorId: currentAdminId || 'admin',
      actorName: 'Administrator',
      action: 'user_role_changed',
      targetType: 'user',
      targetId: id,
      description: `User ${users[index].name} role modified to ${newRole}`,
    });

    return { success: true, user: users[index] };
  }
};
