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

const DEFAULT_TIMEOUT_MS = 10_000

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
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Pragma": "no-cache",
      "Expires": "0"
    }
    const token = this.getToken()
    if (token) headers.Authorization = `Bearer ${token}`
    return headers
  }

  /**
   * Core fetch wrapper with AbortController timeout.
   * @private
   */
  async _fetch(url, options = {}, timeoutMs = DEFAULT_TIMEOUT_MS) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    try {
      const response = await fetch(url, { ...options, signal: controller.signal })
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

  async get(endpoint, params = {}) {
    const url = new URL(`${this.baseURL}${endpoint}`)
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
    log(`POST ${this.baseURL}${endpoint}`)
    try {
      const response = await this._fetch(`${this.baseURL}${endpoint}`, {
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
    log(`PUT ${this.baseURL}${endpoint}`)
    try {
      const response = await this._fetch(`${this.baseURL}${endpoint}`, {
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
    log(`PATCH ${this.baseURL}${endpoint}`)
    try {
      const response = await this._fetch(`${this.baseURL}${endpoint}`, {
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
    log(`DELETE ${this.baseURL}${endpoint}`)
    try {
      const response = await this._fetch(`${this.baseURL}${endpoint}`, {
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
