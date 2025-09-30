'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import chatgptHero from '@/assets/hero-vet.jpg';
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
  { label: "General Veterinary Practice", value: "General Veterinary Practice" },
  { label: "Surgery", value: "Surgery" },
  { label: "Dermatology", value: "Dermatology" },
  { label: "Dentistry", value: "Dentistry" },
  { label: "Cardiology", value: "Cardiology" },
  { label: "Neurology", value: "Neurology" },
  { label: "Ophthalmology", value: "Ophthalmology" },
  { label: "Orthopedics", value: "Orthopedics" },
  { label: "Internal Medicine", value: "Internal Medicine" },
  { label: "Reproduction / Obstetrics", value: "Reproduction / Obstetrics" },
  { label: "Exotic Animals / Avian Medicine", value: "Exotic Animals / Avian Medicine" },
  { label: "Laboratory / Pathology", value: "Laboratory / Pathology" },
  { label: "Anesthesia", value: "Anesthesia" },
  { label: "Emergency & Critical Care", value: "Emergency & Critical Care" },
  { label: "Other", value: "Other" },
];

const qualificationOptions = [
  { label: "BVSc & AH", value: "BVSc & AH" },
  { label: "MVSc", value: "MVSc" },
  { label: "Diploma in Veterinary Surgery", value: "Diploma in Veterinary Surgery" },
  { label: "Diploma in Veterinary Medicine", value: "Diploma in Veterinary Medicine" },
  { label: "Diploma in Animal Nutrition", value: "Diploma in Animal Nutrition" },
  { label: "PhD in Veterinary Science", value: "PhD in Veterinary Science" },
  { label: "Certificate in Clinical Pathology", value: "Certificate in Clinical Pathology" },
  { label: "Certificate in Radiology", value: "Certificate in Radiology" },
  { label: "Certificate in Dermatology", value: "Certificate in Dermatology" },
  { label: "Certificate in Surgery", value: "Certificate in Surgery" },
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
  licenseNumber: string;
  specialization: string[];
  otherSpecialization: string;
  qualifications: string[];
  otherQualification: string;
  licenseProof: File | null;
  idProof: File | null;
  degreeProof: File | null;
  profilePhoto: File | null;
  isAffiliated: boolean;
  // practiceType removed
  services: string[];
  // Step 4 fields
  independentServices: {
    homeConsultation: boolean;
    onlineConsultation: boolean;
    serviceAddress: {
      sameAsPersonal: boolean;
      street: string;
      city: string;
      zip: string;
    };
    homeVisitRadius: string;
  };
  personalClinicDetails: {
    clinicName: string;
    clinicAddress: string;
    services: {
      inPersonConsultation: boolean;
      onlineConsultation: boolean;
    };
  };
  affiliatedDetails: {
    facilityName: string;
    affiliationType: string;
  };
  // Step 5 fields - Service-based Availability Schedule
  availabilitySchedule: {
    timezone: string;
    // Home visit availability (if independent practice with home consultation)
    homeVisitAvailability: {
      workingDays: {
        monday: { enabled: boolean; startTime: string; endTime: string; maxDistance: number };
        tuesday: { enabled: boolean; startTime: string; endTime: string; maxDistance: number };
        wednesday: { enabled: boolean; startTime: string; endTime: string; maxDistance: number };
        thursday: { enabled: boolean; startTime: string; endTime: string; maxDistance: number };
        friday: { enabled: boolean; startTime: string; endTime: string; maxDistance: number };
        saturday: { enabled: boolean; startTime: string; endTime: string; maxDistance: number };
        sunday: { enabled: boolean; startTime: string; endTime: string; maxDistance: number };
      };
      consultationDuration: number;
      bufferTime: number;
      advanceBookingDays: number;
      emergencyAvailability: boolean;
    };
    // Clinic consultation availability (if personal clinic or affiliated)
    clinicAvailability: {
      workingDays: {
        monday: { enabled: boolean; startTime: string; endTime: string };
        tuesday: { enabled: boolean; startTime: string; endTime: string };
        wednesday: { enabled: boolean; startTime: string; endTime: string };
        thursday: { enabled: boolean; startTime: string; endTime: string };
        friday: { enabled: boolean; startTime: string; endTime: string };
        saturday: { enabled: boolean; startTime: string; endTime: string };
        sunday: { enabled: boolean; startTime: string; endTime: string };
      };
      consultationDuration: number;
      bufferTime: number;
      advanceBookingDays: number;
      emergencyAvailability: boolean;
    };
    // Online consultation availability
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
      consultationDuration: number;
      bufferTime: number;
      advanceBookingDays: number;
      emergencyAvailability: boolean;
    };
  };
}

