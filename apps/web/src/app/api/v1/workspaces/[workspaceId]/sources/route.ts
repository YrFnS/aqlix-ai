import {
  DOCUMENT_MAX_BYTES,
  searchWorkspaceSourcesInputSchema,
  workspaceIdInputSchema,
  type DocumentFailureCode,
} from "@iraqi-ai/types";
import { requireApiUser } from "@/lib/api/auth";
import {
  jsonFailure,
  jsonSuccess,
  zodFieldErrors,
} from "@/lib/api/responses";
import {
  DOCUMENT_PROCESSOR_NAME,
  DOCUMENT_PROCESSOR_VERSION,
  DocumentProcessingError,
  prepareDocument,
} from "@/lib/documents/processor";
import {
  beginAttachmentProcessing,
  failAttachmentProcessing,
  finalizeAttachmentProcessing,
  getWorkspaceDocument,
  listWorkspaceDocuments,
  removeDocumentObject,
  searchWorkspaceSources,
  uploadDocumentObject,
  DocumentRepositoryError,
} from "@/lib/documents/repository";
import { getWorkspaceAccess } from "@/lib/workspaces/repository";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const multipartOverheadAllowance = 128 * 1024;

type RouteContext = {
  params: Promise<{ workspaceId: string }>;
};

function logFailure(
  error: unknown,
  requestId: string,
  operation: string,
): void {
  if (error instanceof DocumentRepositoryError) {
    console.error("Document API persistence failure", {
      requestId,
      operation,
      repositoryOperation: error.operation,
      databaseCode: error.databaseCode,
      message: error.message,
    });
    return;
  }

  console.error("Unexpected document API failure", {
    requestId,
    operation,
    error,
  });
}

async function recordProcessingFailure(
  supabase: Parameters<typeof failAttachmentProcessing>[0],
  input: {
    workspaceId: string;
    attachmentId: string;
    processingRunId: string;
    failureCode: DocumentFailureCode;
    failureMessage: string;
    requestId: string;
  },
): Promise<void> {
  try {
    await failAttachmentProcessing(supabase, input);
  } catch (error) {
    logFailure(error, input.requestId, "record-processing-failure");
  }
}

export async function GET(request: Request, context: RouteContext) {
  const auth = await requireApiUser(request);
  if (!auth.ok) return auth.response;

  const params = workspaceIdInputSchema.safeParse(await context.params);
  if (!params.success) {
    return jsonFailure("VALIDATION_ERROR", "Workspace ID is invalid.", {
      status: 422,
      requestId: auth.context.requestId,
      fieldErrors: zodFieldErrors(params.error),
    });
  }

  try {
    const access = await getWorkspaceAccess(
      auth.context.supabase,
      auth.context.user.id,
      params.data.workspaceId,
    );

    if (!access) {
      return jsonFailure(
        "NOT_FOUND",
        "Document sources were not found or are unavailable to this account.",
        { status: 404, requestId: auth.context.requestId },
      );
    }

    const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";
    if (query) {
      const parsedSearch = searchWorkspaceSourcesInputSchema.safeParse({
        workspaceId: params.data.workspaceId,
        query,
        limit: Number.parseInt(
          new URL(request.url).searchParams.get("limit") ?? "8",
          10,
        ),
      });

      if (!parsedSearch.success) {
        return jsonFailure("VALIDATION_ERROR", "Source search is invalid.", {
          status: 422,
          requestId: auth.context.requestId,
          fieldErrors: zodFieldErrors(parsedSearch.error),
        });
      }

      const results = await searchWorkspaceSources(
        auth.context.supabase,
        parsedSearch.data,
      );

      return jsonSuccess(
        {
          results,
          query: parsedSearch.data.query,
          workspaceRole: access.role,
          workspaceArchived: access.archivedAt !== null,
        },
        { requestId: auth.context.requestId },
      );
    }

    const documents = await listWorkspaceDocuments(
      auth.context.supabase,
      params.data.workspaceId,
    );

    return jsonSuccess(
      {
        documents,
        workspaceRole: access.role,
        workspaceArchived: access.archivedAt !== null,
      },
      { requestId: auth.context.requestId },
    );
  } catch (error) {
    logFailure(error, auth.context.requestId, "read-collection");
    return jsonFailure(
      "PERSISTENCE_ERROR",
      "Document sources could not be loaded.",
      { status: 503, requestId: auth.context.requestId },
    );
  }
}

