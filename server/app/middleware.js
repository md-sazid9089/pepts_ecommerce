import { NextResponse } from 'next/server'

/**
 * ============================================================================
 * CORS MIDDLEWARE
 * ============================================================================
 * Handles CORS preflight (OPTIONS) and attaches Access-Control headers to
 * every /api/* response.
 *
 * ROOT CAUSE OF CHROME/FIREFOX FAILURES:
 * The browser Origin header includes the subdomain (https://www.pepta.shopping).
 * If FRONTEND_URL only listed https://pepta.shopping (no www), the exact-match
 * failed → resolvedOrigin was null → no CORS headers → browser blocked request.
 *
 * FIX: Always parse FRONTEND_URL at runtime PLUS add a domain-pattern fallback
 * so any *.pepta.shopping subdomain is also allowed.
 * ============================================================================
 */

/** Production domains that are always trusted, regardless of env var. */
const PRODUCTION_DOMAINS = [
  'https://www.pepta.shopping',
  'https://pepta.shopping',
]

/**
 * Returns the list of allowed CORS origins, parsed fresh at runtime.
 * Called INSIDE the middleware function so Edge Runtime has loaded env vars.
 */
function getAllowedOrigins() {
  const raw = process.env.FRONTEND_URL || 'http://localhost:5173'
  const fromEnv = raw.split(',').map((u) => u.trim()).filter(Boolean)
  // Merge env list with hardcoded production domains (deduped)
  return [...new Set([...PRODUCTION_DOMAINS, ...fromEnv])]
}

/**
 * Returns the exact origin string to use in Access-Control-Allow-Origin,
 * or null if the request origin is not trusted.
 *
 * Priority:
 *   1. Exact match in allow-list
 *   2. Any *.pepta.shopping subdomain
 *   3. localhost / 127.0.0.1 (dev)
 *   4. *.vercel.app (preview deploys)
 */
function resolveAllowedOrigin(origin) {
  if (!origin) return null  // same-site / server-to-server — skip CORS

  const allowed = getAllowedOrigins()

  // 1. Exact match
  if (allowed.includes(origin)) return origin

  // 2. Any pepta.shopping subdomain (handles www, app, api, preview, etc.)
  try {
    const { hostname } = new URL(origin)
    if (hostname === 'pepta.shopping' || hostname.endsWith('.pepta.shopping')) {
      return origin
    }
  } catch {
    // malformed origin — deny
  }

  // 3. Localhost / 127.0.0.1 for local dev
  if (origin.includes('localhost') || origin.includes('127.0.0.1')) return origin

  // 4. Vercel preview deployments
  if (origin.endsWith('.vercel.app')) return origin

  return null
}

/**
 * Verify a JWT using jose (Edge Runtime compatible).
 * Returns the decoded payload on success, or null if the token is
 * missing, expired, malformed, or has an invalid signature.
 *
 * jose.jwtVerify performs FULL HMAC-SHA256 signature validation against
 * JWT_SECRET — a token crafted with the correct structure but the wrong
 * secret is explicitly rejected here rather than inside each route handler.
 */
async function verifyJwt(token) {
  try {
    const { jwtVerify } = await import('jose')
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)
    return payload
  } catch {
    return null
  }
}

/** Attach all CORS headers to a response (mutates in-place). */
function applyCorsHeaders(response, resolvedOrigin) {
  if (!resolvedOrigin) return
  response.headers.set('Access-Control-Allow-Origin',      resolvedOrigin)
  response.headers.set('Access-Control-Allow-Methods',     'GET, POST, PUT, PATCH, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers',     'Content-Type, Authorization, X-Requested-With, Accept, Cache-Control')
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  response.headers.set('Access-Control-Max-Age',           '86400')
  response.headers.set('Vary',                             'Origin')
}

export async function middleware(request) {
  console.log(`[Middleware] ${request.method} ${request.nextUrl.pathname}`)
  const { pathname } = request.nextUrl
  const origin = request.headers.get('origin')
  const resolvedOrigin = resolveAllowedOrigin(origin)

  // ── 1. Preflight (OPTIONS) ─────────────────────────────────────────────────
  // Chrome and Firefox send an OPTIONS request before the real request.
  // We MUST return 200 (or 204) immediately with CORS headers — no route handler.
  if (request.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 200 })
    applyCorsHeaders(response, resolvedOrigin)
    return response
  }

  // ── 2. JWT Protection for /api/protected/* ────────────────────────────────
  if (pathname.startsWith('/api/protected')) {
    // Read from httpOnly cookie (preferred) — falls back to Authorization header
    // for server-to-server calls and API tools (Postman, curl).
    const cookieToken = request.cookies.get('authToken')?.value
    const authHeader = request.headers.get('authorization')
    const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null
    const token = cookieToken || headerToken

    if (!token) {
      const response = NextResponse.json(
        { success: false, code: 401, message: 'Unauthorized — Missing token' },
        { status: 401 }
      )
      applyCorsHeaders(response, resolvedOrigin)
      return response
    }

    // Full HMAC signature verification — rejects forged tokens
    const decoded = await verifyJwt(token)
    if (!decoded) {
      const response = NextResponse.json(
        { success: false, code: 401, message: 'Unauthorized — Invalid or expired token' },
        { status: 401 }
      )
      applyCorsHeaders(response, resolvedOrigin)
      return response
    }

    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-id',   decoded.userId || '')
    requestHeaders.set('x-user-role', decoded.role   || 'customer')

    const response = NextResponse.next({ request: { headers: requestHeaders } })
    applyCorsHeaders(response, resolvedOrigin)
    return response
  }

  // ── 3. All other API requests ─────────────────────────────────────────────
  const response = NextResponse.next()
  applyCorsHeaders(response, resolvedOrigin)
  return response
}

// Apply to all /api/* paths only
export const config = {
  matcher: '/api/:path*',
}
