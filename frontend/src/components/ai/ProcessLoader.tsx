'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function ProcessLoader() {
    return (
        <div className="flex flex-col gap-2 px-1 py-4 animate-in fade-in duration-700">
            <div className="flex items-center gap-2">
                <motion.span
                    className="w-2 h-2 rounded-full bg-slate-500/80 dark:bg-slate-300/80"
                    animate={{ opacity: [0.35, 1, 0.35], scale: [0.9, 1.15, 0.9] }}
                    transition={{
                        duration: 1.1,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />

                {/* Slightly lightened "Thinking" Text - Middle Ground Profile */}
                <motion.span
                    className="text-sm font-semibold tracking-tight"
                    style={{
                        backgroundImage: 'linear-gradient(90deg, #475569 0%, #475569 40%, #cbd5e1 50%, #475569 60%, #475569 100%)',
                        backgroundSize: '200% 100%',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        display: 'inline-block',
                    }}
                    animate={{
                        backgroundPosition: ['200% 0', '-200% 0'],
                    }}
                    transition={{
                        repeat: Infinity,
                        duration: 1.8,
                        ease: "linear",
                    }}
                >
                    Thinking...
                </motion.span>
            </div>
        </div>
    );
}
