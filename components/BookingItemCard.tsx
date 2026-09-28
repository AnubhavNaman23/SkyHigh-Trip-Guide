'use client';

import { motion } from 'framer-motion';
import { Plane, Train, Bus, Users } from 'lucide-react';
import { pointsToRupees } from '@/lib/points';
import { format, parseISO } from 'date-fns';
import { TravelItem } from '@/types';

interface BookingItemCardProps {
  bookingId?: string;
  item: TravelItem;
  date?: string;
  pointsEarned?: number;
  onClick?: () => void;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);

const TransportIcon = ({ type }: { type?: string }) => {
  switch (type) {
    case 'flight':
      return <Plane className="w-5 h-5 text-slate-600" />;
    case 'train':
      return <Train className="w-5 h-5 text-slate-600" />;
    case 'bus':
      return <Bus className="w-5 h-5 text-slate-600" />;
    default:
      return <Plane className="w-5 h-5 text-slate-600" />;
  }
};

export default function BookingItemCard({ item, date, pointsEarned = 0, onClick }: BookingItemCardProps) {
  const dateStr = date || new Date().toISOString();
  const formattedDate = (() => {
    try {
      return format(parseISO(dateStr), 'dd MMM yyyy');
    } catch {
      return dateStr;
    }
  })();

  return (
    <motion.div
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.995 }}
      onClick={onClick}
      className="group cursor-pointer p-4 bg-white rounded-xl shadow-sm border border-border hover:shadow-md flex items-center gap-4"
    >
      <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center">
        <TransportIcon type={item.type} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="truncate">
            <div className="text-sm font-semibold text-slate-900 truncate">{item.title}</div>
            <div className="text-xs text-muted-foreground truncate">{item.subtitle ?? item.details?.join(' · ')}</div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium">{formatCurrency(item.price)}</div>
            <div className="text-xs text-muted-foreground">{formattedDate}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
          <Users className="w-3 h-3" /> {item.details?.[0] ?? ''}
          {pointsEarned > 0 && (
            <div className="ml-auto text-amber-500 font-medium">+{pointsEarned} pts <span className="text-xs text-amber-500 ml-1">(₹{pointsToRupees(pointsEarned)})</span></div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
