'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, User, Building2, Sparkles, CheckCircle2, ShieldCheck, Heart, Stethoscope, Scissors, GraduationCap, ShoppingBag, Users2 } from 'lucide-react';

export default function RoleSelectionPage() {
  const [hoveredRole, setHoveredRole] = useState<'personal' | 'business' | null>(null);

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-black relative overflow-hidden flex flex-col justify-between selection:bg-primary/20 selection:text-primary">
      {/* Background Decorative Mesh Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-[#bde4e9]/60 via-primary/5 to-transparent blur-3xl opacity-70 pointer-events-none -z-0" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#bde4e9]/40 rounded-full blur-3xl opacity-50 pointer-events-none -z-0" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50 pointer-events-none -z-0" />

      {/* Header Bar */}
      <header className="relative z-20 container mx-auto px-6 lg:px-16 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center group transition-transform duration-300 hover:scale-105">
          <Image
            src="/pacifico-zoodo.png"
            alt="Zoodo"
            width={140}
            height={45}
            className="h-7 md:h-8 w-auto"
            priority
          />
        </Link>
        <Link
          href="/"
          className="flex items-center space-x-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-white/60 dark:bg-slate-900/60 backdrop-blur-md px-4 py-2 rounded-full border border-slate-200/60 dark:border-slate-800 shadow-sm transition-all duration-300 hover:shadow"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </header>

      {/* Main Content Container */}
      <main className="relative z-10 container mx-auto px-6 lg:px-16 py-8 md:py-12 flex-1 flex flex-col justify-center items-center">
        <div className="max-w-4xl w-full text-center space-y-4 mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#bde4e9]/50 dark:bg-primary/10 border border-primary/20 text-slate-800 dark:text-primary text-xs md:text-sm font-medium shadow-sm">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Welcome to the Zoodo Ecosystem</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            How would you like to join <span className="text-primary">Zoodo</span>?
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg max-w-xl mx-auto font-normal">
            Choose your account type below to get a personalized dashboard tailored to your needs.
          </p>
        </div>

        {/* 2 Choice Apple-Style Cards */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-10 max-w-4xl w-full">
          {/* Personal Account Card */}
          <Link
            href="/register/personal"
            onMouseEnter={() => setHoveredRole('personal')}
            onMouseLeave={() => setHoveredRole(null)}
            className="group relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 lg:p-10 shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col justify-between overflow-hidden hover:-translate-y-1.5 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {/* Ambient Background Gradient on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#bde4e9]/30 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

            <div>
              {/* Header Icon Badge */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 rounded-2xl bg-[#bde4e9]/60 dark:bg-primary/20 flex items-center justify-center text-slate-900 dark:text-white group-hover:scale-110 transition-transform duration-500 shadow-inner">
                  <User className="w-8 h-8 text-slate-800 dark:text-primary" />
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  Individual
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Personal Account
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base mb-6">
                For pet owners, parents & animal lovers looking for seamless care and services.
              </p>

              {/* Feature Checklist */}
              <div className="space-y-3 mb-8 text-left">
                <div className="flex items-center space-x-3 text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Digital Pet Health Passports</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Book Vets, Groomers & Trainers</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Access Adoption & Community Forums</span>
                </div>
              </div>
            </div>

            {/* Action CTA Button */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800/80">
              <span className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                Create Personal Account
              </span>
              <div className="w-10 h-10 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center group-hover:bg-primary group-hover:text-slate-900 transition-all duration-300 shadow-md">
                <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Business Account Card */}
          <Link
            href="/register/business"
            onMouseEnter={() => setHoveredRole('business')}
            onMouseLeave={() => setHoveredRole(null)}
            className="group relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 lg:p-10 shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col justify-between overflow-hidden hover:-translate-y-1.5 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {/* Ambient Background Gradient on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-[#bde4e9]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

            <div>
              {/* Header Icon Badge */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center text-slate-900 dark:text-white group-hover:scale-110 transition-transform duration-500 shadow-inner">
                  <Building2 className="w-8 h-8 text-primary" />
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                  Professional / Business
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Business Account
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base mb-6">
                For Vets, Groomers, Trainers, Clinics, Insurance Partners, Shops & NGOs.
              </p>

              {/* Supported Industry Chips */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
                  <Stethoscope className="w-3 h-3 text-sky-500" /> Vets & Clinics
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
                  <Scissors className="w-3 h-3 text-purple-500" /> Groomers & Spas
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
                  <GraduationCap className="w-3 h-3 text-amber-500" /> Trainers
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
                  <ShieldCheck className="w-3 h-3 text-emerald-500" /> Insurance Providers
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
                  <ShoppingBag className="w-3 h-3 text-rose-500" /> Shop & Pharma
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
                  <Users2 className="w-3 h-3 text-indigo-500" /> NGOs & Shelters
                </span>
              </div>
            </div>

            {/* Action CTA Button */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800/80">
              <span className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                Create Business Account
              </span>
              <div className="w-10 h-10 rounded-full bg-primary text-slate-900 flex items-center justify-center transition-all duration-300 shadow-md group-hover:scale-105">
                <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        © 2026 Zoodo Platform. All rights reserved.
      </footer>
    </div>
  );
}
