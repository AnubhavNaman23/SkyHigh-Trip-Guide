'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Calendar,
  Users,
  Search,
  Plus,
  Trash2,
  Copy,
  Heart,
  ArrowRight,
  Sparkles,
  Compass,
  AlertTriangle,
  X
} from 'lucide-react';
import { useStore, SavedTrip } from '@/store/useStore';
import { useAuth } from '@/context/AuthContext';
import { getUserBookings } from '@/lib/userService';
import { Booking } from '@/types';

// Sample fallback curated trips for new users if store is initially empty
const demoCuratedTrips: SavedTrip[] = [
  {
    id: 'demo-goa-2026',
    title: 'Sunny Goa Coastal Retreat',
    destination: 'Goa, India',
    origin: 'Mumbai',
    startDate: '2026-11-10',
    endDate: '2026-11-15',
    travelers: 2,
    budget: 45000,
    totalPrice: 41200,
    coverImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=800',
    status: 'upcoming',
    isFavorite: true,
    createdAt: new Date().toISOString(),
    itinerary: {
      overview: '5-day beach, spice plantation, and heritage journey through North & South Goa.',
      tips: ['Rent a scooter for easy beach hopping', 'Try local Goan fish curry at beach shacks'],
      dailyPlan: [
        {
          day: 'Day 1',
          title: 'Arrival & Calangute Beach Sunset',
          summary: 'Check into seaside resort, stroll along golden sands, and enjoy beach shack dinner.',
          activities: ['Hotel check-in and leisure', 'Calangute beach stroll', 'Sunset cocktails at Baga'],
          dining: ['Britto’s Beach Shack', 'Fisherman’s Wharf']
        },
        {
          day: 'Day 2',
          title: 'Old Goa Heritage & Spice Plantation',
          summary: 'Visit Basilica of Bom Jesus, Se Cathedral, followed by authentic spice plantation tour.',
          activities: ['UNESCO heritage church tour', 'Sahakari Spice Farm lunch & spice walk'],
          dining: ['Spice Farm traditional buffet']
        }
      ]
    }
  },
  {
    id: 'demo-paris-2026',
    title: 'Paris Art & Culinary Discovery',
    destination: 'Paris, France',
    origin: 'New Delhi',
    startDate: '2026-06-05',
    endDate: '2026-06-12',
    travelers: 2,
    budget: 180000,
    totalPrice: 172000,
    coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800',
    status: 'draft',
    isFavorite: false,
    createdAt: new Date().toISOString(),
    itinerary: {
      overview: '7-day romantic exploration of Paris museums, rooftop cafes, and Montmartre sunsets.',
      tips: ['Book Louvre tickets 3 weeks in advance', 'Walk along the Seine during sunset'],
      dailyPlan: [
        {
          day: 'Day 1',
          title: 'Eiffel Tower & Seine Cruise',
          summary: 'Arrive in Paris, settle in Le Marais, evening river cruise with illuminated monument views.',
          activities: ['Trocadéro viewpoint', 'Bateaux-Mouches river cruise', 'Bistro dinner in Le Marais'],
          dining: ['Le Comptoir du Relais', 'Careful Boulangerie']
        }
      ]
    }
  }
];

