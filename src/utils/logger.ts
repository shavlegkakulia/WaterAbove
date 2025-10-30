/**
 * Custom Logger Utility
 * 
 * Centralized logging that works with Reactotron
 */

type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug';

interface LogOptions {
  level?: LogLevel;
  tag?: string;
  important?: boolean;
}

class Logger {
  /**
   * Log general information
   */
  log(message: string, data?: any, options?: LogOptions) {
    if (__DEV__) {
      if (console.tron) {
        console.tron.display({
          name: `📝 ${options?.tag || 'Log'}`,
          value: {message, data},
          preview: message,
          important: options?.important,
        });
      } else {
        console.log(`[${options?.tag || 'LOG'}]`, message, data);
      }
    }
  }

  /**
   * Log informational messages
   */
  info(message: string, data?: any, options?: LogOptions) {
    if (__DEV__) {
      if (console.tron) {
        console.tron.display({
          name: `ℹ️ ${options?.tag || 'Info'}`,
          value: {message, data},
          preview: message,
        });
      } else {
        console.info(`[${options?.tag || 'INFO'}]`, message, data);
      }
    }
  }

  /**
   * Log warnings
   */
  warn(message: string, data?: any, options?: LogOptions) {
    if (__DEV__) {
      if (console.tron) {
        console.tron.display({
          name: `⚠️ ${options?.tag || 'Warning'}`,
          value: {message, data},
          preview: message,
          important: true,
        });
      } else {
        console.warn(`[${options?.tag || 'WARN'}]`, message, data);
      }
    }
  }

  /**
   * Log errors
   */
  error(message: string, error?: any, options?: LogOptions) {
    if (__DEV__) {
      if (console.tron) {
        console.tron.display({
          name: `🔴 ${options?.tag || 'Error'}`,
          value: {
            message,
            error: error?.message || error,
            stack: error?.stack,
          },
          preview: message,
          important: true,
        });
      } else {
        console.error(`[${options?.tag || 'ERROR'}]`, message, error);
      }
    }
  }

  /**
   * Log debug information
   */
  debug(message: string, data?: any, options?: LogOptions) {
    if (__DEV__) {
      if (console.tron) {
        console.tron.display({
          name: `🐛 ${options?.tag || 'Debug'}`,
          value: {message, data},
          preview: message,
        });
      } else {
        console.debug(`[${options?.tag || 'DEBUG'}]`, message, data);
      }
    }
  }

  /**
   * Log network request
   */
  network(method: string, url: string, data?: any) {
    if (__DEV__ && console.tron) {
      console.tron.display({
        name: '🌐 Network Request',
        value: {method, url, data},
        preview: `${method} ${url}`,
      });
    }
  }

  /**
   * Log state change
   */
  state(name: string, oldValue: any, newValue: any) {
    if (__DEV__ && console.tron) {
      console.tron.display({
        name: '🔄 State Change',
        value: {name, oldValue, newValue},
        preview: `${name}: ${JSON.stringify(oldValue)} → ${JSON.stringify(newValue)}`,
      });
    }
  }

  /**
   * Log navigation event
   */
  navigation(screen: string, params?: any) {
    if (__DEV__ && console.tron) {
      console.tron.display({
        name: '🧭 Navigation',
        value: {screen, params},
        preview: `→ ${screen}`,
      });
    }
  }

  /**
   * Log performance timing
   */
  performance(label: string, duration: number) {
    if (__DEV__ && console.tron) {
      console.tron.display({
        name: '⏱️ Performance',
        value: {label, duration: `${duration}ms`},
        preview: `${label}: ${duration}ms`,
      });
    }
  }

  /**
   * Create a timer for performance measurements
   */
  timer(label: string) {
    const startTime = Date.now();
    return {
      end: () => {
        const duration = Date.now() - startTime;
        this.performance(label, duration);
        return duration;
      },
    };
  }
}

// Export singleton instance
export const logger = new Logger();

// Export type for external use
export type {LogOptions};



