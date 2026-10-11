import { storage } from './storage';
import { Venue, VenueFilterCriteria, VenueStatus } from '../types';

export const venueService = {
  getPublicVenues(criteria?: VenueFilterCriteria): Venue[] {
    let venues = storage.getVenues().filter(v => v.status === 'published');

    if (!criteria) return venues;

    if (criteria.city && criteria.city !== 'All') {
      venues = venues.filter(v => v.city.toLowerCase() === criteria.city!.toLowerCase());
    }

    if (criteria.searchQuery && criteria.searchQuery.trim()) {
      const q = criteria.searchQuery.toLowerCase().trim();
      venues = venues.filter(v =>
        v.name.toLowerCase().includes(q) ||
        v.locality.toLowerCase().includes(q) ||
        v.city.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q)
      );
    }

    if (criteria.category && criteria.category !== 'all') {
      venues = venues.filter(v => v.category === criteria.category);
    }

    if (criteria.minPrice !== undefined) {
      venues = venues.filter(v => v.startingPrice >= criteria.minPrice!);
    }

    if (criteria.maxPrice !== undefined) {
      venues = venues.filter(v => v.startingPrice <= criteria.maxPrice!);
    }

    if (criteria.minGuests !== undefined && criteria.minGuests > 0) {
      venues = venues.filter(v => v.guestCapacityMax >= criteria.minGuests!);
    }

    if (criteria.hasAC) {
      venues = venues.filter(v => v.hasAC);
    }

    if (criteria.hasParking) {
      venues = venues.filter(v => v.hasParking);
    }

    if (criteria.isVerified) {
      venues = venues.filter(v => v.isVerified);
    }

    if (criteria.cateringType && criteria.cateringType !== 'all') {
      venues = venues.filter(v => v.cateringType === criteria.cateringType);
    }

    if (criteria.minRating !== undefined && criteria.minRating > 0) {
      venues = venues.filter(v => v.rating >= criteria.minRating!);
    }

    // Sorting
    if (criteria.sortBy === 'price_asc') {
      venues.sort((a, b) => a.startingPrice - b.startingPrice);
    } else if (criteria.sortBy === 'price_desc') {
      venues.sort((a, b) => b.startingPrice - a.startingPrice);
    } else if (criteria.sortBy === 'rating') {
      venues.sort((a, b) => b.rating - a.rating);
    } else if (criteria.sortBy === 'capacity_desc') {
      venues.sort((a, b) => b.guestCapacityMax - a.guestCapacityMax);
    } else {
      // 'recommended' - featured first, then rating
      venues.sort((a, b) => {
        if (a.isFeatured === b.isFeatured) {
          return b.rating - a.rating;
        }
        return a.isFeatured ? -1 : 1;
      });
    }

    return venues;
  },

  getAllVenues(): Venue[] {
    return storage.getVenues();
  },

  getVenuesByOwner(ownerId: string): Venue[] {
    return storage.getVenues().filter(v => v.ownerId === ownerId);
  },

  getVenueById(id: string): Venue | undefined {
    return storage.getVenues().find(v => v.id === id);
  },

  getSimilarVenues(venueId: string, limit = 3): Venue[] {
    const current = this.getVenueById(venueId);
    if (!current) return [];

    return storage.getVenues()
      .filter(v => v.id !== venueId && v.status === 'published')
      .sort((a, b) => {
        // Boost same city and category
        let scoreA = 0;
        let scoreB = 0;
        if (a.city === current.city) scoreA += 2;
        if (b.city === current.city) scoreB += 2;
        if (a.category === current.category) scoreA += 1;
        if (b.category === current.category) scoreB += 1;
        return scoreB - scoreA;
      })
      .slice(0, limit);
  },

  createVenue(venueData: Omit<Venue, 'id' | 'createdAt' | 'updatedAt' | 'rating' | 'reviewCount'>): Venue {
    const venues = storage.getVenues();
    const newVenue: Venue = {
      ...venueData,
      id: `venue_${Date.now()}`,
      rating: 0,
      reviewCount: 0,
      status: venueData.status || 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    venues.unshift(newVenue);
    storage.setVenues(venues);

    storage.addActivityLog({
      actorId: venueData.ownerId,
      actorName: 'Hall Owner',
      action: 'venue_created',
      targetType: 'venue',
      targetId: newVenue.id,
      description: `Created new listing: ${newVenue.name}`,
    });

    return newVenue;
  },

  updateVenue(id: string, updates: Partial<Venue>): Venue | null {
    const venues = storage.getVenues();
    const index = venues.findIndex(v => v.id === id);
    if (index === -1) return null;

    const updatedVenue: Venue = {
      ...venues[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    venues[index] = updatedVenue;
    storage.setVenues(venues);

    storage.addActivityLog({
      actorId: updatedVenue.ownerId,
      actorName: 'Hall Owner',
      action: 'venue_updated',
      targetType: 'venue',
      targetId: updatedVenue.id,
      description: `Updated venue details for ${updatedVenue.name}`,
    });

    return updatedVenue;
  },

  updateVenueStatus(id: string, status: VenueStatus, rejectionReason?: string, adminName = 'Admin'): Venue | null {
    const venues = storage.getVenues();
    const index = venues.findIndex(v => v.id === id);
    if (index === -1) return null;

    const updated: Venue = {
      ...venues[index],
      status,
      rejectionReason: status === 'rejected' ? rejectionReason : undefined,
      updatedAt: new Date().toISOString(),
    };

    venues[index] = updated;
    storage.setVenues(venues);

    storage.addActivityLog({
      actorId: 'admin',
      actorName: adminName,
      action: `venue_status_${status}`,
      targetType: 'venue',
      targetId: id,
      description: `Listing ${updated.name} status updated to ${status}${rejectionReason ? ` (Reason: ${rejectionReason})` : ''}`,
    });

    return updated;
  },

  toggleFeatured(id: string): Venue | null {
    const venues = storage.getVenues();
    const index = venues.findIndex(v => v.id === id);
    if (index === -1) return null;

    venues[index].isFeatured = !venues[index].isFeatured;
    venues[index].updatedAt = new Date().toISOString();
    storage.setVenues(venues);
    return venues[index];
  },

  deleteVenue(id: string): boolean {
    const venues = storage.getVenues();
    const target = venues.find(v => v.id === id);
    if (!target) return false;

    const filtered = venues.filter(v => v.id !== id);
    storage.setVenues(filtered);

    storage.addActivityLog({
      actorId: target.ownerId,
      actorName: 'Hall Owner',
      action: 'venue_deleted',
      targetType: 'venue',
      targetId: id,
      description: `Deleted venue listing: ${target.name}`,
    });

    return true;
  }
};
