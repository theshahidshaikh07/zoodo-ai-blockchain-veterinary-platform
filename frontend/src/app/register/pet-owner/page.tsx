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
import { Eye, EyeOff, ArrowLeft, Loader2, ChevronDown } from 'lucide-react';
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
                    <Label htmlFor="country" className="sr-only">Country</Label>
                    <select id="country" name="country" value={formData.country} onChange={handleInputChange} className="w-full h-14 rounded-full border border-border bg-background pl-4 pr-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary appearance-none">
                      <option value="India">India</option>
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Canada">Canada</option>
                      <option value="Australia">Australia</option>
                      <option value="Other">Other</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
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
                      className="inline-flex items-center gap-2 text-sm rounded-full border border-border bg-card/50 px-4 py-2 text-foreground/80 hover:text-foreground hover:bg-accent transition-colors"
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
                        <select value={pet.species} onChange={(e)=>{
                          const pets = [...formData.pets];
                          pets[idx] = { ...pets[idx], species: e.target.value };
                          setFormData(prev=>({ ...prev, pets }));
                        }} className="w-full h-14 rounded-full border border-border bg-background pl-4 pr-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary appearance-none">
                          <option value="">Pet Species</option>
                          <option value="Dog">Dog</option>
                          <option value="Cat">Cat</option>
                          <option value="Bird">Bird</option>
                          <option value="Rabbit">Rabbit</option>
                          <option value="Other">Other</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        </div>
                        <Input placeholder="Breed (Optional)" value={pet.breed || ''} onChange={(e)=>{
                          const pets = [...formData.pets];
                          pets[idx] = { ...pets[idx], breed: e.target.value };
                          setFormData(prev=>({ ...prev, pets }));
                        }} className="h-14 rounded-full" />
                      </div>

                      {/* Row 3: Birthday + Age + Weight */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col md:col-span-2">
                        <Label className="text-xs text-muted-foreground mb-1">Birthdate (optional)</Label>
                        <Input type="date" value={pet.birthday || ''} onChange={(e)=>{
                          const pets = [...formData.pets];
                          const val = e.target.value;
                          let agePatch: Partial<PetInfo> = {};
                          if (val) {
                            const { value, unit } = computeAgeFromBirthday(val);
                            agePatch = { age: value, ageUnit: unit };
                          }
                          pets[idx] = { ...pets[idx], birthday: val, ...agePatch };
                          setFormData(prev=>({ ...prev, pets }));
                        }} className="h-14 rounded-full" />
                        </div>
                        <div className="relative flex gap-2">
                          <Input type="number" placeholder="Pet Age" value={pet.age || ''} onChange={(e)=>{
                            const pets = [...formData.pets];
                            pets[idx] = { ...pets[idx], age: e.target.value };
                            setFormData(prev=>({ ...prev, pets }));
                          }} className="h-14 rounded-full flex-1" />
                          <div className="relative">
                          <select value={pet.ageUnit || 'Years'} onChange={(e)=>{
                            const pets = [...formData.pets];
                            pets[idx] = { ...pets[idx], ageUnit: e.target.value as PetInfo['ageUnit'] };
                            setFormData(prev=>({ ...prev, pets }));
                          }} className="w-36 h-14 rounded-full border border-border bg-background pl-4 pr-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary appearance-none">
                            <option>Years</option>
                            <option>Months</option>
                            <option>Days</option>
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          </div>
                        </div>
                        <div className="relative flex gap-2">
                          <Input type="number" placeholder="Pet Weight" value={pet.weight || ''} onChange={(e)=>{
                            const pets = [...formData.pets];
                            pets[idx] = { ...pets[idx], weight: e.target.value };
                            setFormData(prev=>({ ...prev, pets }));
                          }} className="h-14 rounded-full flex-1" />
                          <div className="relative">
                          <select value={pet.weightUnit || 'Kgs'} onChange={(e)=>{
                            const pets = [...formData.pets];
                            pets[idx] = { ...pets[idx], weightUnit: e.target.value as PetInfo['weightUnit'] };
                            setFormData(prev=>({ ...prev, pets }));
                          }} className="w-36 h-14 rounded-full border border-border bg-background pl-4 pr-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary appearance-none">
                            <option>Kgs</option>
                            <option>Gms</option>
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
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
