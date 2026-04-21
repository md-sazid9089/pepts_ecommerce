/**
 * ============================================================================
 * INQUIRIES API SERVICE
 * ============================================================================
 * Handles B2B wholesale inquiry submissions and management
 * ============================================================================
 */

import apiClient from "@/services/apiClient"

export const inquiriesApi = {
  /**
   * Get all inquiries (admin)
   * @param {number} page - Page number
   * @param {number} pageSize - Items per page
   * @param {object} filters - Filter options { status, sortBy }
   * @returns {Promise<object>} - Inquiries list
   */
  getAll: async (page = 1, pageSize = 10, filters = {}) => {
    try {
      const response = await apiClient.get("/api/inquiries", {
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
   * Submit a new wholesale inquiry
   * Public endpoint - no authentication required
   * @param {object} inquiryData - Inquiry data
   * @returns {Promise<object>} - Created inquiry
   * 
   * EXAMPLE:
   * const response = await inquiriesApi.submit({
   *   companyName: "Retail Store Ltd.",
   *   contactEmail: "buyer@store.com",
   *   contactPhone: "+1-555-0123",
   *   productName: "Fashion Dolls",
   *   requestedQuantity: 500,
   *   message: "Looking for bulk wholesale pricing"
   * });
   */
  submit: async (inquiryData) => {
    try {
      const response = await apiClient.post("/api/inquiries", inquiryData)
      return response
    } catch (error) {
      return { success: false, message: error.message }
    }
  },

  /**
   * Get inquiry details
   * @param {string} inquiryId - Inquiry ID
   * @returns {Promise<object>} - Inquiry details
   */
  getById: async (inquiryId) => {
    try {
      const response = await apiClient.get(`/api/inquiries/${inquiryId}`)
      return response
    } catch (error) {
      return { success: false, message: error.message }
    }
  },

  /**
   * Update inquiry status and notes (admin)
   * @param {string} inquiryId - Inquiry ID
   * @param {object} updateData - { status, notes }
   * @returns {Promise<object>} - Updated inquiry
   */
  update: async (inquiryId, updateData) => {
    try {
      const response = await apiClient.put(`/api/inquiries/${inquiryId}`, updateData)
      return response
    } catch (error) {
      return { success: false, message: error.message }
    }
  },

  /**
   * Delete inquiry (admin)
   * @param {string} inquiryId - Inquiry ID
   * @returns {Promise<object>} - Success response
   */
  delete: async (inquiryId) => {
    try {
      const response = await apiClient.delete(`/api/inquiries/${inquiryId}`)
      return response
    } catch (error) {
      return { success: false, message: error.message }
    }
  },

  /**
   * Mark inquiry as replied (admin)
   * @param {string} inquiryId - Inquiry ID
   * @returns {Promise<object>} - Updated inquiry
   */
  markReplied: async (inquiryId) => {
    try {
      const response = await apiClient.put(`/api/inquiries/${inquiryId}`, {
        status: "replied",
      })
      return response
    } catch (error) {
      return { success: false, message: error.message }
    }
  },

  /**
   * Get pending inquiries count
   * @returns {Promise<number>} - Count of pending inquiries
   */
  getPendingCount: async () => {
    try {
      const response = await apiClient.get("/api/inquiries", {
        status: "new",
        pageSize: 1,
      })
      return response.data?.pagination?.total || 0
    } catch (error) {
      return 0
    }
  },
}

export default inquiriesApi
