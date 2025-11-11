import { useQuery } from '@tanstack/react-query';
import { authService } from '@/api/services/auth.service';
import { queryKeys } from '../queryClient';

/**
 * Get Current User Query
 * 
 * @example
 * const { data: user, isLoading, error } = useUserQuery();
 * 
 * if (isLoading) return <Loading />;
 * if (error) return <Error />;
 * return <Profile user={user} />;
 */
export const useUserQuery = () => {
  return useQuery({
    queryKey: queryKeys.user.me,
    queryFn: () => authService.getStatus(),
    // Only fetch if user is authenticated
    // You can add enabled condition based on auth state
  });
};

