/**
 * ============================================================================
 * CORS UTILITY — for App Router route handlers
 * ============================================================================
 * Usage in any route.js:
 *
 *   import { handleCors } from "@/src/lib/cors"
 *
 *   export async function OPTIONS(request) {
 *     return handleCors(request)
 *   }
 *
 *   export async function GET(request) {
 *     // ... your logic ...
 *     const response = NextResponse.json(data)
 *     return withCors(request, response)
 *   }
 * ============================================================================
 */

import { NextResponse } from 'next/server'

const PRODUCTION_DOMAINS = [
  'https://www.pepta.shopping',
  'https://pepta.shopping',
]

/**
 * Resolves the allowed origin for a given request origin string.
 * Returns the origin if allowed, or null if not.
 */
export function resolveOrigin(origin) {
  if (!origin) return null

  // Merge hardcoded + env-based allow-list
  const fromEnv = (process.env.FRONTEND_URL || '')
    .split(',')
    .map((u) => u.trim())
    .filter(Boolean)
  const allowed = [...new Set([...PRODUCTION_DOMAINS, ...fromEnv])]

  // Exact match
  if (allowed.includes(origin)) return origin

  // Any *.pepta.shopping subdomain
  try {
    const { hostname } = new URL(origin)
    if (hostname === 'pepta.shopping' || hostname.endsWith('.pepta.shopping')) {
      return origin
    }
  } catch { /* malformed */ }

  // Localhost dev
  if (origin.includes('localhost') || origin.includes('127.0.0.1')) return origin

  // Vercel previews
  if (origin.endsWith('.vercel.app')) return origin

  return null
}

/**
 * Sets all required CORS headers on a NextResponse.
 * @param {Request} request - The incoming request (to read Origin header)
 * @param {NextResponse} response - The response to mutate
 * @returns {NextResponse} The same response (mutated)
 */
export function withCors(request, response) {
  const origin = request.headers.get('origin')
  const resolvedOrigin = resolveOrigin(origin)
  if (resolvedOrigin) {
    response.headers.set('Access-Control-Allow-Origin',      resolvedOrigin)
    response.headers.set('Access-Control-Allow-Credentials', 'true')
    response.headers.set('Access-Control-Allow-Methods',     'GET, POST, PUT, PATCH, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers',     'Content-Type, Authorization')
    response.headers.set('Vary',                             'Origin')
  }
  return response
}

/**
 * Handles an OPTIONS preflight request.
 * Returns a 200 response with full CORS headers.
 * Use as the named OPTIONS export in route handlers.
 *
 * @param {Request} request
 * @returns {NextResponse}
 */
export function handleCors(request) {
  const origin = request.headers.get('origin')
  const resolvedOrigin = resolveOrigin(origin)
  const response = new NextResponse(null, { status: 200 })
  if (resolvedOrigin) {
    response.headers.set('Access-Control-Allow-Origin',      resolvedOrigin)
    response.headers.set('Access-Control-Allow-Credentials', 'true')
    response.headers.set('Access-Control-Allow-Methods',     'GET, POST, PUT, PATCH, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers',     'Content-Type, Authorization')
    response.headers.set('Access-Control-Max-Age',           '86400')
    response.headers.set('Vary',                             'Origin')
  }
  return response
}
