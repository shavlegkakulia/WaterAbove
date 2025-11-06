/**
 * API Endpoints
 *
 * Base URL: https://b2aa9968f63a.ngrok.app/api/v1
 * Swagger Docs: https://b2aa9968f63a.ngrok.app/api/v1/docs
 *
 * Centralized place for all API endpoints
 * Note: Check Swagger docs for the latest endpoints as API is evolving
 */

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout', // TODO: Add logout params if needed
    REFRESH_TOKEN: '/auth/refresh',
    VERIFY_EMAIL: '/auth/send-email-verification',
    VERIFY_EMAIL_CODE: '/auth/verify-email',
    STATUS: '/auth/status',
    SEND_FORGOT_PASSWORD_EMAIL: '/auth/send-forgot-password-email',
    RESET_PASSWORD: '/auth/reset-password',
  },

  // User
  USER: {
    UPDATE: '/users/update',
    SET_PASSWORD: '/users/set-password',
    CHECK_USERNAME_AVAILABILITY: '/users/check-username-availability',
    ACCEPT_TERMS: '/users/accept-terms',
  },

  // Uploads
  UPLOAD: {
    IMAGE: '/uploads/image',
  },

  // Locations
  LOCATIONS: {
    AUTOCOMPLETE: '/locations/autocomplete',
    MEMBER_COUNTS: '/locations/member-counts',
    UPDATE_USER_LOCATION: '/locations/update-user-location',
  },
} as const;
