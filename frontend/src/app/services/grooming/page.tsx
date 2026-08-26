'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import CustomSelect from '@/components/ui/custom-select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Search,
  ArrowUpDown,
  MapPin,
  Star,
  Clock,
  SlidersHorizontal,
  Scissors,
  X,
  Sparkles,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BetaDisclaimerBanner from '@/components/BetaDisclaimerBanner';
import BetaDisclaimerPopup from '@/components/BetaDisclaimerPopup';

// ─────────────────────────────────────────────────────────────────────────────
// SALON DATA — grooming salons (no persons)
// ─────────────────────────────────────────────────────────────────────────────
const dummyGroomers = [
  {
    id: 1,
    name: "Pawsoon Luxury Salon",
    tagline: "Where every coat tells a story",
    specialization: "Luxury Cut & Style",
    established: "2001",
    rating: 5.0,
    reviews: 18000,
    location: "London, UK",
    distance: "3 km",
    availability: "Mon – Sat, 10:00 AM – 7:00 PM",
    sessionFee: "£280",
    services: ["Signature Cuts", "Hot Oil Treatment", "Breed Styling"],
    petTypes: ["Dogs", "Cats"],
    groomedCount: 12000,
    consultationType: "In-Salon",
    bookingMessage: "If your pet doesn't look good, Pawsoon doesn't look good.\nWe're fully booked right now.\nTap Notify and we'll reserve your slot the moment one opens."
  },
  {
    id: 2,
    name: "Fur Glam Studio",
    tagline: "Glam coats. Fierce nails. Zero compromise.",
    specialization: "Glam Coat & Nails",
    established: "2017",
    rating: 4.9,
    reviews: 25000,
    location: "Calabasas, USA",
    distance: "5 km",
    availability: "Mon – Fri, 11:00 AM – 6:00 PM",
    sessionFee: "$320",
    services: ["Nail Art", "Coat Gloss Treatment", "Paw Waxing"],
    petTypes: ["Dogs", "Cats", "Rabbits"],
    groomedCount: 8000,
    consultationType: "In-Salon",
    bookingMessage: "Riiise and shiiine!\nOur calendar is as full as a celebrity's inbox.\nNo slots right now — Tap Notify and we'll ping you first."
  },
  {
    id: 3,
    name: "Tha Dogg Pound Salon",
    tagline: "Laid-back vibes. Impeccable coats.",
    specialization: "Complete Grooming",
    established: "2005",
    rating: 5.0,
    reviews: 21000,
    location: "Los Angeles, USA",
    distance: "8 km",
    availability: "Mon – Sat, 9:00 AM – 6:00 PM",
    sessionFee: "$275",
    services: ["Full Bath & Blow-Dry", "Bandana Styling", "Deshedding"],
    petTypes: ["Dogs"],
    groomedCount: 9500,
    consultationType: "Home Visit",
    bookingMessage: "We're droppin' it like it's hot — but not our scissors.\nFully booked on this side of the hood.\nTap Notify and we'll roll back to you."
  },
  {
    id: 4,
    name: "Little Monster Grooming",
    tagline: "Born this way. Styled our way.",
    specialization: "Styling & Haircuts",
    established: "2012",
    rating: 5.0,
    reviews: 19000,
    location: "New York, USA",
    distance: "2 km",
    availability: "Mon – Fri, 10:00 AM – 8:00 PM",
    sessionFee: "$400",
    services: ["Theatrical Cuts", "Pet-Safe Color Dyeing", "Feather Extensions"],
    petTypes: ["Dogs", "Cats", "Birds"],
    groomedCount: 7500,
    consultationType: "In-Salon",
    bookingMessage: "We were born this way — and fully booked that way too.\nNo slots available. Bad romance with our calendar.\nTap Notify, little monster — we'll call back."
  },
  {
    id: 5,
    name: "Euphoria Pet Spa",
    tagline: "Always the vibe. Never the vacancy.",
    specialization: "Spa & Wellness",
    established: "2019",
    rating: 5.0,
    reviews: 16000,
    location: "Los Angeles, USA",
    distance: "6 km",
    availability: "Mon – Sat, 9:00 AM – 5:00 PM",
    sessionFee: "$290",
    services: ["Textured Coat Care", "Deep Conditioning", "Aromatherapy Soak"],
    petTypes: ["Dogs", "Cats"],
    groomedCount: 5500,
    consultationType: "In-Salon",
    bookingMessage: "Euphoria is always the vibe — but never vacant.\nFully booked. Tap Notify and we'll call you back."
  },
  {
    id: 6,
    name: "Golden Paw Salon",
    tagline: "Precision that bends the rules.",
    specialization: "Precision Trim & Fade",
    established: "2003",
    rating: 5.0,
    reviews: 22000,
    location: "London, UK",
    distance: "4 km",
    availability: "Mon – Fri, 10:00 AM – 6:00 PM",
    sessionFee: "£320",
    services: ["Precision Fade", "Beard Trim", "Paw Manicure"],
    petTypes: ["Dogs"],
    groomedCount: 11000,
    consultationType: "In-Salon",
    bookingMessage: "We bend scissors like free kicks.\nCan't bend the schedule open right now.\nFully booked — Tap Notify and we'll score a slot for you."
  },
  {
    id: 7,
    name: "Black Widow Grooming",
    tagline: "Sleek. Silent. Perfectly styled.",
    specialization: "Spa & Wellness",
    established: "2014",
    rating: 4.9,
    reviews: 13000,
    location: "New York, USA",
    distance: "3 km",
    availability: "Mon – Fri, 10:00 AM – 7:00 PM",
    sessionFee: "$260",
    services: ["Sleek Coat Polish", "Nail Buffing", "Hot Towel Wrap"],
    petTypes: ["Dogs", "Cats"],
    groomedCount: 6500,
    consultationType: "In-Salon",
    bookingMessage: "Sleek. Silent. Perfectly styled.\nWe're trying to clear our schedule — failing at both.\nHit Notify and we'll reach out."
  },
  {
    id: 8,
    name: "Valhalla Fur & Blade",
    tagline: "Worthy coats. Legendary care.",
    specialization: "Breed-Specific Grooming",
    established: "2008",
    rating: 5.0,
    reviews: 17000,
    location: "Oslo, Norway",
    distance: "12 km",
    availability: "Mon – Fri, 10:00 AM – 7:00 PM",
    sessionFee: "kr 3,200",
    services: ["Nordic Coat Stripping", "Thunder Blow-Dry", "Double Coat De-mat"],
    petTypes: ["Dogs", "Large Breeds"],
    groomedCount: 8800,
    consultationType: "In-Salon",
    bookingMessage: "Mjölnir couldn't hammer an opening in our schedule.\nFully booked — worthy pets only.\nTap Notify, mortal. We'll reserve your spot."
  },
  {
    id: 9,
    name: "Kings XI Fur Studio",
    tagline: "Royal care for every breed.",
    specialization: "Spa & Wellness",
    established: "2010",
    rating: 5.0,
    reviews: 11000,
    location: "Mumbai, India",
    distance: "4 km",
    availability: "Mon – Sat, 10:00 AM – 7:00 PM",
    sessionFee: "₹3,500",
    services: ["Traditional Coat Care", "Flea & Tick Treatment", "Aromatherapy Bath"],
    petTypes: ["Dogs", "Cats"],
    groomedCount: 9200,
    consultationType: "In-Salon",
    bookingMessage: "We waited to build something great. You'll wait just a little.\nNo slots right now — love for your pet is eternal, but time is limited.\nTap Notify!"
  },
  {
    id: 10,
    name: "Happier Than Ever Grooming",
    tagline: "Calm energy. Cool cuts. Duh.",
    specialization: "Styling & Haircuts",
    established: "2020",
    rating: 4.8,
    reviews: 14000,
    location: "Los Angeles, USA",
    distance: "7 km",
    availability: "Mon – Fri, 12:00 PM – 8:00 PM",
    sessionFee: "$220",
    services: ["Two-Tone Pet-Safe Dyeing", "Calming Whisper Bath", "Anxiety-Free Groom"],
    petTypes: ["Dogs", "Cats", "Rabbits"],
    groomedCount: 4500,
    consultationType: "In-Salon",
    bookingMessage: "We're the bad salon at having free slots. Duh.\nSchedule is full. Don't smile at us. Tap Notify!"
  },
  {
    id: 11,
    name: "The Eras Grooming Tour",
    tagline: "Every era. Every breed. Every style.",
    specialization: "Complete Grooming",
    established: "2015",
    rating: 5.0,
    reviews: 55000,
    location: "Nashville, USA",
    distance: "100 km",
    availability: "By Appointment Only",
    sessionFee: "$250",
    services: ["Full Glam Package", "Coat Shine Treatment", "Folklore Bath", "Reputation Trim"],
    petTypes: ["Cats", "Dogs"],
    groomedCount: 13000,
    consultationType: "In-Salon",
    bookingMessage: "Our schedule is harder to get into than concert tickets.\nYou are in queue position: 89,452.\nGood luck, bestie. Tap Notify!"
  },
  {
    id: 12,
    name: "Chennai Super Paws Spa",
    tagline: "Captain-level care for champion pets.",
    specialization: "Breed-Specific Grooming",
    established: "2009",
    rating: 5.0,
    reviews: 22000,
    location: "Chennai, India",
    distance: "6 km",
    availability: "Mon – Fri, 10:00 AM – 7:00 PM",
    sessionFee: "₹5,000",
    services: ["Pre-Show Grooming", "Champion Coat Conditioning", "Paw Spa"],
    petTypes: ["Dogs", "Large Breeds"],
    groomedCount: 7800,
    consultationType: "Home Visit",
    bookingMessage: "Behind the stumps we miss nothing.\nBut we missed marking this slot available.\nCurrently spinning. Tap Notify!"
  },
  {
    id: 13,
    name: "Titanic Pet Glam Studio",
    tagline: "Red carpet ready. Every single time.",
    specialization: "Styling & Haircuts",
    established: "2006",
    rating: 5.0,
    reviews: 17500,
    location: "Los Angeles, USA",
    distance: "10 km",
    availability: "Mon – Fri, 10:00 AM – 6:00 PM",
    sessionFee: "$480",
    services: ["Red Carpet Coat Prep", "Paparazzi-Ready Trim", "Oscar Blow-Dry"],
    petTypes: ["Dogs", "Cats"],
    groomedCount: 6200,
    consultationType: "In-Salon",
    bookingMessage: "We'd sell you a slot, but supply and demand.\nNo openings right now.\nTap Notify and we'll call when the iceberg clears."
  },
  {
    id: 14,
    name: "Iron Paradise Pet Spa",
    tagline: "Strongest grooms. Softest coats.",
    specialization: "Complete Grooming",
    established: "2004",
    rating: 5.0,
    reviews: 23000,
    location: "Miami, USA",
    distance: "5 km",
    availability: "Mon – Fri, 5:00 AM – 8:00 PM",
    sessionFee: "$500",
    services: ["Deep Coat Scrub", "Hydration Pack", "Paw Strength Massage", "Deshedding"],
    petTypes: ["Dogs", "Large Breeds"],
    groomedCount: 14000,
    consultationType: "In-Salon",
    bookingMessage: "IT DOESN'T MATTER what your breed is!\nWe'll groom any fur coat.\nBut our schedule is harder than iron. Tap Notify!"
  },
  {
    id: 15,
    name: "7 Rings Pet Glam",
    tagline: "Thank U, Next level grooming.",
    specialization: "Spa & Wellness",
    established: "2016",
    rating: 4.9,
    reviews: 16000,
    location: "Paris, France",
    distance: "Varies",
    availability: "Mon – Fri, 10:00 AM – 7:00 PM",
    sessionFee: "€240",
    services: ["Signature Spa Treatment", "High-Finish Coat Gloss", "Pawdicure"],
    petTypes: ["Cats", "Dogs"],
    groomedCount: 7000,
    consultationType: "In-Salon",
    bookingMessage: "We've got 7 services but 0 open slots.\nFully booked. Thank U, Next applicant.\nTap Notify!"
  },
  {
    id: 16,
    name: "Toretto's Groom Garage",
    tagline: "For family. For every breed. Fast.",
    specialization: "Complete Grooming",
    established: "2011",
    rating: 5.0,
    reviews: 14000,
    location: "Los Angeles, USA",
    distance: "8 km",
    availability: "Mon – Fri, 10:00 AM – 7:00 PM",
    sessionFee: "$300",
    services: ["Full Family Groom Package", "Fast Dry & Shine", "Deshedding"],
    petTypes: ["Dogs", "Large Breeds"],
    groomedCount: 9000,
    consultationType: "Home Visit",
    bookingMessage: "We groom a quarter mile at a time.\nRight now, the schedule is stalled.\nFor family. Tap Notify."
  },
  {
    id: 17,
    name: "The Mechanic's Clip Shop",
    tagline: "Precision cuts. No nonsense.",
    specialization: "Precision Trim & Fade",
    established: "2007",
    rating: 5.0,
    reviews: 15500,
    location: "London, UK",
    distance: "6 km",
    availability: "Mon – Fri, 10:00 AM – 7:00 PM",
    sessionFee: "£340",
    services: ["Tactical Short Clip", "Precision Blade Work", "Military Trim"],
    petTypes: ["Dogs"],
    groomedCount: 8600,
    consultationType: "In-Salon",
    bookingMessage: "We punched through every grooming challenge.\nBut we cannot punch an opening in this schedule.\nIt's full. Tap Notify."
  },
  {
    id: 18,
    name: "Rare Beauty Pet Spa",
    tagline: "Soothing. Mindful. Gorgeous.",
    specialization: "Spa & Wellness",
    established: "2021",
    rating: 4.9,
    reviews: 13500,
    location: "Los Angeles, USA",
    distance: "9 km",
    availability: "Mon – Fri, 10:00 AM – 7:00 PM",
    sessionFee: "$255",
    services: ["Calming Lavender Bath", "Mental Wellness Groom", "Sensitive Skin Care"],
    petTypes: ["Dogs", "Cats", "Rabbits"],
    groomedCount: 6800,
    consultationType: "In-Salon",
    bookingMessage: "Baby, calm down.\nLooking for a slot but it's a lo-lo-lo-ng wait.\nNo-no-no availability right now. Tap Notify!"
  },
];

