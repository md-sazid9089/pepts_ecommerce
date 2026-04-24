/** @type {import('next').NextConfig} */

/**
 * ============================================================================
 * NEXT.JS API-ONLY BACKEND CONFIGURATION
 * ============================================================================
 * Headless REST API backend — no React pages, pure JSON responses.
 * ============================================================================
 */

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3001"

const nextConfig = {
  reactStrictMode: true,

  // ✅ Compress API responses
  compress: true,
  productionBrowserSourceMaps: false,

  // ✅ CORS + Security headers for all API routes
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: FRONTEND_URL },
          { key: "Access-Control-Allow-Methods", value: "GET, POST, PUT, PATCH, DELETE, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization, X-Requested-With, Accept" },
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Max-Age", value: "86400" },
          // Security headers
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ]
  },

  // ✅ Expose only safe public env vars to the API layer
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
}

module.exports = nextConfig
