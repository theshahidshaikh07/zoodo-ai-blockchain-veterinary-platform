'use client';

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Dog,
  Target,
  HeartHandshake,
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
    icon: Dog,
    label: "Early Development & Puppy Care",
    desc: "Socialization, housebreaking, and foundation skills for young pets",
    href: "/services/find-trainers?specialty=early-development",
  },
  {
    icon: Target,
    label: "Obedience & Skill Building",
    desc: "Leash manners, recall, obedience, and positive reinforcement",
    href: "/services/find-trainers?specialty=basic-training",
  },
  {
    icon: HeartHandshake,
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
          From puppy socialization and leash manners to advanced behavior therapy from verified positive reinforcement specialists.
        </p>
      </motion.div>

      {/* Bento Grid: Reversed layout */}
      <div className="grid lg:grid-cols-5 gap-5 lg:gap-6 items-start">
        
        {/* Left: 3 Stacked Cards (2 cols) + Centered Explore Training Link */}
        <div className="lg:col-span-2 flex flex-col gap-4 lg:gap-5 order-2 lg:order-1">
          {quickActions.map((action, i) => (
            <motion.div key={action.label} {...mp(0.1 + i * 0.08)}>
              <Link
                href={action.href}
                className="group/card flex items-center justify-between p-5 lg:p-6 bg-white rounded-tl-[0.5rem] rounded-tr-[2rem] rounded-br-[2rem] rounded-bl-[2rem] border border-slate-200/80 hover:border-slate-300 shadow-xs hover:shadow-sm transition-all duration-200"
              >
                <div className="flex items-start gap-4 flex-1 min-w-0 pr-3">
                  <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                    <action.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-base font-bold text-slate-900 mb-1">
                      {action.label}
                    </div>
                    <div className="text-xs text-slate-600 leading-relaxed">
                      {action.desc}
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover/card:text-primary group-hover/card:translate-x-1 transition-all duration-200 flex-shrink-0" />
              </Link>
            </motion.div>
          ))}

          {/* Plain Middle 'Explore Training Programs' Text Link */}
          <motion.div {...mp(0.35)} className="pt-2 flex justify-center">
            <Link
              href="/care/training"
              className="inline-flex items-center gap-2 text-base font-bold text-slate-900 group/link"
            >
              <span>Explore Training Programs</span>
              <ArrowRight className="w-4 h-4 text-primary transition-transform duration-200 group-hover/link:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        {/* Right: Large Feature Card (3 cols) - 100% Clean Image */}
        <motion.div
          {...mp(0.05)}
          className="lg:col-span-3 group relative overflow-hidden rounded-tl-[2.5rem] rounded-tr-[0.75rem] rounded-br-[2.5rem] rounded-bl-[2.5rem] min-h-[380px] lg:min-h-[460px] shadow-xs border border-slate-200/50 bg-slate-100 order-1 lg:order-2"
        >
          <Image
            src={trainingImg}
            alt="Professional trainer working with a dog"
            fill
            quality={95}
            priority
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
            sizes="(max-width: 1024px) 100vw, 60vw"
          />
        </motion.div>
      </div>
    </div>
  </section>
);

export default TrainingSection;
