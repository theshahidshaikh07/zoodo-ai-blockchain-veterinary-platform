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
  MoreHorizontal,
  Download,
  RefreshCw,
  X
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
import { apiService } from '@/lib/api';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';

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
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  userType: string;
  status: 'active' | 'inactive' | 'suspended';
  isVerified: boolean;
  isActive: boolean;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  rating?: number;
  totalReviews?: number;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  profileCompletion: number;
  
  // Veterinarian specific fields
  licenseNumber?: string;
  experience?: number;
  specializations?: string[];
  qualifications?: string[];
  resumeUrl?: string;
  profilePhotoUrl?: string;
  licenseProofUrl?: string;
  idProofUrl?: string;
  degreeProofUrl?: string;
  isAffiliated?: boolean;
  affiliatedFacilityName?: string;
  affiliatedType?: string;
  otherFacilityName?: string;
  offerOnlineConsultation?: boolean;
  offerHomeVisits?: boolean;
  homeServiceAddress?: string;
  homeServiceSameAsPersonal?: boolean;
  homeServiceStreet?: string;
  homeServiceCity?: string;
  homeServiceZip?: string;
  homeVisitRadius?: number;
  availabilitySettings?: string;
  
  // Trainer specific fields
  certifications?: string[];
  practiceType?: string;
  offerHomeTraining?: boolean;
  independentServiceAddress?: string;
  independentServiceSameAsPersonal?: boolean;
  independentServiceStreet?: string;
  independentServiceCity?: string;
  independentServiceZip?: string;
  homeTrainingRadius?: number;
  hasTrainingCenter?: boolean;
  trainingCenterName?: string;
  trainingCenterAddress?: string;
  hasAcademy?: boolean;
  academyName?: string;
  academyStreet?: string;
  academyCity?: string;
  academyState?: string;
  academyPostalCode?: string;
  academyCountry?: string;
  academyPhone?: string;
  
  // Pet owner specific fields
  petCount?: number;
  pets?: PetSummary[];
  
  // System fields
  notes?: string;
  verifiedAt?: string;
  verifiedBy?: string;
}

interface PetSummary {
  id: string;
  name: string;
  species: string;
  breed?: string;
  gender?: string;
  birthDate?: string;
  age?: number;
  ageUnit?: string;
  weight?: number;
  weightUnit?: string;
  microchipId?: string;
  sterilized?: boolean;
  photoUrl?: string;
  createdAt: string;
}

interface Alert {
  id: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  timestamp: string;
  priority: 'high' | 'medium' | 'low';
}

