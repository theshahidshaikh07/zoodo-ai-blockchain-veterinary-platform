'use client';

import { useState, useEffect, useRef, MouseEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, PawPrint, Stethoscope, Bone, Hospital, Users } from 'lucide-react';
import Image from 'next/image';
import { useTheme } from 'next-themes';

const roles = [
  {
    name: 'Pet Parent',
    icon: PawPrint,
    description: 'Manage your pet’s health, appointments, and records.',
    href: '/register/pet-owner',
    color: 'hsl(var(--primary))',
  },
  {
    name: 'Veterinarian',
    icon: Stethoscope,
    description: 'Provide medical services and manage your clients.',
    href: '/register/veterinarian',
    color: 'hsl(var(--primary))',
  },
  {
    name: 'Pet Trainer',
    icon: Bone,
    description: 'Offer training services and connect with pet owners.',
    href: '/register/trainer',
    color: 'hsl(var(--primary))',
  },
  {
    name: 'Hospital & Clinic',
    icon: Hospital,
    description: 'Manage your facility, staff, and records.',
    href: '/register/hospital',
    color: 'hsl(var(--primary))',
  },
  {
    name: 'Organization',
    icon: Users,
    description: 'Manage your organization, members, and events.',
    href: '/register/organization',
    color: 'hsl(var(--primary))',
  },
];

// Mobile quiz-style card
const MobileRoleCard = ({ role, index }: { role: typeof roles[0], index: number }) => {
  return (
    <Link href={role.href} aria-label={`Select role ${role.name}`} className="block w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60" style={{ animationDelay: `${index * 100}ms` }}>
      <div className="group bg-white dark:bg-gray-800 rounded-lg p-4 transition-all duration-200 ease-out flex items-center gap-4 shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-700 hover:border-primary/40">
        <div className="flex-shrink-0">
          <role.icon className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1 text-left">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">{role.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{role.description}</p>
          {role.name === 'Organization' && (
            <div className="mt-2 flex flex-wrap gap-1">
              <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">NGO</span>
              <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">Company</span>
              <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">Trusts</span>
            </div>
          )}
        </div>
        <div className="flex-shrink-0">
          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
        </div>
      </div>
    </Link>
  );
};

// Desktop 3D card
const DesktopRoleCard = ({ role, index }: { role: typeof roles[0], index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [allowMotion, setAllowMotion] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const m = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = () => setAllowMotion(!m.matches);
    handler();
    m.addEventListener('change', handler);
    return () => m.removeEventListener('change', handler);
  }, []);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!allowMotion) return;
    const card = cardRef.current;
    if (!card) return;

    const { left, top, width, height } = card.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    const rotateX = (y / height - 0.5) * -20;
    const rotateY = (x / width - 0.5) * 20;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (card) {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    }
  };

  return (
    <Link href={role.href} aria-label={`Select role ${role.name}`} className="block w-full h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 rounded-2xl" style={{ animationDelay: `${index * 100}ms` }}>
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="group bg-transparent backdrop-blur-lg rounded-2xl p-6 md:p-7 lg:p-8 text-center transition-all duration-300 ease-out h-full flex flex-col items-center justify-center relative overflow-hidden shadow-lg hover:shadow-xl border border-border hover:border-primary/40"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="absolute inset-0 bg-card/30 rounded-2xl transition-colors duration-300 pointer-events-none"></div>
        <div className="absolute inset-[-2px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ background: `linear-gradient(135deg, ${role.color}00, ${role.color}50, ${role.color}00)` }}></div>

        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-no-repeat opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ backgroundImage: `radial-gradient(circle at 50% 0%, ${role.color}40, transparent 80%)` }}></div>

        <div className="mb-4 p-4 rounded-full bg-gradient-to-br from-white/20 to-white/5 ring-1 ring-white/10 transition-colors duration-300 transform-gpu" style={{ transform: 'translateZ(40px)' }}>
          <role.icon className="w-12 h-12 lg:w-14 lg:h-14 transition-transform duration-300 group-hover:scale-110" style={{ color: role.color }} />
        </div>
        <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-2 transform-gpu" style={{ transform: 'translateZ(30px)' }}>{role.name}</h3>
        <p className="text-muted-foreground text-sm md:text-base transform-gpu" style={{ transform: 'translateZ(20px)' }}>{role.description}</p>
        {role.name === 'Organization' && (
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 transform-gpu" style={{ transform: 'translateZ(18px)' }}>
            <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">NGO</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">Company</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">Trusts</span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default function RoleSelectionPage() {


  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-blue-500/20 rounded-full filter blur-3xl animate-blob"></div>
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-purple-500/20 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-1/4 -left-1/4 w-1/3 h-1/3 bg-green-500/20 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="flex justify-between items-center p-4 sm:p-6">
          <div className="flex items-center">
            <Image
              src="/Zoodo.png"
              alt="Zoodo"
              width={120}
              height={40}
              className="h-3 md:h-4 lg:h-5 w-auto"
              priority
            />
          </div>
          <Link href="/" className="text-sm text-foreground/60 hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </header>

        <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-6xl w-full text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 animate-fade-in-down">
              How are you joining us?
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl mb-12 animate-fade-in-up">
              Select your role to get started with a tailored experience.
            </p>

            <div className="max-w-2xl mx-auto space-y-4 sm:hidden">
              {roles.map((role, index) => (
                <div key={role.name} className={`animate-fade-in-up`} style={{ animationDelay: `${index * 150}ms` }}>
                  <MobileRoleCard role={role} index={index} />
                </div>
              ))}
            </div>

            <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 lg:gap-8">
              {roles.map((role, index) => (
                <div key={role.name} className={`animate-fade-in-up`} style={{ animationDelay: `${index * 150}ms` }}>
                  <DesktopRoleCard role={role} index={index} />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
