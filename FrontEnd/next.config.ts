import type { NextConfig } from "next";

const rawBackendUrl =
  process.env.INTERNAL_API_URL ||
  process.env.BACKEND_URL ||
  process.env.API_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://asiasoftlab-learning-1.onrender.com'
    : 'http://localhost:3001');

const backendUrl = rawBackendUrl.replace(/\/+$/, '');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
