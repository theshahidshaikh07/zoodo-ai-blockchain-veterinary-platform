# Enhanced Notification System

This document describes the comprehensive notification system implemented for the Zoodo veterinary platform, featuring visually stunning notifications with smart error handling.

## Features

### 🎨 Visual Enhancements
- **Gradient Backgrounds**: Beautiful gradient backgrounds with blur effects
- **Contextual Icons**: Smart icons based on notification type and error codes
- **Smooth Animations**: Fluid transitions and animations
- **Progress Bars**: Visual progress indicators for timed notifications
- **Theme Support**: Full dark/light theme compatibility
- **Backdrop Blur**: Modern glass-morphism effects

### 🧠 Smart Error Handling
- **Error Codes**: Structured error codes (AUTH_001, REG_001, etc.)
- **Error Types**: Categorized error types (AUTHENTICATION, REGISTRATION, etc.)
- **Contextual Messages**: Helpful suggestions based on error type
- **Retry Actions**: Built-in retry mechanisms for network errors
- **Validation Feedback**: Detailed field-specific validation messages

## Components

### 1. NotificationService (`/lib/notification-service.ts`)
Central service for managing all notifications with methods for:
- Success notifications
- Error notifications with enhanced styling
- Warning notifications
- Info notifications
- Loading notifications
- Specific scenarios (login, registration, etc.)

### 2. Enhanced Toast (`/components/ui/enhanced-toast.tsx`)
Custom toast component with:
- Multiple variants (success, error, warning, info, loading)
- Progress indicators
- Custom styling
- Accessibility features

### 3. NotificationProvider (`/components/providers/NotificationProvider.tsx`)
Provider component that configures the toast system with:
- Theme integration
- Custom styling
- Position and behavior settings

### 4. useNotifications Hook (`/hooks/use-notifications.ts`)
React hook for easy access to notification methods throughout the app.

## Error Codes

### Authentication Errors
- `AUTH_001`: Invalid username or password
- `AUTH_002`: Account locked due to multiple failed attempts
- `AUTH_003`: Account is disabled
- `AUTH_004`: Account is not verified
- `AUTH_005`: Authentication token has expired
- `AUTH_006`: Invalid authentication token
- `AUTH_007`: Session has expired

### Registration Errors
- `REG_001`: Username already exists
- `REG_002`: Email address already exists
- `REG_003`: License number already exists
- `REG_004`: Facility license number already exists
- `REG_005`: Government registration number already exists
- `REG_006`: Tax ID already exists
- `REG_007`: Invalid email format
- `REG_008`: Password does not meet security requirements
- `REG_009`: Passwords do not match
- `REG_010`: Required field is missing

### Validation Errors
- `VAL_001`: Invalid input provided
- `VAL_002`: File size exceeds maximum limit
- `VAL_003`: Invalid file type
- `VAL_004`: Invalid date format
- `VAL_005`: Invalid phone number format
- `VAL_006`: Invalid postal code format

### Business Logic Errors
- `BIZ_001`: Appointment not found
- `BIZ_002`: Pet not found
- `BIZ_003`: User not found
- `BIZ_004`: Provider is not available at the requested time
- `BIZ_005`: Appointment already exists at this time
- `BIZ_006`: Insufficient permissions to perform this action

### System Errors
- `SYS_001`: Internal server error
- `SYS_002`: Database operation failed
- `SYS_003`: File upload failed
- `SYS_004`: External service unavailable
- `SYS_005`: Network connection error

## Usage Examples

### Basic Notifications
```typescript
import { useNotifications } from '@/hooks/use-notifications';

function MyComponent() {
  const notifications = useNotifications();

  const handleSuccess = () => {
    notifications.success({
      title: 'Success!',
      description: 'Operation completed successfully.',
      type: 'update',
    });
  };

  const handleError = () => {
    notifications.error({
      title: 'Error',
      description: 'Something went wrong.',
      errorDetails: {
        code: 'SYS_001',
        type: 'SYSTEM',
      },
    });
  };
}
```

### Authentication Notifications
```typescript
// Login success
notifications.loginSuccess('John Doe');

// Login error
notifications.loginError({
  code: 'AUTH_001',
  type: 'AUTHENTICATION',
});

// Registration success
notifications.registrationSuccess('pet_owner');

// Registration error
notifications.registrationError({
  code: 'REG_001',
  type: 'REGISTRATION',
});
```

### Validation Notifications
```typescript
// Field validation error
notifications.validationError('Email', 'Please enter a valid email address');

// Network error with retry
notifications.networkError();
```

## Backend Integration

### Enhanced ApiResponse
The backend now returns structured error responses:
```json
{
  "success": false,
  "message": "Username already exists",
  "error": "Username already exists",
  "errorCode": "REG_001",
  "errorType": "REGISTRATION",
  "details": null
}
```

### Global Exception Handler
Automatic error handling with proper HTTP status codes and structured responses.

## Demo

Visit `/notification-demo` to see all notification types in action and test the system.

## Styling

The notification system uses:
- Tailwind CSS for styling
- CSS gradients for backgrounds
- Backdrop blur effects
- Custom animations
- Theme-aware colors
- Responsive design

## Accessibility

- ARIA labels and descriptions
- Keyboard navigation support
- Screen reader compatibility
- High contrast support
- Focus management

## Performance

- Optimized animations
- Efficient re-renders
- Lazy loading of notification components
- Memory leak prevention
- Debounced actions

## Browser Support

- Modern browsers with CSS Grid and Flexbox support
- Backdrop filter support (with fallbacks)
- ES6+ JavaScript features
- CSS custom properties support
