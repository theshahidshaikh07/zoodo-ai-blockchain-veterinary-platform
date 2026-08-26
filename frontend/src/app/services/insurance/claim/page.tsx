'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  CheckCircle2,
  UploadCloud,
  FileCheck2,
  AlertCircle,
  Coins,
  Cpu,
  Clock,
  XCircle,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { insuranceDatabase } from '../data';
import CustomSelect from '@/components/ui/custom-select';
import BetaDisclaimerBanner from '@/components/BetaDisclaimerBanner';

const clinics = [
  { name: 'Royal Paws Veterinary Hospital (Verified Network)', network: true },
  { name: 'City Animal & Trauma Clinic (Verified Network)', network: true },
  { name: 'Paws & Claws Specialty Hospital (Out of Network)', network: false }
];

const treatments = [
  { name: 'Orthopedic Surgery - Fracture Repair', baseCost: 45000, category: 'Surgery' },
  { name: 'Gastroenteritis Emergency Treatment', baseCost: 12000, category: 'Illness' },
  { name: 'Specialist Avian / Exotic Diagnostic Panel', baseCost: 6500, category: 'Diagnostics' }
];

export default function ClaimsSupportPage() {
  // Input states
  const [petName, setPetName] = useState('Max (Golden Retriever)');
  const [selectedPlanId, setSelectedPlanId] = useState('manypets');
  const [clinic, setClinic] = useState(clinics[0].name);
  const [treatment, setTreatment] = useState(treatments[0].name);
  const [billAmount, setBillAmount] = useState(45000);
  const [ocrFile, setOcrFile] = useState<string | null>(null);

  // Submission state
  const [submissionState, setSubmissionState] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [claims, setClaims] = useState<any[]>([]);
  const [filterQuery, setFilterQuery] = useState('');

  // Handle mock file select
  const handleMockFile = () => {
    setOcrFile('invoice_receipt_mock_9481.pdf');
  };

  // Submit Claim Request
  const handleSubmitClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ocrFile) return;

    setSubmissionState('submitting');
    
    // Simulate digital claim verification delay
    setTimeout(() => {
      const plan = insuranceDatabase.find(p => p.id === selectedPlanId);
      const planName = plan ? plan.name : 'Standard Policy';

      const generatedClaim = {
        id: `CLM-${Math.floor(10000 + Math.random() * 90000)}`,
        pet: `${petName} [${planName}]`,
        clinic: clinic,
        treatment: treatment.split(' - ')[0],
        amount: `₹${billAmount.toLocaleString('en-IN')}`,
        type: clinic.includes('Verified') ? 'Cashless Payout' : 'Reimbursement',
        status: clinic.includes('Verified') ? 'Settled' : 'Approved',
        date: new Date().toISOString().split('T')[0],
        confirmationCode: `CFM-${Math.floor(100000 + Math.random() * 900000)}`,
        note: clinic.includes('Verified') 
          ? 'Instantly verified via AI OCR. Cashless clinic transfer complete.'
          : 'Receipt scanned successfully. Approved for direct reimbursement.'
      };

      setClaims((prev) => [generatedClaim, ...prev]);
      setSubmissionState('success');
      setOcrFile(null);
    }, 1800);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Settled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" /> Settled
          </span>
        );
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold">
            <Clock className="w-3.5 h-3.5" /> Approved
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-muted border border-border text-muted-foreground text-xs font-bold">
            <XCircle className="w-3.5 h-3.5" /> Rejected
          </span>
        );
      default:
        return null;
    }
  };

  const filteredClaims = claims.filter(c => 
    c.pet.toLowerCase().includes(filterQuery.toLowerCase()) ||
    c.treatment.toLowerCase().includes(filterQuery.toLowerCase()) ||
    c.clinic.toLowerCase().includes(filterQuery.toLowerCase()) ||
    c.id.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden font-sans relative">
      {/* Unified Zoodo Grid & Light Pattern Background */}
      <div className="fixed inset-0 bg-[image:var(--bg-subtle-mesh)] pointer-events-none opacity-90 z-0" />
      <div className="fixed inset-0 bg-[image:var(--bg-dot-pattern)] bg-[length:24px_24px] pointer-events-none opacity-50 [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)] z-0" />
      <div className="fixed inset-0 bg-slate-50/40 dark:bg-transparent pointer-events-none z-0" />

      <div className="relative z-10">
        <Header />

        <main className="pt-24 lg:pt-28 pb-20">
          
          {/* HEADER */}
          <section className="container mx-auto px-8 lg:px-20 mt-12 mb-12">
            <div className="space-y-3">
              <BetaDisclaimerBanner category="insurance providers" />
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                Pet Insurance Claims Portal
              </h1>
              <p className="text-muted-foreground max-w-xl">
                File digital policy claims, check recent processing status, and verify direct reimbursements or cashless clinic payouts.
              </p>
            </div>
          </section>

          {/* WORKSPACE GRID */}
          <section className="container mx-auto px-8 lg:px-20">
            <div className="grid lg:grid-cols-12 gap-12">
              
              {/* Left Column: Direct File Claim Form */}
              <div className="lg:col-span-5 space-y-6">
                <Card className="p-6 sm:p-8 rounded-3xl border border-border/80 bg-card/60 dark:bg-card/30 backdrop-blur-md shadow-xl relative">
                  
                  {submissionState === 'success' ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-8 space-y-6"
                    >
                      <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500 mx-auto">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-foreground">Claim Submitted!</h3>
                        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                          Your claim has been submitted. Check the claims log below to view the active processing status.
                        </p>
                      </div>

                      <Button 
                        onClick={() => setSubmissionState('idle')}
                        className="w-full h-12 rounded-xl bg-muted text-foreground font-bold hover:bg-muted/80 transition-all text-sm"
                      >
                        File Another Claim
                      </Button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmitClaim} className="space-y-5 text-foreground">
                      <h3 className="text-lg font-bold text-foreground">File a Digital Claim</h3>
                      
                      {/* Input Pet Name */}
                      <div>
                        <label htmlFor="petName" className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                          1. Registered Pet (Name & Breed)
                        </label>
                        <input
                          id="petName"
                          type="text"
                          placeholder="e.g. Max (Golden Retriever)"
                          value={petName}
                          onChange={(e) => setPetName(e.target.value)}
                          disabled={submissionState === 'submitting'}
                          className="w-full h-12 px-4 rounded-xl border border-border bg-background text-foreground text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none"
                        />
                      </div>

                      {/* Select Active Plan */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                          2. Active Insurance Plan
                        </label>
                        <CustomSelect
                          options={insuranceDatabase.map(p => ({ value: p.id, label: p.name }))}
                          value={selectedPlanId}
                          onChange={(val) => setSelectedPlanId(val)}
                          className="h-12 rounded-xl border-border bg-background"
                        />
                      </div>

                      {/* Select Clinic */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                          3. Veterinary Clinic / Care Provider
                        </label>
                        <CustomSelect
                          options={clinics.map(c => ({ value: c.name, label: c.name }))}
                          value={clinic}
                          onChange={(val) => setClinic(val)}
                          className="h-12 rounded-xl border-border bg-background"
                        />
                      </div>

                      {/* Select Treatment */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                          4. Diagnosis & Treatment Type
                        </label>
                        <CustomSelect
                          options={treatments.map(t => ({ value: t.name, label: t.name }))}
                          value={treatment}
                          onChange={(val) => {
                            setTreatment(val);
                            const cost = treatments.find((t) => t.name === val)?.baseCost || 10000;
                            setBillAmount(cost);
                          }}
                          className="h-12 rounded-xl border-border bg-background"
                        />
                      </div>

                      {/* Bill Amount */}
                      <div>
                        <label htmlFor="billAmount" className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                          5. Total Bill Amount (₹)
                        </label>
                        <input
                          id="billAmount"
                          type="number"
                          value={billAmount}
                          onChange={(e) => setBillAmount(Number(e.target.value))}
                          disabled={submissionState === 'submitting'}
                          className="w-full h-12 px-4 rounded-xl border border-border bg-background text-foreground text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                        />
                      </div>

                      {/* Invoice Upload */}
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2.5">
                          6. Upload Veterinary Invoice File
                        </label>
                        
                        {ocrFile ? (
                          <div className="border-2 border-dashed border-primary/40 rounded-2xl bg-primary/5 p-5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                <FileCheck2 className="w-5 h-5" />
                              </div>
                              <div>
                                <div className="text-xs font-bold text-foreground truncate max-w-[150px]">{ocrFile}</div>
                                <div className="text-[10px] text-muted-foreground font-semibold mt-0.5">Ready for auto-parsing</div>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setOcrFile(null)}
                              className="text-xs font-bold text-destructive hover:text-destructive/80 transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={handleMockFile}
                            className="w-full border-2 border-dashed border-border hover:border-primary bg-background rounded-2xl p-6 flex flex-col items-center justify-center gap-2 transition-all group"
                          >
                            <UploadCloud className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                            <span className="text-xs font-bold text-muted-foreground">Attach receipt / medical invoice</span>
                            <span className="text-[10px] text-muted-foreground/60 font-semibold">Supports PDF, JPG formats</span>
                          </button>
                        )}
                      </div>

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        disabled={!ocrFile || submissionState === 'submitting'}
                        className={`w-full h-12 rounded-xl text-white font-bold transition-all text-sm flex items-center justify-center gap-2 ${
                          ocrFile && submissionState !== 'submitting'
                            ? 'bg-primary hover:bg-primary/95 shadow-md shadow-primary/10'
                            : 'bg-muted cursor-not-allowed text-muted-foreground'
                        }`}
                      >
                        {submissionState === 'submitting' ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Verifying Claim Details...
                          </>
                        ) : (
                          "Submit Claim for Audit"
                        )}
                      </Button>
                    </form>
                  )}

                </Card>

                {/* Cashless Payout info */}
                <Card className="p-5 border border-border/80 rounded-3xl bg-card/60 dark:bg-card/30 backdrop-blur-sm flex gap-4 items-start text-foreground">
                  <Coins className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-semibold">Cashless Network Settlements</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                      Insured at network hospitals? The hospital files EMR uploads directly, and payouts execute instantly straight to their clinic account. Zero reimbursement steps required for you.
                    </p>
                  </div>
                </Card>
              </div>

              {/* Right Column: Claims Tracker */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                
                <Card className="p-6 sm:p-8 rounded-3xl border border-border/80 shadow-xl bg-card/60 dark:bg-card/30 backdrop-blur-md flex flex-col gap-6 text-foreground">
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-foreground">Your Active & Past Claims</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">Real-time claims history log</p>
                    </div>
                    
                    {/* Search Bar */}
                    {claims.length > 0 && (
                      <div className="relative">
                        <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
                        <input
                          type="text"
                          placeholder="Filter claims..."
                          value={filterQuery}
                          onChange={(e) => setFilterQuery(e.target.value)}
                          className="h-10 pl-9 pr-4 rounded-xl border border-border bg-background text-foreground text-xs font-semibold focus:ring-2 focus:ring-primary/20 outline-none w-full sm:w-[200px]"
                        />
                      </div>
                    )}
                  </div>

                  {claims.length === 0 ? (
                    /* Empty state */
                    <div className="py-16 flex flex-col items-center justify-center text-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground">
                        <FileCheck2 className="w-8 h-8" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-foreground">No Claims Filed Yet</h4>
                        <p className="text-xs text-muted-foreground max-w-sm leading-normal">
                          You have not filed any insurance claims. Once you submit a veterinary medical invoice on the left, it will appear here in real-time.
                        </p>
                      </div>
                    </div>
                  ) : (
                    /* Claims list & log table */
                    <>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="border-b border-border text-muted-foreground font-bold uppercase tracking-wider">
                              <th className="pb-3">Claim ID</th>
                              <th className="pb-3">Insured Pet</th>
                              <th className="pb-3">Clinic & Treatment</th>
                              <th className="pb-3 text-right">Amount</th>
                              <th className="pb-3 text-center">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {filteredClaims.length === 0 ? (
                              <tr>
                                <td colSpan={5} className="py-8 text-center text-muted-foreground italic">
                                  No claims records match the filters.
                                </td>
                              </tr>
                            ) : (
                              filteredClaims.map((claim) => (
                                <tr key={claim.id} className="hover:bg-muted/30 transition-colors">
                                  <td className="py-4 font-mono font-bold text-foreground">{claim.id}</td>
                                  <td className="py-4 font-medium text-muted-foreground">{claim.pet}</td>
                                  <td className="py-4">
                                    <div className="font-semibold text-foreground">{claim.treatment}</div>
                                    <div className="text-[10px] text-muted-foreground font-medium mt-0.5 truncate max-w-[200px]">{claim.clinic}</div>
                                  </td>
                                  <td className="py-4 text-right font-bold text-foreground">{claim.amount}</td>
                                  <td className="py-4 text-center">{getStatusBadge(claim.status)}</td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>

                      {/* Notes/Explanations */}
                      <div className="border-t border-border pt-5 space-y-3.5">
                        <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Processing Details</div>
                        
                        {filteredClaims.slice(0, 2).map((claim) => (
                          <div key={claim.id} className="p-3 bg-muted/30 border border-border rounded-2xl flex items-start gap-2.5 text-[11px]">
                            <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <div>
                              <span className="font-bold text-foreground font-mono">{claim.id}</span>: {claim.note}
                              {claim.confirmationCode && (
                                <span className="block font-mono text-[10px] text-primary/80 mt-1 flex items-center gap-1 select-all cursor-pointer">
                                  Confirmation Code: {claim.confirmationCode}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                </Card>

              </div>

            </div>
          </section>

        </main>

      </div>
      <Footer />
    </div>
  );
}
