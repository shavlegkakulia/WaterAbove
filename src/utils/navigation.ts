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
    return { name: 'LocationPersonalization' };
  }

  const profileCompletionPercentage =
    apiUser.profile?.profileCompletionPercentage ?? 0;
  const isProfileComplete =
    hasUserLocation && profileCompletionPercentage >= 100;

  if (!isProfileComplete) {
    return {
      name: 'LocationPersonalization',
      params: {
        userLocation: apiUser.userLocation ?? undefined,
        profileCompletionPercentage:
          apiUser.profile?.profileCompletionPercentage ?? undefined,
      },
    };
  }

  if (!email) {
    return { name: 'Login' };
  }

  // If profile is 100% complete and user is authenticated, go to ArchiveHome
  const isAuthenticated = isVerified && hasPassword;
  if (isAuthenticated && apiUser.profile?.profileCompletionPercentage === 100) {
    return {
      name: 'ArchiveHome',
    };
  }

  return {
    name: 'LifestylePersonalization',
    params: {
      email,
      profileCompletionPercentage:
        apiUser.profile?.profileCompletionPercentage ?? undefined,
      userProfile: apiUser.profile ?? undefined,
    },
  };
}
