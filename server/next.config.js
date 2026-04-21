/** @type {import('next').NextConfig} */

/**
 * ============================================================================
 * NEXT.JS API-ONLY BACKEND CONFIGURATION
 * ============================================================================
 * This Next.js application is configured as a HEADLESS REST API backend.
 * It does NOT serve React components, HTML pages, or a frontend UI.
 * CORS is enabled globally to allow requests from external frontend applications.
 * ============================================================================
 */

const nextConfig = {
  // ✅ Disable static page generation since this is API-only
  // We only need API routes, not pages
  reactStrictMode: true,

  // ✅ CORS Configuration: Enable CORS headers globally for all API routes
  // This allows external frontend applications (like your React.js app)
  // to make requests to this Next.js API server
  async headers() {
    return [
      {
        // Apply CORS headers to ALL API routes
        source: "/api/:path*",
        headers: [
          // ✅ Allow your React frontend to access this API
          // In production, replace localhost:5173 with your actual frontend domain
          {
            key: "Access-Control-Allow-Origin",
            value: process.env.FRONTEND_URL || "http://localhost:5173",
          },
          // ✅ Allow these HTTP methods from cross-origin requests
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, PATCH, DELETE, OPTIONS",
          },
          // ✅ Allow these headers in cross-origin requests
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization, X-Requested-With, Accept",
          },
          // ✅ Allow credentials (cookies, auth headers) to be sent with requests
          {
            key: "Access-Control-Allow-Credentials",
            value: "true",
          },
          // ✅ Cache preflight requests for 86400 seconds (24 hours)
          {
            key: "Access-Control-Max-Age",
            value: "86400",
          },
        ],
      },
    ]
  },

  // ✅ Handle CORS preflight OPTIONS requests
  // Automatically respond to OPTIONS requests without routing to handlers
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/api/:path*",
          destination: "/api/:path*",
        },
      ],
    }
  },

  // ✅ Optimize for API-only workload
  // Disable unused optimizations
  productionBrowserSourceMaps: false,
  compress: true,

  // ✅ Environment variables to expose to the API
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
}

module.exports = nextConfig
