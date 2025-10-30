import Config from 'react-native-config';

/**
 * Environment Configuration
 * 
 * Environment variables from .env files
 * 
 * Environments:
 * - Staging (default)  - .env
 * - Production         - .env.production
 * 
 * Usage:
 * - Staging: yarn ios / yarn android (default)
 * - Production: yarn ios:prod / yarn android:prod
 */

// Type-safe environment variables
export interface Environment {
  // API
  API_BASE_URL: string;
  API_USERNAME?: string;
  API_PASSWORD?: string;

  // App
  APP_ENV: 'development' | 'staging' | 'production';
  APP_VERSION: string;
  APP_NAME: string;

  // Feature Flags
  ENABLE_ANALYTICS: boolean;
  ENABLE_CRASH_REPORTING: boolean;
  ENABLE_DEV_TOOLS: boolean;
}

/**
 * Parse environment variable to boolean
 */
const parseBoolean = (value: string | undefined): boolean => {
  return value === 'true';
};

/**
 * Get environment configuration
 * Falls back to defaults if Config is not available
 */
export const env: Environment = {
  // API
  API_BASE_URL: Config.API_BASE_URL || 'https://b2aa9968f63a.ngrok.app/api/v1',
  API_USERNAME: Config.API_USERNAME,
  API_PASSWORD: Config.API_PASSWORD,

  // App
  APP_ENV: (Config.APP_ENV as Environment['APP_ENV']) || 'development',
  APP_VERSION: Config.APP_VERSION || '1.0.0',
  APP_NAME: Config.APP_NAME || 'WaterAbove (Dev)',

  // Feature Flags
  ENABLE_ANALYTICS: parseBoolean(Config.ENABLE_ANALYTICS),
  ENABLE_CRASH_REPORTING: parseBoolean(Config.ENABLE_CRASH_REPORTING),
  ENABLE_DEV_TOOLS: parseBoolean(Config.ENABLE_DEV_TOOLS) || __DEV__,
};

/**
 * Check if running in development
 */
export const isDevelopment = env.APP_ENV === 'development';

/**
 * Check if running in staging
 */
export const isStaging = env.APP_ENV === 'staging';

/**
 * Check if running in production
 */
export const isProduction = env.APP_ENV === 'production';

/**
 * Log environment info (development only)
 */
if (__DEV__) {
  console.log('🌍 Environment:', {
    APP_ENV: env.APP_ENV,
    API_BASE_URL: env.API_BASE_URL,
    APP_VERSION: env.APP_VERSION,
    ENABLE_DEV_TOOLS: env.ENABLE_DEV_TOOLS,
  });
}

