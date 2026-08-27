'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, CheckCircle2, AlertCircle, RefreshCw, ArrowRight } from 'lucide-react';
import { apiService } from '@/lib/api';

interface OtpModalProps {
  isOpen: boolean;
  email: string;
  onSuccess: (token: string, user: any) => void;
  onClose: () => void;
}

export default function OtpModal({ isOpen, email, onSuccess, onClose }: OtpModalProps) {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Resend countdown timer
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Handle OTP digit entry
  const handleChange = (element: HTMLInputElement, index: number) => {
    const value = element.value.replace(/[^0-9]/g, '');
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otp];
      if (!otp[index] && index > 0) {
        // Focus previous input if current is empty
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      } else {
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').substring(0, 6);
    if (pasteData.length === 6) {
      const newOtp = pasteData.split('');
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const fullOtp = otp.join('');
    if (fullOtp.length < 6) {
      setError('Please enter all 6 digits.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await apiService.verifyOtp(email, fullOtp);
      if (res.success && res.data) {
        setIsSuccess(true);
        setTimeout(() => {
          onSuccess(res.data.token, res.data.user);
        }, 1200);
      } else {
        setError(res.message || 'Verification failed. Please try again.');
      }
    } catch (err: any) {
      setError('Connection to auth server failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0 || isResending) return;
    setIsResending(true);
    setError(null);

    try {
      const res = await apiService.resendOtp(email);
      if (res.success) {
        setResendTimer(60);
        setOtp(new Array(6).fill(''));
        inputRefs.current[0]?.focus();
      } else {
        setError(res.message || 'Failed to resend code.');
      }
    } catch (err) {
      setError('Failed to resend verification code.');
    } finally {
      setIsResending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-background/80 backdrop-blur-md"
        />

        {/* Modal Panel */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', duration: 0.4 }}
          className="relative w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-2xl text-center z-10"
        >
          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center py-6"
            >
              <div className="rounded-full bg-emerald-500/10 p-4 text-emerald-500 mb-4">
                <CheckCircle2 className="h-16 w-16 animate-bounce" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Account Verified!</h3>
              <p className="text-muted-foreground text-sm">Welcome to Zoodo. Redirecting to your dashboard...</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col items-center">
                <div className="rounded-full bg-primary/10 p-4 text-primary mb-4">
                  <Mail className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Verify your email</h3>
                <p className="text-muted-foreground text-sm mt-2 px-4">
                  We sent a 6-digit verification code to <span className="font-semibold text-foreground">{email}</span>
                </p>
              </div>

              {/* OTP Digit Inputs */}
              <div className="flex justify-center gap-2 py-4" onPaste={handlePaste}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    onChange={(e) => handleChange(e.target, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="w-12 h-14 text-center text-xl font-bold rounded-xl border border-input bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-sm"
                  />
                ))}
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-destructive bg-destructive/10 px-4 py-3 rounded-xl text-sm"
                >
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}

              {/* Actions */}
              <div className="space-y-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 rounded-full bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:opacity-95 transition-opacity disabled:opacity-50"
                >
                  {isLoading ? (
                    <RefreshCw className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      Verify Code
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <span>Didn't receive the code?</span>
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendTimer > 0 || isResending}
                    className="font-medium text-primary hover:underline disabled:opacity-50 disabled:no-underline flex items-center gap-1"
                  >
                    {isResending ? (
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    ) : resendTimer > 0 ? (
                      `Resend in ${resendTimer}s`
                    ) : (
                      'Resend Code'
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
