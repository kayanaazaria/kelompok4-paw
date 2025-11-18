// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    // Only rewrite in production when NEXT_PUBLIC_API_URL is not set
    if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_API_URL) {
      return [
        {
          source: '/api/:path*',
          destination: '/api/:path*', // This will be handled by Vercel routing
        },
      ];
    }
    return [];
  },
};

module.exports = nextConfig;
