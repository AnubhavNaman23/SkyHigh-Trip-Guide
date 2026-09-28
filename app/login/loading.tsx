'use client';

import LoadingSpinner from '@/components/ui/snow-ball-loading-spinner';

export default function LoginLoading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
      <LoadingSpinner />
      <p className="mt-6 text-lg font-medium text-foreground animate-pulse">
        Loading...
      </p>
    </div>
  );
}
