import { NextResponse } from 'next/server'

// Allowed CORS origins from environment variable
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173"
const allowedOrigins = FRONTEND_URL.split(",").map((u) => u.trim())

function isAllowedOrigin(origin) {
  if (!origin) return true // Allow server-to-server requests
  // Allow explicitly listed origins
  if (allowedOrigins.includes(origin)) return true
  // Allow any Vercel preview deployment (*.vercel.app)
  if (origin.endsWith('.vercel.app')) return true
  // Allow localhost for development
  if (origin.startsWith('http://localhost')) return true
  return false
}

export function middleware(request) {
  const origin = request.headers.get('origin')
  const allowed = isAllowedOrigin(origin)

  // Handle preflight requests
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

  // Handle actual requests
  const response = NextResponse.next()
  if (allowed) {
    response.headers.set('Access-Control-Allow-Origin', origin || '*')
    response.headers.set('Access-Control-Allow-Credentials', 'true')
  }

  return response
}

// Only run middleware for API routes
export const config = {
  matcher: '/api/:path*',
}
