'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Calendar,
    Compass,
    Globe,
    MapPin,
    Navigation,
    Sparkles,
    Users,
    Wallet,
    Coffee,
    Zap,
    Heart,
    Briefcase,
    Palmtree,
    Utensils,
    Moon,
    Landmark,
    Mountain,
    ShoppingBag,
    User
} from 'lucide-react';
import { differenceInCalendarDays, parseISO } from 'date-fns';

import type {
    TripPlannerForm,
    TripPlannerResponse
} from '@/types';
import TripLoader from './TripLoader';
import { useAuth } from '@/context/AuthContext';
import { useStore } from '@/store/useStore';

const interestOptions = [
    { label: 'Food & Cafes', icon: Utensils },
    { label: 'Beaches', icon: Palmtree },
    { label: 'Nightlife', icon: Moon },
    { label: 'Culture', icon: Landmark },
    { label: 'Adventure', icon: Mountain },
    { label: 'Wellness', icon: Heart },
    { label: 'Shopping', icon: ShoppingBag },
    { label: 'Nature Escapes', icon: Palmtree }
];

const groupOptions = [
    { id: 'solo', label: 'Solo', icon: User },
    { id: 'couple', label: 'Couple', icon: Heart },
    { id: 'friends', label: 'Friends', icon: Users },
    { id: 'family', label: 'Family', icon: Users },
    { id: 'business', label: 'Business', icon: Briefcase }
];

const styleOptions: Array<{
    id: TripPlannerForm['travelStyle'];
    label: string;
    helper: string;
    icon: React.ElementType;
}> = [
    {
        id: 'relaxed',
        label: 'Slow & Serene',
        helper: 'Long brunches, flexible days',
        icon: Coffee
    },
    {
        id: 'balanced',
        label: 'Balanced',
        helper: 'Mix of must-dos & breaks',
        icon: Compass
    },
    {
        id: 'adventure',
        label: 'Fast Track',
        helper: 'Back-to-back experiences',
        icon: Zap
    }
];

const defaultForm: TripPlannerForm = {
    origin: '',
    destination: '',
    startDate: '',
    endDate: '',
    budget: 50000,
    travelers: 2,
    travelGroup: 'friends',
    travelStyle: 'balanced',
    interests: ['Food & Cafes', 'Culture']
};

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(value);



