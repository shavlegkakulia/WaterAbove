import {useMutation} from '@tanstack/react-query';
import {userService, uploadService} from '@/api';
import type {
  CheckUsernameAvailabilityRequest,
  CheckUsernameAvailabilityResponse,
  AcceptTermsRequest,
  AcceptTermsResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  UploadImageResponse,
} from '@/api/types';

/**
 * Check Username Availability Mutation
 * 
 * @example
 * const checkUsernameMutation = useCheckUsernameAvailabilityMutation();
 * 
 * checkUsernameMutation.mutate(
 *   { username: 'john_doe' },
 *   {
 *     onSuccess: (response) => {
 *       if (!response.available) {
 *         console.log('Username is taken');
 *       }
 *     },
 *   }
 * );
 */
export const useCheckUsernameAvailabilityMutation = () => {
  return useMutation<CheckUsernameAvailabilityResponse, any, CheckUsernameAvailabilityRequest>({
    mutationFn: (data: CheckUsernameAvailabilityRequest) => 
      userService.checkUsernameAvailability(data),
  });
};

/**
 * Accept Terms Mutation
 */
export const useAcceptTermsMutation = () => {
  return useMutation<AcceptTermsResponse, any, AcceptTermsRequest>({
    mutationFn: (data: AcceptTermsRequest) => userService.acceptTerms(data),
  });
};

/**
 * Upload Image Mutation
 */
export const useUploadImageMutation = () => {
  return useMutation<UploadImageResponse, any, FormData>({
    mutationFn: (file: FormData) => uploadService.uploadImage(file),
  });
};

/**
 * Update User Mutation
 */
export const useUpdateUserMutation = () => {
  return useMutation<UpdateUserResponse, any, UpdateUserRequest>({
    mutationFn: (data: UpdateUserRequest) => userService.updateUser(data),
  });
};

