'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function ProcessLoader() {
    return (
        <div className="flex flex-col gap-2 px-1 py-4 animate-in fade-in duration-700">
            <div className="flex items-center gap-2">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 rounded-full border-2 border-slate-300 dark:border-slate-800 border-t-slate-600 dark:border-t-slate-300"
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
