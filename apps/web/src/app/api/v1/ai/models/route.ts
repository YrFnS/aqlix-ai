import { openRouterModelCatalogQuerySchema } from "@iraqi-ai/types";
import { requireApiUser } from "@/lib/api/auth";
import {
  jsonFailure,
  jsonSuccess,
  zodFieldErrors,
} from "@/lib/api/responses";
import {
  listOpenRouterModels,
  OpenRouterCatalogError,
} from "@/lib/ai/openrouter-client";
import {
  resolveUserOpenRouterCredential,
  UserAiSettingsRepositoryError,
} from "@/lib/ai/user-settings";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = await requireApiUser(request);
  if (!auth.ok) return auth.response;

  const searchParams = new URL(request.url).searchParams;
  const rawLimit = Number.parseInt(searchParams.get("limit") ?? "100", 10);
  const parsed = openRouterModelCatalogQuerySchema.safeParse({
    query: searchParams.get("q") ?? "",
    sort: searchParams.get("sort") ?? "name",
    freeOnly: searchParams.get("free") === "true",
    limit: Number.isFinite(rawLimit) ? rawLimit : 100,
  });

  if (!parsed.success) {
    return jsonFailure("VALIDATION_ERROR", "Model search is invalid.", {
      status: 422,
      requestId: auth.context.requestId,
      fieldErrors: zodFieldErrors(parsed.error),
    });
  }

  let apiKey: string | null;
  try {
    apiKey = await resolveUserOpenRouterCredential(auth.context.supabase);
  } catch (error) {
    if (error instanceof UserAiSettingsRepositoryError) {
      console.error("OpenRouter credential resolution failed", {
        requestId: auth.context.requestId,
        operation: error.operation,
        databaseCode: error.databaseCode,
        message: error.message,
      });
    } else {
      console.error("Unexpected OpenRouter credential resolution failure", {
        requestId: auth.context.requestId,
        error,
      });
    }

    return jsonFailure(
      "PERSISTENCE_ERROR",
      "The saved OpenRouter connection could not be resolved.",
      { status: 503, requestId: auth.context.requestId },
    );
  }

  if (!apiKey) {
    return jsonFailure(
      "CONFLICT",
      "Connect an OpenRouter API key before loading its available models.",
      { status: 409, requestId: auth.context.requestId },
    );
  }

  try {
    const catalog = await listOpenRouterModels(apiKey, parsed.data);
    return jsonSuccess(
      { catalog },
      { requestId: auth.context.requestId },
    );
  } catch (error) {
    if (error instanceof OpenRouterCatalogError) {
      const authenticationFailure =
        error.status === 401 || error.status === 403;
      return jsonFailure(
        authenticationFailure ? "CONFLICT" : "SERVICE_UNAVAILABLE",
        authenticationFailure
          ? "The saved OpenRouter key is no longer accepted. Replace it in AI settings."
          : "The live OpenRouter model catalog is temporarily unavailable.",
        {
          status: authenticationFailure ? 409 : 503,
          requestId: auth.context.requestId,
        },
      );
    }

    console.error("Unexpected OpenRouter catalog failure", {
      requestId: auth.context.requestId,
      error,
    });
    return jsonFailure(
      "SERVICE_UNAVAILABLE",
      "The live OpenRouter model catalog is temporarily unavailable.",
      { status: 503, requestId: auth.context.requestId },
    );
  }
}
