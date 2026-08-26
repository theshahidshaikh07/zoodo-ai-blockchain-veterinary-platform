'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  CheckCircle2,
  Cpu,
  ShieldCheck,
  ArrowRight,
  Star,
  MapPin,
  Sparkles,
  ShieldAlert,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { insuranceDatabase, InsuranceCompany } from '../data';
import CustomSelect from '@/components/ui/custom-select';
import BetaDisclaimerBanner from '@/components/BetaDisclaimerBanner';

export default function MarketplacePage() {
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('Mumbai');
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'rating'>('rating');

  // View Details Modal (particular plan)
  const [selectedPlan, setSelectedPlan] = useState<InsuranceCompany | null>(null);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [isBuySuccess, setIsBuySuccess] = useState(false);
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  // Dynamic premium logic based on veterinary location indexes
  const calculatePremium = (basePrice: number) => {
    let multiplier = 1.0;
    const loc = location.toLowerCase();
    if (loc.includes('mumbai') || loc.includes('delhi') || loc.includes('bengaluru') || loc.includes('bangalore') || loc.includes('chennai') || loc.includes('hyderabad')) {
      multiplier *= 1.15; // Tier-1 high cost index
    }
    return Math.round(basePrice * multiplier);
  };

  const executePurchase = () => {
    setIsAuthorizing(true);
    setTimeout(() => {
      setIsAuthorizing(false);
      setIsBuySuccess(true);
    }, 1200);
  };

  // Filter & Sort Database
  const filteredPlans = insuranceDatabase
    .filter((plan) => {
      const matchesSearch = plan.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            plan.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            plan.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      const priceA = calculatePremium(a.basePrice);
      const priceB = calculatePremium(b.basePrice);

      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      return b.rating - a.rating;
    });

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden font-sans relative">
      {/* Unified Zoodo Grid & Light Pattern Background */}
      <div className="fixed inset-0 bg-[image:var(--bg-subtle-mesh)] pointer-events-none opacity-90 z-0" />
      <div className="fixed inset-0 bg-[image:var(--bg-dot-pattern)] bg-[length:24px_24px] pointer-events-none opacity-50 [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)] z-0" />
      <div className="fixed inset-0 bg-slate-50/40 dark:bg-transparent pointer-events-none z-0" />

      <div className="relative z-10">
        <Header />

        <main className="pt-24 lg:pt-28 pb-20">
          
          {/* HEADER SECTION */}
          <section className="container mx-auto px-8 lg:px-20 mt-8 mb-10">
            <div className="space-y-3">
              <BetaDisclaimerBanner category="insurance providers" />
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                Browse & Buy Pet Insurance Policies
              </h1>
              <p className="text-muted-foreground max-w-xl">
                Browse through our comprehensive index of verified partner policies. Customize by location, view details, and secure coverage.
              </p>
            </div>
          </section>

          {/* WORKSPACE LAYOUT */}
          <section className="container mx-auto px-8 lg:px-20">
            <div className="space-y-8">
              
              {/* Top Horizontal Filter Bar */}
              <Card className="p-6 rounded-3xl border border-border/80 bg-card/60 dark:bg-card/30 backdrop-blur-md shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                  {/* Search */}
                  <div className="space-y-2">
                    <label htmlFor="search" className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Search Providers</label>
                    <div className="relative">
                      <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
                      <input
                        id="search"
                        type="text"
                        placeholder="e.g. Nationwide, MetLife..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-10 pl-9 pr-4 rounded-xl border border-border bg-background text-foreground text-xs font-semibold focus:ring-2 focus:ring-primary/20 outline-none"
                      />
                    </div>
                  </div>

                  {/* Location Input */}
                  <div className="space-y-2">
                    <label htmlFor="location" className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Your Location</label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
                      <input
                        id="location"
                        type="text"
                        placeholder="e.g. Mumbai, Delhi..."
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full h-10 pl-9 pr-4 rounded-xl border border-border bg-background text-foreground text-xs font-semibold focus:ring-2 focus:ring-primary/20 outline-none"
                      />
                    </div>
                  </div>

                  {/* Sorting */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Sort Listings</label>
                    <CustomSelect
                      options={[
                        { value: 'rating', label: 'Top Rated' },
                        { value: 'price-asc', label: 'Price: Low to High' },
                        { value: 'price-desc', label: 'Price: High to Low' }
                      ]}
                      value={sortBy}
                      onChange={(val) => setSortBy(val as any)}
                      className="h-10 rounded-xl border-border bg-background"
                    />
                  </div>
                </div>
              </Card>

              {/* Bottom Plan Card Listings */}
              <div>
                {filteredPlans.length === 0 ? (
                  <Card className="p-12 text-center border border-border/80 rounded-3xl bg-card/60 dark:bg-card/30 backdrop-blur-md space-y-4">
                    <div className="text-muted-foreground font-medium italic">No policy listings match the current filters.</div>
                    <Button 
                      onClick={() => {
                        setSearchQuery('');
                        setLocation('Mumbai');
                      }}
                      className="h-10 px-6 bg-muted hover:bg-muted/80 text-foreground font-bold text-xs rounded-xl"
                    >
                      Reset Directory Filters
                    </Button>
                  </Card>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPlans.map((plan) => {
                      const price = calculatePremium(plan.basePrice);

                      return (
                        <Card
                          key={plan.id}
                          className={`p-6 rounded-3xl border transition-all duration-200 flex flex-col relative bg-card/60 dark:bg-card/30 backdrop-blur-sm ${
                            plan.highlight
                              ? 'border-primary shadow-lg shadow-primary/5 bg-gradient-to-b from-primary/5 to-card/40'
                              : 'border-border/80 hover:border-primary/50 shadow-sm'
                          }`}
                        >
                          {plan.badge && (
                            <span className="absolute -top-3 left-6 px-3.5 py-0.5 rounded-full bg-primary text-white text-[10px] font-extrabold tracking-wider uppercase shadow-md">
                              {plan.badge}
                            </span>
                          )}

                          {/* Top Header */}
                          <div className="flex items-center gap-3 mb-4">
                            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-extrabold text-white text-sm ${plan.color}`}>
                              {plan.logoText}
                            </div>
                            <div>
                              <h3 className="font-extrabold text-foreground leading-tight text-sm sm:text-base">{plan.name}</h3>
                              <p className="text-[10px] text-muted-foreground font-semibold uppercase mt-0.5">{plan.tagline}</p>
                            </div>
                          </div>

                          {/* Cost & Rating */}
                          <div className="flex justify-between items-baseline py-3 border-y border-border/60 mb-4 bg-muted/20 px-4 rounded-xl">
                            <div className="flex items-baseline gap-0.5">
                              <span className="text-xl font-extrabold text-foreground">₹{price}</span>
                              <span className="text-[10px] text-muted-foreground font-semibold">/mo</span>
                            </div>
                            
                            <div className="flex items-center gap-1 text-amber-505 text-xs font-bold text-amber-500">
                              <Star className="w-3.5 h-3.5 fill-amber-500" />
                              <span>{plan.rating}</span>
                            </div>
                          </div>

                          <p className="text-xs text-muted-foreground leading-relaxed mb-6 flex-1">
                            {plan.description}
                          </p>

                          {/* Quick Spec list */}
                          <div className="space-y-2 mb-6">
                            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Plan Specs</div>
                            <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-muted-foreground bg-muted/20 p-3 rounded-xl border border-border/50">
                              <div>Co-pay: <span className="text-foreground font-bold">{plan.copay}</span></div>
                              <div>Deductible: <span className="text-foreground font-bold">{plan.deductible}</span></div>
                            </div>
                          </div>

                          {/* Action buttons */}
                          <div className="space-y-2.5">
                            <Button
                              onClick={() => {
                                setSelectedPlan(plan);
                                setIsBuySuccess(false);
                                setIsBuyModalOpen(true);
                              }}
                              className="w-full h-11 bg-primary text-white font-bold hover:bg-primary/95 text-xs rounded-xl shadow-md transition-all"
                            >
                              View Details & Buy
                            </Button>
                          </div>

                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          </section>

        </main>

        {/* DETAILED VIEW & BUY MODAL */}
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
                className="bg-background rounded-3xl border border-border max-w-xl w-full p-6 sm:p-8 relative z-10 shadow-2xl overflow-y-auto max-h-[90vh] text-foreground"
              >
                
                {isBuySuccess ? (
                  <div className="text-center py-6 space-y-6">
                    <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500 mx-auto animate-bounce">
                      <ShieldCheck className="w-8 h-8" />
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-2xl font-black text-foreground">Coverage Secured!</h3>
                      <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                        Congratulations! Your policy has been issued successfully. Check your email or account directory to view full active contract parameters.
                      </p>
                    </div>

                    <div className="bg-muted/30 rounded-2xl p-4 text-left border border-border space-y-2 text-xs font-mono text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <span className="text-emerald-550 dark:text-emerald-400 font-bold">Active</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Policy ID:</span>
                        <span className="text-foreground">#{selectedPlan.logoText}-{(Math.random()*1000000).toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Coverage Limit:</span>
                        <span className="text-foreground">{selectedPlan.coverage}</span>
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
                    {/* Top header */}
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold text-white text-base ${selectedPlan.color}`}>
                          {selectedPlan.logoText}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-foreground text-lg leading-tight">{selectedPlan.name}</h4>
                          <div className="text-[10px] text-muted-foreground font-semibold uppercase mt-0.5">{selectedPlan.tagline}</div>
                        </div>
                      </div>
                      <button 
                        onClick={() => setIsBuyModalOpen(false)}
                        className="text-muted-foreground hover:text-foreground font-bold text-lg p-1"
                      >
                        ✕
                      </button>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {selectedPlan.description}
                    </p>

                    {/* Specific specifications list */}
                    <div className="grid grid-cols-2 gap-4 bg-muted/20 p-4 rounded-2xl border border-border text-xs font-semibold text-muted-foreground">
                      <div>Limit: <span className="text-foreground font-bold">{selectedPlan.coverage}</span></div>
                      <div>Co-pay: <span className="text-foreground font-bold">{selectedPlan.copay}</span></div>
                      <div>Deductible: <span className="text-foreground font-bold">{selectedPlan.deductible}</span></div>
                      <div>Waiting Period: <span className="text-foreground font-bold">{selectedPlan.waitingPeriod}</span></div>
                      <div className="col-span-2">Claim Processing Speed: <span className="text-foreground font-bold flex items-center gap-1.5 mt-0.5"><Clock className="w-3.5 h-3.5 text-primary" /> {selectedPlan.claimSpeed}</span></div>
                    </div>

                    {/* Included Coverage Features */}
                    <div className="space-y-3">
                      <div className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Included Coverage Features</div>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {selectedPlan.features.map((f) => (
                          <div key={f} className="flex items-start gap-2.5 text-xs text-muted-foreground font-medium">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Excluded details */}
                    <div className="space-y-3">
                      <div className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Excluded from Policy</div>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {selectedPlan.exclusions.map((e) => (
                          <div key={e} className="flex items-start gap-2.5 text-xs text-muted-foreground font-medium">
                            <ShieldAlert className="w-4 h-4 text-muted-foreground/60 flex-shrink-0 mt-0.5" />
                            <span>{e}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Billing Details */}
                    <div className="border-t border-border pt-5 space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-xs font-bold text-foreground">Monthly Premium Estimate</div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">Calculated for: {location} (incl. taxes)</div>
                        </div>
                        <div className="text-2xl font-black text-primary">
                          ₹{calculatePremium(selectedPlan.basePrice)}/mo
                        </div>
                      </div>

                      <Button 
                        onClick={executePurchase}
                        disabled={isAuthorizing}
                        className="w-full h-12 rounded-xl bg-primary text-white font-bold hover:bg-primary/95 shadow-md transition-colors text-sm flex items-center justify-center gap-2"
                      >
                        {isAuthorizing ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Processing purchase direct...
                          </>
                        ) : (
                          `Buy Direct (₹${calculatePremium(selectedPlan.basePrice)}/mo)`
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
