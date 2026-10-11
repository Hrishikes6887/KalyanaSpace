import { storage } from './storage';
import { User, UserRole } from '../types';
import { DEMO_CREDENTIALS } from '../data/seedUsers';

export interface LoginResult {
  success: boolean;
  user?: User;
  error?: string;
}

export const authService = {
  getCurrentUser(): User | null {
    return storage.getCurrentUser();
  },

  login(email: string, password: string): Promise<LoginResult> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const cleanedEmail = email.trim().toLowerCase();
        const demoMatch = DEMO_CREDENTIALS.find(
          c => c.email.toLowerCase() === cleanedEmail && c.password === password
        );

        if (!demoMatch) {
          // Check if user exists in stored users
          const users = storage.getUsers();
          const user = users.find(u => u.email.toLowerCase() === cleanedEmail);
          if (user) {
            // For other demo accounts, check generic password
            if (password === 'Password@123' || password === `${user.role.charAt(0).toUpperCase() + user.role.slice(1)}@123`) {
              if (user.status === 'suspended') {
                return resolve({ success: false, error: 'This demo account is currently suspended by administration.' });
              }
              storage.setCurrentUser(user);
              return resolve({ success: true, user });
            }
          }
          return resolve({
            success: false,
            error: 'Invalid email or password. Please use the seeded demo credentials displayed below.',
          });
        }

        const users = storage.getUsers();
        const matchedUser = users.find(u => u.email.toLowerCase() === cleanedEmail);

        if (!matchedUser) {
          return resolve({ success: false, error: 'User record not found in local demo store.' });
        }

        if (matchedUser.status === 'suspended') {
          return resolve({ success: false, error: 'This demo account is currently suspended by administration.' });
        }

        storage.setCurrentUser(matchedUser);
        resolve({ success: true, user: matchedUser });
      }, 200);
    });
  },

  quickSwitchRole(role: UserRole): User {
    const users = storage.getUsers();
    let target = users.find(u => u.role === role && u.status === 'active');
    if (!target) {
      target = users.find(u => u.role === role) || users[0];
    }
    storage.setCurrentUser(target);
    return target;
  },

  logout(): void {
    storage.setCurrentUser(null);
  },

  updateCurrentUserProfile(data: Partial<User>): User | null {
    const current = storage.getCurrentUser();
    if (!current) return null;
    const updated = { ...current, ...data };
    storage.setCurrentUser(updated);

    const users = storage.getUsers().map(u => u.id === current.id ? updated : u);
    storage.setUsers(users);
    return updated;
  }
};
