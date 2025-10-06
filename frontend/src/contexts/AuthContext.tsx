'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { apiService, User } from '@/lib/api';
import { getDashboardRoute } from '@/lib/dashboard-utils';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: { usernameOrEmail: string; password: string }) => Promise<boolean>;
  loginAdmin: (credentials: { usernameOrEmail: string; password: string }) => Promise<boolean>;
  loginWithGoogle: () => void;
  handleGoogleOAuthCallback: () => Promise<boolean>;
  logout: () => void;
  register: (userData: any) => Promise<{ success: boolean; userType?: string; redirectTo?: string }>;
  refreshUser: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const isAuthenticated = !!user;

  // Check if user is authenticated on app load
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async (): Promise<boolean> => {
    try {
      const token = localStorage.getItem('jwt_token');
      if (!token) {
        setIsLoading(false);
        return false;
      }

      const response = await apiService.getCurrentUser();
      if (response.success && response.data) {
        setUser(response.data);
        // Store user data in localStorage for persistence
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(response.data));
        }
        setIsLoading(false);
        return true;
      } else {
        // Token is invalid, remove it
        localStorage.removeItem('jwt_token');
        setUser(null);
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('jwt_token');
      setUser(null);
      setIsLoading(false);
      return false;
    }
  };

  const login = async (credentials: { usernameOrEmail: string; password: string }): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Validate input
      if (!credentials.usernameOrEmail || !credentials.password) {
        toast.error('Please enter both username/email and password');
        setIsLoading(false);
        return false;
      }
      
      const response = await apiService.loginUser(credentials);
      
      if (response.success) {
        // Get user profile after successful login
        const userResponse = await apiService.getCurrentUser();
        if (userResponse.success && userResponse.data) {
          setUser(userResponse.data);
          // Store user data in localStorage for persistence
          if (typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(userResponse.data));
          }
          toast.success('Login successful!');
          setIsLoading(false);
          return true;
        } else {
          toast.error('Failed to load user profile');
          setIsLoading(false);
          return false;
        }
      }
      
      // Handle specific error messages
      const errorMessage = response.message || 'Login failed';
      if (errorMessage.includes('Invalid email or password')) {
        toast.error('Invalid username/email or password');
      } else if (errorMessage.includes('Account is deactivated')) {
        toast.error('Your account has been deactivated. Please contact support.');
      } else if (errorMessage.includes('Network error')) {
        toast.error('Network error. Please check your connection and try again.');
      } else {
        toast.error(errorMessage);
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An unexpected error occurred during login');
      setIsLoading(false);
      return false;
    }
  };

  const loginAdmin = async (credentials: { usernameOrEmail: string; password: string }): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await apiService.loginAdmin(credentials);
      
      if (response.success) {
        // Get user profile after successful login
        const userResponse = await apiService.getCurrentUser();
        if (userResponse.success && userResponse.data) {
          setUser(userResponse.data);
          // Store user data in localStorage for persistence
          if (typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(userResponse.data));
          }
          toast.success('Admin login successful!');
          setIsLoading(false);
          return true;
        }
      }
      
      toast.error(response.message || 'Admin login failed');
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Admin login error:', error);
      toast.error('An error occurred during admin login');
      setIsLoading(false);
      return false;
    }
  };

  const loginWithGoogle = async () => {
    try {
      // Store the current page URL to redirect back after OAuth
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('oauth_redirect', window.location.pathname);
      }
      
      apiService.initiateGoogleLogin();
    } catch (error) {
      console.error('Google login initiation failed:', error);
      toast.error('Failed to initiate Google login');
    }
  };

  const handleGoogleOAuthCallback = async (): Promise<boolean> => {
    try {
      const response = await apiService.handleGoogleCallback();
      
      if (response.success && response.data) {
        if (response.data.action === 'login') {
          // User exists, login successful
          const userResponse = await apiService.getCurrentUser();
          if (userResponse.success && userResponse.data) {
            setUser(userResponse.data);
            toast.success('Login successful!');
            return true;
          }
        } else if (response.data.action === 'register') {
          // User doesn't exist, store OAuth data for registration
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('oauth_user_data', JSON.stringify({
              email: response.data.email,
              firstName: response.data.firstName,
              lastName: response.data.lastName,
              picture: response.data.picture
            }));
          }
          toast.info('Please complete your registration');
          return false;
        }
      }
      
      toast.error(response.message || 'OAuth authentication failed');
      return false;
    } catch (error) {
      console.error('OAuth callback handling failed:', error);
      toast.error('Authentication failed');
      return false;
    }
  };

  const register = async (userData: any): Promise<{ success: boolean; userType?: string; redirectTo?: string }> => {
    try {
      setIsLoading(true);
      const response = await apiService.registerUser(userData);
      
      if (response.success) {
        // Extract user credentials for auto-login
        const email = userData.email || userData.get?.('email');
        const password = userData.password || userData.get?.('password');
        
        if (email && password) {
          // Automatically log the user in after successful registration
          const loginResponse = await apiService.loginUser({
            usernameOrEmail: email,
            password: password
          });
          
          if (loginResponse.success) {
            // Get user profile to determine user type and redirect
            const userResponse = await apiService.getCurrentUser();
            if (userResponse.success && userResponse.data) {
              setUser(userResponse.data);
              toast.success('Registration successful! Welcome to Zoodo!');
              setIsLoading(false);
              
              // Determine redirect path based on user type
              const userType = userResponse.data.userType;
              const redirectTo = getDashboardRoute(userType);
              
              return { 
                success: true, 
                userType: userType,
                redirectTo: redirectTo
              };
            }
          }
        }
        
        // Fallback if auto-login fails
        toast.success('Registration successful! Please login to continue.');
        setIsLoading(false);
        return { success: true };
      }
      
      toast.error(response.message || 'Registration failed');
      setIsLoading(false);
      return { success: false };
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('An error occurred during registration');
      setIsLoading(false);
      return { success: false };
    }
  };

  const logout = () => {
    apiService.logout();
    setUser(null);
    // Clear user data from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }
    toast.success('Logged out successfully');
    router.push('/');
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const response = await apiService.getCurrentUser();
      if (response.success && response.data) {
        setUser(response.data);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    loginAdmin,
    loginWithGoogle,
    handleGoogleOAuthCallback,
    logout,
    register,
    refreshUser,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
