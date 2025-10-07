'use client';

import { Toaster } from 'sonner';
import { useTheme } from 'next-themes';

export function NotificationProvider() {
  const { theme } = useTheme();

  return (
    <Toaster
      theme={theme as 'light' | 'dark' | 'system'}
      className="toaster group"
      position="top-right"
      expand={true}
      richColors={true}
      closeButton={true}
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-background/95 group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-2xl group-[.toaster]:backdrop-blur-sm",
          description: "group-[.toast]:text-muted-foreground group-[.toast]:text-sm group-[.toast]:leading-relaxed",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:hover:bg-primary/90 group-[.toast]:transition-colors",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:hover:bg-muted/80 group-[.toast]:transition-colors",
          success: "group-[.toaster]:border-green-200 group-[.toaster]:bg-gradient-to-r group-[.toaster]:from-green-50 group-[.toaster]:to-emerald-50 group-[.toaster]:text-green-900 dark:group-[.toaster]:border-green-800 dark:group-[.toaster]:from-green-950/50 dark:group-[.toaster]:to-emerald-950/50 dark:group-[.toaster]:text-green-100",
          error: "group-[.toaster]:border-red-200 group-[.toaster]:bg-gradient-to-r group-[.toaster]:from-red-50 group-[.toaster]:to-rose-50 group-[.toaster]:text-red-900 dark:group-[.toaster]:border-red-800 dark:group-[.toaster]:from-red-950/50 dark:group-[.toaster]:to-rose-950/50 dark:group-[.toaster]:text-red-100",
          warning: "group-[.toaster]:border-yellow-200 group-[.toaster]:bg-gradient-to-r group-[.toaster]:from-yellow-50 group-[.toaster]:to-amber-50 group-[.toaster]:text-yellow-900 dark:group-[.toaster]:border-yellow-800 dark:group-[.toaster]:from-yellow-950/50 dark:group-[.toaster]:to-amber-950/50 dark:group-[.toaster]:text-yellow-100",
          info: "group-[.toaster]:border-blue-200 group-[.toaster]:bg-gradient-to-r group-[.toaster]:from-blue-50 group-[.toaster]:to-cyan-50 group-[.toaster]:text-blue-900 dark:group-[.toaster]:border-blue-800 dark:group-[.toaster]:from-blue-950/50 dark:group-[.toaster]:to-cyan-950/50 dark:group-[.toaster]:text-blue-100",
          loading: "group-[.toaster]:border-purple-200 group-[.toaster]:bg-gradient-to-r group-[.toaster]:from-purple-50 group-[.toaster]:to-violet-50 group-[.toaster]:text-purple-900 dark:group-[.toaster]:border-purple-800 dark:group-[.toaster]:from-purple-950/50 dark:group-[.toaster]:to-violet-950/50 dark:group-[.toaster]:text-purple-100",
        },
        style: {
          borderRadius: '12px',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        },
      }}
    />
  );
}
