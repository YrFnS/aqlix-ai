/**
 * Environment Configuration with Zod Validation
 *
 * This module validates all environment variables at build/runtime and provides
 * type-safe access throughout the Next.js application.
 *
 * CRITICAL SECURITY RULES:
 * - Only NEXT_PUBLIC_* variables are exposed to the browser
 * - Never access process.env directly after importing this module
 * - Always use the validated `env` object exported from this file
 * - Server-only variables must NOT have NEXT_PUBLIC_ prefix
 *
 * @module config/env
 */

import { z } from "zod";

/**
 * Client-side environment schema (browser-accessible)
 * All variables must be prefixed with NEXT_PUBLIC_
 */
const clientEnvSchema = z.object({
  // API Configuration
  NEXT_PUBLIC_API_URL: z
    .string()
    .url("API URL must be a valid URL")
    .default("http://localhost:8000"),

  // Supabase Configuration
  NEXT_PUBLIC_SUPABASE_URL: z.string().url("Supabase URL must be a valid URL"),

  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(1, "Supabase anonymous key is required"),

  // Iraqi AI Configuration
  NEXT_PUBLIC_CULTURAL_VALIDATION_ENABLED: z
    .enum(["true", "false"])
    .transform((val) => val === "true")
    .default("true"),

  NEXT_PUBLIC_ARABIC_DIALECT_PROCESSING: z
    .enum(["true", "false"])
    .transform((val) => val === "true")
    .default("true"),

  // Environment
  NEXT_PUBLIC_APP_ENV: z
    .enum(["development", "staging", "production"])
    .default("development"),

  // Optional: Monitoring
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),

  // Optional: Analytics
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z
    .string()
    .regex(/^G-[A-Z0-9]+$/, "Invalid Google Analytics measurement ID")
    .optional(),

  // Optional: Feature Flags
  NEXT_PUBLIC_ENABLE_EXPERIMENTAL_FEATURES: z
    .enum(["true", "false"])
    .transform((val) => val === "true")
    .default("false"),

  NEXT_PUBLIC_ENABLE_MULTIMODAL: z
    .enum(["true", "false"])
    .transform((val) => val === "true")
    .default("true"),

  NEXT_PUBLIC_ENABLE_OFFLINE_MODE: z
    .enum(["true", "false"])
    .transform((val) => val === "true")
    .default("false"),
});

/**
 * Server-side environment schema (server-only, NOT exposed to browser)
 * CRITICAL: Never prefix these with NEXT_PUBLIC_
 */
const serverEnvSchema = z.object({
  // Node Environment
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  // Server Port
  PORT: z
    .string()
    .transform(Number)
    .pipe(z.number().int().positive())
    .default("3000"),

  // Security
  API_SECRET_KEY: z
    .string()
    .min(32, "API secret key must be at least 32 characters for security"),

  // Supabase Service Role (server-only)
  SUPABASE_SERVICE_ROLE_KEY: z
    .string()
    .min(1, "Supabase service role key is required"),

  // Database
  DATABASE_URL: z.string().url("Database URL must be valid").optional(),

  // Redis (optional)
  REDIS_URL: z.string().url("Redis URL must be valid").optional(),

  // LLM Configuration (server-only)
  LLM_PROVIDER: z
    .enum(["openai"], {
      errorMap: () => ({ message: "LLM provider must be openai" }),
    })
    .default("openai"),

  LLM_API_KEY: z.string().min(1, "LLM API key is required"),

  LLM_MODEL: z.string().default("gpt-4o-mini"),

  // Iraqi Payment Gateways (server-only, optional)
  ZAINCASH_API_KEY: z.string().optional(),

  FASTPAY_API_KEY: z.string().optional(),

  NASSWALLET_API_KEY: z.string().optional(),

  // Monitoring (server-only)
  SENTRY_ENVIRONMENT: z
    .enum(["development", "staging", "production"])
    .optional(),
});

/**
 * Combined environment schema (client + server)
 */
const envSchema = clientEnvSchema.merge(serverEnvSchema);

/**
 * Validate environment variables with helpful error messages
 *
 * @throws {Error} If validation fails with detailed error messages
 * @returns Validated environment object with proper types
 */
