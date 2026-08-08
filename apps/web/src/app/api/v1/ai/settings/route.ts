import { saveOpenRouterCredentialInputSchema } from "@iraqi-ai/types";
import { requireApiUser } from "@/lib/api/auth";
import {
  jsonFailure,
  jsonSuccess,
  zodFieldErrors,
} from "@/lib/api/responses";
import {
  inspectOpenRouterKey,
  OpenRouterCatalogError,
} from "@/lib/ai/openrouter-client";
import {
  disconnectUserOpenRouter,
  getUserAiSettings,
  saveUserOpenRouterCredential,
  UserAiSettingsRepositoryError,
} from "@/lib/ai/user-settings";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function logRepositoryFailure(
  error: UserAiSettingsRepositoryError,
  requestId: string,
  operation: string,
): void {
  console.error("User AI settings persistence failure", {
    requestId,
    operation,
    repositoryOperation: error.operation,
    databaseCode: error.databaseCode,
    message: error.message,
  });
}

export async function GET(request: Request) {
  const auth = await requireApiUser(request);
  if (!auth.ok) return auth.response;

  try {
    const settings = await getUserAiSettings(auth.context.supabase);
    return jsonSuccess(
      { settings },
      { requestId: auth.context.requestId },
    );
  } catch (error) {
    if (error instanceof UserAiSettingsRepositoryError) {
      logRepositoryFailure(error, auth.context.requestId, "read");
    } else {
      console.error("Unexpected user AI settings read failure", {
        requestId: auth.context.requestId,
        error,
      });
    }

    return jsonFailure(
      "PERSISTENCE_ERROR",
      "AI settings could not be loaded.",
      { status: 503, requestId: auth.context.requestId },
    );
  }
}

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

  const parsed = saveOpenRouterCredentialInputSchema.safeParse(body);
  if (!parsed.success) {
    return jsonFailure("VALIDATION_ERROR", "OpenRouter key is invalid.", {
      status: 422,
      requestId: auth.context.requestId,
      fieldErrors: zodFieldErrors(parsed.error),
    });
  }

  let metadata;
  try {
    metadata = await inspectOpenRouterKey(parsed.data.apiKey);
  } catch (error) {
    if (error instanceof OpenRouterCatalogError) {
      const rejected = error.status === 401 || error.status === 403;
      return jsonFailure(
        rejected ? "VALIDATION_ERROR" : "SERVICE_UNAVAILABLE",
        rejected
          ? "OpenRouter rejected this API key."
          : "OpenRouter could not validate this key right now.",
        {
          status: rejected ? 422 : 503,
          requestId: auth.context.requestId,
          ...(rejected
            ? { fieldErrors: { apiKey: ["OPENROUTER_KEY_REJECTED"] } }
            : {}),
        },
      );
    }

    console.error("Unexpected OpenRouter key validation failure", {
      requestId: auth.context.requestId,
      error,
    });
    return jsonFailure(
      "SERVICE_UNAVAILABLE",
      "OpenRouter could not validate this key right now.",
      { status: 503, requestId: auth.context.requestId },
    );
  }

  try {
    const settings = await saveUserOpenRouterCredential(
      auth.context.supabase,
      {
        apiKey: parsed.data.apiKey,
        metadata,
      },
    );

    return jsonSuccess(
      { settings, keyMetadata: metadata },
      { requestId: auth.context.requestId },
    );
  } catch (error) {
    if (error instanceof UserAiSettingsRepositoryError) {
      logRepositoryFailure(error, auth.context.requestId, "save");
    } else {
      console.error("Unexpected user AI settings save failure", {
        requestId: auth.context.requestId,
        error,
      });
    }

    return jsonFailure(
      "PERSISTENCE_ERROR",
      "The validated key could not be stored securely.",
      { status: 503, requestId: auth.context.requestId },
    );
  }
}

export async function DELETE(request: Request) {
  const auth = await requireApiUser(request);
  if (!auth.ok) return auth.response;

  try {
    const disconnected = await disconnectUserOpenRouter(
      auth.context.supabase,
    );
    const settings = await getUserAiSettings(auth.context.supabase);

    return jsonSuccess(
      { disconnected, settings },
      { requestId: auth.context.requestId },
    );
  } catch (error) {
    if (error instanceof UserAiSettingsRepositoryError) {
      logRepositoryFailure(error, auth.context.requestId, "disconnect");
    } else {
      console.error("Unexpected OpenRouter disconnect failure", {
        requestId: auth.context.requestId,
        error,
      });
    }

    return jsonFailure(
      "PERSISTENCE_ERROR",
      "The OpenRouter connection could not be removed.",
      { status: 503, requestId: auth.context.requestId },
    );
  }
}
