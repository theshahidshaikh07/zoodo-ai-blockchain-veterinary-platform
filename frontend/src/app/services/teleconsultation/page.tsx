'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import CustomSelect from '@/components/ui/custom-select';
import { 
  Search, 
  MapPin, 
  Star, 
  Clock, 
  Phone, 
  SlidersHorizontal,
  Video,
  ChevronDown,
  X,
  IndianRupee,
  CheckCircle,
  Users,
  Award,
  Shield,
  Zap
} from 'lucide-react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import teleImage1 from '@/assets/vets/pexels-edmond-dantes-4342352.jpg';
import teleImage2 from '@/assets/vets/pexels-gustavo-fring-4173248.jpg';
import teleImage3 from '@/assets/vets/pexels-gustavo-fring-4173251.jpg';
import teleImage4 from '@/assets/vets/pexels-kooldark-14438788.jpg';
import teleImage5 from '@/assets/vets/pexels-kooldark-14438790.jpg';
import teleImage6 from '@/assets/hero-vet.jpg';

// Dummy teleconsultation data with actual images
const dummyTeleconsultations = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialization: "General Practice",
    experience: "8 years",
    rating: 4.9,
    reviews: 127,
    location: "Mumbai, Maharashtra",
    availability: "Available Now",
    consultationFee: "₹800",
    image: teleImage1,
    languages: ["English", "Hindi", "Marathi"],
    services: ["Video Consultation", "Prescription", "Follow-up Care", "Emergency Advice"],
    education: "BVSc, MVSc (Surgery)",
    hospital: "PetCare Digital Clinic",
    isOnline: true,
    responseTime: "5 mins",
    consultationType: "Video Call",
    duration: "30 minutes"
  },
  {
    id: 2,
    name: "Dr. Rajesh Kumar",
    specialization: "Emergency Medicine",
    experience: "12 years",
    rating: 4.8,
    reviews: 89,
    location: "Delhi, NCR",
    availability: "Available in 30 mins",
    consultationFee: "₹1,200",
    image: teleImage2,
    languages: ["English", "Hindi", "Punjabi"],
    services: ["Emergency Consultation", "Urgent Care", "Prescription", "Referral"],
    education: "BVSc, MVSc (Emergency Medicine)",
    hospital: "Emergency Pet Telehealth",
    isOnline: false,
    responseTime: "15 mins",
    consultationType: "Video Call",
    duration: "45 minutes"
  },
  {
    id: 3,
    name: "Dr. Priya Sharma",
    specialization: "Dermatology",
    experience: "6 years",
    rating: 4.7,
    reviews: 156,
    location: "Bangalore, Karnataka",
    availability: "Available Tomorrow",
    consultationFee: "₹1,000",
    image: teleImage3,
    languages: ["English", "Hindi", "Kannada"],
    services: ["Skin Consultation", "Photo Analysis", "Treatment Plan", "Follow-up"],
    education: "BVSc, MVSc (Dermatology)",
    hospital: "Skin & Coat Teleclinic",
    isOnline: true,
    responseTime: "10 mins",
    consultationType: "Video Call",
    duration: "25 minutes"
  },
  {
    id: 4,
    name: "Dr. Amit Patel",
    specialization: "Behavioral Medicine",
    experience: "10 years",
    rating: 4.9,
    reviews: 203,
    location: "Ahmedabad, Gujarat",
    availability: "Available Now",
    consultationFee: "₹1,500",
    image: teleImage4,
    languages: ["English", "Hindi", "Gujarati"],
    services: ["Behavioral Assessment", "Training Advice", "Medication Review", "Progress Tracking"],
    education: "BVSc, MVSc (Behavioral Medicine)",
    hospital: "Behavioral Telehealth Center",
    isOnline: true,
    responseTime: "8 mins",
    consultationType: "Video Call",
    duration: "40 minutes"
  },
  {
    id: 5,
    name: "Dr. Neha Singh",
    specialization: "Nutrition",
    experience: "7 years",
    rating: 4.8,
    reviews: 94,
    location: "Pune, Maharashtra",
    availability: "Available in 1 hour",
    consultationFee: "₹900",
    image: teleImage5,
    languages: ["English", "Hindi", "Marathi"],
    services: ["Diet Planning", "Nutrition Analysis", "Weight Management", "Meal Planning"],
    education: "BVSc, MVSc (Nutrition)",
    hospital: "Pet Nutrition Teleclinic",
    isOnline: false,
    responseTime: "20 mins",
    consultationType: "Video Call",
    duration: "35 minutes"
  },
  {
    id: 6,
    name: "Dr. Vikram Reddy",
    specialization: "Internal Medicine",
    experience: "9 years",
    rating: 4.6,
    reviews: 67,
    location: "Hyderabad, Telangana",
    availability: "Available Now",
    consultationFee: "₹1,100",
    image: teleImage6,
    languages: ["English", "Hindi", "Telugu"],
    services: ["Health Checkup", "Lab Review", "Medication Management", "Chronic Care"],
    education: "BVSc, MVSc (Internal Medicine)",
    hospital: "Internal Medicine Telehealth",
    isOnline: true,
    responseTime: "12 mins",
    consultationType: "Video Call",
    duration: "30 minutes"
  }
];

