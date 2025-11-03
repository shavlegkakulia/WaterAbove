import {apiClient} from '../client';
import {API_ENDPOINTS} from '../endpoints';
import type {UploadImageResponse} from '../types';

/**
 * Upload Service
 * Handles file uploads
 */
export const uploadService = {
  /**
   * Upload image file
   * Note: For FormData, axios automatically sets Content-Type with boundary
   * We should NOT manually set Content-Type header
   */
  uploadImage: async (file: FormData): Promise<UploadImageResponse> => {
    const response = await apiClient.post(API_ENDPOINTS.UPLOAD.IMAGE, file, {
      headers: {
        // Don't set Content-Type - let axios handle it automatically for FormData
        // It will set: 'multipart/form-data; boundary=...'
      },
      transformRequest: (data) => {
        // Return FormData as-is - axios will handle it
        return data;
      },
    });
    return response.data;
  },
};

