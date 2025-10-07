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
  PawPrint, 
  Calendar, 
  FileText, 
  Settings, 
  Plus,
  Edit,
  Trash2,
  Camera
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import PetProfileForm from '@/components/pet-owner/PetProfileForm';
import UserProfileForm from '@/components/shared/UserProfileForm';

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  gender: string;
  birthday: string;
  age: number;
  ageUnit: string;
  weight: number;
  weightUnit: string;
  microchip: string;
  sterilized: boolean;
  photoUrl: string;
}

interface DashboardData {
  userType: string;
  petCount: number;
  upcomingAppointments: number;
  recentActivity: string;
  quickActions: string[];
}

export default function PetOwnerDashboard() {
  const { user, logout } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchDashboardData();
      fetchPets();
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

  const fetchPets = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success && data.data.profile?.pets) {
        setPets(data.data.profile.pets);
      }
    } catch (error) {
      console.error('Error fetching pets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPet = () => {
    setActiveTab('pets');
  };

  const handleDeletePet = async (petId: string) => {
    try {
      // TODO: Implement delete pet API
      toast({
        title: "Pet Deleted",
        description: "Pet has been removed from your profile",
      });
      fetchPets();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete pet",
        variant: "destructive",
      });
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
                Manage your pets and appointments
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="pets">My Pets</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Pets</CardTitle>
                  <PawPrint className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData?.petCount || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Registered pets
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
                  <CardTitle className="text-sm font-medium">Medical Records</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">
                    Total records
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Account Status</CardTitle>
                  <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {user?.isVerified ? "✓" : "⏳"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {user?.isVerified ? "Verified" : "Pending"}
                  </p>
                </CardContent>
              </Card>
            </div>

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
                  <Button onClick={handleAddPet} className="h-20 flex flex-col items-center justify-center">
                    <Plus className="h-6 w-6 mb-2" />
                    Add New Pet
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                    <Calendar className="h-6 w-6 mb-2" />
                    Book Appointment
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                    <FileText className="h-6 w-6 mb-2" />
                    View Records
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                    <User className="h-6 w-6 mb-2" />
                    Find Veterinarians
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

          {/* Pets Tab */}
          <TabsContent value="pets" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">My Pets</h2>
              <Button onClick={handleAddPet}>
                <Plus className="h-4 w-4 mr-2" />
                Add Pet
              </Button>
            </div>

            {pets.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <PawPrint className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No pets registered</h3>
                  <p className="text-muted-foreground mb-4">
                    Add your first pet to get started
                  </p>
                  <Button onClick={handleAddPet}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Pet
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pets.map((pet) => (
                  <Card key={pet.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{pet.name}</CardTitle>
                          <CardDescription>
                            {pet.species} • {pet.breed}
                          </CardDescription>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDeletePet(pet.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Age:</span>
                          <span className="text-sm">{pet.age} {pet.ageUnit}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Weight:</span>
                          <span className="text-sm">{pet.weight} {pet.weightUnit}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Gender:</span>
                          <span className="text-sm capitalize">{pet.gender}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Sterilized:</span>
                          <span className="text-sm">{pet.sterilized ? "Yes" : "No"}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Appointments</CardTitle>
                <CardDescription>
                  Manage your pet's appointments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No appointments yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Book your first appointment to get started
                  </p>
                  <Button>
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Appointment
                  </Button>
                </div>
              </CardContent>
            </Card>
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
