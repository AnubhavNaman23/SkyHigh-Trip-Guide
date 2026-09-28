'use client';

import Link from 'next/link';
import { Plane, User, LogOut, Cpu } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';


export default function Navbar() {
  const storePoints = useStore((state) => state.points);
  const { user, logOut } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [points, setPoints] = useState(storePoints);
  // Points might be updated locally by store actions, so we prefer storePoints if available/updated
  // or user.points from context.
  
  // Actually, we should probably stick to storePoints if the store is the single source of truth for session points,
  // but initially load from user context.
  
  // Simplified logic:
  const isPro = user?.pro === true;
  
  // Update local points when user context or store updates
  useEffect(() => {
    if (storePoints > 0) {
        setPoints(storePoints);
    } else if (user?.points) {
        setPoints(user.points);
    }
  }, [storePoints, user]);

  // Keep local points in sync with store updates
  useEffect(() => {
    setPoints(storePoints);
  }, [storePoints]);



  return (
    <nav className="bg-[#f8faff]/95 backdrop-blur-md border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container-custom flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 group">
          <motion.div
            whileHover={{ rotate: 15, scale: 1.1 }}
            transition={{ duration: 0.3 }}
            className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-sm"
          >
            <Plane className="w-4 h-4 text-white" />
          </motion.div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-sky-400 bg-clip-text text-transparent">
            SkyHigh
          </span>
          {isPro && (
            <span className="bg-gradient-to-r from-amber-200 to-yellow-400 text-yellow-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider ml-1 border border-yellow-500/20">
              PRO
            </span>
          )}
        </Link>
        
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors relative group">
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
          </Link>
          <Link href="/explore" className="text-sm font-medium hover:text-primary transition-colors relative group">
            Explore
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
          </Link>
          <Link href="/ai-trip" className="text-sm font-medium hover:text-primary transition-colors relative group flex items-center gap-1.5 text-primary font-semibold">
            <Cpu className="w-4 h-4 text-primary" />
            AI Trip Planner
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
          </Link>
          <Link href="/trips" className="text-sm font-medium hover:text-primary transition-colors relative group">
            My Trips
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
          </Link>
          <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors relative group">
            Dashboard
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
          </Link>
          <Link href="/search/hotels" className="text-sm font-medium hover:text-primary transition-colors relative group">
            Stays
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
          </Link>
          <Link href="/search/flights" className="text-sm font-medium hover:text-primary transition-colors relative group">
            Flights
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              {!isPro && (
                <Link href="/subscription" className="hidden md:block">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-amber-200 to-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm hover:shadow-md transition-all flex items-center gap-1"
                  >
                    Upgrade to Pro
                  </motion.button>
                </Link>
              )}

              <motion.div 
                key={points}
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.2, 1] }}
                className="hidden md:flex items-center gap-1 bg-secondary px-3 py-1 rounded-full"
              >
                <span className="text-sm font-bold text-primary">{points}</span>
                <span className="text-xs text-muted-foreground">pts</span>
              </motion.div>
              
              <div className="relative">
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isPro ? 'ring-2 ring-yellow-400 ring-offset-2' : 'bg-primary/10 hover:bg-primary/20'}`}
                >
                  {user.photoURL ? (
                    <Image src={user.photoURL} alt="User" width={32} height={32} className="rounded-full" />
                  ) : (
                    <User className="w-5 h-5 text-primary" />
                  )}
                </button>

                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-border py-1 overflow-hidden"
                    >
                      <div className="px-4 py-2 border-b border-border">
                        <p className="text-sm font-bold truncate flex items-center gap-2">
                          {user.displayName || 'User'}
                          {isPro && <span className="text-[10px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded font-bold border border-yellow-200">PRO</span>}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                      
                      <Link 
                        href="/dashboard" 
                        className="block px-4 py-2 text-sm hover:bg-secondary transition-colors"
                        onClick={() => setShowDropdown(false)}
                      >
                        Dashboard
                      </Link>

                      <Link 
                        href="/trips" 
                        className="block px-4 py-2 text-sm hover:bg-secondary transition-colors"
                        onClick={() => setShowDropdown(false)}
                      >
                        My Trips
                      </Link>

                      <Link 
                        href="/profile" 
                        className="block px-4 py-2 text-sm hover:bg-secondary transition-colors"
                        onClick={() => setShowDropdown(false)}
                      >
                        Profile
                      </Link>

                      <Link 
                        href="/subscription" 
                        className="block px-4 py-2 text-sm hover:bg-secondary transition-colors"
                        onClick={() => setShowDropdown(false)}
                      >
                         {isPro ? 'Manage Subscription' : 'Upgrade to Pro ✨'}
                      </Link>

                      <button 
                        onClick={() => {
                          logOut();
                          setShowDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <Link href="/login" className="btn-primary">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
