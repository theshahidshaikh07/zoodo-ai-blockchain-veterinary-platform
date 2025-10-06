/**
 * Utility functions for handling OAuth data
 */

export interface OAuthUserData {
  email: string;
  firstName: string;
  lastName: string;
  picture?: string;
}

/**
 * Get OAuth user data from session storage
 * @returns OAuth user data or null if not found
 */
export function getOAuthUserData(): OAuthUserData | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const oauthData = sessionStorage.getItem('oauth_user_data');
    if (oauthData) {
      return JSON.parse(oauthData) as OAuthUserData;
    }
  } catch (error) {
    console.error('Failed to parse OAuth user data:', error);
  }

  return null;
}

/**
 * Clear OAuth user data from session storage
 */
export function clearOAuthUserData(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('oauth_user_data');
  }
}

/**
 * Get OAuth redirect URL from session storage
 * @returns Redirect URL or null if not found
 */
export function getOAuthRedirectUrl(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return sessionStorage.getItem('oauth_redirect');
}

/**
 * Clear OAuth redirect URL from session storage
 */
export function clearOAuthRedirectUrl(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('oauth_redirect');
  }
}