function validateEnv() {
  // Parse environment variables
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error("❌ Environment validation failed:");
    console.error("Missing or invalid environment variables:\n");

    // Format errors for readability
    const errors = parsed.error.flatten().fieldErrors;
    Object.entries(errors).forEach(([key, messages]) => {
      console.error(`  ${key}:`);
      messages?.forEach((msg) => console.error(`    - ${msg}`));
    });

    console.error("\n💡 Tips:");
    console.error("  - Check .env.example for required variables");
    console.error("  - Copy .env.example to .env.local");
    console.error(
      "  - Ensure all NEXT_PUBLIC_* variables are set for client-side",
    );
    console.error("  - Restart Next.js dev server after changing .env files");

    throw new Error("Invalid environment configuration");
  }

  return parsed.data;
}

/**
 * Validated environment object
 *
 * USAGE:
 * ```typescript
 * import { env } from "@/config/env";
 *
 * // ✅ CORRECT: Use validated env object
 * const apiUrl = env.NEXT_PUBLIC_API_URL;
 *
 * // ❌ WRONG: Don't use process.env directly
 * const apiUrl = process.env.NEXT_PUBLIC_API_URL;
 * ```
 */
export const env = validateEnv();

/**
 * Type definition for the validated environment object
 * Provides autocompletion and type safety
 */
export type Env = z.infer<typeof envSchema>;

/**
 * Client-side environment object (safe to use in browser)
 * Only includes NEXT_PUBLIC_* variables
 */
export const clientEnv = {
  apiUrl: env.NEXT_PUBLIC_API_URL,
  supabaseUrl: env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  culturalValidationEnabled: env.NEXT_PUBLIC_CULTURAL_VALIDATION_ENABLED,
  arabicDialectProcessing: env.NEXT_PUBLIC_ARABIC_DIALECT_PROCESSING,
  appEnv: env.NEXT_PUBLIC_APP_ENV,
  sentryDsn: env.NEXT_PUBLIC_SENTRY_DSN,
  gaMeasurementId: env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  enableExperimentalFeatures: env.NEXT_PUBLIC_ENABLE_EXPERIMENTAL_FEATURES,
  enableMultimodal: env.NEXT_PUBLIC_ENABLE_MULTIMODAL,
  enableOfflineMode: env.NEXT_PUBLIC_ENABLE_OFFLINE_MODE,
} as const;

/**
 * Server-side environment object (NOT safe for browser)
 * Only use in server components, API routes, and middleware
 */
export const serverEnv = {
  nodeEnv: env.NODE_ENV,
  port: env.PORT,
  apiSecretKey: env.API_SECRET_KEY,
  supabaseServiceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY,
  databaseUrl: env.DATABASE_URL,
  redisUrl: env.REDIS_URL,
  llmProvider: env.LLM_PROVIDER,
  llmApiKey: env.LLM_API_KEY,
  llmModel: env.LLM_MODEL,
  zaincashApiKey: env.ZAINCASH_API_KEY,
  fastpayApiKey: env.FASTPAY_API_KEY,
  nasswalletApiKey: env.NASSWALLET_API_KEY,
  sentryEnvironment: env.SENTRY_ENVIRONMENT,
} as const;

/**
 * Check if running in production
 */
export const isProduction = env.NODE_ENV === "production";

/**
 * Check if running in development
 */
export const isDevelopment = env.NODE_ENV === "development";

/**
 * Check if running in test
 */
export const isTest = env.NODE_ENV === "test";

/**
 * Log environment status (non-sensitive info only)
 * Called at application startup
 */
export function logEnvironmentStatus() {
  if (isDevelopment) {
    console.log("🌍 Environment loaded successfully:");
    console.log(`  - NODE_ENV: ${env.NODE_ENV}`);
    console.log(`  - API URL: ${env.NEXT_PUBLIC_API_URL}`);
    console.log(
      `  - Cultural Validation: ${env.NEXT_PUBLIC_CULTURAL_VALIDATION_ENABLED ? "enabled" : "disabled"}`,
    );
    console.log(
      `  - Arabic Processing: ${env.NEXT_PUBLIC_ARABIC_DIALECT_PROCESSING ? "enabled" : "disabled"}`,
    );
    console.log(`  - Has API Key: ${!!env.API_SECRET_KEY}`);
    console.log(`  - Has LLM Key: ${!!env.LLM_API_KEY}`);
  }
}
