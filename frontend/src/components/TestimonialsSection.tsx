'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import victoriaStilwellImg from "@/assets/victoria sitwell.jpg";
import vinodSharmaImg from "@/assets/vinod sharma.png";
import niallHarbisonImg from "@/assets/niall harbison.png";
import pexelsGustavo1 from "@/assets/pexels-edmond-dantes-4342352.jpg";

const mp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const, delay },
});

const testimonials = [
  {
    name: "Niall Harbison",
    role: "Street Dog Rescuer & Animal Welfare Advocate",
    content: "Community action is the difference between life and death for a street animal. Zoodo’s transparent fundraising and verified shelter network give every injured pet a fighting chance.",
    image: niallHarbisonImg,
  },
  {
    name: "Zoya Merchant",
    role: "Verified Pet Parent",
    content: "Best pet platform I've used. Comparing verified clinics, booking doorstep grooming, and keeping all our health records organized in one place. Highly recommend!",
    image: pexelsGustavo1,
  },
  {
    name: "Dr. Vinod Sharma",
    role: "Head Veterinarian & Small Animal Director",
    content: "Zoodo makes our daily practice so much smoother. Having verified past treatments, allergies, and vaccination logs upfront allows us to diagnose accurately without having to guess.",
    image: vinodSharmaImg,
  },
  {
    name: "Victoria Stilwell",
    role: "Canine Behaviorist & Author",
    content: "The easiest way for dedicated pet parents to discover certified positive reinforcement specialists, book training, and build lifelong healthy habits.",
    image: victoriaStilwellImg,
  },
];

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-slide every 8.5 seconds (paused on hover so user can read comfortably)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    }, 8500);
    return () => clearInterval(timer);
  }, [currentIndex, isPaused]);

  const prev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const next = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const current = testimonials[currentIndex];

  return (
    <section id="testimonials" className="relative py-16 lg:py-24 overflow-hidden">
      <div className="container mx-auto px-6 lg:px-20">
        
        {/* ── Section Header ── */}
        <motion.div {...mp(0)} className="mb-14 lg:mb-16 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 leading-tight tracking-[0.015em]">
            Stories of care, recovery & lifelong companionship.
          </h2>
          <p className="text-base lg:text-lg text-slate-600 mt-3 leading-relaxed">
            Hear how Zoodo is transforming healthcare access, daily wellness, and peace of mind for thousands of pets and families.
          </p>
        </motion.div>

        {/* ── Hero Testimonial Card (Matches Reference Image Exactly) ── */}
        <div className="relative max-w-5xl mx-auto pt-14 pb-28 sm:pt-16 sm:pb-36 lg:pb-44">
          <motion.div
            {...mp(0.1)}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="relative bg-[#bde4e9] rounded-tl-[2.25rem] rounded-tr-[5.5rem] sm:rounded-tl-[2.75rem] sm:rounded-tr-[7.5rem] lg:rounded-tr-[9rem] rounded-br-[2.25rem] sm:rounded-br-[2.75rem] rounded-bl-[5.5rem] sm:rounded-bl-[7.5rem] lg:rounded-bl-[9rem] px-6 py-10 sm:px-12 sm:py-16 lg:px-16 lg:py-20"
          >
            <div className="grid md:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center">
              
              {/* Left Column: Capsule / Stadium Portrait (Permanently Grounded, Smooth Image Crossfade) */}
              <div className="md:col-span-5 flex justify-center md:justify-start">
                <div className="relative -mt-16 sm:-mt-24 md:-my-32 translate-y-9 sm:translate-y-16 lg:translate-y-20 md:ml-4 lg:ml-8 z-10 flex-shrink-0">
                  <div className="relative w-[230px] sm:w-[300px] lg:w-[340px] h-[340px] sm:h-[460px] lg:h-[510px] rounded-full overflow-hidden bg-slate-200 shadow-md sm:shadow-none">
                    {testimonials.map((t, idx) => (
                      <motion.div
                        key={t.name}
                        initial={false}
                        animate={{
                          opacity: idx === currentIndex ? 1 : 0,
                          scale: idx === currentIndex ? 1 : 1.03,
                          zIndex: idx === currentIndex ? 2 : 1,
                        }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute inset-0 pointer-events-none"
                      >
                        <Image
                          src={t.image}
                          alt={t.name}
                          fill
                          priority
                          className="object-cover"
                          sizes="(max-width: 768px) 230px, 335px"
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Editorial Quote & Details */}
              <div className="md:col-span-7 relative z-10 pl-0 md:pl-6 lg:pl-10">
                
                {/* Soft Faded Quote Mark - Pure Flat Fill, Zero Stroke/Glow */}
                <div className="relative">
                  <Quote
                    strokeWidth={0}
                    className="w-12 h-12 sm:w-16 sm:h-16 fill-white/30 text-transparent rotate-180 -mb-1 sm:-mb-2 select-none pointer-events-none"
                  />

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentIndex}
                      initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -14, filter: "blur(4px)" }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      className="relative z-10"
                    >
                      <blockquote className="font-sans text-lg sm:text-xl lg:text-[1.5rem] text-slate-900 leading-[1.48] sm:leading-[1.56] font-medium tracking-tight mb-4 sm:mb-5 max-w-lg">
                        {current.content}
                      </blockquote>

                      <div className="font-sans">
                        <div className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                          {current.name}
                        </div>
                        <div className="text-xs sm:text-sm text-slate-700/80 font-medium tracking-wide mt-1">
                          {current.role}
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Slider Navigation Controls (Discreet bottom-right pills) */}
            <div className="mt-6 sm:mt-8 md:mt-0 flex items-center justify-end gap-2.5 relative z-20">
              <div className="flex items-center gap-1.5 mr-2">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === currentIndex
                        ? "w-6 bg-slate-900"
                        : "w-2 bg-slate-900/20 hover:bg-slate-900/40"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={prev}
                aria-label="Previous testimonial"
                className="w-9 h-9 rounded-full bg-white/60 hover:bg-white text-slate-800 flex items-center justify-center shadow-xs transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={next}
                aria-label="Next testimonial"
                className="w-9 h-9 rounded-full bg-white/60 hover:bg-white text-slate-800 flex items-center justify-center shadow-xs transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
