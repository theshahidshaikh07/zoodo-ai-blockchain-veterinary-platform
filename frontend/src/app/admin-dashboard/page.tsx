'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  Activity,
  TrendingUp,
  AlertTriangle,
  Shield,
  Settings,
  Calendar,
  CreditCard,
  Bell,
  Search,
  Eye,
  Edit,
  Trash2,
  Plus,
  MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import zoodoLogo from '@/assets/zoodo.png';
import zoodoLightLogo from '@/assets/Zoodo-light.png';

interface SystemStats {
  totalUsers: number;
  totalPets: number;
  totalAppointments: number;
  totalRevenue: number;
  activeVets: number;
  activeTrainers: number;
  systemHealth: number;
  uptime: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'suspended';
  lastActive: string;
  avatar?: string;
}

interface Alert {
  id: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  timestamp: string;
  priority: 'high' | 'medium' | 'low';
}

export default function AdminDashboard() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [systemStats, setSystemStats] = useState<SystemStats>({
    totalUsers: 0,
    totalPets: 0,
    totalAppointments: 0,
    totalRevenue: 0,
    activeVets: 0,
    activeTrainers: 0,
    systemHealth: 0,
    uptime: 0
  });
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Mock data - replace with actual API calls
    setSystemStats({
      totalUsers: 1247,
      totalPets: 2156,
      totalAppointments: 892,
      totalRevenue: 45678.90,
      activeVets: 89,
      activeTrainers: 45,
      systemHealth: 98.5,
      uptime: 99.9
    });

    setRecentUsers([
      {
        id: '1',
        name: 'Dr. Sarah Smith',
        email: 'sarah.smith@vetclinic.com',
        role: 'veterinarian',
        status: 'active',
        lastActive: '2 minutes ago',
        avatar: '/api/placeholder/40/40'
      },
      {
        id: '2',
        name: 'John Doe',
        email: 'john.doe@email.com',
        role: 'pet_owner',
        status: 'active',
        lastActive: '5 minutes ago'
      },
      {
        id: '3',
        name: 'Mike Johnson',
        email: 'mike.johnson@trainer.com',
        role: 'trainer',
        status: 'active',
        lastActive: '10 minutes ago'
      }
    ]);

    setAlerts([
      {
        id: '1',
        type: 'warning',
        message: 'High server load detected',
        timestamp: '2 minutes ago',
        priority: 'high'
      },
      {
        id: '2',
        type: 'info',
        message: 'New user registration spike',
        timestamp: '5 minutes ago',
        priority: 'medium'
      }
    ]);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-gray-500';
      case 'suspended': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'error': return 'text-red-500';
      case 'warning': return 'text-yellow-500';
      case 'info': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  if (!mounted) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Image
                src={mounted && resolvedTheme === 'dark' ? zoodoLightLogo : zoodoLogo}
                alt="Zoodo Admin"
                width={120}
                height={40}
                className="h-3 md:h-4 lg:h-5 w-auto"
              />
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                Admin Dashboard
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
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 lg:px-8 py-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">System Administration</h1>
          <p className="text-muted-foreground">Monitor and manage the Zoodo platform</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemStats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemStats.totalAppointments}</div>
              <p className="text-xs text-muted-foreground">
                +8% from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${systemStats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +23% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemStats.systemHealth}%</div>
              <Progress value={systemStats.systemHealth} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Users</CardTitle>
                  <CardDescription>Latest user registrations and activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentUsers.map((user) => (
                      <div key={user.id} className="flex items-center space-x-4">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {user.role}
                          </Badge>
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(user.status)}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* System Status */}
              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                  <CardDescription>Current platform health and metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Uptime</span>
                      <span className="text-sm text-muted-foreground">{systemStats.uptime}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Active Vets</span>
                      <span className="text-sm text-muted-foreground">{systemStats.activeVets}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Active Trainers</span>
                      <span className="text-sm text-muted-foreground">{systemStats.activeTrainers}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Total Pets</span>
                      <span className="text-sm text-muted-foreground">{systemStats.totalPets}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Manage all platform users and their roles</CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search users..." className="pl-8" />
                  </div>
                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="pet_owner">Pet Owners</SelectItem>
                      <SelectItem value="veterinarian">Veterinarians</SelectItem>
                      <SelectItem value="trainer">Trainers</SelectItem>
                      <SelectItem value="admin">Admins</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.avatar} />
                              <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{user.role}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(user.status)}`} />
                            <span className="text-sm capitalize">{user.status}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {user.lastActive}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit User
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Analytics</CardTitle>
                  <CardDescription>Key performance indicators and trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">User Growth</span>
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Appointment Success Rate</span>
                      <span className="text-sm text-green-500">94%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">AI Consultation Usage</span>
                      <span className="text-sm text-blue-500">78%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Blockchain Records</span>
                      <span className="text-sm text-purple-500">2,156</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue Analytics</CardTitle>
                  <CardDescription>Financial performance and trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Monthly Revenue</span>
                      <span className="text-sm font-bold">${systemStats.totalRevenue.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Average Transaction</span>
                      <span className="text-sm text-muted-foreground">$89.50</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Conversion Rate</span>
                      <span className="text-sm text-green-500">12.5%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Health</CardTitle>
                  <CardDescription>Infrastructure and service status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">API Response Time</span>
                      <span className="text-sm text-green-500">120ms</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Database Performance</span>
                      <span className="text-sm text-green-500">Optimal</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">AI Service Status</span>
                      <span className="text-sm text-green-500">Online</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Blockchain Sync</span>
                      <span className="text-sm text-green-500">Synced</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security Status</CardTitle>
                  <CardDescription>Platform security and compliance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">SSL Certificate</span>
                      <Shield className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Data Encryption</span>
                      <Shield className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">GDPR Compliance</span>
                      <Shield className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Last Security Scan</span>
                      <span className="text-sm text-muted-foreground">2 hours ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Alerts</CardTitle>
                <CardDescription>Monitor platform alerts and notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <AlertTriangle className={`h-5 w-5 ${getAlertColor(alert.type)}`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{alert.message}</p>
                        <p className="text-xs text-muted-foreground">{alert.timestamp}</p>
                      </div>
                      <Badge variant={alert.priority === 'high' ? 'destructive' : 'secondary'}>
                        {alert.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 