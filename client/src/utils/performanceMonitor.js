/**
 * Performance Monitoring & Metrics Collection
 * Tracks Core Web Vitals, API performance, and image optimization metrics
 */

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      coreWebVitals: {},
      apiMetrics: {},
      imageMetrics: [],
      cacheStats: {},
    };
    this.isDevelopment = typeof window !== 'undefined' && process.env.NODE_ENV === 'development';
  }

  /**
   * Initialize Web Vitals monitoring
   * Reports: LCP, FID, CLS, TTFB
   */
  initWebVitals() {
    if (typeof window === 'undefined') return;

    // Use native Web Vitals API
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'largest-contentful-paint') {
            this.metrics.coreWebVitals.lcp = {
              value: entry.renderTime || entry.loadTime,
              timestamp: new Date().toISOString(),
            };
            if (this.isDevelopment) {
              console.info('LCP:', entry.renderTime || entry.loadTime, 'ms');
            }
          }
          if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
            const cls = (this.metrics.coreWebVitals.cls?.value || 0) + entry.value;
            this.metrics.coreWebVitals.cls = {
              value: cls,
              timestamp: new Date().toISOString(),
            };
          }
        }
      });

      observer.observe({ entryTypes: ['largest-contentful-paint', 'layout-shift'] });

      // Navigation Timing API for TTFB
      window.addEventListener('load', () => {
        const navTiming = performance.getEntriesByType('navigation')[0];
        if (navTiming) {
          this.metrics.coreWebVitals.ttfb = {
            value: navTiming.responseStart - navTiming.fetchStart,
            timestamp: new Date().toISOString(),
          };
          this.metrics.coreWebVitals.fcp = {
            value: navTiming.responseStart - navTiming.fetchStart,
            timestamp: new Date().toISOString(),
          };
        }
      });
    } catch (error) {
      console.warn('Web Vitals monitoring not available:', error.message);
    }
  }

  /**
   * Track image loading performance
   * Monitors: load time, size, format, dimensions
   */
  trackImageLoad(src, width, height, format, loadTime) {
    this.metrics.imageMetrics.push({
      src,
      width,
      height,
      format,
      loadTime,
      timestamp: new Date().toISOString(),
    });

    if (this.isDevelopment) {
      console.info(`Image loaded: ${src}`, {
        dimensions: `${width}x${height}`,
        format,
        loadTime: `${loadTime}ms`,
      });
    }
  }

  /**
   * Track API request performance
   * Monitors: endpoint, status, duration, retries
   */
  trackApiRequest(endpoint, status, duration, retries = 0) {
    const existing = this.metrics.apiMetrics[endpoint] || {
      calls: 0,
      totalDuration: 0,
      errors: 0,
      retries: 0,
      avgDuration: 0,
    };

    existing.calls++;
    existing.totalDuration += duration;
    existing.avgDuration = existing.totalDuration / existing.calls;
    if (status >= 400) existing.errors++;
    existing.retries += retries;

    this.metrics.apiMetrics[endpoint] = existing;

    if (this.isDevelopment) {
      console.info(`API: ${endpoint}`, {
        status,
        duration: `${duration}ms`,
        retries,
        avgDuration: `${existing.avgDuration.toFixed(0)}ms`,
      });
    }
  }

  /**
   * Get comprehensive metrics report
   */
  getReport() {
    return {
      timestamp: new Date().toISOString(),
      metrics: this.metrics,
      summary: {
        totalApiCalls: Object.values(this.metrics.apiMetrics).reduce((sum, m) => sum + m.calls, 0),
        totalImageLoads: this.metrics.imageMetrics.length,
        avgImageLoadTime: this.metrics.imageMetrics.length > 0
          ? (this.metrics.imageMetrics.reduce((sum, m) => sum + m.loadTime, 0) / this.metrics.imageMetrics.length).toFixed(0)
          : 0,
        coreWebVitals: this.metrics.coreWebVitals,
      },
    };
  }

  /**
   * Send metrics to analytics service
   */
  async sendMetrics(endpoint) {
    if (!endpoint) return;

    try {
      const report = this.getReport();
      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report),
      });
    } catch (error) {
      console.warn('Failed to send metrics:', error.message);
    }
  }

  /**
   * Log metrics to browser console for debugging
   */
  logReport() {
    const report = this.getReport();
    console.group('📊 Performance Report');
    console.table(report.summary);
    console.log('Core Web Vitals:', report.metrics.coreWebVitals);
    console.log('API Metrics:', report.metrics.apiMetrics);
    console.log('Image Metrics:', report.metrics.imageMetrics);
    console.groupEnd();
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Auto-initialize on client load
if (typeof window !== 'undefined') {
  performanceMonitor.initWebVitals();
}

export default performanceMonitor;