export async function POST(request: Request, context: RouteContext) {
  const auth = await requireApiUser(request);
  if (!auth.ok) return auth.response;

  const params = workspaceIdInputSchema.safeParse(await context.params);
  if (!params.success) {
    return jsonFailure("VALIDATION_ERROR", "Workspace ID is invalid.", {
      status: 422,
      requestId: auth.context.requestId,
      fieldErrors: zodFieldErrors(params.error),
    });
  }

  const contentLength = Number.parseInt(
    request.headers.get("content-length") ?? "0",
    10,
  );
  if (
    Number.isFinite(contentLength) &&
    contentLength > DOCUMENT_MAX_BYTES + multipartOverheadAllowance
  ) {
    return jsonFailure("VALIDATION_ERROR", "The uploaded document is too large.", {
      status: 413,
      requestId: auth.context.requestId,
      fieldErrors: { file: ["FILE_TOO_LARGE"] },
    });
  }

  let access;
  try {
    access = await getWorkspaceAccess(
      auth.context.supabase,
      auth.context.user.id,
      params.data.workspaceId,
    );
  } catch (error) {
    logFailure(error, auth.context.requestId, "authorize-upload");
    return jsonFailure(
      "PERSISTENCE_ERROR",
      "Workspace access could not be verified.",
      { status: 503, requestId: auth.context.requestId },
    );
  }

  if (!access) {
    return jsonFailure(
      "NOT_FOUND",
      "Document sources were not found or are unavailable to this account.",
      { status: 404, requestId: auth.context.requestId },
    );
  }

  if (access.archivedAt) {
    return jsonFailure(
      "CONFLICT",
      "Archived workspaces are read-only. Restore the workspace before uploading documents.",
      { status: 409, requestId: auth.context.requestId },
    );
  }

  if (access.role === "viewer") {
    return jsonFailure(
      "FORBIDDEN",
      "Viewer membership does not permit document upload.",
      { status: 403, requestId: auth.context.requestId },
    );
  }

  let file: File;
  try {
    const formData = await request.formData();
    const candidate = formData.get("file");
    if (!(candidate instanceof File)) {
      return jsonFailure("VALIDATION_ERROR", "One document file is required.", {
        status: 422,
        requestId: auth.context.requestId,
        fieldErrors: { file: ["A document file is required."] },
      });
    }
    file = candidate;
  } catch {
    return jsonFailure(
      "VALIDATION_ERROR",
      "The upload must use valid multipart form data.",
      { status: 422, requestId: auth.context.requestId },
    );
  }

  let prepared;
  try {
    const bytes = new Uint8Array(await file.arrayBuffer());
    prepared = await prepareDocument({
      fileName: file.name,
      declaredMediaType: file.type,
      bytes,
    });
  } catch (error) {
    if (error instanceof DocumentProcessingError) {
      return jsonFailure("VALIDATION_ERROR", error.message, {
        status: error.code === "FILE_TOO_LARGE" ? 413 : 422,
        requestId: auth.context.requestId,
        fieldErrors: { file: [error.code] },
      });
    }

    console.error("Unexpected document validation failure", {
      requestId: auth.context.requestId,
      error,
    });
    return jsonFailure(
      "INTERNAL_ERROR",
      "The document could not be validated.",
      { status: 500, requestId: auth.context.requestId },
    );
  }

  let begun;
  try {
    begun = await beginAttachmentProcessing(auth.context.supabase, {
      workspaceId: params.data.workspaceId,
      fileName: prepared.fileName,
      mediaType: prepared.mediaType,
      byteSize: prepared.byteSize,
      contentSha256: prepared.contentSha256,
      processor: DOCUMENT_PROCESSOR_NAME,
      processorVersion: DOCUMENT_PROCESSOR_VERSION,
    });
  } catch (error) {
    if (
      error instanceof DocumentRepositoryError &&
      error.databaseCode === "23505"
    ) {
      return jsonFailure(
        "CONFLICT",
        "This workspace already contains the same active document bytes.",
        {
          status: 409,
          requestId: auth.context.requestId,
          fieldErrors: { file: ["DUPLICATE_DOCUMENT"] },
        },
      );
    }

    logFailure(error, auth.context.requestId, "begin-upload");
    return jsonFailure(
      "PERSISTENCE_ERROR",
      "The document processing record could not be created.",
      { status: 503, requestId: auth.context.requestId },
    );
  }

  const bytes = new Uint8Array(await file.arrayBuffer());

  try {
    await uploadDocumentObject(auth.context.supabase, {
      objectPath: begun.objectPath,
      mediaType: prepared.mediaType,
      bytes,
    });
  } catch (error) {
    logFailure(error, auth.context.requestId, "upload-object");
    await recordProcessingFailure(auth.context.supabase, {
      workspaceId: params.data.workspaceId,
      attachmentId: begun.attachmentId,
      processingRunId: begun.processingRunId,
      failureCode: "STORAGE_UPLOAD_FAILED",
      failureMessage: "The private document object could not be stored.",
      requestId: auth.context.requestId,
    });

    return jsonFailure(
      "SERVICE_UNAVAILABLE",
      "The private document object could not be stored.",
      { status: 503, requestId: auth.context.requestId },
    );
  }

  try {
    await finalizeAttachmentProcessing(auth.context.supabase, {
      workspaceId: params.data.workspaceId,
      attachmentId: begun.attachmentId,
      processingRunId: begun.processingRunId,
      characterCount: prepared.normalizedText.length,
      passages: prepared.passages,
    });
  } catch (error) {
    logFailure(error, auth.context.requestId, "finalize-processing");

    let failureCode: DocumentFailureCode = "SOURCE_PERSISTENCE_FAILED";
    let failureMessage = "The extracted source passages could not be persisted.";
    try {
      await removeDocumentObject(auth.context.supabase, begun.objectPath);
    } catch (cleanupError) {
      logFailure(cleanupError, auth.context.requestId, "cleanup-upload-object");
      failureCode = "STORAGE_DELETE_FAILED";
      failureMessage =
        "Source persistence failed and the private object could not be cleaned up.";
    }

    await recordProcessingFailure(auth.context.supabase, {
      workspaceId: params.data.workspaceId,
      attachmentId: begun.attachmentId,
      processingRunId: begun.processingRunId,
      failureCode,
      failureMessage,
      requestId: auth.context.requestId,
    });

    return jsonFailure(
      "PERSISTENCE_ERROR",
      "The document could not be finalized.",
      { status: 503, requestId: auth.context.requestId },
    );
  }

  try {
    const document = await getWorkspaceDocument(
      auth.context.supabase,
      params.data.workspaceId,
      begun.attachmentId,
    );

    if (!document) {
      return jsonFailure(
        "PERSISTENCE_ERROR",
        "The finalized document could not be loaded.",
        { status: 503, requestId: auth.context.requestId },
      );
    }

    return jsonSuccess(
      { document },
      { status: 201, requestId: auth.context.requestId },
    );
  } catch (error) {
    logFailure(error, auth.context.requestId, "reload-finalized-document");
    return jsonFailure(
      "PERSISTENCE_ERROR",
      "The document was processed but could not be reloaded.",
      { status: 503, requestId: auth.context.requestId },
    );
  }
}
