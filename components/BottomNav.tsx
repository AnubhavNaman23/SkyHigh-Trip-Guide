'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, User, Briefcase, Plane, Train, Hotel, Car, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function BottomNav() {
  const pathname = usePathname();
  const [showFacilities, setShowFacilities] = useState(false);

  const navItems = [
    { label: 'Home', icon: Home, href: '/' },
    { label: 'Explore', icon: Compass, href: '/explore' },
    { label: 'AI Planner', icon: Sparkles, href: '/ai-trip' },
    { label: 'My Trips', icon: Briefcase, href: '/trips' },
    { label: 'Profile', icon: User, href: '/profile' },
  ];

  const facilityOptions = [
    { label: 'Flights', icon: Plane, href: '/search/flights' },
    { label: 'Trains', icon: Train, href: '/search/trains' },
    { label: 'Hotels', icon: Hotel, href: '/search/hotels' },
    { label: 'Cars', icon: Car, href: '/search/cabs' },
    { label: 'AI Trip', icon: Sparkles, href: '/ai-trip' },
  ];

  return (
    <>
      <AnimatePresence>
        {showFacilities && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="md:hidden fixed bottom-20 left-4 right-4 bg-white rounded-2xl shadow-2xl border border-border z-50 p-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Select Facility</h3>
              <button onClick={() => setShowFacilities(false)} className="p-1 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {facilityOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <Link
                    key={option.label}
                    href={option.href}
                    onClick={() => setShowFacilities(false)}
                    className="flex flex-col items-center gap-2 p-2 rounded-xl hover:bg-gray-50"
                  >
                    <div className="p-3 bg-primary/10 rounded-full text-primary">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-medium">{option.label}</span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showFacilities && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={() => setShowFacilities(false)}
        />
      )}

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#f8faff]/95 backdrop-blur-md border-t border-border z-50 pb-safe">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isFacility = item.label === 'Facilities';
            const isActive = !isFacility && (pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href)));
            
            if (isFacility) {
              return (
                <button
                  key={item.label}
                  onClick={() => setShowFacilities(!showFacilities)}
                  className="relative flex flex-col items-center justify-center w-full h-full"
                >
                  <div className={`flex flex-col items-center gap-1 transition-colors ${showFacilities ? 'text-primary' : 'text-muted-foreground'}`}>
                    <Icon className={`w-6 h-6 ${showFacilities ? 'fill-current' : ''}`} />
                    <span className="text-[10px] font-medium">{item.label}</span>
                  </div>
                </button>
              );
            }

            return (
              <Link 
                key={item.label} 
                href={item.href}
                className="relative flex flex-col items-center justify-center w-full h-full"
              >
                {isActive && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="absolute top-0 w-12 h-1 bg-primary rounded-b-full"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <div className={`flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                  <Icon className={`w-6 h-6 ${isActive ? 'fill-current' : ''}`} />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
