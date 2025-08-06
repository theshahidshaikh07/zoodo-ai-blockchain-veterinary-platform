'use client';

import { useState, useEffect } from 'react';
import {
  Calendar, Clock, FileText, TrendingUp, Video, Star, Bell, Settings,
  Plus, Eye, Brain, Database, Shield
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

interface VetStats {
  totalAppointments: number;
  completedToday: number;
  pendingAppointments: number;
  totalPatients: number;
  averageRating: number;
  totalEarnings: number;
  aiConsultations: number;
  telemedicineSessions: number;
}

interface Appointment {
  id: string;
  patientName: string;
  petName: string;
  petSpecies: string;
  date: string;
  time: string;
  type: 'checkup' | 'vaccination' | 'surgery' | 'consultation' | 'emergency';
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  consultationType: 'clinic' | 'home-visit' | 'telemedicine';
  ownerPhone: string;
  priority: 'low' | 'medium' | 'high' | 'emergency';
}

export default function VeterinarianDashboard() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [vetStats, setVetStats] = useState<VetStats>({
    totalAppointments: 0,
    completedToday: 0,
    pendingAppointments: 0,
    totalPatients: 0,
    averageRating: 0,
    totalEarnings: 0,
    aiConsultations: 0,
    telemedicineSessions: 0
  });
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setVetStats({
      totalAppointments: 156,
      completedToday: 8,
      pendingAppointments: 12,
      totalPatients: 89,
      averageRating: 4.8,
      totalEarnings: 12450.75,
      aiConsultations: 23,
      telemedicineSessions: 15
    });

    setAppointments([
      {
        id: '1',
        patientName: 'John Smith',
        petName: 'Buddy',
        petSpecies: 'Dog',
        date: '2024-02-15',
        time: '10:00 AM',
        type: 'checkup',
        status: 'confirmed',
        consultationType: 'clinic',
        ownerPhone: '+1 (555) 123-4567',
        priority: 'medium'
      },
      {
        id: '2',
        patientName: 'Sarah Johnson',
        petName: 'Whiskers',
        petSpecies: 'Cat',
        date: '2024-02-15',
        time: '11:30 AM',
        type: 'vaccination',
        status: 'scheduled',
        consultationType: 'clinic',
        ownerPhone: '+1 (555) 234-5678',
        priority: 'low'
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'emergency': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      case 'low': return 'bg-green-500 text-white';
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
                alt="Zoodo Vet"
                width={120}
                height={40}
                className="h-3 md:h-4 lg:h-5 w-auto"
              />
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                Veterinarian Dashboard
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
                <AvatarFallback>DR</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 lg:px-8 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Dr. Sarah Smith</h1>
          <p className="text-muted-foreground">Veterinary Practice Dashboard</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today&#39;s Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{vetStats.totalAppointments}</div>
              <p className="text-xs text-muted-foreground">
                {vetStats.completedToday} completed today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Appointments</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{vetStats.pendingAppointments}</div>
              <p className="text-xs text-muted-foreground">
                Next: 10:00 AM
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Patient Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{vetStats.averageRating}/5.0</div>
              <p className="text-xs text-muted-foreground">
                Based on 156 reviews
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Earnings</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${vetStats.totalEarnings.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="ai-assistant">AI Assistant</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Today&#39;s Schedule</CardTitle>
                  <CardDescription>Your appointments for today</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {appointments.map((appointment) => (
                      <div key={appointment.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                        <div className="flex-shrink-0">
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(appointment.status)}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{appointment.petName}</h4>
                            <Badge className={getPriorityColor(appointment.priority)}>
                              {appointment.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {appointment.patientName} • {appointment.petSpecies}
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{appointment.time}</span>
                            <span className="text-sm capitalize">{appointment.consultationType}</span>
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
                      <Video className="h-6 w-6" />
                      <span className="text-sm">Start Telemedicine</span>
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
                      <span className="text-sm">New Appointment</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Appointment Management</CardTitle>
                    <CardDescription>Manage all your appointments and consultations</CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Appointment
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
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
                            <div>
                              <p className="font-medium">{appointment.petName}</p>
                              <p className="text-sm text-muted-foreground">{appointment.patientName}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-medium">{appointment.time}</div>
                          <div className="text-xs text-muted-foreground">{appointment.date}</div>
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
                          <Badge className={getPriorityColor(appointment.priority)}>
                            {appointment.priority}
                          </Badge>
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

          <TabsContent value="ai-assistant" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>AI Assistant</CardTitle>
                  <CardDescription>Get AI-powered diagnostic assistance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 p-4 border rounded-lg">
                      <Brain className="h-8 w-8 text-primary" />
                      <div className="flex-1">
                        <h4 className="font-medium">Symptom Analysis</h4>
                        <p className="text-sm text-muted-foreground">
                          Upload images or describe symptoms for AI analysis
                        </p>
                      </div>
                      <Button size="sm">Start Analysis</Button>
                    </div>
                    
                    <div className="flex items-center space-x-4 p-4 border rounded-lg">
                      <Database className="h-8 w-8 text-blue-500" />
                      <div className="flex-1">
                        <h4 className="font-medium">Medical Records</h4>
                        <p className="text-sm text-muted-foreground">
                          Access blockchain-secured medical records
                        </p>
                      </div>
                      <Button variant="outline" size="sm">View Records</Button>
                    </div>
                    
                    <div className="flex items-center space-x-4 p-4 border rounded-lg">
                      <Shield className="h-8 w-8 text-green-500" />
                      <div className="flex-1">
                        <h4 className="font-medium">Treatment Recommendations</h4>
                        <p className="text-sm text-muted-foreground">
                          Get AI-suggested treatment plans
                        </p>
                      </div>
                      <Button variant="outline" size="sm">Get Recommendations</Button>
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
                          <Database className="h-4 w-4 text-blue-500" />
                        </div>
                        <div>
                          <p className="font-medium">Whiskers - Vaccination</p>
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

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Practice Analytics</CardTitle>
                  <CardDescription>Key performance metrics and trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Total Patients</span>
                      <span className="text-sm font-bold">{vetStats.totalPatients}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">AI Consultations</span>
                      <span className="text-sm text-blue-500">{vetStats.aiConsultations}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Telemedicine Sessions</span>
                      <span className="text-sm text-green-500">{vetStats.telemedicineSessions}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Average Rating</span>
                      <span className="text-sm text-yellow-500">{vetStats.averageRating}/5.0</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue Analytics</CardTitle>
                  <CardDescription>Financial performance and earnings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Monthly Earnings</span>
                      <span className="text-sm font-bold">${vetStats.totalEarnings.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Average Per Appointment</span>
                      <span className="text-sm text-muted-foreground">$89.50</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Consultation Rate</span>
                      <span className="text-sm text-green-500">94%</span>
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