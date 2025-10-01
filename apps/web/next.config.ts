/**
 * Next.js Configuration
 *
 * This configuration file sets up the Next.js application with:
 * - Environment variable validation (runs at build/dev startup)
 * - TypeScript support
 * - Monorepo workspace integration
 * - Iraqi AI specific optimizations
 *
 * IMPORTANT: Environment validation runs when this file is imported,
 * ensuring all required variables are present before app initialization.
 *
 * @see https://nextjs.org/docs/app/api-reference/next-config-js
 */

import type { NextConfig } from "next";

// ============================================================================
// CRITICAL: Validate environment variables at build/startup time
// This import triggers immediate validation and will throw if variables are missing
// ============================================================================
import "./src/config/env";

const nextConfig: NextConfig = {
  // -------------------------------------------------------------------------
  // Compiler Options
  // -------------------------------------------------------------------------
  reactStrictMode: true,
  swcMinify: true,

  // -------------------------------------------------------------------------
  // TypeScript Configuration
  // -------------------------------------------------------------------------
  typescript: {
    // Type checking is handled by separate `bun run typecheck` command
    // This prevents build failures due to type errors during rapid development
    ignoreBuildErrors: false,
  },

  // -------------------------------------------------------------------------
  // ESLint Configuration
  // -------------------------------------------------------------------------
  eslint: {
    // Linting is handled by separate `bun run lint` command
    // This prevents build failures due to lint errors during rapid development
    ignoreDuringBuilds: false,
  },

  // -------------------------------------------------------------------------
  // Monorepo Workspace Support
  // -------------------------------------------------------------------------
  transpilePackages: [
    "@/types",           // Shared TypeScript types
    "@/ui",              // Shared UI components
    "@/features",        // Shared business logic
    "@/api-client",      // API client logic
    "@/arabic-nlp",      // Arabic processing logic
  ],

  // -------------------------------------------------------------------------
  // Image Optimization
  // -------------------------------------------------------------------------
  images: {
    domains: [
      "your-project.supabase.co",  // Supabase storage domain
      "localhost",                  // Local development
    ],
    formats: ["image/avif", "image/webp"],
  },

  // -------------------------------------------------------------------------
  // Internationalization (i18n)
  // -------------------------------------------------------------------------
  i18n: {
    locales: ["en", "ar", "ar-IQ"],
    defaultLocale: "ar-IQ",
    localeDetection: true,
  },

  // -------------------------------------------------------------------------
  // Headers (Security & CORS)
  // -------------------------------------------------------------------------
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Security headers
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
          // RTL support
          {
            key: "Content-Language",
            value: "ar-IQ, ar, en",
          },
        ],
      },
    ];
  },

  // -------------------------------------------------------------------------
  // Redirects
  // -------------------------------------------------------------------------
  async redirects() {
    return [
      // Redirect root to chat (if needed)
      // {
      //   source: "/",
      //   destination: "/chat",
      //   permanent: false,
      // },
    ];
  },

  // -------------------------------------------------------------------------
  // Experimental Features
  // -------------------------------------------------------------------------
  experimental: {
    // Enable server actions (for form handling)
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },

  // -------------------------------------------------------------------------
  // Webpack Configuration (Custom)
  // -------------------------------------------------------------------------
  webpack: (config, { isServer }) => {
    // Enable source maps in development
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    return config;
  },

  // -------------------------------------------------------------------------
  // Output Configuration
  // -------------------------------------------------------------------------
  output: "standalone", // For Docker/container deployments

  // -------------------------------------------------------------------------
  // Environment Variables
  // -------------------------------------------------------------------------
  // Note: NEXT_PUBLIC_* variables are automatically exposed to the browser
  // All other variables are server-side only
  // Validation is handled in src/config/env.ts (imported above)
  env: {
    // Add any additional environment variables here if needed
    // But prefer using the validated env object from src/config/env.ts
  },
};

export default nextConfig;
