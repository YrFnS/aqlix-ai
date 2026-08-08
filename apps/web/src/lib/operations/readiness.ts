import "server-only";

import {
  OperationalRuntimeConfigurationError,
  parseOperationalRuntimeContract,
  type OperationalRuntimeContract,
} from "./runtime-contract";

export type OperationalCheckStatus = "pass" | "fail" | "skipped";

export interface OperationalReadinessResult {
  ready: boolean;
  environment: string;
  release: string;
  provider: string;
  checks: {
    configuration: OperationalCheckStatus;
    supabaseAuth: OperationalCheckStatus;
  };
  failureCodes: Array<
    "CONFIGURATION_INVALID" | "SUPABASE_AUTH_UNREACHABLE"
  >;
}

type FetchLike = typeof fetch;

async function probeSupabaseAuth(
  contract: OperationalRuntimeContract,
  fetcher: FetchLike,
): Promise<boolean> {
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(new DOMException("Readiness timeout", "AbortError")),
    contract.readinessTimeoutMs,
  );

  try {
    const response = await fetcher(`${contract.supabaseUrl}/auth/v1/health`, {
      method: "GET",
      headers: {
        apikey: contract.supabaseAnonKey,
        authorization: `Bearer ${contract.supabaseAnonKey}`,
        accept: "application/json",
      },
      cache: "no-store",
      signal: controller.signal,
    });

    return response.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

export async function evaluateOperationalReadiness(
  environment: Readonly<Record<string, string | undefined>> = process.env,
  fetcher: FetchLike = fetch,
): Promise<OperationalReadinessResult> {
  let contract: OperationalRuntimeContract;

  try {
    contract = parseOperationalRuntimeContract(environment);
  } catch (error) {
    if (error instanceof OperationalRuntimeConfigurationError) {
      console.error("Operational readiness configuration failed", {
        issuePaths: error.issuePaths,
      });
    } else {
      console.error("Unexpected operational readiness configuration failure", {
        error,
      });
    }

    return {
      ready: false,
      environment:
        environment.APP_ENV?.trim() ||
        environment.NEXT_PUBLIC_APP_ENV?.trim() ||
        "unknown",
      release: environment.RELEASE_SHA?.trim().slice(0, 12) || "unversioned",
      provider: environment.AI_PROVIDER?.trim() || "unknown",
      checks: {
        configuration: "fail",
        supabaseAuth: "skipped",
      },
      failureCodes: ["CONFIGURATION_INVALID"],
    };
  }

  if (!contract.probeDependencies) {
    return {
      ready: true,
      environment: contract.appEnvironment,
      release: contract.releaseSha?.slice(0, 12) ?? "unversioned",
      provider: contract.provider,
      checks: {
        configuration: "pass",
        supabaseAuth: "skipped",
      },
      failureCodes: [],
    };
  }

  const supabaseReady = await probeSupabaseAuth(contract, fetcher);

  return {
    ready: supabaseReady,
    environment: contract.appEnvironment,
    release: contract.releaseSha?.slice(0, 12) ?? "unversioned",
    provider: contract.provider,
    checks: {
      configuration: "pass",
      supabaseAuth: supabaseReady ? "pass" : "fail",
    },
    failureCodes: supabaseReady ? [] : ["SUPABASE_AUTH_UNREACHABLE"],
  };
}
