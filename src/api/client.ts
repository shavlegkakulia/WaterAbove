import axios from 'axios';
import {Platform, Dimensions} from 'react-native';
import {env} from '@/config';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

// Get base URL from environment
const baseURL = env.API_BASE_URL;

// Authorization is handled exclusively via Bearer tokens set by setAuthToken

// Platform-specific params
const platformParams = Platform.select({
  ios: {platform: 'ios'},
  android: {platform: 'android'},
  default: {},
});

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
  validateStatus: (status) => status < 405, // Don't throw on 4xx errors
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

/**
 * Request interceptor - Add metadata to all requests
 */
apiClient.interceptors.request.use(
  (config) => {
    // Add timestamp
    config.headers['X-Request-Time'] = new Date().toISOString();
    
    // Add device info for non-GET requests
    if (config.method !== 'get') {
      config.data = {
        ...config.data,
        _metadata: {
          platform: Platform.OS,
          platformVersion: Platform.Version,
          screenWidth: SCREEN_WIDTH,
          screenHeight: SCREEN_HEIGHT,
          source: 'mobile_app',
        },
      };
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor - Handle errors globally
 */
apiClient.interceptors.response.use(
  (response) => {
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
        preview: `${response.config.method?.toUpperCase()} ${response.config.url}`,
      });
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

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
        preview: `${error.config?.method?.toUpperCase()} ${error.config?.url} - ${error.response?.status || 'Network Error'}`,
        important: true,
      });
    }

    // Handle 401 Unauthorized - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // TODO: Implement token refresh logic here
      // const newToken = await refreshAuthToken();
      // setAuthToken(newToken);
      // return apiClient(originalRequest);
      
      // For now, just clear auth and redirect to login
      setAuthToken(null);
      // TODO: Navigate to login screen
    }

    // Handle network errors
    if (!error.response) {
      error.message = 'Network error. Please check your internet connection.';
    }

    return Promise.reject(error);
  }
);

// Removed Basic auth support; Base64 helper no longer needed

