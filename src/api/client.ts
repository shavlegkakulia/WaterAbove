import axios, { AxiosRequestConfig } from 'axios';
import { env } from '@/config';
import { getDefaultStore } from 'jotai';
import {
  addToastAtom,
  authTokenAtom,
  refreshTokenAtom,
  tokenExpiryAtom,
} from '@/store/atoms';
import { authService } from './services/auth.service';
import { queryClient } from './query/queryClient';
import { storeAuthTokens, clearAuthTokens } from './utils/tokenStorage';
import {
  getWindowHeight,
  getWindowWidth,
  platformOS,
  platformVersion,
  selectPlatform,
} from '@/utils';

const SCREEN_WIDTH = getWindowWidth();
const SCREEN_HEIGHT = getWindowHeight();

// Get base URL from environment
const baseURL = env.API_BASE_URL;

// Token refresh buffer: refresh token if it expires within this time (in seconds)
const TOKEN_REFRESH_BUFFER_SECONDS = 120; // 2 minutes

// Authorization is handled exclusively via Bearer tokens set by setAuthToken

// Platform-specific params
const platformParams =
  selectPlatform({
  ios: { platform: 'ios' },
  android: { platform: 'android' },
  }) ?? {};

/**
 * Axios instance with pre-configured settings
 */
export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  params: platformParams,
  timeout: 15000, // 15 seconds
  validateStatus: status => {
    // Treat 401 as error so it goes to error handler, but allow other 4xx as success for custom handling
    if (status === 401) {
      return false; // This will trigger error handler
    }
    return status < 405; // Allow other status codes < 405 as success
  },
});

/**
 * Set authentication token for all requests
 */
export const setAuthToken = (token: string | null) => {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common.Authorization;
  }
};

// Token refresh state - prevent concurrent refresh requests
let refreshStarted = false;

/**
 * Request interceptor - Add metadata to all requests
 */
apiClient.interceptors.request.use(
  async (config: AxiosRequestConfig): Promise<any> => {
    // Ensure headers object exists
    if (!config.headers) {
      config.headers = {};
    }

    // Log headers for debugging (only for /auth/status)
    if (config.url?.includes('/auth/status')) {
      console.log('[Request Interceptor] /auth/status config:', {
        url: config.url,
        method: config.method,
        headers: config.headers,
        _skipTokenRefresh: (config.headers as any)?._skipTokenRefresh,
        configKeys: Object.keys(config),
      });
    }

    // Add timestamp
    config.headers['X-Request-Time'] = new Date().toISOString();

    // Add device info for non-GET requests
    // Skip metadata for FormData uploads (file uploads)
    const isFormData = config.data instanceof FormData;
    const shouldSkipMetadata = (config as any)._skipMetadata === true;

    if (config.method !== 'get' && !isFormData && !shouldSkipMetadata) {
      config.data = {
        ...config.data,
        _metadata: {
          platform: platformOS,
          platformVersion,
          screenWidth: SCREEN_WIDTH,
          screenHeight: SCREEN_HEIGHT,
          source: 'mobile_app',
        },
      };
    }

    // Remove Content-Type header for FormData to let axios set it with boundary
    if (isFormData) {
      delete config.headers['Content-Type'];
    }

    // Set Authorization header if token exists
    // Get token from atom (atomWithStorage automatically syncs with AsyncStorage)
    const store = getDefaultStore();
    const tokenPromise = store.get(authTokenAtom);
    let currentToken =
      tokenPromise instanceof Promise ? await tokenPromise : tokenPromise;

    // Skip token refresh check for auth endpoints to avoid infinite loops
    // Check for _skipTokenRefresh flag in headers (set by auth service methods)
    // Note: Headers can be strings or booleans depending on how axios processes them
    const skipTokenRefresh = 
      config.headers?._skipTokenRefresh ||
      (config.headers as any)?._skipTokenRefresh ||
      (config as any)?._skipTokenRefresh;
    const isAuthEndpoint = skipTokenRefresh === true || skipTokenRefresh === 'true';

    // Proactive token refresh: Check if token is expired or expiring soon (before requests)
    if (currentToken && !isAuthEndpoint && !refreshStarted) {
      // Get token expiry from atom (stored when token was received)
      // atomWithStorage may return a Promise, so we need to handle it
      let tokenExpiry: number | null = null;
      try {
        const expiryValue = store.get(tokenExpiryAtom);
        if (expiryValue instanceof Promise) {
          tokenExpiry = await expiryValue;
        } else {
          tokenExpiry = expiryValue;
        }
      } catch {
        tokenExpiry = null;
      }

      // Check if token is expired or expiring soon (buffer time)
      const now = Date.now(); // Current time in milliseconds
      const bufferMs = TOKEN_REFRESH_BUFFER_SECONDS * 1000; // Convert to milliseconds
      const isExpiringSoon = tokenExpiry
        ? now >= tokenExpiry - bufferMs
        : false;

      if (isExpiringSoon) {
        // Check if we have a refresh token before attempting refresh
        const refreshTokenPromise = store.get(refreshTokenAtom);
        const refreshToken =
          refreshTokenPromise instanceof Promise
            ? await refreshTokenPromise
            : refreshTokenPromise;

        // If no refresh token, skip refresh attempt
        if (!refreshToken) {
          console.log('[Request Interceptor] Token expiring soon but no refresh token available, skipping refresh');
          // Token will expire and request will fail with 401, which will be handled by response interceptor
        } else {
          refreshStarted = true;

          try {
            const response = await authService.refreshToken(refreshToken);

            if (response.success && response.data?.tokens?.accessToken) {
              const { tokens } = response.data;

              // Update tokens and expiry using storeAuthTokens helper
              storeAuthTokens(
                tokens.accessToken!,
                tokens.refreshToken || undefined,
                tokens.expiresIn || undefined,
              );

              // Use new token for this request
              currentToken = tokens.accessToken!;
            }
          } catch (refreshError: any) {
            console.error(
              '[Request Interceptor] Token refresh failed:',
              refreshError,
            );
            // Clear tokens on refresh failure
            clearAuthTokens();
            queryClient.clear();
          } finally {
            refreshStarted = false;
          }
        }
      }
    }

    if (currentToken) {
      config.headers.Authorization = `Bearer ${currentToken}`;
    }

    return config;
  },
  error => {
    console.log('error.response?.status', error.response?.status);

    return Promise.reject(error);
  },
);

