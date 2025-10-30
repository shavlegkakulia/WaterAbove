import {QueryClient} from '@tanstack/react-query';

/**
 * React Query Client Configuration
 * 
 * Global configuration for TanStack Query (React Query)
 */

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: How long data is considered fresh (5 minutes)
      staleTime: 5 * 60 * 1000,
      
      // Cache time: How long inactive data stays in cache (10 minutes)
      gcTime: 10 * 60 * 1000,
      
      // Retry failed requests
      retry: 2,
      
      // Retry delay (exponential backoff)
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Refetch on window focus (good for mobile when app comes to foreground)
      refetchOnWindowFocus: false,
      
      // Refetch on reconnect
      refetchOnReconnect: true,
      
      // Refetch on mount
      refetchOnMount: true,
    },
    mutations: {
      // Retry mutations once on failure
      retry: 1,
      
      // Retry delay for mutations
      retryDelay: 1000,
    },
  },
});

/**
 * Query Keys
 * Centralized query keys for cache management
 */
export const queryKeys = {
  // Auth
  auth: {
    user: ['auth', 'user'] as const,
    session: ['auth', 'session'] as const,
  },
  
  // User
  user: {
    profile: ['user', 'profile'] as const,
    me: ['user', 'me'] as const,
  },
  
  // Posts (example)
  posts: {
    all: ['posts'] as const,
    list: (filters?: any) => ['posts', 'list', filters] as const,
    detail: (id: string) => ['posts', 'detail', id] as const,
  },
  
  // Add more as needed...
} as const;

