/**
 * ============================================================================
 * API CONFIGURATION
 * ============================================================================
 * Centralized configuration for backend API connection
 * 
 * Environment Variables:
 * - VITE_API_URL: Backend API base URL (set in .env)
 * - Defaults to localhost:3000 for development
 * ============================================================================
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

export const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
}

export default API_BASE_URL
