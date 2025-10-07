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
  GraduationCap, 
  Calendar, 
  Users, 
  Settings, 
  Upload,
  Edit,
  Trash2,
  Shield,
  MapPin,
  Clock,
  Building
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import UserProfileForm from '@/components/shared/UserProfileForm';
import TrainerProfileForm from '@/components/trainer/TrainerProfileForm';

interface DashboardData {
  userType: string;
  experience: number;
  specializations: string[];
  hasAcademy: boolean;
  hasTrainingCenter: boolean;
  upcomingSessions: number;
  totalClients: number;
  recentActivity: string;
  quickActions: string[];
}

export default function TrainerDashboard() {
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
                Welcome back, {user?.firstName}!
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your training practice
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant={user?.isVerified ? "default" : "secondary"}>
                {user?.isVerified ? "Verified" : "Pending Verification"}
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
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="professional">Professional</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Experience</CardTitle>
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{professionalProfile?.experience || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Years of experience
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Upcoming Sessions</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData?.upcomingSessions || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Scheduled sessions
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData?.totalClients || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Registered clients
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Practice Type</CardTitle>
                  <Building className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {professionalProfile?.hasAcademy ? "Academy" : 
                     professionalProfile?.hasTrainingCenter ? "Center" : "Independent"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Training practice
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Specializations */}
            <Card>
              <CardHeader>
                <CardTitle>Specializations</CardTitle>
                <CardDescription>
                  Your areas of expertise
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {professionalProfile?.specializations?.map((spec: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {spec}
                    </Badge>
                  )) || (
                    <p className="text-muted-foreground">No specializations added yet</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Practice Details */}
            <Card>
              <CardHeader>
                <CardTitle>Practice Details</CardTitle>
                <CardDescription>
                  Your training practice information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${professionalProfile?.offerHomeTraining ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span>Home Training</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${professionalProfile?.hasTrainingCenter ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span>Training Center</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${professionalProfile?.hasAcademy ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span>Academy</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {professionalProfile?.hasAcademy && (
                      <div className="text-sm">
                        <strong>Academy:</strong> {professionalProfile.academyName}
                      </div>
                    )}
                    {professionalProfile?.hasTrainingCenter && (
                      <div className="text-sm">
                        <strong>Training Center:</strong> {professionalProfile.trainingCenterName}
                      </div>
                    )}
                    {professionalProfile?.offerHomeTraining && professionalProfile?.homeTrainingRadius && (
                      <div className="text-sm flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>Home training radius: {professionalProfile.homeTrainingRadius} km</span>
                      </div>
                    )}
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
                    View Sessions
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                    <Clock className="h-6 w-6 mb-2" />
                    Manage Schedule
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                    <Users className="h-6 w-6 mb-2" />
                    View Clients
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

          {/* Sessions Tab */}
          <TabsContent value="sessions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Training Sessions</CardTitle>
                <CardDescription>
                  Manage your training sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No sessions yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Your upcoming training sessions will appear here
                  </p>
                  <Button>
                    <Calendar className="h-4 w-4 mr-2" />
                    View Schedule
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Clients Tab */}
          <TabsContent value="clients" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Clients</CardTitle>
                <CardDescription>
                  Manage your client relationships
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No clients yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Your client information will appear here
                  </p>
                  <Button>
                    <Users className="h-4 w-4 mr-2" />
                    View Clients
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Professional Tab */}
          <TabsContent value="professional" className="space-y-6">
            <TrainerProfileForm 
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
