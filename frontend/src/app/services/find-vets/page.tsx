'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
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
  AlertCircle,
  Bot
} from 'lucide-react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BetaDisclaimerPopup from '@/components/BetaDisclaimerPopup';
import BetaDisclaimerBanner from '@/components/BetaDisclaimerBanner';
import vetSRK from '@/assets/vets/srk.png';
import vetAB from '@/assets/vets/ab.png';
import vetAish from '@/assets/vets/aishwarya.png';
import vetKat from '@/assets/vets/katrina.png';
import vetSalman from '@/assets/vets/bhai.png';
import vetRDJ from '@/assets/vets/rdj.png';
import vetAna from '@/assets/vets/ana de armas.png';
import vetAlex from '@/assets/vets/alexandra.png';
import vetEmma from '@/assets/vets/emma watson.png';
import vetBale from '@/assets/vets/christian bale.png';
import vetHenry from '@/assets/vets/henry.png';
import vetSadie from '@/assets/vets/sadie sink.png';
import vetRonaldo from '@/assets/vets/cristiano.png';
import vetMillie from '@/assets/vets/millie.png';
import vetAriana from '@/assets/vets/ariana.png';
import vetCillian from '@/assets/vets/cillian.png';
import vetMadison from '@/assets/vets/madison.png';
import vetKeanu from '@/assets/vets/keeanu.png';
import vetImage5 from '@/assets/vets/pexels-kooldark-14438790.jpg';
import vetImage6 from '@/assets/hero-vet.jpg';

