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
  GraduationCap,
  ChevronDown,
  X,
  IndianRupee,
  CheckCircle,
  Users,
  Award,
  Heart,
  AlertCircle
} from 'lucide-react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BetaDisclaimerBanner from '@/components/BetaDisclaimerBanner';
import BetaDisclaimerPopup from '@/components/BetaDisclaimerPopup';
import trainerImage1 from '@/assets/trainer/trainer.png';
import trainerImage2 from '@/assets/trainer/pet_trainer.png';
import trainerImage3 from '@/assets/trainer/service-pet-trainer.jpg';
import trainerImage4 from '@/assets/trainer/ChatGPT Image Sep 18, 2025, 11_39_46 AM.png';
import trainerImage5 from '@/assets/pet-trainer.png';
import trainerImage6 from '@/assets/pet-trainer-new.png';

// Dummy trainer data with actual images
const dummyTrainers = [
  {
    id: 1,
    name: "Sarah Mitchell",
    specialization: "Behavioral Training",
    experience: "8 years",
    rating: 4.9,
    reviews: 127,
    location: "Mumbai, Maharashtra",
    distance: "2.3 km",
    availability: "Available Now",
    sessionFee: "₹1,200",
    image: trainerImage1,
    languages: ["English", "Hindi", "Marathi"],
    services: ["Behavioral Training", "Obedience Classes", "Puppy Training", "Aggression Management"],
    education: "Certified Dog Trainer (CDT)",
    trainingCenter: "Pawsitive Training Center",
    isOnline: true,
    responseTime: "5 mins",
    petsTrained: 500,
    consultationType: "Home Visit"
  },
  {
    id: 2,
    name: "Emily Rodriguez",
    specialization: "Obedience Training",
    experience: "12 years",
    rating: 4.8,
    reviews: 89,
    location: "Delhi, NCR",
    distance: "1.8 km",
    availability: "Available in 30 mins",
    sessionFee: "₹1,500",
    image: trainerImage2,
    languages: ["English", "Hindi", "Punjabi"],
    services: ["Basic Obedience", "Advanced Commands", "Service Dog Training", "Competition Training"],
    education: "Professional Dog Trainer (PDT)",
    trainingCenter: "Elite Canine Academy",
    isOnline: false,
    responseTime: "15 mins",
    petsTrained: 750,
    consultationType: "Academy"
  },
  {
    id: 3,
    name: "Jennifer Davis",
    specialization: "Puppy Training",
    experience: "6 years",
    rating: 4.7,
    reviews: 156,
    location: "Bangalore, Karnataka",
    distance: "4.1 km",
    availability: "Available Tomorrow",
    sessionFee: "₹1,000",
    image: trainerImage3,
    languages: ["English", "Hindi", "Kannada"],
    services: ["Puppy Socialization", "House Training", "Basic Commands", "Crate Training"],
    education: "Certified Puppy Trainer (CPT)",
    trainingCenter: "Happy Paws Training",
    isOnline: true,
    responseTime: "10 mins",
    petsTrained: 300,
    consultationType: "Online"
  },
  {
    id: 4,
    name: "Amit Patel",
    specialization: "Agility Training",
    experience: "10 years",
    rating: 4.9,
    reviews: 203,
    location: "Ahmedabad, Gujarat",
    distance: "3.2 km",
    availability: "Available Now",
    sessionFee: "₹1,800",
    image: trainerImage4,
    languages: ["English", "Hindi", "Gujarati"],
    services: ["Agility Training", "Flyball", "Rally Obedience", "Competition Prep"],
    education: "Agility Training Specialist (ATS)",
    trainingCenter: "Agility Masters",
    isOnline: true,
    responseTime: "8 mins",
    petsTrained: 400,
    consultationType: "Academy"
  },
  {
    id: 5,
    name: "Neha Singh",
    specialization: "Therapy Dog Training",
    experience: "7 years",
    rating: 4.8,
    reviews: 94,
    location: "Pune, Maharashtra",
    distance: "5.7 km",
    availability: "Available in 1 hour",
    sessionFee: "₹2,000",
    image: trainerImage5,
    languages: ["English", "Hindi", "Marathi"],
    services: ["Therapy Dog Training", "Emotional Support", "Hospital Visits", "Disability Assistance"],
    education: "Therapy Dog Trainer (TDT)",
    trainingCenter: "Healing Paws Center",
    isOnline: false,
    responseTime: "20 mins",
    petsTrained: 200,
    consultationType: "Online"
  },
  {
    id: 6,
    name: "Vikram Reddy",
    specialization: "Aggression Management",
    experience: "9 years",
    rating: 4.6,
    reviews: 67,
    location: "Hyderabad, Telangana",
    distance: "2.9 km",
    availability: "Available Now",
    sessionFee: "₹2,500",
    image: trainerImage6,
    languages: ["English", "Hindi", "Telugu"],
    services: ["Aggression Management", "Fear Rehabilitation", "Reactive Dog Training", "Behavior Modification"],
    education: "Behavioral Specialist (BS)",
    trainingCenter: "Calm Canine Center",
    isOnline: true,
    responseTime: "12 mins",
    petsTrained: 150,
    consultationType: "Home Visit"
  }
];

const specializations = [
  "All Specializations",
  "Behavioral Training",
  "Obedience Training",
  "Puppy Training",
  "Agility Training",
  "Therapy Dog Training",
  "Aggression Management",
  "Service Dog Training"
];

