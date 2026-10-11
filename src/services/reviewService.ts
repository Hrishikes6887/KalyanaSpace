import { storage } from './storage';
import { Review } from '../types';

export const reviewService = {
  getReviewsByVenue(venueId: string): Review[] {
    return storage.getReviews().filter(r => r.venueId === venueId);
  },

  getAllReviews(): Review[] {
    return storage.getReviews();
  },

  addReview(params: {
    venueId: string;
    customerId: string;
    customerName: string;
    customerCity?: string;
    rating: number;
    comment: string;
    eventDate: string;
  }): Review {
    const reviews = storage.getReviews();
    const newReview: Review = {
      id: `rev_${Date.now()}`,
      ...params,
      verifiedBooking: true,
      createdAt: new Date().toISOString(),
    };

    reviews.unshift(newReview);
    storage.setReviews(reviews);

    // Update venue rating and reviewCount
    const venues = storage.getVenues();
    const venue = venues.find(v => v.id === params.venueId);
    if (venue) {
      const venueReviews = reviews.filter(r => r.venueId === params.venueId);
      const avg = venueReviews.reduce((acc, r) => acc + r.rating, 0) / venueReviews.length;
      venue.rating = Math.round(avg * 10) / 10;
      venue.reviewCount = venueReviews.length;
      storage.setVenues(venues);
    }

    return newReview;
  }
};
