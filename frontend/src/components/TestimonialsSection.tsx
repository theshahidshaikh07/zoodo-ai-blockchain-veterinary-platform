'use client';

import Image from "next/image";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import pexelsKooldark1 from "@/assets/vets/rdj.png";
import pexelsGustavo1 from "@/assets/pexels-edmond-dantes-4342352.jpg";
import pexelsGustavo2 from "@/assets/pexels-gustavo-fring-4173251.jpg";

const mp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const, delay },
});

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Rescue Dog Parent",
    content: "Zoodo helped me find the perfect vet for my rescue dog. The instant telemedicine consults and community adoption network were life-changing!",
    rating: 5,
    image: pexelsGustavo1,
  },
  {
    name: "Dr. Michael Chen",
    role: "Chief Veterinarian",
    content: "The platform has streamlined my clinical practice, digitised prescriptions, and allowed me to help hundreds of critical emergency cases.",
    rating: 5,
    image: pexelsKooldark1,
  },
  {
    name: "Emma Rodriguez",
    role: "Certified Dog Behaviorist",
    content: "Being part of the Zoodo ecosystem has connected me with dedicated pet parents who truly care about positive reinforcement training.",
    rating: 5,
    image: pexelsGustavo2,
  },
];

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="relative py-16 lg:py-24">
      <div className="container mx-auto px-6 lg:px-20">
        
        {/* ── Centered Inspired Section Header ── */}
        <motion.div {...mp(0)} className="mb-12 lg:mb-14 text-center max-w-4xl mx-auto">
          <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 leading-tight tracking-[0.015em]">
            Stories of care, recovery & lifelong companionship.
          </h2>
          <p className="text-base lg:text-lg text-slate-600 mt-3 leading-relaxed">
            Hear how Zoodo is transforming healthcare access, daily wellness, and peace of mind for thousands of happy pets and their families.
          </p>
        </motion.div>

        {/* 3 Review Cards Grid */}
        <div className="grid md:grid-cols-3 gap-5 lg:gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              {...mp(0.08 + i * 0.06)}
              className="bg-white p-6 lg:p-8 rounded-tl-[0.5rem] rounded-tr-[1.75rem] rounded-br-[1.75rem] rounded-bl-[1.75rem] border border-slate-200/80 shadow-xs hover:border-slate-300 hover:shadow-sm flex flex-col justify-between relative group transition-all duration-200"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: t.rating }).map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-5 h-5 text-slate-300" />
                </div>
                
                <p className="text-xs lg:text-sm text-slate-600 leading-relaxed mb-6 italic">
                  &quot;{t.content}&quot;
                </p>
              </div>

              <div className="flex items-center gap-3.5 pt-4 border-t border-slate-100">
                <div className="relative w-11 h-11 rounded-full overflow-hidden border border-slate-200 shadow-xs">
                  <Image src={t.image} alt={t.name} fill className="object-cover" sizes="44px" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">{t.name}</div>
                  <div className="text-xs text-slate-500 font-medium">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
