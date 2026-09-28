import AiTripPlannerWrapper from '@/components/AiTripPlannerWrapper';

export const metadata = {
  title: 'AI Trip Planner - SkyHigh',
  description: 'Generate a personalized trip itinerary using AI',
};

export default function AiTripPage() {
  return (
    <div className="min-h-screen bg-secondary/30 py-10">
      <div className="container-custom space-y-10">
        <AiTripPlannerWrapper />
      </div>
    </div>
  );
}
