'use client';

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Bath,
  Sparkles,
  Scissors,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import groomingImg from "@/assets/groomer.png";

const mp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const, delay },
});

const services = [
  { icon: Sparkles, label: "Full Body Grooming", href: "/services/find-groomers?service=complete" },
  { icon: Bath, label: "Medicated Bath & Fluff", href: "/services/find-groomers?service=bath-brush" },
  { icon: Scissors, label: "Breed Haircuts & Styling", href: "/services/find-groomers?service=styling" },
  { icon: Sparkles, label: "Ear & Paw Spa Hygiene", href: "/services/find-groomers?service=spa-hygiene" },
  { icon: AlertTriangle, label: "Flea & Tick Defense", href: "/services/find-groomers?service=flea-tick" },
];

const GroomingSection = () => (
  <section id="grooming" className="relative py-8 lg:py-12">
    <div className="container mx-auto px-6 lg:px-20">
      
      {/* ── Single Panoramic Hero Card ── */}
      <motion.div
        {...mp(0)}
        className="relative overflow-hidden bg-[#bde4e9] rounded-tl-[1rem] rounded-tr-[2.5rem] rounded-br-[2.5rem] rounded-bl-[2.5rem] shadow-sm border border-[#a8dee5]"
      >
        <div className="grid lg:grid-cols-2 min-h-[420px] lg:min-h-[480px]">
          
          {/* Left Content */}
          <div className="p-8 lg:p-14 flex flex-col justify-center relative z-10 order-2 lg:order-1">
            <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 leading-tight tracking-[0.015em] mb-4">
              Discover certified pet salons & doorstep groomers.
            </h2>
            
            <p className="text-sm lg:text-base text-slate-700 leading-relaxed max-w-xl mb-8">
              A trusted grooming marketplace to compare top rated salons, evaluate organic coat spa packages, and book doorstep grooming specialists.
            </p>

            {/* Service chips */}
            <div className="flex flex-wrap gap-2.5 mb-8">
              {services.map((svc) => (
                <Link
                  key={svc.label}
                  href={svc.href}
                  className="inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold bg-white text-slate-800 border border-white/80 shadow-xs hover:border-slate-900 hover:text-slate-900 transition-all duration-200"
                >
                  {svc.label}
                </Link>
              ))}
            </div>

            {/* CTA */}
            <div>
              <Link
                href="/care/grooming"
                className="inline-flex items-center gap-2 w-fit px-6 py-3 bg-slate-900 text-white text-sm font-semibold rounded-tl-[99px] rounded-bl-[99px] rounded-br-[99px] rounded-tr-[20px] hover:bg-slate-800 transition-all duration-300 group/btn shadow-md"
              >
                Book Grooming Session
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative min-h-[280px] lg:min-h-0 order-1 lg:order-2">
            <Image
              src={groomingImg}
              alt="Professional grooming a dog"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#bde4e9] via-transparent to-transparent w-1/5 hidden lg:block" />
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default GroomingSection;
