import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TripPlannerResponse, TripPlannerForm, TravelItem } from '@/types';

export interface Booking {
  id: string;
  type: 'flight' | 'hotel' | 'train' | 'bus' | 'cab';
  title: string;
  date: string;
  price: number;
  pointsEarned: number;
  status: 'confirmed' | 'cancelled';
}

export interface SavedTrip {
  id: string;
  title: string;
  destination: string;
  origin?: string;
  startDate: string;
  endDate: string;
  travelers: number;
  budget: number;
  totalPrice?: number;
  coverImage?: string;
  status: 'upcoming' | 'completed' | 'draft';
  isFavorite?: boolean;
  createdAt: string;
  itinerary: TripPlannerResponse['itinerary'];
  transport?: TravelItem | null;
  hotel?: TravelItem | null;
}

interface UserState {
  name: string;
  email: string;
  points: number;
  bookings: Booking[];
  savedTrips: SavedTrip[];
  generatedTrip: TripPlannerResponse | null;
  tripSearchParams: TripPlannerForm | null;
  selectedTripOptions: { transport: TravelItem | null; hotel: TravelItem | null } | null;
  singleBookingItem: TravelItem | null;
  addBooking: (booking: Booking) => void;
  addPoints: (amount: number) => void;
  saveTrip: (trip: SavedTrip) => void;
  updateTrip: (id: string, updates: Partial<SavedTrip>) => void;
  deleteTrip: (id: string) => void;
  duplicateTrip: (id: string) => void;
  toggleFavoriteTrip: (id: string) => void;
  setGeneratedTrip: (trip: TripPlannerResponse | null) => void;
  setTripSearchParams: (params: TripPlannerForm | null) => void;
  setSelectedTripOptions: (options: { transport: TravelItem | null; hotel: TravelItem | null } | null) => void;
  setSingleBookingItem: (item: TravelItem | null) => void;
  resetUser: () => void;
}

export const useStore = create<UserState>()(
  persist(
    (set) => ({
      name: '',
      email: '',
      points: 0,
      bookings: [],
      savedTrips: [],
      generatedTrip: null,
      tripSearchParams: null,
      selectedTripOptions: null,
      singleBookingItem: null,
      addBooking: (booking) =>
        set((state) => ({
          bookings: [booking, ...state.bookings],
          points: state.points + booking.pointsEarned,
        })),
      addPoints: (amount) =>
        set((state) => ({ points: state.points + amount })),
      saveTrip: (trip) =>
        set((state) => ({
          savedTrips: [trip, ...state.savedTrips.filter((t) => t.id !== trip.id)],
        })),
      updateTrip: (id, updates) =>
        set((state) => ({
          savedTrips: state.savedTrips.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        })),
      deleteTrip: (id) =>
        set((state) => ({
          savedTrips: state.savedTrips.filter((t) => t.id !== id),
        })),
      duplicateTrip: (id) =>
        set((state) => {
          const original = state.savedTrips.find((t) => t.id === id);
          if (!original) return state;
          const duplicate: SavedTrip = {
            ...original,
            id: `trip_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            title: `${original.title} (Copy)`,
            createdAt: new Date().toISOString(),
          };
          return { savedTrips: [duplicate, ...state.savedTrips] };
        }),
      toggleFavoriteTrip: (id) =>
        set((state) => ({
          savedTrips: state.savedTrips.map((t) =>
            t.id === id ? { ...t, isFavorite: !t.isFavorite } : t
          ),
        })),
      setGeneratedTrip: (trip) => set({ generatedTrip: trip }),
      setTripSearchParams: (params) => set({ tripSearchParams: params }),
      setSelectedTripOptions: (options) => set({ selectedTripOptions: options }),
      setSingleBookingItem: (item) => set({ singleBookingItem: item }),
      resetUser: () =>
        set({
          points: 0,
          bookings: [],
          savedTrips: [],
          generatedTrip: null,
          tripSearchParams: null,
          selectedTripOptions: null,
          singleBookingItem: null,
        }),
    }),
    {
      name: 'skyhigh-storage',
      version: 1,
      migrate: (persistedState: unknown, version: number) => {
        if (typeof persistedState === 'object' && persistedState !== null) {
          const ps = persistedState as Partial<UserState>;
          if (version === 0 && ps.points !== undefined) {
            ps.points = 0;
          }
          return ps;
        }
        return null;
      },
    }
  )
);

