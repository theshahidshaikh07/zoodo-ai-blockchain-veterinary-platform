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
        <div className="relative mb-6 sm:mb-8 p-3 sm:p-4 rounded-xl border border-primary/20 bg-primary/5 animate-fade-in shadow-sm flex flex-col gap-2">
            <button
                onClick={() => setShowBanner(false)}
                className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-black/5 dark:hover:bg-white/10 z-10"
            >
                <X className="w-4 h-4" />
            </button>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 pr-6 sm:pr-0">
                <div className="p-2 bg-primary/10 rounded-full shrink-0">
                    <AlertCircle className="w-5 h-5 text-primary" />
                </div>
                <div className="text-sm text-foreground/80 leading-relaxed text-center">
                    <span className="font-semibold text-foreground">Early Access Preview:</span> Top-tier {category} are currently onboarding.
                    The profiles below are <span className="text-primary font-medium">placeholder examples</span> for Beta testing.
                </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm italic border-t border-primary/10 pt-2 mt-1 text-foreground/80">
                <Bot className="w-4 h-4 text-primary" />
                <span><Link href="/ai-assistant" className="font-bold text-primary hover:underline not-italic">Dr. Salus AI</Link> is fully operational & ready to help!</span>
            </div>
        </div>
    );
}
