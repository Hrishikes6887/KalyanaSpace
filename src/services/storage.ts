import { SEED_VENUES } from '../data/seedVenues';
import { SEED_USERS } from '../data/seedUsers';
import { SEED_ENQUIRIES } from '../data/seedEnquiries';
import { SEED_BOOKINGS } from '../data/seedBookings';
import { SEED_REVIEWS } from '../data/seedReviews';
import { SEED_AVAILABILITY } from '../data/seedAvailability';
import { SEED_ACTIVITY_LOGS } from '../data/seedActivityLogs';
import { Venue, User, Enquiry, Booking, Review, VenueAvailability, ActivityLog } from '../types';

const STORAGE_KEYS = {
  VERSION: 'kalyanaspace_v1_version',
  VENUES: 'kalyanaspace_v1_venues',
  USERS: 'kalyanaspace_v1_users',
  ENQUIRIES: 'kalyanaspace_v1_enquiries',
  BOOKINGS: 'kalyanaspace_v1_bookings',
  REVIEWS: 'kalyanaspace_v1_reviews',
  AVAILABILITY: 'kalyanaspace_v1_availability',
  ACTIVITY_LOGS: 'kalyanaspace_v1_activity_logs',
  CURRENT_USER: 'kalyanaspace_v1_current_user',
  FAVORITES: 'kalyanaspace_v1_favorites',
  LANGUAGE: 'kalyanaspace_v1_lang',
};

const CURRENT_VERSION = '1.0.0';

class LocalDemoStorage {
  private isInitialized = false;

  constructor() {
    this.init();
  }

  public init() {
    if (this.isInitialized) return;
    try {
      const storedVersion = localStorage.getItem(STORAGE_KEYS.VERSION);
      if (!storedVersion || storedVersion !== CURRENT_VERSION) {
        this.resetAllToSeed();
      } else {
        // Ensure keys exist
        if (!localStorage.getItem(STORAGE_KEYS.VENUES)) {
          this.setVenues(SEED_VENUES);
        }
        if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
          this.setUsers(SEED_USERS);
        }
        if (!localStorage.getItem(STORAGE_KEYS.ENQUIRIES)) {
          this.setEnquiries(SEED_ENQUIRIES);
        }
        if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
          this.setBookings(SEED_BOOKINGS);
        }
        if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
          this.setReviews(SEED_REVIEWS);
        }
        if (!localStorage.getItem(STORAGE_KEYS.AVAILABILITY)) {
          this.setAvailability(SEED_AVAILABILITY);
        }
        if (!localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOGS)) {
          this.setActivityLogs(SEED_ACTIVITY_LOGS);
        }
      }
      this.isInitialized = true;
    } catch (e) {
      console.warn('localStorage initialization error, fallback to in-memory mode', e);
    }
  }

  public resetAllToSeed() {
    try {
      localStorage.setItem(STORAGE_KEYS.VERSION, CURRENT_VERSION);
      localStorage.setItem(STORAGE_KEYS.VENUES, JSON.stringify(SEED_VENUES));
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(SEED_USERS));
      localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(SEED_ENQUIRIES));
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(SEED_BOOKINGS));
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(SEED_REVIEWS));
      localStorage.setItem(STORAGE_KEYS.AVAILABILITY, JSON.stringify(SEED_AVAILABILITY));
      localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOGS, JSON.stringify(SEED_ACTIVITY_LOGS));
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(['venue_1', 'venue_2']));
      
      // Default demo logged-in user is customer
      const defaultUser = SEED_USERS.find(u => u.email === 'customer@kalyanaspace.demo') || SEED_USERS[0];
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(defaultUser));
    } catch (e) {
      console.error('Failed to reset localStorage seed', e);
    }
  }

  private getItem<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(key);
      if (!data) return defaultValue;
      return JSON.parse(data) as T;
    } catch (e) {
      console.warn(`Error reading key ${key} from storage`, e);
      return defaultValue;
    }
  }

  private setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error saving key ${key} to storage`, e);
    }
  }

  // Venues
  public getVenues(): Venue[] {
    return this.getItem<Venue[]>(STORAGE_KEYS.VENUES, SEED_VENUES);
  }
  public setVenues(venues: Venue[]): void {
    this.setItem(STORAGE_KEYS.VENUES, venues);
  }

  // Users
  public getUsers(): User[] {
    return this.getItem<User[]>(STORAGE_KEYS.USERS, SEED_USERS);
  }
  public setUsers(users: User[]): void {
    this.setItem(STORAGE_KEYS.USERS, users);
  }

  // Enquiries
  public getEnquiries(): Enquiry[] {
    return this.getItem<Enquiry[]>(STORAGE_KEYS.ENQUIRIES, SEED_ENQUIRIES);
  }
  public setEnquiries(enquiries: Enquiry[]): void {
    this.setItem(STORAGE_KEYS.ENQUIRIES, enquiries);
  }

  // Bookings
  public getBookings(): Booking[] {
    return this.getItem<Booking[]>(STORAGE_KEYS.BOOKINGS, SEED_BOOKINGS);
  }
  public setBookings(bookings: Booking[]): void {
    this.setItem(STORAGE_KEYS.BOOKINGS, bookings);
  }

  // Reviews
  public getReviews(): Review[] {
    return this.getItem<Review[]>(STORAGE_KEYS.REVIEWS, SEED_REVIEWS);
  }
  public setReviews(reviews: Review[]): void {
    this.setItem(STORAGE_KEYS.REVIEWS, reviews);
  }

  // Availability
  public getAvailability(): VenueAvailability[] {
    return this.getItem<VenueAvailability[]>(STORAGE_KEYS.AVAILABILITY, SEED_AVAILABILITY);
  }
  public setAvailability(avail: VenueAvailability[]): void {
    this.setItem(STORAGE_KEYS.AVAILABILITY, avail);
  }

  // Activity Logs
  public getActivityLogs(): ActivityLog[] {
    return this.getItem<ActivityLog[]>(STORAGE_KEYS.ACTIVITY_LOGS, SEED_ACTIVITY_LOGS);
  }
  public setActivityLogs(logs: ActivityLog[]): void {
    this.setItem(STORAGE_KEYS.ACTIVITY_LOGS, logs);
  }
  public addActivityLog(log: Omit<ActivityLog, 'id' | 'timestamp'>): void {
    const logs = this.getActivityLogs();
    const newEntry: ActivityLog = {
      ...log,
      id: `act_${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    logs.unshift(newEntry);
    this.setActivityLogs(logs.slice(0, 50)); // keep last 50
  }

  // Current Auth User
  public getCurrentUser(): User | null {
    return this.getItem<User | null>(STORAGE_KEYS.CURRENT_USER, null);
  }
  public setCurrentUser(user: User | null): void {
    if (!user) {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    } else {
      this.setItem(STORAGE_KEYS.CURRENT_USER, user);
    }
  }

  // Favorites
  public getFavorites(): string[] {
    return this.getItem<string[]>(STORAGE_KEYS.FAVORITES, ['venue_1', 'venue_2']);
  }
  public setFavorites(venueIds: string[]): void {
    this.setItem(STORAGE_KEYS.FAVORITES, venueIds);
  }

  // Language
  public getLanguage(): 'en' | 'kn' {
    const lang = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
    return lang === 'kn' ? 'kn' : 'en';
  }
  public setLanguage(lang: 'en' | 'kn'): void {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
  }
}

export const storage = new LocalDemoStorage();
