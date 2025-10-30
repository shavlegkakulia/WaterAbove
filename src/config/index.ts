/**
 * Configuration Exports
 * 
 * Single source of truth for environment configuration
 * Uses react-native-config to load from .env files
 */

// Environment configuration from react-native-config
export {
  env,
  isDevelopment,
  isStaging,
  isProduction,
  type Environment,
} from './env';

// Re-export Reactotron for development
export { default as reactotronConfig } from './reactotron';

