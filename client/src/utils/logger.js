/**
 * Enhanced Logging System for PEPTS E-Commerce
 * Provides structured error logging with stack traces, context info, and severity levels
 */

class Logger {
  constructor() {
    this.isDevelopment = typeof window !== 'undefined' && import.meta.env.MODE === 'development';
  }

  /**
   * Format log message with module and function context
   */
  formatMessage(level, module, message, fn) {
    const timestamp = new Date().toISOString();
    const functionContext = fn ? ` [${fn}]` : '';
    return `[${timestamp}] [${level.toUpperCase()}] [${module}${functionContext}]: ${message}`;
  }

  /**
   * Log debug information (development only)
   */
  debug(module, message, data, fn) {
    if (!this.isDevelopment) return;
    
    const formatted = this.formatMessage('debug', module, message, fn);
    console.debug(formatted, data || {});
  }

  /**
   * Log info messages
   */
  info(module, message, data, fn) {
    const formatted = this.formatMessage('info', module, message, fn);
    console.info(`%c${formatted}`, 'color: #0066cc; font-weight: bold;', data || {});
  }

  /**
   * Log warning messages
   */
  warn(module, message, data, fn) {
    const formatted = this.formatMessage('warn', module, message, fn);
    console.warn(`%c${formatted}`, 'color: #ff9800; font-weight: bold;', data || {});
  }

  /**
   * Log error messages with full stack trace
   */
  error(module, message, error, fn, data) {
    const formatted = this.formatMessage('error', module, message, fn);
    const errorObj = error instanceof Error ? error : new Error(String(error));
    
    console.error(`%c${formatted}`, 'color: #f44336; font-weight: bold;');
    console.error('Error Details:', {
      name: errorObj.name,
      message: errorObj.message,
      stack: errorObj.stack,
      ...data,
    });
  }

  /**
   * Log CRITICAL UI errors - triggers visual notification
   */
  critical(module, message, error, fn, data) {
    const formatted = this.formatMessage('critical', module, message, fn);
    const errorObj = error instanceof Error ? error : new Error(String(error));
    
    // CRITICAL ERROR HEADER
    console.error('%c\n╔════════════════════════════════════════╗', 'color: #ff0000; font-weight: bold;');
    console.error('%c║ 🚨 CRITICAL UI ERROR 🚨                ║', 'color: #ff0000; font-weight: bold; font-size: 14px;');
    console.error('%c╚════════════════════════════════════════╝\n', 'color: #ff0000; font-weight: bold;');
    
    console.error(`%c${formatted}`, 'color: #ff0000; font-weight: bold; font-size: 12px;');
    console.error('%cComponent Stack:', 'color: #ff0000; font-weight: bold;');
    console.error(errorObj.stack);
    
    console.error('%cContext Data:', 'color: #ff0000; font-weight: bold;');
    console.error({
      module,
      function: fn,
      timestamp: new Date().toISOString(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A',
      ...data,
    });
    
    console.error('%c════════════════════════════════════════\n', 'color: #ff0000; font-weight: bold;');
  }

  /**
   * Log hydration mismatch - detects client/server rendering differences
   */
  logHydrationMismatch(module, expectedHTML, actualHTML, fn) {
    console.error('%c⚠️  HYDRATION MISMATCH DETECTED ⚠️', 'color: #ff9800; font-weight: bold; font-size: 14px;');
    console.error(`Module: ${module}${fn ? ` [${fn}]` : ''}`);
    console.error('%cExpected HTML:', 'color: #4caf50; font-weight: bold;');
    console.error(expectedHTML);
    console.error('%cActual HTML:', 'color: #f44336; font-weight: bold;');
    console.error(actualHTML);
    console.error('%cNote: This typically occurs when client and server render different content', 'color: #ff9800; font-style: italic;');
  }

  /**
   * Log context state changes for debugging
   */
  logStateChange(module, stateName, oldValue, newValue, fn) {
    if (!this.isDevelopment) return;
    
    console.log(`%c[STATE CHANGE] ${module}${fn ? ` [${fn}]` : ''}`, 'color: #9c27b0; font-weight: bold;');
    console.log(`${stateName}:`, { old: oldValue, new: newValue });
  }

  /**
   * Log API/async operation
   */
  logAsync(module, operation, status, data, fn) {
    const statusColor = status === 'start' ? '#0066cc' : status === 'success' ? '#4caf50' : '#f44336';
    const statusSymbol = status === 'start' ? '⏳' : status === 'success' ? '✅' : '❌';
    
    console.log(
      `%c${statusSymbol} [${status.toUpperCase()}] ${module}${fn ? ` [${fn}]` : ''}`,
      `color: ${statusColor}; font-weight: bold;`
    );
    
    if (data) {
      console.log(data);
    }
  }

  /**
   * Create a performance timer for debugging slow operations
   */
  createTimer(label) {
    const startTime = performance.now();
    
    return {
      end: () => {
        const endTime = performance.now();
        const duration = endTime - startTime;
        const durationMs = duration.toFixed(2);
        const color = duration > 1000 ? '#f44336' : duration > 100 ? '#ff9800' : '#4caf50';
        
        console.log(`%c⏱️  ${label}: ${durationMs}ms`, `color: ${color}; font-weight: bold;`);
        return duration;
      },
    };
  }
}

export const logger = new Logger();

/**
 * Higher-order function to wrap components with error logging
 */
export function withErrorLogging(component, moduleName) {
  return ((...args) => {
    try {
      return component(...args);
    } catch (error) {
      logger.critical(moduleName, 'Component rendering failed', error, component.name);
      throw error;
    }
  });
}
