/**
 * ============================================================================
 * CATEGORIES API SERVICE
 * ============================================================================
 * Handles category-related API calls
 * ============================================================================
 */

import apiClient from "@/services/apiClient"

export const categoriesApi = {
  /**
   * Get all categories
   * @returns {Promise<object>} - Categories list
   */
  getAll: async () => {
    try {
      const response = await apiClient.get("/api/categories")
      return response
    } catch (error) {
      return { success: false, message: error.message }
    }
  },

  /**
   * Get category by ID
   * @param {string} categoryId - Category ID
   * @returns {Promise<object>} - Category details
   */
  getById: async (categoryId) => {
    try {
      const response = await apiClient.get(`/api/categories/${categoryId}`)
      return response
    } catch (error) {
      return { success: false, message: error.message }
    }
  },

  /**
   * Get products in a category
   * @param {string} categoryId - Category ID
   * @param {number} page - Page number
   * @param {number} pageSize - Items per page
   * @returns {Promise<object>} - Products in category
   */
  getProducts: async (categoryId, page = 1, pageSize = 20) => {
    try {
      const response = await apiClient.get(`/api/categories/${categoryId}/products`, {
        page,
        pageSize,
      })
      return response
    } catch (error) {
      return { success: false, message: error.message }
    }
  },

  /**
   * Create category (admin)
   * @param {object} categoryData - { name, description, icon }
   * @returns {Promise<object>} - Created category
   */
  create: async (categoryData) => {
    try {
      const response = await apiClient.post("/api/categories", categoryData)
      return response
    } catch (error) {
      return { success: false, message: error.message }
    }
  },

  /**
   * Update category (admin)
   * @param {string} categoryId - Category ID
   * @param {object} categoryData - Fields to update
   * @returns {Promise<object>} - Updated category
   */
  update: async (categoryId, categoryData) => {
    try {
      const response = await apiClient.put(`/api/categories/${categoryId}`, categoryData)
      return response
    } catch (error) {
      return { success: false, message: error.message }
    }
  },

  /**
   * Delete category (admin)
   * @param {string} categoryId - Category ID
   * @returns {Promise<object>} - Success response
   */
  delete: async (categoryId) => {
    try {
      const response = await apiClient.delete(`/api/categories/${categoryId}`)
      return response
    } catch (error) {
      return { success: false, message: error.message }
    }
  },
}

export default categoriesApi
