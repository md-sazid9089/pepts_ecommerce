/**
 * ============================================================================
 * AUTHENTICATION API SERVICE
 * ============================================================================
 * Handles all authentication-related API calls.
 *
 * Token storage has been migrated to httpOnly cookies.
 * The server sets/clears the cookie — no manual token management here.
 *
 * Features:
 * ✅ User registration
 * ✅ User login
 * ✅ Get current user profile
 * ✅ Logout (POSTs to server to clear the httpOnly cookie)
 * ============================================================================
 */

import apiClient from "@/services/apiClient"

export const authApi = {
  /**
   * Register a new user account
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {string} firstName - First name
   * @param {string} lastName - Last name
   * @returns {Promise<object>} - API response with user data and token
   * 
   * EXAMPLE:
   * const response = await authApi.register("user@example.com", "pass123", "John", "Doe");
   * if (response.success) {
   *   // Token is automatically stored
   * }
   */
  register: async (email, password, firstName, lastName) => {
    try {
      const response = await apiClient.post('/api/auth/register', {
        email,
        password,
        firstName,
        lastName,
      })
      // Server sets authToken httpOnly cookie on success — nothing to do here
      return response
    } catch (error) {
      return { success: false, message: error.message }
    }
  },

  /**
   * Login with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<object>} - API response with user data and token
   * 
   * EXAMPLE:
   * const response = await authApi.login("user@example.com", "pass123");
   * if (response.success) {
   *   // User is now authenticated
   *   const user = response.data;
   * }
   */
  login: async (email, password) => {
    try {
      const response = await apiClient.post('/api/auth/login', { email, password })
      // Server sets authToken httpOnly cookie on success — nothing to do here
      return response
    } catch (error) {
      return { success: false, message: error.message }
    }
  },

  /**
   * Get current logged-in user profile
   * Requires authentication
   * @returns {Promise<object>} - User profile data
   * 
   * EXAMPLE:
   * const response = await authApi.getCurrentUser();
   * if (response.success) {
   *   console.log(response.data.email, response.data.firstName);
   * }
   */
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get("/api/auth/me")
      return response
    } catch (error) {
      return {
        success: false,
        message: error.message,
      }
    }
  },

  /**
   * Logout — POSTs to server to clear the httpOnly authToken cookie.
   * The browser cannot clear an httpOnly cookie directly.
   */
  logout: async () => {
    try {
      return await apiClient.post('/api/auth/logout', {})
    } catch {
      return { success: true, message: 'Logged out' }
    }
  },
}

export default authApi
