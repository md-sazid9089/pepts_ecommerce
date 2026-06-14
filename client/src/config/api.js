/**
 * ============================================================================
 * API CONFIGURATION
 * ============================================================================
 * Centralized configuration for backend API connection
 * 
 * Environment Variables:
 * - VITE_API_URL: Backend API base URL (set in .env)
 * - Defaults to production API for local development
 * ============================================================================
 */

// Backend API URL - read from VITE_API_URL env var.
// Local development uses the deployed API because the local backend cannot
// connect to the production database from this network.
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'https://pepta-api.vercel.app'

export const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
}

export default API_BASE_URL
