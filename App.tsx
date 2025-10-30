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

// Development tools
if (__DEV__) {
  // Initialize Reactotron
  require('./src/config/reactotron').default;
  
  // Setup Reactotron Query Logger
  const {createReactotronQueryLogger} = require('./src/config/reactotron');
  createReactotronQueryLogger(queryClient);
}

function App() {
  useEffect(() => {
    if (__DEV__ && console.tron) {
      console.tron.log('🚀 App Started');
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <RootNavigator />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

export default App;
