/**
 * src/components/UI/Skeleton.jsx
 * Reusable Skeleton loader component with shimmer animation
 */

'use client';



/**
 * Skeleton - Base skeleton component
 * @param {string} className - Additional CSS classes
 * @param {string} variant - 'default' | 'circular' | 'text' | 'rect'
 * @param {string} width - Width (CSS value)
 * @param {string} height - Height (CSS value)
 */
export function Skeleton({ className = '', variant = 'default', width, height }) {
  const variantClasses = {
    default: styles.skeletonDefault,
    circular: styles.skeletonCircular,
    text: styles.skeletonText,
    rect: styles.skeletonRect,
  };

  return (
    <div
      className={`${styles.skeleton} ${variantClasses[variant] || styles.skeletonDefault} ${className}`}
      style={{
        width: width || '100%',
        height: height || '100%',
      }}
    />
  );
}

/**
 * ProductSkeleton - Skeleton for product cards
 * Matches ProductCard layout
 */
export function ProductSkeleton() {
  return (
    <div className={styles.productSkeleton}>
      {/* Image placeholder */}
      <Skeleton className={styles.productImage} variant="rect" />

      {/* Content skeleton */}
      <div className={styles.productContent}>
        {/* Title lines */}
        <Skeleton className={styles.titleLine} variant="text" />
        <Skeleton className={styles.titleLine} variant="text" width="80%" />

        {/* Price skeleton */}
        <div className={styles.priceRow}>
          <Skeleton variant="text" width="40%" />
          <Skeleton variant="text" width="30%" />
        </div>

        {/* Rating skeleton */}
        <div className={styles.ratingRow}>
          <Skeleton variant="text" width="50%" />
        </div>

        {/* Buttons skeleton */}
        <div className={styles.buttonRow}>
          <Skeleton variant="rect" width="48%" height="36px" />
          <Skeleton variant="rect" width="48%" height="36px" />
        </div>
      </div>
    </div>
  );
}

/**
 * ProductGridSkeleton - Grid of product skeletons
 */
export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className={styles.productGrid}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * BannerSkeleton - Skeleton for banner/carousel
 */
export function BannerSkeleton() {
  return (
    <div className={styles.bannerSkeleton}>
      <Skeleton variant="rect" width="100%" height="400px" />
    </div>
  );
}

export default Skeleton;


