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
import diversePets from "@/assets/diverse-pets.jpg";
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
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 sm:pt-16 lg:pt-24">
      {/* Background now handled by parent page layout */}




      <div className="container mx-auto px-4 lg:px-8 relative z-10 min-h-full flex items-center py-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-12 items-center w-full">
          {/* Left Content - Hero Image (Desktop) / Order 2 (Mobile) */}
          <div className="relative lg:scale-110 fade-up order-2 lg:order-1">
            <div className="relative">

              {/* Main Image */}
              <div className="relative rounded-2xl lg:rounded-3xl overflow-hidden shadow-xl h-48 sm:h-56 md:h-72 lg:h-96">
                <Image
                  src={diversePets}
                  alt="Happy diverse pets in veterinary care"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent" />
              </div>

              {/* Overlay Cards - Mobile responsive */}
              <div className="absolute -bottom-2 -left-2 lg:-bottom-4 lg:-left-4 bg-white/90 dark:bg-slate-900/95 backdrop-blur-md border border-white/20 dark:border-white/10 p-2 lg:p-4 rounded-xl lg:rounded-2xl shadow-md">
                <div className="flex items-center space-x-2 lg:space-x-3">
                  <div className="w-8 h-8 lg:w-12 lg:h-12 bg-primary rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <div className="hidden lg:block">
                    <div className="font-semibold text-sm">Community</div>
                    <div className="text-xs text-muted-foreground">Pet Support</div>
                  </div>
                </div>
              </div>

              <div className="absolute -top-2 -right-2 lg:-top-4 lg:-right-4 bg-white/90 dark:bg-slate-900/95 backdrop-blur-md border border-white/20 dark:border-white/10 p-2 lg:p-4 rounded-xl lg:rounded-2xl shadow-md">
                <div className="flex items-center space-x-2 lg:space-x-3">
                  <div className="w-8 h-8 lg:w-12 lg:h-12 bg-primary rounded-full flex items-center justify-center">
                    <BadgeCheck className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <div className="hidden lg:block">
                    <div className="font-semibold text-sm">Verified Vets</div>
                    <div className="text-xs text-muted-foreground">Instant Booking</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Text (Desktop) / Order 1 (Mobile) */}
          <div className="text-center lg:text-left space-y-6 lg:space-y-8 fade-up order-1 lg:order-2">
            {/* AI Assistant Badge */}
            <div className="inline-flex items-center px-3 sm:px-6 py-2 sm:py-3 rounded-full bg-gradient-primary/10 border border-primary/20 text-xs sm:text-sm font-medium group transition-all duration-300">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0 text-primary animate-pulse" />
              <span className="whitespace-nowrap">Your Pet's <strong>Health Partner</strong></span>
            </div>

            {/* Main Headline */}
            <div className="space-y-6 lg:space-y-6">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Your Pet.<br /><span className="gradient-hero-text dark:text-white">Our Priority.</span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground/80 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Powered by Dr. Salus AI, Zoodo delivers intelligent, secure, and personalized veterinary care anytime, anywhere.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 pt-2 lg:pt-4 justify-center lg:justify-start max-w-2xl mx-auto lg:mx-0">
              <Button
                variant="ghost"
                size="xl"
                className="group inline-flex items-center gap-2 px-8 lg:px-10 py-3 lg:py-4 rounded-full bg-primary backdrop-blur-md border border-white/20 hover:bg-primary/90 hover:scale-[1.02] transition-all duration-300 text-base lg:text-lg sm:flex-1 text-white dark:text-black shadow-lg"
                asChild
              >
                <Link href="/ai-assistant" className="flex items-center justify-center">
                  <Stethoscope
                    className="text-white dark:text-black mr-2"
                    style={{
                      width: '1.5rem',
                      height: '1.5rem',
                      minWidth: '1.5rem',
                      minHeight: '1.5rem'
                    }}
                  />
                  <span className="font-semibold text-white dark:text-black">Try Dr. Salus AI</span>
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="xl"
                className="group inline-flex items-center gap-2 px-8 lg:px-10 py-3 lg:py-4 rounded-full bg-white dark:bg-black border border-border hover:bg-primary/5 hover:border-primary/40 transition-all duration-300 text-base lg:text-lg sm:flex-1 shadow-md hover:shadow-lg"
                onClick={(e) => {
                  e.preventDefault();
                  setIsConsultationPopupOpen(true);
                }}
              >
                <div className="relative mr-2">
                  <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full animate-pulse transition-transform"></div>
                  <div className="absolute inset-0 w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full animate-ping"></div>
                </div>
                <span className="font-semibold text-foreground">Get Instant Care</span>
              </Button>
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