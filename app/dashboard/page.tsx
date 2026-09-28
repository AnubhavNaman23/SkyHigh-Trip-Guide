'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Compass,
  Calendar,
  MapPin,
  Hotel,
  ArrowRight,
  TrendingUp,
  Award,
  Clock,
  ChevronRight,
  PlusCircle,
  FolderHeart,
  Search
} from 'lucide-react';
import { useStore, SavedTrip } from '@/store/useStore';
import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { savedTrips, points, setGeneratedTrip, setTripSearchParams } = useStore();
  const [searchFilter, setSearchFilter] = useState('');

  // Find next upcoming trip
  const upcomingTrip = useMemo(() => {
    return savedTrips.find((t) => t.status === 'upcoming') || savedTrips[0] || null;
  }, [savedTrips]);

  // Filtered recent trips
  const filteredRecentTrips = useMemo(() => {
    return savedTrips
      .filter((t) =>
        t.destination.toLowerCase().includes(searchFilter.toLowerCase()) ||
        t.title.toLowerCase().includes(searchFilter.toLowerCase())
      )
      .slice(0, 4);
  }, [savedTrips, searchFilter]);

  const handleOpenTrip = (trip: SavedTrip) => {
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

  const formatPrice = (val?: number) =>
    val ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val) : '—';

  return (
    <div className="min-h-screen bg-[#f8faff] pb-24 pt-8">
      <div className="container-custom px-4 sm:px-6 lg:px-8">
        
        {/* Top Welcome Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-50 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-3 border border-blue-100">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SkyHigh Travel Hub</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              Welcome back, {user?.displayName || 'Traveler'} 👋
            </h1>
            <p className="text-slate-600 text-sm md:text-base mt-1">
              Here is your active travel summary, quick actions, and upcoming itinerary plans.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/ai-trip"
              className="btn-primary text-sm px-5 py-2.5 shadow-md shadow-blue-500/20"
            >
              <PlusCircle className="w-4 h-4" />
              Plan a New Trip
            </Link>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider">Upcoming Trips</span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {savedTrips.filter((t) => t.status === 'upcoming').length}
            </p>
            <span className="text-[11px] text-emerald-600 font-medium">Ready to travel</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider">Saved Itineraries</span>
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <FolderHeart className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{savedTrips.length}</p>
            <span className="text-[11px] text-slate-500 font-medium">Stored in your library</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider">Rewards Points</span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-amber-600">{points || 0}</p>
            <span className="text-[11px] text-slate-500 font-medium">3% cashback active</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider">Membership</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{user?.pro ? 'SkyHigh PRO' : 'Standard'}</p>
            <Link href="/subscription" className="text-[11px] text-primary font-medium hover:underline">
              {user?.pro ? 'Manage plan' : 'Upgrade to PRO ✨'}
            </Link>
          </div>
        </div>

        {/* Quick Actions Shortcuts */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <Link
            href="/ai-trip"
            className="group bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-32"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
            </div>
            <div>
              <p className="font-bold text-sm">AI Trip Planner</p>
              <p className="text-[11px] text-blue-100">Custom itinerary in 60s</p>
            </div>
          </Link>

          <Link
            href="/explore"
            className="group bg-white hover:bg-slate-50 border border-slate-200/80 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all flex flex-col justify-between h-32"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-primary transition-all" />
            </div>
            <div>
              <p className="font-bold text-sm text-slate-900">Explore Destinations</p>
              <p className="text-[11px] text-slate-500">Curated world guides</p>
            </div>
          </Link>

          <Link
            href="/trips"
            className="group bg-white hover:bg-slate-50 border border-slate-200/80 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all flex flex-col justify-between h-32"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <FolderHeart className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-primary transition-all" />
            </div>
            <div>
              <p className="font-bold text-sm text-slate-900">My Trips</p>
              <p className="text-[11px] text-slate-500">View, edit & organize</p>
            </div>
          </Link>

          <Link
            href="/search/hotels"
            className="group bg-white hover:bg-slate-50 border border-slate-200/80 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all flex flex-col justify-between h-32"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Hotel className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-primary transition-all" />
            </div>
            <div>
              <p className="font-bold text-sm text-slate-900">Find Stays & Flights</p>
              <p className="text-[11px] text-slate-500">Compare top live deals</p>
            </div>
          </Link>
        </div>

        {/* Next Upcoming Trip Spotlight */}
        {upcomingTrip && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Featured Journey
              </h2>
              <Link href="/trips" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                View all ({savedTrips.length})
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all grid grid-cols-1 lg:grid-cols-12 gap-0">
              <div className="relative h-64 lg:h-auto lg:col-span-5 bg-slate-100">
                <Image
                  src={upcomingTrip.coverImage || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=1200'}
                  alt={upcomingTrip.destination}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent lg:hidden" />
                <span className="absolute top-4 left-4 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500 text-white shadow-xs">
                  {upcomingTrip.status}
                </span>
              </div>

              <div className="p-6 md:p-8 lg:col-span-7 flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>{upcomingTrip.destination}</span>
                    <span>·</span>
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>{upcomingTrip.startDate}</span>
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 mb-3">
                    {upcomingTrip.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    {upcomingTrip.itinerary?.overview}
                  </p>

                  {/* Highlights Pill Preview */}
                  {upcomingTrip.itinerary?.dailyPlan && upcomingTrip.itinerary.dailyPlan.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Itinerary Sneak Peek</p>
                      <div className="flex flex-wrap gap-2">
                        {upcomingTrip.itinerary.dailyPlan.slice(0, 3).map((day, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-slate-50 border border-slate-200/80 px-3 py-1 rounded-xl text-slate-700"
                          >
                            <span className="font-semibold text-primary">{day.day}:</span> {day.title}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Estimated Cost</span>
                    <span className="text-xl font-bold text-slate-900">
                      {formatPrice(upcomingTrip.totalPrice || upcomingTrip.budget)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleOpenTrip(upcomingTrip)}
                    className="btn-primary text-sm px-6 py-2.5"
                  >
                    <span>Open Travel Workspace</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Itineraries Grid */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Recent Plans & Stays</h2>
              <p className="text-xs text-slate-500">Pick up right where you left off</p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Filter by city..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredRecentTrips.map((trip) => (
              <div
                key={trip.id}
                onClick={() => handleOpenTrip(trip)}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="relative h-36 w-full bg-slate-100">
                  <Image
                    src={trip.coverImage || 'https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&q=80&w=600'}
                    alt={trip.destination}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2.5 left-2.5 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-white/90 text-slate-800 backdrop-blur-xs">
                    {trip.destination}
                  </span>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 group-hover:text-primary transition-colors line-clamp-1">
                      {trip.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{trip.startDate}</span>
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="font-bold text-slate-900">{formatPrice(trip.totalPrice || trip.budget)}</span>
                    <span className="text-primary font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      Open <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
