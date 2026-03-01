'use client';

import { useState } from 'react';
import { AlertCircle, Bot, X } from 'lucide-react';
import Link from 'next/link';

interface BetaDisclaimerBannerProps {
    category: string; // e.g., "veterinarians", "hospitals", "trainers"
}

export default function BetaDisclaimerBanner({ category }: BetaDisclaimerBannerProps) {
    const [showBanner, setShowBanner] = useState(true);

    if (!showBanner) return null;

    return (
        <div className="relative mb-6 py-2 px-2 sm:p-3 bg-primary/5 border border-primary/20 rounded-lg text-muted-foreground animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-[11px] sm:text-sm pr-5 sm:pr-6">
                <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary shrink-0" />
                <div className="leading-tight sm:leading-normal text-center sm:text-left">
                    <span className="font-medium text-foreground mr-1">Early Access:</span>
                    Profiles below are placeholders. <span className="inline-block sm:inline"><span className="capitalize">{category}</span> are currently onboarding.</span>
                    <span className="hidden sm:inline ml-1 text-primary/80">
                        Try <Link href="/salus" className="font-semibold hover:underline text-primary">Salus AI</Link> for real help.
                    </span>
                </div>
            </div>
            <button
                onClick={() => setShowBanner(false)}
                className="absolute top-1/2 -translate-y-1/2 right-1.5 sm:right-3 text-muted-foreground hover:text-foreground transition-colors p-1"
            >
                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
        </div>
    );
}

