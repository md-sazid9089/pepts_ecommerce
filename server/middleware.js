import { NextResponse } from 'next/server'

/**
 * ============================================================================
 * CORS MIDDLEWARE
 * ============================================================================
 * Handles CORS preflight (OPTIONS) and attaches Access-Control headers to
 * every /api/* response. Uses simple, robust origin matching from ALLOWED_ORIGIN.
 * ============================================================================
 */

/**
 * Verify a JWT using jose (Edge Runtime compatible).
 * Returns the decoded payload on success, or null if the token is
 * missing, expired, malformed, or has an invalid signature.
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

/**
 * Get CORS headers for the request origin.
 * Always returns CORS headers — never returns empty.
 */
function getCorsHeaders(origin) {
  // Parse allowed origins from env var
  const allowedOrigins = (process.env.ALLOWED_ORIGIN || '')
    .split(',')
    .map(o => o.trim())
    .filter(Boolean)

  // Determine which origin to allow in the response
  const corsOrigin = allowedOrigins.includes(origin) ? origin : (allowedOrigins[0] || '*')

  return {
    'Access-Control-Allow-Origin': corsOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
  }
}

export async function middleware(request) {
  console.log(`[Middleware] ${request.method} ${request.nextUrl.pathname}`)
  const { pathname } = request.nextUrl
  const origin = request.headers.get('origin') || ''
  const corsHeaders = getCorsHeaders(origin)

  // ── 1. Preflight (OPTIONS) ─────────────────────────────────────────────────
  // Handle preflight FIRST, before any JWT checks
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    })
  }

  // ── 2. JWT Protection for admin & protected routes ─────────────────────────
  // List of routes requiring JWT authentication
  const protectedRoutes = [
    '/api/protected',
    '/api/orders',
    '/api/inquiries',
    '/api/admin',
  ]
  
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  
  if (isProtectedRoute) {
    // Read from httpOnly cookie (preferred) — falls back to Authorization header
    const cookieToken = request.cookies.get('authToken')?.value
    const authHeader = request.headers.get('authorization')
    const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null
    const token = cookieToken || headerToken

    if (!token) {
      return NextResponse.json(
        { success: false, code: 401, message: 'Unauthorized — Missing token' },
        { 
          status: 401,
          headers: corsHeaders,
        }
      )
    }

    // Full HMAC signature verification — rejects forged tokens
    const decoded = await verifyJwt(token)
    if (!decoded) {
      return NextResponse.json(
        { success: false, code: 401, message: 'Unauthorized — Invalid or expired token' },
        { 
          status: 401,
          headers: corsHeaders,
        }
      )
    }

    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-id',   decoded.userId || '')
    requestHeaders.set('x-user-role', decoded.role   || 'customer')

    const response = NextResponse.next({ request: { headers: requestHeaders } })
    // Apply CORS headers to response
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    return response
  }

  // ── 3. All other API requests ─────────────────────────────────────────────
  const response = NextResponse.next()
  // Apply CORS headers to response
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  return response
}

// Apply to all /api/* paths only
export const config = {
  matcher: '/api/:path*',
}
