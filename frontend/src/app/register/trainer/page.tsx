'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import chatgptHero from '@/assets/pet_trainer.png';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, EyeOff, ArrowLeft, Loader2 } from 'lucide-react';
import { apiService } from '@/lib/api';
import { MultiSelect } from '@/components/ui/multi-select';
import { FileUploadField } from '@/components/ui/file-upload-field';

// Custom Time Picker Component
const TimePicker = ({ 
  value, 
  onChange, 
  placeholder = "Select time",
  className = ""
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}) => {
  // Generate time options in 15-minute intervals
  const generateTimeOptions = (): Array<{ value: string; label: string }> => {
    const times: Array<{ value: string; label: string }> = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const displayTime = new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
        times.push({ value: timeString, label: displayTime });
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={`h-10 rounded-lg border-border focus:ring-primary focus:ring-offset-0 ${className}`}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="bg-background border-border/50 max-h-60">
        {timeOptions.map((time) => (
          <SelectItem 
            key={time.value} 
            value={time.value}
            className="focus:bg-accent/50"
          >
            {time.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

const specializationOptions = [
  { label: "Basic Obedience Training", value: "Basic Obedience Training" },
  { label: "Advanced Training", value: "Advanced Training" },
  { label: "Behavioral Modification", value: "Behavioral Modification" },
  { label: "Puppy Training", value: "Puppy Training" },
  { label: "Aggression Management", value: "Aggression Management" },
  { label: "Service Dog Training", value: "Service Dog Training" },
  { label: "Therapy Dog Training", value: "Therapy Dog Training" },
  { label: "Agility Training", value: "Agility Training" },
  { label: "Search and Rescue", value: "Search and Rescue" },
  { label: "Police/Military Dogs", value: "Police/Military Dogs" },
  { label: "Cat Training", value: "Cat Training" },
  { label: "Exotic Pet Training", value: "Exotic Pet Training" },
  { label: "Other", value: "Other" },
];

const certificationOptions = [
  { label: "Certified Professional Dog Trainer (CPDT)", value: "Certified Professional Dog Trainer (CPDT)" },
  { label: "Certified Applied Animal Behaviorist (CAAB)", value: "Certified Applied Animal Behaviorist (CAAB)" },
  { label: "Associate Certified Applied Animal Behaviorist (ACAAB)", value: "Associate Certified Applied Animal Behaviorist (ACAAB)" },
  { label: "International Association of Animal Behavior Consultants (IAABC)", value: "International Association of Animal Behavior Consultants (IAABC)" },
  { label: "Karen Pryor Academy (KPA)", value: "Karen Pryor Academy (KPA)" },
  { label: "Animal Behavior College (ABC)", value: "Animal Behavior College (ABC)" },
  { label: "Starmark Academy", value: "Starmark Academy" },
  { label: "Other", value: "Other" },
];

interface FormData {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  address: string;
  experience: number | string;
  specialization: string[];
  otherSpecialization: string;
  certifications: string[];
  otherCertification: string;
  resume: File | null;
  profilePhoto: File | null;
  practiceType: {
    independent: boolean;
    trainingCenter: boolean;
    affiliated: boolean;
  };
  services: string[];
  // Step 4 fields
  independentServices: {
    homeTraining: boolean;
    onlineTraining: boolean;
    groupClasses: boolean;
    serviceAddress: {
      sameAsPersonal: boolean;
      street: string;
      city: string;
      zip: string;
    };
    homeVisitRadius: string;
  };
  trainingCenterDetails: {
    centerName: string;
    centerAddress: string;
    services: {
      inPersonTraining: boolean;
      onlineTraining: boolean;
      groupClasses: boolean;
    };
  };
  affiliatedDetails: {
    facilityName: string;
    affiliationType: string;
  };
  academyDetails: {
    hasAcademy: boolean;
    name: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  // Step 5 fields - Service-based Availability Schedule
  availabilitySchedule: {
    timezone: string;
    // Home training availability (if independent practice with home training)
    homeTrainingAvailability: {
      workingDays: {
        monday: { enabled: boolean; startTime: string; endTime: string; maxDistance: number };
        tuesday: { enabled: boolean; startTime: string; endTime: string; maxDistance: number };
        wednesday: { enabled: boolean; startTime: string; endTime: string; maxDistance: number };
        thursday: { enabled: boolean; startTime: string; endTime: string; maxDistance: number };
        friday: { enabled: boolean; startTime: string; endTime: string; maxDistance: number };
        saturday: { enabled: boolean; startTime: string; endTime: string; maxDistance: number };
        sunday: { enabled: boolean; startTime: string; endTime: string; maxDistance: number };
      };
      sessionDuration: number;
      bufferTime: number;
      advanceBookingDays: number;
    };
    // Training center availability (if training center or affiliated)
    centerAvailability: {
      workingDays: {
        monday: { enabled: boolean; startTime: string; endTime: string };
        tuesday: { enabled: boolean; startTime: string; endTime: string };
        wednesday: { enabled: boolean; startTime: string; endTime: string };
        thursday: { enabled: boolean; startTime: string; endTime: string };
        friday: { enabled: boolean; startTime: string; endTime: string };
        saturday: { enabled: boolean; startTime: string; endTime: string };
        sunday: { enabled: boolean; startTime: string; endTime: string };
      };
      sessionDuration: number;
      bufferTime: number;
      advanceBookingDays: number;
    };
    // Online training availability
    onlineAvailability: {
      workingDays: {
        monday: { enabled: boolean; startTime: string; endTime: string };
        tuesday: { enabled: boolean; startTime: string; endTime: string };
        wednesday: { enabled: boolean; startTime: string; endTime: string };
        thursday: { enabled: boolean; startTime: string; endTime: string };
        friday: { enabled: boolean; startTime: string; endTime: string };
        saturday: { enabled: boolean; startTime: string; endTime: string };
        sunday: { enabled: boolean; startTime: string; endTime: string };
      };
      sessionDuration: number;
      bufferTime: number;
      advanceBookingDays: number;
    };
  };
}

function TrainerWizard() {
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
    phoneNumber: '',
    address: '',
    experience: '',
    specialization: [],
    otherSpecialization: '',
    certifications: [],
    otherCertification: '',
    resume: null,
    profilePhoto: null,
    practiceType: {
      independent: false,
      trainingCenter: false,
      affiliated: false,
    },
    services: [],
    // Step 4 fields
    independentServices: {
      homeTraining: false,
      onlineTraining: false,
      groupClasses: false,
      serviceAddress: {
        sameAsPersonal: true,
        street: '',
        city: '',
        zip: '',
      },
      homeVisitRadius: '',
    },
    trainingCenterDetails: {
      centerName: '',
      centerAddress: '',
      services: {
        inPersonTraining: false,
        onlineTraining: false,
        groupClasses: false,
      },
    },
    affiliatedDetails: {
      facilityName: '',
      affiliationType: '',
    },
    academyDetails: {
      hasAcademy: false,
      name: '',
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      phone: '',
    },
    // Step 5 fields - Service-based Availability Schedule
    availabilitySchedule: {
      timezone: 'UTC',
      homeTrainingAvailability: {
        workingDays: {
          monday: { enabled: true, startTime: '09:00', endTime: '17:00', maxDistance: 20 },
          tuesday: { enabled: true, startTime: '09:00', endTime: '17:00', maxDistance: 20 },
          wednesday: { enabled: true, startTime: '09:00', endTime: '17:00', maxDistance: 20 },
          thursday: { enabled: true, startTime: '09:00', endTime: '17:00', maxDistance: 20 },
          friday: { enabled: true, startTime: '09:00', endTime: '17:00', maxDistance: 20 },
          saturday: { enabled: true, startTime: '09:00', endTime: '17:00', maxDistance: 20 },
          sunday: { enabled: false, startTime: '09:00', endTime: '17:00', maxDistance: 20 },
        },
        sessionDuration: 60,
        bufferTime: 30,
        advanceBookingDays: 14,
      },
      centerAvailability: {
        workingDays: {
          monday: { enabled: true, startTime: '09:00', endTime: '17:00' },
          tuesday: { enabled: true, startTime: '09:00', endTime: '17:00' },
          wednesday: { enabled: true, startTime: '09:00', endTime: '17:00' },
          thursday: { enabled: true, startTime: '09:00', endTime: '17:00' },
          friday: { enabled: true, startTime: '09:00', endTime: '17:00' },
          saturday: { enabled: true, startTime: '09:00', endTime: '17:00' },
          sunday: { enabled: false, startTime: '09:00', endTime: '17:00' },
        },
        sessionDuration: 45,
        bufferTime: 15,
        advanceBookingDays: 30,
      },
      onlineAvailability: {
        workingDays: {
          monday: { enabled: true, startTime: '08:00', endTime: '20:00' },
          tuesday: { enabled: true, startTime: '08:00', endTime: '20:00' },
          wednesday: { enabled: true, startTime: '08:00', endTime: '20:00' },
          thursday: { enabled: true, startTime: '08:00', endTime: '20:00' },
          friday: { enabled: true, startTime: '08:00', endTime: '20:00' },
          saturday: { enabled: true, startTime: '10:00', endTime: '16:00' },
          sunday: { enabled: true, startTime: '10:00', endTime: '16:00' },
        },
        sessionDuration: 30,
        bufferTime: 15,
        advanceBookingDays: 7,
      },
    },
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
  const [isPhoneFocused, setIsPhoneFocused] = useState(false);
  const [isAddressFocused, setIsAddressFocused] = useState(false);
  const [isExperienceFocused, setIsExperienceFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSocialLogin = (provider: 'google' | 'microsoft' | 'apple') => {
    console.log(`Logging in with ${provider}`);
    // Implement social login logic here
  };

  useEffect(() => setMounted(true), []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        
        // Handle nested checkbox structures
        if (name.includes('.')) {
          const [parent, child, subChild] = name.split('.');
          setFormData((prev) => ({
            ...prev,
            [parent]: {
              ...prev[parent as keyof FormData] as any,
              [child]: subChild ? {
                ...(prev[parent as keyof FormData] as any)[child],
                [subChild]: checked,
              } : checked,
            },
          }));
        } else {
          setFormData((prev) => ({
            ...prev,
            practiceType: {
              ...prev.practiceType,
              [name]: checked,
            },
          }));
        }
    } else {
        // Handle nested input structures
        if (name.includes('.')) {
          const [parent, child, subChild] = name.split('.');
          setFormData((prev) => ({
            ...prev,
            [parent]: {
              ...prev[parent as keyof FormData] as any,
              [child]: subChild ? {
                ...(prev[parent as keyof FormData] as any)[child],
                [subChild]: value,
              } : value,
            },
          }));
        } else {
          setFormData((prev) => ({ ...prev, [name]: value }));
        }
    }
    setError('');
  };

  const handleFileUploadChange = (name: string, file: File | null) => {
    setFormData((prev) => ({ ...prev, [name]: file }));
    setError('');
  };

  const handleMultiSelectChange = (name: string, value: string[]) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const validateStep = (step: number): boolean => {
    if (step === 1) {
      if (
        !formData.username ||
        !formData.firstName ||
        !formData.lastName ||
        !formData.email ||
        !formData.password ||
        !formData.confirmPassword ||
        !formData.phoneNumber ||
        !formData.address
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
      if (formData.specialization.length === 0) {
        setError('Specialization is required');
        return false;
      }
      if (formData.specialization.includes('Other') && !formData.otherSpecialization.trim()) {
        setError('Please specify your other specialization');
        return false;
      }
      if (formData.certifications.includes('Other') && !formData.otherCertification.trim()) {
        setError('Please specify your other certification');
        return false;
      }
    }
    if (step === 3) {
      // If Academy selected, require name, address fields and phone
      if (formData.academyDetails.hasAcademy) {
        if (!formData.academyDetails.name.trim() || 
            !formData.academyDetails.street.trim() || 
            !formData.academyDetails.city.trim() || 
            !formData.academyDetails.postalCode.trim() || 
            !formData.academyDetails.country.trim() || 
            !formData.academyDetails.phone.trim()) {
          setError('Please provide academy name, complete address fields, and phone number');
          return false;
        }
      }
    }

    setError('');
    return true;
  };

  const nextStep = () => {
    if (!validateStep(currentStep)) return;
    setCurrentStep((s) => Math.min(4, s + 1));
  };
  const prevStep = () => setCurrentStep((s) => Math.max(1, s - 1));

  const handleSubmit = async () => {
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) return;
    setIsLoading(true);
    setError('');

    const data = new FormData();
    
    const formDataToSend = { ...formData };

    if (formDataToSend.specialization.includes('Other') && formDataToSend.otherSpecialization.trim()) {
      formDataToSend.specialization = formDataToSend.specialization.filter(s => s !== 'Other');
      formDataToSend.specialization.push(formDataToSend.otherSpecialization.trim());
    }
    if (formDataToSend.certifications.includes('Other') && formDataToSend.otherCertification.trim()) {
      formDataToSend.certifications = formDataToSend.certifications.filter(c => c !== 'Other');
      formDataToSend.certifications.push(formDataToSend.otherCertification.trim());
    }

    Object.keys(formDataToSend).forEach(key => {
      const value = formDataToSend[key as keyof typeof formDataToSend];
      if (value instanceof File) {
        data.append(key, value);
      } else if (Array.isArray(value)) {
        value.forEach(item => data.append(key, String(item)));
      } else if (typeof value === 'object' && value !== null) {
        data.append(key, JSON.stringify(value));
      } else if (value !== null && value !== undefined) {
        data.append(key, String(value));
      }
    });

    try {
      const res = await apiService.registerUser(data);
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
                alt="Pet trainer with a dog"
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
                  Step {currentStep} of 4
                </div>
                <h1 className="text-3xl font-bold text-foreground mt-3">Create your account</h1>
                <p className="text-muted-foreground mt-1">For Trainers</p>
              </div>

              {error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm mb-4">
                  {error}
                </div>
              )}

              {/* Step 1: Personal Info */}
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
                    <p className="text-xs text-muted-foreground ml-4 mt-1">e.g., trainerdave</p>
                  </div>

                  <div className="relative">
                    <Label htmlFor="phoneNumber" className={`absolute left-3 transition-all duration-200 pointer-events-none z-10 ${
                        isPhoneFocused || formData.phoneNumber ? 'text-xs text-primary -top-2 px-1 bg-background' : 'text-sm text-muted-foreground/70 top-3'
                    }`}>Phone Number</Label>
                    <Input id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} onFocus={()=>setIsPhoneFocused(true)} onBlur={()=>setIsPhoneFocused(false)} className="h-12 rounded-full pt-4" />
                  </div>

                  <div className="relative">
                    <Label htmlFor="address" className={`absolute left-3 transition-all duration-200 pointer-events-none z-10 ${
                        isAddressFocused || formData.address ? 'text-xs text-primary -top-2 px-1 bg-background' : 'text-sm text-muted-foreground/70 top-3'
                    }`}>Personal Address</Label>
                    <Textarea id="address" name="address" value={formData.address} onChange={handleInputChange} onFocus={()=>setIsAddressFocused(true)} onBlur={()=>setIsAddressFocused(false)} className="h-24 rounded-xl pt-8" />
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

{/* 
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleSocialLogin('microsoft')}
                      className="w-full h-12 bg-background border border-border hover:bg-accent hover:text-accent-foreground rounded-full transition-all duration-200"
                    >
                      <svg className="w-5 h-5 mr-3" viewBox="0 0 21 21">
                        <path fill="#f25022" d="M1 1h9v9H1z"/>
                        <path fill="#7fba00" d="M1 11h9v9H1z"/>
                        <path fil="#00a4ef" d="M11 1h9v9h-9z"/>
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
                      <svg className="w-5 h-5 mr-3" viewBox="0 0 x24">
                        <path fill="#000000" d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                      </svg>
                      Continue with Apple
                    </Button> */}
                  </div>
                  
                  <div className="text-center text-sm text-muted-foreground mt-4">
                    Already have an account?{' '}
                    <Link href="/login" className="text-primary hover:underline font-medium">
                      Sign in
                    </Link>
                  </div>
                </div>
              )}

              {/* Step 2: Professional Details */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Specialization</Label>
                    <MultiSelect
                      options={specializationOptions}
                      onValueChange={(value) => handleMultiSelectChange('specialization', value)}
                      defaultValue={formData.specialization}
                      placeholder="Select your specializations"
                      maxCount={3}
                      allowOther={true}
                      otherValue={formData.otherSpecialization}
                      onOtherValueChange={(value) => setFormData(prev => ({ ...prev, otherSpecialization: value }))}
                    />
                    <p className="text-xs text-muted-foreground">
                      💡 Tip: You can select multiple specializations or add custom ones by selecting "Other"
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Certifications</Label>
                    <MultiSelect
                      options={certificationOptions}
                      onValueChange={(value) => handleMultiSelectChange('certifications', value)}
                      defaultValue={formData.certifications}
                      placeholder="Select your certifications"
                      maxCount={3}
                      allowOther={true}
                      otherValue={formData.otherCertification}
                      onOtherValueChange={(value) => setFormData(prev => ({ ...prev, otherCertification: value }))}
                    />
                    <p className="text-xs text-muted-foreground">
                      💡 Tip: You can select multiple certifications or add custom ones by selecting "Other"
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience">Years of Experience</Label>
                    <Input id="experience" name="experience" type="number" value={formData.experience} onChange={handleInputChange} placeholder="Enter total years of experience" />
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-4">
                      <FileUploadField
                          label="Resume / CV"
                          name="resume"
                          value={formData.resume}
                          onChange={handleFileUploadChange}
                          required
                          helperText="Upload your resume for verification."
                          accept="application/pdf,image/jpeg,image/png"
                      />
                      <FileUploadField
                          label="Profile Photo (Optional)"
                          name="profilePhoto"
                          value={formData.profilePhoto}
                          onChange={handleFileUploadChange}
                          helperText="Optional; helps clients recognize you on the platform."
                          accept="image/jpeg,image/png"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 items-center">
                    <Button type="button" variant="outline" onClick={prevStep} className="h-14 px-8 rounded-full min-w-[160px] md:min-w-[200px] flex-1">Back</Button>
                    <Button type="button" onClick={nextStep} className="h-14 px-8 rounded-full min-w-[160px] md:min-w-[200px] flex-1 bg-primary text-primary-foreground">Next</Button>
                  </div>
                </div>
              )}


              {/* Step 3: Services (Academy/Training) */}
              {currentStep === 3 && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full mb-4">
                      <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Services</h2>
                    <p className="text-muted-foreground">Select the services you provide</p>
                  </div>

                  <div className="relative overflow-hidden p-6 border-2 border-primary/20 rounded-2xl bg-gradient-to-br from-card/50 to-card/30 dark:from-card/80 dark:to-card/60 shadow-sm transition-all duration-200 hover:shadow-md">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                    <div className="relative">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-primary/20 rounded-xl">
                          <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-bold text-foreground">Choose Services</h3>
                      </div>

                      <div className="space-y-4 mt-6">
                        <Label className="text-base font-semibold text-foreground">Services Offered</Label>
                        <div className="grid gap-4">
                          {/* Online Training */}
                          <div className={`group flex items-start space-x-4 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                            formData.independentServices.onlineTraining ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50 bg-card/50'
                          }`} onClick={() => setFormData(prev => ({
                            ...prev,
                            independentServices: {
                              ...prev.independentServices,
                              onlineTraining: !prev.independentServices.onlineTraining
                            }
                          }))}>
                            <div className={`relative flex-shrink-0 w-5 h-5 rounded border-2 transition-all duration-200 ${
                              formData.independentServices.onlineTraining ? 'border-primary bg-primary' : 'border-muted-foreground group-hover:border-primary'
                            }`}>
                              {formData.independentServices.onlineTraining && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <svg className="w-3 h-3 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
                                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                  </svg>
                                </div>
                                <Label className="font-semibold text-foreground">Online Training</Label>
                              </div>
                              <p className="text-sm text-muted-foreground">Offer remote training via video, audio, or chat.</p>
                            </div>
                          </div>


                          {/* Academy / Training Institute */}
                          <div className={`group flex items-start space-x-4 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                            formData.academyDetails.hasAcademy ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50 bg-card/50'
                          }`} onClick={() => setFormData(prev => ({
                            ...prev,
                            academyDetails: {
                              ...prev.academyDetails,
                              hasAcademy: !prev.academyDetails.hasAcademy
                            }
                          }))}>
                            <div className={`relative flex-shrink-0 w-5 h-5 rounded border-2 transition-all duration-200 ${
                              formData.academyDetails.hasAcademy ? 'border-primary bg-primary' : 'border-muted-foreground group-hover:border-primary'
                            }`}>
                              {formData.academyDetails.hasAcademy && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <svg className="w-3 h-3 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
                                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422A12.083 12.083 0 0112 21.5 12.083 12.083 0 015.84 10.578L12 14z" />
                                  </svg>
                                </div>
                                <Label className="font-semibold text-foreground">Academy / Training Institute</Label>
                              </div>
                              <p className="text-sm text-muted-foreground">Register your academy or training institute details.</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {formData.academyDetails.hasAcademy && (
                        <div className="space-y-4 mt-6">
                          <Label className="text-base font-semibold text-foreground">Academy Details</Label>
                          <Input 
                            name="academyDetails.name"
                            value={formData.academyDetails.name}
                            onChange={handleInputChange}
                            placeholder="Academy / Institute Name"
                          />
                          <Input 
            name="academyDetails.street"
            value={formData.academyDetails.street}
            onChange={handleInputChange}
            placeholder="Street Address"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input 
              name="academyDetails.city"
              value={formData.academyDetails.city}
              onChange={handleInputChange}
              placeholder="City"
            />
            <Input 
              name="academyDetails.state"
              value={formData.academyDetails.state}
              onChange={handleInputChange}
              placeholder="State"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input 
              name="academyDetails.postalCode"
              value={formData.academyDetails.postalCode}
              onChange={handleInputChange}
              placeholder="Postal Code"
            />
            <Input 
              name="academyDetails.country"
              value={formData.academyDetails.country}
              onChange={handleInputChange}
              placeholder="Country"
            />
          </div>
          <Input 
            name="academyDetails.phone"
            value={formData.academyDetails.phone}
            onChange={handleInputChange}
            placeholder="Phone Number"
          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-4 items-center pt-6">
                    <Button type="button" variant="outline" onClick={prevStep} className="h-14 px-8 rounded-full min-w-[160px] md:min-w-[200px] flex-1 border-2 hover:bg-muted/50 transition-all duration-200">Back</Button>
                    <Button type="button" onClick={nextStep} className="h-14 px-8 rounded-full min-w-[160px] md:min-w-[200px] flex-1 bg-primary text-primary-foreground">Next</Button>
                  </div>
                </div>
              )}


                {/* Step 4: Review and Submit */}
                {currentStep === 4 && (
                    <div className="space-y-8">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full mb-4">
                                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Review and Submit</h2>
                            <p className="text-muted-foreground">Please review your information before submitting.</p>
                        </div>

                        <div className="space-y-6 rounded-2xl border border-border p-6 bg-card/50">
                            <h3 className="text-lg font-semibold border-b border-border pb-3">Personal Information</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div><p className="text-muted-foreground">First Name</p><p>{formData.firstName}</p></div>
                                <div><p className="text-muted-foreground">Last Name</p><p>{formData.lastName}</p></div>
                                <div><p className="text-muted-foreground">Username</p><p>{formData.username}</p></div>
                                <div><p className="text-muted-foreground">Email</p><p>{formData.email}</p></div>
                                <div><p className="text-muted-foreground">Phone Number</p><p>{formData.phoneNumber}</p></div>
                                <div className="col-span-2"><p className="text-muted-foreground">Address</p><p>{formData.address}</p></div>
                            </div>

                            <h3 className="text-lg font-semibold border-b border-border pb-3 pt-4">Professional Details</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div><p className="text-muted-foreground">Experience</p><p>{formData.experience} years</p></div>
                                <div><p className="text-muted-foreground">Specialization</p><p>{formData.specialization.join(', ')}</p></div>
                                {formData.otherSpecialization && <div><p className="text-muted-foreground">Other Specialization</p><p>{formData.otherSpecialization}</p></div>}
                                <div><p className="text-muted-foreground">Certifications</p><p>{formData.certifications.join(', ')}</p></div>
                                {formData.otherCertification && <div><p className="text-muted-foreground">Other Certification</p><p>{formData.otherCertification}</p></div>}
                                {formData.resume && <div><p className="text-muted-foreground">Resume</p><p>{formData.resume.name}</p></div>}
                                {formData.profilePhoto && <div><p className="text-muted-foreground">Profile Photo</p><p>{formData.profilePhoto.name}</p></div>}
                            </div>

                            <h3 className="text-lg font-semibold border-b border-border pb-3 pt-4">Practice and Services</h3>
                            <div className="space-y-4 text-sm">
                                <div>
                                  <p className="font-semibold">Services</p>
                                  <p className="text-muted-foreground">
                                    Online Training: {formData.independentServices.onlineTraining ? 'Yes' : 'No'}
                                  </p>
                                </div>
                                {formData.academyDetails.hasAcademy && (
                                  <div>
                                    <p className="font-semibold">Academy / Training Institute</p>
                                    <p>{formData.academyDetails.name}</p>
                                    <p className="text-muted-foreground">{formData.academyDetails.street}, {formData.academyDetails.city}, {formData.academyDetails.state} {formData.academyDetails.postalCode}, {formData.academyDetails.country}</p>
                                    <p className="text-muted-foreground">Phone: {formData.academyDetails.phone}</p>
                                  </div>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-4 items-center pt-6">
                            <Button type="button" variant="outline" onClick={prevStep} className="h-14 px-8 rounded-full min-w-[160px] md:min-w-[200px] flex-1 border-2 hover:bg-muted/50 transition-all duration-200">Back</Button>
                            <Button type="button" onClick={handleSubmit} disabled={isLoading} className="h-14 px-8 rounded-full min-w-[160px] md:min-w-[200px] flex-1 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 transition-all duration-200 shadow-lg hover:shadow-xl">
                                {isLoading ? <Loader2 className="animate-spin" /> : 'Submit Registration'}
                            </Button>
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

export default function RegisterTrainerPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <TrainerWizard />
        </Suspense>
    );
}
