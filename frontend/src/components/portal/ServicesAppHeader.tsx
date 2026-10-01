'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Search,
  ShoppingCart,
  X,
  User,
  Calendar,
  Luggage,
  Package,
  LogOut,
  ChevronDown,
  ChevronsUpDown,
  PawPrint,
  Check,
  FileText,
  Stethoscope,
  Scissors,
  GraduationCap,
  Plane,
  ShieldCheck,
  ShoppingBag,
  Globe,
  MapPin,
  Navigation,
  Loader2,
  Settings,
  Building2,
  LayoutGrid,
  Video,
  Home,
  SlidersHorizontal,
  ArrowUpDown,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const ZOODO_SERVICES = [
  {
    id: 'vet',
    short: 'VET',
    name: 'Veterinary',
    subtitle: 'Clinical, Consults & 24/7 Care',
    category: 'care',
    tab: 'veterinary',
    icon: Stethoscope,
  },
  {
    id: 'groom',
    short: 'GROOM',
    name: 'Grooming',
    subtitle: 'Styling, Spas & Pet Bathing',
    category: 'care',
    tab: 'grooming',
    icon: Scissors,
  },
  {
    id: 'train',
    short: 'TRAINING',
    name: 'Training',
    subtitle: 'Behavior, Obedience & Agility',
    category: 'care',
    tab: 'training',
    icon: GraduationCap,
  },
  {
    id: 'shop',
    short: 'SHOP',
    name: 'Shopping',
    subtitle: 'Pharmacy Rx, Food & Supplies',
    category: 'shopping',
    tab: 'food',
    icon: ShoppingBag,
  },
  {
    id: 'travel',
    short: 'TRAVEL',
    name: 'Travel',
    subtitle: 'Pet Taxi, Flights & Resorts',
    category: 'travel',
    tab: 'taxi',
    icon: Plane,
  },
  {
    id: 'insurance',
    short: 'INSURANCE',
    name: 'Insurance',
    subtitle: 'Health Policies, Claims & Plans',
    category: 'insurance',
    tab: 'plans',
    icon: ShieldCheck,
  },
];

export const CONSULT_MODES = [
  { id: 'video', label: 'Video Consult', icon: Video },
  { id: 'clinic', label: 'In-Clinic Visit', icon: Building2 },
  { id: 'home', label: 'Home Visit', icon: Home },
] as const;

export type ConsultModeId = 'all' | 'video' | 'clinic' | 'home';

interface ServicesAppHeaderProps {
  activeCategory: string;
  activeTab: string;
  onSearchChange?: (query: string) => void;
  isMobileSidebarOpen?: boolean;
  onToggleMobileSidebar?: () => void;
  cartCount?: number;
  onOpenCart?: () => void;
  onNavigateTab?: (categoryId: string, tabId: string) => void;
  activeConsultMode?: ConsultModeId;
  onConsultModeChange?: (mode: ConsultModeId) => void;
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
  selectedLocation?: string;
  setSelectedLocation?: (loc: string) => void;
  detectCurrentLocation?: () => void;
  isDetectingLocation?: boolean;
  availabilityFilter?: 'all' | 'today' | string;
  setAvailabilityFilter?: (avail: any) => void;
  speciesFilter?: string;
  setSpeciesFilter?: (spec: any) => void;
  onOpenFilter?: () => void;
  onOpenSort?: () => void;
  activeFilterCount?: number;
  isSortActive?: boolean;
  sortBy?: string;
  onSortChange?: (sortId: string) => void;
}


