/**
 * ============================================================================
 * ORDERS API SERVICE
 * ============================================================================
 * Handles all order-related API calls
 * ============================================================================
 */

import apiClient from "@/services/apiClient"

export const ordersApi = {
  /**
   * Get all orders (admin)
   * @param {number} page - Page number
   * @param {number} pageSize - Items per page
   * @param {object} filters - Filter options { status, sortBy }
   * @returns {Promise<object>} - Orders list
   */
  getAll: async (page = 1, pageSize = 10, filters = {}) => {
    try {
      const response = await apiClient.get("/api/orders", {
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
   * Get single order
   * @param {string} orderId - Order ID
   * @returns {Promise<object>} - Order details
   */
  getById: async (orderId) => {
    try {
      const response = await apiClient.get(`/api/orders/${orderId}`)
      return response
    } catch (error) {
      return { success: false, message: error.message }
    }
  },

  /**
   * Create new order
   * @param {object} orderData - Order data { items, promoCode }
   * @returns {Promise<object>} - Created order
   * 
   * EXAMPLE:
   * const response = await ordersApi.create({
   *   items: [
   *     { productId: "prod_1", quantity: 2 },
   *     { productId: "prod_2", quantity: 1 }
   *   ],
   *   promoCode: "SAVE10"
   * });
   */
  create: async (orderData) => {
    try {
      const response = await apiClient.post("/api/orders", orderData)
      return response
    } catch (error) {
      return { success: false, message: error.message }
    }
  },

  /**
   * Update order status (admin)
   * @param {string} orderId - Order ID
   * @param {string} status - New status
   * @returns {Promise<object>} - Updated order
   */
  updateStatus: async (orderId, status) => {
    try {
      const response = await apiClient.put(`/api/orders/${orderId}/status`, { status })
      return response
    } catch (error) {
      return { success: false, message: error.message }
    }
  },

  /**
   * Cancel order
   * @param {string} orderId - Order ID
   * @returns {Promise<object>} - Success response
   */
  cancel: async (orderId) => {
    try {
      const response = await apiClient.post(`/api/orders/${orderId}/cancel`, {})
      return response
    } catch (error) {
      return { success: false, message: error.message }
    }
  },

  /**
   * Get user's orders
   * @param {number} page - Page number
   * @returns {Promise<object>} - User's orders
   */
  getUserOrders: async (page = 1) => {
    try {
      const response = await apiClient.get("/api/orders/user", { page })
      return response
    } catch (error) {
      return { success: false, message: error.message }
    }
  },
}

export default ordersApi
