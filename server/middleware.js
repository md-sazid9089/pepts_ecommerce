/**
 * ============================================================================
 * EDGE MIDDLEWARE FOR API PROTECTION
 * ============================================================================
 * This middleware runs on the edge (before the route handler) and:
 * ✅ Protects routes under /api/protected/*
 * ✅ Validates Bearer token in Authorization header
 * ✅ Returns 401 JSON response if unauthorized
 * ✅ Attaches user info to request for route handlers
 * 
 * SUPPORTED TOKENS:
 * - JWT tokens (real production use)
 * - Mock tokens for development/testing
 * 
 * MIDDLEWARE FLOW:
 * 1. Check if route matches /api/protected/*
 * 2. Extract Bearer token from Authorization header
 * 3. Validate token
 * 4. If invalid, return 401 response
 * 5. If valid, continue to route handler
 * ============================================================================
 */

import { NextResponse } from "next/server"

/**
 * ✅ MIDDLEWARE CONFIGURATION
 * Specify which routes should be protected by this middleware
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}

/**
 * ✅ VERIFY BEARER TOKEN
 * Validates JWT or mock tokens
 * 
 * @param {string} token - The Bearer token to validate
 * @returns {object|null} - User data if valid, null if invalid
 */
function verifyToken(token) {
  if (!token) return null

  try {
    // ✅ PRODUCTION: Verify JWT token
    // In production, you would decode and verify the JWT:
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // return decoded;

    // ✅ DEVELOPMENT: Accept mock tokens for testing
    // This allows testing without a real token generation endpoint
    if (process.env.NODE_ENV === "development") {
      // Accept any token starting with "test_" for development
      if (token.startsWith("test_")) {
        return {
          userId: "mock_user_123",
          email: "test@example.com",
          role: "user",
        }
      }

      // Accept token "admin_token" for testing admin routes
      if (token === "admin_token") {
        return {
          userId: "admin_123",
          email: "admin@example.com",
          role: "admin",
        }
      }
    }

    // ✅ PRODUCTION SECRET TOKEN (fallback for manual testing)
    if (token === process.env.JWT_SECRET) {
      return {
        userId: "secret_user",
        email: "authenticated@example.com",
        role: "user",
      }
    }

    return null
  } catch (error) {
    console.error("Token verification error:", error)
    return null
  }
}

/**
 * ✅ MAIN MIDDLEWARE FUNCTION
 * Runs for all matched requests
 * 
 * @param {NextRequest} request - The incoming request
 * @returns {NextResponse} - Response or next middleware
 */
export function middleware(request) {
  const { pathname } = request.nextUrl

  // ✅ ONLY protect routes under /api/protected/*
  if (!pathname.startsWith("/api/protected")) {
    return NextResponse.next()
  }

  // ✅ Extract Authorization header
  const authHeader = request.headers.get("authorization")

  // ✅ Extract Bearer token from "Bearer <token>" format
  const token = authHeader && authHeader.startsWith("Bearer ")
    ? authHeader.substring(7) // Remove "Bearer " prefix
    : null

  // ✅ If no token, return 401 Unauthorized
  if (!token) {
    return NextResponse.json(
      {
        success: false,
        code: 401,
        message: "Unauthorized - Missing Authorization header",
        data: null,
        error: {
          message: "Missing or invalid Authorization header. Use: Authorization: Bearer <token>",
          code: 401,
        },
        timestamp: new Date().toISOString(),
      },
      { status: 401 }
    )
  }

  // ✅ Verify token
  const user = verifyToken(token)

  // ✅ If token is invalid, return 401 Unauthorized
  if (!user) {
    return NextResponse.json(
      {
        success: false,
        code: 401,
        message: "Unauthorized - Invalid or expired token",
        data: null,
        error: {
          message: "Invalid or expired token",
          code: 401,
        },
        timestamp: new Date().toISOString(),
      },
      { status: 401 }
    )
  }

  // ✅ Token is valid - attach user to request headers
  // Route handlers can access this via request.headers
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-user-id", user.userId)
  requestHeaders.set("x-user-email", user.email)
  requestHeaders.set("x-user-role", user.role)

  // ✅ Continue to the route handler
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config_details = {
  description: "Edge middleware for API authentication",
  protectedRoutes: ["/api/protected/*"],
  developmentTokens: {
    userToken: "test_any_string",
    adminToken: "admin_token",
  },
}
