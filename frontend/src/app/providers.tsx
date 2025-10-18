'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { useState } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { NotificationProvider } from '@/components/providers/NotificationProvider';
import { usePathname } from 'next/navigation';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
          },
        },
      })
  );

  const pathname = usePathname();
  const isDashboardPage = pathname?.startsWith('/dashboard/');

  // For dashboard pages, skip AuthProvider completely
  if (isDashboardPage) {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="system" 
          enableSystem
          disableTransitionOnChange
          storageKey="theme"
        >
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    );
  }

  // For other pages, use AuthProvider
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider 
        attribute="class" 
        defaultTheme="system" 
        enableSystem
        disableTransitionOnChange
        storageKey="theme"
      >
        <AuthProvider>
          {children}
          <NotificationProvider />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}