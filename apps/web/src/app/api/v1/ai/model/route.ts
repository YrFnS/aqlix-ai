import { selectOpenRouterModelInputSchema } from "@iraqi-ai/types";
import { requireApiUser } from "@/lib/api/auth";
import {
  jsonFailure,
  jsonSuccess,
  zodFieldErrors,
} from "@/lib/api/responses";
import {
  requireOpenRouterModel,
  OpenRouterCatalogError,
} from "@/lib/ai/openrouter-client";
import {
  resolveUserOpenRouterCredential,
  selectUserOpenRouterModel,
  UserAiSettingsRepositoryError,
} from "@/lib/ai/user-settings";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  const auth = await requireApiUser(request);
  if (!auth.ok) return auth.response;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonFailure("VALIDATION_ERROR", "Request body must be valid JSON.", {
      status: 422,
      requestId: auth.context.requestId,
    });
  }

  const parsed = selectOpenRouterModelInputSchema.safeParse(body);
  if (!parsed.success) {
    return jsonFailure("VALIDATION_ERROR", "Model selection is invalid.", {
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
      "Connect an OpenRouter API key before selecting a model.",
      { status: 409, requestId: auth.context.requestId },
    );
  }

  let model;
  try {
    model = await requireOpenRouterModel(apiKey, parsed.data.modelId);
  } catch (error) {
    if (error instanceof OpenRouterCatalogError) {
      if (error.status === 404) {
        return jsonFailure(
          "VALIDATION_ERROR",
          "The selected model is not currently available for this key.",
          {
            status: 422,
            requestId: auth.context.requestId,
            fieldErrors: { modelId: ["OPENROUTER_MODEL_UNAVAILABLE"] },
          },
        );
      }

      const authenticationFailure =
        error.status === 401 || error.status === 403;
      return jsonFailure(
        authenticationFailure ? "CONFLICT" : "SERVICE_UNAVAILABLE",
        authenticationFailure
          ? "The saved OpenRouter key is no longer accepted. Replace it before selecting a model."
          : "OpenRouter could not validate this model right now.",
        {
          status: authenticationFailure ? 409 : 503,
          requestId: auth.context.requestId,
        },
      );
    }

    console.error("Unexpected OpenRouter model validation failure", {
      requestId: auth.context.requestId,
      error,
    });
    return jsonFailure(
      "SERVICE_UNAVAILABLE",
      "OpenRouter could not validate this model right now.",
      { status: 503, requestId: auth.context.requestId },
    );
  }

  try {
    const settings = await selectUserOpenRouterModel(
      auth.context.supabase,
      model.id,
    );
    return jsonSuccess(
      { settings, model },
      { requestId: auth.context.requestId },
    );
  } catch (error) {
    if (error instanceof UserAiSettingsRepositoryError) {
      console.error("OpenRouter model persistence failed", {
        requestId: auth.context.requestId,
        operation: error.operation,
        databaseCode: error.databaseCode,
        message: error.message,
      });
    } else {
      console.error("Unexpected OpenRouter model persistence failure", {
        requestId: auth.context.requestId,
        error,
      });
    }

    return jsonFailure(
      "PERSISTENCE_ERROR",
      "The validated model could not be saved.",
      { status: 503, requestId: auth.context.requestId },
    );
  }
}
