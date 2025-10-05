'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CustomSelect from '@/components/ui/custom-select';
import { 
  Search, 
  MapPin, 
  Star, 
  Clock, 
  Phone, 
  SlidersHorizontal,
  Building2,
  ChevronDown,
  X,
  Car,
  Wifi,
  CreditCard,
  Users,
  Award,
  CheckCircle
} from 'lucide-react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import hospitalImage1 from '@/assets/hospital/hospital.jpg';
import hospitalImage2 from '@/assets/hospital/service-clinic-hospital.jpg';
import hospitalImage3 from '@/assets/hospital/vetic.jpg';
import hospitalImage4 from '@/assets/ai-vet-tech.jpg';
import hospitalImage5 from '@/assets/ai-petcare.jpg';
import hospitalImage6 from '@/assets/pexels-kooldark-14438788.jpg';

// Dummy hospital data with actual images
const dummyHospitals = [
  {
    id: 1,
    name: "PetCare Advanced Hospital",
    type: "Multi-Specialty Hospital",
    rating: 4.8,
    reviews: 324,
    location: "Mumbai, Maharashtra",
    distance: "2.1 km",
    availability: "24/7 Emergency",
    consultationFee: "₹600 - ₹1,500",
    image: hospitalImage1,
    facilities: ["Emergency Care", "Surgery", "ICU", "X-Ray", "Lab", "Pharmacy"],
    specializations: ["General Medicine", "Surgery", "Emergency", "Dermatology"],
    doctors: 12,
    established: "2015",
    languages: ["English", "Hindi", "Marathi"],
    parking: true,
    wifi: true,
    onlinePayment: true,
    responseTime: "Immediate"
  },
  {
    id: 2,
    name: "Animal Emergency Center",
    type: "Emergency Hospital",
    rating: 4.9,
    reviews: 189,
    location: "Delhi, NCR",
    distance: "3.4 km",
    availability: "24/7 Emergency",
    consultationFee: "₹800 - ₹2,000",
    image: hospitalImage2,
    facilities: ["Emergency Care", "Trauma Center", "ICU", "Blood Bank", "Ambulance"],
    specializations: ["Emergency Medicine", "Trauma Surgery", "Critical Care"],
    doctors: 8,
    established: "2018",
    languages: ["English", "Hindi", "Punjabi"],
    parking: true,
    wifi: true,
    onlinePayment: true,
    responseTime: "Immediate"
  },
  {
    id: 3,
    name: "Skin & Coat Specialty Clinic",
    type: "Specialty Clinic",
    rating: 4.7,
    reviews: 156,
    location: "Bangalore, Karnataka",
    distance: "4.2 km",
    availability: "Mon-Sat 9AM-7PM",
    consultationFee: "₹500 - ₹1,200",
    image: hospitalImage3,
    facilities: ["Dermatology", "Allergy Testing", "Cosmetic Surgery", "Lab"],
    specializations: ["Dermatology", "Allergy Medicine", "Cosmetic Surgery"],
    doctors: 4,
    established: "2020",
    languages: ["English", "Hindi", "Kannada"],
    parking: true,
    wifi: true,
    onlinePayment: true,
    responseTime: "30 mins"
  },
  {
    id: 4,
    name: "Ortho Pet Center",
    type: "Specialty Hospital",
    rating: 4.9,
    reviews: 267,
    location: "Ahmedabad, Gujarat",
    distance: "1.8 km",
    availability: "Mon-Sun 8AM-8PM",
    consultationFee: "₹700 - ₹1,800",
    image: hospitalImage4,
    facilities: ["Orthopedic Surgery", "Physical Therapy", "X-Ray", "MRI", "Lab"],
    specializations: ["Orthopedics", "Physical Therapy", "Sports Medicine"],
    doctors: 6,
    established: "2017",
    languages: ["English", "Hindi", "Gujarati"],
    parking: true,
    wifi: true,
    onlinePayment: true,
    responseTime: "15 mins"
  },
  {
    id: 5,
    name: "Heart Care Veterinary",
    type: "Cardiology Center",
    rating: 4.6,
    reviews: 98,
    location: "Pune, Maharashtra",
    distance: "5.1 km",
    availability: "Mon-Fri 9AM-6PM",
    consultationFee: "₹1,000 - ₹2,500",
    image: hospitalImage5,
    facilities: ["Cardiology", "ECG", "Echocardiography", "Heart Surgery", "ICU"],
    specializations: ["Cardiology", "Heart Surgery", "Cardiac Care"],
    doctors: 3,
    established: "2019",
    languages: ["English", "Hindi", "Marathi"],
    parking: true,
    wifi: true,
    onlinePayment: true,
    responseTime: "45 mins"
  },
  {
    id: 6,
    name: "Cancer Care Center",
    type: "Oncology Hospital",
    rating: 4.8,
    reviews: 134,
    location: "Hyderabad, Telangana",
    distance: "3.7 km",
    availability: "Mon-Sat 8AM-6PM",
    consultationFee: "₹1,500 - ₹3,000",
    image: hospitalImage6,
    facilities: ["Oncology", "Chemotherapy", "Radiation Therapy", "Palliative Care", "Lab"],
    specializations: ["Oncology", "Cancer Treatment", "Palliative Care"],
    doctors: 5,
    established: "2021",
    languages: ["English", "Hindi", "Telugu"],
    parking: true,
    wifi: true,
    onlinePayment: true,
    responseTime: "1 hour"
  }
];

