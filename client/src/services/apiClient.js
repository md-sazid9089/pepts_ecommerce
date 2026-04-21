/**
 * ============================================================================
 * API CLIENT SERVICE
 * ============================================================================
 * Central HTTP client for all backend API requests
 * 
 * Features:
 * ✅ GET, POST, PUT, DELETE methods
 * ✅ Automatic Bearer token inclusion
 * ✅ Token persistence in localStorage
 * ✅ Automatic error handling
 * ✅ Request/response logging
 * ✅ CORS support
 * ============================================================================
 */

import API_BASE_URL from "@/config/api"

class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL
    this.token = localStorage.getItem("authToken") || null
  }

  /**
   * Set authentication token
   * Called after user logs in
   * @param {string} token - JWT or API token
   */
  setToken(token) {
    this.token = token
    localStorage.setItem("authToken", token)
  }

  /**
   * Get stored authentication token
   * @returns {string|null} - Token or null if not authenticated
   */
  getToken() {
    return this.token || localStorage.getItem("authToken")
  }

  /**
   * Clear authentication token
   * Called on logout
   */
  clearToken() {
    this.token = null
    localStorage.removeItem("authToken")
  }

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated() {
    return !!this.getToken()
  }

  /**
   * Build request headers with auth token
   * @returns {object} - Headers object
   */
  getHeaders() {
    const headers = {
      "Content-Type": "application/json",
    }

    const token = this.getToken()
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    return headers
  }

  /**
   * Make GET request
   * @param {string} endpoint - API endpoint (e.g., "/api/products")
   * @param {object} params - Query parameters
   * @returns {Promise<object>} - API response
   */
  async get(endpoint, params = {}) {
    const url = new URL(`${this.baseURL}${endpoint}`)
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value)
      }
    })

    try {
      console.log(`[API] GET ${url.toString()}`)
      const response = await fetch(url.toString(), {
        method: "GET",
        headers: this.getHeaders(),
      })

      return await this.handleResponse(response)
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Make POST request
   * @param {string} endpoint - API endpoint
   * @param {object} data - Request body
   * @returns {Promise<object>} - API response
   */
  async post(endpoint, data = {}) {
    try {
      console.log(`[API] POST ${this.baseURL}${endpoint}`, data)
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      })

      return await this.handleResponse(response)
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Make PUT request
   * @param {string} endpoint - API endpoint
   * @param {object} data - Request body
   * @returns {Promise<object>} - API response
   */
  async put(endpoint, data = {}) {
    try {
      console.log(`[API] PUT ${this.baseURL}${endpoint}`, data)
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: "PUT",
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      })

      return await this.handleResponse(response)
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Make PATCH request
   * @param {string} endpoint - API endpoint
   * @param {object} data - Request body
   * @returns {Promise<object>} - API response
   */
  async patch(endpoint, data = {}) {
    try {
      console.log(`[API] PATCH ${this.baseURL}${endpoint}`, data)
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: "PATCH",
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      })

      return await this.handleResponse(response)
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Make DELETE request
   * @param {string} endpoint - API endpoint
   * @returns {Promise<object>} - API response
   */
  async delete(endpoint) {
    try {
      console.log(`[API] DELETE ${this.baseURL}${endpoint}`)
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: "DELETE",
        headers: this.getHeaders(),
      })

      return await this.handleResponse(response)
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Handle API response
   * @private
   * @param {Response} response - Fetch response object
   * @returns {Promise<object>} - Parsed response
   */
  async handleResponse(response) {
    let data
    try {
      data = await response.json()
    } catch (error) {
      console.error("[API] Failed to parse response JSON", error)
      return {
        success: false,
        code: response.status,
        message: "Failed to parse server response",
        data: null,
      }
    }

    console.log(`[API] Response ${response.status}:`, data)

    // If response is not ok (4xx, 5xx), still return the data but mark as failure
    if (!response.ok) {
      return {
        success: false,
        code: response.status,
        message: data.message || `HTTP Error ${response.status}`,
        data: data.data || null,
        error: data.error || null,
      }
    }

    return data
  }

  /**
   * Handle request error
   * @private
   * @param {Error} error - Error object
   * @returns {object} - Error response
   */
  handleError(error) {
    console.error("[API] Request failed:", error)
    return {
      success: false,
      code: 0,
      message: error.message || "Network error. Please check your connection.",
      data: null,
      error: {
        message: error.message,
      },
    }
  }
}

// Create singleton instance
const apiClient = new ApiClient(API_BASE_URL)

export default apiClient