// Dummy vet data with fictional character personas
// Dummy vet data with fictional character personas
const dummyVets = [
  // 1. RDJ (LA)
  {
    id: 1,
    name: "Dr. Pawbert Downey Jr.",
    specialization: "Tech-Assisted Surgery",
    experience: "25 years",
    rating: 5.0,
    reviews: 10000,
    location: "Los Angeles, USA",
    distance: "12 km",
    availability: "Available Now",
    consultationFee: "$300",
    image: vetRDJ,
    languages: ["English"],
    services: ["Robotic Surgery", "Nano-Tech Healing"],
    education: "Stark Vet Academy",
    hospital: "Avengers Tower Vet Wing",
    isOnline: true,
    responseTime: "Jarvis Speed",
    consultationType: "Video Call"
  },
  // 2. Emma (London)
  {
    id: 2,
    name: "Dr. Emma Paws",
    specialization: "Magical Healing",
    experience: "15 years",
    rating: 5.0,
    reviews: 9500,
    location: "London, UK",
    distance: "50 km",
    availability: "Available Now",
    consultationFee: "$200",
    image: vetEmma,
    languages: ["English", "French"],
    services: ["General Medicine", "Potion Mixing"],
    education: "Hogwarts School of Vetery",
    hospital: "Griffindog House",
    isOnline: true,
    responseTime: "Owl Post Speed",
    consultationType: "Video Call"
  },
  // 3. King Paw (SRK) (Mumbai)
  {
    id: 3,
    name: "Dr. King Paw (SRK)",
    specialization: "General Practice",
    experience: "30 years",
    rating: 5.0,
    reviews: 9000,
    location: "Mumbai, India",
    distance: "2.3 km",
    availability: "Available Now",
    consultationFee: "$100",
    image: vetSRK,
    languages: ["English", "Hindi"],
    services: ["General Checkup", "Vaccination", "Romantic Stares"],
    education: "BVSc, MVSc (Charm)",
    hospital: "Mannat Pet Care",
    isOnline: true,
    responseTime: "Instant",
    consultationType: "Video Call"
  },
  // 4. Cristiano (Miami)
  {
    id: 4,
    name: "Dr. Cris Pawmnaldo",
    specialization: "Sports Medicine",
    experience: "20 years",
    rating: 5.0,
    reviews: 8500,
    location: "Miami, USA",
    distance: "30 km",
    availability: "SIUUUUU Soon",
    consultationFee: "$700",
    image: vetRonaldo,
    languages: ["Portuguese", "English", "Spanish"],
    services: ["Fitness", "Agility Training"],
    education: "Sporting Vet Lisbon",
    hospital: "CR7 Pet Wellness",
    isOnline: true,
    responseTime: "90 mins match",
    consultationType: "Video Call"
  },
  // 5. Alexandra (LA)
  {
    id: 5,
    name: "Dr. Alexandra Pawdario",
    specialization: "Ophthalmology",
    experience: "12 years",
    rating: 5.0,
    reviews: 8000,
    location: "Los Angeles, USA",
    distance: "14 km",
    availability: "Available Now",
    consultationFee: "$160",
    image: vetAlex,
    languages: ["English"],
    services: ["Eye Care", "Hypnotic Gaze Therapy"],
    education: "Baywatch Vet School",
    hospital: "San Andreas Animal Center",
    isOnline: true,
    responseTime: "20 mins",
    consultationType: "Video Call"
  },
  // 6. AB (Mumbai)
  {
    id: 6,
    name: "Dr. Pawmitabh Bachchan",
    specialization: "Senior Consultant",
    experience: "50 years",
    rating: 5.0,
    reviews: 7500,
    location: "Mumbai, India",
    distance: "5.1 km",
    availability: "Weekends Only",
    consultationFee: "$120",
    image: vetAB,
    languages: ["English", "Hindi"],
    services: ["Surgery", "Baritone Diagnosis"],
    education: "PhD in Veterinary Legends",
    hospital: "Jalsa Vet Clinic",
    isOnline: false,
    responseTime: "1 hour",
    consultationType: "In-Clinic"
  },
  // 7. Ana (LA)
  {
    id: 7,
    name: "Dr. Ana de Paws",
    specialization: "General Practice",
    experience: "8 years",
    rating: 5.0,
    reviews: 7000,
    location: "Los Angeles, USA",
    distance: "10 km",
    availability: "Available Now",
    consultationFee: "$150",
    image: vetAna,
    languages: ["English", "Spanish"],
    services: ["Checkups", "Vaccination"],
    education: "Blade Runner Bio-Vets",
    hospital: "Hollywood Paws",
    isOnline: true,
    responseTime: "10 mins",
    consultationType: "Online"
  },
  // 8. Henry (NYC)
  {
    id: 8,
    name: "Dr. Henry Pawvill",
    specialization: "Super Strength Therapy",
    experience: "18 years",
    rating: 5.0,
    reviews: 6500,
    location: "New York City, USA",
    distance: "20 km",
    availability: "Available Now",
    consultationFee: "$220",
    image: vetHenry,
    languages: ["English"],
    services: ["Rehabilitation", "Steel Grooming"],
    education: "Krypton Vet Science",
    hospital: "Metropolis Animal Care",
    isOnline: true,
    responseTime: "Faster than a speeding bullet",
    consultationType: "Video Call"
  },
  // 9. Madison (Swapped from 18)
  {
    id: 9,
    name: "Dr. Madison Paws",
    specialization: "Melody Therapy",
    experience: "5 years",
    rating: 5.0,
    reviews: 6000, // Kept high for position 9
    location: "Los Angeles, USA",
    distance: "10 km",
    availability: "Available Now",
    consultationFee: "$160",
    image: vetMadison,
    languages: ["English"],
    services: ["Voice Healing", "Calm Vibes"],
    education: "Beverly Hills Vet",
    hospital: "Life Support Clinic",
    isOnline: true,
    responseTime: "Soon",
    consultationType: "Online"
  },
  // 10. Aishwarya (Mumbai)
  {
    id: 10,
    name: "Dr. Aishpurrya Rai",
    specialization: "Dermatology",
    experience: "20 years",
    rating: 5.0,
    reviews: 5500,
    location: "Mumbai, India",
    distance: "3.5 km",
    availability: "Available Now",
    consultationFee: "$110",
    image: vetAish,
    languages: ["English", "Tulu", "Hindi"],
    services: ["Skin Care", "Grooming", "Miss World Class Treatment"],
    education: "MVSc (Dermatology)",
    hospital: "Royal Paws",
    isOnline: true,
    responseTime: "15 mins",
    consultationType: "Video Call"
  },
  // 11. Salman (Mumbai)
  {
    id: 11,
    name: "Dr. Salman Paw",
    specialization: "Orthopedics & Fitness",
    experience: "35 years",
    rating: 5.0,
    reviews: 5000,
    location: "Mumbai, India",
    distance: "6.0 km",
    availability: "Being Human Time",
    consultationFee: "$95",
    image: vetSalman,
    languages: ["English", "Hindi"],
    services: ["Muscle Building", "Joint Surgery"],
    education: "MVSc (Surgery)",
    hospital: "Galaxy Pet Hospital",
    isOnline: false,
    responseTime: "45 mins",
    consultationType: "In-Clinic"
  },
  // 12. Katrina (Mumbai)
  {
    id: 12,
    name: "Dr. Katrina Paws",
    specialization: "Nutrition & Diet",
    experience: "15 years",
    rating: 5.0,
    reviews: 4500,
    location: "Mumbai, India",
    distance: "4.0 km",
    availability: "Available Now",
    consultationFee: "$90",
    image: vetKat,
    languages: ["English", "Hindi"],
    services: ["Diet Planning", "Fitness Training"],
    education: "Certified Pet Nutritionist",
    hospital: "Kay Beauty Vets",
    isOnline: true,
    responseTime: "30 mins",
    consultationType: "Online"
  },
  // 13. Keanu (LA)
  {
    id: 13,
    name: "Dr. Kitten Reeves",
    specialization: "Action Recovery",
    experience: "25 years",
    rating: 5.0,
    reviews: 4000,
    location: "Los Angeles, USA",
    distance: "15 km",
    availability: "Available Now",
    consultationFee: "$250",
    image: vetKeanu,
    languages: ["English"],
    services: ["Focus Training", "Pencil Surgery"],
    education: "Continential Vet School",
    hospital: "Wick Animal Haven",
    isOnline: true,
    responseTime: "Yeah.",
    consultationType: "Video Call"
  },

  // Remaining Vets
  // 14. Christian Bale (London)
  {
    id: 14,
    name: "Dr. Christian Tail",
    specialization: "Night Emergency",
    experience: "22 years",
    rating: 5.0,
    reviews: 3500,
    location: "London, UK",
    distance: "55 km",
    availability: "Only at Night",
    consultationFee: "$250",
    image: vetBale,
    languages: ["English"],
    services: ["Emergency Surgery", "Bat-Veterinary"],
    education: "Gotham Vet U",
    hospital: "Wayne Pet Enterprises",
    isOnline: false,
    responseTime: "Dark Knight Rises",
    consultationType: "Emergency"
  },
  // 15. Millie (Nashville)
  {
    id: 15,
    name: "Dr. Millie Pawby Brown",
    specialization: "Puppy Telekinesis",
    experience: "7 years",
    rating: 4.8, // Slightly lower to create tiers? No, keep 5.0 but lower reviews
    reviews: 3000,
    location: "Nashville, USA",
    distance: "40 km",
    availability: "Available Now",
    consultationFee: "$140",
    image: vetMillie,
    languages: ["English"],
    services: ["Psychic Diagnosis", "Waffles Nutrition"],
    education: "Eleven Vet School",
    hospital: "Nashville Paws",
    isOnline: true,
    responseTime: "11 mins",
    consultationType: "Online"
  },
  // 16. Ariana (Paris)
  {
    id: 16,
    name: "Dr. Furiana Grande",
    specialization: "Vocal Therapy",
    experience: "10 years",
    rating: 4.8,
    reviews: 2500,
    location: "Paris, France",
    distance: "100 km",
    availability: "Available Now",
    consultationFee: "$180",
    image: vetAriana,
    languages: ["English", "French"],
    services: ["Soothing Lullabies", "High Note Healing"],
    education: "Thank U, Next Vet U",
    hospital: "7 Rings Clinic",
    isOnline: true,
    responseTime: "Positions (Remote)",
    consultationType: "Video Call"
  },
  // 17. Cillian (LA)
  {
    id: 17,
    name: "Dr. Cillian Meowphy",
    specialization: "Nuclear Radiology",
    experience: "20 years",
    rating: 4.8,
    reviews: 2000,
    location: "Los Angeles, USA",
    distance: "15 km",
    availability: "By Appointment",
    consultationFee: "$250",
    image: vetCillian,
    languages: ["English", "Irish"],
    services: ["X-Ray", "MRI", "Intense Staring"],
    education: "Shelby Vet Institute",
    hospital: "Peaky Paws Clinic",
    isOnline: true,
    responseTime: "Immediate",
    consultationType: "Video Call"
  },
  // 18. Sadie (Swapped from 9)
  {
    id: 18,
    name: "Dr. Sadie Paws",
    specialization: "Behavioral Analysis",
    experience: "5 years",
    rating: 4.8,
    reviews: 1500, // Kept low for position 18
    location: "New York City, USA",
    distance: "22 km",
    availability: "Available Now",
    consultationFee: "$130",
    image: vetSadie,
    languages: ["English"],
    services: ["Trauma Care", "Upside Down Therapy"],
    education: "Hawkins Lab",
    hospital: "Stranger Paws Clinic",
    isOnline: true,
    responseTime: "10 mins",
    consultationType: "Online"
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
  "Mumbai, India",
  "Los Angeles, USA",
  "New York City, USA",
  "London, UK",
  "Miami, USA",
  "Nashville, USA",
  "Paris, France"
];

function FindVetsContent() {
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
          return b.rating - a.rating || b.reviews - a.reviews;
        case 'distance':
          return parseFloat(a.distance) - parseFloat(b.distance);
        case 'fee':
          return parseInt(a.consultationFee.replace('$', '').replace(',', '')) -
            parseInt(b.consultationFee.replace('$', '').replace(',', ''));
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

            {/* Early Access Banner */}
            <BetaDisclaimerBanner category={searchParams.get('type') === 'online' || selectedConsultationType.includes('Online') ? 'teleconsultation experts' : 'veterinarians'} />

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
                      <div className="relative h-[450px] overflow-hidden">
                        <Image
                          src={vet.image}
                          alt={vet.name}
                          fill
                          className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
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

      {/* Beta Disclaimer Popup */}
      <BetaDisclaimerPopup
        category={searchParams.get('type') === 'online' || selectedConsultationType.includes('Online') ? 'teleconsultation experts' : 'veterinarians'}
        actionVerb="treating"
      />
    </div>
  );
}

export default function FindVetsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading veterinarians...</p>
        </div>
      </div>
    }>
      <FindVetsContent />
    </Suspense>
  );
}
