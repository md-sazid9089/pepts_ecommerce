/**
 * Core Web Vitals Monitoring Hook
 * Tracks LCP (Largest Contentful Paint), FID (First Input Delay), and CLS (Cumulative Layout Shift)
 * Logs to console in development, sends to telemetry endpoint in production
 */

'use client';

import { useEffect, useRef } from 'react';


/**
 * Get LCP Rating (Good, Needs Improvement, Poor)
 */
function getLCPRating(value) {
  if (value <= 2500) return 'Good'; // ✅ Green
  if (value <= 4000) return 'Needs Improvement'; // 🟡 Yellow
  return 'Poor'; // 🔴 Red
}

/**
 * Get FID Rating (Good, Needs Improvement, Poor)
 */
function getFIDRating(value) {
  if (value <= 100) return 'Good'; // ✅ Green
  if (value <= 300) return 'Needs Improvement'; // 🟡 Yellow
  return 'Poor'; // 🔴 Red
}

/**
 * Get CLS Rating (Good, Needs Improvement, Poor)
 */
function getCLSRating(value) {
  if (value <= 0.1) return 'Good'; // ✅ Green
  if (value <= 0.25) return 'Needs Improvement'; // 🟡 Yellow
  return 'Poor'; // 🔴 Red
}

/**
 * Get console styling based on rating
 */
function getMetricStyle(rating) {
  const baseStyle = 'font-weight: bold;';
  if (rating === 'Good') return `${baseStyle} color: #10B981;`;
  if (rating === 'Needs Improvement') return `${baseStyle} color: #F59E0B;`;
  return `${baseStyle} color: #EF4444;`;
}

export function useWebVitals() {
  const metricsRef = useRef({});

  useEffect(() => {
    /**
     * Log metric to console (development) or telemetry (production)
     */
    function logMetric(name, data) {
      const timestamp = new Date().toISOString();
      const isDev = process.env.NODE_ENV === 'development';

      // Always log to console
      const style = getMetricStyle(data.rating);
      // Console logging removed for production cleanup

      // Send to telemetry in production
      if (!isDev) {
        sendTelemetry({
          name,
          value: data.value,
          rating: data.rating,
          timestamp,
          url: window.location.href,
          userAgent: navigator.userAgent,
        });
      }
    }

    /**
     * Send telemetry data to backend
     */
    async function sendTelemetry(data) {
      try {
        // Use navigator.sendBeacon for reliability
        if (navigator.sendBeacon) {
          navigator.sendBeacon(
            '/api/telemetry/web-vitals',
            JSON.stringify(data)
          );
        } else {
          // Fallback to fetch with keepalive
          await fetch('/api/telemetry/web-vitals', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            keepalive: true,
          });
        }
      } catch (error) {
        console.warn('[Web Vitals] Failed to send telemetry:', error);
      }
    }

    /**
     * Track Largest Contentful Paint (LCP)
     */
    function trackLCP() {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];

          metricsRef.current.lcp = {
            value: lastEntry.renderTime || lastEntry.loadTime,
            rating: getLCPRating(lastEntry.renderTime || lastEntry.loadTime),
            element: lastEntry.element?.outerHTML?.substring(0, 100) || 'unknown',
            url: lastEntry.url,
          };

          logMetric('LCP', metricsRef.current.lcp);
        });

        observer.observe({ entryTypes: ['largest-contentful-paint'] });

        // Clean up observer after 5 minutes
        setTimeout(() => observer.disconnect(), 5 * 60 * 1000);
      } catch (error) {
        console.error('[Web Vitals] Failed to track LCP:', error);
      }
    }

    /**
     * Track First Input Delay (FID)
     */
    function trackFID() {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();

          for (const entry of entries) {
            metricsRef.current.fid = {
              value: entry.processingDuration,
              rating: getFIDRating(entry.processingDuration),
              name: entry.name,
              startTime: entry.startTime,
            };

            logMetric('FID', metricsRef.current.fid);

            // Only report the first input
            break;
          }
        });

        observer.observe({ entryTypes: ['first-input'] });

        // Clean up observer after 5 minutes
        setTimeout(() => observer.disconnect(), 5 * 60 * 1000);
      } catch (error) {
        console.error('[Web Vitals] Failed to track FID:', error);
      }
    }

    /**
     * Track Cumulative Layout Shift (CLS)
     */
    function trackCLS() {
      try {
        let clsValue = 0;
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            // Only count layout shifts without recent user input
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
              metricsRef.current.cls = {
                value: clsValue,
                rating: getCLSRating(clsValue),
                lastEntry: {
                  sources: entry.sources?.map((source) => ({
                    node: source.node?.outerHTML?.substring(0, 50) || 'unknown',
                    previousRect: source.previousRect,
                    currentRect: source.currentRect,
                  })),
                },
              };

              logMetric('CLS', metricsRef.current.cls);
            }
          }
        });

        observer.observe({ entryTypes: ['layout-shift'] });

        // Clean up observer after page is fully loaded
        window.addEventListener('load', () => {
          setTimeout(() => observer.disconnect(), 3000);
        });
      } catch (error) {
        console.error('[Web Vitals] Failed to track CLS:', error);
      }
    }

    /**
     * Report all collected metrics
     */
    function reportMetrics() {
      const metrics = metricsRef.current;

      if (Object.keys(metrics).length === 0) {
        return;
      }

      // Session summary logging removed for production cleanup

      // Send comprehensive telemetry
      if (process.env.NODE_ENV !== 'development') {
        sendTelemetry({
          type: 'session-metrics',
          metrics,
          sessionDuration: performance.now(),
          url: window.location.href,
          timestamp: new Date().toISOString(),
        });
      }
    }

    // Track LCP (Largest Contentful Paint)
    trackLCP();

    // Track FID (First Input Delay)
    trackFID();

    // Track CLS (Cumulative Layout Shift)
    trackCLS();

    // Report metrics periodically or on visibility change
    const handleVisibilityChange = () => {
      if (document.hidden) {
        reportMetrics();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Report on unload
    const handleUnload = () => {
      reportMetrics();
    };

    window.addEventListener('unload', handleUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('unload', handleUnload);
    };
  }, []);

  return metricsRef.current;
}