const specializations = [
  "All Specializations",
  "General Practice",
  "Emergency Medicine", 
  "Dermatology",
  "Behavioral Medicine",
  "Nutrition",
  "Internal Medicine",
  "Cardiology"
];

const locations = [
  "All Locations",
  "Mumbai, Maharashtra",
  "Delhi, NCR", 
  "Bangalore, Karnataka",
  "Ahmedabad, Gujarat",
  "Pune, Maharashtra",
  "Hyderabad, Telangana"
];

export default function TeleconsultationPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All Specializations');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [showFilters, setShowFilters] = useState(false);
  const [filteredConsultations, setFilteredConsultations] = useState(dummyTeleconsultations);
  const [sortBy, setSortBy] = useState('rating');

  useEffect(() => {
    let filtered = dummyTeleconsultations;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(consultation => 
        consultation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        consultation.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        consultation.hospital.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by specialization
    if (selectedSpecialization !== 'All Specializations') {
      filtered = filtered.filter(consultation => consultation.specialization === selectedSpecialization);
    }

    // Filter by location
    if (selectedLocation !== 'All Locations') {
      filtered = filtered.filter(consultation => consultation.location === selectedLocation);
    }

    // Sort results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'fee':
          return parseInt(a.consultationFee.replace('₹', '').replace(',', '')) - 
                 parseInt(b.consultationFee.replace('₹', '').replace(',', ''));
        case 'response':
          return parseInt(a.responseTime.replace(' mins', '')) - 
                 parseInt(b.responseTime.replace(' mins', ''));
        default:
          return 0;
      }
    });

    setFilteredConsultations(filtered);
  }, [searchTerm, selectedSpecialization, selectedLocation, sortBy]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedSpecialization('All Specializations');
    setSelectedLocation('All Locations');
    setSortBy('rating');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Header />
      
      {/* Search and Filters */}
      <section className="pt-24 pb-8">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search by vet name, specialization, or hospital..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 text-sm border border-input bg-background rounded-md focus:ring-0 focus:ring-offset-0 focus:border-input"
              />
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center justify-between mb-6">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 h-10"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </Button>
              
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <CustomSelect
                  options={[
                    { value: 'rating', label: 'Rating' },
                    { value: 'fee', label: 'Consultation Fee' },
                    { value: 'response', label: 'Response Time' }
                  ]}
                  value={sortBy}
                  onChange={setSortBy}
                  className="w-40"
                />
              </div>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="grid md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg mb-6 border">
                <div>
                  <label className="block text-sm font-medium mb-2">Specialization</label>
                  <CustomSelect
                    options={specializations.map(spec => ({ value: spec, label: spec }))}
                    value={selectedSpecialization}
                    onChange={setSelectedSpecialization}
                    placeholder="Select specialization"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <CustomSelect
                    options={locations.map(location => ({ value: location, label: location }))}
                    value={selectedLocation}
                    onChange={setSelectedLocation}
                    placeholder="Select location"
                  />
                </div>
                <div className="md:col-span-2 flex justify-end">
                  <Button variant="ghost" onClick={clearFilters} className="text-sm">
                    <X className="w-4 h-4 mr-1" />
                    Clear Filters
                  </Button>
                </div>
              </div>
            )}

            {/* Results Count */}
            <div className="flex items-center justify-between mb-8">
              <p className="text-muted-foreground font-medium">
                {filteredConsultations.length} teleconsultation{filteredConsultations.length !== 1 ? 's' : ''} available
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Teleconsultations List */}
      <section className="pb-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {filteredConsultations.length === 0 ? (
              <div className="text-center py-16">
                <Video className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No teleconsultations found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your search criteria</p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredConsultations.map((consultation) => (
                  <Card key={consultation.id} className="group hover:shadow-lg transition-all duration-300 bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <CardContent className="p-0">
                      {/* Vet Image */}
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={consultation.image}
                          alt={consultation.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 right-3">
                          <Badge variant={consultation.isOnline ? 'default' : 'secondary'} className="text-xs">
                            {consultation.isOnline ? 'Online' : 'Offline'}
                          </Badge>
                        </div>
                        <div className="absolute bottom-3 left-3">
                          <Badge className="bg-blue-600 text-white text-xs">
                            <Video className="w-3 h-3 mr-1" />
                            Video Call
                          </Badge>
                        </div>
                      </div>

                      {/* Consultation Details */}
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{consultation.name}</h3>
                            <p className="text-sm text-primary font-medium">{consultation.specialization}</p>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{consultation.rating}</span>
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span>{consultation.location}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="w-4 h-4 mr-2" />
                            <span className={consultation.isOnline ? 'text-green-600' : 'text-orange-600'}>
                              {consultation.availability}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Zap className="w-4 h-4 mr-2" />
                            <span>{consultation.duration}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-lg font-bold text-primary">{consultation.consultationFee}</p>
                            <p className="text-xs text-gray-500">Video Consultation</p>
                          </div>
                          <Button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm">
                            Start Call
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
