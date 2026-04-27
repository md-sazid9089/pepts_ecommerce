/**
 * Cloudinary image optimization utilities.
 * Inserts transformation parameters into Cloudinary URLs to serve correctly
 * sized images instead of full-resolution files.
 */

/**
 * Returns an optimized Cloudinary URL for the given dimensions.
 * Falls back to the original URL for non-Cloudinary sources.
 *
 * @param {string|null|undefined} cloudinaryUrl - Original Cloudinary URL
 * @param {number} width  - Target width in pixels
 * @param {number} height - Target height in pixels
 * @returns {string|null}
 */
export function getOptimizedImageUrl(cloudinaryUrl, width, height) {
  if (!cloudinaryUrl || !cloudinaryUrl.includes('cloudinary.com')) {
    return cloudinaryUrl || null;
  }
  return cloudinaryUrl.replace(
    '/upload/',
    `/upload/w_${width},h_${height},c_fill,f_auto,q_auto/`
  );
}

/**
 * Convenience presets for common use cases.
 */
export const imagePresets = {
  /** Product listing thumbnail (ProductCard) */
  thumbnail: (url) => getOptimizedImageUrl(url, 400, 400),
  /** Product detail gallery main image */
  detail:    (url) => getOptimizedImageUrl(url, 800, 800),
  /** Admin panel thumbnail */
  admin:     (url) => getOptimizedImageUrl(url, 120, 120),
  /** Open Graph / social share */
  og:        (url) => getOptimizedImageUrl(url, 1200, 630),
};

export default getOptimizedImageUrl;
