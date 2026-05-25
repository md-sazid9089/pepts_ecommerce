/**
 * Cloudinary image optimization utilities.
 * Inserts transformation parameters into Cloudinary URLs to serve correctly
 * sized images instead of full-resolution files.
 *
 * Quality guide (bandwidth impact on 2G/3G):
 *   auto:low  — thumbnails / cards  (~60-80 % smaller than original)
 *   auto:good — detail page images  (~40-60 % smaller)
 *   auto      — admin / OG images   (Cloudinary picks quality automatically)
 */

/**
 * Returns an optimized Cloudinary URL for the given dimensions.
 * Falls back to the original URL for non-Cloudinary sources.
 *
 * @param {string|null|undefined} cloudinaryUrl - Original Cloudinary URL
 * @param {number} width    - Target width in pixels
 * @param {number} height   - Target height in pixels
 * @param {string} [quality='auto'] - Cloudinary quality string
 * @param {string} [crop='c_fill']  - Cloudinary crop mode
 * @returns {string|null}
 */
export function getOptimizedImageUrl(
  cloudinaryUrl,
  width,
  height,
  quality = 'auto',
  crop = 'c_fill',
) {
  if (!cloudinaryUrl || !cloudinaryUrl.includes('cloudinary.com')) {
    return cloudinaryUrl || null;
  }
  return cloudinaryUrl.replace(
    '/upload/',
    `/upload/w_${width},h_${height},${crop},f_auto,q_${quality}/`,
  );
}

/**
 * Convenience presets for common use cases.
 * Each preset is tuned for the render size and network cost of that context.
 */
export const imagePresets = {
  /**
   * Product listing / card thumbnail (rendered at ~300 px).
   * Uses q_auto:low to cut 60-80 % of bytes — biggest win on 2G/3G.
   */
  thumbnail: (url) => getOptimizedImageUrl(url, 400, 400, 'auto:low'),

  /**
   * Product detail gallery main image (rendered at up to 600 px).
   * q_auto:good balances quality vs. transfer size.
   */
  detail: (url) => getOptimizedImageUrl(url, 800, 800, 'auto:good'),

  /** Admin panel thumbnail */
  admin: (url) => getOptimizedImageUrl(url, 120, 120, 'auto:low'),

  /** Hero / above-the-fold banner (quality: good, larger dimensions) */
  hero: (url) => getOptimizedImageUrl(url, 1200, 600, 'auto:good', 'c_limit'),

  /** Open Graph / social share */
  og: (url) => getOptimizedImageUrl(url, 1200, 630, 'auto'),
};

/**
 * One-off helper for custom dimensions / quality.
 * Mirrors the spec from the task (used when presets don't fit).
 *
 * @example
 *   optimizeCloudinaryUrl(imgSrc, { width: 300, height: 300, quality: 'auto:low' })
 */
export function optimizeCloudinaryUrl(url, options = {}) {
  const {
    width   = 400,
    height  = 400,
    quality = 'auto:low',
    format  = 'auto',
    crop    = 'c_limit',
  } = options;
  if (!url || !url.includes('cloudinary.com')) return url;
  return url.replace(
    '/upload/',
    `/upload/w_${width},h_${height},${crop},q_${quality},f_${format}/`,
  );
}

export default getOptimizedImageUrl;