const hospitalTypes = [
  "All Types",
  "Multi-Specialty Hospital",
  "Emergency Hospital",
  "Specialty Clinic",
  "Specialty Hospital",
  "Cardiology Center",
  "Oncology Hospital"
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

const specializations = [
  "All Specializations",
  "General Medicine",
  "Emergency Medicine",
  "Surgery",
  "Dermatology",
  "Orthopedics",
  "Cardiology",
  "Oncology"
];

export default function FindHospitalsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All Specializations');
  const [showFilters, setShowFilters] = useState(false);
  const [filteredHospitals, setFilteredHospitals] = useState(dummyHospitals);
  const [sortBy, setSortBy] = useState('rating');

  useEffect(() => {
    let filtered = dummyHospitals;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(hospital => 
        hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hospital.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hospital.specializations.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by type
    if (selectedType !== 'All Types') {
      filtered = filtered.filter(hospital => hospital.type === selectedType);
    }

    // Filter by location
    if (selectedLocation !== 'All Locations') {
      filtered = filtered.filter(hospital => hospital.location === selectedLocation);
    }

    // Filter by specialization
    if (selectedSpecialization !== 'All Specializations') {
      filtered = filtered.filter(hospital => 
        hospital.specializations.includes(selectedSpecialization)
      );
    }

    // Sort results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'distance':
          return parseFloat(a.distance) - parseFloat(b.distance);
        case 'reviews':
          return b.reviews - a.reviews;
        default:
          return 0;
      }
    });

    setFilteredHospitals(filtered);
  }, [searchTerm, selectedType, selectedLocation, selectedSpecialization, sortBy]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedType('All Types');
    setSelectedLocation('All Locations');
    setSelectedSpecialization('All Specializations');
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
                placeholder="Search by hospital name, type, or specialization..."
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
                    { value: 'reviews', label: 'Reviews' }
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
                  <label className="block text-sm font-medium mb-2">Hospital Type</label>
                  <CustomSelect
                    options={hospitalTypes.map(type => ({ value: type, label: type }))}
                    value={selectedType}
                    onChange={setSelectedType}
                    placeholder="Select hospital type"
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
                <div>
                  <label className="block text-sm font-medium mb-2">Specialization</label>
                  <CustomSelect
                    options={specializations.map(spec => ({ value: spec, label: spec }))}
                    value={selectedSpecialization}
                    onChange={setSelectedSpecialization}
                    placeholder="Select specialization"
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
                {filteredHospitals.length} hospital{filteredHospitals.length !== 1 ? 's' : ''} found
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Hospitals List */}
      <section className="pb-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {filteredHospitals.length === 0 ? (
              <div className="text-center py-16">
                <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No hospitals found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your search criteria</p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredHospitals.map((hospital) => (
                  <Card key={hospital.id} className="group hover:shadow-lg transition-all duration-300 bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <CardContent className="p-0">
                      {/* Hospital Image */}
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={hospital.image}
                          alt={hospital.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 right-3">
                          <Badge variant="default" className="text-xs">
                            Est. {hospital.established}
                          </Badge>
                        </div>
                      </div>

                      {/* Hospital Details */}
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{hospital.name}</h3>
                            <p className="text-sm text-primary font-medium">{hospital.type}</p>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{hospital.rating}</span>
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span>{hospital.location}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="w-4 h-4 mr-2" />
                            <span className="text-green-600">{hospital.availability}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Users className="w-4 h-4 mr-2" />
                            <span>{hospital.doctors} doctors</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-lg font-bold text-primary">{hospital.consultationFee}</p>
                            <p className="text-xs text-gray-500">Consultation</p>
                          </div>
                          <Button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm">
                            Book Appointment
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