export default function ServicesAppHeader({
  activeCategory,
  activeTab,
  onSearchChange,
  isMobileSidebarOpen = false,
  onToggleMobileSidebar,
  cartCount = 0,
  onOpenCart,
  onNavigateTab,
  activeConsultMode = 'all',
  onConsultModeChange,
  searchQuery: externalSearchQuery,
  setSearchQuery: externalSetSearchQuery,
  selectedLocation: externalSelectedLocation,
  setSelectedLocation: externalSetSelectedLocation,
  detectCurrentLocation: externalDetectLocation,
  isDetectingLocation: externalIsDetecting,
  availabilityFilter = 'all',
  setAvailabilityFilter,
  speciesFilter = 'all',
  setSpeciesFilter,
  onOpenFilter,
  onOpenSort,
  activeFilterCount: externalFilterCount = 0,
  isSortActive = false,
  sortBy = 'relevance',
  onSortChange,
}: ServicesAppHeaderProps) {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

  // Search input state
  const [internalSearchQuery, setInternalSearchQuery] = useState('');
  const queryValue = externalSearchQuery !== undefined ? externalSearchQuery : internalSearchQuery;
  const handleQueryChange = (val: string) => {
    if (externalSetSearchQuery) {
      externalSetSearchQuery(val);
    } else {
      setInternalSearchQuery(val);
    }
    onSearchChange?.(val);
  };

  // Location selector state
  const [internalLocation, setInternalLocation] = useState('All Locations');
  const [locSearchInput, setLocSearchInput] = useState('');
  const [isLocDropdownOpen, setIsLocDropdownOpen] = useState(false);
  const [internalDetectingGps, setInternalDetectingGps] = useState(false);
  const [selectedPet, setSelectedPet] = useState('Bella 🐶');

  const selectedLocation = externalSelectedLocation !== undefined ? externalSelectedLocation : internalLocation;
  const isGpsDetecting = externalIsDetecting !== undefined ? externalIsDetecting : internalDetectingGps;

  const handleSelectLocation = (loc: string) => {
    if (externalSetSelectedLocation) {
      externalSetSelectedLocation(loc);
    } else {
      setInternalLocation(loc);
    }
    setLocSearchInput('');
    setIsLocDropdownOpen(false);
  };

  const handleTriggerGps = () => {
    if (externalDetectLocation) {
      externalDetectLocation();
      setIsLocDropdownOpen(false);
      return;
    }

    setInternalDetectingGps(true);
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const { latitude, longitude } = pos.coords;
            const res = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            if (res.ok) {
              const data = await res.json();
              const city = data.city || data.locality || data.principalSubdivision;
              const state = data.principalSubdivision || '';
              const country = data.countryName || '';
              const detected = [city, state, country].filter(Boolean).join(', ');
              if (detected) {
                handleSelectLocation(detected);
                setInternalDetectingGps(false);
                return;
              }
            }
          } catch { }
          handleSelectLocation('Mumbai, Maharashtra, India');
          setInternalDetectingGps(false);
        },
        () => {
          handleSelectLocation('Mumbai, Maharashtra, India');
          setInternalDetectingGps(false);
        },
        { timeout: 5000 }
      );
    } else {
      handleSelectLocation('Mumbai, Maharashtra, India');
      setInternalDetectingGps(false);
    }
  };

  const pets = [
    { name: 'Bella', type: 'Dog', breed: 'Golden Retriever', emoji: '🐶' },
    { name: 'Milo', type: 'Cat', breed: 'British Shorthair', emoji: '🐱' },
  ];

  // Current active service module based on route state
  const currentService = (() => {
    if (activeCategory === 'shopping') return ZOODO_SERVICES.find((s) => s.id === 'shop')!;
    if (activeCategory === 'travel') return ZOODO_SERVICES.find((s) => s.id === 'travel')!;
    if (activeCategory === 'insurance') return ZOODO_SERVICES.find((s) => s.id === 'insurance')!;
    if (activeTab === 'grooming') return ZOODO_SERVICES.find((s) => s.id === 'groom')!;
    if (activeTab === 'training') return ZOODO_SERVICES.find((s) => s.id === 'train')!;
    return ZOODO_SERVICES[0]; // Default: Vet Care
  })();

  const handleMenuNav = (cat: string, tab: string) => {
    if (onNavigateTab) {
      onNavigateTab(cat, tab);
    } else {
      router.push(`/services?cat=${cat}&tab=${tab}`);
    }
  };

  // Only show cart if in shopping section or if cart has items
  const showCart = activeCategory === 'shopping' || cartCount > 0;

  return (
    <header className="sticky top-0 z-50 w-full bg-[#bde4e9]/95 dark:bg-black/90 backdrop-blur-md border-b border-secondary/50 shadow-md transition-all rounded-b-[2.5rem] md:rounded-b-[3.5rem] lg:rounded-b-[4rem] overflow-hidden">
      <div className="max-w-[1920px] mx-auto px-6 sm:px-8 md:px-10 lg:px-16">
        {/* Top Row: App Switcher + Category Tabs + Profile Actions */}
        <div className="h-16 sm:h-20 flex items-center justify-between gap-3">
          {/* Left: App Switcher (Zoodo Logo + Service Tag) */}
          <div className="flex items-center gap-1.5 shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="group flex items-center gap-1.5 py-1 px-1 focus:outline-none cursor-pointer select-none">
                  <div className="flex items-center">
                    <Image
                      src="/logo-slate.png"
                      alt="Zoodo"
                      width={110}
                      height={20}
                      className="h-3.5 sm:h-4 w-auto object-contain pointer-events-none select-none dark:brightness-0 dark:invert"
                      priority
                    />
                    <span className="ml-2 text-[10px] sm:text-[11px] font-bold tracking-wider text-slate-800 dark:text-slate-200 uppercase select-none">
                      {currentService.short}
                    </span>
                  </div>

                  <ChevronsUpDown className="w-3 h-3 text-slate-600 group-hover:text-slate-950 dark:group-hover:text-white transition-colors ml-1" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="start"
                className="w-72 sm:w-76 p-1.5 rounded-2xl border border-slate-200/90 dark:border-zinc-800 shadow-2xl bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl animate-in fade-in-0 zoom-in-95 duration-150"
              >
                <div className="px-3.5 py-2.5 border-b border-slate-100 dark:border-zinc-850 mb-1">
                  <p className="text-xs font-medium text-slate-800 dark:text-zinc-200 tracking-wide font-sans">
                    Switch Portal
                  </p>
                </div>

                <div className="space-y-0.5">
                  {ZOODO_SERVICES.map((srv) => {
                    const Icon = srv.icon;
                    const isCurrent = srv.id === currentService.id;

                    return (
                      <DropdownMenuItem
                        key={srv.id}
                        onClick={() => handleMenuNav(srv.category, srv.tab)}
                        className={`group flex items-center gap-3 px-2.5 py-2 rounded-xl cursor-pointer transition-all outline-none ${isCurrent
                            ? 'bg-slate-100/90 dark:bg-zinc-850/90 text-slate-900 dark:text-white'
                            : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-zinc-850/80'
                          }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${isCurrent
                              ? 'bg-primary/15 text-primary'
                              : 'bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 group-hover:bg-slate-200/70 dark:group-hover:bg-zinc-700/70 group-hover:text-slate-900 dark:group-hover:text-white'
                            }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <span className="text-[12.5px] font-medium tracking-tight truncate block">
                            {srv.name}
                          </span>
                          <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate leading-none mt-0.5">
                            {srv.subtitle}
                          </p>
                        </div>

                        {isCurrent && (
                          <Check className="w-4 h-4 text-primary shrink-0 ml-1" />
                        )}
                      </DropdownMenuItem>
                    );
                  })}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Center: Category Tabs — Airbnb style (icon + label inline, underline active) */}
          {currentService.id === 'vet' && (
            <div className="hidden md:flex items-center justify-center gap-8 lg:gap-10 h-full">
              {CONSULT_MODES.map((mode) => {
                const isActive = activeConsultMode === mode.id || (activeConsultMode === 'all' && mode.id === 'video');
                const Icon = mode.icon;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => onConsultModeChange?.(mode.id)}
                    className="relative flex flex-col items-center justify-end pb-3 pt-3 cursor-pointer select-none group"
                  >
                    {/* Icon + Label row */}
                    <div className="flex items-center gap-2">
                      <Icon
                        className={`w-5 h-5 shrink-0 transition-colors duration-150 ${isActive
                            ? 'text-slate-900 dark:text-white'
                            : 'text-slate-500 dark:text-zinc-400 group-hover:text-slate-800 dark:group-hover:text-white'
                          }`}
                      />
                      <span
                        className={`text-[13.5px] tracking-tight whitespace-nowrap transition-colors duration-150 ${isActive
                            ? 'font-semibold text-slate-900 dark:text-white'
                            : 'font-medium text-slate-500 dark:text-zinc-400 group-hover:text-slate-800 dark:group-hover:text-white'
                          }`}
                      >
                        {mode.label}
                      </span>
                    </div>

                    {/* Airbnb-style underline */}
                    <div className="absolute bottom-0 left-0 right-0 flex justify-center">
                      {isActive ? (
                        <motion.div
                          layoutId="airbnbUnderline"
                          className="h-[2px] w-full bg-slate-900 dark:bg-white rounded-full"
                          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                        />
                      ) : (
                        <div className="h-[2px] w-full bg-transparent rounded-full group-hover:bg-slate-300/60 dark:group-hover:bg-zinc-600/60 transition-colors duration-150" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}


          {/* Right Section: Direct Log In & Sign Up + Globe + Profile Menu Button */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Active Pet Selector (when logged in) */}
            {isAuthenticated && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/85 dark:bg-zinc-850 border border-white/80 dark:border-zinc-750 hover:bg-white text-xs font-semibold text-slate-800 dark:text-slate-200 transition-all shadow-2xs">
                    <span>{selectedPet}</span>
                    <ChevronDown className="w-3 h-3 text-slate-600 dark:text-slate-400" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 rounded-2xl border-slate-200 dark:border-zinc-800 p-1.5 bg-white dark:bg-zinc-950 shadow-lg">
                  <DropdownMenuLabel className="text-[11px] text-muted-foreground font-semibold px-2 py-1">
                    Active Pet
                  </DropdownMenuLabel>
                  {pets.map((p) => (
                    <DropdownMenuItem
                      key={p.name}
                      onClick={() => setSelectedPet(`${p.name} ${p.emoji}`)}
                      className="flex items-center justify-between text-xs py-2 px-2.5 rounded-xl cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-base">{p.emoji}</span>
                        <span className="font-semibold text-foreground">{p.name}</span>
                      </span>
                      {selectedPet.startsWith(p.name) && (
                        <Check className="w-3.5 h-3.5 text-primary" />
                      )}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleMenuNav('activity', 'pets')}
                    className="text-xs text-primary font-medium flex items-center gap-2 cursor-pointer px-2.5 py-1.5 rounded-xl"
                  >
                    <PawPrint className="w-3.5 h-3.5" />
                    <span>Manage Pets</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Shopping Cart Icon */}
            {showCart && (
              <button
                onClick={onOpenCart}
                className="relative p-2 rounded-full bg-white/80 dark:bg-zinc-850 hover:bg-white text-slate-700 dark:text-slate-200 transition-colors shadow-2xs"
                aria-label="View Shopping Cart"
              >
                <ShoppingCart className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute 0 right-0 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {/* Direct Login / Signup links for desktop */}
            {!isAuthenticated && (
              <div className="hidden lg:flex items-center gap-1.5">
                <Link
                  href="/login"
                  className="text-xs sm:text-[13px] font-semibold px-3 py-1.5 text-slate-800 dark:text-slate-200 hover:text-primary transition-colors whitespace-nowrap"
                >
                  Log In
                </Link>
                <Link
                  href="/register/personal"
                  className="text-xs sm:text-[13px] font-semibold px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full transition-all shadow-xs whitespace-nowrap"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Clean Profile Avatar Trigger (Sidebar Navigation & Account) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-white dark:bg-zinc-850 hover:bg-slate-50 dark:hover:bg-zinc-800 border border-slate-300/80 dark:border-zinc-700 shadow-2xs hover:shadow-xs text-slate-700 dark:text-slate-200 transition-all focus:outline-none cursor-pointer shrink-0"
                  aria-label="Account and navigation menu"
                >
                  {isAuthenticated ? (
                    <span className="font-bold text-xs text-primary uppercase">
                      {user?.firstName?.[0] || 'U'}
                    </span>
                  ) : (
                    <User className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                  )}
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-72 mt-2 p-2 rounded-2xl border-slate-200 dark:border-zinc-800 shadow-2xl bg-white dark:bg-zinc-950 max-h-[85vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              >
                {/* User / Guest Info Header */}
                {isAuthenticated ? (
                  <div className="px-3 py-2.5 bg-slate-50 dark:bg-zinc-900/80 rounded-xl mb-1.5 border border-slate-100 dark:border-zinc-800/80">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-primary/20 text-primary font-bold text-sm flex items-center justify-center uppercase shrink-0">
                        {user?.firstName?.[0] || 'U'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="px-3 py-2.5 bg-slate-50 dark:bg-zinc-900/80 rounded-xl mb-1.5 border border-slate-100 dark:border-zinc-800/80">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          Welcome to Zoodo
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        </span>
                        <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate">
                          Sign in to manage appointments & pets
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2.5">
                      <DropdownMenuItem asChild className="p-0">
                        <Link
                          href="/login"
                          className="w-full py-1.5 text-center text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-zinc-700 rounded-lg hover:bg-white dark:hover:bg-zinc-800 transition-colors"
                        >
                          Log In
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="p-0">
                        <Link
                          href="/register/personal"
                          className="w-full py-1.5 text-center text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 rounded-lg transition-colors shadow-xs"
                        >
                          Sign Up
                        </Link>
                      </DropdownMenuItem>
                    </div>
                  </div>
                )}

                {/* Section 1: Vet Care Navigation (Moved from Sidebar) */}
                <div className="px-1 py-1">
                  <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 px-2 py-1">
                    Vet Care
                  </DropdownMenuLabel>

                  <DropdownMenuItem
                    onClick={() => handleMenuNav('care', 'find-vet')}
                    className="flex items-center justify-between text-xs py-2 px-2.5 rounded-xl cursor-pointer text-foreground font-medium hover:bg-slate-100 dark:hover:bg-zinc-850"
                  >
                    <div className="flex items-center gap-2.5">
                      <Search className="w-4 h-4 text-primary" />
                      <span>Find Doctors</span>
                    </div>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => handleMenuNav('care', 'appointments')}
                    className="flex items-center justify-between text-xs py-2 px-2.5 rounded-xl cursor-pointer text-foreground font-medium hover:bg-slate-100 dark:hover:bg-zinc-850"
                  >
                    <div className="flex items-center gap-2.5">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span>Appointments</span>
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      Live
                    </span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => handleMenuNav('care', 'medical-history')}
                    className="flex items-center justify-between text-xs py-2 px-2.5 rounded-xl cursor-pointer text-foreground font-medium hover:bg-slate-100 dark:hover:bg-zinc-850"
                  >
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-primary" />
                      <span>Medical History</span>
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                      Rx
                    </span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => handleMenuNav('care', 'pets')}
                    className="flex items-center gap-2.5 text-xs py-2 px-2.5 rounded-xl cursor-pointer text-foreground font-medium hover:bg-slate-100 dark:hover:bg-zinc-850"
                  >
                    <PawPrint className="w-4 h-4 text-primary" />
                    <span>My Pets</span>
                  </DropdownMenuItem>
                </div>

                {/* Section 2: Activity & Orders */}
                <DropdownMenuSeparator className="my-1 bg-slate-100 dark:bg-zinc-850" />
                <div className="px-1 py-1">
                  <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 px-2 py-1">
                    Activity & Orders
                  </DropdownMenuLabel>

                  <DropdownMenuItem
                    onClick={() => handleMenuNav('activity', 'orders')}
                    className="flex items-center gap-2.5 text-xs py-2 px-2.5 rounded-xl cursor-pointer text-foreground font-medium hover:bg-slate-100 dark:hover:bg-zinc-850"
                  >
                    <Package className="w-4 h-4 text-primary" />
                    <span>Orders & Refills</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => handleMenuNav('activity', 'bookings')}
                    className="flex items-center gap-2.5 text-xs py-2 px-2.5 rounded-xl cursor-pointer text-foreground font-medium hover:bg-slate-100 dark:hover:bg-zinc-850"
                  >
                    <Luggage className="w-4 h-4 text-primary" />
                    <span>Travel Bookings</span>
                  </DropdownMenuItem>
                </div>

                {/* Section 3: Account & Settings */}
                <DropdownMenuSeparator className="my-1 bg-slate-100 dark:bg-zinc-850" />
                <div className="px-1 py-1">
                  <DropdownMenuItem
                    onClick={() => handleMenuNav('care', 'settings')}
                    className="flex items-center gap-2.5 text-xs py-2 px-2.5 rounded-xl cursor-pointer text-foreground font-medium hover:bg-slate-100 dark:hover:bg-zinc-850"
                  >
                    <Settings className="w-4 h-4 text-slate-500" />
                    <span>Profile & Settings</span>
                  </DropdownMenuItem>

                  {isAuthenticated ? (
                    <DropdownMenuItem
                      onClick={logout}
                      className="flex items-center gap-2.5 text-xs py-2 px-2.5 rounded-xl text-red-600 dark:text-red-400 cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/30 font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem asChild>
                      <Link
                        href="/register/business"
                        className="flex items-center gap-2 text-xs font-medium py-2 px-2.5 rounded-xl cursor-pointer text-primary hover:bg-primary/10"
                      >
                        <Building2 className="w-4 h-4" />
                        <span>Veterinarian & Clinic Portal</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

      </div>
    </header>
  );
}
