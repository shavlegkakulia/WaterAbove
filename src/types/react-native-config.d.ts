declare module 'react-native-config' {
  export interface NativeConfig {
    // API
    API_BASE_URL?: string;
    API_USERNAME?: string;
    API_PASSWORD?: string;

    // App
    APP_ENV?: string;
    APP_VERSION?: string;
    APP_NAME?: string;

    // Feature Flags
    ENABLE_ANALYTICS?: string;
    ENABLE_CRASH_REPORTING?: string;
    ENABLE_DEV_TOOLS?: string;
  }

  const Config: NativeConfig;
  export default Config;
}

