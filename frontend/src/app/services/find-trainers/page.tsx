'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import CustomSelect from '@/components/ui/custom-select';
import {
  Search,
  ArrowUpDown,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BetaDisclaimerBanner from '@/components/BetaDisclaimerBanner';
import BetaDisclaimerPopup from '@/components/BetaDisclaimerPopup';

// Trainer Images
import trainerArnold from '@/assets/trainer/arnold.png';
import trainerBenedict from '@/assets/trainer/benedict.png';
import trainerBillie from '@/assets/trainer/billie.png';
import trainerChris from '@/assets/trainer/chirs hemsworth.png';
import trainerDwayne from '@/assets/trainer/dwayne.png';
import trainerKaren from '@/assets/trainer/karen jumanji.png';
import trainerKendall from '@/assets/trainer/kendal jenner.png';
import trainerKylie from '@/assets/trainer/kylie jenner.png';
import trainerLeo from '@/assets/trainer/leonardo.png';
import trainerMegan from '@/assets/trainer/megan fox.png';
import trainerDhoni from '@/assets/trainer/ms dhoni.png';
import trainerPreity from '@/assets/trainer/priti zinta.png';
import trainerScarlett from '@/assets/trainer/scarlett johnson.png';
import trainerSelena from '@/assets/trainer/selena gomez.png';
import trainerTaylor from '@/assets/trainer/taylor swift.png';
import trainerTom from '@/assets/trainer/tom cruise.png';
import trainerVin from '@/assets/trainer/vin.png';
import trainerJason from '@/assets/trainer/jason statham.png';

// Dummy trainer data with parody personas
const dummyTrainers = [
  // 1. Kendall (Fashion/Chic)
  {
    id: 14,
    name: "Kendall Jenfur",
    specialization: "Runway Walking",
    experience: "7 years",
    rating: 4.6,
    reviews: 15000,
    location: "New York, USA",
    distance: "2 km",
    availability: "Mon - Fri, 10:00 AM - 7:00 PM",
    sessionFee: "$900",
    image: trainerKendall,
    languages: ["English"],
    services: ["Catwalk Strut", "High Fashion Poise"],
    education: "Vogue Vet Academy",
    trainingCenter: "Runway Paws",
    isOnline: true,
    responseTime: "Runway Speed",
    petsTrained: 2000,
    consultationType: "Academy",
    bookingMessage: "I can't even cut a cucumber properly.\nBut I can make your pet do a ramp walk.\nNo slots available.\nTap Notify!"
  },
  // 2. The Rock (Tough/Friendly)
  {
    id: 2,
    name: "Rocky Houndson",
    specialization: "Guard Dog & Security",
    experience: "25 years",
    rating: 5.0,
    reviews: 14000,
    location: "Miami, USA",
    distance: "5 km",
    availability: "Mon - Fri, 10:00 AM - 7:00 PM",
    sessionFee: "$450",
    image: trainerDwayne,
    languages: ["English"],
    services: ["Tactical Training", "Intimidation 101"],
    education: "Iron Paradise Academy",
    trainingCenter: "The Rock K9 Unit",
    isOnline: true,
    responseTime: "Can you smell...",
    petsTrained: 4500,
    consultationType: "Home Visit",
    bookingMessage: "IT DOESN'T MATTER what your breed is!\nI can train any jabroni.\nBut my schedule is harder than my cheat day,\nTighter than my turtleneck fannypack photo.\n No slots available. Tap Notify!"
  },
  // 3. Megan Fox (Exotic/Edgy)
  {
    id: 15,
    name: "Megan Pawx",
    specialization: "Exotic Pet Training",
    experience: "10 years",
    rating: 4.8,
    reviews: 7000,
    location: "Los Angeles, USA",
    distance: "12 km",
    availability: "Mon - Fri, 10:00 AM - 7:00 PM",
    sessionFee: "$350",
    image: trainerMegan,
    languages: ["English"],
    services: ["Transformer Interaction", "Wild Side Taming"],
    education: "Jennifer's Body School",
    trainingCenter: "Autobot Base",
    isOnline: true,
    responseTime: "Fast",
    petsTrained: 1500,
    consultationType: "Online",
    bookingMessage: "Transformers are easier to handle than untrained pets. Luckily, I handle both.\nUnfortunately, my schedule self-destructed.\nTap Notify!"
  },
  // 4. Scarlett (Action/Stealth)
  {
    id: 11,
    name: "Scarlett Jopaws",
    specialization: "Stealth & Discipline",
    experience: "12 years",
    rating: 5.0,
    reviews: 9500,
    location: "New York, USA",
    distance: "5 km",
    availability: "Mon - Fri, 10:00 AM - 7:00 PM",
    sessionFee: "$400",
    image: trainerScarlett,
    languages: ["English", "Russian"],
    services: ["Ninja Moves", "Silent Walking"],
    education: "Red Room Academy",
    trainingCenter: "Avengers K9 Facility",
    isOnline: true,
    responseTime: "Stealthy",
    petsTrained: 3000,
    consultationType: "Academy",
    bookingMessage: "Trying to wipe the red from my ledger.\nAnd clear my schedule, Failing at both.\nHit Notify, Agent."
  },
  // 5. Benedict (Mystic/Calm)
  {
    id: 7,
    name: "Benedict Cumberbark",
    specialization: "Telepathic Commands",
    experience: "Time Loop Certified",
    rating: 4.9,
    reviews: 9000,
    location: "New York, USA",
    distance: "2 km",
    availability: "Mon - Fri, 10:00 AM - 7:00 PM",
    sessionFee: "$450",
    image: trainerBenedict,
    languages: ["English", "Mystic Arts"],
    services: ["Mental Connections", "Portal Jumping"],
    education: "Kamar-Taj",
    trainingCenter: "Sanctum Sanctorum",
    isOnline: true,
    responseTime: "Instant",
    petsTrained: 14000605,
    consultationType: "Online",
    bookingMessage: "I observe. I deduce. I train.\nI'll make your dog smarter than Watson.\nBut the timeline says 'No'. Tap Notify!"
  },
  // 6. Taylor Swift (Icon/Pop)
  {
    id: 9,
    name: "Tay Purr Swift",
    specialization: "Vocal Training & Cats",
    experience: "15 years",
    rating: 5.0,
    reviews: 50000,
    location: "Nashville, USA",
    distance: "100 km",
    availability: "Mon - Fri, 10:00 AM - 7:00 PM",
    sessionFee: "$1989",
    image: trainerTaylor,
    languages: ["English"],
    services: ["Singing Lessons", "Cat Whisperer"],
    education: "Cat Lady University",
    trainingCenter: "The Eras Tour (Pet Edition)",
    isOnline: true,
    responseTime: "Swift",
    petsTrained: 13000,
    consultationType: "Online",
    bookingMessage: "My schedule is more complicated than \n getting Eras Tour tickets.\nYou are in the queue (position: 23,405).\nGood luck. Tap Notify!"
  },
  // 7. Billie Eilish (Cool/Alternative)
  {
    id: 10,
    name: "Billie Eye-leash",
    specialization: "Rehabilitation (Bad Guys)",
    experience: "5 years",
    rating: 4.8,
    reviews: 8000,
    location: "Los Angeles, USA",
    distance: "12 km",
    availability: "Mon - Fri, 10:00 AM - 7:00 PM",
    sessionFee: "$250",
    image: trainerBillie,
    languages: ["English"],
    services: ["Calming Anxiety", "Whisper Training"],
    education: "Ocean Eyes Academy",
    trainingCenter: "Happier Than Ever Camp",
    isOnline: true,
    responseTime: "Duh",
    petsTrained: 2000,
    consultationType: "Online",
    bookingMessage: "I'm the baaad guy at declining appointments.\nDuh.\nSchedule is full. Tap Notify! \n Don't smile at me."
  },
  // 8. Tom Cruise (Action/Stunts)
  {
    id: 4,
    name: "Tom Canines",
    specialization: "Agility & Stunts",
    experience: "35 years",
    rating: 5.0,
    reviews: 11000,
    location: "Los Angeles, USA",
    distance: "15 km",
    availability: "Mon - Fri, 10:00 AM - 7:00 PM",
    sessionFee: "$600",
    image: trainerTom,
    languages: ["English"],
    services: ["Impossible Jumps", "Skydiving (Safely)"],
    education: "Top Gun K9 School",
    trainingCenter: "IMF (Impossible Mutt Force)",
    isOnline: true,
    responseTime: "Running fast",
    petsTrained: 2500,
    consultationType: "Academy",
    bookingMessage: "I'm hanging off the side of a plane right now.\nCan't check the calendar.\nActually, I checked. It's full. Hit Notify!"
  },
  // 9. Karen Gillan
  {
    id: 16,
    name: "Karen Paw-lan",
    specialization: "Dance Fighting & Agility",
    experience: "10 years",
    rating: 4.9,
    reviews: 8500,
    location: "Jungle, Jumanji",
    distance: "Unknown",
    availability: "Mon - Fri, 10:00 AM - 7:00 PM",
    sessionFee: "$350",
    image: trainerKaren,
    languages: ["English"],
    services: ["Dance Fighting", "High Kicks"],
    education: "Jumanji Avatar School",
    trainingCenter: "Ruby Roundhouse Dojos",
    isOnline: true,
    responseTime: "Critical Hit",
    petsTrained: 2800,
    consultationType: "Academy",
    bookingMessage: "I'm stuck in the Jumanji jungle.\nI have a weakness: Venom... and full schedules.\nWait for the drums to stop. Tap Notify!"
  },
  // 10. Leo (Classy)
  {
    id: 6,
    name: "Leo DiCatrio",
    specialization: "Show Dog Training",
    experience: "25 years",
    rating: 5.0,
    reviews: 13000,
    location: "Hollywood Hills, USA",
    distance: "10 km",
    availability: "Mon - Fri, 10:00 AM - 7:00 PM",
    sessionFee: "$550",
    image: trainerLeo,
    languages: ["English"],
    services: ["Red Carpet Walking", "Oscar Worthy Tricks"],
    education: "Wolf of Wall Street Vets",
    trainingCenter: "Titanic Pet Spa",
    isOnline: true,
    responseTime: "Eventually (got an Oscar)",
    petsTrained: 3500,
    consultationType: "Online",
    bookingMessage: "Sell me this pen. No? Can't do it?\nThen you can't book this f**king slot.\nSupply and Demand, my friend. Tap Notify."
  },
  // 11. Selena (Charm)
  {
    id: 12,
    name: "Selena Gomutts",
    specialization: "Calmness Therapy",
    experience: "10 years",
    rating: 4.9,
    reviews: 11000,
    location: "Los Angeles, USA",
    distance: "10 km",
    availability: "Mon - Fri, 10:00 AM - 7:00 PM",
    sessionFee: "$300",
    image: trainerSelena,
    languages: ["English", "Spanish"],
    services: ["Mental Health for Pets", "Rare Beauty Grooming"],
    education: "Wizards of Waverly Place",
    trainingCenter: "Murders in the Building (Only solving)",
    isOnline: true,
    responseTime: "Same Old Love",
    petsTrained: 4000,
    consultationType: "Online",
    bookingMessage: "Baby, calm down, calm down.\nI see you looking for a slot.\nBut it's a lo-lo-lo-long wait.\nSo no-no-no availability. Tap Notify!"
  },
  // 12. Chris (Muscle/Action)
  {
    id: 3,
    name: "Chris Hemswoof",
    specialization: "Heavy Lifting & Bravery",
    experience: "1500 years",
    rating: 5.0,
    reviews: 12000,
    location: "New Asgard (Norway)",
    distance: "50 km",
    availability: "Mon - Fri, 10:00 AM - 7:00 PM",
    sessionFee: "$400",
    image: trainerChris,
    languages: ["English", "Norse", "Groot"],
    services: ["Hammer Fetch", "Thunder Resistance"],
    education: "Asgardian Beast Master",
    trainingCenter: "Valhalla Pet Resort",
    isOnline: true,
    responseTime: "Lightning Fast",
    petsTrained: 3000,
    consultationType: "Academy",
    bookingMessage: "Tyler Rake requesting extraction.\nMy schedule is under heavy fire.\nMission aborted (no slots).Hit Notify!"
  },
  // 13. Kylie (Glam/Social)
  {
    id: 13,
    name: "Kylie Kennel",
    specialization: "Grooming & Social Media",
    experience: "8 years",
    rating: 4.7,
    reviews: 20000,
    location: "Calabasas, USA",
    distance: "20 km",
    availability: "Mon - Fri, 10:00 AM - 7:00 PM",
    sessionFee: "$800",
    image: trainerKylie,
    languages: ["English"],
    services: ["Posing for Instagram", "Lip Kit (Licking) Control"],
    education: "Kardashian K9 School",
    trainingCenter: "Kylie Skin & Fur",
    isOnline: true,
    responseTime: "Viral",
    petsTrained: 5000,
    consultationType: "Teleconsultation",
    bookingMessage: "Riiise and shiiine!\nI feel like this year is really about realizing stuff.\nLike realizing my calendar is packed.\nIt's crazy. Tap Notify."
  },
  // 14. Arnold (Legend)
  {
    id: 1,
    name: "Arnold Pawzenegger",
    specialization: "Strength & Muscle Building",
    experience: "30 years",
    rating: 5.0,
    reviews: 15000,
    location: "Los Angeles, USA",
    distance: "12 km",
    availability: "Mon - Fri, 10:00 AM - 7:00 PM",
    sessionFee: "$500",
    image: trainerArnold,
    languages: ["English", "German"],
    services: ["Bodybuilding for Dogs", "Heavy Lifting"],
    education: "Mr. Olympia K9",
    trainingCenter: "Gold's Gym for Pups",
    isOnline: true,
    responseTime: "Get to the chopper speed",
    petsTrained: 5000,
    consultationType: "Academy",
    bookingMessage: "Hasta la vista, baby...\nTo your appointment request.\nI'll be back... when I have a slot.\nTap Notify!"
  },
  // 15. Preity (Sweet/Local)
  {
    id: 17,
    name: "Purr-eity Zinta",
    specialization: "Positive Reinforcement",
    experience: "20 years",
    rating: 5.0,
    reviews: 10000,
    location: "Mumbai, India",
    distance: "5 km",
    availability: "Mon - Fri, 10:00 AM - 7:00 PM",
    sessionFee: "₹15,000",
    image: trainerPreity,
    languages: ["English", "Hindi"],
    services: ["Cheerleading for Pups", "Smile Therapy"],
    education: "Kal Ho Naa Ho Academy",
    trainingCenter: "Kings XI Pung-jab",
    isOnline: true,
    responseTime: "Bubbly",
    petsTrained: 6000,
    consultationType: "In-Person",
    bookingMessage: "I waited 22 years in Veer-Zaara.\nYou might have to wait 22 mins or days for slot.\nMy love is eternal, but my time is limited.\nTap Notify!"
  },
  // 16. Jason (Tough/Discipline)
  {
    id: 18,
    name: "Jason Staythem",
    specialization: "Obedience & Discipline",
    experience: "22 years",
    rating: 5.0,
    reviews: 11500,
    location: "London, UK",
    distance: "10 km",
    availability: "Mon - Fri, 10:00 AM - 7:00 PM",
    sessionFee: "£380",
    image: trainerJason,
    languages: ["English"],
    services: ["The 'Stay' Command", "Intense Staring"],
    education: "Transporter K9 School",
    trainingCenter: "The Mechanic's Garage",
    isOnline: true,
    responseTime: "Immediate",
    petsTrained: 3200,
    consultationType: "Academy",
    bookingMessage: "I punched a Megalodon in the face.\nBut I can't punch an opening into this schedule.\nIt's tougher than the shark. Tap Notify!"
  },
  // 17. MS Dhoni (Sport/Leader)
  {
    id: 8,
    name: "Captain Cool Canine",
    specialization: "Focus & Catching",
    experience: "15 years",
    rating: 5.0,
    reviews: 20000,
    location: "Ranchi, India",
    distance: "0 km (Helicopter)",
    availability: "Mon - Fri, 10:00 AM - 7:00 PM",
    sessionFee: "₹25,000",
    image: trainerDhoni,
    languages: ["English", "Hindi"],
    services: ["Wicket Keeping (Fetch)", "Finishing Moves"],
    education: "Captain Cool Academy",
    trainingCenter: "Chennai Super Paws",
    isOnline: true,
    responseTime: "0.08 seconds (stumping)",
    petsTrained: 7000,
    consultationType: "Academy",
    bookingMessage: "Behind the stumps, I miss nothing.\nI'll ensure your pet misses no commands either.\nBut currently, the schedule is spinning too much.\nTap Notify!"
  },
  // 18. Vin Diesel (Family/Race)
  {
    id: 5,
    name: "Vin Danesel",
    specialization: "Speed & Pulling",
    experience: "20 years",
    rating: 5.0,
    reviews: 10500,
    location: "Los Angeles, USA",
    distance: "8 km",
    availability: "Mon - Fri, 10:00 AM - 7:00 PM",
    sessionFee: "$350",
    image: trainerVin,
    languages: ["English", "Groot"],
    services: ["Drag Racing", "Family Bonding"],
    education: "Fast & Furry Academy",
    trainingCenter: "Toretto's Garage",
    isOnline: true,
    responseTime: "Family First",
    petsTrained: 4000,
    consultationType: "Home Visit",
    bookingMessage: "I live my life a quarter mile at a time.\nAnd I train dogs the same way... \n Fast and Furious.\nBut right now, my schedule is stalled.\nTap Notify!"
  }
];

const specializations = [
  "All Specializations",
  "Strength & Muscle Building",
  "Agility & Stunts",
  "Guard Dog & Security",
  "Obedience Training",
  "Behavioral Training",
  "Puppy Training",
  "Show Dog Training"
];

const consultationTypes = [
  "All Types",
  "In-Person",
  "Home Visit",
  "Teleconsultation"
];

const locations = [
  "All Locations",
  "Los Angeles, USA",
  "New York, USA",
  "Miami, USA",
  "Mumbai, India",
  "New Asgard (Norway)",
  "Hollywood Hills, USA"
];

export default function FindTrainersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All Specializations');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedConsultationType, setSelectedConsultationType] = useState('All Types');
  const [showFilters, setShowFilters] = useState(false);
  const [filteredTrainers, setFilteredTrainers] = useState(dummyTrainers);
  const [sortBy, setSortBy] = useState('featured');
  // State for creative booking popup
  const [selectedTrainer, setSelectedTrainer] = useState<typeof dummyTrainers[0] | null>(null);

  useEffect(() => {
    let filtered = [...dummyTrainers];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(trainer =>
        trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trainer.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trainer.trainingCenter.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trainer.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by specialization - use partial matching for flexibility
    if (selectedSpecialization !== 'All Specializations') {
      filtered = filtered.filter(trainer => {
        const spec = trainer.specialization.toLowerCase();
        const selected = selectedSpecialization.toLowerCase();

        // Handle common specialization mappings
        if (selected.includes('strength') || selected.includes('muscle')) {
          return spec.includes('strength') || spec.includes('muscle') || spec.includes('lifting');
        } else if (selected.includes('agility') || selected.includes('stunt')) {
          return spec.includes('agility') || spec.includes('stunt') || spec.includes('jump');
        } else if (selected.includes('guard') || selected.includes('security')) {
          return spec.includes('guard') || spec.includes('security') || spec.includes('tactical');
        } else if (selected.includes('obedience')) {
          return spec.includes('obedience') || spec.includes('discipline') || spec.includes('stay');
        } else if (selected.includes('behavioral')) {
          return spec.includes('behavior') || spec.includes('rehabilitation') || spec.includes('therapy');
        } else if (selected.includes('puppy')) {
          return spec.includes('puppy') || spec.includes('basic');
        } else if (selected.includes('show')) {
          return spec.includes('show') || spec.includes('runway') || spec.includes('poise');
        }

        // Fallback to partial match
        return spec.includes(selected);
      });
    }

    // Filter by location
    if (selectedLocation !== 'All Locations') {
      filtered = filtered.filter(trainer => trainer.location === selectedLocation);
    }

    // Filter by consultation type
    if (selectedConsultationType !== 'All Types') {
      if (selectedConsultationType === 'Teleconsultation') {
        filtered = filtered.filter(trainer => trainer.consultationType === 'Online' || trainer.consultationType === 'Teleconsultation');
      } else if (selectedConsultationType === 'In-Person') {
        filtered = filtered.filter(trainer => trainer.consultationType === 'Academy' || trainer.consultationType === 'In-Person');
      } else {
        filtered = filtered.filter(trainer => trainer.consultationType === selectedConsultationType);
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
          // Normalize to USD for comparison
          const getNormalizedFee = (feeStr: string): number => {
            const value = parseFloat(feeStr.replace(/[^0-9.]/g, '')) || 0;

            if (feeStr.includes('₹')) return value * 0.012; // INR to USD
            if (feeStr.includes('£')) return value * 1.27;  // GBP to USD
            if (feeStr.includes('€')) return value * 1.08;  // EUR to USD
            if (feeStr.includes('C$')) return value * 0.74; // CAD to USD

            return value; // Default to USD
          };
          return getNormalizedFee(a.sessionFee) - getNormalizedFee(b.sessionFee);

        case 'featured':
          // Maintain original curated order
          return dummyTrainers.indexOf(a) - dummyTrainers.indexOf(b);

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
    setSortBy('featured');
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
        <section className="pt-24 md:pt-32 pb-2">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-6xl mx-auto">
              {/* Early Access Banner */}
              <BetaDisclaimerBanner category="trainers" />

              {/* Search, Filter, and Sort Bar */}
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                {/* Filter Toggle (Left) */}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`shrink-0 ${showFilters ? 'bg-secondary' : ''}`}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>

                {/* Search Bar (Middle) */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search trainers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-10 text-sm border border-input bg-background rounded-md focus:ring-0 focus:ring-offset-0 focus:border-input w-full"
                  />
                </div>

                {/* Sort Toggle (Right) */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="shrink-0">
                      <ArrowUpDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => setSortBy('featured')}>
                      Sort by Featured
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy('rating')}>
                      Sort by Rating
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy('fee')}>
                      Sort by Fee
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
                    <Card key={trainer.id} className="group hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
                      <CardContent className="p-0">
                        {/* Trainer Image */}
                        <div className="relative h-[450px] overflow-hidden">
                          <Image
                            src={trainer.image}
                            alt={trainer.name}
                            fill
                            className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        {/* Trainer Details - Compact & Readable */}
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-0.5">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight truncate pr-2">{trainer.name}</h3>
                            <div className="flex items-center space-x-1 shrink-0 bg-yellow-50 dark:bg-yellow-900/30 px-1.5 py-0.5 rounded-md">
                              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-500" />
                              <span className="text-xs font-bold text-yellow-700 dark:text-yellow-400">{trainer.rating}</span>
                            </div>
                          </div>

                          <p className="text-sm text-primary dark:text-primary font-medium mb-3">{trainer.specialization}</p>

                          <div className="flex items-center gap-3 mb-3 text-xs text-gray-500 dark:text-gray-400 font-medium">
                            <div className="flex items-center shrink-0">
                              <MapPin className="w-3.5 h-3.5 mr-1" />
                              <span className="truncate max-w-[100px]">{trainer.location}</span>
                            </div>
                            <div className="w-px h-3 bg-gray-300 dark:bg-gray-700"></div>
                            <div className="flex items-center shrink-0">
                              <Clock className="w-3.5 h-3.5 mr-1" />
                              <span className={trainer.isOnline ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}>
                                {trainer.availability}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
                            <div>
                              <p className="text-lg font-bold text-primary leading-none">{trainer.sessionFee}</p>
                              <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mt-0.5">Per Session</p>
                            </div>
                            <Button
                              className="bg-primary hover:bg-primary/90 text-white dark:text-gray-900 h-9 px-5 rounded-full text-xs font-semibold shadow-sm hover:shadow-md transition-all"
                              onClick={() => setSelectedTrainer(trainer)}
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
        {selectedTrainer && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
            <div className="bg-card rounded-2xl p-0 max-w-md w-full mx-4 shadow-2xl overflow-hidden border border-border">
              {/* Header with Image */}
              <div className="relative h-32 bg-primary/10">
                <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                  <div className="relative w-32 h-32 rounded-full border-4 border-background overflow-hidden shadow-lg bg-card">
                    <Image
                      src={selectedTrainer.image}
                      alt={selectedTrainer.name}
                      fill
                      className="object-cover object-top"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-20 pb-8 px-6 text-center">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  {selectedTrainer.name}
                </h3>
                <p className="text-sm text-primary font-medium mb-6 uppercase tracking-wider">
                  {selectedTrainer.trainingCenter}
                </p>

                <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-xl p-3 sm:p-6 mb-6 relative shadow-sm">
                  {/* Quote decorative icon could go here */}
                  <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base font-medium italic leading-6 sm:leading-7 whitespace-pre-line">
                    {selectedTrainer.bookingMessage || "Currently unavailable due to high demand."}
                  </p>
                </div>

                <div className="flex gap-3 grid grid-cols-2">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedTrainer(null)}
                    className="w-full border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                  >
                    Close
                  </Button>
                  <Button
                    className="w-full bg-primary hover:bg-primary/90"
                    onClick={() => setSelectedTrainer(null)}
                  >
                    Notify Me
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        <BetaDisclaimerPopup category="trainers" actionVerb="training" />
      </div>
    </div>
  );
}
