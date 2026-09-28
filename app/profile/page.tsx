'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import { useAuth } from '@/context/AuthContext';
import { getUserBookings, getUserData } from '@/lib/userService';
import { Wallet, Calendar, Loader2, Ticket } from 'lucide-react';
import Link from 'next/link';
// Booking import removed as unused
import TicketCard from '@/components/TicketCard';
import BookingItemCard from '@/components/BookingItemCard';
import BoardingPass from '@/components/BoardingPass';
import { AnimatePresence } from 'framer-motion';
import { pointsToRupees } from '@/lib/points';
import { Booking, TravelItem } from '@/types';

export default function ProfilePage() {
  const { user } = useAuth();
  const { name: storeName, email: storeEmail, points: storePoints } = useStore();
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [points, setPoints] = useState(storePoints);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [selectedTab, setSelectedTab] = useState<'trips' | 'bookings'>('trips');

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const [fetchedBookings, userData] = await Promise.all([
            getUserBookings(user.uid),
            getUserData(user.uid)
          ]);
          setBookings(fetchedBookings);
          if (userData?.points) {
            setPoints(userData.points);
          }
        } catch (error) {
          console.error("Error fetching profile data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const displayName = user?.displayName || storeName;
  const displayEmail = user?.email || storeEmail;

  const tripsList = bookings.filter((b) => b.type === 'ai_trip' || b.itinerary);
  const bookingItemsFlat = bookings
    .filter(b => b.type === 'single_item' || (Array.isArray(b.items) && b.items.length > 0) || b.transport || b.hotel)
    .flatMap((b) => {
      if (Array.isArray(b.items) && b.items.length > 0) return b.items.map((it: TravelItem) => ({ parent: b, item: it }));
      const item = b.transport || b.hotel;
      return item ? [{ parent: b, item }] : [];
    });

  return (
    <div className="min-h-screen bg-secondary/30 py-12 px-4">
      <div className="container-custom max-w-5xl">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl p-8 border border-border shadow-sm mb-8 flex flex-col md:flex-row items-center gap-8">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-3xl font-bold text-primary border-4 border-white shadow-md">
            {displayName.charAt(0)}
          </div>
          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl font-bold mb-1">{displayName}</h1>
            <p className="text-muted-foreground">{displayEmail}</p>
          </div>
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-6 rounded-xl shadow-lg min-w-[250px] text-center md:text-right">
            <div className="flex items-center justify-center md:justify-end gap-2 mb-1 opacity-90">
              <Wallet className="w-5 h-5" />
              <span className="text-sm font-medium">Available Points</span>
            </div>
            <p className="text-4xl font-bold">{points.toLocaleString()}</p>
            <p className="text-xs text-blue-100 mt-2">Worth ₹{pointsToRupees(points)} in rewards ({points} pts)</p>
          </div>
        </div>

        {/* Bookings History */}
        <div className="flex items-center gap-3 mb-6 justify-between">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Ticket className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 ml-3">
            <h2 className="text-2xl font-bold">Your Trips & Bookings</h2>
            <p className="text-muted-foreground text-sm">{tripsList.length} trips • {bookingItemsFlat.length} items</p>
          </div>
          <div className="ml-4 flex gap-2">
            <button onClick={() => setSelectedTab('trips')} className={`px-4 py-2 rounded-lg ${selectedTab === 'trips' ? 'bg-blue-600 text-white' : 'bg-white text-slate-900 border border-border'}`}>
              Trips ({tripsList.length})
            </button>
            <button onClick={() => setSelectedTab('bookings')} className={`px-4 py-2 rounded-lg ${selectedTab === 'bookings' ? 'bg-blue-600 text-white' : 'bg-white text-slate-900 border border-border'}`}>
              Bookings ({bookingItemsFlat.length})
            </button>
          </div>
        </div>
        
        { (selectedTab === 'trips' ? tripsList.length === 0 : bookingItemsFlat.length === 0) ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-border border-dashed">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold mb-2">No {selectedTab === 'trips' ? 'trips' : 'bookings'} yet</h3>
            <p className="text-muted-foreground mb-6">Start exploring the world and earn points on your first {selectedTab === 'trips' ? 'trip' : 'booking'}!</p>
            <Link href="/" className="btn-primary inline-block">
              Start Booking
            </Link>
          </div>
        ) : (
          <>
            {selectedTab === 'trips' ? (
              <div className="grid md:grid-cols-2 gap-6">
                {tripsList.map((booking) => (
                  <TicketCard
                    key={booking.id}
                    bookingId={booking.bookingId || booking.id}
                    tripName={booking.tripName || booking.title || 'Trip'}
                    origin={booking.origin || 'Origin'}
                    destination={booking.destination || 'Destination'}
                    startDate={booking.startDate || new Date().toISOString()}
                    endDate={booking.endDate}
                    travelers={booking.travelers || 1}
                    totalPrice={booking.totalPrice || 0}
                    pointsEarned={booking.pointsEarned || 0}
                    transportType={booking.transport?.type || 'flight'}
                    hotelName={booking.hotel?.title}
                    onClick={() => setSelectedBooking(booking)}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {bookingItemsFlat.map(({ parent, item }: { parent: Booking, item: TravelItem }) => (
                    <BookingItemCard
                      key={`${parent.id}-${item.id || item.title}`}
                      bookingId={parent.bookingId || parent.id}
                      item={item}
                      date={parent.startDate || item.startDate || new Date().toISOString()}
                      pointsEarned={parent.pointsEarned || 0}
                      onClick={() => setSelectedBooking({ ...parent, transport: item.type !== 'hotel' ? item : undefined, hotel: item.type === 'hotel' ? item : undefined, tripName: item.title, origin: item.from || parent.origin, destination: item.to || parent.destination, totalPrice: item.price || parent.totalPrice })}
                    />
                  ))}
              </div>
            )}
          </>
        )}

        {/* Boarding Pass Modal */}
        <AnimatePresence>
          {selectedBooking && (
            <BoardingPass
              bookingId={selectedBooking.bookingId || selectedBooking.id}
              tripName={selectedBooking.tripName || selectedBooking.title || 'Trip'}
              origin={selectedBooking.origin || 'Origin'}
              destination={selectedBooking.destination || 'Destination'}
              startDate={selectedBooking.startDate || new Date().toISOString()}
              endDate={selectedBooking.endDate || selectedBooking.startDate || new Date().toISOString()}
              travelers={selectedBooking.travelers || 1}
              totalPrice={selectedBooking.totalPrice || 0}
              pointsEarned={selectedBooking.pointsEarned || 0}
              transport={selectedBooking.transport}
              hotel={selectedBooking.hotel}
              passengerName={user?.displayName || storeName || 'Guest'}
              onClose={() => setSelectedBooking(null)}
              onViewProfile={() => setSelectedBooking(null)}
              onGoHome={() => window.location.href = '/'}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
