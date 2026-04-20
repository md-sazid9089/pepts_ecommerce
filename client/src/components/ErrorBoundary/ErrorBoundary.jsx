'use client';

import { Component } from 'react';
import { FiRefreshCw, FiAlertTriangle } from 'react-icons/fi';
import styles from './ErrorBoundary.module.css';

/**
 * Error Boundary with Soft Recovery
 * Catches errors in child components and provides retry mechanism
 * without requiring full page refresh
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      isRecovering: false,
    };
    this.resetErrorBoundary = this.resetErrorBoundary.bind(this);
    this.handleRetry = this.handleRetry.bind(this);
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error);
      console.error('Error info:', errorInfo);
    }

    this.setState(prevState => ({
      error,
      errorInfo,
      retryCount: prevState.retryCount + 1,
    }));

    // Send error to monitoring service
    this.reportErrorToService(error, errorInfo);
  }

  reportErrorToService = (error, errorInfo) => {
    try {
      const payload = {
        message: error.toString(),
        stack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        url: typeof window !== 'undefined' ? window.location.href : 'unknown',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      };

      // Send to error tracking service (Sentry, LogRocket, etc.)
      if (window.__errorReporter) {
        window.__errorReporter(payload);
      }
    } catch (err) {
      console.error('Failed to report error:', err);
    }
  };

  resetErrorBoundary() {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  }

  handleRetry = async () => {
    this.setState({ isRecovering: true });

    try {
      // Simulate async recovery operation
      await new Promise(resolve => setTimeout(resolve, 500));

      // Reset the error boundary
      this.resetErrorBoundary();

      // If a recovery handler is provided, call it
      if (this.props.onRetry) {
        await this.props.onRetry();
      }
    } catch (err) {
      console.error('Recovery failed:', err);
      this.setState({ isRecovering: false });
    } finally {
      this.setState({ isRecovering: false });
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.errorContainer}>
          <div className={styles.errorContent}>
            <div className={styles.errorIcon}>
              <FiAlertTriangle size={48} />
            </div>

            <h2 className={styles.errorTitle}>
              {this.props.title || 'Oops! Something went wrong'}
            </h2>

            <p className={styles.errorMessage}>
              {this.props.message || 'We encountered an unexpected error. Please try again.'}
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className={styles.errorDetails}>
                <summary>Error Details (Development Only)</summary>
                <pre className={styles.errorStack}>
                  {this.state.error.toString()}
                  {'\n\n'}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <div className={styles.errorActions}>
              <button
                onClick={this.handleRetry}
                disabled={this.state.isRecovering}
                className={styles.retryBtn}
              >
                <FiRefreshCw
                  size={16}
                  style={{
                    marginRight: '8px',
                    animation: this.state.isRecovering ? 'spin 1s linear infinite' : 'none',
                  }}
                />
                {this.state.isRecovering ? 'Recovering...' : 'Try Again'}
              </button>

              <button
                onClick={() => window.location.reload()}
                className={styles.refreshBtn}
              >
                Refresh Page
              </button>

              {this.props.onResetHome && (
                <button
                  onClick={this.props.onResetHome}
                  className={styles.homeBtn}
                >
                  Go Home
                </button>
              )}
            </div>

            {this.state.retryCount > 2 && (
              <p className={styles.multipleRetries}>
                Having trouble? Please try refreshing the page or contact support.
              </p>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
