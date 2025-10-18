/**
 * Utility functions for dashboard routing and user type handling
 */

export type UserType = 'pet_owner' | 'veterinarian' | 'trainer' | 'hospital' | 'clinic' | 'admin';

/**
 * Get the appropriate dashboard route for a user type
 * @param userType - The user type
 * @returns The dashboard route path
 */
export function getDashboardRoute(userType: UserType | string): string {
  // Normalize the userType to handle both backend format (PET_OWNER) and frontend format (pet_owner)
  const normalizedUserType = userType.toLowerCase();
  
  switch (normalizedUserType) {
    case 'pet_owner':
      return '/dashboard/pet-owner';
    case 'veterinarian':
      return '/dashboard/veterinarian';
    case 'trainer':
      return '/dashboard/trainer';
    case 'hospital':
    case 'clinic':
      return '/dashboard/hospital';
    case 'admin':
      return '/dashboard/admin';
    default:
      return '/dashboard';
  }
}

/**
 * Get the display name for a user type
 * @param userType - The user type
 * @returns The display name
 */
export function getUserTypeDisplayName(userType: UserType): string {
  switch (userType) {
    case 'pet_owner':
      return 'Pet Owner';
    case 'veterinarian':
      return 'Veterinarian';
    case 'trainer':
      return 'Trainer';
    case 'hospital':
      return 'Hospital';
    case 'clinic':
      return 'Clinic';
    case 'admin':
      return 'Administrator';
    default:
      return 'User';
  }
}

/**
 * Check if a user type is a service provider
 * @param userType - The user type
 * @returns True if the user type is a service provider
 */
export function isServiceProvider(userType: UserType): boolean {
  return ['veterinarian', 'trainer', 'hospital', 'clinic'].includes(userType);
}

/**
 * Check if a user type is a pet owner
 * @param userType - The user type
 * @returns True if the user type is a pet owner
 */
export function isPetOwner(userType: UserType): boolean {
  return userType === 'pet_owner';
}

/**
 * Check if a user type is an admin
 * @param userType - The user type
 * @returns True if the user type is an admin
 */
export function isAdmin(userType: UserType): boolean {
  return userType === 'admin';
}