const consultationTypes = [
  "All Types",
  "Home Visit",
  "Online",
  "Academy"
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

export default function FindTrainersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All Specializations');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedConsultationType, setSelectedConsultationType] = useState('All Types');
  const [showFilters, setShowFilters] = useState(false);
  const [filteredTrainers, setFilteredTrainers] = useState(dummyTrainers);
  const [sortBy, setSortBy] = useState('rating');
  const [showBookingPopup, setShowBookingPopup] = useState(false);

  useEffect(() => {
    let filtered = dummyTrainers;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(trainer =>
        trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trainer.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trainer.trainingCenter.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by specialization
    if (selectedSpecialization !== 'All Specializations') {
      filtered = filtered.filter(trainer => trainer.specialization === selectedSpecialization);
    }

    // Filter by location
    if (selectedLocation !== 'All Locations') {
      filtered = filtered.filter(trainer => trainer.location === selectedLocation);
    }

    // Filter by consultation type
    if (selectedConsultationType !== 'All Types') {
      filtered = filtered.filter(trainer => trainer.consultationType === selectedConsultationType);
    }

    // Sort results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'distance':
          return parseFloat(a.distance) - parseFloat(b.distance);
        case 'fee':
          return parseInt(a.sessionFee.replace('₹', '').replace(',', '')) -
            parseInt(b.sessionFee.replace('₹', '').replace(',', ''));
        default:
          return 0;
      }
    });

    setFilteredTrainers(filtered);
  }, [searchTerm, selectedSpecialization, selectedLocation, selectedConsultationType, sortBy]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedSpecialization('All Specializations');
    setSelectedLocation('All Locations');
    setSelectedConsultationType('All Types');
    setSortBy('rating');
    setShowFilters(false);
  };

  const handleSpecializationChange = (value: string) => {
    setSelectedSpecialization(value);
    setShowFilters(false);
  };

  const handleLocationChange = (value: string) => {
    setSelectedLocation(value);
    setShowFilters(false);
  };

  const handleConsultationTypeChange = (value: string) => {
    setSelectedConsultationType(value);
    setShowFilters(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Header />

      {/* Search and Filters */}
      <section className="pt-24 pb-8">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Early Access Banner */}
            <BetaDisclaimerBanner category="trainers" />

            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search by trainer name, specialization, or training type..."
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
                    { value: 'distance', label: 'Distance' },
                    { value: 'fee', label: 'Session Fee' }
                  ]}
                  value={sortBy}
                  onChange={setSortBy}
                  className="w-40"
                />
              </div>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="grid md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg mb-6 border">
                <div>
                  <label className="block text-sm font-medium mb-2">Specialization</label>
                  <CustomSelect
                    options={specializations.map(spec => ({ value: spec, label: spec }))}
                    value={selectedSpecialization}
                    onChange={handleSpecializationChange}
                    placeholder="Select specialization"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <CustomSelect
                    options={locations.map(location => ({ value: location, label: location }))}
                    value={selectedLocation}
                    onChange={handleLocationChange}
                    placeholder="Select location"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Training Type</label>
                  <CustomSelect
                    options={consultationTypes.map(type => ({ value: type, label: type }))}
                    value={selectedConsultationType}
                    onChange={handleConsultationTypeChange}
                    placeholder="Select training type"
                  />
                </div>
                <div className="md:col-span-3 flex justify-end">
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
                {filteredTrainers.length} trainer{filteredTrainers.length !== 1 ? 's' : ''} found
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trainers List */}
      <section className="pb-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {filteredTrainers.length === 0 ? (
              <div className="text-center py-16">
                <GraduationCap className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No trainers found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your search criteria</p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTrainers.map((trainer) => (
                  <Card key={trainer.id} className="group hover:shadow-lg transition-all duration-300 bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <CardContent className="p-0">
                      {/* Trainer Image */}
                      <div className="relative h-64 overflow-hidden">
                        <Image
                          src={trainer.image}
                          alt={trainer.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 right-3">
                          <Badge variant={trainer.isOnline ? 'default' : 'secondary'} className="text-xs">
                            {trainer.isOnline ? 'Online' : 'Offline'}
                          </Badge>
                        </div>
                        <div className="absolute bottom-3 left-3">
                          <Badge className={`text-xs ${trainer.consultationType === 'Home Visit' ? 'bg-green-600 text-white' :
                              trainer.consultationType === 'Online' ? 'bg-blue-600 text-white' :
                                'bg-purple-600 text-white'
                            }`}>
                            {trainer.consultationType}
                          </Badge>
                        </div>
                      </div>

                      {/* Trainer Details */}
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{trainer.name}</h3>
                            <p className="text-sm text-primary font-medium">{trainer.specialization}</p>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{trainer.rating}</span>
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span>{trainer.location}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="w-4 h-4 mr-2" />
                            <span className={trainer.isOnline ? 'text-green-600' : 'text-orange-600'}>
                              {trainer.availability}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-lg font-bold text-primary">{trainer.sessionFee}</p>
                            <p className="text-xs text-gray-500">Per Session</p>
                          </div>
                          <Button
                            className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm"
                            onClick={() => setShowBookingPopup(true)}
                          >
                            Book
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

      {/* Booking Popup */}
      {showBookingPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-center mb-2 text-gray-900 dark:text-white">
              Booking Temporarily Unavailable
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
              We're currently not accepting new bookings. Please check back later or contact us directly for assistance.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowBookingPopup(false)}
              >
                Close
              </Button>
              <Button
                className="flex-1"
                onClick={() => setShowBookingPopup(false)}
              >
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      )}

      <BetaDisclaimerPopup category="trainers" actionVerb="training" />
    </div>
  );
}
