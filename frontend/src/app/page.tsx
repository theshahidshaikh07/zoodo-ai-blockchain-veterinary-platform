'use client';

import { useEffect } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ServicesSection from '@/components/ServicesSection';
// import FeaturesSection from '@/components/FeaturesSection'; // Commented out
import CommunitySection from '@/components/CommunitySection';
import Footer from '@/components/Footer';

export default function HomePage() {
  useEffect(() => {
    // Add fade-up animation on scroll
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-up");
        }
      });
    }, observerOptions);

    // Observe all elements with fade-up class
    const fadeElements = document.querySelectorAll(".fade-up:not(.fade-up)");
    fadeElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      {/* Refined Background - "Ghost Light" Parametric Mesh */}
      <div className="fixed inset-0 bg-[image:var(--bg-subtle-mesh)] pointer-events-none opacity-90 z-0" />
      <div className="fixed inset-0 bg-[image:var(--bg-dot-pattern)] bg-[length:24px_24px] pointer-events-none opacity-50 [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)] z-0" />
      {/* Light mode: Subtle off-white tint for depth | Dark mode: Pure background */}
      <div className="fixed inset-0 bg-slate-50/40 dark:bg-transparent pointer-events-none z-0" />


      <div className="relative z-10">
        <Header />
        <main className="relative">
          {/* Hero Section - Priority */}
          <section id="hero" className="relative z-10 scroll-mt-20 md:scroll-mt-22 lg:scroll-mt-24">
            <HeroSection />
          </section>

          {/* Services Section */}
          <section id="services" className="relative z-10 scroll-mt-20 md:scroll-mt-22 lg:scroll-mt-24">
            <ServicesSection />
          </section>

          {/* Community Section */}
          <section id="community" className="relative z-10 scroll-mt-20 md:scroll-mt-22 lg:scroll-mt-24">
            <CommunitySection />
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
}