function AdminDashboardContent() {
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
  const [users, setUsers] = useState<User[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    loadSystemStats();
    loadUsers();
  }, []);

  useEffect(() => {
    loadUsers();
  }, [currentPage, searchTerm, userTypeFilter, statusFilter]);

  const loadSystemStats = async () => {
    try {
      const response = await apiService.getSystemStats();
      if (response.success) {
        const stats = response.data;
        setSystemStats({
          totalUsers: stats.totalUsers || 0,
          totalPets: stats.totalPets || 0,
          totalAppointments: 0, // Not implemented yet
          totalRevenue: 0, // Not implemented yet
          activeVets: stats.totalVeterinarians || 0,
          activeTrainers: stats.totalTrainers || 0,
          systemHealth: 98.5, // Mock data
          uptime: 99.9 // Mock data
        });
      }
    } catch (error) {
      console.error('Error loading system stats:', error);
    }
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await apiService.getUsers({
        page: currentPage,
        size: 10,
        userType: userTypeFilter !== 'all' ? userTypeFilter : undefined,
        search: searchTerm || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined
      });
      
      if (response.success) {
        setUsers(response.data.content || []);
        setTotalPages(response.data.totalPages || 0);
        setTotalUsers(response.data.totalElements || 0);
      }
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(0);
  };

  const handleUserTypeFilter = (value: string) => {
    setUserTypeFilter(value);
    setCurrentPage(0);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(0);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRefresh = () => {
    loadUsers();
    loadSystemStats();
  };

  const handleViewUserDetails = async (userId: string) => {
    try {
      const response = await apiService.getUserDetails(userId);
      if (response.success) {
        setSelectedUser(response.data);
        setShowUserDetails(true);
      }
    } catch (error) {
      console.error('Error loading user details:', error);
    }
  };

  const handleCloseUserDetails = () => {
    setShowUserDetails(false);
    setSelectedUser(null);
  };

  const handleExportUsers = async () => {
    try {
      const response = await apiService.exportUsers({
        userType: userTypeFilter !== 'all' ? userTypeFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined
      });
      
      if (response.success) {
        // Create and download CSV
        const csvContent = createCSVContent(response.data);
        downloadCSV(csvContent, 'users.csv');
      }
    } catch (error) {
      console.error('Error exporting users:', error);
    }
  };

  const createCSVContent = (users: User[]) => {
    const headers = ['ID', 'Username', 'Email', 'Name', 'User Type', 'Status', 'Verified', 'City', 'State', 'Created At'];
    const rows = users.map(user => [
      user.id,
      user.username,
      user.email,
      `${user.firstName} ${user.lastName}`,
      user.userType,
      user.status,
      user.isVerified ? 'Yes' : 'No',
      user.city || '',
      user.state || '',
      new Date(user.createdAt).toLocaleDateString()
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

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
                    {users.slice(0, 5).map((user) => (
                      <div key={user.id} className="flex items-center space-x-4">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback>
                            {user.firstName?.[0]}{user.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {user.userType}
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
                    <CardDescription>
                      Manage all platform users and their roles ({totalUsers} total users)
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" onClick={handleRefresh} disabled={loading}>
                      <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                    <Button variant="outline" onClick={handleExportUsers}>
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search users..." 
                      className="pl-8" 
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                    />
                  </div>
                  <Select value={userTypeFilter} onValueChange={handleUserTypeFilter}>
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
                  <Select value={statusFilter} onValueChange={handleStatusFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="unverified">Unverified</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>User Details</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Role & Status</TableHead>
                          <TableHead>Verification</TableHead>
                          <TableHead>Profile</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-mono text-xs">
                              {user.id.substring(0, 8)}...
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={user.profilePhotoUrl} />
                                  <AvatarFallback>
                                    {user.firstName?.[0]}{user.lastName?.[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{user.firstName} {user.lastName}</p>
                                  <p className="text-xs text-muted-foreground">@{user.username}</p>
                                  {user.rating && (
                                    <div className="flex items-center space-x-1">
                                      <span className="text-xs text-yellow-500">★</span>
                                      <span className="text-xs text-muted-foreground">
                                        {user.rating.toFixed(1)} ({user.totalReviews || 0} reviews)
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <p className="text-sm font-medium">{user.email}</p>
                                {user.phone && (
                                  <p className="text-xs text-muted-foreground">{user.phone}</p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                {user.address && (
                                  <p className="text-xs text-muted-foreground truncate max-w-[120px]">
                                    {user.address}
                                  </p>
                                )}
                                <p className="text-xs text-muted-foreground">
                                  {[user.city, user.state, user.country].filter(Boolean).join(', ')}
                                </p>
                                {user.postalCode && (
                                  <p className="text-xs text-muted-foreground">{user.postalCode}</p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-2">
                                <Badge variant="outline" className="capitalize">
                                  {user.userType.replace('_', ' ')}
                                </Badge>
                                <div className="flex items-center space-x-2">
                                  <div className={`w-2 h-2 rounded-full ${getStatusColor(user.status)}`} />
                                  <span className="text-xs capitalize">{user.status}</span>
                                </div>
                                {user.isActive !== undefined && (
                                  <div className="flex items-center space-x-2">
                                    <div className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                                    <span className="text-xs">{user.isActive ? 'Active' : 'Inactive'}</span>
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <Badge variant={user.isVerified ? "default" : "secondary"}>
                                  {user.isVerified ? "Verified" : "Unverified"}
                                </Badge>
                                {user.verifiedAt && (
                                  <p className="text-xs text-muted-foreground">
                                    {new Date(user.verifiedAt).toLocaleDateString()}
                                  </p>
                                )}
                                {user.verifiedBy && (
                                  <p className="text-xs text-muted-foreground">
                                    by {user.verifiedBy}
                                  </p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Progress value={user.profileCompletion} className="w-16" />
                                <span className="text-xs text-muted-foreground">{user.profileCompletion}%</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              <div className="space-y-1">
                                <p>{new Date(user.createdAt).toLocaleDateString()}</p>
                                <p className="text-xs">
                                  {new Date(user.createdAt).toLocaleTimeString()}
                                </p>
                                {user.lastLoginAt && (
                                  <p className="text-xs text-green-600">
                                    Last login: {new Date(user.lastLoginAt).toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleViewUserDetails(user.id)}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Full Details
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
                    
                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-between mt-4">
                        <div className="text-sm text-muted-foreground">
                          Showing {currentPage * 10 + 1} to {Math.min((currentPage + 1) * 10, totalUsers)} of {totalUsers} users
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 0}
                          >
                            Previous
                          </Button>
                          <span className="text-sm">
                            Page {currentPage + 1} of {totalPages}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage >= totalPages - 1}
                          >
                            Next
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
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

      {/* User Details Modal */}
      {showUserDetails && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={selectedUser.profilePhotoUrl} />
                  <AvatarFallback>
                    {selectedUser.firstName?.[0]}{selectedUser.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold">{selectedUser.firstName} {selectedUser.lastName}</h2>
                  <p className="text-muted-foreground">@{selectedUser.username} • {selectedUser.email}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleCloseUserDetails}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">User ID</label>
                        <p className="font-mono text-sm">{selectedUser.id}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">User Type</label>
                        <Badge variant="outline" className="capitalize">
                          {selectedUser.userType.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Status</label>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(selectedUser.status)}`} />
                          <span className="text-sm capitalize">{selectedUser.status}</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Active</label>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${selectedUser.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                          <span className="text-sm">{selectedUser.isActive ? 'Yes' : 'No'}</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Verified</label>
                        <Badge variant={selectedUser.isVerified ? "default" : "secondary"}>
                          {selectedUser.isVerified ? "Yes" : "No"}
                        </Badge>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Profile Completion</label>
                        <div className="flex items-center space-x-2">
                          <Progress value={selectedUser.profileCompletion} className="w-20" />
                          <span className="text-sm">{selectedUser.profileCompletion}%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Email</label>
                      <p className="text-sm">{selectedUser.email}</p>
                    </div>
                    {selectedUser.phone && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Phone</label>
                        <p className="text-sm">{selectedUser.phone}</p>
                      </div>
                    )}
                    {selectedUser.address && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Address</label>
                        <p className="text-sm">{selectedUser.address}</p>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                      {selectedUser.city && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">City</label>
                          <p className="text-sm">{selectedUser.city}</p>
                        </div>
                      )}
                      {selectedUser.state && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">State</label>
                          <p className="text-sm">{selectedUser.state}</p>
                        </div>
                      )}
                      {selectedUser.country && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Country</label>
                          <p className="text-sm">{selectedUser.country}</p>
                        </div>
                      )}
                      {selectedUser.postalCode && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Postal Code</label>
                          <p className="text-sm">{selectedUser.postalCode}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Veterinarian Specific Information */}
                {selectedUser.userType === 'veterinarian' && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Veterinarian Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {selectedUser.licenseNumber && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">License Number</label>
                          <p className="text-sm font-mono">{selectedUser.licenseNumber}</p>
                        </div>
                      )}
                      {selectedUser.experience && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Experience</label>
                          <p className="text-sm">{selectedUser.experience} years</p>
                        </div>
                      )}
                      {selectedUser.specializations && selectedUser.specializations.length > 0 && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Specializations</label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {selectedUser.specializations.map((spec, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {spec}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {selectedUser.qualifications && selectedUser.qualifications.length > 0 && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Qualifications</label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {selectedUser.qualifications.map((qual, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {qual}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-4">
                        {selectedUser.offerOnlineConsultation !== undefined && (
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Online Consultation</label>
                            <p className="text-sm">{selectedUser.offerOnlineConsultation ? 'Yes' : 'No'}</p>
                          </div>
                        )}
                        {selectedUser.offerHomeVisits !== undefined && (
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Home Visits</label>
                            <p className="text-sm">{selectedUser.offerHomeVisits ? 'Yes' : 'No'}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Trainer Specific Information */}
                {selectedUser.userType === 'trainer' && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Trainer Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {selectedUser.experience && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Experience</label>
                          <p className="text-sm">{selectedUser.experience} years</p>
                        </div>
                      )}
                      {selectedUser.certifications && selectedUser.certifications.length > 0 && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Certifications</label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {selectedUser.certifications.map((cert, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {cert}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {selectedUser.practiceType && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Practice Type</label>
                          <p className="text-sm">{selectedUser.practiceType}</p>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-4">
                        {selectedUser.offerHomeTraining !== undefined && (
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Home Training</label>
                            <p className="text-sm">{selectedUser.offerHomeTraining ? 'Yes' : 'No'}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Pet Owner Information */}
                {selectedUser.userType === 'pet_owner' && selectedUser.pets && selectedUser.pets.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Pets ({selectedUser.pets.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedUser.pets.map((pet) => (
                          <div key={pet.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                            <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium">{pet.name[0]}</span>
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{pet.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {pet.species} {pet.breed && `• ${pet.breed}`}
                                {pet.age && ` • ${pet.age} ${pet.ageUnit || 'years'} old`}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">
                                {pet.gender && `${pet.gender} • `}
                                {pet.weight && `${pet.weight} ${pet.weightUnit || 'kg'}`}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* System Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>System Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Created At</label>
                        <p className="text-sm">{new Date(selectedUser.createdAt).toLocaleString()}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Updated At</label>
                        <p className="text-sm">{new Date(selectedUser.updatedAt).toLocaleString()}</p>
                      </div>
                      {selectedUser.lastLoginAt && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Last Login</label>
                          <p className="text-sm">{new Date(selectedUser.lastLoginAt).toLocaleString()}</p>
                        </div>
                      )}
                      {selectedUser.verifiedAt && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Verified At</label>
                          <p className="text-sm">{new Date(selectedUser.verifiedAt).toLocaleString()}</p>
                        </div>
                      )}
                    </div>
                    {selectedUser.notes && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Admin Notes</label>
                        <p className="text-sm p-2 bg-muted rounded">{selectedUser.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <AdminDashboardContent />
    </ProtectedRoute>
  );
} 