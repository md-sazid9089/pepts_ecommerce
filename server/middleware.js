import { NextResponse } from 'next/server'

// Allowed CORS origins from environment variable
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173"
const allowedOrigins = FRONTEND_URL.split(",").map((u) => u.trim())

function isAllowedOrigin(origin) {
  if (!origin) return true // Allow server-to-server requests
  if (allowedOrigins.includes(origin)) return true
  if (origin.endsWith('.vercel.app')) return true
  if (origin.startsWith('http://localhost')) return true
  return false
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
  const allowed = isAllowedOrigin(origin)

  // ─── 1. Handle Preflight (OPTIONS) ───
  if (request.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 204 })
    if (allowed) {
      response.headers.set('Access-Control-Allow-Origin', origin || '*')
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Cache-Control, Pragma, Expires')
      response.headers.set('Access-Control-Allow-Credentials', 'true')
      response.headers.set('Access-Control-Max-Age', '86400')
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
      if (allowed) {
        response.headers.set('Access-Control-Allow-Origin', origin || '*')
        response.headers.set('Access-Control-Allow-Credentials', 'true')
      }
      return response
    }
    
    // Add user info to headers for downstream
    const decoded = decodeJwtPayload(token)
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set("x-user-id", decoded.userId || "")
    requestHeaders.set("x-user-role", decoded.role || "customer")
    
    const response = NextResponse.next({ request: { headers: requestHeaders } })
    if (allowed) {
      response.headers.set('Access-Control-Allow-Origin', origin || '*')
      response.headers.set('Access-Control-Allow-Credentials', 'true')
    }
    return response
  }

  // ─── 3. Handle Regular Requests ───
  const response = NextResponse.next()
  if (allowed) {
    response.headers.set('Access-Control-Allow-Origin', origin || '*')
    response.headers.set('Access-Control-Allow-Credentials', 'true')
  }

  return response
}

// Run middleware for all API routes
export const config = {
  matcher: '/api/:path*',
}
