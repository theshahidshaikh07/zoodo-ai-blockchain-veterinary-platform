'use client';

import { toast } from 'sonner';

export interface NotificationConfig {
  title: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  showProgress?: boolean;
}

export interface ErrorDetails {
  code?: string;
  type?: string;
  details?: any;
}

class NotificationService {
  private getErrorIcon(errorCode?: string): string {
    switch (errorCode) {
      case 'AUTH_001':
      case 'AUTH_002':
      case 'AUTH_003':
        return '🔐';
      case 'REG_001':
      case 'REG_002':
      case 'REG_003':
        return '👤';
      case 'VAL_001':
      case 'VAL_002':
      case 'VAL_003':
        return '⚠️';
      case 'SYS_001':
      case 'SYS_002':
        return '🔧';
      default:
        return '❌';
    }
  }

  private getSuccessIcon(type?: string): string {
    switch (type) {
      case 'login':
        return '🎉';
      case 'registration':
        return '✨';
      case 'profile':
        return '👤';
      case 'appointment':
        return '📅';
      default:
        return '✅';
    }
  }

  private getWarningIcon(type?: string): string {
    switch (type) {
      case 'session':
        return '⏰';
      case 'validation':
        return '⚠️';
      case 'permission':
        return '🔒';
      default:
        return '⚠️';
    }
  }

  private getInfoIcon(type?: string): string {
    switch (type) {
      case 'update':
        return '🔄';
      case 'maintenance':
        return '🛠️';
      case 'feature':
        return '🆕';
      default:
        return 'ℹ️';
    }
  }

  // Success notifications
  success(config: NotificationConfig & { type?: string }) {
    const icon = this.getSuccessIcon(config.type);
    
    toast.success(config.title, {
      description: config.description,
      duration: config.duration || 4000,
      action: config.action ? {
        label: config.action.label,
        onClick: config.action.onClick,
      } : undefined,
      className: "border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 text-green-900 dark:border-green-800 dark:from-green-950/50 dark:to-emerald-950/50 dark:text-green-100",
      style: {
        background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
        border: '1px solid rgba(34, 197, 94, 0.2)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
    });
  }

  // Error notifications with enhanced styling
  error(config: NotificationConfig & { errorDetails?: ErrorDetails }) {
    const icon = this.getErrorIcon(config.errorDetails?.code);
    const isAuthError = config.errorDetails?.code?.startsWith('AUTH_');
    const isRegError = config.errorDetails?.code?.startsWith('REG_');
    
    let enhancedDescription = config.description;
    
    // Add helpful suggestions based on error type
    if (isAuthError) {
      enhancedDescription += '\n\n💡 Try checking your credentials or contact support if the issue persists.';
    } else if (isRegError) {
      enhancedDescription += '\n\n💡 Please try a different username/email or sign in if you already have an account.';
    }

    toast.error(config.title, {
      description: enhancedDescription,
      duration: config.duration || 6000,
      action: config.action ? {
        label: config.action.label,
        onClick: config.action.onClick,
      } : undefined,
      className: "border-red-200 bg-gradient-to-r from-red-50 to-rose-50 text-red-900 dark:border-red-800 dark:from-red-950/50 dark:to-rose-950/50 dark:text-red-100",
      style: {
        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(244, 63, 94, 0.1) 100%)',
        border: '1px solid rgba(239, 68, 68, 0.2)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
    });
  }

  // Warning notifications
  warning(config: NotificationConfig & { type?: string }) {
    const icon = this.getWarningIcon(config.type);
    
    toast.warning(config.title, {
      description: config.description,
      duration: config.duration || 5000,
      action: config.action ? {
        label: config.action.label,
        onClick: config.action.onClick,
      } : undefined,
      className: "border-yellow-200 bg-gradient-to-r from-yellow-50 to-amber-50 text-yellow-900 dark:border-yellow-800 dark:from-yellow-950/50 dark:to-amber-950/50 dark:text-yellow-100",
      style: {
        background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.1) 0%, rgba(245, 158, 11, 0.1) 100%)',
        border: '1px solid rgba(234, 179, 8, 0.2)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
    });
  }

