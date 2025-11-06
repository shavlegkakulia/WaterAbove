import { apiClient } from '../client';
import { API_ENDPOINTS } from '../endpoints';
import type {
  LocationAutocompleteRequest,
  LocationAutocompleteApiResponse,
  LocationMemberCountsRequest,
  LocationMemberCountsApiResponse,
  UpdateUserLocationRequest,
  UpdateUserLocationApiResponse,
} from '../types';

/**
 * Location Service
 * All location-related API calls
 */
export const locationService = {
  /**
   * Autocomplete location search
   */
  autocomplete: async (
    data: LocationAutocompleteRequest,
  ): Promise<LocationAutocompleteApiResponse> => {
    const response = await apiClient.post<LocationAutocompleteApiResponse>(
      API_ENDPOINTS.LOCATIONS.AUTOCOMPLETE,
      data,
    );
    return response.data;
  },

  /**
   * Get member counts for location hierarchy
   */
  getMemberCounts: async (
    data: LocationMemberCountsRequest,
  ): Promise<LocationMemberCountsApiResponse> => {
    const response = await apiClient.post<LocationMemberCountsApiResponse>(
      API_ENDPOINTS.LOCATIONS.MEMBER_COUNTS,
      data,
    );
    return response.data;
  },

  /**
   * Update user location preferences
   */
  updateUserLocation: async (
    data: UpdateUserLocationRequest,
  ): Promise<UpdateUserLocationApiResponse> => {
    const response = await apiClient.post<UpdateUserLocationApiResponse>(
      API_ENDPOINTS.LOCATIONS.UPDATE_USER_LOCATION,
      data,
    );
    return response.data;
  },
};

