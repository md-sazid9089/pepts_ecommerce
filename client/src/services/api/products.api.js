/**
 * ============================================================================
 * PRODUCTS API SERVICE
 * ============================================================================
 * Handles all product-related API calls
 * 
 * Features:
 * ✅ Get all products with pagination and filtering
 * ✅ Get single product details
 * ✅ Create product (admin)
 * ✅ Update product (admin)
 * ✅ Delete product (admin)
 * ✅ Get bulk pricing
 * ============================================================================
 */

import apiClient from "@/services/apiClient"

export const productsApi = {
  /**
   * Get all products with pagination and filters
   * @param {number} page - Page number (default: 1)
   * @param {number} pageSize - Items per page (default: 20)
   * @param {object} filters - Filter options { category, search, sortBy, sortOrder }
   * @returns {Promise<object>} - Products list with pagination
   * 
   * EXAMPLE:
   * const response = await productsApi.getAll(1, 20, {
   *   category: "electronics",
   *   search: "phone"
   * });
   * console.log(response.data.items);
   * console.log(response.data.pagination);
   */
  getAll: async (page = 1, pageSize = 20, filters = {}) => {
    try {
      const params = {
        page,
        pageSize,
        ...filters,
      }

      const response = await apiClient.get("/api/products", params)
      return response
    } catch (error) {
      return {
        success: false,
        message: error.message,
      }
    }
  },

  /**
   * Get a single product by ID with full details
   * @param {string} productId - Product ID
   * @returns {Promise<object>} - Product details including reviews, bulk pricing
   * 
   * EXAMPLE:
   * const response = await productsApi.getById("prod_123");
   * if (response.success) {
   *   console.log(response.data.title, response.data.price);
   *   console.log(response.data.reviews); // List of reviews
   *   console.log(response.data.bulkPrices); // Tiered pricing
   * }
   */
  getById: async (productId) => {
    try {
      const response = await apiClient.get(`/api/products/${productId}`)
      return response
    } catch (error) {
      return {
        success: false,
        message: error.message,
      }
    }
  },

  /**
   * Create a new product (admin only)
   * @param {object} productData - Product data { title, description, price, stock, categoryId }
   * @returns {Promise<object>} - Created product
   * 
   * EXAMPLE:
   * const response = await productsApi.create({
   *   title: "iPhone 15",
   *   description: "Latest Apple smartphone",
   *   price: 999.99,
   *   stock: 100,
   *   categoryId: "cat_1"
   * });
   */
  create: async (productData) => {
    try {
      const response = await apiClient.post("/api/products", productData)
      return response
    } catch (error) {
      return {
        success: false,
        message: error.message,
      }
    }
  },

  /**
   * Update an existing product (admin only)
   * @param {string} productId - Product ID
   * @param {object} productData - Fields to update
   * @returns {Promise<object>} - Updated product
   * 
   * EXAMPLE:
   * const response = await productsApi.update("prod_123", {
   *   title: "iPhone 15 Pro",
   *   price: 1099.99
   * });
   */
  update: async (productId, productData) => {
    try {
      const response = await apiClient.put(`/api/products/${productId}`, productData)
      return response
    } catch (error) {
      return {
        success: false,
        message: error.message,
      }
    }
  },

  /**
   * Delete a product (admin only)
   * @param {string} productId - Product ID
   * @returns {Promise<object>} - Success response
   * 
   * EXAMPLE:
   * const response = await productsApi.delete("prod_123");
   */
  delete: async (productId) => {
    try {
      const response = await apiClient.delete(`/api/products/${productId}`)
      return response
    } catch (error) {
      return {
        success: false,
        message: error.message,
      }
    }
  },

  /**
   * Get bulk pricing for a product
   * @param {string} productId - Product ID
   * @returns {Promise<object>} - Bulk pricing tiers
   * 
   * EXAMPLE:
   * const response = await productsApi.getBulkPricing("prod_123");
   * if (response.success) {
   *   response.data.tiers.forEach(tier => {
   *     console.log(`Buy ${tier.minQuantity} for $${tier.price} each`);
   *   });
   * }
   */
  getBulkPricing: async (productId) => {
    try {
      const response = await apiClient.get(`/api/bulk-pricing/${productId}`)
      return response
    } catch (error) {
      return {
        success: false,
        message: error.message,
      }
    }
  },

  /**
   * Search products
   * @param {string} query - Search query
   * @param {number} pageSize - Items per page
   * @returns {Promise<object>} - Search results
   */
  search: async (query, pageSize = 20) => {
    try {
      const response = await apiClient.get("/api/products", {
        search: query,
        pageSize,
      })
      return response
    } catch (error) {
      return {
        success: false,
        message: error.message,
      }
    }
  },

  /**
   * Get featured/trending products
   * @returns {Promise<object>} - Featured products
   */
  getFeatured: async () => {
    try {
      const response = await apiClient.get("/api/products", {
        featured: true,
        pageSize: 10,
      })
      return response
    } catch (error) {
      return {
        success: false,
        message: error.message,
      }
    }
  },
  /**
   * Upload a product image to Cloudinary (admin only)
   * @param {string} productId - Product ID
   * @param {File} file - Image file from file input
   * @param {string} token - Admin JWT token
   * @returns {Promise<object>} - { imageUrl, publicId, width, height, product }
   *
   * EXAMPLE:
   * const fileInput = document.getElementById('imageInput');
   * const response = await productsApi.uploadImage("prod_123", fileInput.files[0], token);
   * if (response.success) console.log(response.data.imageUrl);
   */
  uploadImage: async (productId, file, token) => {
    try {
      const formData = new FormData()
      formData.append("image", file)

      const apiBase = import.meta.env.VITE_API_URL || "http://localhost:3000"
      const res = await fetch(`${apiBase}/api/products/${productId}/upload-image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // Do NOT set Content-Type — browser sets it automatically with boundary for multipart
        },
        body: formData,
      })

      const data = await res.json()
      return data
    } catch (error) {
      return { success: false, message: error.message }
    }
  },

  /**
   * Remove product image (admin only)
   * @param {string} productId - Product ID
   * @param {string} token - Admin JWT token
   */
  removeImage: async (productId, token) => {
    try {
      const apiBase = import.meta.env.VITE_API_URL || "http://localhost:3000"
      const res = await fetch(`${apiBase}/api/products/${productId}/upload-image`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      return await res.json()
    } catch (error) {
      return { success: false, message: error.message }
    }
  },
}

export default productsApi
