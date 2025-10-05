'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
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
  Stethoscope,
  ChevronDown,
  X,
  IndianRupee,
  CheckCircle,
  Users,
  Award,
  AlertCircle
} from 'lucide-react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import vetImage1 from '@/assets/vets/pexels-edmond-dantes-4342352.jpg';
import vetImage2 from '@/assets/vets/pexels-gustavo-fring-4173248.jpg';
import vetImage3 from '@/assets/vets/pexels-gustavo-fring-4173251.jpg';
import vetImage4 from '@/assets/vets/pexels-kooldark-14438788.jpg';
import vetImage5 from '@/assets/vets/pexels-kooldark-14438790.jpg';
import vetImage6 from '@/assets/hero-vet.jpg';

// Dummy vet data with actual images
const dummyVets = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialization: "General Practice",
    experience: "8 years",
    rating: 4.9,
    reviews: 127,
    location: "Mumbai, Maharashtra",
    distance: "2.3 km",
    availability: "Available Now",
    consultationFee: "₹800",
    image: vetImage1,
    languages: ["English", "Hindi", "Marathi"],
    services: ["General Checkup", "Vaccination", "Surgery", "Emergency Care"],
    education: "BVSc, MVSc (Surgery)",
    hospital: "PetCare Hospital",
    isOnline: true,
    responseTime: "5 mins",
    consultationType: "Home Visit"
  },
  {
    id: 2,
    name: "Dr. Rajesh Kumar",
    specialization: "Emergency Medicine",
    experience: "12 years",
    rating: 4.8,
    reviews: 89,
    location: "Delhi, NCR",
    distance: "1.8 km",
    availability: "Available in 30 mins",
    consultationFee: "₹1,200",
    image: vetImage2,
    languages: ["English", "Hindi", "Punjabi"],
    services: ["Emergency Care", "Trauma Surgery", "Critical Care", "ICU"],
    education: "BVSc, MVSc (Emergency Medicine)",
    hospital: "Emergency Pet Clinic",
    isOnline: false,
    responseTime: "15 mins",
    consultationType: "Home Visit"
  },
  {
    id: 3,
    name: "Dr. Priya Sharma",
    specialization: "Dermatology",
    experience: "6 years",
    rating: 4.7,
    reviews: 156,
    location: "Bangalore, Karnataka",
    distance: "4.1 km",
    availability: "Available Tomorrow",
    consultationFee: "₹1,000",
    image: vetImage3,
    languages: ["English", "Hindi", "Kannada"],
    services: ["Skin Care", "Allergy Treatment", "Dermatology", "Cosmetic Surgery"],
    education: "BVSc, MVSc (Dermatology)",
    hospital: "Skin & Coat Clinic",
    isOnline: true,
    responseTime: "10 mins",
    consultationType: "Online Consultation"
  },
  {
    id: 4,
    name: "Dr. Amit Patel",
    specialization: "Orthopedics",
    experience: "10 years",
    rating: 4.9,
    reviews: 203,
    location: "Ahmedabad, Gujarat",
    distance: "3.2 km",
    availability: "Available Now",
    consultationFee: "₹1,500",
    image: vetImage4,
    languages: ["English", "Hindi", "Gujarati"],
    services: ["Bone Surgery", "Joint Replacement", "Fracture Treatment", "Physical Therapy"],
    education: "BVSc, MVSc (Orthopedics)",
    hospital: "Ortho Pet Center",
    isOnline: true,
    responseTime: "8 mins",
    consultationType: "Home Visit"
  },
  {
    id: 5,
    name: "Dr. Neha Singh",
    specialization: "Cardiology",
    experience: "7 years",
    rating: 4.8,
    reviews: 94,
    location: "Pune, Maharashtra",
    distance: "5.7 km",
    availability: "Available in 1 hour",
    consultationFee: "₹1,300",
    image: vetImage5,
    languages: ["English", "Hindi", "Marathi"],
    services: ["Heart Surgery", "ECG", "Echocardiography", "Cardiac Care"],
    education: "BVSc, MVSc (Cardiology)",
    hospital: "Heart Care Veterinary",
    isOnline: false,
    responseTime: "20 mins",
    consultationType: "Online Consultation"
  },
  {
    id: 6,
    name: "Dr. Vikram Reddy",
    specialization: "Oncology",
    experience: "9 years",
    rating: 4.6,
    reviews: 67,
    location: "Hyderabad, Telangana",
    distance: "2.9 km",
    availability: "Available Now",
    consultationFee: "₹2,000",
    image: vetImage6,
    languages: ["English", "Hindi", "Telugu"],
    services: ["Cancer Treatment", "Chemotherapy", "Radiation Therapy", "Palliative Care"],
    education: "BVSc, MVSc (Oncology)",
    hospital: "Cancer Care Center",
    isOnline: true,
    responseTime: "12 mins",
    consultationType: "Online Consultation"
  }
];

