/** @type {import('next').NextConfig} */

/**
 * ============================================================================
 * NEXT.JS API-ONLY BACKEND CONFIGURATION
 * ============================================================================
 * Headless REST API — pure JSON responses, no React pages.
 * Deployed on Vercel as serverless functions.
 * ============================================================================
 */

// Allowed CORS origins — comma-separated in FRONTEND_URL env var
// e.g. FRONTEND_URL=https://pepta.com,http://localhost:5173
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173"
const allowedOrigins = FRONTEND_URL.split(",").map((u) => u.trim())

// For the CORS header value we need a single origin (we'll handle multiple
// origins dynamically in middleware if needed; for now use the first one)
const primaryOrigin = allowedOrigins[0]

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
          // Security headers
          { key: "X-Content-Type-Options",           value: "nosniff" },
          { key: "X-Frame-Options",                  value: "DENY" },
          { key: "X-XSS-Protection",                 value: "1; mode=block" },
          { key: "Referrer-Policy",                  value: "strict-origin-when-cross-origin" },
        ],
      },
    ]
  },

  // Expose only non-secret public env vars to the client bundle
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
}

module.exports = nextConfig
