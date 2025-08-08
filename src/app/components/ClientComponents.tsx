// Lazy loaded client components for better performance
"use client";

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Lazy load interactive components
export const LazyAuthModal = dynamic(() => import('./AuthModal'), {
  loading: () => <div className="animate-pulse bg-gray-200 rounded-lg h-96 w-full" />,
  ssr: false, // Auth modal doesn't need SSR
});

export const LazyPromotionSlider = dynamic(() => import('../HomePage/promotion'), {
  loading: () => (
    <div className="h-[596px] bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded-lg" />
  ),
  ssr: false, // Slider is interactive, no need for SSR
});

// Wrap components with Suspense for better loading experience
export function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    }>
      {children}
    </Suspense>
  );
}