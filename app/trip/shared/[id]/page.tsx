import type { Metadata, ResolvingMetadata } from 'next';
import { db } from '@/lib/firebaseAdmin';
import SharedTripClient from './SharedTripClient';
import { Booking } from '@/types';

type Props = {
  params: Promise<{ id: string }>
}

async function getTrip(id: string): Promise<Booking | null> {
  if (!db) {
    return null;
  }
  const tripRef = db.collection('trips').doc(id);
  const doc = await tripRef.get();
  
  if (!doc.exists) {
    return null;
  }
  
  return { id: doc.id, ...doc.data() } as Booking;
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;
  const trip = await getTrip(id);
 
  if (!trip) {
    return {
      title: 'Trip Not Found',
    }
  }
  
  const previousImages = (await parent).openGraph?.images || []
 
  return {
    title: trip.tripName || 'Shared Trip',
    description: trip.itinerary?.overview || `Join this trip to ${trip.destination}`,
    openGraph: {
      title: `${trip.tripName} - SkyHigh`,
      description: trip.itinerary?.overview || `Check out this trip plan to ${trip.destination}`,
      images: trip.hotel?.image ? [trip.hotel.image, ...previousImages] : previousImages,
    },
  }
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const trip = await getTrip(id);

  return <SharedTripClient tripId={id} initialTrip={trip} />;
}

