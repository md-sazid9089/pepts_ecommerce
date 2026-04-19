/**
 * src/data/products.jsx
 * 
 * BACKWARDS COMPATIBILITY LAYER
 * This file re-exports from modular data structure for backwards compatibility.
 * 
 * New imports should use the modular structure:
 * - @/data/constants/categories
 * - @/data/constants/brands
 * - @/data/mock/products
 * - @/data/mock/bannerSlides
 * - @/data/utils/pricing
 * - @/data/queries/productQueries
 */

// Re-export constants
export { categories } from '@/data/constants/categories';
export { brands } from '@/data/constants/brands';

// Re-export product data
export { products } from '@/data/mock/products';
export { bannerSlides } from '@/data/mock/bannerSlides';

// Re-export pricing utilities
export {
  formatPrice,
  calculateTieredPrice,
  calculateBulkDiscount,
} from '@/data/utils/pricing';

// Re-export query functions
export {
  getProductById,
  getProductsByCategory,
  getFeaturedProducts,
  getHotProducts,
  getNewProducts,
  getRelatedProducts,
} from '@/data/queries/productQueries';
