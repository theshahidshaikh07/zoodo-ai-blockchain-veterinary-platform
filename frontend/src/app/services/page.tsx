'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  LayoutGrid,
  Video,
  Building2,
  Home as HomeIcon,
  AlertTriangle,
  Star,
  ThumbsUp,
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
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Users,
  ExternalLink,
  MapPin,
  X,
  Save,
  Download,
  Share2,

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
import ServicesAppHeader, { CONSULT_MODES } from '@/components/portal/ServicesAppHeader';
import AuthPromptModal from '@/components/portal/AuthPromptModal';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
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

// Import all 12 hospital images from hospital directory
import hospQueens from '@/assets/hospital/Queens mother hospital.jpeg';
import hospPenn from '@/assets/hospital/pennvet.jpg';
import hospBluePearl from '@/assets/hospital/bluepearl.jpg';
import hospCascade from '@/assets/hospital/Cascade Hospitals for Animals.jpeg';
import hospTownCountry from '@/assets/hospital/town & country animal hospital.jpg';
import hospClinton from '@/assets/hospital/clinton keith veterinary hospital.jpg';
import hospVetic from '@/assets/hospital/vetic.jpg';
import hospAngell from '@/assets/hospital/Angell Animal Medical Center – Boston, Massachusetts, USA.jpg';
import hospSchwarzman from '@/assets/hospital/Schwarzman Animal Medical Center Opens Surgical Care Facility in Lenox Hill, Manhattan.jpg';
import hospHawkBridge from '@/assets/hospital/hawk bridge animal hospital.jpeg';
import hospFalcon from '@/assets/hospital/abu dhabi falcon hospital.jpg';
import hospMetro from '@/assets/hospital/hospital.jpg';

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
  // 1. Dr. Pawbert Downey Jr. (Malibu, Los Angeles)
  {
    id: 1,
    name: 'Dr. Pawbert Downey Jr.',
    gender: 'Male',
    specialization: 'Veterinary Dermatologist',
    experience: '18 years',
    rating: 4.9,
    reviews: 1420,


    education: 'Stark Vet Academy, DVM Veterinary Dermatology',
    languages: ['English'],
    isOnline: true,
    waitTime: 'Available Today',
    fee: '$95',
    consultationType: 'In-Clinic & Video',
    image: vetRDJ,
    species: ['Dogs', 'Cats'],
    badge: 'Top Dermatologist',
    area: 'Malibu',
    city: 'Los Angeles',
    state: 'California',
    country: 'USA',
    clinicName: 'Stark Pet Clinic',
    clinicAddress: 'Malibu, Los Angeles, California, USA',
    consultModes: ['video', 'clinic'],
    symptoms: ['Skin Rash', 'Hair Fall', 'Itching', 'Ear Infection', 'Allergies'],
    bookingMessage: "Proof that Dr. Pawbert has a heart... for animals.\nJarvis says I'm fully booked.\nHit notify and he'll call you back.\nLove you 3000!",
  },
  // 2. Dr. Emma Paws (London)
  {
    id: 2,
    name: 'Dr. Emma Paws',
    gender: 'Female',
    specialization: 'Small Animal Surgeon',
    experience: '15 years',
    rating: 4.9,
    reviews: 1150,


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
    clinicName: 'Camden Vet Hospital',
    clinicAddress: 'Camden, London, UK • Available Worldwide Online',
    consultModes: ['video'],
    symptoms: ['Limping', 'Joint Fracture', 'Cruciate Ligament', 'Hip Dysplasia', 'General Medicine'],
    bookingMessage: "Expecto Patronum!\nMy schedule is cursed - fully booked.\nSend your Patronus to the waitlist,\nI'll Apparate when available.",
  },
  // 3. Dr. King Beakhan (Mumbai)
  {
    id: 3,
    name: 'Dr. King Beakhan',
    gender: 'Male',
    specialization: 'General Practice & Pet Wellness',
    experience: '24 years',
    rating: 4.9,
    reviews: 2300,


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
    clinicName: 'Crown Vet Clinic',
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
    specialization: 'Vet Sports Medicine & Rehab',
    experience: '16 years',
    rating: 4.9,
    reviews: 1280,


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
    clinicName: 'Miami Pet Physio',
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
    specialization: 'Veterinary Ophthalmologist',
    experience: '12 years',
    rating: 4.9,
    reviews: 940,


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
    clinicName: 'Pacific Eye Clinic',
    clinicAddress: 'Beverly Hills, Los Angeles, California, USA',
    consultModes: ['clinic'],
    symptoms: ['Corneal Ulcer', 'Cataract Check', 'Conjunctivitis', 'Vision Loss', 'Glaucoma'],
    bookingMessage: "People say my eyes are mesmerizing.\nThey could cure anything... except my fully booked schedule.\nHit notify and try not to stare.",
  },
  // 6. Dr. Pawmitabh Bachchan (Mumbai)
  {
    id: 6,
    name: 'Dr. Pawmitabh Bachchan',
    gender: 'Male',
    specialization: 'Veterinary Surgeon & Oncologist',
    experience: '32 years',
    rating: 5.0,
    reviews: 3400,


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
    clinicName: 'Juhu Pet Hospital',
    clinicAddress: 'Juhu, Mumbai, Maharashtra, India',
    consultModes: ['clinic'],
    symptoms: ['Complex Surgery', 'Second Opinion', 'Oncology', 'Geriatric Pet Care'],
    bookingMessage: "Parampara, Pratishtha, Anushasan!\nJaya says no appointments...\nRekha might help - Hit notify.\nMaa ka bharosa... AAAAGGG!!",
  },
  // 7. Dr. Ana de Paws (LA)
  {
    id: 7,
    name: 'Dr. Ana de Paws',
    gender: 'Female',
    specialization: 'Feline Medicine Specialist',
    experience: '9 years',
    rating: 4.8,
    reviews: 820,


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
    clinicName: 'Silver Lake Pet Care',
    clinicAddress: 'Silver Lake, Los Angeles, California, USA',
    consultModes: ['video', 'home'],
    symptoms: ['Checkups', 'Vaccination', 'Feline Nutrition', 'Vomiting', 'Hairballs'],
    bookingMessage: "Paloma here! Booked for three weeks... actually three months.\nNo time to die - Hit notify, 007 will call back.",
  },
  // 8. Dr. Henry Hoofill (New York)
  {
    id: 8,
    name: 'Dr. Henry Hoofill',
    gender: 'Male',
    specialization: 'Emergency & Critical Care',
    experience: '17 years',
    rating: 4.9,
    reviews: 1150,


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
    clinicName: 'Manhattan Vet Center',
    clinicAddress: 'Manhattan, New York, NY, USA',
    consultModes: ['video', 'clinic'],
    symptoms: ['Acute Trauma', 'Spine Injury', 'Hip Dysplasia', 'Critical Care', 'Arthritis'],
    bookingMessage: "Krypton exploded, so did my availability.\nZero slots available, Man of Steel fully booked.\nHit notify, I'll cape back to you.",
  },
  // 9. Dr. Meowdison Beer (LA)
  {
    id: 9,
    name: 'Dr. Meowdison Beer',
    gender: 'Female',
    specialization: 'Veterinary Behaviorist',
    experience: '7 years',
    rating: 4.8,
    reviews: 690,


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
    clinicName: 'WeHo Pet Behavior',
    clinicAddress: 'West Hollywood, Los Angeles, California, USA',
    consultModes: ['video'],
    symptoms: ['Anxiety Relief', 'Noise Phobia', 'Separation Anxiety', 'Aggression Management'],
    bookingMessage: "Baby I'm a wreck... and so is my schedule!\nHit notify, I'll sing your pet a lullaby when I'm free.",
  },
  // 10. Dr. Aishscalya Rai (Mumbai)
  {
    id: 10,
    name: 'Dr. Aishscalya Rai',
    gender: 'Female',
    specialization: 'Veterinary Cardiologist',
    experience: '19 years',
    rating: 4.9,
    reviews: 1900,


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
    clinicName: 'Worli Heart Clinic',
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
    specialization: 'Orthopedic Surgeon',
    experience: '26 years',
    rating: 4.8,
    reviews: 1820,


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
    clinicName: 'Galaxy Vet Hospital',
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
    specialization: 'Veterinary Nutritionist',
    experience: '14 years',
    rating: 4.8,
    reviews: 970,


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
    clinicName: 'PurePaws Nutrition',
    clinicAddress: 'Andheri West, Mumbai, Maharashtra, India',
    consultModes: ['video', 'clinic'],
    symptoms: ['Diet Planning', 'Weight Loss', 'Renal Diet', 'Food Allergies', 'Gastroenterology'],
    bookingMessage: "Sheila Here!\nJab Tak Hai Jaan.... I'll treat Animals!\nBut my schedule went Bang Bang!\nTap Notify!",
  },
  // 13. Dr. Pupper Reeves (LA)
  {
    id: 13,
    name: 'Dr. Pupper Reeves',
    gender: 'Male',
    specialization: 'Emergency Medicine Specialist',
    experience: '22 years',
    rating: 5.0,
    reviews: 2100,


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
    clinicName: 'Guardian Emergency',
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
    specialization: 'Critical Care & Emergency Vet',
    experience: '20 years',
    rating: 4.9,
    reviews: 1320,


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
    clinicName: 'Kensington 24/7 Vet',
    clinicAddress: 'Kensington, London, England, UK',
    consultModes: ['clinic'],
    symptoms: ['Emergency Surgery', 'Toxin Ingestion', 'Gastric Torsion', 'Intensive Care'],
    bookingMessage: "Saving pets from Gotham's streets,\nIt's not who I am underneath,\nbut what I do that defines me.\nHit Notify - I'll connect when I'm free.",
  },
  // 15. Dr. Millie Tabby Brown (Nashville)
  {
    id: 15,
    name: 'Dr. Millie Tabby Brown',
    gender: 'Female',
    specialization: 'Pediatric & Adolescent Pet Vet',
    experience: '8 years',
    rating: 4.8,
    reviews: 760,


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
    clinicName: 'Green Hills Pet Care',
    clinicAddress: 'Green Hills, Nashville, Tennessee, USA',
    consultModes: ['video', 'home'],
    symptoms: ['Puppy Vaccinations', 'Growth Check', 'Deworming', 'Teething Problems', 'Puppy Behavior'],
    bookingMessage: "Vecna took my free time! Fully booked!\nHit notify before my nose bleeds again.",
  },
  // 16. Dr. Furiana Grande (Paris)
  {
    id: 16,
    name: 'Dr. Furiana Grande',
    gender: 'Female',
    specialization: 'Avian & Exotic Animal Vet',
    experience: '11 years',
    rating: 4.9,
    reviews: 850,


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
    clinicName: 'Clinique Marais Vet',
    clinicAddress: 'Le Marais, Paris, France • Available Worldwide Online',
    consultModes: ['video'],
    symptoms: ['Bird Feather Plucking', 'Beak Care', 'Parrot Respiratory Infection', 'Exotic Pet Health'],
    bookingMessage: "I've got 7 rings, but 0 open slots.\nFully booked - Hit Notify, Thank U, Next.",
  },
  // 17. Dr. Cillian Meowphy (LA)
  {
    id: 17,
    name: 'Dr. Cillian Meowphy',
    gender: 'Male',
    specialization: 'Veterinary Radiologist',
    experience: '18 years',
    rating: 4.9,
    reviews: 730,


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
    clinicName: 'Pasadena Pet Imaging',
    clinicAddress: 'Pasadena, Los Angeles, California, USA',
    consultModes: ['video', 'clinic'],
    symptoms: ['X-Ray Scan', 'CT & MRI Review', 'Tumor Screening', 'Internal Diagnostics'],
    bookingMessage: "I have become... unavailable.\nThe destroyer of your plans.\nHit Notify... by order of the Peaky Blinders.",
  },
  // 18. Dr. Sadie Paws (New York)
  {
    id: 18,
    name: 'Dr. Sadie Paws',
    gender: 'Female',
    specialization: 'Veterinary Dermatologist',
    experience: '6 years',
    rating: 4.8,
    reviews: 530,


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
    clinicName: 'Brooklyn Pet Derma',
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
    specialization: 'Veterinary Dentist & Oral Surgeon',
    experience: '13 years',
    rating: 4.8,
    reviews: 680,


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
    clinicName: 'Queens Pet Dental',
    clinicAddress: 'Queens, New York, NY, USA',
    consultModes: ['video', 'clinic'],
    symptoms: ['Tartar Buildup', 'Gingivitis', 'Tooth Extraction', 'Broken Canine', 'Bad Breath'],
    bookingMessage: "I'm still trying to catch Gwen in every universe.\nHit notify, maybe I'll catch your request later.",
  },
  // 20. Dr. Gwen Stecat (New York)
  {
    id: 20,
    name: 'Dr. Gwen Stecat',
    gender: 'Female',
    specialization: 'Veterinary Clinical Pathologist',
    experience: '11 years',
    rating: 4.8,
    reviews: 610,


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
    clinicName: 'Stacy Pet Pathology',
    clinicAddress: 'Upper West Side, New York, NY, USA',
    consultModes: ['clinic'],
    symptoms: ['Advanced Lab Tests', 'Blood Chemistry', 'Urinalysis', 'Biopsy Analysis', 'Lymphoma Check'],
    bookingMessage: "I won an Oscar for Poor Things,\nbut I have Poor Availability.\nNo slots - Tap Notify.",
  },
  // 21. Dr. The Woofnd (Toronto)
  {
    id: 21,
    name: 'Dr. The Woofnd',
    gender: 'Male',
    specialization: 'Emergency & Critical Care Vet',
    experience: '9 years',
    rating: 4.7,
    reviews: 510,


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
    clinicName: 'Toronto 24/7 Vet',
    clinicAddress: 'Downtown Toronto, Ontario, Canada',
    consultModes: ['video'],
    symptoms: ['Late Night Fevers', 'Nocturnal Cough', 'Midnight Emergency', 'Seizure Management', 'Intoxication'],
    bookingMessage: "I said ooh, I'm blinded by the waitlist.\nNo slots available - Tap Notify.",
  },
];

