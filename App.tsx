/**
 * WaterAbove App
 * @format
 */
import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {QueryClientProvider} from '@tanstack/react-query';
import {queryClient} from '@/api/query';
import {RootNavigator} from '@/navigation';
// no-op import removed
import {useAtomValue, useSetAtom} from 'jotai';
import {authTokenAtom, userAtom, isAuthenticatedAtom} from '@/store/atoms';
import {useAuthStatusQuery} from '@/api/query';
import {setAuthToken as setAxiosAuthToken} from '@/api';

// Development tools
if (__DEV__) {
  // Initialize Reactotron
  require('./src/config/reactotron').default;
  
  // Setup Reactotron Query Logger
  const {createReactotronQueryLogger} = require('./src/config/reactotron');
  createReactotronQueryLogger(queryClient);
}

// Runs inside QueryClientProvider so hooks can use React Query context
const BootstrapAuth: React.FC = () => {
  const token = useAtomValue(authTokenAtom);
  const setUser = useSetAtom(userAtom);
  const setIsAuthenticated = useSetAtom(isAuthenticatedAtom);
  const setToken = useSetAtom(authTokenAtom);

  // Attach token (if any) before query
  useEffect(() => {
    setAxiosAuthToken(token || null);
  }, [token]);

  const {data} = useAuthStatusQuery(token);

  useEffect(() => {
    if (!data) return;
    if (data.success && data.data?.authenticated) {
      const nextToken = data.data.accessToken || token || null;
      if (nextToken) {
        setToken(nextToken);
        setAxiosAuthToken(nextToken);
      }
      if (data.data.user) setUser(data.data.user);
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [data, setIsAuthenticated, setToken, setUser, token]);

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
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <RootNavigator />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

export default App;
