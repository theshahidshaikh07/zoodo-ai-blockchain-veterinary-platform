'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { Globe, ArrowRight, Plane, Car, FileCheck2, Shield, Hotel } from "lucide-react";

const mp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const, delay },
});

const travelPillars = [
  {
    icon: Car,
    title: "Domestic Pet Transport",
    description: "Door to door AC pet taxis, intercity shuttles, and Indian Railways AC First Class coupe booking assistance.",
    chips: [
      { icon: Car, label: "AC Pet Taxis" },
      { icon: FileCheck2, label: "Train AC Coupe Booking" },
    ],
    href: "/services/travel/domestic",
    linkText: "Explore Transport",
  },
  {
    icon: Hotel,
    title: "Pet Friendly Hotels & Stays",
    description: "Discover and book verified pet welcoming hotels, luxury resorts, boutique homestays, and trusted boarding.",
    chips: [
      { icon: Hotel, label: "Verified Pet Hotels" },
      { icon: Hotel, label: "Resorts & Boarding" },
    ],
    href: "/services/travel/stays",
    linkText: "Explore Pet Stays",
  },
  {
    icon: Globe,
    title: "International Relocation",
    description: "End to end relocation management: ISO microchipping, FAVN rabies titering, AQCS NOC, and IATA crates.",
    chips: [
      { icon: Plane, label: "IATA Sky Crates" },
      { icon: Shield, label: "AQCS Export NOC" },
    ],
    href: "/services/travel/international",
    linkText: "Explore Relocation",
  },
];

const TravelSection = () => (
  <section id="travel" className="relative py-16 lg:py-24">
    <div className="container mx-auto px-6 lg:px-20">
      
      {/* ── Section Header ── */}
      <motion.div {...mp(0)} className="mb-10 lg:mb-12 max-w-none">
        <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 leading-tight tracking-[0.015em] max-w-none">
          Compare & book pet travel, stays & relocation providers.
        </h2>
        <p className="text-base lg:text-lg text-slate-600 mt-2.5 max-w-none">
          A trusted marketplace connecting pet parents with verified AC pet taxis, pet friendly hotel & resort bookings, train coupe agents, and international airline logistics.
        </p>
      </motion.div>

      {/* 3-Column Solid Carbon Navy Card */}
      <motion.div
        {...mp(0.05)}
        className="relative overflow-hidden bg-[#0f172a] rounded-tl-[2rem] rounded-tr-[1rem] rounded-br-[2rem] rounded-bl-[2rem] shadow-md border border-slate-800"
      >
        <div className="relative z-10 grid lg:grid-cols-3">
          {travelPillars.map((pillar, index) => (
            <motion.div
              key={pillar.title}
              {...mp(0.08 + index * 0.04)}
              className={`p-8 lg:p-10 xl:p-12 flex flex-col justify-between ${
                index < 2 ? "border-b lg:border-b-0 lg:border-r border-slate-800" : ""
              }`}
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-6">
                  <pillar.icon className="w-6 h-6 text-primary" />
                </div>

                <h3 className="text-xl lg:text-2xl font-bold text-white leading-tight mb-3">
                  {pillar.title}
                </h3>
                <p className="text-xs lg:text-sm text-slate-300 leading-relaxed mb-6">
                  {pillar.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-8">
                  {pillar.chips.map((chip) => (
                    <div
                      key={chip.label}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs font-medium text-slate-200"
                    >
                      <chip.icon className="w-3.5 h-3.5 text-primary" />
                      {chip.label}
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href={pillar.href}
                className="inline-flex items-center gap-2 w-fit px-5 py-2.5 bg-white text-slate-900 text-xs lg:text-sm font-semibold rounded-tl-[20px] rounded-tr-[99px] rounded-bl-[99px] rounded-br-[99px] hover:bg-slate-50 transition-colors duration-200 group/btn shadow-sm"
              >
                {pillar.linkText}
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-1" />
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="absolute top-6 right-8 lg:top-10 lg:right-14 opacity-[0.05] pointer-events-none">
          <Plane className="w-24 h-24 lg:w-36 lg:h-36 text-white rotate-[-15deg]" />
        </div>
      </motion.div>
    </div>
  </section>
);

export default TravelSection;