const specializations = [
  "All Specializations",
  "General Practice",
  "Emergency Medicine", 
  "Dermatology",
  "Orthopedics",
  "Cardiology",
  "Oncology",
  "Surgery",
  "Internal Medicine"
];

const consultationTypes = [
  "All Types",
  "Home Visit",
  "Online Consultation"
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

export default function FindVetsPage() {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All Specializations');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedConsultationType, setSelectedConsultationType] = useState('All Types');
  const [showFilters, setShowFilters] = useState(false);
  const [filteredVets, setFilteredVets] = useState(dummyVets);
  const [sortBy, setSortBy] = useState('rating');
  const [showBookingPopup, setShowBookingPopup] = useState(false);

  // Check for URL parameters on component mount
  useEffect(() => {
    const typeParam = searchParams.get('type');
    if (typeParam === 'online') {
      setSelectedConsultationType('Online Consultation');
      setShowFilters(true); // Auto-show filters when coming from service link
    }
  }, [searchParams]);

  useEffect(() => {
    let filtered = dummyVets;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(vet => 
        vet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vet.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vet.hospital.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by specialization
    if (selectedSpecialization !== 'All Specializations') {
      filtered = filtered.filter(vet => vet.specialization === selectedSpecialization);
    }

    // Filter by location
    if (selectedLocation !== 'All Locations') {
      filtered = filtered.filter(vet => vet.location === selectedLocation);
    }

    // Filter by consultation type
    if (selectedConsultationType !== 'All Types') {
      filtered = filtered.filter(vet => vet.consultationType === selectedConsultationType);
    }

    // Sort results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'distance':
          return parseFloat(a.distance) - parseFloat(b.distance);
        case 'fee':
          return parseInt(a.consultationFee.replace('₹', '').replace(',', '')) - 
                 parseInt(b.consultationFee.replace('₹', '').replace(',', ''));
        default:
          return 0;
      }
    });

    setFilteredVets(filtered);
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
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search by vet name, specialization, or consultation type..."
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
                    { value: 'fee', label: 'Consultation Fee' }
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
                  <label className="block text-sm font-medium mb-2">Consultation Type</label>
                  <CustomSelect
                    options={consultationTypes.map(type => ({ value: type, label: type }))}
                    value={selectedConsultationType}
                    onChange={handleConsultationTypeChange}
                    placeholder="Select consultation type"
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
              <div>
                <p className="text-muted-foreground font-medium">
                  {filteredVets.length} veterinarian{filteredVets.length !== 1 ? 's' : ''} found
                </p>
                {selectedConsultationType === 'Online Consultation' && (
                  <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                    Showing online consultation services
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vets List */}
      <section className="pb-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {filteredVets.length === 0 ? (
              <div className="text-center py-16">
                <Stethoscope className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No veterinarians found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your search criteria</p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVets.map((vet) => (
                  <Card key={vet.id} className="group hover:shadow-lg transition-all duration-300 bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <CardContent className="p-0">
                      {/* Vet Image */}
                      <div className="relative h-64 overflow-hidden">
                        <Image
                          src={vet.image}
                          alt={vet.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 right-3">
                          <Badge variant={vet.isOnline ? 'default' : 'secondary'} className="text-xs">
                            {vet.isOnline ? 'Online' : 'Offline'}
                          </Badge>
                        </div>
                        <div className="absolute bottom-3 left-3">
                          <Badge className={`text-xs ${vet.consultationType === 'Home Visit' ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'}`}>
                            {vet.consultationType}
                          </Badge>
                        </div>
                      </div>

                      {/* Vet Details */}
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{vet.name}</h3>
                            <p className="text-sm text-primary font-medium">{vet.specialization}</p>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{vet.rating}</span>
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span>{vet.location}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="w-4 h-4 mr-2" />
                            <span className={vet.isOnline ? 'text-green-600' : 'text-orange-600'}>
                              {vet.availability}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-lg font-bold text-primary">{vet.consultationFee}</p>
                            <p className="text-xs text-gray-500">Consultation</p>
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
    </div>
  );
}
