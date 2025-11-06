import {useQuery} from '@tanstack/react-query';
import {authService} from '@/api/services/auth.service';
import {queryKeys} from '../queryClient';

/**
 * Auth Status Query
 * Wraps GET /auth/status
 * Always runs on app start to check authentication status
 */
export const useAuthStatusQuery = (token: string | null | undefined) => {
  return useQuery({
    // include token in the key so it refetches when token changes
    queryKey: [...queryKeys.auth.session, token] as const,
    queryFn: () => authService.getStatus(),
    enabled: !!token, // Only run if we have a token
    retry: false, // Don't retry on failure - just show login screen
  });
};


