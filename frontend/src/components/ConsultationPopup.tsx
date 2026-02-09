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
  Loader2,
  XCircle,
  Calendar,
  Zap,
  MapPin,
  DollarSign
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
      <DialogContent className="sm:max-w-md w-[90%] rounded-2xl">

        {/* STEP 1: INITIAL WARNING */}
        {step === 'initial' && (
          <>
            <DialogHeader className="text-left">
              <DialogTitle className="flex items-center gap-3 text-xl">
                <div className="relative flex h-2 w-2 items-center justify-center mt-1">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75 animate-ping" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500 animate-pulse" />
                </div>
                Instant Care
              </DialogTitle>
              <DialogDescription className="text-sm sm:text-base pt-1 sm:pt-2 ml-5">
                For urgent pet medical needs.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 sm:space-y-6 py-1 sm:py-4">
              <div className="bg-muted/40 p-2.5 sm:p-5 rounded-xl border border-border/50">
                <p className="text-sm sm:text-base leading-snug sm:leading-relaxed font-semibold text-foreground">
                  We’ll connect you immediately with the first available veterinarian for an urgent video consultation.
                </p>
              </div>

              <div className="text-center px-0 sm:px-4">
                <p className="text-xs sm:text-sm text-muted-foreground leading-snug sm:leading-relaxed">
                  For routine check-ups, please schedule a standard <span className="font-medium text-primary">Teleconsultation</span> instead. You can tap ‘Schedule Later’ to book at your convenience.
                </p>
              </div>
            </div>

            <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 mt-2">
              <Button variant="outline" className="w-full sm:flex-1" asChild>
                <Link href="/services/find-vets?type=online">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Later
                </Link>
              </Button>
              <Button
                onClick={handleProceedToFee}
                className="w-full sm:flex-1"
              >
                <Video className="w-4 h-4 mr-2" />
                Proceed
              </Button>
            </DialogFooter>
          </>
        )}

        {/* STEP 2: FEE CONFIRMATION */}
        {step === 'fee' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                Confirm Fee
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 sm:space-y-6 py-2 sm:py-4">
              <div className="bg-muted/40 p-4 sm:p-6 rounded-xl border border-border/50 text-center">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Consultation Fee</p>
                <p className="text-2xl sm:text-3xl font-bold text-foreground">$50</p>
              </div>

              <div className="text-center px-0 sm:px-4">
                <p className="text-xs sm:text-sm text-muted-foreground leading-snug sm:leading-relaxed">
                  You will be charged <span className="font-semibold text-foreground">$50</span>. Do you wish to proceed?
                </p>
              </div>
            </div>

            <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 mt-2">
              <Button variant="outline" onClick={handleClose} className="w-full sm:flex-1">
                Cancel
              </Button>
              <Button
                onClick={handleConfirmFee}
                className="w-full sm:flex-1"
              >
                Yes, Proceed
              </Button>
            </DialogFooter>
          </>
        )}

        {/* STEP 3: SEARCHING */}
        {step === 'searching' && (
          <div className="text-center py-12">
            <div className="relative w-16 h-16 mx-auto mb-6">
              <div className="absolute inset-0 border-4 border-muted/30 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <Video className="absolute inset-0 m-auto w-6 h-6 text-primary animate-pulse" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Connecting to Vet Network...</h3>
            <p className="text-muted-foreground animate-pulse">
              Locating available emergency specialists nearby...
            </p>
          </div>
        )}

        {/* STEP 4: NO RESULTS */}
        {step === 'no-results' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <AlertTriangle className="w-6 h-6" />
                No Veterinarians Available
              </DialogTitle>
            </DialogHeader>

            <div className="py-6 space-y-4">
              <p className="text-center text-muted-foreground">
                Sorry, but there are no veterinarians currently online to take your request.
              </p>
            </div>

            <DialogFooter className="flex-col gap-2">
              <Button variant="default" className="w-full" asChild>
                <Link href="/services/find-hospitals">
                  <MapPin className="w-4 h-4 mr-2" />
                  Emergency Clinic Nearby
                </Link>
              </Button>
            </DialogFooter>
          </>
        )}

      </DialogContent>
    </Dialog>
  );
};

export default ConsultationPopup;
