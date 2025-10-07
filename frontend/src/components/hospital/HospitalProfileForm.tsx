'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Save, Upload, Trash2, FileText, Building, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface HospitalProfileFormProps {
  profile?: any;
  onUpdate?: () => void;
}

export default function HospitalProfileForm({ profile, onUpdate }: HospitalProfileFormProps) {
  const [formData, setFormData] = useState({
    businessName: profile?.businessName || '',
    contactPerson: profile?.contactPerson || '',
    accountType: profile?.accountType || 'hospital',
    offerOnlineConsultation: profile?.offerOnlineConsultation || false,
    offerClinicHospital: profile?.offerClinicHospital || true,
    facilityLicenseNumber: profile?.facilityLicenseNumber || '',
    govtRegistrationNumber: profile?.govtRegistrationNumber || '',
    taxId: profile?.taxId || '',
    medicalDirectorName: profile?.medicalDirectorName || '',
    medicalDirectorLicenseNumber: profile?.medicalDirectorLicenseNumber || '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const accountTypeOptions = [
    'hospital',
    'clinic'
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
      {/* Business Information */}
      <Card>
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
          <CardDescription>
            Update your facility's business details
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
                <Label htmlFor="businessName">Business Name *</Label>
                <Input
                  id="businessName"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  placeholder="Enter business name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPerson">Contact Person *</Label>
                <Input
                  id="contactPerson"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  placeholder="Enter contact person name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountType">Account Type *</Label>
              <Select
                value={formData.accountType}
                onValueChange={(value) => handleSelectChange('accountType', value)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  {accountTypeOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                    id="offerClinicHospital"
                    checked={formData.offerClinicHospital}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, offerClinicHospital: checked as boolean }))
                    }
                    disabled={isLoading}
                  />
                  <Label htmlFor="offerClinicHospital">Clinic/Hospital Services</Label>
                </div>
              </div>
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
                  Update Business Information
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Compliance Information */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance Information</CardTitle>
          <CardDescription>
            Update your facility's compliance and licensing details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="facilityLicenseNumber">Facility License Number *</Label>
                <Input
                  id="facilityLicenseNumber"
                  name="facilityLicenseNumber"
                  value={formData.facilityLicenseNumber}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  placeholder="Enter facility license number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="govtRegistrationNumber">Government Registration Number *</Label>
                <Input
                  id="govtRegistrationNumber"
                  name="govtRegistrationNumber"
                  value={formData.govtRegistrationNumber}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  placeholder="Enter government registration number"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxId">Tax ID *</Label>
              <Input
                id="taxId"
                name="taxId"
                value={formData.taxId}
                onChange={handleInputChange}
                required
                disabled={isLoading}
                placeholder="Enter tax ID"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="medicalDirectorName">Medical Director Name *</Label>
                <Input
                  id="medicalDirectorName"
                  name="medicalDirectorName"
                  value={formData.medicalDirectorName}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  placeholder="Enter medical director name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="medicalDirectorLicenseNumber">Medical Director License Number *</Label>
                <Input
                  id="medicalDirectorLicenseNumber"
                  name="medicalDirectorLicenseNumber"
                  value={formData.medicalDirectorLicenseNumber}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  placeholder="Enter medical director license number"
                />
              </div>
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
                  Update Compliance Information
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
            Upload and manage your facility's compliance documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Facility License Document */}
            <div className="space-y-2">
              <Label>Facility License Document</Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleDocumentUpload(file, 'facilityLicenseDocument');
                  }}
                  disabled={isLoading}
                />
                {profile?.facilityLicenseDocumentUrl && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDocumentDelete('facilityLicenseDocument')}
                    disabled={isLoading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {profile?.facilityLicenseDocumentUrl && (
                <p className="text-sm text-green-600">✓ Facility license document uploaded</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Verification Status */}
      <Card>
        <CardHeader>
          <CardTitle>Verification Status</CardTitle>
          <CardDescription>
            Your facility's verification status and requirements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Verification Status</h4>
                <p className="text-sm text-muted-foreground">
                  {profile?.isVerified ? 'Your facility has been verified' : 'Your facility is pending verification'}
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                profile?.isVerified 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {profile?.isVerified ? 'Verified' : 'Pending'}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Required Documents</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    profile?.facilityLicenseDocumentUrl ? 'bg-green-500' : 'bg-gray-300'
                  }`}></div>
                  <span>Facility License Document</span>
                </li>
              </ul>
            </div>

            {!profile?.isVerified && (
              <Button 
                variant="outline" 
                onClick={async () => {
                  try {
                    const token = localStorage.getItem('token');
                    const response = await fetch('/api/profile/request-verification', {
                      method: 'POST',
                      headers: {
                        'Authorization': `Bearer ${token}`,
                      },
                    });

                    const data = await response.json();
                    if (data.success) {
                      toast({
                        title: "Verification Requested",
                        description: "Your verification request has been submitted",
                      });
                    }
                  } catch (error) {
                    toast({
                      title: "Request Failed",
                      description: "Failed to submit verification request",
                      variant: "destructive",
                    });
                  }
                }}
              >
                <Shield className="h-4 w-4 mr-2" />
                Request Verification
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
