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

// Backend API URL — always use production, with fallback
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
