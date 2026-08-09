import { evaluateOperationalReadiness } from "@/lib/operations/readiness";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const requestId = crypto.randomUUID();
  const readiness = await evaluateOperationalReadiness();
  const response = Response.json(
    {
      status: readiness.ready ? "ready" : "not_ready",
      service: "ai-workspace-web",
      environment: readiness.environment,
      release: readiness.release,
      provider: readiness.provider,
      checks: readiness.checks,
      failureCodes: readiness.failureCodes,
      timestamp: new Date().toISOString(),
      requestId,
    },
    { status: readiness.ready ? 200 : 503 },
  );

  response.headers.set("cache-control", "no-store");
  response.headers.set("x-content-type-options", "nosniff");
  response.headers.set("x-request-id", requestId);
  return response;
}
