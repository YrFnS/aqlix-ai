const DEFAULT_NEXT_PATH = "/workspaces";
const SAFE_REDIRECT_ORIGIN = "https://tuppra.invalid";

const trustedOriginCandidates = () => [
  process.env.APP_BASE_URL,
  process.env.NEXT_PUBLIC_SITE_URL,
  process.env.RENDER_EXTERNAL_URL,
];

function isLocalHostname(hostname: string): boolean {
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "[::1]"
  );
}

export function getSafeNextPath(value: unknown): string {
  if (typeof value !== "string" || !value.startsWith("/")) {
    return DEFAULT_NEXT_PATH;
  }

  try {
    const candidate = new URL(value, SAFE_REDIRECT_ORIGIN);

    if (candidate.origin !== SAFE_REDIRECT_ORIGIN) {
      return DEFAULT_NEXT_PATH;
    }

    return `${candidate.pathname}${candidate.search}${candidate.hash}`;
  } catch {
    return DEFAULT_NEXT_PATH;
  }
}

export function getTrustedAppOrigin(): string | null {
  for (const value of trustedOriginCandidates()) {
    const rawValue = value?.trim();
    if (!rawValue) continue;

    try {
      const candidate = new URL(rawValue);
      const usesHttps = candidate.protocol === "https:";
      const usesLocalHttp =
        candidate.protocol === "http:" && isLocalHostname(candidate.hostname);

      if (
        candidate.username ||
        candidate.password ||
        (!usesHttps && !usesLocalHttp)
      ) {
        continue;
      }

      return candidate.origin;
    } catch {
      // Try the next trusted deployment variable.
    }
  }

  return null;
}

export function buildTrustedAppUrl(path: string): string | null {
  const origin = getTrustedAppOrigin();
  if (!origin) return null;

  const candidate = new URL(path, `${origin}/`);
  return candidate.origin === origin ? candidate.toString() : null;
}
