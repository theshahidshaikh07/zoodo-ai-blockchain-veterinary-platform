'use client';

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Stethoscope,
  GraduationCap,
  Bath,
  ArrowRight,
  Video,
  Home,
  Building2,
  AlertTriangle,
  Syringe,
  FlaskConical,
  Scissors,
  Sparkles,
} from "lucide-react";
import vetCareImg from "@/assets/vet-care-pillar.png";
import trainingImg from "@/assets/training-pillar.png";
import groomingImg from "@/assets/grooming-pillar.png";

const mp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.55, ease: "easeOut" as const, delay },
});

const pillars = [
  {
    id: "vet",
    badge: "Medical & Wellness",
    headline: "When your pet needs a doctor",
    sub: "From a quick online consult to life-saving emergency care — every mode of veterinary help, right here.",
    image: vetCareImg,
    imageAlt: "Veterinarian examining a golden retriever",
    icon: Stethoscope,
    modes: [
      { icon: Video, label: "Online Consult", href: "/care/veterinary/consultation?mode=online" },
      { icon: Home, label: "Home Visit", href: "/care/veterinary/consultation?mode=home" },
      { icon: Building2, label: "In-Clinic", href: "/care/veterinary/consultation?mode=clinic" },
      { icon: AlertTriangle, label: "Emergency", href: "/care/veterinary/emergency" },
      { icon: Syringe, label: "Vaccination", href: "/services/find-hospitals?type=vaccination" },
      { icon: FlaskConical, label: "Lab Tests", href: "/services/find-hospitals?type=lab_tests" },
    ],
    cta: { label: "Explore Vet Care", href: "/care/veterinary" },
  },
  {
    id: "training",
    badge: "Training & Behavior",
    headline: "Build a bond that lasts",
    sub: "Certified trainers for every stage — from puppy basics and obedience to behavior correction and anxiety support.",
    image: trainingImg,
    imageAlt: "Dog trainer working with a border collie",
    icon: GraduationCap,
    modes: [
      { icon: Sparkles, label: "Early Development", href: "/services/find-trainers?specialty=early-development" },
      { icon: GraduationCap, label: "Basic Training", href: "/services/find-trainers?specialty=basic-training" },
      { icon: AlertTriangle, label: "Behavior Issues", href: "/services/find-trainers?specialty=behavior-issues" },
      { icon: Home, label: "Anxiety & Stress", href: "/services/find-trainers?specialty=anxiety-stress" },
      { icon: Stethoscope, label: "Aggression", href: "/services/find-trainers?specialty=aggression" },
    ],
    cta: { label: "Find a Trainer", href: "/care/training" },
  },
  {
    id: "grooming",
    badge: "Grooming & Spa",
    headline: "Looking good, feeling great",
    sub: "Professional grooming, luxury spa treatments, and hygiene care — because your pet deserves to be pampered.",
    image: groomingImg,
    imageAlt: "Professional grooming a fluffy white dog",
    icon: Bath,
    modes: [
      { icon: Sparkles, label: "Complete Grooming", href: "/services/find-groomers?service=complete" },
      { icon: Bath, label: "Bath & Brush", href: "/services/find-groomers?service=bath-brush" },
      { icon: Scissors, label: "Styling & Haircuts", href: "/services/find-groomers?service=styling" },
      { icon: Sparkles, label: "Spa & Hygiene", href: "/services/find-groomers?service=spa-hygiene" },
      { icon: AlertTriangle, label: "Flea & Tick", href: "/services/find-groomers?service=flea-tick" },
    ],
    cta: { label: "Book Grooming", href: "/care/grooming" },
  },
];

const PillarCard = ({ pillar, index }: { pillar: typeof pillars[0]; index: number }) => (
  <motion.div
    {...mp(index * 0.1)}
    className="group flex flex-col bg-white rounded-[1.75rem] overflow-hidden border border-slate-100 hover:border-slate-200 transition-all duration-300 hover:shadow-md"
  >
    {/* Image */}
    <div className="relative h-60 lg:h-64 overflow-hidden">
      <Image
        src={pillar.image}
        alt={pillar.imageAlt}
        fill
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        sizes="(max-width: 1024px) 100vw, 33vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
      {/* Badge */}
      <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-xs font-semibold text-slate-700 border border-white/60">
        <pillar.icon className="w-3 h-3 text-primary" />
        {pillar.badge}
      </div>
    </div>

    {/* Content */}
    <div className="flex flex-col flex-1 p-6 lg:p-7 space-y-4">
      <div className="space-y-1.5">
        <h3 className="text-xl font-bold text-slate-900 leading-snug">{pillar.headline}</h3>
        <p className="text-sm text-slate-500 leading-relaxed">{pillar.sub}</p>
      </div>

      {/* Mode chips — all use primary palette */}
      <div className="flex flex-wrap gap-1.5">
        {pillar.modes.map((mode) => (
          <Link
            key={mode.label}
            href={mode.href}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-secondary text-slate-700 border border-slate-200 hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all duration-200"
          >
            <mode.icon className="w-2.5 h-2.5" />
            {mode.label}
          </Link>
        ))}
      </div>

      {/* CTA */}
      <div className="pt-1 mt-auto">
        <Link
          href={pillar.cta.href}
          className="group/cta inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors duration-200"
        >
          {pillar.cta.label}
          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/cta:translate-x-1" />
        </Link>
      </div>
    </div>
  </motion.div>
);

const CareSection = () => (
  <section id="care" className="relative py-24 lg:py-32">
    <div className="container mx-auto px-8 lg:px-20">

      {/* Header */}
      <motion.div {...mp(0)} className="max-w-xl mb-12 lg:mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-5">
          <Stethoscope className="w-3.5 h-3.5" />
          Complete Pet Care
        </div>
        <h2 className="text-4xl lg:text-[3.25rem] font-bold text-slate-900 leading-[1.05] tracking-tight mb-4">
          Everything your pet
          <br />
          <span className="text-primary">deserves.</span>
        </h2>
        <p className="text-base lg:text-lg text-slate-500 leading-relaxed">
          Medical care, behavioral training, and grooming — every aspect of
          your pet&apos;s wellbeing, handled by verified professionals.
        </p>
      </motion.div>

      {/* Pillar Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
        {pillars.map((pillar, i) => (
          <PillarCard key={pillar.id} pillar={pillar} index={i} />
        ))}
      </div>

      {/* Footer line */}
      <motion.div {...mp(0.35)} className="mt-12 flex items-center gap-4">
        <div className="h-px flex-1 bg-slate-100" />
        <p className="text-xs text-slate-400 font-medium whitespace-nowrap">
          All professionals are verified &amp; background-checked
        </p>
        <div className="h-px flex-1 bg-slate-100" />
      </motion.div>
    </div>
  </section>
);

export default CareSection;
