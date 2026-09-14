'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Stethoscope,
  Scissors,
  GraduationCap,
  Utensils,
  Pill,
  ShoppingBag,
  Car,
  Plane,
  Hotel,
  ShieldCheck,
  FileText,
  MessageSquare,
  HeartHandshake,
  PartyPopper,
  Calendar,
  Luggage,
  Package,
  PawPrint,
  LogOut,
  User,
  X,
  Building2,
  Clock,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

export interface ServiceCategory {
  id: string;
  label: string;
  tabs: {
    id: string;
    label: string;
    icon: React.ElementType;
    badge?: string;
  }[];
}

// Dedicated ZOODO VET Navigation
export const VET_PORTAL_CATEGORIES: ServiceCategory[] = [
  {
    id: 'care',
    label: 'Vet Care',
    tabs: [
      { id: 'find-vet', label: 'Find Vet', icon: Stethoscope },
      { id: 'find-hospital', label: 'Find Hospital', icon: Building2 },
      { id: 'appointments', label: 'Appointments', icon: Calendar, badge: 'Live' },
      { id: 'medical-history', label: 'Medical History', icon: FileText, badge: 'Rx' },
    ],
  },
  {
    id: 'care',
    label: 'Account & Settings',
    tabs: [
      { id: 'pets', label: 'My Pets', icon: PawPrint },
      { id: 'settings', label: 'Profile & Settings', icon: User },
    ],
  },
];

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'care',
    label: 'Care & Wellness',
    tabs: [
      { id: 'veterinary', label: 'Veterinary Care', icon: Stethoscope },
      { id: 'grooming', label: 'Grooming & Spa', icon: Scissors },
      { id: 'training', label: 'Training & Behavior', icon: GraduationCap },
    ],
  },
  {
    id: 'shopping',
    label: 'Pet Shopping',
    tabs: [
      { id: 'food', label: 'Pet Food', icon: Utensils },
      { id: 'pharmacy', label: 'Pet Pharmacy', icon: Pill, badge: 'Rx' },
      { id: 'essentials', label: 'Pet Essentials', icon: ShoppingBag },
    ],
  },
  {
    id: 'travel',
    label: 'Travel & Stay',
    tabs: [
      { id: 'taxi', label: 'Pet Taxi', icon: Car },
      { id: 'flight', label: 'Flight Relocation', icon: Plane },
      { id: 'hotel', label: 'Hotels & Resorts', icon: Hotel },
    ],
  },
  {
    id: 'insurance',
    label: 'Insurance & Protection',
    tabs: [
      { id: 'plans', label: 'Coverage Plans', icon: ShieldCheck },
      { id: 'claims', label: 'File / Track Claims', icon: FileText },
    ],
  },
  {
    id: 'community',
    label: 'Community & Social',
    tabs: [
      { id: 'forums', label: 'Discussions & Q&A', icon: MessageSquare },
      { id: 'adoption', label: 'Adoption & Rescue', icon: HeartHandshake },
      { id: 'events', label: 'Events & Meetups', icon: PartyPopper },
    ],
  },
  {
    id: 'activity',
    label: 'My Account & Activity',
    tabs: [
      { id: 'appointments', label: 'Appointments', icon: Calendar, badge: 'Live' },
      { id: 'bookings', label: 'Travel Bookings', icon: Luggage },
      { id: 'orders', label: 'My Orders', icon: Package },
      { id: 'pets', label: 'My Pets', icon: PawPrint },
      { id: 'records', label: 'Health Records', icon: FileText, badge: 'Rx' },
    ],
  },
];

interface ServicesAppSidebarProps {
  activeCategory: string;
  activeTab: string;
  onSelectTab: (categoryId: string, tabId: string) => void;
  onCloseMobile?: () => void;
}

