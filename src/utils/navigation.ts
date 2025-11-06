import type { ApiUser } from '@/api/types';
import type { RootStackParamList } from '@/navigation/types';

type RouteName = keyof RootStackParamList;
type RouteParams<T extends RouteName> = RootStackParamList[T];

export interface NavigationRoute {
  name: RouteName;
  params?: RouteParams<RouteName>;
}

/**
 * Determines the appropriate navigation route based on user's authentication status
 * and profile completion state.
 *
 * Flow:
 * 1. Email verification → Verification/EmailCode
 * 2. Password setup → PasswordSetup
 * 3. Username setup → Personalization
 * 4. Location setup → LocationPersonalization
 * 5. All complete → Personalization
 *
 * @param apiUser - The user data from API
 * @returns Navigation route configuration
 */
export function getInitialNavigationRoute(
  apiUser: ApiUser | null | undefined,
): NavigationRoute {
  // No user data - go to Login
  if (!apiUser) {
    return { name: 'Login' };
  }

  const email = apiUser.email || '';
  const isVerified = apiUser.isVerified === true;
  const hasPassword = apiUser.hasPassword === true;
  const hasUsername = !!apiUser.username;
  const hasUserLocation = !!apiUser.userLocation;

  // Step 1: Email verification
  if (!isVerified) {
    return { name: 'Verification' };
  }

  // Step 2: Password setup
  if (isVerified && !hasPassword) {
    if (!email) {
      return { name: 'Login' };
    }
    return { name: 'PasswordSetup', params: { email } };
  }

  // Step 3: Username setup (Personalization screen handles username)
  if (isVerified && hasPassword && !hasUsername) {
    if (!email) {
      return { name: 'Login' };
    }
    return { name: 'Personalization', params: { email } };
  }

  // Step 4: Location setup
  if (isVerified && hasPassword && hasUsername && !hasUserLocation) {
    if (!email) {
      return { name: 'Login' };
    }
    return { name: 'LocationPersonalization', params: { email } };
  }

  // Step 5: Profile personalization (after location is set)
  // Check if profile needs completion (zodiacSign, gender, purpose, etc.)
  // Profile is considered complete if it has at least zodiacSign OR gender OR purpose
  const hasZodiacSign = !!apiUser.profile?.zodiacSign;
  const hasGender = !!apiUser.profile?.gender;
  const hasPurpose = !!(
    apiUser.profile?.purpose && 
    Array.isArray(apiUser.profile.purpose) && 
    apiUser.profile.purpose.length > 0
  );
  const hasProfilePersonalization = hasZodiacSign || hasGender || hasPurpose;
  
  // If location exists but profile personalization is not complete, go to ProfilePersonalization
  if (isVerified && hasPassword && hasUsername && hasUserLocation && !hasProfilePersonalization) {
    if (!email) {
      return { name: 'Login' };
    }
    return { name: 'ProfilePersonalization', params: { 
      email,
      profileCompletionPercentage: apiUser.profile?.profileCompletionPercentage || undefined,
      userProfile: apiUser.profile || undefined,
    } };
  }
  
  // If both location and profile personalization exist, allow editing on ProfilePersonalization
  if (isVerified && hasPassword && hasUsername && hasUserLocation && hasProfilePersonalization) {
    if (!email) {
      return { name: 'Login' };
    }
    // Allow editing profile personalization even if it exists
    return { name: 'ProfilePersonalization', params: { 
      email,
      profileCompletionPercentage: apiUser.profile?.profileCompletionPercentage || undefined,
      userProfile: apiUser.profile || undefined,
    } };
  }

  // Fallback to Login
  return { name: 'Login' };
}
