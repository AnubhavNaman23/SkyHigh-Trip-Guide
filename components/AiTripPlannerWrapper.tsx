'use client';

import dynamic from 'next/dynamic';
import TripLoader from '@/components/TripLoader';

const AiTripPlanner = dynamic(() => import('@/components/AiTripPlanner'), { 
  ssr: false, 
  loading: () => <TripLoader /> 
});

export default function AiTripPlannerWrapper() {
  return <AiTripPlanner />;
}
