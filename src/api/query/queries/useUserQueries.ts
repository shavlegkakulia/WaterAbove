import {useQuery} from '@tanstack/react-query';
import {userService} from '@/api/services/user.service';
import {queryKeys} from '../queryClient';

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
    queryFn: () => userService.getMe(),
    // Only fetch if user is authenticated
    // You can add enabled condition based on auth state
  });
};

/**
 * Get User Profile Query
 * 
 * @example
 * const { data: profile } = useUserProfileQuery(userId);
 */
export const useUserProfileQuery = (userId: string) => {
  return useQuery({
    queryKey: queryKeys.user.profile,
    queryFn: () => userService.getProfile(userId),
    enabled: !!userId, // Only fetch if userId exists
  });
};

