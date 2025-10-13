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
  // Note: swcMinify is now the default in Next.js 15 and has been removed

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
    "@iraqi-ai/types", // Shared TypeScript types
    "@iraqi-ai/ui", // Shared UI components
    "@iraqi-ai/features", // Shared business logic
    "@iraqi-ai/api-client", // API client logic
    "@iraqi-ai/arabic-nlp", // Arabic processing logic
    "@iraqi-ai/supabase-client", // Supabase client
  ],

  // -------------------------------------------------------------------------
  // Image Optimization
  // -------------------------------------------------------------------------
  images: {
    domains: [
      "your-project.supabase.co", // Supabase storage domain
      "localhost", // Local development
    ],
    formats: ["image/avif", "image/webp"],
  },

  // -------------------------------------------------------------------------
  // Internationalization (i18n)
  // -------------------------------------------------------------------------
  // Note: i18n config is not supported in App Router
  // Internationalization will be implemented using App Router patterns
  // See: https://nextjs.org/docs/app/building-your-application/routing/internationalization

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
  // Disabled for basic setup - will enable as needed
  // experimental: {
  //   serverActions: {
  //     bodySizeLimit: "10mb",
  //   },
  // },

  // -------------------------------------------------------------------------
  // Output Configuration
  // -------------------------------------------------------------------------
  // output: "standalone", // Disabled for basic setup - will enable for deployment

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
