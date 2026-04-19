/**
 * src/data/utils/pricing.js
 * Pricing utilities for B2B wholesale calculations
 */

/**
 * Format price to USD currency format
 * @param {number} price - The price to format
 * @returns {string} Formatted price string (e.g., "$850")
 */
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

/**
 * Calculate tiered price based on quantity
 * @param {object} product - Product object with tieredPricing array
 * @param {number} quantity - Order quantity
 * @returns {number} Price per unit for the given quantity tier
 */
export const calculateTieredPrice = (product, quantity) => {
  if (!product?.tieredPricing) return product?.price || 0;

  const tier = product.tieredPricing.find(
    (t) => quantity >= t.min && (t.max === null || quantity <= t.max)
  );

  return tier ? tier.price : product.price;
};

/**
 * Calculate bulk discount percentage
 * @param {object} product - Product object with pricing
 * @param {number} quantity - Order quantity
 * @returns {number} Discount percentage (0-100)
 */
export const calculateBulkDiscount = (product, quantity) => {
  const tieredPrice = calculateTieredPrice(product, quantity);
  const regularPrice = product.price;

  if (tieredPrice === regularPrice) return 0;

  return Math.round(((regularPrice - tieredPrice) / regularPrice) * 100);
};

export default {
  formatPrice,
  calculateTieredPrice,
  calculateBulkDiscount,
};
