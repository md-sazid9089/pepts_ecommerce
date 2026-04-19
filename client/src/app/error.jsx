'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { logger } from '@/utils/logger';
import styles from './error.module.css';

export default function ErrorBoundary({ error, reset }) {
  useEffect(() => {
    // Log the error to console
    console.error('Error caught by boundary:', error);
  }, [error]);

  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorContent}>
        <div className={styles.errorIcon}>⚠️</div>
        
        <h1 className={styles.errorTitle}>Something went wrong</h1>
        
        <p className={styles.errorMessage}>
          An unexpected error occurred. Our team has been notified.
        </p>

        {isDevelopment && (
          <div className={styles.devDetails}>
            <details className={styles.errorDetails}>
              <summary>Error Details (Development Only)</summary>
              
              <div className={styles.errorStack}>
                <strong>Error Message:</strong>
                <code>{error.message}</code>
              </div>

              {error.digest && (
                <div className={styles.errorStack}>
                  <strong>Error Digest:</strong>
                  <code>{error.digest}</code>
                </div>
              )}

              {error.stack && (
                <div className={styles.errorStack}>
                  <strong>Stack Trace:</strong>
                  <pre>{error.stack}</pre>
                </div>
              )}
            </details>
          </div>
        )}

        <div className={styles.actionButtons}>
          <button onClick={reset} className={styles.resetButton}>
            Try Again
          </button>
          
          <Link href="/" className={styles.homeButton}>
            Back to Home
          </Link>
        </div>

        <div className={styles.supportInfo}>
          <p>
            If this problem persists, please <a href="mailto:support@pepts.com">contact support</a>
          </p>
        </div>
      </div>
    </div>
  );
}
