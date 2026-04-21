/**
 * ============================================================================
 * REVIEWS API SERVICE
 * ============================================================================
 * Handles product review submissions and management
 * ============================================================================
 */

import apiClient from "@/services/apiClient"

export const reviewsApi = {
  /**
   * Get reviews for a product
   * @param {string} productId - Product ID
   * @param {number} page - Page number
   * @param {number} pageSize - Items per page
   * @returns {Promise<object>} - Reviews list with average rating
   */
  getByProduct: async (productId, page = 1, pageSize = 10) => {
    try {
      const response = await apiClient.get(`/api/products/${productId}/reviews`, {
        page,
        pageSize,
      })
      return response
    } catch (error) {
      return { success: false, message: error.message }
    }
  },

  /**
   * Submit a review for a product
   * @param {string} productId - Product ID
   * @param {object} reviewData - { rating, title, comment, email }
   * @returns {Promise<object>} - Created review
   * 
   * EXAMPLE:
   * const response = await reviewsApi.submit("prod_123", {
   *   rating: 5,
   *   title: "Great product!",
   *   comment: "Highly recommended",
   *   email: "user@example.com"
   * });
   */
  submit: async (productId, reviewData) => {
    try {
      const response = await apiClient.post(
        `/api/products/${productId}/reviews`,
        reviewData
      )
      return response
    } catch (error) {
      return { success: false, message: error.message }
    }
  },

  /**
   * Get all reviews (admin)
   * @param {number} page - Page number
   * @param {number} pageSize - Items per page
   * @param {object} filters - Filter options { status }
   * @returns {Promise<object>} - Reviews list
   */
  getAll: async (page = 1, pageSize = 10, filters = {}) => {
    try {
      const response = await apiClient.get("/api/reviews", {
        page,
        pageSize,
        ...filters,
      })
      return response
    } catch (error) {
      return { success: false, message: error.message }
    }
  },

  /**
   * Approve a review (admin)
   * @param {string} reviewId - Review ID
   * @returns {Promise<object>} - Updated review
   */
  approve: async (reviewId) => {
    try {
      const response = await apiClient.put(`/api/reviews/${reviewId}`, {
        status: "approved",
      })
      return response
    } catch (error) {
      return { success: false, message: error.message }
    }
  },

  /**
   * Reject a review (admin)
   * @param {string} reviewId - Review ID
   * @returns {Promise<object>} - Updated review
   */
  reject: async (reviewId) => {
    try {
      const response = await apiClient.put(`/api/reviews/${reviewId}`, {
        status: "rejected",
      })
      return response
    } catch (error) {
      return { success: false, message: error.message }
    }
  },

  /**
   * Delete a review (admin)
   * @param {string} reviewId - Review ID
   * @returns {Promise<object>} - Success response
   */
  delete: async (reviewId) => {
    try {
      const response = await apiClient.delete(`/api/reviews/${reviewId}`)
      return response
    } catch (error) {
      return { success: false, message: error.message }
    }
  },
}

export default reviewsApi
