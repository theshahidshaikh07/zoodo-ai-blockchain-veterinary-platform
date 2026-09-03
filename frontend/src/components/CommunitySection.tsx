'use client';

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Heart,
  Home,
  Megaphone,
  MessageCircle,
  Calendar,
  Building2,
  ArrowRight,
} from "lucide-react";
import communityPets from "@/assets/community.png";

const mp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const, delay },
});

const communityFeatures = [
  {
    icon: Heart,
    title: "Pet Adoption",
    description: "Connect with verified shelter pets and rescues looking for forever homes.",
    href: "/community/adoption",
  },
  {
    icon: Home,
    title: "Lost & Found Alerts",
    description: "Instant community-wide geolocation alerts to swiftly reunite lost pets with families.",
    href: "/community/lost-and-found",
  },
  {
    icon: Megaphone,
    title: "Medical Rescue Fundraising",
    description: "Crowdfund emergency medical treatments and support local animal welfare causes.",
    href: "/community/fundraising",
  },
  {
    icon: Calendar,
    title: "Events & Local Meetups",
    description: "Discover pet friendly playdates, adoption drives, and wellness workshops near you.",
    href: "/community/events",
  },
  {
    icon: Building2,
    title: "NGOs & Verified Shelters",
    description: "Partner with accredited animal welfare organizations, foster networks, and sanctuaries.",
    href: "/community/ngos",
  },
  {
    icon: MessageCircle,
    title: "Pet Parent Forums",
    description: "Ask questions, share advice, and connect with experienced pet parents and experts.",
    href: "/community/discussion",
  },
];

const CommunitySection = () => {
  return (
    <section id="community" className="relative py-16 lg:py-24">
      <div className="container mx-auto px-6 lg:px-20">
        
        {/* ── Section Header ── */}
        <motion.div {...mp(0)} className="mb-10 lg:mb-12 text-left max-w-none">
          <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 leading-tight tracking-[0.015em] max-w-none">
            Every pet deserves a loving home and a dedicated community.
          </h2>
          <p className="text-base lg:text-lg text-slate-600 mt-2.5 max-w-none">
            Connecting pet parents, accredited shelters, and rescuers for adoptions, 24/7 lost & found alerts, and medical fundraising.
          </p>
        </motion.div>

        {/* ── Top Full-Width Panoramic Hero Card ── */}
        <motion.div
          {...mp(0.05)}
          className="group relative overflow-hidden rounded-tl-[1rem] rounded-tr-[2.5rem] rounded-br-[2.5rem] rounded-bl-[2.5rem] min-h-[380px] lg:min-h-[440px] shadow-xs border border-slate-200/50 bg-slate-100 flex flex-col justify-end mb-6 lg:mb-8"
        >
          <Image
            src={communityPets}
            alt="Community pet owners with happy dogs"
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
            sizes="(max-width: 1280px) 100vw, 1200px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
          
          <div className="relative z-10 p-6 lg:p-10 max-w-4xl">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 lg:gap-6">
              <Link
                href="/community/adoption"
                className="inline-flex items-center gap-2 w-fit px-6 py-3 bg-primary text-slate-900 text-sm font-semibold rounded-tl-[99px] rounded-bl-[99px] rounded-br-[99px] rounded-tr-[20px] hover:bg-primary/90 transition-colors duration-200 group/btn shadow-sm flex-shrink-0"
              >
                Explore Community
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1 text-slate-900" />
              </Link>
              <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed max-w-md">
                Join thousands of dedicated animal lovers working together to save lives, find forever homes, and foster shelter animals.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Separate Horizontal Row Cards (Compact on mobile, Spacious on desktop) ── */}
        <div className="flex flex-col gap-2.5 sm:gap-3 lg:gap-3.5">
          {communityFeatures.map((feature, i) => (
            <motion.div key={feature.title} {...mp(0.08 + i * 0.03)}>
              <Link
                href={feature.href}
                className="group/row flex items-center justify-between p-3.5 sm:p-5 lg:p-6 bg-white rounded-xl sm:rounded-tl-[1rem] sm:rounded-tr-[1.75rem] sm:rounded-br-[1.75rem] sm:rounded-bl-[1.75rem] border border-slate-200/80 hover:border-slate-300 shadow-xs hover:shadow-sm transition-all duration-200 gap-3 sm:gap-4"
              >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-primary" />
                  </div>
                  
                  <div className="min-w-0 flex-1 md:flex md:items-center md:justify-between md:gap-4">
                    <h4 className="text-sm sm:text-lg lg:text-xl font-bold text-slate-900 leading-tight md:min-w-[240px]">
                      {feature.title}
                    </h4>
                    <p className="text-xs sm:text-sm lg:text-base text-slate-500 sm:text-slate-600 leading-snug sm:leading-relaxed max-w-2xl line-clamp-1 md:line-clamp-none mt-0.5 md:mt-0 md:flex-1">
                      {feature.description}
                    </p>
                  </div>
                </div>

                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5] text-slate-400 group-hover/row:text-primary group-hover/row:translate-x-1 sm:group-hover/row:translate-x-1.5 transition-all duration-200 flex-shrink-0 ml-1 sm:ml-2" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;