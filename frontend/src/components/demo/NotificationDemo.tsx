'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { notificationService } from '@/lib/notification-service';
import { useNotifications } from '@/hooks/use-notifications';

export function NotificationDemo() {
  const notifications = useNotifications();

  const handleSuccessDemo = () => {
    notifications.success({
      title: 'Operation Successful!',
      description: 'Your action has been completed successfully.',
      type: 'update',
    });
  };

  const handleErrorDemo = () => {
    notifications.error({
      title: 'Something went wrong',
      description: 'An error occurred while processing your request.',
      errorDetails: {
        code: 'SYS_001',
        type: 'SYSTEM',
      },
    });
  };

  const handleWarningDemo = () => {
    notifications.warning({
      title: 'Warning',
      description: 'Please review your information before proceeding.',
      type: 'validation',
    });
  };

  const handleInfoDemo = () => {
    notifications.info({
      title: 'Information',
      description: 'Here is some important information you should know.',
      type: 'update',
    });
  };

  const handleLoadingDemo = () => {
    notifications.loading({
      title: 'Processing...',
      description: 'Please wait while we process your request.',
    });
  };

  const handleLoginSuccessDemo = () => {
    notifications.loginSuccess('John Doe');
  };

  const handleLoginErrorDemo = () => {
    notifications.loginError({
      code: 'AUTH_001',
      type: 'AUTHENTICATION',
    });
  };

  const handleRegistrationSuccessDemo = () => {
    notifications.registrationSuccess('pet_owner');
  };

  const handleRegistrationErrorDemo = () => {
    notifications.registrationError({
      code: 'REG_001',
      type: 'REGISTRATION',
    });
  };

  const handleValidationErrorDemo = () => {
    notifications.validationError('Email', 'Please enter a valid email address');
  };

  const handleNetworkErrorDemo = () => {
    notifications.networkError();
  };

  const handleSessionExpiredDemo = () => {
    notifications.sessionExpired();
  };

  const handleProfileUpdatedDemo = () => {
    notifications.profileUpdated();
  };

  const handleAppointmentScheduledDemo = () => {
    notifications.appointmentScheduled();
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Notification System Demo</h1>
        <p className="text-muted-foreground">
          Click the buttons below to see different types of notifications in action
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Basic Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Notifications</CardTitle>
            <CardDescription>Standard notification types</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={handleSuccessDemo} className="w-full" variant="default">
              Success Notification
            </Button>
            <Button onClick={handleErrorDemo} className="w-full" variant="destructive">
              Error Notification
            </Button>
            <Button onClick={handleWarningDemo} className="w-full" variant="outline">
              Warning Notification
            </Button>
            <Button onClick={handleInfoDemo} className="w-full" variant="secondary">
              Info Notification
            </Button>
            <Button onClick={handleLoadingDemo} className="w-full" variant="outline">
              Loading Notification
            </Button>
          </CardContent>
        </Card>

        {/* Authentication Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Authentication</CardTitle>
            <CardDescription>Login and registration notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={handleLoginSuccessDemo} className="w-full" variant="default">
              Login Success
            </Button>
            <Button onClick={handleLoginErrorDemo} className="w-full" variant="destructive">
              Login Error
            </Button>
            <Button onClick={handleRegistrationSuccessDemo} className="w-full" variant="default">
              Registration Success
            </Button>
            <Button onClick={handleRegistrationErrorDemo} className="w-full" variant="destructive">
              Registration Error
            </Button>
            <Button onClick={handleSessionExpiredDemo} className="w-full" variant="outline">
              Session Expired
            </Button>
          </CardContent>
        </Card>

        {/* System Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>System & Validation</CardTitle>
            <CardDescription>System errors and validation messages</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={handleValidationErrorDemo} className="w-full" variant="destructive">
              Validation Error
            </Button>
            <Button onClick={handleNetworkErrorDemo} className="w-full" variant="destructive">
              Network Error
            </Button>
            <Button onClick={handleProfileUpdatedDemo} className="w-full" variant="default">
              Profile Updated
            </Button>
            <Button onClick={handleAppointmentScheduledDemo} className="w-full" variant="default">
              Appointment Scheduled
            </Button>
            <Button 
              onClick={() => notifications.dismissAll()} 
              className="w-full" 
              variant="outline"
            >
              Dismiss All
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Features</CardTitle>
          <CardDescription>Key features of our notification system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Visual Enhancements</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Gradient backgrounds with blur effects</li>
                <li>• Contextual icons and colors</li>
                <li>• Smooth animations and transitions</li>
                <li>• Progress bars for timed notifications</li>
                <li>• Dark/light theme support</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Smart Error Handling</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Specific error codes and types</li>
                <li>• Helpful suggestions and actions</li>
                <li>• Context-aware error messages</li>
                <li>• Retry mechanisms for network errors</li>
                <li>• Detailed validation feedback</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
