import type { NextConfig } from "next";

/**
 * Next.js build configuration.
 *
 * External-service credentials are validated by the capability that consumes
 * them, not while Next.js loads this file. Clean CI builds therefore do not
 * require placeholder database, provider, or administrative secrets.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,

  typescript: {
    ignoreBuildErrors: false,
  },

  eslint: {
    ignoreDuringBuilds: false,
  },

  transpilePackages: [
    "@iraqi-ai/types",
    "@iraqi-ai/ui",
    "@iraqi-ai/features",
    "@iraqi-ai/api-client",
    "@iraqi-ai/arabic-nlp",
    "@iraqi-ai/supabase-client",
  ],

  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 375, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    remotePatterns: [],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Content-Language",
            value: "ar-IQ, ar, en",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, must-revalidate",
          },
        ],
      },
      {
        source: "/fonts/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  experimental: {
    optimizePackageImports: ["lucide-react"],
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
};

export default nextConfig;
