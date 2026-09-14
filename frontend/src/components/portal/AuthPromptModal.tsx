'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, ArrowRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface AuthPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  itemTitle?: string;
}

export default function AuthPromptModal({
  isOpen,
  onClose,
  title = 'Sign in to continue',
  description,
  itemTitle,
}: AuthPromptModalProps) {
  const displayDescription =
    description ||
    (itemTitle
      ? `Create a free account or sign in to complete your booking for ${itemTitle}.`
      : 'Create a free account or sign in to complete your booking with our verified veterinarians.');

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[400px] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl bg-white dark:bg-gray-950">
        <DialogHeader className="text-center sm:text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-1">
            <Shield className="w-6 h-6" />
          </div>
          <DialogTitle className="text-lg font-bold text-foreground">
            {title}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
            {displayDescription}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2.5 pt-4">
          <Button
            asChild
            className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full text-xs font-semibold transition-all shadow-xs flex items-center justify-center gap-1.5"
          >
            <Link href="/login">
              <span>Sign In with Account</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full h-10 rounded-full border-gray-200 dark:border-gray-800 text-foreground hover:bg-gray-50 dark:hover:bg-gray-900 text-xs font-medium"
          >
            <Link href="/register/personal">
              <span>Create New Account</span>
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
