 'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Plane, 
    Train, 
    Bus, 
    Hotel, 
    Download,
    Share2,
    X,
    Users
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { pointsToRupees } from '@/lib/points';
import { TravelItem } from '@/types';

interface BoardingPassProps {
    bookingId: string;
    tripName: string;
    origin: string;
    destination: string;
    startDate: string;
    endDate: string;
    travelers: number;
    totalPrice: number;
    pointsEarned: number;
    transport?: TravelItem;
    hotel?: TravelItem;
    passengerName: string;
    onClose: () => void;
    onViewProfile: () => void;
    onGoHome: () => void;
}

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(value);

// Generate PNR-style booking code
const generatePNR = (id: string) => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let pnr = '';
    for (let i = 0; i < 6; i++) {
        pnr += chars[(id.charCodeAt(i % id.length) + i * 7) % chars.length];
    }
    return pnr;
};

// Get location code
const getLocationCode = (location: string) => {
    return location.slice(0, 3).toUpperCase();
};

// Generate gate
const generateGate = (id: string) => {
    const num = (id.charCodeAt(0) % 12) + 1;
    return num.toString().padStart(2, '0');
};

// Generate seat
const generateSeat = (id: string) => {
    const row = (id.charCodeAt(0) % 25) + 1;
    const seat = String.fromCharCode(65 + (id.charCodeAt(1) % 6));
    return `${row}${seat}`;
};

