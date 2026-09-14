'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Video,
  Building2,
  Home as HomeIcon,
  AlertTriangle,
  Star,
  Clock,
  ShieldCheck,
  Briefcase,
  CheckCircle,
  Filter,
  ArrowRight,
  PhoneCall,
  Sparkles,
  Search,
  Car,
  Plane,
  Hotel,
  Pill,
  Utensils,
  ShoppingBag,
  HeartHandshake,
  MessageSquare,
  Shield,
  Scissors,
  GraduationCap,
  Calendar,
  Luggage,
  Package,
  PawPrint,
  FileText,
  Plus,
  Check,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  MapPin,
  X,
  Save,
  Download,
  Share2,
  ThumbsUp,
  SlidersHorizontal,
  Navigation,
  User,
  ArrowUpDown,
  Stethoscope,
  Activity,
  Award,
  VideoOff,
  Bell,
  CheckCheck,
  Globe,
  Compass,
  Loader2,
  Map,
  Edit3,
  Trash2,
  Camera,
  Mail,
  Phone,
  LogIn,
  UserPlus,
  LogOut,
  Info,
} from 'lucide-react';
import ServicesAppHeader from '@/components/portal/ServicesAppHeader';
import ServicesAppSidebar, { VET_PORTAL_CATEGORIES, SERVICE_CATEGORIES } from '@/components/portal/ServicesAppSidebar';
import AuthPromptModal from '@/components/portal/AuthPromptModal';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

// Import all 21 vet photos from vet care section
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
import vetAndrew from '@/assets/vets/andrew.png';
import vetEmmaStone from '@/assets/vets/ema stone -.png';
import vetWeeknd from '@/assets/vets/weekend.png';

// Dynamic Worldwide Geocoding & Location Hierarchy (Photon / OpenStreetMap API)
export interface LocationItem {
  id: string;
  name: string;
  city?: string;
  state?: string;
  country: string;
  countryCode?: string;
  type: 'city' | 'state' | 'country';
  displayTitle: string;
  displaySubtitle: string;
}

// Complete Doctor Directory - All 21 Doctors with OG Character Personas & Real Specialties
const ONLINE_VETS = [
  // 1. Dr. Pawbert Downey Jr. (Bangalore / RT Nagar)
  {
    id: 1,
    name: 'Dr. Pawbert Downey Jr.',
    gender: 'Male',
    specialization: 'Veterinary Dermatologist & Hair Care',
    experience: '18 years',
    rating: 4.9,
    reviews: 1420,
    satisfaction: '90%',
    storiesCount: 147,
    education: 'Stark Vet Academy, MVSc Veterinary Dermatology',
    languages: ['English', 'Kannada', 'Hindi'],
    isOnline: true,
    waitTime: 'Available Today',
    fee: '₹600',
    consultationType: 'In-Clinic & Video',
    image: vetRDJ,
    species: ['Dogs', 'Cats'],
    badge: 'Top Dermatologist',
    area: 'RT Nagar',
    city: 'Bangalore',
    state: 'Karnataka',
    country: 'India',
    clinicName: 'Stark Pet Skin & Hair Clinic',
    clinicAddress: 'RT Nagar, Bangalore, Karnataka, India',
    consultModes: ['video', 'clinic', 'home'],
    symptoms: ['Skin Rash', 'Hair Fall', 'Itching', 'Ear Infection', 'Allergies'],
    bookingMessage: "Proof that Dr. Pawbert has a heart... for animals.\nJarvis says I'm fully booked.\nHit notify and he'll call you back.\nLove you 3000!",
  },
  // 2. Dr. Emma Paws (London)
  {
    id: 2,
    name: 'Dr. Emma Paws',
    gender: 'Female',
    specialization: 'Small Animal Surgeon & Orthopedics',
    experience: '15 years',
    rating: 4.9,
    reviews: 1150,
    satisfaction: '98%',
    storiesCount: 162,
    education: 'Hogwarts Vet School, FRCVS',
    languages: ['English', 'French'],
    isOnline: true,
    waitTime: 'Available Today',
    fee: '£65',
    consultationType: 'HD Video Call',
    image: vetEmma,
    species: ['Dogs', 'Cats', 'Rabbits'],
    badge: 'Orthopedic Surgeon',
    area: 'Camden',
    city: 'London',
    state: 'England',
    country: 'United Kingdom',
    clinicName: 'Camden Animal Hospital',
    clinicAddress: 'Camden, London, UK • Available Worldwide Online',
    consultModes: ['video', 'clinic', 'home'],
    symptoms: ['Limping', 'Joint Fracture', 'Cruciate Ligament', 'Hip Dysplasia', 'General Medicine'],
    bookingMessage: "Expecto Patronum!\nMy schedule is cursed - fully booked.\nSend your Patronus to the waitlist,\nI'll Apparate when available.",
  },
  // 3. Dr. King Beakhan (Mumbai)
  {
    id: 3,
    name: 'Dr. King Beakhan',
    gender: 'Male',
    specialization: 'General Practice & Preventive Pet Wellness',
    experience: '24 years',
    rating: 4.9,
    reviews: 2300,
    satisfaction: '96%',
    storiesCount: 210,
    education: 'Bombay Veterinary College, MVSc Medicine',
    languages: ['English', 'Hindi', 'Marathi'],
    isOnline: true,
    waitTime: 'Available Today',
    fee: '₹800',
    consultationType: 'In-Clinic & Video',
    image: vetSRK,
    species: ['Dogs', 'Cats', 'Birds'],
    badge: 'Preventive Wellness',
    area: 'Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    clinicName: 'Crown Veterinary Specialty Clinic',
    clinicAddress: 'Bandra West, Mumbai, Maharashtra, India',
    consultModes: ['video', 'clinic', 'home'],
    symptoms: ['General Checkup', 'Vaccination', 'Puppy Care', 'Fever', 'Digestive Health'],
    bookingMessage: "Palat... palat... palat!\nYou turned around but I'm still not available.\nHit notify and wait like Simran did.",
  },
  // 4. Dr. Goat Pawmnaldo (Miami)
  {
    id: 4,
    name: 'Dr. Goat Pawmnaldo',
    gender: 'Male',
    specialization: 'Veterinary Sports Medicine & Canine Rehabilitation',
    experience: '16 years',
    rating: 4.9,
    reviews: 1280,
    satisfaction: '95%',
    storiesCount: 175,
    education: 'Sporting Vet Lisbon, CCRP Certified',
    languages: ['Portuguese', 'English', 'Spanish'],
    isOnline: true,
    waitTime: 'Available Today',
    fee: '$90',
    consultationType: 'In-Clinic & Video',
    image: vetRonaldo,
    species: ['Dogs', 'Horses'],
    badge: 'Athletic Rehab',
    area: 'Brickell',
    city: 'Miami',
    state: 'Florida',
    country: 'USA',
    clinicName: 'Miami Pet Wellness & Physio Hospital',
    clinicAddress: 'Brickell, Miami, Florida, USA',
    consultModes: ['video', 'clinic'],
    symptoms: ['Agility Training', 'Joint Rehab', 'Limping', 'Ligament Repair', 'Mobility'],
    bookingMessage: "SIUUUUU!\nI'm the GOAT but even GOATs need rest.\nFully booked - Hit notify and maybe I'll respond before I retire... again.",
  },
  // 5. Dr. Alexandra Pawdario (LA)
  {
    id: 5,
    name: 'Dr. Alexandra Pawdario',
    gender: 'Female',
    specialization: 'Veterinary Ophthalmologist & Microsurgery',
    experience: '12 years',
    rating: 4.9,
    reviews: 940,
    satisfaction: '97%',
    storiesCount: 140,
    education: 'UC Davis School of Vet Medicine, DACVO',
    languages: ['English'],
    isOnline: true,
    waitTime: 'Available in ~20 mins',
    fee: '$95',
    consultationType: 'HD Video Call',
    image: vetAlex,
    species: ['Dogs', 'Cats'],
    badge: 'Eye Specialist',
    area: 'Beverly Hills',
    city: 'Los Angeles',
    state: 'California',
    country: 'USA',
    clinicName: 'Pacific Animal Eye Specialty Clinic',
    clinicAddress: 'Beverly Hills, Los Angeles, California, USA',
    consultModes: ['video', 'clinic', 'home'],
    symptoms: ['Corneal Ulcer', 'Cataract Check', 'Conjunctivitis', 'Vision Loss', 'Glaucoma'],
    bookingMessage: "People say my eyes are mesmerizing.\nThey could cure anything... except my fully booked schedule.\nHit notify and try not to stare.",
  },
  // 6. Dr. Pawmitabh Bachchan (Mumbai)
  {
    id: 6,
    name: 'Dr. Pawmitabh Bachchan',
    gender: 'Male',
    specialization: 'Senior Veterinary Surgeon & Oncology Consultant',
    experience: '32 years',
    rating: 5.0,
    reviews: 3400,
    satisfaction: '99%',
    storiesCount: 320,
    education: 'Dean Emeritus, MVSc Surgery, PhD Veterinary Oncology',
    languages: ['English', 'Hindi'],
    isOnline: false,
    waitTime: 'In-Clinic Slot Tomorrow',
    fee: '₹1,200',
    consultationType: 'In-Clinic',
    image: vetAB,
    species: ['Dogs', 'Cats', 'Horses'],
    badge: 'Senior Consultant',
    area: 'Juhu',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    clinicName: 'Juhu Super Specialty Pet Hospital',
    clinicAddress: 'Juhu, Mumbai, Maharashtra, India',
    consultModes: ['video', 'clinic', 'home'],
    symptoms: ['Complex Surgery', 'Second Opinion', 'Oncology', 'Geriatric Pet Care'],
    bookingMessage: "Parampara, Pratishtha, Anushasan!\nJaya says no appointments...\nRekha might help - Hit notify.\nMaa ka bharosa... AAAAGGG!!",
  },
  // 7. Dr. Ana de Paws (LA)
  {
    id: 7,
    name: 'Dr. Ana de Paws',
    gender: 'Female',
    specialization: 'Feline Medicine Specialist & General Practice',
    experience: '9 years',
    rating: 4.8,
    reviews: 820,
    satisfaction: '96%',
    storiesCount: 112,
    education: 'Cornell University College of Veterinary Medicine, DVM',
    languages: ['English', 'Spanish'],
    isOnline: true,
    waitTime: 'Available Today',
    fee: '$75',
    consultationType: 'HD Video Call',
    image: vetAna,
    species: ['Cats', 'Dogs'],
    badge: 'Feline Specialist',
    area: 'Silver Lake',
    city: 'Los Angeles',
    state: 'California',
    country: 'USA',
    clinicName: 'Silver Lake Feline & Pet Care Center',
    clinicAddress: 'Silver Lake, Los Angeles, California, USA',
    consultModes: ['video', 'clinic', 'home'],
    symptoms: ['Checkups', 'Vaccination', 'Feline Nutrition', 'Vomiting', 'Hairballs'],
    bookingMessage: "Paloma here! Booked for three weeks... actually three months.\nNo time to die - Hit notify, 007 will call back.",
  },
  // 8. Dr. Henry Hoofill (New York)
  {
    id: 8,
    name: 'Dr. Henry Hoofill',
    gender: 'Male',
    specialization: 'Veterinary Critical Care & Emergency Trauma',
    experience: '17 years',
    rating: 4.9,
    reviews: 1150,
    satisfaction: '98%',
    storiesCount: 155,
    education: 'Penn Vet, DACVECC Board Certified',
    languages: ['English'],
    isOnline: true,
    waitTime: 'Available Today',
    fee: '$110',
    consultationType: 'HD Video Call',
    image: vetHenry,
    species: ['Dogs', 'Cats', 'Horses'],
    badge: 'Critical Care',
    area: 'Manhattan',
    city: 'New York',
    state: 'New York',
    country: 'USA',
    clinicName: 'Manhattan Animal Medical Hospital',
    clinicAddress: 'Manhattan, New York, NY, USA',
    consultModes: ['video', 'clinic', 'home'],
    symptoms: ['Acute Trauma', 'Spine Injury', 'Hip Dysplasia', 'Critical Care', 'Arthritis'],
    bookingMessage: "Krypton exploded, so did my availability.\nZero slots available, Man of Steel fully booked.\nHit notify, I'll cape back to you.",
  },
  // 9. Dr. Meowdison Beer (LA)
  {
    id: 9,
    name: 'Dr. Meowdison Beer',
    gender: 'Female',
    specialization: 'Veterinary Behavioral Medicine & Anxiety Care',
    experience: '7 years',
    rating: 4.8,
    reviews: 690,
    satisfaction: '94%',
    storiesCount: 95,
    education: 'Tufts Cummings School of Veterinary Medicine, DACVB',
    languages: ['English'],
    isOnline: true,
    waitTime: 'Available Today',
    fee: '$80',
    consultationType: 'HD Video Call',
    image: vetMadison,
    species: ['Cats', 'Dogs'],
    badge: 'Behavior Specialist',
    area: 'West Hollywood',
    city: 'Los Angeles',
    state: 'California',
    country: 'USA',
    clinicName: 'West Hollywood Pet Behavior Center',
    clinicAddress: 'West Hollywood, Los Angeles, California, USA',
    consultModes: ['video', 'clinic', 'home'],
    symptoms: ['Anxiety Relief', 'Noise Phobia', 'Separation Anxiety', 'Aggression Management'],
    bookingMessage: "Baby I'm a wreck... and so is my schedule!\nHit notify, I'll sing your pet a lullaby when I'm free.",
  },
  // 10. Dr. Aishscalya Rai (Mumbai)
  {
    id: 10,
    name: 'Dr. Aishscalya Rai',
    gender: 'Female',
    specialization: 'Small Animal Cardiology & Diagnostic Ultrasound',
    experience: '19 years',
    rating: 4.9,
    reviews: 1900,
    satisfaction: '97%',
    storiesCount: 180,
    education: 'Madras Veterinary College, MVSc Cardiology',
    languages: ['English', 'Hindi', 'Tamil'],
    isOnline: true,
    waitTime: 'Available Today',
    fee: '₹900',
    consultationType: 'HD Video Call',
    image: vetAish,
    species: ['Dogs', 'Cats'],
    badge: 'Cardiologist',
    area: 'Worli',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    clinicName: 'Worli Pet Heart & Diagnostic Clinic',
    clinicAddress: 'Worli, Mumbai, Maharashtra, India',
    consultModes: ['video', 'clinic', 'home'],
    symptoms: ['Heart Murmur', 'Chronic Cough', 'Echocardiogram', 'Cardiomegaly', 'Hypertension'],
    bookingMessage: "Booked till Cannes and beyond.\nNo slots right now - Tap Notify!\nThe Comeback will be cinematic.",
  },
  // 11. Dr. Salmon Bhaww (Mumbai)
  {
    id: 11,
    name: 'Dr. Salmon Bhaww',
    gender: 'Male',
    specialization: 'Orthopedic Surgery & Joint Reconstruction',
    experience: '26 years',
    rating: 4.8,
    reviews: 1820,
    satisfaction: '95%',
    storiesCount: 145,
    education: 'KVAFSU Bangalore, MVSc Veterinary Surgery',
    languages: ['English', 'Hindi'],
    isOnline: false,
    waitTime: 'Next Slot in 45 mins',
    fee: '₹850',
    consultationType: 'In-Clinic',
    image: vetSalman,
    species: ['Dogs'],
    badge: 'Joint & Spine',
    area: 'Bandra',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    clinicName: 'Galaxy Veterinary Hospital',
    clinicAddress: 'Bandra, Mumbai, Maharashtra, India',
    consultModes: ['clinic'],
    symptoms: ['Bone Fractures', 'Joint Surgery', 'Knee Dislocation', 'Heavy Breed Mobility'],
    bookingMessage: "Driving the car... might take a while.\nParking on the sidewalk takes skill.\nHit Notify! Being Human takes time.\n(P.S. Don't sleep on the pavement).",
  },
  // 12. Dr. Kat Beaks (Mumbai)
  {
    id: 12,
    name: 'Dr. Kat Beaks',
    gender: 'Female',
    specialization: 'Veterinary Clinical Nutrition & Metabolic Health',
    experience: '14 years',
    rating: 4.8,
    reviews: 970,
    satisfaction: '96%',
    storiesCount: 130,
    education: 'University of Glasgow Vet School, Certified Pet Nutritionist',
    languages: ['English', 'Hindi'],
    isOnline: true,
    waitTime: 'Available Today',
    fee: '₹700',
    consultationType: 'HD Video Call',
    image: vetKat,
    species: ['Dogs', 'Cats'],
    badge: 'Clinical Dietitian',
    area: 'Andheri West',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    clinicName: 'PurePaws Clinical Nutrition Clinic',
    clinicAddress: 'Andheri West, Mumbai, Maharashtra, India',
    consultModes: ['video', 'clinic', 'home'],
    symptoms: ['Diet Planning', 'Weight Loss', 'Renal Diet', 'Food Allergies', 'Gastroenterology'],
    bookingMessage: "Sheila Here!\nJab Tak Hai Jaan.... I'll treat Animals!\nBut my schedule went Bang Bang!\nTap Notify!",
  },
  // 13. Dr. Pupper Reeves (LA)
  {
    id: 13,
    name: 'Dr. Pupper Reeves',
    gender: 'Male',
    specialization: 'Canine Emergency Medicine & Post-Surgical Care',
    experience: '22 years',
    rating: 5.0,
    reviews: 2100,
    satisfaction: '99%',
    storiesCount: 195,
    education: 'Colorado State University DVM, Emergency Fellowship',
    languages: ['English'],
    isOnline: true,
    waitTime: 'Available Today',
    fee: '$95',
    consultationType: 'HD Video Call',
    image: vetKeanu,
    species: ['Dogs'],
    badge: 'Emergency Medicine',
    area: 'Hollywood Hills',
    city: 'Los Angeles',
    state: 'California',
    country: 'USA',
    clinicName: 'Guardian Pet Emergency Center',
    clinicAddress: 'Hollywood Hills, Los Angeles, California, USA',
    consultModes: ['video', 'clinic', 'home'],
    symptoms: ['Trauma Recovery', 'Severe Wounds', 'Critical Care', 'Pain Management', 'Sepsis'],
    bookingMessage: "Someone touched his Dog.\nHe is currently 'resolving' the issue with a pencil.\nAppointment? Hit Notify if you dare. (Run.)",
  },
  // 14. Dr. Christian Tail (London)
  {
    id: 14,
    name: 'Dr. Christian Tail',
    gender: 'Male',
    specialization: 'Veterinary Critical Care & Nocturnal Emergency',
    experience: '20 years',
    rating: 4.9,
    reviews: 1320,
    satisfaction: '97%',
    storiesCount: 160,
    education: 'University of Edinburgh Royal (Dick) Vet School, MRCVS',
    languages: ['English'],
    isOnline: false,
    waitTime: 'Night Emergency On-Call',
    fee: '£75',
    consultationType: 'Emergency',
    image: vetBale,
    species: ['Dogs', 'Cats'],
    badge: 'Night ICU',
    area: 'Kensington',
    city: 'London',
    state: 'England',
    country: 'United Kingdom',
    clinicName: 'Kensington 24/7 Animal Emergency Hospital',
    clinicAddress: 'Kensington, London, England, UK',
    consultModes: ['video', 'clinic', 'home'],
    symptoms: ['Emergency Surgery', 'Toxin Ingestion', 'Gastric Torsion', 'Intensive Care'],
    bookingMessage: "Saving pets from Gotham's streets,\nIt's not who I am underneath,\nbut what I do that defines me.\nHit Notify - I'll connect when I'm free.",
  },
  // 15. Dr. Millie Tabby Brown (Nashville)
  {
    id: 15,
    name: 'Dr. Millie Tabby Brown',
    gender: 'Female',
    specialization: 'Pediatric & Adolescent Pet Care Specialist',
    experience: '8 years',
    rating: 4.8,
    reviews: 760,
    satisfaction: '96%',
    storiesCount: 90,
    education: 'University of Tennessee College of Veterinary Medicine',
    languages: ['English'],
    isOnline: true,
    waitTime: 'Available in ~15 mins',
    fee: '$70',
    consultationType: 'HD Video Call',
    image: vetMillie,
    species: ['Dogs', 'Cats'],
    badge: 'Puppy Care',
    area: 'Green Hills',
    city: 'Nashville',
    state: 'Tennessee',
    country: 'USA',
    clinicName: 'Green Hills Puppy & Kitten Wellness Clinic',
    clinicAddress: 'Green Hills, Nashville, Tennessee, USA',
    consultModes: ['video', 'clinic', 'home'],
    symptoms: ['Puppy Vaccinations', 'Growth Check', 'Deworming', 'Teething Problems', 'Puppy Behavior'],
    bookingMessage: "Vecna took my free time! Fully booked!\nHit notify before my nose bleeds again.",
  },
  // 16. Dr. Furiana Grande (Paris)
  {
    id: 16,
    name: 'Dr. Furiana Grande',
    gender: 'Female',
    specialization: 'Avian & Exotic Pet Medicine Specialist',
    experience: '11 years',
    rating: 4.9,
    reviews: 850,
    satisfaction: '96%',
    storiesCount: 85,
    education: 'École Nationale Vétérinaire d Alfort (ENVA), DVM',
    languages: ['English', 'French'],
    isOnline: true,
    waitTime: 'Available Today',
    fee: '€70',
    consultationType: 'HD Video Call',
    image: vetAriana,
    species: ['Dogs', 'Cats', 'Birds'],
    badge: 'Exotic & Avian',
    area: 'Le Marais',
    city: 'Paris',
    state: 'Île-de-France',
    country: 'France',
    clinicName: 'Clinique Vétérinaire des Nouveaux Animaux',
    clinicAddress: 'Le Marais, Paris, France • Available Worldwide Online',
    consultModes: ['video', 'clinic', 'home'],
    symptoms: ['Bird Feather Plucking', 'Beak Care', 'Parrot Respiratory Infection', 'Exotic Pet Health'],
    bookingMessage: "I've got 7 rings, but 0 open slots.\nFully booked - Hit Notify, Thank U, Next.",
  },
  // 17. Dr. Cillian Meowphy (LA)
  {
    id: 17,
    name: 'Dr. Cillian Meowphy',
    gender: 'Male',
    specialization: 'Veterinary Diagnostic Radiologist & Imaging',
    experience: '18 years',
    rating: 4.9,
    reviews: 730,
    satisfaction: '98%',
    storiesCount: 75,
    education: 'University College Dublin Vet Medicine, DACVR',
    languages: ['English', 'Irish'],
    isOnline: true,
    waitTime: 'Available Today',
    fee: '$105',
    consultationType: 'HD Video Call',
    image: vetCillian,
    species: ['Dogs', 'Cats'],
    badge: 'CT & Radiology',
    area: 'Pasadena',
    city: 'Los Angeles',
    state: 'California',
    country: 'USA',
    clinicName: 'Pasadena Veterinary Imaging & CT Center',
    clinicAddress: 'Pasadena, Los Angeles, California, USA',
    consultModes: ['video', 'clinic', 'home'],
    symptoms: ['X-Ray Scan', 'CT & MRI Review', 'Tumor Screening', 'Internal Diagnostics'],
    bookingMessage: "I have become... unavailable.\nThe destroyer of your plans.\nHit Notify... by order of the Peaky Blinders.",
  },
  // 18. Dr. Sadie Paws (New York)
  {
    id: 18,
    name: 'Dr. Sadie Paws',
    gender: 'Female',
    specialization: 'Small Animal Dermatology & Allergic Skin Diseases',
    experience: '6 years',
    rating: 4.8,
    reviews: 530,
    satisfaction: '95%',
    storiesCount: 65,
    education: 'Cornell University College of Veterinary Medicine',
    languages: ['English'],
    isOnline: true,
    waitTime: 'Available in ~10 mins',
    fee: '$80',
    consultationType: 'HD Video Call',
    image: vetSadie,
    species: ['Dogs', 'Cats'],
    badge: 'Dermatology',
    area: 'Brooklyn',
    city: 'New York',
    state: 'New York',
    country: 'USA',
    clinicName: 'Brooklyn Heights Pet Dermatology Clinic',
    clinicAddress: 'Brooklyn Heights, New York, NY, USA',
    consultModes: ['video', 'clinic', 'home'],
    symptoms: ['Chronic Scratching', 'Paw Licking', 'Flea Allergy Dermatitis', 'Yeast Infection'],
    bookingMessage: "Currently stuck in the Upside Down.\nTap notify, keep your walkie-talkie on.",
  },
  // 19. Dr. Peter Barker (New York)
  {
    id: 19,
    name: 'Dr. Peter Barker',
    gender: 'Male',
    specialization: 'Veterinary Dental Specialist & Oral Surgeon',
    experience: '13 years',
    rating: 4.8,
    reviews: 680,
    satisfaction: '97%',
    storiesCount: 60,
    education: 'Columbia Vet Health, DAVDC Dental Specialist',
    languages: ['English'],
    isOnline: true,
    waitTime: 'Available Today',
    fee: '$90',
    consultationType: 'HD Video Call',
    image: vetAndrew,
    species: ['Dogs', 'Cats', 'Reptiles'],
    badge: 'Veterinary Dentist',
    area: 'Queens',
    city: 'New York',
    state: 'New York',
    country: 'USA',
    clinicName: 'Queens Animal Dental & Oral Surgery Center',
    clinicAddress: 'Queens, New York, NY, USA',
    consultModes: ['video', 'clinic', 'home'],
    symptoms: ['Tartar Buildup', 'Gingivitis', 'Tooth Extraction', 'Broken Canine', 'Bad Breath'],
    bookingMessage: "I'm still trying to catch Gwen in every universe.\nHit notify, maybe I'll catch your request later.",
  },
  // 20. Dr. Gwen Stecat (New York)
  {
    id: 20,
    name: 'Dr. Gwen Stecat',
    gender: 'Female',
    specialization: 'Veterinary Clinical Pathologist & Oncology Diagnostics',
    experience: '11 years',
    rating: 4.8,
    reviews: 610,
    satisfaction: '97%',
    storiesCount: 55,
    education: 'Johns Hopkins Animal Sciences, PhD Clinical Pathology',
    languages: ['English'],
    isOnline: true,
    waitTime: 'Available Today',
    fee: '$100',
    consultationType: 'HD Video Call',
    image: vetEmmaStone,
    species: ['Dogs', 'Cats'],
    badge: 'Pathology & Lab',
    area: 'Upper West Side',
    city: 'New York',
    state: 'New York',
    country: 'USA',
    clinicName: 'Stacy Pet Oncology & Diagnostic Pathology Lab',
    clinicAddress: 'Upper West Side, New York, NY, USA',
    consultModes: ['video', 'clinic', 'home'],
    symptoms: ['Advanced Lab Tests', 'Blood Chemistry', 'Urinalysis', 'Biopsy Analysis', 'Lymphoma Check'],
    bookingMessage: "I won an Oscar for Poor Things,\nbut I have Poor Availability.\nNo slots - Tap Notify.",
  },
  // 21. Dr. The Woofnd (Toronto)
  {
    id: 21,
    name: 'Dr. The Woofnd',
    gender: 'Male',
    specialization: 'Nocturnal Critical Care & Emergency Physician',
    experience: '9 years',
    rating: 4.7,
    reviews: 510,
    satisfaction: '96%',
    storiesCount: 45,
    education: 'Ontario Veterinary College (Guelph), DVM',
    languages: ['English', 'French'],
    isOnline: true,
    waitTime: 'Available Late Night',
    fee: 'CA$85',
    consultationType: 'HD Video Call',
    image: vetWeeknd,
    species: ['Dogs', 'Cats'],
    badge: 'After-Hours ICU',
    area: 'Downtown',
    city: 'Toronto',
    state: 'Ontario',
    country: 'Canada',
    clinicName: 'Toronto 24-Hour Central Animal Hospital',
    clinicAddress: 'Downtown Toronto, Ontario, Canada',
    consultModes: ['video', 'clinic', 'home'],
    symptoms: ['Late Night Fevers', 'Nocturnal Cough', 'Midnight Emergency', 'Seizure Management', 'Intoxication'],
    bookingMessage: "I said ooh, I'm blinded by the waitlist.\nNo slots available - Tap Notify.",
  },
];

