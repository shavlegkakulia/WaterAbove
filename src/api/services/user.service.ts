import {apiClient} from '../client';
import {API_ENDPOINTS} from '../endpoints';
import type {
  User,
  UpdateProfileRequest,
  CheckUsernameAvailabilityRequest,
  CheckUsernameAvailabilityResponse,
  AcceptTermsRequest,
  AcceptTermsResponse,
  UpdateUserRequest,
  UpdateUserResponse,
} from '../types';

/**
 * User Service
 * All user-related API calls
 */
export const userService = {
  /**
   * Get current user profile
   */
  getMe: async (): Promise<User> => {
    const response = await apiClient.get(API_ENDPOINTS.USER.ME);
    return response.data;
  },

  /**
   * Get user profile by ID
   */
  getProfile: async (userId: string): Promise<User> => {
    const response = await apiClient.get(`${API_ENDPOINTS.USER.PROFILE}/${userId}`);
    return response.data;
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: UpdateProfileRequest): Promise<User> => {
    const response = await apiClient.put(API_ENDPOINTS.USER.UPDATE, data);
    return response.data;
  },

  /**
   * Upload user avatar
   */
  uploadAvatar: async (file: FormData): Promise<{avatarUrl: string}> => {
    const response = await apiClient.post(API_ENDPOINTS.USER.AVATAR, file, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Delete user account
   */
  deleteAccount: async (): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.USER.DELETE);
  },

  /**
   * Check if username is available
   */
  checkUsernameAvailability: async (data: CheckUsernameAvailabilityRequest): Promise<CheckUsernameAvailabilityResponse> => {
    const response = await apiClient.post(API_ENDPOINTS.USER.CHECK_USERNAME_AVAILABILITY, data);
    return response.data;
  },

  /**
   * Accept terms and conditions
   */
  acceptTerms: async (data: AcceptTermsRequest): Promise<AcceptTermsResponse> => {
    const response = await apiClient.post(API_ENDPOINTS.USER.ACCEPT_TERMS, data);
    return response.data;
  },

  /**
   * Update user profile (new format)
   */
  updateUser: async (data: UpdateUserRequest): Promise<UpdateUserResponse> => {
    const response = await apiClient.post(API_ENDPOINTS.USER.UPDATE, data);
    return response.data;
  },
};

