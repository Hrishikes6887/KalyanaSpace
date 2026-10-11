import { User } from '../types';

export interface DemoAccountCreds {
  email: string;
  password: string;
  role: 'customer' | 'owner' | 'admin';
  name: string;
  description: string;
}

export const DEMO_CREDENTIALS: DemoAccountCreds[] = [
  {
    email: 'customer@kalyanaspace.demo',
    password: 'Customer@123',
    role: 'customer',
    name: 'Ananya & Karthik',
    description: 'Looking for a wedding hall in Bengaluru for 800 guests',
  },
  {
    email: 'owner@kalyanaspace.demo',
    password: 'Owner@123',
    role: 'owner',
    name: 'Suresh Gowda (Sri Krishna Convention)',
    description: 'Owner of 3 prime kalyana mantapas in South Karnataka',
  },
  {
    email: 'admin@kalyanaspace.demo',
    password: 'Admin@123',
    role: 'admin',
    name: 'Pooja Hegde (Platform Ops Lead)',
    description: 'Full administrative access to venues, approvals, & users',
  },
];

export const SEED_USERS: User[] = [
  {
    id: 'user_customer_1',
    name: 'Ananya & Karthik Rao',
    email: 'customer@kalyanaspace.demo',
    phone: '+91 98450 12345',
    role: 'customer',
    status: 'active',
    createdAt: '2024-01-15T10:00:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'user_customer_2',
    name: 'Dr. Ramesh Kulkarni',
    email: 'ramesh.kulkarni@demo.in',
    phone: '+91 98860 98765',
    role: 'customer',
    status: 'active',
    createdAt: '2024-02-01T11:30:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'user_customer_3',
    name: 'Priyanka Pai',
    email: 'priyanka.pai@demo.in',
    phone: '+91 94480 34567',
    role: 'customer',
    status: 'active',
    createdAt: '2024-02-18T09:15:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'user_owner_1',
    name: 'Suresh Gowda',
    email: 'owner@kalyanaspace.demo',
    phone: '+91 99001 23456',
    role: 'owner',
    status: 'active',
    businessName: 'Sri Krishna Hospitality & Venues',
    createdAt: '2023-11-10T14:20:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'user_owner_2',
    name: 'Mahesh Patil',
    email: 'mahesh.patil@heritagevenues.demo',
    phone: '+91 98802 87654',
    role: 'owner',
    status: 'active',
    businessName: 'Patil Heritage Estates Hubballi',
    createdAt: '2023-12-05T08:45:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'user_owner_3',
    name: 'Venkatesh Murthy',
    email: 'venkatesh.murthy@royalpalace.demo',
    phone: '+91 97410 44321',
    role: 'owner',
    status: 'active',
    businessName: 'Royal Mysore Palace Lawns',
    createdAt: '2024-01-08T16:10:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'user_admin_1',
    name: 'Pooja Hegde',
    email: 'admin@kalyanaspace.demo',
    phone: '+91 96112 00001',
    role: 'admin',
    status: 'active',
    createdAt: '2023-10-01T00:00:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
  },
];
