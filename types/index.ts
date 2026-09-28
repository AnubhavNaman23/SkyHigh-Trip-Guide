export interface TravelItem {
    id: string;
    type: 'flight' | 'hotel' | 'train' | 'bus' | 'cab';
    title: string;
    subtitle: string;
    price: number;
    rating: number;
    image: string;
    details: string[];
    from?: string;
    to?: string;
    startDate?: string;
    endDate?: string;
}

export interface TripPlannerForm {
    origin: string;
    destination: string;
    startDate: string;
    endDate: string;
    budget: number;
    travelers: number;
    travelGroup: 'solo' | 'couple' | 'family' | 'friends' | 'business';
    travelStyle: 'relaxed' | 'balanced' | 'adventure';
    interests: string[];
}

export interface TripItineraryDay {
    day: string;
    title: string;
    summary: string;
    activities: string[];
    dining?: string[];
}

export interface TripItinerary {
    overview: string;
    budgetBreakdown?: {
        transport: number;
        stays: number;
        experiences: number;
    };
    tips: string[];
    dailyPlan: TripItineraryDay[];
}

export interface TripPlannerResponse {
    itinerary: TripItinerary;
    transportOptions: {
        flights: TravelItem[];
        trains: TravelItem[];
        buses: TravelItem[];
    };
    hotelOptions: TravelItem[];
    // Optional summary to indicate whether plan meets user's budget and suggestions
    budgetSummary?: {
        overBudget: boolean;
        estimatedTotal: number; // estimated cost in INR
        budget: number; // user budget
        suggestedTransportId?: string; // id of suggested cheaper transport
        suggestedHotelId?: string; // id of suggested cheaper hotel
    };
}

export interface UserPreferences {
    travelStyle: string;
    companions: string;
    interests: string[];
}

export interface User {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string | null;
    preferences: UserPreferences | null;
    pro: boolean; // Replaces subscriptionStatus
    subscriptionExpiry?: unknown; // Firestore Timestamp
    points: number;
    createdAt: unknown; // Firestore Timestamp
    updatedAt: unknown; // Firestore Timestamp
}

export interface Booking {
    id: string;
    type?: string;
    bookingId?: string;
    items?: TravelItem[];
    transport?: TravelItem;
    hotel?: TravelItem;
    itinerary?: TripItinerary;
    tripName?: string;
    title?: string;
    origin?: string;
    destination?: string;
    startDate?: string;
    endDate?: string;
    travelers?: number;
    totalPrice?: number;
    pointsEarned?: number;
    createdAt?: unknown;
    status?: string;
    isShared?: boolean;
    sharedTripId?: string;
    // Allow for flexibility as legacy data might vary
    [key: string]: unknown;
}
