/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Avoid hostname configuration issues in dev/varied environments
    unoptimized: true,
  },
  // Dev indicators ko disable karne ke liye ye add karein
  devIndicators: false,

  // Disable caching for API routes to ensure real-time updates
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
          {
            key: 'Surrogate-Control',
            value: 'no-store',
          },
        ],
      },
    ];
  },
};

export default nextConfig;