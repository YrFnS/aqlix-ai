import { NextResponse } from "next/server";
import { attachmentIdInputSchema } from "@iraqi-ai/types";
import { requireApiUser } from "@/lib/api/auth";
import { jsonFailure, zodFieldErrors } from "@/lib/api/responses";
import {
  createDocumentDownloadUrl,
  getWorkspaceDocument,
  DocumentRepositoryError,
} from "@/lib/documents/repository";
import { getWorkspaceAccess } from "@/lib/workspaces/repository";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ workspaceId: string; attachmentId: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  const auth = await requireApiUser(request);
  if (!auth.ok) return auth.response;

  const parsed = attachmentIdInputSchema.safeParse(await context.params);
  if (!parsed.success) {
    return jsonFailure("VALIDATION_ERROR", "Document identity is invalid.", {
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
        "Document was not found or is unavailable to this account.",
        { status: 404, requestId: auth.context.requestId },
      );
    }

    const document = await getWorkspaceDocument(
      auth.context.supabase,
      parsed.data.workspaceId,
      parsed.data.attachmentId,
    );

    if (!document) {
      return jsonFailure(
        "NOT_FOUND",
        "Document was not found or is unavailable to this account.",
        { status: 404, requestId: auth.context.requestId },
      );
    }

    if (document.attachment.status !== "ready") {
      return jsonFailure(
        "CONFLICT",
        "Only ready documents can be downloaded.",
        { status: 409, requestId: auth.context.requestId },
      );
    }

    const downloadUrl = await createDocumentDownloadUrl(
      auth.context.supabase,
      document.attachment.storagePath,
      60,
    );
    const response = NextResponse.redirect(downloadUrl, 302);
    response.headers.set("x-request-id", auth.context.requestId);
    response.headers.set("cache-control", "private, no-store");
    return response;
  } catch (error) {
    if (error instanceof DocumentRepositoryError) {
      console.error("Document download failed", {
        requestId: auth.context.requestId,
        operation: error.operation,
        databaseCode: error.databaseCode,
        message: error.message,
      });
    } else {
      console.error("Unexpected document download failure", {
        requestId: auth.context.requestId,
        error,
      });
    }

    return jsonFailure(
      "SERVICE_UNAVAILABLE",
      "An authorized download link could not be created.",
      { status: 503, requestId: auth.context.requestId },
    );
  }
}
