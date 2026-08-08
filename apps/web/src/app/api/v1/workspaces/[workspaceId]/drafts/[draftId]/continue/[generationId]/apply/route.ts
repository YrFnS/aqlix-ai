import { draftGenerationIdInputSchema } from "@iraqi-ai/types";
import { requireApiUser } from "@/lib/api/auth";
import {
  jsonFailure,
  jsonSuccess,
  zodFieldErrors,
} from "@/lib/api/responses";
import {
  applyDraftGeneration,
  getDraft,
  getDraftDetail,
  getDraftGeneration,
  DraftRepositoryError,
} from "@/lib/drafts/repository";
import { getWorkspaceAccess } from "@/lib/workspaces/repository";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    workspaceId: string;
    draftId: string;
    generationId: string;
  }>;
};

export async function POST(request: Request, context: RouteContext) {
  const auth = await requireApiUser(request);
  if (!auth.ok) return auth.response;

  const parsed = draftGenerationIdInputSchema.safeParse(await context.params);
  if (!parsed.success) {
    return jsonFailure("VALIDATION_ERROR", "Draft proposal identity is invalid.", {
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
        "Draft proposal was not found or is unavailable to this account.",
        { status: 404, requestId: auth.context.requestId },
      );
    }
    if (access.archivedAt) {
      return jsonFailure(
        "CONFLICT",
        "Archived workspaces are read-only. Restore the workspace before applying a proposal.",
        { status: 409, requestId: auth.context.requestId },
      );
    }
    if (access.role === "viewer") {
      return jsonFailure(
        "FORBIDDEN",
        "Viewer membership does not permit applying draft proposals.",
        { status: 403, requestId: auth.context.requestId },
      );
    }

    const [draft, generation] = await Promise.all([
      getDraft(
        auth.context.supabase,
        parsed.data.workspaceId,
        parsed.data.draftId,
      ),
      getDraftGeneration(
        auth.context.supabase,
        parsed.data.workspaceId,
        parsed.data.draftId,
        parsed.data.generationId,
      ),
    ]);

    if (!draft || !generation) {
      return jsonFailure(
        "NOT_FOUND",
        "Draft proposal was not found or is unavailable to this account.",
        { status: 404, requestId: auth.context.requestId },
      );
    }
    if (draft.status !== "active") {
      return jsonFailure(
        "CONFLICT",
        "Archived drafts are read-only. Restore the draft before applying a proposal.",
        { status: 409, requestId: auth.context.requestId },
      );
    }
    if (generation.status !== "complete") {
      return jsonFailure(
        "CONFLICT",
        "Only a completed proposal can be applied.",
        { status: 409, requestId: auth.context.requestId },
      );
    }

    const versionNumber = await applyDraftGeneration(
      auth.context.supabase,
      parsed.data.workspaceId,
      parsed.data.draftId,
      parsed.data.generationId,
    );
    const detail = await getDraftDetail(
      auth.context.supabase,
      parsed.data.workspaceId,
      parsed.data.draftId,
    );

    if (!detail) {
      return jsonFailure(
        "PERSISTENCE_ERROR",
        "The proposal was applied but the draft could not be reloaded.",
        { status: 503, requestId: auth.context.requestId },
      );
    }

    return jsonSuccess(
      { detail, versionNumber },
      { requestId: auth.context.requestId },
    );
  } catch (error) {
    if (error instanceof DraftRepositoryError && error.databaseCode === "40001") {
      return jsonFailure(
        "CONFLICT",
        "The accepted draft changed after this proposal started. Generate a new proposal from the latest version.",
        { status: 409, requestId: auth.context.requestId },
      );
    }

    if (error instanceof DraftRepositoryError) {
      console.error("Draft proposal apply persistence failure", {
        requestId: auth.context.requestId,
        operation: error.operation,
        databaseCode: error.databaseCode,
        message: error.message,
      });
    } else {
      console.error("Unexpected draft proposal apply failure", {
        requestId: auth.context.requestId,
        error,
      });
    }

    return jsonFailure(
      "PERSISTENCE_ERROR",
      "The draft proposal could not be applied.",
      { status: 503, requestId: auth.context.requestId },
    );
  }
}
