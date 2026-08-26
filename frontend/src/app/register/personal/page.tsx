'use client';

import { useState, useEffect, useRef, type FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiService } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import OtpModal from '@/components/auth/OtpModal';

const SPECIES_OPTIONS = ['Dog', 'Cat', 'Bird', 'Rabbit', 'Hamster', 'Fish', 'Other'];

interface PetData {
  id: string;
  name: string;
  species: string;
  customSpecies: string;
  breed: string;
  gender: 'male' | 'female' | 'unknown';
  birthday: string;
  age: string;
  ageUnit: 'Years' | 'Months' | 'Days';
  weight: string;
  weightUnit: 'Kgs' | 'Lbs';
  sterilized: boolean;
  microchip: string;
}

function calcAge(birthday: string): { value: string; unit: 'Years' | 'Months' | 'Days' } {
  if (!birthday) return { value: '', unit: 'Years' };
  const dob = new Date(birthday);
  const now = new Date();
  const totalDays = Math.floor((now.getTime() - dob.getTime()) / 86400000);
  if (totalDays < 0) return { value: '', unit: 'Years' };
  if (totalDays < 30) return { value: String(totalDays), unit: 'Days' };
  const months = Math.floor(totalDays / 30.44);
  if (months < 12) return { value: String(months), unit: 'Months' };
  return { value: String(Math.floor(months / 12)), unit: 'Years' };
}

function makePet(): PetData {
  return {
    id: Math.random().toString(36).slice(2, 9),
    name: '', species: '', customSpecies: '', breed: '',
    gender: 'unknown', birthday: '', age: '', ageUnit: 'Years',
    weight: '', weightUnit: 'Kgs', sterilized: false, microchip: '',
  };
}

/* ── Shared atoms ── */
const FieldBox = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`h-11 flex items-center rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 overflow-hidden ${className}`}>
    {children}
  </div>
);

/* ─────────────────────────────────────────────────────────────
   PetCard — defined at MODULE LEVEL (outside the page component)
   so React never remounts it on parent state change → no focus loss
   ───────────────────────────────────────────────────────────── */
interface PetCardProps {
  pet: PetData;
  idx: number;
  isLast: boolean;
  totalPets: number;
  onUpdate: (id: string, field: keyof PetData, val: string | boolean) => void;
  onUpdateBirthday: (id: string, birthday: string) => void;
  onRemove: (id: string) => void;
  onAddPet: () => void;
}

