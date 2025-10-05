'use client';

import { useState } from 'react';
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
  DollarSign, 
  CheckCircle, 
  XCircle, 
  Loader2,
  IndianRupee
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

interface ConsultationPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConsultationPopup = ({ isOpen, onClose }: ConsultationPopupProps) => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchComplete, setSearchComplete] = useState(false);
  const [doctorsFound, setDoctorsFound] = useState(0);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleScheduleConsultation = async () => {
    setIsSearching(true);
    setSearchComplete(false);
    
    // Simulate searching for available doctors
    setTimeout(() => {
      setIsSearching(false);
      setSearchComplete(true);
      // For now, always show no doctors available (dummy implementation)
      setDoctorsFound(0);
    }, 3000);
  };

  const handleClose = () => {
    setIsSearching(false);
    setSearchComplete(false);
    setDoctorsFound(0);
    setTermsAccepted(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Video className="w-5 h-5 text-red-500" />
            Emergency Consultation
          </DialogTitle>
          <DialogDescription>
            Get immediate emergency veterinary care from qualified professionals at a fixed rate.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Consultation Details */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border">
              <div className="flex items-center gap-3">
                <IndianRupee className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium">Fixed Rate</p>
                  <p className="text-sm text-muted-foreground">₹500</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search Results */}
          {isSearching && (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary mb-4" />
              <p className="text-lg font-medium">Searching for emergency veterinarians...</p>
              <p className="text-sm text-muted-foreground mt-2">
                Please wait while we find an available emergency vet for your pet.
              </p>
            </div>
          )}

          {searchComplete && (
            <div className="text-center py-6">
              {doctorsFound > 0 ? (
                <div className="space-y-4">
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
                  <div>
                    <p className="text-lg font-medium text-green-600">Emergency Vet Found!</p>
                    <p className="text-sm text-muted-foreground">
                      {doctorsFound} emergency veterinarian{doctorsFound > 1 ? 's' : ''} available for immediate consultation
                    </p>
                  </div>
                  <Button className="w-full" size="lg">
                    <Video className="w-4 h-4 mr-2" />
                    Start Consultation
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <XCircle className="w-12 h-12 text-red-500 mx-auto" />
                  <div>
                    <p className="text-lg font-medium text-red-500">No Emergency Vets Available</p>
                    <p className="text-sm text-muted-foreground">
                      Sorry, no emergency veterinarians are currently online. Please try again or contact your local emergency vet clinic.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full" onClick={handleScheduleConsultation}>
                      <Video className="w-4 h-4 mr-2" />
                      Try Again
                    </Button>
                    <Button variant="ghost" className="w-full" onClick={handleClose}>
                      Find Local Emergency Clinic
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Terms and Conditions */}
          {!isSearching && !searchComplete && (
            <div 
              className={`flex items-start space-x-3 p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                termsAccepted 
                  ? 'bg-primary/10 border-primary/30' 
                  : 'bg-muted/50 border-border hover:bg-muted/70'
              }`}
              onClick={() => setTermsAccepted(!termsAccepted)}
            >
              <Checkbox 
                id="terms" 
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                className="mt-0.5"
              />
              <div className="space-y-1 flex-1">
                <label 
                  htmlFor="terms" 
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  I accept the terms and conditions
                </label>
                <p className="text-xs text-muted-foreground">
                  I agree to pay ₹500 for the emergency consultation service and understand that this is a fixed rate for immediate veterinary care.
                </p>
              </div>
            </div>
          )}

          {/* Benefits */}
          {!isSearching && !searchComplete && (
            <div className="space-y-3">
              <h4 className="font-medium text-sm">What's included:</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Immediate video consultation with emergency vet</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Urgent diagnosis and emergency treatment advice</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Emergency prescription recommendations</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Immediate care instructions and next steps</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {!isSearching && !searchComplete && (
            <>
              <Button variant="outline" onClick={handleClose} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button 
                onClick={handleScheduleConsultation} 
                disabled={!termsAccepted}
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <Video className="w-4 h-4 mr-2" />
                Get Emergency Care
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConsultationPopup;
