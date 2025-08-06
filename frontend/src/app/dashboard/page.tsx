'use client';

import { useState, useEffect } from 'react';
import { FaPaw, FaUserMd, FaCalendar, FaChartLine, FaBell, FaCog, FaSignOutAlt } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import zoodoLogo from '@/assets/zoodo.png';
import zoodoLightLogo from '@/assets/Zoodo-light.png';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  userType: 'pet_owner' | 'veterinarian' | 'trainer' | 'admin';
  email: string;
}

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  photoUrl?: string;
}

interface Appointment {
  id: string;
  petName: string;
  providerName: string;
  date: string;
  time: string;
  status: string;
  type: string;
}

export default function Dashboard() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Mock data - replace with actual API calls
  useEffect(() => {
    setUser({
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      userType: 'pet_owner',
      email: 'john@example.com'
    });

    setPets([
      {
        id: '1',
        name: 'Buddy',
        species: 'dog',
        breed: 'Golden Retriever',
        photoUrl: '/api/placeholder/150/150'
      },
      {
        id: '2',
        name: 'Whiskers',
        species: 'cat',
        breed: 'Persian'
      }
    ]);

    setAppointments([
      {
        id: '1',
        petName: 'Buddy',
        providerName: 'Dr. Sarah Smith',
        date: '2024-02-15',
        time: '10:00 AM',
        status: 'confirmed',
        type: 'checkup'
      },
      {
        id: '2',
        petName: 'Whiskers',
        providerName: 'Dr. Mike Johnson',
        date: '2024-02-20',
        time: '2:30 PM',
        status: 'scheduled',
        type: 'vaccination'
      }
    ]);
  }, []);

  const getDashboardContent = () => {
    if (!user) return null;

    switch (user.userType) {
      case 'pet_owner':
        return <PetOwnerDashboard pets={pets} appointments={appointments} />;
      case 'veterinarian':
        return <VeterinarianDashboard appointments={appointments} />;
      case 'trainer':
        return <TrainerDashboard appointments={appointments} />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <div>Dashboard not available</div>;
    }
  };

  const getSidebarItems = () => {
    if (!user) return [];

    const baseItems = [
      { id: 'overview', label: 'Overview', icon: FaChartLine },
      { id: 'appointments', label: 'Appointments', icon: FaCalendar },
      { id: 'pets', label: 'Pets', icon: FaPaw },
      { id: 'notifications', label: 'Notifications', icon: FaBell },
      { id: 'settings', label: 'Settings', icon: FaCog },
    ];

    if (user.userType === 'veterinarian' || user.userType === 'trainer') {
      baseItems.splice(2, 0, { id: 'patients', label: 'Patients', icon: FaUserMd });
    }

    return baseItems;
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
                       <Image
           src={mounted && resolvedTheme === 'dark' ? zoodoLightLogo : zoodoLogo}
           alt="Zoodo"
           width={120}
           height={40}
           className="h-3 md:h-4 lg:h-5 w-auto"
           priority
         />
              <span className="text-xl font-semibold text-gray-900">Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Welcome, {user.firstName} {user.lastName}
              </div>
              <button className="text-gray-600 hover:text-gray-900">
                <FaSignOutAlt className="text-lg" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 bg-white rounded-lg shadow-sm p-6">
            <nav className="space-y-2">
              {getSidebarItems().map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-50 text-blue-600 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="text-lg" />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {getDashboardContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

function PetOwnerDashboard({ pets, appointments }: { pets: Pet[]; appointments: Appointment[] }) {
  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FaPaw className="text-blue-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Pets</p>
              <p className="text-2xl font-semibold text-gray-900">{pets.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <FaCalendar className="text-green-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Upcoming Appointments</p>
              <p className="text-2xl font-semibold text-gray-900">
                {appointments.filter(a => a.status === 'scheduled' || a.status === 'confirmed').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FaUserMd className="text-purple-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Providers</p>
              <p className="text-2xl font-semibold text-gray-900">3</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FaBell className="text-yellow-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Notifications</p>
              <p className="text-2xl font-semibold text-gray-900">2</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Appointments */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Appointments</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FaCalendar className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{appointment.petName}</p>
                    <p className="text-sm text-gray-600">{appointment.providerName}</p>
                    <p className="text-sm text-gray-500">{appointment.date} at {appointment.time}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {appointment.status}
                  </span>
                  <Link href={`/appointments/${appointment.id}`} className="text-blue-600 hover:text-blue-800 text-sm">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* My Pets */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">My Pets</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet) => (
              <div key={pet.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    <FaPaw className="text-gray-600 text-2xl" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{pet.name}</h4>
                    <p className="text-sm text-gray-600">{pet.breed}</p>
                    <p className="text-sm text-gray-500 capitalize">{pet.species}</p>
                  </div>
                </div>
                <div className="mt-4 flex space-x-2">
                  <Link href={`/pets/${pet.id}`} className="flex-1 bg-blue-600 text-white text-center py-2 rounded-lg text-sm hover:bg-blue-700">
                    View Details
                  </Link>
                  <Link href={`/appointments/new?petId=${pet.id}`} className="flex-1 border border-blue-600 text-blue-600 text-center py-2 rounded-lg text-sm hover:bg-blue-50">
                    Book Appointment
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function VeterinarianDashboard({ appointments }: { appointments: Appointment[] }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Veterinarian Dashboard</h2>
      <p className="text-gray-600">Manage your patients and appointments</p>
      
      {/* Add veterinarian-specific content */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Today&#39;s Appointments</h3>
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{appointment.petName}</p>
                  <p className="text-sm text-gray-600">{appointment.date} at {appointment.time}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {appointment.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TrainerDashboard({ appointments }: { appointments: Appointment[] }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Trainer Dashboard</h2>
      <p className="text-gray-600">Manage your training sessions and clients</p>
      
      {/* Add trainer-specific content */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Sessions</h3>
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{appointment.petName}</p>
                  <p className="text-sm text-gray-600">{appointment.date} at {appointment.time}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {appointment.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
      <p className="text-gray-600">Platform management and analytics</p>
      
      {/* Add admin-specific content */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">1,234</p>
            <p className="text-gray-600">Total Users</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">567</p>
            <p className="text-gray-600">Active Appointments</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">89</p>
            <p className="text-gray-600">Providers</p>
          </div>
        </div>
      </div>
    </div>
  );
} 