'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
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
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BetaDisclaimerBanner from '@/components/BetaDisclaimerBanner';
import BetaDisclaimerPopup from '@/components/BetaDisclaimerPopup';

// New Hospital Images
import hospFalcon from '@/assets/hospital/abu dhabi falcon hospital.jpg';
import hospQueens from '@/assets/hospital/Queens mother hospital.jpeg';
import hospPenn from '@/assets/hospital/pennvet.jpg';
import hospBluePearl from '@/assets/hospital/bluepearl.jpg';
import hospCascade from '@/assets/hospital/Cascade Hospitals for Animals.jpeg';
import hospTownCountry from '@/assets/hospital/town & country animal hospital.jpg';
import hospClinton from '@/assets/hospital/clinton keith veterinary hospital.jpg';
import hospMcCaulley from '@/assets/hospital/McCaulley Animal Clinic.jpeg';
import hospVetic from '@/assets/hospital/vetic.jpg';
import hospHawk from '@/assets/hospital/hawk bridge animal hospital.jpeg';
import hospAngell from '@/assets/hospital/Angell Animal Medical Center – Boston, Massachusetts, USA.jpg';
import hospSchwarzman from '@/assets/hospital/Schwarzman Animal Medical Center Opens Surgical Care Facility in Lenox Hill, Manhattan.jpg';
import hospChampion from '@/assets/hospital/hospital.jpg';

