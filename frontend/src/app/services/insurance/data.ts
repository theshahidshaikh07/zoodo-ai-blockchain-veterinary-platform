export interface InsuranceCompany {
  id: string;
  name: string;
  tagline: string;
  logoText: string;
  basePrice: number;
  color: string;
  description: string;
  coverage: string;
  copay: string;
  deductible: string;
  waitingPeriod: string;
  claimSpeed: string;
  features: string[];
  exclusions: string[];
  rating: number;
  highlight?: boolean;
  badge?: string;
  petClasses: string[]; // e.g. ['canine', 'feline', 'avian', 'reptilian', 'pocket', 'equine']
}

export const insuranceDatabase: InsuranceCompany[] = [
  {
    id: 'nationwide',
    name: 'Nationwide Avian & Exotic Care',
    tagline: 'Global Leader for Birds & Exotic Pets',
    logoText: 'NW',
    basePrice: 349,
    color: 'bg-teal-500',
    description: 'Specialist medical plans tailored for exotic pet species. Ideal for birds, reptiles, and pocket mammals.',
    coverage: '₹2.5 Lakh',
    copay: '10%',
    deductible: '₹2,500',
    waitingPeriod: '14 Days',
    claimSpeed: '5-7 Days',
    features: [
      'Accident & injury care',
      'Avian clinical diagnostics',
      'Exotic species wellness panels',
      'Direct specialist referrals'
    ],
    exclusions: [
      'Elective surgical upgrades',
      'Egg-laying or breeding fees',
      'Routine beak or claw trimming'
    ],
    rating: 4.7,
    petClasses: ['avian', 'reptilian', 'pocket']
  },
  {
    id: 'manypets',
    name: 'ManyPets Comprehensive Lifetime',
    tagline: 'Best Lifetime Coverage for Dogs & Cats',
    logoText: 'MP',
    basePrice: 699,
    color: 'bg-sky-600',
    description: 'High-limit lifetime policies featuring custom deductibles and comprehensive clinical coverage.',
    coverage: '₹5.0 Lakh',
    copay: '0%',
    deductible: '₹0',
    waitingPeriod: '7 Days',
    claimSpeed: '2-3 Days',
    features: [
      'Zero co-pay options',
      'Chronic illness lifetime support',
      'Dental disease operations',
      'Alternative therapies'
    ],
    exclusions: [
      'Cosmetic tail docks or croppings',
      'Commercial breeding fees',
      'Pre-existing issues in first 14 days'
    ],
    rating: 4.9,
    highlight: true,
    badge: 'Top Rated',
    petClasses: ['canine', 'feline']
  },
  {
    id: 'metlife',
    name: 'MetLife Multi-Pet Protection',
    tagline: 'Flexible Plans for Multi-Pet Homes',
    logoText: 'ML',
    basePrice: 499,
    color: 'bg-indigo-600',
    description: 'Versatile healthcare protection plans covering standard pets as well as equine and pocket pets.',
    coverage: '₹4.0 Lakh',
    copay: '5%',
    deductible: '₹1,500',
    waitingPeriod: '10 Days',
    claimSpeed: '3-4 Days',
    features: [
      'Emergency room services',
      'Prescription pharmaceuticals',
      'Laboratory diagnostics panel',
      'Multi-pet discount bundle active'
    ],
    exclusions: [
      'Behavioral training therapies',
      'Standard hygiene or spa groomings',
      'Organ transplant operations'
    ],
    rating: 4.6,
    petClasses: ['canine', 'feline', 'pocket', 'equine']
  },
  {
    id: 'pumpkin',
    name: 'Pumpkin Pet Insurance',
    tagline: '90% Reimbursement Across All Clinics',
    logoText: 'PK',
    basePrice: 449,
    color: 'bg-amber-600',
    description: 'Comprehensive accident & illness coverage with a flat 90% reimbursement rate on all veterinary bills.',
    coverage: '₹5.0 Lakh',
    copay: '10%',
    deductible: '₹1,005',
    waitingPeriod: '14 Days',
    claimSpeed: '4-5 Days',
    features: [
      '90% clinical reimbursement rate',
      'Microchipping diagnostics',
      'Inherited genetic condition cover',
      'Alternative acupuncture/hydrotherapy'
    ],
    exclusions: [
      'Standard spay/neuter operations',
      'Non-veterinary training costs',
      'Experimental clinical trials'
    ],
    rating: 4.8,
    petClasses: ['canine', 'feline']
  },
  {
    id: 'trupanion',
    name: 'Trupanion Medical Cover',
    tagline: 'Lifetime Per-Condition Deductibles',
    logoText: 'TR',
    basePrice: 549,
    color: 'bg-red-500',
    description: 'Once you pay the deductible for an illness, Trupanion pays 90% of all future bills for that condition.',
    coverage: '₹3.0 Lakh',
    copay: '10%',
    deductible: '₹2,000',
    waitingPeriod: '5 Days',
    claimSpeed: 'Direct-Pay',
    features: [
      'Per-condition lifetime deductibles',
      'No payout limits over time',
      'Emergency trauma care',
      'Direct payment to verified clinics'
    ],
    exclusions: [
      'Pre-existing disease symptoms',
      'Boarding/kennel fees',
      'Specialist nutritional supplements'
    ],
    rating: 4.5,
    petClasses: ['canine', 'feline']
  },
  {
    id: 'embrace',
    name: 'Embrace Pet Protection',
    tagline: 'Diminishing Deductibles for Healthy Years',
    logoText: 'EB',
    basePrice: 399,
    color: 'bg-violet-600',
    description: 'Features a diminishing deductible reward that shrinks for every year your pet is healthy.',
    coverage: '₹3.5 Lakh',
    copay: '10%',
    deductible: '₹1,500',
    waitingPeriod: '14 Days',
    claimSpeed: '4-5 Days',
    features: [
      'Shrinking deductible system',
      'Accident and illness cover',
      'Comprehensive scan and imaging',
      'Specialist vet evaluations'
    ],
    exclusions: [
      'Standard dental hygiene routines',
      'Breeding-related expenses',
      'Grooming or shampoo treatments'
    ],
    rating: 4.7,
    petClasses: ['canine', 'feline', 'avian', 'reptilian', 'pocket', 'equine']
  }
];
