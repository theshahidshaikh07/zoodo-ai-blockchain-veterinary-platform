'use client';

import { useState, useEffect } from 'react';
import {
  PawPrint, Calendar, FileText, TrendingUp, Bell, Settings, Plus, Eye,
  Brain, Shield, Camera, MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import zoodoLogo from '@/assets/zoodo.png';
import zoodoLightLogo from '@/assets/Zoodo-light.png';

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

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  weight: number;
  healthStatus: 'healthy' | 'monitoring' | 'treatment' | 'recovery';
  lastCheckup: string;
  nextVaccination?: string;
  photoUrl?: string;
}

interface Appointment {
  id: string;
  petName: string;
  vetName: string;
  date: string;
  time: string;
  type: 'checkup' | 'vaccination' | 'surgery' | 'consultation' | 'emergency';
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  consultationType: 'clinic' | 'home-visit' | 'telemedicine';
  location?: string;
  notes?: string;
}

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
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
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
  const [pets, setPets] = useState<Pet[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setOwnerStats({
      totalPets: 2,
      upcomingAppointments: 3,
      completedAppointments: 15,
      totalSpent: 1250.75,
      averageRating: 4.9,
      aiConsultations: 5,
      healthRecords: 8,
      emergencyContacts: 2
    });

    setPets([
      {
        id: '1',
        name: 'Buddy',
        species: 'Dog',
        breed: 'Golden Retriever',
        age: 3,
        weight: 65,
        healthStatus: 'healthy',
        lastCheckup: '2024-01-15',
        nextVaccination: '2024-03-15',
        photoUrl: '/api/placeholder/60/60'
      },
      {
        id: '2',
        name: 'Whiskers',
        species: 'Cat',
        breed: 'Persian',
        age: 2,
        weight: 8,
        healthStatus: 'monitoring',
        lastCheckup: '2024-01-20',
        photoUrl: '/api/placeholder/60/60'
      }
    ]);

    setAppointments([
      {
        id: '1',
        petName: 'Buddy',
        vetName: 'Dr. Sarah Smith',
        date: '2024-02-15',
        time: '10:00 AM',
        type: 'checkup',
        status: 'confirmed',
        consultationType: 'clinic',
        location: 'Central Vet Clinic'
      },
      {
        id: '2',
        petName: 'Whiskers',
        vetName: 'Dr. Mike Johnson',
        date: '2024-02-20',
        time: '2:30 PM',
        type: 'vaccination',
        status: 'scheduled',
        consultationType: 'clinic',
        location: 'Central Vet Clinic'
      }
    ]);

    setHealthRecords([
      {
        id: '1',
        petName: 'Buddy',
        date: '2024-01-15',
        type: 'checkup',
        vetName: 'Dr. Sarah Smith',
        diagnosis: 'Healthy',
        treatment: 'Routine checkup completed',
        medications: [],
        blockchainHash: '0x1234567890abcdef'
      },
      {
        id: '2',
        petName: 'Whiskers',
        date: '2024-01-20',
        type: 'vaccination',
        vetName: 'Dr. Mike Johnson',
        diagnosis: 'Due for annual vaccination',
        treatment: 'Rabies vaccine administered',
        medications: ['Rabies Vaccine'],
        blockchainHash: '0xabcdef1234567890'
      }
    ]);
  }, []);

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

  if (!mounted) {
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
                src={mounted && resolvedTheme === 'dark' ? zoodoLightLogo : zoodoLogo}
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
              <Calendar className="h-4 w-4 text-muted-foreground" />
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
                          <AvatarImage src={pet.photoUrl} />
                          <AvatarFallback>{pet.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{pet.name}</h4>
                            <Badge className={getHealthStatusColor(pet.healthStatus)}>
                              {pet.healthStatus}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {pet.breed} • {pet.age} years • {pet.weight} lbs
                          </p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-xs text-muted-foreground">
                              Last checkup: {pet.lastCheckup}
                            </span>
                            {pet.nextVaccination && (
                              <span className="text-xs text-orange-600">
                                Vaccination due: {pet.nextVaccination}
                              </span>
                            )}
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
                    <Button className="h-20 flex-col space-y-2">
                      <Calendar className="h-6 w-6" />
                      <span className="text-sm">Book Appointment</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col space-y-2">
                      <Brain className="h-6 w-6" />
                      <span className="text-sm">AI Consultation</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col space-y-2">
                      <FileText className="h-6 w-6" />
                      <span className="text-sm">View Records</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col space-y-2">
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
                  <Button>
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
                          <AvatarImage src={pet.photoUrl} />
                          <AvatarFallback>{pet.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-medium">{pet.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {pet.breed} • {pet.age} years
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge className={getHealthStatusColor(pet.healthStatus)}>
                              {pet.healthStatus}
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
                  <Button>
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
                              <AvatarFallback>{appointment.petName[0]}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{appointment.petName}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-medium">{appointment.vetName}</div>
                          <div className="text-xs text-muted-foreground">{appointment.location}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-medium">{appointment.date}</div>
                          <div className="text-xs text-muted-foreground">{appointment.time}</div>
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
    </div>
  );
} 