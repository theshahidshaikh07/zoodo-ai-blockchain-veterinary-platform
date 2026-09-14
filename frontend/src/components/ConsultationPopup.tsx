'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Video,
  AlertTriangle,
  Calendar,
  MapPin,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';

interface ConsultationPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 'initial' | 'fee' | 'searching' | 'no-results';

const ConsultationPopup = ({ isOpen, onClose }: ConsultationPopupProps) => {
  const [step, setStep] = useState<Step>('initial');

  // Reset state when valid
  useEffect(() => {
    if (isOpen) {
      setStep('initial');
    }
  }, [isOpen]);

  const handleProceedToFee = () => {
    setStep('fee');
  };

  const handleConfirmFee = () => {
    setStep('searching');
    // Simulate search delay then fail
    setTimeout(() => {
      setStep('no-results');
    }, 4000);
  };

  const handleClose = () => {
    onClose();
    // Reset after transition
    setTimeout(() => setStep('initial'), 300);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="salus-theme sm:max-w-md w-[92%] rounded-3xl border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 sm:p-7 shadow-2xl">

        {/* STEP 1: INITIAL WARNING */}
        {step === 'initial' && (
          <>
            <DialogHeader className="text-left space-y-2">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5 items-center justify-center">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75 animate-ping" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full">
                  Instant Care
                </span>
              </div>
              <DialogTitle className="text-xl font-bold text-foreground">
                Urgent Video Consultation
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                We’ll connect you immediately with the next available certified veterinarian for an urgent pet consultation.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-3">
              <div className="bg-slate-50 dark:bg-zinc-900/70 p-4 rounded-2xl border border-slate-200/70 dark:border-zinc-850 space-y-2">
                <div className="flex items-center gap-2 text-xs text-foreground font-semibold">
                  <Clock className="w-4 h-4 text-primary shrink-0" />
                  <span>Estimated Wait Time: ~2 to 4 minutes</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Licensed VCI Registered Veterinarians</span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground text-center leading-relaxed px-2">
                For routine check-ups or vaccinations, please choose <strong>Schedule Later</strong> to pick your preferred doctor and time slot.
              </p>
            </div>

            <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 mt-2">
              <Button
                variant="ghost"
                className="w-full sm:flex-1 rounded-full text-xs font-semibold h-10 border border-slate-200 dark:border-zinc-800 bg-white hover:bg-slate-50 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-700 dark:text-slate-200 transition-colors flex items-center justify-center gap-1.5 shadow-none"
                asChild
              >
                <Link href="/services?cat=care&tab=veterinary&type=online">
                  <Calendar className="w-3.5 h-3.5 mr-1" />
                  <span>Schedule Later</span>
                </Link>
              </Button>
              <Button
                onClick={handleProceedToFee}
                className="w-full sm:flex-1 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold h-10 shadow-xs flex items-center justify-center gap-1.5"
              >
                <Video className="w-3.5 h-3.5 mr-1" />
                <span>Proceed</span>
              </Button>
            </DialogFooter>
          </>
        )}

        {/* STEP 2: FEE CONFIRMATION */}
        {step === 'fee' && (
          <>
            <DialogHeader className="text-left space-y-1.5">
              <DialogTitle className="text-xl font-bold text-foreground">
                Consultation Fee
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Transparent pricing with no hidden charges.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-3">
              <div className="bg-slate-50 dark:bg-zinc-900/70 p-5 rounded-2xl border border-slate-200/70 dark:border-zinc-850 text-center">
                <p className="text-xs font-medium text-muted-foreground mb-1">Standard Teleconsult Fee</p>
                <p className="text-3xl font-extrabold text-foreground">₹499</p>
                <span className="text-[11px] text-emerald-600 font-medium">Includes 3 days follow-up chat</span>
              </div>

              <p className="text-xs text-muted-foreground text-center leading-relaxed">
                You will only be charged after the veterinarian joins the video room and reviews your pet.
              </p>
            </div>

            <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 mt-2">
              <Button
                variant="ghost"
                onClick={handleClose}
                className="w-full sm:flex-1 rounded-full text-xs font-semibold h-10 border border-slate-200 dark:border-zinc-800 bg-white hover:bg-slate-50 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-700 dark:text-slate-200 transition-colors shadow-none"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmFee}
                className="w-full sm:flex-1 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold h-10 shadow-xs"
              >
                Connect Now
              </Button>
            </DialogFooter>
          </>
        )}

        {/* STEP 3: SEARCHING */}
        {step === 'searching' && (
          <div className="text-center py-10 space-y-4">
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 border-4 border-slate-100 dark:border-zinc-800 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <Video className="absolute inset-0 m-auto w-6 h-6 text-primary animate-pulse" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-foreground">Connecting to Vet Network...</h3>
              <p className="text-xs text-muted-foreground animate-pulse">
                Locating nearest available emergency veterinarians...
              </p>
            </div>
          </div>
        )}

        {/* STEP 4: NO RESULTS */}
        {step === 'no-results' && (
          <>
            <DialogHeader className="text-left space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <DialogTitle className="text-lg font-bold text-foreground">
                All Telehealth Doctors Busy
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
                All online vets are currently in active consultations. If your pet has a critical emergency, please visit a nearby 24/7 hospital immediately.
              </DialogDescription>
            </DialogHeader>

            <div className="py-2 space-y-2">
              <Button
                className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold h-10 shadow-xs"
                asChild
              >
                <Link href="/services?cat=care&tab=veterinary&type=clinic">
                  <MapPin className="w-3.5 h-3.5 mr-1.5" />
                  Find Partner Hospital Nearby
                </Link>
              </Button>
              <Button
                variant="ghost"
                onClick={handleClose}
                className="w-full rounded-full text-xs font-semibold h-10 border border-slate-200 dark:border-zinc-800 bg-white hover:bg-slate-50 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-700 dark:text-slate-200 transition-colors shadow-none"
              >
                Close
              </Button>
            </div>
          </>
        )}

      </DialogContent>
    </Dialog>
  );
};

export default ConsultationPopup;
