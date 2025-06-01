"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

// Define user type
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  instagram?: string;
  createdAt?: string;
}

// Define auth context type
interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (userData: {
    name: string;
    email: string;
    phone: string;
    instagram?: string;
    password: string;
  }) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (userData: {
    name: string;
    phone: string;
    instagram?: string;
  }) => Promise<{ success: boolean; error?: string }>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define auth provider props
interface AuthProviderProps {
  children: React.ReactNode;
}

// AuthProvider component
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Listen to auth state changes
  useEffect(() => {
    const handleBeforeUnload = () => {
      logSessionEnd();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const u = session.user;
        setUser({
          id: u.id,
          name: u.user_metadata?.full_name || '',
          email: u.email || '',
          phone: u.user_metadata?.phone || '',
          instagram: u.user_metadata?.instagram || '',
          createdAt: undefined,
        });
        localStorage.setItem('currentUser', JSON.stringify(u));
      } else {
        setUser(null);
        localStorage.removeItem('currentUser');
      }
      setLoading(false);
    });

    // Also check current session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const u = session.user;
        setUser({
          id: u.id,
          name: u.user_metadata?.full_name || '',
          email: u.email || '',
          phone: u.user_metadata?.phone || '',
          instagram: u.user_metadata?.instagram || '',
          createdAt: undefined,
        });
        localStorage.setItem('currentUser', JSON.stringify(u));
        logSessionStart(u.id)
      } else {
        setUser(null);
        localStorage.removeItem('currentUser');
      }
      setLoading(false);
    });

    return () => {
      authListener?.unsubscribe();
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const logSessionStart = async (userId: string) => {
    const { data, error } = await supabase
      .from('sessions')
      .insert([{ user_id: userId }])
      .select('id')
      .single();
  
    if (!error && data) {
      localStorage.setItem('active_session_id', data.id);
    }
  };
  
  const logSessionEnd = async () => {
    const sessionId = localStorage.getItem('active_session_id');
    if (!sessionId) return;
  
    await supabase
      .from('sessions')
      .update({ session_end: new Date().toISOString() })
      .eq('id', sessionId);
  
    localStorage.removeItem('active_session_id');
  };

  // signIn method
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data.user) {
        return { success: false, error: error?.message || 'Login failed' };
      }

      const u = data.user;
      setUser({
        id: u.id,
        name: u.user_metadata?.full_name || '',
        email: u.email || '',
        phone: u.user_metadata?.phone || '',
        instagram: u.user_metadata?.instagram || '',
        createdAt: undefined,
      });
      localStorage.setItem('currentUser', JSON.stringify(u));

      return { success: true };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: 'An error occurred during sign in' };
    }
  };

  // signUp method
  const signUp = async (userData: {
    name: string;
    email: string;
    phone: string;
    instagram?: string;
    password: string;
  }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.name,
            phone: userData.phone,
            instagram: userData.instagram || '',
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: 'An error occurred during sign up' };
    }
  };

  // signOut method
  const signOut = async () => {
    await logSessionEnd();
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('currentUser');
    router.push('/');
  };

  const updateProfile = async (userData: {
    name: string;
    phone: string;
    instagram?: string;
  }) => {
    try {
      if (!user) {
        return { success: false, error: 'Not authenticated' };
      }

      const updates = {
        id: user.id,
        full_name: userData.name,
        phone: userData.phone,
        instagram: userData.instagram || '',
        updated_at: new Date(),
      };

      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: updates.full_name,
          phone: updates.phone,
          instagram: updates.instagram,
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      // Update local user state
      setUser((prev) =>
        prev
          ? {
              ...prev,
              name: userData.name,
              phone: userData.phone,
              instagram: userData.instagram || '',
            }
          : null
      );

      return { success: true };
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: 'An error occurred during profile update' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        signIn,
        signUp,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook to consume the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
