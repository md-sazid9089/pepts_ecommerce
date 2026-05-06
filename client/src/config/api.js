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

// Empty string → all API calls are relative paths (/api/...)
// Dev:  Vite proxy forwards them to https://pepta-api.vercel.app
// Prod: Vercel rewrites forward them to https://pepta-api.vercel.app
// Result: browser never makes a cross-origin request → SameSite=Strict works
const API_BASE_URL = ''

export const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
}

export default API_BASE_URL
