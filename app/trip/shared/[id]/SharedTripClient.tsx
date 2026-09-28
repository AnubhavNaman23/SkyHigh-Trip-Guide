'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    Calendar,
    Check,
    CreditCard,
    Hotel as HotelIcon,
    Plane,
    Sparkles,
    Utensils,
    Share2,
    Download,
    Loader2
} from 'lucide-react';
import { differenceInCalendarDays, parseISO } from 'date-fns';

import { Booking, TravelItem, TripItineraryDay } from '@/types';
import { subscribeToTrip } from '@/lib/collaborationService';

import SquadSyncBar from '@/components/SquadSyncBar';

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(value);

const OptionCard = ({ 
    item, 
    badge, 
    selected, 
    onSelect 
}: { 
    item: TravelItem; 
    badge: string; 
    selected?: boolean;
    onSelect?: () => void;
}) => (
    <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
        onClick={onSelect}
        className={`group rounded-3xl border bg-white p-5 shadow-sm transition-all duration-300 cursor-pointer relative overflow-hidden ${
            selected ? 'border-primary ring-2 ring-primary/20' : 'border-border/50'
        }`}
    >
        {selected && (
            <div className="absolute top-0 right-0 bg-primary text-white px-3 py-1.5 rounded-bl-2xl shadow-lg z-10 text-xs font-bold flex items-center gap-1">
                <Check className="w-3 h-3" />
                SELECTED
            </div>
        )}
        <div className="flex items-start gap-5">
            <div className="relative shrink-0">
                <div className="w-24 h-24 rounded-2xl bg-secondary overflow-hidden border border-border/60 shadow-inner">
                    {item.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-primary/40 bg-primary/5">
                            <Sparkles className="w-8 h-8" />
                        </div>
                    )}
                </div>
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-border/50 text-primary uppercase shadow-sm whitespace-nowrap">
                    {badge}
                </span>
            </div>

            <div className="flex-1 min-w-0 py-1">
                <p className="text-xs font-bold text-primary uppercase tracking-wide mb-1 opacity-80">
                    {item.subtitle}
                </p>
                <h4 className="text-lg font-bold truncate text-slate-900 group-hover:text-primary transition-colors">
                    {item.title}
                </h4>
                <p className="text-sm text-muted-foreground truncate mt-1">
                    {item.details?.join(' · ')}
                </p>
                
                <div className="flex items-center gap-1 text-xs text-amber-500 mt-2 font-medium bg-amber-50 w-fit px-2 py-0.5 rounded-full">
                    <Sparkles className="w-3 h-3 fill-amber-500" />
                    {item.rating}/5 Rating
                </div>
            </div>

            <div className="text-right shrink-0 py-1">
                <p className="text-xl font-bold text-slate-900">
                    {formatCurrency(item.price)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">per person</p>
            </div>
        </div>
    </motion.div>
);

