import Reactotron from 'reactotron-react-native';
import {QueryClient} from '@tanstack/react-query';

/**
 * Reactotron Configuration
 * 
 * Development tool for:
 * - Network monitoring
 * - State inspection
 * - Custom logging
 * - Performance tracking
 */

declare global {
  interface Console {
    tron: typeof Reactotron;
  }
}

let reactotronInstance: typeof Reactotron | null = null;

// Only configure in development
if (__DEV__) {
  reactotronInstance = Reactotron.configure({
    name: 'WaterAbove',
    host: 'localhost', // Your machine's IP if testing on real device
  })
    .useReactNative({
      asyncStorage: false, // if you want to see AsyncStorage
      networking: {
        // Track network requests
        ignoreUrls: /symbolicate/, // Ignore React Native symbolication
      },
      editor: false, // Set to true to open errors in your editor
      errors: {veto: () => false}, // Log all errors
      overlay: false, // Disable overlay
    })
    .connect();

  // Attach to console for easy access
  console.tron = reactotronInstance;

  /**
   * Custom Loggers
   */
  reactotronInstance.log = (...args: any[]) => {
    reactotronInstance!.display({
      name: '📝 Log',
      value: args,
      preview: args.join(' '),
    });
  };

  reactotronInstance.warn = (...args: any[]) => {
    reactotronInstance!.display({
      name: '⚠️ Warning',
      value: args,
      preview: args.join(' '),
      important: true,
    });
  };

  reactotronInstance.error = (...args: any[]) => {
    reactotronInstance!.display({
      name: '🔴 Error',
      value: args,
      preview: args.join(' '),
      important: true,
    });
  };
}

/**
 * Custom TanStack Query Logger
 * Logs all query/mutation events to Reactotron
 */
export const createReactotronQueryLogger = (queryClient: QueryClient) => {
  if (!__DEV__ || !reactotronInstance) return;
  
  const reactotron = reactotronInstance;

  queryClient.getQueryCache().subscribe((event) => {
    if (event?.type === 'updated' && event?.action?.type === 'success') {
      reactotron.display({
        name: '🔄 Query Success',
        value: {
          queryKey: event.query.queryKey,
          data: event.query.state.data,
        },
        preview: `✅ ${JSON.stringify(event.query.queryKey)}`,
      });
    }

    if (event?.type === 'updated' && event?.action?.type === 'error') {
      reactotron.display({
        name: '❌ Query Error',
        value: {
          queryKey: event.query.queryKey,
          error: event.query.state.error,
        },
        preview: `❌ ${JSON.stringify(event.query.queryKey)}`,
        important: true,
      });
    }
  });

  queryClient.getMutationCache().subscribe((event) => {
    if (event?.type === 'updated' && event?.action?.type === 'success') {
      reactotron.display({
        name: '✨ Mutation Success',
        value: {
          mutationId: event.mutation.mutationId,
          variables: event.mutation.state.variables,
          data: event.mutation.state.data,
        },
        preview: `✨ Mutation #${event.mutation.mutationId}`,
      });
    }

    if (event?.type === 'updated' && event?.action?.type === 'error') {
      reactotron.display({
        name: '💥 Mutation Error',
        value: {
          mutationId: event.mutation.mutationId,
          variables: event.mutation.state.variables,
          error: event.mutation.state.error,
        },
        preview: `💥 Mutation #${event.mutation.mutationId}`,
        important: true,
      });
    }
  });
};

export default reactotronInstance || Reactotron;

