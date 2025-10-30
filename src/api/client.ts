import axios from 'axios';
import {Platform, Dimensions} from 'react-native';
import {env} from '@/config';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

// Get base URL from environment
const baseURL = env.API_BASE_URL;

// Optional: Basic auth credentials (if provided)
const basicAuth = env.API_USERNAME && env.API_PASSWORD
  ? {
      Authorization: `Basic ${btoa(
        `${env.API_USERNAME}:${env.API_PASSWORD}`
      )}`,
    }
  : {};

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
    ...basicAuth,
  },
  params: platformParams,
  timeout: 15000, // 15 seconds
  validateStatus: (status) => status < 500, // Don't throw on 4xx errors
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

/**
 * Helper function for Base64 encoding (React Native compatible)
 */
function btoa(str: string): string {
  // Use globalThis btoa if available (modern React Native)
  if (typeof (globalThis as any).btoa === 'function') {
    return (globalThis as any).btoa(str);
  }
  
  // Fallback: manual base64 encoding
  /* eslint-disable no-bitwise */
  const base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let output = '';
  let i = 0;
  
  while (i < str.length) {
    const char1 = str.charCodeAt(i++);
    const char2 = i < str.length ? str.charCodeAt(i++) : Number.NaN;
    const char3 = i < str.length ? str.charCodeAt(i++) : Number.NaN;
    
    const enc1 = char1 >> 2;
    const enc2 = ((char1 & 3) << 4) | (char2 >> 4);
    let enc3 = ((char2 & 15) << 2) | (char3 >> 6);
    let enc4 = char3 & 63;
    
    if (isNaN(char2)) {
      enc3 = enc4 = 64;
    } else if (isNaN(char3)) {
      enc4 = 64;
    }
    
    output += base64Chars.charAt(enc1) + base64Chars.charAt(enc2) +
              base64Chars.charAt(enc3) + base64Chars.charAt(enc4);
  }
  /* eslint-enable no-bitwise */
  
  return output;
}

