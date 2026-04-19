/**
 * Custom hooks for error handling and async operations with logging
 */

import { useEffect, useCallback } from 'react';
import { logger } from './logger';

/**
 * Hook to catch and log errors in async operations
 * Usage: const handleAsync = useAsyncError('ComponentName');
 * 
 * const result = await handleAsync(asyncFn, 'Fetch User Data');
 */
export function useAsyncError(moduleName) {
  return useCallback(
    async (asyncFn, operationName, onError) => {
      const timer = logger.createTimer(`${moduleName} - ${operationName}`);
      
      try {
        logger.logAsync(moduleName, operationName, 'start', undefined, asyncFn.name);
        
        const result = await asyncFn();
        
        timer.end();
        logger.logAsync(moduleName, operationName, 'success', undefined, asyncFn.name);
        
        return result;
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        
        logger.error(moduleName, `Failed: ${operationName}`, err, asyncFn.name, {
          operation: operationName,
          timestamp: new Date().toISOString(),
        });
        
        if (onError) {
          onError(err);
        }
        
        return null;
      }
    },
    [moduleName]
  );
}

/**
 * Hook to log component lifecycle events
 * Usage: useComponentLogger('ComponentName');
 */
export function useComponentLogger(componentName) {
  useEffect(() => {
    logger.info('ComponentLifecycle', `Mounted: ${componentName}`, undefined, componentName);
    
    return () => {
      logger.info('ComponentLifecycle', `Unmounted: ${componentName}`, undefined, componentName);
    };
  }, [componentName]);
}

/**
 * Hook to track state changes with logging
 * Usage: useStateLogger('StateName', value, 'ComponentName');
 */
export function useStateLogger(stateName, value, componentName) {
  useEffect(() => {
    logger.logStateChange('StateTracking', stateName, undefined, value, componentName);
  }, [value, stateName, componentName]);
}

/**
 * Hook to handle hydration mismatches
 * Usage: useHydrationMismatchDetector('ComponentName', serverValue, clientValue);
 */
export function useHydrationMismatchDetector(componentName, serverRenderedHTML, clientRenderedHTML) {
  useEffect(() => {
    if (serverRenderedHTML !== clientRenderedHTML) {
      logger.logHydrationMismatch(
        'HydrationDetector',
        serverRenderedHTML,
        clientRenderedHTML,
        componentName
      );
    }
  }, [serverRenderedHTML, clientRenderedHTML, componentName]);
}

/**
 * Hook to wrap component rendering with error handling
 * Usage: const safeRender = useErrorHandler('ComponentName');
 * 
 * try {
 *   safeRender(() => {
 *     // component logic
 *   });
 * } catch (error) {
 *   // error is automatically logged
 * }
 */
export function useErrorHandler(componentName: string) {
  return useCallback(
    <T,>(fn: () => T, operationName: string = 'Render'): T => {
      try {
        return fn();
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        
        logger.critical(
          'ErrorHandler',
          `Error during ${operationName} in ${componentName}`,
          err,
          'useErrorHandler'
        );
        
        throw error;
      }
    },
    [componentName]
  );
}

/**
 * Hook to log performance metrics
 * Usage: const performanceTracker = usePerformanceTracker('ComponentName');
 * performanceTracker.mark('operation-name');
 * // ... do work ...
 * performanceTracker.measure('operation-name', 'Start of operation');
 */
export function usePerformanceTracker(componentName: string) {
  return {
    mark: (markName: string) => {
      performance.mark(`${componentName}-${markName}`);
    },
    measure: (markName: string, description: string) => {
      try {
        performance.measure(
          `${componentName}-${markName}`,
          `${componentName}-${markName}`
        );
        
        const measures = performance.getEntriesByName(`${componentName}-${markName}`);
        const lastMeasure = measures[measures.length - 1];
        
        logger.info(
          'PerformanceMetrics',
          `${description}: ${lastMeasure?.duration?.toFixed(2)}ms`,
          { duration: lastMeasure?.duration, component: componentName },
          componentName
        );
      } catch (error) {
        logger.warn('PerformanceMetrics', 'Failed to measure performance', undefined, componentName);
      }
    },
  };
}
