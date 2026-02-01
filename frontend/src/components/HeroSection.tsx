'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Stethoscope,
  Shield,
  Heart,
  Sparkles,
  Zap as Lightning
} from "lucide-react";
import diversePets from "@/assets/diverse-pets.jpg";
import Link from "next/link";
import ConsultationPopup from "./ConsultationPopup";
import CommunityPopup from "./CommunityPopup";

const HeroSection = () => {
  const [mounted, setMounted] = useState(false);
  const [isConsultationPopupOpen, setIsConsultationPopupOpen] = useState(false);
  const [isCommunityPopupOpen, setIsCommunityPopupOpen] = useState(false);

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
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[var(--hero-bg)] pt-20 sm:pt-16 lg:pt-24">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-zoodo-purple/10 via-zoodo-blue/10 to-zoodo-pink/10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,hsl(var(--zoodo-purple))_0%,transparent_50%)] opacity-20 dark:opacity-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,hsl(var(--zoodo-blue))_0%,transparent_50%)] opacity-20 dark:opacity-10" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10 min-h-full flex items-start py-8">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-center w-full">
          {/* Left Content - Hero Image (Desktop) / Order 2 (Mobile) */}
          <div className="relative lg:scale-110 fade-up order-2 lg:order-1">
            <div className="relative">
              {/* Floating Elements - Mobile responsive */}
              <div className="absolute -top-3 -left-3 lg:-top-6 lg:-left-6 w-10 h-10 lg:w-12 lg:h-12 bg-gradient-primary rounded-full flex items-center justify-center floating shadow-elegant">
                <Stethoscope className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
              </div>
              <div className="absolute -bottom-3 -right-3 lg:-bottom-6 lg:-right-6 w-12 h-12 lg:w-16 lg:h-16 bg-gradient-secondary rounded-full flex items-center justify-center floating shadow-elegant" style={{ animationDelay: '1s' }}>
                <Shield className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
              </div>
              <div className="absolute top-1/2 -left-4 lg:-left-8 w-8 h-8 lg:w-10 lg:h-10 bg-zoodo-pink rounded-full flex items-center justify-center floating shadow-elegant" style={{ animationDelay: '2s' }}>
                <Heart className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
              </div>

              {/* Main Image */}
              <div className="relative rounded-2xl lg:rounded-3xl overflow-hidden shadow-elegant glow-effect h-40 sm:h-56 md:h-72 lg:h-96">
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
              <div className="absolute -bottom-2 -left-2 lg:-bottom-4 lg:-left-4 glass-card p-2 lg:p-4 rounded-xl lg:rounded-2xl shadow-elegant">
                <div className="flex items-center space-x-2 lg:space-x-3">
                  <div className="w-8 h-8 lg:w-12 lg:h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                    <Stethoscope className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <div className="hidden lg:block">
                    <div className="font-semibold text-sm">Dr. Salus AI</div>
                    <div className="text-xs text-muted-foreground">Smart diagnosis</div>
                  </div>
                </div>
              </div>

              <div className="absolute -top-2 -right-2 lg:-top-4 lg:-right-4 glass-card p-2 lg:p-4 rounded-xl lg:rounded-2xl shadow-elegant">
                <div className="flex items-center space-x-2 lg:space-x-3">
                  <div className="w-8 h-8 lg:w-12 lg:h-12 bg-gradient-secondary rounded-full flex items-center justify-center">
                    <Shield className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <div className="hidden lg:block">
                    <div className="font-semibold text-sm">Secure Records</div>
                    <div className="text-xs text-muted-foreground">Blockchain protected</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Text (Desktop) / Order 1 (Mobile) */}
          <div className="text-center lg:text-left space-y-4 lg:space-y-6 fade-up order-1 lg:order-2">
            {/* AI Assistant Badge */}
            <div className="inline-flex items-center px-3 sm:px-6 py-2 sm:py-3 rounded-full bg-gradient-primary/10 border border-primary/20 text-xs sm:text-sm font-medium group hover:shadow-glow transition-all duration-300">
              <Stethoscope className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-primary animate-pulse" />
              <span className="whitespace-nowrap">Meet <strong>Dr. Salus AI</strong> - Your Pet&#39;s Health Guardian</span>
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 ml-2 text-primary group-hover:scale-110 transition-transform" />
            </div>

            {/* Main Headline */}
            <div className="space-y-2 lg:space-y-3">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Your Pet.<br /><span className="gradient-hero-text dark:text-white">Our Priority.</span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground/80 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Powered by Dr. Salus AI, Zoodo delivers intelligent, secure, and personalized veterinary care anytime, anywhere.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 pt-1 lg:pt-4 justify-center lg:justify-start max-w-2xl mx-auto lg:mx-0">
              <Button
                variant="ghost"
                size="xl"
                className="group inline-flex items-center gap-2 px-6 py-2 lg:py-2.5 rounded-full bg-primary hover:bg-primary/80 border border-primary transition-all duration-300 shadow-md text-sm lg:text-base sm:flex-1"
                asChild
              >
                <Link href="/ai-assistant" className="flex items-center justify-center">
                  <Stethoscope
                    className="text-white dark:text-black"
                    style={{
                      width: '1.25rem',
                      height: '1.25rem',
                      minWidth: '1.25rem',
                      minHeight: '1.25rem'
                    }}
                  />
                  <span className="font-semibold text-white dark:text-black">Try Dr. Salus AI</span>
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="xl"
                className="group inline-flex items-center gap-2 px-6 py-2 lg:py-2.5 rounded-full glass-card border border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 shadow-md hover:shadow-lg text-sm lg:text-base sm:flex-1"
                onClick={(e) => {
                  e.preventDefault();
                  setIsConsultationPopupOpen(true);
                }}
              >
                <div className="relative">
                  <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full animate-pulse transition-transform"></div>
                  <div className="absolute inset-0 w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full animate-ping"></div>
                </div>
                <span className="font-semibold text-foreground">Get Instant Care</span>
              </Button>
              <Button
                variant="ghost"
                size="xl"
                className="group inline-flex items-center gap-2 px-6 py-2 lg:py-2.5 rounded-full glass-card border border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 shadow-md hover:shadow-lg text-sm lg:text-base sm:flex-1"
                onClick={(e) => {
                  e.preventDefault();
                  setIsCommunityPopupOpen(true);
                }}
              >
                <span className="font-semibold text-foreground">Join Community</span>
                <svg
                  className="w-4 h-4 transform group-hover:translate-x-1 transition-all duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Consultation Popup */}
      <ConsultationPopup
        isOpen={isConsultationPopupOpen}
        onClose={() => setIsConsultationPopupOpen(false)}
      />
      <CommunityPopup
        isOpen={isCommunityPopupOpen}
        onClose={() => setIsCommunityPopupOpen(false)}
      />
    </section>
  );
};

export default HeroSection;