'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { Bot, Info } from 'lucide-react';

interface BetaDisclaimerPopupProps {
    category: string; // e.g., "veterinarians", "hospitals", "trainers"
    actionVerb?: string; // e.g., "treating", "training"
}

const BetaDisclaimerPopup = ({ category, actionVerb = "treating" }: BetaDisclaimerPopupProps) => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Check if user has seen this popup before in this session
        const key = `hasSeenBeta_${category}`;
        const hasSeenPopup = sessionStorage.getItem(key);

        if (!hasSeenPopup) {
            const timer = setTimeout(() => {
                setIsOpen(true);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [category]);

    const handleClose = () => {
        setIsOpen(false);
        const key = `hasSeenBeta_${category}`;
        sessionStorage.setItem(key, 'true');
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md w-[90%] rounded-2xl border border-primary/20 bg-background/95 backdrop-blur-xl shadow-elegant">

                <div className="p-2 text-center space-y-6">
                    {/* Icon - Brand Theme */}
                    <div className="mx-auto w-16 h-16 bg-gradient-primary/10 rounded-full flex items-center justify-center animate-pulse-slow">
                        <Info className="w-8 h-8 text-primary" />
                    </div>

                    <DialogHeader className="space-y-3">
                        <DialogTitle className="text-2xl font-bold">
                            Early Access Preview
                        </DialogTitle>

                        <div className="space-y-4 text-muted-foreground pt-2">
                            <p>
                                We are currently onboarding top-tier {category} to the Zoodo platform.
                            </p>

                            <div className="p-4 rounded-xl bg-secondary/50 border border-border text-foreground text-sm font-medium leading-relaxed">
                                The profiles below are <span className="text-primary font-bold">placeholder examples</span>.
                                <br /><br />
                                <span className="italic opacity-80 text-muted-foreground font-normal">
                                    {category === 'hospitals'
                                        ? '"Until we verify real hospitals, assume these are state-of-the-art sanctuaries for your furry friends!"'
                                        : `"Until we verify real ${category}, assume your favorite fictional character is ${actionVerb} your pet!"`
                                    }
                                </span>
                            </div>
                        </div>
                    </DialogHeader>

                    {/* Dr Salus Note - Subtle */}
                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground/80">
                        <Bot className="w-4 h-4 text-primary" />
                        <span><Link href="/ai-assistant" className="font-bold text-primary hover:underline hover:text-primary/80 transition-colors">Dr. Salus AI</Link> is fully operational & ready to help!</span>
                    </div>
                </div>

                <DialogFooter className="sm:justify-center w-full mt-2">
                    <Button
                        className="w-full rounded-full bg-primary hover:bg-primary/90 text-white font-semibold shadow-md h-12 focus-visible:ring-0 focus-visible:ring-offset-0"
                        onClick={handleClose}
                    >
                        Start Exploring 🚀
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default BetaDisclaimerPopup;