const specializations = [
  "All Specializations",
  "Complete Grooming",
  "Luxury Cut & Style",
  "Styling & Haircuts",
  "Precision Trim & Fade",
  "Spa & Wellness",
  "Glam Coat & Nails",
  "Breed-Specific Grooming",
];

const sessionTypes = [
  "All Types",
  "In-Salon",
  "Home Visit",
  "Mobile Grooming",
];

const petTypes = [
  "All Pets",
  "Dogs",
  "Cats",
  "Rabbits",
  "Birds",
  "Large Breeds",
];

const locations = [
  "All Locations",
  "Los Angeles, USA",
  "New York, USA",
  "London, UK",
  "Miami, USA",
  "Nashville, USA",
  "Mumbai, India",
  "Chennai, India",
  "Paris, France",
  "Oslo, Norway",
  "Los Angeles, USA",
  "Calabasas, USA",
];

// Map ?service= param to search term
const serviceParamToLabel: Record<string, string> = {
  'complete': 'Complete Grooming',
  'bath-brush': 'Bath',
  'styling': 'Styling',
  'spa-hygiene': 'Spa',
  'flea-tick': 'Flea',
};

function GroomingContent() {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All Specializations');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedSessionType, setSelectedSessionType] = useState('All Types');
  const [selectedPetType, setSelectedPetType] = useState('All Pets');
  const [showFilters, setShowFilters] = useState(false);
  const [filteredGroomers, setFilteredGroomers] = useState(dummyGroomers);
  const [sortBy, setSortBy] = useState('featured');
  const [selectedGroomer, setSelectedGroomer] = useState<typeof dummyGroomers[0] | null>(null);

  // Pre-filter from nav ?service= param
  useEffect(() => {
    const serviceParam = searchParams.get('service');
    if (serviceParam && serviceParamToLabel[serviceParam]) {
      setSearchTerm(serviceParamToLabel[serviceParam]);
    }
  }, [searchParams]);

  useEffect(() => {
    let filtered = [...dummyGroomers];

    if (searchTerm) {
      filtered = filtered.filter(g =>
        g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.tagline.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.services.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedSpecialization !== 'All Specializations') {
      filtered = filtered.filter(g => {
        const spec = g.specialization.toLowerCase();
        const sel = selectedSpecialization.toLowerCase();
        if (sel.includes('complete')) return spec.includes('complete');
        if (sel.includes('luxury')) return spec.includes('luxury') || spec.includes('style');
        if (sel.includes('styling')) return spec.includes('styling') || spec.includes('haircut');
        if (sel.includes('precision')) return spec.includes('precision') || spec.includes('fade') || spec.includes('trim');
        if (sel.includes('spa')) return spec.includes('spa') || spec.includes('wellness');
        if (sel.includes('glam')) return spec.includes('glam') || spec.includes('nail');
        if (sel.includes('breed')) return spec.includes('breed');
        return spec.includes(sel);
      });
    }

    if (selectedLocation !== 'All Locations') {
      filtered = filtered.filter(g => g.location === selectedLocation);
    }

    if (selectedSessionType !== 'All Types') {
      filtered = filtered.filter(g => g.consultationType === selectedSessionType);
    }

    if (selectedPetType !== 'All Pets') {
      filtered = filtered.filter(g => g.petTypes.includes(selectedPetType));
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          if (b.rating !== a.rating) return b.rating - a.rating;
          return b.reviews - a.reviews;
        case 'fee':
          const parseFee = (feeStr: string): number => {
            const value = parseFloat(feeStr.replace(/[^0-9.]/g, '')) || 0;
            if (feeStr.includes('₹')) return value * 0.012;
            if (feeStr.includes('£')) return value * 1.27;
            if (feeStr.includes('€')) return value * 1.08;
            if (feeStr.includes('kr')) return value * 0.09;
            return value;
          };
          return parseFee(a.sessionFee) - parseFee(b.sessionFee);
        case 'reviews':
          return b.reviews - a.reviews;
        case 'featured':
        default:
          return dummyGroomers.indexOf(a) - dummyGroomers.indexOf(b);
      }
    });

    setFilteredGroomers(filtered);
  }, [searchTerm, selectedSpecialization, selectedLocation, selectedSessionType, selectedPetType, sortBy]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedSpecialization('All Specializations');
    setSelectedLocation('All Locations');
    setSelectedSessionType('All Types');
    setSelectedPetType('All Pets');
    setSortBy('featured');
    setShowFilters(false);
  };

  const activeServiceLabel = serviceParamToLabel[searchParams.get('service') || ''];

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      <div className="fixed inset-0 bg-[image:var(--bg-subtle-mesh)] pointer-events-none opacity-90 z-0" />
      <div className="fixed inset-0 bg-[image:var(--bg-dot-pattern)] bg-[length:24px_24px] pointer-events-none opacity-50 [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)] z-0" />
      <div className="fixed inset-0 bg-slate-50/40 dark:bg-transparent pointer-events-none z-0" />

      <div className="relative z-10">
        <Header />

        <section className="pt-24 md:pt-32 pb-2">
          <div className="container mx-auto px-8 lg:px-20">
            <div className="max-w-6xl mx-auto">

              <BetaDisclaimerBanner category="grooming salons" />

              {/* Active service filter pill */}
              {activeServiceLabel && (
                <div className="flex items-center gap-2 mb-2 mt-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-primary/10 text-primary rounded-full border border-primary/20">
                    <Scissors className="w-3 h-3" />
                    {activeServiceLabel}
                  </span>
                  <button
                    onClick={clearFilters}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                  >
                    <X className="w-3 h-3" /> Clear
                  </button>
                </div>
              )}

              {/* Search + Filter + Sort Bar */}
              <div className="flex items-center gap-3 mb-4 md:mb-6 mt-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`shrink-0 ${showFilters ? 'bg-secondary' : ''}`}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>

                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search salons by name, service, location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-10 text-sm border border-input bg-background rounded-md focus:ring-0 focus:ring-offset-0 focus:border-input w-full"
                  />
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="shrink-0">
                      <ArrowUpDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => setSortBy('featured')}>Sort by Featured</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy('rating')}>Sort by Rating</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy('fee')}>Sort by Fee</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy('reviews')}>Sort by Reviews</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Collapsible Filters */}
              {showFilters && (
                <div className="grid md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg mb-6 border animate-in slide-in-from-top-2">
                  <div>
                    <label className="block text-sm font-medium mb-2">Specialization</label>
                    <CustomSelect
                      options={specializations.map(s => ({ value: s, label: s }))}
                      value={selectedSpecialization}
                      onChange={(val) => { setSelectedSpecialization(val); setShowFilters(false); }}
                      placeholder="Select specialization"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Location</label>
                    <CustomSelect
                      options={locations.map(l => ({ value: l, label: l }))}
                      value={selectedLocation}
                      onChange={(val) => { setSelectedLocation(val); setShowFilters(false); }}
                      placeholder="Select location"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Session Type</label>
                    <CustomSelect
                      options={sessionTypes.map(t => ({ value: t, label: t }))}
                      value={selectedSessionType}
                      onChange={(val) => { setSelectedSessionType(val); setShowFilters(false); }}
                      placeholder="Select session type"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Pet Type</label>
                    <CustomSelect
                      options={petTypes.map(p => ({ value: p, label: p }))}
                      value={selectedPetType}
                      onChange={(val) => { setSelectedPetType(val); setShowFilters(false); }}
                      placeholder="Select pet type"
                    />
                  </div>
                  <div className="md:col-span-4 flex justify-end">
                    <Button variant="ghost" onClick={clearFilters} className="text-sm">
                      <X className="w-4 h-4 mr-1" />
                      Clear Filters
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Salons Grid */}
        <section className="pb-12">
          <div className="container mx-auto px-8 lg:px-20">
            <div className="max-w-6xl mx-auto">
              {filteredGroomers.length === 0 ? (
                <div className="text-center py-16">
                  <Scissors className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No salons found</h3>
                  <p className="text-muted-foreground mb-4">Try adjusting your search criteria</p>
                  <Button onClick={clearFilters}>Clear Filters</Button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredGroomers.map((salon) => (
                    <Card key={salon.id} className="group hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
                      <CardContent className="p-0">
                        {/* Salon Card Header — visual area */}
                        <div className="relative h-[220px] overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-muted flex flex-col items-center justify-center gap-3 group-hover:from-primary/30 transition-all duration-300">
                          {/* Salon icon */}
                          <div className="w-20 h-20 rounded-2xl bg-white/80 dark:bg-gray-800/80 shadow-md flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                            <Scissors className="w-9 h-9 text-primary" />
                          </div>
                          <div className="text-center px-4">
                            <p className="text-xs font-semibold text-muted-foreground">{salon.tagline}</p>
                          </div>
                          {/* Session type badge */}
                          <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                            {salon.consultationType}
                          </div>
                          {/* Rating badge */}
                          <div className="absolute top-3 left-3 flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/60 px-2 py-0.5 rounded-full">
                            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-500" />
                            <span className="text-xs font-bold text-yellow-700 dark:text-yellow-400">{salon.rating}</span>
                          </div>
                          {/* Est. pill */}
                          <div className="absolute bottom-3 right-3 text-[10px] text-muted-foreground font-semibold bg-background/70 backdrop-blur-sm px-2 py-1 rounded-full">
                            Est. {salon.established}
                          </div>
                          {/* Reviews */}
                          <div className="absolute bottom-3 left-3 text-[10px] text-muted-foreground font-semibold bg-background/70 backdrop-blur-sm px-2 py-1 rounded-full">
                            {salon.reviews.toLocaleString()} reviews
                          </div>
                        </div>

                        {/* Salon Info */}
                        <div className="p-4">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight mb-0.5">{salon.name}</h3>
                          <p className="text-sm text-primary font-medium mb-3">{salon.specialization}</p>

                          <div className="flex items-center gap-3 mb-3 text-xs text-gray-500 dark:text-gray-400 font-medium">
                            <div className="flex items-center shrink-0">
                              <MapPin className="w-3.5 h-3.5 mr-1" />
                              <span className="truncate max-w-[110px]">{salon.location}</span>
                            </div>
                            <div className="w-px h-3 bg-gray-300 dark:bg-gray-700" />
                            <div className="flex items-center shrink-0">
                              <Clock className="w-3.5 h-3.5 mr-1" />
                              <span className="truncate max-w-[110px]">{salon.availability}</span>
                            </div>
                          </div>

                          {/* Services offered */}
                          <div className="flex flex-wrap gap-1 mb-3">
                            {salon.services.slice(0, 3).map(svc => (
                              <span key={svc} className="text-[10px] font-semibold bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                                {svc}
                              </span>
                            ))}
                          </div>

                          {/* Pet types */}
                          <div className="flex flex-wrap gap-1 mb-3">
                            {salon.petTypes.map(pt => (
                              <span key={pt} className="text-[10px] font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">
                                {pt}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
                            <div>
                              <p className="text-lg font-bold text-primary leading-none">{salon.sessionFee}</p>
                              <p className="text-[10px] text-gray-400 uppercase tracking-wide font-medium mt-0.5">Per Session</p>
                            </div>
                            <Button
                              className="bg-primary hover:bg-primary/90 text-white dark:text-gray-900 h-9 px-5 rounded-full text-xs font-semibold shadow-sm hover:shadow-md transition-all"
                              onClick={() => setSelectedGroomer(salon)}
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
        {selectedGroomer && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
            <div className="bg-card rounded-2xl p-0 max-w-md w-full mx-4 shadow-2xl overflow-hidden border border-border">
              <div className="relative h-28 bg-primary/10 flex items-center justify-center">
                <div className="w-20 h-20 rounded-2xl bg-white/80 dark:bg-gray-800 border-2 border-primary/20 flex items-center justify-center text-primary shadow-lg">
                  <Scissors className="w-9 h-9" />
                </div>
              </div>

              <div className="pt-6 pb-8 px-6 text-center">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  {selectedGroomer.name}
                </h3>
                <p className="text-sm text-primary font-medium mb-1 uppercase tracking-wider">
                  {selectedGroomer.specialization}
                </p>
                <p className="text-xs text-muted-foreground mb-6">{selectedGroomer.location} · Est. {selectedGroomer.established}</p>

                <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-xl p-4 sm:p-6 mb-6 shadow-sm">
                  <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base font-medium italic leading-6 sm:leading-7 whitespace-pre-line">
                    {selectedGroomer.bookingMessage}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedGroomer(null)}
                    className="w-full border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
                  >
                    Close
                  </Button>
                  <Button
                    className="w-full bg-primary hover:bg-primary/90"
                    onClick={() => setSelectedGroomer(null)}
                  >
                    Notify Me
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        <BetaDisclaimerPopup
          category="grooming salons"
          actionVerb="grooming"
        />
      </div>
    </div>
  );
}

export default function GroomingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading grooming salons...</p>
        </div>
      </div>
    }>
      <GroomingContent />
    </Suspense>
  );
}
