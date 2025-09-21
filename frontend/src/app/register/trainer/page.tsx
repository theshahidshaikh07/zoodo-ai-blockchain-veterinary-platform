'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { MultiSelect } from '@/components/ui/multi-select';
import {
  Eye,
  EyeOff,
  ArrowLeft,
  Loader2,
  Upload,
  MapPin,
  Award,
  Users
} from 'lucide-react';
import { apiService } from '@/lib/api';
import Image from 'next/image';
import { useTheme } from 'next-themes';

interface TrainerFormData {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  specialization: string[];
  otherSpecialization: string;
  experience: string;
  certifications: string;
  bio: string;
  hourlyRate: string;
  serviceTypes: string[];
  availability: string[];
  profileImage?: File;
  resume?: File;
}

const specializations = [
  'Basic Obedience',
  'Advanced Training',
  'Behavioral Modification',
  'Puppy Training',
  'Aggression Management',
  'Service Dog Training',
  'Therapy Dog Training',
  'Agility Training',
  'Search and Rescue',
  'Police/Military Dogs',
  'Other'
];

const serviceTypes = [
  'Home Visits',
  'Group Classes',
  'Private Sessions',
  'Online Consultations',
  'Board and Train',
  'Day Training'
];

const availabilityOptions = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

function TrainerRegisterForm() {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState<TrainerFormData>({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    specialization: [],
    otherSpecialization: '',
    experience: '',
    certifications: '',
    bio: '',
    hourlyRate: '',
    serviceTypes: [],
    availability: []
  });

  const [focusedFields, setFocusedFields] = useState<Record<string, boolean>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleMultiSelectChange = (name: string, value: string[]) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'profileImage' | 'resume') => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        [field]: file
      }));
    }
  };

  const setFieldFocus = (field: string, focused: boolean) => {
    setFocusedFields(prev => ({
      ...prev,
      [field]: focused
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.username || !formData.firstName || !formData.lastName || !formData.email || 
        !formData.password || !formData.confirmPassword || !formData.phoneNumber || 
        !formData.address || !formData.city || !formData.state || !formData.zipCode) {
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

    if (formData.specialization.length === 0) {
      setError('Please select at least one specialization');
      return false;
    }

    if (formData.serviceTypes.length === 0) {
      setError('Please select at least one service type');
      return false;
    }

    if (!agreedToTerms) {
      setError('Please agree to the terms and conditions');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const data = new FormData();
      
      // Create a copy of formData to modify specialization
      const formDataToSend = { ...formData };

      // Handle "Other" values by replacing them with the custom input
      if (formDataToSend.specialization.includes('Other') && formDataToSend.otherSpecialization.trim()) {
        formDataToSend.specialization = formDataToSend.specialization.filter(s => s !== 'Other');
        formDataToSend.specialization.push(formDataToSend.otherSpecialization.trim());
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

      data.append('userType', 'trainer');

      const response = await apiService.registerUser(data);
      
      if (response.success) {
        router.push('/dashboard');
      } else {
        setError(response.message || 'Registration failed');
      }
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
        <Link 
          href="/role-selection" 
          className="text-sm text-foreground/60 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-2xl w-full space-y-8">
          {/* Title */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground">
              Become a Pet Trainer
            </h1>
            <p className="text-muted-foreground mt-2">
              Join our network of professional trainers
            </p>
          </div>

          {/* Registration Form */}
          <div className="space-y-6">
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Personal Information
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <Label 
                    htmlFor="firstName" 
                    className={`absolute left-3 transition-all duration-200 pointer-events-none z-10 ${
                      focusedFields.firstName || formData.firstName 
                        ? 'text-xs text-primary -top-2 px-1 bg-background' 
                        : 'text-sm text-muted-foreground/70 top-3'
                    }`}
                  >
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    onFocus={() => setFieldFocus('firstName', true)}
                    onBlur={() => setFieldFocus('firstName', false)}
                    className="h-12 rounded-full border border-gray-300 dark:border-gray-600 bg-background dark:bg-gray-900 text-foreground placeholder-transparent focus:border-primary focus-visible:ring-0 pt-4"
                  />
                </div>

                <div className="relative">
                  <Label 
                    htmlFor="lastName" 
                    className={`absolute left-3 transition-all duration-200 pointer-events-none z-10 ${
                      focusedFields.lastName || formData.lastName 
                        ? 'text-xs text-primary -top-2 px-1 bg-background' 
                        : 'text-sm text-muted-foreground/70 top-3'
                    }`}
                  >
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    onFocus={() => setFieldFocus('lastName', true)}
                    onBlur={() => setFieldFocus('lastName', false)}
                    className="h-12 rounded-full border border-gray-300 dark:border-gray-600 bg-background dark:bg-gray-900 text-foreground placeholder-transparent focus:border-primary focus-visible:ring-0 pt-4"
                  />
                </div>
              </div>

              <div className="relative">
                <Label 
                  htmlFor="email" 
                  className={`absolute left-3 transition-all duration-200 pointer-events-none z-10 ${
                    focusedFields.email || formData.email 
                      ? 'text-xs text-primary -top-2 px-1 bg-background' 
                      : 'text-sm text-muted-foreground/70 top-3'
                  }`}
                >
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  onFocus={() => setFieldFocus('email', true)}
                  onBlur={() => setFieldFocus('email', false)}
                  className="h-12 rounded-full border border-gray-300 dark:border-gray-600 bg-background dark:bg-gray-900 text-foreground placeholder-transparent focus:border-primary focus-visible:ring-0 pt-4"
                />
              </div>

              <div className="relative">
                <Label 
                  htmlFor="username" 
                  className={`absolute left-3 transition-all duration-200 pointer-events-none z-10 ${
                    focusedFields.username || formData.username 
                      ? 'text-xs text-primary -top-2 px-1 bg-background' 
                      : 'text-sm text-muted-foreground/70 top-3'
                  }`}
                >
                  Username
                </Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleInputChange}
                  onFocus={() => setFieldFocus('username', true)}
                  onBlur={() => setFieldFocus('username', false)}
                  className="h-12 rounded-full border border-gray-300 dark:border-gray-600 bg-background dark:bg-gray-900 text-foreground placeholder-transparent focus:border-primary focus-visible:ring-0 pt-4"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <Label 
                    htmlFor="password" 
                    className={`absolute left-3 transition-all duration-200 pointer-events-none z-10 ${
                      focusedFields.password || formData.password 
                        ? 'text-xs text-primary -top-2 px-1 bg-background' 
                        : 'text-sm text-muted-foreground/70 top-3'
                    }`}
                  >
                    Password
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    onFocus={() => setFieldFocus('password', true)}
                    onBlur={() => setFieldFocus('password', false)}
                    className="h-12 rounded-full border border-gray-300 dark:border-gray-600 bg-background dark:bg-gray-900 text-foreground placeholder-transparent focus:border-primary focus-visible:ring-0 pt-4 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground z-20 bg-background dark:bg-gray-900 rounded-full p-1"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                <div className="relative">
                  <Label 
                    htmlFor="confirmPassword" 
                    className={`absolute left-3 transition-all duration-200 pointer-events-none z-10 ${
                      focusedFields.confirmPassword || formData.confirmPassword 
                        ? 'text-xs text-primary -top-2 px-1 bg-background' 
                        : 'text-sm text-muted-foreground/70 top-3'
                    }`}
                  >
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    onFocus={() => setFieldFocus('confirmPassword', true)}
                    onBlur={() => setFieldFocus('confirmPassword', false)}
                    className="h-12 rounded-full border border-gray-300 dark:border-gray-600 bg-background dark:bg-gray-900 text-foreground placeholder-transparent focus:border-primary focus-visible:ring-0 pt-4 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground z-20 bg-background dark:bg-gray-900 rounded-full p-1"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Contact Information
              </h3>

              <div className="relative">
                <Label 
                  htmlFor="phoneNumber" 
                  className={`absolute left-3 transition-all duration-200 pointer-events-none z-10 ${
                    focusedFields.phoneNumber || formData.phoneNumber 
                      ? 'text-xs text-primary -top-2 px-1 bg-background' 
                      : 'text-sm text-muted-foreground/70 top-3'
                  }`}
                >
                  Phone Number
                </Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  required
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  onFocus={() => setFieldFocus('phoneNumber', true)}
                  onBlur={() => setFieldFocus('phoneNumber', false)}
                  className="h-12 rounded-full border border-gray-300 dark:border-gray-600 bg-background dark:bg-gray-900 text-foreground placeholder-transparent focus:border-primary focus-visible:ring-0 pt-4"
                />
              </div>

              <div className="relative">
                <Label 
                  htmlFor="address" 
                  className={`absolute left-3 transition-all duration-200 pointer-events-none z-10 ${
                    focusedFields.address || formData.address 
                      ? 'text-xs text-primary -top-2 px-1 bg-background' 
                      : 'text-sm text-muted-foreground/70 top-3'
                  }`}
                >
                  Address
                </Label>
                <Input
                  id="address"
                  name="address"
                  type="text"
                  required
                  value={formData.address}
                  onChange={handleInputChange}
                  onFocus={() => setFieldFocus('address', true)}
                  onBlur={() => setFieldFocus('address', false)}
                  className="h-12 rounded-full border border-gray-300 dark:border-gray-600 bg-background dark:bg-gray-900 text-foreground placeholder-transparent focus:border-primary focus-visible:ring-0 pt-4"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="relative">
                  <Label 
                    htmlFor="city" 
                    className={`absolute left-3 transition-all duration-200 pointer-events-none z-10 ${
                      focusedFields.city || formData.city 
                        ? 'text-xs text-primary -top-2 px-1 bg-background' 
                        : 'text-sm text-muted-foreground/70 top-3'
                    }`}
                  >
                    City
                  </Label>
                  <Input
                    id="city"
                    name="city"
                    type="text"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    onFocus={() => setFieldFocus('city', true)}
                    onBlur={() => setFieldFocus('city', false)}
                    className="h-12 rounded-full border border-gray-300 dark:border-gray-600 bg-background dark:bg-gray-900 text-foreground placeholder-transparent focus:border-primary focus-visible:ring-0 pt-4"
                  />
                </div>

                <div className="relative">
                  <Label 
                    htmlFor="state" 
                    className={`absolute left-3 transition-all duration-200 pointer-events-none z-10 ${
                      focusedFields.state || formData.state 
                        ? 'text-xs text-primary -top-2 px-1 bg-background' 
                        : 'text-sm text-muted-foreground/70 top-3'
                    }`}
                  >
                    State
                  </Label>
                  <Input
                    id="state"
                    name="state"
                    type="text"
                    required
                    value={formData.state}
                    onChange={handleInputChange}
                    onFocus={() => setFieldFocus('state', true)}
                    onBlur={() => setFieldFocus('state', false)}
                    className="h-12 rounded-full border border-gray-300 dark:border-gray-600 bg-background dark:bg-gray-900 text-foreground placeholder-transparent focus:border-primary focus-visible:ring-0 pt-4"
                  />
                </div>

                <div className="relative">
                  <Label 
                    htmlFor="zipCode" 
                    className={`absolute left-3 transition-all duration-200 pointer-events-none z-10 ${
                      focusedFields.zipCode || formData.zipCode 
                        ? 'text-xs text-primary -top-2 px-1 bg-background' 
                        : 'text-sm text-muted-foreground/70 top-3'
                    }`}
                  >
                    ZIP Code
                  </Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    type="text"
                    required
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    onFocus={() => setFieldFocus('zipCode', true)}
                    onBlur={() => setFieldFocus('zipCode', false)}
                    className="h-12 rounded-full border border-gray-300 dark:border-gray-600 bg-background dark:bg-gray-900 text-foreground placeholder-transparent focus:border-primary focus-visible:ring-0 pt-4"
                  />
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center">
                <Award className="w-5 h-5 mr-2" />
                Professional Information
              </h3>

              <div>
                <Label className="text-sm font-medium text-foreground mb-2 block">
                  Specializations *
                </Label>
                <MultiSelect
                  options={specializations.map(spec => ({ label: spec, value: spec }))}
                  onValueChange={(value) => handleMultiSelectChange('specialization', value)}
                  defaultValue={formData.specialization}
                  placeholder="Select your specializations"
                  maxCount={3}
                  allowOther={true}
                  otherValue={formData.otherSpecialization}
                  onOtherValueChange={(value) => setFormData(prev => ({ ...prev, otherSpecialization: value }))}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  💡 Tip: You can select multiple specializations or add custom ones by selecting "Other"
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium text-foreground mb-2 block">
                  Service Types *
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {serviceTypes.map((service) => (
                    <div key={service} className="flex items-center space-x-2">
                      <Checkbox
                        id={service}
                        checked={formData.serviceTypes.includes(service)}
                        onCheckedChange={() => {
                          const newServiceTypes = formData.serviceTypes.includes(service)
                            ? formData.serviceTypes.filter(item => item !== service)
                            : [...formData.serviceTypes, service];
                          setFormData(prev => ({ ...prev, serviceTypes: newServiceTypes }));
                        }}
                      />
                      <Label htmlFor={service} className="text-sm">
                        {service}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <Label 
                  htmlFor="experience" 
                  className={`absolute left-3 transition-all duration-200 pointer-events-none z-10 ${
                    focusedFields.experience || formData.experience 
                      ? 'text-xs text-primary -top-2 px-1 bg-background' 
                      : 'text-sm text-muted-foreground/70 top-3'
                  }`}
                >
                  Years of Experience
                </Label>
                <Input
                  id="experience"
                  name="experience"
                  type="text"
                  value={formData.experience}
                  onChange={handleInputChange}
                  onFocus={() => setFieldFocus('experience', true)}
                  onBlur={() => setFieldFocus('experience', false)}
                  className="h-12 rounded-full border border-gray-300 dark:border-gray-600 bg-background dark:bg-gray-900 text-foreground placeholder-transparent focus:border-primary focus-visible:ring-0 pt-4"
                />
              </div>

              <div className="relative">
                <Label 
                  htmlFor="certifications" 
                  className={`absolute left-3 transition-all duration-200 pointer-events-none z-10 ${
                    focusedFields.certifications || formData.certifications 
                      ? 'text-xs text-primary -top-2 px-1 bg-background' 
                      : 'text-sm text-muted-foreground/70 top-3'
                  }`}
                >
                  Certifications
                </Label>
                <Input
                  id="certifications"
                  name="certifications"
                  type="text"
                  value={formData.certifications}
                  onChange={handleInputChange}
                  onFocus={() => setFieldFocus('certifications', true)}
                  onBlur={() => setFieldFocus('certifications', false)}
                  className="h-12 rounded-full border border-gray-300 dark:border-gray-600 bg-background dark:bg-gray-900 text-foreground placeholder-transparent focus:border-primary focus-visible:ring-0 pt-4"
                />
              </div>

              <div className="relative">
                <Label 
                  htmlFor="hourlyRate" 
                  className={`absolute left-3 transition-all duration-200 pointer-events-none z-10 ${
                    focusedFields.hourlyRate || formData.hourlyRate 
                      ? 'text-xs text-primary -top-2 px-1 bg-background' 
                      : 'text-sm text-muted-foreground/70 top-3'
                  }`}
                >
                  Hourly Rate ($)
                </Label>
                <Input
                  id="hourlyRate"
                  name="hourlyRate"
                  type="number"
                  value={formData.hourlyRate}
                  onChange={handleInputChange}
                  onFocus={() => setFieldFocus('hourlyRate', true)}
                  onBlur={() => setFieldFocus('hourlyRate', false)}
                  className="h-12 rounded-full border border-gray-300 dark:border-gray-600 bg-background dark:bg-gray-900 text-foreground placeholder-transparent focus:border-primary focus-visible:ring-0 pt-4"
                />
              </div>

              <div>
                <Label htmlFor="bio" className="text-sm font-medium text-foreground mb-2 block">
                  Bio
                </Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell us about your training philosophy and approach..."
                  className="min-h-[100px] rounded-lg border border-gray-300 dark:border-gray-600 bg-background dark:bg-gray-900 text-foreground focus:border-primary focus-visible:ring-0"
                />
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
              />
              <Label htmlFor="terms" className="text-sm text-muted-foreground">
                I agree to the{' '}
                <Link href="/terms" className="text-primary hover:underline">
                  Terms and Conditions
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </Label>
            </div>

            {/* Submit Button */}
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full h-12 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                  Creating account...
                </div>
              ) : (
                'Create Trainer Account'
              )}
            </Button>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link 
                  href="/login" 
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TrainerRegisterPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    }>
      <TrainerRegisterForm />
    </Suspense>
  );
}
