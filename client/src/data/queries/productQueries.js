/**
 * src/data/queries/productQueries.js
 * Query functions for product data retrieval
 */

import { products } from '@/data/mock/products';

/**
 * Get a single product by ID
 * @param {number|string} id - Product ID
 * @returns {object|null} Product object or null
 */
export function getProductById(id) {
  return products.find((p) => p.id === Number(id));
}

/**
 * Get all products in a category
 * @param {string} categoryId - Category ID
 * @returns {array} Array of products in category
 */
export function getProductsByCategory(categoryId) {
  return products.filter((p) => p.category === categoryId);
}

/**
 * Get all featured products
 * @returns {array} Array of featured products
 */
export function getFeaturedProducts() {
  return products.filter((p) => p.isFeatured);
}

/**
 * Get hot/trending products
 * @returns {array} Array of hot products
 */
export function getHotProducts() {
  return products.filter((p) => p.isHot);
}

/**
 * Get new products
 * @returns {array} Array of new products
 */
export function getNewProducts() {
  return products.filter((p) => p.isNew);
}

/**
 * Get related products (same category, excluding current product)
 * @param {object} product - Current product
 * @param {number} limit - Maximum number of results
 * @returns {array} Array of related products
 */
export function getRelatedProducts(product, limit = 4) {
  return products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, limit);
}

export default {
  getProductById,
  getProductsByCategory,
  getFeaturedProducts,
  getHotProducts,
  getNewProducts,
  getRelatedProducts,
};
