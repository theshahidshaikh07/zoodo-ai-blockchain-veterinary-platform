'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Save, Upload, Trash2, FileText, GraduationCap, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TrainerProfileFormProps {
  profile?: any;
  onUpdate?: () => void;
}

export default function TrainerProfileForm({ profile, onUpdate }: TrainerProfileFormProps) {
  const [formData, setFormData] = useState({
    experience: profile?.experience || '',
    specializations: profile?.specializations || [],
    otherSpecialization: profile?.otherSpecialization || '',
    certifications: profile?.certifications || [],
    otherCertification: profile?.otherCertification || '',
    practiceType: profile?.practiceType || { independent: false, trainingCenter: false, affiliated: false },
    offerHomeTraining: profile?.offerHomeTraining || false,
    independentServiceSameAsPersonal: profile?.independentServiceSameAsPersonal || true,
    independentServiceStreet: profile?.independentServiceStreet || '',
    independentServiceCity: profile?.independentServiceCity || '',
    independentServiceZip: profile?.independentServiceZip || '',
    homeTrainingRadius: profile?.homeTrainingRadius || '',
    hasTrainingCenter: profile?.hasTrainingCenter || false,
    trainingCenterName: profile?.trainingCenterName || '',
    trainingCenterAddress: profile?.trainingCenterAddress || '',
    trainingCenterOfferInPerson: profile?.trainingCenterOfferInPerson || false,
    affiliatedFacilityName: profile?.affiliatedFacilityName || '',
    affiliationType: profile?.affiliationType || '',
    hasAcademy: profile?.hasAcademy || false,
    academyName: profile?.academyName || '',
    academyStreet: profile?.academyStreet || '',
    academyCity: profile?.academyCity || '',
    academyState: profile?.academyState || '',
    academyPostalCode: profile?.academyPostalCode || '',
    academyCountry: profile?.academyCountry || '',
    academyPhone: profile?.academyPhone || '',
    availabilitySchedule: profile?.availabilitySchedule || '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const specializationOptions = [
    'Basic Obedience Training',
    'Advanced Obedience Training',
    'Behavioral Modification',
    'Puppy Training',
    'Aggression Management',
    'Service Dog Training',
    'Therapy Dog Training',
    'Search and Rescue Training',
    'Protection Training',
    'Agility Training',
    'Other'
  ];

  const certificationOptions = [
    'CPDT-KA (Certified Professional Dog Trainer - Knowledge Assessed)',
    'CPDT-KSA (Certified Professional Dog Trainer - Knowledge and Skills Assessed)',
    'KPA-CTP (Karen Pryor Academy Certified Training Partner)',
    'IAABC (International Association of Animal Behavior Consultants)',
    'CCPDT (Certification Council for Professional Dog Trainers)',
    'Other'
  ];

  const affiliationTypeOptions = [
    'Training Center',
    'Pet Store',
    'Veterinary Clinic',
    'Animal Shelter',
    'Rescue Organization',
    'Other'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    setError('');
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleArrayChange = (name: string, value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked 
        ? [...prev[name], value]
        : prev[name].filter((item: string) => item !== value)
    }));
    setError('');
  };

  const handlePracticeTypeChange = (type: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      practiceType: {
        ...prev.practiceType,
        [type]: checked
      }
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/profile/professional', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Profile Updated",
          description: "Your professional profile has been updated successfully",
        });
        if (onUpdate) {
          onUpdate();
        }
      } else {
        setError(data.message || 'Failed to update profile');
        toast({
          title: "Update Failed",
          description: data.message || 'Failed to update profile',
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setError('Network error. Please try again.');
      toast({
        title: "Update Error",
        description: "Network error. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDocumentUpload = async (file: File, documentType: string) => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentType', documentType);

      const response = await fetch('/api/profile/upload-document', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: "Document Uploaded",
          description: `${documentType} uploaded successfully`,
        });
        if (onUpdate) {
          onUpdate();
        }
      } else {
        toast({
          title: "Upload Failed",
          description: data.message || 'Failed to upload document',
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Document upload error:', error);
      toast({
        title: "Upload Error",
        description: "Failed to upload document",
        variant: "destructive",
      });
    }
  };

  const handleDocumentDelete = async (documentType: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/profile/document/${documentType}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: "Document Deleted",
          description: `${documentType} deleted successfully`,
        });
        if (onUpdate) {
          onUpdate();
        }
      } else {
        toast({
          title: "Delete Failed",
          description: data.message || 'Failed to delete document',
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Document delete error:', error);
      toast({
        title: "Delete Error",
        description: "Failed to delete document",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Professional Information */}
      <Card>
        <CardHeader>
          <CardTitle>Professional Information</CardTitle>
          <CardDescription>
            Update your training credentials and experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="experience">Years of Experience</Label>
              <Input
                id="experience"
                name="experience"
                type="number"
                value={formData.experience}
                onChange={handleInputChange}
                disabled={isLoading}
                placeholder="Years of experience"
              />
            </div>

            {/* Specializations */}
            <div className="space-y-2">
              <Label>Specializations</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {specializationOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={`specialization-${option}`}
                      checked={formData.specializations.includes(option)}
                      onCheckedChange={(checked) => 
                        handleArrayChange('specializations', option, checked as boolean)
                      }
                      disabled={isLoading}
                    />
                    <Label htmlFor={`specialization-${option}`} className="text-sm">
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
              {formData.specializations.includes('Other') && (
                <Input
                  name="otherSpecialization"
                  value={formData.otherSpecialization}
                  onChange={handleInputChange}
                  placeholder="Specify other specialization"
                  disabled={isLoading}
                />
              )}
            </div>

            {/* Certifications */}
            <div className="space-y-2">
              <Label>Certifications</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {certificationOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={`certification-${option}`}
                      checked={formData.certifications.includes(option)}
                      onCheckedChange={(checked) => 
                        handleArrayChange('certifications', option, checked as boolean)
                      }
                      disabled={isLoading}
                    />
                    <Label htmlFor={`certification-${option}`} className="text-sm">
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
              {formData.certifications.includes('Other') && (
                <Input
                  name="otherCertification"
                  value={formData.otherCertification}
                  onChange={handleInputChange}
                  placeholder="Specify other certification"
                  disabled={isLoading}
                />
              )}
            </div>

            {/* Practice Type */}
            <div className="space-y-4">
              <Label>Practice Type</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="independent"
                    checked={formData.practiceType.independent}
                    onCheckedChange={(checked) => 
                      handlePracticeTypeChange('independent', checked as boolean)
                    }
                    disabled={isLoading}
                  />
                  <Label htmlFor="independent">Independent</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="trainingCenter"
                    checked={formData.practiceType.trainingCenter}
                    onCheckedChange={(checked) => 
                      handlePracticeTypeChange('trainingCenter', checked as boolean)
                    }
                    disabled={isLoading}
                  />
                  <Label htmlFor="trainingCenter">Training Center</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="affiliated"
                    checked={formData.practiceType.affiliated}
                    onCheckedChange={(checked) => 
                      handlePracticeTypeChange('affiliated', checked as boolean)
                    }
                    disabled={isLoading}
                  />
                  <Label htmlFor="affiliated">Affiliated</Label>
                </div>
              </div>
            </div>

            {/* Service Offerings */}
            <div className="space-y-4">
              <Label>Service Offerings</Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="offerHomeTraining"
                  checked={formData.offerHomeTraining}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, offerHomeTraining: checked as boolean }))
                  }
                  disabled={isLoading}
                />
                <Label htmlFor="offerHomeTraining">Home Training</Label>
              </div>

              {formData.offerHomeTraining && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="homeTrainingRadius">Home Training Radius (km)</Label>
                    <Input
                      id="homeTrainingRadius"
                      name="homeTrainingRadius"
                      type="number"
                      value={formData.homeTrainingRadius}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      placeholder="Radius in kilometers"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="independentServiceSameAsPersonal"
                      checked={formData.independentServiceSameAsPersonal}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, independentServiceSameAsPersonal: checked as boolean }))
                      }
                      disabled={isLoading}
                    />
                    <Label htmlFor="independentServiceSameAsPersonal">Same as personal address</Label>
                  </div>
                </div>
              )}

              {formData.offerHomeTraining && !formData.independentServiceSameAsPersonal && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="independentServiceStreet">Street Address</Label>
                    <Input
                      id="independentServiceStreet"
                      name="independentServiceStreet"
                      value={formData.independentServiceStreet}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      placeholder="Street address"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="independentServiceCity">City</Label>
                    <Input
                      id="independentServiceCity"
                      name="independentServiceCity"
                      value={formData.independentServiceCity}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      placeholder="City"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="independentServiceZip">ZIP Code</Label>
                    <Input
                      id="independentServiceZip"
                      name="independentServiceZip"
                      value={formData.independentServiceZip}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      placeholder="ZIP code"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Training Center Details */}
            {formData.practiceType.trainingCenter && (
              <div className="space-y-4">
                <Label>Training Center Details</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="trainingCenterName">Training Center Name</Label>
                    <Input
                      id="trainingCenterName"
                      name="trainingCenterName"
                      value={formData.trainingCenterName}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      placeholder="Training center name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="trainingCenterAddress">Training Center Address</Label>
                    <Input
                      id="trainingCenterAddress"
                      name="trainingCenterAddress"
                      value={formData.trainingCenterAddress}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      placeholder="Training center address"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="trainingCenterOfferInPerson"
                    checked={formData.trainingCenterOfferInPerson}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, trainingCenterOfferInPerson: checked as boolean }))
                    }
                    disabled={isLoading}
                  />
                  <Label htmlFor="trainingCenterOfferInPerson">Offer In-Person Training</Label>
                </div>
              </div>
            )}

            {/* Affiliated Details */}
            {formData.practiceType.affiliated && (
              <div className="space-y-4">
                <Label>Affiliation Details</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="affiliatedFacilityName">Facility Name</Label>
                    <Input
                      id="affiliatedFacilityName"
                      name="affiliatedFacilityName"
                      value={formData.affiliatedFacilityName}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      placeholder="Facility name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="affiliationType">Affiliation Type</Label>
                    <Select
                      value={formData.affiliationType}
                      onValueChange={(value) => handleSelectChange('affiliationType', value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select affiliation type" />
                      </SelectTrigger>
                      <SelectContent>
                        {affiliationTypeOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Academy Details */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasAcademy"
                  checked={formData.hasAcademy}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, hasAcademy: checked as boolean }))
                  }
                  disabled={isLoading}
                />
                <Label htmlFor="hasAcademy">I have an academy</Label>
              </div>

              {formData.hasAcademy && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="academyName">Academy Name</Label>
                    <Input
                      id="academyName"
                      name="academyName"
                      value={formData.academyName}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      placeholder="Academy name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="academyPhone">Academy Phone</Label>
                    <Input
                      id="academyPhone"
                      name="academyPhone"
                      value={formData.academyPhone}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      placeholder="Academy phone number"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="academyStreet">Street Address</Label>
                    <Input
                      id="academyStreet"
                      name="academyStreet"
                      value={formData.academyStreet}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      placeholder="Street address"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="academyCity">City</Label>
                    <Input
                      id="academyCity"
                      name="academyCity"
                      value={formData.academyCity}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      placeholder="City"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="academyState">State</Label>
                    <Input
                      id="academyState"
                      name="academyState"
                      value={formData.academyState}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      placeholder="State"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="academyPostalCode">Postal Code</Label>
                    <Input
                      id="academyPostalCode"
                      name="academyPostalCode"
                      value={formData.academyPostalCode}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      placeholder="Postal code"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="academyCountry">Country</Label>
                    <Input
                      id="academyCountry"
                      name="academyCountry"
                      value={formData.academyCountry}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      placeholder="Country"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Availability Schedule */}
            <div className="space-y-2">
              <Label htmlFor="availabilitySchedule">Availability Schedule (JSON)</Label>
              <Input
                id="availabilitySchedule"
                name="availabilitySchedule"
                value={formData.availabilitySchedule}
                onChange={handleInputChange}
                disabled={isLoading}
                placeholder='{"monday": {"start": "09:00", "end": "17:00"}, ...}'
              />
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Update Professional Profile
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Document Management */}
      <Card>
        <CardHeader>
          <CardTitle>Document Management</CardTitle>
          <CardDescription>
            Upload and manage your professional documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Resume */}
            <div className="space-y-2">
              <Label>Resume</Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleDocumentUpload(file, 'resume');
                  }}
                  disabled={isLoading}
                />
                {profile?.resumeUrl && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDocumentDelete('resume')}
                    disabled={isLoading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {profile?.resumeUrl && (
                <p className="text-sm text-green-600">✓ Resume uploaded</p>
              )}
            </div>

            {/* Profile Photo */}
            <div className="space-y-2">
              <Label>Profile Photo</Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleDocumentUpload(file, 'profilePhoto');
                  }}
                  disabled={isLoading}
                />
                {profile?.profilePhotoUrl && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDocumentDelete('profilePhoto')}
                    disabled={isLoading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {profile?.profilePhotoUrl && (
                <p className="text-sm text-green-600">✓ Profile photo uploaded</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