export default function ServicesAppSidebar({
  activeCategory,
  activeTab,
  onSelectTab,
  onCloseMobile,
}: ServicesAppSidebarProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const initials = `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`.toUpperCase() || 'ZU';

  // Determine if we are in ZOODO VET mode
  const isVetPortal =
    activeCategory === 'vet' ||
    activeCategory === 'care' ||
    activeCategory === 'clinical' ||
    [
      'veterinary',
      'find-vet',
      'find-hospital',
      'appointments',
      'medical-history',
      'records',
      'pets',
      'settings',
      'clinic',
      'home',
      'emergency',
    ].includes(activeTab);

  // Normalize active tab for selection highlight
  const normalizedActiveTab = (() => {
    if (activeTab === 'veterinary' || activeTab === 'clinic' || activeTab === 'home' || activeTab === 'emergency') {
      return 'find-vet';
    }
    if (activeTab === 'records') return 'medical-history';
    return activeTab;
  })();

  const categoriesToDisplay = isVetPortal ? VET_PORTAL_CATEGORIES : SERVICE_CATEGORIES;

  const handleTabClick = (categoryId: string, tabId: string) => {
    onSelectTab(categoryId, tabId);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <aside className="w-full sm:w-60 shrink-0 h-full flex flex-col bg-white dark:bg-zinc-900 border-r border-slate-200/80 dark:border-zinc-800 select-none overflow-hidden font-ui">
      {/* Mobile Drawer Close Header */}
      {onCloseMobile && (
        <div className="px-4 py-3.5 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between lg:hidden">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Navigation</span>
          <button
            onClick={onCloseMobile}
            className="p-1 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Close navigation"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Categories Navigation */}
      <nav className="flex-1 px-3 py-3 space-y-4 overflow-y-auto">
        {categoriesToDisplay.map((category, catIdx) => (
          <div key={category.id} className="space-y-0.5">
            <motion.div
              initial={onCloseMobile ? { opacity: 0, x: -12 } : false}
              animate={onCloseMobile ? { opacity: 1, x: 0 } : false}
              transition={onCloseMobile ? { delay: catIdx * 0.06 + 0.04, duration: 0.22 } : undefined}
              className="px-3 pt-3 pb-1"
            >
              <p className="font-ui text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-500 select-none">
                {category.label}
              </p>
            </motion.div>

            <div className="space-y-0.5">
              {category.tabs.map((tab, tabIdx) => {
                const Icon = tab.icon;
                const isSelected = normalizedActiveTab === tab.id;

                return (
                  <motion.button
                    key={tab.id}
                    initial={onCloseMobile ? { opacity: 0, x: -16 } : false}
                    animate={onCloseMobile ? { opacity: 1, x: 0 } : false}
                    transition={onCloseMobile ? { delay: (catIdx * 3 + tabIdx) * 0.035 + 0.08, duration: 0.25, ease: 'easeOut' } : undefined}
                    onClick={() => handleTabClick(category.id, tab.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] font-normal transition-all ${
                      isSelected
                        ? 'bg-primary/10 text-slate-900 dark:text-white'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{tab.label}</span>
                    </div>

                    {tab.badge && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          isSelected
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Sidebar Footer: User / Profile or Back link */}
      <motion.div
        initial={onCloseMobile ? { opacity: 0, y: 15 } : false}
        animate={onCloseMobile ? { opacity: 1, y: 0 } : false}
        transition={onCloseMobile ? { delay: 0.25, duration: 0.25 } : undefined}
        className="px-3 py-3 border-t border-slate-100 dark:border-zinc-800 space-y-1"
      >
        {isAuthenticated ? (
          <div className="flex items-center justify-between px-2 py-1">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              title="Log out"
              className="p-1.5 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between px-2 py-1.5 text-xs text-muted-foreground">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-slate-400 shrink-0">
                <User className="w-3.5 h-3.5" />
              </div>
              <span className="font-medium text-slate-600 dark:text-slate-400 truncate">Guest Mode</span>
            </div>
            <Link
              href="/login"
              className="text-[11px] font-semibold text-primary hover:underline shrink-0"
            >
              Sign In
            </Link>
          </div>
        )}
      </motion.div>
    </aside>
  );
}