export default function MyTripsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const {
    savedTrips,
    deleteTrip,
    duplicateTrip,
    toggleFavoriteTrip,
    saveTrip,
    setGeneratedTrip,
    setTripSearchParams
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'upcoming' | 'completed' | 'draft' | 'favorites'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'budget_high' | 'budget_low'>('newest');
  
  // Confirmation Modal state for deletion
  const [tripToDelete, setTripToDelete] = useState<SavedTrip | null>(null);

  // Sync trips from store, and use demo trips as initial fallback
  const tripsList = useMemo(() => {
    return savedTrips.length > 0 ? savedTrips : demoCuratedTrips;
  }, [savedTrips]);

  // Load Firestore bookings if user is signed in and convert to SavedTrip format if not present
  useEffect(() => {
    if (!user) return;
    const fetchUserTrips = async () => {
      try {
        const bookings: Booking[] = await getUserBookings(user.uid);
        if (bookings && bookings.length > 0) {
          bookings.forEach((b) => {
            const dest = b.destination || b.tripName || 'Vacation';
            const tripObj: SavedTrip = {
              id: b.id || `booking_${b.bookingId || Date.now()}`,
              title: b.tripName || `Trip to ${dest}`,
              destination: dest,
              origin: b.origin || '',
              startDate: b.startDate || new Date().toISOString().split('T')[0],
              endDate: b.endDate || new Date().toISOString().split('T')[0],
              travelers: b.travelers || 1,
              budget: b.totalPrice || 25000,
              totalPrice: b.totalPrice,
              coverImage: b.hotel?.image || 'https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&q=80&w=800',
              status: (b.status as 'upcoming' | 'completed' | 'draft') || 'upcoming',
              isFavorite: false,
              createdAt: new Date().toISOString(),
              itinerary: b.itinerary || {
                overview: `Booked vacation to ${dest}`,
                tips: ['Check confirmation details in Profile'],
                dailyPlan: []
              },
              transport: b.transport || null,
              hotel: b.hotel || null
            };
            saveTrip(tripObj);
          });
        }
      } catch (err) {
        console.warn('[SkyHigh] Could not load cloud trips:', err);
      }
    };
    fetchUserTrips();
  }, [user, saveTrip]);

  // Filter and search trips
  const filteredTrips = useMemo(() => {
    return tripsList.filter((trip) => {
      const matchesSearch =
        trip.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.title.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (selectedFilter === 'favorites') return trip.isFavorite;
      if (selectedFilter === 'all') return true;
      return trip.status === selectedFilter;
    }).sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortBy === 'budget_high') return (b.totalPrice || b.budget) - (a.totalPrice || a.budget);
      if (sortBy === 'budget_low') return (a.totalPrice || a.budget) - (b.totalPrice || b.budget);
      return 0;
    });
  }, [tripsList, searchQuery, selectedFilter, sortBy]);

  const handleOpenTrip = (trip: SavedTrip) => {
    // Load trip into store so /trip/result can render and allow editing
    setGeneratedTrip({
      itinerary: trip.itinerary,
      transportOptions: {
        flights: trip.transport && trip.transport.type === 'flight' ? [trip.transport] : [],
        trains: trip.transport && trip.transport.type === 'train' ? [trip.transport] : [],
        buses: trip.transport && trip.transport.type === 'bus' ? [trip.transport] : []
      },
      hotelOptions: trip.hotel ? [trip.hotel] : []
    });

    setTripSearchParams({
      origin: trip.origin || 'City',
      destination: trip.destination,
      startDate: trip.startDate,
      endDate: trip.endDate,
      budget: trip.budget,
      travelers: trip.travelers,
      travelGroup: 'couple',
      travelStyle: 'balanced',
      interests: ['Sightseeing', 'Food & Dining', 'Culture']
    });

    router.push('/trip/result');
  };

  const confirmDelete = () => {
    if (tripToDelete) {
      deleteTrip(tripToDelete.id);
      setTripToDelete(null);
    }
  };

  const formatPrice = (val?: number) =>
    val ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val) : '—';

  return (
    <div className="min-h-screen bg-[#f8faff] pb-24 pt-8">
      <div className="container-custom px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumb & Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>Travel Workspace</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              My Trips & Itineraries
            </h1>
            <p className="text-slate-600 text-sm md:text-base mt-1">
              Organize, customize, and revisit all your AI-crafted journeys in one place.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/ai-trip"
              className="btn-primary text-sm px-5 py-2.5 shadow-md shadow-blue-500/20"
            >
              <Plus className="w-4 h-4" />
              Plan New Trip
            </Link>
          </div>
        </div>

        {/* Filter Bar & Search */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 md:p-5 shadow-xs mb-8 space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by destination or trip name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800 placeholder:text-slate-400 bg-slate-50/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500 whitespace-nowrap">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-primary/20"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="budget_high">Highest Budget</option>
                <option value="budget_low">Lowest Budget</option>
              </select>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-t border-slate-100 pt-3">
            {[
              { id: 'all', label: `All Trips (${tripsList.length})` },
              { id: 'upcoming', label: `Upcoming (${tripsList.filter((t) => t.status === 'upcoming').length})` },
              { id: 'draft', label: `Drafts (${tripsList.filter((t) => t.status === 'draft').length})` },
              { id: 'completed', label: `Completed (${tripsList.filter((t) => t.status === 'completed').length})` },
              { id: 'favorites', label: `Favorites (${tripsList.filter((t) => t.isFavorite).length})` }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedFilter(tab.id as typeof selectedFilter)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedFilter === tab.id
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Trips Grid */}
        {filteredTrips.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-primary mx-auto mb-4">
              <Compass className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No trips found</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
              {searchQuery
                ? `No trips match "${searchQuery}". Try a different keyword.`
                : 'You have not added any trips yet in this category.'}
            </p>
            <Link href="/ai-trip" className="btn-primary text-sm px-6 py-2.5">
              <Sparkles className="w-4 h-4" />
              Plan Your First Trip
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map((trip) => (
              <motion.div
                key={trip.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col group"
              >
                {/* Cover Image & Badges */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={trip.coverImage || 'https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&q=80&w=800'}
                    alt={trip.destination}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

                  {/* Status Badge */}
                  <span
                    className={`absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs backdrop-blur-md ${
                      trip.status === 'upcoming'
                        ? 'bg-emerald-500/90 text-white'
                        : trip.status === 'completed'
                        ? 'bg-slate-700/90 text-white'
                        : 'bg-amber-500/90 text-white'
                    }`}
                  >
                    {trip.status}
                  </span>

                  {/* Favorite Toggle */}
                  <button
                    onClick={() => toggleFavoriteTrip(trip.id)}
                    aria-label="Toggle Favorite"
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-md hover:bg-white text-slate-700 transition-all shadow-xs"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        trip.isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-400'
                      }`}
                    />
                  </button>

                  {/* Destination Tag */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                    <div className="flex items-center gap-1.5 text-xs font-semibold drop-shadow-md">
                      <MapPin className="w-3.5 h-3.5 text-sky-300" />
                      <span className="truncate">{trip.destination}</span>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-1 mb-2">
                      {trip.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {trip.itinerary?.overview || 'Custom AI-generated travel itinerary.'}
                    </p>
                  </div>

                  {/* Trip Metadata */}
                  <div className="grid grid-cols-2 gap-2 py-3 border-y border-slate-100 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">
                        {trip.startDate ? trip.startDate : 'Dates flexible'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{trip.travelers} {trip.travelers === 1 ? 'Traveler' : 'Travelers'}</span>
                    </div>
                  </div>

                  {/* Budget & Actions Footer */}
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-semibold">Estimated Total</span>
                      <span className="text-sm font-bold text-slate-900">
                        {formatPrice(trip.totalPrice || trip.budget)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => duplicateTrip(trip.id)}
                        title="Duplicate Trip"
                        aria-label="Duplicate Trip"
                        className="p-2 rounded-xl text-slate-500 hover:text-primary hover:bg-blue-50 transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setTripToDelete(trip)}
                        title="Delete Trip"
                        aria-label="Delete Trip"
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleOpenTrip(trip)}
                        className="inline-flex items-center gap-1.5 bg-blue-50 text-primary font-semibold text-xs px-3 py-2 rounded-xl hover:bg-primary hover:text-white transition-all ml-1 shadow-2xs"
                      >
                        <span>View</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Modal for Destructive Delete Action */}
      <AnimatePresence>
        {tripToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200"
            >
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Trip Itinerary?</h3>
              <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                Are you sure you want to remove <span className="font-semibold text-slate-800">&quot;{tripToDelete.title}&quot;</span>? This action cannot be undone.
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setTripToDelete(null)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-rose-600 text-white hover:bg-rose-700 shadow-xs transition-colors"
                >
                  Yes, Delete Trip
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
