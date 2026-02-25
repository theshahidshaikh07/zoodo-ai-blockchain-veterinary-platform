'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Stethoscope,
  Shield,
  Heart,
  Sparkles,
  Zap as Lightning,
  Users,
  BadgeCheck,
  PawPrint
} from "lucide-react";
import diversePets from "@/assets/transparent_diverse_petss.png";
import Link from "next/link";
import ConsultationPopup from "./ConsultationPopup";

const HeroSection = () => {
  const [mounted, setMounted] = useState(false);
  const [isConsultationPopupOpen, setIsConsultationPopupOpen] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render theme toggle until mounted
  if (!mounted) {
    return (
      <button className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 hover:bg-primary/10 hover:scale-105 transition-all duration-300 relative group">
        <div className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
      </button>
    );
  }

  return (
    <section id="hero" className="relative transition-colors duration-500">
      <div className="bg-[#bde4e9] dark:bg-primary/10 rounded-b-[4rem] lg:rounded-b-[6rem] overflow-hidden min-h-[90vh] flex items-center relative">
        {/* Decorative Background Curve - Custom SVG 'S' Path matching user's pen line exactly */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="w-full h-full opacity-40 select-none"
          >
            {/* Desktop Curve */}
            <path
              d="M72,0 C65,25 35,65 48,100 L100,100 L100,0 Z"
              fill="white"
              className="hidden lg:block"
            />
            {/* Mobile 'S' Curve - Final precision match to bottom-left corner */}
            <path
              d="M100,0 C100,50 0,50 0,100 L100,100 Z"
              fill="white"
              className="lg:hidden"
            />
          </svg>
        </div>

        <div className="container mx-auto px-8 lg:pl-20 lg:pr-10 relative z-10 pt-16 pb-2 lg:py-0">
          <div className="grid lg:grid-cols-2 gap-8 items-center w-full">
            {/* Left Content - Text */}
            <div className="text-left space-y-12 lg:space-y-16 fade-up order-1 lg:order-1 max-w-2xl">
              {/* Main Headline */}
              <div className="space-y-10 lg:space-y-16 pt-20 lg:pt-20">
                <h1 className="text-[2.75rem] lg:text-[5.25rem] font-bold font-heading leading-[0.95] text-slate-900 dark:text-white">
                  Your Pet.<br />Our Priority.
                </h1>
                <div className="flex items-center gap-4 pl-1">
                  <div className="w-[3px] h-12 bg-primary rounded-full opacity-80" />
                  <p className="text-lg lg:text-xl text-slate-600 font-medium leading-[1.4] max-w-sm">
                    Everything your pet needs. <br />
                    <span className="text-slate-900 font-bold">In one place.</span>
                  </p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 transition-all duration-300">
                <Button
                  size="xl"
                  className="w-full sm:w-[240px] px-0 py-5 rounded-tl-[99px] rounded-bl-[99px] rounded-br-[99px] rounded-tr-[30px] bg-slate-900 text-white hover:bg-slate-800 hover:text-white transition-all duration-300 text-lg font-semibold shadow-lg"
                  asChild
                >
                  <Link href="/ai-assistant">
                    Try Dr. Salus AI
                  </Link>
                </Button>
                <Button
                  size="xl"
                  className="w-full sm:w-[240px] px-0 py-5 rounded-tl-[30px] rounded-tr-[99px] rounded-bl-[99px] rounded-br-[99px] bg-white text-slate-900 hover:bg-slate-50 hover:text-slate-900 transition-all duration-300 text-lg font-semibold shadow-sm"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsConsultationPopupOpen(true);
                  }}
                >
                  Get Instant Care
                </Button>
              </div>
            </div>

            <div className="relative fade-up order-2 lg:order-2 flex justify-end overflow-visible">
              <div className="relative h-[420px] sm:h-[480px] lg:h-[650px] w-full lg:max-w-none max-w-[850px] -mt-36 lg:mt-0 lg:translate-x-20">
                <Image
                  src={diversePets}
                  alt="Happy diverse pets in veterinary care"
                  fill
                  className="object-contain object-right-bottom select-none pointer-events-none scale-150 sm:scale-130 lg:scale-125 origin-bottom lg:origin-bottom-right"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <ConsultationPopup
        isOpen={isConsultationPopupOpen}
        onClose={() => setIsConsultationPopupOpen(false)}
      />
    </section>
  );
};

export default HeroSection;