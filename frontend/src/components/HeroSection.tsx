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

const HeroSection = () => {
  const [mounted, setMounted] = useState(false);

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
    <section id="hero" className="relative min-h-screen flex items-start justify-center overflow-hidden bg-[var(--hero-bg)] pt-20 sm:pt-16 lg:pt-24">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-zoodo-purple/10 via-zoodo-blue/10 to-zoodo-pink/10 dark:hidden" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,hsl(var(--zoodo-purple))_0%,transparent_50%)] opacity-20 dark:hidden" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,hsl(var(--zoodo-blue))_0%,transparent_50%)] opacity-20 dark:hidden" />

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
                Your Pet.<br/><span className="gradient-hero-text dark:text-white">Our Priority.</span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground/80 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Powered by Dr. Salus AI, Zoodo delivers intelligent, secure, and personalized veterinary care anytime, anywhere.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 pt-1 lg:pt-4 justify-center lg:justify-start">
              <Button 
                variant="default" 
                size="xl"
                className="group relative bg-primary hover:bg-primary/90 hover:scale-105 transition-all duration-300 text-base lg:text-lg px-8 lg:px-12 py-3 lg:py-4 shadow-lg hover:shadow-2xl border-0 overflow-hidden"
                asChild
              >
                <Link href="/ai-assistant">
                {/* Animated background effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                {/* Glow effect */}
                <div className="absolute inset-0 bg-primary/20 blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                
                <span className="relative z-10">
                  <Stethoscope 
                    className="mr-2 animate-pulse" 
                    style={{ 
                      width: '1.5rem !important', 
                      height: '1.5rem !important',
                      minWidth: '1.5rem',
                      minHeight: '1.5rem'
                    }}
                  />
                </span>
                <span className="relative z-10 font-bold">Try Dr. Salus AI</span>
                <Sparkles className="w-4 h-4 lg:w-5 lg:h-5 ml-2 relative z-10 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                
                {/* Ripple effect */}
                <div className="absolute inset-0 rounded-lg group-hover:animate-ping group-hover:bg-white/20 transition-all duration-300"></div>
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="xl" 
                className="group relative hover:scale-105 transition-all duration-300 text-base lg:text-lg px-8 lg:px-12 py-3 lg:py-4 border-2 border-primary/40 hover:border-primary/80 hover:bg-primary/10 bg-background/80 hover:bg-primary/10 hover:text-foreground !hover:bg-primary/10 !hover:text-foreground"
                onClick={(e) => {
                  e.preventDefault();
                  // Add your custom click handler here
                  console.log('Get Instant Care button clicked');
                }}
              >
                <Lightning className="w-5 h-5 lg:w-7 lg:h-7 mr-2 relative z-10 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform" />
                <span className="relative z-10 font-semibold text-foreground">Get Instant Care</span>
                <div className="relative ml-2 z-10">
                  <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full animate-pulse group-hover:scale-125 transition-transform"></div>
                  <div className="absolute inset-0 w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full animate-ping"></div>
                </div>
              </Button>
            </div>

            {/* Trust Tags - Visible on all devices */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3 lg:gap-4 py-4 lg:py-6">
              <div className="flex flex-col items-center space-y-1 lg:space-y-2 p-3 lg:p-4 glass-card rounded-xl lg:rounded-2xl">
                <Stethoscope className="w-4 h-4 lg:w-6 lg:h-6 text-primary" />
                <span className="text-xs text-center text-muted-foreground">AI-Powered Diagnostics</span>
              </div>
              <div className="flex flex-col items-center space-y-1 lg:space-y-2 p-3 lg:p-4 glass-card rounded-xl lg:rounded-2xl">
                <Shield className="w-4 h-4 lg:w-6 lg:h-6 text-zoodo-blue" />
                <span className="text-xs text-center text-muted-foreground">Vet-Verified Guidance</span>
              </div>
              <div className="flex flex-col items-center space-y-1 lg:space-y-2 p-3 lg:p-4 glass-card rounded-xl lg:rounded-2xl">
                <Shield className="w-4 h-4 lg:w-6 lg:h-6 text-zoodo-purple" />
                <span className="text-xs text-center text-muted-foreground">Blockchain Health Records</span>
              </div>
              <div className="flex flex-col items-center space-y-1 lg:space-y-2 p-3 lg:p-4 glass-card rounded-xl lg:rounded-2xl">
                <Heart className="w-4 h-4 lg:w-6 lg:h-6 text-zoodo-pink" />
                <span className="text-xs text-center text-muted-foreground">10,000+ Pets Cared For</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default HeroSection;