'use client';

import { useEffect } from 'react';

/**
 * ServiceWarmer Component
 * 
 * This component silently pings the AI Service on the free Render tier to wake it up (Cold Start).
 * It runs once when the application loads.
 */
export function ServiceWarmer() {
    useEffect(() => {
        const warmup = async () => {
            // Get AI Service URL from env
            // Note: In api.ts it defaults to localhost:8000, here we check safely
            const aiUrl = process.env.NEXT_PUBLIC_AI_SERVICE_URL;

            // If no URL configured (or using defaults which might be local), skip to avoid noise
            if (!aiUrl || aiUrl.includes('localhost')) return;

            try {
                // Fire and forget request to /health endpoint
                // mode: 'no-cors' allows sending the request even if CORS headers aren't perfect for this origin
                // The goal is just to trigger the Render container to spin up
                await fetch(`${aiUrl}/health`, {
                    method: 'GET',
                    mode: 'no-cors',
                    cache: 'no-store'
                });
                console.log('🚀 AI Service Warmup Triggered (Render Cold Start Mitigation)');
            } catch (err) {
                // Silently fail - this is a background optimization
                console.debug('Warmup ping failed', err);
            }
        };

        warmup();
    }, []);

    return null; // Renders nothing
}
