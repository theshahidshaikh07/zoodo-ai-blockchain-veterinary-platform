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
        setFormData((prev) => ({
            ...prev,
            practiceType: {
                ...prev.practiceType,
                [name]: checked,
            },
        }));
    } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
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
      if (formData.specialization.includes('Other') && !formData.otherSpecialization) {
        setError('Please specify your other specialization');
        return false;
      }
      if (formData.qualifications.includes('Other') && !formData.otherQualification) {
        setError('Please specify your other qualification');
        return false;
      }
      if (!formData.licenseProof || !formData.idProof || !formData.degreeProof) {
        setError('License proof, ID proof, and Degree proof are required');
        return false;
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
    if (!validateStep(1) || !validateStep(2)) return;
    setIsLoading(true);
    setError('');

    const data = new FormData();
    
    // Create a copy of formData to modify specialization and qualifications
    const formDataToSend = { ...formData };

    if (formDataToSend.specialization.includes('Other') && formDataToSend.otherSpecialization) {
      formDataToSend.specialization = formDataToSend.specialization.filter(s => s !== 'Other');
      formDataToSend.specialization.push(formDataToSend.otherSpecialization);
    }
    if (formDataToSend.qualifications.includes('Other') && formDataToSend.otherQualification) {
      formDataToSend.qualifications = formDataToSend.qualifications.filter(q => q !== 'Other');
      formDataToSend.qualifications.push(formDataToSend.otherQualification);
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
                <div className="space-y-4">
                    <p className="text-muted-foreground mb-6">Determine how you practice.</p>
                    <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                        <input type="checkbox" id="independent" name="independent" checked={formData.practiceType.independent} onChange={handleInputChange} className="mt-1 h-4 w-4" />
                        <div className="-mt-1">
                        <Label htmlFor="independent" className="font-medium">Independent Practice</Label>
                        <p className="text-sm text-muted-foreground">I provide home or online consultations independently.</p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-3">
                        <input type="checkbox" id="personalClinic" name="personalClinic" checked={formData.practiceType.personalClinic} onChange={handleInputChange} className="mt-1 h-4 w-4" />
                        <div className="-mt-1">
                        <Label htmlFor="personalClinic" className="font-medium">Personal Clinic</Label>
                        <p className="text-sm text-muted-foreground">I operate my own clinic where patients visit.</p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-3">
                        <input type="checkbox" id="affiliated" name="affiliated" checked={formData.practiceType.affiliated} onChange={handleInputChange} className="mt-1 h-4 w-4" />
                        <div className="-mt-1">
                        <Label htmlFor="affiliated" className="font-medium">Affiliated Hospital / Clinic</Label>
                        <p className="text-sm text-muted-foreground">I work part-time or full-time at a hospital or clinic.</p>
                        </div>
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
                    <div className="space-y-4">
                        <h2 className="text-2xl font-semibold mb-4">Service Details</h2>
                        <p className="text-muted-foreground mb-6">Define the services you offer.</p>
                        {/* Add service details fields here */}
                        <div className="flex gap-3 items-center">
                            <Button type="button" variant="outline" onClick={prevStep} className="h-14 px-8 rounded-full min-w-[160px] md:min-w-[200px] flex-1">Back</Button>
                            <Button type="button" onClick={nextStep} className="h-14 px-8 rounded-full min-w-[160px] md:min-w-[200px] flex-1 bg-primary text-primary-foreground">Next</Button>
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