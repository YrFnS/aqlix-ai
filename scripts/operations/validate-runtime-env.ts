import {
  OperationalRuntimeConfigurationError,
  parseOperationalRuntimeContract,
} from "../../apps/web/src/lib/operations/runtime-contract";

try {
  const contract = parseOperationalRuntimeContract(process.env);

  console.info("Operational runtime contract is valid", {
    appEnvironment: contract.appEnvironment,
    publicEnvironment: contract.publicEnvironment,
    release: contract.releaseSha?.slice(0, 12) ?? "unversioned",
    provider: contract.provider,
    supabaseHost: new URL(contract.supabaseUrl).host,
    dependencyProbeEnabled: contract.probeDependencies,
    readinessTimeoutMs: contract.readinessTimeoutMs,
  });
} catch (error) {
  if (error instanceof OperationalRuntimeConfigurationError) {
    console.error("Operational runtime contract is invalid", {
      issuePaths: error.issuePaths,
    });
  } else {
    console.error("Operational runtime preflight failed unexpectedly", {
      error,
    });
  }

  process.exitCode = 1;
}