// Partner Clinic & Hospital Data
const CLINICS = [
  {
    id: 101,
    name: 'PetCare Super Specialty Hospital',
    type: 'Multi-Specialty Animal Hospital & 24/7 ICU',
    area: 'Indiranagar, Bangalore',
    distance: '2.4 km away',
    rating: 4.9,
    reviews: 890,
    satisfaction: '98%',
    storiesCount: 140,
    facilities: ['24/7 Emergency ICU', 'Digital X-Ray & Ultrasound', 'In-House Pathology Lab', 'Modular Operation Theater'],
    doctorsOnDuty: 5,
    timing: 'Open 24 Hours',
    fee: '₹600 (OPD)',
    phone: '+91 80 4123 9988',
    isEmergency: true,
  },
  {
    id: 102,
    name: 'Cessna Lifeline Veterinary Hospital',
    type: 'Advanced Veterinary Healthcare Center',
    area: 'Domlur, Bangalore',
    distance: '4.1 km away',
    rating: 4.8,
    reviews: 1240,
    satisfaction: '97%',
    storiesCount: 210,
    facilities: ['Advanced Ortho Surgery', 'Dental Scaling & Polishing', 'Pet Pharmacy', 'Inpatient Ward'],
    doctorsOnDuty: 4,
    timing: '8:00 AM - 10:00 PM',
    fee: '₹750 (OPD)',
    phone: '+91 80 4567 1122',
    isEmergency: false,
  },
  {
    id: 103,
    name: 'Healers Pet Hospital & Diagnostic Centre',
    type: 'Cardiac Diagnostics & Veterinary Imaging',
    area: 'Koramangala, Bangalore',
    distance: '3.2 km away',
    rating: 4.9,
    reviews: 620,
    satisfaction: '99%',
    storiesCount: 95,
    facilities: ['Cardiac Diagnostics (ECG)', 'Endoscopy', 'CT Scan for Pets', '24/7 Pharmacy'],
    doctorsOnDuty: 3,
    timing: '9:00 AM - 9:00 PM',
    fee: '₹650 (OPD)',
    phone: '+91 80 2345 6789',
    isEmergency: true,
  },
];

// Home Visit Vets Data
const HOME_VISIT_VETS = [
  {
    id: 201,
    name: 'Dr. Sameer Deshmukh',
    specialization: 'General Healthcare & Vaccinations at Doorstep',
    coverage: 'Indiranagar, Domlur & HAL, Bangalore',
    rating: 4.9,
    reviews: 420,
    satisfaction: '98%',
    storiesCount: 64,
    includes: ['Doorstep General Health Checkup', 'Annual Vaccinations & Deworming', 'Vital Health Card'],
    fee: '₹999 per visit',
    eta: 'Available in ~45 mins',
    image: vetHenry,
  },
  {
    id: 202,
    name: 'Dr. Priya Nambiar',
    specialization: 'Senior Pet Care & Post-Op Dressing',
    coverage: 'Koramangala & HSR Layout, Bangalore',
    rating: 4.8,
    reviews: 310,
    satisfaction: '97%',
    storiesCount: 48,
    includes: ['Elderly Pet Care', 'Post-Op Wound Dressing', 'Blood Sample Collection'],
    fee: '₹899 per visit',
    eta: 'Available Today 4:00 PM',
    image: vetEmma,
  },
];

// Emergency 24/7 Centers Data
const EMERGENCY_CENTERS = [
  {
    id: 301,
    name: 'National Pet Emergency Trauma Hospital',
    location: 'Central Ring Road • 1.2 km away',
    contact: '1800-PET-911',
    rating: 5.0,
    support: 'Immediate critical triage, oxygen chambers, blood transfusion on standby',
    status: 'High Readiness (3 trauma surgeons on duty)',
  },
  {
    id: 302,
    name: '24/7 Rapid Veterinary Emergency Response',
    location: 'Metro Junction • 3.5 km away',
    contact: '1800-EMERGENCY',
    rating: 4.9,
    support: 'Animal ambulance dispatch equipped with oxygen and cardiac monitors',
    status: 'Mobile Unit Available',
  },
];

// Mock Appointments Data
const MOCK_APPOINTMENTS = [
  {
    id: 'apt-01',
    doctor: 'Dr. Robert D. Jarvis',
    doctorImage: vetRDJ,
    specialization: 'General Vet Physician & Surgery',
    date: 'Today, Sep 6',
    time: '6:30 PM (In ~20 mins)',
    mode: 'video',
    status: 'Confirmed',
    pet: 'Bella (Golden Retriever)',
    fee: '₹499',
    clinic: 'PetCare Super Specialty Hospital',
    isLiveNow: true,
  },
  {
    id: 'apt-02',
    doctor: 'Dr. Emma Paws',
    doctorImage: vetEmma,
    specialization: 'Dermatology & Allergy Specialist',
    date: 'Tomorrow, Sep 7',
    time: '11:00 AM',
    mode: 'clinic',
    status: 'Scheduled',
    pet: 'Milo (British Shorthair)',
    fee: '₹599',
    clinic: 'Paws & Fur Advanced Skin Clinic, Domlur',
    isLiveNow: false,
  },
  {
    id: 'apt-03',
    doctor: 'Dr. Ana Armas',
    doctorImage: vetAna,
    specialization: 'Feline Internal Medicine',
    date: 'Aug 28, 2026',
    time: '4:00 PM',
    mode: 'video',
    status: 'Completed',
    pet: 'Milo',
    fee: '₹450',
    clinic: 'The Cat Care Sanctuary',
    isLiveNow: false,
    prescriptionId: 'RX-98214',
  },
];

// Mock Prescriptions Data
const MOCK_PRESCRIPTIONS = [
  {
    id: 'rx-101',
    title: 'Apoquel 16mg & Medicated Chlorhexidine Wash',
    diagnosis: 'Atopic Dermatitis & Contact Allergy',
    doctor: 'Dr. Emma Paws (VCI #89214)',
    date: 'Aug 28, 2026',
    pet: 'Bella',
    dosage: '1 tablet once daily for 14 days after meals',
    hash: '0x88c2...1109',
    status: 'Active',
  },
  {
    id: 'rx-102',
    title: 'Cerenia 24mg & Probiotic Gut Powder',
    diagnosis: 'Acute Gastroenteritis & Gastric Upset',
    doctor: 'Dr. Henry Cavendish',
    date: 'Jul 15, 2026',
    pet: 'Bella',
    dosage: '1 tablet for 3 days before meals',
    hash: '0x33b1...78ca',
    status: 'Completed',
  },
];

// Mock Vaccines Data
const MOCK_VACCINES = [
  {
    name: 'Nobivac DHPPi + L (7-in-1)',
    dateGiven: 'May 14, 2026',
    dueDate: 'May 14, 2027',
    doctor: 'Dr. Robert D. Jarvis',
    batchNo: 'NV-2026-99',
    status: 'Up to Date',
  },
  {
    name: 'Defensor 3 Anti-Rabies Vaccine',
    dateGiven: 'May 14, 2026',
    dueDate: 'May 14, 2027',
    doctor: 'Dr. Robert D. Jarvis',
    batchNo: 'RB-8812-IN',
    status: 'Up to Date',
  },
  {
    name: 'Bordetella Bronchiseptica (Kennel Cough)',
    dateGiven: 'Nov 10, 2025',
    dueDate: 'Nov 10, 2026',
    doctor: 'Dr. Alexandra D.',
    batchNo: 'KC-4491-A',
    status: 'Due in 2 months',
  },
];

function ServicesPortalContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, logout } = useAuth();

  // Route query params
  const paramCategory = searchParams.get('cat') || 'care';
  const paramTab = searchParams.get('tab') || 'find-vet';
  const paramType = searchParams.get('type');

  const [activeCategory, setActiveCategory] = useState(paramCategory);
  const [activeTab, setActiveTab] = useState(paramTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [locationSearchInput, setLocationSearchInput] = useState('');
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [openFilterDropdown, setOpenFilterDropdown] = useState<string | null>(null);
  const [activeTipNote, setActiveTipNote] = useState<{ vetId: number | string; mode: string } | null>(null);

  useEffect(() => {
    if (!activeTipNote) return;
    const timer = setTimeout(() => {
      setActiveTipNote(null);
    }, 2500);
    const handleDocClick = () => setActiveTipNote(null);
    window.addEventListener('click', handleDocClick);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('click', handleDocClick);
    };
  }, [activeTipNote]);

  const toggleFilterDropdown = (dropdownName: string) => {
    setOpenFilterDropdown((prev) => (prev === dropdownName ? null : dropdownName));
    setIsLocationDropdownOpen(false);
  };

  // Real GPS Geolocation Auto-detect with Instant Fallback
  const detectCurrentLocation = async () => {
    setIsDetectingLocation(true);

    const applyFallback = () => {
      try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
        if (tz.includes('Calcutta') || tz.includes('Kolkata') || tz.includes('India')) {
          setSelectedLocation('Mumbai, Maharashtra, India');
        } else if (tz.includes('London')) {
          setSelectedLocation('London, England, United Kingdom');
        } else if (tz.includes('Los_Angeles') || tz.includes('Pacific')) {
          setSelectedLocation('Los Angeles, California, United States');
        } else if (tz.includes('New_York') || tz.includes('Eastern')) {
          setSelectedLocation('New York City, New York, United States');
        } else if (tz.includes('Chicago') || tz.includes('Central')) {
          setSelectedLocation('Chicago, Illinois, United States');
        } else if (tz.includes('Toronto')) {
          setSelectedLocation('Toronto, Ontario, Canada');
        } else if (tz.includes('Paris') || tz.includes('France')) {
          setSelectedLocation('Paris, Île-de-France, France');
        } else if (tz.includes('Berlin')) {
          setSelectedLocation('Berlin, Berlin, Germany');
        } else if (tz.includes('Sydney') || tz.includes('Australia')) {
          setSelectedLocation('Sydney, New South Wales, Australia');
        } else if (tz.includes('Dubai')) {
          setSelectedLocation('Dubai, United Arab Emirates');
        } else if (tz.includes('Singapore')) {
          setSelectedLocation('Singapore');
        } else if (tz.includes('Tokyo')) {
          setSelectedLocation('Tokyo, Japan');
        } else {
          setSelectedLocation('All Locations');
        }
      } catch {
        setSelectedLocation('All Locations');
      }
      setIsLocationDropdownOpen(false);
      setLocationSearchInput('');
      setIsDetectingLocation(false);
    };

    if (typeof window === 'undefined' || !navigator.geolocation) {
      applyFallback();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const controller = new AbortController();
          const timer = setTimeout(() => controller.abort(), 4000);
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
            { signal: controller.signal }
          );
          clearTimeout(timer);
          if (res.ok) {
            const data = await res.json();
            const city = data.city || data.locality || data.principalSubdivision;
            const state = data.principalSubdivision || '';
            const country = data.countryName || '';
            const detected = [city, state, country].filter(Boolean).join(', ');
            if (detected) {
              setSelectedLocation(detected);
              setLocationSearchInput(detected);
              setIsLocationDropdownOpen(false);
              setIsDetectingLocation(false);
              return;
            }
          }
        } catch {
          // fallback
        }
        applyFallback();
      },
      () => {
        applyFallback();
      },
      { timeout: 5000, enableHighAccuracy: false }
    );
  };


  // Real-time Worldwide Geocoding (Photon / OpenStreetMap API - Any place in the world)
  const [liveLocationResults, setLiveLocationResults] = useState<LocationItem[]>([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);

  useEffect(() => {
    const q = locationSearchInput.trim();
    if (!q || q.length < 2) {
      setLiveLocationResults([]);
      setIsSearchingLocation(false);
      return;
    }

    setIsSearchingLocation(true);
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=12&lang=en`,
          { signal: controller.signal }
        );
        if (res.ok) {
          const data = await res.json();
          const items: LocationItem[] = [];
          const seen = new Set<string>();

          (data.features || []).forEach((feat: any, idx: number) => {
            const props = feat.properties || {};
            const name = props.name || props.city || props.state || props.country;
            if (!name) return;

            const state = props.state || props.county || '';
            const country = props.country || '';
            const key = `${name}-${state}-${country}`.toLowerCase();
            if (seen.has(key)) return;
            seen.add(key);

            const isCountry = props.osm_value === 'country' || props.type === 'country';
            const isState =
              props.osm_value === 'state' ||
              props.type === 'state' ||
              props.osm_value === 'province';
            const locType: 'city' | 'state' | 'country' = isCountry
              ? 'country'
              : isState
              ? 'state'
              : 'city';

            const subtitleParts = [state, country].filter(Boolean);
            const displaySubtitle = isCountry
              ? 'Country • Worldwide Teleconsultation'
              : subtitleParts.length > 0
              ? subtitleParts.join(', ')
              : 'Global Location';

            items.push({
              id: `photon-${props.osm_id || idx}-${name}`,
              name,
              city: props.city || (locType === 'city' ? name : undefined),
              state,
              country,
              countryCode: props.countrycode,
              type: locType,
              displayTitle: name,
              displaySubtitle,
            });
          });

          setLiveLocationResults(items);
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('Live geocoding error:', err);
        }
      } finally {
        setIsSearchingLocation(false);
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [locationSearchInput]);

  // Dynamic live geocoded location suggestions
  const locationSuggestions = useMemo(() => {
    return liveLocationResults;
  }, [liveLocationResults]);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isMobileSortOpen, setIsMobileSortOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState<any>(null);
  const [selectedVetForPopup, setSelectedVetForPopup] = useState<any | null>(null);
  const [isWaitlistNotified, setIsWaitlistNotified] = useState(false);

  // In-page filters matching Practo & MNC e-commerce exact UI
  const [consultTypeFilter, setConsultTypeFilter] = useState<'all' | 'video' | 'clinic' | 'home'>('all');
  const [genderFilter, setGenderFilter] = useState<'all' | 'male' | 'female'>('all');
  const [ratingFilter, setRatingFilter] = useState<'all' | '4.8' | '4.5' | '4.0'>('all');
  const [experienceFilter, setExperienceFilter] = useState<'all' | '5' | '10' | '15'>('all');
  const [onlyOnlineFilter, setOnlyOnlineFilter] = useState(false);
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'today'>('all');
  const [speciesFilter, setSpeciesFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'relevance' | 'fee_desc' | 'fee_asc' | 'rating_desc' | 'exp_desc'>('relevance');

  // Appointments subtab
  const [appointmentsSubTab, setAppointmentsSubTab] = useState<'upcoming' | 'past'>('upcoming');

  // Medical records subtab
  const [recordsSubTab, setRecordsSubTab] = useState<'prescriptions' | 'vaccines' | 'labs'>('prescriptions');

  // Personal profile state aligned with normal user registration (first, last, username, email) + optional contact/address
  const [personalProfile, setPersonalProfile] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || user?.phoneNumber || '',
    city: user?.city || '',
    address: user?.address || '',
  });
  const [profileSavedFeedback, setProfileSavedFeedback] = useState(false);

  // Sync profile when authenticated user is loaded or updated
  useEffect(() => {
    if (user) {
      setPersonalProfile((prev) => ({
        ...prev,
        firstName: user.firstName || prev.firstName,
        lastName: user.lastName || prev.lastName,
        username: user.username || prev.username,
        email: user.email || prev.email,
        phone: user.phone || user.phoneNumber || prev.phone,
        city: user.city || prev.city,
        address: user.address || prev.address,
      }));
    }
  }, [user]);

  // Pets state with real edit and management capabilities
  const [pets, setPets] = useState<any[]>([
    { id: '1', name: 'Bella', species: 'Dog', breed: 'Golden Retriever', gender: 'female', age: 3, ageUnit: 'Years', weight: 28, sterilized: true, microchip: '985141002349182', notes: 'Mild chicken allergy, up to date on DHPP vaccine.' },
    { id: '2', name: 'Milo', species: 'Cat', breed: 'British Shorthair', gender: 'male', age: 2, ageUnit: 'Years', weight: 4.5, sterilized: true, microchip: '985141005820199', notes: 'Indoor cat, requires sensitive stomach wet food.' },
  ]);
  const [addingPet, setAddingPet] = useState(false);
  const [newPet, setNewPet] = useState({ name: '', species: 'Dog', breed: '', gender: 'female', age: '', ageUnit: 'Years', weight: '', sterilized: false, notes: '' });

  // Consumer-grade profile completion calculation based on registration + optional additions
  const profileCompletion = useMemo(() => {
    let score = 0;
    const checks = {
      hasAccount: Boolean(personalProfile.firstName.trim() && personalProfile.email.trim()),
      hasUsername: Boolean(personalProfile.username.trim()),
      hasPhone: Boolean(personalProfile.phone.trim()),
      hasAddress: Boolean(personalProfile.address.trim() || personalProfile.city.trim()),
      hasPet: pets.length > 0,
    };

    if (checks.hasAccount) score += 40;
    if (checks.hasUsername) score += 10;
    if (checks.hasPhone) score += 20;
    if (checks.hasAddress) score += 15;
    if (checks.hasPet) score += 15;

    return {
      percentage: Math.min(score, 100),
      checks,
    };
  }, [personalProfile, pets]);

  // Pet editing state
  const [editingPetId, setEditingPetId] = useState<string | null>(null);
  const [editPetData, setEditPetData] = useState<any>({
    name: '',
    species: 'Dog',
    breed: '',
    gender: 'female',
    age: '',
    ageUnit: 'Years',
    weight: '',
    sterilized: false,
    notes: '',
  });

  const handleStartEditPet = (pet: any) => {
    setEditingPetId(pet.id);
    setEditPetData({
      name: pet.name,
      species: pet.species,
      breed: pet.breed || '',
      gender: pet.gender || 'female',
      age: pet.age,
      ageUnit: pet.ageUnit || 'Years',
      weight: pet.weight,
      sterilized: pet.sterilized ?? false,
      notes: pet.notes || '',
    });
  };

  const handleUpdatePet = () => {
    if (!editPetData.name.trim() || !editingPetId) return;
    setPets(
      pets.map((p) =>
        p.id === editingPetId
          ? {
              ...p,
              ...editPetData,
              age: Number(editPetData.age) || p.age,
              weight: Number(editPetData.weight) || p.weight,
            }
          : p
      )
    );
    setEditingPetId(null);
  };

  const handleDeletePet = (petId: string) => {
    if (confirm('Are you sure you want to remove this pet profile?')) {
      setPets(pets.filter((p) => p.id !== petId));
      if (editingPetId === petId) setEditingPetId(null);
    }
  };

  const handleSavePersonalProfile = () => {
    setProfileSavedFeedback(true);
    setTimeout(() => setProfileSavedFeedback(false), 3000);
  };

  // Synchronize state with URL params
  useEffect(() => {
    if (paramCategory) setActiveCategory(paramCategory);
    if (paramTab) setActiveTab(paramTab);
    if (paramType) {
      if (['video', 'clinic', 'home'].includes(paramType)) {
        setConsultTypeFilter(paramType as any);
      } else if (paramType === 'online') {
        setConsultTypeFilter('video');
      }
    }
  }, [paramCategory, paramTab, paramType]);

  const handleSelectTab = (categoryId: string, tabId: string) => {
    setActiveCategory(categoryId);
    setActiveTab(tabId);
    router.push(`/services?cat=${categoryId}&tab=${tabId}`, { scroll: false });
  };

  // Filtered doctors for Practo horizontal view
  const filteredDoctors = useMemo(() => {
    let result = [...ONLINE_VETS];

    // Location Filter (City, State, Country, or custom place)
    if (selectedLocation && selectedLocation !== 'All Locations') {
      const locQ = selectedLocation.toLowerCase().trim();
      result = result.filter((doc) => {
        const areaMatch = (doc as any).area ? ((doc as any).area.toLowerCase().includes(locQ) || locQ.includes((doc as any).area.toLowerCase())) : false;
        const cityMatch = doc.city.toLowerCase().includes(locQ) || locQ.includes(doc.city.toLowerCase());
        const stateMatch = doc.state ? (doc.state.toLowerCase().includes(locQ) || locQ.includes(doc.state.toLowerCase())) : false;
        const countryMatch =
          doc.country.toLowerCase().includes(locQ) ||
          locQ.includes(doc.country.toLowerCase()) ||
          (locQ.includes('usa') && doc.country === 'USA') ||
          (locQ.includes('united states') && doc.country === 'USA') ||
          (locQ.includes('uk') && doc.country === 'United Kingdom') ||
          (locQ.includes('united kingdom') && doc.country === 'United Kingdom') ||
          (locQ.includes('india') && doc.country === 'India') ||
          (locQ.includes('canada') && doc.country === 'Canada') ||
          (locQ.includes('france') && doc.country === 'France') ||
          (locQ.includes('germany') && doc.country === 'Germany') ||
          (locQ.includes('australia') && doc.country === 'Australia');
        const addressMatch = doc.clinicAddress.toLowerCase().includes(locQ);

        const isLocal = areaMatch || cityMatch || stateMatch || countryMatch || addressMatch;
        if (consultTypeFilter === 'clinic' || consultTypeFilter === 'home') {
          return isLocal;
        }
        return isLocal || doc.consultModes.includes('video');
      });
    }

    // Consult Format Filter (All, Video Consult, In-Clinic Visit, Home Visit)
    if (consultTypeFilter === 'video') {
      result = result.filter((doc) => doc.consultModes.includes('video'));
    } else if (consultTypeFilter === 'clinic') {
      result = result.filter((doc) => doc.consultModes.includes('clinic'));
    } else if (consultTypeFilter === 'home') {
      result = result.filter((doc) => doc.consultModes.includes('home'));
    }

    // Gender Filter
    if (genderFilter === 'male') {
      result = result.filter((doc) => doc.gender === 'Male');
    } else if (genderFilter === 'female') {
      result = result.filter((doc) => doc.gender === 'Female');
    }

    // Experience Filter
    if (experienceFilter === '5') {
      result = result.filter((doc) => parseInt(doc.experience) >= 5);
    } else if (experienceFilter === '10') {
      result = result.filter((doc) => parseInt(doc.experience) >= 10);
    } else if (experienceFilter === '15') {
      result = result.filter((doc) => parseInt(doc.experience) >= 15);
    }

    // Rating Filter (MNC Cumulative Threshold: e.g. Amazon, Google, Airbnb)
    if (ratingFilter === '4.8') {
      result = result.filter((doc) => doc.rating >= 4.8);
    } else if (ratingFilter === '4.5') {
      result = result.filter((doc) => doc.rating >= 4.5);
    } else if (ratingFilter === '4.0') {
      result = result.filter((doc) => doc.rating >= 4.0);
    }

    // Availability
    if (availabilityFilter === 'today' || onlyOnlineFilter) {
      result = result.filter(
        (doc) => doc.isOnline || doc.waitTime.toLowerCase().includes('today') || doc.waitTime.toLowerCase().includes('now')
      );
    }

    // Species
    if (speciesFilter !== 'all') {
      result = result.filter((doc) => doc.species.includes(speciesFilter));
    }

    // Search Query (Doctor Name, Specialization, Clinic Name, Symptoms)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (doc) =>
          doc.name.toLowerCase().includes(q) ||
          doc.specialization.toLowerCase().includes(q) ||
          doc.clinicName.toLowerCase().includes(q) ||
          doc.education.toLowerCase().includes(q) ||
          doc.city.toLowerCase().includes(q) ||
          (doc.state ? doc.state.toLowerCase().includes(q) : false) ||
          doc.country.toLowerCase().includes(q) ||
          doc.symptoms.some((s) => s.toLowerCase().includes(q))
      );
    }

    // Sorting: Relevance (top/default), Fee: High to Low, Fee: Low to High
    const parseFeeUSD = (str: string) => {
      const val = parseFloat(str.replace(/[^0-9.]/g, '')) || 0;
      if (str.includes('₹')) return val * 0.012;
      if (str.includes('£')) return val * 1.28;
      if (str.includes('€')) return val * 1.08;
      if (str.includes('CA$') || str.includes('C$')) return val * 0.74;
      return val;
    };

    if (sortBy === 'fee_desc') {
      result.sort((a, b) => parseFeeUSD(b.fee) - parseFeeUSD(a.fee));
    } else if (sortBy === 'fee_asc') {
      result.sort((a, b) => parseFeeUSD(a.fee) - parseFeeUSD(b.fee));
    } else if (sortBy === 'rating_desc') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'exp_desc') {
      result.sort((a, b) => (parseInt(b.experience) || 0) - (parseInt(a.experience) || 0));
    }

    return result;
  }, [selectedLocation, consultTypeFilter, genderFilter, experienceFilter, ratingFilter, availabilityFilter, onlyOnlineFilter, speciesFilter, searchQuery, sortBy]);

  // Total active filter count for notification badges (strictly filters, not search bar location)
  const activeFilterCount = useMemo(() => {
    return [
      consultTypeFilter !== 'all',
      genderFilter !== 'all',
      ratingFilter !== 'all',
      experienceFilter !== 'all',
      speciesFilter !== 'all',
    ].filter(Boolean).length;
  }, [consultTypeFilter, genderFilter, ratingFilter, experienceFilter, speciesFilter]);

  const handleConsultClick = (item: any) => {
    if (item?.bookingMessage) {
      setSelectedVetForPopup(item);
      setIsWaitlistNotified(false);
      return;
    }
    if (!isAuthenticated) {
      setSelectedDoctorForBooking(item);
      setIsAuthModalOpen(true);
    } else {
      alert(`Booking initiated for ${item.name || item.title || 'selected service'}...`);
    }
  };

  const handleSavePet = () => {
    if (!newPet.name.trim()) return;
    const petObj = { ...newPet, id: String(Date.now()), age: Number(newPet.age) || 1, weight: Number(newPet.weight) || 5, microchip: `985141${Math.floor(100000000 + Math.random() * 900000000)}` };
    setPets([...pets, petObj]);
    setAddingPet(false);
    setNewPet({ name: '', species: 'Dog', breed: '', gender: 'female', age: '', ageUnit: 'Years', weight: '', sterilized: false, notes: '' });
  };

  const isVetPortalMode =
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

  const mobileCategoriesToDisplay = isVetPortalMode ? VET_PORTAL_CATEGORIES : SERVICE_CATEGORIES;

  const mobileNormalizedActiveTab = (() => {
    if (activeTab === 'veterinary' || activeTab === 'clinic' || activeTab === 'home' || activeTab === 'emergency') {
      return 'find-vet';
    }
    if (activeTab === 'records') return 'medical-history';
    return activeTab;
  })();

  return (
    <div className="h-[100dvh] overflow-hidden flex flex-col bg-slate-50/80 dark:bg-zinc-950 font-ui text-foreground dashboard-ui">
      {/* Top Header with Animated Morphing Burger (z-50 stays above full screen overlay) */}
      <div className="shrink-0 z-50">
        <ServicesAppHeader
          activeCategory={activeCategory}
          activeTab={activeTab}
          onSearchChange={setSearchQuery}
          isMobileSidebarOpen={isMobileSidebarOpen}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          onNavigateTab={handleSelectTab}
        />
      </div>

      {/* Main Body Shell: Sidebar + Content Canvas */}
      <div className="flex-1 flex overflow-hidden max-w-[1920px] w-full mx-auto min-h-0 relative">
        {/* Desktop Sidebar (Persistent & Fixed in Height, Never Scrolls When Doctors Scroll) */}
        <div className="hidden lg:block h-full shrink-0">
          <ServicesAppSidebar
            activeCategory={activeCategory}
            activeTab={activeTab}
            onSelectTab={handleSelectTab}
          />
        </div>

        {/* Mobile Full-Screen Navigation Overlay (Exact Homepage Animation & Polish) */}
        <AnimatePresence>
          {isMobileSidebarOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="fixed inset-0 z-[45] bg-white dark:bg-zinc-950 overflow-y-auto pt-20 px-6 pb-8 flex flex-col justify-between [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] lg:hidden"
            >
              <div className="w-full max-w-md mx-auto flex flex-col h-full justify-between">
                {/* Navigation Sections */}
                <nav className="flex flex-col space-y-6 pt-2">
                  {mobileCategoriesToDisplay.map((category, catIdx) => (
                    <div key={category.id + '-' + catIdx} className="space-y-1.5">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 px-3">
                        {category.label}
                      </p>
                      <div className="space-y-1">
                        {category.tabs.map((tab, tabIdx) => {
                          const Icon = tab.icon;
                          const isSelected = mobileNormalizedActiveTab === tab.id;
                          const itemIdx = catIdx * 4 + tabIdx;

                          return (
                            <motion.div
                              key={tab.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: itemIdx * 0.04 + 0.08 }}
                              className="border-b border-black/5 dark:border-white/5 last:border-0"
                            >
                              <button
                                onClick={() => {
                                  handleSelectTab(category.id, tab.id);
                                  setIsMobileSidebarOpen(false);
                                }}
                                className={`w-full flex items-center justify-between py-3 px-3 rounded-xl transition-all ${
                                  isSelected
                                    ? 'bg-primary/10 text-slate-900 dark:text-white font-medium'
                                    : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-zinc-900 font-normal'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                                      isSelected
                                        ? 'bg-primary/15 text-primary'
                                        : 'bg-slate-100 dark:bg-zinc-850 text-slate-600 dark:text-slate-400'
                                    }`}
                                  >
                                    <Icon className="w-4 h-4" />
                                  </div>
                                  <span className="text-sm">{tab.label}</span>
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
                              </button>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </nav>

                {/* Mobile Footer Actions (Matching Landing Page Header Standard) */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="mt-8 pt-4 pb-2 border-t border-slate-100 dark:border-zinc-800 space-y-3 shrink-0"
                >
                  {isAuthenticated ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-zinc-900/60 rounded-2xl border border-slate-100 dark:border-zinc-800">
                        <div className="w-10 h-10 rounded-full bg-primary/15 text-primary font-bold text-sm flex items-center justify-center uppercase shrink-0">
                          {user?.firstName?.[0] || 'U'}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-sm text-foreground truncate">
                            {user?.firstName} {user?.lastName}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">{user?.email}</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => {
                            handleSelectTab('care', 'settings');
                            setIsMobileSidebarOpen(false);
                          }}
                          className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-zinc-800 text-xs font-semibold text-foreground hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors"
                        >
                          Settings
                        </button>
                        <button
                          onClick={() => {
                            logout();
                            setIsMobileSidebarOpen(false);
                          }}
                          className="w-full py-2.5 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Log Out</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-zinc-900/60 rounded-2xl border border-slate-100 dark:border-zinc-800">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                            <User className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                              Guest Mode
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            </span>
                            <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                              Sign in to save pet records & bookings
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Link
                          href="/login"
                          onClick={() => setIsMobileSidebarOpen(false)}
                          className="w-full py-2.5 px-3 rounded-xl border border-slate-300 dark:border-zinc-700 text-center text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                          Log In
                        </Link>
                        <Link
                          href="/register/personal"
                          onClick={() => setIsMobileSidebarOpen(false)}
                          className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-center text-xs font-semibold text-white dark:text-slate-900 shadow-xs transition-colors"
                        >
                          Sign Up
                        </Link>
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Area - ONLY this container scrolls */}
        <main className="flex-1 h-full overflow-y-auto min-h-0 p-3 sm:p-6 lg:p-8">
          {/* TAB 1: FIND VET (Practo Style) */}
          {(activeTab === 'find-vet' || activeTab === 'veterinary') && (
            <div className="space-y-4 max-w-6xl mx-auto">
              {/* MOBILE 3-PART ACTION SEARCH BAR (Image Reference: Filter Circle + Search Pill + Sort Circle) */}
              <div className={`sm:hidden space-y-2 relative ${isLocationDropdownOpen ? 'z-50' : 'z-20'}`}>
                <div className="flex items-center gap-2 w-full">
                  {/* Left: Circular Filter Button with active count badge */}
                  <button
                    type="button"
                    onClick={() => setIsMobileFilterOpen(true)}
                    className="w-11 h-11 rounded-full bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 flex items-center justify-center text-slate-700 dark:text-slate-200 shadow-2xs hover:bg-slate-50 dark:hover:bg-zinc-800 shrink-0 relative transition-all active:scale-95"
                    aria-label="Filter doctors"
                  >
                    <SlidersHorizontal className="w-4 h-4 text-slate-700 dark:text-slate-200" />
                    {activeFilterCount > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-zinc-900">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>

                  {/* Middle: Integrated Search Bar with Location + Query (Matching MNC Single Bar Standard) */}
                  <div className={`relative flex-1 min-w-0 h-11 rounded-full bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 flex items-center shadow-2xs transition-all focus-within:border-slate-400 dark:focus-within:border-zinc-600 ${isLocationDropdownOpen ? 'z-50' : ''}`}>
                    {/* Location Icon Trigger inside Search Bar (Icon only, no text) */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsLocationDropdownOpen(!isLocationDropdownOpen);
                        setOpenFilterDropdown(null);
                      }}
                      className="h-full pl-3.5 pr-2.5 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white shrink-0 group transition-colors"
                      title={selectedLocation && selectedLocation !== 'All Locations' ? `Location: ${selectedLocation}` : 'Select location'}
                    >
                      <MapPin className={`w-4 h-4 transition-colors ${selectedLocation && selectedLocation !== 'All Locations' ? 'text-primary' : 'text-slate-400 group-hover:text-primary'}`} />
                    </button>

                    {/* Subtle vertical divider */}
                    <div className="w-px h-5 bg-slate-200 dark:bg-zinc-700 shrink-0 my-auto" />

                    {/* Vets Search Input with Search Icon after the divider */}
                    <div className="flex-1 min-w-0 flex items-center pl-2.5 pr-3 h-full gap-2">
                      <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search vets..."
                        className="w-full bg-transparent text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 outline-none focus:outline-none focus:ring-0 ring-0 font-normal truncate"
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => setSearchQuery('')}
                          className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 shrink-0"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Mobile Location Dropdown anchored to the searchbar */}
                    {isLocationDropdownOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-40 sm:hidden"
                          onClick={() => setIsLocationDropdownOpen(false)}
                        />
                        <div className="absolute top-full left-0 mt-2 w-full sm:hidden bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                          {/* Quick Detect Current Location */}
                          <button
                            type="button"
                            onClick={detectCurrentLocation}
                            disabled={isDetectingLocation}
                            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors group text-left"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <Navigation className="w-4 h-4 text-primary shrink-0 group-hover:scale-110 transition-transform" />
                              <div className="min-w-0">
                                <span className="block text-xs font-normal text-slate-900 dark:text-white">
                                  {isDetectingLocation ? 'Detecting...' : 'Use Current Location'}
                                </span>
                                <span className="block text-[10px] text-slate-400 truncate">
                                  Auto-detect via GPS & network
                                </span>
                              </div>
                            </div>
                            {isDetectingLocation ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-primary shrink-0" />
                            ) : (
                              <span className="flex h-2 w-2 relative shrink-0">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                              </span>
                            )}
                          </button>

                          {/* Reset to Worldwide if a location is currently filtered */}
                          {selectedLocation && selectedLocation !== 'All Locations' && (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedLocation('All Locations');
                                setLocationSearchInput('');
                                setIsLocationDropdownOpen(false);
                              }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors text-slate-600 dark:text-slate-300"
                            >
                              <Globe className="w-4 h-4 text-slate-400 shrink-0" />
                              <span className="text-xs font-normal">All Locations (Worldwide)</span>
                            </button>
                          )}

                          {/* Popular Searches */}
                          <div className="border-t border-slate-100 dark:border-zinc-800/80 mt-1 pt-1.5">
                            <div className="px-3 pt-1 pb-1">
                              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                                Popular Searches
                              </span>
                            </div>
                            <div className="space-y-0.5">
                              {[
                                { name: 'Mumbai', subtitle: 'Maharashtra, India', value: 'Mumbai, Maharashtra, India' },
                                { name: 'India', subtitle: 'Country', value: 'India' },
                                { name: 'Los Angeles', subtitle: 'California, USA', value: 'Los Angeles, California, USA' },
                                { name: 'New York', subtitle: 'New York, USA', value: 'New York, USA' },
                                { name: 'London', subtitle: 'England, UK', value: 'London, UK' },
                              ].map((loc) => (
                                <button
                                  key={loc.name}
                                  type="button"
                                  onClick={() => {
                                    setSelectedLocation(loc.value);
                                    setLocationSearchInput(loc.value);
                                    setIsLocationDropdownOpen(false);
                                  }}
                                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800 text-left transition-colors group"
                                >
                                  <MapPin className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary transition-colors shrink-0" />
                                  <div className="min-w-0 flex-1">
                                    <span className="block text-xs font-normal text-slate-800 dark:text-slate-100 truncate">
                                      {loc.name}
                                    </span>
                                    <span className="block text-[10px] text-slate-400 dark:text-zinc-500 truncate">
                                      {loc.subtitle}
                                    </span>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Right: Circular Sort Button */}
                  <button
                    type="button"
                    onClick={() => setIsMobileSortOpen(true)}
                    className={`w-11 h-11 rounded-full border flex items-center justify-center shadow-2xs shrink-0 relative transition-all active:scale-95 ${
                      sortBy !== 'relevance'
                        ? 'bg-primary text-primary-foreground border-primary shadow-xs shadow-primary/20'
                        : 'bg-white dark:bg-zinc-900 border-slate-200/90 dark:border-zinc-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-zinc-800'
                    }`}
                    aria-label="Sort doctors"
                  >
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </div>

                {/* Quick Active Filter Chips Row on Mobile */}
                {activeFilterCount > 0 && (
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                    {consultTypeFilter !== 'all' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-[11px] font-medium shrink-0">
                        <span>{consultTypeFilter === 'video' ? 'Video' : consultTypeFilter === 'clinic' ? 'In-Clinic' : 'Home Visit'}</span>
                        <button
                          type="button"
                          onClick={() => setConsultTypeFilter('all')}
                          className="hover:text-primary/70"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {speciesFilter !== 'all' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-[11px] font-medium shrink-0">
                        <span>{speciesFilter}</span>
                        <button
                          type="button"
                          onClick={() => setSpeciesFilter('all')}
                          className="hover:text-primary/70"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {genderFilter !== 'all' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-[11px] font-medium shrink-0">
                        <span>{genderFilter === 'female' ? 'Female' : 'Male'}</span>
                        <button
                          type="button"
                          onClick={() => setGenderFilter('all')}
                          className="hover:text-primary/70"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {ratingFilter !== 'all' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-[11px] font-medium shrink-0">
                        <span>{ratingFilter}★+</span>
                        <button
                          type="button"
                          onClick={() => setRatingFilter('all')}
                          className="hover:text-primary/70"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {experienceFilter !== 'all' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-[11px] font-medium shrink-0">
                        <span>{experienceFilter}+ yrs</span>
                        <button
                          type="button"
                          onClick={() => setExperienceFilter('all')}
                          className="hover:text-primary/70"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedLocation('All Locations');
                        setLocationSearchInput('');
                        setConsultTypeFilter('all');
                        setGenderFilter('all');
                        setRatingFilter('all');
                        setExperienceFilter('all');
                        setSpeciesFilter('all');
                      }}
                      className="text-[11px] font-medium text-rose-500 hover:text-rose-600 px-2 py-1 shrink-0"
                    >
                      Reset all
                    </button>
                  </div>
                )}
              </div>

              {/* DESKTOP ROUNDED DUAL SEARCH BAR (Hidden on mobile) */}
              <div className={`hidden sm:block relative ${isLocationDropdownOpen ? 'z-50' : 'z-20'}`}>
                <div className="bg-white dark:bg-zinc-900 rounded-full border border-slate-200 dark:border-zinc-800 shadow-xs flex items-center">
                  {/* Location Search Input (Left) */}
                  <div className="relative w-72 md:w-80 shrink-0 flex items-center pl-5 sm:pl-7 pr-4 h-11 sm:h-13">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mr-2.5 sm:mr-3" />
                    <input
                      type="text"
                      value={locationSearchInput}
                      onChange={(e) => {
                        setLocationSearchInput(e.target.value);
                        if (!isLocationDropdownOpen) setIsLocationDropdownOpen(true);
                      }}
                      onFocus={() => {
                        setIsLocationDropdownOpen(true);
                        setOpenFilterDropdown(null);
                      }}
                      placeholder="Search location"
                      className="w-full bg-transparent text-xs sm:text-[13px] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 outline-none focus:outline-none focus:ring-0 ring-0 pr-2 font-normal"
                    />
                    {isSearchingLocation ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-primary shrink-0 ml-1" />
                    ) : locationSearchInput ? (
                      <button
                        type="button"
                        onClick={() => {
                          setLocationSearchInput('');
                          setSelectedLocation('All Locations');
                        }}
                        className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 shrink-0 ml-1"
                        title="Clear location"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    ) : null}

                    {/* Clean Minimal Location Dropdown (No preloaded lists, No tabs) */}
                    {isLocationDropdownOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setIsLocationDropdownOpen(false)}
                        />
                        <div className="absolute top-full left-0 mt-2 w-full sm:w-[380px] bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                          {/* Quick Detect Current Location */}
                          <button
                            type="button"
                            onClick={detectCurrentLocation}
                            disabled={isDetectingLocation}
                            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors group text-left"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <Navigation className="w-4 h-4 text-primary shrink-0 group-hover:scale-110 transition-transform" />
                              <div className="min-w-0">
                                <span className="block text-xs font-normal text-slate-900 dark:text-white">
                                  {isDetectingLocation ? 'Detecting current location...' : 'Use Current Location'}
                                </span>
                                <span className="block text-[11px] text-slate-400 truncate">
                                  Auto-detect via GPS & network
                                </span>
                              </div>
                            </div>
                            {isDetectingLocation ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-primary shrink-0" />
                            ) : (
                              <span className="flex h-2 w-2 relative shrink-0">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                              </span>
                            )}
                          </button>

                          {/* Reset to Worldwide if a location is currently filtered */}
                          {selectedLocation && selectedLocation !== 'All Locations' && (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedLocation('All Locations');
                                setLocationSearchInput('');
                                setIsLocationDropdownOpen(false);
                              }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors text-slate-600 dark:text-slate-300"
                            >
                              <Globe className="w-4 h-4 text-slate-400 shrink-0" />
                              <span className="text-xs font-normal">All Locations (Worldwide)</span>
                            </button>
                          )}

                          {/* Popular Searches (India & Platform Doctor Hubs) */}
                          {!locationSearchInput.trim() && (
                            <div className="border-t border-slate-100 dark:border-zinc-800/80 mt-1 pt-1.5">
                              <div className="px-3 pt-1 pb-1">
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                                  Popular Searches
                                </span>
                              </div>
                              <div className="space-y-0.5">
                                {[
                                  { name: 'Mumbai', subtitle: 'Maharashtra, India', value: 'Mumbai, Maharashtra, India' },
                                  { name: 'India', subtitle: 'Country', value: 'India' },
                                  { name: 'Los Angeles', subtitle: 'California, USA', value: 'Los Angeles, California, USA' },
                                  { name: 'New York', subtitle: 'New York, USA', value: 'New York, USA' },
                                  { name: 'London', subtitle: 'England, UK', value: 'London, UK' },
                                ].map((loc) => (
                                  <button
                                    key={loc.name}
                                    type="button"
                                    onClick={() => {
                                      setSelectedLocation(loc.value);
                                      setLocationSearchInput(loc.value);
                                      setIsLocationDropdownOpen(false);
                                    }}
                                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800 text-left transition-colors group"
                                  >
                                    <MapPin className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary transition-colors shrink-0" />
                                    <div className="min-w-0 flex-1">
                                      <span className="block text-xs font-normal text-slate-800 dark:text-slate-100 truncate">
                                        {loc.name}
                                      </span>
                                      <span className="block text-[10px] text-slate-400 dark:text-zinc-500 truncate">
                                        {loc.subtitle}
                                      </span>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Live Searching Indicator */}
                          {isSearchingLocation && (
                            <div className="flex items-center justify-center gap-2 py-4 text-xs text-slate-400 border-t border-slate-100 dark:border-zinc-800/80 mt-1">
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                              <span>Searching places worldwide...</span>
                            </div>
                          )}

                          {/* Empty No Matches State */}
                          {!isSearchingLocation &&
                            locationSearchInput.trim().length >= 2 &&
                            locationSuggestions.length === 0 && (
                              <div className="py-3 px-3 text-center border-t border-slate-100 dark:border-zinc-800/80 mt-1">
                                <p className="text-xs text-slate-400">
                                  No places found for &quot;{locationSearchInput}&quot;
                                </p>
                              </div>
                            )}

                          {/* Live Suggestions (Only shown when user types) */}
                          {locationSuggestions.length > 0 && (
                            <div className="max-h-60 overflow-y-auto py-1 space-y-0.5 border-t border-slate-100 dark:border-zinc-800/80 mt-1 no-scrollbar">
                              {locationSuggestions.map((item) => (
                                <button
                                  key={item.id}
                                  type="button"
                                  onClick={() => {
                                    const fullLoc =
                                      item.type === 'city'
                                        ? [item.name, item.state, item.country].filter(Boolean).join(', ')
                                        : item.type === 'state'
                                        ? [item.name, item.country].filter(Boolean).join(', ')
                                        : item.name;
                                    setSelectedLocation(fullLoc);
                                    setLocationSearchInput(fullLoc);
                                    setIsLocationDropdownOpen(false);
                                  }}
                                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800 text-left transition-colors"
                                >
                                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                  <div className="min-w-0 flex-1">
                                    <span className="block text-xs font-normal text-slate-800 dark:text-slate-100 truncate">
                                      {item.name}
                                    </span>
                                    {item.displaySubtitle && (
                                      <span className="block text-[11px] text-slate-400 dark:text-zinc-500 truncate">
                                        {item.displaySubtitle}
                                      </span>
                                    )}
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Vertical separator line between Location and Doctor search */}
                  <div className="w-[1px] h-6 bg-slate-200 dark:bg-zinc-700/80 shrink-0 my-auto mx-2" />

                  {/* Doctor, Clinic & Specialty Search (Right) */}
                  <div className="flex-1 flex items-center pl-4 pr-4 sm:pr-7 gap-2.5 sm:gap-3 min-w-0 h-11 sm:h-13">
                    <Search className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search doctors, veterinary clinics, specialists, pet symptoms..."
                      className="w-full bg-transparent text-xs sm:text-[13px] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 outline-none focus:outline-none focus:ring-0 ring-0 font-normal"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 mr-1 shrink-0"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* DESKTOP SINGLE UNIFIED FILTER BAR (Hidden on mobile, pristine single-line scroll on tablet) */}
              <div className={`hidden sm:block relative ${openFilterDropdown ? 'z-30' : 'z-10'}`}>
                <div className="bg-white dark:bg-zinc-900 rounded-full border border-slate-200 dark:border-zinc-800 p-1 sm:p-1.5 shadow-2xs flex items-center gap-1 sm:gap-1.5 overflow-visible">
                  {/* 1. Consult Mode Dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => toggleFilterDropdown('consult')}
                      className={`h-8 px-3 rounded-full text-xs font-normal flex items-center gap-1.5 transition-colors ${
                        consultTypeFilter !== 'all'
                          ? 'bg-primary text-primary-foreground shadow-xs shadow-primary/20'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800'
                      }`}
                    >
                      <span>
                        {consultTypeFilter === 'all'
                          ? 'Consultation Mode'
                          : consultTypeFilter === 'video'
                          ? 'Video Consultation'
                          : consultTypeFilter === 'clinic'
                          ? 'In-Clinic Visit'
                          : 'Home Visit'}
                      </span>
                      <ChevronDown
                        className={`w-3 h-3 transition-transform ${
                          consultTypeFilter !== 'all' ? 'text-primary-foreground' : 'text-slate-400'
                        } ${openFilterDropdown === 'consult' ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {openFilterDropdown === 'consult' && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setOpenFilterDropdown(null)} />
                        <div className="absolute top-full left-0 mt-2 w-52 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-slate-200 dark:border-zinc-800 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                          {[
                            { id: 'all', label: 'All Consultation Modes' },
                            { id: 'video', label: 'Video Consultation' },
                            { id: 'clinic', label: 'In-Clinic Visit' },
                            { id: 'home', label: 'Home Visit' },
                          ].map((opt) => {
                            const isSelected = consultTypeFilter === opt.id;
                            return (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() => {
                                  setConsultTypeFilter(opt.id as any);
                                  setOpenFilterDropdown(null);
                                }}
                                className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left hover:bg-slate-50 dark:hover:bg-zinc-800/70 transition-colors ${
                                  isSelected ? 'bg-primary/10 text-primary font-medium' : 'text-slate-700 dark:text-slate-200'
                                } font-normal`}
                              >
                                <span>{opt.label}</span>
                                {isSelected && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
                              </button>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>

                  {/* 2. Gender Dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => toggleFilterDropdown('gender')}
                      className={`h-8 px-3 rounded-full text-xs font-normal flex items-center gap-1.5 transition-colors ${
                        genderFilter !== 'all'
                          ? 'bg-primary text-primary-foreground shadow-xs shadow-primary/20'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800'
                      }`}
                    >
                      <span>
                        {genderFilter === 'all'
                          ? 'Gender'
                          : genderFilter === 'male'
                          ? 'Male Doctor'
                          : 'Female Doctor'}
                      </span>
                      <ChevronDown
                        className={`w-3 h-3 transition-transform ${
                          genderFilter !== 'all' ? 'text-primary-foreground' : 'text-slate-400'
                        } ${openFilterDropdown === 'gender' ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {openFilterDropdown === 'gender' && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setOpenFilterDropdown(null)} />
                        <div className="absolute top-full left-0 mt-2 w-44 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-slate-200 dark:border-zinc-800 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                          {[
                            { id: 'all', label: 'All Doctors' },
                            { id: 'female', label: 'Female Doctor' },
                            { id: 'male', label: 'Male Doctor' },
                          ].map((opt) => {
                            const isSelected = genderFilter === opt.id;
                            return (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() => {
                                  setGenderFilter(opt.id as any);
                                  setOpenFilterDropdown(null);
                                }}
                                className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left hover:bg-slate-50 dark:hover:bg-zinc-800/70 transition-colors ${
                                  isSelected ? 'bg-primary/10 text-primary font-medium' : 'text-slate-700 dark:text-slate-200'
                                } font-normal`}
                              >
                                <span>{opt.label}</span>
                                {isSelected && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
                              </button>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>

                  {/* 3. Experience Dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => toggleFilterDropdown('experience')}
                      className={`h-8 px-3 rounded-full text-xs font-normal flex items-center gap-1.5 transition-colors ${
                        experienceFilter !== 'all'
                          ? 'bg-primary text-primary-foreground shadow-xs shadow-primary/20'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800'
                      }`}
                    >
                      <span>{experienceFilter === 'all' ? 'Experience' : `${experienceFilter}+ Years`}</span>
                      <ChevronDown
                        className={`w-3 h-3 transition-transform ${
                          experienceFilter !== 'all' ? 'text-primary-foreground' : 'text-slate-400'
                        } ${openFilterDropdown === 'experience' ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {openFilterDropdown === 'experience' && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setOpenFilterDropdown(null)} />
                        <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-slate-200 dark:border-zinc-800 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                          {[
                            { id: 'all', label: 'Any Experience' },
                            { id: '5', label: '5+ Years Practice' },
                            { id: '10', label: '10+ Years Practice' },
                            { id: '15', label: '15+ Years (Specialist)' },
                          ].map((opt) => {
                            const isSelected = experienceFilter === opt.id;
                            return (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() => {
                                  setExperienceFilter(opt.id as any);
                                  setOpenFilterDropdown(null);
                                }}
                                className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left hover:bg-slate-50 dark:hover:bg-zinc-800/70 transition-colors ${
                                  isSelected ? 'bg-primary/10 text-primary font-medium' : 'text-slate-700 dark:text-slate-200'
                                } font-normal`}
                              >
                                <span>{opt.label}</span>
                                {isSelected && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
                              </button>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>

                  {/* 4. Species / Pet Dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => toggleFilterDropdown('species')}
                      className={`h-8 px-3 rounded-full text-xs font-normal flex items-center gap-1.5 transition-colors ${
                        speciesFilter !== 'all'
                          ? 'bg-primary text-primary-foreground shadow-xs shadow-primary/20'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800'
                      }`}
                    >
                      <span>{speciesFilter === 'all' ? 'Species' : speciesFilter}</span>
                      <ChevronDown
                        className={`w-3 h-3 transition-transform ${
                          speciesFilter !== 'all' ? 'text-primary-foreground' : 'text-slate-400'
                        } ${openFilterDropdown === 'species' ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {openFilterDropdown === 'species' && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setOpenFilterDropdown(null)} />
                        <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-slate-200 dark:border-zinc-800 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                          {[
                            { id: 'all', label: 'All Pet Species' },
                            { id: 'Dogs', label: 'Dogs & Puppies' },
                            { id: 'Cats', label: 'Cats & Kittens' },
                            { id: 'Birds', label: 'Birds & Avian' },
                          ].map((opt) => {
                            const isSelected = speciesFilter === opt.id;
                            return (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() => {
                                  setSpeciesFilter(opt.id);
                                  setOpenFilterDropdown(null);
                                }}
                                className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left hover:bg-slate-50 dark:hover:bg-zinc-800/70 transition-colors ${
                                  isSelected ? 'bg-primary/10 text-primary font-medium' : 'text-slate-700 dark:text-slate-200'
                                } font-normal`}
                              >
                                <span>{opt.label}</span>
                                {isSelected && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
                              </button>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>

                  {/* 5. Doctor Rating Dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => toggleFilterDropdown('rating')}
                      className={`h-8 px-3 rounded-full text-xs font-normal flex items-center gap-1.5 transition-colors ${
                        ratingFilter !== 'all'
                          ? 'bg-primary text-primary-foreground shadow-xs shadow-primary/20'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800'
                      }`}
                    >
                      <span>
                        {ratingFilter === 'all'
                          ? 'Rating'
                          : `${ratingFilter}★ & above`}
                      </span>
                      <ChevronDown
                        className={`w-3 h-3 transition-transform ${
                          ratingFilter !== 'all' ? 'text-primary-foreground' : 'text-slate-400'
                        } ${openFilterDropdown === 'rating' ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {openFilterDropdown === 'rating' && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setOpenFilterDropdown(null)} />
                        <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-slate-200 dark:border-zinc-800 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                          {[
                            {
                              id: 'all',
                              label: 'All Ratings',
                              count: ONLINE_VETS.length,
                            },
                            {
                              id: '4.8',
                              label: '4.8★ & above',
                              count: ONLINE_VETS.filter((d) => d.rating >= 4.8).length,
                            },
                            {
                              id: '4.5',
                              label: '4.5★ & above',
                              count: ONLINE_VETS.filter((d) => d.rating >= 4.5).length,
                            },
                            {
                              id: '4.0',
                              label: '4.0★ & above',
                              count: ONLINE_VETS.filter((d) => d.rating >= 4.0).length,
                            },
                          ].map((opt) => {
                            const isSelected = ratingFilter === opt.id;
                            return (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() => {
                                  setRatingFilter(opt.id as any);
                                  setOpenFilterDropdown(null);
                                }}
                                className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left hover:bg-slate-50 dark:hover:bg-zinc-800/70 transition-colors ${
                                  isSelected ? 'bg-primary/10 text-primary font-medium' : 'text-slate-700 dark:text-slate-200'
                                } font-normal`}
                              >
                                <div className="flex items-center gap-1.5">
                                  <span>{opt.label}</span>
                                  <span className="text-[11px] text-slate-400">({opt.count})</span>
                                </div>
                                {isSelected && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
                              </button>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="hidden sm:block w-px h-5 bg-slate-200 dark:bg-zinc-800 my-auto mx-0.5" />

                  {/* 6. Sort By Dropdown */}
                  <div className="relative ml-auto">
                    <button
                      type="button"
                      onClick={() => toggleFilterDropdown('sort')}
                      className={`h-8 px-3 rounded-full text-xs font-normal flex items-center gap-1.5 transition-colors shrink-0 ${
                        sortBy !== 'relevance'
                          ? 'bg-primary text-primary-foreground shadow-xs shadow-primary/20'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800'
                      }`}
                    >
                      <span>
                        Sort:{' '}
                        {sortBy === 'fee_desc'
                          ? 'Fee: High to Low'
                          : sortBy === 'fee_asc'
                          ? 'Fee: Low to High'
                          : sortBy === 'rating_desc'
                          ? 'Highest Rated'
                          : sortBy === 'exp_desc'
                          ? 'Most Experienced'
                          : 'Relevance'}
                      </span>
                      <ChevronDown
                        className={`w-3 h-3 transition-transform ${
                          sortBy !== 'relevance' ? 'text-primary-foreground' : 'text-slate-400'
                        } ${openFilterDropdown === 'sort' ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {openFilterDropdown === 'sort' && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setOpenFilterDropdown(null)} />
                        <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-slate-200 dark:border-zinc-800 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                          {[
                            { id: 'relevance', label: 'Relevance' },
                            { id: 'rating_desc', label: 'Highest Rated' },
                            { id: 'fee_asc', label: 'Fee: Low to High' },
                            { id: 'fee_desc', label: 'Fee: High to Low' },
                            { id: 'exp_desc', label: 'Most Experienced' },
                          ].map((opt) => {
                            const isSelected = sortBy === opt.id;
                            return (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() => {
                                  setSortBy(opt.id as any);
                                  setOpenFilterDropdown(null);
                                }}
                                className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left hover:bg-slate-50 dark:hover:bg-zinc-800/70 transition-colors ${
                                  isSelected ? 'bg-primary/10 text-primary font-medium' : 'text-slate-700 dark:text-slate-200'
                                } font-normal`}
                              >
                                <span>{opt.label}</span>
                                {isSelected && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
                              </button>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Reset Filters button if any filter is active */}
                  {(consultTypeFilter !== 'all' ||
                    genderFilter !== 'all' ||
                    ratingFilter !== 'all' ||
                    experienceFilter !== 'all' ||
                    speciesFilter !== 'all' ||
                    searchQuery) && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setConsultTypeFilter('all');
                        setGenderFilter('all');
                        setRatingFilter('all');
                        setExperienceFilter('all');
                        setSpeciesFilter('all');
                      }}
                      className="h-8 px-2.5 rounded-full text-xs font-normal text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors shrink-0"
                      title="Reset all filters"
                    >
                      <span>Reset</span>
                    </button>
                  )}
                </div>
              </div>

              {/* MOBILE FILTER BOTTOM SHEET MODAL */}
              <AnimatePresence>
                {isMobileFilterOpen && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setIsMobileFilterOpen(false)}
                      className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 sm:hidden"
                    />
                    <motion.div
                      initial={{ y: '100%' }}
                      animate={{ y: 0 }}
                      exit={{ y: '100%' }}
                      transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                      className="fixed bottom-0 inset-x-0 max-h-[85vh] bg-white dark:bg-zinc-900 rounded-t-3xl border-t border-slate-200 dark:border-zinc-800 z-50 sm:hidden flex flex-col shadow-2xl overflow-hidden"
                    >
                      {/* Drag handle & Header */}
                      <div className="pt-3 pb-2.5 flex flex-col items-center shrink-0 border-b border-slate-100 dark:border-zinc-800/80 px-4">
                        <div className="w-10 h-1 rounded-full bg-slate-300 dark:bg-zinc-700 mb-2.5" />
                        <div className="w-full flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">Filters</h3>
                            {activeFilterCount > 0 && (
                              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold">
                                {activeFilterCount}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            {activeFilterCount > 0 && (
                              <button
                                type="button"
                                onClick={() => {
                                  setConsultTypeFilter('all');
                                  setGenderFilter('all');
                                  setRatingFilter('all');
                                  setExperienceFilter('all');
                                  setSpeciesFilter('all');
                                }}
                                className="text-xs font-medium text-rose-500 hover:text-rose-600"
                              >
                                Reset all
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => setIsMobileFilterOpen(false)}
                              className="p-1.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-500 hover:text-slate-800 dark:hover:text-white"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Scrollable Filter Options */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-5 no-scrollbar">

                        {/* Consultation Mode */}
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                            Consultation Mode
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { id: 'all', label: 'All Modes' },
                              { id: 'clinic', label: 'In-Clinic Visit', icon: Building2 },
                              { id: 'home', label: 'Home Visit', icon: HomeIcon },
                              { id: 'video', label: 'Video Call', icon: Video },
                            ].map((m) => {
                              const isSelected = consultTypeFilter === m.id;
                              const Icon = 'icon' in m ? m.icon : null;
                              return (
                                <button
                                  key={m.id}
                                  type="button"
                                  onClick={() => setConsultTypeFilter(m.id as any)}
                                  className={`p-2.5 rounded-xl border flex items-center justify-center sm:justify-start gap-2 text-xs transition-all ${
                                    isSelected
                                      ? 'bg-primary text-primary-foreground border-primary font-medium shadow-xs shadow-primary/20'
                                      : 'bg-white dark:bg-zinc-800/80 border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-zinc-800'
                                  }`}
                                >
                                  {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
                                  <span>{m.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Species */}
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                            Pet Species
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {[
                              { id: 'all', label: 'All Pets' },
                              { id: 'Dogs', label: 'Dogs & Puppies' },
                              { id: 'Cats', label: 'Cats & Kittens' },
                              { id: 'Birds', label: 'Birds & Avian' },
                            ].map((s) => {
                              const isSelected = speciesFilter === s.id;
                              return (
                                <button
                                  key={s.id}
                                  type="button"
                                  onClick={() => setSpeciesFilter(s.id)}
                                  className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                                    isSelected
                                      ? 'bg-primary text-primary-foreground font-medium shadow-xs shadow-primary/20'
                                      : 'bg-white dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-zinc-800'
                                  }`}
                                >
                                  {s.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Rating */}
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                            Minimum Rating
                          </label>
                          <div className="grid grid-cols-4 gap-2">
                            {[
                              { id: 'all', label: 'Any' },
                              { id: '4.0', label: '4.0★+' },
                              { id: '4.5', label: '4.5★+' },
                              { id: '4.8', label: '4.8★+' },
                            ].map((r) => {
                              const isSelected = ratingFilter === r.id;
                              return (
                                <button
                                  key={r.id}
                                  type="button"
                                  onClick={() => setRatingFilter(r.id as any)}
                                  className={`py-2 rounded-xl border text-xs text-center transition-all ${
                                    isSelected
                                      ? 'bg-primary text-primary-foreground border-primary font-medium shadow-xs shadow-primary/20'
                                      : 'bg-white dark:bg-zinc-800/80 border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-zinc-800'
                                  }`}
                                >
                                  {r.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Doctor Gender */}
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                            Doctor Gender
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { id: 'all', label: 'All' },
                              { id: 'female', label: 'Female' },
                              { id: 'male', label: 'Male' },
                            ].map((g) => {
                              const isSelected = genderFilter === g.id;
                              return (
                                <button
                                  key={g.id}
                                  type="button"
                                  onClick={() => setGenderFilter(g.id as any)}
                                  className={`py-2 rounded-xl border text-xs text-center transition-all ${
                                    isSelected
                                      ? 'bg-primary text-primary-foreground border-primary font-medium shadow-xs shadow-primary/20'
                                      : 'bg-white dark:bg-zinc-800/80 border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-zinc-800'
                                  }`}
                                >
                                  {g.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Experience */}
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                            Experience
                          </label>
                          <div className="grid grid-cols-4 gap-2">
                            {[
                              { id: 'all', label: 'Any' },
                              { id: '5', label: '5+ yrs' },
                              { id: '10', label: '10+ yrs' },
                              { id: '15', label: '15+ yrs' },
                            ].map((e) => {
                              const isSelected = experienceFilter === e.id;
                              return (
                                <button
                                  key={e.id}
                                  type="button"
                                  onClick={() => setExperienceFilter(e.id as any)}
                                  className={`py-2 rounded-xl border text-xs text-center transition-all ${
                                    isSelected
                                      ? 'bg-primary text-primary-foreground border-primary font-medium shadow-xs shadow-primary/20'
                                      : 'bg-white dark:bg-zinc-800/80 border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-zinc-800'
                                  }`}
                                >
                                  {e.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Sticky Action Footer */}
                      <div className="p-4 border-t border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shrink-0">
                        <button
                          type="button"
                          onClick={() => setIsMobileFilterOpen(false)}
                          className="w-full h-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-sm flex items-center justify-center gap-2 shadow-sm shadow-primary/25 active:scale-[0.99] transition-all"
                        >
                          <span>Show {filteredDoctors.length} {filteredDoctors.length === 1 ? 'Doctor' : 'Doctors'}</span>
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>

              {/* MOBILE SORT BOTTOM SHEET MODAL */}
              <AnimatePresence>
                {isMobileSortOpen && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setIsMobileSortOpen(false)}
                      className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 sm:hidden"
                    />
                    <motion.div
                      initial={{ y: '100%' }}
                      animate={{ y: 0 }}
                      exit={{ y: '100%' }}
                      transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                      className="fixed bottom-0 inset-x-0 bg-white dark:bg-zinc-900 rounded-t-3xl border-t border-slate-200 dark:border-zinc-800 z-50 sm:hidden flex flex-col shadow-2xl overflow-hidden p-4 pb-6"
                    >
                      <div className="w-10 h-1 rounded-full bg-slate-300 dark:bg-zinc-700 mx-auto mb-3" />
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800 mb-2">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">Sort Doctors By</h3>
                        <button
                          type="button"
                          onClick={() => setIsMobileSortOpen(false)}
                          className="p-1.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-500 hover:text-slate-800 dark:hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-1">
                        {[
                          { id: 'relevance', label: 'Relevance (Best Match)' },
                          { id: 'rating_desc', label: 'Highest Rated' },
                          { id: 'fee_asc', label: 'Fee: Low to High' },
                          { id: 'fee_desc', label: 'Fee: High to Low' },
                          { id: 'exp_desc', label: 'Most Experienced' },
                        ].map((opt) => {
                          const isSelected = sortBy === opt.id;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => {
                                setSortBy(opt.id as any);
                                setIsMobileSortOpen(false);
                              }}
                              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs transition-colors ${
                                isSelected
                                  ? 'bg-primary text-primary-foreground font-medium'
                                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-zinc-800/70'
                              }`}
                            >
                              <span>{opt.label}</span>
                              {isSelected && <Check className="w-4 h-4 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>

              {/* HORIZONTAL DOCTOR CARDS LIST (Photo covers whole left side) */}
              <div className="space-y-4 pt-1">
                {filteredDoctors.length === 0 ? (
                  <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-12 text-center space-y-3">
                    <p className="text-base font-semibold text-slate-800 dark:text-white">
                      No doctors found matching your criteria
                    </p>
                    <p className="text-xs text-slate-500">
                      Try searching for a different specialty, adjusting your filters, or clearing search.
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setConsultTypeFilter('all');
                        setSpeciesFilter('all');
                        setAvailabilityFilter('all');
                        setGenderFilter('all');
                        setRatingFilter('all');
                        setExperienceFilter('all');
                      }}
                      className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all"
                    >
                      Clear All Filters
                    </button>
                  </div>
                ) : (
                  filteredDoctors.map((vet) => (
                    <div
                      key={vet.id}
                      className="group relative bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200/80 dark:border-zinc-800 overflow-hidden transition-all duration-300 hover:shadow-[0_12px_36px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_12px_36px_rgba(0,0,0,0.3)] hover:border-slate-300 dark:hover:border-zinc-700 flex flex-col sm:flex-row items-stretch"
                    >
                      {/* Desktop Left Column: Edge-to-Edge Doctor Portrait (Hidden on mobile) */}
                      <div 
                        onClick={() => handleConsultClick(vet)}
                        className="hidden sm:block relative sm:w-44 md:w-48 lg:w-56 xl:w-64 shrink-0 sm:min-h-full bg-slate-100 dark:bg-zinc-800 overflow-hidden sm:rounded-l-3xl cursor-pointer group/img"
                        title={vet.bookingMessage ? vet.bookingMessage.split('\n')[0] : `Book consultation with ${vet.name}`}
                      >
                        <Image
                          src={vet.image}
                          alt={vet.name}
                          fill
                          className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                          sizes="256px"
                        />
                      </div>

                      {/* Content Column: Responsive Medical Directory Architecture */}
                      <div className="flex-1 p-3.5 sm:p-4 md:p-5 lg:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-3.5 md:gap-4 lg:gap-5 min-w-0">
                        {/* Left Info Column: Identity, Metadata, Badges, Clinic & Patient Stories */}
                        <div className="flex-1 min-w-0 space-y-2.5">
                          {/* MOBILE ONLY: Portrait Thumbnail + Identity Header */}
                          <div className="flex sm:hidden items-start gap-3 pb-2.5 border-b border-slate-100 dark:border-zinc-800/80">
                            <div 
                              onClick={() => handleConsultClick(vet)}
                              className="relative w-20 h-28 rounded-2xl overflow-hidden bg-slate-100 dark:bg-zinc-800 shrink-0 border border-slate-200/80 dark:border-zinc-700 shadow-xs cursor-pointer"
                            >
                              <Image
                                src={vet.image}
                                alt={vet.name}
                                fill
                                className="object-cover object-top"
                                sizes="80px"
                              />
                            </div>
                            <div className="flex-1 min-w-0 space-y-1">
                              {/* Doctor Name + Verified Icon Only (Saves space on mobile) */}
                              <div className="flex items-center gap-1.5 min-w-0">
                                <a
                                  href={`#doctor-${vet.id}`}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleConsultClick(vet);
                                  }}
                                  className="text-[15px] font-bold text-slate-900 dark:text-white hover:text-primary transition-colors cursor-pointer truncate"
                                >
                                  {vet.name}
                                </a>
                                <span title="Verified Doctor" className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 shrink-0">
                                  <ShieldCheck className="w-2.5 h-2.5 text-teal-500" />
                                </span>
                              </div>

                              {/* Specialization */}
                              <span
                                onClick={() => setSearchQuery(vet.specialization)}
                                className="text-xs font-medium text-slate-600 dark:text-zinc-300 hover:text-primary hover:underline cursor-pointer line-clamp-1 block"
                              >
                                {vet.specialization}
                              </span>

                              {/* Experience */}
                              <div className="flex items-center gap-1 text-[11.5px] text-slate-500 dark:text-zinc-400 pt-0.5">
                                <Briefcase className="w-3 h-3 text-slate-400 dark:text-zinc-500 shrink-0" />
                                <span className="font-medium text-slate-700 dark:text-zinc-200 truncate">
                                  {vet.experience.toLowerCase().includes('experience') 
                                    ? vet.experience.replace(/overall/i, '').trim() 
                                    : `${vet.experience} experience`}
                                </span>
                              </div>

                              {/* Speaks: Languages (Placed below Experience) */}
                              <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-zinc-400">
                                <MessageSquare className="w-3 h-3 text-slate-400 dark:text-zinc-500 shrink-0" />
                                <span className="truncate">
                                  Speaks: <span className="font-medium text-slate-700 dark:text-zinc-200">{vet.languages.join(', ')}</span>
                                </span>
                              </div>

                              {/* Patient Stories: Placed below Speaks on Mobile */}
                              <div className="flex items-center gap-1.5 pt-0.5">
                                {(() => {
                                  const satNum = parseInt(vet.satisfaction || `${Math.min(99, Math.round(vet.rating * 20))}`) || 95;
                                  const isHighSat = satNum >= 90;
                                  return (
                                    <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold shrink-0 tracking-tight border ${
                                      isHighSat 
                                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25'
                                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25'
                                    }`}>
                                      <ThumbsUp className="w-2.5 h-2.5 shrink-0" />
                                      <span>{vet.satisfaction || `${satNum}%`}</span>
                                    </div>
                                  );
                                })()}
                                <span className="text-[11px] font-medium text-slate-600 dark:text-zinc-400 truncate">
                                  <span className="font-semibold text-slate-800 dark:text-zinc-200">{vet.reviews.toLocaleString()}</span> stories
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* DESKTOP ONLY: Doctor Name + Verified Badge */}
                          <div className="hidden sm:flex items-center gap-2 flex-wrap">
                            <a
                              href={`#doctor-${vet.id}`}
                              onClick={(e) => {
                                e.preventDefault();
                                handleConsultClick(vet);
                              }}
                              title={`View Profile of ${vet.name}`}
                              className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 dark:text-white hover:text-primary transition-colors cursor-pointer tracking-tight block"
                            >
                              {vet.name}
                            </a>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 shrink-0">
                              <ShieldCheck className="w-3 h-3 text-teal-500 shrink-0" />
                              <span>Verified</span>
                            </span>
                          </div>

                          {/* DESKTOP ONLY: Specialization Line (Secondary Weight: 14px font-medium) */}
                          <div className="hidden sm:block">
                            <span
                              onClick={() => setSearchQuery(vet.specialization)}
                              className="text-xs sm:text-sm font-medium text-slate-600 dark:text-zinc-300 hover:text-primary hover:underline cursor-pointer block"
                            >
                              {vet.specialization}
                            </span>
                          </div>

                          {/* DESKTOP ONLY: Full Experience · Speaks Languages (On mobile both are in the header) */}
                          <div className="hidden sm:flex items-center gap-2 text-xs sm:text-[13px] text-slate-500 dark:text-zinc-400 flex-wrap">
                            <div className="flex items-center gap-1.5 shrink-0">
                              <Briefcase className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" />
                              <span className="font-medium text-slate-700 dark:text-zinc-200">
                                {vet.experience.toLowerCase().includes('experience') 
                                  ? vet.experience.replace(/overall/i, '').trim() 
                                  : `${vet.experience} experience`}
                              </span>
                            </div>

                            <span className="text-slate-300 dark:text-zinc-600">·</span>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <MessageSquare className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" />
                              <span>
                                Speaks: <span className="font-medium text-slate-700 dark:text-zinc-200">{vet.languages.join(', ')}</span>
                              </span>
                            </div>
                          </div>

                          {/* Next Line: Dominant Location & Clinic (14px font-semibold Location + 13px Clinic) */}
                          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-600 dark:text-zinc-400 pt-0.5 flex-wrap">
                            <div className="flex items-center gap-1 shrink-0">
                              <MapPin className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400 shrink-0" />
                              <span
                                onClick={() => {
                                  const loc = (vet as any).area ? `${(vet as any).area}, ${vet.city}` : vet.city;
                                  setSelectedLocation(loc);
                                  setLocationSearchInput(loc);
                                }}
                                className="font-semibold text-slate-800 dark:text-slate-100 hover:text-primary hover:underline cursor-pointer"
                              >
                                {(vet as any).area ? `${(vet as any).area}, ` : ''}{vet.city}
                              </span>
                            </div>

                            <span className="text-slate-300 dark:text-zinc-600">·</span>

                            <div className="flex items-center gap-1.5 min-w-0 text-xs sm:text-[13px]">
                              <span
                                onClick={() => setSearchQuery(vet.clinicName)}
                                className="hover:text-primary hover:underline cursor-pointer truncate font-normal text-slate-600 dark:text-zinc-300"
                              >
                                {vet.clinicName}
                              </span>
                              <span className="text-slate-400 dark:text-zinc-500 font-normal text-xs shrink-0">
                                +{vet.id % 2 === 0 ? '2' : '1'} more
                              </span>
                            </div>
                          </div>

                          {/* DESKTOP ONLY: Satisfaction Pill & Patient Stories (On mobile this sits in the header below Speaks) */}
                          <div className="hidden sm:flex pt-2 sm:pt-2.5 border-t border-slate-100 dark:border-zinc-800/80 items-center gap-2 sm:gap-2.5">
                            {(() => {
                              const satNum = parseInt(vet.satisfaction || `${Math.min(99, Math.round(vet.rating * 20))}`) || 95;
                              const isHighSat = satNum >= 90;
                              return (
                                <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] sm:text-[11px] font-semibold shrink-0 tracking-tight border ${
                                  isHighSat 
                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25'
                                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25'
                                }`}>
                                  <ThumbsUp className="w-2.5 h-2.5 shrink-0" />
                                  <span>{vet.satisfaction || `${satNum}%`}</span>
                                </div>
                              );
                            })()}
                            <span className="text-[11.5px] sm:text-xs font-medium text-slate-600 dark:text-zinc-400 hover:text-primary hover:underline cursor-pointer">
                              <span className="font-semibold text-slate-800 dark:text-zinc-200">{vet.reviews.toLocaleString()}</span> patient stories
                            </span>
                          </div>
                        </div>

                        {/* Right Action Column / Mobile Bottom Section */}
                        <div className="shrink-0 flex flex-col sm:items-center sm:justify-center gap-2.5 sm:gap-2.5 sm:ml-auto w-full sm:w-38 md:w-42 lg:w-48 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-zinc-800/80">
                          {/* MOBILE ONLY (< sm): Cohesive Inset Availability & Fee Banner */}
                          {(() => {
                            const mod = (vet.id || 1) % 3;
                            let label = 'Available today';
                            let isToday = true;

                            if (mod === 1) {
                              label = 'Available today';
                              isToday = true;
                            } else if (mod === 2) {
                              label = 'Available tomorrow';
                              isToday = false;
                            } else {
                              const dates = ['Wed, 16 Sep', 'Thu, 17 Sep', 'Fri, 18 Sep', 'Sat, 19 Sep', 'Mon, 21 Sep'];
                              const dateStr = dates[(vet.id || 0) % dates.length];
                              label = `Available on ${dateStr}`;
                              isToday = false;
                            }

                            return (
                              <>
                                <div className="flex sm:hidden items-center justify-between py-2 px-3 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-100 dark:border-zinc-800 w-full">
                                  <div className={`flex items-center gap-1.5 text-xs ${
                                    isToday 
                                      ? 'font-semibold text-emerald-600 dark:text-emerald-400' 
                                      : 'font-medium text-slate-600 dark:text-zinc-300'
                                  }`}>
                                    <Calendar className={`w-3.5 h-3.5 shrink-0 ${
                                      isToday ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'
                                    }`} />
                                    <span>{label}</span>
                                  </div>

                                  <div className="flex items-baseline gap-1 text-right">
                                    <span className="text-base font-bold text-slate-900 dark:text-white">{vet.fee}</span>
                                    <span className="text-[11px] text-slate-500 dark:text-zinc-400 font-normal">fee</span>
                                  </div>
                                </div>

                                {/* DESKTOP/TABLET (sm+): Centered Availability Indicator */}
                                <div className={`hidden sm:flex items-center justify-center gap-1.5 text-xs text-center self-center ${
                                  isToday 
                                    ? 'font-semibold text-emerald-600 dark:text-emerald-400' 
                                    : 'font-medium text-slate-700 dark:text-zinc-300'
                                }`}>
                                  <Calendar className={`w-3.5 h-3.5 shrink-0 ${
                                    isToday ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-zinc-400'
                                  }`} />
                                  <span>{label}</span>
                                </div>
                              </>
                            );
                          })()}

                          {/* DESKTOP/TABLET (sm+): Centered Fee */}
                          <div className="hidden sm:block text-center w-full">
                            <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                              {vet.fee}
                            </div>
                            <div className="text-[11.5px] text-slate-500 dark:text-zinc-400 font-normal">
                              Consultation fee
                            </div>
                          </div>

                          {/* CTA Buttons: Side-by-side on Mobile (< sm), Vertically Stacked on Tablet & Desktop (sm+) */}
                          <div className="grid grid-cols-2 sm:flex sm:flex-col gap-2 sm:gap-2.5 w-full">
                            {/* Button 1: View Profile (Mobile: Left Col | Desktop: Bottom) */}
                            <button
                              type="button"
                              onClick={() => handleConsultClick(vet)}
                              title={`View Profile of ${vet.name}`}
                              className="order-1 sm:order-2 w-full h-9 sm:h-10 px-2 sm:px-4 rounded-xl sm:rounded-tl-[30px] sm:rounded-tr-[99px] sm:rounded-bl-[99px] sm:rounded-br-[99px] border border-slate-200 dark:border-zinc-700 bg-white dark:bg-transparent hover:bg-slate-50 dark:hover:bg-zinc-800/60 text-slate-800 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white text-xs sm:text-sm font-semibold inline-flex items-center justify-center transition-all duration-300 shadow-2xs active:scale-[0.98] cursor-pointer"
                            >
                              <span className="truncate font-semibold">View Profile</span>
                            </button>

                            {/* Button 2: Book Appointment (Mobile: Right Col | Desktop: Top) */}
                            <button
                              type="button"
                              onClick={() => handleConsultClick(vet)}
                              title={`Book Appointment with ${vet.name}`}
                              className="order-2 sm:order-1 w-full h-9 sm:h-10 px-2 sm:px-4 rounded-xl sm:rounded-tl-[99px] sm:rounded-bl-[99px] sm:rounded-br-[99px] sm:rounded-tr-[30px] bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 text-xs sm:text-sm font-semibold inline-flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg active:scale-[0.98] cursor-pointer border-0"
                            >
                              <span className="truncate font-semibold">Book Appointment</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 2: FIND HOSPITAL (Practo Style) */}
          {activeTab === 'find-hospital' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
                <div>
                  <h1 className="text-2xl sm:text-[26px] font-bold tracking-tight text-slate-900 dark:text-white">
                    Veterinary Hospitals & Emergency Care
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Multi-specialty clinics, 24/7 emergency ICUs, diagnostic imaging, and surgery centers worldwide.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200/60 dark:border-emerald-800/40">
                    All Partner Hospitals VCI Licensed
                  </span>
                </div>
              </div>

              {/* 24/7 CRITICAL EMERGENCY HOTLINE BANNER */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0">
                    <PhoneCall className="w-6 h-6 animate-bounce" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-white/25 px-2 py-0.5 rounded-full">
                        Critical 24/7 Triage
                      </span>
                      <span className="text-xs text-white/90">Ambulance on Standby</span>
                    </div>
                    <h2 className="text-base sm:text-lg font-bold mt-0.5">
                      National Pet Emergency Trauma Hotline
                    </h2>
                    <p className="text-xs text-white/80 mt-0.5">
                      Immediate emergency triage, mobile oxygen unit dispatch, and ICU bed reservation.
                    </p>
                  </div>
                </div>

                <a
                  href="tel:1800-PET-911"
                  className="px-5 py-2.5 rounded-xl bg-white text-red-600 font-bold text-xs sm:text-sm hover:bg-slate-100 transition-all shadow-sm shrink-0 flex items-center gap-2"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Call 1800-PET-911</span>
                </a>
              </div>

              {/* Hospital Cards */}
              <div className="space-y-4">
                {CLINICS.map((clinic) => (
                  <div
                    key={clinic.id}
                    className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/90 dark:border-zinc-800 p-5 shadow-xs hover:shadow-md hover:border-primary/40 transition-all"
                  >
                    <div className="flex flex-col lg:flex-row items-start justify-between gap-5">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200/50">
                            Partner Hospital
                          </span>
                          {clinic.isEmergency && (
                            <span className="text-[10px] font-bold text-red-600 bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded-full border border-red-200/50">
                              24/7 Emergency ICU
                            </span>
                          )}
                        </div>

                        <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                          {clinic.name}
                        </h3>

                        <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                          {clinic.type}
                        </p>

                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span>{clinic.area}</span> • <span className="text-emerald-600 font-medium">{clinic.distance}</span>
                        </p>

                        {/* MNC Star Ratings & Doctors on Duty */}
                        <div className="flex items-center gap-2.5 pt-1 text-xs flex-wrap">
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 font-bold border border-amber-200/60 shadow-2xs">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{clinic.rating.toFixed(1)}</span>
                          </div>
                          <span className="text-slate-600 dark:text-slate-300 font-medium text-[12px]">
                            ({clinic.reviews.toLocaleString()} verified ratings)
                          </span>
                          <span className="text-slate-400">•</span>
                          <span className="text-slate-600 dark:text-slate-300 font-medium">
                            {clinic.doctorsOnDuty} Doctors on Duty
                          </span>
                        </div>

                        {/* Facilities Badges */}
                        <div className="pt-2 flex flex-wrap gap-1.5">
                          {clinic.facilities.map((fac, i) => (
                            <span
                              key={i}
                              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-300 flex items-center gap-1"
                            >
                              <CheckCircle className="w-3 h-3 text-emerald-500 shrink-0" />
                              {fac}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Right Stack */}
                      <div className="w-full lg:w-64 lg:border-l lg:border-slate-100 dark:lg:border-zinc-800/80 lg:pl-5 flex flex-col justify-between shrink-0 space-y-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-zinc-800">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between lg:justify-start lg:gap-2">
                            <span className="text-xs text-slate-500">Consultation fee:</span>
                            <span className="font-bold text-slate-900 dark:text-white text-base">
                              {clinic.fee}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
                            <span>{clinic.timing}</span>
                          </p>
                        </div>

                        <div className="space-y-2 w-full">
                          <button
                            onClick={() => handleConsultClick(clinic)}
                            className="w-full h-9 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all flex items-center justify-center gap-1.5 shadow-xs"
                          >
                            <Building2 className="w-3.5 h-3.5" />
                            <span>Book Clinic Visit</span>
                          </button>

                          <a
                            href={`tel:${clinic.phone}`}
                            className="w-full h-9 rounded-xl border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-zinc-800 text-xs font-medium transition-all flex items-center justify-center gap-1.5"
                          >
                            <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{clinic.phone}</span>
                          </a>
                        </div>

                        <p className="text-[11px] text-center text-slate-400">
                          Instant Appointment • No Wait Time
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: APPOINTMENTS */}
          {activeTab === 'appointments' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
                <div>
                  <h1 className="text-2xl sm:text-[26px] font-bold tracking-tight text-slate-900 dark:text-white">
                    My Consultations & Appointments
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Manage upcoming video calls, in-clinic visits, prescription refills, and join live consultation rooms.
                  </p>
                </div>

                <button
                  onClick={() => handleSelectTab('care', 'find-vet')}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all flex items-center gap-1.5 self-start"
                >
                  <Plus className="w-3.5 h-3.5" /> Book New Vet
                </button>
              </div>

              {/* Subtabs: Upcoming vs Past */}
              <div className="flex items-center gap-2 border-b border-slate-200 dark:border-zinc-800 pb-2">
                <button
                  onClick={() => setAppointmentsSubTab('upcoming')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                    appointmentsSubTab === 'upcoming'
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <span>Upcoming Consultations</span>
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/20">2</span>
                </button>
                <button
                  onClick={() => setAppointmentsSubTab('past')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                    appointmentsSubTab === 'past'
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <span>Completed History</span>
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/20">1</span>
                </button>
              </div>

              {/* UPCOMING APPOINTMENTS */}
              {appointmentsSubTab === 'upcoming' && (
                <div className="space-y-4">
                  {MOCK_APPOINTMENTS.filter((a) => a.status !== 'Completed').map((apt) => (
                    <div
                      key={apt.id}
                      className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/90 dark:border-zinc-800 p-5 shadow-xs space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                              apt.isLiveNow
                                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/60'
                                : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            {apt.isLiveNow && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
                            {apt.isLiveNow ? 'Consultation Ready' : apt.status}
                          </span>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                            Booking ID: #{apt.id.toUpperCase()}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{apt.fee}</span>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="relative w-14 h-14 rounded-full overflow-hidden border border-slate-200 dark:border-zinc-800 shrink-0">
                          <Image src={apt.doctorImage} alt={apt.doctor} fill className="object-cover" />
                        </div>
                        <div className="space-y-1 min-w-0 flex-1">
                          <h3 className="font-bold text-base text-slate-900 dark:text-white">
                            {apt.doctor}
                          </h3>
                          <p className="text-xs text-slate-600 dark:text-slate-300">
                            {apt.specialization} • {apt.clinic}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-slate-500 pt-0.5 flex-wrap">
                            <span className="flex items-center gap-1 font-medium text-primary">
                              <Clock className="w-3.5 h-3.5" /> {apt.date} at {apt.time}
                            </span>
                            <span>•</span>
                            <span className="font-medium text-slate-700 dark:text-slate-300">Patient: {apt.pet}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Row */}
                      <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          {apt.mode === 'video' ? (
                            <button
                              onClick={() => alert(`Launching encrypted HD video consultation with ${apt.doctor}...`)}
                              className="h-9 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs animate-pulse"
                            >
                              <Video className="w-3.5 h-3.5" />
                              <span>Join Video Call</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => alert(`Opening clinic navigation map for ${apt.clinic}...`)}
                              className="h-9 px-4 rounded-xl bg-primary text-primary-foreground text-xs font-semibold transition-all flex items-center gap-1.5"
                            >
                              <Navigation className="w-3.5 h-3.5" />
                              <span>Get Directions</span>
                            </button>
                          )}
                          <button
                            onClick={() => alert(`Reschedule requested for appointment #${apt.id}`)}
                            className="h-9 px-3 rounded-xl border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-zinc-800 text-xs font-medium"
                          >
                            Reschedule
                          </button>
                        </div>

                        <button
                          onClick={() => alert(`Appointment cancellation requested.`)}
                          className="text-xs text-slate-400 hover:text-red-600 transition-colors"
                        >
                          Cancel Booking
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* COMPLETED HISTORY */}
              {appointmentsSubTab === 'past' && (
                <div className="space-y-4">
                  {MOCK_APPOINTMENTS.filter((a) => a.status === 'Completed').map((apt) => (
                    <div
                      key={apt.id}
                      className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/90 dark:border-zinc-800 p-5 shadow-xs space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-zinc-800 px-2.5 py-0.5 rounded-full">
                          Completed on {apt.date}
                        </span>
                        <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Verified Consultation
                        </span>
                      </div>

                      <div className="flex items-start gap-3.5">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden border border-slate-200 shrink-0">
                          <Image src={apt.doctorImage} alt={apt.doctor} fill className="object-cover" />
                        </div>
                        <div className="space-y-0.5">
                          <h3 className="font-bold text-sm text-slate-900 dark:text-white">{apt.doctor}</h3>
                          <p className="text-xs text-slate-500">{apt.specialization} • Patient: {apt.pet}</p>
                          <p className="text-xs text-slate-400">Consultation Fee Paid: {apt.fee}</p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 dark:border-zinc-800 flex items-center gap-2">
                        <button
                          onClick={() => handleSelectTab('care', 'medical-history')}
                          className="h-8 px-3 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 text-xs font-semibold flex items-center gap-1.5"
                        >
                          <FileText className="w-3.5 h-3.5" /> View Digital Rx
                        </button>
                        <button
                          onClick={() => handleSelectTab('care', 'find-vet')}
                          className="h-8 px-3 rounded-xl border border-slate-200 dark:border-zinc-800 text-xs font-medium hover:bg-slate-50 dark:hover:bg-zinc-800"
                        >
                          Book Again
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: MEDICAL HISTORY (Digital Rx, Vaccines, Labs) */}
          {(activeTab === 'medical-history' || activeTab === 'records') && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
                <div>
                  <h1 className="text-2xl sm:text-[26px] font-bold tracking-tight text-slate-900 dark:text-white">
                    Pet Medical History & Health Records
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Digital prescriptions, diagnostic lab reports, and verified vaccination certificates.
                  </p>
                </div>
                <button
                  onClick={() => alert('Document upload modal initiated...')}
                  className="h-9 px-4 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all flex items-center gap-1.5 self-start"
                >
                  <Plus className="w-3.5 h-3.5" /> Upload Document
                </button>
              </div>

              {/* Subtabs: Prescriptions, Vaccines, Diagnostics */}
              <div className="flex items-center gap-2 border-b border-slate-200 dark:border-zinc-800 pb-2">
                <button
                  onClick={() => setRecordsSubTab('prescriptions')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    recordsSubTab === 'prescriptions'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  Digital Prescriptions (Rx)
                </button>
                <button
                  onClick={() => setRecordsSubTab('vaccines')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    recordsSubTab === 'vaccines'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  Vaccination Tracker
                </button>
              </div>

              {/* PRESCRIPTIONS TAB */}
              {recordsSubTab === 'prescriptions' && (
                <div className="space-y-3">
                  {MOCK_PRESCRIPTIONS.map((rec) => (
                    <div
                      key={rec.id}
                      className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/90 dark:border-zinc-800 p-5 shadow-xs space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-slate-900 dark:text-white">
                              {rec.title}
                            </span>
                            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 font-semibold px-2 py-0.5 rounded-full border border-emerald-200/50">
                              Clinically Verified
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                            Diagnosis: <strong className="font-semibold text-slate-800 dark:text-slate-200">{rec.diagnosis}</strong>
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {rec.doctor} • Patient: {rec.pet} • Date: {rec.date}
                          </p>
                          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 font-mono text-[11px]">
                            Dosage: {rec.dosage}
                          </p>
                          <p className="text-[10.5px] text-slate-400 font-mono mt-0.5">
                            Digital Rx ID: {rec.hash}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => alert(`Downloading verified prescription PDF for ${rec.title}...`)}
                            className="h-8 px-3 rounded-xl border border-slate-200 dark:border-zinc-800 text-xs font-medium hover:bg-slate-50 dark:hover:bg-zinc-800 flex items-center gap-1.5"
                          >
                            <Download className="w-3.5 h-3.5 text-primary" /> Download PDF
                          </button>
                          <button
                            onClick={() => alert(`Generated 24-hour doctor share passkey for ${rec.title}`)}
                            className="h-8 px-3 rounded-xl border border-slate-200 dark:border-zinc-800 text-xs font-medium hover:bg-slate-50 dark:hover:bg-zinc-800 flex items-center gap-1.5"
                          >
                            <Share2 className="w-3.5 h-3.5 text-slate-500" /> Share
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* VACCINES TAB */}
              {recordsSubTab === 'vaccines' && (
                <div className="space-y-3">
                  {MOCK_VACCINES.map((vac, idx) => (
                    <div
                      key={idx}
                      className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/90 dark:border-zinc-800 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white">{vac.name}</h3>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              vac.status === 'Up to Date'
                                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
                                : 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400'
                            }`}
                          >
                            {vac.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          Administered by {vac.doctor} on {vac.dateGiven} • Batch #{vac.batchNo}
                        </p>
                        <p className="text-xs font-medium text-primary">
                          Next Booster Due: {vac.dueDate}
                        </p>
                      </div>

                      <button
                        onClick={() => alert(`Downloaded vaccination passport for ${vac.name}`)}
                        className="h-8 px-3 rounded-xl border border-slate-200 dark:border-zinc-800 text-xs font-medium hover:bg-slate-50 dark:hover:bg-zinc-800 flex items-center gap-1.5 self-start sm:self-auto"
                      >
                        <Download className="w-3.5 h-3.5 text-primary" /> Certificate
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: PROFILE & SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-5 max-w-3xl mx-auto px-1 sm:px-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-1">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Account Profile & Settings
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                    Manage your pet parent registration details and optional delivery address.
                  </p>
                </div>
              </div>

              {/* GUEST PET PARENT BANNER */}
              {!isAuthenticated && (
                <div className="bg-amber-500/10 border border-amber-500/30 dark:bg-amber-950/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white">Guest Pet Parent Mode</h3>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                          Session Only
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
                        You are currently browsing as a guest. Personal details and pets are preserved locally for this session. Log in or register to sync your records across all devices and book consultations with certified veterinarians.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                    <button
                      onClick={() => setIsAuthModalOpen(true)}
                      className="flex-1 sm:flex-none h-9 px-4 rounded-xl border border-amber-500/40 text-xs font-semibold text-amber-700 dark:text-amber-300 hover:bg-amber-500/10 transition-all flex items-center justify-center gap-1.5"
                    >
                      <LogIn className="w-3.5 h-3.5" /> Sign In
                    </button>
                    <button
                      onClick={() => router.push('/register/personal')}
                      className="flex-1 sm:flex-none h-9 px-4 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <UserPlus className="w-3.5 h-3.5" /> Create Account
                    </button>
                  </div>
                </div>
              )}

              {/* PROFILE COMPLETION CARD */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/90 dark:border-zinc-800 p-4 sm:p-5 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">Profile Completion</h3>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        profileCompletion.percentage === 100
                          ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/60'
                          : 'bg-primary/10 text-primary border border-primary/20'
                      }`}>
                        {profileCompletion.percentage}% Complete
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {profileCompletion.percentage === 100
                        ? 'Your profile is fully configured for seamless 1-click vet visits and prescriptions!'
                        : 'Complete optional contact and pet details for instant prescription refills and SMS appointment updates.'}
                    </p>
                  </div>
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300 hidden sm:block">
                    {profileCompletion.percentage} / 100
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-500 rounded-full"
                    style={{ width: `${profileCompletion.percentage}%` }}
                  />
                </div>

                {/* Checklist Pills */}
                <div className="flex items-center gap-2 pt-1 flex-wrap">
                  <div className={`text-[11px] font-medium px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-colors ${
                    profileCompletion.checks.hasAccount
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60'
                      : 'bg-slate-100 text-slate-500 dark:bg-zinc-800 dark:text-slate-400'
                  }`}>
                    {profileCompletion.checks.hasAccount ? <Check className="w-3 h-3 text-emerald-600" /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />}
                    Account Details
                  </div>

                  <div className={`text-[11px] font-medium px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-colors ${
                    profileCompletion.checks.hasPhone
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60'
                      : 'bg-slate-100 text-slate-500 dark:bg-zinc-800 dark:text-slate-400'
                  }`}>
                    {profileCompletion.checks.hasPhone ? <Check className="w-3 h-3 text-emerald-600" /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />}
                    Phone (Optional)
                  </div>

                  <div className={`text-[11px] font-medium px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-colors ${
                    profileCompletion.checks.hasAddress
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60'
                      : 'bg-slate-100 text-slate-500 dark:bg-zinc-800 dark:text-slate-400'
                  }`}>
                    {profileCompletion.checks.hasAddress ? <Check className="w-3 h-3 text-emerald-600" /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />}
                    Address (Optional)
                  </div>

                  <button
                    onClick={() => handleSelectTab('care', 'pets')}
                    className={`text-[11px] font-medium px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer hover:opacity-85 ${
                      profileCompletion.checks.hasPet
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60'
                        : 'bg-slate-100 text-slate-500 dark:bg-zinc-800 dark:text-slate-400'
                    }`}
                  >
                    {profileCompletion.checks.hasPet ? <Check className="w-3 h-3 text-emerald-600" /> : <Plus className="w-3 h-3 text-primary" />}
                    {pets.length > 0 ? `${pets.length} Pet${pets.length > 1 ? 's' : ''} Added` : 'Register Pet'}
                  </button>
                </div>
              </div>

              {/* MAIN PROFILE FORM CARD */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/90 dark:border-zinc-800 p-5 sm:p-6 shadow-xs space-y-6">
                {/* SECTION 1: REGISTRATION ACCOUNT DETAILS */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-slate-100 dark:border-zinc-800">
                    <div>
                      <h2 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                        <User className="w-4 h-4 text-primary" /> Basic Account Information
                      </h2>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Provided during registration. Used to identify your pet parent profile.
                      </p>
                    </div>
                    <span className="self-start sm:self-center text-[10px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-zinc-800 px-2.5 py-0.5 rounded-full">
                      Core Identity
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">First Name</label>
                      <input
                        value={personalProfile.firstName}
                        onChange={(e) => setPersonalProfile({ ...personalProfile, firstName: e.target.value })}
                        placeholder="Your first name"
                        className="mt-1 w-full h-10 rounded-xl border border-slate-200 dark:border-zinc-800 px-3 text-sm bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white outline-none focus:border-primary transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">Last Name</label>
                      <input
                        value={personalProfile.lastName}
                        onChange={(e) => setPersonalProfile({ ...personalProfile, lastName: e.target.value })}
                        placeholder="Your last name"
                        className="mt-1 w-full h-10 rounded-xl border border-slate-200 dark:border-zinc-800 px-3 text-sm bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white outline-none focus:border-primary transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">Username</label>
                      <div className="mt-1 relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-semibold">@</span>
                        <input
                          value={personalProfile.username}
                          onChange={(e) => setPersonalProfile({ ...personalProfile, username: e.target.value })}
                          placeholder="username"
                          className="w-full h-10 rounded-xl border border-slate-200 dark:border-zinc-800 pl-7 pr-3 text-sm bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white outline-none focus:border-primary transition-colors"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">Email Address</label>
                      <div className="mt-1 relative">
                        <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="email"
                          value={personalProfile.email}
                          onChange={(e) => setPersonalProfile({ ...personalProfile, email: e.target.value })}
                          placeholder="name@example.com"
                          className="w-full h-10 rounded-xl border border-slate-200 dark:border-zinc-800 pl-8 pr-3 text-sm bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white outline-none focus:border-primary transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECTION 2: OPTIONAL CONTACT & DELIVERY DETAILS */}
                <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-zinc-800">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-slate-100 dark:border-zinc-800">
                    <div>
                      <h2 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                        <Phone className="w-4 h-4 text-primary" /> Contact & Medicine Delivery
                      </h2>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        You can add these anytime later for doorstep pet medicine delivery and WhatsApp consultation links.
                      </p>
                    </div>
                    <span className="self-start sm:self-center text-[10px] font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">
                      Optional
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">Phone Number</label>
                        <span className="text-[10px] text-slate-400">Can add later</span>
                      </div>
                      <div className="mt-1 relative">
                        <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          value={personalProfile.phone}
                          onChange={(e) => setPersonalProfile({ ...personalProfile, phone: e.target.value })}
                          placeholder="e.g. +91 98765 43210"
                          className="w-full h-10 rounded-xl border border-slate-200 dark:border-zinc-800 pl-8 pr-3 text-sm bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white outline-none focus:border-primary transition-colors"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">City / Region</label>
                        <span className="text-[10px] text-slate-400">Can add later</span>
                      </div>
                      <div className="mt-1 relative">
                        <MapPin className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          value={personalProfile.city}
                          onChange={(e) => setPersonalProfile({ ...personalProfile, city: e.target.value })}
                          placeholder="e.g. Bangalore, Karnataka"
                          className="w-full h-10 rounded-xl border border-slate-200 dark:border-zinc-800 pl-8 pr-3 text-sm bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white outline-none focus:border-primary transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">Delivery Address</label>
                      <span className="text-[10px] text-slate-400">For pharmacy & pet food orders</span>
                    </div>
                    <input
                      value={personalProfile.address}
                      onChange={(e) => setPersonalProfile({ ...personalProfile, address: e.target.value })}
                      placeholder="Flat / House no, Building name, Street, Landmark"
                      className="mt-1 w-full h-10 rounded-xl border border-slate-200 dark:border-zinc-800 px-3 text-sm bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>

                {/* SAVE CHANGES FOOTER */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100 dark:border-zinc-800">
                  <div className="min-h-[20px]">
                    {profileSavedFeedback ? (
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200/60 inline-flex items-center gap-1.5 animate-in fade-in">
                        <Check className="w-3.5 h-3.5" /> Profile details saved successfully
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400">
                        {!isAuthenticated ? 'Saved locally for this session.' : 'Saved securely to your Zoodo account.'}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handleSavePersonalProfile}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5" /> Save Changes
                  </button>
                </div>
              </div>

              {/* REGISTERED PETS SUMMARY & DIRECT LINK CARD */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/90 dark:border-zinc-800 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <PawPrint className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">Registered Pets</h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                        {pets.length} {pets.length === 1 ? 'Pet' : 'Pets'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {pets.length > 0
                        ? `Your registered pets (${pets.map((p) => p.name).join(', ')}) have active blockchain health cards.`
                        : 'Register your dog, cat, or other companion to track vaccinations and health history.'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleSelectTab('care', 'pets')}
                  className="w-full sm:w-auto h-9 px-4 rounded-xl border border-slate-200 dark:border-zinc-800 hover:border-primary/40 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:text-primary transition-all flex items-center justify-center gap-1.5 shrink-0"
                >
                  Manage in My Pets <ArrowRight className="w-3.5 h-3.5 text-primary" />
                </button>
              </div>
            </div>
          )}

          {/* TAB: GROOMING */}
          {activeTab === 'grooming' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Grooming & Spa</h1>
                  <p className="text-sm text-muted-foreground mt-1">Certified pet stylists, medicated baths, and mobile grooming vans.</p>
                </div>
                <span className="text-xs text-primary bg-primary/10 px-3 py-1 rounded-full font-medium self-start">
                  Mobile Van or Salon
                </span>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { title: 'Bath & Brush', duration: '45 mins', price: '₹799', desc: 'Organic herbal shampoo, blow dry, ear cleaning & nail clipping.' },
                  { title: 'Full Royal Spa', duration: '90 mins', price: '₹1,499', desc: 'Breed haircut, aromatherapy bath, paw massage & de-shedding.' },
                  { title: 'Medicated Tick Bath', duration: '60 mins', price: '₹999', desc: 'Anti-tick wash, fungal treatment rinse & coat conditioning.' },
                ].map((item, i) => (
                  <div key={i} className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 flex flex-col justify-between shadow-xs">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-foreground">{item.title}</h3>
                        <span className="text-xs font-bold text-primary">{item.price}</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                      <p className="text-[11px] text-muted-foreground/70">⏱ {item.duration}</p>
                    </div>
                    <button
                      onClick={() => handleConsultClick(item)}
                      className="mt-4 w-full h-9 rounded-full bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-all"
                    >
                      Book Grooming Slot
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: TRAINING */}
          {activeTab === 'training' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Training & Behavior</h1>
                <p className="text-sm text-muted-foreground mt-1">Positive reinforcement canine coaching with certified master trainers.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { title: 'Puppy Socialization & Basics', duration: '4 Weeks • 8 Sessions', price: '₹4,999', desc: 'Potty training, crate habits, leash walking & bite inhibition.' },
                  { title: 'Obedience & Recall Mastery', duration: '6 Weeks • 12 Sessions', price: '₹7,499', desc: 'Sit, stay, heel, reliable recall off-leash and impulse control.' },
                  { title: 'Behavior Correction Clinic', duration: '1-on-1 Personalized', price: '₹1,200/session', desc: 'Separation anxiety, excessive barking, aggression & fear therapy.' },
                ].map((item, i) => (
                  <div key={i} className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 flex flex-col justify-between shadow-xs">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-foreground">{item.title}</h3>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="text-muted-foreground">{item.duration}</span>
                        <span className="font-bold text-primary">{item.price}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleConsultClick(item)}
                      className="mt-4 w-full h-9 rounded-full bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-all"
                    >
                      Book Free Evaluation
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: FOOD */}
          {activeTab === 'food' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Pet Food & Nutrition</h1>
                  <p className="text-sm text-muted-foreground mt-1">Vet-recommended diets, hypoallergenic kibble, and fresh meal delivery.</p>
                </div>
                <span className="text-xs text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1 rounded-full font-medium self-start">
                  2-Hour Express Delivery
                </span>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { title: 'Royal Canin Maxi Adult (15kg)', brand: 'Royal Canin', price: '₹7,850', tag: 'Best Seller', desc: 'High digestibility, joint support for large adult dogs.' },
                  { title: 'Farmina N&D Grain-Free Lamb & Blueberry', brand: 'Farmina', price: '₹6,400', tag: 'Grain-Free', desc: '98% protein of animal origin, low glycemic formula.' },
                  { title: "Hill's Prescription Diet Gastrointestinal Biome", brand: "Hill's Science", price: '₹5,200', tag: 'Rx Diet', desc: 'ActivBiome+ technology to promote regular healthy stool.' },
                ].map((item, i) => (
                  <div key={i} className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 flex flex-col justify-between shadow-xs">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{item.tag}</span>
                        <span className="text-sm font-bold text-foreground">{item.price}</span>
                      </div>
                      <h3 className="font-bold text-foreground text-sm mt-1">{item.title}</h3>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => handleConsultClick(item)}
                      className="mt-4 w-full h-9 rounded-full bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-all flex items-center justify-center gap-1.5"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" /> Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: PHARMACY */}
          {activeTab === 'pharmacy' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Pet Pharmacy (Rx)</h1>
                  <p className="text-sm text-muted-foreground mt-1">100% verified medications with digital prescription validation.</p>
                </div>
                <span className="text-xs text-primary bg-primary/10 px-3 py-1 rounded-full font-medium self-start">
                  Free Rx Review
                </span>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { title: 'Bravecto Chewable (10-20 kg)', category: 'Tick & Flea Prevention', price: '₹2,350', desc: '12-week comprehensive tick, flea, and mange mite shield.' },
                  { title: 'Supradyn / Pet-Up Multivitamin Syrup', category: 'Supplements', price: '₹420', desc: 'Essential amino acids, Taurine, Zinc, and Vitamin B-Complex.' },
                  { title: 'Clavamox Drops 15ml (Rx Required)', category: 'Antibiotics', price: '₹340', desc: 'Broad spectrum vet antimicrobial for skin & respiratory infections.' },
                ].map((item, i) => (
                  <div key={i} className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 flex flex-col justify-between shadow-xs">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{item.category}</span>
                        <span className="text-sm font-bold text-foreground">{item.price}</span>
                      </div>
                      <h3 className="font-bold text-foreground text-sm mt-1">{item.title}</h3>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => handleConsultClick(item)}
                      className="mt-4 w-full h-9 rounded-full bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Pill className="w-3.5 h-3.5" /> Order Medication
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: ESSENTIALS */}
          {activeTab === 'essentials' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Pet Essentials & Gear</h1>
                <p className="text-sm text-muted-foreground mt-1">Ergonomic harnesses, orthopedic beds, travel carriers, and enrichment toys.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { title: 'Orthopedic Memory Foam Pet Bed', price: '₹3,499', desc: 'Dual-layer therapeutic foam for arthritis relief and deep sleep.' },
                  { title: 'Escape-Proof Tactical No-Pull Harness', price: '₹1,299', desc: 'Reinforced nylon, front clip leash attachment & night reflectors.' },
                  { title: 'Smart Stainless Steel Water Fountain', price: '₹2,199', desc: 'Triple filtration, ultra-quiet pump to encourage cat & dog hydration.' },
                ].map((item, i) => (
                  <div key={i} className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 flex flex-col justify-between shadow-xs">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-foreground text-sm">{item.title}</h3>
                        <span className="text-sm font-bold text-primary">{item.price}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => handleConsultClick(item)}
                      className="mt-4 w-full h-9 rounded-full bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-all flex items-center justify-center gap-1.5"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" /> Buy Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: TAXI */}
          {activeTab === 'taxi' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Pet Taxi & Transit</h1>
                  <p className="text-sm text-muted-foreground mt-1">Safe, air-conditioned rides with pet seatbelts and verified animal lovers.</p>
                </div>
                <span className="text-xs text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1 rounded-full font-medium self-start">
                  Live GPS Tracking
                </span>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { title: 'Clinic & Hospital Transit', price: '₹450 base', desc: 'Stress-free round trip with driver waiting during vet consult.' },
                  { title: 'Airport Pet Cab', price: '₹1,200 base', desc: 'Spacious boot for travel crates with luggage assistance.' },
                  { title: 'City Park & Grooming Shuttle', price: '₹350 base', desc: 'Solo or shared rides for day care and playdates.' },
                ].map((item, i) => (
                  <div key={i} className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 flex flex-col justify-between shadow-xs">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-foreground text-sm">{item.title}</h3>
                        <span className="text-xs font-bold text-primary">{item.price}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => handleConsultClick(item)}
                      className="mt-4 w-full h-9 rounded-full bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Car className="w-3.5 h-3.5" /> Book Ride
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: FLIGHT */}
          {activeTab === 'flight' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Flight Relocation</h1>
                <p className="text-sm text-muted-foreground mt-1">Domestic & international pet air relocation with customs and quarantine support.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { title: 'Domestic Air Travel Assistance', desc: 'Airline compliant crate sizing, fit-to-fly vet certificates, and terminal check-in escort.', price: '₹12,000 onwards' },
                  { title: 'Global International Relocation', desc: 'Rabies titer blood testing, microchip verification, import permits & airport clearance in 50+ countries.', price: '₹45,000 onwards' },
                ].map((item, i) => (
                  <div key={i} className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 flex flex-col justify-between shadow-xs">
                    <div className="space-y-2">
                      <h3 className="font-bold text-foreground">{item.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                      <p className="text-xs font-bold text-primary pt-1">{item.price}</p>
                    </div>
                    <button
                      onClick={() => handleConsultClick(item)}
                      className="mt-4 w-full h-9 rounded-full bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Plane className="w-3.5 h-3.5" /> Request Travel Itinerary
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: HOTEL */}
          {activeTab === 'hotel' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Hotels & Resorts</h1>
                <p className="text-sm text-muted-foreground mt-1">Cage-free boarding, private AC suites, swimming pools, and 24/7 webcams.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { title: 'Paws Haven Luxury Boarding', rating: 4.9, price: '₹1,200 / night', desc: 'Private suite, 3 walks a day, live webcams, gourmet meal plans.' },
                  { title: 'Whisker Villa Cat Resort', rating: 4.8, price: '₹950 / night', desc: 'Multi-level cat trees, soundproof private rooms, soothing music.' },
                  { title: 'Green Meadows Pet Country Club', rating: 5.0, price: '₹1,600 / night', desc: '2-acre fenced play lawn, splash pool, round-the-clock vet presence.' },
                ].map((item, i) => (
                  <div key={i} className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 flex flex-col justify-between shadow-xs">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {item.rating}
                        </span>
                        <span className="text-xs font-bold text-primary">{item.price}</span>
                      </div>
                      <h3 className="font-bold text-foreground text-sm mt-1">{item.title}</h3>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => handleConsultClick(item)}
                      className="mt-4 w-full h-9 rounded-full bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Hotel className="w-3.5 h-3.5" /> Book Room
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: INSURANCE PLANS */}
          {activeTab === 'plans' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Insurance & Protection</h1>
                <p className="text-sm text-muted-foreground mt-1">Cashless vet hospitalization, emergency surgeries, and accident coverage.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { title: 'Essential Safety', price: '₹499/mo', coverage: '₹50,000 / year', desc: 'Accident trauma, fractures, emergency ingestion & wound care.' },
                  { title: 'Comprehensive Care', price: '₹899/mo', coverage: '₹1,50,000 / year', badge: 'Most Popular', desc: 'Surgery, illness hospitalization, diagnostics & outpatient OPD.' },
                  { title: 'Lifetime Elite Shield', price: '₹1,499/mo', coverage: '₹4,00,000 / year', desc: 'Cancer treatments, MRI scans, hereditary disorders & chronic care.' },
                ].map((item, i) => (
                  <div key={i} className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 flex flex-col justify-between shadow-xs">
                    <div className="space-y-2">
                      {item.badge && (
                        <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{item.badge}</span>
                      )}
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-foreground">{item.title}</h3>
                        <span className="text-xs font-bold text-primary">{item.price}</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                      <p className="text-xs font-semibold text-foreground pt-1">Coverage: {item.coverage}</p>
                    </div>
                    <button
                      onClick={() => handleConsultClick(item)}
                      className="mt-4 w-full h-9 rounded-full bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-all"
                    >
                      Get Instant Quote
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: CLAIMS */}
          {activeTab === 'claims' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">File & Track Claims</h1>
                <p className="text-sm text-muted-foreground mt-1">Fast, cashless claim settlement with our network of approved veterinary clinics.</p>
              </div>

              <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-sm text-foreground">Recent Claim #CLM-49201</h3>
                    <p className="text-xs text-muted-foreground">PetCare Hospital • Gastric Torsion Surgery • Filed on Aug 24</p>
                  </div>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30">
                    Approved (₹34,200)
                  </span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
                  <div className="w-full h-full bg-emerald-500 rounded-full" />
                </div>
              </div>

              <div className="text-center py-6">
                <button
                  onClick={() => handleConsultClick({ title: 'New Claim' })}
                  className="h-10 px-6 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> File a New Claim
                </button>
              </div>
            </div>
          )}

          {/* TAB: COMMUNITY */}
          {(activeTab === 'forums' || activeTab === 'adoption' || activeTab === 'events') && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                  {activeTab === 'forums' ? 'Discussions & Q&A' : activeTab === 'adoption' ? 'Adoption & Rescue' : 'Events & Meetups'}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">Connect with pet parents, certified vets, and animal rescue volunteers.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { title: 'Puppy Teething: What chew toys actually worked for you?', author: 'Priya S.', replies: 34, tag: 'Dog Care' },
                  { title: 'Best vet in South Bangalore for senior cat kidney health?', author: 'Arun K.', replies: 19, tag: 'Vet Advice' },
                  { title: 'Weekend Golden Retriever Meetup at Cubbon Park!', author: 'Bangalore Paws Club', replies: 88, tag: 'Community Event' },
                  { title: 'Friendly 8-month-old indie puppy looking for a loving home', author: 'CUPA Rescue', replies: 12, tag: 'Adoption' },
                ].map((post, i) => (
                  <div key={i} className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 shadow-xs space-y-2">
                    <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{post.tag}</span>
                    <h3 className="font-semibold text-sm text-foreground">{post.title}</h3>
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
                      <span>Posted by {post.author}</span>
                      <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" /> {post.replies} replies</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════ */}
          {/* UNIFIED ACTIVITY TABS (NO SEPARATE DASHBOARD!)                     */}
          {/* ══════════════════════════════════════════════════════════════════ */}

          {/* TAB: APPOINTMENTS */}
          {activeTab === 'appointments' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground">My Appointments</h1>
                  <p className="text-sm text-muted-foreground mt-1">Your upcoming and past veterinary, grooming, and training visits.</p>
                </div>
                <button
                  onClick={() => handleSelectTab('care', 'veterinary')}
                  className="h-9 px-4 rounded-full bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all flex items-center gap-1.5 self-start"
                >
                  <Plus className="w-3.5 h-3.5" /> Book New
                </button>
              </div>

              {/* Active / Upcoming Appointment Card */}
              <div className="bg-white dark:bg-gray-950 rounded-2xl border border-primary/30 p-5 space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Today at 4:30 PM (Starts in ~25 mins)
                  </span>
                  <span className="text-xs font-bold text-foreground">₹499 (Paid)</span>
                </div>

                <div className="flex items-start gap-4">
                  <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-gray-100 shrink-0">
                    <Image src={vetRDJ} alt="Doctor" fill className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-base text-foreground">Dr. Robert D. Jarvis</h3>
                    <p className="text-xs text-muted-foreground">General Vet Physician • HD Video Consultation</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Patient: <strong className="text-foreground">Bella</strong> • Reason: Routine allergy & itch review
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex flex-wrap gap-2.5">
                  <button
                    onClick={() => alert('Launching encrypted HD video room...')}
                    className="h-9 px-5 rounded-full bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all flex items-center gap-1.5 shadow-xs"
                  >
                    <Video className="w-4 h-4" /> Join Video Room
                  </button>
                  <button
                    onClick={() => alert('Reschedule dialog opened')}
                    className="h-9 px-4 rounded-full border border-gray-200 dark:border-gray-700 text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-900 transition-all"
                  >
                    Reschedule Slot
                  </button>
                </div>
              </div>

              {/* In-Clinic Upcoming Card */}
              <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground">
                    Tomorrow, Sep 7 • 11:00 AM
                  </span>
                  <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full font-medium">
                    In-Clinic
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground">PetCare Super Specialty Hospital</h3>
                  <p className="text-xs text-muted-foreground">Indiranagar, Bangalore • With Dr. Neha Sharma</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Annual DHPP Booster & Dental Checkup for Bella</p>
                </div>
                <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex gap-2">
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="h-8 px-3 rounded-full border border-gray-200 dark:border-gray-700 text-xs font-medium hover:bg-gray-50 flex items-center gap-1"
                  >
                    <MapPin className="w-3 h-3 text-primary" /> Get Directions
                  </a>
                </div>
              </div>

              {/* Past Consultations */}
              <div>
                <h3 className="font-semibold text-sm text-foreground mb-3">Past Consultations</h3>
                <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">Dr. Emma Paws • Dermatology Consult</p>
                      <p className="text-[11px] text-muted-foreground">Aug 28 • Diagnosis: Mild Contact Dermatitis • Prescribed: Apoquel</p>
                    </div>
                  </div>
                  <button
                    onClick={() => alert('Downloading digital prescription PDF...')}
                    className="h-8 px-3 rounded-full border border-gray-200 text-xs font-medium hover:bg-gray-50 shrink-0 flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" /> Download Rx
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: BOOKINGS (TRAVEL & HOTEL) */}
          {activeTab === 'bookings' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Travel & Hotel Bookings</h1>
                  <p className="text-sm text-muted-foreground mt-1">Active pet taxi rides, hotel boarding stays, and flight bookings.</p>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                    Confirmed Ride
                  </span>
                  <span className="text-xs font-bold text-foreground">₹450</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Car className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-foreground">Pet Taxi: Home → PetCare Hospital</h3>
                    <p className="text-xs text-muted-foreground">Scheduled: Sep 7 at 10:15 AM • AC Pet Sedan</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Driver: Ramesh K. (4.9 ★) • Vehicle: KA-01-MJ-4921</p>
                  </div>
                </div>
                <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex gap-2">
                  <button onClick={() => alert('Calling driver...')} className="h-8 px-3 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                    Call Driver
                  </button>
                  <button onClick={() => alert('Opening live tracking map...')} className="h-8 px-3 rounded-full border border-gray-200 text-xs font-medium hover:bg-gray-50">
                    View Live GPS
                  </button>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-0.5 rounded-full">
                    Upcoming Boarding Stay
                  </span>
                  <span className="text-xs font-bold text-foreground">₹3,600 (3 Nights)</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Hotel className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-foreground">Paws Haven Luxury Boarding Resort</h3>
                    <p className="text-xs text-muted-foreground">Check-in: Sep 12 • Check-out: Sep 15 • Deluxe AC Suite</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Includes: 3 daily walks, swimming session, 24/7 private webcam stream</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: MY ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Orders & Refills</h1>
                <p className="text-sm text-muted-foreground mt-1">Track pet food shipments, pharmacy prescription refills, and gear.</p>
              </div>

              <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-foreground">Order #ZD-94812</h3>
                    <p className="text-xs text-muted-foreground">Placed Today at 9:15 AM • 2 Items</p>
                  </div>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full">
                    Out for Delivery (Arriving by 2 PM)
                  </span>
                </div>

                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>• Royal Canin Maxi Adult Dog Food (15kg) — ₹7,850</p>
                  <p>• Bravecto Tick & Flea Chewable — ₹2,350</p>
                </div>

                {/* Tracking Stepper */}
                <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                  <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden mb-2">
                    <div className="w-3/4 h-full bg-primary rounded-full" />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="font-semibold text-foreground">Order Placed</span>
                    <span className="font-semibold text-foreground">Packed</span>
                    <span className="font-semibold text-primary">Out for Delivery</span>
                    <span>Delivered</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <button onClick={() => alert('Delivery agent: Amit S. (+91 98112-23344)')} className="h-8 px-4 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                    Track Live
                  </button>
                  <button onClick={() => alert('Items re-added to cart!')} className="h-8 px-3 rounded-full border border-gray-200 text-xs font-medium hover:bg-gray-50">
                    Reorder Items
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: MY PETS (Universal) */}
          {activeTab === 'pets' && (
            <div className="space-y-5 max-w-4xl mx-auto px-1 sm:px-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    My Pets
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                    {pets.length} registered {pets.length === 1 ? 'pet' : 'pets'} in your family with verified medical records and health profiles.
                  </p>
                </div>
                <button
                  onClick={() => setAddingPet(true)}
                  className="w-full sm:w-auto h-10 px-4 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all flex items-center justify-center gap-1.5 shadow-xs shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" /> Add New Pet
                </button>
              </div>

              {/* GUEST PET PARENT NOTICE */}
              {!isAuthenticated && (
                <div className="bg-amber-500/10 border border-amber-500/30 dark:bg-amber-950/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                      <PawPrint className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white">Guest Session Mode</h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                        Pets added here are preserved locally in this browser session. Sign in to link them permanently to your account.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="w-full sm:w-auto h-8 px-3 rounded-xl border border-amber-500/40 text-xs font-semibold text-amber-700 dark:text-amber-300 hover:bg-amber-500/10 transition-all shrink-0 flex items-center justify-center gap-1"
                  >
                    <LogIn className="w-3 h-3" /> Sign In to Save
                  </button>
                </div>
              )}

              {/* EMPTY STATE */}
              {pets.length === 0 && !addingPet && (
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-dashed border-slate-300 dark:border-zinc-800 p-8 text-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                    <PawPrint className="w-7 h-7" />
                  </div>
                  <div className="max-w-md mx-auto">
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">No Pets Registered Yet</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Add your first dog, cat, or other companion to track vaccines, store medical notes, and consult top veterinarians with one click.
                    </p>
                  </div>
                  <button
                    onClick={() => setAddingPet(true)}
                    className="h-9 px-5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all inline-flex items-center gap-1.5 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Your First Pet
                  </button>
                </div>
              )}

              {/* ADD PET INLINE FORM */}
              {addingPet && (
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-primary/40 p-4 sm:p-5 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-zinc-800">
                    <div className="flex items-center gap-2">
                      <PawPrint className="w-4 h-4 text-primary" />
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">Register New Pet</h3>
                    </div>
                    <button
                      onClick={() => setAddingPet(false)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">Pet Name *</label>
                      <input
                        className="mt-1 h-10 w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800 text-sm px-3 text-slate-900 dark:text-white outline-none focus:border-primary transition-colors"
                        placeholder="e.g. Bella"
                        value={newPet.name}
                        onChange={(e) => setNewPet({ ...newPet, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">Species</label>
                      <select
                        className="mt-1 h-10 w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800 text-sm px-3 text-slate-900 dark:text-white outline-none focus:border-primary cursor-pointer transition-colors"
                        value={newPet.species}
                        onChange={(e) => setNewPet({ ...newPet, species: e.target.value })}
                      >
                        <option value="Dog">Dog</option>
                        <option value="Cat">Cat</option>
                        <option value="Bird">Bird</option>
                        <option value="Rabbit">Rabbit</option>
                        <option value="Other">Other Species</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">Breed</label>
                      <input
                        className="mt-1 h-10 w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800 text-sm px-3 text-slate-900 dark:text-white outline-none focus:border-primary transition-colors"
                        placeholder="e.g. Golden Retriever"
                        value={newPet.breed}
                        onChange={(e) => setNewPet({ ...newPet, breed: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">Gender</label>
                      <select
                        className="mt-1 h-10 w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800 text-sm px-3 text-slate-900 dark:text-white outline-none focus:border-primary cursor-pointer transition-colors"
                        value={newPet.gender}
                        onChange={(e) => setNewPet({ ...newPet, gender: e.target.value })}
                      >
                        <option value="female">Female</option>
                        <option value="male">Male</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">Age</label>
                      <div className="mt-1 flex gap-2">
                        <input
                          type="number"
                          className="h-10 flex-1 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800 text-sm px-3 text-slate-900 dark:text-white outline-none focus:border-primary transition-colors"
                          placeholder="e.g. 3"
                          value={newPet.age}
                          onChange={(e) => setNewPet({ ...newPet, age: e.target.value })}
                        />
                        <select
                          className="h-10 w-28 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800 text-xs px-2.5 text-slate-900 dark:text-white outline-none focus:border-primary cursor-pointer transition-colors shrink-0"
                          value={newPet.ageUnit}
                          onChange={(e) => setNewPet({ ...newPet, ageUnit: e.target.value })}
                        >
                          <option value="Years">Years</option>
                          <option value="Months">Months</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">Weight (kg)</label>
                      <input
                        type="number"
                        className="mt-1 h-10 w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800 text-sm px-3 text-slate-900 dark:text-white outline-none focus:border-primary transition-colors"
                        placeholder="e.g. 28"
                        value={newPet.weight}
                        onChange={(e) => setNewPet({ ...newPet, weight: e.target.value })}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer pt-1">
                        <input
                          type="checkbox"
                          checked={newPet.sterilized}
                          onChange={(e) => setNewPet({ ...newPet, sterilized: e.target.checked })}
                          className="w-4 h-4 rounded text-primary focus:ring-0"
                        />
                        <span className="font-medium">Sterilized / Neutered</span>
                      </label>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">Medical Notes / Allergies (Optional)</label>
                      <input
                        className="mt-1 h-10 w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800 text-sm px-3 text-slate-900 dark:text-white outline-none focus:border-primary transition-colors"
                        placeholder="e.g. Chicken allergy, sensitive digestion"
                        value={newPet.notes}
                        onChange={(e) => setNewPet({ ...newPet, notes: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-2 border-t border-slate-100 dark:border-zinc-800">
                    <button
                      onClick={() => setAddingPet(false)}
                      className="w-full sm:w-auto h-9 px-4 rounded-xl border border-slate-200 dark:border-zinc-800 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-zinc-800"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSavePet}
                      className="w-full sm:w-auto h-9 px-5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 shadow-xs"
                    >
                      Save Pet
                    </button>
                  </div>
                </div>
              )}

              {/* PETS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pets.map((pet) => (
                  <div
                    key={pet.id}
                    className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/90 dark:border-zinc-800 p-4 sm:p-5 shadow-xs space-y-3 hover:border-primary/40 transition-all"
                  >
                    {editingPetId === pet.id ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-2">
                          <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <Edit3 className="w-3.5 h-3.5 text-primary" /> Edit {pet.name}&apos;s Profile
                          </span>
                          <button
                            onClick={() => setEditingPetId(null)}
                            className="text-slate-400 hover:text-slate-600 text-xs p-1"
                          >
                            Cancel
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <div>
                            <label className="text-[10.5px] font-semibold text-slate-500">Name</label>
                            <input
                              value={editPetData.name}
                              onChange={(e) => setEditPetData({ ...editPetData, name: e.target.value })}
                              className="mt-1 w-full h-9 rounded-xl border border-slate-200 dark:border-zinc-700 px-2.5 text-xs bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white outline-none focus:border-primary"
                            />
                          </div>
                          <div>
                            <label className="text-[10.5px] font-semibold text-slate-500">Species</label>
                            <select
                              value={editPetData.species}
                              onChange={(e) => setEditPetData({ ...editPetData, species: e.target.value })}
                              className="mt-1 w-full h-9 rounded-xl border border-slate-200 dark:border-zinc-700 px-2.5 text-xs bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white cursor-pointer outline-none focus:border-primary"
                            >
                              <option value="Dog">Dog</option>
                              <option value="Cat">Cat</option>
                              <option value="Bird">Bird</option>
                              <option value="Rabbit">Rabbit</option>
                              <option value="Other">Other Species</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-[10.5px] font-semibold text-slate-500">Breed</label>
                            <input
                              value={editPetData.breed}
                              onChange={(e) => setEditPetData({ ...editPetData, breed: e.target.value })}
                              className="mt-1 w-full h-9 rounded-xl border border-slate-200 dark:border-zinc-700 px-2.5 text-xs bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white outline-none focus:border-primary"
                            />
                          </div>
                          <div>
                            <label className="text-[10.5px] font-semibold text-slate-500">Weight (kg)</label>
                            <input
                              type="number"
                              value={editPetData.weight}
                              onChange={(e) => setEditPetData({ ...editPetData, weight: e.target.value })}
                              className="mt-1 w-full h-9 rounded-xl border border-slate-200 dark:border-zinc-700 px-2.5 text-xs bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white outline-none focus:border-primary"
                            />
                          </div>
                          <div>
                            <label className="text-[10.5px] font-semibold text-slate-500">Age ({editPetData.ageUnit})</label>
                            <input
                              type="number"
                              value={editPetData.age}
                              onChange={(e) => setEditPetData({ ...editPetData, age: e.target.value })}
                              className="mt-1 w-full h-9 rounded-xl border border-slate-200 dark:border-zinc-700 px-2.5 text-xs bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white outline-none focus:border-primary"
                            />
                          </div>
                          <div className="flex items-end pb-1.5">
                            <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={editPetData.sterilized}
                                onChange={(e) => setEditPetData({ ...editPetData, sterilized: e.target.checked })}
                                className="w-4 h-4 rounded text-primary focus:ring-0"
                              />
                              <span>Sterilized / Neutered</span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <label className="text-[10.5px] font-semibold text-slate-500">Medical Notes / Allergies</label>
                          <input
                            value={editPetData.notes}
                            onChange={(e) => setEditPetData({ ...editPetData, notes: e.target.value })}
                            className="mt-1 w-full h-9 rounded-xl border border-slate-200 dark:border-zinc-700 px-2.5 text-xs bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white outline-none focus:border-primary"
                            placeholder="e.g. Chicken allergy, sensitive digestion"
                          />
                        </div>
                        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-1 border-t border-slate-100 dark:border-zinc-800">
                          <button
                            onClick={() => setEditingPetId(null)}
                            className="w-full sm:w-auto px-3 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-700 text-xs font-medium text-slate-600 dark:text-slate-300"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleUpdatePet}
                            className="w-full sm:w-auto px-4 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 shadow-xs"
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start gap-3 sm:gap-3.5">
                          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-primary/10 flex items-center justify-center font-bold text-base text-primary shrink-0">
                            {pet.name ? pet.name.charAt(0).toUpperCase() : 'P'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1 flex-wrap">
                              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate">{pet.name}</h3>
                              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full font-semibold border border-emerald-200/50 shrink-0">
                                Health Card Active
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                              {pet.species} • {pet.breed || 'Mixed Breed'} {pet.gender ? `(${pet.gender})` : ''}
                            </p>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              {pet.age} {pet.ageUnit || 'Years'} old • {pet.weight} kg • {pet.sterilized ? 'Sterilized' : 'Intact'}
                            </p>
                            {pet.notes && (
                              <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                                Notes: {pet.notes}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* RESPONSIVE CARD ACTIONS */}
                        <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 grid grid-cols-2 sm:flex sm:items-center sm:justify-between gap-2">
                          <div className="contents sm:flex sm:items-center sm:gap-1.5">
                            <button
                              onClick={() => handleStartEditPet(pet)}
                              className="h-8 px-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 text-xs font-medium hover:bg-slate-50 dark:hover:bg-zinc-800 flex items-center justify-center gap-1 text-slate-700 dark:text-slate-200"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-primary" /> Edit
                            </button>
                            <button
                              onClick={() => handleDeletePet(pet.id)}
                              className="h-8 px-2.5 sm:px-0 sm:w-8 rounded-xl border border-slate-200 dark:border-zinc-800 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center justify-center transition-colors text-xs font-medium"
                              title="Delete Pet"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> <span className="sm:hidden ml-1">Delete</span>
                            </button>
                          </div>
                          <div className="contents sm:flex sm:items-center sm:gap-1.5">
                            <button
                              onClick={() => handleSelectTab('care', 'medical-history')}
                              className="h-8 px-2.5 sm:px-3 rounded-xl border border-slate-200 dark:border-zinc-800 text-xs font-medium hover:bg-slate-50 dark:hover:bg-zinc-800 flex items-center justify-center gap-1.5"
                            >
                              <FileText className="w-3.5 h-3.5 text-primary" /> Records
                            </button>
                            <button
                              onClick={() => handleSelectTab('care', 'find-vet')}
                              className="h-8 px-2.5 sm:px-3 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 text-xs font-semibold flex items-center justify-center gap-1.5"
                            >
                              <Calendar className="w-3.5 h-3.5" /> Book Vet
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Auth Prompt Modal (If unauthenticated user clicks action) */}
      <AuthPromptModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        itemTitle={selectedDoctorForBooking?.name || selectedDoctorForBooking?.title || 'this service'}
      />

      {/* Creative Character Booking Popup (Multiverse Doctor Quote & Waitlist Modal) */}
      {selectedVetForPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-0 max-w-md w-full mx-4 shadow-2xl overflow-hidden border border-slate-200 dark:border-zinc-800 animate-in zoom-in-95 duration-200">
            {/* Header Banner with Avatar */}
            <div className="relative h-32 bg-primary/10">
              <button
                type="button"
                onClick={() => setSelectedVetForPopup(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors z-10"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                <div className="relative w-32 h-32 rounded-full border-4 border-white dark:border-zinc-900 overflow-hidden shadow-lg bg-white dark:bg-zinc-800">
                  <Image
                    src={selectedVetForPopup.image}
                    alt={selectedVetForPopup.name}
                    fill
                    className="object-cover object-top"
                  />
                </div>
              </div>
            </div>

            <div className="pt-20 pb-7 px-6 text-center">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                {selectedVetForPopup.name}
              </h3>
              <p className="text-xs text-primary font-semibold mb-3 uppercase tracking-wider">
                {selectedVetForPopup.clinicName || selectedVetForPopup.hospital || selectedVetForPopup.specialization}
              </p>

              {/* Consultation Format & Price Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
                {selectedVetForPopup.mode === 'clinic' ? (
                  <>
                    <Building2 className="w-3.5 h-3.5 shrink-0" />
                    <span>In-Clinic Appointment • {selectedVetForPopup.fee || selectedVetForPopup.consultationFee}</span>
                  </>
                ) : selectedVetForPopup.mode === 'home' ? (
                  <>
                    <HomeIcon className="w-3.5 h-3.5 shrink-0" />
                    <span>Home Visit Request • {selectedVetForPopup.fee || selectedVetForPopup.consultationFee}</span>
                  </>
                ) : (
                  <>
                    <Video className="w-3.5 h-3.5 shrink-0" />
                    <span>Video Consultation • {selectedVetForPopup.fee || selectedVetForPopup.consultationFee}</span>
                  </>
                )}
              </div>

              {/* Multiverse Character Quote Box */}
              <div className="bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/80 dark:border-zinc-700/80 rounded-2xl p-4 sm:p-5 mb-5 relative shadow-inner text-center">
                <p className="text-slate-700 dark:text-slate-200 text-sm sm:text-base font-medium italic leading-relaxed whitespace-pre-line">
                  &ldquo;{selectedVetForPopup.bookingMessage || "Currently unavailable due to high demand in the multiverse."}&rdquo;
                </p>
              </div>

              {/* Priority Waitlist Feedback Alert */}
              {isWaitlistNotified && (
                <div className="mb-4 py-2 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-700 dark:text-emerald-300 flex items-center justify-center gap-1.5 animate-in fade-in zoom-in-95">
                  <CheckCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>You&apos;re on the waitlist! We&apos;ll notify you when slots open up.</span>
                </div>
              )}

              <div className="flex gap-3 grid grid-cols-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedVetForPopup(null)}
                  className="w-full rounded-xl border-slate-200 hover:bg-slate-50 dark:border-zinc-700 dark:hover:bg-zinc-800 text-xs font-semibold h-11"
                >
                  Close
                </Button>
                <Button
                  className={`w-full rounded-xl text-xs font-semibold h-11 transition-all ${
                    isWaitlistNotified
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-primary hover:bg-primary/90 text-primary-foreground'
                  }`}
                  onClick={() => setIsWaitlistNotified(!isWaitlistNotified)}
                >
                  {isWaitlistNotified ? '✓ On Waitlist' : 'Notify Me'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ServicesPortalPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-muted-foreground">Loading Services Hub...</div>}>
      <ServicesPortalContent />
    </Suspense>
  );
}
