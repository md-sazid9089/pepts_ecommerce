/**
 * ============================================================================
 * API CLIENT SERVICE
 * ============================================================================
 * Central HTTP client for all backend API requests.
 *
 * Features:
 * ✅ GET, POST, PUT, PATCH, DELETE methods
 * ✅ Automatic Bearer token from localStorage
 * ✅ Request timeout with AbortController (10s default)
 * ✅ Dev-only debug logging (no logs in production)
 * ✅ Consistent error shape
 * ============================================================================
 */

import API_BASE_URL from "@/config/api"

// Only log in development
const isDev = import.meta.env.DEV
const log = isDev ? (...args) => console.log("[API]", ...args) : () => {}
const logError = isDev ? (...args) => console.error("[API]", ...args) : () => {}

const DEFAULT_TIMEOUT_MS = 45_000

class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL
    this.token = localStorage.getItem("authToken") || null
  }

  setToken(token) {
    this.token = token
    localStorage.setItem("authToken", token)
  }

  getToken() {
    return this.token || localStorage.getItem("authToken")
  }

  clearToken() {
    this.token = null
    localStorage.removeItem("authToken")
  }

  isAuthenticated() {
    return !!this.getToken()
  }

  getHeaders() {
    const headers = { 
      "Content-Type": "application/json",
    }
    const token = this.getToken()
    if (token) headers.Authorization = `Bearer ${token}`
    return headers
  }

  /**
   * Core fetch wrapper with AbortController timeout.
   * Uses cache: 'no-store' to bypass browser cache without triggering CORS preflight.
   * @private
   */
  async _fetch(url, options = {}, timeoutMs = DEFAULT_TIMEOUT_MS) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    try {
      const response = await fetch(url, { 
        ...options, 
        signal: controller.signal,
        cache: 'no-store',  // ✅ Browser-native cache bypass — no CORS headers needed
      })
      return response
    } catch (err) {
      if (err.name === "AbortError") {
        throw new Error(`Request timed out after ${timeoutMs / 1000}s`)
      }
      throw err
    } finally {
      clearTimeout(timer)
    }
  }

  _getCleanUrl(endpoint) {
    const base = this.baseURL.replace(/\/+$/, "") // Remove trailing slashes
    const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`
    return `${base}${path}`
  }

  async get(endpoint, params = {}) {
    const url = new URL(this._getCleanUrl(endpoint))
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) url.searchParams.append(k, v)
    })
    log(`GET ${url.toString()}`)
    try {
      const response = await this._fetch(url.toString(), {
        method: "GET",
        headers: this.getHeaders(),
      })
      return this._handleResponse(response)
    } catch (error) {
      return this._handleError(error)
    }
  }

  async post(endpoint, data = {}) {
    const url = this._getCleanUrl(endpoint)
    const token = this.getToken()
    log(`POST ${url} (Auth: ${token ? 'YES (' + token.substring(0, 10) + '...)' : 'NO'})`)
    try {
      const response = await this._fetch(url, {
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
    const url = this._getCleanUrl(endpoint)
    log(`PUT ${url}`)
    try {
      const response = await this._fetch(url, {
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
    const url = this._getCleanUrl(endpoint)
    log(`PATCH ${url}`)
    try {
      const response = await this._fetch(url, {
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
    const url = this._getCleanUrl(endpoint)
    log(`DELETE ${url}`)
    try {
      const response = await this._fetch(url, {
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
