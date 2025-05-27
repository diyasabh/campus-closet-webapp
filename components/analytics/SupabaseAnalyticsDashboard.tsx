// components/SupabaseAnalyticsProvider.tsx
'use client';

import { useSupabaseAnalytics } from '@/hooks/useSupabaseAnalytics';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function SupabaseAnalyticsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { trackPageView, updateSession } = useSupabaseAnalytics();
  const [pageCount, setPageCount] = useState(0);
  const sessionStartTime = useRef(Date.now());
  const lastPathname = useRef<string>('');

  // Track page views only when pathname actually changes
  useEffect(() => {
    if (pathname && pathname !== lastPathname.current) {
      lastPathname.current = pathname;
      trackPageView(pathname);
      setPageCount(prev => prev + 1);
    }
  }, [pathname, trackPageView]);

  // Update session periodically (less frequently)
  useEffect(() => {
    const interval = setInterval(() => {
      const totalTimeSeconds = Math.round((Date.now() - sessionStartTime.current) / 1000);
      updateSession(pageCount, totalTimeSeconds);
    }, 60000); // Update every 60 seconds instead of 30

    return () => clearInterval(interval);
  }, [pageCount, updateSession]);

  // Handle page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      const totalTimeSeconds = Math.round((Date.now() - sessionStartTime.current) / 1000);
      updateSession(pageCount, totalTimeSeconds);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [pageCount, updateSession]);

  return <>{children}</>;
}