// Partner Clinic & Hospital Data
const CLINICS = [
  {
    id: 101,
    name: 'Crown Vet Clinic',
    type: '24/7 Multi-Specialty Hospital',
    area: 'Bandra West, Mumbai, Maharashtra, India',
    city: 'Mumbai',
    country: 'India',
    distance: '1.8 km away',
    rating: 4.9,
    reviews: 1420,
    facilities: ['24/7 Emergency ICU', 'Digital X-Ray & Ultrasound', 'In-House Pathology Lab', 'Modular Operation Theater'],
    doctorsOnDuty: 15,
    timing: 'Open 24 Hours',
    fee: '₹500 - ₹800',
    phone: '+91 22 6123 4400',
    isEmergency: true,
    image: hospVetic,
    doctorIds: [3, 6, 17, 1, 2, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14],
  },
  {
    id: 102,
    name: 'Stark Pet Clinic',
    type: 'Specialty Care & Dermatology',
    area: 'Malibu, Los Angeles, California, USA',
    city: 'Los Angeles',
    country: 'USA',
    distance: '2.5 km away',
    rating: 4.9,
    reviews: 1850,
    facilities: ['Laser Therapy', 'Allergy & Skin Lab', 'Advanced Surgery', 'Pharmacy Rx'],
    doctorsOnDuty: 4,
    timing: 'Open 24 Hours',
    fee: '$80 - $130',
    phone: '+1 310 555 0199',
    isEmergency: true,
    image: hospClinton,
    doctorIds: [1, 5, 7, 13],
  },
  {
    id: 103,
    name: 'Camden Vet Hospital',
    type: 'Surgery & Emergency Clinic',
    area: 'Camden, London, United Kingdom',
    city: 'London',
    country: 'United Kingdom',
    distance: '3.1 km away',
    rating: 4.9,
    reviews: 1150,
    facilities: ['Orthopedic Theater', 'CT Imaging & Ultrasound', 'Inpatient Ward', 'Cat Friendly Care'],
    doctorsOnDuty: 3,
    timing: '8:00 AM - 10:00 PM',
    fee: '£50 - £85',
    phone: '+44 20 7946 0921',
    isEmergency: false,
    image: hospQueens,
    doctorIds: [2, 14],
  },
  {
    id: 104,
    name: 'Manhattan Vet Center',
    type: 'Trauma & Oncology Center',
    area: 'Manhattan, New York, NY, USA',
    city: 'New York',
    country: 'USA',
    distance: '1.2 km away',
    rating: 4.9,
    reviews: 2100,
    facilities: ['24/7 Trauma ICU', 'Hyperbaric Oxygen', 'Oncology Suite', 'MRI & CT Scan'],
    doctorsOnDuty: 11,
    timing: 'Open 24 Hours',
    fee: '$90 - $140',
    phone: '+1 212 555 0184',
    isEmergency: true,
    image: hospSchwarzman,
    doctorIds: [8, 18, 19, 20, 1, 4, 5, 7, 9, 13, 15],
  },
  {
    id: 105,
    name: 'Pacific Eye Clinic',
    type: 'Eye & Microsurgery Care',
    area: 'Beverly Hills, Los Angeles, California, USA',
    city: 'Los Angeles',
    country: 'USA',
    distance: '3.8 km away',
    rating: 4.9,
    reviews: 940,
    facilities: ['Ophthalmic Surgery', 'Cataract Phaco', 'Retinal Imaging', 'Corneal Cross-linking'],
    doctorsOnDuty: 2,
    timing: '9:00 AM - 7:00 PM',
    fee: '$75 - $110',
    phone: '+1 310 555 0142',
    isEmergency: false,
    image: hospAngell,
    doctorIds: [5, 1, 9, 17],
  },
  {
    id: 106,
    name: 'Juhu Pet Hospital',
    type: 'Oncology & Senior Care',
    area: 'Juhu, Mumbai, Maharashtra, India',
    city: 'Mumbai',
    country: 'India',
    distance: '2.9 km away',
    rating: 5.0,
    reviews: 3400,
    facilities: ['Chemotherapy Suite', 'Geriatric Rehab', 'Emergency Trauma', 'Blood Bank'],
    doctorsOnDuty: 5,
    timing: 'Open 24 Hours',
    fee: '₹800 - ₹1,400',
    phone: '+91 22 6234 8899',
    isEmergency: true,
    image: hospTownCountry,
    doctorIds: [6, 3, 10, 12],
  },
  {
    id: 107,
    name: 'PetCare Hospital',
    type: '24/7 Multi-Specialty ICU',
    area: 'Indiranagar, Bangalore, Karnataka, India',
    city: 'Bangalore',
    country: 'India',
    distance: '2.4 km away',
    rating: 4.9,
    reviews: 890,
    facilities: ['24/7 Emergency ICU', 'Digital X-Ray & Ultrasound', 'In-House Pathology Lab', 'Modular Operation Theater'],
    doctorsOnDuty: 5,
    timing: 'Open 24 Hours',
    fee: '₹400 - ₹750',
    phone: '+91 80 4123 9988',
    isEmergency: true,
    image: hospPenn,
    doctorIds: [11, 12, 3],
  },
  {
    id: 108,
    name: 'Cessna Vet Hospital',
    type: 'Advanced Vet Healthcare',
    area: 'Domlur, Bangalore, Karnataka, India',
    city: 'Bangalore',
    country: 'India',
    distance: '4.1 km away',
    rating: 4.8,
    reviews: 1240,
    facilities: ['Advanced Ortho Surgery', 'Dental Scaling & Polishing', 'Pet Pharmacy', 'Inpatient Ward'],
    doctorsOnDuty: 4,
    timing: '8:00 AM - 10:00 PM',
    fee: '₹600 - ₹950',
    phone: '+91 80 4567 1122',
    isEmergency: false,
    image: hospCascade,
    doctorIds: [12, 11, 6],
  },
  {
    id: 109,
    name: 'BluePearl Pet Hospital',
    type: 'Emergency & Critical Care',
    area: 'Midtown Manhattan, New York, NY, USA',
    city: 'New York',
    country: 'USA',
    distance: '1.6 km away',
    rating: 4.9,
    reviews: 1720,
    facilities: ['24/7 Trauma ICU', 'Cardiac Diagnostics', 'Advanced Endoscopy', 'Pharmacy Rx'],
    doctorsOnDuty: 5,
    timing: 'Open 24 Hours',
    fee: '$85 - $135',
    phone: '+1 212 555 0192',
    isEmergency: true,
    image: hospBluePearl,
    doctorIds: [8, 18, 19, 20],
  },
  {
    id: 110,
    name: 'Hawk Bridge Vet',
    type: 'Orthopedics & Surgery',
    area: 'Kensington, London, England, UK',
    city: 'London',
    country: 'United Kingdom',
    distance: '2.7 km away',
    rating: 4.9,
    reviews: 1320,
    facilities: ['Orthopedic Surgery', 'Spinal Therapy', 'Digital Radiography', 'Intensive Care'],
    doctorsOnDuty: 3,
    timing: 'Open 24 Hours',
    fee: '£60 - £95',
    phone: '+44 20 7946 0884',
    isEmergency: true,
    image: hospHawkBridge,
    doctorIds: [14, 2],
  },
  {
    id: 111,
    name: 'Falcon & Exotic Vet',
    type: 'Avian & Exotic Specialists',
    area: 'Le Marais, Paris, Île-de-France, France',
    city: 'Paris',
    country: 'France',
    distance: '3.4 km away',
    rating: 4.9,
    reviews: 920,
    facilities: ['Avian Surgical Wing', 'Exotic Pet ICU', 'Micro Endoscopy', 'Beak & Feather Care'],
    doctorsOnDuty: 2,
    timing: '8:30 AM - 8:00 PM',
    fee: '€65 - €105',
    phone: '+33 1 42 68 55 00',
    isEmergency: false,
    image: hospFalcon,
    doctorIds: [16],
  },
  {
    id: 112,
    name: 'Metro Vet Hospital',
    type: '24/7 Trauma & Emergency',
    area: 'Downtown Toronto, Ontario, Canada',
    city: 'Toronto',
    country: 'Canada',
    distance: '2.1 km away',
    rating: 4.8,
    reviews: 1180,
    facilities: ['24/7 Emergency Triage', 'Oxygen Chambers', 'Digital Fluoroscopy', 'Emergency Surgery'],
    doctorsOnDuty: 4,
    timing: 'Open 24 Hours',
    fee: 'CA$70 - CA$115',
    phone: '+1 416 555 0177',
    isEmergency: true,
    image: hospMetro,
    doctorIds: [21],
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
    name: 'National Pet Trauma Center',
    location: 'Central Ring Road • 1.2 km away',
    contact: '1800-PET-911',
    rating: 5.0,
    support: 'Immediate critical triage, oxygen chambers, blood transfusion on standby',
    status: 'High Readiness (3 trauma surgeons on duty)',
  },
  {
    id: 302,
    name: 'Rapid Vet Emergency 24/7',
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
    clinic: 'PetCare Hospital',
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
    clinic: 'Paws & Fur Skin Clinic',
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
    clinic: 'Cat Care Sanctuary',
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

function HospitalDoctorShelf({
  hospital,
  doctors,
  onConsultClick,
  onViewAllClick,
}: {
  hospital: (typeof CLINICS)[0];
  doctors: typeof ONLINE_VETS;
  onConsultClick: (doctor: (typeof ONLINE_VETS)[0]) => void;
  onViewAllClick: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 6);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 6);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    const timer = setTimeout(checkScroll, 150);
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      clearTimeout(timer);
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll, doctors]);

  const handleScroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const step = Math.max(280, el.clientWidth * 0.75);
    el.scrollBy({
      left: direction === 'left' ? -step : step,
      behavior: 'smooth',
    });
  };

  const totalDocs = doctors.length;
  // If more than 10 doctors, render the first 10, then the "See all X doctors" card
  const renderedDocs = totalDocs > 10 ? doctors.slice(0, 10) : doctors;
  const showSeeAllCard = totalDocs > 10;

  return (
    <div className="relative group/shelf">
      {/* Left Arrow Button (hidden on mobile, visible on sm+ when scrollable left) */}
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => handleScroll('left')}
          aria-label="Scroll left"
          className="hidden sm:flex absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white dark:bg-zinc-800 shadow-[0_4px_16px_rgba(0,0,0,0.18)] border border-slate-200 dark:border-zinc-700 items-center justify-center text-slate-700 dark:text-zinc-200 hover:text-primary dark:hover:text-primary hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      )}

      {/* Right Arrow Button (hidden on mobile, visible on sm+ when scrollable right) */}
      {canScrollRight && (
        <button
          type="button"
          onClick={() => handleScroll('right')}
          aria-label="Scroll right"
          className="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white dark:bg-zinc-800 shadow-[0_4px_16px_rgba(0,0,0,0.18)] border border-slate-200 dark:border-zinc-700 items-center justify-center text-slate-700 dark:text-zinc-200 hover:text-primary dark:hover:text-primary hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      )}

      {/* Scrollable Doctors Row */}
      <div
        ref={scrollRef}
        className="flex items-stretch gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory py-1 px-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {renderedDocs.map((doc) => {
          return (
            <div
              key={doc.id}
              className="group/doc relative w-[265px] sm:w-[285px] shrink-0 snap-start p-3 rounded-2xl bg-white dark:bg-zinc-800/70 border border-slate-200/70 dark:border-zinc-750 hover:border-slate-300 dark:hover:border-zinc-600 hover:shadow-xs transition-all duration-200 flex flex-col justify-between gap-2.5"
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 bg-slate-200 dark:bg-zinc-700 border border-slate-200 dark:border-zinc-600 shadow-2xs">
                  <Image
                    src={doc.image}
                    alt={doc.name}
                    fill
                    className="object-cover object-top transition-transform group-hover/doc:scale-105"
                    sizes="44px"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-800" />
                </div>

                <div className="min-w-0 flex-1">
                  <a
                    href={`#doctor-${doc.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onConsultClick(doc);
                    }}
                    className="font-bold text-xs sm:text-[13px] text-slate-900 dark:text-white truncate block hover:text-primary transition-colors cursor-pointer"
                    title={doc.name}
                  >
                    {doc.name}
                  </a>
                  <p className="text-[10.5px] font-medium text-slate-500 dark:text-zinc-400 truncate">
                    {doc.specialization}
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-zinc-500">
                    {doc.experience.toLowerCase().includes('experience')
                      ? doc.experience
                      : `${doc.experience} exp`}
                  </p>
                </div>
              </div>

              {/* Bottom Mini-Card Row: Star Rating + Reviews + Book Slot Action */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-200/50 dark:border-zinc-700/50 gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  {(() => {
                    const satNum = Math.min(99, Math.max(90, Math.round(doc.rating * 20)));
                    return (
                      <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 tracking-tight border bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                        <ThumbsUp className="w-2.5 h-2.5 shrink-0" />
                        <span>{satNum}%</span>
                      </div>
                    );
                  })()}
                  <span className="font-medium text-[10px] text-slate-500 dark:text-zinc-400 truncate hidden min-[360px]:inline">
                    {doc.reviews.toLocaleString()} patient stories
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onConsultClick(doc)}
                  className="h-7 px-2.5 rounded-lg bg-primary/10 hover:bg-primary text-primary hover:text-white dark:bg-primary/20 dark:hover:bg-primary dark:text-primary dark:hover:text-primary-foreground border border-primary/20 text-[11px] font-semibold transition-all shadow-2xs hover:scale-102 shrink-0 cursor-pointer"
                >
                  Book Slot
                </button>
              </div>
            </div>
          );
        })}

        {/* 11th Card: See all X doctors Card (After 10 doctor cards) */}
        {showSeeAllCard && (
          <div
            onClick={onViewAllClick}
            className="w-[200px] sm:w-[220px] shrink-0 snap-start rounded-2xl border-2 border-dashed border-slate-200 dark:border-zinc-700 bg-white/70 dark:bg-zinc-800/40 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:border-primary/50 transition-all duration-200 flex flex-col items-center justify-center p-4 text-center group/seeall cursor-pointer select-none"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2.5 group-hover/seeall:scale-110 group-hover/seeall:bg-primary group-hover/seeall:text-white transition-all duration-200 shadow-2xs">
              <Users className="w-5 h-5" />
            </div>
            <span className="font-bold text-xs sm:text-sm text-slate-800 dark:text-zinc-100 group-hover/seeall:text-primary transition-colors block">
              See all {totalDocs} doctors
            </span>
            <span className="text-[10.5px] font-medium text-slate-400 dark:text-zinc-500 mt-1 flex items-center gap-0.5 group-hover/seeall:text-primary transition-colors">
              View full team <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

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
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isMobileSortOpen, setIsMobileSortOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState<any>(null);
  const [selectedVetForPopup, setSelectedVetForPopup] = useState<any | null>(null);
  const [previewImageVet, setPreviewImageVet] = useState<any | null>(null);
  const [isWaitlistNotified, setIsWaitlistNotified] = useState(false);

  // In-page filters matching Practo & MNC e-commerce exact UI
  const [consultTypeFilter, setConsultTypeFilter] = useState<'all' | 'video' | 'clinic' | 'home'>('all');
  const [genderFilter, setGenderFilter] = useState<'all' | 'male' | 'female'>('all');
  const [ratingFilter, setRatingFilter] = useState<'all' | '10' | '70'>('all');
  const [experienceFilter, setExperienceFilter] = useState<'all' | '5' | '10' | '15'>('all');
  const [onlyOnlineFilter, setOnlyOnlineFilter] = useState(false);
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'today'>('all');
  const [speciesFilter, setSpeciesFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'relevance' | 'fee_desc' | 'fee_asc' | 'rating_desc' | 'exp_desc'>('relevance');

  // Hospital & Clinic specific filters & sorting
  const [clinicEmergencyFilter, setClinicEmergencyFilter] = useState<'all' | '24_7' | 'emergency' | 'day'>('all');
  const [clinicFacilityFilter, setClinicFacilityFilter] = useState<'all' | 'icu' | 'imaging' | 'surgery' | 'lab' | 'pharmacy'>('all');
  const [clinicRatingFilter, setClinicRatingFilter] = useState<'all' | '4.9' | '4.8'>('all');
  const [clinicDoctorsFilter, setClinicDoctorsFilter] = useState<'all' | '3' | '5' | '10'>('all');
  const [clinicSortBy, setClinicSortBy] = useState<'relevance' | 'distance_asc' | 'rating_desc' | 'reviews_desc' | 'doctors_desc'>('relevance');

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

    // Patient Stories Filter (10+ Patient Stories, 70+ Patient Stories)
    if (ratingFilter === '10') {
      result = result.filter((doc) => doc.reviews >= 10);
    } else if (ratingFilter === '70') {
      result = result.filter((doc) => doc.reviews >= 70);
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

  // Matched hospitals & clinics for in-clinic mode
  const matchedHospitals = useMemo(() => {
    // Hospital and clinic cards are strictly shown when in 'clinic' mode
    if (consultTypeFilter !== 'clinic') {
      return [];
    }

    let result = [...CLINICS];

    // Filter by location if selected
    if (selectedLocation && selectedLocation !== 'All Locations') {
      const locQ = selectedLocation.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.area.toLowerCase().includes(locQ) ||
          c.city.toLowerCase().includes(locQ) ||
          c.country.toLowerCase().includes(locQ) ||
          (locQ.includes('mumbai') && c.city === 'Mumbai') ||
          (locQ.includes('los angeles') && c.city === 'Los Angeles') ||
          (locQ.includes('new york') && c.city === 'New York') ||
          (locQ.includes('london') && c.city === 'London') ||
          (locQ.includes('bangalore') && c.city === 'Bangalore')
      );
    }

    // Search query: match hospital name, type, area, city, or facilities
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.type.toLowerCase().includes(q) ||
          c.area.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q) ||
          c.facilities.some((f) => f.toLowerCase().includes(q))
      );
    }

    // Emergency & Timing Filter
    if (clinicEmergencyFilter === '24_7') {
      result = result.filter((c) => c.timing.toLowerCase().includes('24') || c.isEmergency);
    } else if (clinicEmergencyFilter === 'emergency') {
      result = result.filter((c) => c.isEmergency);
    } else if (clinicEmergencyFilter === 'day') {
      result = result.filter((c) => !c.isEmergency);
    }

    // Facilities & Capabilities Filter
    if (clinicFacilityFilter === 'icu') {
      result = result.filter((c) =>
        c.facilities.some((f) => /icu|emergency|trauma|critical/i.test(f))
      );
    } else if (clinicFacilityFilter === 'imaging') {
      result = result.filter((c) =>
        c.facilities.some((f) => /x-ray|ultrasound|ct|mri|radiography|fluoroscopy|retinal imaging/i.test(f))
      );
    } else if (clinicFacilityFilter === 'surgery') {
      result = result.filter((c) =>
        c.facilities.some((f) => /surgery|theater|theatre|orthopedic|operation/i.test(f))
      );
    } else if (clinicFacilityFilter === 'lab') {
      result = result.filter((c) =>
        c.facilities.some((f) => /lab|pathology|blood/i.test(f))
      );
    } else if (clinicFacilityFilter === 'pharmacy') {
      result = result.filter((c) =>
        c.facilities.some((f) => /pharmacy|rx/i.test(f))
      );
    }

    // Minimum Rating Filter
    if (clinicRatingFilter === '4.9') {
      result = result.filter((c) => c.rating >= 4.9);
    } else if (clinicRatingFilter === '4.8') {
      result = result.filter((c) => c.rating >= 4.8);
    }

    // Doctors on Duty Filter
    if (clinicDoctorsFilter === '3') {
      result = result.filter((c) => c.doctorsOnDuty >= 3);
    } else if (clinicDoctorsFilter === '5') {
      result = result.filter((c) => c.doctorsOnDuty >= 5);
    } else if (clinicDoctorsFilter === '10') {
      result = result.filter((c) => c.doctorsOnDuty >= 10);
    }

    // Distance parsing helper
    const parseDistanceKm = (str: string) => {
      const match = str.match(/([0-9.]+)/);
      return match ? parseFloat(match[1]) : 999;
    };

    // Sorting
    if (clinicSortBy === 'distance_asc') {
      result.sort((a, b) => parseDistanceKm(a.distance) - parseDistanceKm(b.distance));
    } else if (clinicSortBy === 'rating_desc') {
      result.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
    } else if (clinicSortBy === 'reviews_desc') {
      result.sort((a, b) => b.reviews - a.reviews);
    } else if (clinicSortBy === 'doctors_desc') {
      result.sort((a, b) => b.doctorsOnDuty - a.doctorsOnDuty);
    }

    return result;
  }, [
    consultTypeFilter,
    selectedLocation,
    searchQuery,
    clinicEmergencyFilter,
    clinicFacilityFilter,
    clinicRatingFilter,
    clinicDoctorsFilter,
    clinicSortBy,
  ]);

  // Total active filter count for notification badges (strictly filters, not search bar location or consult mode tabs)
  const activeFilterCount = useMemo(() => {
    if (consultTypeFilter === 'clinic') {
      return [
        clinicEmergencyFilter !== 'all',
        clinicFacilityFilter !== 'all',
        clinicRatingFilter !== 'all',
        clinicDoctorsFilter !== 'all',
      ].filter(Boolean).length;
    }
    return [
      genderFilter !== 'all',
      ratingFilter !== 'all',
      experienceFilter !== 'all',
      speciesFilter !== 'all',
    ].filter(Boolean).length;
  }, [
    consultTypeFilter,
    clinicEmergencyFilter,
    clinicFacilityFilter,
    clinicRatingFilter,
    clinicDoctorsFilter,
    genderFilter,
    ratingFilter,
    experienceFilter,
    speciesFilter,
  ]);

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

  return (
    <div className="h-[100dvh] overflow-hidden flex flex-col bg-[#f4f6f8] dark:bg-zinc-950 font-ui text-foreground dashboard-ui">
      {/* Top Airbnb Header with Category Tabs & Floating Search Pill */}
      <div className="shrink-0 z-50">
        <ServicesAppHeader
          activeCategory={activeCategory}
          activeTab={activeTab}
          onSearchChange={setSearchQuery}
          onNavigateTab={handleSelectTab}
          activeConsultMode={consultTypeFilter}
          onConsultModeChange={(mode) => setConsultTypeFilter(mode)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          detectCurrentLocation={detectCurrentLocation}
          isDetectingLocation={isDetectingLocation}
          availabilityFilter={availabilityFilter}
          setAvailabilityFilter={setAvailabilityFilter}
          speciesFilter={speciesFilter}
          setSpeciesFilter={setSpeciesFilter}
          onOpenFilter={() => setIsMobileFilterOpen(true)}
          onOpenSort={() => setIsMobileSortOpen(true)}
          activeFilterCount={activeFilterCount}
          isSortActive={sortBy !== 'relevance'}
          sortBy={sortBy}
          onSortChange={(id) => setSortBy(id as any)}
        />
      </div>

      {/* Main Body Shell: Clean Full-Width Content Canvas */}
      <div className="flex-1 flex overflow-hidden w-full mx-auto min-h-0 relative">
        {/* Main Content Area - ONLY this container scrolls */}
        <main className="flex-1 h-full overflow-y-auto min-h-0 px-3 pt-4 pb-3 sm:px-6 sm:pt-4 sm:pb-6 lg:px-8 lg:pt-4 lg:pb-8 bg-[#f4f6f8] dark:bg-zinc-950">
          {/* TAB 1: SEARCH & DIRECTORY */}
          {(activeTab === 'find-vet' || activeTab === 'veterinary' || activeTab === 'find-hospital') && (
            <div className="space-y-4 max-w-6xl mx-auto">


              {/* MOBILE 3-PART ACTION SEARCH BAR (Image Reference: Filter Circle + Search Pill + Sort Circle) */}
              <div className={`sm:hidden space-y-2.5 pt-2 relative ${isLocationDropdownOpen ? 'z-50' : 'z-20'}`}>
                {/* Mobile Segmented Control Radio Bar (Flush design: active tab fills outer border seamlessly) */}
                <div className="h-10 bg-slate-100 dark:bg-zinc-850 rounded-full border border-slate-200/90 dark:border-zinc-800 flex items-center w-full shadow-2xs overflow-hidden divide-x divide-slate-200/60 dark:divide-zinc-800">
                  {[
                    { id: 'video', label: 'Video Consult', icon: Video },
                    { id: 'clinic', label: 'In-Clinic', icon: Building2 },
                    { id: 'home', label: 'Home Visit', icon: HomeIcon },
                  ].map((mode) => {
                    const Icon = mode.icon;
                    const isActive = consultTypeFilter === mode.id || (consultTypeFilter === 'all' && mode.id === 'video');
                    return (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => setConsultTypeFilter(mode.id as any)}
                        className={`flex-1 h-full flex items-center justify-center gap-1.5 px-2 text-xs font-semibold transition-all cursor-pointer select-none ${isActive
                            ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                            : 'bg-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                      >
                        <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-primary-foreground' : 'text-slate-500 dark:text-slate-400'}`} />
                        <span className="truncate">{mode.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2 w-full">
                  {/* Left: Circular Filter Button with active count badge (Doctor & Clinic modes) */}
                  <button
                    type="button"
                    onClick={() => setIsMobileFilterOpen(true)}
                    className="w-11 h-11 rounded-full bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 flex items-center justify-center text-slate-700 dark:text-slate-200 shadow-2xs hover:bg-slate-50 dark:hover:bg-zinc-800 shrink-0 relative transition-all active:scale-95"
                    aria-label={consultTypeFilter === 'clinic' ? 'Filter hospitals & clinics' : 'Filter doctors'}
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
                        placeholder={
                          consultTypeFilter === 'clinic'
                            ? 'Search clinics, hospitals, pet care...'
                            : 'Search doctors, specialties, pet symptoms...'
                        }
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
                    className={`w-11 h-11 rounded-full border flex items-center justify-center shadow-2xs shrink-0 relative transition-all active:scale-95 ${sortBy !== 'relevance'
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
                  <div className="flex sm:hidden items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">

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
                        <span>{ratingFilter}+ Patient Stories</span>
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




              {/* DESKTOP SIMPLE DUAL-SEGMENT SEARCH BAR (Matching screenshot reference) */}
              <div className="hidden sm:flex justify-center w-full mb-3 -mt-1">
                <div className="flex items-center w-full max-w-[820px] h-[54px] bg-white dark:bg-zinc-900 rounded-full border border-slate-200/90 dark:border-zinc-800 shadow-xs hover:shadow-sm transition-all p-1.5 px-6 gap-3">
                  {/* Segment 1: Location */}
                  <div className="relative flex-1 min-w-0 flex items-center gap-2.5 cursor-pointer group">
                    <MapPin className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors shrink-0" />
                    <div
                      className="flex-1 min-w-0"
                      onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
                    >
                      <span className="block text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 truncate font-normal select-none">
                        {selectedLocation && selectedLocation !== 'All Locations'
                          ? selectedLocation
                          : 'Search location'}
                      </span>
                    </div>

                    {selectedLocation && selectedLocation !== 'All Locations' && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLocation('All Locations');
                          setLocationSearchInput('');
                        }}
                        className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 shrink-0 cursor-pointer"
                        title="Reset location"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Location Dropdown Modal */}
                    {isLocationDropdownOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setIsLocationDropdownOpen(false)}
                        />
                        <div className="absolute top-full left-0 mt-2 w-80 sm:w-96 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100 cursor-default">
                          {/* Current GPS Location button */}
                          <button
                            type="button"
                            onClick={detectCurrentLocation}
                            disabled={isDetectingLocation}
                            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors group text-left cursor-pointer"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <Navigation className="w-4 h-4 text-primary shrink-0 group-hover:scale-110 transition-transform" />
                              <div className="min-w-0">
                                <span className="block text-xs font-semibold text-slate-900 dark:text-white">
                                  {isDetectingLocation ? 'Detecting current location...' : 'Use Current Location'}
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

                          {/* Reset to Worldwide */}
                          {selectedLocation && selectedLocation !== 'All Locations' && (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedLocation('All Locations');
                                setLocationSearchInput('');
                                setIsLocationDropdownOpen(false);
                              }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors text-slate-700 dark:text-slate-300 cursor-pointer"
                            >
                              <Globe className="w-4 h-4 text-slate-400 shrink-0" />
                              <span className="text-xs font-normal">All Locations (Worldwide)</span>
                            </button>
                          )}

                          {/* Popular Locations */}
                          <div className="border-t border-slate-100 dark:border-zinc-800/80 mt-1 pt-1.5">
                            <div className="px-3 pt-1 pb-1">
                              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                                Popular Cities
                              </span>
                            </div>
                            <div className="space-y-0.5">
                              {[
                                { name: 'Mumbai', subtitle: 'Maharashtra, India', value: 'Mumbai, Maharashtra, India' },
                                { name: 'India', subtitle: 'All nationwide clinics', value: 'India' },
                                { name: 'New York', subtitle: 'New York, USA', value: 'New York, USA' },
                                { name: 'Los Angeles', subtitle: 'California, USA', value: 'Los Angeles, California, USA' },
                                { name: 'London', subtitle: 'England, UK', value: 'London, UK' },
                                { name: 'Dubai', subtitle: 'United Arab Emirates', value: 'Dubai, UAE' },
                              ].map((loc) => (
                                <button
                                  key={loc.name}
                                  type="button"
                                  onClick={() => {
                                    setSelectedLocation(loc.value);
                                    setLocationSearchInput(loc.value);
                                    setIsLocationDropdownOpen(false);
                                  }}
                                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800 text-left transition-colors group cursor-pointer"
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
                                  {selectedLocation === loc.value && (
                                    <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Vertical Divider */}
                  <div className="w-px h-7 bg-slate-200 dark:bg-zinc-800 shrink-0" />

                  {/* Segment 2: Search */}
                  <div className="flex-[1.8] min-w-0 flex items-center gap-2.5">
                    <Search className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={
                        consultTypeFilter === 'clinic'
                          ? 'Search clinics, hospitals, pet emergency...'
                          : 'Search doctors, specialties, pet symptoms...'
                      }
                      className="w-full bg-transparent text-xs sm:text-[13px] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 outline-none truncate font-normal"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 shrink-0 cursor-pointer"
                        title="Clear search"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* DESKTOP SINGLE UNIFIED FILTER BAR (Responsive for Doctor & In-Clinic modes) */}
              {consultTypeFilter === 'clinic' ? (
                /* IN-CLINIC / HOSPITALS DESKTOP FILTER BAR */
                <div className={`hidden sm:block w-full mb-3 relative ${openFilterDropdown ? 'z-30' : 'z-10'}`}>
                  <div className="w-full bg-white dark:bg-zinc-900 rounded-full border border-slate-200 dark:border-zinc-800 p-1 sm:p-1.5 shadow-2xs flex items-center gap-1 sm:gap-1.5 overflow-visible">
                    {/* 1. Emergency & Hours Dropdown */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => toggleFilterDropdown('clinic-emergency')}
                        className={`h-8 px-3 rounded-full text-xs font-normal flex items-center gap-1.5 transition-colors cursor-pointer ${clinicEmergencyFilter !== 'all'
                            ? 'bg-primary text-primary-foreground shadow-xs shadow-primary/20'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800'
                          }`}
                      >
                        <span>
                          {clinicEmergencyFilter === '24_7'
                            ? '24/7 Open'
                            : clinicEmergencyFilter === 'emergency'
                              ? 'Emergency Ready'
                              : clinicEmergencyFilter === 'day'
                                ? 'Day Clinic'
                                : 'Emergency & Hours'}
                        </span>
                        <ChevronDown
                          className={`w-3 h-3 transition-transform ${clinicEmergencyFilter !== 'all' ? 'text-primary-foreground' : 'text-slate-400'
                            } ${openFilterDropdown === 'clinic-emergency' ? 'rotate-180' : ''}`}
                        />
                      </button>

                      {openFilterDropdown === 'clinic-emergency' && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setOpenFilterDropdown(null)} />
                          <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-slate-200 dark:border-zinc-800 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                            {[
                              { id: 'all', label: 'All Hours' },
                              { id: '24_7', label: '24/7 Open' },
                              { id: 'emergency', label: 'Emergency Ready' },
                              { id: 'day', label: 'Day Clinic' },
                            ].map((opt) => {
                              const isSelected = clinicEmergencyFilter === opt.id;
                              return (
                                <button
                                  key={opt.id}
                                  type="button"
                                  onClick={() => {
                                    setClinicEmergencyFilter(opt.id as any);
                                    setOpenFilterDropdown(null);
                                  }}
                                  className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left hover:bg-slate-50 dark:hover:bg-zinc-800/70 transition-colors cursor-pointer ${isSelected ? 'bg-primary/10 text-primary font-medium' : 'text-slate-700 dark:text-slate-200'
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

                    {/* 2. Facilities & Diagnostics Dropdown */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => toggleFilterDropdown('clinic-facilities')}
                        className={`h-8 px-3 rounded-full text-xs font-normal flex items-center gap-1.5 transition-colors cursor-pointer ${clinicFacilityFilter !== 'all'
                            ? 'bg-primary text-primary-foreground shadow-xs shadow-primary/20'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800'
                          }`}
                      >
                        <span>
                          {clinicFacilityFilter === 'icu'
                            ? 'ICU / Critical Care'
                            : clinicFacilityFilter === 'imaging'
                              ? 'Digital X-Ray / CT'
                              : clinicFacilityFilter === 'surgery'
                                ? 'Advanced OT / Surgery'
                                : clinicFacilityFilter === 'lab'
                                  ? 'Pathology Lab'
                                  : clinicFacilityFilter === 'pharmacy'
                                    ? 'In-House Pharmacy'
                                    : 'Key Facilities'}
                        </span>
                        <ChevronDown
                          className={`w-3 h-3 transition-transform ${clinicFacilityFilter !== 'all' ? 'text-primary-foreground' : 'text-slate-400'
                            } ${openFilterDropdown === 'clinic-facilities' ? 'rotate-180' : ''}`}
                        />
                      </button>

                      {openFilterDropdown === 'clinic-facilities' && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setOpenFilterDropdown(null)} />
                          <div className="absolute top-full left-0 mt-2 w-52 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-slate-200 dark:border-zinc-800 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                            {[
                              { id: 'all', label: 'All Facilities' },
                              { id: 'icu', label: 'ICU / Critical Care' },
                              { id: 'imaging', label: 'Digital X-Ray / CT' },
                              { id: 'surgery', label: 'Advanced OT / Surgery' },
                              { id: 'lab', label: 'Pathology Lab' },
                              { id: 'pharmacy', label: 'In-House Pharmacy' },
                            ].map((opt) => {
                              const isSelected = clinicFacilityFilter === opt.id;
                              return (
                                <button
                                  key={opt.id}
                                  type="button"
                                  onClick={() => {
                                    setClinicFacilityFilter(opt.id as any);
                                    setOpenFilterDropdown(null);
                                  }}
                                  className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left hover:bg-slate-50 dark:hover:bg-zinc-800/70 transition-colors cursor-pointer ${isSelected ? 'bg-primary/10 text-primary font-medium' : 'text-slate-700 dark:text-slate-200'
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

                    {/* 3. Rating Dropdown */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => toggleFilterDropdown('clinic-rating')}
                        className={`h-8 px-3 rounded-full text-xs font-normal flex items-center gap-1.5 transition-colors cursor-pointer ${clinicRatingFilter !== 'all'
                            ? 'bg-primary text-primary-foreground shadow-xs shadow-primary/20'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800'
                          }`}
                      >
                        <span>{clinicRatingFilter === 'all' ? 'Rating' : `${clinicRatingFilter}+ ★`}</span>
                        <ChevronDown
                          className={`w-3 h-3 transition-transform ${clinicRatingFilter !== 'all' ? 'text-primary-foreground' : 'text-slate-400'
                            } ${openFilterDropdown === 'clinic-rating' ? 'rotate-180' : ''}`}
                        />
                      </button>

                      {openFilterDropdown === 'clinic-rating' && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setOpenFilterDropdown(null)} />
                          <div className="absolute top-full left-0 mt-2 w-44 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-slate-200 dark:border-zinc-800 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                            {[
                              { id: 'all', label: 'Any Rating' },
                              { id: '4.8', label: '4.8+ ★' },
                              { id: '4.9', label: '4.9+ ★' },
                            ].map((opt) => {
                              const isSelected = clinicRatingFilter === opt.id;
                              return (
                                <button
                                  key={opt.id}
                                  type="button"
                                  onClick={() => {
                                    setClinicRatingFilter(opt.id as any);
                                    setOpenFilterDropdown(null);
                                  }}
                                  className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left hover:bg-slate-50 dark:hover:bg-zinc-800/70 transition-colors cursor-pointer ${isSelected ? 'bg-primary/10 text-primary font-medium' : 'text-slate-700 dark:text-slate-200'
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

                    {/* 4. Doctors on Duty Dropdown */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => toggleFilterDropdown('clinic-doctors')}
                        className={`h-8 px-3 rounded-full text-xs font-normal flex items-center gap-1.5 transition-colors cursor-pointer ${clinicDoctorsFilter !== 'all'
                            ? 'bg-primary text-primary-foreground shadow-xs shadow-primary/20'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800'
                          }`}
                      >
                        <span>
                          {clinicDoctorsFilter === 'all' ? 'Doctors' : `${clinicDoctorsFilter}+ Doctors`}
                        </span>
                        <ChevronDown
                          className={`w-3 h-3 transition-transform ${clinicDoctorsFilter !== 'all' ? 'text-primary-foreground' : 'text-slate-400'
                            } ${openFilterDropdown === 'clinic-doctors' ? 'rotate-180' : ''}`}
                        />
                      </button>

                      {openFilterDropdown === 'clinic-doctors' && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setOpenFilterDropdown(null)} />
                          <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-slate-200 dark:border-zinc-800 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                            {[
                              { id: 'all', label: 'Any Staffing' },
                              { id: '3', label: '3+ Doctors on Duty' },
                              { id: '5', label: '5+ Doctors on Duty' },
                              { id: '10', label: '10+ Doctors on Duty' },
                            ].map((opt) => {
                              const isSelected = clinicDoctorsFilter === opt.id;
                              return (
                                <button
                                  key={opt.id}
                                  type="button"
                                  onClick={() => {
                                    setClinicDoctorsFilter(opt.id as any);
                                    setOpenFilterDropdown(null);
                                  }}
                                  className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left hover:bg-slate-50 dark:hover:bg-zinc-800/70 transition-colors cursor-pointer ${isSelected ? 'bg-primary/10 text-primary font-medium' : 'text-slate-700 dark:text-slate-200'
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

                    {/* Divider */}
                    <div className="hidden sm:block w-px h-5 bg-slate-200 dark:bg-zinc-800 my-auto mx-0.5" />

                    {/* 5. Sort By Dropdown */}
                    <div className="relative ml-auto">
                      <button
                        type="button"
                        onClick={() => toggleFilterDropdown('clinic-sort')}
                        className={`h-8 px-3 rounded-full text-xs font-normal flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer ${clinicSortBy !== 'relevance'
                            ? 'bg-primary text-primary-foreground shadow-xs shadow-primary/20'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800'
                          }`}
                      >
                        <span>
                          {clinicSortBy === 'distance_asc'
                            ? 'Nearest Distance'
                            : clinicSortBy === 'rating_desc'
                              ? 'Highest Rated'
                              : clinicSortBy === 'reviews_desc'
                                ? 'Most Reviews'
                                : clinicSortBy === 'doctors_desc'
                                  ? 'Most Doctors'
                                  : 'Sort: Relevance'}
                        </span>
                        <ChevronDown
                          className={`w-3 h-3 transition-transform ${clinicSortBy !== 'relevance' ? 'text-primary-foreground' : 'text-slate-400'
                            } ${openFilterDropdown === 'clinic-sort' ? 'rotate-180' : ''}`}
                        />
                      </button>

                      {openFilterDropdown === 'clinic-sort' && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setOpenFilterDropdown(null)} />
                          <div className="absolute top-full right-0 mt-2 w-52 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-slate-200 dark:border-zinc-800 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                            {[
                              { id: 'relevance', label: 'Relevance (Best Match)' },
                              { id: 'distance_asc', label: 'Nearest Distance' },
                              { id: 'rating_desc', label: 'Highest Rated' },
                              { id: 'reviews_desc', label: 'Most Reviews' },
                              { id: 'doctors_desc', label: 'Most Doctors on Duty' },
                            ].map((opt) => {
                              const isSelected = clinicSortBy === opt.id;
                              return (
                                <button
                                  key={opt.id}
                                  type="button"
                                  onClick={() => {
                                    setClinicSortBy(opt.id as any);
                                    setOpenFilterDropdown(null);
                                  }}
                                  className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left hover:bg-slate-50 dark:hover:bg-zinc-800/70 transition-colors cursor-pointer ${isSelected ? 'bg-primary/10 text-primary font-medium' : 'text-slate-700 dark:text-slate-200'
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
                    {(clinicEmergencyFilter !== 'all' ||
                      clinicFacilityFilter !== 'all' ||
                      clinicRatingFilter !== 'all' ||
                      clinicDoctorsFilter !== 'all' ||
                      searchQuery) && (
                        <button
                          onClick={() => {
                            setSearchQuery('');
                            setClinicEmergencyFilter('all');
                            setClinicFacilityFilter('all');
                            setClinicRatingFilter('all');
                            setClinicDoctorsFilter('all');
                            setClinicSortBy('relevance');
                          }}
                          className="h-8 px-2.5 rounded-full text-xs font-normal text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors shrink-0 cursor-pointer"
                          title="Reset all filters"
                        >
                          <span>Reset</span>
                        </button>
                      )}
                  </div>
                </div>
              ) : (
                /* DOCTORS DIRECTORY DESKTOP FILTER BAR */
                <div className={`hidden sm:block w-full mb-3 relative ${openFilterDropdown ? 'z-30' : 'z-10'}`}>
                  <div className="w-full bg-white dark:bg-zinc-900 rounded-full border border-slate-200 dark:border-zinc-800 p-1 sm:p-1.5 shadow-2xs flex items-center gap-1 sm:gap-1.5 overflow-visible">
                    {/* 1. Gender Dropdown */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => toggleFilterDropdown('gender')}
                        className={`h-8 px-3 rounded-full text-xs font-normal flex items-center gap-1.5 transition-colors cursor-pointer ${genderFilter !== 'all'
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
                          className={`w-3 h-3 transition-transform ${genderFilter !== 'all' ? 'text-primary-foreground' : 'text-slate-400'
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
                                  className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left hover:bg-slate-50 dark:hover:bg-zinc-800/70 transition-colors cursor-pointer ${isSelected ? 'bg-primary/10 text-primary font-medium' : 'text-slate-700 dark:text-slate-200'
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

                    {/* 2. Experience Dropdown */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => toggleFilterDropdown('experience')}
                        className={`h-8 px-3 rounded-full text-xs font-normal flex items-center gap-1.5 transition-colors cursor-pointer ${experienceFilter !== 'all'
                            ? 'bg-primary text-primary-foreground shadow-xs shadow-primary/20'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800'
                          }`}
                      >
                        <span>{experienceFilter === 'all' ? 'Experience' : `${experienceFilter}+ Years`}</span>
                        <ChevronDown
                          className={`w-3 h-3 transition-transform ${experienceFilter !== 'all' ? 'text-primary-foreground' : 'text-slate-400'
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
                                  className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left hover:bg-slate-50 dark:hover:bg-zinc-800/70 transition-colors cursor-pointer ${isSelected ? 'bg-primary/10 text-primary font-medium' : 'text-slate-700 dark:text-slate-200'
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

                    {/* 3. Species / Pet Dropdown */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => toggleFilterDropdown('species')}
                        className={`h-8 px-3 rounded-full text-xs font-normal flex items-center gap-1.5 transition-colors cursor-pointer ${speciesFilter !== 'all'
                            ? 'bg-primary text-primary-foreground shadow-xs shadow-primary/20'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800'
                          }`}
                      >
                        <span>{speciesFilter === 'all' ? 'Species' : speciesFilter}</span>
                        <ChevronDown
                          className={`w-3 h-3 transition-transform ${speciesFilter !== 'all' ? 'text-primary-foreground' : 'text-slate-400'
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
                                  className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left hover:bg-slate-50 dark:hover:bg-zinc-800/70 transition-colors cursor-pointer ${isSelected ? 'bg-primary/10 text-primary font-medium' : 'text-slate-700 dark:text-slate-200'
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

                    {/* 4. Rating Filter */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => toggleFilterDropdown('rating')}
                        className={`h-8 px-3 rounded-full text-xs font-normal flex items-center gap-1.5 transition-colors cursor-pointer ${ratingFilter !== 'all'
                            ? 'bg-primary text-primary-foreground shadow-xs shadow-primary/20'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800'
                          }`}
                      >
                        <span>
                          {ratingFilter === 'all' ? 'Patient Stories' : `${ratingFilter}+ Patient Stories`}
                        </span>
                        <ChevronDown
                          className={`w-3 h-3 transition-transform ${ratingFilter !== 'all' ? 'text-primary-foreground' : 'text-slate-400'
                            } ${openFilterDropdown === 'rating' ? 'rotate-180' : ''}`}
                        />
                      </button>

                      {openFilterDropdown === 'rating' && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setOpenFilterDropdown(null)} />
                          <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-slate-200 dark:border-zinc-800 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                            {[
                              { id: '10', label: '10+ Patient Stories' },
                              { id: '70', label: '70+ Patient Stories' },
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
                                  className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs text-left hover:bg-slate-50 dark:hover:bg-zinc-800/70 transition-colors cursor-pointer ${isSelected ? 'bg-primary/10 text-primary font-medium' : 'text-slate-700 dark:text-slate-200'
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

                    {/* Divider */}
                    <div className="hidden sm:block w-px h-5 bg-slate-200 dark:bg-zinc-800 my-auto mx-0.5" />

                    {/* 5. Sort By Dropdown */}
                    <div className="relative ml-auto">
                      <button
                        type="button"
                        onClick={() => toggleFilterDropdown('sort')}
                        className={`h-8 px-3 rounded-full text-xs font-normal flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer ${sortBy !== 'relevance'
                            ? 'bg-primary text-primary-foreground shadow-xs shadow-primary/20'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800'
                          }`}
                      >
                        <span>
                          {sortBy === 'fee_desc'
                            ? 'Fee: High to Low'
                            : sortBy === 'fee_asc'
                              ? 'Fee: Low to High'
                              : sortBy === 'rating_desc'
                                ? 'Highest Rated'
                                : sortBy === 'exp_desc'
                                  ? 'Most Experienced'
                                  : 'Sort: Relevance'}
                        </span>
                        <ChevronDown
                          className={`w-3 h-3 transition-transform ${sortBy !== 'relevance' ? 'text-primary-foreground' : 'text-slate-400'
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
                                  className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left hover:bg-slate-50 dark:hover:bg-zinc-800/70 transition-colors cursor-pointer ${isSelected ? 'bg-primary/10 text-primary font-medium' : 'text-slate-700 dark:text-slate-200'
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
                    {(genderFilter !== 'all' ||
                      ratingFilter !== 'all' ||
                      experienceFilter !== 'all' ||
                      speciesFilter !== 'all' ||
                      searchQuery) && (
                        <button
                          onClick={() => {
                            setSearchQuery('');
                            setGenderFilter('all');
                            setRatingFilter('all');
                            setExperienceFilter('all');
                            setSpeciesFilter('all');
                            setSortBy('relevance');
                          }}
                          className="h-8 px-2.5 rounded-full text-xs font-normal text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors shrink-0 cursor-pointer"
                          title="Reset all filters"
                        >
                          <span>Reset</span>
                        </button>
                      )}
                  </div>
                </div>
              )}

              {/* MOBILE FILTER BOTTOM SHEET MODAL (Framer Motion Spring Drawer) */}
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
                                  if (consultTypeFilter === 'clinic') {
                                    setClinicEmergencyFilter('all');
                                    setClinicFacilityFilter('all');
                                    setClinicRatingFilter('all');
                                    setClinicDoctorsFilter('all');
                                  } else {
                                    setGenderFilter('all');
                                    setRatingFilter('all');
                                    setExperienceFilter('all');
                                    setSpeciesFilter('all');
                                  }
                                }}
                                className="text-xs font-medium text-rose-500 hover:text-rose-600 cursor-pointer"
                              >
                                Reset all
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => setIsMobileFilterOpen(false)}
                              className="p-1.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Scrollable Filter Options */}
                      <div className="max-h-[60vh] overflow-y-auto p-5 space-y-5 no-scrollbar">
                        {consultTypeFilter === 'clinic' ? (
                          <>
                            {/* Emergency & Hours */}
                            <div className="space-y-2">
                              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                Emergency & Hours
                              </label>
                              <div className="grid grid-cols-2 gap-2">
                                {[
                                  { id: 'all', label: 'All Hours' },
                                  { id: '24_7', label: '24/7 Open' },
                                  { id: 'emergency', label: 'Emergency Ready' },
                                  { id: 'regular', label: 'Day Clinic' },
                                ].map((item) => {
                                  const isSelected = clinicEmergencyFilter === item.id;
                                  return (
                                    <button
                                      key={item.id}
                                      type="button"
                                      onClick={() => setClinicEmergencyFilter(item.id as any)}
                                      className={`py-2 px-3 rounded-xl border text-xs text-center transition-all cursor-pointer ${isSelected
                                          ? 'bg-primary text-primary-foreground border-primary font-medium shadow-xs shadow-primary/20'
                                          : 'bg-white dark:bg-zinc-800/80 border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-zinc-800'
                                        }`}
                                    >
                                      {item.label}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Diagnostic & Facilities */}
                            <div className="space-y-2">
                              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                Key Facilities & Diagnostics
                              </label>
                              <div className="flex flex-wrap gap-2">
                                {[
                                  { id: 'all', label: 'All Facilities' },
                                  { id: 'icu', label: 'ICU / Critical Care' },
                                  { id: 'imaging', label: 'Digital X-Ray / CT' },
                                  { id: 'surgery', label: 'Advanced OT / Surgery' },
                                  { id: 'lab', label: 'Pathology Lab' },
                                  { id: 'pharmacy', label: 'In-House Pharmacy' },
                                ].map((item) => {
                                  const isSelected = clinicFacilityFilter === item.id;
                                  return (
                                    <button
                                      key={item.id}
                                      type="button"
                                      onClick={() => setClinicFacilityFilter(item.id as any)}
                                      className={`px-3 py-1.5 rounded-full text-xs transition-all cursor-pointer ${isSelected
                                          ? 'bg-primary text-primary-foreground font-medium shadow-xs shadow-primary/20'
                                          : 'bg-white dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-zinc-800'
                                        }`}
                                    >
                                      {item.label}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Minimum Rating */}
                            <div className="space-y-2">
                              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                Minimum Rating
                              </label>
                              <div className="grid grid-cols-3 gap-2">
                                {[
                                  { id: 'all', label: 'Any' },
                                  { id: '4.8', label: '4.8+ ★' },
                                  { id: '4.9', label: '4.9+ ★' },
                                ].map((item) => {
                                  const isSelected = clinicRatingFilter === item.id;
                                  return (
                                    <button
                                      key={item.id}
                                      type="button"
                                      onClick={() => setClinicRatingFilter(item.id as any)}
                                      className={`py-2 rounded-xl border text-xs text-center transition-all cursor-pointer ${isSelected
                                          ? 'bg-primary text-primary-foreground border-primary font-medium shadow-xs shadow-primary/20'
                                          : 'bg-white dark:bg-zinc-800/80 border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-zinc-800'
                                        }`}
                                    >
                                      {item.label}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Doctors on Duty */}
                            <div className="space-y-2">
                              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                Doctors On Duty
                              </label>
                              <div className="grid grid-cols-3 gap-2">
                                {[
                                  { id: 'all', label: 'Any' },
                                  { id: '3', label: '3+ Doctors' },
                                  { id: '5', label: '5+ Doctors' },
                                ].map((item) => {
                                  const isSelected = clinicDoctorsFilter === item.id;
                                  return (
                                    <button
                                      key={item.id}
                                      type="button"
                                      onClick={() => setClinicDoctorsFilter(item.id as any)}
                                      className={`py-2 rounded-xl border text-xs text-center transition-all cursor-pointer ${isSelected
                                          ? 'bg-primary text-primary-foreground border-primary font-medium shadow-xs shadow-primary/20'
                                          : 'bg-white dark:bg-zinc-800/80 border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-zinc-800'
                                        }`}
                                    >
                                      {item.label}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
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
                                      className={`px-3 py-1.5 rounded-full text-xs transition-all cursor-pointer ${isSelected
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

                            {/* Patient Stories */}
                            <div className="space-y-2">
                              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                Patient Stories
                              </label>
                              <div className="grid grid-cols-3 gap-2">
                                {[
                                  { id: 'all', label: 'Any' },
                                  { id: '10', label: '10+ Stories' },
                                  { id: '70', label: '70+ Stories' },
                                ].map((r) => {
                                  const isSelected = ratingFilter === r.id;
                                  return (
                                    <button
                                      key={r.id}
                                      type="button"
                                      onClick={() => setRatingFilter(r.id as any)}
                                      className={`py-2 rounded-xl border text-xs text-center transition-all cursor-pointer ${isSelected
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
                                      className={`py-2 rounded-xl border text-xs text-center transition-all cursor-pointer ${isSelected
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
                                      className={`py-2 rounded-xl border text-xs text-center transition-all cursor-pointer ${isSelected
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
                          </>
                        )}
                      </div>

                      {/* Sticky Action Footer */}
                      <div className="p-4 border-t border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                        <button
                          type="button"
                          onClick={() => setIsMobileFilterOpen(false)}
                          className="w-full h-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-sm flex items-center justify-center gap-2 shadow-sm shadow-primary/25 active:scale-[0.99] transition-all cursor-pointer"
                        >
                          <span>
                            Show {consultTypeFilter === 'clinic' ? matchedHospitals.length : filteredDoctors.length}{' '}
                            {consultTypeFilter === 'clinic'
                              ? matchedHospitals.length === 1
                                ? 'Hospital'
                                : 'Hospitals'
                              : filteredDoctors.length === 1
                                ? 'Doctor'
                                : 'Doctors'}
                          </span>
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>

              {/* MOBILE SORT BOTTOM SHEET MODAL (Framer Motion Spring Drawer) */}
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
                          className="p-1.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer"
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
                              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs transition-colors cursor-pointer ${isSelected
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

              {/* IN-CLINIC MODE: Dedicated Hospital & Clinic Cards (No doctor cards in this section) */}
              {consultTypeFilter === 'clinic' ? (
                <div className="space-y-4 pt-1">
                  {matchedHospitals.length === 0 ? (
                    <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200/80 dark:border-zinc-800 p-8 sm:p-12 text-center space-y-4 max-w-lg mx-auto my-6 shadow-xs">
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-base font-bold text-slate-800 dark:text-white">
                          {searchQuery ? `No clinics found matching "${searchQuery}"` : 'No clinics available in this location'}
                        </p>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 leading-relaxed">
                          {searchQuery
                            ? 'No clinic name available matching your search. If you are searching for a specific doctor, switch to Video Consult or Home Visit.'
                            : 'Try selecting a different city or clearing your location filter to view all partner clinics.'}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                        {searchQuery && (
                          <button
                            type="button"
                            onClick={() => setConsultTypeFilter('video')}
                            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                          >
                            <Video className="w-3.5 h-3.5" />
                            <span>Switch to Video Consult</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setSearchQuery('');
                            setSelectedLocation('All Locations');
                          }}
                          className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-zinc-700 transition-all cursor-pointer"
                        >
                          Clear Search
                        </button>
                      </div>
                    </div>
                  ) : (
                    matchedHospitals.map((hospital) => {
                      const doctorsAtThisHospital = ONLINE_VETS.filter(
                        (v) =>
                          (hospital.doctorIds && hospital.doctorIds.includes(v.id)) ||
                          v.clinicName.toLowerCase().includes(hospital.name.toLowerCase()) ||
                          hospital.name.toLowerCase().includes(v.clinicName.toLowerCase())
                      );

                      const hospitalDoctors =
                        doctorsAtThisHospital.length > 0
                          ? doctorsAtThisHospital
                          : ONLINE_VETS.filter(
                            (v) => v.city.toLowerCase() === hospital.city.toLowerCase()
                          )
                            .slice(0, 4)
                            .concat(ONLINE_VETS.slice(0, 4));

                      return (
                        <div
                          key={hospital.id}
                          className="group relative bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200/80 dark:border-zinc-800 overflow-hidden transition-all duration-300 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] hover:border-slate-300 dark:hover:border-zinc-700 flex flex-col"
                        >
                          {/* Upper Section: Hospital Main Profile with Inset Image */}
                          <div className="p-3.5 sm:p-4 md:p-5 lg:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 md:gap-5 min-w-0">
                            {/* Desktop Left Image: Inset rounded-2xl (NOT attached to card corner) */}
                            <div
                              onClick={() => setSearchQuery(hospital.name)}
                              className="hidden sm:block relative sm:w-44 md:w-52 lg:w-56 aspect-[4/3] rounded-2xl overflow-hidden shrink-0 bg-slate-100 dark:bg-zinc-800 border border-slate-200/80 dark:border-zinc-700/80 shadow-xs cursor-pointer group/img self-center"
                            >
                              <Image
                                src={hospital.image}
                                alt={hospital.name}
                                fill
                                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                                sizes="(min-width: 1024px) 224px, 208px"
                              />
                            </div>

                            {/* Left Info Column: Identity, Metadata, Location & Rating */}
                            <div className="flex-1 min-w-0 space-y-2.5">
                              {/* MOBILE ONLY: Portrait Thumbnail + Identity Header */}
                              <div className="flex sm:hidden items-start gap-3 pb-2.5 border-b border-slate-100 dark:border-zinc-800/80">
                                <div
                                  onClick={() => setSearchQuery(hospital.name)}
                                  className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 dark:bg-zinc-800 shrink-0 border border-slate-200/80 dark:border-zinc-700 shadow-xs cursor-pointer"
                                >
                                  <Image
                                    src={hospital.image}
                                    alt={hospital.name}
                                    fill
                                    className="object-cover transition-transform duration-300 active:scale-[1.05]"
                                    sizes="120px"
                                  />
                                </div>
                                <div className="flex-1 min-w-0 space-y-1">
                                  <h3
                                    onClick={() => setSearchQuery(hospital.name)}
                                    className="text-[15px] font-bold text-slate-900 dark:text-white hover:text-primary transition-colors cursor-pointer leading-snug break-words"
                                  >
                                    {hospital.name}
                                  </h3>

                                  <p className="text-xs font-medium text-slate-600 dark:text-zinc-300 line-clamp-1">
                                    {hospital.type}
                                  </p>

                                  <div className="flex items-center gap-1.5 text-[11.5px] text-slate-500 dark:text-zinc-400 pt-0.5 flex-wrap">
                                    <div className="flex items-center gap-1 shrink-0">
                                      <MapPin className="w-3 h-3 text-slate-400 dark:text-zinc-500 shrink-0" />
                                      <span className="font-medium text-slate-700 dark:text-zinc-200 truncate">
                                        {hospital.area.split(',')[0]}, {hospital.city}
                                      </span>
                                    </div>
                                    <span className="text-slate-300 dark:text-zinc-600">·</span>
                                    <div className="flex items-center gap-1 shrink-0">
                                      <Clock className="w-3 h-3 text-slate-400 dark:text-zinc-500 shrink-0" />
                                      <span className="text-slate-600 dark:text-zinc-300">
                                        {hospital.timing.toLowerCase().includes('24') ? 'Open 24 Hours' : hospital.timing}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* DESKTOP ONLY: Hospital Name (Never cut off / no truncate) */}
                              <div className="hidden sm:block">
                                <h3
                                  onClick={() => setSearchQuery(hospital.name)}
                                  className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 dark:text-white hover:text-primary transition-colors cursor-pointer tracking-tight leading-snug break-words"
                                >
                                  {hospital.name}
                                </h3>
                              </div>

                              {/* DESKTOP ONLY: Subtitle Line */}
                              <div className="hidden sm:block">
                                <span className="text-xs sm:text-sm font-medium text-slate-600 dark:text-zinc-300 block">
                                  {hospital.type}
                                </span>
                              </div>

                              {/* DESKTOP ONLY: Location & Timings (Always real timing, never generic Open Today) */}
                              <div className="hidden sm:flex items-center gap-2 text-xs sm:text-[13px] text-slate-500 dark:text-zinc-400 flex-wrap">
                                <div className="flex items-center gap-1.5 shrink-0">
                                  <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" />
                                  <span
                                    onClick={() => {
                                      const loc = hospital.area ? `${hospital.area.split(',')[0]}, ${hospital.city}` : hospital.city;
                                      setSelectedLocation(loc);
                                      setLocationSearchInput(loc);
                                    }}
                                    className="font-medium text-slate-700 dark:text-zinc-200 hover:text-primary hover:underline cursor-pointer"
                                  >
                                    {hospital.area.split(',')[0]}, {hospital.city}
                                  </span>
                                </div>

                                <span className="text-slate-300 dark:text-zinc-600">·</span>

                                <div className="flex items-center gap-1.5 shrink-0">
                                  <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" />
                                  <span>
                                    {hospital.timing.toLowerCase().includes('24') ? 'Open 24 Hours' : hospital.timing}
                                  </span>
                                </div>
                              </div>

                              {/* DESKTOP ONLY: Facilities Pills Row */}
                              <div className="hidden sm:flex items-center gap-1.5 flex-wrap pt-0.5">
                                {hospital.facilities.slice(0, 3).map((fac, idx) => (
                                  <span
                                    key={idx}
                                    className="inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-medium bg-slate-100/90 dark:bg-zinc-800/80 text-slate-600 dark:text-zinc-300 border border-slate-200/70 dark:border-zinc-700/70 max-w-[150px] sm:max-w-[200px] truncate"
                                    title={fac}
                                  >
                                    {fac}
                                  </span>
                                ))}
                                {hospital.facilities.length > 3 && (
                                  <span
                                    className="inline-flex items-center px-2 py-0.5 rounded-lg text-[10.5px] font-semibold bg-slate-100/60 dark:bg-zinc-800/50 text-slate-500 dark:text-zinc-400 border border-slate-200/60 dark:border-zinc-750"
                                    title={hospital.facilities.slice(3).join(', ')}
                                  >
                                    +{hospital.facilities.length - 3} more
                                  </span>
                                )}
                              </div>

                              {/* DESKTOP ONLY: Rating Pill & Reviews (Separate section below facilities, matching Doctor card patient stories) */}
                              <div className="hidden sm:flex items-center gap-2 pt-2.5 border-t border-slate-100 dark:border-zinc-800/80">
                                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] sm:text-[11px] font-bold shrink-0 tracking-tight border bg-amber-400/15 text-amber-700 dark:text-amber-400 border-amber-400/30">
                                  <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-amber-500 text-amber-500 shrink-0" />
                                  <span>{hospital.rating.toFixed(1)}</span>
                                </div>
                                <span className="text-[11.5px] sm:text-xs font-medium text-slate-600 dark:text-zinc-400 hover:text-primary hover:underline cursor-pointer">
                                  <span className="font-semibold text-slate-800 dark:text-zinc-200">{hospital.reviews.toLocaleString()}</span> ratings
                                </span>
                              </div>

                              {/* MOBILE ONLY (< sm): Inset Rating & Fee Banner (Shifted above doctors) */}
                              <div className="flex sm:hidden items-center justify-between py-2 px-3 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-100 dark:border-zinc-800 w-full">
                                <div className="flex items-center gap-1.5">
                                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 tracking-tight border bg-amber-400/15 text-amber-700 dark:text-amber-400 border-amber-400/30">
                                    <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500 shrink-0" />
                                    <span>{hospital.rating.toFixed(1)}</span>
                                  </div>
                                  <span className="text-[11px] font-medium text-slate-600 dark:text-zinc-400 truncate">
                                    <span className="font-semibold text-slate-800 dark:text-zinc-200">{hospital.reviews.toLocaleString()}</span> ratings
                                  </span>
                                </div>

                                <div className="flex items-baseline gap-1 text-right">
                                  <span className="text-base font-bold text-slate-900 dark:text-white">{hospital.fee}</span>
                                  <span className="text-[11px] text-slate-500 dark:text-zinc-400 font-normal">fee</span>
                                </div>
                              </div>

                              {/* MOBILE ONLY: Doctors Available at this Hospital Shelf (shifted to middle on mobile) */}
                              {hospitalDoctors.length > 0 && (
                                <div className="block sm:hidden pt-2 border-t border-slate-100 dark:border-zinc-800/80 space-y-2">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                                        Doctors Available at this Hospital
                                      </span>
                                      <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-primary/10 text-primary">
                                        {hospitalDoctors.length}
                                      </span>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => setSearchQuery(hospital.name)}
                                      className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-0.5 cursor-pointer"
                                    >
                                      <span>View all</span>
                                      <ChevronRight className="w-3 h-3" />
                                    </button>
                                  </div>

                                  <HospitalDoctorShelf
                                    hospital={hospital}
                                    doctors={hospitalDoctors}
                                    onConsultClick={handleConsultClick}
                                    onViewAllClick={() => setSearchQuery(hospital.name)}
                                  />
                                </div>
                              )}
                            </div>

                            {/* Right Action Column / Mobile Bottom Section */}
                            <div className="shrink-0 flex flex-col sm:items-center sm:justify-center gap-2.5 sm:gap-2.5 sm:ml-auto w-full sm:w-38 md:w-42 lg:w-48 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-zinc-800/80">
                              {/* DESKTOP/TABLET (sm+): Centered Fee */}
                              <div className="hidden sm:block text-center w-full">
                                <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                                  {hospital.fee}
                                </div>
                                <div className="text-[11.5px] text-slate-500 dark:text-zinc-400 font-normal">
                                  Consultation fee
                                </div>
                              </div>

                              {/* CTA Buttons */}
                              <div className="grid grid-cols-2 sm:flex sm:flex-col gap-2 sm:gap-2.5 w-full">
                                {/* Button 1: Call Hospital */}
                                <a
                                  href={`tel:${hospital.phone}`}
                                  className="order-2 sm:order-1 w-full h-9 sm:h-10 px-2 sm:px-4 rounded-xl sm:rounded-tl-[99px] sm:rounded-bl-[99px] sm:rounded-br-[99px] sm:rounded-tr-[30px] bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-1.5 transition-all duration-300 shadow-md hover:shadow-lg active:scale-[0.98] cursor-pointer border-0"
                                >
                                  <PhoneCall className="w-3.5 h-3.5" />
                                  <span className="truncate font-semibold">Call Hospital</span>
                                </a>

                                {/* Button 2: View Details */}
                                <button
                                  type="button"
                                  onClick={() => setSearchQuery(hospital.name)}
                                  className="order-1 sm:order-2 w-full h-9 sm:h-10 px-2 sm:px-4 rounded-xl sm:rounded-tl-[30px] sm:rounded-tr-[99px] sm:rounded-bl-[99px] sm:rounded-br-[99px] border border-slate-200 dark:border-zinc-750 bg-white dark:bg-transparent hover:bg-slate-50 dark:hover:bg-zinc-800/60 text-slate-800 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white text-xs sm:text-sm font-semibold inline-flex items-center justify-center transition-all duration-300 shadow-2xs active:scale-[0.98] cursor-pointer"
                                >
                                  <span className="truncate font-semibold">View Details</span>
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Lower Section: Affiliated Doctors practicing at this Hospital (Desktop only) */}
                          {hospitalDoctors.length > 0 && (
                            <div className="hidden sm:block p-3.5 sm:p-5 pt-3 sm:pt-4 border-t border-slate-100 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-zinc-800/20 space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                                    Doctors Available at this Hospital
                                  </span>
                                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-primary/10 text-primary">
                                    {hospitalDoctors.length}
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setSearchQuery(hospital.name)}
                                  className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                                >
                                  <span>View all doctors</span>
                                  <ChevronRight className="w-3 h-3" />
                                </button>
                              </div>

                              {/* Scrollable Doctor Cards Carousel with Practo arrows */}
                              <HospitalDoctorShelf
                                hospital={hospital}
                                doctors={hospitalDoctors}
                                onConsultClick={handleConsultClick}
                                onViewAllClick={() => setSearchQuery(hospital.name)}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              ) : (
                /* HORIZONTAL DOCTOR CARDS LIST (Video Consult & Home Visit) */
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
                        className="group relative bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200/80 dark:border-zinc-800 overflow-hidden transition-all duration-300 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] hover:border-slate-300 dark:hover:border-zinc-700 flex flex-col sm:flex-row items-stretch"
                      >
                        {/* Desktop Left Column: Edge-to-Edge Doctor Portrait (Hidden on mobile) */}
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewImageVet(vet);
                          }}
                          className="hidden sm:block relative sm:w-44 md:w-48 lg:w-56 xl:w-64 shrink-0 sm:min-h-full bg-slate-100 dark:bg-zinc-800 overflow-hidden sm:rounded-l-3xl cursor-pointer group/img"
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
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPreviewImageVet(vet);
                                }}
                                className="relative w-20 h-28 rounded-2xl overflow-hidden bg-slate-100 dark:bg-zinc-800 shrink-0 border border-slate-200/80 dark:border-zinc-700 shadow-xs cursor-pointer"
                              >
                                <Image
                                  src={vet.image}
                                  alt={vet.name}
                                  fill
                                  className="object-cover object-top scale-[1.4] origin-top transition-transform duration-300 active:scale-[1.45]"
                                  sizes="120px"
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
                                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 shrink-0">
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

                                {/* Satisfaction Pill & Patient Stories (Mobile) */}
                                <div className="flex items-center gap-1.5 pt-0.5">
                                  {(() => {
                                    const satNum = Math.min(99, Math.max(90, Math.round(vet.rating * 20)));
                                    return (
                                      <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 tracking-tight border bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                                        <ThumbsUp className="w-2.5 h-2.5 shrink-0" />
                                        <span>{satNum}%</span>
                                      </div>
                                    );
                                  })()}
                                  <span className="text-[11px] font-medium text-slate-600 dark:text-zinc-400 truncate">
                                    <span className="font-semibold text-slate-800 dark:text-zinc-200">{vet.reviews.toLocaleString()}</span> patient stories
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

                              {(() => {
                                const otherClinics = CLINICS.filter(
                                  (c) =>
                                    c.name.toLowerCase() !== vet.clinicName.toLowerCase() &&
                                    c.doctorIds &&
                                    c.doctorIds.includes(vet.id)
                                );
                                const count = otherClinics.length > 0 ? otherClinics.length : (vet.id % 2 === 0 ? 2 : 1);
                                const otherNames =
                                  otherClinics.length > 0
                                    ? otherClinics.map((c) => c.name).join(', ')
                                    : 'Partner Hospitals & Emergency Centers';

                                return (
                                  <div className="flex items-center gap-1.5 min-w-0 text-xs sm:text-[13px]">
                                    <span
                                      onClick={() => setSearchQuery(vet.clinicName)}
                                      className="hover:text-primary hover:underline cursor-pointer truncate font-normal text-slate-600 dark:text-zinc-300"
                                      title={`Primary clinic: ${vet.clinicName}`}
                                    >
                                      {vet.clinicName}
                                    </span>
                                    <span
                                      onClick={() => {
                                        if (otherClinics.length > 0) {
                                          setSearchQuery(otherClinics[0].name);
                                        }
                                      }}
                                      className="text-slate-400 dark:text-zinc-500 font-normal text-xs shrink-0 hover:text-primary hover:underline cursor-pointer"
                                      title={`Available at: ${otherNames} on scheduled days & timings`}
                                    >
                                      +{count} more
                                    </span>
                                  </div>
                                );
                              })()}
                            </div>

                            {/* DESKTOP ONLY: Satisfaction Pill & Patient Stories */}
                            <div className="hidden sm:flex pt-2 sm:pt-2.5 border-t border-slate-100 dark:border-zinc-800/80 items-center gap-2 sm:gap-2.5">
                              {(() => {
                                const satNum = Math.min(99, Math.max(90, Math.round(vet.rating * 20)));
                                return (
                                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] sm:text-[11px] font-bold shrink-0 tracking-tight border bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                                    <ThumbsUp className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" />
                                    <span>{satNum}%</span>
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
                                    <div className={`flex items-center gap-1.5 text-xs ${isToday
                                        ? 'font-semibold text-emerald-600 dark:text-emerald-400'
                                        : 'font-medium text-slate-600 dark:text-zinc-300'
                                      }`}>
                                      <Calendar className={`w-3.5 h-3.5 shrink-0 ${isToday ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'
                                        }`} />
                                      <span>{label}</span>
                                    </div>

                                    <div className="flex items-baseline gap-1 text-right">
                                      <span className="text-base font-bold text-slate-900 dark:text-white">{vet.fee}</span>
                                      <span className="text-[11px] text-slate-500 dark:text-zinc-400 font-normal">fee</span>
                                    </div>
                                  </div>

                                  {/* DESKTOP/TABLET (sm+): Centered Availability Indicator */}
                                  <div className={`hidden sm:flex items-center justify-center gap-1.5 text-xs text-center self-center ${isToday
                                      ? 'font-semibold text-emerald-600 dark:text-emerald-400'
                                      : 'font-medium text-slate-700 dark:text-zinc-300'
                                    }`}>
                                    <Calendar className={`w-3.5 h-3.5 shrink-0 ${isToday ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-zinc-400'
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
                                className="order-1 sm:order-2 w-full h-9 sm:h-10 px-2 sm:px-4 rounded-xl sm:rounded-tl-[30px] sm:rounded-tr-[99px] sm:rounded-bl-[99px] sm:rounded-br-[99px] border border-slate-200 dark:border-zinc-700 bg-white dark:bg-transparent hover:bg-slate-50 dark:hover:bg-zinc-800/60 text-slate-800 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white text-xs sm:text-sm font-semibold inline-flex items-center justify-center transition-all duration-300 shadow-2xs active:scale-[0.98] cursor-pointer"
                              >
                                <span className="truncate font-semibold">View Profile</span>
                              </button>

                              {/* Button 2: Book Appointment (Mobile: Right Col | Desktop: Top) */}
                              <button
                                type="button"
                                onClick={() => handleConsultClick(vet)}
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
              )}
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
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${appointmentsSubTab === 'upcoming'
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
                    }`}
                >
                  <span>Upcoming Consultations</span>
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/20">2</span>
                </button>
                <button
                  onClick={() => setAppointmentsSubTab('past')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${appointmentsSubTab === 'past'
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
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${apt.isLiveNow
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
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${recordsSubTab === 'prescriptions'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
                    }`}
                >
                  Digital Prescriptions (Rx)
                </button>
                <button
                  onClick={() => setRecordsSubTab('vaccines')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${recordsSubTab === 'vaccines'
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
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${vac.status === 'Up to Date'
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
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${profileCompletion.percentage === 100
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
                  <div className={`text-[11px] font-medium px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-colors ${profileCompletion.checks.hasAccount
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60'
                      : 'bg-slate-100 text-slate-500 dark:bg-zinc-800 dark:text-slate-400'
                    }`}>
                    {profileCompletion.checks.hasAccount ? <Check className="w-3 h-3 text-emerald-600" /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />}
                    Account Details
                  </div>

                  <div className={`text-[11px] font-medium px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-colors ${profileCompletion.checks.hasPhone
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60'
                      : 'bg-slate-100 text-slate-500 dark:bg-zinc-800 dark:text-slate-400'
                    }`}>
                    {profileCompletion.checks.hasPhone ? <Check className="w-3 h-3 text-emerald-600" /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />}
                    Phone (Optional)
                  </div>

                  <div className={`text-[11px] font-medium px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-colors ${profileCompletion.checks.hasAddress
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60'
                      : 'bg-slate-100 text-slate-500 dark:bg-zinc-800 dark:text-slate-400'
                    }`}>
                    {profileCompletion.checks.hasAddress ? <Check className="w-3 h-3 text-emerald-600" /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />}
                    Address (Optional)
                  </div>

                  <button
                    onClick={() => handleSelectTab('care', 'pets')}
                    className={`text-[11px] font-medium px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer hover:opacity-85 ${profileCompletion.checks.hasPet
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
          <div className="bg-white dark:bg-zinc-950 rounded-3xl p-0 max-w-md w-full mx-4 shadow-2xl overflow-hidden border border-slate-200/90 dark:border-zinc-800 animate-in zoom-in-95 duration-200">
            {/* Header Banner with Avatar */}
            <div className="relative h-28 bg-[#bde4e9]/40 dark:bg-zinc-900/60">
              <button
                type="button"
                onClick={() => setSelectedVetForPopup(null)}
                className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white/90 hover:bg-white dark:bg-zinc-800/90 dark:hover:bg-zinc-800 text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white flex items-center justify-center transition-all shadow-xs cursor-pointer z-10"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute -bottom-14 left-1/2 transform -translate-x-1/2">
                <div className="relative w-28 h-28 rounded-full overflow-hidden bg-slate-100 dark:bg-zinc-800">
                  <Image
                    src={selectedVetForPopup.image}
                    alt={selectedVetForPopup.name}
                    fill
                    className="object-cover object-top"
                  />
                </div>
              </div>
            </div>

            <div className="pt-20 pb-6 px-6 text-center">
              <h3
                style={{ fontFamily: 'var(--font-heading), fields, Georgia, serif' }}
                className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-1"
              >
                {selectedVetForPopup.name}
              </h3>

              <p
                style={{ fontFamily: 'var(--font-sans), Parkinsans, sans-serif' }}
                className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 font-medium mb-5 tracking-wide"
              >
                {selectedVetForPopup.clinicName || selectedVetForPopup.hospital || selectedVetForPopup.specialization}
              </p>

              {/* Multiverse Character Quote Box */}
              <div className="bg-slate-50/80 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 rounded-2xl p-4 sm:p-5 mb-5 text-center">
                <p
                  style={{ fontFamily: 'var(--font-heading), fields, Georgia, serif' }}
                  className="text-slate-700 dark:text-slate-200 text-sm sm:text-base font-normal italic leading-relaxed whitespace-pre-line"
                >
                  &ldquo;{selectedVetForPopup.bookingMessage || "Currently unavailable due to high demand in the multiverse."}&rdquo;
                </p>
              </div>

              {/* Priority Waitlist Feedback Alert */}
              {isWaitlistNotified && (
                <div className="mb-4 py-2 px-3.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-700 dark:text-emerald-300 flex items-center justify-center gap-1.5 animate-in fade-in zoom-in-95">
                  <CheckCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>You&apos;re on the waitlist! We&apos;ll notify you when slots open up.</span>
                </div>
              )}

              <div className="flex gap-3 grid grid-cols-2">
                <button
                  type="button"
                  onClick={() => setSelectedVetForPopup(null)}
                  style={{ fontFamily: 'var(--font-sans), Parkinsans, sans-serif' }}
                  className="w-full h-11 rounded-full border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold transition-all cursor-pointer active:scale-[0.98]"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => setIsWaitlistNotified(!isWaitlistNotified)}
                  style={{ fontFamily: 'var(--font-sans), Parkinsans, sans-serif' }}
                  className={`w-full h-11 rounded-full text-xs sm:text-sm font-semibold transition-all active:scale-[0.98] cursor-pointer ${isWaitlistNotified
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-primary hover:bg-primary/90 text-primary-foreground'
                    }`}
                >
                  {isWaitlistNotified ? '✓ On Waitlist' : 'Notify Me'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PURE FULL PROFILE IMAGE PREVIEW LIGHTBOX */}
      <AnimatePresence>
        {previewImageVet && (
          <div
            onClick={() => setPreviewImageVet(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-sm cursor-pointer select-none"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setPreviewImageVet(null)}
              className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Close preview"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Pure Full Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="relative w-full max-w-md h-[80vh] flex items-center justify-center pointer-events-none"
            >
              <div className="relative w-full h-full">
                <Image
                  src={previewImageVet.image}
                  alt={previewImageVet.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 100vw, 500px"
                  priority
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
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
