'use client';

import { notificationService } from '@/lib/notification-service';

export function useNotifications() {
  return {
    // Success notifications
    success: notificationService.success.bind(notificationService),
    loginSuccess: notificationService.loginSuccess.bind(notificationService),
    registrationSuccess: notificationService.registrationSuccess.bind(notificationService),
    profileUpdated: notificationService.profileUpdated.bind(notificationService),
    appointmentScheduled: notificationService.appointmentScheduled.bind(notificationService),

    // Error notifications
    error: notificationService.error.bind(notificationService),
    loginError: notificationService.loginError.bind(notificationService),
    registrationError: notificationService.registrationError.bind(notificationService),
    validationError: notificationService.validationError.bind(notificationService),
    networkError: notificationService.networkError.bind(notificationService),

    // Warning notifications
    warning: notificationService.warning.bind(notificationService),
    sessionExpired: notificationService.sessionExpired.bind(notificationService),

    // Info notifications
    info: notificationService.info.bind(notificationService),

    // Loading notifications
    loading: notificationService.loading.bind(notificationService),

    // Utility
    dismissAll: notificationService.dismissAll.bind(notificationService),
  };
}
