'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plane, Hotel, Train, Bus, Car, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const tabs = [
  { id: 'flights', label: 'Flights', icon: Plane },
  { id: 'hotels', label: 'Hotels', icon: Hotel },
  { id: 'trains', label: 'Trains', icon: Train },
  { id: 'buses', label: 'Buses', icon: Bus },
  { id: 'cabs', label: 'Cabs', icon: Car },
];

export default function SearchWidget() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('flights');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search/${activeTab}?from=${from}&to=${to}&date=${date}`);
  };

  return (
    <motion.div 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto -mt-12 relative z-10 border border-border"
    >
      {/* Tabs */}
      <div className="flex overflow-x-auto gap-4 mb-6 pb-2 border-b border-border no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all relative ${
                isActive
                  ? 'text-primary-foreground'
                  : 'text-muted-foreground hover:bg-secondary'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <Icon className="w-4 h-4" />
                <span className="font-medium">{tab.label}</span>
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab + '-from'}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            className="space-y-2 w-full"
          >
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">From</label>
            <input
              type="text"
              placeholder="Enter City"
              className="w-full p-3 bg-secondary rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              required
            />
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab + '-to'}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2, delay: 0.05 }}
            className="space-y-2 w-full"
          >
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">To</label>
            <input
              type="text"
              placeholder="Enter City"
              className="w-full p-3 bg-secondary rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              required={activeTab !== 'hotels'}
              disabled={activeTab === 'hotels'}
              style={{ opacity: activeTab === 'hotels' ? 0.5 : 1 }}
            />
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab + '-date'}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            className="space-y-2 w-full"
          >
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Departure</label>
            <input
              type="date"
              className="w-full p-3 bg-secondary rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </motion.div>
        </AnimatePresence>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-primary text-primary-foreground p-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
        >
          <Search className="w-5 h-5" />
          Search
        </motion.button>
      </form>
    </motion.div>
  );
}