const TimelineCard = ({
    day,
    index
}: {
    day: TripItineraryDay;
    index: number;
}) => (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 }}
        className="relative pl-4 md:pl-8 pb-12 last:pb-0 group"
    >
        <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-primary/30 to-transparent group-last:hidden" />
        <div className="absolute left-[-4px] top-2 w-2.5 h-2.5 rounded-full bg-white border-2 border-primary ring-4 ring-primary/10 group-hover:scale-125 transition-transform duration-300" />
        
        <div className="rounded-3xl border border-border/50 bg-white p-5 md:p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
                <span className="px-4 py-1.5 rounded-full bg-primary/5 text-primary text-xs font-bold uppercase tracking-wider border border-primary/10">
                    {day.day}
                </span>
            </div>
            
            <h4 className="text-lg md:text-xl font-bold mb-2 text-slate-900">{day.title}</h4>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                {day.summary}
            </p>

            <div className="space-y-6">
                <div>
                    <h5 className="text-xs font-bold uppercase text-slate-400 mb-3 flex items-center gap-2">
                        <Check className="w-4 h-4 text-primary" />
                        Highlights
                    </h5>
                    <div className="grid gap-3">
                        {day.activities?.map((activity: string, idx: number) => (
                            <motion.div 
                                key={idx} 
                                whileHover={{ x: 4 }}
                                className="flex items-start gap-3 text-sm bg-slate-50 p-3 rounded-2xl border border-slate-100"
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                                <span className="text-slate-700">{activity}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {day.dining && day.dining.length > 0 && (
                    <div>
                        <h5 className="text-xs font-bold uppercase text-slate-400 mb-3 flex items-center gap-2">
                            <Utensils className="w-4 h-4 text-orange-500" />
                            Dining
                        </h5>
                        <div className="flex flex-wrap gap-2">
                            {day.dining.map((spot: string, idx: number) => (
                                <span key={idx} className="px-3 py-1.5 rounded-xl bg-orange-50 text-orange-700 text-xs font-medium border border-orange-100 hover:bg-orange-100 transition-colors cursor-default">
                                    {spot}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    </motion.div>
);

export default function SharedTripClient({ 
    tripId, 
    initialTrip 
}: { 
    tripId: string;
    initialTrip: Booking | null;
}) {
    const router = useRouter();
    
    // Initialize with server data if available, otherwise null
    const [trip, setTrip] = useState<Booking | null>(initialTrip);
    const [loading, setLoading] = useState(!initialTrip);

    useEffect(() => {
        if (!tripId) return;

        console.log("Subscribing to trip:", tripId);
        // Subscribe to real-time updates
        // On first callback, it will update state with latest data
        const unsubscribe = subscribeToTrip(tripId, (updatedTrip) => {
            console.log("Got trip update:", updatedTrip);
            if (updatedTrip) {
                setTrip(updatedTrip);
            } else if (!initialTrip) {
                // Only set error if we didn't have initial data and now we still don't find it
                // Logic: subscribeToTrip might return null if doc doesn't exist
                // Assuming subscribeToTrip handles existence check internally and might just not call back or call back with null?
                // The current implementation of subscribeToTrip only calls onUpdate if doc exists.
                // So if it doesn't exist, we might hang on loading if we don't have a check.
                // NOTE: subscribeToTrip in previous code simple checks doc.exists().
                // To handle "Trip not found" properly in real-time if it was deleted, or if it never existed, 
                // we might need to handle the case where it doesn't exist more explicitly in the subscription.
                // For now, we rely on initialTrip for strict 404s.
            }
            setLoading(false);
        });

        // If we didn't have initial trip, we rely on subscription. 
        // If we had initial trip, we still subscribe for updates.

        return () => unsubscribe();
    }, [tripId, initialTrip]);

    const tripDays = useMemo(() => {
        if (!trip?.startDate || !trip?.endDate) return 1;
        try {
            const diff = differenceInCalendarDays(parseISO(trip.endDate), parseISO(trip.startDate)) + 1;
            return diff > 0 ? diff : 1;
        } catch {
            return 1;
        }
    }, [trip]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <p className="text-slate-500 font-medium">Syncing Squad Trip...</p>
            </div>
        );
    }

    if (!trip) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4 text-center p-4">
                <Sparkles className="w-12 h-12 text-slate-300" />
                <h2 className="text-xl font-bold text-slate-900">Trip Not Found</h2>
                <p className="text-slate-500 max-w-sm">The trip you are looking for doesn&apos;t exist or access is restricted.</p>
                <button onClick={() => router.push('/')} className="px-6 py-3 bg-primary text-white rounded-xl font-bold">
                    Go Home
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20">
             {/* Header / Hero */}
             <div className="bg-slate-900 text-white pb-32 pt-10 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-900" />
                
                <div className="container-custom relative z-10">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                    >
                        <div>
                            <div className="flex items-center gap-2 text-blue-400 font-medium mb-2">
                                <Sparkles className="w-4 h-4" />
                                <span>Collaborative Trip</span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                                {trip.tripName}
                            </h1>
                            <p className="text-slate-400 mt-2 max-w-xl text-sm md:text-base">
                                {trip.itinerary?.overview}
                            </p>
                        </div>
                        
                        <div className="flex gap-3">
                            <button className="p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-colors">
                                <Share2 className="w-5 h-5" />
                            </button>
                            <button className="p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-colors">
                                <Download className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Squad Sync Bar */}
            <div className="relative z-30 -mt-8 mx-4 md:container-custom mb-8">
                <div className="rounded-xl overflow-hidden shadow-lg border border-white/20">
                    <SquadSyncBar booking={trip} />
                </div>
            </div>

            <div className="container-custom relative z-20">
                <div className="flex flex-col lg:grid lg:grid-cols-[1fr_400px] gap-8 pb-32 lg:pb-0">
                    {/* Main Itinerary Column */}
                    <div className="space-y-8 order-2 lg:order-1">
                        <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
                            <h3 className="text-xl md:text-2xl font-bold flex items-center gap-3 mb-8">
                                <Calendar className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                                Day by Day Plan
                            </h3>
                            <div className="relative">
                                {trip.itinerary?.dailyPlan.map((day, index) => (
                                    <TimelineCard key={day.day} day={day} index={index} />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Booking Column - Read Only for now effectively since updates are real-time */}
                    <div className="space-y-6 order-1 lg:order-2 lg:sticky lg:top-8 h-fit">
                        {/* Transport Display */}
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-[2rem] p-5 md:p-6 shadow-xl shadow-slate-200/50 border border-slate-100"
                        >
                            <div className="flex items-center justify-between mb-4 md:mb-6">
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    <Plane className="w-5 h-5 text-primary" />
                                    Transport
                                </h3>
                                {/* Edit functionality would go here */}
                            </div>
                            
                            {trip.transport ? (
                                <OptionCard 
                                    item={trip.transport} 
                                    badge={trip.transport.type || 'Transport'} 
                                    selected 
                                />
                            ) : (
                                <div className="p-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center text-sm text-muted-foreground">
                                    No transport selected
                                </div>
                            )}
                        </motion.div>

                        {/* Hotel Display */}
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-[2rem] p-5 md:p-6 shadow-xl shadow-slate-200/50 border border-slate-100"
                        >
                            <div className="flex items-center justify-between mb-4 md:mb-6">
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    <HotelIcon className="w-5 h-5 text-primary" />
                                    Stay
                                </h3>
                            </div>

                            {trip.hotel ? (
                                <OptionCard 
                                    item={trip.hotel} 
                                    badge="hotel" 
                                    selected 
                                />
                            ) : (
                                <div className="p-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center text-sm text-muted-foreground">
                                    No hotel selected
                                </div>
                            )}
                        </motion.div>

                        {/* Summary */}
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="hidden lg:block bg-slate-900 text-white rounded-[2rem] p-8 shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -mr-10 -mt-10" />
                            
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 relative z-10">
                                <CreditCard className="w-5 h-5 text-blue-400" />
                                Group Summary
                            </h3>
                            
                            <div className="space-y-4 mb-4 relative z-10">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-400">Transport ({trip.travelers} pax)</span>
                                    <span className="font-semibold">{formatCurrency((trip.transport?.price || 0) * (trip.travelers || 1))}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-400">Hotel ({tripDays - 1} nights)</span>
                                    <span className="font-semibold">{formatCurrency((trip.hotel?.price || 0) * (tripDays - 1))}</span>
                                </div>
                                <div className="h-px bg-white/10 my-4" />
                                <div className="flex justify-between items-center text-2xl font-bold">
                                    <span>Total</span>
                                    <span>{formatCurrency(trip.totalPrice || 0)}</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