  // Info notifications
  info(config: NotificationConfig & { type?: string }) {
    const icon = this.getInfoIcon(config.type);
    
    toast.info(config.title, {
      description: config.description,
      duration: config.duration || 4000,
      action: config.action ? {
        label: config.action.label,
        onClick: config.action.onClick,
      } : undefined,
      className: "border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-900 dark:border-blue-800 dark:from-blue-950/50 dark:to-cyan-950/50 dark:text-blue-100",
      style: {
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
    });
  }

  // Loading notifications
  loading(config: NotificationConfig) {
    toast.loading(config.title, {
      description: config.description,
      duration: config.duration || 3000,
      className: "border-purple-200 bg-gradient-to-r from-purple-50 to-violet-50 text-purple-900 dark:border-purple-800 dark:from-purple-950/50 dark:to-violet-950/50 dark:text-purple-100",
      style: {
        background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
        border: '1px solid rgba(147, 51, 234, 0.2)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
    });
  }

  // Specific notification methods for common scenarios
  loginSuccess(userName: string) {
    this.success({
      title: `Welcome back, ${userName}! 🎉`,
      description: 'You have successfully logged into your Zoodo account.',
      type: 'login',
      duration: 3000,
    });
  }

  loginError(errorDetails?: ErrorDetails) {
    const title = errorDetails?.code === 'AUTH_003' 
      ? 'Account Disabled' 
      : errorDetails?.code === 'AUTH_002'
      ? 'Account Locked'
      : 'Login Failed';
    
    this.error({
      title,
      description: errorDetails?.code === 'AUTH_001' 
        ? 'Invalid username or password. Please check your credentials and try again.'
        : errorDetails?.code === 'AUTH_003'
        ? 'Your account has been disabled. Please contact support for assistance.'
        : errorDetails?.code === 'AUTH_002'
        ? 'Your account has been temporarily locked due to multiple failed login attempts. Please try again later.'
        : 'Unable to log in. Please check your credentials and try again.',
      errorDetails,
    });
  }

  registrationSuccess(userType: string) {
    this.success({
      title: 'Registration Successful! ✨',
      description: `Welcome to Zoodo! Your ${userType} account has been created successfully.`,
      type: 'registration',
      duration: 4000,
    });
  }

  registrationError(errorDetails?: ErrorDetails) {
    const title = errorDetails?.code === 'REG_001' 
      ? 'Username Already Exists'
      : errorDetails?.code === 'REG_002'
      ? 'Email Already Exists'
      : errorDetails?.code === 'REG_003'
      ? 'License Already Exists'
      : 'Registration Failed';
    
    this.error({
      title,
      description: errorDetails?.code === 'REG_001'
        ? 'This username is already taken. Please choose a different username.'
        : errorDetails?.code === 'REG_002'
        ? 'An account with this email already exists. Please sign in or use a different email.'
        : errorDetails?.code === 'REG_003'
        ? 'This license number is already registered. Please check your license number or contact support.'
        : 'Registration failed. Please check your information and try again.',
      errorDetails,
    });
  }

  validationError(field: string, message: string) {
    this.error({
      title: 'Validation Error',
      description: `${field}: ${message}`,
      errorDetails: { code: 'VAL_001', type: 'VALIDATION' },
    });
  }

  networkError() {
    this.error({
      title: 'Connection Error',
      description: 'Unable to connect to the server. Please check your internet connection and try again.',
      errorDetails: { code: 'SYS_005', type: 'SYSTEM' },
      action: {
        label: 'Retry',
        onClick: () => window.location.reload(),
      },
    });
  }

  sessionExpired() {
    this.warning({
      title: 'Session Expired',
      description: 'Your session has expired. Please log in again to continue.',
      type: 'session',
      action: {
        label: 'Login',
        onClick: () => window.location.href = '/login',
      },
    });
  }

  profileUpdated() {
    this.success({
      title: 'Profile Updated',
      description: 'Your profile has been updated successfully.',
      type: 'profile',
    });
  }

  appointmentScheduled() {
    this.success({
      title: 'Appointment Scheduled',
      description: 'Your appointment has been scheduled successfully. You will receive a confirmation email shortly.',
      type: 'appointment',
    });
  }

  // Dismiss all notifications
  dismissAll() {
    toast.dismiss();
  }
}

export const notificationService = new NotificationService();
