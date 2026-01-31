'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from 'next-themes';
import Image from 'next/image';

interface AdminFormData {
  usernameOrEmail: string;
  password: string;
}

export default function AdminLoginPage() {
  const [formData, setFormData] = useState<AdminFormData>({
    usernameOrEmail: '',
    password: ''
  });
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const { loginAdmin, isLoading, isAuthenticated } = useAuth();



  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard/admin');
    }
  }, [isAuthenticated, router]);

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

    const success = await loginAdmin({
      usernameOrEmail: formData.usernameOrEmail,
      password: formData.password
    });

    if (success) {
      router.push('/dashboard/admin');
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
              Admin Login
            </h1>
            <p className="text-muted-foreground mt-2">
              Sign in to your admin account
            </p>
          </div>

          {/* Admin Login Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>

            {/* Username Input with Floating Label */}
            <div className="relative">
              <Label
                htmlFor="admin-username"
                className={`absolute left-3 transition-all duration-200 pointer-events-none z-10 ${isInputFocused || formData.usernameOrEmail
                  ? 'text-xs text-primary -top-2 px-1 bg-background'
                  : 'text-sm text-muted-foreground/70 top-3'
                  }`}
              >
                Username or Email
              </Label>
              <Input
                id="admin-username"
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
                htmlFor="admin-password"
                className={`absolute left-3 transition-all duration-200 pointer-events-none z-10 ${isPasswordFocused || formData.password
                  ? 'text-xs text-primary -top-2 px-1 bg-background'
                  : 'text-sm text-muted-foreground/70 top-3'
                  }`}
              >
                Password
              </Label>
              <Input
                id="admin-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
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
              type="submit"
              disabled={isLoading || !formData.usernameOrEmail || !formData.password}
              className="w-full h-12 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                  Signing in as Admin...
                </div>
              ) : (
                'Sign in as Admin'
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}