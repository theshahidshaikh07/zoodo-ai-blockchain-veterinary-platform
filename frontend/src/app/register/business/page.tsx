'use client';

import { useState, useEffect, useRef, type FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiService } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import OtpModal from '@/components/auth/OtpModal';

const categories = [
  { id: 'veterinarian', label: 'Veterinary & Healthcare' },
  { id: 'grooming', label: 'Grooming & Spa' },
  { id: 'trainer', label: 'Training & Behavior' },
  { id: 'insurance', label: 'Insurance & Protection' },
  { id: 'shop', label: 'Shop & Pharmacy' },
  { id: 'ngo', label: 'NGO & Rescue' },
  { id: 'transport', label: 'Transport & Travel' },
  { id: 'hotel', label: 'Hotel & Boarding' },
];

export default function BusinessRegistrationPage() {
  const router = useRouter();
  const { loginWithGoogle } = useAuth();

  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [isUsernameCustomized, setIsUsernameCustomized] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['veterinarian']);
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<{ checking: boolean; available: boolean | null; message: string }>({
    checking: false,
    available: null,
    message: '',
  });

  const [focused, setFocused] = useState<Record<string, boolean>>({});
  const setFocusedField = (name: string, val: boolean) =>
    setFocused(prev => ({ ...prev, [name]: val }));
  const isFloated = (name: string, value: string) => focused[name] || !!value;

  useEffect(() => {
    if (!isUsernameCustomized) {
      const source = businessName || `${firstName}${lastName}`;
      const combined = source.toLowerCase().replace(/[^a-z0-9_.]/g, '');
      if (combined) setUsername(combined);
    }
  }, [businessName, firstName, lastName, isUsernameCustomized]);

  // Debounced Instagram-style handle availability check
  useEffect(() => {
    if (!username || username.length < 3) {
      setUsernameStatus({ checking: false, available: null, message: '' });
      return;
    }

    const timer = setTimeout(async () => {
      setUsernameStatus(prev => ({ ...prev, checking: true }));
      try {
        const res = await apiService.checkUsername(username);
        if (res.success && res.data) {
          setUsernameStatus({
            checking: false,
            available: res.data.available,
            message: res.data.message,
          });
        }
      } catch {
        setUsernameStatus({ checking: false, available: null, message: '' });
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [username]);

  const toggleCategory = (id: string) => {
    if (selectedCategories.includes(id)) {
      if (selectedCategories.length > 1) setSelectedCategories(prev => prev.filter(c => c !== id));
    } else {
      setSelectedCategories(prev => [...prev, id]);
    }
  };

  const [oauthData, setOauthData] = useState<any>(null);
  const usernameRef = useRef<HTMLInputElement>(null);

  const applyOAuthData = (data: any) => {
    if (!data) return;
    setOauthData(data);
    setFirstName(data.firstName || '');
    setLastName(data.lastName || '');
    setEmail(data.email || '');
    setAgreedToTerms(true);

    const handle = (data.email || '').split('@')[0].toLowerCase().replace(/[^a-z0-9_.]/g, '');
    if (handle) {
      setUsername(handle);
      setIsUsernameCustomized(true);
    }

    setTimeout(() => {
      usernameRef.current?.focus();
    }, 150);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('oauth_user_data') || localStorage.getItem('oauth_user_data');
      if (saved) {
        try {
          applyOAuthData(JSON.parse(saved));
        } catch {}
      }

      const handleOAuthEvent = (e: any) => {
        if (e.detail) {
          applyOAuthData(e.detail);
        }
      };

      window.addEventListener('zoodo_oauth_loaded', handleOAuthEvent);
      return () => {
        window.removeEventListener('zoodo_oauth_loaded', handleOAuthEvent);
      };
    }
  }, []);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await loginWithGoogle('business');
      if (res && res.isNew && res.data) {
        applyOAuthData(res.data);
      } else {
        const saved = sessionStorage.getItem('oauth_user_data') || localStorage.getItem('oauth_user_data');
        if (saved) {
          try {
            applyOAuthData(JSON.parse(saved));
          } catch {}
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Google sign-in failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep1Next = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!firstName.trim() || !lastName.trim()) return setError('Please enter your full name.');
    if (!username.trim()) return setError('Please choose a handle.');
    if (!email.trim() || !email.includes('@')) return setError('Please enter a valid email.');
    if (!oauthData && password.length < 6) return setError('Password must be at least 6 characters.');
    if (!agreedToTerms) return setError('Please agree to the Terms & Privacy Policy.');

    // If Google registration, bypass OTP and go straight to Step 2 selection
    if (oauthData) {
      setStep(2);
      return;
    }

    // Email register: trigger user registration & dispatch OTP code right away
    setIsLoading(true);
    try {
      const res = await apiService.registerUser({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        username: `@${username.trim()}`,
        email: email.trim(),
        password,
        userType: 'business',
        businessName: 'Pending Business',
        categories: selectedCategories,
        phoneNumber: phone.trim() || 'N/A',
        city: city.trim() || 'N/A',
      });
      if (res.success) {
        setIsOtpOpen(true);
      } else {
        setError(res.message || 'Registration failed. Try a different handle.');
      }
    } catch (err: any) {
      setError(err?.message || 'Connection failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!businessName.trim()) return setError('Please enter your business name.');
    setIsLoading(true);
    try {
      const primaryCategory = selectedCategories[0];
      let mappedUserType = 'veterinarian';
      if (primaryCategory === 'trainer') mappedUserType = 'trainer';
      if (primaryCategory === 'hospital') mappedUserType = 'hospital';

      if (oauthData) {
        // Complete Google OAuth registration with custom username & business details
        const res = await apiService.authenticateWithGoogle({
          email: oauthData.email,
          googleId: oauthData.googleId,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          profilePhotoUrl: oauthData.profilePhotoUrl,
          username: username.trim(),
          userType: 'business',
          businessName: businessName.trim(),
          categories: selectedCategories,
        });

        if (res.success && res.data) {
          localStorage.setItem('jwt_token', res.data.token);
          localStorage.setItem('user', JSON.stringify(res.data.user));
          localStorage.setItem('zoodo_user', JSON.stringify(res.data.user));
          sessionStorage.removeItem('oauth_user_data');
          router.push('/dashboard/business');
        } else {
          setError(res.message || 'Google registration failed.');
        }
      } else {
        // Update business profile for OTP verified user
        await apiService.updateBusinessProfile({
          businessName: businessName.trim(),
          categories: selectedCategories,
          phone: phone.trim(),
          city: city.trim(),
        });
        router.push('/dashboard/business');
      }
    } catch (err: any) {
      setError(err?.message || 'Registration update failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    'h-12 rounded-full border border-gray-300 dark:border-gray-600 bg-background dark:bg-gray-900 text-foreground placeholder-transparent focus:border-primary focus-visible:ring-0 pt-4';
  const labelFloat = (name: string, val: string) =>
    `absolute left-4 transition-all duration-200 pointer-events-none z-10 ${
      isFloated(name, val)
        ? 'text-[10px] text-primary -top-1.5 px-1 bg-background'
        : 'text-sm text-muted-foreground/70 top-3.5'
    }`;

  return (
    <div className="h-screen overflow-hidden bg-background flex flex-col lg:flex-row">

      {/* ─── Left panel ─── */}
      <div className="hidden lg:flex flex-col justify-between w-[42%] bg-[#bde4e9]/30 dark:bg-primary/5 px-14 py-12 shrink-0">
        <Link href="/">
          <Image src="/pacifico-zoodo.png" alt="Zoodo" width={130} height={44} className="h-7 w-auto" priority />
        </Link>
        <div>
          <h2 className="text-4xl font-bold text-foreground leading-snug mb-4">
            Grow your practice<br />with Zoodo.
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed max-w-sm">
            List your services, manage appointments, and reach thousands of verified pet owners looking for trusted care.
          </p>
        </div>
        <p className="text-xs text-muted-foreground">© 2026 Zoodo. All rights reserved.</p>
      </div>

      {/* ─── Right panel ─── */}
      <div className="flex-1 h-full flex flex-col overflow-hidden">

        {/* Top bar — logo only */}
        <div className="flex items-center justify-center px-8 py-6 shrink-0 lg:hidden">
          <Link href="/">
            <Image
              src="/pacifico-zoodo.png"
              alt="Zoodo"
              width={110}
              height={36}
              className="h-6 w-auto"
              priority
            />
          </Link>
        </div>

        {/* Centred form */}
        <div className="flex-1 flex items-center justify-center px-8 sm:px-12 lg:px-16 overflow-hidden">
          <div className="w-full max-w-[360px]">

            <div className="text-center">
              <h1 className="text-2xl font-bold text-foreground mb-1">
                {step === 1 ? 'Create a business account' : 'Your business details'}
              </h1>
              <p className="text-sm text-muted-foreground mb-6">
                {step === 1 ? 'Free to join — get listed and start growing.' : 'Help customers find the right service.'}
              </p>
            </div>

            {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

            {/* ── STEP 1 ── */}
            {step === 1 && (
              <form onSubmit={handleStep1Next} className="space-y-3.5">
                <button type="button" disabled={isLoading} onClick={handleGoogleSignIn}
                  className="w-full h-12 flex items-center justify-center gap-3 rounded-full border border-gray-300 dark:border-gray-600 bg-background hover:bg-accent text-sm font-medium text-foreground transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  Continue with Google
                </button>

                <div className="relative flex items-center">
                  <div className="flex-1 border-t border-border" />
                  <span className="px-3 text-xs text-muted-foreground bg-background">or</span>
                  <div className="flex-1 border-t border-border" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <Label htmlFor="firstName" className={labelFloat('firstName', firstName)}>First name</Label>
                    <Input id="firstName" value={firstName} onChange={e => setFirstName(e.target.value)}
                      onFocus={() => setFocusedField('firstName', true)} onBlur={() => setFocusedField('firstName', false)}
                      className={inputClass} placeholder="" required />
                  </div>
                  <div className="relative">
                    <Label htmlFor="lastName" className={labelFloat('lastName', lastName)}>Last name</Label>
                    <Input id="lastName" value={lastName} onChange={e => setLastName(e.target.value)}
                      onFocus={() => setFocusedField('lastName', true)} onBlur={() => setFocusedField('lastName', false)}
                      className={inputClass} placeholder="" required />
                  </div>
                </div>

                <div className="relative">
                  <Label htmlFor="username"
                    className={`absolute transition-all duration-200 pointer-events-none z-10 ${isFloated('username', username) ? 'text-[10px] text-primary -top-1.5 px-1 bg-background left-4' : 'text-sm text-muted-foreground/70 top-3.5 left-9'}`}>
                    Handle
                  </Label>
                  <span className="absolute left-4 top-3.5 text-sm text-muted-foreground pointer-events-none z-10">@</span>
                  <Input id="username" ref={usernameRef} value={username}
                    onChange={e => { setIsUsernameCustomized(true); setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, '')); }}
                    onFocus={() => setFocusedField('username', true)} onBlur={() => setFocusedField('username', false)}
                    className={`${inputClass} pl-8 pr-24`} placeholder="" required />

                  {/* Real-time Instagram handle availability indicator */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-xs font-medium">
                    {usernameStatus.checking ? (
                      <span className="text-muted-foreground animate-pulse">Checking...</span>
                    ) : usernameStatus.available === true ? (
                      <span className="text-emerald-500 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Available
                      </span>
                    ) : usernameStatus.available === false ? (
                      <span className="text-rose-500 text-[11px]">Taken</span>
                    ) : null}
                  </div>
                </div>

                <div className="relative">
                  <Label htmlFor="email" className={labelFloat('email', email)}>Work email</Label>
                  <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)}
                    onFocus={() => setFocusedField('email', true)} onBlur={() => setFocusedField('email', false)}
                    className={inputClass} placeholder="" required />
                </div>

                {!oauthData && (
                  <div className="relative">
                    <Label htmlFor="password" className={labelFloat('password', password)}>Password</Label>
                    <Input id="password" type={showPassword ? 'text' : 'password'} value={password}
                      onChange={e => setPassword(e.target.value)}
                      onFocus={() => setFocusedField('password', true)} onBlur={() => setFocusedField('password', false)}
                      className={`${inputClass} pr-12`} placeholder="" required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                )}

                {/* Terms checkbox */}
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <div
                    onClick={() => setAgreedToTerms(!agreedToTerms)}
                    className={`mt-0.5 w-4 h-4 rounded shrink-0 flex items-center justify-center border transition-all ${agreedToTerms ? 'bg-primary border-primary' : 'border-gray-300 dark:border-gray-600'}`}
                  >
                    {agreedToTerms && <Check className="w-2.5 h-2.5 text-white" />}
                  </div>
                  <span className="text-xs text-muted-foreground leading-relaxed">
                    I agree to Zoodo's{' '}
                    <Link href="/terms" className="text-foreground underline hover:text-primary">Terms of Service</Link>
                    {' '}and{' '}
                    <Link href="/privacy" className="text-foreground underline hover:text-primary">Privacy Policy</Link>
                  </span>
                </label>

                <Button type="submit"
                  className="w-full h-12 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all">
                  Continue
                </Button>

                <p className="text-center text-sm text-muted-foreground pt-1">
                  Already have an account?{' '}
                  <Link href="/login" className="text-primary font-medium hover:underline">Log in</Link>
                </p>
              </form>
            )}

            {/* ── STEP 2 ── */}
            {step === 2 && (
              <form onSubmit={handleFinalSubmit} className="space-y-3.5">
                <div className="relative">
                  <Label htmlFor="businessName" className={labelFloat('businessName', businessName)}>Business name</Label>
                  <Input id="businessName" value={businessName} onChange={e => setBusinessName(e.target.value)}
                    onFocus={() => setFocusedField('businessName', true)} onBlur={() => setFocusedField('businessName', false)}
                    className={inputClass} placeholder="" required />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-2.5">What best describes your service?</p>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map(cat => {
                      const sel = selectedCategories.includes(cat.id);
                      return (
                        <button key={cat.id} type="button" onClick={() => toggleCategory(cat.id)}
                          className={`flex items-center justify-between px-3.5 py-2.5 rounded-full border text-sm transition-all ${sel ? 'bg-primary/10 border-primary text-foreground font-medium' : 'border-gray-300 dark:border-gray-600 text-muted-foreground hover:border-gray-400'}`}>
                          <span>{cat.label}</span>
                          {sel && <Check className="w-3.5 h-3.5 text-primary ml-1 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <Label htmlFor="phone" className={labelFloat('phone', phone)}>Phone</Label>
                    <Input id="phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                      onFocus={() => setFocusedField('phone', true)} onBlur={() => setFocusedField('phone', false)}
                      className={inputClass} placeholder="" />
                  </div>
                  <div className="relative">
                    <Label htmlFor="city" className={labelFloat('city', city)}>City</Label>
                    <Input id="city" value={city} onChange={e => setCity(e.target.value)}
                      onFocus={() => setFocusedField('city', true)} onBlur={() => setFocusedField('city', false)}
                      className={inputClass} placeholder="" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button type="button" onClick={() => setStep(1)}
                    className="h-12 rounded-full border border-gray-300 dark:border-gray-600 text-sm text-foreground hover:border-primary transition-all font-medium">
                    Back
                  </button>
                  <Button type="submit" disabled={isLoading}
                    className="h-12 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all disabled:opacity-50">
                    {isLoading
                      ? <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />Creating...</span>
                      : 'Create account'}
                  </Button>
                </div>
              </form>
            )}

          </div>
        </div>

      </div>
      <OtpModal
        isOpen={isOtpOpen}
        email={email}
        onSuccess={() => {
          setIsOtpOpen(false);
          setStep(2);
        }}
        onClose={() => setIsOtpOpen(false)}
      />
    </div>
  );
}
