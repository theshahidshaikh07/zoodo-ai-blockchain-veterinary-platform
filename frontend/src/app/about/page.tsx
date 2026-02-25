'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { HeartPulse, Shield, Globe, Users2, Mail, Linkedin, ArrowRight, Zap, Star, Instagram, Sparkles, Activity } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import shahidImage from '@/assets/meee.png';
import aayusheeImage from '@/assets/aayushees pet.png';
import khushiImage from '@/assets/khushis pet.png';
import { Card, CardContent } from "@/components/ui/card";

const AboutUs: React.FC = () => {
  const { elementRef: heroRef, isVisible: heroVisible } = useScrollAnimation();
  const { elementRef: storyRef, isVisible: storyVisible } = useScrollAnimation();
  const { elementRef: valuesRef, isVisible: valuesVisible } = useScrollAnimation();
  const { elementRef: teamRef, isVisible: teamVisible } = useScrollAnimation();
  const { elementRef: missionRef, isVisible: missionVisible } = useScrollAnimation();
  const router = useRouter();

  const handleExploreServicesClick = () => {
    router.push('/#services');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        {/* Curved Hero Section */}
        <section ref={heroRef} className={`relative transition-colors duration-500 scroll-fade-in ${heroVisible ? 'animate' : ''}`}>
          <div className="bg-[#bde4e9] dark:bg-primary/10 rounded-b-[4rem] lg:rounded-b-[6rem] overflow-hidden min-h-[90vh] flex items-center relative">
            <div className="pt-20 px-8 lg:px-20 max-w-7xl mx-auto w-full z-10">
              <div className="max-w-5xl">
                <h1 className="text-[3.5rem] md:text-[5rem] lg:text-[6.5rem] font-bold tracking-tighter text-slate-900 dark:text-white leading-[1.05] mb-12">
                  Care without <br className="hidden md:block" />
                  <span className="text-slate-500 dark:text-slate-400 tracking-tight">compromise.</span>
                </h1>

                <div className="relative pl-6 md:pl-10 before:content-[''] before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:bg-slate-900/10 dark:before:bg-white/10 before:rounded-full">
                  <p className="text-lg md:text-2xl text-slate-700 dark:text-slate-300 font-medium leading-relaxed max-w-3xl">
                    When it comes to the pets we love, settling for <span className="text-slate-500 dark:text-slate-400">&quot;good enough&quot;</span> isn't an option. We eliminated the friction, anxiety, and endless searching to create a place where{" "}
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-slate-900 dark:text-white text-base md:text-xl font-bold tracking-tight shadow-sm align-baseline -translate-y-0.5 mx-1">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="opacity-40"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
                      world-class care
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="opacity-40 rotate-180"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
                    </span>
                    {" "}feels entirely effortless.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Out-of-the-Box Zig-Zag Narrative Section */}
        <section ref={storyRef} className={`py-32 lg:py-48 scroll-fade-in ${storyVisible ? 'animate' : ''}`}>
          <div className="container mx-auto px-8 lg:px-20 max-w-7xl">
            <div className="flex flex-col gap-24 md:gap-40">

              {/* Card 1 - Left Alignment */}
              <div className="relative w-full xl:w-11/12 mr-auto group">
                {/* Solid offset shadow */}
                <div className="absolute inset-0 bg-slate-900 dark:bg-white rounded-[2rem] md:rounded-[3rem] translate-x-4 translate-y-4 md:translate-x-8 md:translate-y-8 transition-transform duration-300 group-hover:translate-x-6 group-hover:translate-y-6" />
                {/* Main Card */}
                <div className="relative bg-white dark:bg-slate-950 border-2 border-slate-900/10 dark:border-slate-800 p-8 md:p-14 lg:p-20 rounded-[2rem] md:rounded-[3rem] flex flex-col md:flex-row gap-8 lg:gap-16 items-center z-10 shadow-xl">
                  <div className="md:w-1/2 shrink-0">
                    <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold text-slate-900 dark:text-white tracking-normal leading-[1.1]">
                      Absolute Devotion.
                    </h2>
                  </div>
                  <div className="md:w-1/2">
                    <p className="text-xl md:text-2xl font-medium text-slate-600 dark:text-slate-400 leading-relaxed md:leading-snug">
                      The love we share with our pets deserves an equally profound standard of care. We are uncompromising in quality, transparency, and immediacy.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 2 - Right Alignment */}
              <div className="relative w-full xl:w-11/12 ml-auto group">
                <div className="absolute inset-0 bg-slate-900 dark:bg-white rounded-[2rem] md:rounded-[3rem] -translate-x-4 translate-y-4 md:-translate-x-8 md:translate-y-8 transition-transform duration-300 group-hover:-translate-x-6 group-hover:translate-y-6" />
                <div className="relative bg-white dark:bg-slate-950 border-2 border-slate-900/10 dark:border-slate-800 p-8 md:p-14 lg:p-20 rounded-[2rem] md:rounded-[3rem] flex flex-col md:flex-row gap-8 lg:gap-16 items-center z-10 shadow-xl">
                  <div className="md:w-1/2 shrink-0">
                    <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold text-slate-900 dark:text-white tracking-normal leading-[1.1]">
                      A Sanctuary for Well-being.
                    </h2>
                  </div>
                  <div className="md:w-1/2">
                    <p className="text-xl md:text-2xl font-medium text-slate-600 dark:text-slate-400 leading-relaxed md:leading-snug">
                      We have unified everything your pet needs into one seamless experience. From trusted veterinarians and expert trainers to premium grooming and essential supplies, elite care is instantly accessible.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 3 - Left Alignment */}
              <div className="relative w-full xl:w-11/12 mr-auto group">
                <div className="absolute inset-0 bg-slate-900 dark:bg-white rounded-[2rem] md:rounded-[3rem] translate-x-4 translate-y-4 md:translate-x-8 md:translate-y-8 transition-transform duration-300 group-hover:translate-x-6 group-hover:translate-y-6" />
                <div className="relative bg-white dark:bg-slate-950 border-2 border-slate-900/10 dark:border-slate-800 p-8 md:p-14 lg:p-20 rounded-[2rem] md:rounded-[3rem] flex flex-col md:flex-row gap-8 lg:gap-16 items-center z-10 shadow-xl">
                  <div className="md:w-1/2 shrink-0">
                    <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold text-slate-900 dark:text-white tracking-normal leading-[1.1]">
                      Connected by Compassion.
                    </h2>
                  </div>
                  <div className="md:w-1/2">
                    <p className="text-xl md:text-2xl font-medium text-slate-600 dark:text-slate-400 leading-relaxed md:leading-snug">
                      Beyond the technology beats the heart of a vibrant community. We are bringing together pet parents and professionals who refuse to settle.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Team Section */}
        <section ref={teamRef} className={`relative scroll-fade-in px-4 lg:px-8 max-w-7xl mx-auto ${teamVisible ? 'animate' : ''}`}>
          <div className="bg-[#bde4e9] dark:bg-primary/10 rounded-[3rem] lg:rounded-[4rem] overflow-hidden w-full">
            <div className="container mx-auto px-6 lg:px-12 py-16 lg:py-20">
              <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 lg:gap-12 items-end mb-16">
                <div className="md:w-1/2">
                  <h2 className="text-5xl md:text-[4rem] font-bold tracking-tighter text-slate-900 dark:text-white leading-[1.05]">
                    The people <br />
                    <span className="text-slate-500 dark:text-slate-400">behind the promise.</span>
                  </h2>
                </div>
                <div className="md:w-1/2">
                  <p className="text-xl md:text-2xl text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Meet the visionaries and pet lovers dedicated to elevating the standard of animal welfare around the globe.
                  </p>
                </div>
              </div>

              <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-3 gap-12 lg:gap-16">

                  {/* Shahid Shaikh */}
                  <div className="group relative">
                    <div className="relative h-[400px] sm:h-[450px] w-full overflow-hidden rounded-[2.5rem] bg-white dark:bg-slate-900 shadow-xl transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-primary/20">
                      <Image
                        src={shahidImage}
                        alt="Shahid Shaikh"
                        className="w-full h-full object-cover object-[50%_15%] filter grayscale opacity-90 transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105 group-hover:opacity-100 mix-blend-multiply dark:mix-blend-normal"
                        layout="fill"
                      />
                    </div>
                    <div className="mt-8 text-center space-y-1.5">
                      <h3 className="text-2xl font-bold font-heading text-slate-900 dark:text-white leading-none">Shahid Shaikh</h3>
                      <p className="text-slate-500 dark:text-slate-400 font-bold tracking-[0.15em] uppercase text-[10px] sm:text-xs">Originator</p>
                      <div className="pt-5 flex justify-center gap-2">
                        <a href="mailto:theshahidshaikh7@gmail.com" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white">
                          <Mail className="w-5 h-5 stroke-[2.5]" />
                        </a>
                        <a href="https://www.linkedin.com/in/shahid-shaikh-" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white">
                          <Linkedin className="w-5 h-5 stroke-[2.5]" />
                        </a>
                        <a href="https://www.instagram.com/chiaroscuro.mind" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white">
                          <Instagram className="w-5 h-5 stroke-[2.5]" />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Aayushee Dhanokar */}
                  <div className="group relative md:translate-y-12">
                    <div className="relative h-[400px] sm:h-[450px] w-full overflow-hidden rounded-[2.5rem] bg-white dark:bg-slate-900 shadow-xl transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-primary/20">
                      <Image
                        src={aayusheeImage}
                        alt="Aayushee Dhanokar"
                        className="w-full h-full object-cover object-[50%_25%] filter grayscale opacity-90 transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105 group-hover:opacity-100 mix-blend-multiply dark:mix-blend-normal"
                        layout="fill"
                      />
                    </div>
                    <div className="mt-8 text-center space-y-1.5">
                      <h3 className="text-2xl font-bold font-heading text-slate-900 dark:text-white leading-none">Aayushee Dhanokar</h3>
                      <p className="text-slate-500 dark:text-slate-400 font-bold tracking-[0.15em] uppercase text-[10px] sm:text-xs">Catalyst</p>
                      <div className="pt-5 flex justify-center gap-2">
                        <a href="mailto:daayushee11@gmail.com" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white">
                          <Mail className="w-5 h-5 stroke-[2.5]" />
                        </a>
                        <a href="https://www.linkedin.com/in/aayushee-dhanokar-95733b267" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white">
                          <Linkedin className="w-5 h-5 stroke-[2.5]" />
                        </a>
                        <a href="https://www.instagram.com/_aayushee_1205" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white">
                          <Instagram className="w-5 h-5 stroke-[2.5]" />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Khushi Mishra */}
                  <div className="group relative">
                    <div className="relative h-[400px] sm:h-[450px] w-full overflow-hidden rounded-[2.5rem] bg-white dark:bg-slate-900 shadow-xl transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-primary/20">
                      <Image
                        src={khushiImage}
                        alt="Khushi Mishra"
                        className="w-full h-full object-cover filter grayscale opacity-90 transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105 group-hover:opacity-100 mix-blend-multiply dark:mix-blend-normal"
                        layout="fill"
                      />
                    </div>
                    <div className="mt-8 text-center space-y-1.5">
                      <h3 className="text-2xl font-bold font-heading text-slate-900 dark:text-white leading-none">Khushi Mishra</h3>
                      <p className="text-slate-500 dark:text-slate-400 font-bold tracking-[0.15em] uppercase text-[10px] sm:text-xs">Catalyst</p>
                      <div className="pt-5 flex justify-center gap-2">
                        <a href="mailto:kmishra2026@gmail.com" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white">
                          <Mail className="w-5 h-5 stroke-[2.5]" />
                        </a>
                        <a href="https://www.linkedin.com/in/khushi-mishra-196959263" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white">
                          <Linkedin className="w-5 h-5 stroke-[2.5]" />
                        </a>
                        <a href="https://www.instagram.com/khuusshehe" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white">
                          <Instagram className="w-5 h-5 stroke-[2.5]" />
                        </a>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Join Our Mission Section */}
        <section ref={missionRef} className={`py-32 scroll-fade-in ${missionVisible ? 'animate' : ''}`}>
          <div className="container mx-auto px-8 lg:px-20 text-center max-w-3xl">

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-slate-900 dark:text-white tracking-tight mb-8">
              Be part of the evolution.
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 font-medium mb-12">
              Join thousands of forward-thinking pet parents who trust Zoodo for an elevated pet care experience.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
              <Button asChild variant="ghost" size="xl" className="w-full sm:w-auto rounded-full px-10 bg-primary backdrop-blur-md border border-white/20 hover:bg-primary/90 text-white dark:text-black hover:text-white dark:hover:text-black text-lg transition-all duration-300 shadow-xl shadow-primary/10">
                <Link href="/role-selection">
                  Get Started
                </Link>
              </Button>
              <Link href="/contact" className="text-slate-600 dark:text-slate-400 font-semibold hover:text-primary transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutUs;