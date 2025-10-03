'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { apiService } from '@/lib/api';
import { FileUploadField } from '@/components/ui/file-upload-field';

interface BusinessHours {
  monday: { open: string; close: string; enabled: boolean };
  tuesday: { open: string; close: string; enabled: boolean };
  wednesday: { open: string; close: string; enabled: boolean };
  thursday: { open: string; close: string; enabled: boolean };
  friday: { open: string; close: string; enabled: boolean };
  saturday: { open: string; close: string; enabled: boolean };
  sunday: { open: string; close: string; enabled: boolean };
}

interface FormDataState {
  accountType: 'hospital' | 'clinic';
  businessName: string;
  contactPerson: string;
  email: string;
  phoneNumber: string;
  username: string;
  password: string;
  confirmPassword: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  businessServices: {
    onlineConsultation: boolean;
    clinicHospital: boolean;
  };
  businessHours: BusinessHours;
  facilityLicenseNumber: string;
  govtRegistrationNumber: string;
  taxId: string;
  medicalDirectorName: string;
  medicalDirectorLicenseNumber: string;
  facilityLicenseDocument: File | null;
}

const defaultHours: BusinessHours = {
  monday: { open: '09:00', close: '17:00', enabled: true },
  tuesday: { open: '09:00', close: '17:00', enabled: true },
  wednesday: { open: '09:00', close: '17:00', enabled: true },
  thursday: { open: '09:00', close: '17:00', enabled: true },
  friday: { open: '09:00', close: '17:00', enabled: true },
  saturday: { open: '10:00', close: '14:00', enabled: false },
  sunday: { open: '10:00', close: '14:00', enabled: false },
};

