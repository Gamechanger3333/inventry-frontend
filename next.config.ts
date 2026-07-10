import type { NextConfig } from "next";

// The backend's default port is 8080 (see backend/src/index.ts), not 5000 -
// this was silently breaking every API call in local dev unless you happened
// to also override PORT=5000 on the backend. Use an env var so dev/staging/
// prod can each point at the right place instead of a hardcoded guess.
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND_URL}/api/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
