"use client"

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Define user type
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  instagram?: string;
  createdAt: string;
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
  signOut: () => void;
  updateProfile: (userData: {
    name: string;
    phone: string;
    instagram?: string;
  }) => Promise<{ success: boolean; error?: string }>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Generate a random ID
const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Define auth provider props
interface AuthProviderProps {
  children: React.ReactNode;
}

// Create provider component
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check for existing session on initial load
  useEffect(() => {
    const checkUserSession = () => {
      try {
        // Get current user data from localStorage
        const userDataJson = localStorage.getItem('currentUser');
        
        if (userDataJson) {
          const userData = JSON.parse(userDataJson);
          setUser(userData);
        }
      } catch (error) {
        console.error('Failed to fetch session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUserSession();
  }, []);

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      // Get all users from localStorage
      const usersJson = localStorage.getItem('users');
      const users = usersJson ? JSON.parse(usersJson) : [];
      
      // Find user with matching email
      const user = users.find((u: any) => u.email === email);
      
      if (!user) {
        return { success: false, error: 'Invalid email or password' };
      }
      
      // Verify password
      if (user.password !== password) {
        return { success: false, error: 'Invalid email or password' };
      }
      
      // Remove password before storing in state
      const { password: _, ...userWithoutPassword } = user;
      
      // Set user data
      setUser(userWithoutPassword);
      
      // Store current user in localStorage
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      
      return { success: true };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: 'An error occurred during sign in' };
    }
  };

  // Sign up function
  const signUp = async (userData: {
    name: string;
    email: string;
    phone: string;
    instagram?: string;
    password: string;
  }) => {
    try {
      // Get existing users
      const usersJson = localStorage.getItem('users');
      const users = usersJson ? JSON.parse(usersJson) : [];
      
      // Check if email is already in use
      const existingUser = users.find((u: any) => u.email === userData.email);
      
      if (existingUser) {
        return { success: false, error: 'Email already in use' };
      }
      
      // Create new user
      const newUser = {
        id: generateId(),
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        instagram: userData.instagram || '',
        password: userData.password,
        createdAt: new Date().toISOString(),
      };
      
      // Add user to users array
      users.push(newUser);
      
      // Save updated users array
      localStorage.setItem('users', JSON.stringify(users));
      
      // Remove password before storing in state
      const { password: _, ...userWithoutPassword } = newUser;
      
      // Set user data
      setUser(userWithoutPassword);
      
      // Store current user in localStorage
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      
      return { success: true };
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: 'An error occurred during sign up' };
    }
  };

  // Sign out function
  const signOut = () => {
    // Remove current user from localStorage
    localStorage.removeItem('currentUser');
    
    // Clear user state
    setUser(null);
    
    // Redirect to home page
    router.push('/');
  };

  // Update profile function
  const updateProfile = async (userData: {
    name: string;
    phone: string;
    instagram?: string;
  }) => {
    try {
      if (!user) {
        return { success: false, error: 'Not authenticated' };
      }
      
      // Get all users
      const usersJson = localStorage.getItem('users');
      const users = usersJson ? JSON.parse(usersJson) : [];
      
      // Find and update user
      const updatedUsers = users.map((u: any) => {
        if (u.id === user.id) {
          return {
            ...u,
            name: userData.name,
            phone: userData.phone,
            instagram: userData.instagram || '',
          };
        }
        return u;
      });
      
      // Save updated users array
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      // Update current user
      const updatedUser = {
        ...user,
        name: userData.name,
        phone: userData.phone,
        instagram: userData.instagram || '',
      };
      
      // Update user state
      setUser(updatedUser);
      
      // Update current user in localStorage
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
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

// Create hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}