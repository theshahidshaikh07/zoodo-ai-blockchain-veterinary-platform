'use client';

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Video,
  Building2,
  Home,
  ArrowRight,
} from "lucide-react";
import vetCareImg from "@/assets/ema-vet.png";

const mp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const, delay },
});

const quickActions = [
  {
    icon: Video,
    label: "Online Video Consultation",
    desc: "Talk to certified veterinarians instantly via secure video call",
    actionText: "Book Online Consultation",
    href: "/services/find-vets?type=online",
  },
  {
    icon: Building2,
    label: "Veterinary Clinic Visit",
    desc: "Book priority appointments at top rated veterinary clinics & hospitals",
    actionText: "Book Clinic Visit",
    href: "/services/find-hospitals",
  },
  {
    icon: Home,
    label: "Home Veterinary Visit",
    desc: "Certified doctors visit your doorstep for routine checkups & vaccines",
    actionText: "Book Home Visit",
    href: "/services/find-vets?type=home",
  },
];

const VetCareSection = () => (
  <section id="vet-care" className="relative py-16 lg:py-24">
    <div className="container mx-auto px-6 lg:px-20">
      
      {/* ── Section Header ── */}
      <motion.div {...mp(0)} className="mb-10 lg:mb-12 max-w-none">
        <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 leading-tight tracking-[0.015em] max-w-none">
          World class healthcare when your pet needs it most.
        </h2>
        <p className="text-base lg:text-lg text-slate-600 mt-2.5 max-w-none">
          From 24/7 emergency surgical procedures to instant video consultations with top rated medical experts.
        </p>
      </motion.div>

      {/* Main Bento Grid */}
      <div className="grid lg:grid-cols-5 gap-5 lg:gap-6">
        
        {/* Elite Minimal Image Hero Card */}
        <motion.div
          {...mp(0.05)}
          className="lg:col-span-3 group relative overflow-hidden rounded-tl-[0.75rem] rounded-tr-[2.5rem] rounded-br-[2.5rem] rounded-bl-[2.5rem] min-h-[340px] lg:min-h-[440px] shadow-xs border border-slate-200/50 bg-slate-100"
        >
          <Image
            src={vetCareImg}
            alt="Veterinarian caring for a pet"
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
            sizes="(max-width: 1024px) 100vw, 60vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/80 via-[#0f172a]/20 to-transparent" />
          
          <div className="absolute inset-0 p-6 lg:p-8 flex flex-col justify-end">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 lg:gap-5">
              <Link
                href="/care/veterinary"
                className="inline-flex items-center gap-2 w-fit px-6 py-3 bg-primary text-slate-900 text-sm font-semibold rounded-tl-[20px] rounded-tr-[99px] rounded-bl-[99px] rounded-br-[99px] hover:bg-primary/90 transition-colors duration-200 group/btn shadow-sm flex-shrink-0"
              >
                Explore Vet Care
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1 text-slate-900" />
              </Link>
              <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed max-w-sm">
                Connect with top rated clinics, book home visits, or schedule instant video consultations.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Right: 3 Action Cards (2 cols) */}
        <div className="lg:col-span-2 flex flex-col gap-4 lg:gap-5">
          {quickActions.map((action, i) => (
            <motion.div key={action.label} {...mp(0.1 + i * 0.08)}>
              <Link
                href={action.href}
                className="group/card flex flex-col justify-between bg-white rounded-tl-[2rem] rounded-tr-[0.5rem] rounded-br-[2rem] rounded-bl-[2rem] border border-slate-200/80 hover:border-slate-300 shadow-xs hover:shadow-sm transition-all duration-200 overflow-hidden h-full"
              >
                <div className="p-5 lg:p-6 flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                    <action.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-base font-bold text-slate-900 mb-1">
                      {action.label}
                    </div>
                    <div className="text-xs text-slate-600 leading-relaxed">
                      {action.desc}
                    </div>
                  </div>
                </div>

                <div className="w-full bg-slate-900 group-hover/card:bg-slate-800 text-white py-3.5 lg:py-4 px-6 flex items-center justify-between transition-colors duration-200">
                  <span className="text-xs lg:text-sm font-bold tracking-wide">{action.actionText}</span>
                  <ArrowRight className="w-4 h-4 group-hover/card:translate-x-1 transition-transform text-primary" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default VetCareSection;
