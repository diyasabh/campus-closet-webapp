// components/SupabaseAnalyticsProvider.tsx
'use client';

import { useSupabaseAnalytics } from '@/hooks/useSupabaseAnalytics';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SupabaseAnalyticsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { trackPageView, updateSession } = useSupabaseAnalytics();
  const [pageCount, setPageCount] = useState(0);
  const [sessionStartTime] = useState(Date.now());

  // Track page views
  useEffect(() => {
    if (pathname) {
      trackPageView(pathname);
      setPageCount(prev => prev + 1);
    }
  }, [pathname, trackPageView]);

  // Update session on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      const totalTimeSeconds = Math.round((Date.now() - sessionStartTime) / 1000);
      updateSession(pageCount, totalTimeSeconds);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [pageCount, sessionStartTime, updateSession]);

  // Track time spent on page
  useEffect(() => {
    const interval = setInterval(() => {
      const totalTimeSeconds = Math.round((Date.now() - sessionStartTime) / 1000);
      if (totalTimeSeconds % 30 === 0) { // Update every 30 seconds
        updateSession(pageCount, totalTimeSeconds);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [pageCount, sessionStartTime, updateSession]);

  return <>{children}</>;
}