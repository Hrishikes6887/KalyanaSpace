import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { venueService } from '../../services/venueService';
import { Venue, VenueCategory, KarnatakaCity } from '../../types';
import {
  ArrowLeft,
  Building2,
  MapPin,
  IndianRupee,
  Sparkles,
  UtensilsCrossed,
  Image as ImageIcon,
  CheckCircle2,
  Upload,
  X,
  Plus
} from 'lucide-react';

export const OwnerVenueFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const ownerId = user?.id || 'user_owner_1';

  // Active form section tab (1 to 7)
  const [activeTab, setActiveTab] = useState<number>(1);

  // Form Fields State
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [category, setCategory] = useState<VenueCategory>('traditional_kalyana_mantapa');
  const [description, setDescription] = useState('');

  // Location
  const [city, setCity] = useState<KarnatakaCity>('Bengaluru');
  const [locality, setLocality] = useState('');
  const [address, setAddress] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');

  // Pricing & Capacity
  const [guestCapacityMin, setGuestCapacityMin] = useState(300);
  const [guestCapacityMax, setGuestCapacityMax] = useState(1200);
  const [diningCapacity, setDiningCapacity] = useState(500);
  const [roomsCount, setRoomsCount] = useState(8);
  const [startingPrice, setStartingPrice] = useState(150000);
  const [pricingType, setPricingType] = useState<Venue['pricingType']>('per_day');
  const [pricingNotes, setPricingNotes] = useState('Includes main hall and 4 AC rooms.');
  const [advancePercentage, setAdvancePercentage] = useState(30);
  const [cancellationPolicy, setCancellationPolicy] = useState('Refundable up to 45 days prior.');

  // Amenities
  const [hasAC, setHasAC] = useState(true);
  const [hasParking, setHasParking] = useState(true);
  const [parkingCapacity, setParkingCapacity] = useState(150);
  const [hasPowerBackup, setHasPowerBackup] = useState(true);
  const [hasBridalRooms, setHasBridalRooms] = useState(true);
  const [hasDecorationInhouse, setHasDecorationInhouse] = useState(true);

  // Catering
  const [cateringType, setCateringType] = useState<'veg_only' | 'veg_and_nonveg'>('veg_only');
  const [allowOutsideCatering, setAllowOutsideCatering] = useState(true);
  const [hasInhouseCatering, setHasInhouseCatering] = useState(false);

  // Photos
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=1000&q=80',
  ]);
  const [newImageUrl, setNewImageUrl] = useState('');

  // Populate if editing
  useEffect(() => {
    if (isEditing && id) {
      const existing = venueService.getVenueById(id);
      if (existing) {
        setName(existing.name);
        setTagline(existing.tagline || '');
        setCategory(existing.category);
        setDescription(existing.description);
        setCity(existing.city);
        setLocality(existing.locality);
        setAddress(existing.address);
        setPinCode(existing.pinCode);
        setGoogleMapsUrl(existing.googleMapsUrl || '');
        setGuestCapacityMin(existing.guestCapacityMin);
        setGuestCapacityMax(existing.guestCapacityMax);
        setDiningCapacity(existing.diningCapacity);
        setRoomsCount(existing.roomsCount);
        setStartingPrice(existing.startingPrice);
        setPricingType(existing.pricingType);
        setPricingNotes(existing.pricingNotes);
        setAdvancePercentage(existing.advancePercentage);
        setCancellationPolicy(existing.cancellationPolicy);
        setHasAC(existing.hasAC);
        setHasParking(existing.hasParking);
        setParkingCapacity(existing.parkingCapacity);
        setHasPowerBackup(existing.hasPowerBackup);
        setHasBridalRooms(existing.hasBridalRooms);
        setHasDecorationInhouse(existing.hasDecorationInhouse);
        setCateringType(existing.cateringType);
        setAllowOutsideCatering(existing.allowOutsideCatering);
        setHasInhouseCatering(existing.hasInhouseCatering);
        setImages(existing.images);
      }
    }
  }, [id, isEditing]);

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setImages(prev => [...prev, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleMockUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const localUrl = URL.createObjectURL(files[0]);
      setImages(prev => [...prev, localUrl]);
      showToast('info', 'Photo Loaded', 'Temporary preview created from your file upload.');
    }
  };

  const handleSubmit = (finalStatus: 'published' | 'draft') => {
    if (!name.trim() || !locality.trim() || !address.trim()) {
      showToast('error', 'Missing Information', 'Please complete the venue name, locality and address.');
      setActiveTab(1);
      return;
    }

    const payload = {
      ownerId,
      name: name.trim(),
      tagline: tagline.trim(),
      category,
      city,
      locality: locality.trim(),
      address: address.trim(),
      pinCode: pinCode.trim() || '560001',
      googleMapsUrl: googleMapsUrl.trim(),
      description: description.trim(),
      guestCapacityMin: Number(guestCapacityMin),
      guestCapacityMax: Number(guestCapacityMax),
      diningCapacity: Number(diningCapacity),
      roomsCount: Number(roomsCount),
      startingPrice: Number(startingPrice),
      pricingType,
      pricingNotes: pricingNotes.trim(),
      advancePercentage: Number(advancePercentage),
      cancellationPolicy: cancellationPolicy.trim(),
      hasAC,
      hasParking,
      parkingCapacity: Number(parkingCapacity),
      hasInhouseCatering,
      allowOutsideCatering,
      cateringType,
      hasPowerBackup,
      hasBridalRooms,
      hasDecorationInhouse,
      images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80'],
      featuredImage: images[0] || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
      isVerified: true,
      isFeatured: false,
      status: finalStatus,
    };

    if (isEditing && id) {
      venueService.updateVenue(id, payload);
      showToast('success', 'Venue Updated', `${name} has been updated.`);
    } else {
      venueService.createVenue(payload);
      showToast('success', 'Listing Created', `${name} added to your portfolio as ${finalStatus}.`);
    }

    navigate('/owner/venues');
  };

  const tabs = [
    { num: 1, title: 'Basic Info', icon: <Building2 className="w-3.5 h-3.5" /> },
    { num: 2, title: 'Location', icon: <MapPin className="w-3.5 h-3.5" /> },
    { num: 3, title: 'Pricing & Capacity', icon: <IndianRupee className="w-3.5 h-3.5" /> },
    { num: 4, title: 'Amenities', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { num: 5, title: 'Catering', icon: <UtensilsCrossed className="w-3.5 h-3.5" /> },
    { num: 6, title: 'Photos', icon: <ImageIcon className="w-3.5 h-3.5" /> },
    { num: 7, title: 'Review & Save', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="space-y-8 max-w-4xl pb-16">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-stone-200">
        <div className="flex items-center gap-3">
          <Link
            to="/owner/venues"
            className="p-2 rounded-xl bg-white border border-stone-200 text-stone-500 hover:text-stone-800 shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-serif text-2xl font-bold text-stone-900">
              {isEditing ? `Edit: ${name || 'Venue Listing'}` : 'Add New Wedding Venue'}
            </h1>
            <p className="text-xs text-stone-500">
              Karnataka Wedding Hall Listing Form
            </p>
          </div>
        </div>
      </div>

      {/* Multi-step Tab Navigation */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2 border-b border-stone-200 text-xs">
        {tabs.map((tab) => (
          <button
            key={tab.num}
            onClick={() => setActiveTab(tab.num)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-medium shrink-0 transition-colors ${
              activeTab === tab.num
                ? 'bg-brand-800 text-white font-semibold shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <span>{tab.num}.</span>
            <span>{tab.title}</span>
          </button>
        ))}
      </div>

      {/* Form Content per Active Tab */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-card">
        
        {/* Section 1: Basic Information */}
        {activeTab === 1 && (
          <div className="space-y-4 text-xs">
            <h2 className="font-serif font-bold text-base text-stone-900 mb-1">
              1. Basic Information
            </h2>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Venue Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sri Krishna Grand Convention Centre"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-700 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Tagline / Highlight Phrase
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. Grandeur meets sacred tradition in the heart of South Bengaluru"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-700 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Venue Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as VenueCategory)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-700 text-xs bg-white"
              >
                <option value="traditional_kalyana_mantapa">Traditional Kalyana Mantapa</option>
                <option value="luxury_convention_center">Luxury Convention Centre</option>
                <option value="modern_banquet_hall">Modern Banquet Hall</option>
                <option value="heritage_palace_lawn">Heritage Palace Lawn</option>
                <option value="resort_wedding_venue">Resort / Destination Venue</option>
                <option value="community_mini_hall">Community & Mini Hall</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Full Description
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your carved mandapa, foyer, acoustics, seating, and special amenities..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-700 text-xs"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveTab(2)}
                className="px-5 py-2 rounded-xl bg-brand-800 text-white font-semibold"
              >
                Next: Location Details →
              </button>
            </div>
          </div>
        )}

        {/* Section 2: Location */}
        {activeTab === 2 && (
          <div className="space-y-4 text-xs">
            <h2 className="font-serif font-bold text-base text-stone-900 mb-1">
              2. Location in Karnataka
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  City <span className="text-rose-500">*</span>
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value as KarnatakaCity)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-700 text-xs bg-white"
                >
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Mysuru">Mysuru</option>
                  <option value="Hubballi">Hubballi</option>
                  <option value="Belagavi">Belagavi</option>
                  <option value="Mangaluru">Mangaluru</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Locality / Area <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  placeholder="e.g. JP Nagar 7th Phase"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-700 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Detailed Postal Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Plot / Door No, Street, Landmark, Pin code"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-700 text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Pin Code</label>
                <input
                  type="text"
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  placeholder="e.g. 560078"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-700 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Google Maps URL Placeholder</label>
                <input
                  type="url"
                  value={googleMapsUrl}
                  onChange={(e) => setGoogleMapsUrl(e.target.value)}
                  placeholder="https://maps.google.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-700 text-xs"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setActiveTab(1)}
                className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 font-semibold"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setActiveTab(3)}
                className="px-5 py-2 rounded-xl bg-brand-800 text-white font-semibold"
              >
                Next: Pricing & Capacity →
              </button>
            </div>
          </div>
        )}

        {/* Section 3: Pricing and Capacity */}
        {activeTab === 3 && (
          <div className="space-y-4 text-xs">
            <h2 className="font-serif font-bold text-base text-stone-900 mb-1">
              3. Pricing & Guest Capacity
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Starting Price (₹) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  step="5000"
                  value={startingPrice}
                  onChange={(e) => setStartingPrice(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-700 text-xs font-serif text-sm font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Pricing Model</label>
                <select
                  value={pricingType}
                  onChange={(e) => setPricingType(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-700 text-xs bg-white"
                >
                  <option value="per_day">Per 24-Hour Day Rental</option>
                  <option value="morning_slot">Morning Muhurtham Slot</option>
                  <option value="evening_slot">Evening Reception Slot</option>
                  <option value="per_plate">Per Plate Package</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Min Guests</label>
                <input
                  type="number"
                  value={guestCapacityMin}
                  onChange={(e) => setGuestCapacityMin(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Max Guests</label>
                <input
                  type="number"
                  value={guestCapacityMax}
                  onChange={(e) => setGuestCapacityMax(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Dining Seats</label>
                <input
                  type="number"
                  value={diningCapacity}
                  onChange={(e) => setDiningCapacity(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-stone-700 mb-1">AC Rooms</label>
                <input
                  type="number"
                  value={roomsCount}
                  onChange={(e) => setRoomsCount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Advance Token (%)</label>
                <input
                  type="number"
                  value={advancePercentage}
                  onChange={(e) => setAdvancePercentage(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Cancellation Policy</label>
                <input
                  type="text"
                  value={cancellationPolicy}
                  onChange={(e) => setCancellationPolicy(e.target.value)}
                  placeholder="e.g. Refundable up to 60 days before event"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Pricing Notes</label>
              <textarea
                rows={2}
                value={pricingNotes}
                onChange={(e) => setPricingNotes(e.target.value)}
                placeholder="e.g. Includes main mantapa, cleaning, 4 AC rooms. Electricity on actuals."
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs"
              />
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setActiveTab(2)}
                className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 font-semibold"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setActiveTab(4)}
                className="px-5 py-2 rounded-xl bg-brand-800 text-white font-semibold"
              >
                Next: Amenities →
              </button>
            </div>
          </div>
        )}

        {/* Section 4: Amenities */}
        {activeTab === 4 && (
          <div className="space-y-4 text-xs">
            <h2 className="font-serif font-bold text-base text-stone-900 mb-1">
              4. Amenities & Facilities
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-stone-50 rounded-xl border border-stone-200">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasAC}
                  onChange={(e) => setHasAC(e.target.checked)}
                  className="w-4 h-4 rounded text-brand-800"
                />
                <span className="font-medium text-stone-800">Centralized Air Conditioning (AC)</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasPowerBackup}
                  onChange={(e) => setHasPowerBackup(e.target.checked)}
                  className="w-4 h-4 rounded text-brand-800"
                />
                <span className="font-medium text-stone-800">100% Generator Standby Power Backup</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasBridalRooms}
                  onChange={(e) => setHasBridalRooms(e.target.checked)}
                  className="w-4 h-4 rounded text-brand-800"
                />
                <span className="font-medium text-stone-800">Dedicated Bride & Groom Grooming Suites</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasDecorationInhouse}
                  onChange={(e) => setHasDecorationInhouse(e.target.checked)}
                  className="w-4 h-4 rounded text-brand-800"
                />
                <span className="font-medium text-stone-800">In-house Stage Floral Decoration Team</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasParking}
                  onChange={(e) => setHasParking(e.target.checked)}
                  className="w-4 h-4 rounded text-brand-800"
                />
                <span className="font-medium text-stone-800">Dedicated Parking Compound</span>
              </label>
            </div>

            {hasParking && (
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Car Parking Capacity</label>
                <input
                  type="number"
                  value={parkingCapacity}
                  onChange={(e) => setParkingCapacity(Number(e.target.value))}
                  placeholder="e.g. 250"
                  className="w-full sm:w-48 px-3.5 py-2 rounded-xl border border-stone-200 text-xs"
                />
              </div>
            )}

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setActiveTab(3)}
                className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 font-semibold"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setActiveTab(5)}
                className="px-5 py-2 rounded-xl bg-brand-800 text-white font-semibold"
              >
                Next: Catering Terms →
              </button>
            </div>
          </div>
        )}

        {/* Section 5: Catering */}
        {activeTab === 5 && (
          <div className="space-y-4 text-xs">
            <h2 className="font-serif font-bold text-base text-stone-900 mb-1">
              5. Catering Arrangements
            </h2>

            <div>
              <label className="block font-semibold text-stone-700 mb-2">Catering Dietary Policy</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setCateringType('veg_only')}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    cateringType === 'veg_only'
                      ? 'border-brand-700 bg-brand-50/60 font-semibold text-brand-900'
                      : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <span className="block font-bold mb-0.5">Strictly Pure Vegetarian</span>
                  <span className="text-[11px] text-stone-500 font-normal">
                    Satvik Brahmin/Jain compliant kitchen. Non-veg and alcohol strictly forbidden.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setCateringType('veg_and_nonveg')}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    cateringType === 'veg_and_nonveg'
                      ? 'border-brand-700 bg-brand-50/60 font-semibold text-brand-900'
                      : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <span className="block font-bold mb-0.5">Veg & Non-Veg Permitted</span>
                  <span className="text-[11px] text-stone-500 font-normal">
                    Dual kitchen setups or separate service areas available for non-veg meals.
                  </span>
                </button>
              </div>
            </div>

            <div className="p-4 bg-stone-50 rounded-xl space-y-2 border border-stone-200">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allowOutsideCatering}
                  onChange={(e) => setAllowOutsideCatering(e.target.checked)}
                  className="w-4 h-4 rounded text-brand-800"
                />
                <span className="font-semibold text-stone-800">Outside Caterers Permitted</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasInhouseCatering}
                  onChange={(e) => setHasInhouseCatering(e.target.checked)}
                  className="w-4 h-4 rounded text-brand-800"
                />
                <span className="font-semibold text-stone-800">In-house Catering Available</span>
              </label>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setActiveTab(4)}
                className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 font-semibold"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setActiveTab(6)}
                className="px-5 py-2 rounded-xl bg-brand-800 text-white font-semibold"
              >
                Next: Photo Gallery →
              </button>
            </div>
          </div>
        )}

        {/* Section 6: Photo Gallery */}
        {activeTab === 6 && (
          <div className="space-y-4 text-xs">
            <h2 className="font-serif font-bold text-base text-stone-900 mb-1">
              6. Venue Photography
            </h2>

            <div className="flex gap-2">
              <input
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Paste high-res image URL (e.g. Unsplash or hosted URL)..."
                className="flex-1 px-3.5 py-2 rounded-xl border border-stone-200 text-xs"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="px-4 py-2 rounded-xl bg-stone-800 text-white font-semibold flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add URL</span>
              </button>
            </div>

            {/* Local Mock Upload Input */}
            <div className="p-4 border-2 border-dashed border-stone-200 rounded-xl text-center">
              <input
                type="file"
                id="file-upload"
                accept="image/*"
                onChange={handleMockUpload}
                className="hidden"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs transition-colors"
              >
                <Upload className="w-4 h-4 text-brand-800" />
                <span>Upload Photo from Device (Object URL Demo)</span>
              </label>
              <p className="text-[11px] text-stone-400 mt-1">PNG, JPG up to 10MB</p>
            </div>

            {/* Photos Preview Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {images.map((img, idx) => (
                <div key={idx} className="relative group aspect-[4/3] rounded-xl overflow-hidden border border-stone-200 bg-stone-100">
                  <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1.5 right-1.5 p-1 bg-stone-900/80 text-white rounded-full opacity-80 hover:opacity-100"
                    title="Remove Photo"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  {idx === 0 && (
                    <span className="absolute bottom-1.5 left-1.5 bg-brand-900/90 text-white text-[10px] px-1.5 py-0.5 rounded font-semibold">
                      Featured Cover
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setActiveTab(5)}
                className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 font-semibold"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setActiveTab(7)}
                className="px-5 py-2 rounded-xl bg-brand-800 text-white font-semibold"
              >
                Next: Review & Publish →
              </button>
            </div>
          </div>
        )}

        {/* Section 7: Review & Publication */}
        {activeTab === 7 && (
          <div className="space-y-5 text-xs">
            <h2 className="font-serif font-bold text-base text-stone-900 mb-1">
              7. Review Listing & Confirm
            </h2>

            <div className="bg-stone-50 rounded-xl p-5 border border-stone-200 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-serif font-bold text-base text-stone-900">{name || 'Untitled Venue'}</h3>
                  <p className="text-stone-500">{locality}, {city}</p>
                </div>
                <span className="font-serif font-bold text-base text-brand-900">
                  ₹{startingPrice.toLocaleString('en-IN')} / {pricingType.replace('_', ' ')}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-stone-200 text-[11px]">
                <div>Capacity: <strong>{guestCapacityMin} - {guestCapacityMax}</strong></div>
                <div>Dining: <strong>{diningCapacity} seats</strong></div>
                <div>Rooms: <strong>{roomsCount} AC</strong></div>
                <div>Parking: <strong>{hasParking ? `${parkingCapacity} cars` : 'No'}</strong></div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setActiveTab(6)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-stone-100 text-stone-700 font-semibold"
              >
                ← Back
              </button>

              <button
                type="button"
                onClick={() => handleSubmit('draft')}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-stone-300 text-stone-800 font-semibold hover:bg-stone-50"
              >
                Save as Draft
              </button>

              <button
                type="button"
                onClick={() => handleSubmit('published')}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-brand-800 hover:bg-brand-900 text-white font-semibold shadow-xs"
              >
                Publish Live to KalyanaSpace
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
