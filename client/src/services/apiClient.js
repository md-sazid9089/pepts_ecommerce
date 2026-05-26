/**
 * ============================================================================
 * API CLIENT SERVICE
 * ============================================================================
 * Central HTTP client with automatic endpoint fallback.
 *
 * Features:
 * ✅ Automatic fallback: tries production first, then local if it fails
 * ✅ Health checks every 30 seconds to detect best endpoint
 * ✅ GET, POST, PUT, PATCH, DELETE methods
 * ✅ credentials: 'include' — cookie sent automatically
 * ✅ Request timeout with AbortController (10s default per endpoint)
 * ✅ Network error detection and retry logic
 * ============================================================================
 */

import API_BASE_URL from "@/config/api"

const isDev = import.meta.env.DEV
const log = isDev ? (...args) => console.log("[API]", ...args) : () => {}
const logError = isDev ? (...args) => console.error("[API]", ...args) : () => {}

const DEFAULT_TIMEOUT_MS = 10_000  // 10 seconds per endpoint attempt
const HEALTH_CHECK_INTERVAL = 30_000  // Check health every 30 seconds

// Deduplicate API endpoints and add fallback
const API_ENDPOINTS = (() => {
  const endpoints = [
    'https://pepta-api.vercel.app',
    'http://localhost:3000'
  ]
  return [...new Set(endpoints)] // Remove duplicates
})()

class ApiClient {
  constructor(primaryUrl) {
    this.primaryUrl = primaryUrl
    this.endpoints = API_ENDPOINTS
    this.currentBestUrl = primaryUrl
    this.lastHealthCheck = 0
    this.endpointHealth = {} // { url: { ok: bool, lastChecked: timestamp } }
    
    // Initialize health tracking
    this.endpoints.forEach(url => {
      this.endpointHealth[url] = { ok: true, lastChecked: 0 }
    })
  }

  /**
   * Simple health check - 3 second timeout
   * @private
   */
  async _checkHealth(url) {
    try {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), 3000)
      
      const response = await fetch(`${url}/api/health`, {
        method: 'GET',
        signal: controller.signal,
        credentials: 'include',
      })
      
      clearTimeout(timer)
      return response.ok
    } catch {
      return false
    }
  }

  /**
   * Determine best endpoint based on recent health checks
   * @private
   */
  async _getBestUrl() {
    const now = Date.now()
    
    // Only check every 30 seconds
    if (now - this.lastHealthCheck < HEALTH_CHECK_INTERVAL) {
      return this.currentBestUrl
    }
    
    this.lastHealthCheck = now
    
    // Check health of all endpoints in parallel
    const results = await Promise.all(
      this.endpoints.map(async (url) => ({
        url,
        healthy: await this._checkHealth(url)
      }))
    )
    
    // Update health tracking
    results.forEach(({ url, healthy }) => {
      this.endpointHealth[url] = { ok: healthy, lastChecked: now }
    })
    
    // Choose healthy endpoint; prefer primary
    const healthyEndpoints = results
      .filter(r => r.healthy)
      .map(r => r.url)
    
    if (healthyEndpoints.length > 0) {
      this.currentBestUrl = healthyEndpoints[0]
    }
    
    return this.currentBestUrl
  }

  getHeaders() {
    return {
      'Content-Type': 'application/json',
    }
  }

  /**
   * Retry wrapper - tries each endpoint for network errors only
   * Does NOT retry on 4xx/5xx HTTP responses
   * @private
   */
  async _fetchWithFallback(endpoint, options = {}, timeoutMs = DEFAULT_TIMEOUT_MS) {
    // Try each endpoint until one succeeds
    for (const baseUrl of this.endpoints) {
      try {
        const controller = new AbortController()
        const timer = setTimeout(() => controller.abort(), timeoutMs)
        
        const url = this._buildUrl(baseUrl, endpoint)
        
        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
          cache: 'no-store',
          credentials: 'include',
        })
        
        clearTimeout(timer)
        return response
      } catch (err) {
        clearTimeout(timer)
        
        // Only retry on network errors (timeout, connection refused, etc)
        // NOT on HTTP errors like 401, 500, etc
        const isNetworkError = 
          err.name === 'AbortError' ||  // Timeout
          err instanceof TypeError      // Network error (CORS, connection refused, etc)
        
        if (!isNetworkError) {
          throw err
        }
        
        logError(`Endpoint ${baseUrl} failed (${err.message}), trying next...`)
        
        // Try next endpoint
        continue
      }
    }
    
    // All endpoints failed
    throw new Error('All API endpoints are unavailable')
  }

  _buildUrl(baseUrl, endpoint) {
    const base = baseUrl.replace(/\/+$/, '')
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
    return `${base}${path}`
  }

  _getCleanUrl(endpoint) {
    const base = this.currentBestUrl.replace(/\/+$/, '')
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
    return `${base}${path}`
  }

  async get(endpoint, params = {}) {
    const cleanUrl = this._getCleanUrl(endpoint)
    const url = new URL(cleanUrl)
    
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) url.searchParams.append(k, v)
    })
    
    log(`GET ${url.toString()}`)
    
    try {
      const response = await this._fetchWithFallback(endpoint, {
        method: "GET",
        headers: this.getHeaders(),
      })
      return this._handleResponse(response)
    } catch (error) {
      return this._handleError(error)
    }
  }

  async post(endpoint, data = {}) {
    log(`POST ${this._getCleanUrl(endpoint)}`)
    try {
      const response = await this._fetchWithFallback(endpoint, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      })
      return this._handleResponse(response)
    } catch (error) {
      return this._handleError(error)
    }
  }

  async put(endpoint, data = {}) {
    log(`PUT ${this._getCleanUrl(endpoint)}`)
    try {
      const response = await this._fetchWithFallback(endpoint, {
        method: "PUT",
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      })
      return this._handleResponse(response)
    } catch (error) {
      return this._handleError(error)
    }
  }

  async patch(endpoint, data = {}) {
    log(`PATCH ${this._getCleanUrl(endpoint)}`)
    try {
      const response = await this._fetchWithFallback(endpoint, {
        method: "PATCH",
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      })
      return this._handleResponse(response)
    } catch (error) {
      return this._handleError(error)
    }
  }

  async delete(endpoint) {
    log(`DELETE ${this._getCleanUrl(endpoint)}`)
    try {
      const response = await this._fetchWithFallback(endpoint, {
        method: "DELETE",
        headers: this.getHeaders(),
      })
      return this._handleResponse(response)
    } catch (error) {
      return this._handleError(error)
    }
  }

  async _handleResponse(response) {
    let data
    try {
      data = await response.json()
    } catch {
      logError("Failed to parse response JSON")
      return { success: false, code: response.status, message: "Failed to parse server response", data: null }
    }

    if (!response.ok) {
      logError(`HTTP ${response.status}:`, data?.message)
      return {
        success: false,
        code: response.status,
        message: data?.message || `HTTP Error ${response.status}`,
        data: data?.data ?? null,
        error: data?.error ?? null,
      }
    }

    return data
  }

  _handleError(error) {
    logError("Request failed:", error.message)
    return {
      success: false,
      code: 0,
      message: error.message || "Network error. Please check your connection.",
      data: null,
      error: { message: error.message },
    }
  }
}

const apiClient = new ApiClient(API_BASE_URL)
export default apiClient
