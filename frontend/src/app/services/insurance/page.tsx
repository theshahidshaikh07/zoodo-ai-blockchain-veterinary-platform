'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  FileCheck2,
  ArrowRight,
  CheckCircle2,
  Search,
  Sparkles,
  HelpCircle,
  TrendingUp,
  Cpu,
  ArrowUpRight,
  ShieldAlert,
  Coins
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { insuranceDatabase } from './data';
import CustomSelect from '@/components/ui/custom-select';
import BetaDisclaimerBanner from '@/components/BetaDisclaimerBanner';

const petClasses = [
  { id: 'canine', label: 'Canine (Dogs)' },
  { id: 'feline', label: 'Feline (Cats)' },
  { id: 'avian', label: 'Avian (Birds)' },
  { id: 'reptilian', label: 'Reptilian (Reptiles)' },
  { id: 'pocket', label: 'Pocket Pets (Rabbits, Ferrets)' },
  { id: 'equine', label: 'Equine (Horses & Large Pets)' }
] as const;

export default function InsuranceLandingPage() {
  // Quoting widget state
  const [petClass, setPetClass] = useState<typeof petClasses[number]['id']>('canine');
  const [petAge, setPetAge] = useState<number>(3);
  const [petBreed, setPetBreed] = useState<string>('Golden Retriever');
  const [coverageLimit, setCoverageLimit] = useState<number>(400000);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [hasCalculated, setHasCalculated] = useState<boolean>(false);

  // Buy direct modal state
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState<boolean>(false);
  const [isBuySuccess, setIsBuySuccess] = useState<boolean>(false);

  // Claim simulator slider state
  const [treatmentCost, setTreatmentCost] = useState<number>(45000);
  const [copay, setCopay] = useState<number>(10); // %
  const [deductible, setDeductible] = useState<number>(2500); // INR

  // Sync default breed placeholder when pet type changes
  useEffect(() => {
    if (petClass === 'canine') setPetBreed('Golden Retriever');
    else if (petClass === 'feline') setPetBreed('Persian Cat');
    else if (petClass === 'avian') setPetBreed('African Grey Parrot');
    else if (petClass === 'reptilian') setPetBreed('Bearded Dragon');
    else if (petClass === 'pocket') setPetBreed('Rex Rabbit');
    else if (petClass === 'equine') setPetBreed('Thoroughbred');
  }, [petClass]);

  // Calculate dynamic premiums based on international standards and risk matrices
  const calculatePremium = (basePrice: number) => {
    let multiplier = 1.0;

    // Pet type multiplier
    if (petClass === 'feline') multiplier *= 0.85;
    else if (petClass === 'avian') multiplier *= 0.60;
    else if (petClass === 'reptilian') multiplier *= 0.65;
    else if (petClass === 'pocket') multiplier *= 0.70;
    else if (petClass === 'equine') multiplier *= 2.10;
    else multiplier *= 1.0; // canine

    // Age multiplier
    if (petAge <= 1) multiplier *= 0.80;
    else if (petAge <= 3) multiplier *= 1.0;
    else if (petAge <= 6) multiplier *= 1.25;
    else if (petAge <= 10) multiplier *= 1.60;
    else multiplier *= 1.95;

    // Coverage limit multiplier
    if (coverageLimit === 250000) multiplier *= 0.85;
    else if (coverageLimit === 500000) multiplier *= 1.22;

    return Math.round(basePrice * multiplier);
  };

  const planList = insuranceDatabase.slice(0, 3);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);
    setTimeout(() => {
      setIsCalculating(false);
      setHasCalculated(true);
      const plansSection = document.getElementById('marketplace-plans');
      if (plansSection) {
        plansSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 900);
  };

  // Reinsurance math
  const calculatedDeductible = Math.min(treatmentCost, deductible);
  const remainingAfterDeductible = Math.max(0, treatmentCost - calculatedDeductible);
  const calculatedCopay = remainingAfterDeductible * (copay / 100);
  const insurancePays = Math.max(0, remainingAfterDeductible - calculatedCopay);
  const youPay = calculatedDeductible + calculatedCopay;

  const handleBuyPlan = (plan: any) => {
    setSelectedPlan(plan);
    setIsBuyModalOpen(true);
    setIsBuySuccess(false);
  };

  const executeMockPurchase = () => {
    setIsCalculating(true);
    setTimeout(() => {
      setIsCalculating(false);
      setIsBuySuccess(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden font-sans relative">
      {/* Unified Zoodo Grid & Light Pattern Background */}
      <div className="fixed inset-0 bg-[image:var(--bg-subtle-mesh)] pointer-events-none opacity-90 z-0" />
      <div className="fixed inset-0 bg-[image:var(--bg-dot-pattern)] bg-[length:24px_24px] pointer-events-none opacity-50 [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)] z-0" />
      <div className="fixed inset-0 bg-slate-50/40 dark:bg-transparent pointer-events-none z-0" />

      <div className="relative z-10">
        <Header />

        <main className="pt-24 lg:pt-28">
          
          {/* HERO SECTION WITH QUOTE FORM */}
          <section className="container mx-auto px-8 lg:px-20 py-12 lg:py-20">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              
              {/* Left Content */}
              <div className="lg:col-span-7 space-y-6">
                <BetaDisclaimerBanner category="insurance providers" />
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05] text-foreground">
                  Protect Every Pet.<br />
                  <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                    Automated Claims.
                  </span>
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
                  Compare direct policies for dogs, cats, avian, and exotic species. Experience instant cashless clinic payouts that remove the stress of claim filing.
                </p>
                
                {/* Quick Perks */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-4">
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-foreground">₹0</div>
                    <div className="text-sm text-muted-foreground">Deductible options available</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-primary">24 Hours</div>
                    <div className="text-sm text-muted-foreground">Fast digital processing</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-primary/90">100%</div>
                    <div className="text-sm text-muted-foreground">Paperless digital approvals</div>
                  </div>
                </div>
              </div>

              {/* Quoting Widget Card */}
              <div className="lg:col-span-5">
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="glass-card shadow-card rounded-3xl border border-border/80 p-6 sm:p-8 bg-card/60 dark:bg-card/30 backdrop-blur-md relative"
                >
                  <div className="absolute -top-3.5 right-6 bg-emerald-500 text-white font-bold text-[10px] uppercase tracking-wider px-3.5 py-1.5 rounded-xl flex items-center gap-1 shadow-md">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified Rates
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-6">Get Instant Free Quotes</h3>
                  
                  <form onSubmit={handleCalculate} className="space-y-5">
                    
                    {/* Pet Type Select */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                        Pet Class
                      </label>
                      <CustomSelect
                        options={petClasses.map(p => ({ value: p.id, label: p.label }))}
                        value={petClass}
                        onChange={(val) => setPetClass(val as any)}
                        className="h-12 rounded-xl border-border bg-background"
                      />
                    </div>

                    {/* Breed Input */}
                    <div>
                      <label htmlFor="breed" className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                        Pet Breed / Species
                      </label>
                      <input
                        id="breed"
                        type="text"
                        placeholder="e.g. Golden Retriever, Hamster..."
                        value={petBreed}
                        onChange={(e) => setPetBreed(e.target.value)}
                        className="w-full h-12 px-4 rounded-xl border border-border bg-background text-foreground text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none"
                      />
                    </div>

                    {/* Age Slider */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Pet Age
                        </label>
                        <span className="text-sm font-bold text-foreground bg-muted px-2 py-0.5 rounded-md">
                          {petAge} {petAge === 1 ? 'Year' : 'Years'}
                        </span>
                      </div>
                      <div className="pt-2 px-1">
                        <Slider
                          min={1}
                          max={15}
                          step={1}
                          value={[petAge]}
                          onValueChange={(val) => setPetAge(val[0])}
                          className="py-1"
                        />
                      </div>
                    </div>

                    {/* Coverage Limit Dropdown */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                        Annual Coverage Limit
                      </label>
                      <CustomSelect
                        options={[
                          { value: '250000', label: '₹2.5 Lakh (Essential)' },
                          { value: '400000', label: '₹4.0 Lakh (Standard)' },
                          { value: '500000', label: '₹5.0 Lakh (Premium / Uncapped)' }
                        ]}
                        value={String(coverageLimit)}
                        onChange={(val) => setCoverageLimit(Number(val))}
                        className="h-12 rounded-xl border-border bg-background"
                      />
                    </div>

                    {/* Submit button */}
                    <Button
                      type="submit"
                      disabled={isCalculating}
                      className="w-full h-13 mt-2 rounded-2xl bg-primary hover:bg-primary/95 text-white font-bold hover:shadow-lg transition-all text-base flex items-center justify-center gap-2"
                    >
                      {isCalculating ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Fetching Marketplace Deals...
                        </>
                      ) : (
                        <>
                          Compare Quotes <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </Button>
                  </form>
                </motion.div>
              </div>

            </div>
          </section>

          {/* COMPARISON LINKS OR HIGHLIGHTS */}
          <section className="border-y border-border/80 py-10 bg-card/10 backdrop-blur-sm">
            <div className="container mx-auto px-8 lg:px-20">
              <div className="grid md:grid-cols-3 gap-8">
                <Link href="/services/insurance/compare" className="group flex items-start gap-4 p-5 rounded-2xl hover:bg-accent/40 transition-all">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                    <Search className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                      Compare Policies <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">Deep analysis across coverage categories and direct policy limits.</p>
                  </div>
                </Link>

                <Link href="/services/insurance/claim" className="group flex items-start gap-4 p-5 rounded-2xl hover:bg-accent/40 transition-all">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                    <Coins className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                      Claims Support Portal <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">Submit digital medical receipts and view recent cashless claim payout records.</p>
                  </div>
                </Link>

                <a href="#claim-calculator" className="group flex items-start gap-4 p-5 rounded-2xl hover:bg-accent/40 transition-all">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                      Reimbursement Estimator <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">Input customized bill details to preview estimated out-of-pocket veterinary costs.</p>
                  </div>
                </a>
              </div>
            </div>
          </section>

          {/* MARKETPLACE PLANS LIST */}
          <section id="marketplace-plans" className="container mx-auto px-8 lg:px-20 py-20 lg:py-28 scroll-mt-20">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
              <h2 className="text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight">
                Compare Tailored Policies
              </h2>
              <p className="text-muted-foreground">
                {hasCalculated 
                  ? `Showing dynamic premium rates calculated for a ${petAge}-year-old ${petBreed} with up to ${coverageLimit === 500000 ? '₹5.0 Lakh' : coverageLimit === 400000 ? '₹4.0 Lakh' : '₹2.5 Lakh'} annual limit.`
                  : "Top recommended pet insurance policies. Modify the quote inputs above to personalize rates."
                }
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {planList.map((plan) => {
                const currentPrice = calculatePremium(plan.basePrice);

                return (
                  <Card 
                    key={plan.id}
                    className={`relative flex flex-col p-6 rounded-3xl border transition-all duration-300 bg-card/40 dark:bg-card/20 backdrop-blur-sm ${
                      plan.highlight
                        ? 'border-primary shadow-xl shadow-primary/5 bg-gradient-to-b from-primary/5 to-card/40 hover:shadow-2xl hover:shadow-primary/10'
                        : 'border-border/80 shadow-md hover:border-primary/50'
                    }`}
                  >
                    {plan.badge && (
                      <span className="absolute -top-3 left-6 px-3.5 py-1 rounded-full bg-primary text-white text-[11px] font-extrabold tracking-wider uppercase shadow-md">
                        {plan.badge}
                      </span>
                    )}

                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold text-white text-base ${plan.color}`}>
                        {plan.logoText}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-base text-foreground leading-tight">{plan.name}</h3>
                        <div className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mt-1">Verified Partner</div>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="mb-5">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-extrabold text-foreground">₹{currentPrice}</span>
                        <span className="text-muted-foreground text-sm font-semibold">/month</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1.5">Includes taxes & dynamic policy calculations</p>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                      {plan.description}
                    </p>

                    {/* Quick specs */}
                    <div className="grid grid-cols-2 gap-y-3 gap-x-2 py-4 border-y border-border/60 text-xs font-semibold text-muted-foreground mb-6 bg-muted/20 px-4 rounded-2xl">
                      <div className="flex flex-col">
                        <span className="text-muted-foreground font-medium">Limit:</span>
                        <span className="text-foreground">{hasCalculated ? `₹${coverageLimit/100000} Lakh` : plan.coverage}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-muted-foreground font-medium">Co-pay:</span>
                        <span className="text-foreground">{plan.copay}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-muted-foreground font-medium">Deductible:</span>
                        <span className="text-foreground">{plan.deductible}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-muted-foreground font-medium">Claim Speed:</span>
                        <span className="text-foreground flex items-center gap-1">
                          <Cpu className="w-3.5 h-3.5 text-primary" />
                          {plan.claimSpeed}
                        </span>
                      </div>
                    </div>

                    {/* Features list */}
                    <div className="space-y-3 flex-1 mb-8">
                      <div className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Included Coverage</div>
                      {plan.features.map((f) => (
                        <div key={f} className="flex items-start gap-2.5 text-sm text-muted-foreground font-medium">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                          {f}
                        </div>
                      ))}
                      <div className="text-xs font-bold text-muted-foreground uppercase tracking-wide pt-2">Exclusions</div>
                      {plan.exclusions.map((e) => (
                        <div key={e} className="flex items-start gap-2.5 text-xs text-muted-foreground font-medium">
                          <ShieldAlert className="w-4 h-4 text-muted-foreground/60 flex-shrink-0 mt-0.5" />
                          {e}
                        </div>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                      <Button 
                        onClick={() => handleBuyPlan(plan)}
                        className={`w-full h-12 rounded-xl font-bold transition-all text-sm ${
                          plan.highlight 
                            ? 'bg-primary text-white hover:bg-primary/90 shadow-md'
                            : 'bg-muted text-foreground hover:bg-muted/80'
                        }`}
                      >
                        Instant Purchase
                      </Button>
                      <Link 
                        href={`/services/insurance/compare?plan=${plan.id}`}
                        className="block text-center text-xs font-semibold text-muted-foreground hover:text-primary transition-colors py-1"
                      >
                        Compare full details
                      </Link>
                    </div>

                  </Card>
                );
              })}
            </div>
          </section>

          {/* CLAIM REIMBURSEMENT CALCULATOR */}
          <section id="claim-calculator" className="border-y border-border/80 py-20 lg:py-28 bg-card/10 backdrop-blur-sm">
            <div className="container mx-auto px-8 lg:px-20">
              <div className="grid lg:grid-cols-12 gap-16 items-center">
                
                {/* Left Column: Interactive math */}
                <div className="lg:col-span-6 space-y-8">
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
                      Reimbursement Math
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight">
                      How much will your policy pay back?
                    </h2>
                    <p className="text-muted-foreground">
                      Use our interactive slider to test common clinical bill costs. See exactly how co-pays and deductibles distribute out-of-pocket fees.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Slider 1: Bill Cost */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-bold text-muted-foreground">Veterinary Bill Amount</span>
                        <span className="text-base font-extrabold text-foreground bg-muted px-3 py-1 rounded-lg">
                          ₹{treatmentCost.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <Slider
                        min={5000}
                        max={150000}
                        step={5000}
                        value={[treatmentCost]}
                        onValueChange={(val) => setTreatmentCost(val[0])}
                        className="py-2"
                      />
                      <div className="flex justify-between text-[11px] text-muted-foreground font-semibold">
                        <span>₹5,000</span>
                        <span>₹50,000</span>
                        <span>₹1,00,000</span>
                        <span>₹1,50,000</span>
                      </div>
                    </div>

                    {/* Select Toggles for Copay and Deductible */}
                    <div className="grid sm:grid-cols-2 gap-6">
                      {/* Copay */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Co-pay Ratio</label>
                        <div className="grid grid-cols-3 gap-2">
                          {[0, 10, 20].map((c) => (
                            <button
                              key={c}
                              onClick={() => setCopay(c)}
                              className={`py-2 rounded-xl border font-bold text-xs transition-all bg-background ${
                                copay === c 
                                  ? 'border-primary bg-primary/10 text-primary' 
                                  : 'border-border text-muted-foreground hover:border-primary/50'
                              }`}
                            >
                              {c}%
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Deductible */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Deductible Limit</label>
                        <div className="grid grid-cols-3 gap-2">
                          {[0, 1500, 2500].map((d) => (
                            <button
                              key={d}
                              onClick={() => setDeductible(d)}
                              className={`py-2 rounded-xl border font-bold text-xs transition-all bg-background ${
                                deductible === d 
                                  ? 'border-primary bg-primary/10 text-primary' 
                                  : 'border-border text-muted-foreground hover:border-primary/50'
                              }`}
                            >
                              ₹{d}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Visual Statement */}
                <div className="lg:col-span-6">
                  <Card className="p-8 rounded-3xl border border-border/80 bg-card/60 dark:bg-card/30 backdrop-blur-md shadow-inner space-y-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/10 to-transparent pointer-events-none" />
                    
                    <h3 className="text-lg font-bold text-foreground">Estimated Cost Breakdown</h3>
                    
                    <div className="space-y-4">
                      
                      {/* Bill summary row */}
                      <div className="flex justify-between items-center text-sm py-2 border-b border-border/50">
                        <span className="text-muted-foreground font-medium">Total Incurred Bill:</span>
                        <span className="text-foreground font-bold">₹{treatmentCost.toLocaleString('en-IN')}</span>
                      </div>

                      {/* Deductible Row */}
                      <div className="flex justify-between items-center text-sm py-2 border-b border-border/50">
                        <span className="text-muted-foreground font-medium flex items-center gap-1.5">
                          Policy Deductible:
                          <HelpCircle className="w-3.5 h-3.5 text-muted-foreground/60 cursor-pointer hover:text-primary" />
                        </span>
                        <span className="text-muted-foreground font-semibold">- ₹{calculatedDeductible.toLocaleString('en-IN')}</span>
                      </div>

                      {/* Copay row */}
                      <div className="flex justify-between items-center text-sm py-2 border-b border-border/50">
                        <span className="text-muted-foreground font-medium flex items-center gap-1.5">
                          Selected Co-pay ({copay}%):
                          <HelpCircle className="w-3.5 h-3.5 text-muted-foreground/60 cursor-pointer hover:text-primary" />
                        </span>
                        <span className="text-muted-foreground font-semibold">- ₹{Math.round(calculatedCopay).toLocaleString('en-IN')}</span>
                      </div>

                      {/* Result blocks */}
                      <div className="grid grid-cols-2 gap-4 pt-4">
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 text-center">
                          <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">Insurance Pays</div>
                          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                            ₹{Math.round(insurancePays).toLocaleString('en-IN')}
                          </div>
                        </div>
                        <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 text-center">
                          <div className="text-[10px] font-bold text-primary uppercase tracking-wide">You Pay (Out-of-Pocket)</div>
                          <div className="text-2xl font-black text-foreground mt-1">
                            ₹{Math.round(youPay).toLocaleString('en-IN')}
                          </div>
                        </div>
                      </div>

                    </div>

                    <p className="text-[11px] text-muted-foreground text-center leading-normal">
                      Disclaimer: Calculations are mock estimations and subject to policy clauses, pre-existing conditions, and claims approval procedures.
                    </p>
                  </Card>
                </div>

              </div>
            </div>
          </section>

          {/* CASHLESS CLINIC PAYOUTS */}
          <section className="bg-slate-950 text-slate-100 py-24 relative overflow-hidden">
            {/* Subtle grid pattern overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
            
            <div className="container mx-auto px-8 lg:px-20 relative z-10">
              <div className="grid lg:grid-cols-12 gap-16 items-center">
                
                {/* Left Column */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-semibold">
                    <Cpu className="w-3.5 h-3.5 text-primary" />
                    Cashless Claims Settlement
                  </div>
                  
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                    Zero Reimbursement Waiting.<br />
                    Settled directly with your vet hospital.
                  </h2>
                  
                  <p className="text-slate-400 text-base lg:text-lg leading-relaxed max-w-xl">
                    Traditional pet insurance claims require manual approvals, printing physical bills, and weeks of waiting. Zoodo partner clinics support direct cashless settlements. We verify EMR files and invoice details digitally to execute immediate clinic payments.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Link 
                      href="/services/insurance/claim"
                      className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-primary text-white font-bold hover:bg-primary/90 hover:shadow-lg transition-all text-sm"
                    >
                      Open Claims Portal
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link 
                      href="/services/insurance/compare"
                      className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all text-sm border border-slate-800"
                    >
                      View coverage details
                    </Link>
                  </div>
                </div>

                {/* Right Column: Cashless Flow */}
                <div className="lg:col-span-5 relative">
                  <div className="absolute inset-0 bg-primary/10 rounded-3xl filter blur-xl opacity-30 animate-pulse pointer-events-none" />
                  
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 relative">
                    <h3 className="font-extrabold text-lg flex items-center gap-2 text-primary">
                      <ShieldCheck className="w-5 h-5 text-primary" /> Cashless Flow
                    </h3>

                    <div className="space-y-6 relative before:absolute before:left-5 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-800">
                      
                      {/* Step 1 */}
                      <div className="flex gap-4 items-start relative z-10">
                        <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-slate-300">1</div>
                        <div>
                          <div className="font-bold text-sm text-slate-200">Treatment Completed</div>
                          <p className="text-xs text-slate-400 mt-1">Network vet clinic uploads invoice and treatment notes directly to our portal.</p>
                        </div>
                      </div>

                      {/* Step 2 */}
                      <div className="flex gap-4 items-start relative z-10">
                        <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center font-bold text-xs text-primary">2</div>
                        <div>
                          <div className="font-bold text-sm text-primary flex items-center gap-1.5">
                            Digital Verification
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                          </div>
                          <p className="text-xs text-slate-400 mt-1">Policy coverage, deductibles, and co-pays are parsed automatically.</p>
                        </div>
                      </div>

                      {/* Step 3 */}
                      <div className="flex gap-4 items-start relative z-10">
                        <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-slate-300">3</div>
                        <div>
                          <div className="font-bold text-sm text-slate-200">Approval Issued</div>
                          <p className="text-xs text-slate-400 mt-1">The claim audit finishes and an automated confirmation details the payout split.</p>
                        </div>
                      </div>

                      {/* Step 4 */}
                      <div className="flex gap-4 items-start relative z-10">
                        <div className="w-10 h-10 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-xs">4</div>
                        <div>
                          <div className="font-bold text-sm text-emerald-400">Direct clinic payout</div>
                          <p className="text-xs text-slate-400 mt-1">Reimbursement cash settles inside clinic account. You pay only your co-pay share.</p>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* FREQUENTLY ASKED QUESTIONS */}
          <section id="faq" className="container mx-auto px-8 lg:px-20 py-20 lg:py-28 scroll-mt-20">
            <div className="max-w-3xl mx-auto space-y-12">
              
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
                  Insurance Frequently Asked Questions
                </h2>
                <p className="text-muted-foreground">
                  Got questions about coverage, limits, exclusions, and claims? Find answers here.
                </p>
              </div>

              <Accordion type="single" collapsible className="space-y-4">
                
                <AccordionItem value="item-1" className="bg-card/60 dark:bg-card/30 border border-border/80 rounded-2xl px-6 py-1">
                  <AccordionTrigger className="hover:no-underline font-bold text-foreground text-sm sm:text-base py-4 text-left">
                    What is pet insurance and what does it generally cover?
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                    Pet insurance is a health plan for your pet that pays back money for eligible veterinary bills. Standard policies cover accidental injuries, sudden illnesses, surgical operations, prescription diagnostics (like blood tests, X-rays), and hospitalization. Exclusions generally include aesthetic surgeries, grooming routines, diet foods, and pre-existing conditions.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="bg-card/60 dark:bg-card/30 border border-border/80 rounded-2xl px-6 py-1">
                  <AccordionTrigger className="hover:no-underline font-bold text-foreground text-sm sm:text-base py-4 text-left">
                    What are co-payments and deductibles?
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                    A **deductible** is a fixed minimum amount you must pay yourself before the insurance policy starts contributing money (e.g. ₹1,500). A **co-payment** is the percentage split of the remaining bill that you agree to pay out of your pocket (e.g., a 10% co-pay means the insurance covers 90% of the cost, and you pay 10%).
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="bg-card/60 dark:bg-card/30 border border-border/80 rounded-2xl px-6 py-1">
                  <AccordionTrigger className="hover:no-underline font-bold text-foreground text-sm sm:text-base py-4 text-left">
                    How do cashless clinic payouts work?
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                    Zoodo partner clinics have direct integration to our digital claims system. When they upload the invoices, our system decodes the treatments to verify policy coverage. Once verified, we settle the payment straight to the clinic, removing all customer claim filing stress.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4" className="bg-card/60 dark:bg-card/30 border border-border/80 rounded-2xl px-6 py-1">
                  <AccordionTrigger className="hover:no-underline font-bold text-foreground text-sm sm:text-base py-4 text-left">
                    Can I insure senior pets, birds, or reptiles?
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                    Yes, Zoodo supports insuring senior pets up to 15 years old, as well as avian, reptilian, and equine classes. However, because different pets carry specific health risks, monthly premiums are adjusted dynamically. Pre-existing conditions are generally excluded, so we highly recommend enrolling pets early!
                  </AccordionContent>
                </AccordionItem>

              </Accordion>
            </div>
          </section>

        </main>

        {/* DYNAMIC BUY DIRECT MODAL */}
        <AnimatePresence>
          {isBuyModalOpen && selectedPlan && (
            <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsBuyModalOpen(false)}
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
              />

              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="bg-background rounded-3xl border border-border max-w-lg w-full p-6 sm:p-8 relative z-10 shadow-2xl overflow-hidden text-foreground"
              >
                
                {isBuySuccess ? (
                  <div className="text-center py-6 space-y-6">
                    <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500 mx-auto animate-bounce">
                      <ShieldCheck className="w-8 h-8" />
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-2xl font-black text-foreground">Coverage Secured!</h3>
                      <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                        Congratulations! Your policy for a {petAge}-year-old {petBreed} has been created successfully.
                      </p>
                    </div>

                    <div className="bg-muted/30 rounded-2xl p-4 text-left border border-border space-y-2 text-xs font-mono text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <span className="text-emerald-500 font-bold">Active</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Policy ID:</span>
                        <span className="text-foreground">#{planList.find(p => p.id === selectedPlan.id)?.logoText}-{(Math.random()*1000000).toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Coverage Limit:</span>
                        <span className="text-foreground">₹{(coverageLimit).toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Link 
                        href="/services/insurance/claim"
                        className="flex-1 h-12 rounded-xl bg-primary text-white font-bold hover:bg-primary/95 transition-colors flex items-center justify-center text-sm shadow-md"
                      >
                        Claims Portal
                      </Link>
                      <Button 
                        onClick={() => setIsBuyModalOpen(false)}
                        className="flex-1 h-12 rounded-xl bg-muted text-foreground hover:bg-muted/80 text-sm font-bold"
                      >
                        Close Portal
                      </Button>
                    </div>

                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-white text-xs ${selectedPlan.color}`}>
                          {selectedPlan.logoText}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-foreground leading-tight">{selectedPlan.name}</h4>
                          <div className="text-[10px] text-muted-foreground font-semibold uppercase mt-0.5">Setup direct billing</div>
                        </div>
                      </div>
                      <button 
                        onClick={() => setIsBuyModalOpen(false)}
                        className="text-muted-foreground hover:text-foreground font-bold text-lg"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="bg-muted/20 rounded-2xl p-5 border border-border space-y-4">
                      <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Policy Details</div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm font-semibold">
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground font-medium">Insured Species:</span>
                          <span className="text-foreground">{petBreed}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground font-medium">Pet Age:</span>
                          <span className="text-foreground">{petAge} {petAge === 1 ? 'Year' : 'Years'}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground font-medium">Coverage Limit:</span>
                          <span className="text-foreground">₹{(coverageLimit/100000).toFixed(1)} Lakh</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground font-medium">Premium Due:</span>
                          <span className="text-primary font-bold">₹{calculatePremium(selectedPlan.basePrice)}/month</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3.5 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-xs text-yellow-600 dark:text-yellow-400 font-medium">
                        <ShieldCheck className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div>
                          By clicking confirm, your policy details will be activated immediately and coverage documents will be sent to your account profile.
                        </div>
                      </div>

                      <Button 
                        onClick={executeMockPurchase}
                        disabled={isCalculating}
                        className="w-full h-12 rounded-xl bg-primary text-white font-bold hover:bg-primary/95 shadow-md transition-colors text-sm flex items-center justify-center gap-2"
                      >
                        {isCalculating ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Authorizing digital billing...
                          </>
                        ) : (
                          `Confirm Coverage (₹${calculatePremium(selectedPlan.basePrice)}/mo)`
                        )}
                      </Button>
                    </div>
                  </div>
                )}

              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <Footer />
      </div>
    </div>
  );
}
