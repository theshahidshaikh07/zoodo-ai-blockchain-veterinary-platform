'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

// Force dynamic rendering to prevent SSR issues with useAuth
export const dynamic = 'force-dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Building, 
  Calendar, 
  Users, 
  Settings, 
  Upload,
  Edit,
  Trash2,
  Shield,
  Clock,
  FileText
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import UserProfileForm from '@/components/shared/UserProfileForm';
import HospitalProfileForm from '@/components/hospital/HospitalProfileForm';

interface DashboardData {
  userType: string;
  businessName: string;
  accountType: string;
  contactPerson: string;
  upcomingAppointments: number;
  totalPatients: number;
  staffCount: number;
  recentActivity: string;
  quickActions: string[];
}

export default function HospitalDashboard() {
  const { user, logout } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [professionalProfile, setProfessionalProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchDashboardData();
      fetchProfessionalProfile();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/dashboard/overview', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setDashboardData(data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    }
  };

  const fetchProfessionalProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/profile/professional', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setProfessionalProfile(data.data);
      }
    } catch (error) {
      console.error('Error fetching professional profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {professionalProfile?.contactPerson || user?.firstName}!
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your {professionalProfile?.accountType || 'facility'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant={professionalProfile?.isVerified ? "default" : "secondary"}>
                {professionalProfile?.isVerified ? "Verified" : "Pending Verification"}
              </Badge>
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="patients">Patients</TabsTrigger>
            <TabsTrigger value="professional">Professional</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Business Name</CardTitle>
                  <Building className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold truncate">{professionalProfile?.businessName || 'N/A'}</div>
                  <p className="text-xs text-muted-foreground">
                    {professionalProfile?.accountType || 'Facility'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData?.upcomingAppointments || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Scheduled visits
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData?.totalPatients || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Registered patients
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Staff Count</CardTitle>
                  <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData?.staffCount || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Team members
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Business Information */}
            <Card>
              <CardHeader>
                <CardTitle>Business Information</CardTitle>
                <CardDescription>
                  Your facility details and services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <strong>Contact Person:</strong> {professionalProfile?.contactPerson || 'N/A'}
                    </div>
                    <div>
                      <strong>Account Type:</strong> {professionalProfile?.accountType || 'N/A'}
                    </div>
                    <div>
                      <strong>Medical Director:</strong> {professionalProfile?.medicalDirectorName || 'N/A'}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${professionalProfile?.offerOnlineConsultation ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span>Online Consultation</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${professionalProfile?.offerClinicHospital ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span>Clinic/Hospital Services</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Compliance Information */}
            <Card>
              <CardHeader>
                <CardTitle>Compliance Information</CardTitle>
                <CardDescription>
                  Your facility's compliance and licensing details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="text-sm">
                      <strong>Facility License:</strong> {professionalProfile?.facilityLicenseNumber || 'N/A'}
                    </div>
                    <div className="text-sm">
                      <strong>Government Registration:</strong> {professionalProfile?.govtRegistrationNumber || 'N/A'}
                    </div>
                    <div className="text-sm">
                      <strong>Tax ID:</strong> {professionalProfile?.taxId || 'N/A'}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm">
                      <strong>Medical Director License:</strong> {professionalProfile?.medicalDirectorLicenseNumber || 'N/A'}
                    </div>
                    <div className="text-sm">
                      <strong>Verification Status:</strong> 
                      <Badge variant={professionalProfile?.isVerified ? "default" : "secondary"} className="ml-2">
                        {professionalProfile?.isVerified ? "Verified" : "Pending"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common tasks and shortcuts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                    <Calendar className="h-6 w-6 mb-2" />
                    View Appointments
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                    <Users className="h-6 w-6 mb-2" />
                    Manage Staff
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                    <User className="h-6 w-6 mb-2" />
                    View Patients
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                    <Settings className="h-6 w-6 mb-2" />
                    Update Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {dashboardData?.recentActivity || "No recent activity"}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Appointments</CardTitle>
                <CardDescription>
                  Manage your facility's appointments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No appointments yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Your facility's appointments will appear here
                  </p>
                  <Button>
                    <Calendar className="h-4 w-4 mr-2" />
                    View Schedule
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Patients Tab */}
          <TabsContent value="patients" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Patients</CardTitle>
                <CardDescription>
                  Manage your patient records
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No patients yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Your patient records will appear here
                  </p>
                  <Button>
                    <Users className="h-4 w-4 mr-2" />
                    View Patients
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Professional Tab */}
          <TabsContent value="professional" className="space-y-6">
            <HospitalProfileForm 
              profile={professionalProfile}
              onUpdate={fetchProfessionalProfile}
            />
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <UserProfileForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
