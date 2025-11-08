'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { apiService, User } from '@/lib/api';
import { getDashboardRoute } from '@/lib/dashboard-utils';
import { notificationService } from '@/lib/notification-service';

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
    // Skip auth check for dashboard pages completely
    // Use typeof window check to ensure we're on client side
    if (typeof window !== 'undefined') {
      const isDashboardPage = window.location.pathname.startsWith('/dashboard/');
      
      if (isDashboardPage) {
        // For dashboard pages, just set loading to false immediately
        setIsLoading(false);
        return;
      }
    }
    
    // For non-dashboard pages, check auth
    checkAuth();
  }, []);

  const checkAuth = async (): Promise<boolean> => {
    try {
      const token = localStorage.getItem('jwt_token');
      if (!token) {
        setIsLoading(false);
        return false;
      }

      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Auth check timeout')), 3000)
      );
      
      const response = await Promise.race([
        apiService.getCurrentUser(),
        timeoutPromise
      ]) as any;
      
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
      // Don't block the app if auth check fails - just clear token and continue
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
        notificationService.validationError('Credentials', 'Please enter both username/email and password');
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
            notificationService.loginSuccess(userResponse.data.firstName);
            setIsLoading(false);
            return true;
          } else {
            notificationService.error({
              title: 'Profile Load Failed',
              description: 'Failed to load user profile after login',
            });
            setIsLoading(false);
            return false;
          }
      }
      
      // Handle specific error messages
      notificationService.loginError({
        code: response.errorCode,
        type: response.errorType,
        details: response.details,
      });
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      notificationService.networkError();
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
            notificationService.success({
              title: 'Admin Login Successful!',
              description: 'Welcome to the admin dashboard.',
              type: 'login',
            });
            setIsLoading(false);
            return true;
          }
        }
        
        notificationService.error({
          title: 'Admin Login Failed',
          description: response.message || 'Unable to log in as admin',
          errorDetails: {
            code: response.errorCode,
            type: response.errorType,
          },
        });
        setIsLoading(false);
        return false;
      } catch (error) {
        console.error('Admin login error:', error);
        notificationService.networkError();
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
      notificationService.error({
        title: 'Google Login Failed',
        description: 'Failed to initiate Google login. Please try again.',
      });
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
            notificationService.loginSuccess(userResponse.data.firstName);
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
          notificationService.info({
            title: 'Complete Registration',
            description: 'Please complete your registration to continue.',
            type: 'registration',
          });
          return false;
        }
      }
      
      notificationService.error({
        title: 'OAuth Authentication Failed',
        description: response.message || 'Unable to authenticate with Google',
      });
      return false;
    } catch (error) {
      console.error('OAuth callback handling failed:', error);
      notificationService.error({
        title: 'Authentication Failed',
        description: 'An error occurred during authentication',
      });
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
              notificationService.registrationSuccess(userResponse.data.userType);
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
        notificationService.success({
          title: 'Registration Successful!',
          description: 'Please login to continue.',
          type: 'registration',
        });
        setIsLoading(false);
        return { success: true };
      }
      
      notificationService.registrationError({
        code: response.errorCode,
        type: response.errorType,
        details: response.details,
      });
      setIsLoading(false);
      return { success: false };
    } catch (error) {
      console.error('Registration error:', error);
      notificationService.networkError();
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
    notificationService.success({
      title: 'Logged Out Successfully',
      description: 'You have been logged out of your account.',
      type: 'login',
    });
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
