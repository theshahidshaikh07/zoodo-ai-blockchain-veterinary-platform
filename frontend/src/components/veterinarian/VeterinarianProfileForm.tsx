'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Save, Upload, Trash2, FileText, Shield, GraduationCap, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VeterinarianProfileFormProps {
  profile?: any;
  onUpdate?: () => void;
}

export default function VeterinarianProfileForm({ profile, onUpdate }: VeterinarianProfileFormProps) {
  const [formData, setFormData] = useState({
    licenseNumber: profile?.licenseNumber || '',
    experience: profile?.experience || '',
    specializations: profile?.specializations || [],
    otherSpecialization: profile?.otherSpecialization || '',
    qualifications: profile?.qualifications || [],
    otherQualification: profile?.otherQualification || '',
    isAffiliated: profile?.isAffiliated || false,
    affiliatedFacilityName: profile?.affiliatedFacilityName || '',
    affiliationType: profile?.affiliationType || '',
    otherFacilityName: profile?.otherFacilityName || '',
    offerHomeConsultation: profile?.offerHomeConsultation || false,
    offerOnlineConsultation: profile?.offerOnlineConsultation || false,
    independentServiceSameAsPersonal: profile?.independentServiceSameAsPersonal || true,
    independentServiceStreet: profile?.independentServiceStreet || '',
    independentServiceCity: profile?.independentServiceCity || '',
    independentServiceZip: profile?.independentServiceZip || '',
    homeVisitRadius: profile?.homeVisitRadius || '',
    availabilitySchedule: profile?.availabilitySchedule || '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const specializationOptions = [
    'General Practice',
    'Surgery',
    'Internal Medicine',
    'Dermatology',
    'Cardiology',
    'Oncology',
    'Neurology',
    'Orthopedics',
    'Emergency Medicine',
    'Exotic Animals',
    'Other'
  ];

  const qualificationOptions = [
    'DVM (Doctor of Veterinary Medicine)',
    'BVSc (Bachelor of Veterinary Science)',
    'MVSc (Master of Veterinary Science)',
    'PhD in Veterinary Science',
    'Diploma in Veterinary Medicine',
    'Other'
  ];

  const affiliationTypeOptions = [
    'Hospital',
    'Clinic',
    'Research Institute',
    'University',
    'Government Agency',
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
            Update your veterinary credentials and experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="licenseNumber">License Number *</Label>
                <Input
                  id="licenseNumber"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  placeholder="Enter your veterinary license number"
                />
              </div>

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

            {/* Qualifications */}
            <div className="space-y-2">
              <Label>Qualifications</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {qualificationOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={`qualification-${option}`}
                      checked={formData.qualifications.includes(option)}
                      onCheckedChange={(checked) => 
                        handleArrayChange('qualifications', option, checked as boolean)
                      }
                      disabled={isLoading}
                    />
                    <Label htmlFor={`qualification-${option}`} className="text-sm">
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
              {formData.qualifications.includes('Other') && (
                <Input
                  name="otherQualification"
                  value={formData.otherQualification}
                  onChange={handleInputChange}
                  placeholder="Specify other qualification"
                  disabled={isLoading}
                />
              )}
            </div>

            {/* Affiliation */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isAffiliated"
                  checked={formData.isAffiliated}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, isAffiliated: checked as boolean }))
                  }
                  disabled={isLoading}
                />
                <Label htmlFor="isAffiliated">I am affiliated with a facility</Label>
              </div>

              {formData.isAffiliated && (
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

                  {formData.affiliationType === 'Other' && (
                    <div className="space-y-2">
                      <Label htmlFor="otherFacilityName">Other Facility Name</Label>
                      <Input
                        id="otherFacilityName"
                        name="otherFacilityName"
                        value={formData.otherFacilityName}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        placeholder="Specify other facility"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Service Offerings */}
            <div className="space-y-4">
              <Label>Service Offerings</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="offerOnlineConsultation"
                    checked={formData.offerOnlineConsultation}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, offerOnlineConsultation: checked as boolean }))
                    }
                    disabled={isLoading}
                  />
                  <Label htmlFor="offerOnlineConsultation">Online Consultation</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="offerHomeConsultation"
                    checked={formData.offerHomeConsultation}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, offerHomeConsultation: checked as boolean }))
                    }
                    disabled={isLoading}
                  />
                  <Label htmlFor="offerHomeConsultation">Home Visits</Label>
                </div>
              </div>

              {formData.offerHomeConsultation && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="homeVisitRadius">Home Visit Radius (km)</Label>
                    <Input
                      id="homeVisitRadius"
                      name="homeVisitRadius"
                      type="number"
                      value={formData.homeVisitRadius}
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

              {formData.offerHomeConsultation && !formData.independentServiceSameAsPersonal && (
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
            {/* License Proof */}
            <div className="space-y-2">
              <Label>License Proof</Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleDocumentUpload(file, 'licenseProof');
                  }}
                  disabled={isLoading}
                />
                {profile?.licenseProofUrl && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDocumentDelete('licenseProof')}
                    disabled={isLoading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {profile?.licenseProofUrl && (
                <p className="text-sm text-green-600">✓ License proof uploaded</p>
              )}
            </div>

            {/* ID Proof */}
            <div className="space-y-2">
              <Label>ID Proof</Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleDocumentUpload(file, 'idProof');
                  }}
                  disabled={isLoading}
                />
                {profile?.idProofUrl && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDocumentDelete('idProof')}
                    disabled={isLoading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {profile?.idProofUrl && (
                <p className="text-sm text-green-600">✓ ID proof uploaded</p>
              )}
            </div>

            {/* Degree Proof */}
            <div className="space-y-2">
              <Label>Degree Proof</Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleDocumentUpload(file, 'degreeProof');
                  }}
                  disabled={isLoading}
                />
                {profile?.degreeProofUrl && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDocumentDelete('degreeProof')}
                    disabled={isLoading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {profile?.degreeProofUrl && (
                <p className="text-sm text-green-600">✓ Degree proof uploaded</p>
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
