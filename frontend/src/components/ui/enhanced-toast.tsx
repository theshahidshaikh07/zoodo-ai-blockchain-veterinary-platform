'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const enhancedToastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-xl border p-6 pr-8 shadow-2xl transition-all duration-300 ease-in-out data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full backdrop-blur-sm",
  {
    variants: {
      variant: {
        default: "border-border bg-background/95 text-foreground",
        success: "border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 text-green-900 dark:border-green-800 dark:from-green-950/50 dark:to-emerald-950/50 dark:text-green-100",
        error: "border-red-200 bg-gradient-to-r from-red-50 to-rose-50 text-red-900 dark:border-red-800 dark:from-red-950/50 dark:to-rose-950/50 dark:text-red-100",
        warning: "border-yellow-200 bg-gradient-to-r from-yellow-50 to-amber-50 text-yellow-900 dark:border-yellow-800 dark:from-yellow-950/50 dark:to-amber-950/50 dark:text-yellow-100",
        info: "border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-900 dark:border-blue-800 dark:from-blue-950/50 dark:to-cyan-950/50 dark:text-blue-100",
        loading: "border-purple-200 bg-gradient-to-r from-purple-50 to-violet-50 text-purple-900 dark:border-purple-800 dark:from-purple-950/50 dark:to-violet-950/50 dark:text-purple-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const iconVariants = cva(
  "flex-shrink-0 w-6 h-6",
  {
    variants: {
      variant: {
        default: "text-foreground",
        success: "text-green-600 dark:text-green-400",
        error: "text-red-600 dark:text-red-400",
        warning: "text-yellow-600 dark:text-yellow-400",
        info: "text-blue-600 dark:text-blue-400",
        loading: "text-purple-600 dark:text-purple-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const getIcon = (variant: string) => {
  switch (variant) {
    case 'success':
      return <CheckCircle className={cn(iconVariants({ variant: 'success' }))} />;
    case 'error':
      return <AlertCircle className={cn(iconVariants({ variant: 'error' }))} />;
    case 'warning':
      return <AlertTriangle className={cn(iconVariants({ variant: 'warning' }))} />;
    case 'info':
      return <Info className={cn(iconVariants({ variant: 'info' }))} />;
    case 'loading':
      return <Loader2 className={cn(iconVariants({ variant: 'loading' }), "animate-spin")} />;
    default:
      return <Info className={cn(iconVariants({ variant: 'default' }))} />;
  }
};

export interface EnhancedToastProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof enhancedToastVariants> {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  onClose?: () => void;
  duration?: number;
  showProgress?: boolean;
}

const EnhancedToast = React.forwardRef<HTMLDivElement, EnhancedToastProps>(
  ({ className, variant, title, description, action, onClose, duration = 5000, showProgress = true, ...props }, ref) => {
    const [progress, setProgress] = React.useState(100);
    const [isVisible, setIsVisible] = React.useState(true);

    React.useEffect(() => {
      if (!showProgress || !duration) return;

      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev - (100 / (duration / 100));
          if (newProgress <= 0) {
            setIsVisible(false);
            setTimeout(() => onClose?.(), 300);
            return 0;
          }
          return newProgress;
        });
      }, 100);

      return () => clearInterval(interval);
    }, [duration, showProgress, onClose]);

    if (!isVisible) return null;

    return (
      <div
        ref={ref}
        className={cn(enhancedToastVariants({ variant }), className)}
        {...props}
      >
        <div className="flex items-start space-x-3 flex-1">
          {getIcon(variant || 'default')}
          <div className="flex-1 space-y-1">
            {title && (
              <div className="text-sm font-semibold leading-none tracking-tight">
                {title}
              </div>
            )}
            {description && (
              <div className="text-sm opacity-90 leading-relaxed">
                {description}
              </div>
            )}
          </div>
        </div>
        
        {action && (
          <div className="flex-shrink-0">
            {action}
          </div>
        )}
        
        <button
          onClick={onClose}
          className="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring group-hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>

        {showProgress && duration && (
          <div className="absolute bottom-0 left-0 h-1 bg-current opacity-20 transition-all duration-100 ease-linear"
               style={{ width: `${progress}%` }} />
        )}
      </div>
    );
  }
);

EnhancedToast.displayName = "EnhancedToast";

export { EnhancedToast, enhancedToastVariants };
