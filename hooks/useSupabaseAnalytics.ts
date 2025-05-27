// hooks/useSupabaseAnalytics.ts
import { supabase } from '@/lib/supabase';
import { useEffect, useState, useCallback, useRef } from 'react';

// Generate session ID
const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
};

// Get or create session ID
const getSessionId = () => {
  if (typeof window === 'undefined') return null;
  
  let sessionId = sessionStorage.getItem('campus_closet_session');
  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem('campus_closet_session', sessionId);
  }
  return sessionId;
};

export const useSupabaseAnalytics = () => {
  const [sessionId] = useState(() => getSessionId());
  const [currentUser, setCurrentUser] = useState<any>(null);
  const userFetched = useRef(false);

  useEffect(() => {
    // Get current user only once
    if (!userFetched.current) {
      userFetched.current = true;
      const getCurrentUser = async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          setCurrentUser(user);
        } catch (error) {
          console.error('Error getting user:', error);
        }
      };
      getCurrentUser();
    }
  }, []);

  // Memoized tracking functions to prevent recreating on every render
  const trackPageView = useCallback(async (pagePath: string, referrer?: string) => {
    try {
      await supabase.from('page_views').insert([
        {
          user_id: currentUser?.id || null,
          page_path: pagePath,
          referrer: referrer || (typeof document !== 'undefined' ? document.referrer : ''),
          user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
          session_id: sessionId
        }
      ]);
    } catch (error) {
      console.error('Error tracking page view:', error);
    }
  }, [currentUser?.id, sessionId]);

  const trackItemAnalytics = useCallback(async (
    itemId: number,
    actionType: string,
    metadata: Record<string, any> = {}
  ) => {
    try {
      await supabase.from('item_analytics').insert([
        {
          user_id: currentUser?.id || null,
          item_id: itemId,
          action_type: actionType,
          metadata: metadata,
          session_id: sessionId
        }
      ]);
    } catch (error) {
      console.error('Error tracking item analytics:', error);
    }
  }, [currentUser?.id, sessionId]);

  const trackUserEngagement = useCallback(async (
    eventType: string,
    eventData: Record<string, any> = {},
    pagePath?: string
  ) => {
    try {
      await supabase.from('user_engagement').insert([
        {
          user_id: currentUser?.id || null,
          event_type: eventType,
          event_data: eventData,
          page_path: pagePath || (typeof window !== 'undefined' ? window.location.pathname : ''),
          session_id: sessionId
        }
      ]);
    } catch (error) {
      console.error('Error tracking user engagement:', error);
    }
  }, [currentUser?.id, sessionId]);

  const trackSearch = useCallback(async (
    searchTerm: string,
    resultsCount: number,
    filtersApplied: Record<string, any> = {},
    clickedResultId?: number
  ) => {
    try {
      await supabase.from('search_analytics').insert([
        {
          user_id: currentUser?.id || null,
          search_term: searchTerm,
          results_count: resultsCount,
          filters_applied: filtersApplied,
          clicked_result_id: clickedResultId,
          session_id: sessionId
        }
      ]);
    } catch (error) {
      console.error('Error tracking search:', error);
    }
  }, [currentUser?.id, sessionId]);

  const trackConversionStep = useCallback(async (
    itemId: number,
    stepName: string,
    stepData: Record<string, any> = {}
  ) => {
    try {
      await supabase.from('conversion_funnel').insert([
        {
          user_id: currentUser?.id || null,
          item_id: itemId,
          step_name: stepName,
          step_data: stepData,
          session_id: sessionId
        }
      ]);
    } catch (error) {
      console.error('Error tracking conversion step:', error);
    }
  }, [currentUser?.id, sessionId]);

  const trackPerformanceMetric = useCallback(async (
    metricName: string,
    metricValue: number,
    metadata: Record<string, any> = {}
  ) => {
    try {
      await supabase.from('performance_metrics').insert([
        {
          metric_name: metricName,
          metric_value: metricValue,
          metadata: metadata
        }
      ]);
    } catch (error) {
      console.error('Error tracking performance metric:', error);
    }
  }, []);

  const updateSession = useCallback(async (pageCount: number, totalTimeSeconds: number) => {
    if (!sessionId) return;
    
    try {
      await supabase.from('user_sessions').upsert([
        {
          id: sessionId,
          user_id: currentUser?.id || null,
          page_count: pageCount,
          total_time_seconds: totalTimeSeconds,
          referrer: typeof document !== 'undefined' ? document.referrer : '',
          user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
          ended_at: new Date().toISOString()
        }
      ]);
    } catch (error) {
      console.error('Error updating session:', error);
    }
  }, [sessionId, currentUser?.id]);

  return {
    trackPageView,
    trackItemAnalytics,
    trackUserEngagement,
    trackSearch,
    trackConversionStep,
    trackPerformanceMetric,
    updateSession,
    sessionId,
    currentUser
  };
};