function HospitalClinicWizard() {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<FormDataState>({
    accountType: 'hospital',
    businessName: '',
    contactPerson: '',
    email: '',
    phoneNumber: '',
    username: '',
    password: '',
    confirmPassword: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    businessServices: {
      onlineConsultation: false,
      clinicHospital: true,
    },
    businessHours: defaultHours,
    facilityLicenseNumber: '',
    govtRegistrationNumber: '',
    taxId: '',
    medicalDirectorName: '',
    medicalDirectorLicenseNumber: '',
    facilityLicenseDocument: null,
  });

  useEffect(() => setMounted(true), []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleFileUploadChange = (name: string, file: File | null) => {
    if (name === 'facilityLicenseDocument') {
      setFormData((prev) => ({ ...prev, facilityLicenseDocument: file }));
      setError('');
    }
  };

  const handleAccountTypeChange = (value: 'hospital' | 'clinic') => {
    setFormData((prev) => ({ ...prev, accountType: value }));
  };

  const handleHoursToggle = (day: keyof BusinessHours) => {
    setFormData((prev) => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [day]: { ...prev.businessHours[day], enabled: !prev.businessHours[day].enabled },
      },
    }));
  };

  const handleHoursChange = (
    day: keyof BusinessHours,
    field: 'open' | 'close',
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [day]: { ...prev.businessHours[day], [field]: value },
      },
    }));
  };

  const validateStep = (step: number): boolean => {
    if (step === 1) {
      if (!formData.accountType || !formData.businessName) {
        setError('Please select account type and enter business name');
        return false;
      }
    }
    if (step === 2) {
      if (!formData.contactPerson || !formData.email || !formData.phoneNumber) {
        setError('Please fill contact person, email and phone');
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Please enter a valid email address');
        return false;
      }
    }
    if (step === 3) {
      if (
        !formData.facilityLicenseNumber ||
        !formData.govtRegistrationNumber ||
        !formData.taxId ||
        !formData.medicalDirectorName ||
        !formData.medicalDirectorLicenseNumber ||
        !formData.facilityLicenseDocument
      ) {
        setError('Please provide license number, license document, registration, tax ID, and medical director details');
        return false;
      }
      if (!formData.username || !formData.password || !formData.confirmPassword) {
        setError('Please set username and password');
        return false;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
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
    try {
      const addressFull = `${formData.address}, ${formData.city} ${formData.postalCode}, ${formData.state}, ${formData.country}`;
      const serviceLabels: string[] = [];
      if (formData.businessServices.onlineConsultation) serviceLabels.push('Online Consultation');
      if (formData.businessServices.clinicHospital) serviceLabels.push('Clinic/Hospital');
      const specializationCombined = serviceLabels.join(', ');
      const res = await apiService.registerUser({
        username: formData.username,
        firstName: formData.businessName, // business name as firstName to satisfy backend
        lastName: formData.accountType === 'hospital' ? 'Hospital' : 'Clinic',
        email: formData.email,
        password: formData.password,
        userType: formData.accountType, // 'hospital' | 'clinic'
        phone: formData.phoneNumber,
        address: addressFull,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        postalCode: formData.postalCode,
        specialization: specializationCombined,
        licenseNumber: formData.facilityLicenseNumber,
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

      <div className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-6">
        <div className="w-full max-w-4xl">
          <div className="max-w-xl w-full mx-auto">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full border border-border text-foreground/80 bg-card/40">
                Step {currentStep} of 4
              </div>
              <h1 className="text-3xl font-bold text-foreground mt-3">Register your facility</h1>
              <p className="text-muted-foreground mt-1">Business account for Hospitals and Clinics</p>
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm mb-4">
                {error}
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Account Type</Label>
                  <Select value={formData.accountType} onValueChange={(v) => handleAccountTypeChange(v as 'hospital' | 'clinic')}>
                    <SelectTrigger className="h-10 rounded-lg border-border">
                      <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border/50">
                      <SelectItem value="hospital" className="focus:bg-accent/50">Hospital</SelectItem>
                      <SelectItem value="clinic" className="focus:bg-accent/50">Clinic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessName">{formData.accountType === 'hospital' ? 'Hospital Name' : 'Clinic Name'}</Label>
                  <Input id="businessName" name="businessName" value={formData.businessName} onChange={handleInputChange} placeholder="Enter business name" />
                </div>

                <div className="flex gap-3">
                  <Button type="button" onClick={nextStep} className="h-12 rounded-full flex-1 bg-primary text-primary-foreground">Next</Button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="contactPerson">Contact Person</Label>
                  <Input id="contactPerson" name="contactPerson" value={formData.contactPerson} onChange={handleInputChange} placeholder="Primary contact full name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="business@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} placeholder="+1 555 0123" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea id="address" name="address" value={formData.address} onChange={handleInputChange} placeholder="Street address" className="h-24 rounded-xl pt-3" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input name="city" value={formData.city} onChange={handleInputChange} placeholder="City" />
                  <Input name="state" value={formData.state} onChange={handleInputChange} placeholder="State" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input name="country" value={formData.country} onChange={handleInputChange} placeholder="Country" />
                  <Input name="postalCode" value={formData.postalCode} onChange={handleInputChange} placeholder="Postal Code" />
                </div>

                <div className="flex gap-3 items-center">
                  <Button type="button" variant="outline" onClick={prevStep} className="h-12 rounded-full flex-1">Back</Button>
                  <Button type="button" onClick={nextStep} className="h-12 rounded-full flex-1 bg-primary text-primary-foreground">Next</Button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="grid gap-3 p-4 rounded-xl border border-border/60 bg-card/30">
                  <div className="font-semibold">Compliance Details</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="facilityLicenseNumber">Facility License / Registration Number</Label>
                      <Input id="facilityLicenseNumber" name="facilityLicenseNumber" value={formData.facilityLicenseNumber} onChange={handleInputChange} placeholder="Enter facility license number" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="govtRegistrationNumber">Government Registration Number</Label>
                      <Input id="govtRegistrationNumber" name="govtRegistrationNumber" value={formData.govtRegistrationNumber} onChange={handleInputChange} placeholder="Govt. registration ID" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="taxId">Tax ID (e.g., GST/VAT)</Label>
                      <Input id="taxId" name="taxId" value={formData.taxId} onChange={handleInputChange} placeholder="Tax ID" />
                    </div>
                  
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="medicalDirectorName">Medical Director Name</Label>
                      <Input id="medicalDirectorName" name="medicalDirectorName" value={formData.medicalDirectorName} onChange={handleInputChange} placeholder="Full name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="medicalDirectorLicenseNumber">Medical Director License Number</Label>
                      <Input id="medicalDirectorLicenseNumber" name="medicalDirectorLicenseNumber" value={formData.medicalDirectorLicenseNumber} onChange={handleInputChange} placeholder="License number" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Account Username</Label>
                  <Input id="username" name="username" value={formData.username} onChange={handleInputChange} placeholder="e.g., city-animal-care" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" name="password" type="password" value={formData.password} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleInputChange} />
                  </div>
                </div>

                <div className="grid gap-3 p-4 rounded-xl border border-border/60 bg-card/30">
                  <div className="font-semibold">License Document</div>
                  <FileUploadField
                    label="Facility License Document"
                    name="facilityLicenseDocument"
                    value={formData.facilityLicenseDocument}
                    onChange={handleFileUploadChange}
                    required
                    helperText="Upload your hospital/clinic license or registration certificate."
                    accept="application/pdf,image/jpeg,image/png"
                  />
                </div>

                <div className="space-y-8">
                  <div className="text-center">
                    <h2 className="text-xl font-semibold">Services</h2>
                    <p className="text-muted-foreground text-sm">Select the services you provide</p>
                  </div>
                  <div className="grid gap-4">
                    <div
                      className={`group flex items-start space-x-4 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                        formData.businessServices.onlineConsultation ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50 bg-card/50'
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, businessServices: { ...prev.businessServices, onlineConsultation: !prev.businessServices.onlineConsultation } }))}
                    >
                      <div className={`relative flex-shrink-0 w-5 h-5 rounded border-2 transition-all duration-200 ${
                        formData.businessServices.onlineConsultation ? 'border-primary bg-primary' : 'border-muted-foreground group-hover:border-primary'
                      }`}>
                        {formData.businessServices.onlineConsultation && (
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
                          <Label className="font-semibold text-foreground">Online Consultation</Label>
                        </div>
                        <p className="text-sm text-muted-foreground">Offer remote consultations via video, audio, or chat.</p>
                      </div>
                    </div>
                    <div
                      className={`group flex items-start space-x-4 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                        formData.businessServices.clinicHospital ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50 bg-card/50'
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, businessServices: { ...prev.businessServices, clinicHospital: !prev.businessServices.clinicHospital } }))}
                    >
                      <div className={`relative flex-shrink-0 w-5 h-5 rounded border-2 transition-all duration-200 ${
                        formData.businessServices.clinicHospital ? 'border-primary bg-primary' : 'border-muted-foreground group-hover:border-primary'
                      }`}>
                        {formData.businessServices.clinicHospital && (
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
                          <Label className="font-semibold text-foreground">Clinic/Hospital</Label>
                        </div>
                        <p className="text-sm text-muted-foreground">Provide in-facility consultations and services.</p>
                      </div>
                    </div>
                  </div>
                </div>

                

                <div className="space-y-3">
                  <Label>Operating Hours</Label>
                  {(Object.keys(formData.businessHours) as Array<keyof BusinessHours>).map((day) => (
                    <div key={day} className="grid grid-cols-3 gap-3 items-center border border-border/50 rounded-lg p-3">
                      <div className="text-sm capitalize">{day}</div>
                      <div className="flex items-center gap-2">
                        <Input
                          value={formData.businessHours[day].open}
                          onChange={(e) => handleHoursChange(day, 'open', e.target.value)}
                          placeholder="09:00"
                        />
                        <span className="text-xs text-muted-foreground">to</span>
                        <Input
                          value={formData.businessHours[day].close}
                          onChange={(e) => handleHoursChange(day, 'close', e.target.value)}
                          placeholder="17:00"
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button type="button" variant={formData.businessHours[day].enabled ? 'default' : 'outline'} onClick={() => handleHoursToggle(day)} className="h-9 px-3 rounded-full text-xs">
                          {formData.businessHours[day].enabled ? 'Open' : 'Closed'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 items-center">
                  <Button type="button" variant="outline" onClick={prevStep} className="h-12 rounded-full flex-1">Back</Button>
                  <Button type="button" onClick={nextStep} className="h-12 rounded-full flex-1 bg-primary text-primary-foreground">Next</Button>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="grid gap-2 p-5 rounded-2xl border border-border bg-card/40">
                  <h3 className="font-semibold">Review</h3>
                  <div className="text-sm"><span className="text-muted-foreground">Type:</span> {formData.accountType === 'hospital' ? 'Hospital' : 'Clinic'}</div>
                  <div className="text-sm"><span className="text-muted-foreground">Name:</span> {formData.businessName}</div>
                  <div className="text-sm"><span className="text-muted-foreground">Contact:</span> {formData.contactPerson} • {formData.email} • {formData.phoneNumber}</div>
                  <div className="text-sm"><span className="text-muted-foreground">Username:</span> {formData.username}</div>
                  <div className="text-sm"><span className="text-muted-foreground">Address:</span> {formData.address}, {formData.city} {formData.postalCode}, {formData.state}, {formData.country}</div>
                  <div className="text-sm"><span className="text-muted-foreground">Services:</span> {[
                    formData.businessServices.onlineConsultation && 'Online Consultation',
                    formData.businessServices.clinicHospital && 'Clinic/Hospital',
                  ].filter(Boolean).join(', ') || '—'}</div>
                  <div className="text-sm"><span className="text-muted-foreground">License:</span> {formData.facilityLicenseNumber}</div>
                  <div className="text-sm"><span className="text-muted-foreground">Registration:</span> {formData.govtRegistrationNumber}</div>
                  <div className="text-sm"><span className="text-muted-foreground">Tax ID:</span> {formData.taxId}</div>
                  <div className="text-sm"><span className="text-muted-foreground">Medical Director:</span> {formData.medicalDirectorName} ({formData.medicalDirectorLicenseNumber})</div>
                  <div className="text-sm"><span className="text-muted-foreground">License Document:</span> {formData.facilityLicenseDocument ? formData.facilityLicenseDocument.name : '—'}</div>
                </div>

                <div className="flex gap-3 items-center">
                  <Button type="button" variant="outline" onClick={prevStep} className="h-12 rounded-full flex-1">Back</Button>
                  <Button type="button" onClick={handleSubmit} disabled={isLoading} className="h-12 rounded-full flex-1 bg-primary text-primary-foreground">
                    {isLoading ? (
                      <div className="flex items-center"><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>Submitting...</div>
                    ) : 'Submit'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function HospitalClinicWizardWrapper() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
      <HospitalClinicWizard />
    </Suspense>
  );
}

export default HospitalClinicWizardWrapper;


