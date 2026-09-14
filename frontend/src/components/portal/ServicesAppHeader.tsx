'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Search,
  ShoppingCart,
  Bell,
  Menu,
  X,
  User,
  Calendar,
  Luggage,
  Package,
  Shield,
  Settings,
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

interface ServicesAppHeaderProps {
  activeCategory: string;
  activeTab: string;
  onSearchChange?: (query: string) => void;
  isMobileSidebarOpen?: boolean;
  onToggleMobileSidebar: () => void;
  cartCount?: number;
  onOpenCart?: () => void;
  onNavigateTab?: (categoryId: string, tabId: string) => void;
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
}: ServicesAppHeaderProps) {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPet, setSelectedPet] = useState('Bella 🐶');

  const pets = [
    { name: 'Bella', type: 'Dog', breed: 'Golden Retriever', emoji: '🐶' },
    { name: 'Milo', type: 'Cat', breed: 'British Shorthair', emoji: '🐱' },
  ];

  // Current active service module based on route state
  const currentService = (() => {
    if (activeCategory === 'shopping') return ZOODO_SERVICES.find(s => s.id === 'shop')!;
    if (activeCategory === 'travel') return ZOODO_SERVICES.find(s => s.id === 'travel')!;
    if (activeCategory === 'insurance') return ZOODO_SERVICES.find(s => s.id === 'insurance')!;
    if (activeTab === 'grooming') return ZOODO_SERVICES.find(s => s.id === 'groom')!;
    if (activeTab === 'training') return ZOODO_SERVICES.find(s => s.id === 'train')!;
    return ZOODO_SERVICES.find(s => s.id === 'vet')!;
  })();

  // Dynamic context-aware placeholder
  const getSearchPlaceholder = () => {
    switch (activeTab) {
      case 'veterinary':
        return 'Search doctors by name or symptom (e.g. Vomiting, Surgery)...';
      case 'grooming':
        return 'Search grooming packages, bath, haircut...';
      case 'training':
        return 'Search dog trainers, puppy obedience...';
      case 'food':
        return 'Search pet food brands, kibble, wet food...';
      case 'pharmacy':
        return 'Search pet medicines, prescriptions, vitamins...';
      case 'essentials':
        return 'Search accessories, collars, toys, beds...';
      case 'taxi':
        return 'Enter pickup location or clinic for pet taxi...';
      case 'flight':
        return 'Search domestic or international pet travel...';
      case 'hotel':
        return 'Search pet boarding, resorts, day care...';
      case 'insurance':
        return 'Search pet insurance plans & coverage...';
      case 'community':
        return 'Search discussions, pet tips, adoption...';
      case 'appointments':
        return 'Search upcoming doctor visits & consultations...';
      case 'orders':
        return 'Search your food & medicine orders...';
      default:
        return 'Search services...';
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchChange) {
      onSearchChange(searchQuery);
    }
  };

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
    <header className="sticky top-0 z-50 w-full bg-[#bde4e9]/95 dark:bg-black/90 backdrop-blur-md border-none shadow-none transition-all">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
        {/* Left: App Switcher (Zoodo Logo + Exponent Superscript) */}
        <div className="flex items-center gap-1.5 shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="group flex items-center gap-1 py-1 px-1 focus:outline-none cursor-pointer select-none"
                title="Switch Zoodo Service"
              >
                {/* Zoodo Logo + Mathematical Exponent (x²) Superscript */}
                <div className="relative inline-flex items-start">
                  <Image
                    src="/pacifico-zoodo.png"
                    alt="Zoodo"
                    width={78}
                    height={22}
                    className="h-5 w-auto object-contain pointer-events-none select-none"
                    priority
                  />
                  {/* Clean mathematical superscript (x²) - light and capital */}
                  <span className="self-start -mt-1 ml-0.5 text-[9px] font-medium tracking-wider text-slate-700 dark:text-slate-300 uppercase select-none">
                    {currentService.short}
                  </span>
                </div>

                <ChevronsUpDown className="w-3 h-3 text-slate-700/70 dark:text-slate-300 group-hover:text-slate-950 dark:group-hover:text-white transition-colors ml-1 -mt-0.5" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="start"
              className="w-72 sm:w-76 p-1.5 rounded-2xl border border-slate-200/90 dark:border-zinc-800 shadow-2xl shadow-slate-950/15 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl animate-in fade-in-0 zoom-in-95 duration-150"
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
                      className={`group flex items-center gap-3 px-2.5 py-2 rounded-xl cursor-pointer transition-all outline-none ${
                        isCurrent
                          ? 'bg-slate-100/90 dark:bg-zinc-850/90 text-slate-900 dark:text-white'
                          : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-zinc-850/80'
                      }`}
                    >
                      {/* Micro Icon Container */}
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                          isCurrent
                            ? 'bg-primary/15 text-primary'
                            : 'bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 group-hover:bg-slate-200/70 dark:group-hover:bg-zinc-700/70 group-hover:text-slate-900 dark:group-hover:text-white'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>

                      {/* Titles & Micro Subtitles */}
                      <div className="flex-1 min-w-0">
                        <span className="text-[12.5px] font-medium tracking-tight truncate block">
                          {srv.name}
                        </span>
                        <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate leading-none mt-0.5">
                          {srv.subtitle}
                        </p>
                      </div>

                      {/* Active Checkmark */}
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


        {/* Right Section: Active Pet + Cart + Auth/Profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Active Pet Selector */}
          {isAuthenticated && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/85 dark:bg-zinc-800/85 border border-white/70 dark:border-zinc-700 hover:bg-white text-xs font-semibold text-slate-800 dark:text-slate-200 transition-all shadow-2xs">
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
              className="relative p-2 rounded-full bg-white/80 dark:bg-zinc-800/80 border border-white/70 dark:border-zinc-700 text-slate-700 dark:text-slate-200 hover:bg-white transition-colors shadow-2xs"
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

          {/* Notifications */}
          {isAuthenticated && (
            <button
              className="relative p-2 rounded-full bg-white/80 dark:bg-zinc-800/80 border border-white/70 dark:border-zinc-700 text-slate-700 dark:text-slate-200 hover:bg-white transition-colors shadow-2xs"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full" />
            </button>
          )}

          {/* Auth State */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full bg-white/85 dark:bg-zinc-800/85 hover:bg-white border border-white/70 dark:border-zinc-700 transition-all focus:outline-none shadow-2xs">
                  <div className="w-6 h-6 rounded-full bg-primary/15 text-primary font-bold text-xs flex items-center justify-center uppercase">
                    {user?.firstName?.[0] || 'U'}
                  </div>
                  <span className="hidden sm:inline-block text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[90px] truncate">
                    {user?.firstName}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-600 dark:text-slate-400" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-2 p-1.5 rounded-2xl border-slate-200 dark:border-zinc-800 shadow-xl bg-white dark:bg-zinc-950">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-zinc-800 mb-1">
                  <p className="text-xs font-bold text-foreground truncate">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {user?.email}
                  </p>
                </div>

                <DropdownMenuItem
                  onClick={() => handleMenuNav('activity', 'appointments')}
                  className="flex items-center gap-2.5 text-xs py-2 px-2.5 rounded-xl cursor-pointer text-foreground font-medium"
                >
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>My Appointments</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => handleMenuNav('activity', 'bookings')}
                  className="flex items-center gap-2.5 text-xs py-2 px-2.5 rounded-xl cursor-pointer text-foreground font-medium"
                >
                  <Luggage className="w-4 h-4 text-primary" />
                  <span>Travel Bookings</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => handleMenuNav('activity', 'orders')}
                  className="flex items-center gap-2.5 text-xs py-2 px-2.5 rounded-xl cursor-pointer text-foreground font-medium"
                >
                  <Package className="w-4 h-4 text-primary" />
                  <span>Orders & Refills</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => handleMenuNav('activity', 'records')}
                  className="flex items-center gap-2.5 text-xs py-2 px-2.5 rounded-xl cursor-pointer text-foreground font-medium"
                >
                  <FileText className="w-4 h-4 text-primary" />
                  <span>Health Records</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => handleMenuNav('activity', 'pets')}
                  className="flex items-center gap-2.5 text-xs py-2 px-2.5 rounded-xl cursor-pointer text-foreground font-medium"
                >
                  <PawPrint className="w-4 h-4 text-primary" />
                  <span>My Pets</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={logout}
                  className="flex items-center gap-2.5 text-xs py-2 px-2.5 rounded-xl text-red-600 dark:text-red-400 cursor-pointer focus:bg-red-50 dark:focus:bg-red-950/30 font-medium"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              {/* Desktop / Laptop: Direct Log In & Sign Up buttons */}
              <div className="hidden sm:flex items-center gap-1.5 md:gap-2">
                <Link
                  href="/login"
                  className="text-xs sm:text-sm font-medium px-3 py-1.5 text-slate-800 dark:text-slate-200 hover:text-primary transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/register/personal"
                  className="text-xs sm:text-sm font-medium px-4 py-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 rounded-full transition-all shadow-xs"
                >
                  Sign Up
                </Link>
              </div>

              {/* Mobile View: Profile Icon with Guest Mode Popup */}
              <div className="sm:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="flex items-center justify-center w-8 h-8 rounded-full bg-white/85 dark:bg-zinc-800/85 hover:bg-white dark:hover:bg-zinc-800 border border-white/70 dark:border-zinc-700 text-slate-700 dark:text-slate-200 transition-all focus:outline-none shadow-2xs group cursor-pointer"
                      aria-label="Guest Profile"
                      title="Guest Profile"
                    >
                      <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-zinc-700 flex items-center justify-center text-slate-600 dark:text-slate-300 group-hover:bg-primary/15 group-hover:text-primary transition-colors">
                        <User className="w-3.5 h-3.5" />
                      </div>
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    className="w-56 p-2.5 rounded-2xl border border-slate-200/90 dark:border-zinc-800 shadow-xl bg-white dark:bg-zinc-950 z-50 animate-in fade-in-0 zoom-in-95 duration-150"
                  >
                    <div className="px-1 pb-2 border-b border-slate-100 dark:border-zinc-800 mb-2">
                      <span className="text-xs font-semibold text-slate-800 dark:text-zinc-200">Guest Mode</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href="/login"
                        className="flex items-center justify-center py-2 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-zinc-850 dark:hover:bg-zinc-800 text-slate-800 dark:text-zinc-200 text-xs font-medium transition-colors"
                      >
                        Log In
                      </Link>

                      <Link
                        href="/register/personal"
                        className="flex items-center justify-center py-2 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-medium transition-colors shadow-xs"
                      >
                        Sign Up
                      </Link>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          )}

          {/* Far Right: Animated Burger Menu Toggle (Matching Homepage Layout) */}
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden relative z-50 w-9 h-9 flex items-center justify-center text-slate-800 dark:text-slate-200 focus:outline-none rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors shrink-0"
            aria-label="Toggle navigation menu"
          >
            <div className="relative w-4 h-3.5">
              <motion.span
                animate={isMobileSidebarOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="absolute top-0 left-0 w-full h-0.5 bg-current rounded-full origin-center"
              />
              <motion.span
                animate={isMobileSidebarOpen ? { opacity: 0, x: 20 } : { opacity: 1, x: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="absolute top-[6px] left-0 w-full h-0.5 bg-current rounded-full"
              />
              <motion.span
                animate={isMobileSidebarOpen ? { rotate: -45, y: -6, width: '100%' } : { rotate: 0, y: 0, width: '50%' }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="absolute bottom-0 left-0 h-0.5 bg-current rounded-full origin-center"
              />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
