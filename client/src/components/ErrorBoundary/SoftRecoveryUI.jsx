import { useState, useCallback } from 'react';
import { FiRefreshCw, FiX, FiAlertCircle } from 'react-icons/fi';


/**
 * Soft Recovery UI Component
 * Displays API errors with retry capability without page refresh
 * Used for transient failures in API calls
 */
export default function SoftRecoveryUI({
  isVisible,
  error,
  onRetry,
  onDismiss,
  isLoading = false,
  retryCount = 0,
  maxRetries = 3,
}) {
  const [dismissed, setDismissed] = useState(false);

  const handleDismiss = useCallback(() => {
    setDismissed(true);
    onDismiss?.();
  }, [onDismiss]);

  const handleRetry = useCallback(() => {
    setDismissed(false);
    onRetry?.();
  }, [onRetry]);

  if (dismissed || !isVisible || !error) {
    return null;
  }

  const canRetry = retryCount < maxRetries && !isLoading;
  const shouldShowFatal = retryCount >= maxRetries;

  return (
    <div
      className={`${styles.container} ${
        shouldShowFatal ? styles.fatal : styles.warning
      }`}
      role="alert"
      aria-live="polite"
    >
      <div className={styles.content}>
        <div className={styles.icon}>
          <FiAlertCircle size={20} />
        </div>

        <div className={styles.message}>
          <strong>
            {shouldShowFatal
              ? 'Connection Issue'
              : 'Temporary Issue Detected'}
          </strong>
          <p>
            {typeof error === 'string'
              ? error
              : error?.message || 'Unable to load this content'}
          </p>
          {!shouldShowFatal && retryCount > 0 && (
            <p className={styles.retryInfo}>
              Attempt {retryCount} of {maxRetries}
            </p>
          )}
        </div>

        <div className={styles.actions}>
          {canRetry && (
            <button
              onClick={handleRetry}
              disabled={isLoading}
              className={styles.retryBtn}
              aria-label="Retry request"
            >
              <FiRefreshCw
                size={16}
                style={{
                  animation: isLoading ? 'spin 1s linear infinite' : 'none',
                }}
              />
              {isLoading ? 'Retrying...' : 'Retry'}
            </button>
          )}

          {shouldShowFatal && (
            <a href="/" className={styles.homeBtn}>
              Go to Home
            </a>
          )}

          <button
            onClick={handleDismiss}
            className={styles.dismissBtn}
            aria-label="Dismiss error message"
            title="Dismiss"
          >
            <FiX size={18} />
          </button>
        </div>
      </div>

      {shouldShowFatal && (
        <p className={styles.fatal}>
          We're unable to recover from this error. Please refresh or return home.
        </p>
      )}
    </div>
  );
}

