'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import chatgptHero from '@/assets/ChatGPT Image Sep 18, 2025, 11_39_46 AM.png';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Eye, EyeOff, ArrowLeft, Loader2, ChevronDown, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { apiService } from '@/lib/api';

interface PetInfo {
  name: string;
  gender: 'male' | 'female' | 'unknown';
  species: string;
  breed?: string;
  birthday?: string;
  age?: string;
  ageUnit?: 'Years' | 'Months' | 'Days';
  weight?: string;
  weightUnit?: 'Kgs' | 'Gms';
  microchip?: string;
  sterilized?: 'yes' | 'no';
}

interface FormData {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  postalCode: string;
  country: string;
  pets: PetInfo[];
}

function PetOwnerWizard() {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    postalCode: '',
    country: 'India',
    pets: [
      {
        name: '',
        gender: 'unknown',
        species: '',
        breed: '',
        birthday: '',
        age: '',
        ageUnit: 'Years',
        weight: '',
        weightUnit: 'Kgs',
        microchip: '',
        sterilized: 'yes',
      },
    ],
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Floating label states
  const [isFirstNameFocused, setIsFirstNameFocused] = useState(false);
  const [isLastNameFocused, setIsLastNameFocused] = useState(false);
  const [isUsernameFocused, setIsUsernameFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSocialLogin = (provider: 'google' | 'microsoft' | 'apple') => {
    console.log(`Logging in with ${provider}`);
    // Implement social login logic here
  };

  // Helper: compute age and unit from a birthday
  const computeAgeFromBirthday = (iso: string): { value: string; unit: 'Years' | 'Months' | 'Days' } => {
    try {
      const dob = new Date(iso);
      if (isNaN(dob.getTime())) return { value: '', unit: 'Years' };
      const now = new Date();
      let years = now.getFullYear() - dob.getFullYear();
      const m = now.getMonth() - dob.getMonth();
      const d = now.getDate() - dob.getDate();
      if (m < 0 || (m === 0 && d < 0)) years--;
      if (years > 0) return { value: String(years), unit: 'Years' };
      // months
      const months = (now.getFullYear() - dob.getFullYear()) * 12 + (now.getMonth() - dob.getMonth()) - (now.getDate() < dob.getDate() ? 1 : 0);
      if (months > 0) return { value: String(months), unit: 'Months' };
      // days
      const diffMs = now.getTime() - dob.getTime();
      const days = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
      return { value: String(days), unit: 'Days' };
    } catch {
      return { value: '', unit: 'Years' };
    }
  };

  const validateStep = (step: number): boolean => {
    if (step === 1) {
      if (
        !formData.username ||
        !formData.firstName ||
        !formData.lastName ||
        !formData.email ||
        !formData.password ||
        !formData.confirmPassword
      ) {
        setError('Please fill in all required fields');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long');
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Please enter a valid email address');
        return false;
      }
    }
    if (step === 2) {
      if (
        !formData.addressLine1 ||
        !formData.addressLine2 ||
        !formData.city ||
        !formData.postalCode ||
        !formData.country
      ) {
        setError('Please complete your address');
        return false;
      }
    }
    if (step === 3) {
      const first = formData.pets[0];
      if (!first || !first.name || !first.species) {
        setError("Your pet's name and species are required");
        return false;
      }
    }
    setError('');
    return true;
  };

  const nextStep = () => {
    // Only enforce validation on Step 1. Steps 2 and 3 are optional when proceeding.
    if (currentStep === 1 && !validateStep(1)) return;
    setCurrentStep((s) => Math.min(3, s + 1));
  };
  const prevStep = () => setCurrentStep((s) => Math.max(1, s - 1));
  const skipStep = () => {
    setError('');
    if (currentStep < 3) setCurrentStep((s) => Math.min(3, s + 1));
    else handleSubmit();
  };

  const handleSubmit = async () => {
    if (!validateStep(1)) return;
    setIsLoading(true);
    setError('');
    const address = `${formData.addressLine1}, ${formData.addressLine2}, ${formData.city} ${formData.postalCode}, ${formData.country}`;
    try {
      const res = await apiService.registerUser({
        username: formData.username,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        userType: 'pet_owner',
        address,
      });
      if (res.success) router.push('/dashboard');
      else setError(res.message || 'Registration failed');
    } catch {
      setError('An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Header */}
      <div className="relative z-10 flex justify-between items-center p-4 sm:p-6">
        <div className="flex items-center">
          <Image
            src={mounted && resolvedTheme === 'dark' ? '/Z-light.png' : '/Z.png'}
            alt="Zoodo"
            width={120}
            height={40}
            className="h-3 md:h-4 lg:h-5 w-auto"
            priority
          />
        </div>
        <Link href="/role-selection" className="text-sm text-foreground/60 hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>

      {/* Main */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-6">
        <div className="w-full max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Visual */}
            <div className="hidden lg:block relative rounded-2xl overflow-hidden border border-border min-h-[560px]">
              <Image
                src={chatgptHero}
                alt="Happy pet owner with dog and cat"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-background/20 via-transparent to-transparent" />
            </div>

            {/* Form Panel */}
            <div className="max-w-xl w-full mx-auto">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full border border-border text-foreground/80 bg-card/40">
                  Step {currentStep} of 3
                </div>
                <h1 className="text-3xl font-bold text-foreground mt-3">Create your account</h1>
                <p className="text-muted-foreground mt-1">For Pet Parents</p>
              </div>

              {error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm mb-4">
                  {error}
                </div>
              )}

              {/* Step 1 */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <Label htmlFor="firstName" className={`absolute left-3 transition-all duration-200 pointer-events-none z-10 ${
                        isFirstNameFocused || formData.firstName ? 'text-xs text-primary -top-2 px-1 bg-background' : 'text-sm text-muted-foreground/70 top-3'
                      }`}>First Name</Label>
                      <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} onFocus={()=>setIsFirstNameFocused(true)} onBlur={()=>setIsFirstNameFocused(false)} className="h-12 rounded-full pt-4" />
                    </div>
                    <div className="relative">
                      <Label htmlFor="lastName" className={`absolute left-3 transition-all duration-200 pointer-events-none z-10 ${
                        isLastNameFocused || formData.lastName ? 'text-xs text-primary -top-2 px-1 bg-background' : 'text-sm text-muted-foreground/70 top-3'
                      }`}>Last Name</Label>
                      <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} onFocus={()=>setIsLastNameFocused(true)} onBlur={()=>setIsLastNameFocused(false)} className="h-12 rounded-full pt-4" />
                    </div>
                  </div>

                  <div className="relative">
                    <Label htmlFor="email" className={`absolute left-3 transition-all duration-200 pointer-events-none z-10 ${
                      isEmailFocused || formData.email ? 'text-xs text-primary -top-2 px-1 bg-background' : 'text-sm text-muted-foreground/70 top-3'
                    }`}>Email address</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} onFocus={()=>setIsEmailFocused(true)} onBlur={()=>setIsEmailFocused(false)} className="h-12 rounded-full pt-4" />
                  </div>

                  <div className="relative">
                    <Label htmlFor="username" className={`absolute left-3 transition-all duration-200 pointer-events-none z-10 ${
                      isUsernameFocused || formData.username ? 'text-xs text-primary -top-2 px-1 bg-background' : 'text-sm text-muted-foreground/70 top-3'
                    }`}>Username</Label>
                    <Input id="username" name="username" value={formData.username} onChange={handleInputChange} onFocus={()=>setIsUsernameFocused(true)} onBlur={()=>setIsUsernameFocused(false)} className="h-12 rounded-full pt-4" />
                  </div>

                  <div className="relative">
                    <Label htmlFor="password" className={`absolute left-3 transition-all duration-200 pointer-events-none z-10 ${
                      isPasswordFocused || formData.password ? 'text-xs text-primary -top-2 px-1 bg-background' : 'text-sm text-muted-foreground/70 top-3'
                    }`}>Password</Label>
                    <Input id="password" name="password" type={showPassword? 'text':'password'} value={formData.password} onChange={handleInputChange} onFocus={()=>setIsPasswordFocused(true)} onBlur={()=>setIsPasswordFocused(false)} className="h-12 rounded-full pt-4 pr-12" />
                    <button type="button" onClick={()=>setShowPassword(v=>!v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground z-20 bg-background rounded-full p-1">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  <div className="relative">
                    <Label htmlFor="confirmPassword" className={`absolute left-3 transition-all duration-200 pointer-events-none z-10 ${
                      isConfirmPasswordFocused || formData.confirmPassword ? 'text-xs text-primary -top-2 px-1 bg-background' : 'text-sm text-muted-foreground/70 top-3'
                    }`}>Confirm Password</Label>
                    <Input id="confirmPassword" name="confirmPassword" type={showConfirmPassword? 'text':'password'} value={formData.confirmPassword} onChange={handleInputChange} onFocus={()=>setIsConfirmPasswordFocused(true)} onBlur={()=>setIsConfirmPasswordFocused(false)} className="h-12 rounded-full pt-4 pr-12" />
                    <button type="button" onClick={()=>setShowConfirmPassword(v=>!v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground z-20 bg-background rounded-full p-1">
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  <div className="flex gap-3">
                    <Button type="button" onClick={nextStep} className="h-12 rounded-full flex-1 bg-primary text-primary-foreground">Next</Button>
                  </div>

                  {/* Divider */}
                  <div className="relative my-6">
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
                      className="w-full h-12 bg-background border border-border hover:bg-accent hover:text-accent-foreground rounded-full transition-all duration-200"
                    >
                      <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Continue with Google
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleSocialLogin('microsoft')}
                      className="w-full h-12 bg-background border border-border hover:bg-accent hover:text-accent-foreground rounded-full transition-all duration-200"
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
                      className="w-full h-12 bg-background border border-border hover:bg-accent hover:text-accent-foreground rounded-full transition-all duration-200"
                    >
                      <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                        <path fill="#000000" d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                      </svg>
                      Continue with Apple
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Address */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  {/* Top actions: Skip */}
                  <div className="flex items-center justify-center">
                    <button
                      type="button"
                      onClick={skipStep}
                      className="inline-flex items-center gap-2 text-sm rounded-full border border-primary bg-primary/10 px-5 py-2 text-primary hover:bg-primary/15 transition-colors"
                    >
                      Skip for now
                    </button>
                  </div>
                  <div className="relative">
                    <Label htmlFor="addressLine1" className="sr-only">Address Line 1</Label>
                    <Input id="addressLine1" name="addressLine1" value={formData.addressLine1} onChange={handleInputChange} placeholder="Address Line 1" className="h-12 rounded-xl" />
                  </div>
                  <div className="relative">
                    <Label htmlFor="addressLine2" className="sr-only">Address Line 2</Label>
                    <Input id="addressLine2" name="addressLine2" value={formData.addressLine2} onChange={handleInputChange} placeholder="Address Line 2" className="h-12 rounded-xl" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <Label htmlFor="city" className="sr-only">City</Label>
                      <Input id="city" name="city" value={formData.city} onChange={handleInputChange} placeholder="City" className="h-12 rounded-xl" />
                    </div>
                    <div className="relative">
                      <Label htmlFor="postalCode" className="sr-only">Postal Code</Label>
                      <Input id="postalCode" name="postalCode" value={formData.postalCode} onChange={handleInputChange} placeholder="Postal Code" className="h-12 rounded-xl" />
                    </div>
                  </div>
                  <div className="relative">
                    <Label className="sr-only">Country</Label>
                    <Select value={formData.country} onValueChange={(v)=>setFormData(prev=>({ ...prev, country: v }))}>
                      <SelectTrigger className="h-14 rounded-full pl-4 pr-10">
                        <SelectValue placeholder="Country" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="India">India</SelectItem>
                        <SelectItem value="United States">United States</SelectItem>
                        <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                        <SelectItem value="Canada">Canada</SelectItem>
                        <SelectItem value="Australia">Australia</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-3 items-center">
                    <Button type="button" variant="outline" onClick={prevStep} className="h-14 px-8 rounded-full min-w-[160px] md:min-w-[200px] flex-1">Back</Button>
                    <Button type="button" onClick={nextStep} className="h-14 px-8 rounded-full min-w-[160px] md:min-w-[200px] flex-1 bg-primary text-primary-foreground">Next</Button>
                  </div>
                </div>
              )}

              {/* Step 3: Pet info */}
              {currentStep === 3 && (
                <div className="space-y-5">
                  {/* Top actions: Skip */}
                  <div className="flex items-center justify-center">
                    <button
                      type="button"
                      onClick={skipStep}
                      className="inline-flex items-center gap-2 text-sm rounded-full border border-primary bg-primary/10 px-5 py-2 text-primary hover:bg-primary/15 transition-colors"
                    >
                      Skip for now
                    </button>
                  </div>
                  {(formData.pets || []).map((pet, idx) => (
                    <div key={idx} className="space-y-5 rounded-2xl border border-border p-4">
                      {/* Row 1: Name + Gender */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input placeholder="Pet's Name" value={pet.name} onChange={(e)=>{
                          const pets = [...formData.pets];
                          pets[idx] = { ...pets[idx], name: e.target.value };
                          setFormData(prev=>({ ...prev, pets }));
                        }} className="h-12 rounded-xl" />
                        <div className="flex gap-2 md:col-span-2">
                          {(['male','female','unknown'] as const).map(g => (
                            <button key={g} type="button" onClick={()=>{
                              const pets = [...formData.pets];
                              pets[idx] = { ...pets[idx], gender: g };
                              setFormData(prev=>({ ...prev, pets }));
                            }} className={`flex-1 h-12 rounded-xl border ${pet.gender===g ? 'border-primary text-primary bg-primary/10' : 'border-border text-foreground/80 hover:bg-accent'}`}>{g.charAt(0).toUpperCase()+g.slice(1)}</button>
                          ))}
                        </div>
                      </div>

                      {/* Row 2: Species + Breed */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                          <Select value={pet.species} onValueChange={(v)=>{
                            const pets = [...formData.pets];
                            pets[idx] = { ...pets[idx], species: v };
                            setFormData(prev=>({ ...prev, pets }));
                          }}>
                            <SelectTrigger className="h-14 rounded-full pl-4 pr-10">
                              <SelectValue placeholder="Pet Species" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                              <SelectItem value="Dog">Dog</SelectItem>
                              <SelectItem value="Cat">Cat</SelectItem>
                              <SelectItem value="Bird">Bird</SelectItem>
                              <SelectItem value="Rabbit">Rabbit</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Input placeholder="Breed (Optional)" value={pet.breed || ''} onChange={(e)=>{
                          const pets = [...formData.pets];
                          pets[idx] = { ...pets[idx], breed: e.target.value };
                          setFormData(prev=>({ ...prev, pets }));
                        }} className="h-14 rounded-full" />
                      </div>

                      {/* Row 3: Birthdate + Age + Weight */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <Popover>
                            <PopoverTrigger asChild>
                              <button
                                type="button"
                                className="w-full h-14 rounded-full border border-border bg-background px-4 flex items-center justify-between text-left hover:bg-accent"
                              >
                                <span className={pet.birthday ? 'text-foreground' : 'text-muted-foreground'}>
                                  {pet.birthday ? format(new Date(pet.birthday), 'PPP') : 'Birthdate (optional)'}
                                </span>
                                <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                              </button>
                            </PopoverTrigger>
                            <PopoverContent align="start" className="p-0 rounded-xl">
                              <Calendar
                                mode="single"
                                selected={pet.birthday ? new Date(pet.birthday) : undefined}
                                onSelect={(date)=>{
                                  const pets = [...formData.pets];
                                  const val = date ? format(date, 'yyyy-MM-dd') : '';
                                  let agePatch: Partial<PetInfo> = {};
                                  if (val) {
                                    const { value, unit } = computeAgeFromBirthday(val);
                                    agePatch = { age: value, ageUnit: unit };
                                  }
                                  pets[idx] = { ...pets[idx], birthday: val, ...agePatch };
                                  setFormData(prev=>({ ...prev, pets }));
                                }}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="relative flex gap-2">
                          <Input type="number" placeholder="Pet Age" value={pet.age || ''} onChange={(e)=>{
                            const pets = [...formData.pets];
                            pets[idx] = { ...pets[idx], age: e.target.value };
                            setFormData(prev=>({ ...prev, pets }));
                          }} className="h-14 rounded-full flex-1" />
                          <div className="relative">
                            <Select value={pet.ageUnit || 'Years'} onValueChange={(v)=>{
                              const pets = [...formData.pets];
                              pets[idx] = { ...pets[idx], ageUnit: v as PetInfo['ageUnit'] };
                              setFormData(prev=>({ ...prev, pets }));
                            }}>
                              <SelectTrigger className="w-28 h-14 rounded-full pl-4 pr-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="rounded-xl">
                                <SelectItem value="Years">Years</SelectItem>
                                <SelectItem value="Months">Months</SelectItem>
                                <SelectItem value="Days">Days</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="relative flex gap-2">
                          <Input type="number" placeholder="Pet Weight" value={pet.weight || ''} onChange={(e)=>{
                            const pets = [...formData.pets];
                            pets[idx] = { ...pets[idx], weight: e.target.value };
                            setFormData(prev=>({ ...prev, pets }));
                          }} className="h-14 rounded-full flex-1" />
                          <div className="relative">
                            <Select value={pet.weightUnit || 'Kgs'} onValueChange={(v)=>{
                              const pets = [...formData.pets];
                              pets[idx] = { ...pets[idx], weightUnit: v as PetInfo['weightUnit'] };
                              setFormData(prev=>({ ...prev, pets }));
                            }}>
                              <SelectTrigger className="w-28 h-14 rounded-full pl-4 pr-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="rounded-xl">
                                <SelectItem value="Kgs">Kgs</SelectItem>
                                <SelectItem value="Gms">Gms</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      <Input placeholder="Microchip Number (Optional)" value={pet.microchip || ''} onChange={(e)=>{
                        const pets = [...formData.pets];
                        pets[idx] = { ...pets[idx], microchip: e.target.value };
                        setFormData(prev=>({ ...prev, pets }));
                      }} className="h-12 rounded-xl" />

                      <div className="flex items-center justify-between">
                        {/* Sterilized segmented buttons */}
                        <div className="flex items-center gap-2 text-sm">
                          {([
                            { key: 'yes', label: 'Sterilized' },
                            { key: 'no', label: 'Not Sterilized' },
                          ] as const).map(opt => (
                            <button
                              key={opt.key}
                              type="button"
                              onClick={()=>{
                                const pets = [...formData.pets];
                                pets[idx] = { ...pets[idx], sterilized: opt.key } as PetInfo;
                                setFormData(prev=>({ ...prev, pets }));
                              }}
                              className={`px-3 h-10 rounded-full border transition-colors ${
                                pet.sterilized === opt.key
                                  ? 'border-primary text-primary bg-primary/10'
                                  : 'border-border text-foreground/80 hover:bg-accent'
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                        <div className="flex items-center gap-4">
                          {idx > 0 && (
                            <button type="button" className="text-destructive text-sm hover:underline" onClick={()=>{
                              const pets = [...formData.pets];
                              pets.splice(idx, 1);
                              setFormData(prev=>({ ...prev, pets: pets.length ? pets : [{ name: '', gender: 'unknown', species: '', breed: '', birthday: '', age: '', ageUnit: 'Years', weight: '', weightUnit: 'Kgs', microchip: '', sterilized: 'yes' }] }));
                            }}>Remove</button>
                          )}
                          <button type="button" className="text-primary text-sm hover:underline" onClick={()=>{
                            const pets = [...formData.pets];
                            pets.push({ name: '', gender: 'unknown', species: '', breed: '', birthday: '', age: '', ageUnit: 'Years', weight: '', weightUnit: 'Kgs', microchip: '', sterilized: 'yes' });
                            setFormData(prev=>({ ...prev, pets }));
                          }}>+ Add Pet</button>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="flex gap-3 items-center">
                    <Button type="button" variant="outline" onClick={prevStep} className="h-14 px-8 rounded-full min-w-[160px] md:min-w-[200px] flex-1">Back</Button>
                    <Button type="button" onClick={handleSubmit} disabled={isLoading} className="h-14 px-8 rounded-full min-w-[160px] md:min-w-[200px] flex-1 bg-primary text-primary-foreground disabled:opacity-50">
                      {isLoading ? (
                        <div className="flex items-center"><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>Creating account...</div>
                      ) : 'Create account'}
                    </Button>
                  </div>
                </div>
              )}

              {/* Bottom Section - show only on Step 1 */}
              {currentStep === 1 && (
                <div className="mt-8">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Already have an account?{' '}
                      <Link href="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">Log in</Link>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PetOwnerWizardWrapper() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
      <PetOwnerWizard />
    </Suspense>
  );
}

export default PetOwnerWizardWrapper;