function PetCard({ pet, idx, isLast, totalPets, onUpdate, onUpdateBirthday, onRemove, onAddPet }: PetCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden">

      {/* Card header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {pet.name || `Pet ${idx + 1}`}
        </span>
        {totalPets > 1 && (
          <button type="button" onClick={() => onRemove(pet.id)}
            className="text-muted-foreground hover:text-red-500 transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="p-4 space-y-2.5">

        {/* Name + Gender */}
        <div className="flex gap-2">
          <FieldBox className="flex-1">
            <input
              type="text"
              placeholder="Pet's Name"
              value={pet.name}
              onChange={e => onUpdate(pet.id, 'name', e.target.value)}
              className="w-full h-full bg-transparent text-sm text-foreground px-3.5 outline-none placeholder:text-muted-foreground/50"
            />
          </FieldBox>
          <div className="flex rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
            {(['male', 'female', 'unknown'] as const).map(g => (
              <button key={g} type="button" onClick={() => onUpdate(pet.id, 'gender', g)}
                className={`px-3 h-11 text-xs capitalize transition-all border-r last:border-r-0 border-gray-200 dark:border-gray-700 ${
                  pet.gender === g
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'bg-white dark:bg-gray-950 text-muted-foreground hover:bg-gray-50 dark:hover:bg-gray-900'
                }`}>
                {g.charAt(0).toUpperCase() + g.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Species + Breed */}
        <div className="grid grid-cols-2 gap-2">
          <FieldBox>
            <select
              value={pet.species}
              onChange={e => onUpdate(pet.id, 'species', e.target.value)}
              className={`w-full h-full bg-transparent text-sm px-3.5 outline-none appearance-none cursor-pointer ${
                pet.species ? 'text-foreground' : 'text-muted-foreground/50'
              }`}
            >
              <option value="" disabled>Pet Species</option>
              {SPECIES_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </FieldBox>
          <FieldBox>
            {pet.species === 'Other'
              ? (
                <input type="text" placeholder="Species name…" value={pet.customSpecies}
                  onChange={e => onUpdate(pet.id, 'customSpecies', e.target.value)}
                  className="w-full h-full bg-transparent text-sm text-foreground px-3.5 outline-none placeholder:text-muted-foreground/50" />
              ) : (
                <input type="text" placeholder="Breed (Optional)" value={pet.breed}
                  onChange={e => onUpdate(pet.id, 'breed', e.target.value)}
                  className="w-full h-full bg-transparent text-sm text-foreground px-3.5 outline-none placeholder:text-muted-foreground/50" />
              )
            }
          </FieldBox>
        </div>

        {/* Breed row when Other */}
        {pet.species === 'Other' && (
          <FieldBox>
            <input type="text" placeholder="Breed (Optional)" value={pet.breed}
              onChange={e => onUpdate(pet.id, 'breed', e.target.value)}
              className="w-full h-full bg-transparent text-sm text-foreground px-3.5 outline-none placeholder:text-muted-foreground/50" />
          </FieldBox>
        )}

        {/* Birthdate */}
        <FieldBox>
          <input
            type="date"
            value={pet.birthday}
            max={new Date().toISOString().split('T')[0]}
            onChange={e => onUpdateBirthday(pet.id, e.target.value)}
            className="w-full h-full bg-transparent text-sm text-foreground px-3.5 outline-none"
          />
        </FieldBox>

        {/* Age + Weight */}
        <div className="grid grid-cols-2 gap-2">
          <FieldBox>
            <input type="number" min={0} placeholder="Pet Age"
              value={pet.age}
              onChange={e => onUpdate(pet.id, 'age', e.target.value)}
              className="flex-1 h-full bg-transparent text-sm px-3.5 outline-none text-foreground placeholder:text-muted-foreground/50 w-0 min-w-0"
            />
            <div className="border-l border-gray-200 dark:border-gray-700 shrink-0">
              <select value={pet.ageUnit} onChange={e => onUpdate(pet.id, 'ageUnit', e.target.value)}
                className="h-11 bg-transparent text-xs text-muted-foreground px-2 pr-5 outline-none appearance-none cursor-pointer">
                <option value="Years">Years</option>
                <option value="Months">Months</option>
                <option value="Days">Days</option>
              </select>
            </div>
          </FieldBox>
          <FieldBox>
            <input type="number" min={0} step={0.1} placeholder="Pet Weight"
              value={pet.weight}
              onChange={e => onUpdate(pet.id, 'weight', e.target.value)}
              className="flex-1 h-full bg-transparent text-sm px-3.5 outline-none text-foreground placeholder:text-muted-foreground/50 w-0 min-w-0"
            />
            <div className="border-l border-gray-200 dark:border-gray-700 shrink-0">
              <select value={pet.weightUnit} onChange={e => onUpdate(pet.id, 'weightUnit', e.target.value)}
                className="h-11 bg-transparent text-xs text-muted-foreground px-2 pr-5 outline-none appearance-none cursor-pointer">
                <option value="Kgs">Kgs</option>
                <option value="Lbs">Lbs</option>
              </select>
            </div>
          </FieldBox>
        </div>

        {/* Microchip */}
        <FieldBox>
          <input type="text" placeholder="Microchip Number (Optional)" value={pet.microchip}
            onChange={e => onUpdate(pet.id, 'microchip', e.target.value)}
            className="w-full h-full bg-transparent text-sm text-foreground px-3.5 outline-none placeholder:text-muted-foreground/50" />
        </FieldBox>

        {/* Sterilized + Add Pet */}
        <div className="flex items-center justify-between pt-0.5">
          <div className="flex gap-2">
            {([true, false] as const).map(val => (
              <button key={String(val)} type="button" onClick={() => onUpdate(pet.id, 'sterilized', val)}
                className={`h-9 px-4 rounded-full border text-sm transition-all ${
                  pet.sterilized === val
                    ? 'border-primary text-primary font-medium bg-primary/5'
                    : 'border-gray-200 dark:border-gray-700 text-muted-foreground hover:border-gray-300'
                }`}>
                {val ? 'Sterilized' : 'Not Sterilized'}
              </button>
            ))}
          </div>
          {isLast && (
            <button type="button" onClick={onAddPet}
              className="text-sm text-primary hover:underline font-medium">
              + Add Pet
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Page Component
   ───────────────────────────────────────────────────────────── */
export default function PersonalRegistrationPage() {
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
  const [usernameStatus, setUsernameStatus] = useState<{ checking: boolean; available: boolean | null; message: string }>({
    checking: false,
    available: null,
    message: '',
  });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pets, setPets] = useState<PetData[]>([makePet()]);
  const [isOtpOpen, setIsOtpOpen] = useState(false);

  const [focused, setFocused] = useState<Record<string, boolean>>({});
  const ff = (name: string, v: boolean) => setFocused(p => ({ ...p, [name]: v }));
  const fl = (name: string, val: string) =>
    `absolute left-4 transition-all duration-200 pointer-events-none z-10 ${
      focused[name] || !!val
        ? 'text-[10px] text-primary -top-1.5 px-1 bg-background'
        : 'text-sm text-muted-foreground/70 top-3.5'
    }`;

  useEffect(() => {
    if (!isUsernameCustomized) {
      const c = `${firstName}${lastName}`.toLowerCase().replace(/[^a-z0-9_.]/g, '');
      if (c) setUsername(c);
    }
  }, [firstName, lastName, isUsernameCustomized]);

  // Debounced real-time Instagram-style handle availability check
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
        } else {
          setUsernameStatus({ checking: false, available: null, message: '' });
        }
      } catch {
        setUsernameStatus({ checking: false, available: null, message: '' });
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [username]);

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
      const res = await loginWithGoogle('pet_owner');
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

  const handleStep1 = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!firstName.trim() || !lastName.trim()) return setError('Please enter your full name.');
    if (!username.trim()) return setError('Please choose a username.');
    if (!email.trim() || !email.includes('@')) return setError('Please enter a valid email.');
    if (!oauthData && password.length < 6) return setError('Password must be at least 6 characters.');
    if (!agreedToTerms) return setError('Please agree to the Terms & Privacy Policy.');

    // If it's a Google Signup, authenticate & create user immediately at Step 1
    if (oauthData) {
      setIsLoading(true);
      try {
        const res = await apiService.authenticateWithGoogle({
          email: oauthData.email,
          googleId: oauthData.googleId,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          profilePhotoUrl: oauthData.profilePhotoUrl,
          username: username.trim(),
          userType: 'pet_owner',
        });
        if (res.success && res.data) {
          localStorage.setItem('jwt_token', res.data.token);
          localStorage.setItem('user', JSON.stringify(res.data.user));
          localStorage.setItem('zoodo_user', JSON.stringify(res.data.user));
          sessionStorage.removeItem('oauth_user_data');
          setStep(2);
        } else {
          setError(res.message || 'Google registration failed.');
        }
      } catch (err: any) {
        setError(err?.message || 'Connection failed.');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Otherwise: trigger account generation & OTP dispatch immediately
    setIsLoading(true);
    try {
      const res = await apiService.registerUser({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        username: `@${username.trim()}`,
        email: email.trim(),
        password,
        userType: 'pet_owner',
      });
      if (res.success) {
        setIsOtpOpen(true);
      } else {
        setError(res.message || 'Registration failed. Choose another username.');
      }
    } catch (err: any) {
      setError(err?.message || 'Connection failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const upd = (id: string, field: keyof PetData, val: string | boolean) =>
    setPets(p => p.map(x => x.id === id ? { ...x, [field]: val } : x));

  const updBirthday = (id: string, birthday: string) => {
    const { value, unit } = calcAge(birthday);
    setPets(p => p.map(x => x.id === id ? { ...x, birthday, age: value, ageUnit: unit } : x));
  };

  const handleSubmit = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setError('');
    
    const validPets = pets.filter(p => p.name.trim()).map(p => ({
      name: p.name.trim(),
      species: p.species === 'Other' ? (p.customSpecies.trim() || 'Other') : p.species,
      breed: p.breed.trim() || undefined,
      gender: p.gender,
      birthday: p.birthday || undefined,
      age: p.age ? Number(p.age) : undefined,
      ageUnit: p.ageUnit,
      weight: p.weight ? Number(p.weight) : undefined,
      weightUnit: p.weightUnit,
      sterilized: p.sterilized,
      microchip: p.microchip.trim() || undefined,
    }));

    try {
      // User is already authenticated; save any added pets
      for (const pet of validPets) {
        await apiService.createPet(pet as any).catch(() => {});
      }
      if (validPets.length > 0) {
        localStorage.setItem('zoodo_pets', JSON.stringify(validPets));
      }
      router.push('/dashboard/pet-owner');
    } catch (err: any) {
      setError(err?.message || 'Could not save pets.');
    } finally {
      setIsLoading(false);
    }
  };

  const inp = 'h-12 rounded-full border border-gray-300 dark:border-gray-600 bg-background dark:bg-gray-900 text-foreground placeholder-transparent focus:border-primary focus-visible:ring-0 pt-4 text-sm';

  return (
    <div className="h-screen overflow-hidden bg-background flex flex-col lg:flex-row">

      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[40%] bg-[#bde4e9]/30 dark:bg-primary/5 px-14 py-12 shrink-0">
        <Link href="/"><Image src="/pacifico-zoodo.png" alt="Zoodo" width={130} height={44} className="h-7 w-auto" priority /></Link>
        <div>
          <h2 className="text-4xl font-bold text-foreground leading-snug mb-4">Your pet's health,<br />all in one place.</h2>
          <p className="text-muted-foreground text-base leading-relaxed max-w-sm">Book vets, track health records, find groomers, adopt pets, and connect with a community that loves animals.</p>
        </div>
        <p className="text-xs text-muted-foreground">© 2026 Zoodo. All rights reserved.</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 h-full flex flex-col overflow-hidden">
        <div className="flex items-center justify-center py-5 shrink-0 lg:hidden">
          <Link href="/"><Image src="/pacifico-zoodo.png" alt="Zoodo" width={110} height={36} className="h-6 w-auto" priority /></Link>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="min-h-full flex items-start lg:items-center justify-center px-6 sm:px-10 lg:px-14 py-8">
            <div className="w-full max-w-[400px]">

              <div className="text-center mb-7">
                <h1 className="text-2xl font-bold text-foreground mb-1">Create your account</h1>
                <p className="text-sm text-muted-foreground">
                  {step === 1 ? 'Free — no credit card needed.' : 'For Pet Parents'}
                </p>
              </div>

              {error && <p className="text-sm text-red-500 mb-4 text-center">{error}</p>}

              {/* ── STEP 1 ── */}
              {step === 1 && (
                <form onSubmit={handleStep1} className="space-y-4">
                  <button type="button" disabled={isLoading} onClick={handleGoogleSignIn}
                    className="w-full h-12 flex items-center justify-center gap-3 rounded-full border border-border bg-background hover:bg-accent text-sm font-medium text-foreground transition-all disabled:opacity-50 disabled:cursor-not-allowed">
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
                      <Label htmlFor="firstName" className={fl('firstName', firstName)}>First name</Label>
                      <Input id="firstName" value={firstName} onChange={e => setFirstName(e.target.value)}
                        onFocus={() => ff('firstName', true)} onBlur={() => ff('firstName', false)}
                        className={inp} placeholder="" required />
                    </div>
                    <div className="relative">
                      <Label htmlFor="lastName" className={fl('lastName', lastName)}>Last name</Label>
                      <Input id="lastName" value={lastName} onChange={e => setLastName(e.target.value)}
                        onFocus={() => ff('lastName', true)} onBlur={() => ff('lastName', false)}
                        className={inp} placeholder="" required />
                    </div>
                  </div>
                  <div className="relative">
                    <Label htmlFor="username"
                      className={`absolute transition-all duration-200 pointer-events-none z-10 ${focused['username'] || username ? 'text-[10px] text-primary -top-1.5 px-1 bg-background left-4' : 'text-sm text-muted-foreground/70 top-3.5 left-9'}`}>
                      Username
                    </Label>
                    <span className="absolute left-4 top-3.5 text-sm text-muted-foreground pointer-events-none z-10">@</span>
                    <Input id="username" ref={usernameRef} value={username}
                      onChange={e => { setIsUsernameCustomized(true); setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, '')); }}
                      onFocus={() => ff('username', true)} onBlur={() => ff('username', false)}
                      className={`${inp} pl-8 pr-24`} placeholder="" required />
                    
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
                    <Label htmlFor="email" className={fl('email', email)}>Email address</Label>
                    <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)}
                      onFocus={() => ff('email', true)} onBlur={() => ff('email', false)}
                      className={inp} placeholder="" required />
                  </div>
                  {!oauthData && (
                    <div className="relative">
                      <Label htmlFor="password" className={fl('password', password)}>Password</Label>
                      <Input id="password" type={showPassword ? 'text' : 'password'} value={password}
                        onChange={e => setPassword(e.target.value)}
                        onFocus={() => ff('password', true)} onBlur={() => ff('password', false)}
                        className={`${inp} pr-12`} placeholder="" required />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  )}
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <div onClick={() => setAgreedToTerms(!agreedToTerms)}
                      className={`mt-0.5 w-4 h-4 rounded shrink-0 flex items-center justify-center border transition-all ${agreedToTerms ? 'bg-primary border-primary' : 'border-border'}`}>
                      {agreedToTerms && <Check className="w-2.5 h-2.5 text-white" />}
                    </div>
                    <span className="text-xs text-muted-foreground leading-relaxed">
                      I agree to Zoodo's{' '}
                      <Link href="/terms" className="text-foreground underline hover:text-primary">Terms of Service</Link>
                      {' '}and{' '}
                      <Link href="/privacy" className="text-foreground underline hover:text-primary">Privacy Policy</Link>
                    </span>
                  </label>
                  <Button type="submit" className="w-full h-12 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all">
                    Continue
                  </Button>
                  <p className="text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link href="/login" className="text-primary font-medium hover:underline">Log in</Link>
                  </p>
                </form>
              )}

              {/* ── STEP 2 ── */}
              {step === 2 && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="text-center">
                    <button type="button" onClick={() => router.push('/dashboard/pet-owner')}
                      className="h-9 px-6 rounded-full border border-border text-sm text-foreground hover:border-primary transition-all">
                      Skip for now
                    </button>
                  </div>

                  {pets.map((pet, idx) => (
                    <PetCard
                      key={pet.id}
                      pet={pet}
                      idx={idx}
                      isLast={idx === pets.length - 1}
                      totalPets={pets.length}
                      onUpdate={upd}
                      onUpdateBirthday={updBirthday}
                      onRemove={id => setPets(p => p.filter(x => x.id !== id))}
                      onAddPet={() => setPets(p => [...p, makePet()])}
                    />
                  ))}

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <button type="button" onClick={() => setStep(1)}
                      className="h-12 rounded-full border border-border text-sm text-foreground hover:border-primary transition-all font-medium">
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
