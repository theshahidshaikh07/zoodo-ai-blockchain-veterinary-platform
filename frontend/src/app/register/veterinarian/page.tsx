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
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, EyeOff, ArrowLeft, Loader2 } from 'lucide-react';
import { apiService } from '@/lib/api';
import { MultiSelect } from '@/components/ui/multi-select';
import { FileUploadField } from '@/components/ui/file-upload-field';

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
  licenseNumber: string;
  specialization: string[];
  otherSpecialization: string;
  qualifications: string[];
  otherQualification: string;
  licenseProof: File | null;
  idProof: File | null;
  degreeProof: File | null;
  profilePhoto: File | null;
  practiceType: {
    independent: boolean;
    personalClinic: boolean;
    affiliated: boolean;
  };
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
    availabilitySchedule: string;
    homeVisitRadius: string;
  };
  personalClinicDetails: {
    clinicName: string;
    clinicAddress: string;
    services: {
      inPersonConsultation: boolean;
      homeConsultation: boolean;
      onlineConsultation: boolean;
    };
    availabilitySchedule: string;
  };
  affiliatedDetails: {
    facilityName: string;
    affiliationType: string;
    services: {
      inPersonConsultation: boolean;
      homeConsultation: boolean;
      onlineConsultation: boolean;
    };
    availabilitySchedule: string;
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
    licenseNumber: '',
    specialization: [],
    otherSpecialization: '',
    qualifications: [],
    otherQualification: '',
    licenseProof: null,
    idProof: null,
    degreeProof: null,
    profilePhoto: null,
    practiceType: {
      independent: false,
      personalClinic: false,
      affiliated: false,
    },
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
      availabilitySchedule: '',
      homeVisitRadius: '',
    },
    personalClinicDetails: {
      clinicName: '',
      clinicAddress: '',
      services: {
        inPersonConsultation: false,
        homeConsultation: false,
        onlineConsultation: false,
      },
      availabilitySchedule: '',
    },
    affiliatedDetails: {
      facilityName: '',
      affiliationType: '',
      services: {
        inPersonConsultation: false,
        homeConsultation: false,
        onlineConsultation: false,
      },
      availabilitySchedule: '',
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
      if (!formData.licenseProof || !formData.idProof || !formData.degreeProof) {
        setError('License proof, ID proof, and Degree proof are required');
        return false;
      }
    }
    if (step === 3) {
      const { independent, personalClinic, affiliated } = formData.practiceType;
      if (!independent && !personalClinic && !affiliated) {
        setError('Please select at least one practice type');
        return false;
      }
    }
    if (step === 4) {
      const { independent, personalClinic, affiliated } = formData.practiceType;
      
      if (independent) {
        const { homeConsultation, onlineConsultation, serviceAddress, availabilitySchedule } = formData.independentServices;
        if (!homeConsultation && !onlineConsultation) {
          setError('Please select at least one service for independent practice');
          return false;
        }
        if (!availabilitySchedule.trim()) {
          setError('Please provide your availability schedule');
          return false;
        }
        if (!serviceAddress.sameAsPersonal) {
          if (!serviceAddress.street || !serviceAddress.city || !serviceAddress.zip) {
            setError('Please fill in all service address fields');
            return false;
          }
        }
      }
      
      if (personalClinic) {
        const { clinicName, clinicAddress, services, availabilitySchedule } = formData.personalClinicDetails;
        if (!clinicName.trim() || !clinicAddress.trim()) {
          setError('Please fill in clinic name and address');
          return false;
        }
        if (!services.inPersonConsultation && !services.homeConsultation && !services.onlineConsultation) {
          setError('Please select at least one service for your clinic');
          return false;
        }
        if (!availabilitySchedule.trim()) {
          setError('Please provide your availability schedule');
          return false;
        }
      }
      
      if (affiliated) {
        const { facilityName, affiliationType, services, availabilitySchedule } = formData.affiliatedDetails;
        if (!facilityName.trim() || !affiliationType.trim()) {
          setError('Please fill in facility name and affiliation type');
          return false;
        }
        if (!services.inPersonConsultation && !services.homeConsultation && !services.onlineConsultation) {
          setError('Please select at least one service for your affiliation');
          return false;
        }
        if (!availabilitySchedule.trim()) {
          setError('Please provide your availability schedule');
          return false;
        }
      }
    }
    setError('');
    return true;
  };

  const nextStep = () => {
    if (!validateStep(currentStep)) return;
    setCurrentStep((s) => Math.min(5, s + 1));
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
                  Step {currentStep} of 5
                </div>
                <h1 className="text-3xl font-bold text-foreground mt-3">Create your account</h1>
                <p className="text-muted-foreground mt-1">For Veterinarians</p>
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
                </div>
              )}

              {/* Step 2: Professional Details */}
              {currentStep === 2 && (
                <div className="space-y-6">
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

              {/* Step 3: Practice Type */}
              {currentStep === 3 && (
                <div className="space-y-8">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full mb-4">
                            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold mb-2">How do you practice?</h2>
                        <p className="text-muted-foreground">Select the practice types that apply to you. You can choose multiple options.</p>
                    </div>
                    
                    <div className="grid gap-6">
                        {/* Independent Practice Card */}
                        <div className={`group relative p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-lg ${
                            formData.practiceType.independent 
                                ? 'border-primary bg-primary/5 shadow-md scale-[1.02]' 
                                : 'border-border hover:border-primary/50 bg-card/50'
                        }`} onClick={() => setFormData(prev => ({
                            ...prev,
                            practiceType: { ...prev.practiceType, independent: !prev.practiceType.independent }
                        }))}>
                            <div className="flex items-start space-x-4">
                                <div className={`relative flex-shrink-0 w-6 h-6 rounded-full border-2 transition-all duration-200 ${
                                    formData.practiceType.independent 
                                        ? 'border-primary bg-primary' 
                                        : 'border-muted-foreground group-hover:border-primary'
                                }`}>
                                    {formData.practiceType.independent && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <svg className="w-3 h-3 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-primary/10 rounded-lg">
                                            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-semibold text-foreground">Independent Practice</h3>
                                    </div>
                                    <p className="text-muted-foreground leading-relaxed">I provide home or online consultations independently, offering flexible veterinary services directly to pet owners.</p>
                                </div>
                            </div>
                        </div>

                        {/* Personal Clinic Card */}
                        <div className={`group relative p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-lg ${
                            formData.practiceType.personalClinic 
                                ? 'border-primary bg-primary/5 shadow-md scale-[1.02]' 
                                : 'border-border hover:border-primary/50 bg-card/50'
                        }`} onClick={() => setFormData(prev => ({
                            ...prev,
                            practiceType: { ...prev.practiceType, personalClinic: !prev.practiceType.personalClinic }
                        }))}>
                            <div className="flex items-start space-x-4">
                                <div className={`relative flex-shrink-0 w-6 h-6 rounded-full border-2 transition-all duration-200 ${
                                    formData.practiceType.personalClinic 
                                        ? 'border-primary bg-primary' 
                                        : 'border-muted-foreground group-hover:border-primary'
                                }`}>
                                    {formData.practiceType.personalClinic && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <svg className="w-3 h-3 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-primary/10 rounded-lg">
                                            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-semibold text-foreground">Personal Clinic</h3>
                                    </div>
                                    <p className="text-muted-foreground leading-relaxed">I operate my own clinic where patients visit, providing comprehensive veterinary care in a dedicated facility.</p>
                                </div>
                            </div>
                        </div>

                        {/* Affiliated Hospital/Clinic Card */}
                        <div className={`group relative p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-lg ${
                            formData.practiceType.affiliated 
                                ? 'border-primary bg-primary/5 shadow-md scale-[1.02]' 
                                : 'border-border hover:border-primary/50 bg-card/50'
                        }`} onClick={() => setFormData(prev => ({
                            ...prev,
                            practiceType: { ...prev.practiceType, affiliated: !prev.practiceType.affiliated }
                        }))}>
                            <div className="flex items-start space-x-4">
                                <div className={`relative flex-shrink-0 w-6 h-6 rounded-full border-2 transition-all duration-200 ${
                                    formData.practiceType.affiliated 
                                        ? 'border-primary bg-primary' 
                                        : 'border-muted-foreground group-hover:border-primary'
                                }`}>
                                    {formData.practiceType.affiliated && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <svg className="w-3 h-3 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-primary/10 rounded-lg">
                                            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-semibold text-foreground">Affiliated Hospital / Clinic</h3>
                                    </div>
                                    <p className="text-muted-foreground leading-relaxed">I work part-time or full-time at a hospital or clinic, providing veterinary services as part of a larger healthcare team.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex gap-3 items-center pt-4">
                        <Button type="button" variant="outline" onClick={prevStep} className="h-14 px-8 rounded-full min-w-[160px] md:min-w-[200px] flex-1 border-2 hover:bg-muted/50 transition-all duration-200">Back</Button>
                        <Button type="button" onClick={nextStep} className="h-14 px-8 rounded-full min-w-[160px] md:min-w-[200px] flex-1 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 transition-all duration-200 shadow-lg hover:shadow-xl">Next</Button>
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
                            <h2 className="text-2xl font-bold mb-2">Service Details</h2>
                            <p className="text-muted-foreground">Define the services you offer based on your selected practice types.</p>
                        </div>
                        
                        {/* Independent Practice Section */}
                        {formData.practiceType.independent && (
                            <div className="relative overflow-hidden p-6 border-2 border-primary/20 rounded-2xl bg-gradient-to-br from-card/50 to-card/30 dark:from-card/80 dark:to-card/60 shadow-sm transition-all duration-200 hover:shadow-md">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                                <div className="relative">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-3 bg-primary/20 rounded-xl">
                                            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-bold text-foreground">Independent Practice</h3>
                                    </div>
                                
                                <div className="space-y-4 mt-6">
                                    <Label className="text-base font-semibold text-foreground">Services Offered</Label>
                                    <div className="grid gap-4">
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
                                                    <Label htmlFor="independent.homeConsultation" className="font-semibold text-foreground">Home Consultation</Label>
                                                </div>
                                                <p className="text-sm text-muted-foreground">I travel to the patient's home for in-person veterinary care.</p>
                                            </div>
                                        </div>
                                        
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
                                                <p className="text-sm text-muted-foreground">I consult via video, phone, or chat for remote veterinary care.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

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
                                        <Label htmlFor="independent.availabilitySchedule" className="text-base font-semibold text-foreground">Availability Schedule</Label>
                                        <p className="text-sm text-muted-foreground">Let clients know your regular working hours</p>
                                    </div>
                                    <Textarea 
                                        id="independent.availabilitySchedule" 
                                        name="independentServices.availabilitySchedule" 
                                        value={formData.independentServices.availabilitySchedule} 
                                        onChange={handleInputChange} 
                                        placeholder="e.g., Monday-Friday: 9 AM - 6 PM, Weekends: 10 AM - 4 PM" 
                                        className="min-h-[100px] rounded-lg border-border focus:border-primary focus:ring-primary"
                                    />
                                </div>

                                <div className="space-y-3 mt-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="independent.homeVisitRadius" className="text-base font-semibold text-foreground">Home Visit Radius (Optional)</Label>
                                        <p className="text-sm text-muted-foreground">Maximum distance you're willing to travel for home visits</p>
                                    </div>
                                    <Input 
                                        id="independent.homeVisitRadius" 
                                        name="independentServices.homeVisitRadius" 
                                        value={formData.independentServices.homeVisitRadius} 
                                        onChange={handleInputChange} 
                                        placeholder="e.g., 15 km radius" 
                                        className="rounded-lg border-border focus:border-primary focus:ring-primary"
                                    />
                                </div>
                                </div>
                            </div>
                        )}

                        {/* Personal Clinic Section */}
                        {formData.practiceType.personalClinic && (
                            <div className="relative overflow-hidden p-6 border-2 border-primary/20 rounded-2xl bg-gradient-to-br from-card/50 to-card/30 dark:from-card/80 dark:to-card/60 shadow-sm transition-all duration-200 hover:shadow-md">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                                <div className="relative">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-3 bg-primary/20 rounded-xl">
                                            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-bold text-foreground">Personal Clinic</h3>
                                    </div>
                                
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="space-y-3">
                                        <Label htmlFor="clinic.name" className="text-base font-semibold text-foreground">Clinic Name</Label>
                                        <Input 
                                            id="clinic.name" 
                                            name="personalClinicDetails.clinicName" 
                                            value={formData.personalClinicDetails.clinicName} 
                                            onChange={handleInputChange} 
                                            placeholder="Enter your clinic name" 
                                            className="rounded-lg border-border focus:border-primary focus:ring-primary"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <Label htmlFor="clinic.address" className="text-base font-semibold text-foreground">Clinic Address</Label>
                                        <Textarea 
                                            id="clinic.address" 
                                            name="personalClinicDetails.clinicAddress" 
                                            value={formData.personalClinicDetails.clinicAddress} 
                                            onChange={handleInputChange} 
                                            placeholder="Enter your clinic address" 
                                            className="min-h-[100px] rounded-lg border-border focus:border-primary focus:ring-primary"
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <Label className="text-base font-semibold text-foreground">Services Offered</Label>
                                        <div className="grid gap-4">
                                            <div className={`group flex items-start space-x-4 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                                                formData.personalClinicDetails.services.inPersonConsultation 
                                                    ? 'border-primary bg-primary/10' 
                                                    : 'border-border hover:border-primary/50 bg-card/50'
                                            }`} onClick={() => setFormData(prev => ({
                                                ...prev,
                                                personalClinicDetails: {
                                                    ...prev.personalClinicDetails,
                                                    services: {
                                                        ...prev.personalClinicDetails.services,
                                                        inPersonConsultation: !prev.personalClinicDetails.services.inPersonConsultation
                                                    }
                                                }
                                            }))}>
                                                <div className={`relative flex-shrink-0 w-5 h-5 rounded border-2 transition-all duration-200 ${
                                                    formData.personalClinicDetails.services.inPersonConsultation 
                                                        ? 'border-primary bg-primary' 
                                                        : 'border-muted-foreground group-hover:border-primary'
                                                }`}>
                                                    {formData.personalClinicDetails.services.inPersonConsultation && (
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <svg className="w-3 h-3 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <div className={`p-1.5 rounded-lg ${
                                                            formData.affiliatedDetails.services.inPersonConsultation 
                                                                ? 'bg-primary/20' 
                                                                : 'bg-muted/50 group-hover:bg-primary/10'
                                                        }`}>
                                                            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                            </svg>
                                                        </div>
                                                        <Label htmlFor="clinic.inPersonConsultation" className="font-semibold text-foreground">In-Person Consultation</Label>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">Patients visit your clinic for comprehensive veterinary care.</p>
                                                </div>
                                            </div>
                                            
                                            <div className={`group flex items-start space-x-4 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                                                formData.personalClinicDetails.services.homeConsultation 
                                                    ? 'border-primary bg-primary/10' 
                                                    : 'border-border hover:border-primary/50 bg-card/50'
                                            }`} onClick={() => setFormData(prev => ({
                                                ...prev,
                                                personalClinicDetails: {
                                                    ...prev.personalClinicDetails,
                                                    services: {
                                                        ...prev.personalClinicDetails.services,
                                                        homeConsultation: !prev.personalClinicDetails.services.homeConsultation
                                                    }
                                                }
                                            }))}>
                                                <div className={`relative flex-shrink-0 w-5 h-5 rounded border-2 transition-all duration-200 ${
                                                    formData.personalClinicDetails.services.homeConsultation 
                                                        ? 'border-primary bg-primary' 
                                                        : 'border-muted-foreground group-hover:border-primary'
                                                }`}>
                                                    {formData.personalClinicDetails.services.homeConsultation && (
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
                                                        <Label htmlFor="clinic.homeConsultation" className="font-semibold text-foreground">Home Consultation</Label>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">You travel to patients' homes for convenient care.</p>
                                                </div>
                                            </div>
                                            
                                            <div className={`group flex items-start space-x-4 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                                                formData.personalClinicDetails.services.onlineConsultation 
                                                    ? 'border-primary bg-primary/10' 
                                                    : 'border-border hover:border-primary/50 bg-card/50'
                                            }`} onClick={() => setFormData(prev => ({
                                                ...prev,
                                                personalClinicDetails: {
                                                    ...prev.personalClinicDetails,
                                                    services: {
                                                        ...prev.personalClinicDetails.services,
                                                        onlineConsultation: !prev.personalClinicDetails.services.onlineConsultation
                                                    }
                                                }
                                            }))}>
                                                <div className={`relative flex-shrink-0 w-5 h-5 rounded border-2 transition-all duration-200 ${
                                                    formData.personalClinicDetails.services.onlineConsultation 
                                                        ? 'border-primary bg-primary' 
                                                        : 'border-muted-foreground group-hover:border-primary'
                                                }`}>
                                                    {formData.personalClinicDetails.services.onlineConsultation && (
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <svg className="w-3 h-3 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <div className={`p-1.5 rounded-lg ${
                                                    formData.personalClinicDetails.services.onlineConsultation 
                                                        ? 'bg-primary/20' 
                                                        : 'bg-muted/50 group-hover:bg-primary/10'
                                                }`}>
                                                            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                            </svg>
                                                        </div>
                                                        <Label htmlFor="clinic.onlineConsultation" className="font-semibold text-foreground">Online Consultation</Label>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">Virtual consultations via video, phone, or chat.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Label htmlFor="clinic.availabilitySchedule" className="text-base font-semibold text-foreground">Availability Schedule</Label>
                                        <Textarea 
                                            id="clinic.availabilitySchedule" 
                                            name="personalClinicDetails.availabilitySchedule" 
                                            value={formData.personalClinicDetails.availabilitySchedule} 
                                            onChange={handleInputChange} 
                                            placeholder="e.g., Monday-Friday: 9 AM - 6 PM, Weekends: 10 AM - 4 PM" 
                                            className="min-h-[100px] rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                                        />
                                    </div>
                                </div>
                                </div>
                            </div>
                        )}

                        {/* Affiliated Hospital/Clinic Section */}
                        {formData.practiceType.affiliated && (
                            <div className="relative overflow-hidden p-6 border-2 border-primary/20 rounded-2xl bg-gradient-to-br from-card/50 to-card/30 dark:from-card/80 dark:to-card/60 shadow-sm transition-all duration-200 hover:shadow-md">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                                <div className="relative space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 bg-primary/10 rounded-lg text-primary">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-bold text-foreground">Hospital / Clinic Affiliation</h3>
                                    </div>
                                
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="affiliated.facilityName" className="text-sm font-medium text-foreground/80">Facility Name</Label>
                                        <Input 
                                            id="affiliated.facilityName" 
                                            name="affiliatedDetails.facilityName" 
                                            value={formData.affiliatedDetails.facilityName} 
                                            onChange={handleInputChange} 
                                            placeholder="Enter hospital/clinic name" 
                                            className="h-10 rounded-lg bg-background/50 border-border/50 focus-visible:ring-primary/50 focus-visible:ring-offset-0"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="affiliated.affiliationType" className="text-sm font-medium text-foreground/80">Affiliation Type</Label>
                                        <Select 
                                            value={formData.affiliatedDetails.affiliationType} 
                                            onValueChange={(value) => setFormData(prev => ({
                                                ...prev,
                                                affiliatedDetails: {
                                                    ...prev.affiliatedDetails,
                                                    affiliationType: value
                                                }
                                            }))}
                                        >
                                            <SelectTrigger className="h-10 rounded-lg bg-background/50 border-border/50 focus:ring-primary/50 focus:ring-offset-0">
                                                <SelectValue placeholder="Select affiliation type" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-background border-border/50">
                                                <SelectItem value="Full-time" className="focus:bg-accent/50">Full-time</SelectItem>
                                                <SelectItem value="Part-time" className="focus:bg-accent/50">Part-time</SelectItem>
                                                <SelectItem value="Consultant" className="focus:bg-accent/50">Consultant</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-4">
                                        <Label className="text-base font-semibold text-foreground">Services Offered</Label>
                                        <div className="grid gap-4">
                                            <div className={`group flex items-start space-x-4 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                                                formData.affiliatedDetails.services.inPersonConsultation 
                                                    ? 'border-primary bg-primary/10' 
                                                    : 'border-border hover:border-primary/50 bg-card/50'
                                            }`} onClick={() => setFormData(prev => ({
                                                ...prev,
                                                affiliatedDetails: {
                                                    ...prev.affiliatedDetails,
                                                    services: {
                                                        ...prev.affiliatedDetails.services,
                                                        inPersonConsultation: !prev.affiliatedDetails.services.inPersonConsultation
                                                    }
                                                }
                                            }))}>
                                                <div className={`relative flex-shrink-0 w-5 h-5 rounded border-2 transition-all duration-200 ${
                                                    formData.affiliatedDetails.services.inPersonConsultation 
                                                        ? 'border-primary bg-primary' 
                                                        : 'border-muted-foreground group-hover:border-primary'
                                                }`}>
                                                    {formData.affiliatedDetails.services.inPersonConsultation && (
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <svg className="w-3 h-3 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <div className={`p-1.5 rounded-lg ${
                                                            formData.affiliatedDetails.services.inPersonConsultation 
                                                                ? 'bg-primary/20' 
                                                                : 'bg-muted/50 group-hover:bg-primary/10'
                                                        }`}>
                                                            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                            </svg>
                                                        </div>
                                                        <Label htmlFor="affiliated.inPersonConsultation" className="font-semibold text-foreground">In-Person Consultation</Label>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">Patients visit the facility for comprehensive veterinary care.</p>
                                                </div>
                                            </div>
                                            
                                            <div className={`group flex items-start space-x-4 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                                                formData.affiliatedDetails.services.homeConsultation 
                                                    ? 'border-primary bg-primary/10' 
                                                    : 'border-border hover:border-primary/50 bg-card/50'
                                            }`} onClick={() => setFormData(prev => ({
                                                ...prev,
                                                affiliatedDetails: {
                                                    ...prev.affiliatedDetails,
                                                    services: {
                                                        ...prev.affiliatedDetails.services,
                                                        homeConsultation: !prev.affiliatedDetails.services.homeConsultation
                                                    }
                                                }
                                            }))}>
                                                <div className={`relative flex-shrink-0 w-5 h-5 rounded border-2 transition-all duration-200 ${
                                                    formData.affiliatedDetails.services.homeConsultation 
                                                        ? 'border-primary bg-primary' 
                                                        : 'border-muted-foreground group-hover:border-primary'
                                                }`}>
                                                    {formData.affiliatedDetails.services.homeConsultation && (
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
                                                        <Label htmlFor="affiliated.homeConsultation" className="font-semibold text-foreground">Home Consultation</Label>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">You travel to patients' homes for convenient care.</p>
                                                </div>
                                            </div>
                                            
                                            <div className={`group flex items-start space-x-4 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                                                formData.affiliatedDetails.services.onlineConsultation 
                                                    ? 'border-primary bg-primary/10' 
                                                    : 'border-border hover:border-primary/50 bg-card/50'
                                            }`} onClick={() => setFormData(prev => ({
                                                ...prev,
                                                affiliatedDetails: {
                                                    ...prev.affiliatedDetails,
                                                    services: {
                                                        ...prev.affiliatedDetails.services,
                                                        onlineConsultation: !prev.affiliatedDetails.services.onlineConsultation
                                                    }
                                                }
                                            }))}>
                                                <div className={`relative flex-shrink-0 w-5 h-5 rounded border-2 transition-all duration-200 ${
                                                    formData.affiliatedDetails.services.onlineConsultation 
                                                        ? 'border-primary bg-primary' 
                                                        : 'border-muted-foreground group-hover:border-primary'
                                                }`}>
                                                    {formData.affiliatedDetails.services.onlineConsultation && (
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <svg className="w-3 h-3 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <div className={`p-1.5 rounded-lg ${
                                                            formData.affiliatedDetails.services.onlineConsultation 
                                                                ? 'bg-primary/20' 
                                                                : 'bg-muted/50 group-hover:bg-primary/10'
                                                        }`}>
                                                            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                            </svg>
                                                        </div>
                                                        <Label htmlFor="affiliated.onlineConsultation" className="font-semibold text-foreground">Online Consultation</Label>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">Virtual consultations via video, phone, or chat.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2 pt-2">
                                        <Label htmlFor="affiliated.availabilitySchedule" className="text-sm font-medium text-foreground/80">Availability Schedule</Label>
                                        <Textarea 
                                            id="affiliated.availabilitySchedule" 
                                            name="affiliatedDetails.availabilitySchedule" 
                                            value={formData.affiliatedDetails.availabilitySchedule} 
                                            onChange={handleInputChange} 
                                            placeholder="e.g., Monday-Friday: 9 AM - 6 PM, Weekends: 10 AM - 4 PM" 
                                            className="min-h-[100px] rounded-lg bg-background/50 border-border/50 focus-visible:ring-primary/50 focus-visible:ring-offset-0"
                                        />
                                    </div>
                                </div>
                                </div>
                            </div>
                        )}
                        
                        <div className="flex gap-4 items-center pt-6">
                            <Button type="button" variant="outline" onClick={prevStep} className="h-14 px-8 rounded-full min-w-[160px] md:min-w-[200px] flex-1 border-2 hover:bg-muted/50 transition-all duration-200">Back</Button>
                            <Button type="button" onClick={nextStep} className="h-14 px-8 rounded-full min-w-[160px] md:min-w-[200px] flex-1 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 transition-all duration-200 shadow-lg hover:shadow-xl">Next</Button>
                        </div>
                    </div>
                )}

                {/* Step 5: Review & Submit */}
                {currentStep === 5 && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-semibold mb-4">Review & Submit</h2>
                        <p className="text-muted-foreground mb-6">Review your information before submitting.</p>
                        {/* Add review details here */}
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