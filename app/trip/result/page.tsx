'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ArrowRight,
    Calendar,
    Check,
    CreditCard,
    Hotel as HotelIcon,
    Plane,
    Sparkles,
    Utensils,
    Share2,
    Download,
    X,
    Edit2,
    Save,
    Bookmark
} from 'lucide-react';
import Link from 'next/link';
import { differenceInCalendarDays, parseISO } from 'date-fns';
import { pointsToRupees } from '@/lib/points';

import { useStore, SavedTrip } from '@/store/useStore';
import { useAuth } from '@/context/AuthContext';
import { addUserPoints, saveBooking } from '@/lib/userService';
import { TravelItem, TripPlannerResponse } from '@/types';
import BoardingPass from '@/components/BoardingPass';
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
    day: TripPlannerResponse['itinerary']['dailyPlan'][number];
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
                        {day.activities?.map((activity, idx) => (
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
                            {day.dining.map((spot, idx) => (
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



export default function TripResultPage() {
    const router = useRouter();
    const { user, signInWithGoogle } = useAuth();
    const { generatedTrip, tripSearchParams, saveTrip } = useStore();
    const [isSaved, setIsSaved] = useState(false);
    
    const [selectedTransport, setSelectedTransport] = useState<TravelItem | null>(null);
    const [selectedHotel, setSelectedHotel] = useState<TravelItem | null>(null);
    const [isTransportModalOpen, setIsTransportModalOpen] = useState(false);
    const [isHotelModalOpen, setIsHotelModalOpen] = useState(false);
    
    // Itinerary Editing
    const [isEditing, setIsEditing] = useState(false);
    const [editedDailyPlan, setEditedDailyPlan] = useState<TripPlannerResponse['itinerary']['dailyPlan']>([]);

    useEffect(() => {
        if (generatedTrip) {
            setEditedDailyPlan(generatedTrip.itinerary.dailyPlan);
        }
    }, [generatedTrip]);

    const handleSaveTripToLibrary = () => {
        if (!generatedTrip || !tripSearchParams) return;
        const newSaved: SavedTrip = {
            id: `trip_${Date.now()}`,
            title: `Trip to ${tripSearchParams.destination}`,
            destination: tripSearchParams.destination,
            origin: tripSearchParams.origin,
            startDate: tripSearchParams.startDate,
            endDate: tripSearchParams.endDate,
            travelers: tripSearchParams.travelers,
            budget: tripSearchParams.budget,
            totalPrice: totalPrice,
            coverImage: selectedHotel?.image || generatedTrip.hotelOptions[0]?.image || 'https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&q=80&w=800',
            status: 'upcoming',
            isFavorite: false,
            createdAt: new Date().toISOString(),
            itinerary: {
                ...generatedTrip.itinerary,
                dailyPlan: editedDailyPlan.length > 0 ? editedDailyPlan : generatedTrip.itinerary.dailyPlan
            },
            transport: selectedTransport,
            hotel: selectedHotel
        };
        saveTrip(newSaved);
        setIsSaved(true);
    };

    const handleSaveItinerary = () => {
        if (!generatedTrip) return;
        useStore.setState({
            generatedTrip: {
                ...generatedTrip,
                itinerary: {
                    ...generatedTrip.itinerary,
                    dailyPlan: editedDailyPlan
                }
            }
        });
        setIsEditing(false);
    };

    const handleCancelEdit = () => {
        if (generatedTrip) {
            setEditedDailyPlan(generatedTrip.itinerary.dailyPlan);
        }
        setIsEditing(false);
    };

    // AI Day Replanning
    const [replanState, setReplanState] = useState<{
        dayIndex: number | null;
        isOpen: boolean;
        prompt: string;
        loading: boolean;
    }>({
        dayIndex: null,
        isOpen: false,
        prompt: '',
        loading: false
    });

    const openReplan = (index: number) => {
        setReplanState({
            dayIndex: index,
            isOpen: true,
            prompt: '',
            loading: false
        });
    };

    const submitAiReplan = async () => {
        if (replanState.dayIndex === null || !replanState.prompt.trim()) return;
        
        setReplanState(prev => ({ ...prev, loading: true }));
        try {
            const currentDay = editedDailyPlan[replanState.dayIndex];
            const response = await fetch('/api/ai-trip/regenerate-day', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tripContext: {
                        destination: tripSearchParams?.destination,
                        travelers: tripSearchParams?.travelers,
                        overview: generatedTrip?.itinerary.overview
                    },
                    day: currentDay,
                    userPrompt: replanState.prompt
                })
            });

            const data = await response.json();
            if (data.newDayPlan) {
                const newPlan = [...editedDailyPlan];
                newPlan[replanState.dayIndex] = data.newDayPlan;
                setEditedDailyPlan(newPlan);
                setReplanState(prev => ({ ...prev, isOpen: false }));
            }
        } catch (error) {
            console.error(error);
            // Optionally set an error state here
        } finally {
            setReplanState(prev => ({ ...prev, loading: false }));
        }
    };
    const [bookingLoading, setBookingLoading] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [bookingId, setBookingId] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    // removed redundant state; compute over budget dynamically

    useEffect(() => {
        if (!generatedTrip) {
            router.push('/ai-trip');
            return;
        }

        // Auto-select best options
        const bestTransport = 
            generatedTrip.transportOptions.flights[0] || 
            generatedTrip.transportOptions.trains[0] || 
            generatedTrip.transportOptions.buses[0];
        
        const bestHotel = generatedTrip.hotelOptions[0];

        setSelectedTransport(bestTransport || null);
        setSelectedHotel(bestHotel || null);
        // Check budget summary from server and set overBudget flag
        // We compute budget overrun dynamically using isOverBudget below
    }, [generatedTrip, router]);

    const tripDays = useMemo(() => {
        if (!tripSearchParams?.startDate || !tripSearchParams?.endDate) return 1;
        try {
            const diff = differenceInCalendarDays(parseISO(tripSearchParams.endDate), parseISO(tripSearchParams.startDate)) + 1;
            return diff > 0 ? diff : 1;
        } catch {
            return 1;
        }
    }, [tripSearchParams]);

    const totalPrice = useMemo(() => {
        let total = 0;
        if (selectedTransport && tripSearchParams) total += selectedTransport.price * tripSearchParams.travelers;
        if (selectedHotel) total += selectedHotel.price * (tripDays - 1);
        return total;
    }, [selectedTransport, selectedHotel, tripSearchParams, tripDays]);

    const multiplier = user?.pro ? 3 : 1;
    const pointsToEarn = Math.floor((totalPrice / 100) * multiplier);

    const handleBookTrip = async () => {
        if (!user) {
            signInWithGoogle();
            return;
        }

        if (!selectedTransport || !selectedHotel || !tripSearchParams) {
            setError("Please select both transport and hotel to book.");
            return;
        }

        // Validate final total against declared budget
        if (tripSearchParams && totalPrice > tripSearchParams.budget) {
            setError("Selected options exceed your budget. Please choose cheaper options or adjust your budget.");
            return;
        }
        setBookingLoading(true);
        try {
            // Generate a unique booking ID
            const generatedBookingId = `SH${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
            
            const bookingData = {
                bookingId: generatedBookingId,
                tripName: `Trip to ${tripSearchParams.destination}`,
                origin: tripSearchParams.origin,
                destination: tripSearchParams.destination,
                startDate: tripSearchParams.startDate,
                endDate: tripSearchParams.endDate,
                travelers: tripSearchParams.travelers,
                totalPrice,
                pointsEarned: pointsToEarn,
                transport: selectedTransport,
                hotel: selectedHotel,
                itinerary: generatedTrip?.itinerary
            };

            await saveBooking(user.uid, bookingData);
            await addUserPoints(user.uid, pointsToEarn);
            setBookingId(generatedBookingId);
            setBookingSuccess(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            console.error(err);
            setError("Failed to book trip. Please try again.");
        } finally {
            setBookingLoading(false);
        }
    };

    if (!generatedTrip || !tripSearchParams) return null;

    const isOverBudget = Boolean(tripSearchParams && totalPrice > tripSearchParams.budget) || generatedTrip?.budgetSummary?.overBudget;

    const applyCheaperOptions = () => {
        const suggestedTransportId = generatedTrip?.budgetSummary?.suggestedTransportId;
        const suggestedHotelId = generatedTrip?.budgetSummary?.suggestedHotelId;
        if (suggestedTransportId) {
            const t = [
                ...generatedTrip.transportOptions.flights,
                ...generatedTrip.transportOptions.trains,
                ...generatedTrip.transportOptions.buses
            ].find((i) => i.id === suggestedTransportId);
            if (t) setSelectedTransport(t);
        }
        if (suggestedHotelId) {
            const h = generatedTrip.hotelOptions.find((i) => i.id === suggestedHotelId);
            if (h) setSelectedHotel(h);
        }
        // When applied, reset error and budget flag
        setError(null);
        // reset error handled below
    };

    return (
        <div className="min-h-screen bg-slate-50/70 pb-20">
            {/* Header / Hero */}
            <div className="bg-gradient-to-b from-sky-50/70 via-blue-50/40 to-slate-50 border-b border-slate-200/80 pb-28 pt-10 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-10 mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-transparent to-slate-50/90" />
                
                <div className="container-custom relative z-10">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                    >
                        <div>
                            <div className="inline-flex items-center gap-2 bg-blue-100/70 text-blue-700 px-3.5 py-1.5 rounded-full text-xs font-semibold border border-blue-200/60 mb-3 shadow-xs">
                                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                                <span>Your AI Itinerary is Ready</span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-bold leading-tight text-slate-900">
                                Trip to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600">{tripSearchParams.destination}</span>
                            </h1>
                            <p className="text-slate-600 mt-2 max-w-xl text-sm md:text-base leading-relaxed">
                                {generatedTrip.itinerary.overview}
                            </p>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-2.5">
                            <button
                                onClick={handleSaveTripToLibrary}
                                className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xs transition-all ${
                                    isSaved
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                        : 'bg-primary hover:bg-primary-dark text-white'
                                }`}
                            >
                                <Bookmark className="w-4 h-4" />
                                <span>{isSaved ? 'Saved to My Trips' : 'Save Trip'}</span>
                            </button>
                            <button className="p-2.5 rounded-xl bg-white text-slate-700 hover:text-primary hover:bg-blue-50/80 border border-slate-200 shadow-xs transition-all" title="Share itinerary">
                                <Share2 className="w-4 h-4" />
                            </button>
                            <button className="p-2.5 rounded-xl bg-white text-slate-700 hover:text-primary hover:bg-blue-50/80 border border-slate-200 shadow-xs transition-all" title="Download itinerary">
                                <Download className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>

                </div>
            </div>

            {/* Squad Sync Bar - Inserted below header */}
            {tripSearchParams && (
                <div className="relative z-30 -mt-8 mx-4 md:container-custom mb-8">
                    <div className="rounded-xl overflow-hidden shadow-lg border border-white/20">
                         <SquadSyncBar 
                            booking={{
                                id: '', // Not saved yet in user bookings, but needed for type
                                bookingId: '',
                                tripName: `Trip to ${tripSearchParams.destination}`,
                                origin: tripSearchParams.origin,
                                destination: tripSearchParams.destination,
                                startDate: tripSearchParams.startDate,
                                endDate: tripSearchParams.endDate,
                                travelers: tripSearchParams.travelers,
                                totalPrice: totalPrice,
                                pointsEarned: pointsToEarn,
                                transport: selectedTransport || undefined,
                                hotel: selectedHotel || undefined,
                                itinerary: generatedTrip.itinerary,
                                isShared: false, // Default for new result
                                collaborators: user ? [user.uid] : []
                            }} 
                        />
                    </div>
                </div>
            )}

            <div className="container-custom relative z-20">
                {/* Budget Alert */}
                {isOverBudget && (
                    <div className="mb-6 p-4 rounded-2xl bg-red-50 text-red-700 border border-red-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div>
                            <p className="text-sm font-bold">This trip exceeds your budget.</p>
                            <p className="text-xs">Your budget: <span className="font-semibold">{formatCurrency(tripSearchParams?.budget ?? 0)}</span>. Estimated cheapest total: <span className="font-semibold">{formatCurrency(generatedTrip?.budgetSummary?.estimatedTotal ?? totalPrice)}</span>.</p>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <button onClick={applyCheaperOptions} className="flex-1 md:flex-none px-3 py-2 rounded-lg bg-white text-red-700 font-bold border border-red-100 text-xs whitespace-nowrap">Cheaper options</button>
                            <button onClick={() => router.push('/ai-trip')} className="flex-1 md:flex-none px-3 py-2 rounded-lg bg-red-100 text-red-700 font-semibold text-xs whitespace-nowrap">Re-plan</button>
                        </div>
                    </div>
                )}
                
                <div className="flex flex-col lg:grid lg:grid-cols-[1fr_400px] gap-8 pb-32 lg:pb-0">
                    {/* Main Itinerary Column */}
                    <div className="space-y-8 order-2 lg:order-1">
                        <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl md:text-2xl font-bold flex items-center gap-3">
                                    <Calendar className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                                    Day by Day Plan
                                </h3>
                                <div>
                                    {isEditing ? (
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={handleCancelEdit}
                                                className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
                                                title="Cancel"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                            <button 
                                                onClick={handleSaveItinerary}
                                                className="flex items-center gap-2 px-3 py-2 bg-primary text-white rounded-lg font-bold text-sm shadow-md hover:bg-primary/90 transition-colors"
                                            >
                                                <Save className="w-4 h-4" />
                                                Save
                                            </button>
                                        </div>
                                    ) : (
                                        <button 
                                            onClick={() => setIsEditing(true)}
                                            className="flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg font-bold text-sm hover:bg-slate-200 transition-colors"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                            Edit
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="relative">
                                {(isEditing ? editedDailyPlan : generatedTrip.itinerary.dailyPlan).map((day, index) => (
                                    <div key={index} className="mb-8 relative pl-8 border-l-2 border-primary/20 last:border-0 last:mb-0 last:pb-0 pb-8">
                                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary border-4 border-white shadow-sm" />
                                        
                                        {isEditing ? (
                                            <div className="space-y-4">
                                                <div>
                                                    <span className="text-xs font-bold uppercase tracking-wider text-primary mb-1 block">{day.day}</span>
                                                    <input 
                                                        value={day.title}
                                                        onChange={(e) => {
                                                            const newPlan = [...editedDailyPlan];
                                                            newPlan[index] = { ...newPlan[index], title: e.target.value };
                                                            setEditedDailyPlan(newPlan);
                                                        }}
                                                        className="w-full text-lg font-bold text-slate-800 border-b border-slate-200 focus:border-primary outline-none py-1 bg-transparent"
                                                        placeholder="Day Title"
                                                    />
                                                </div>
                                                <textarea 
                                                    value={day.summary}
                                                    onChange={(e) => {
                                                        const newPlan = [...editedDailyPlan];
                                                        newPlan[index] = { ...newPlan[index], summary: e.target.value };
                                                        setEditedDailyPlan(newPlan);
                                                    }}
                                                    className="w-full text-sm text-slate-600 border rounded-lg p-3 focus:border-primary outline-none min-h-[80px]"
                                                    placeholder="Day Summary"
                                                />
                                                <div className="space-y-2">
                                                    <p className="text-xs font-bold text-slate-400 uppercase">Activities</p>
                                                    {day.activities.map((act: string, actIndex: number) => (
                                                        <input 
                                                            key={actIndex}
                                                            value={act}
                                                            onChange={(e) => {
                                                                const newPlan = [...editedDailyPlan];
                                                                const newActivities = [...newPlan[index].activities];
                                                                newActivities[actIndex] = e.target.value;
                                                                newPlan[index] = { ...newPlan[index], activities: newActivities };
                                                                setEditedDailyPlan(newPlan);
                                                            }}
                                                            className="w-full text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded px-3 py-2 focus:border-primary outline-none"
                                                        />
                                                    ))}
                                                </div>

                                                {/* Replan with AI Button */}
                                                <div className="pt-2">
                                                    {!replanState.isOpen || replanState.dayIndex !== index ? (
                                                        <button
                                                            onClick={() => openReplan(index)}
                                                            className="flex items-center gap-2 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors border border-indigo-100"
                                                        >
                                                            <Sparkles className="w-3.5 h-3.5" />
                                                            Ask Gemini
                                                        </button>
                                                    ) : (
                                                        <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-3 space-y-3 animate-in fade-in slide-in-from-top-2">
                                                            <div className="flex items-center gap-2 text-indigo-700 text-xs font-bold">
                                                                <Sparkles className="w-3.5 h-3.5" />
                                                                How should Gemini change this day?
                                                            </div>
                                                            <textarea
                                                                value={replanState.prompt}
                                                                onChange={(e) => setReplanState(prev => ({ ...prev, prompt: e.target.value }))}
                                                                placeholder="e.g. Make it more relaxing, add a famous museum, or find a vegan lunch..."
                                                                className="w-full text-sm p-3 rounded-lg border border-indigo-100 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none bg-white"
                                                                rows={2}
                                                                autoFocus
                                                            />
                                                            <div className="flex items-center justify-end gap-2">
                                                                <button
                                                                    onClick={() => setReplanState(prev => ({ ...prev, isOpen: false }))}
                                                                    className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-700"
                                                                >
                                                                    Cancel
                                                                </button>
                                                                <button
                                                                    onClick={submitAiReplan}
                                                                    disabled={replanState.loading || !replanState.prompt.trim()}
                                                                    className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm shadow-purple-200"
                                                                >
                                                                    {replanState.loading ? (
                                                                        <>
                                                                            <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                                            Thinking...
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <Sparkles className="w-3.5 h-3.5" />
                                                                            Generate Plan
                                                                        </>
                                                                    )}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <TimelineCard day={day} index={index} />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Booking Column */}
                    <div className="space-y-6 order-1 lg:order-2 lg:sticky lg:top-8 h-fit">
                        {/* Transport Selection */}
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
                                <button 
                                    onClick={() => setIsTransportModalOpen(!isTransportModalOpen)}
                                    className="text-xs md:text-sm font-bold text-primary hover:bg-primary/5 px-3 py-1 rounded-full transition-colors"
                                >
                                    {isTransportModalOpen ? 'Done' : 'Change'}
                                </button>
                            </div>
                            
                            <AnimatePresence>
                                {isTransportModalOpen ? (
                                    <motion.div 
                                        key="transport-list"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-6 overflow-hidden"
                                    >
                                        {(['flights', 'trains', 'buses'] as const).map((mode) => (
                                            <div key={mode}>
                                                <p className="text-xs font-bold uppercase text-muted-foreground mb-3 pl-1">
                                                    {mode}
                                                </p>
                                                <div className="space-y-3">
                                                    {generatedTrip?.transportOptions?.[mode] && generatedTrip.transportOptions[mode].length > 0 ? (
                                                        generatedTrip.transportOptions[mode].map((option) => (
                                                            <OptionCard
                                                                key={option.id}
                                                                item={option}
                                                                badge={mode.slice(0, -1)}
                                                                selected={selectedTransport?.id === option.id}
                                                                onSelect={() => {
                                                                    setSelectedTransport(option);
                                                                    setIsTransportModalOpen(false);
                                                                }}
                                                            />
                                                        ))
                                                    ) : (
                                                        <p className="text-sm text-muted-foreground italic pl-1">
                                                            No {mode} available
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </motion.div>
                                ) : (
                                    selectedTransport ? (
                                        <motion.div key="transport-selected" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                            <OptionCard 
                                                item={selectedTransport} 
                                                badge={selectedTransport.type} 
                                                selected 
                                            />
                                        </motion.div>
                                    ) : (
                                        <motion.div key="transport-empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                            <div className="p-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center text-sm text-muted-foreground">
                                                No transport selected
                                            </div>
                                        </motion.div>
                                    )
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* Hotel Selection */}
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-[2rem] p-5 md:p-6 shadow-xl shadow-slate-200/50 border border-slate-100"
                        >
                            <div className="flex items-center justify-between mb-4 md:mb-6">
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    <HotelIcon className="w-5 h-5 text-primary" />
                                    Stay
                                </h3>
                                <button 
                                    onClick={() => setIsHotelModalOpen(!isHotelModalOpen)}
                                    className="text-xs md:text-sm font-bold text-primary hover:bg-primary/5 px-3 py-1 rounded-full transition-colors"
                                >
                                    {isHotelModalOpen ? 'Done' : 'Change'}
                                </button>
                            </div>

                            <AnimatePresence>
                                {isHotelModalOpen ? (
                                    <motion.div 
                                        key="hotel-list"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-3 overflow-hidden"
                                    >
                                        {generatedTrip?.hotelOptions && generatedTrip.hotelOptions.length > 0 ? (
                                            generatedTrip.hotelOptions.map((hotel) => (
                                                <OptionCard 
                                                    key={hotel.id} 
                                                    item={hotel} 
                                                    badge="hotel"
                                                    selected={selectedHotel?.id === hotel.id}
                                                    onSelect={() => {
                                                        setSelectedHotel(hotel);
                                                        setIsHotelModalOpen(false);
                                                    }}
                                                />
                                            ))
                                        ) : (
                                            <p className="text-sm text-muted-foreground italic pl-1">
                                                No hotels found
                                            </p>
                                        )}
                                    </motion.div>
                                ) : (
                                    selectedHotel ? (
                                        <motion.div key="hotel-selected" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                            <OptionCard 
                                                item={selectedHotel} 
                                                badge="hotel" 
                                                selected 
                                            />
                                        </motion.div>
                                    ) : (
                                        <motion.div key="hotel-empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                            <div className="p-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center text-sm text-muted-foreground">
                                                No hotel selected
                                            </div>
                                        </motion.div>
                                    )
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* Booking Summary (Desktop) */}
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="hidden lg:block bg-slate-900 text-white rounded-[2rem] p-8 shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -mr-10 -mt-10" />
                            
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 relative z-10">
                                <CreditCard className="w-5 h-5 text-blue-400" />
                                Booking Summary
                            </h3>
                            
                            <div className="space-y-4 mb-8 relative z-10">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-400">Transport ({tripSearchParams.travelers} pax)</span>
                                    <span className="font-semibold">{formatCurrency((selectedTransport?.price || 0) * tripSearchParams.travelers)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-400">Hotel ({tripDays - 1} nights)</span>
                                    <span className="font-semibold">{formatCurrency((selectedHotel?.price || 0) * (tripDays - 1))}</span>
                                </div>
                                <div className="h-px bg-white/10 my-4" />
                                <div className="flex justify-between items-center text-2xl font-bold">
                                    <span>Total</span>
                                    <span>{formatCurrency(totalPrice)}</span>
                                </div>
                            <div className="flex items-center gap-2 text-xs text-yellow-400 bg-yellow-400/10 p-3 rounded-xl justify-center border border-yellow-400/20">
                                <Sparkles className="w-3 h-3" />
                                <span>You&apos;ll earn {pointsToEarn} points <span className="text-yellow-500">(₹{pointsToRupees(pointsToEarn)})</span></span>
                                {multiplier === 3 ? (
                                    <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded ml-1">3X PRO</span>
                                ) : (
                                    <Link href="/subscription" className="ml-1 text-[10px] underline decoration-yellow-400/50 hover:text-yellow-300">
                                        Get 3x with Pro
                                    </Link>
                                )}
                            </div>
                        </div>

                            <button
                                onClick={handleBookTrip}
                                disabled={bookingLoading || !selectedTransport || !selectedHotel}
                                className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 relative z-10"
                            >
                                {bookingLoading ? (
                                    <>Processing...</>
                                ) : (
                                    <>
                                        {user ? 'Book Entire Trip' : 'Sign in to Book'}
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                            
                            {error && (
                                <p className="text-red-400 text-xs text-center mt-3">{error}</p>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
            
            {/* Mobile Fixed Booking Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 z-40 lg:hidden shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] pb-safe">
                <div className="container-custom">
                    {error && (
                        <p className="text-red-600 text-xs text-center mb-2 font-medium bg-red-50 p-1.5 rounded-lg border border-red-100">{error}</p>
                    )}
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex flex-col">
                            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Total Trip Cost</p>
                            <p className="text-xl font-bold text-slate-900">{formatCurrency(totalPrice)}</p>
                        </div>
                         <button
                            onClick={handleBookTrip}
                            disabled={bookingLoading || !selectedTransport || !selectedHotel}
                            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-2"
                        >
                            {bookingLoading ? (
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Book Now
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Boarding Pass Success Modal */}
            <AnimatePresence>
                {bookingSuccess && (
                    <BoardingPass
                        bookingId={bookingId}
                        tripName={`Trip to ${tripSearchParams.destination}`}
                        origin={tripSearchParams.origin}
                        destination={tripSearchParams.destination}
                        startDate={tripSearchParams.startDate}
                        endDate={tripSearchParams.endDate}
                        travelers={tripSearchParams.travelers}
                        totalPrice={totalPrice}
                        pointsEarned={pointsToEarn}
                        transport={selectedTransport || undefined}
                        hotel={selectedHotel || undefined}
                        passengerName={user?.displayName || 'Guest'}
                        onClose={() => setBookingSuccess(false)}
                        onViewProfile={() => router.push('/profile')}
                        onGoHome={() => router.push('/')}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
