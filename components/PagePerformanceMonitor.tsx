'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

// Lightweight client-side monitor that logs navigation render durations
export default function PagePerformanceMonitor() {
  const pathname = usePathname();
  const navStartRef = useRef<number | null>(null);
  
  useEffect(() => {
    // Called on initial page load and every navigation
    // Store a start time when the pathname changes
    navStartRef.current = performance.now();

    // After paint, compute delta and log
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const start = navStartRef.current ?? performance.now();
        const duration = performance.now() - start;
        // We log to console for now; you can send to analytics service if available
        console.info(`[Perf] Route ${pathname} render time: ${Math.round(duration)}ms`);

        // Optional: Mark performance entries for deeper analysis
        try {
          performance.mark(`route:${pathname}:render:end`);
          performance.measure(`route:${pathname}:render`, `route:${pathname}:render:start`, `route:${pathname}:render:end`);
        } catch {
          // ignore
        }
      });
    });

    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  // Mark the start time as soon as component mounts for the route
  useEffect(() => {
    try {
      performance.mark(`route:${pathname}:render:start`);
    } catch {}
  }, [pathname]);

  return null;
}
