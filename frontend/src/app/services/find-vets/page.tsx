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
import vetAndrew from '@/assets/vets/andrew.png';
import vetEmmaStone from '@/assets/vets/ema stone -.png';
import vetWeeknd from '@/assets/vets/weekend.png';
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
    availability: "Mon - Fri, 10:00 AM - 7:00 PM",
    consultationFee: "$300",
    image: vetRDJ,
    languages: ["English"],
    services: ["Robotic Surgery", "Nano-Tech Healing"],
    education: "Stark Vet Academy",
    hospital: "Avengers Tower Vet Wing",
    isOnline: true,
    responseTime: "Jarvis Speed",
    consultationType: "Video Call",
    bookingMessage: "Proof that Dr. Pawbert has a heart... for animals.\nJarvis says I'm fully booked.\nHit notify and he'll call you back.\nLove you 3000!"
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
    availability: "Mon - Fri, 10:00 AM - 7:00 PM",
    consultationFee: "£160",
    image: vetEmma,
    languages: ["English", "French"],
    services: ["General Medicine", "Potion Mixing"],
    education: "Hogwarts School of Vetery",
    hospital: "Griffindog House",
    isOnline: true,
    responseTime: "Owl Post Speed",
    consultationType: "Video Call",
    bookingMessage: "Expecto Patronum! \n My schedule is cursed - fully booked.\nSend your Patronus to the waitlist,\nI'll Apparate when available."
  },
  // 3. King Paw (SRK) (Mumbai)
  {
    id: 3,
    name: "Dr. King Beakhan",
    specialization: "General Practice",
    experience: "30 years",
    rating: 5.0,
    reviews: 9000,
    location: "Mumbai, India",
    distance: "2.3 km",
    availability: "Mon - Fri, 10:00 AM - 7:00 PM",
    consultationFee: "₹8,000",
    image: vetSRK,
    languages: ["English", "Hindi"],
    services: ["General Checkup", "Vaccination", "Romantic Stares"],
    education: "BVSc, MVSc (Charm)",
    hospital: "Mannat Pet Care",
    isOnline: true,
    responseTime: "Instant",
    consultationType: "Video Call",
    bookingMessage: "Palat... palat... palat!\nYou turned around but I'm still not available.\nHit notify and wait like Simran did."
  },
  // 4. Cristiano (Miami)
  {
    id: 4,
    name: "Dr. Goat Pawmnaldo",
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
    consultationType: "Video Call",
    bookingMessage: "SIUUUUU! \n I'm the GOAT but even GOATs need rest.\nFully booked - Hit notify and maybe I'll respond before I retire... again."
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
    availability: "Mon - Fri, 10:00 AM - 7:00 PM",
    consultationFee: "$160",
    image: vetAlex,
    languages: ["English"],
    services: ["Eye Care", "Hypnotic Gaze Therapy"],
    education: "Baywatch Vet School",
    hospital: "San Andreas Animal Center",
    isOnline: true,
    responseTime: "20 mins",
    consultationType: "Video Call",
    bookingMessage: "People say my eyes are mesmerizing.\nThey could cure anything... except my fully booked schedule.\nHit notify and try not to stare."
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
    consultationFee: "₹10,000",
    image: vetAB,
    languages: ["English", "Hindi"],
    services: ["Surgery", "Baritone Diagnosis"],
    education: "PhD in Veterinary Legends",
    hospital: "Jalsa Vet Clinic",
    isOnline: false,
    responseTime: "1 hour",
    consultationType: "In-Clinic",
    bookingMessage: "Parampara, Pratishtha, Anushasan! \nJaya says no appointments...\n Rekha might help - Hit notify.\nMaa ka bharosa... AAAAGGG!!"
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
    availability: "Mon - Fri, 10:00 AM - 7:00 PM",
    consultationFee: "$150",
    image: vetAna,
    languages: ["English", "Spanish"],
    services: ["Checkups", "Vaccination"],
    education: "Blade Runner Bio-Vets",
    hospital: "007 Vet Care",
    isOnline: true,
    responseTime: "10 mins",
    consultationType: "Online",
    bookingMessage: "Paloma here! Booked for three weeks... actually three months.\nNo time to die - Hit notify, 007 will call back."
  },
  // 8. Henry (NYC)
  {
    id: 8,
    name: "Dr. Henry Hoofill",
    specialization: "Super Strength Therapy",
    experience: "18 years",
    rating: 5.0,
    reviews: 6500,
    location: "New York, USA",
    distance: "20 km",
    availability: "Mon - Fri, 10:00 AM - 7:00 PM",
    consultationFee: "$220",
    image: vetHenry,
    languages: ["English"],
    services: ["Rehabilitation", "Steel Grooming"],
    education: "Krypton Vet Science",
    hospital: "Krypton Vet Care",
    isOnline: true,
    responseTime: "Faster than a speeding bullet",
    consultationType: "Video Call",
    bookingMessage: "Krypton exploded, so did my availability.\nZero slots available, Man of Steel fully booked.\nHit notify, I'll cape back to you."
  },
  // 9. Madison (Swapped from 18)
  {
    id: 9,
    name: "Dr. Meowdison Beer",
    specialization: "Melody Therapy",
    experience: "5 years",
    rating: 5.0,
    reviews: 6000, // Kept high for position 9
    location: "Los Angeles, USA",
    distance: "10 km",
    availability: "Mon - Fri, 10:00 AM - 7:00 PM",
    consultationFee: "$160",
    image: vetMadison,
    languages: ["English"],
    services: ["Voice Healing", "Calm Vibes"],
    education: "Beverly Hills Vet",
    hospital: "Life Support Clinic",
    isOnline: true,
    responseTime: "Soon",
    consultationType: "Online",
    bookingMessage: "Baby I'm a wreck... and so is my schedule!\nHit notify, I'll sing your pet a lullaby when I'm free."
  },
  // 10. Aishwarya (Mumbai)
  {
    id: 10,
    name: "Dr. Aishscalya Rai",
    specialization: "Dermatology",
    experience: "20 years",
    rating: 5.0,
    reviews: 5500,
    location: "Mumbai, India",
    distance: "3.5 km",
    availability: "Mon - Fri, 10:00 AM - 7:00 PM",
    consultationFee: "₹9,000",
    image: vetAish,
    languages: ["English", "Tulu", "Hindi"],
    services: ["Skin Care", "Grooming", "Miss World Class Treatment"],
    education: "MVSc (Dermatology)",
    hospital: "Blue Eye Clinic",
    isOnline: true,
    responseTime: "15 mins",
    consultationType: "Video Call",
    bookingMessage: "Booked till Cannes and beyond.\nNo slots right now - Tap Notify! \n The Comeback will be cinematic."
  },
  // 11. Salman (Mumbai)
  {
    id: 11,
    name: "Dr. Salmon Bhaww",
    specialization: "Orthopedics & Fitness",
    experience: "35 years",
    rating: 5.0,
    reviews: 5000,
    location: "Mumbai, India",
    distance: "6.0 km",
    availability: "Being Human Time",
    consultationFee: "₹7,500",
    image: vetSalman,
    languages: ["English", "Hindi"],
    services: ["Muscle Building", "Joint Surgery"],
    education: "MVSc (Surgery)",
    hospital: "Galaxy Pet Hospital",
    isOnline: false,
    responseTime: "45 mins",
    consultationType: "In-Clinic",
    bookingMessage: "Driving the car... might take a while.\nParking on the sidewalk takes skill.\nHit Notify! Being Human takes time.\n(P.S. Don't sleep on the pavement)."
  },
  // 12. Katrina (Mumbai)
  {
    id: 12,
    name: "Dr. Kat Beaks",
    specialization: "Nutrition & Diet",
    experience: "15 years",
    rating: 5.0,
    reviews: 4500,
    location: "Mumbai, India",
    distance: "4.0 km",
    availability: "Mon - Fri, 10:00 AM - 7:00 PM",
    consultationFee: "₹7,000",
    image: vetKat,
    languages: ["English", "Hindi"],
    services: ["Diet Planning", "Fitness Training"],
    education: "Certified Pet Nutritionist",
    hospital: "Slice of Life Care",
    isOnline: true,
    responseTime: "30 mins",
    consultationType: "Online",
    bookingMessage: "Sheila Here!\nJab Tak Hai Jaan.... I'll treat Animals!\n But my schedule went Bang Bang!\nTap Notify!"
  },
  // 13. Keanu (LA)
  {
    id: 13,
    name: "Dr. Pupper Reeves",
    specialization: "Action Recovery",
    experience: "25 years",
    rating: 5.0,
    reviews: 4000,
    location: "Los Angeles, USA",
    distance: "15 km",
    availability: "Mon - Fri, 10:00 AM - 7:00 PM",
    consultationFee: "$250",
    image: vetKeanu,
    languages: ["English"],
    services: ["Focus Training", "Pencil Surgery"],
    education: "Continential Vet School",
    hospital: "Wick Animal Haven",
    isOnline: true,
    responseTime: "Yeah.",
    consultationType: "Video Call",
    bookingMessage: "Someone touched his Dog.\nHe is currently 'resolving' the issue with a pencil.\nAppointment? Hit Notify if you dare. (Run.)"
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
    consultationFee: "£200",
    image: vetBale,
    languages: ["English"],
    services: ["Emergency Surgery", "Bat-Veterinary"],
    education: "Gotham Vet U",
    hospital: "Wayne Animal Care",
    isOnline: false,
    responseTime: "Dark Knight Rises",
    consultationType: "Emergency",
    bookingMessage: "Saving pets from Gotham's streets,\n It's not who I am underneath, \n but what I do that defines me.\nHit Notify - I'll connect when I'm free."
  },
  // 15. Millie (Nashville)
  {
    id: 15,
    name: "Dr. Millie Tabby Brown",
    specialization: "Puppy Telekinesis",
    experience: "7 years",
    rating: 4.9,
    reviews: 3000,
    location: "Nashville, USA",
    distance: "40 km",
    availability: "Mon - Fri, 10:00 AM - 7:00 PM",
    consultationFee: "$140",
    image: vetMillie,
    languages: ["English"],
    services: ["Psychic Diagnosis", "Waffles Nutrition"],
    education: "Eleven Vet School",
    hospital: "Hawkins Lab",
    isOnline: true,
    responseTime: "11 mins",
    consultationType: "Online",
    bookingMessage: "Vecna took my free time! Fully booked! \n Hit notify before my nose bleeds again."
  },
  // 16. Ariana (Paris)
  {
    id: 16,
    name: "Dr. Furiana Grande",
    specialization: "Vocal Therapy",
    experience: "10 years",
    rating: 4.9,
    reviews: 2500,
    location: "Paris, France",
    distance: "100 km",
    availability: "Mon - Fri, 10:00 AM - 7:00 PM",
    consultationFee: "€165",
    image: vetAriana,
    languages: ["English", "French"],
    services: ["Soothing Lullabies", "High Note Healing"],
    education: "Thank U, Next Vet U",
    hospital: "7 Rings Clinic",
    isOnline: true,
    responseTime: "Positions (Remote)",
    consultationType: "Video Call",
    bookingMessage: "I've got 7 rings, but 0 open slots.\nFully booked - Hit Notify, Thank U, Next."
  },
  // 17. Cillian (LA)
  {
    id: 17,
    name: "Dr. Cillian Meowphy",
    specialization: "Nuclear Radiology",
    experience: "20 years",
    rating: 4.9,
    reviews: 2000,
    location: "Los Angeles, USA",
    distance: "15 km",
    availability: "Mon - Fri, 10:00 AM - 7:00 PM",
    consultationFee: "$250",
    image: vetCillian,
    languages: ["English", "Irish"],
    services: ["X-Ray", "MRI", "Intense Staring"],
    education: "Shelby Vet Institute",
    hospital: "Peaky Paws Clinic",
    isOnline: true,
    responseTime: "Immediate",
    consultationType: "Video Call",
    bookingMessage: "I have become... unavailable. \nThe destroyer of your plans.\nHit Notify... by order of the Peaky Blinders."
  },
  // 18. Sadie (Swapped from 9)
  {
    id: 18,
    name: "Dr. Sadie Paws",
    specialization: "Behavioral Analysis",
    experience: "5 years",
    rating: 4.9,
    reviews: 1500,
    location: "New York, USA",
    distance: "22 km",
    availability: "Mon - Fri, 10:00 AM - 7:00 PM",
    consultationFee: "$130",
    image: vetSadie,
    languages: ["English"],
    services: ["Trauma Care", "Upside Down Therapy"],
    education: "Hawkins Lab",
    hospital: "Max's Arcade Care",
    isOnline: true,
    responseTime: "10 mins",
    consultationType: "Online",
    bookingMessage: "Currently stuck in the Upside Down.\nTap notify, keep your walkie-talkie on."
  },
  // 19. Andrew Garfield
  {
    id: 19,
    name: "Dr. Peter Barker",
    specialization: "Emergency Response",
    experience: "12 years",
    rating: 4.8,
    reviews: 1200,
    location: "New York, USA",
    distance: "2 km",
    availability: "Mon - Fri, 10:00 AM - 7:00 PM",
    consultationFee: "$250",
    image: vetAndrew,
    languages: ["English"],
    services: ["Webbed Feet Care", "High Altitude Rescue"],
    education: "Midtown Science High",
    hospital: "No Way Vet",
    isOnline: true,
    responseTime: "Tingle Speed",
    consultationType: "Video Call",
    bookingMessage: "I'm still trying to catch Gwen in every universe.\nHit notify, maybe I'll catch your request later."
  },
  // 20. Emma Stone
  {
    id: 20,
    name: "Dr. Gwen Stecat",
    specialization: "Chemistry & Diagnostics",
    experience: "10 years",
    rating: 4.8,
    reviews: 1000,
    location: "New York, USA",
    distance: "3 km",
    availability: "Mon - Fri, 10:00 AM - 7:00 PM",
    consultationFee: "$280",
    image: vetEmmaStone,
    languages: ["English"],
    services: ["Advanced Lab Tests", "Bio-Chemistry"],
    education: "Oscorp Intern Program",
    hospital: "Stacy Animal Hospital",
    isOnline: true,
    responseTime: "Smart",
    consultationType: "Video Call",
    bookingMessage: "I won an Oscar for Poor Things, \nbut I have Poor Availability.\nNo slots - Tap Notify."
  },
  // 21. The Weeknd
  {
    id: 21,
    name: "Dr. The Woofnd",
    specialization: "Nocturnal Care",
    experience: "After Hours",
    rating: 4.7,
    reviews: 800,
    location: "Toronto, Canada",
    distance: "100 km",
    availability: "Weekends Only",
    consultationFee: "C$540",
    image: vetWeeknd,
    languages: ["English", "Amharic"],
    services: ["Vocal Therapy", "Blinding Lights Exam"],
    education: "House of Balloons Academy",
    hospital: "XO Vet Clinic",
    isOnline: true,
    responseTime: "Late Night",
    consultationType: "Video Call",
    bookingMessage: "I said ooh, I'm blinded by the waitlist.\nNo slots available - Tap Notify."
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
  "In-Person",
  "Home Visit",
  "Teleconsultation"
];

