'use client';

import { useState, useEffect } from 'react';
import {
  Calendar, TrendingUp, Bell, Settings, Plus, Eye,
  Brain, Star, Target, Award, Users, CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { apiService, Appointment, Pet } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import zoodoLogo from '@/assets/zoodo.png';
import zoodoLightLogo from '@/assets/Zoodo-light.png';

interface TrainerStats {
  totalClients: number;
  activeSessions: number;
  completedSessions: number;
  totalEarnings: number;
  averageRating: number;
  aiAssistedSessions: number;
  behavioralAssessments: number;
  certifications: number;
}

interface Client {
  id: string;
  name: string;
  petName: string;
  petSpecies: string;
  petBreed: string;
  trainingGoals: string[];
  progressLevel: 'beginner' | 'intermediate' | 'advanced';
  lastSession: string;
  nextSession?: string;
  photoUrl?: string;
}

interface TrainingSession {
  id: string;
  clientName: string;
  petName: string;
  date: string;
  time: string;
  type: 'obedience' | 'behavioral' | 'agility' | 'therapy' | 'puppy';
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  sessionType: 'in-person' | 'virtual' | 'home-visit';
  duration: number;
  focus: string;
  notes?: string;
}

interface BehavioralAssessment {
  id: string;
  petName: string;
  clientName: string;
  date: string;
  assessmentType: 'aggression' | 'anxiety' | 'socialization' | 'obedience' | 'general';
  severity: 'mild' | 'moderate' | 'severe';
  recommendations: string[];
  progressNotes: string;
  aiAnalysis: string;
}

export default function TrainerDashboard() {
  const { resolvedTheme } = useTheme();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [trainerStats, setTrainerStats] = useState<TrainerStats>({
    totalClients: 0,
    activeSessions: 0,
    completedSessions: 0,
    totalEarnings: 0,
    averageRating: 0,
    aiAssistedSessions: 0,
    behavioralAssessments: 0,
    certifications: 0
  });
  const [clients, setClients] = useState<Client[]>([]);
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [assessments, setAssessments] = useState<BehavioralAssessment[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Fetch appointments for this trainer
        const appointmentsResponse = await apiService.getAppointments();
        
        if (appointmentsResponse.success && appointmentsResponse.data) {
          // Filter appointments for this trainer
          const trainerAppointments = appointmentsResponse.data.filter(
            apt => apt.providerId === user.id
          );
          
          const activeSessions = trainerAppointments.filter(
            apt => apt.status === 'scheduled' || apt.status === 'confirmed'
          ).length;
          
          const completedSessions = trainerAppointments.filter(
            apt => apt.status === 'completed'
          ).length;

          setTrainerStats({
            totalClients: 0, // This would need to be calculated from unique pet owners
            activeSessions,
            completedSessions,
            totalEarnings: 0, // This would need to be calculated from payment data
            averageRating: 0, // This would need to be calculated from reviews
            aiAssistedSessions: 0, // This would need to be fetched from AI service
            behavioralAssessments: 0, // This would need to be fetched from assessments
            certifications: 0 // This would need to be fetched from certifications
          });
        }

        // For now, set empty arrays - these would need separate API endpoints
        setClients([]);
        setSessions([]);
        setAssessments([]);
        
      } catch (error) {
        console.error('Error fetching trainer dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

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

  const getProgressColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-blue-500 text-white';
      case 'intermediate': return 'bg-yellow-500 text-black';
      case 'advanced': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild': return 'bg-green-500 text-white';
      case 'moderate': return 'bg-yellow-500 text-black';
      case 'severe': return 'bg-red-500 text-white';
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
                src={mounted && resolvedTheme === 'dark' ? zoodoLightLogo : zoodoLogo}
                alt="Zoodo Trainer"
                width={120}
                height={40}
                className="h-3 md:h-4 lg:h-5 w-auto"
              />
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                Pet Trainer Dashboard
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
                <AvatarFallback>TR</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 lg:px-8 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Mike Johnson</h1>
          <p className="text-muted-foreground">Certified Pet Trainer Dashboard</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{trainerStats.totalClients}</div>
              <p className="text-xs text-muted-foreground">
                {trainerStats.activeSessions} active sessions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Sessions</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{trainerStats.completedSessions}</div>
              <p className="text-xs text-muted-foreground">
                This year
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Client Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{trainerStats.averageRating}/5.0</div>
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
              <div className="text-2xl font-bold">${trainerStats.totalEarnings.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +15% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="assessments">Assessments</TabsTrigger>
            <TabsTrigger value="ai-assistant">AI Assistant</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Active Clients</CardTitle>
                  <CardDescription>Your current training clients</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {clients.map((client) => (
                      <div key={client.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={client.photoUrl} />
                          <AvatarFallback>{client.petName[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{client.petName}</h4>
                            <Badge className={getProgressColor(client.progressLevel)}>
                              {client.progressLevel}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {client.name} • {client.petBreed}
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            {client.trainingGoals.map((goal, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {goal}
                              </Badge>
                            ))}
                          </div>
                          {client.nextSession && (
                            <p className="text-xs text-muted-foreground mt-2">
                              Next session: {client.nextSession}
                            </p>
                          )}
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
                  <CardDescription>Common training tasks and shortcuts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button className="h-20 flex-col space-y-2">
                      <Calendar className="h-6 w-6" />
                      <span className="text-sm">Schedule Session</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col space-y-2">
                      <Brain className="h-6 w-6" />
                      <span className="text-sm">AI Assessment</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col space-y-2">
                      <Target className="h-6 w-6" />
                      <span className="text-sm">Progress Tracking</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col space-y-2">
                      <Plus className="h-6 w-6" />
                      <span className="text-sm">Add Client</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="clients" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Client Management</CardTitle>
                    <CardDescription>Manage your training clients and their progress</CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Client
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {clients.map((client) => (
                    <Card key={client.id} className="p-4">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={client.photoUrl} />
                          <AvatarFallback>{client.petName[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-medium">{client.petName}</h4>
                          <p className="text-sm text-muted-foreground">
                            {client.petBreed} • {client.name}
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge className={getProgressColor(client.progressLevel)}>
                              {client.progressLevel}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {client.trainingGoals.slice(0, 2).map((goal, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {goal}
                              </Badge>
                            ))}
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

          <TabsContent value="sessions" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Training Sessions</CardTitle>
                    <CardDescription>Manage your training sessions and schedules</CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule Session
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client & Pet</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sessions.map((session) => (
                      <TableRow key={session.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{session.petName[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{session.petName}</p>
                              <p className="text-sm text-muted-foreground">{session.clientName}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-medium">{session.date}</div>
                          <div className="text-xs text-muted-foreground">{session.time}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {session.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{session.duration} min</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(session.status)}`} />
                            <span className="text-sm capitalize">{session.status}</span>
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

          <TabsContent value="assessments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Behavioral Assessments</CardTitle>
                <CardDescription>AI-assisted behavioral analysis and recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assessments.map((assessment) => (
                    <div key={assessment.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <Target className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{assessment.petName} - {assessment.assessmentType}</h4>
                          <div className="flex items-center space-x-2">
                            <Badge className={getSeverityColor(assessment.severity)}>
                              {assessment.severity}
                            </Badge>
                            <Badge variant="outline">{assessment.date}</Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {assessment.clientName} • {assessment.progressNotes}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          {assessment.recommendations.slice(0, 2).map((rec, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {rec}
                            </Badge>
                          ))}
                        </div>
                        <div className="mt-2 p-2 bg-muted/50 rounded text-xs">
                          <span className="font-medium">AI Analysis:</span> {assessment.aiAnalysis}
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
                  <CardTitle>AI Training Assistant</CardTitle>
                  <CardDescription>AI-powered training recommendations and analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 p-4 border rounded-lg">
                      <Brain className="h-8 w-8 text-primary" />
                      <div className="flex-1">
                        <h4 className="font-medium">Behavioral Analysis</h4>
                        <p className="text-sm text-muted-foreground">
                          AI-powered behavioral assessment and recommendations
                        </p>
                      </div>
                      <Button size="sm">Start Analysis</Button>
                    </div>
                    
                    <div className="flex items-center space-x-4 p-4 border rounded-lg">
                      <Target className="h-8 w-8 text-blue-500" />
                      <div className="flex-1">
                        <h4 className="font-medium">Training Plans</h4>
                        <p className="text-sm text-muted-foreground">
                          Generate personalized training programs
                        </p>
                      </div>
                      <Button variant="outline" size="sm">Create Plan</Button>
                    </div>
                    
                    <div className="flex items-center space-x-4 p-4 border rounded-lg">
                      <Award className="h-8 w-8 text-green-500" />
                      <div className="flex-1">
                        <h4 className="font-medium">Progress Tracking</h4>
                        <p className="text-sm text-muted-foreground">
                          AI-assisted progress monitoring and reporting
                        </p>
                      </div>
                      <Button variant="outline" size="sm">View Progress</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent AI Assessments</CardTitle>
                  <CardDescription>Your recent AI-assisted behavioral assessments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <Brain className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Max - Socialization</p>
                          <p className="text-sm text-muted-foreground">2 days ago</p>
                        </div>
                      </div>
                      <Badge variant="outline">Completed</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center">
                          <Target className="h-4 w-4 text-blue-500" />
                        </div>
                        <div>
                          <p className="font-medium">Luna - Obedience</p>
                          <p className="text-sm text-muted-foreground">1 week ago</p>
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