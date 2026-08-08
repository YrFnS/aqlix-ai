import { z } from "zod";

export const operationalEnvironmentSchema = z.enum([
  "development",
  "test",
  "staging",
  "production",
]);

export type OperationalEnvironment = z.infer<
  typeof operationalEnvironmentSchema
>;

const publicEnvironmentSchema = z.enum([
  "development",
  "staging",
  "production",
]);

const providerSchema = z.enum(["openai", "fixture"]);

function environmentBoolean(
  value: string | undefined,
  fallback: boolean,
): boolean {
  if (value === undefined || value.trim() === "") return fallback;
  return value.trim().toLowerCase() === "true";
}

function environmentInteger(
  value: string | undefined,
  fallback: number,
): number {
  if (value === undefined || value.trim() === "") return fallback;
  return Number.parseInt(value, 10);
}

/**
 * Resolve one immutable deployment identity without requiring each platform to
 * copy its native commit variable into another secret or dashboard value.
 */
export function resolveReleaseSha(
  environment: Readonly<Record<string, string | undefined>>,
): string | null {
  return (
    environment.RELEASE_SHA?.trim() ||
    environment.RENDER_GIT_COMMIT?.trim() ||
    environment.GITHUB_SHA?.trim() ||
    null
  );
}

const runtimeSchema = z
  .object({
    appEnvironment: operationalEnvironmentSchema,
    publicEnvironment: publicEnvironmentSchema,
    releaseSha: z
      .string()
      .trim()
      .regex(/^[0-9a-f]{7,64}$/iu, "Release SHA must be a Git commit SHA")
      .optional(),
    supabaseUrl: z.string().url("Supabase URL must be valid"),
    supabaseAnonKey: z.string().trim().min(1, "Supabase public key is required"),
    provider: providerSchema,
    openAiApiKey: z.string().trim().min(1).optional(),
    fixtureProviderAllowed: z.boolean(),
    probeDependencies: z.boolean(),
    readinessTimeoutMs: z.number().int().min(250).max(10000),
  })
  .superRefine((value, context) => {
    if (
      value.appEnvironment === "staging" ||
      value.appEnvironment === "production"
    ) {
      if (value.publicEnvironment !== value.appEnvironment) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["publicEnvironment"],
          message: "Public and server deployment environments must match",
        });
      }

      if (!value.releaseSha) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["releaseSha"],
          message: "A release SHA is required outside local and test environments",
        });
      }

      if (value.provider !== "openai") {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["provider"],
          message: "The fixture provider is forbidden in staging and production",
        });
      }

      if (!value.openAiApiKey) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["openAiApiKey"],
          message: "The configured production provider requires a server key",
        });
      }
    }

    if (value.provider === "fixture") {
      if (
        !value.fixtureProviderAllowed ||
        (value.appEnvironment !== "development" &&
          value.appEnvironment !== "test")
      ) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["provider"],
          message:
            "The deterministic fixture requires explicit local/test authorization",
        });
      }
    }
  });

export interface OperationalRuntimeContract {
  appEnvironment: OperationalEnvironment;
  publicEnvironment: "development" | "staging" | "production";
  releaseSha: string | null;
  supabaseUrl: string;
  supabaseAnonKey: string;
  provider: "openai" | "fixture";
  probeDependencies: boolean;
  readinessTimeoutMs: number;
}

export class OperationalRuntimeConfigurationError extends Error {
  constructor(public readonly issuePaths: string[]) {
    super("The operational runtime configuration is invalid.");
    this.name = "OperationalRuntimeConfigurationError";
  }
}

export function parseOperationalRuntimeContract(
  environment: Readonly<Record<string, string | undefined>>,
): OperationalRuntimeContract {
  const appEnvironment =
    environment.APP_ENV?.trim() ||
    environment.NEXT_PUBLIC_APP_ENV?.trim() ||
    "development";
  const probeDefault =
    appEnvironment === "staging" || appEnvironment === "production";

  const parsed = runtimeSchema.safeParse({
    appEnvironment,
    publicEnvironment:
      environment.NEXT_PUBLIC_APP_ENV?.trim() || "development",
    releaseSha: resolveReleaseSha(environment) ?? undefined,
    supabaseUrl: environment.NEXT_PUBLIC_SUPABASE_URL?.trim() || "",
    supabaseAnonKey:
      environment.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || "",
    provider: environment.AI_PROVIDER?.trim() || "openai",
    openAiApiKey: environment.OPENAI_API_KEY?.trim() || undefined,
    fixtureProviderAllowed: environmentBoolean(
      environment.P2_ALLOW_FIXTURE_PROVIDER,
      false,
    ),
    probeDependencies: environmentBoolean(
      environment.READINESS_PROBE_DEPENDENCIES,
      probeDefault,
    ),
    readinessTimeoutMs: environmentInteger(
      environment.READINESS_TIMEOUT_MS,
      2000,
    ),
  });

  if (!parsed.success) {
    const issuePaths = Array.from(
      new Set(
        parsed.error.issues.map((issue) =>
          issue.path.length > 0 ? issue.path.join(".") : "runtime",
        ),
      ),
    ).sort();
    throw new OperationalRuntimeConfigurationError(issuePaths);
  }

  return {
    appEnvironment: parsed.data.appEnvironment,
    publicEnvironment: parsed.data.publicEnvironment,
    releaseSha: parsed.data.releaseSha ?? null,
    supabaseUrl: parsed.data.supabaseUrl.replace(/\/$/u, ""),
    supabaseAnonKey: parsed.data.supabaseAnonKey,
    provider: parsed.data.provider,
    probeDependencies: parsed.data.probeDependencies,
    readinessTimeoutMs: parsed.data.readinessTimeoutMs,
  };
}