// Dummy hospital data with real world locations, ranked by global popularity with aligned ratings
const dummyHospitals = [
  // 1. RVC / Queen Mother Hospital (Often ranked #1 globally for VetMed)
  {
    id: 1,
    name: "Queen Mother Hospital",
    type: "Teaching Hospital (RVC)",
    rating: 5.0,
    reviews: 3500,
    location: "London, United Kingdom",
    distance: "International",
    availability: "24/7 Emergency",
    consultationFee: "£200 - £800",
    image: hospQueens,
    facilities: ["MRI/CT Scan", "Cancer Center", "Hydrotherapy", "Neurology Lab"],
    specializations: ["Oncology", "Neurology", "Cardiology", "Soft Tissue Surgery"],
    doctors: 50,
    established: "1791",
    languages: ["English"],
    parking: true,
    wifi: true,
    onlinePayment: true,
    responseTime: "Referral Only",
    consultationType: "Referral Hospital"
  },
  // 2. Schwarzman / AMC (Largest non-profit in USA)
  {
    id: 2,
    name: "Schwarzman Medical Center",
    type: "Teaching Hospital",
    rating: 4.9,
    reviews: 3200,
    location: "New York, NY, USA",
    distance: "International",
    availability: "24/7",
    consultationFee: "$250 - $750",
    image: hospSchwarzman,
    facilities: ["Surgical Center", "Trauma", "Rehabilitation", "Oncology"],
    specializations: ["Surgery", "Oncology", "Neurology", "Cardiology"],
    doctors: 120,
    established: "1910",
    languages: ["English", "Spanish"],
    parking: false,
    wifi: true,
    onlinePayment: true,
    responseTime: "Triage Based",
    consultationType: "Teaching Hospital"
  },
  // 3. Penn Vet (Top University Hospital)
  // 3. Penn Vet (Top University Hospital)
  {
    id: 3,
    name: "Penn Vet Ryan Hospital",
    type: "University Hospital",
    rating: 4.9,
    reviews: 4000,
    location: "Philadelphia, USA",
    distance: "International",
    availability: "24/7 Trauma",
    consultationFee: "$200 - $700",
    image: hospPenn,
    facilities: ["Trauma Center", "Genetic Testing", "Behavior Clinic", "Robotic Surgery"],
    specializations: ["Genetics", "Behavior", "Surgery", "Oncology"],
    doctors: 60,
    established: "1884",
    languages: ["English"],
    parking: true,
    wifi: true,
    onlinePayment: true,
    responseTime: "Triage Based",
    consultationType: "Teaching Hospital"
  },
  // 4. Angell Animal Medical Center (One of the oldest/most famous)
  {
    id: 4,
    name: "Angell Animal Medical Center",
    type: "referral hospital",
    rating: 4.9,
    reviews: 2100,
    location: "Boston, Massachusetts, USA",
    distance: "International",
    availability: "24/7 Emergency",
    consultationFee: "$200 - $600",
    image: hospAngell,
    facilities: ["Advanced Care", "Emergency", "Specialty Surgery", "Cardiology"],
    specializations: ["Emergency", "Critical Care", "Internal Medicine"],
    doctors: 40,
    established: "1915",
    languages: ["English"],
    parking: true,
    wifi: true,
    onlinePayment: true,
    responseTime: "Immediate",
    consultationType: "Referral & Emergency"
  },
  // 5. Abu Dhabi Falcon Hospital (World famous niche hospital)
  // 5. Abu Dhabi Falcon Hospital (World famous niche hospital)
  {
    id: 5,
    name: "Abu Dhabi Falcon Hospital",
    type: "Specialized Avian Hospital",
    rating: 4.8,
    reviews: 5000,
    location: "Abu Dhabi, UAE",
    distance: "International",
    availability: "Mon-Sat 8AM-8PM",
    consultationFee: "$150 - $500",
    image: hospFalcon,
    facilities: ["Falconry Heritage", "ICU", "Flight Tests", "Surgery", "Museum"],
    specializations: ["Avian Medicine", "Orthopedics", "Ophthalmology"],
    doctors: 20,
    established: "1999",
    languages: ["English", "Arabic"],
    parking: true,
    wifi: true,
    onlinePayment: true,
    responseTime: "Immediate",
    consultationType: "In-Person"
  },
  // 6. BluePearl (Major US Chain/Specialty)
  // 6. BluePearl (Major US Chain/Specialty)
  {
    id: 6,
    name: "BluePearl Pet Hospital",
    type: "Specialty & Emergency",
    rating: 4.8,
    reviews: 2800,
    location: "New York, USA",
    distance: "International",
    availability: "24/7 Emergency",
    consultationFee: "$180 - $600",
    image: hospBluePearl,
    facilities: ["Emergency ER", "Dialysis", "Blood Bank", "Advanced Imaging"],
    specializations: ["Emergency", "Critical Care", "Internal Medicine"],
    doctors: 30,
    established: "1996",
    languages: ["English", "Spanish"],
    parking: true,
    wifi: true,
    onlinePayment: true,
    responseTime: "Immediate",
    consultationType: "Emergency"
  },
  // 7. Vetic (Rising Tech-First network in India)
  // 7. Vetic (Rising Tech-First network in India)
  {
    id: 7,
    name: "Vetic Pet Clinic",
    type: "Modern Tech-First Clinic",
    rating: 4.7,
    reviews: 1200,
    location: "Mumbai, India",
    distance: "Local",
    availability: "Mon-Sun 9AM-9PM",
    consultationFee: "₹499 - ₹1,499",
    image: hospVetic,
    facilities: ["Digital Records", "Grooming", "Surgery", "In-house Lab"],
    specializations: ["Preventive Care", "Dermatology", "General Surgery"],
    doctors: 15,
    established: "2022",
    languages: ["English", "Hindi"],
    parking: true,
    wifi: true,
    onlinePayment: true,
    responseTime: "15 mins",
    consultationType: "Hybrid (App/Clinic)"
  },
  // 8. Cascade Hospital (Regional Excellence)
  // 8. Cascade Hospital (Regional Excellence)
  {
    id: 8,
    name: "Cascade Hospital for Animals",
    type: "Comprehensive Care",
    rating: 4.7,
    reviews: 950,
    location: "Grand Rapids, Michigan, USA",
    distance: "Regional",
    availability: "Mon-Sat 7AM-8PM",
    consultationFee: "$80 - $250",
    image: hospCascade,
    facilities: ["Wellness Plans", "Dental Care", "Ultrasound", "Boarding"],
    specializations: ["Dentistry", "Wellness", "Geriatric Care"],
    doctors: 10,
    established: "1955",
    languages: ["English"],
    parking: true,
    wifi: false,
    onlinePayment: true,
    responseTime: "Same Day",
    consultationType: "Clinic"
  },
  // 9. Champion Wood (Regional Excellence)
  {
    id: 9,
    name: "Champion Wood Animal Hospital",
    type: "Advanced Medical Center",
    rating: 4.7,
    reviews: 700,
    location: "Houston, Texas, USA",
    distance: "Regional",
    availability: "Mon-Sat 7AM-7PM",
    consultationFee: "$85 - $250",
    image: hospChampion,
    facilities: ["Surgery", "Dentistry", "Boarding", "Grooming"],
    specializations: ["General Practice", "Surgery", "Wellness"],
    doctors: 7,
    established: "2001",
    languages: ["English", "Spanish"],
    parking: true,
    wifi: true,
    onlinePayment: true,
    responseTime: "Same Day",
    consultationType: "Clinic"
  },
  // 10. Town & Country (Community Focused)
  {
    id: 10,
    name: "Town & Country Animal Hospital",
    type: "Community Hospital",
    rating: 4.6,
    reviews: 800,
    location: "Miami, Florida, USA",
    distance: "Regional",
    availability: "Mon-Fri 8AM-6PM",
    consultationFee: "$90 - $300",
    image: hospTownCountry,
    facilities: ["Laser Therapy", "Acupuncture", "Surgery", "Pet Hotel"],
    specializations: ["Holistic Care", "Rehabilitation", "General Medicine"],
    doctors: 8,
    established: "1980",
    languages: ["English", "Spanish"],
    parking: true,
    wifi: true,
    onlinePayment: true,
    responseTime: "Appointment",
    consultationType: "Clinic"
  },
  // 11. Clinton Keith (General)
  {
    id: 11,
    name: "Clinton Keith Veterinary Hospital",
    type: "General Practice",
    rating: 4.6,
    reviews: 650,
    location: "Wildomar, California, USA",
    distance: "Regional",
    availability: "Mon-Sat 8AM-6PM",
    consultationFee: "$95 - $280",
    image: hospClinton,
    facilities: ["Preventive Health", "Microchipping", "Nutritional Counseling"],
    specializations: ["Nutrition", "Internal Medicine", "Parasite Control"],
    doctors: 6,
    established: "2005",
    languages: ["English"],
    parking: true,
    wifi: true,
    onlinePayment: true,
    responseTime: "24 hrs",
    consultationType: "Clinic"
  },
  // 12. Hawk Ridge (Advanced Local)
  {
    id: 12,
    name: "Hawk Ridge Animal Hospital",
    type: "Advanced Care",
    rating: 4.5,
    reviews: 520,
    location: "Schererville, Indiana, USA",
    distance: "Regional",
    availability: "Mon-Sat 8AM-6PM",
    consultationFee: "$110 - $350",
    image: hospHawk,
    facilities: ["Surgery", "Diagnostics", "Wellness", "Dentistry"],
    specializations: ["Internal Medicine", "Surgery", "Diagnostics"],
    doctors: 5,
    established: "2010",
    languages: ["English"],
    parking: true,
    wifi: true,
    onlinePayment: true,
    responseTime: "Same Day",
    consultationType: "Clinic"
  }
];


