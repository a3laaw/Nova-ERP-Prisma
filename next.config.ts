import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  allowedDevOrigins: ['*.space-z.ai', 'localhost', '127.0.0.1'],
  // Headers قوية جداً لمنع أي caching - تحل مشكلة cached 307 redirects
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate, max-age=0, post-check=0, pre-check=0' },
          { key: 'Pragma', value: 'no-cache' },
          { key: 'Expires', value: 'Wed, 11 Jan 1984 05:00:00 GMT' },
          { key: 'Surrogate-Control', value: 'no-store' },
          { key: 'CDN-Cache-Control', value: 'no-store' },
          { key: 'Vary', value: '*' },
        ],
      },
    ]
  },
};

export default nextConfig;