/**
 * Response interceptor - Handle errors globally
 */
apiClient.interceptors.response.use(
  response => {
    // 401 should not reach here anymore because validateStatus returns false for 401
    // But keep this check just in case
    if (response.status === 401) {
      console.log('[Response Interceptor] WARNING: 401 reached success handler, this should not happen');
    }

    // Log successful responses in development
    if (__DEV__ && console.tron) {
      console.tron.display({
        name: '✅ API Response',
        value: {
          url: response.config.url,
          method: response.config.method?.toUpperCase(),
          status: response.status,
          data: response.data,
        },
        preview: `${response.config.method?.toUpperCase()} ${
          response.config.url
        }`,
      });
    }
    return response;
  },
  async error => {
    console.log('[Response Interceptor] Error handler called', {
      status: error.response?.status,
      url: error.config?.url,
      hasConfig: !!error.config,
      errorType: error?.constructor?.name,
      isAxiosError: error?.isAxiosError,
      hasResponse: !!error?.response,
      message: error?.message,
    });
    
    const originalRequest = error.config;
    const store = getDefaultStore();

    // Log errors in development
    if (__DEV__ && console.tron) {
      console.tron.display({
        name: '❌ API Error',
        value: {
          url: error.config?.url,
          method: error.config?.method?.toUpperCase(),
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        },
        preview: `${error.config?.method?.toUpperCase()} ${
          error.config?.url
        } - ${error.response?.status || 'Network Error'}`,
        important: true,
      });
    }
    
    // Handle 401 Unauthorized - Try to refresh token and retry request
    if (error.response?.status === 401 && originalRequest) {
      // Check if this is an auth endpoint (skip token refresh)
      // Headers can be strings or booleans depending on how axios processes them
      const skipTokenRefresh = 
        originalRequest.headers?._skipTokenRefresh ||
        (originalRequest.headers as any)?._skipTokenRefresh ||
        (originalRequest as any)?._skipTokenRefresh;
      const isAuthEndpoint = skipTokenRefresh === true || skipTokenRefresh === 'true';
      
      console.log('[Response Interceptor] 401 handling started', {
        url: originalRequest.url,
        isAuthEndpoint,
        hasRetry: !!originalRequest._retry,
        headers: originalRequest.headers,
      });
      
      // Prevent infinite retry loop
      if (originalRequest._retry) {
        // Already tried to refresh, clear tokens and redirect to login
        const {navigationRef} = await import('@/navigation');
        console.log('[Response Interceptor] Already tried refresh, clearing tokens and redirecting to login');
        clearAuthTokens();
        queryClient.clear();
        
        // Navigate to login screen
        if (navigationRef.current?.isReady()) {
          navigationRef.current.reset({
            index: 0,
            routes: [{name: 'Login'}],
          });
        }
        
        return Promise.reject(error);
      }

      // Don't try to refresh for auth endpoints
      if (isAuthEndpoint) {
        console.log('[Response Interceptor] Skipping refresh for auth endpoint');
        return Promise.reject(error);
      }

      // Check if we have a refresh token before attempting refresh
      const refreshTokenPromise = store.get(refreshTokenAtom);
      const refreshToken =
        refreshTokenPromise instanceof Promise
          ? await refreshTokenPromise
          : refreshTokenPromise;

      console.log('[Response Interceptor] Refresh token exists:', !!refreshToken);

      // If no refresh token, clear tokens and redirect to login
      if (!refreshToken) {
        console.log('[Response Interceptor] No refresh token available, clearing tokens and redirecting to login');
        const {navigationRef} = await import('@/navigation');
        
        clearAuthTokens();
        queryClient.clear();
        
        // Navigate to login screen
        if (navigationRef.current?.isReady()) {
          navigationRef.current.reset({
            index: 0,
            routes: [{name: 'Login'}],
          });
        }
        
        return Promise.reject(error);
      }

      // Try to refresh token (we already checked refreshToken exists above)
      originalRequest._retry = true;
      console.log('[Response Interceptor] Starting token refresh...');

      try {
        console.log('[Response Interceptor] Calling refreshToken service...');
        const refreshResponse = await authService.refreshToken(refreshToken);
        console.log('[Response Interceptor] Refresh response:', {
          success: refreshResponse.success,
          hasAccessToken: !!refreshResponse.data?.tokens?.accessToken,
        });

        if (refreshResponse.success && refreshResponse.data?.tokens?.accessToken) {
          const {tokens} = refreshResponse.data;

          // Update tokens and expiry
          storeAuthTokens(
            tokens.accessToken!,
            tokens.refreshToken || undefined,
            tokens.expiresIn || undefined,
          );

          // Update Authorization header with new token
          originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;

          // Retry the original request with new token
          console.log('[Response Interceptor] Retrying original request with new token');
          return apiClient(originalRequest);
        }

        // Refresh failed or no refresh token - clear tokens and redirect to login
        const {navigationRef} = await import('@/navigation');
        
        clearAuthTokens();
        queryClient.clear();
        
        // Navigate to login screen
        if (navigationRef.current?.isReady()) {
          navigationRef.current.reset({
            index: 0,
            routes: [{name: 'Login'}],
          });
        }

        return Promise.reject(error);
      } catch (refreshError: any) {
        // Refresh token request failed (401 or other error)
        console.error('[Response Interceptor] Token refresh failed:', refreshError);
        
        const {navigationRef} = await import('@/navigation');
        
        clearAuthTokens();
        queryClient.clear();
        
        // Navigate to login screen
        if (navigationRef.current?.isReady()) {
          navigationRef.current.reset({
            index: 0,
            routes: [{name: 'Login'}],
          });
        }

        return Promise.reject(refreshError);
      }
    }

    // Handle network errors
    if (!error.response) {
      error.message = 'Network error. Please check your internet connection.';
    }

    // Handle specific HTTP status codes
    let errorMessage: string;

    if (error.response?.status === 503) {
      // Service Unavailable - Server is temporarily unavailable
      errorMessage = 'Something went wrong. Please try again later.';
    } else if (error.response?.status === 500) {
      // Internal Server Error
      errorMessage = 'Something went wrong. Please try again later.';
    } else if (
      error.response?.status === 502 ||
      error.response?.status === 504
    ) {
      // Bad Gateway / Gateway Timeout
      errorMessage = 'Something went wrong. Please try again later.';
    } else if (!error.response) {
      // Network error
      errorMessage = 'Network error. Please check your internet connection.';
    } else {
      // Use backend message if available, otherwise fallback to generic message
      errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Something went wrong';
    }

    // Show error toast for unknown/unhandled errors
    // Skip showing toast if request has _skipErrorToast flag (for custom error handling)
    if (!originalRequest._skipErrorToast) {
      // Use jotai store to add toast atomically
      store.set(addToastAtom, {
        type: 'error',
        message: errorMessage,
        duration: 3000,
      });
    }

    return Promise.reject(error);
  },
);

// Removed Basic auth support; Base64 helper no longer needed
