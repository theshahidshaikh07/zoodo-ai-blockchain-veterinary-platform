'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getDashboardRoute } from '@/lib/dashboard-utils';
import { Loader2 } from 'lucide-react';

export default function DashboardIndex() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check user in context or localStorage
    const savedUser = localStorage.getItem('user') || localStorage.getItem('zoodo_user');
    let userType = 'pet_owner';
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed?.userType) userType = parsed.userType;
      } catch {}
    } else if (user?.userType) {
      userType = user.userType;
    }

    const route = getDashboardRoute(userType);
    router.replace(route);
  }, [user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3 text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm font-medium">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}
