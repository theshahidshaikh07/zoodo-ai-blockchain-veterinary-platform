'use client';

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { UserPlus, Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import CommunityPopup from "./CommunityPopup";

const mp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const, delay },
});

const CTASection = () => {
  const [isCommunityPopupOpen, setIsCommunityPopupOpen] = useState(false);

  return (
    <section id="join-cta" className="relative py-8 lg:py-12">
      <div className="container mx-auto px-6 lg:px-20">
        
        {/* ── Standalone Outer Section Card (Solid Carbon Navy Banner) ── */}
        <motion.div
          {...mp(0)}
          className="bg-[#0f172a] rounded-tl-[1rem] rounded-tr-[2.5rem] rounded-br-[2.5rem] rounded-bl-[2.5rem] p-10 lg:p-16 text-center text-white relative overflow-hidden shadow-lg border border-slate-800"
        >
          <div className="relative z-10 max-w-2xl mx-auto space-y-5">
            <h2 className="text-3xl lg:text-5xl font-bold leading-tight tracking-[0.015em] text-white">
              Ready to join the <span className="text-primary">Zoodo family?</span>
            </h2>
            <p className="text-base lg:text-lg text-slate-300 leading-relaxed max-w-xl mx-auto">
              Be part of an all in one ecosystem transforming pet healthcare, lifestyle services, travel, and animal welfare.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
              {/* Primary CTA button with slate text color (text-slate-900) */}
              <Button
                variant="default"
                size="lg"
                className="bg-primary hover:bg-primary/90 text-slate-900 px-8 py-3.5 rounded-tl-[99px] rounded-bl-[99px] rounded-br-[99px] rounded-tr-[20px] font-semibold text-base transition-colors duration-200 group/btn shadow-md border-0"
                onClick={() => setIsCommunityPopupOpen(true)}
              >
                <UserPlus className="w-5 h-5 mr-2 text-slate-900" />
                <span className="text-slate-900 font-semibold">Join Community</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform text-slate-900" />
              </Button>

              {/* Secondary button: bg-white with slate text color (text-slate-900) */}
              <Button
                variant="outline"
                size="lg"
                className="bg-white hover:bg-slate-50 text-slate-900 border-white px-8 py-3.5 rounded-tl-[20px] rounded-tr-[99px] rounded-bl-[99px] rounded-br-[99px] font-semibold text-base transition-colors duration-200"
                asChild
              >
                <Link href="/role-selection">
                  <Heart className="w-5 h-5 mr-2 text-slate-900" />
                  <span className="text-slate-900 font-semibold">Get Started Today</span>
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      <CommunityPopup
        isOpen={isCommunityPopupOpen}
        onClose={() => setIsCommunityPopupOpen(false)}
      />
    </section>
  );
};

export default CTASection;
