'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  FileCheck2,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Zap,
  Percent,
  Banknote,
  Search,
} from "lucide-react";

// Minimal animation helper
const mp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.55, ease: "easeOut" as const, delay },
});

const providers = [
  {
    name: "Nationwide Exotic Care",
    logoText: "NW",
    price: "₹349",
    period: "/mo",
    highlight: false,
    coverage: "₹2.5 Lakh",
    copay: "10%",
    features: ["Accident & illness", "Exotic species care", "Diagnostic tests"],
  },
  {
    name: "ManyPets Lifetime",
    logoText: "MP",
    price: "₹699",
    period: "/mo",
    highlight: true,
    badge: "Top Rated",
    coverage: "₹5 Lakh",
    copay: "0%",
    features: ["Zero co-pay options", "Lifetime cover", "Dental coverage", "Alternative therapies"],
  },
  {
    name: "MetLife Pet Cover",
    logoText: "ML",
    price: "₹499",
    period: "/mo",
    highlight: false,
    coverage: "₹4 Lakh",
    copay: "5%",
    features: ["Multi-pet discounts", "Emergency care", "Prescription meds", "Specialist visits"],
  },
];

const links = [
  { icon: Search, label: "Compare 10+ Providers", href: "/services/insurance/compare", desc: "Find the best rates instantly" },
  { icon: FileCheck2, label: "Paperless Claims", href: "/services/insurance/claim", desc: "Direct payment to network vets" },
  { icon: BookOpen, label: "Insurance Guide", href: "/services/insurance#faq", desc: "Understand what's actually covered" },
];

const InsuranceSection = () => (
  <section id="insurance" className="relative py-24 lg:py-32 bg-background overflow-hidden">
    {/* Minimal background — simple top border */}
    <div className="absolute top-0 left-0 right-0 h-px bg-slate-100" />

    <div className="container mx-auto px-8 lg:px-20 relative z-10">
      <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">

        {/* ── Left: Copy ── */}
        <div className="space-y-8">
          <motion.div {...mp(0)}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-5">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              Insurance Marketplace
            </div>
            <h2 className="text-4xl lg:text-[3.25rem] font-bold text-slate-900 leading-[1.08] tracking-tight">
              Compare India&apos;s best
              <br />
              pet insurance.{" "}
              <span className="text-primary">Instantly.</span>
            </h2>
          </motion.div>

          <motion.p {...mp(0.1)} className="text-base lg:text-lg text-slate-500 leading-relaxed max-w-md">
            Don&apos;t let unexpected vet bills break the bank. Compare top-rated insurance providers, customize your coverage, and buy direct—all in one place.
          </motion.p>

          {/* Quick links */}
          <motion.div {...mp(0.2)} className="space-y-2.5">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="group flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-primary/20 hover:shadow-sm transition-all duration-200"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <link.icon className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-900">{link.label}</div>
                  <div className="text-xs text-slate-500">{link.desc}</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200" />
              </Link>
            ))}
          </motion.div>

          <motion.div {...mp(0.3)}>
            <Link
              href="/services/insurance"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors duration-200"
            >
              <ShieldCheck className="w-4 h-4" />
              Get Free Quotes
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </motion.div>
        </div>

        {/* ── Right: Marketplace Previews ── */}
        <div className="space-y-3">
          {providers.map((plan, i) => (
            <motion.div
              key={plan.name}
              {...mp(0.15 + i * 0.08)}
              className={`relative p-5 md:p-6 rounded-2xl border transition-colors duration-200 ${
                plan.highlight
                  ? "bg-primary/5 border-primary/20"
                  : "bg-white border-slate-100 hover:border-slate-200 shadow-sm"
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-2.5 left-5 md:left-6 px-2.5 py-0.5 rounded-full bg-primary text-white text-[10px] font-bold tracking-wide uppercase">
                  {plan.badge}
                </span>
              )}
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                {/* Provider Branding */}
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${plan.highlight ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600'}`}>
                    {plan.logoText}
                  </div>
                  <div>
                    <div className="text-slate-900 font-bold text-base">{plan.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                        <Banknote className="w-3.5 h-3.5 text-slate-400" />
                        Upto {plan.coverage}
                      </div>
                      <div className="w-1 h-1 rounded-full bg-slate-300" />
                      <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                        <Percent className="w-3.5 h-3.5 text-slate-400" />
                        {plan.copay} Co-pay
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price block */}
                <div className="flex items-baseline gap-0.5 sm:text-right">
                  <span className="text-xl font-bold text-slate-900">{plan.price}</span>
                  <span className="text-slate-500 text-xs font-medium">{plan.period}</span>
                </div>
              </div>

              {/* Feature list */}
              <div className="flex flex-wrap gap-x-4 gap-y-2 pt-3 border-t border-slate-100">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-center gap-1.5 text-[11px] md:text-xs font-medium text-slate-500">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default InsuranceSection;
