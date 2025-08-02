import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../types';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  pendingVerification: { email: string; userId: string } | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string, phone: string) => Promise<{ success: boolean; error?: string }>;
  verifyEmail: (code: string) => Promise<{ success: boolean; error?: string }>;
  resendVerificationCode: () => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingVerification, setPendingVerification] = useState<{ email: string; userId: string } | null>(null);
  const isLoggedIn = user !== null;

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error getting session:', error);
        return;
      }
      
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      }
    } catch (error) {
      console.error('Session check error:', error);
    } finally {
      setIsLoading(false);
    }

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await fetchUserProfile(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setPendingVerification(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  };

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }

      if (data) {
        setUser({
          id: data.id,
          name: data.name,
          email: data.email || '',
          phone: data.phone || '',
          balance: data.balance || 2,
          joinedAt: new Date(data.created_at),
          avatar: data.avatar_url
        });
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
    }
  };

  const isSupabaseConfigured = () => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    return supabaseUrl && 
           supabaseKey && 
           supabaseUrl !== 'your_supabase_url_here' && 
           supabaseKey !== 'your_supabase_anon_key_here' &&
           !supabaseUrl.includes('placeholder');
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      
      // Handle demo credentials FIRST - bypass all Supabase calls
      if ((email === 'admin@waqti.com' && password === 'admin123456') ||
          (email === 'demo@waqti.com' && password === 'demo123456')) {
        setUser({
          id: email === 'admin@waqti.com' ? 'admin' : 'demo',
          name: email === 'admin@waqti.com' ? 'Admin User' : 'Demo User',
          email: email,
          phone: '+971501234567',
          balance: email === 'admin@waqti.com' ? 1000 : 10,
          joinedAt: new Date(),
          avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
        });
        setIsLoading(false);
        return { success: true };
      }

      // Check if Supabase is configured
      if (!isSupabaseConfigured()) {
        return { 
          success: false, 
          error: 'Please use demo credentials: demo@waqti.com / demo123456 or admin@waqti.com / admin123456' 
        };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      if (error) {
        return { 
          success: false, 
          error: error.message || 'Invalid login credentials' 
        };
      }

      if (data.user) {
        await fetchUserProfile(data.user.id);
        return { success: true };
      }

      return { success: false, error: 'Login failed. Please try again.' };
    } catch (error) {
      console.error('Login exception:', error);
      return { 
        success: false, 
        error: 'An unexpected error occurred. Please try again.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    phone: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);

      if (!isSupabaseConfigured()) {
        return { 
          success: false, 
          error: 'Registration is not available in demo mode. Please use demo credentials to login.' 
        };
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return { success: false, error: 'Please enter a valid email address' };
      }

      // Sign up the user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            name: name.trim(),
            phone: phone.trim()
          }
        }
      });

      if (signUpError) {
        return { 
          success: false, 
          error: signUpError.message || 'Registration failed. Please try again.' 
        };
      }

      if (!authData.user) {
        return { 
          success: false, 
          error: 'Registration failed. Please try again.' 
        };
      }

      // Create user profile
      const { error: profileError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user.id,
            name: name.trim(),
            phone: phone.trim(),
            balance: 2
          }
        ]);

      if (profileError) {
        console.error('Profile creation error:', profileError);
        await supabase.auth.signOut();
        return { 
          success: false, 
          error: 'Failed to create user profile. Please try again.' 
        };
      }

      // Set pending verification state
      setPendingVerification({
        email: email.trim(),
        userId: authData.user.id
      });

      return { success: true };
    } catch (error) {
      console.error('Registration exception:', error);
      return { 
        success: false, 
        error: 'An unexpected error occurred. Please try again.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmail = async (code: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);

      if (!pendingVerification) {
        return { success: false, error: 'No pending verification found' };
      }

      // For demo purposes, accept '123456' as valid code
      if (code === '123456') {
        await fetchUserProfile(pendingVerification.userId);
        setPendingVerification(null);
        return { success: true };
      }

      // In real implementation, verify with Supabase
      const { error } = await supabase.auth.verifyOtp({
        email: pendingVerification.email,
        token: code,
        type: 'signup'
      });

      if (error) {
        return { success: false, error: 'Invalid verification code' };
      }

      await fetchUserProfile(pendingVerification.userId);
      setPendingVerification(null);
      return { success: true };
    } catch (error) {
      console.error('Email verification error:', error);
      return { success: false, error: 'Verification failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerificationCode = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!pendingVerification) {
        return { success: false, error: 'No pending verification found' };
      }

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: pendingVerification.email
      });

      if (error) {
        return { success: false, error: 'Failed to resend code' };
      }

      return { success: true };
    } catch (error) {
      console.error('Resend verification error:', error);
      return { success: false, error: 'Failed to resend code' };
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
      }
      setUser(null);
      setPendingVerification(null);
    } catch (error) {
      console.error('Logout exception:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<User>): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'No user logged in' };
    }

    try {
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id);

      if (error) {
        return { success: false, error: error.message };
      }

      setUser(prev => prev ? { ...prev, ...updates } : null);
      return { success: true };
    } catch (error) {
      console.error('Profile update exception:', error);
      return { success: false, error: 'Failed to update profile' };
    }
  };

  const value = {
    user,
    isLoggedIn,
    isLoading,
    pendingVerification,
    login,
    register,
    verifyEmail,
    resendVerificationCode,
    logout,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};