const locations = [
  "All Locations",
  "Mumbai, India",
  "Los Angeles, USA",
  "New York, USA",
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
  const [selectedVet, setSelectedVet] = useState<typeof dummyVets[0] | null>(null);


  // Check for URL parameters on component mount
  useEffect(() => {
    const typeParam = searchParams.get('type');
    if (typeParam === 'online') {
      setSelectedConsultationType('Teleconsultation');
      setShowFilters(false); // Keep filters collapsed when coming from service link
    }
  }, [searchParams]);

  useEffect(() => {
    let filtered = dummyVets;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(vet =>
        vet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vet.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vet.hospital.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vet.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by specialization - use partial matching for flexibility
    if (selectedSpecialization !== 'All Specializations') {
      filtered = filtered.filter(vet => {
        const spec = vet.specialization.toLowerCase();
        const selected = selectedSpecialization.toLowerCase();

        // Handle common specialization mappings
        if (selected === 'general practice') {
          return spec.includes('general');
        } else if (selected === 'surgery') {
          return spec.includes('surgery') || spec.includes('surgical');
        } else if (selected === 'orthopedics') {
          return spec.includes('orthopedic') || spec.includes('fitness') || spec.includes('sports');
        } else if (selected === 'emergency medicine') {
          return spec.includes('emergency') || spec.includes('urgent');
        } else if (selected === 'dermatology') {
          return spec.includes('derma') || spec.includes('skin');
        } else if (selected === 'cardiology') {
          return spec.includes('cardio') || spec.includes('heart');
        } else if (selected === 'oncology') {
          return spec.includes('oncology') || spec.includes('cancer');
        } else if (selected === 'internal medicine') {
          return spec.includes('internal') || spec.includes('medicine');
        }

        // Fallback to partial match
        return spec.includes(selected);
      });
    }

    // Filter by location
    if (selectedLocation !== 'All Locations') {
      filtered = filtered.filter(vet => vet.location === selectedLocation);
    }

    // Filter by consultation type
    if (selectedConsultationType !== 'All Types') {
      if (selectedConsultationType === 'Teleconsultation') {
        filtered = filtered.filter(vet =>
          vet.consultationType === 'Online' ||
          vet.consultationType === 'Video Call' ||
          vet.consultationType === 'Online Consultation'
        );
      } else if (selectedConsultationType === 'In-Person') {
        filtered = filtered.filter(vet =>
          vet.consultationType === 'In-Clinic' ||
          vet.consultationType === 'Emergency'
        );
      } else if (selectedConsultationType === 'Home Visit') {
        filtered = filtered.filter(vet =>
          vet.consultationType === 'Home Visit'
        );
      } else {
        filtered = filtered.filter(vet => vet.consultationType === selectedConsultationType);
      }
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

        case 'distance':
          // Extract numeric value from distance string (e.g., "12 km" -> 12)
          const parseDistance = (dist: string): number => {
            const match = dist.match(/(\d+\.?\d*)/);
            return match ? parseFloat(match[1]) : Infinity;
          };
          return parseDistance(a.distance) - parseDistance(b.distance);

        case 'fee':
          // Extract numeric value from fee string (e.g., "$1,200" -> 1200)
          const parseFee = (fee: string): number => {
            const cleaned = fee.replace(/[^0-9.]/g, ''); // Remove all non-numeric except decimal
            return parseFloat(cleaned) || 0;
          };
          return parseFee(a.consultationFee) - parseFee(b.consultationFee);

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
                    <Card key={vet.id} className="group hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
                      <CardContent className="p-0">
                        {/* Vet Image */}
                        <div className="relative h-[450px] overflow-hidden">
                          <Image
                            src={vet.image}
                            alt={vet.name}
                            fill
                            className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        {/* Vet Details */}
                        {/* Vet Details - Compact & Readable */}
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-0.5">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight truncate pr-2">{vet.name}</h3>
                            <div className="flex items-center space-x-1 shrink-0 bg-yellow-50 dark:bg-yellow-900/30 px-1.5 py-0.5 rounded-md">
                              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-500" />
                              <span className="text-xs font-bold text-yellow-700 dark:text-yellow-400">{vet.rating}</span>
                            </div>
                          </div>

                          <p className="text-sm text-primary dark:text-primary font-medium mb-3">{vet.specialization}</p>

                          <div className="flex items-center gap-3 mb-3 text-xs text-gray-500 dark:text-gray-400 font-medium">
                            <div className="flex items-center shrink-0">
                              <MapPin className="w-3.5 h-3.5 mr-1" />
                              <span className="truncate max-w-[100px]">{vet.location}</span>
                            </div>
                            <div className="w-px h-3 bg-gray-300 dark:bg-gray-700"></div>
                            <div className="flex items-center shrink-0">
                              <Clock className="w-3.5 h-3.5 mr-1" />
                              <span className={vet.isOnline ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}>
                                {vet.availability}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
                            <div>
                              <p className="text-lg font-bold text-primary leading-none">{vet.consultationFee}</p>
                              <p className="text-[10px] text-gray-400 uppercase tracking-wide font-medium mt-0.5">Consultation</p>
                            </div>
                            <Button
                              className="bg-primary hover:bg-primary/90 text-white dark:text-gray-900 h-9 px-5 rounded-full text-xs font-semibold shadow-sm hover:shadow-md transition-all"
                              onClick={() => setSelectedVet(vet)}
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

        {/* Creative Booking Popup */}
        {selectedVet && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
            <div className="bg-card rounded-2xl p-0 max-w-md w-full mx-4 shadow-2xl overflow-hidden border border-border">
              {/* Header with Image */}
              <div className="relative h-32 bg-primary/10">
                <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                  <div className="relative w-32 h-32 rounded-full border-4 border-background overflow-hidden shadow-lg bg-card">
                    <Image
                      src={selectedVet.image}
                      alt={selectedVet.name}
                      fill
                      className="object-cover object-top"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-20 pb-8 px-6 text-center">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  {selectedVet.name}
                </h3>
                <p className="text-sm text-primary font-medium mb-6 uppercase tracking-wider">
                  {selectedVet.hospital}
                </p>

                <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-xl p-3 sm:p-6 mb-6 relative shadow-sm">
                  {/* Quote decorative icon could go here */}
                  <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base font-medium italic leading-6 sm:leading-7 whitespace-pre-line">
                    {selectedVet.bookingMessage || "Currently unavailable due to high demand in the multiverse."}
                  </p>
                </div>

                <div className="flex gap-3 grid grid-cols-2">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedVet(null)}
                    className="w-full border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
                  >
                    Close
                  </Button>
                  <Button
                    className="w-full bg-primary hover:bg-primary/90"
                    onClick={() => setSelectedVet(null)}
                  >
                    Notify Me
                  </Button>
                </div>
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
