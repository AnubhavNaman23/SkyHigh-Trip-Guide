'use client';

import { motion } from 'framer-motion';
import { Plane, MapPin, Sparkles, Cloud } from 'lucide-react';

export default function TripLoader() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950 text-white overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-950 to-slate-950" />
      
      {/* Floating Clouds Background */}
      <motion.div 
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute top-1/4 left-0 text-slate-800/30"
      >
        <Cloud className="w-24 h-24" />
      </motion.div>
      <motion.div 
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear', delay: 2 }}
        className="absolute bottom-1/3 left-0 text-slate-800/20"
      >
        <Cloud className="w-32 h-32" />
      </motion.div>

      {/* Central Animation Container */}
      <div className="relative z-10 flex flex-col items-center">
        
        {/* Globe/Map Circle */}
        <div className="relative w-48 h-48 mb-12">
            {/* Pulsing Rings */}
            <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 rounded-full border border-blue-500/30"
            />
            <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0, 0.2] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute inset-0 rounded-full border border-blue-400/20"
            />
            
            {/* Central Globe Representation */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-b from-blue-500/10 to-transparent backdrop-blur-sm border border-white/10 flex items-center justify-center shadow-[0_0_50px_-12px_rgba(59,130,246,0.5)]">
                <MapPin className="w-12 h-12 text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.8)]" />
            </div>

            {/* Orbiting Plane */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0"
            >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6">
                    <motion.div
                        animate={{ rotate: 90 }} // Face forward
                        className="relative"
                    >
                        <Plane className="w-8 h-8 text-white fill-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                        {/* Streamer effect */}
                        <motion.div 
                            style={{ filter: 'blur(4px)' }}
                            className="absolute top-1/2 right-full w-12 h-1 bg-gradient-to-l from-blue-400 to-transparent -translate-y-1/2 opacity-50"
                        />
                    </motion.div>
                </div>
            </motion.div>
        </div>

        {/* Text Animation */}
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-3"
        >
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-200 via-white to-blue-200 bg-clip-text text-transparent">
                Planning Your Adventure
            </h2>
            <div className="flex items-center gap-1 justify-center text-slate-400 text-sm">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Curating the best flight & hotels...</span>
            </div>
        </motion.div>
      </div>
    </div>
  );
}
