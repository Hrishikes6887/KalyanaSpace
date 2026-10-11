import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { venueService } from '../services/venueService';
import { reviewService } from '../services/reviewService';
import { enquiryService } from '../services/enquiryService';
import { useFavorites } from '../context/FavoritesContext';
import { useComparison } from '../context/ComparisonContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { StarRating } from '../components/common/StarRating';
import { Badge } from '../components/common/Badge';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { VenueCard } from '../components/customer/VenueCard';
import {
  MapPin,
  Heart,
  Scale,
  Users,
  UtensilsCrossed,
  Wind,
  Car,
  Home,
  Zap,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  IndianRupee,
  Share2,
  ExternalLink,
  MessageSquare,
  AlertCircle
} from 'lucide-react';

export const VenueDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isInCompare, addToCompare, removeFromCompare } = useComparison();
  const { showToast } = useToast();

  const venue = venueService.getVenueById(id || '');

  // Photo gallery state
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  // Enquiry panel state
  const [fullName, setFullName] = useState(user?.name || 'Ananya Rao');
  const [email, setEmail] = useState(user?.email || 'customer@kalyanaspace.demo');
  const [phone, setPhone] = useState(user?.phone || '+91 98450 12345');
  const [eventType, setEventType] = useState<'wedding' | 'reception' | 'engagement' | 'sangeet' | 'thread_ceremony' | 'other'>('wedding');
  const [eventDate, setEventDate] = useState('2025-02-18');
  const [guestCount, setGuestCount] = useState<number>(venue?.guestCapacityMin || 600);
  const [budget, setBudget] = useState<number>(venue?.startingPrice || 225000);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedEnquiryId, setSubmittedEnquiryId] = useState<string | null>(null);

  // Review form state
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [showReviewForm, setShowReviewForm] = useState(false);

  if (!venue) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-2xl font-bold text-stone-900 mb-2">Venue Not Found</h2>
        <p className="text-xs text-stone-500 mb-6">The wedding hall listing you requested does not exist or may have been removed.</p>
        <Link to="/venues" className="px-5 py-2.5 rounded-xl bg-brand-800 text-white text-xs font-semibold">
          Return to Venue Discovery
        </Link>
      </div>
    );
  }

  const reviews = reviewService.getReviewsByVenue(venue.id);
  const similarVenues = venueService.getSimilarVenues(venue.id, 3);
  const favorited = isFavorite(venue.id);
  const compared = isInCompare(venue.id);

  const formatPrice = (p: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(p);
  };

  const handleFavoriteToggle = () => {
    toggleFavorite(venue.id);
    showToast(
      favorited ? 'info' : 'success',
      favorited ? 'Removed from favorites' : 'Saved to favorites',
      venue.name
    );
  };

  const handleCompareToggle = () => {
    if (compared) {
      removeFromCompare(venue.id);
      showToast('info', 'Removed from comparison', venue.name);
    } else {
      const added = addToCompare(venue.id);
      if (added) {
        showToast('success', 'Added to comparison list', `${venue.name} (View at /compare)`);
      } else {
        showToast('warning', 'Limit reached', 'You can compare up to 3 wedding halls at once.');
      }
    }
  };

  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || (!email.trim() && !phone.trim())) {
      showToast('error', 'Contact details missing', 'Please enter your name and phone number/email.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const created = enquiryService.createEnquiry({
        venueId: venue.id,
        venueName: venue.name,
        venueCity: venue.city,
        ownerId: venue.ownerId,
        customerId: user?.id || 'user_customer_1',
        customerName: fullName.trim(),
        customerEmail: email.trim(),
        customerPhone: phone.trim(),
        eventType,
        eventDate,
        guestCount: Number(guestCount),
        estimatedBudget: Number(budget),
        additionalRequirements: notes.trim(),
      });

      setIsSubmitting(false);
      setSubmittedEnquiryId(created.id);
      showToast('success', 'Enquiry Submitted', `Generated enquiry reference ${created.id}. Stored in local demo database.`);
    }, 400);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewComment.trim()) return;

    reviewService.addReview({
      venueId: venue.id,
      customerId: user?.id || 'user_customer_1',
      customerName: user?.name || 'Verified Customer',
      customerCity: venue.city,
      rating: newReviewRating,
      comment: newReviewComment.trim(),
      eventDate: new Date().toISOString().split('T')[0],
    });

    setNewReviewComment('');
    setShowReviewForm(false);
    showToast('success', 'Review Added', 'Thank you for sharing your experience!');
  };

  return (
    <div className="bg-ivory-100 min-h-screen py-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-stone-500">
          <Link to="/" className="hover:text-brand-800 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/venues" className="hover:text-brand-800 transition-colors">Venues</Link>
          <span>/</span>
          <Link to={`/venues?city=${venue.city}`} className="hover:text-brand-800 transition-colors">{venue.city}</Link>
          <span>/</span>
          <span className="text-stone-900 font-medium truncate">{venue.name}</span>
        </nav>

        {/* Title & Top Action Bar */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge variant="emerald">{venue.category.replace(/_/g, ' ')}</Badge>
              {venue.isVerified && (
                <Badge variant="blue" icon={<ShieldCheck className="w-3.5 h-3.5 text-sky-600" />}>
                  Verified by KalyanaSpace
                </Badge>
              )}
              <span className="text-xs text-stone-500 font-medium">{venue.city}, Karnataka</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900 leading-tight">
              {venue.name}
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-brand-700 shrink-0" />
              <span>{venue.address}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCompareToggle}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
                compared
                  ? 'bg-brand-800 text-white border-brand-800 shadow-xs'
                  : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>{compared ? 'In Comparison' : 'Compare'}</span>
            </button>

            <button
              onClick={handleFavoriteToggle}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
                favorited
                  ? 'bg-rose-50 text-rose-700 border-rose-200 shadow-xs'
                  : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${favorited ? 'fill-rose-600 text-rose-600' : ''}`} />
              <span>{favorited ? 'Saved' : 'Favorite'}</span>
            </button>
          </div>
        </div>

        {/* Photo Gallery */}
        <div className="space-y-3">
          <div className="aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden bg-stone-900 border border-stone-200 shadow-card relative">
            <ImageWithFallback
              src={venue.images[activePhotoIndex] || venue.featuredImage}
              alt={venue.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 bg-stone-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-white text-xs flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              <span>{venue.name} — Photo {activePhotoIndex + 1} of {venue.images.length}</span>
            </div>
          </div>

          {/* Thumbnails */}
          {venue.images.length > 1 && (
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
              {venue.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePhotoIndex(idx)}
                  className={`w-24 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    activePhotoIndex === idx
                      ? 'border-brand-700 shadow-subtle scale-102'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Main Content Grid: Left specs & details, Right Enquiry Sticky Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Specs & Overview */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Quick Stats Grid */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-subtle grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-3 rounded-xl bg-ivory-100/60">
                <Users className="w-5 h-5 text-brand-800 mx-auto mb-1" />
                <span className="text-[11px] text-stone-500 block">Total Capacity</span>
                <span className="font-bold text-sm text-stone-900 font-serif">
                  {venue.guestCapacityMin} - {venue.guestCapacityMax}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-ivory-100/60">
                <UtensilsCrossed className="w-5 h-5 text-brand-800 mx-auto mb-1" />
                <span className="text-[11px] text-stone-500 block">Dining Hall</span>
                <span className="font-bold text-sm text-stone-900 font-serif">
                  {venue.diningCapacity} Seater
                </span>
              </div>

              <div className="p-3 rounded-xl bg-ivory-100/60">
                <Home className="w-5 h-5 text-brand-800 mx-auto mb-1" />
                <span className="text-[11px] text-stone-500 block">AC Guest Rooms</span>
                <span className="font-bold text-sm text-stone-900 font-serif">
                  {venue.roomsCount} Rooms
                </span>
              </div>

              <div className="p-3 rounded-xl bg-ivory-100/60">
                <Car className="w-5 h-5 text-brand-800 mx-auto mb-1" />
                <span className="text-[11px] text-stone-500 block">Parking Slots</span>
                <span className="font-bold text-sm text-stone-900 font-serif">
                  {venue.hasParking ? `${venue.parkingCapacity} Cars` : 'Street Only'}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-subtle space-y-4">
              <h2 className="font-serif text-xl font-bold text-stone-900">About the Venue</h2>
              <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-line">
                {venue.description}
              </p>
              {venue.tagline && (
                <div className="p-4 rounded-xl bg-ivory-100 border border-gold-200/60 italic text-stone-800 text-xs font-serif">
                  "{venue.tagline}"
                </div>
              )}
            </div>

            {/* Amenities & Facility Specifications */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-subtle space-y-6">
              <h2 className="font-serif text-xl font-bold text-stone-900">Facilities & Terms</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl border border-stone-100 bg-stone-50/50 space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-stone-900">
                    <Wind className="w-4 h-4 text-brand-700" />
                    <span>Air Conditioning & Stage</span>
                  </div>
                  <p className="text-stone-600">
                    {venue.hasAC
                      ? 'Centralized climate control in main muhurtham auditorium and dining hall.'
                      : 'Naturally ventilated traditional high-ceiling auditorium with ceiling fans.'}
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-stone-100 bg-stone-50/50 space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-stone-900">
                    <UtensilsCrossed className="w-4 h-4 text-brand-700" />
                    <span>Catering Arrangement</span>
                  </div>
                  <p className="text-stone-600">
                    {venue.cateringType === 'veg_only'
                      ? 'Strictly pure Satvik vegetarian kitchen. Outside certified caterers permitted.'
                      : 'Both vegetarian and non-vegetarian catering permitted on premises.'}
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-stone-100 bg-stone-50/50 space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-stone-900">
                    <Zap className="w-4 h-4 text-brand-700" />
                    <span>Generator & Power Backup</span>
                  </div>
                  <p className="text-stone-600">
                    {venue.hasPowerBackup
                      ? '100% full facility DG backup for ceremonial lighting, stage sound, and AC.'
                      : 'Standard electrical connection.'}
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-stone-100 bg-stone-50/50 space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-stone-900">
                    <Sparkles className="w-4 h-4 text-brand-700" />
                    <span>Bridal Grooming Suites</span>
                  </div>
                  <p className="text-stone-600">
                    {venue.hasBridalRooms
                      ? 'Separate bride & groom AC makeup suites with full-length mirrors and attached washrooms.'
                      : 'Standard dressing rooms.'}
                  </p>
                </div>
              </div>

              {/* Booking Terms Table */}
              <div className="pt-4 border-t border-stone-100">
                <h3 className="font-serif font-bold text-sm text-stone-900 mb-3">Owner Booking Terms</h3>
                <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 text-xs space-y-2.5">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Advance Token Deposit:</span>
                    <span className="font-semibold text-stone-800">{venue.advancePercentage}% upon date blocking</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Pricing Inclusions:</span>
                    <span className="font-semibold text-stone-800 max-w-xs text-right">{venue.pricingNotes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Cancellation Policy:</span>
                    <span className="font-semibold text-stone-800 max-w-xs text-right">{venue.cancellationPolicy}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Location & Map Section */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-subtle space-y-4">
              <h2 className="font-serif text-xl font-bold text-stone-900">Location & Neighborhood</h2>
              <p className="text-xs text-stone-600 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-brand-700" />
                <span>{venue.address}</span>
              </p>

              {/* Styled Mock Interactive Map */}
              <div className="rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 p-6 text-center space-y-3 relative">
                <div className="w-12 h-12 rounded-full bg-brand-100 text-brand-800 flex items-center justify-center mx-auto">
                  <MapPin className="w-6 h-6" />
                </div>
                <div className="max-w-sm mx-auto">
                  <h4 className="font-serif font-bold text-sm text-stone-900">{venue.name}</h4>
                  <p className="text-[11px] text-stone-500 mt-0.5">{venue.locality}, {venue.city} ({venue.pinCode})</p>
                </div>
                <a
                  href={venue.googleMapsUrl || `https://maps.google.com/?q=${encodeURIComponent(venue.name + ' ' + venue.city)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg bg-white border border-stone-300 hover:bg-stone-50 text-stone-800 transition-colors shadow-2xs"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-subtle space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <div>
                  <h2 className="font-serif text-xl font-bold text-stone-900">Family Reviews</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <StarRating rating={venue.rating} reviewCount={reviews.length} size="md" />
                  </div>
                </div>

                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs transition-colors"
                >
                  {showReviewForm ? 'Cancel' : 'Write a Review'}
                </button>
              </div>

              {/* New Review Form */}
              {showReviewForm && (
                <form onSubmit={handleReviewSubmit} className="p-4 rounded-xl bg-ivory-100 border border-stone-200 space-y-3">
                  <h3 className="font-serif font-bold text-sm text-stone-900">Share Your Venue Experience</h3>
                  
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Your Rating</label>
                    <div className="flex items-center gap-2">
                      {[5, 4, 3, 2, 1].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setNewReviewRating(num)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold border ${
                            newReviewRating === num
                              ? 'bg-brand-800 text-white border-brand-800'
                              : 'bg-white border-stone-200 text-stone-700'
                          }`}
                        >
                          ★ {num}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Your Feedback</label>
                    <textarea
                      rows={3}
                      value={newReviewComment}
                      onChange={(e) => setNewReviewComment(e.target.value)}
                      placeholder="Comment on stage acoustics, dining capacity, parking assistance..."
                      className="w-full p-2.5 text-xs rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-700"
                      required
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-brand-800 text-white font-semibold text-xs hover:bg-brand-900"
                    >
                      Submit Review
                    </button>
                  </div>
                </form>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-xs text-stone-400 italic">No reviews yet for this venue.</p>
                ) : (
                  reviews.map((rev) => (
                    <div key={rev.id} className="p-4 rounded-xl border border-stone-100 bg-stone-50/40 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-xs text-stone-900">{rev.customerName}</span>
                          {rev.customerCity && <span className="text-[11px] text-stone-500 ml-1.5">({rev.customerCity})</span>}
                        </div>
                        <div className="flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          ★ {rev.rating}
                        </div>
                      </div>
                      <p className="text-xs text-stone-600 leading-relaxed">{rev.comment}</p>
                      <div className="text-[10px] text-stone-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Verified wedding ceremony conducted on {rev.eventDate}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* Right Column: Sticky Direct Enquiry Form */}
          <div className="lg:col-span-1 lg:sticky lg:top-24">
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-stone-200 shadow-elevated space-y-5">
              
              {/* Pricing Header */}
              <div className="pb-4 border-b border-stone-100">
                <span className="text-[11px] text-stone-500 font-medium block">Starting Price</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="font-serif text-3xl font-bold text-brand-950">
                    {formatPrice(venue.startingPrice)}
                  </span>
                  <span className="text-xs text-stone-500"> / {venue.pricingType.replace('_', ' ')}</span>
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  Availability subject to confirmation by venue manager.
                </p>
              </div>

              {submittedEnquiryId ? (
                <div className="py-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif font-bold text-base text-stone-900">Enquiry Recorded!</h3>
                  <p className="text-xs text-stone-600">
                    Reference ID: <strong className="font-mono text-brand-900">{submittedEnquiryId}</strong>
                  </p>
                  <div className="pt-2">
                    <Link
                      to="/account"
                      className="inline-block text-xs font-semibold text-brand-800 hover:underline"
                    >
                      Track in My Enquiries →
                    </Link>
                  </div>
                  <button
                    onClick={() => setSubmittedEnquiryId(null)}
                    className="text-[11px] text-stone-400 hover:text-stone-600 block mx-auto pt-2"
                  >
                    Submit another date
                  </button>
                </div>
              ) : (
                <form onSubmit={handleEnquirySubmit} className="space-y-3.5">
                  <h3 className="font-serif font-bold text-sm text-stone-900">
                    Enquire for Date & Availability
                  </h3>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Ananya Rao"
                      required
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-700"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98450..."
                        required
                        className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-700"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@email.com"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-700"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">Event Type</label>
                      <select
                        value={eventType}
                        onChange={(e) => setEventType(e.target.value as any)}
                        className="w-full px-2.5 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-700 bg-white"
                      >
                        <option value="wedding">Wedding (Muhurtham)</option>
                        <option value="reception">Evening Reception</option>
                        <option value="engagement">Engagement</option>
                        <option value="sangeet">Sangeet / Mehendi</option>
                        <option value="thread_ceremony">Thread Ceremony</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">Event Date</label>
                      <input
                        type="date"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        required
                        className="w-full px-2.5 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-700 bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">Expected Guests</label>
                      <input
                        type="number"
                        min="50"
                        step="50"
                        value={guestCount}
                        onChange={(e) => setGuestCount(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-700"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">Max Budget (₹)</label>
                      <input
                        type="number"
                        min="25000"
                        step="10000"
                        value={budget}
                        onChange={(e) => setBudget(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-700"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">Requirements (Optional)</label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Need banana-leaf dining tables, 6 AC guest rooms..."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-700"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl bg-brand-800 hover:bg-brand-900 text-white font-semibold text-xs transition-colors shadow-xs disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Submitting to Venue Manager...</span>
                      </>
                    ) : (
                      <span>Send Free Direct Enquiry</span>
                    )}
                  </button>
                </form>
              )}

              {/* Verified Trust Tag */}
              <div className="pt-3 border-t border-stone-100 flex items-center gap-2 text-[11px] text-stone-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero broker charges. Direct contact with venue coordinator.</span>
              </div>
            </div>
          </div>

        </div>

        {/* Similar Venues Section */}
        {similarVenues.length > 0 && (
          <div className="pt-12 border-t border-stone-200">
            <h2 className="font-serif text-2xl font-bold text-stone-900 mb-6">
              Similar Wedding Halls in {venue.city}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarVenues.map((simVenue) => (
                <VenueCard key={simVenue.id} venue={simVenue} layout="grid" />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
