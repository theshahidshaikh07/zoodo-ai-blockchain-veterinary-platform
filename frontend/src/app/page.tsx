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
    <div className="min-h-screen bg-background overflow-hidden">
      <Header />
      <main className="relative">
        {/* Hero Section - Priority */}
        <section id="hero" className="relative z-10">
          <HeroSection />
        </section>
        
        {/* Services Section */}
        <section id="services" className="relative z-5">
          <ServicesSection />
        </section>
        
        {/* Community Section */}
        <section id="community" className="relative z-5">
          <CommunitySection />
        </section>
      </main>
      <Footer />
    </div>
  );
}
