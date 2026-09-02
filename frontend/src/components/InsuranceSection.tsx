'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  FileCheck2,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Percent,
  Banknote,
  Search,
} from "lucide-react";

const mp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const, delay },
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
    features: ["Zero copay options", "Lifetime cover", "Dental coverage", "Alternative therapies"],
  },
  {
    name: "MetLife Pet Cover",
    logoText: "ML",
    price: "₹499",
    period: "/mo",
    highlight: false,
    coverage: "₹4 Lakh",
    copay: "5%",
    features: ["Multi pet discounts", "Emergency care", "Prescription meds"],
  },
];

const quickLinks = [
  { icon: Search, label: "Compare 10+ Approved Plans", href: "/services/insurance/compare" },
  { icon: FileCheck2, label: "Paperless Cashless Claims", href: "/services/insurance/claim" },
  { icon: BookOpen, label: "Coverage & Policy Guide", href: "/services/insurance" },
];

const InsuranceSection = () => (
  <section id="insurance" className="relative py-16 lg:py-24">
    <div className="container mx-auto px-6 lg:px-20">
      
      {/* ── Section Header ── */}
      <motion.div {...mp(0)} className="mb-10 lg:mb-12 max-w-none">
        <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 leading-tight tracking-[0.015em] max-w-none">
          Compare policies from top-rated pet insurance providers.
        </h2>
        <p className="text-base lg:text-lg text-slate-600 mt-2.5 max-w-none">
          A transparent marketplace to evaluate customizable coverage plans, zero copay options, and paperless cashless claims.
        </p>
      </motion.div>

      {/* Grid */}
      <div className="grid lg:grid-cols-5 gap-6 lg:gap-8">
        
        {/* Left: Dark Card */}
        <motion.div
          {...mp(0.05)}
          className="lg:col-span-2 bg-[#0f172a] rounded-tl-[0.75rem] rounded-tr-[2rem] rounded-br-[2rem] rounded-bl-[2rem] p-8 lg:p-10 flex flex-col justify-between min-h-[420px] shadow-sm"
        >
          <div>
            <h3 className="text-3xl lg:text-4xl font-bold text-white leading-tight mb-4">
              Compare & save on pet insurance.
            </h3>
            <p className="text-sm lg:text-base text-slate-300 leading-relaxed max-w-sm mb-8">
              Don&apos;t let unexpected vet bills break the bank. Customize deductible options and get instant paperless approval.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 mb-8">
            {quickLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="group/link flex items-center gap-3 px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-200"
              >
                <link.icon className="w-4.5 h-4.5 text-primary flex-shrink-0" />
                <span className="text-sm font-medium text-slate-200 group-hover/link:text-white transition-colors">{link.label}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover/link:text-primary group-hover/link:translate-x-1 ml-auto transition-all duration-200" />
              </Link>
            ))}
          </div>

          <Link
            href="/services/insurance"
            className="inline-flex items-center gap-2 w-fit px-6 py-3 bg-primary text-slate-900 text-sm font-semibold rounded-tl-[99px] rounded-bl-[99px] rounded-br-[99px] rounded-tr-[20px] hover:bg-primary/90 transition-colors duration-200 group/btn shadow-md"
          >
            <ShieldCheck className="w-4 h-4 text-slate-900" />
            <span className="text-slate-900 font-semibold">Get Free Instant Quotes</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1 text-slate-900" />
          </Link>
        </motion.div>

        {/* Right: Provider Comparison Cards */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          {providers.map((plan, i) => (
            <motion.div
              key={plan.name}
              {...mp(0.1 + i * 0.08)}
              className={`relative p-6 border transition-all duration-200 ${
                plan.highlight
                  ? "bg-white border-primary/40 rounded-tl-[1.75rem] rounded-tr-[0.5rem] rounded-br-[1.75rem] rounded-bl-[1.75rem] shadow-xs"
                  : "bg-white border-slate-200/80 rounded-tl-[0.5rem] rounded-tr-[1.75rem] rounded-br-[1.75rem] rounded-bl-[1.75rem] hover:border-slate-300 shadow-xs hover:shadow-sm"
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-2.5 left-6 px-3 py-0.5 rounded-full bg-primary text-white text-[10px] font-bold tracking-wide uppercase">
                  {plan.badge}
                </span>
              )}
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3.5">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm ${plan.highlight ? 'bg-primary text-white' : 'bg-secondary text-slate-700'}`}>
                    {plan.logoText}
                  </div>
                  <div>
                    <div className="text-slate-900 font-bold text-base">{plan.name}</div>
                    <div className="flex items-center gap-2.5 mt-0.5">
                      <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                        <Banknote className="w-3.5 h-3.5 text-slate-400" />
                        Up to {plan.coverage}
                      </div>
                      <div className="w-1 h-1 rounded-full bg-slate-300" />
                      <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                        <Percent className="w-3.5 h-3.5 text-slate-400" />
                        {plan.copay} Copay
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-slate-900">{plan.price}</span>
                  <span className="text-slate-500 text-xs font-medium">{plan.period}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-2 pt-3 border-t border-slate-100">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
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