// Generate boarding time
const generateBoardingTime = (id: string) => {
    const hour = 6 + (id.charCodeAt(0) % 12);
    const min = (id.charCodeAt(1) % 4) * 15;
    return `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
};

const TransportIcon = ({ type, className }: { type?: string; className?: string }) => {
    switch (type) {
        case 'flight':
            return <Plane className={className} />;
        case 'train':
            return <Train className={className} />;
        case 'bus':
            return <Bus className={className} />;
        default:
            return <Plane className={className} />;
    }
};

export default function BoardingPass({
    bookingId,
    // tripName unused
    origin,
    destination,
    startDate,
    // endDate unused
    travelers,
    totalPrice,
    pointsEarned,
    transport,
    hotel,
    passengerName,
    onClose,
    onViewProfile,
    onGoHome
}: BoardingPassProps) {
    const pnr = generatePNR(bookingId);
    const originCode = getLocationCode(origin);
    const destCode = getLocationCode(destination);
    const gate = generateGate(bookingId);
    const seat = generateSeat(bookingId);
    const boardingTime = generateBoardingTime(bookingId);
    const passRef = useRef<HTMLDivElement | null>(null);
    const [isDownloading, setIsDownloading] = useState(false);

    const formatDate = (dateStr: string, formatStr: string) => {
        try {
            return format(parseISO(dateStr), formatStr);
        } catch {
            return dateStr;
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Trip to ${destination}`,
                    text: `I'm going to ${destination}! ✈️`,
                    url: window.location.origin
                });
            } catch {
                console.log('Share cancelled');
            }
        }
    };

    const handleDownload = async () => {
        if (!passRef.current) return;
        setIsDownloading(true);
        try {
            const mod = await import('html-to-image');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const toPng = (mod as any).toPng ?? (mod as any).default?.toPng ?? (mod as any).default;
            if (!toPng) throw new Error('html-to-image not available');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const dataUrl = await (mod as any).toPng(passRef.current, { backgroundColor: '#ffffff', cacheBust: true });
            const link = document.createElement('a');
            link.href = dataUrl;
            const safeDate = (() => {
                try { return format(parseISO(startDate), 'yyyyMMdd'); } catch { return 'date'; }
            })();
            const fileName = `${pnr}_${destination.replace(/\s+/g, '_')}_${safeDate}.png`;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (downloadErr) {
            console.error('Download error:', downloadErr);
            alert('Failed to save image. Please try again.');
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Boarding Pass */}
                <div ref={passRef} className="bg-white rounded-2xl overflow-hidden shadow-2xl">
                    
                    {/* Header */}
                    <div className="bg-blue-600 px-5 py-4 text-white">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                                    <span className="text-sm font-bold">SH</span>
                                </div>
                                <div>
                                    <p className="font-semibold text-sm">SkyHigh</p>
                                    <p className="text-[10px] text-blue-200">BOARDING PASS</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-blue-200">CONFIRMATION</p>
                                <p className="font-mono font-bold tracking-wider">{pnr}</p>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="p-5">
                        
                        {/* Passenger Name */}
                        <div className="mb-4">
                            <p className="text-[10px] text-slate-400 uppercase tracking-wider">Passenger</p>
                            <p className="text-lg font-bold text-slate-900 uppercase tracking-wide">{passengerName}</p>
                        </div>

                        {/* Route */}
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <p className="text-3xl font-bold text-slate-900">{originCode}</p>
                                <p className="text-xs text-slate-500">{origin}</p>
                            </div>
                            
                            <div className="flex-1 flex items-center justify-center px-4">
                                <div className="flex items-center gap-2 w-full">
                                    <div className="w-2 h-2 rounded-full border-2 border-slate-300" />
                                    <div className="flex-1 border-t-2 border-dashed border-slate-200 relative">
                                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-1">
                                            <TransportIcon type={transport?.type} className="w-5 h-5 text-blue-600" />
                                        </div>
                                    </div>
                                    <div className="w-2 h-2 rounded-full bg-slate-400" />
                                </div>
                            </div>
                            
                            <div className="text-right">
                                <p className="text-3xl font-bold text-slate-900">{destCode}</p>
                                <p className="text-xs text-slate-500">{destination}</p>
                            </div>
                        </div>

                        {/* Flight Details Grid */}
                        <div className="grid grid-cols-4 gap-3 mb-4">
                            <div className="bg-slate-50 rounded-lg p-2.5 text-center">
                                <p className="text-[9px] text-slate-400 uppercase">Date</p>
                                <p className="text-sm font-bold text-slate-900">{formatDate(startDate, 'dd MMM')}</p>
                            </div>
                            <div className="bg-slate-50 rounded-lg p-2.5 text-center">
                                <p className="text-[9px] text-slate-400 uppercase">Time</p>
                                <p className="text-sm font-bold text-slate-900">{boardingTime}</p>
                            </div>
                            <div className="bg-slate-50 rounded-lg p-2.5 text-center">
                                <p className="text-[9px] text-slate-400 uppercase">Gate</p>
                                <p className="text-sm font-bold text-slate-900">{gate}</p>
                            </div>
                            <div className="bg-slate-50 rounded-lg p-2.5 text-center">
                                <p className="text-[9px] text-slate-400 uppercase">Seat</p>
                                <p className="text-sm font-bold text-slate-900">{seat}</p>
                            </div>
                        </div>

                        {/* Transport Info */}
                        {transport && (
                            <div className="bg-blue-50 rounded-lg p-3 mb-3 border border-blue-100">
                                <div className="flex items-center gap-3">
                                    <TransportIcon type={transport.type} className="w-5 h-5 text-blue-600" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-slate-900 truncate">{transport.title}</p>
                                        <p className="text-xs text-slate-500">{transport.subtitle}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Hotel Info */}
                        {hotel && (
                            <div className="bg-purple-50 rounded-lg p-3 mb-3 border border-purple-100">
                                <div className="flex items-center gap-3">
                                    <Hotel className="w-5 h-5 text-purple-600" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-slate-900 truncate">{hotel.title}</p>
                                        <p className="text-xs text-slate-500">{hotel.subtitle}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Guests */}
                        <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
                            <Users className="w-4 h-4" />
                            <span>{travelers} {travelers === 1 ? 'Guest' : 'Guests'}</span>
                        </div>
                    </div>

                    {/* Tear Line */}
                    <div className="relative">
                        <div className="absolute left-0 top-1/2 w-4 h-8 bg-black/60 rounded-r-full -translate-y-1/2 -translate-x-2" />
                        <div className="absolute right-0 top-1/2 w-4 h-8 bg-black/60 rounded-l-full -translate-y-1/2 translate-x-2" />
                        <div className="border-t-2 border-dashed border-slate-200 mx-5" />
                    </div>

                    {/* Bottom Section */}
                    <div className="p-5 bg-slate-50">
                        <div className="flex items-center justify-between mb-4">
                            {/* Barcode-style visual */}
                            <div className="flex gap-[2px]">
                                {[...Array(30)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="bg-slate-800 rounded-sm"
                                        style={{
                                            width: Math.random() > 0.5 ? '2px' : '3px',
                                            height: '32px'
                                        }}
                                    />
                                ))}
                            </div>
                            
                            <div className="text-right">
                                <p className="text-[10px] text-slate-400 uppercase">Total</p>
                                <p className="text-xl font-bold text-slate-900">{formatCurrency(totalPrice)}</p>
                                {pointsEarned > 0 && (
                                    <p className="text-xs text-green-600 font-medium">+{pointsEarned} points <span className="text-xs text-green-500">(₹{pointsToRupees(pointsEarned)})</span></p>
                                )}
                            </div>
                        </div>

                        <p className="text-[10px] text-slate-400 text-center">
                            Please arrive at the departure point 30 minutes before scheduled time
                        </p>
                    </div>

                    {/* Green Status Bar */}
                    <div className="h-1.5 bg-green-500" />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-4">
                    <button
                        onClick={handleShare}
                        className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-all flex items-center justify-center gap-2 border border-white/20"
                    >
                        <Share2 className="w-4 h-4" />
                        Share
                    </button>
                    <button
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-all flex items-center justify-center gap-2 border border-white/20"
                    >
                        <Download className="w-4 h-4" />
                        {isDownloading ? 'Saving...' : 'Save'}
                    </button>
                </div>

                <div className="flex gap-3 mt-3">
                    <button
                        onClick={onViewProfile}
                        className="flex-1 py-3 rounded-xl bg-white text-slate-900 font-semibold transition-all hover:bg-slate-100"
                    >
                        My Trips
                    </button>
                    <button
                        onClick={onGoHome}
                        className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-semibold transition-all hover:bg-blue-700"
                    >
                        Book Another
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}