const hospitalTypes = [
  "All Types",
  "Specialized Avian Hospital",
  "Teaching Hospital (RVC)",
  "Specialty & Emergency",
  "University Hospital",
  "Modern Tech-First Clinic",
  "Comprehensive Care",
  "Community Hospital",
  "General Practice",
  "Local Clinic"
];

const locations = [
  "All Locations",
  "Abu Dhabi, UAE",
  "London, United Kingdom",
  "New York, USA",
  "Philadelphia, USA",
  "Mumbai, India",
  "Grand Rapids, Michigan, USA",
  "Miami, Florida, USA",
  "Wildomar, California, USA",
  "St. Peters, Missouri, USA"
];

const consultationTypes = [
  "All Types",
  "In-Person",
  "Emergency",
  "Referral Hospital",
  "Teaching Hospital",
  "Hybrid (App/Clinic)",
  "Clinic",
  "Small Clinic"
];

export default function FindHospitalsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedConsultationType, setSelectedConsultationType] = useState('All Types');
  const [showFilters, setShowFilters] = useState(false);
  const [filteredHospitals, setFilteredHospitals] = useState(dummyHospitals);
  const [sortBy, setSortBy] = useState('featured'); // Default sort matches the list order
  // New state for selected hospital popup
  const [selectedHospital, setSelectedHospital] = useState<typeof dummyHospitals[0] | null>(null);

  useEffect(() => {
    let filtered = [...dummyHospitals];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(hospital =>
        hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hospital.specializations.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase())) ||
        hospital.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hospital.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by type - use partial matching for flexibility
    if (selectedType !== 'All Types') {
      filtered = filtered.filter(hospital => {
        const type = hospital.type.toLowerCase();
        const selected = selectedType.toLowerCase();
        return type.includes(selected) || selected.includes(type);
      });
    }

    // Filter by location
    if (selectedLocation !== 'All Locations') {
      filtered = filtered.filter(hospital => hospital.location === selectedLocation);
    }

    // Filter by consultation type
    if (selectedConsultationType !== 'All Types') {
      filtered = filtered.filter(hospital => hospital.consultationType === selectedConsultationType);
    }

    // Sort results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          // Sort by rating first, then by number of reviews as tiebreaker
          if (b.rating !== a.rating) {
            return b.rating - a.rating;
          }
          return b.reviews - a.reviews;

        case 'fee':
          // Extract minimum fee from range (e.g., "$250 - $750" -> 250)
          const parseFee = (fee: string): number => {
            const cleaned = fee.replace(/[^0-9.,-]/g, ''); // Keep numbers, decimals, commas, and hyphens
            const parts = cleaned.split('-'); // Split range
            const firstValue = parts[0].replace(/,/g, ''); // Remove commas from first value
            return parseFloat(firstValue) || 0;
          };
          return parseFee(a.consultationFee) - parseFee(b.consultationFee);

        case 'featured':
          // Featured matches the popularity order (preserve original index)
          return dummyHospitals.indexOf(a) - dummyHospitals.indexOf(b);

        default:
          return 0;
      }
    });

    setFilteredHospitals(filtered);
  }, [searchTerm, selectedType, selectedLocation, selectedConsultationType, sortBy]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedType('All Types');
    setSelectedLocation('All Locations');
    setSelectedConsultationType('All Types');
    setSortBy('featured');
    setShowFilters(false);
  };

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
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
    <div className="min-h-screen bg-background overflow-hidden relative">
      {/* Ghost Light - Unified with landing page */}
      <div className="fixed inset-0 bg-[image:var(--bg-subtle-mesh)] pointer-events-none opacity-90 z-0" />
      <div className="fixed inset-0 bg-[image:var(--bg-dot-pattern)] bg-[length:24px_24px] pointer-events-none opacity-50 [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)] z-0" />
      <div className="fixed inset-0 bg-slate-50/40 dark:bg-transparent pointer-events-none z-0" />

      <div className="relative z-10">
        <Header />

        {/* Search and Filters */}
        <section className="pt-32 pb-8">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-6xl mx-auto">
              {/* Early Access Banner */}
              <BetaDisclaimerBanner category="hospitals" />

              {/* Search Bar */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search by hospital name, specialization, or facility..."
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
                      { value: 'featured', label: 'Global Ranking' },
                      { value: 'rating', label: 'Rating' },
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
                    <label className="block text-sm font-medium mb-2">Hospital Type</label>
                    <CustomSelect
                      options={hospitalTypes.map(type => ({ value: type, label: type }))}
                      value={selectedType}
                      onChange={handleTypeChange}
                      placeholder="Select type"
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
                    <Card key={hospital.id} className="group hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
                      <CardContent className="p-0">
                        {/* Hospital Image */}
                        <div className="relative h-64 overflow-hidden">
                          <Image
                            src={hospital.image}
                            alt={hospital.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-3 right-3">
                            <Badge variant="default" className="text-xs">
                              {hospital.availability}
                            </Badge>
                          </div>
                        </div>

                        {/* Hospital Details */}
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">{hospital.name}</h3>
                              <p className="text-sm text-primary dark:text-primary font-medium">{hospital.type}</p>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-500" />
                              <span className="text-sm font-medium text-yellow-700 dark:text-yellow-400">{hospital.rating}</span>
                            </div>
                          </div>

                          <div className="space-y-2 mb-4">
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                              <MapPin className="w-4 h-4 mr-2" />
                              <span>{hospital.location}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                              <Clock className="w-4 h-4 mr-2" />
                              <span>{hospital.responseTime} Response</span>
                            </div>
                          </div>

                          {/* Facilities Tags */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {hospital.facilities.slice(0, 3).map((facility, index) => (
                              <span key={index} className="text-[10px] bg-secondary/50 text-secondary-foreground px-2 py-1 rounded-full">
                                {facility}
                              </span>
                            ))}
                            {hospital.facilities.length > 3 && (
                              <span className="text-[10px] bg-secondary/50 text-secondary-foreground px-2 py-1 rounded-full">
                                +{hospital.facilities.length - 3}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
                            <div>
                              <p className="text-lg font-bold text-primary">{hospital.consultationFee}</p>
                              <p className="text-xs text-gray-500">Consultation</p>
                            </div>
                            <Button
                              className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm"
                              onClick={() => setSelectedHospital(hospital)}
                            >
                              Details
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

        {/* Hospital Details Popup */}
        {selectedHospital && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
            <div className="bg-card rounded-2xl p-0 max-w-2xl w-full mx-4 shadow-2xl overflow-hidden border border-border flex flex-col max-h-[90vh]">

              <div className="relative h-64 shrink-0">
                <Image
                  src={selectedHospital.image}
                  alt={selectedHospital.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 right-4">
                  <Button
                    variant="destructive"
                    size="icon"
                    className="rounded-full w-8 h-8 opacity-90 hover:opacity-100"
                    onClick={() => setSelectedHospital(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="p-6 overflow-y-auto">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{selectedHospital.name}</h2>
                    <Badge variant="outline" className="border-primary text-primary">{selectedHospital.type}</Badge>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end space-x-1 mb-1">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-500" />
                      <span className="text-xl font-bold text-gray-900 dark:text-white">{selectedHospital.rating}</span>
                    </div>
                    <p className="text-xs text-gray-500">{selectedHospital.reviews} Reviews</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                      <MapPin className="w-4 h-4 mr-3 text-primary" />
                      {selectedHospital.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                      <Clock className="w-4 h-4 mr-3 text-primary" />
                      {selectedHospital.availability}
                    </div>
                    <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                      <Phone className="w-4 h-4 mr-3 text-primary" />
                      +1 (555) 123-4567
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                      <CheckCircle className="w-4 h-4 mr-3 text-green-500" />
                      Started: {selectedHospital.established}
                    </div>
                    <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                      <Users className="w-4 h-4 mr-3 text-blue-500" />
                      {selectedHospital.doctors} Doctors
                    </div>
                    <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                      <CreditCard className="w-4 h-4 mr-3 text-purple-500" />
                      Fee: {selectedHospital.consultationFee}
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-3">Facilities</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedHospital.facilities.map((fac, i) => (
                      <Badge key={i} variant="secondary">{fac}</Badge>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-3">Specializations</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedHospital.specializations.map((spec, i) => (
                      <span key={i} className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20">{spec}</span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-8">
                  <div className={`flex flex-col items-center p-3 rounded-lg border ${selectedHospital.parking ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' : 'bg-gray-50 border-gray-200'}`}>
                    <Car className={`w-5 h-5 mb-1 ${selectedHospital.parking ? 'text-green-600' : 'text-gray-400'}`} />
                    <span className="text-xs font-medium">Parking</span>
                  </div>
                  <div className={`flex flex-col items-center p-3 rounded-lg border ${selectedHospital.wifi ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800' : 'bg-gray-50 border-gray-200'}`}>
                    <Wifi className={`w-5 h-5 mb-1 ${selectedHospital.wifi ? 'text-blue-600' : 'text-gray-400'}`} />
                    <span className="text-xs font-medium">Wifi</span>
                  </div>
                  <div className={`flex flex-col items-center p-3 rounded-lg border ${selectedHospital.onlinePayment ? 'bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800' : 'bg-gray-50 border-gray-200'}`}>
                    <CreditCard className={`w-5 h-5 mb-1 ${selectedHospital.onlinePayment ? 'text-purple-600' : 'text-gray-400'}`} />
                    <span className="text-xs font-medium">Cashless</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button className="flex-1 bg-primary hover:bg-primary/90">Book Appointment</Button>
                  <Button variant="outline" className="flex-1">Call Hospital</Button>
                </div>

              </div>
            </div>
          </div>
        )}

        <BetaDisclaimerPopup category="hospitals" actionVerb="treatment" />
      </div>
    </div>
  );
}
