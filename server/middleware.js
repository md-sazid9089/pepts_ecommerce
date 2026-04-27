import { NextResponse } from 'next/server'

/**
 * Returns the list of allowed CORS origins, parsed fresh at runtime.
 * IMPORTANT: Must be called inside the middleware function (not at module level)
 * so that Vercel Edge Runtime has fully loaded the environment variables.
 */
function getAllowedOrigins() {
  const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173"
  return FRONTEND_URL.split(",").map((u) => u.trim())
}

/**
 * Returns the single matching origin to use in Access-Control-Allow-Origin,
 * or null if the request origin is not allowed.
 */
function resolveAllowedOrigin(origin) {
  if (!origin) return null   // no origin = same-site / server-to-server, skip CORS
  const allowedOrigins = getAllowedOrigins()
  if (allowedOrigins.includes(origin)) return origin
  if (origin.includes('localhost') || origin.includes('127.0.0.1')) return origin
  if (origin.endsWith('.vercel.app')) return origin
  return null
}

function isAllowedOrigin(origin) {
  return resolveAllowedOrigin(origin) !== null
}

/**
 * Decode a JWT payload WITHOUT verification (safe for edge routing decisions).
 * Full signature verification happens inside route handlers using jsonwebtoken.
 */
function decodeJwtPayload(token) {
  try {
    const parts = token.split(".")
    if (parts.length !== 3) return null
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/")
    const decoded = JSON.parse(atob(base64))
    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) return null
    return decoded
  } catch {
    return null
  }
}

export function middleware(request) {
  const { pathname } = request.nextUrl
  const origin = request.headers.get('origin')
  const resolvedOrigin = resolveAllowedOrigin(origin)

  // ─── 1. Handle Preflight (OPTIONS) ───
  if (request.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 204 })
    if (resolvedOrigin) {
      response.headers.set('Access-Control-Allow-Origin', resolvedOrigin)
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Cache-Control, Pragma, Expires')
      response.headers.set('Access-Control-Allow-Credentials', 'true')
      response.headers.set('Access-Control-Max-Age', '86400')
      response.headers.set('Vary', 'Origin')
    }
    return response
  }

  // ─── 2. Handle JWT Protection for /api/protected/* ───
  if (pathname.startsWith("/api/protected")) {
    const authHeader = request.headers.get("authorization")
    const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null

    if (!token || !decodeJwtPayload(token)) {
      const response = NextResponse.json(
        { success: false, code: 401, message: "Unauthorized — Invalid or missing token" },
        { status: 401 }
      )
      if (resolvedOrigin) {
        response.headers.set('Access-Control-Allow-Origin', resolvedOrigin)
        response.headers.set('Access-Control-Allow-Credentials', 'true')
        response.headers.set('Vary', 'Origin')
      }
      return response
    }
    
    // Add user info to headers for downstream
    const decoded = decodeJwtPayload(token)
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set("x-user-id", decoded.userId || "")
    requestHeaders.set("x-user-role", decoded.role || "customer")
    
    const response = NextResponse.next({ request: { headers: requestHeaders } })
    if (resolvedOrigin) {
      response.headers.set('Access-Control-Allow-Origin', resolvedOrigin)
      response.headers.set('Access-Control-Allow-Credentials', 'true')
      response.headers.set('Vary', 'Origin')
    }
    return response
  }

  // ─── 3. Handle Regular Requests ───
  const response = NextResponse.next()
  if (resolvedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', resolvedOrigin)
    response.headers.set('Access-Control-Allow-Credentials', 'true')
    response.headers.set('Vary', 'Origin')
  }

  return response
}

// Run middleware for all API routes
export const config = {
  matcher: '/api/:path*',
}