export default function AiTripPlanner() {
    const router = useRouter();
    useAuth(); // Kept for potential future use or if we want to gate the form
    const { setGeneratedTrip, setTripSearchParams } = useStore();
    
    const [form, setForm] = useState<TripPlannerForm>(defaultForm);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const tripLengthLabel = useMemo(() => {
        if (!form.startDate || !form.endDate) return 'Pick dates';
        try {
            const diff =
                differenceInCalendarDays(
                    parseISO(form.endDate),
                    parseISO(form.startDate)
                ) + 1;
            if (!Number.isFinite(diff) || diff <= 0) return 'Pick dates';
            return `${diff} day${diff > 1 ? 's' : ''}`;
        } catch {
            return 'Pick dates';
        }
    }, [form.startDate, form.endDate]);

    const handleFieldChange = (
        key: keyof TripPlannerForm,
        value: string | number | string[]
    ) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const toggleInterest = (interest: string) => {
        setForm((prev) => {
            const exists = prev.interests.includes(interest);
            return {
                ...prev,
                interests: exists
                    ? prev.interests.filter((item) => item !== interest)
                    : [...prev.interests, interest]
            };
        });
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setError(null);

        try {
            const response = await fetch('/api/ai-trip', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });

            if (!response.ok) {
                const payload = await response.json();
                throw new Error(
                    payload?.error ??
                        'Unable to create a trip right now. Please try again.'
                );
            }

            const data = (await response.json()) as TripPlannerResponse;
            
            setGeneratedTrip(data);
            setTripSearchParams(form);
            router.push('/trip/result');
            
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Something went wrong. Please retry.'
            );
            setLoading(false);
        }
    };

    if (loading) {
        return <TripLoader />;
    }

    return (
        <div className="space-y-12 max-w-6xl mx-auto">
            {/* Hero Section */}
            <section className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 text-white p-10 lg:p-16 shadow-2xl">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-40" />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />
                
                <div className="relative z-10 max-w-2xl space-y-8">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium"
                    >
                        <Sparkles className="w-4 h-4 text-yellow-400" />
                        <span>AI-Powered Travel Architect</span>
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl lg:text-7xl font-bold leading-tight tracking-tight"
                    >
                        Design your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                            dream journey
                        </span>
                    </motion.h1>
                    
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-slate-300 leading-relaxed max-w-lg"
                    >
                        Tell us your preferences, and our AI will craft a personalized itinerary with real-time flights, hotels, and experiences.
                    </motion.p>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex items-center gap-4 pt-4"
                    >
                        <div className="flex -space-x-3">
                            {[
                                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64",
                                "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&h=64",
                                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&h=64",
                                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&h=64"
                            ].map((img, i) => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 overflow-hidden relative shadow-md z-10 hover:z-20 transition-transform hover:scale-110">
                                    <img src={img} alt={`Planner ${i + 1}`} className="w-full h-full object-cover" />
                                </div>
                            ))}
                            <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300 shadow-md relative z-0">
                                +5k
                            </div>
                        </div>
                        <p className="text-sm text-slate-400">
                            Join <span className="text-white font-semibold">5,000+</span> travelers planning trips today
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-[1fr_400px] gap-10 items-start">
                {/* Form Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-8"
                >
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Location & Dates Card */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 space-y-6">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-primary" />
                                Where & When
                            </h3>
                            
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground ml-1">From</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground" />
                                        <input
                                            type="text"
                                            placeholder="City, Country"
                                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-secondary/50 border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                                            value={form.origin}
                                            onChange={(e) => handleFieldChange('origin', e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground ml-1">To</label>
                                    <div className="relative">
                                        <Navigation className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground" />
                                        <input
                                            type="text"
                                            placeholder="Dream Destination"
                                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-secondary/50 border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                                            value={form.destination}
                                            onChange={(e) => handleFieldChange('destination', e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground ml-1">Start Date</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground" />
                                        <input
                                            type="date"
                                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-secondary/50 border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                                            value={form.startDate}
                                            onChange={(e) => handleFieldChange('startDate', e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground ml-1">End Date</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground" />
                                        <input
                                            type="date"
                                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-secondary/50 border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                                            value={form.endDate}
                                            onChange={(e) => handleFieldChange('endDate', e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Preferences Card */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 space-y-8">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <Compass className="w-5 h-5 text-primary" />
                                Travel Preferences
                            </h3>

                            <div className="space-y-4">
                                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Budget (₹)</label>
                                <div className="relative">
                                    <Wallet className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground" />
                                    <input
                                        type="number"
                                        min={5000}
                                        step={1000}
                                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-secondary/50 border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-bold text-lg"
                                        value={form.budget}
                                        onChange={(e) => handleFieldChange('budget', Number(e.target.value))}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Who&apos;s Traveling?</label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {groupOptions.map((option) => {
                                        const Icon = option.icon;
                                        return (
                                            <button
                                                key={option.id}
                                                type="button"
                                                onClick={() => handleFieldChange('travelGroup', option.id)}
                                                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                                                    form.travelGroup === option.id
                                                        ? 'border-primary bg-primary/5 text-primary'
                                                        : 'border-transparent bg-secondary/50 text-muted-foreground hover:bg-secondary'
                                                }`}
                                            >
                                                <Icon className="w-6 h-6" />
                                                <span className="text-sm font-semibold">{option.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Travel Style</label>
                                <div className="grid sm:grid-cols-3 gap-4">
                                    {styleOptions.map((option) => {
                                        const Icon = option.icon;
                                        return (
                                            <button
                                                key={option.id}
                                                type="button"
                                                onClick={() => handleFieldChange('travelStyle', option.id)}
                                                className={`text-left p-4 rounded-2xl border-2 transition-all ${
                                                    form.travelStyle === option.id
                                                        ? 'border-primary bg-primary/5'
                                                        : 'border-transparent bg-secondary/50 hover:bg-secondary'
                                                }`}
                                            >
                                                <Icon className={`w-6 h-6 mb-3 ${form.travelStyle === option.id ? 'text-primary' : 'text-muted-foreground'}`} />
                                                <div className="font-bold text-sm">{option.label}</div>
                                                <div className="text-xs text-muted-foreground mt-1">{option.helper}</div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Interests</label>
                                <div className="flex flex-wrap gap-3">
                                    {interestOptions.map((interest) => {
                                        const Icon = interest.icon;
                                        const isActive = form.interests.includes(interest.label);
                                        return (
                                            <button
                                                key={interest.label}
                                                type="button"
                                                onClick={() => toggleInterest(interest.label)}
                                                className={`flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all text-sm font-medium ${
                                                    isActive
                                                        ? 'border-primary bg-primary text-white shadow-lg shadow-primary/25'
                                                        : 'border-border bg-white text-muted-foreground hover:border-primary/50'
                                                }`}
                                            >
                                                <Icon className="w-4 h-4" />
                                                {interest.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="w-full py-5 rounded-2xl bg-gradient-to-r from-primary to-blue-600 text-white text-xl font-bold shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all flex items-center justify-center gap-3"
                        >
                            <Sparkles className="w-6 h-6" />
                            Generate Dream Trip
                        </motion.button>
                    </form>
                </motion.div>

                {/* Sidebar / Summary */}
                <div className="space-y-6 lg:sticky lg:top-8">
                    <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <Globe className="w-5 h-5 text-blue-400" />
                            Trip Summary
                        </h3>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                                    <Calendar className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 uppercase tracking-wider">Duration</p>
                                    <p className="text-lg font-bold">{tripLengthLabel}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                                    <Users className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 uppercase tracking-wider">Travelers</p>
                                    <p className="text-lg font-bold">{form.travelers} People</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                                    <Wallet className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 uppercase tracking-wider">Budget</p>
                                    <p className="text-lg font-bold">{formatCurrency(form.budget)}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-8 pt-8 border-t border-white/10">
                            <p className="text-sm text-slate-400 leading-relaxed">
                                &quot;Travel is the only thing you buy that makes you richer.&quot;
                            </p>
                        </div>
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="p-4 rounded-2xl bg-red-50 text-red-600 border border-red-100 text-sm font-medium"
                            >
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

