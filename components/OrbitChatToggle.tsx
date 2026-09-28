'use client';

import dynamic from 'next/dynamic';
import { useState, Suspense } from 'react';
import TripLoader from './TripLoader';

// Dynamically import OrbitChat only on the client when toggled open
const OrbitChat = dynamic(() => import('./OrbitChat'), { ssr: false });

export default function OrbitChatToggle() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-xl flex items-center justify-center z-50 hover:shadow-2xl hover:shadow-blue-500/25 transition-all group"
      >
        <span className="sr-only">Toggle chat</span>
        {/* Keep a lightweight icon markup to avoid importing lucide here */}
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M3 8v10l4-4h10V8a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <Suspense fallback={<TripLoader />}>
          <OrbitChat />
        </Suspense>
      )}
    </>
  );
}
