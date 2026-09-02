'use client';

import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import VetCareSection from '@/components/VetCareSection';
import TrainingSection from '@/components/TrainingSection';
import GroomingSection from '@/components/GroomingSection';
import InsuranceSection from '@/components/InsuranceSection';
import ShopSection from '@/components/ShopSection';
import TravelSection from '@/components/TravelSection';
import CommunitySection from '@/components/CommunitySection';
import TestimonialsSection from '@/components/TestimonialsSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      {/* Refined Background - "Ghost Light" Parametric Mesh */}
      <div className="fixed inset-0 bg-[image:var(--bg-subtle-mesh)] pointer-events-none opacity-90 z-0" />
      <div className="fixed inset-0 bg-[image:var(--bg-dot-pattern)] bg-[length:24px_24px] pointer-events-none opacity-50 [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)] z-0" />
      {/* Light mode: Subtle off-white tint for depth | Dark mode: Pure background */}
      <div className="fixed inset-0 bg-[#f6f1e8]/40 dark:bg-transparent pointer-events-none z-0" />

      <div className="relative z-10">
        <Header />
        <main className="relative">
          {/* Hero Section */}
          <section id="hero" className="relative z-10 scroll-mt-20 md:scroll-mt-22 lg:scroll-mt-24">
            <HeroSection />
          </section>

          {/* Care Sections (3 dedicated bento layouts) */}
          <section id="care" className="relative z-10 scroll-mt-20 md:scroll-mt-22 lg:scroll-mt-24">
            <VetCareSection />
          </section>

          <section className="relative z-10 scroll-mt-20 md:scroll-mt-22 lg:scroll-mt-24">
            <TrainingSection />
          </section>

          <section className="relative z-10 scroll-mt-20 md:scroll-mt-22 lg:scroll-mt-24">
            <GroomingSection />
          </section>

          {/* Insurance Section */}
          <section id="insurance" className="relative z-10 scroll-mt-20 md:scroll-mt-22 lg:scroll-mt-24">
            <InsuranceSection />
          </section>

          {/* Shop Section */}
          <section id="shop" className="relative z-10 scroll-mt-20 md:scroll-mt-22 lg:scroll-mt-24">
            <ShopSection />
          </section>

          {/* Travel Section */}
          <section id="travel" className="relative z-10 scroll-mt-20 md:scroll-mt-22 lg:scroll-mt-24">
            <TravelSection />
          </section>

          {/* Community Section */}
          <section id="community" className="relative z-10 scroll-mt-20 md:scroll-mt-22 lg:scroll-mt-24">
            <CommunitySection />
          </section>

          {/* Real Stories & Reviews Section (Standalone) */}
          <section id="testimonials" className="relative z-10 scroll-mt-20 md:scroll-mt-22 lg:scroll-mt-24">
            <TestimonialsSection />
          </section>

          {/* Join CTA Section (Standalone Banner) */}
          <section id="join-cta" className="relative z-10 scroll-mt-20 md:scroll-mt-22 lg:scroll-mt-24">
            <CTASection />
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
}
