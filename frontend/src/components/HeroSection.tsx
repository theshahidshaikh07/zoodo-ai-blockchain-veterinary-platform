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
  BadgeCheck
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
            <path 
              d="M72,0 C65,25 35,65 48,100 L100,100 L100,0 Z" 
              fill="white"
            />
          </svg>
        </div>
        
        <div className="container mx-auto px-6 lg:px-12 relative z-10 py-20 lg:py-0">
          <div className="grid lg:grid-cols-2 gap-8 items-center w-full">
            {/* Left Content - Text */}
            <div className="text-left space-y-10 fade-up order-1 lg:order-1 max-w-2xl">
              {/* Main Headline */}
              <div className="space-y-6 pt-16 lg:pt-28">
                <h1 className="text-6xl lg:text-8xl font-bold font-heading leading-[1.1] text-slate-900 dark:text-white tracking-tight">
                  Your Pet.<br />Our Priority.
                </h1>
                <p className="text-lg lg:text-xl text-slate-700/80 dark:text-slate-300 leading-relaxed max-w-lg">
                  Powered by Dr. Salus AI, Zoodo delivers intelligent, secure, and personalized veterinary care anytime, anywhere.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 transition-all duration-300">
                <Button
                  size="xl"
                  className="px-10 py-5 rounded-tl-[99px] rounded-bl-[99px] rounded-br-[99px] rounded-tr-[30px] bg-slate-900 text-white hover:bg-slate-800 hover:text-white transition-all duration-300 text-base font-bold uppercase tracking-wider shadow-lg"
                  asChild
                >
                  <Link href="/ai-assistant">
                    Try Dr. Salus AI
                  </Link>
                </Button>
                <Button
                  size="xl"
                  className="px-10 py-5 rounded-tl-[30px] rounded-tr-[99px] rounded-bl-[99px] rounded-br-[99px] bg-white text-slate-900 hover:bg-slate-50 hover:text-slate-900 transition-all duration-300 text-base font-bold uppercase tracking-wider shadow-sm"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsConsultationPopupOpen(true);
                  }}
                >
                  Get Instant Care
                </Button>
              </div>
            </div>

            {/* Right Content - Hero Image */}
            <div className="relative fade-up order-2 lg:order-2 flex justify-end overflow-visible">
              <div className="relative h-[300px] sm:h-[400px] lg:h-[650px] w-full max-w-[850px]">
                <Image
                  src={diversePets}
                  alt="Happy diverse pets in veterinary care"
                  fill
                  className="object-contain object-bottom select-none pointer-events-none scale-110 lg:scale-125 origin-bottom"
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