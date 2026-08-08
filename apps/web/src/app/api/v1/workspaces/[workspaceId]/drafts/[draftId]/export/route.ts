import { exportDraftInputSchema } from "@iraqi-ai/types";
import { requireApiUser } from "@/lib/api/auth";
import { jsonFailure, zodFieldErrors } from "@/lib/api/responses";
import {
  buildDraftExport,
  contentDispositionFileName,
} from "@/lib/drafts/export";
import {
  getDraft,
  DraftRepositoryError,
} from "@/lib/drafts/repository";
import { getWorkspaceAccess } from "@/lib/workspaces/repository";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ workspaceId: string; draftId: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  const auth = await requireApiUser(request);
  if (!auth.ok) return auth.response;

  const params = await context.params;
  const parsed = exportDraftInputSchema.safeParse({
    workspaceId: params.workspaceId,
    draftId: params.draftId,
    format: new URL(request.url).searchParams.get("format"),
  });

  if (!parsed.success) {
    return jsonFailure("VALIDATION_ERROR", "Draft export is invalid.", {
      status: 422,
      requestId: auth.context.requestId,
      fieldErrors: zodFieldErrors(parsed.error),
    });
  }

  try {
    const access = await getWorkspaceAccess(
      auth.context.supabase,
      auth.context.user.id,
      parsed.data.workspaceId,
    );
    if (!access) {
      return jsonFailure(
        "NOT_FOUND",
        "Draft was not found or is unavailable to this account.",
        { status: 404, requestId: auth.context.requestId },
      );
    }

    const draft = await getDraft(
      auth.context.supabase,
      parsed.data.workspaceId,
      parsed.data.draftId,
    );
    if (!draft) {
      return jsonFailure(
        "NOT_FOUND",
        "Draft was not found or is unavailable to this account.",
        { status: 404, requestId: auth.context.requestId },
      );
    }

    const payload = buildDraftExport(draft, parsed.data.format);
    return new Response(payload.body, {
      status: 200,
      headers: {
        "content-type": payload.contentType,
        "content-disposition": contentDispositionFileName(payload.downloadName),
        "cache-control": "private, no-store",
        "x-content-type-options": "nosniff",
        "x-request-id": auth.context.requestId,
      },
    });
  } catch (error) {
    if (error instanceof DraftRepositoryError) {
      console.error("Draft export persistence failure", {
        requestId: auth.context.requestId,
        operation: error.operation,
        databaseCode: error.databaseCode,
        message: error.message,
      });
    } else {
      console.error("Unexpected draft export failure", {
        requestId: auth.context.requestId,
        error,
      });
    }

    return jsonFailure("PERSISTENCE_ERROR", "The draft could not be exported.", {
      status: 503,
      requestId: auth.context.requestId,
    });
  }
}
