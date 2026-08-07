import { z } from "zod";

/**
 * Public web configuration.
 *
 * P0 can compile and render without external services. Values become required
 * only when the capability that consumes them is enabled. Server secrets do
 * not belong in this browser-facing module or in Next.js build configuration.
 */
const publicEnvSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url("API URL must be valid"),
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url("Supabase URL must be valid")
    .optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_APP_ENV: z.enum(["development", "staging", "production"]),
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z
    .string()
    .regex(/^G-[A-Z0-9]+$/, "Invalid Google Analytics measurement ID")
    .optional(),
  NEXT_PUBLIC_ENABLE_EXPERIMENTAL_FEATURES: z.boolean(),
  NEXT_PUBLIC_ENABLE_MULTIMODAL: z.boolean(),
  NEXT_PUBLIC_ENABLE_OFFLINE_MODE: z.boolean(),
});

const rawPublicEnv = {
  NEXT_PUBLIC_API_URL:
    process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:8000",
  NEXT_PUBLIC_SUPABASE_URL:
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || undefined,
  NEXT_PUBLIC_SUPABASE_ANON_KEY:
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || undefined,
  NEXT_PUBLIC_APP_ENV:
    process.env.NEXT_PUBLIC_APP_ENV?.trim() || "development",
  NEXT_PUBLIC_SENTRY_DSN:
    process.env.NEXT_PUBLIC_SENTRY_DSN?.trim() || undefined,
  NEXT_PUBLIC_GA_MEASUREMENT_ID:
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || undefined,
  NEXT_PUBLIC_ENABLE_EXPERIMENTAL_FEATURES:
    process.env.NEXT_PUBLIC_ENABLE_EXPERIMENTAL_FEATURES === "true",
  NEXT_PUBLIC_ENABLE_MULTIMODAL:
    process.env.NEXT_PUBLIC_ENABLE_MULTIMODAL === "true",
  NEXT_PUBLIC_ENABLE_OFFLINE_MODE:
    process.env.NEXT_PUBLIC_ENABLE_OFFLINE_MODE === "true",
};

function parsePublicEnv() {
  const parsed = publicEnvSchema.safeParse(rawPublicEnv);

  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("; ");

    throw new Error(`Invalid public web configuration: ${details}`);
  }

  return parsed.data;
}

export const env = parsePublicEnv();
export type Env = z.infer<typeof publicEnvSchema>;

export const clientEnv = {
  apiUrl: env.NEXT_PUBLIC_API_URL,
  supabaseUrl: env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  appEnv: env.NEXT_PUBLIC_APP_ENV,
  sentryDsn: env.NEXT_PUBLIC_SENTRY_DSN,
  gaMeasurementId: env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  enableExperimentalFeatures: env.NEXT_PUBLIC_ENABLE_EXPERIMENTAL_FEATURES,
  enableMultimodal: env.NEXT_PUBLIC_ENABLE_MULTIMODAL,
  enableOfflineMode: env.NEXT_PUBLIC_ENABLE_OFFLINE_MODE,
} as const;

export interface SupabasePublicConfig {
  url: string;
  anonKey: string;
}

/**
 * Require Supabase browser configuration only when P1 enables that capability.
 */
export function requireSupabasePublicConfig(): SupabasePublicConfig {
  if (!clientEnv.supabaseUrl || !clientEnv.supabaseAnonKey) {
    throw new Error(
      "Supabase browser configuration is required for the selected capability. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }

  return {
    url: clientEnv.supabaseUrl,
    anonKey: clientEnv.supabaseAnonKey,
  };
}

export const isProduction = clientEnv.appEnv === "production";
export const isDevelopment = clientEnv.appEnv === "development";

export function logEnvironmentStatus(): void {
  if (!isDevelopment) return;

  console.info("Web configuration loaded", {
    appEnv: clientEnv.appEnv,
    apiUrl: clientEnv.apiUrl,
    supabaseConfigured: Boolean(
      clientEnv.supabaseUrl && clientEnv.supabaseAnonKey,
    ),
  });
}
