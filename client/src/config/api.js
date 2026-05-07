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

// In production, we use the absolute URL to bypass Vercel rewrite issues
// In development, we use empty string to use the Vite proxy
const API_BASE_URL = import.meta.env.PROD ? (import.meta.env.VITE_API_URL || '') : ''

export const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
}

export default API_BASE_URL
