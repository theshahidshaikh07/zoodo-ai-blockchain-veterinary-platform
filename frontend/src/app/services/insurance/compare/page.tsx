'use client';

import { useState, Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ChevronLeft,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Search,
  Check,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { insuranceDatabase, InsuranceCompany } from '../data';
import BetaDisclaimerBanner from '@/components/BetaDisclaimerBanner';

const categories = [
  {
    title: 'Financials & Core Policy Limits',
    features: [
      { name: 'Annual Coverage Limit', getValue: (p: InsuranceCompany) => p.coverage, help: 'The maximum reimbursement payout available during each policy year.' },
      { name: 'Co-pay Ratio', getValue: (p: InsuranceCompany) => p.copay, help: 'Your percentage contribution toward eligible claims.' },
      { name: 'Policy Deductible', getValue: (p: InsuranceCompany) => p.deductible, help: 'Fixed out-of-pocket payment before policy benefits commence.' },
      { name: 'Waiting Period', getValue: (p: InsuranceCompany) => p.waitingPeriod, help: 'Predefined delay before coverage starts for specific pet diseases.' },
      { name: 'Claim Speed', getValue: (p: InsuranceCompany) => p.claimSpeed, help: 'Average time taken to process and reimburse medical bills.' }
    ]
  },
  {
    title: 'Clinical Care & Treatments',
    features: [
      { name: 'Accidents & Trauma', getValue: (p: InsuranceCompany) => p.features.some(f => f.toLowerCase().includes('accident') || f.toLowerCase().includes('injury')) || true, help: 'Fractures, lacerations, trauma, poisonings.' },
      { name: 'Illnesses & Infections', getValue: (p: InsuranceCompany) => p.features.some(f => f.toLowerCase().includes('illness') || f.toLowerCase().includes('disease')) || true, help: 'Infections, stomach issues, ear diseases.' },
      { name: 'Clinical Surgeries', getValue: (p: InsuranceCompany) => p.features.some(f => f.toLowerCase().includes('surgery') || f.toLowerCase().includes('operation')) || true, help: 'In-hospital surgical operations, anesthesia, recovery support.' },
      { name: 'Diagnostic Imaging', getValue: (p: InsuranceCompany) => p.features.some(f => f.toLowerCase().includes('scan') || f.toLowerCase().includes('diagnostic')), help: 'Standard clinical imaging used to diagnose internal trauma.' },
      { name: 'Dental Treatments', getValue: (p: InsuranceCompany) => p.features.some(f => f.toLowerCase().includes('dental')), help: 'Periodontal disease treatments, root canals, oral surgery.' },
      { name: 'Alternative Care', getValue: (p: InsuranceCompany) => p.features.some(f => f.toLowerCase().includes('alternative') || f.toLowerCase().includes('therapy')), help: 'Hydrotherapy, acupuncture, physical chiropractic treatments.' }
    ]
  }
];

function ComparePageContent() {
  const searchParams = useSearchParams();
  const idsParam = searchParams.get('ids') || searchParams.get('plan');
  
  // Extract selected IDs or default to first 3
  const initialIds = idsParam ? idsParam.split(',') : ['manypets', 'nationwide', 'metlife'];
  const [selectedCompareIds, setSelectedCompareIds] = useState<string[]>(initialIds);
  const [hideIdentical, setHideIdentical] = useState(false);

  // Dropdown states
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle plan toggle
  const handleTogglePlan = (id: string) => {
    if (selectedCompareIds.includes(id)) {
      setSelectedCompareIds(selectedCompareIds.filter(item => item !== id));
    } else {
      if (selectedCompareIds.length >= 3) {
        alert('You can compare a maximum of 3 plans at once.');
        return;
      }
      setSelectedCompareIds([...selectedCompareIds, id]);
    }
  };

  const plansToRender = insuranceDatabase.filter((p) => selectedCompareIds.includes(p.id));

  // Filter list of dropdown choices
  const dropdownFilteredPlans = insuranceDatabase.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tagline.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="pt-24 lg:pt-28 pb-20 relative z-10">
      
      <section className="container mx-auto px-8 lg:px-20 mt-12 mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 w-full">
            <BetaDisclaimerBanner category="insurance providers" />
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Compare Policies
            </h1>
            <p className="text-muted-foreground max-w-xl">
              Inspect coverage limits, waiting periods, clinical inclusions, and exclusions dynamically. Select plans in the dropdown below to compare in real-time.
            </p>
          </div>
        </div>
      </section>

      {/* DROPDOWN SELECTOR TOOLBAR */}
      <section className="container mx-auto px-8 lg:px-20 mb-8 relative z-50">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          
          {/* Custom Search & Select Dropdown */}
          <div className="relative w-full sm:w-[350px]">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full h-11 px-4 bg-background border border-border/80 rounded-xl flex items-center justify-between text-sm font-semibold text-foreground shadow-sm hover:border-primary/50 transition-colors"
            >
              <span className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-primary" />
                Select Plans ({selectedCompareIds.length}/3)
              </span>
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <Card className="absolute top-12 left-0 right-0 p-4 border border-border/80 shadow-xl bg-background rounded-2xl z-50 space-y-3">
                {/* Internal Search box */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Search insurance companies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-muted/30 text-xs font-semibold focus:ring-2 focus:ring-primary/20 outline-none text-foreground"
                  />
                </div>

                {/* Dropdown check list */}
                <div className="max-h-60 overflow-y-auto space-y-1">
                  {dropdownFilteredPlans.length === 0 ? (
                    <div className="text-center py-4 text-xs text-muted-foreground italic">No plans match search criteria.</div>
                  ) : (
                    dropdownFilteredPlans.map((plan) => {
                      const isChecked = selectedCompareIds.includes(plan.id);
                      return (
                        <button
                          key={plan.id}
                          onClick={() => handleTogglePlan(plan.id)}
                          className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-muted/40 transition-colors text-left"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-white font-extrabold text-[10px] ${plan.color}`}>
                              {plan.logoText}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-foreground leading-tight">{plan.name}</div>
                              <div className="text-[9px] text-muted-foreground font-semibold">{plan.tagline}</div>
                            </div>
                          </div>

                          <div className={`w-4.5 h-4.5 rounded border flex items-center justify-center transition-all ${
                            isChecked ? 'bg-primary border-primary text-white' : 'border-border'
                          }`}>
                            {isChecked && <Check className="w-3 h-3 stroke-[3px]" />}
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </Card>
            )}
          </div>

          {/* Quick Active Plan Badges */}
          <div className="flex flex-wrap gap-2">
            {plansToRender.map((plan) => (
              <span 
                key={plan.id} 
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border border-border/80 text-xs font-bold text-foreground"
              >
                <div className={`w-2.5 h-2.5 rounded-full ${plan.color}`} />
                {plan.logoText}
                <button 
                  onClick={() => handleTogglePlan(plan.id)}
                  className="text-muted-foreground hover:text-foreground font-bold p-0.5 ml-1"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>

        </div>
      </section>

      {/* COMPARISON MATRIX GRID */}
      <section className="container mx-auto px-8 lg:px-20 relative z-10">
        {plansToRender.length === 0 ? (
          <Card className="p-16 text-center border border-border/80 rounded-3xl bg-card/40 dark:bg-card/20 backdrop-blur-sm space-y-4">
            <div className="text-muted-foreground font-medium italic">Please select at least 1 plan using the selector dropdown above to begin side-by-side comparison.</div>
          </Card>
        ) : (
          <div className="bg-card/45 dark:bg-card/25 backdrop-blur-md rounded-3xl border border-border/80 shadow-xl overflow-hidden">
            
            {/* Sticky Plans Column Header */}
            <div className="grid grid-cols-12 border-b border-border/80 p-6 sm:p-8 bg-muted/80 backdrop-blur-md sticky top-[72px] z-40">
              
              {/* Row description title */}
              <div className="col-span-12 lg:col-span-3 flex items-center mb-6 lg:mb-0">
                <span className="font-bold text-muted-foreground uppercase tracking-wider text-xs">Policy Features</span>
              </div>

              {/* Plans columns */}
              <div className="col-span-12 lg:col-span-9 grid" style={{ gridTemplateColumns: `repeat(${plansToRender.length}, minmax(0, 1fr))` }}>
                {plansToRender.map((plan) => (
                  <div key={plan.id} className="space-y-2 relative px-3">
                    {plan.badge && (
                      <span className="absolute -top-6 left-3 px-2 py-0.5 rounded-full bg-primary text-white text-[8px] font-extrabold tracking-wider uppercase shadow-sm">
                        {plan.badge}
                      </span>
                    )}
                    <h3 className="font-extrabold text-xs sm:text-sm text-foreground leading-tight">{plan.name}</h3>
                    <div className="flex items-baseline gap-0.5 pt-1">
                      <span className="text-lg font-black text-foreground">₹{plan.basePrice}</span>
                      <span className="text-[10px] text-muted-foreground font-semibold">/mo</span>
                    </div>
                    <Link
                      href={`/services/insurance`}
                      className="inline-flex items-center gap-1 text-[10px] font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-wide pt-1"
                    >
                      Buy Policy <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                ))}
              </div>

            </div>

            {/* Matrix rows */}
            <div className="divide-y divide-border/80">
              {categories.map((cat, catIdx) => (
                <div key={catIdx} className="space-y-0">
                  
                  {/* Category Banner Title */}
                  <div className="bg-muted/40 border-b border-border/80 py-3 px-6 sm:px-8">
                    <span className="font-extrabold text-[10px] sm:text-xs text-muted-foreground uppercase tracking-widest">
                      {cat.title}
                    </span>
                  </div>

                  {/* Rows mapping */}
                  <div className="divide-y divide-border/60">
                    {cat.features
                      .filter((f) => {
                        if (!hideIdentical) return true;
                        const values = plansToRender.map(p => String(f.getValue(p)));
                        return !values.every(v => v === values[0]);
                      })
                      .map((feat, fIdx) => (
                        <div key={fIdx} className="grid grid-cols-12 p-6 sm:p-8 hover:bg-muted/20 transition-colors items-center gap-6">
                          
                          {/* Left label */}
                          <div className="col-span-12 lg:col-span-3 space-y-1">
                            <div className="flex items-center gap-1.5 text-sm font-bold text-foreground">
                              {feat.name}
                              <HelpCircle className="w-3.5 h-3.5 text-muted-foreground/60 hover:text-primary cursor-pointer" />
                            </div>
                            <p className="text-[11px] text-muted-foreground font-medium leading-normal max-w-[200px] hidden lg:block">
                              {feat.help}
                            </p>
                          </div>

                          {/* Plan Values */}
                          <div className="col-span-12 lg:col-span-9 grid" style={{ gridTemplateColumns: `repeat(${plansToRender.length}, minmax(0, 1fr))` }}>
                            {plansToRender.map((plan) => {
                              const val = feat.getValue(plan);
                              return (
                                <div key={plan.id} className="text-xs sm:text-sm font-semibold text-foreground px-3">
                                  {typeof val === 'boolean' ? (
                                    val ? (
                                      <div className="flex items-center gap-1 text-emerald-600 font-bold text-xs sm:text-sm">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                        <span>Covered</span>
                                      </div>
                                    ) : (
                                      <div className="flex items-center gap-1 text-muted-foreground/60 font-medium text-xs sm:text-sm">
                                        <XCircle className="w-4 h-4 text-muted-foreground/40 flex-shrink-0" />
                                        <span>Excluded</span>
                                      </div>
                                    )
                                  ) : (
                                    <div className="text-foreground font-bold text-xs sm:text-sm">
                                      {val}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                        </div>
                      ))}
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}
      </section>

      {/* BOTTOM BUY CALLOUT CARD */}
      <section className="container mx-auto px-8 lg:px-20 mt-16 relative z-10">
        <Card className="bg-slate-950 text-slate-100 rounded-3xl p-8 sm:p-12 relative overflow-hidden border border-border/80">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent pointer-events-none" />
          
          <div className="max-w-2xl space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
              Verified Options Matrix
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Compare to protect your pet today.
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Find the exact limits, deductibles, and waiting periods required to secure your pet. Choose standard, comprehensive, or species-specialized exotics cover.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                href="/services/insurance"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-all text-sm"
              >
                View Directory <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/services/insurance"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all text-sm border border-slate-800"
              >
                Get Custom Quote
              </Link>
            </div>
          </div>
        </Card>
      </section>

    </main>
  );
}

export default function DynamicComparePage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden font-sans relative">
      {/* Unified Zoodo Grid & Light Pattern Background */}
      <div className="fixed inset-0 bg-[image:var(--bg-subtle-mesh)] pointer-events-none opacity-90 z-0" />
      <div className="fixed inset-0 bg-[image:var(--bg-dot-pattern)] bg-[length:24px_24px] pointer-events-none opacity-50 [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)] z-0" />
      <div className="fixed inset-0 bg-slate-50/40 dark:bg-transparent pointer-events-none z-0" />

      <Header />
      <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center text-foreground">Loading comparison matrix...</div>}>
        <ComparePageContent />
      </Suspense>
      <Footer />
    </div>
  );
}
