import { useQuery } from '@tanstack/react-query';
import { locationService } from '@/api/services/location.service';
import { queryKeys } from '../queryClient';
import type { LocationAutocompleteRequest } from '@/api/types';

/**
 * Location Autocomplete Query
 * 
 * @example
 * const { data, isLoading, error } = useLocationAutocompleteQuery('tbilisi', 8);
 * 
 * if (isLoading) return <Loading />;
 * if (error) return <Error />;
 * return <Suggestions cities={data?.data?.cities} />;
 */
export const useLocationAutocompleteQuery = (
  query: string,
  limit: number = 8,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: queryKeys.locations.autocomplete(query, limit),
    queryFn: async () => {
      const request: LocationAutocompleteRequest = {
        input: query.trim(),
        limit,
      };
      return locationService.autocomplete(request);
    },
    enabled: enabled && !!query.trim() && query.trim().length >= 1,
    staleTime: 5 * 60 * 1000, // 5 minutes - locations don't change often
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

