import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // السماح بطلبات cross-origin من preview URLs (يحل تحذير Next.js 16)
  allowedDevOrigins: [
    'preview-chat-e852da88-736a-45d2-ab1d-847c57550eef.space-z.ai',
    '*.space-z.ai',
    'localhost',
    '127.0.0.1',
  ],
};

export default nextConfig;
