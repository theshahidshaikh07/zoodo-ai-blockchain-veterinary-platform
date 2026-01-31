'use client';

import { useState, useEffect } from 'react';
import {
  PawPrint, FileText, TrendingUp, Bell, Settings, Plus, Eye,
  Brain, Shield, Camera, MessageSquare, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'; // Removed popover
// import { Calendar } from '@/components/ui/calendar'; // Removed calendar component
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { apiService, Pet as ApiPet, Appointment as ApiAppointment, User } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
// import { format } from 'date-fns'; // Removed format import
import { toast } from 'sonner';


interface PetInfo {
  name: string;
  gender: 'male' | 'female' | 'unknown';
  species: string;
  breed?: string;
  birthday?: string;
  age?: string;
  ageUnit?: 'Years' | 'Months' | 'Days';
  weight?: string;
  weightUnit?: 'Kgs' | 'Gms';
  microchip?: string;
  sterilized?: 'yes' | 'no';
}

interface PetOwnerStats {
  totalPets: number;
  upcomingAppointments: number;
  completedAppointments: number;
  totalSpent: number;
  averageRating: number;
  aiConsultations: number;
  healthRecords: number;
  emergencyContacts: number;
}

// Using API types directly - no local interfaces needed

interface HealthRecord {
  id: string;
  petName: string;
  date: string;
  type: 'vaccination' | 'checkup' | 'surgery' | 'treatment' | 'emergency';
  vetName: string;
  diagnosis?: string;
  treatment?: string;
  medications?: string[];
  nextVisit?: string;
  blockchainHash: string;
}

export default function PetOwnerDashboard() {
  const { resolvedTheme } = useTheme();
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [isAddPetModalOpen, setIsAddPetModalOpen] = useState(false);
  const [petFormData, setPetFormData] = useState<PetInfo>({
    name: '',
    gender: 'unknown',
    species: '',
    breed: '',
    birthday: '',
    age: '',
    ageUnit: 'Years',
    weight: '',
    weightUnit: 'Kgs',
    microchip: '',
    sterilized: 'no'
  });
  const [isAddingPet, setIsAddingPet] = useState(false);
  const [ownerStats, setOwnerStats] = useState<PetOwnerStats>({
    totalPets: 0,
    upcomingAppointments: 0,
    completedAppointments: 0,
    totalSpent: 0,
    averageRating: 0,
    aiConsultations: 0,
    healthRecords: 0,
    emergencyContacts: 0
  });
  const [pets, setPets] = useState<ApiPet[]>([]);
  const [appointments, setAppointments] = useState<ApiAppointment[]>([]);
  const [providers, setProviders] = useState<User[]>([]);
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      // If no user, set loading to false immediately (dashboard pages work without auth)
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch pets, appointments, and providers in parallel
        const [petsResponse, appointmentsResponse, providersResponse] = await Promise.all([
          apiService.getPets(),
          apiService.getAppointments(),
          apiService.getProviders()
        ]);

        if (petsResponse.success && petsResponse.data) {
          setPets(petsResponse.data);
        }

        if (appointmentsResponse.success && appointmentsResponse.data) {
          setAppointments(appointmentsResponse.data);
        }

        if (providersResponse.success && providersResponse.data) {
          setProviders(providersResponse.data);
        }

        // Calculate stats from real data
        const upcomingAppointments = appointmentsResponse.data?.filter(
          apt => apt.status === 'scheduled' || apt.status === 'confirmed'
        ).length || 0;

        const completedAppointments = appointmentsResponse.data?.filter(
          apt => apt.status === 'completed'
        ).length || 0;

        setOwnerStats({
          totalPets: petsResponse.data?.length || 0,
          upcomingAppointments,
          completedAppointments,
          totalSpent: 0, // This would need to be calculated from payment data
          averageRating: 0, // This would need to be calculated from reviews
          aiConsultations: 0, // This would need to be fetched from AI service
          healthRecords: 0, // This would need to be fetched from health records
          emergencyContacts: 0 // This would need to be fetched from emergency contacts
        });

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if auth is not loading (to avoid race conditions)
    if (!authLoading) {
      fetchDashboardData();
    }
  }, [user, authLoading]);

  // Navigation handlers
  const handleAIClick = () => {
    router.push('/ai-assistant');
  };

  const handleBookAppointment = () => {
    router.push('/services/find-vets');
  };

  const handleAddPet = () => {
    setIsAddPetModalOpen(true);
  };

  const closeAddPetModal = () => {
    setIsAddPetModalOpen(false);
    // Reset form data
    setPetFormData({
      name: '',
      gender: 'unknown',
      species: '',
      breed: '',
      birthday: '',
      age: '',
      ageUnit: 'Years',
      weight: '',
      weightUnit: 'Kgs',
      microchip: '',
      sterilized: 'no'
    });
  };

  const handlePetFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!petFormData.name.trim() || !petFormData.species.trim()) {
      toast.error('Please fill in pet name and species');
      return;
    }

    setIsAddingPet(true);

    try {
      // Create pet data in the format expected by the API
      const petData = {
        name: petFormData.name,
        species: petFormData.species,
        breed: petFormData.breed || undefined,
        age: petFormData.age ? parseInt(petFormData.age) : undefined,
        weight: petFormData.weight ? parseFloat(petFormData.weight) : undefined,
        // Add other fields as needed based on your API
      };

      const response = await apiService.createPet(petData);

      if (response.success) {
        toast.success('Pet added successfully!');
        closeAddPetModal();
        // Refresh the pets data
        const petsResponse = await apiService.getPets();
        if (petsResponse.success && petsResponse.data) {
          setPets(petsResponse.data);
          setOwnerStats(prev => ({
            ...prev,
            totalPets: petsResponse.data?.length || 0
          }));
        }
      } else {
        toast.error(response.message || 'Failed to add pet');
      }
    } catch (error) {
      console.error('Error adding pet:', error);
      toast.error('An error occurred while adding your pet. Please try again.');
    } finally {
      setIsAddingPet(false);
    }
  };

  // Helper functions to get names from IDs
  const getPetName = (petId: string) => {
    const pet = pets.find(p => p.id === petId);
    return pet ? pet.name : 'Unknown Pet';
  };

  const getProviderName = (providerId: string) => {
    const provider = providers.find(p => p.id === providerId);
    return provider ? `${provider.firstName} ${provider.lastName}` : 'Unknown Provider';
  };

  const formatAppointmentDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatAppointmentTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500';
      case 'scheduled': return 'bg-blue-500';
      case 'in-progress': return 'bg-yellow-500';
      case 'completed': return 'bg-gray-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-500 text-white';
      case 'monitoring': return 'bg-yellow-500 text-black';
      case 'treatment': return 'bg-orange-500 text-white';
      case 'recovery': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  if (!mounted || loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Image
                src="/Zoodo.png"
                alt="Zoodo Pet Owner"
                width={120}
                height={40}
                className="h-3 md:h-4 lg:h-5 w-auto"
              />
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                Pet Owner Dashboard
              </Badge>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
              <Avatar>
                <AvatarImage src="/api/placeholder/32/32" />
                <AvatarFallback>PO</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 lg:px-8 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, John!</h1>
          <p className="text-muted-foreground">Manage your pets and appointments</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Pets</CardTitle>
              <PawPrint className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ownerStats.totalPets}</div>
              <p className="text-xs text-muted-foreground">
                All healthy and happy
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ownerStats.upcomingAppointments}</div>
              <p className="text-xs text-muted-foreground">
                Next: Tomorrow 10:00 AM
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Health Records</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ownerStats.healthRecords}</div>
              <p className="text-xs text-muted-foreground">
                Blockchain secured
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${ownerStats.totalSpent.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                This year
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="pets">My Pets</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="health-records">Health Records</TabsTrigger>
            <TabsTrigger value="ai-assistant">AI Assistant</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>My Pets</CardTitle>
                  <CardDescription>Your beloved companions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pets.map((pet) => (
                      <div key={pet.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={undefined} />
                          <AvatarFallback>{pet.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{pet.name}</h4>
                            <Badge className={getHealthStatusColor('healthy')}>
                              {'healthy'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {pet.breed} • {pet.age} years • {pet.weight} lbs
                          </p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-xs text-muted-foreground">
                              Last checkup: {'Not available'}
                            </span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks and shortcuts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button className="h-20 flex-col space-y-2" onClick={handleBookAppointment}>
                      <Plus className="h-6 w-6" />
                      <span className="text-sm">Book Appointment</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col space-y-2" onClick={handleAIClick}>
                      <Brain className="h-6 w-6" />
                      <span className="text-sm">AI Consultation</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col space-y-2">
                      <FileText className="h-6 w-6" />
                      <span className="text-sm">View Records</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col space-y-2" onClick={handleAddPet}>
                      <Plus className="h-6 w-6" />
                      <span className="text-sm">Add Pet</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="pets" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Pet Management</CardTitle>
                    <CardDescription>Manage your pets&#39; information and health</CardDescription>
                  </div>
                  <Button onClick={handleAddPet}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Pet
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pets.map((pet) => (
                    <Card key={pet.id} className="p-4">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={undefined} />
                          <AvatarFallback>{pet.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-medium">{pet.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {pet.breed} • {pet.age} years
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge className={getHealthStatusColor('healthy')}>
                              {'healthy'}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {pet.weight} lbs
                            </span>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Appointment History</CardTitle>
                    <CardDescription>View and manage your appointments</CardDescription>
                  </div>
                  <Button onClick={handleBookAppointment}>
                    <Plus className="h-4 w-4 mr-2" />
                    Book Appointment
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pet</TableHead>
                      <TableHead>Vet</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{getPetName(appointment.petId)[0]}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{getPetName(appointment.petId)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-medium">{getProviderName(appointment.providerId)}</div>
                          <div className="text-xs text-muted-foreground">{'Clinic'}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-medium">{formatAppointmentDate(appointment.appointmentDate)}</div>
                          <div className="text-xs text-muted-foreground">{formatAppointmentTime(appointment.appointmentDate)}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {appointment.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(appointment.status)}`} />
                            <span className="text-sm capitalize">{appointment.status}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="health-records" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Health Records</CardTitle>
                <CardDescription>Blockchain-secured medical records</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {healthRecords.map((record) => (
                    <div key={record.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <Shield className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{record.petName} - {record.type}</h4>
                          <Badge variant="outline">{record.date}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {record.vetName} • {record.diagnosis}
                        </p>
                        {record.treatment && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Treatment: {record.treatment}
                          </p>
                        )}
                        {record.medications && record.medications.length > 0 && (
                          <div className="flex items-center space-x-2 mt-2">
                            <span className="text-xs text-muted-foreground">Medications:</span>
                            {record.medications.map((med, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {med}
                              </Badge>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-xs text-muted-foreground">Blockchain Hash:</span>
                          <code className="text-xs bg-muted px-2 py-1 rounded">
                            {record.blockchainHash.slice(0, 10)}...
                          </code>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-assistant" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>AI Pet Assistant</CardTitle>
                  <CardDescription>Get AI-powered pet care advice</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 p-4 border rounded-lg">
                      <Brain className="h-8 w-8 text-primary" />
                      <div className="flex-1">
                        <h4 className="font-medium">Symptom Checker</h4>
                        <p className="text-sm text-muted-foreground">
                          Describe symptoms for AI analysis
                        </p>
                      </div>
                      <Button size="sm">Start Check</Button>
                    </div>

                    <div className="flex items-center space-x-4 p-4 border rounded-lg">
                      <Camera className="h-8 w-8 text-blue-500" />
                      <div className="flex-1">
                        <h4 className="font-medium">Photo Analysis</h4>
                        <p className="text-sm text-muted-foreground">
                          Upload photos for AI diagnosis
                        </p>
                      </div>
                      <Button variant="outline" size="sm">Upload Photo</Button>
                    </div>

                    <div className="flex items-center space-x-4 p-4 border rounded-lg">
                      <MessageSquare className="h-8 w-8 text-green-500" />
                      <div className="flex-1">
                        <h4 className="font-medium">Chat with AI</h4>
                        <p className="text-sm text-muted-foreground">
                          Ask questions about pet care
                        </p>
                      </div>
                      <Button variant="outline" size="sm">Start Chat</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent AI Consultations</CardTitle>
                  <CardDescription>Your recent AI-assisted consultations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <Brain className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Buddy - Skin Condition</p>
                          <p className="text-sm text-muted-foreground">2 hours ago</p>
                        </div>
                      </div>
                      <Badge variant="outline">Completed</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center">
                          <Camera className="h-4 w-4 text-blue-500" />
                        </div>
                        <div>
                          <p className="font-medium">Whiskers - Behavior</p>
                          <p className="text-sm text-muted-foreground">1 day ago</p>
                        </div>
                      </div>
                      <Badge variant="outline">Completed</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Pet Modal */}
      <Dialog open={isAddPetModalOpen} onOpenChange={setIsAddPetModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Pet</DialogTitle>
          </DialogHeader>

          <form onSubmit={handlePetFormSubmit} className="space-y-5">
            {/* Row 1: Name + Gender */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="Pet's Name"
                value={petFormData.name}
                onChange={(e) => setPetFormData(prev => ({ ...prev, name: e.target.value }))}
                className="h-12 rounded-xl"
              />
              <div className="flex gap-2 md:col-span-2">
                {(['male', 'female', 'unknown'] as const).map(g => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setPetFormData(prev => ({ ...prev, gender: g }))}
                    className={`flex-1 h-12 rounded-xl border ${petFormData.gender === g
                        ? 'border-primary text-primary bg-primary/10'
                        : 'border-border text-foreground/80 hover:bg-accent'
                      }`}
                  >
                    {g.charAt(0).toUpperCase() + g.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Row 2: Species + Breed */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Select
                  value={petFormData.species}
                  onValueChange={(v) => setPetFormData(prev => ({ ...prev, species: v }))}
                >
                  <SelectTrigger className="h-14 rounded-full pl-4 pr-10">
                    <SelectValue placeholder="Pet Species" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="Dog">Dog</SelectItem>
                    <SelectItem value="Cat">Cat</SelectItem>
                    <SelectItem value="Bird">Bird</SelectItem>
                    <SelectItem value="Rabbit">Rabbit</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Input
                placeholder="Breed (Optional)"
                value={petFormData.breed || ''}
                onChange={(e) => setPetFormData(prev => ({ ...prev, breed: e.target.value }))}
                className="h-14 rounded-full"
              />
            </div>

            {/* Row 3: Birthdate + Age + Weight */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Input
                  type="date"
                  value={petFormData.birthday || ''}
                  onChange={(e) => setPetFormData(prev => ({ ...prev, birthday: e.target.value }))}
                  className="h-14 rounded-full"
                  placeholder="Birthdate (optional)"
                />
              </div>
              <div className="relative flex gap-2">
                <Input
                  type="number"
                  placeholder="Pet Age"
                  value={petFormData.age || ''}
                  onChange={(e) => setPetFormData(prev => ({ ...prev, age: e.target.value }))}
                  className="h-14 rounded-full flex-1"
                />
                <div className="relative">
                  <Select
                    value={petFormData.ageUnit || 'Years'}
                    onValueChange={(v) => setPetFormData(prev => ({ ...prev, ageUnit: v as PetInfo['ageUnit'] }))}
                  >
                    <SelectTrigger className="w-28 h-14 rounded-full pl-4 pr-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="Years">Years</SelectItem>
                      <SelectItem value="Months">Months</SelectItem>
                      <SelectItem value="Days">Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="relative flex gap-2">
                <Input
                  type="number"
                  placeholder="Pet Weight"
                  value={petFormData.weight || ''}
                  onChange={(e) => setPetFormData(prev => ({ ...prev, weight: e.target.value }))}
                  className="h-14 rounded-full flex-1"
                />
                <div className="relative">
                  <Select
                    value={petFormData.weightUnit || 'Kgs'}
                    onValueChange={(v) => setPetFormData(prev => ({ ...prev, weightUnit: v as PetInfo['weightUnit'] }))}
                  >
                    <SelectTrigger className="w-28 h-14 rounded-full pl-4 pr-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="Kgs">Kgs</SelectItem>
                      <SelectItem value="Gms">Gms</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Input
              placeholder="Microchip Number (Optional)"
              value={petFormData.microchip || ''}
              onChange={(e) => setPetFormData(prev => ({ ...prev, microchip: e.target.value }))}
              className="h-12 rounded-xl"
            />

            <div className="flex items-center justify-between">
              {/* Sterilized segmented buttons */}
              <div className="flex items-center gap-2 text-sm">
                {([
                  { key: 'yes', label: 'Sterilized' },
                  { key: 'no', label: 'Not Sterilized' },
                ] as const).map(opt => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setPetFormData(prev => ({ ...prev, sterilized: opt.key }))}
                    className={`px-3 h-10 rounded-full border transition-colors ${petFormData.sterilized === opt.key
                        ? 'border-primary text-primary bg-primary/10'
                        : 'border-border text-foreground/80 hover:bg-accent'
                      }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 items-center pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={closeAddPetModal}
                className="h-14 px-8 rounded-full min-w-[160px] md:min-w-[200px] flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isAddingPet}
                className="h-14 px-8 rounded-full min-w-[160px] md:min-w-[200px] flex-1 bg-primary text-primary-foreground disabled:opacity-50"
              >
                {isAddingPet ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                    Adding Pet...
                  </div>
                ) : 'Add Pet'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 