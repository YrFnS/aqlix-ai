/**
 * TypeScript Type Definitions for Environment Variables
 *
 * This file extends Node.js ProcessEnv interface to provide autocompletion
 * and type safety for environment variables throughout the application.
 *
 * IMPORTANT:
 * - Do NOT import this file directly
 * - TypeScript automatically includes .d.ts files
 * - Use the validated `env` object from @/config/env instead of process.env
 *
 * @see apps/web/src/config/env.ts for validated environment access
 */

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // ---------------------------------------------------------------------
      // Node.js Configuration
      // ---------------------------------------------------------------------
      /**
       * Application environment
       * @default "development"
       */
      NODE_ENV: "development" | "production" | "test";

      /**
       * Server port for Next.js application
       * @default "3000"
       */
      PORT: string;

      // ---------------------------------------------------------------------
      // Client-Side Variables (NEXT_PUBLIC_*)
      // Browser-accessible, safe to expose
      // ---------------------------------------------------------------------

      /**
       * Backend API URL for client-side requests
       * @example "http://localhost:8000" (development)
       * @example "https://api.iraqi-ai.com" (production)
       */
      NEXT_PUBLIC_API_URL: string;

      /**
       * Supabase project URL
       * @example "https://abcdefgh.supabase.co"
       */
      NEXT_PUBLIC_SUPABASE_URL: string;

      /**
       * Supabase anonymous key (safe for client-side)
       * Public key that only allows row-level security rules
       */
      NEXT_PUBLIC_SUPABASE_ANON_KEY: string;

      /**
       * Enable cultural validation for Iraqi compliance
       * @default "true"
       */
      NEXT_PUBLIC_CULTURAL_VALIDATION_ENABLED: "true" | "false";

      /**
       * Enable Arabic Iraqi dialect processing in UI
       * @default "true"
       */
      NEXT_PUBLIC_ARABIC_DIALECT_PROCESSING: "true" | "false";

      /**
       * Application environment for client-side feature flags
       * @default "development"
       */
      NEXT_PUBLIC_APP_ENV: "development" | "staging" | "production";

      /**
       * Sentry DSN for client-side error tracking (optional)
       * @example "https://abc123@o123456.ingest.sentry.io/123456"
       */
      NEXT_PUBLIC_SENTRY_DSN?: string;

      /**
       * Google Analytics measurement ID (optional)
       * @example "G-XXXXXXXXXX"
       */
      NEXT_PUBLIC_GA_MEASUREMENT_ID?: string;

      /**
       * Enable experimental features flag
       * @default "false"
       */
      NEXT_PUBLIC_ENABLE_EXPERIMENTAL_FEATURES: "true" | "false";

      /**
       * Enable multimodal capabilities (image, voice)
       * @default "true"
       */
      NEXT_PUBLIC_ENABLE_MULTIMODAL: "true" | "false";

      /**
       * Enable offline mode support
       * @default "false"
       */
      NEXT_PUBLIC_ENABLE_OFFLINE_MODE: "true" | "false";

      // ---------------------------------------------------------------------
      // Server-Side Only Variables
      // NEVER expose to client, no NEXT_PUBLIC_ prefix
      // ---------------------------------------------------------------------

      /**
       * API secret key for JWT signing and encryption
       * CRITICAL: Must be at least 32 characters
       * SECURITY: Never expose to client
       */
      API_SECRET_KEY: string;

      /**
       * Supabase service role key for server-side admin operations
       * SECURITY: Never expose to client, bypasses RLS
       */
      SUPABASE_SERVICE_ROLE_KEY: string;

      /**
       * PostgreSQL database connection string (optional)
       * @example "postgresql://user:pass@localhost:5432/db"
       */
      DATABASE_URL?: string;

      /**
       * Redis connection string for caching (optional)
       * @example "redis://localhost:6379"
       */
      REDIS_URL?: string;

      // ---------------------------------------------------------------------
      // LLM Configuration (Server-Side Only)
      // ---------------------------------------------------------------------

      /**
       * LLM provider selection
       * @default "openai"
       */
      LLM_PROVIDER: "openai";

      /**
       * OpenAI API key for LLM requests
       * SECURITY: Never expose to client
       */
      LLM_API_KEY: string;

      /**
       * OpenAI model to use
       * @default "gpt-4o-mini"
       * @example "gpt-4o" | "gpt-4o-mini" | "gpt-4-turbo"
       */
      LLM_MODEL: string;

      // ---------------------------------------------------------------------
      // Iraqi Payment Gateways (Server-Side Only, Optional)
      // ---------------------------------------------------------------------

      /**
       * ZainCash payment gateway API key
       * Minimum transaction: 1000 IQD
       * SECURITY: Never expose to client
       */
      ZAINCASH_API_KEY?: string;

      /**
       * FastPay payment gateway API key
       * Minimum transaction: 500 IQD
       * SECURITY: Never expose to client
       */
      FASTPAY_API_KEY?: string;

      /**
       * NassWallet payment gateway API key
       * Minimum transaction: 1000 IQD
       * SECURITY: Never expose to client
       */
      NASSWALLET_API_KEY?: string;

      // ---------------------------------------------------------------------
      // Monitoring (Server-Side)
      // ---------------------------------------------------------------------

      /**
       * Sentry environment name (optional)
       * Used to separate errors by environment
       */
      SENTRY_ENVIRONMENT?: "development" | "staging" | "production";
    }
  }
}

// Required for TypeScript to treat this as a module
export {};
