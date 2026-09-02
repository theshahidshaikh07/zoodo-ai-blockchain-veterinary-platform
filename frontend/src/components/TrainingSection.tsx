'use client';

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
} from "lucide-react";
import trainingImg from "@/assets/arnoldtrainer.png";

const mp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const, delay },
});

const quickActions = [
  {
    label: "Early Development & Puppy Care",
    desc: "Socialization, housebreaking, and foundation skills for young pets",
    href: "/services/find-trainers?specialty=early-development",
  },
  {
    label: "Obedience & Skill Building",
    desc: "Leash manners, recall, obedience, and positive reinforcement",
    href: "/services/find-trainers?specialty=basic-training",
  },
  {
    label: "Behavior Modification & Anxiety",
    desc: "Support for separation anxiety, aggression, and fear triggers",
    href: "/services/find-trainers?specialty=behavior-issues",
  },
];

const TrainingSection = () => (
  <section id="training" className="relative py-16 lg:py-24">
    <div className="container mx-auto px-6 lg:px-20">
      
      {/* ── Section Header ── */}
      <motion.div {...mp(0)} className="mb-10 lg:mb-12 max-w-none">
        <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 leading-tight tracking-[0.015em] max-w-none">
          Transform everyday behavior with certified expert trainers.
        </h2>
        <p className="text-base lg:text-lg text-slate-600 mt-2.5 max-w-none">
          Positive reinforcement for puppy development, advanced skill building, and anxiety management.
        </p>
      </motion.div>

      {/* Bento Grid: Reversed layout */}
      <div className="grid lg:grid-cols-5 gap-5 lg:gap-6">
        
        {/* Left: 3 Stacked Cards (2 cols) */}
        <div className="lg:col-span-2 flex flex-col gap-4 lg:gap-5 order-2 lg:order-1">
          {quickActions.map((action, i) => (
            <motion.div key={action.label} {...mp(0.1 + i * 0.08)}>
              <Link
                href={action.href}
                className="group/card flex items-center justify-between p-6 bg-white rounded-tl-[0.5rem] rounded-tr-[2rem] rounded-br-[2rem] rounded-bl-[2rem] border border-slate-200/80 hover:border-slate-300 shadow-xs hover:shadow-sm transition-all duration-200"
              >
                <div className="flex-1 min-w-0 pr-4">
                  <div className="text-base font-bold text-slate-900 mb-1">
                    {action.label}
                  </div>
                  <div className="text-xs text-slate-600 leading-relaxed">
                    {action.desc}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover/card:text-primary group-hover/card:translate-x-1 transition-all duration-200 flex-shrink-0" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Right: Large Feature Card (3 cols) */}
        <motion.div
          {...mp(0.05)}
          className="lg:col-span-3 group relative overflow-hidden rounded-tl-[2.5rem] rounded-tr-[0.75rem] rounded-br-[2.5rem] rounded-bl-[2.5rem] min-h-[340px] lg:min-h-[440px] shadow-xs border border-slate-200/50 bg-slate-100 order-1 lg:order-2"
        >
          <Image
            src={trainingImg}
            alt="Professional trainer working with a dog"
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
            sizes="(max-width: 1024px) 100vw, 60vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/80 via-[#0f172a]/20 to-transparent" />
          
          <div className="absolute inset-0 p-6 lg:p-8 flex flex-col justify-end">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 lg:gap-5">
              <Link
                href="/care/training"
                className="inline-flex items-center gap-2 w-fit px-6 py-3 bg-white text-slate-900 text-sm font-semibold rounded-tl-[20px] rounded-tr-[99px] rounded-bl-[99px] rounded-br-[99px] hover:bg-slate-50 transition-colors duration-200 group/btn shadow-sm flex-shrink-0"
              >
                Explore Training
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
              </Link>
              <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed max-w-sm">
                Personalized behavior coaching and positive reinforcement training from certified specialists.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default TrainingSection;
