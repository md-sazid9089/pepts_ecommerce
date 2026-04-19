/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for development
  reactStrictMode: true,

  // Optimize images
  images: {
    unoptimized: false, // Enable image optimization
    remotePatterns: [
      // Add external image domains here if needed
      // {
      //   protocol: 'https',
      //   hostname: '**.example.com',
      // },
    ],
  },

  // Powering up the build process
  productionBrowserSourceMaps: false, // Disable source maps in production for smaller bundle

  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Redirects (add as needed)
  async redirects() {
    return [];
  },

  // Rewrites (add as needed)
  async rewrites() {
    return [];
  },
};

export default nextConfig;
