import "server-only";

const officialOpenRouterApiUrl = "https://openrouter.ai/api/v1";

function applicationEnvironment(): string {
  return (
    process.env.APP_ENV?.trim() ||
    process.env.NEXT_PUBLIC_APP_ENV?.trim() ||
    "development"
  );
}

export function resolveOpenRouterBaseUrl(): string {
  const environment = applicationEnvironment();
  const override = process.env.OPENROUTER_BASE_URL?.trim();

  if (
    override &&
    (environment === "development" || environment === "test")
  ) {
    let parsed: URL;
    try {
      parsed = new URL(override);
    } catch {
      return officialOpenRouterApiUrl;
    }

    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return parsed.toString().replace(/\/$/u, "");
    }
  }

  return officialOpenRouterApiUrl;
}
