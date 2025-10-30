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
  // Test Endpoints
  TEST: {
    APP: '/test/app',
    PAYMENT: '/test/payment',
  },

  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh',
    VERIFY_EMAIL: '/auth/verify-email',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    CHANGE_PASSWORD: '/auth/change-password',
  },

  // User
  USER: {
    ME: '/user/me',
    PROFILE: '/user/profile',
    UPDATE: '/user/update',
    AVATAR: '/user/avatar',
    DELETE: '/user/delete',
  },

  // Config
  CONFIG: {
    APP: '/config/app',
    DEVICE: '/config/device',
    FEATURES: '/config/features',
  },

  // Notifications
  NOTIFICATIONS: {
    LIST: '/notifications',
    READ: (id: string) => `/notifications/${id}/read`,
    READ_ALL: '/notifications/read-all',
    SETTINGS: '/notifications/settings',
  },

  // Example: Posts/Content
  POSTS: {
    LIST: '/posts',
    DETAIL: (id: string) => `/posts/${id}`,
    CREATE: '/posts',
    UPDATE: (id: string) => `/posts/${id}`,
    DELETE: (id: string) => `/posts/${id}`,
    LIKE: (id: string) => `/posts/${id}/like`,
    UNLIKE: (id: string) => `/posts/${id}/unlike`,
  },
} as const;

