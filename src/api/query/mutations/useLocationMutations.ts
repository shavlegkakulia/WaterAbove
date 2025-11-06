import { useMutation } from '@tanstack/react-query';
import { locationService } from '@/api/services/location.service';
import type {
  LocationMemberCountsRequest,
  LocationMemberCountsApiResponse,
  UpdateUserLocationRequest,
  UpdateUserLocationApiResponse,
} from '@/api/types';

/**
 * Location Member Counts Mutation
 * 
 * @example
 * const memberCountsMutation = useLocationMemberCountsMutation();
 * 
 * memberCountsMutation.mutate(
 *   { cityId: '...', countryId: '...', regionId: '...', continentId: '...' },
 *   {
 *     onSuccess: (response) => console.log(response.data),
 *   }
 * );
 */
export const useLocationMemberCountsMutation = () => {
  return useMutation<LocationMemberCountsApiResponse, any, LocationMemberCountsRequest>({
    mutationFn: (data: LocationMemberCountsRequest) => locationService.getMemberCounts(data),
  });
};

/**
 * Update User Location Mutation
 * 
 * @example
 * const updateLocationMutation = useUpdateUserLocationMutation();
 * 
 * updateLocationMutation.mutate(
 *   {
 *     cityId: '...',
 *     countryId: '...',
 *     regionId: '...',
 *     continentId: '...',
 *     showOnProfile: true,
 *     subscribeToMemberMap: true,
 *     subscribeToContinentGroup: true,
 *     subscribeToCountryGroup: true,
 *     subscribeToRegionGroup: true,
 *     subscribeToCityGroup: true,
 *     formattedAddress: '...',
 *   },
 *   {
 *     onSuccess: (response) => console.log(response.data),
 *   }
 * );
 */
export const useUpdateUserLocationMutation = () => {
  return useMutation<UpdateUserLocationApiResponse, any, UpdateUserLocationRequest>({
    mutationFn: (data: UpdateUserLocationRequest) => locationService.updateUserLocation(data),
  });
};

