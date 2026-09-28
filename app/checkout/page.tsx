'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    CreditCard, 
    Calendar, 
    Users, 
    Check, 
    ArrowRight, 
    ShieldCheck, 
    Lock,
    Plane,
    Hotel,
    AlertCircle,
    Zap
} from 'lucide-react';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import { useAuth } from '@/context/AuthContext';
import { saveBooking, addUserPoints } from '@/lib/userService';
import { differenceInCalendarDays, parseISO } from 'date-fns';
import { pointsToRupees } from '@/lib/points';
import BoardingPass from '@/components/BoardingPass';

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(value);

export default function CheckoutPage() {
    const router = useRouter();
    const { user, signInWithGoogle } = useAuth();
    const { generatedTrip, tripSearchParams, selectedTripOptions, singleBookingItem } = useStore();
    
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [bookingId, setBookingId] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    
    // Form state
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');
    const [name, setName] = useState('');

    const isSingleBooking = !!singleBookingItem;

    useEffect(() => {
        if (!isSingleBooking && (!generatedTrip || !tripSearchParams || !selectedTripOptions)) {
            router.push('/ai-trip');
        }
    }, [generatedTrip, tripSearchParams, selectedTripOptions, singleBookingItem, isSingleBooking, router]);

    const tripDays = useMemo(() => {
        if (isSingleBooking) return 1; // Default to 1 for single items unless date logic is added later
        if (!tripSearchParams?.startDate || !tripSearchParams?.endDate) return 1;
        try {
            const diff = differenceInCalendarDays(parseISO(tripSearchParams.endDate), parseISO(tripSearchParams.startDate)) + 1;
            return diff > 0 ? diff : 1;
        } catch {
            return 1;
        }
    }, [tripSearchParams, isSingleBooking]);

    const totalPrice = useMemo(() => {
        if (isSingleBooking && singleBookingItem) {
            return singleBookingItem.price; // Assuming price is per person/unit for now
        }

        let total = 0;
        if (selectedTripOptions?.transport && tripSearchParams) {
            total += selectedTripOptions.transport.price * tripSearchParams.travelers;
        }
        if (selectedTripOptions?.hotel) {
            total += selectedTripOptions.hotel.price * (tripDays - 1);
        }
        return total;
    }, [selectedTripOptions, tripSearchParams, tripDays, isSingleBooking, singleBookingItem]);

    const multiplier = user?.pro ? 3 : 1;
    const pointsToEarn = Math.floor(totalPrice * 0.015 * multiplier);

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!user) {
            signInWithGoogle();
            return;
        }

        if (!cardNumber || !expiry || !cvc || !name) {
            setError("Please fill in all payment details.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Generate a unique booking ID
            const generatedBookingId = `TB${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

            let bookingData;

            if (isSingleBooking && singleBookingItem) {
                bookingData = {
                    bookingId: generatedBookingId,
                    tripName: singleBookingItem.title,
                    origin: singleBookingItem.from || 'N/A',
                    destination: singleBookingItem.to || singleBookingItem.title,
                    startDate: new Date().toISOString(), // Current date for single booking
                    endDate: new Date().toISOString(),
                    travelers: 1, // Default to 1
                    totalPrice,
                    pointsEarned: pointsToEarn,
                    items: [singleBookingItem],
                    type: 'single_item'
                };
            } else {
                bookingData = {
                    bookingId: generatedBookingId,
                    tripName: `Trip to ${tripSearchParams?.destination}`,
                    origin: tripSearchParams?.origin,
                    destination: tripSearchParams?.destination,
                    startDate: tripSearchParams?.startDate,
                    endDate: tripSearchParams?.endDate,
                    travelers: tripSearchParams?.travelers,
                    totalPrice,
                    pointsEarned: pointsToEarn,
                    transport: selectedTripOptions?.transport,
                    hotel: selectedTripOptions?.hotel,
                    itinerary: generatedTrip?.itinerary,
                    type: 'ai_trip'
                };
            }

            await saveBooking(user.uid, bookingData);
            await addUserPoints(user.uid, pointsToEarn);
            // Update local store points to reflect the new total
            const { addPoints } = useStore.getState(); // Fixed require usage
            addPoints(pointsToEarn);
            setBookingId(generatedBookingId);
            setSuccess(true);
            
        } catch (err: unknown) {
            console.error('Payment/Booking error:', err);
            const error = err as { code?: string; message?: string };
            if (error?.code === 'permission-denied') {
                setError("Insufficient permissions. Please check your Firestore security rules.");
            } else {
                setError(error?.message || "Payment failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    if (!isSingleBooking && (!generatedTrip || !tripSearchParams || !selectedTripOptions)) return null;
    if (isSingleBooking && !singleBookingItem) return null;

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="container-custom max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold text-slate-900">Checkout</h1>
                    <p className="text-slate-500">Complete your booking securely</p>
                </motion.div>

                <div className="grid lg:grid-cols-[1fr_400px] gap-8">
                    {/* Payment Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-6"
                    >
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                                    <CreditCard className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">Payment Details</h2>
                                    <p className="text-sm text-slate-500">Enter your card information</p>
                                </div>
                            </div>

                            <form onSubmit={handlePayment} className="space-y-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Cardholder Name</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="John Doe"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Card Number</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={cardNumber}
                                                onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim().slice(0, 19))}
                                                placeholder="0000 0000 0000 0000"
                                                className="w-full px-4 py-3 pl-12 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all font-mono"
                                            />
                                            <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Expiry Date</label>
                                            <input
                                                type="text"
                                                value={expiry}
                                                onChange={(e) => setExpiry(e.target.value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').slice(0, 5))}
                                                placeholder="MM/YY"
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-center"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">CVC</label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={cvc}
                                                    onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
                                                    placeholder="123"
                                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-center"
                                                />
                                                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {error && (
                                    <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4 shrink-0" />
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>Processing...</>
                                    ) : (
                                        <>
                                            Pay {formatCurrency(totalPrice)}
                                            <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                                
                                <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                                    <ShieldCheck className="w-3 h-3" />
                                    Payments are secure and encrypted
                                </div>
                            </form>
                        </div>
                    </motion.div>

                    {/* Order Summary */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-6"
                    >
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 sticky top-6">
                            <h3 className="text-lg font-bold text-slate-900 mb-6">Order Summary</h3>
                            
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img 
                                            src={isSingleBooking ? singleBookingItem?.image : "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=200"} 
                                            alt="Destination" 
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">
                                            {isSingleBooking ? singleBookingItem?.title : `Trip to ${tripSearchParams?.destination}`}
                                        </h4>
                                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                            {isSingleBooking ? (
                                                <span>Single Item Booking</span>
                                            ) : (
                                                <>
                                                    <Calendar className="w-3 h-3" />
                                                    {tripDays} Days
                                                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                                                    <Users className="w-3 h-3" />
                                                    {tripSearchParams?.travelers} Travelers
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 pt-6 border-t border-slate-100">
                                    {isSingleBooking ? (
                                        <div className="flex justify-between text-sm">
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <Check className="w-4 h-4" />
                                                <span>Item Price</span>
                                            </div>
                                            <span className="font-medium">{formatCurrency(singleBookingItem?.price || 0)}</span>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex justify-between text-sm">
                                                <div className="flex items-center gap-2 text-slate-600">
                                                    <Plane className="w-4 h-4" />
                                                    <span>Transport</span>
                                                </div>
                                                <span className="font-medium">{formatCurrency((selectedTripOptions?.transport?.price || 0) * (tripSearchParams?.travelers || 1))}</span>
                                            </div>
                                            <div className="text-xs text-slate-400 pl-6">
                                                {selectedTripOptions?.transport?.title} x {tripSearchParams?.travelers}
                                            </div>

                                            <div className="flex justify-between text-sm">
                                                <div className="flex items-center gap-2 text-slate-600">
                                                    <Hotel className="w-4 h-4" />
                                                    <span>Hotel</span>
                                                </div>
                                                <span className="font-medium">{formatCurrency((selectedTripOptions?.hotel?.price || 0) * (tripDays - 1))}</span>
                                            </div>
                                            <div className="text-xs text-slate-400 pl-6">
                                                {selectedTripOptions?.hotel?.title} x {tripDays - 1} nights
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="pt-6 border-t border-slate-100">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-slate-500">Total Amount</span>
                                        <span className="text-2xl font-bold text-slate-900">{formatCurrency(totalPrice)}</span>
                                    </div>
                                    <div className="flex items-center justify-end gap-2 text-xs text-emerald-600 font-medium text-right">
                                        <span>You will earn {pointsToEarn} points <span className="text-emerald-700">(₹{pointsToRupees(pointsToEarn)})</span></span>
                                        {multiplier === 3 ? (
                                            <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">3X PRO</span>
                                        ) : (
                                            <Link href="/subscription" className="flex items-center gap-1 text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full hover:bg-blue-100 transition-colors">
                                                <Zap className="w-3 h-3" />
                                                Get 3x with Pro
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Boarding Pass Success Modal */}
            <AnimatePresence>
                {success && (
                    <BoardingPass
                        bookingId={bookingId}
                        tripName={isSingleBooking ? singleBookingItem?.title || 'Booking' : `Trip to ${tripSearchParams?.destination}`}
                        origin={isSingleBooking ? (singleBookingItem?.from || 'Your Location') : (tripSearchParams?.origin || '')}
                        destination={isSingleBooking ? (singleBookingItem?.to || singleBookingItem?.title || '') : (tripSearchParams?.destination || '')}
                        startDate={isSingleBooking ? new Date().toISOString() : (tripSearchParams?.startDate || '')}
                        endDate={isSingleBooking ? new Date().toISOString() : (tripSearchParams?.endDate || '')}
                        travelers={isSingleBooking ? 1 : (tripSearchParams?.travelers || 1)}
                        totalPrice={totalPrice}
                        pointsEarned={pointsToEarn}
                        transport={isSingleBooking ? (singleBookingItem ?? undefined) : (selectedTripOptions?.transport ?? undefined)}
                        hotel={isSingleBooking ? undefined : (selectedTripOptions?.hotel ?? undefined)}
                        passengerName={name || user?.displayName || 'Guest'}
                        onClose={() => setSuccess(false)}
                        onViewProfile={() => router.push('/profile')}
                        onGoHome={() => router.push('/')}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
