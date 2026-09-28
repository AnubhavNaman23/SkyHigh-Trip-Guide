'use client';

import { motion } from 'framer-motion';
import { 
    Plane, 
    Train, 
    Bus,
    ChevronRight
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { pointsToRupees } from '@/lib/points';

interface TicketCardProps {
    bookingId?: string;
    tripName: string;
    origin: string;
    destination: string;
    startDate: string;
    endDate?: string;
    travelers?: number;
    totalPrice: number;
    pointsEarned?: number;
    transportType?: 'flight' | 'train' | 'bus' | 'hotel' | string;
    hotelName?: string;
    onClick?: () => void;
}

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(value);

// Generate PNR-style booking code
const generatePNR = (id?: string) => {
    if (!id) return 'TB4X2K';
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let pnr = '';
    for (let i = 0; i < 6; i++) {
        pnr += chars[(id.charCodeAt(i % id.length) + i * 7) % chars.length];
    }
    return pnr;
};

// Get origin code (first 3 letters uppercase)
const getLocationCode = (location: string) => {
    return location.slice(0, 3).toUpperCase();
};

const TransportIcon = ({ type }: { type?: string }) => {
    const iconClass = "w-5 h-5 text-slate-600";
    switch (type) {
        case 'flight':
            return <Plane className={iconClass} />;
        case 'train':
            return <Train className={iconClass} />;
        case 'bus':
            return <Bus className={iconClass} />;
        default:
            return <Plane className={iconClass} />;
    }
};

export default function TicketCard({
    bookingId,
    // tripName unused
    origin,
    destination,
    startDate,
    // endDate unused
    travelers = 1,
    totalPrice,
    pointsEarned = 0,
    transportType,
    // hotelName unused
    onClick
}: TicketCardProps) {
    const pnr = generatePNR(bookingId);
    const originCode = getLocationCode(origin);
    const destCode = getLocationCode(destination);

    const formatDateShort = (dateStr: string) => {
        try {
            return format(parseISO(dateStr), 'dd MMM');
        } catch {
            return dateStr.slice(0, 10);
        }
    };

    const formatDay = (dateStr: string) => {
        try {
            return format(parseISO(dateStr), 'EEE').toUpperCase();
        } catch {
            return '';
        }
    };

    return (
        <motion.div
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.995 }}
            onClick={onClick}
            className="group cursor-pointer"
        >
            {/* Ticket Container */}
            <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200 border border-slate-200">
                
                {/* Main Ticket Section */}
                <div className="p-4 pb-3">
                    {/* Header Row */}
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center">
                                <span className="text-white text-[10px] font-bold">SH</span>
                            </div>
                            <span className="text-slate-900 text-sm font-semibold">SkyHigh</span>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] text-slate-400 block">PNR</span>
                            <span className="text-sm font-mono font-bold text-slate-800 tracking-wide">{pnr}</span>
                        </div>
                    </div>

                    {/* Route Display */}
                    <div className="flex items-center justify-between mb-4">
                        {/* Origin */}
                        <div className="text-left">
                            <p className="text-2xl font-bold text-slate-900 tracking-tight">{originCode}</p>
                            <p className="text-xs text-slate-500 truncate max-w-[80px]">{origin}</p>
                        </div>

                        {/* Flight Path */}
                        <div className="flex-1 flex items-center justify-center px-3">
                            <div className="flex items-center gap-1 w-full max-w-[120px]">
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                <div className="flex-1 border-t border-dashed border-slate-300 relative">
                                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-1">
                                        <TransportIcon type={transportType} />
                                    </div>
                                </div>
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                            </div>
                        </div>

                        {/* Destination */}
                        <div className="text-right">
                            <p className="text-2xl font-bold text-slate-900 tracking-tight">{destCode}</p>
                            <p className="text-xs text-slate-500 truncate max-w-[80px]">{destination}</p>
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-4 gap-2 text-center bg-slate-50 rounded-lg p-2.5">
                        <div>
                            <p className="text-[9px] text-slate-400 uppercase tracking-wider">Date</p>
                            <p className="text-xs font-semibold text-slate-800">{formatDateShort(startDate)}</p>
                        </div>
                        <div>
                            <p className="text-[9px] text-slate-400 uppercase tracking-wider">Day</p>
                            <p className="text-xs font-semibold text-slate-800">{formatDay(startDate)}</p>
                        </div>
                        <div>
                            <p className="text-[9px] text-slate-400 uppercase tracking-wider">Guests</p>
                            <p className="text-xs font-semibold text-slate-800">{travelers}</p>
                        </div>
                        <div>
                            <p className="text-[9px] text-slate-400 uppercase tracking-wider">Class</p>
                            <p className="text-xs font-semibold text-slate-800">{totalPrice > 15000 ? 'Business' : 'Economy'}</p>
                        </div>
                    </div>
                </div>

                {/* Tear Line */}
                <div className="relative">
                    <div className="absolute left-0 top-1/2 w-3 h-6 bg-slate-100 rounded-r-full -translate-y-1/2 -translate-x-1.5" />
                    <div className="absolute right-0 top-1/2 w-3 h-6 bg-slate-100 rounded-l-full -translate-y-1/2 translate-x-1.5" />
                    <div className="border-t border-dashed border-slate-200 mx-4" />
                </div>

                {/* Bottom Stub */}
                <div className="px-4 py-3 bg-slate-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="text-left">
                            <p className="text-[9px] text-slate-400 uppercase">Total Paid</p>
                            <p className="text-sm font-bold text-slate-900">{formatCurrency(totalPrice)}</p>
                        </div>
                        {pointsEarned > 0 && (
                            <div className="text-left border-l border-slate-200 pl-3">
                                <p className="text-[9px] text-slate-400 uppercase">Points</p>
                                <p className="text-sm font-semibold text-green-600">+{pointsEarned} <span className="text-xs text-green-500">(₹{pointsToRupees(pointsEarned)})</span></p>
                            </div>
                        )}
                    </div>
                    
                    <div className="flex items-center gap-1.5 text-blue-600 text-xs font-medium group-hover:gap-2 transition-all">
                        <span>View</span>
                        <ChevronRight className="w-4 h-4" />
                    </div>
                </div>

                {/* Status Bar */}
                <div className="h-1 bg-gradient-to-r from-green-500 to-emerald-400" />
            </div>
        </motion.div>
    );
}
