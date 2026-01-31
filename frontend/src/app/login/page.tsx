'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Eye,
  EyeOff,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { getDashboardRoute } from '@/lib/dashboard-utils';


interface FormData {
  usernameOrEmail: string;
  password: string;
}

export default function LoginPage() {
  const [formData, setFormData] = useState<FormData>({
    usernameOrEmail: '',
    password: ''
  });
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const { login, loginWithGoogle, isLoading, isAuthenticated, user } = useAuth();



  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const dashboardRoute = getDashboardRoute(user.userType);
      router.push(dashboardRoute);
    }
  }, [isAuthenticated, user, router]);



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.usernameOrEmail || !formData.password) {
      return;
    }

    const success = await login({
      usernameOrEmail: formData.usernameOrEmail,
      password: formData.password
    });

    if (success) {
      // Get user data from localStorage (set by AuthContext) and redirect immediately
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          const dashboardRoute = getDashboardRoute(userData.userType);
          router.push(dashboardRoute);
        } catch (error) {
          console.error('Error parsing user data:', error);
          router.push('/dashboard');
        }
      } else {
        // Fallback: wait a moment and try again
        setTimeout(() => {
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            try {
              const userData = JSON.parse(storedUser);
              const dashboardRoute = getDashboardRoute(userData.userType);
              router.push(dashboardRoute);
            } catch (error) {
              console.error('Error parsing user data:', error);
              router.push('/dashboard');
            }
          } else {
            router.push('/dashboard');
          }
        }, 200);
      }
    }
  };

  const handleSocialLogin = (provider: 'google' | 'github' | 'microsoft' | 'apple') => {
    if (provider === 'google') {
      loginWithGoogle();
    } else {
      console.log(`${provider} login not implemented yet`);
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Header */}
      <div className="relative z-10 flex justify-between items-center p-4 sm:p-6">
        <div className="flex items-center">
          <Image
            src="/Zoodo.png"
            alt="Zoodo"
            width={120}
            height={40}
            className="h-3 md:h-4 lg:h-5 w-auto"
            priority
          />
        </div>
        <Link
          href="/"
          className="text-sm text-foreground/60 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-md w-full space-y-8">
          {/* Title */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back
            </h1>
            <p className="text-muted-foreground mt-2">
              Sign in to your account
            </p>
          </div>

          {/* Login Form */}
          <div className="space-y-6">

            {/* Username Input with Floating Label */}
            <div className="relative">
              <Label
                htmlFor="username"
                className={`absolute left-3 transition-all duration-200 pointer-events-none z-10 ${isInputFocused || formData.usernameOrEmail
                  ? 'text-xs text-primary -top-2 px-1 bg-background'
                  : 'text-sm text-muted-foreground/70 top-3'
                  }`}
              >
                Username or Email
              </Label>
              <Input
                id="username"
                name="usernameOrEmail"
                type="text"
                autoComplete="username"
                required
                value={formData.usernameOrEmail}
                onChange={handleInputChange}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                className="h-12 rounded-full border border-gray-300 dark:border-gray-600 bg-background dark:bg-gray-900 text-foreground placeholder-transparent focus:border-primary focus-visible:ring-0 pt-4"
                placeholder=""
              />
            </div>

            {/* Password Input with Floating Label */}
            <div className="relative">
              <Label
                htmlFor="password"
                className={`absolute left-3 transition-all duration-200 pointer-events-none z-10 ${isPasswordFocused || formData.password
                  ? 'text-xs text-primary -top-2 px-1 bg-background'
                  : 'text-sm text-muted-foreground/70 top-3'
                  }`}
              >
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleInputChange}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                className="h-12 rounded-full border border-gray-300 dark:border-gray-600 bg-background dark:bg-gray-900 text-foreground placeholder-transparent focus:border-primary focus-visible:ring-0 pt-4 pr-12 [&::-webkit-credentials-auto-fill-button]:hidden [&::-webkit-contacts-auto-fill-button]:hidden [&::-webkit-reveal-password]:hidden [&::-ms-reveal-password]:hidden [&::-ms-credentials-auto-fill-button]:hidden"
                placeholder=""
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground z-20 bg-background dark:bg-gray-900 rounded-full p-1"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Continue Button */}
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading || !formData.usernameOrEmail || !formData.password}
              className="w-full h-12 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Continue'
              )}
            </Button>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Don&#39;t have an account?{' '}
                <Link
                  href="/role-selection"
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 text-muted-foreground bg-background z-10 relative">
                  OR
                </span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSocialLogin('google')}
                className="w-full h-12 bg-background dark:bg-gray-900 border border-border hover:bg-accent hover:text-accent-foreground dark:hover:bg-gray-800 rounded-full transition-all duration-200"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </Button>

              {/* 
                  <Button
                    type="button"
                    variant="outline"
                   onClick={() => handleSocialLogin('microsoft')}
                   className="w-full h-12 bg-background dark:bg-gray-900 border border-border hover:bg-accent hover:text-accent-foreground dark:hover:bg-gray-800 rounded-full transition-all duration-200"
                 >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 21 21">
                  <path fill="#f25022" d="M1 1h9v9H1z"/>
                  <path fill="#7fba00" d="M1 11h9v9H1z"/>
                  <path fill="#00a4ef" d="M11 1h9v9h-9z"/>
                  <path fill="#ffb900" d="M11 11h9v9h-9z"/>
                </svg>
                Continue with Microsoft
                  </Button>

                               <Button
                   type="button"
                   variant="outline"
                   onClick={() => handleSocialLogin('apple')}
                   className="w-full h-12 bg-background dark:bg-gray-900 border border-border hover:bg-accent hover:text-accent-foreground dark:hover:bg-gray-800 rounded-full transition-all duration-200"
                 >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#000000" d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Continue with Apple
              </Button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 