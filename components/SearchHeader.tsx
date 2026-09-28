'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

interface SearchHeaderProps {
  activeCategory: string;
}

export default function SearchHeader({ activeCategory }: SearchHeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [from, setFrom] = useState(() => searchParams.get('from') || '');
  const [to, setTo] = useState(() => searchParams.get('to') || '');
  const [car, setCar] = useState(() => searchParams.get('car') || '');
  const [date, setDate] = useState(() => searchParams.get('date') || '');
  const [activeField, setActiveField] = useState<string | null>(null);

  // We intentionally avoid calling setState inside an effect by using the
  // `key` approach where the parent remounts this component when search params
  // change — this keeps inputs sync'd without using a synchronous setState
  // inside an effect.

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (from) params.set('from', from);
    if (to) params.set('to', to);
    if (car) params.set('car', car);
    if (date) params.set('date', date);

    const queryString = params.toString();
    const target = queryString ? `/search/${activeCategory}?${queryString}` : `/search/${activeCategory}`;
    router.push(target);
  };

  return (
    <div className="bg-white/80 backdrop-blur-md border-b border-border sticky top-16 z-40 py-4 transition-all">
      <div className="container-custom max-w-5xl">
        <motion.form 
          onSubmit={handleSearch}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative flex flex-col md:flex-row items-center bg-white border border-gray-200 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow p-2"
        >
          {/* For hotels show a single Location field (mapped to `to`), otherwise show From + To */}
          {activeCategory === 'hotels' ? (
            <>
              <div
                className={`relative flex-1 w-full md:w-auto px-6 py-2 rounded-full transition-colors group ${activeField === 'to' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
              >
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5 block">Location</label>
                <input
                  type="text"
                  placeholder="City or area"
                  className="w-full bg-transparent font-bold text-foreground placeholder:text-gray-400 focus:outline-none truncate text-sm md:text-base"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  onFocus={() => setActiveField('to')}
                  onBlur={() => setActiveField(null)}
                  required
                />
              </div>
            </>
          ) : activeCategory === 'cabs' ? (
            <>
              {/* Location (pickup) for cabs mapped to `from` */}
              <div
                className={`relative flex-1 w-full md:w-auto px-6 py-2 rounded-full transition-colors group ${activeField === 'from' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
              >
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5 block">Location</label>
                <input
                  type="text"
                  placeholder="Pickup city"
                  className="w-full bg-transparent font-bold text-foreground placeholder:text-gray-400 focus:outline-none truncate text-sm md:text-base"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  onFocus={() => setActiveField('from')}
                  onBlur={() => setActiveField(null)}
                  required
                />
              </div>

              {/* Divider */}
              <div className="hidden md:block w-px h-8 bg-gray-200" />

              {/* Car Name Input */}
              <div
                className={`relative flex-1 w-full md:w-auto px-6 py-2 rounded-full transition-colors group ${activeField === 'car' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
              >
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5 block">Car</label>
                <input
                  type="text"
                  placeholder="e.g. Swift, Dzire, Mercedes"
                  className="w-full bg-transparent font-bold text-foreground placeholder:text-gray-400 focus:outline-none truncate text-sm md:text-base"
                  value={car}
                  onChange={(e) => setCar(e.target.value)}
                  onFocus={() => setActiveField('car')}
                  onBlur={() => setActiveField(null)}
                />
              </div>
            </>
          ) : (
            <>
              {/* From Input */}
              <div 
                className={`relative flex-1 w-full md:w-auto px-6 py-2 rounded-full transition-colors group ${activeField === 'from' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
              >
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5 block">From</label>
                <input
                  type="text"
                  placeholder="Where from?"
                  className="w-full bg-transparent font-bold text-foreground placeholder:text-gray-400 focus:outline-none truncate text-sm md:text-base"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  onFocus={() => setActiveField('from')}
                  onBlur={() => setActiveField(null)}
                  required
                />
              </div>

              {/* Divider */}
              <div className="hidden md:block w-px h-8 bg-gray-200" />

              {/* To Input */}
              <div 
                className={`relative flex-1 w-full md:w-auto px-6 py-2 rounded-full transition-colors group ${activeField === 'to' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
              >
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5 block">To</label>
                <input
                  type="text"
                  placeholder="Where to?"
                  className="w-full bg-transparent font-bold text-foreground placeholder:text-gray-400 focus:outline-none truncate text-sm md:text-base"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  onFocus={() => setActiveField('to')}
                  onBlur={() => setActiveField(null)}
                  required
                />
              </div>
            </>
          )}

          {/* Divider */}
          <div className="hidden md:block w-px h-8 bg-gray-200" />

          {/* Date Input */}
          <div 
            className={`relative w-full md:w-[200px] px-6 py-2 rounded-full transition-colors group ${activeField === 'date' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
          >
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5 block">Date</label>
            <div className="relative">
              <input
                type="date"
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                onFocus={() => setActiveField('date')}
                onBlur={() => setActiveField(null)}
              />
              <div className="flex items-center gap-2">
                <span className={`font-bold truncate text-sm md:text-base ${!date && 'text-gray-400'}`}>
                  {date ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Add Date'}
                </span>
              </div>
            </div>
          </div>

          {/* Search Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="m-1 p-3 md:p-4 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl hover:bg-blue-700 transition-all flex items-center justify-center aspect-square shrink-0"
          >
            <Search className="w-5 h-5 md:w-6 md:h-6" />
          </motion.button>
        </motion.form>
      </div>
    </div>
  );
}