function VeterinarianWizard() {
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
    licenseNumber: '',
    specialization: [],
    otherSpecialization: '',
    qualifications: [],
    otherQualification: '',
    licenseProof: null,
    idProof: null,
    degreeProof: null,
    profilePhoto: null,
    isAffiliated: false,
    // practiceType removed
    services: [],
    // Step 4 fields
    independentServices: {
      homeConsultation: false,
      onlineConsultation: false,
      serviceAddress: {
        sameAsPersonal: true,
        street: '',
        city: '',
        zip: '',
      },
      homeVisitRadius: '',
    },
    personalClinicDetails: {
      clinicName: '',
      clinicAddress: '',
      services: {
        inPersonConsultation: false,
        onlineConsultation: false,
      },
    },
    affiliatedDetails: {
      facilityName: '',
      affiliationType: '',
    },
    // Step 5 fields - Service-based Availability Schedule
    availabilitySchedule: {
      timezone: 'UTC',
      homeVisitAvailability: {
        workingDays: {
          monday: { enabled: true, startTime: '09:00', endTime: '17:00', maxDistance: 20 },
          tuesday: { enabled: true, startTime: '09:00', endTime: '17:00', maxDistance: 20 },
          wednesday: { enabled: true, startTime: '09:00', endTime: '17:00', maxDistance: 20 },
          thursday: { enabled: true, startTime: '09:00', endTime: '17:00', maxDistance: 20 },
          friday: { enabled: true, startTime: '09:00', endTime: '17:00', maxDistance: 20 },
          saturday: { enabled: false, startTime: '09:00', endTime: '17:00', maxDistance: 20 },
          sunday: { enabled: false, startTime: '09:00', endTime: '17:00', maxDistance: 20 },
        },
        consultationDuration: 45,
        bufferTime: 30,
        advanceBookingDays: 14,
        emergencyAvailability: true,
      },
      clinicAvailability: {
        workingDays: {
          monday: { enabled: true, startTime: '09:00', endTime: '17:00' },
          tuesday: { enabled: true, startTime: '09:00', endTime: '17:00' },
          wednesday: { enabled: true, startTime: '09:00', endTime: '17:00' },
          thursday: { enabled: true, startTime: '09:00', endTime: '17:00' },
          friday: { enabled: true, startTime: '09:00', endTime: '17:00' },
          saturday: { enabled: false, startTime: '09:00', endTime: '17:00' },
          sunday: { enabled: false, startTime: '09:00', endTime: '17:00' },
        },
        consultationDuration: 30,
        bufferTime: 15,
        advanceBookingDays: 30,
        emergencyAvailability: true,
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
        consultationDuration: 25,
        bufferTime: 10,
        advanceBookingDays: 7,
        emergencyAvailability: true,
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
  const [isPhoneNumberFocused, setIsPhoneNumberFocused] = useState(false);
  const [isAddressFocused, setIsAddressFocused] = useState(false);
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
          setFormData((prev) => ({ ...prev, [name]: checked }));
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
      if (!formData.licenseNumber || formData.specialization.length === 0 || formData.qualifications.length === 0) {
        setError('License number, specialization, and qualifications are required');
        return false;
      }
      if (formData.specialization.includes('Other') && !formData.otherSpecialization.trim()) {
        setError('Please specify your other specialization');
        return false;
      }
      if (formData.qualifications.includes('Other') && !formData.otherQualification.trim()) {
        setError('Please specify your other qualification');
        return false;
      }
    }
    if (step === 3) {
      if (!formData.licenseProof || !formData.idProof || !formData.degreeProof) {
        setError('License proof, ID proof, and Degree proof are required');
        return false;
      }
    }
    if (step === 4) {
      const { homeConsultation, onlineConsultation, serviceAddress, homeVisitRadius } = formData.independentServices;
      if (!homeConsultation && !onlineConsultation) {
        setError('Please select at least one service: Online or Home Visit');
          return false;
        }
      if (homeConsultation) {
        if (!serviceAddress.sameAsPersonal) {
          if (!serviceAddress.street || !serviceAddress.city || !serviceAddress.zip) {
            setError('Please provide the home service address (street, city, ZIP)');
            return false;
          }
        }
        const radius = parseFloat(String(homeVisitRadius || ''));
        if (!(radius > 0)) {
          setError('Please specify a valid home visit radius in km');
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
    if (!validateStep(1) || !validateStep(2) || !validateStep(3) || !validateStep(4)) return;
    setIsLoading(true);
    setError('');

    const data = new FormData();
    
    // Create a copy of formData to modify specialization and qualifications
    const formDataToSend = { ...formData };

    // Handle "Other" values by replacing them with the custom input
    if (formDataToSend.specialization.includes('Other') && formDataToSend.otherSpecialization.trim()) {
      formDataToSend.specialization = formDataToSend.specialization.filter(s => s !== 'Other');
      formDataToSend.specialization.push(formDataToSend.otherSpecialization.trim());
    }
    if (formDataToSend.qualifications.includes('Other') && formDataToSend.otherQualification.trim()) {
      formDataToSend.qualifications = formDataToSend.qualifications.filter(q => q !== 'Other');
      formDataToSend.qualifications.push(formDataToSend.otherQualification.trim());
    }

    Object.keys(formDataToSend).forEach(key => {
      const value = formDataToSend[key as keyof typeof formDataToSend];
      if (value instanceof File) {
        data.append(key, value);
      } else if (Array.isArray(value)) {
        // Handle arrays by appending each item
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
                  Step {currentStep} of 4
                </div>
                {currentStep === 1 && (
                  <>
                    <h1 className="text-3xl font-bold text-foreground mt-3">Create your account</h1>
                    <p className="text-muted-foreground mt-1">For Veterinarians</p>
                  </>
                )}
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
                    <p className="text-xs text-muted-foreground ml-4 mt-1">e.g., dr.johndoe</p>
                  </div>

                  <div className="relative">
                    <Label htmlFor="phoneNumber" className={`absolute left-3 transition-all duration-200 pointer-events-none z-10 ${
                        isPhoneNumberFocused || formData.phoneNumber ? 'text-xs text-primary -top-2 px-1 bg-background' : 'text-sm text-muted-foreground/70 top-3'
                    }`}>Phone Number</Label>
                    <Input id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} onFocus={()=>setIsPhoneNumberFocused(true)} onBlur={()=>setIsPhoneNumberFocused(false)} className="h-12 rounded-full pt-4" />
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
                  
                  <div className="text-center text-sm text-muted-foreground mt-4">
                    Already have an account?{' '}
                    <Link href="/login" className="text-primary hover:underline font-medium">
                      Sign in
                    </Link>
                  </div>
                </div>
              )}

              {/* Step 2: Professional Details + Affiliation */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-2">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full mb-4">
                      <svg className="w-8 h-8 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
                        <path d="M22 10v6" />
                        <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold mb-1">Professional Information</h2>
                    <p className="text-muted-foreground">Your license, specialization, qualifications, experience, and affiliation.</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber">Medical License / Registration Number</Label>
                    <Input id="licenseNumber" name="licenseNumber" value={formData.licenseNumber} onChange={handleInputChange} placeholder="Enter your license or registration number" required />
                  </div>

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
                    <Label>Qualifications / Degrees</Label>
                    <MultiSelect
                      options={qualificationOptions}
                      onValueChange={(value) => handleMultiSelectChange('qualifications', value)}
                      defaultValue={formData.qualifications}
                      placeholder="Select your qualifications"
                      maxCount={3}
                      allowOther={true}
                      otherValue={formData.otherQualification}
                      onOtherValueChange={(value) => setFormData(prev => ({ ...prev, otherQualification: value }))}
                    />
                    <p className="text-xs text-muted-foreground">
                      💡 Tip: You can select multiple degrees or add custom ones by selecting "Other"
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience">Years of Experience</Label>
                    <Input id="experience" name="experience" type="number" value={formData.experience} onChange={handleInputChange} placeholder="Enter total years of experience" />
                  </div>

                  {/* Optional Affiliation */}
                  <div className="space-y-3 pt-2">
                    <Label className="block font-semibold mb-1">Are you affiliated with a clinic/hospital? (optional)</Label>
                    <div className="inline-flex items-center gap-2">
                      <Button
                        type="button"
                        variant={formData.isAffiliated ? "default" : "outline"}
                        onClick={() => setFormData(prev => ({ ...prev, isAffiliated: true }))}
                        className="h-9 px-3 rounded-full text-sm shadow-none border-2"
                      >
                        Yes
                      </Button>
                      <Button
                        type="button"
                        variant={!formData.isAffiliated ? "default" : "outline"}
                        onClick={() => setFormData(prev => ({ ...prev, isAffiliated: false, affiliatedDetails: { facilityName: '', affiliationType: '' } }))}
                        className="h-9 px-3 rounded-full text-sm shadow-none border-2"
                      >
                        No
                      </Button>
                    </div>

                    {formData.isAffiliated && (
                      <div className="grid gap-4 mt-2">
                        <div className="space-y-2">
                          <Label>Hospital / Clinic Name</Label>
                          <Input
                            value={formData.affiliatedDetails.facilityName}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              affiliatedDetails: { ...prev.affiliatedDetails, facilityName: e.target.value }
                            }))}
                            placeholder="Enter facility name"
                            className="h-10 rounded-lg bg-background/50 border-border/50 focus:ring-primary/50 focus:ring-offset-0"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Affiliation Type</Label>
                          <Select
                            value={formData.affiliatedDetails.affiliationType}
                            onValueChange={(value) => setFormData(prev => ({
                              ...prev,
                              affiliatedDetails: { ...prev.affiliatedDetails, affiliationType: value }
                            }))}
                          >
                            <SelectTrigger className="h-10 rounded-lg bg-background/50 border-border/50 focus:ring-primary/50 focus:ring-offset-0">
                              <SelectValue placeholder="Select affiliation type" />
                            </SelectTrigger>
                            <SelectContent className="bg-background border-border/50">
                              <SelectItem value="Full-time" className="focus:bg-accent/50">Full-time</SelectItem>
                              <SelectItem value="Part-time" className="focus:bg-accent/50">Part-time</SelectItem>
                              <SelectItem value="Visiting" className="focus:bg-accent/50">Visiting</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                  </div>

                  

                    
                  <div className="flex gap-3 items-center">
                    <Button type="button" variant="outline" onClick={prevStep} className="h-14 px-8 rounded-full min-w-[160px] md:min-w-[200px] flex-1">Back</Button>
                    <Button type="button" onClick={nextStep} className="h-14 px-8 rounded-full min-w-[160px] md:min-w-[200px] flex-1 bg-primary text-primary-foreground">Next</Button>
                    </div>
                </div>
              )}

                {/* Step 3: Document Uploads */}
                {currentStep === 3 && (
                    <div className="space-y-8">
                        <div className="text-center mb-2">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full mb-4">
                                <svg className="w-8 h-8 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>
                                    <path d="M12 10v6"/>
                                    <path d="m9 13 3-3 3 3"/>
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Upload Your Documents</h2>
                            <p className="text-muted-foreground">Provide required verification documents to complete your profile.</p>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-4">
                                <FileUploadField
                                    label="License / Registration Proof"
                                    name="licenseProof"
                                    value={formData.licenseProof}
                                    onChange={handleFileUploadChange}
                                    required
                                    helperText="We verify your credentials before enabling services."
                                    accept="application/pdf,image/jpeg,image/png"
                                />
                                <FileUploadField
                                    label="Identity Proof (Passport / Aadhar / Govt ID)"
                                    name="idProof"
                                    value={formData.idProof}
                                    onChange={handleFileUploadChange}
                                    required
                                    accept="application/pdf,image/jpeg,image/png"
                                />
                                <FileUploadField
                                    label="Degree Proof"
                                    name="degreeProof"
                                    value={formData.degreeProof}
                                    onChange={handleFileUploadChange}
                                    required
                                    helperText="Upload your highest degree certificate."
                                    accept="application/pdf,image/jpeg,image/png"
                                />
                                <FileUploadField
                                    label="Profile Photo (Optional)"
                                    name="profilePhoto"
                                    value={formData.profilePhoto}
                                    onChange={handleFileUploadChange}
                                    helperText="Optional; helps patients recognize you on the platform."
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

                {/* Step 4: Service Details */}
                {currentStep === 4 && (
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
                        
                        {/* Services Section */}
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
                                        <div className={`group flex items-start space-x-4 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                                            formData.independentServices.onlineConsultation 
                                                ? 'border-primary bg-primary/10' 
                                                : 'border-border hover:border-primary/50 bg-card/50'
                                        }`} onClick={() => setFormData(prev => ({
                                            ...prev,
                                            independentServices: {
                                                ...prev.independentServices,
                                                onlineConsultation: !prev.independentServices.onlineConsultation
                                            }
                                        }))}>
                                            <div className={`relative flex-shrink-0 w-5 h-5 rounded border-2 transition-all duration-200 ${
                                                formData.independentServices.onlineConsultation 
                                                    ? 'border-primary bg-primary' 
                                                    : 'border-muted-foreground group-hover:border-primary'
                                            }`}>
                                                {formData.independentServices.onlineConsultation && (
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
                                                    <Label htmlFor="independent.onlineConsultation" className="font-semibold text-foreground">Online Consultation</Label>
                                                </div>
                                                <p className="text-sm text-muted-foreground">Offer remote consultations via video, audio, or chat.</p>
                                            </div>
                                        </div>

                                        <div className={`group flex items-start space-x-4 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                                            formData.independentServices.homeConsultation 
                                                ? 'border-primary bg-primary/10' 
                                                : 'border-border hover:border-primary/50 bg-card/50'
                                        }`} onClick={() => setFormData(prev => ({
                                            ...prev,
                                            independentServices: {
                                                ...prev.independentServices,
                                                homeConsultation: !prev.independentServices.homeConsultation
                                            }
                                        }))}>
                                            <div className={`relative flex-shrink-0 w-5 h-5 rounded border-2 transition-all duration-200 ${
                                                formData.independentServices.homeConsultation 
                                                    ? 'border-primary bg-primary' 
                                                    : 'border-muted-foreground group-hover:border-primary'
                                            }`}>
                                                {formData.independentServices.homeConsultation && (
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
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                                        </svg>
                                                    </div>
                                                    <Label htmlFor="independent.homeConsultation" className="font-semibold text-foreground">Home Visit Consultation</Label>
                                                </div>
                                                <p className="text-sm text-muted-foreground">I travel to the patient's home for in-person veterinary care.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {formData.independentServices.homeConsultation && (
                                    <>
                                        <div className="space-y-4 mt-6">
                                            <Label className="text-base font-semibold text-foreground">Service Address</Label>
                                            <div className="p-4 bg-card/20 rounded-lg border border-border/30">
                                                <label className="flex items-center space-x-3 cursor-pointer">
                                                    <div className={`flex items-center justify-center h-5 w-5 rounded border ${formData.independentServices.serviceAddress.sameAsPersonal ? 'bg-primary border-primary' : 'bg-background border-border'}`}>
                                                        {formData.independentServices.serviceAddress.sameAsPersonal && (
                                                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                    <span className="text-sm font-medium text-foreground select-none">
                                                        Use same address as personal address
                                                    </span>
                                                    <input 
                                                        type="checkbox" 
                                                        id="independent.sameAsPersonal" 
                                                        name="independentServices.serviceAddress.sameAsPersonal" 
                                                        checked={formData.independentServices.serviceAddress.sameAsPersonal} 
                                                        onChange={handleInputChange} 
                                                        className="sr-only" 
                                                    />
                                                </label>
                                                
                                                {!formData.independentServices.serviceAddress.sameAsPersonal && (
                                                    <div className="grid grid-cols-1 gap-4 mt-4">
                                                        <Input 
                                                            name="independentServices.serviceAddress.street" 
                                                            value={formData.independentServices.serviceAddress.street} 
                                                            onChange={handleInputChange} 
                                                            placeholder="Street Address" 
                                                            className="rounded-lg border-border focus:border-primary focus:ring-primary"
                                                        />
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <Input 
                                                                name="independentServices.serviceAddress.city" 
                                                                value={formData.independentServices.serviceAddress.city} 
                                                                onChange={handleInputChange} 
                                                                placeholder="City" 
                                                                className="rounded-lg border-border focus:border-primary focus:ring-primary"
                                                            />
                                                            <Input 
                                                                name="independentServices.serviceAddress.zip" 
                                                                value={formData.independentServices.serviceAddress.zip} 
                                                                onChange={handleInputChange} 
                                                                placeholder="ZIP Code" 
                                                                className="rounded-lg border-border focus:border-primary focus:ring-primary"
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-3 mt-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="independent.homeVisitRadius" className="text-base font-semibold text-foreground">Home Visit Radius (km)</Label>
                                                <p className="text-sm text-muted-foreground">Required when Home Visit is selected</p>
                                            </div>
                                            <Input 
                                                id="independent.homeVisitRadius" 
                                                name="independentServices.homeVisitRadius" 
                                                type="number"
                                                step="0.1"
                                                value={formData.independentServices.homeVisitRadius} 
                                                onChange={handleInputChange} 
                                                placeholder="e.g., 10" 
                                                className="rounded-lg border-border focus:border-primary focus:ring-primary"
                                            />
                                        </div>
                                    </>
                                )}
                                </div>
                            </div>

                        {/* (removed Personal Clinic section for simplified Step 4) */}

                        {/* (removed Affiliated section for simplified Step 4) */}
                        
                        <div className="flex gap-4 items-center pt-6">
                            <Button type="button" variant="outline" onClick={prevStep} className="h-14 px-8 rounded-full min-w-[160px] md:min-w-[200px] flex-1 border-2 hover:bg-muted/50 transition-all duration-200">Back</Button>
                            <Button type="button" onClick={handleSubmit} disabled={isLoading} className="h-14 px-8 rounded-full min-w-[160px] md:min-w-[200px] flex-1 bg-primary text-primary-foreground disabled:opacity-50">
                            {isLoading ? (
                                    <div className="flex items-center"><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>Submitting...</div>
                                ) : 'Finish registration'}
                            </Button>
                        </div>
                    </div>
                )}

                {/* (removed review step) */}


            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VeterinarianWizardWrapper() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
      <VeterinarianWizard />
    </Suspense>
  );
}

export default VeterinarianWizardWrapper;