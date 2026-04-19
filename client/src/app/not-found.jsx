import Link from 'next/link';
import { logger } from '@/utils/logger';
import { FiSearch } from 'react-icons/fi';
import styles from './not-found.module.css';

export default function NotFound() {
  // Log 404 for analytics
  if (typeof window !== 'undefined') {
    logger.warn(
      '404NotFound',
      `User attempted to access non-existent route: ${window.location.pathname}`,
      { url: window.location.href }
    );
  }

  return (
    <div className={styles.notFoundContainer}>
      <div className={styles.notFoundContent}>
        <div className={styles.notFoundCode}>404</div>
        
        <h1 className={styles.notFoundTitle}>Page Not Found</h1>
        
        <p className={styles.notFoundMessage}>
          Sorry, the page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className={styles.notFoundIllustration}>
          <FiSearch size={64} color="var(--text-tertiary)" />
        </div>

        <div className={styles.actionButtons}>
          <Link href="/" className={styles.homeButton}>
            ← Back to Home
          </Link>
          
          <Link href="/products" className={styles.shopButton}>
            Browse Products →
          </Link>
        </div>

        <div className={styles.helpText}>
          <p>If you think this is a mistake, please <a href="mailto:support@pepts.com">contact support</a></p>
        </div>
      </div>
    </div>
  );
}
