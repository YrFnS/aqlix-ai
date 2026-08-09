import { resolveReleaseSha } from "@/lib/operations/runtime-contract";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const requestId = crypto.randomUUID();
  const response = Response.json(
    {
      status: "alive",
      service: "ai-workspace-web",
      release: resolveReleaseSha(process.env)?.slice(0, 12) ?? "unversioned",
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.max(0, Math.floor(process.uptime())),
      requestId,
    },
    { status: 200 },
  );

  response.headers.set("cache-control", "no-store");
  response.headers.set("x-content-type-options", "nosniff");
  response.headers.set("x-request-id", requestId);
  return response;
}
