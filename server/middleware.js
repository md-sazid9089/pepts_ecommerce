import { NextResponse } from 'next/server'

// Allowed CORS origins from environment variable
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173"
const allowedOrigins = FRONTEND_URL.split(",").map((u) => u.trim())

export function middleware(request) {
  const origin = request.headers.get('origin')
  
  // Check if the origin is allowed
  const isAllowedOrigin = allowedOrigins.includes(origin) || !origin
  
  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 204 })
    
    if (isAllowedOrigin) {
      response.headers.set('Access-Control-Allow-Origin', origin || allowedOrigins[0])
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Cache-Control, Pragma, Expires')
      response.headers.set('Access-Control-Allow-Credentials', 'true')
      response.headers.set('Access-Control-Max-Age', '86400')
    }
    
    return response
  }

  // Handle actual requests
  const response = NextResponse.next()
  
  if (isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', origin || allowedOrigins[0])
    response.headers.set('Access-Control-Allow-Credentials', 'true')
  }

  return response
}

// Only run middleware for API routes
export const config = {
  matcher: '/api/:path*',
}
