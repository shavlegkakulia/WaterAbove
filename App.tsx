/**
 * WaterAbove App
 * @format
 */
import 'react-native-gesture-handler';
import React, { useEffect, useRef } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/api/query';
import { RootNavigator, navigationRef } from '@/navigation';
// no-op import removed
import { useAtomValue, useSetAtom } from 'jotai';
import { authTokenAtom, userAtom, isAuthenticatedAtom } from '@/store/atoms';
import { useAuthStatusQuery } from '@/api/query';
import { setAuthToken as setAxiosAuthToken } from '@/api';
import { Toast } from '@/components';

// Development tools
if (__DEV__) {
  // Initialize Reactotron
  require('./src/config/reactotron').default;

  // Setup Reactotron Query Logger
  const { createReactotronQueryLogger } = require('./src/config/reactotron');
  createReactotronQueryLogger(queryClient);
}

// Runs inside QueryClientProvider so hooks can use React Query context
const BootstrapAuth: React.FC = () => {
  const token = useAtomValue(authTokenAtom);
  const setUser = useSetAtom(userAtom);
  const setIsAuthenticated = useSetAtom(isAuthenticatedAtom);
  const setToken = useSetAtom(authTokenAtom);
  const hasNavigatedRef = useRef(false);
  const [navReady, setNavReady] = React.useState(false);

  // Listen for navigation ready state
  React.useEffect(() => {
    const checkReady = () => {
      if (navigationRef.current?.isReady()) {
        setNavReady(true);
        return true;
      }
      return false;
    };

    // Check immediately
    if (checkReady()) {
      return;
    }

    // Also check periodically until ready
    const interval = setInterval(() => {
      if (checkReady()) {
        clearInterval(interval);
      }
    }, 100);

    // Cleanup after 5 seconds max
    const timeout = setTimeout(() => {
      clearInterval(interval);
      checkReady();
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  // Attach token (if any) before query
  useEffect(() => {
    setAxiosAuthToken(token || null);
  }, [token]);

  const { data, isLoading } = useAuthStatusQuery(token);

  useEffect(() => {
    console.log('[BootstrapAuth] useEffect triggered', {
      hasNavigated: hasNavigatedRef.current,
      isNavigationReady: navReady,
      token: token ? 'exists' : 'null',
      isLoading,
      hasData: !!data,
    });

    // Only run once on app start
    if (hasNavigatedRef.current) {
      console.log('[BootstrapAuth] Already navigated, skipping');
      return;
    }

    // Wait for navigation to be ready
    if (!navReady) {
      console.log('[BootstrapAuth] Navigation not ready yet');
      return;
    }

    // If no token, skip query and go directly to Login
    if (!token) {
      console.log('[BootstrapAuth] No token, navigating to Login');
      hasNavigatedRef.current = true;
      setIsAuthenticated(false);
      navigationRef.current?.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
      return;
    }

    // Still loading - stay on Initializing screen
    if (isLoading) {
      console.log('[BootstrapAuth] Query still loading');
      return;
    }

    // Mark as navigated to prevent future runs
    hasNavigatedRef.current = true;
    console.log('[BootstrapAuth] Processing data and navigating');

    // Check status response
    if (data?.success && data.data) {
      const { tokens, user: apiUser } = data.data;

      // Update tokens if available
      if (tokens?.accessToken) {
        setToken(tokens.accessToken);
        setAxiosAuthToken(tokens.accessToken);
      }

      // Update user if available
      if (apiUser) {
        setUser({
          id: apiUser.id || '',
          email: apiUser.email || '',
          name: apiUser.fullName || apiUser.username || undefined,
          avatar: apiUser.profile?.avatarUrl || undefined,
        });
      }

      // Navigate based on user status
      const email = apiUser?.email;
      const isVerified = apiUser?.isVerified === true;
      const hasPassword = apiUser?.hasPassword === true;
      const hasUsername = !!apiUser?.username;
      const hasUserLocation = !!apiUser?.userLocation;

      if (email && isVerified && !hasPassword) {
        // User is verified but doesn't have password - go to PasswordSetup
        navigationRef.current?.reset({
          index: 0,
          routes: [{ name: 'PasswordSetup', params: { email } }],
        });
      } else if (isVerified && hasPassword) {
        // User is verified and has password - authenticated
        setIsAuthenticated(true);
        
        // Check if user has username but no location
        if (hasUsername && !hasUserLocation) {
          // Navigate to LocationPersonalization screen
          navigationRef.current?.reset({
            index: 0,
            routes: [
              {
                name: 'LocationPersonalization',
                params: { email: email || '' },
              },
            ],
          });
        } else {
          // Navigate to Personalization screen
          navigationRef.current?.reset({
            index: 0,
            routes: [
              {
                name: 'Personalization',
                params: { email: email || '' },
              },
            ],
          });
        }
      } else {
        // User is not verified or doesn't have password - go to Login
        setIsAuthenticated(false);
        navigationRef.current?.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      }
    } else {
      // No valid response - go to Login
      setIsAuthenticated(false);
      navigationRef.current?.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }
  }, [data, isLoading, token, navReady, setToken, setUser, setIsAuthenticated]);

  return null;
};

function App() {
  useEffect(() => {
    if (__DEV__ && console.tron) {
      console.tron.log('🚀 App Started');
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BootstrapAuth />
      <SafeAreaProvider>
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />
        <RootNavigator />
        <Toast />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

export default App;
