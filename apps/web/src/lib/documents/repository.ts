import "server-only";

import type {
  Attachment,
  AttachmentProcessingRun,
  BegunAttachmentProcessing,
  BeginAttachmentProcessingInput,
  DocumentDetail,
  DocumentFailureCode,
  ExtractedPassageInput,
  Source,
  SourceSearchResult,
  Tables,
} from "@iraqi-ai/types";
import { DOCUMENT_STORAGE_BUCKET } from "@iraqi-ai/types";
import type { SupabaseServerClient } from "@iraqi-ai/supabase-client/server";

type AttachmentRow = Tables<"attachments">;
type ProcessingRunRow = Tables<"attachment_processing_runs">;
type SourceRow = Tables<"sources">;

export class DocumentRepositoryError extends Error {
  constructor(
    public readonly operation: string,
    message: string,
    public readonly databaseCode?: string,
  ) {
    super(message);
    this.name = "DocumentRepositoryError";
  }
}

function repositoryError(
  operation: string,
  message: string,
  databaseCode?: string,
): never {
  throw new DocumentRepositoryError(operation, message, databaseCode);
}

export function mapAttachmentRow(row: AttachmentRow): Attachment {
  return {
    id: row.id,
    workspaceId: row.workspace_id,
    uploadedBy: row.uploaded_by,
    fileName: row.file_name,
    mediaType: row.media_type,
    byteSize: row.byte_size,
    storagePath: row.storage_path,
    status:
      row.status === "pending" ||
      row.status === "processing" ||
      row.status === "ready" ||
      row.status === "deleted"
        ? row.status
        : "failed",
    contentSha256: row.content_sha256,
    failureCode: row.failure_code,
    failureReason: row.failure_reason,
    processorVersion: row.processor_version,
    sourceCount: row.source_count,
    processedAt: row.processed_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deletedAt: row.deleted_at,
  };
}

export function mapProcessingRunRow(
  row: ProcessingRunRow,
): AttachmentProcessingRun {
  return {
    id: row.id,
    workspaceId: row.workspace_id,
    attachmentId: row.attachment_id,
    createdBy: row.created_by,
    attempt: row.attempt,
    processor: row.processor,
    processorVersion: row.processor_version,
    status:
      row.status === "processing" || row.status === "complete"
        ? row.status
        : "failed",
    sourceCount: row.source_count,
    characterCount: row.character_count,
    failureCode: row.failure_code,
    failureMessage: row.failure_message,
    startedAt: row.started_at,
    completedAt: row.completed_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapSourceRow(row: SourceRow): Source {
  return {
    id: row.id,
    workspaceId: row.workspace_id,
    attachmentId: row.attachment_id,
    ordinal: row.ordinal,
    content: row.content,
    pageNumber: row.page_number,
    startOffset: row.start_offset,
    endOffset: row.end_offset,
    startLine: row.start_line,
    endLine: row.end_line,
    createdAt: row.created_at,
  };
}

export async function listWorkspaceDocuments(
  supabase: SupabaseServerClient,
  workspaceId: string,
): Promise<Attachment[]> {
  const { data, error } = await supabase
    .from("attachments")
    .select("*")
    .eq("workspace_id", workspaceId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) {
    repositoryError("list-documents", error.message, error.code);
  }

  return (data ?? []).map(mapAttachmentRow);
}

export async function getWorkspaceDocument(
  supabase: SupabaseServerClient,
  workspaceId: string,
  attachmentId: string,
): Promise<DocumentDetail | null> {
  const { data: attachment, error: attachmentError } = await supabase
    .from("attachments")
    .select("*")
    .eq("workspace_id", workspaceId)
    .eq("id", attachmentId)
    .is("deleted_at", null)
    .maybeSingle();

  if (attachmentError) {
    repositoryError(
      "get-document",
      attachmentError.message,
      attachmentError.code,
    );
  }

  if (!attachment) return null;

  const [runResult, sourceResult] = await Promise.all([
    supabase
      .from("attachment_processing_runs")
      .select("*")
      .eq("workspace_id", workspaceId)
      .eq("attachment_id", attachmentId)
      .order("attempt", { ascending: false }),
    supabase
      .from("sources")
      .select(
        "id, workspace_id, attachment_id, ordinal, content, page_number, start_offset, end_offset, start_line, end_line, created_at",
      )
      .eq("workspace_id", workspaceId)
      .eq("attachment_id", attachmentId)
      .order("ordinal", { ascending: true }),
  ]);

  if (runResult.error) {
    repositoryError(
      "list-processing-runs",
      runResult.error.message,
      runResult.error.code,
    );
  }

  if (sourceResult.error) {
    repositoryError(
      "list-document-sources",
      sourceResult.error.message,
      sourceResult.error.code,
    );
  }

  return {
    attachment: mapAttachmentRow(attachment),
    processingRuns: (runResult.data ?? []).map(mapProcessingRunRow),
    sources: (sourceResult.data ?? []).map((source) =>
      mapSourceRow(source as SourceRow),
    ),
  };
}

export async function beginAttachmentProcessing(
  supabase: SupabaseServerClient,
  input: BeginAttachmentProcessingInput,
): Promise<BegunAttachmentProcessing> {
  const { data, error } = await supabase.rpc("begin_attachment_processing", {
    target_workspace_id: input.workspaceId,
    original_file_name: input.fileName,
    normalized_media_type: input.mediaType,
    original_byte_size: input.byteSize,
    original_content_sha256: input.contentSha256,
    requested_processor: input.processor,
    requested_processor_version: input.processorVersion,
  });

  if (error) {
    repositoryError("begin-document-processing", error.message, error.code);
  }

  const row = data?.[0];
  if (!row) {
    repositoryError(
      "begin-document-processing",
      "The document processing record was not created.",
    );
  }

  return {
    attachmentId: row.attachment_id,
    processingRunId: row.processing_run_id,
    objectPath: row.object_path,
  };
}

export async function finalizeAttachmentProcessing(
  supabase: SupabaseServerClient,
  input: {
    workspaceId: string;
    attachmentId: string;
    processingRunId: string;
    characterCount: number;
    passages: ExtractedPassageInput[];
  },
): Promise<void> {
  const { error } = await supabase.rpc("finalize_attachment_processing", {
    target_workspace_id: input.workspaceId,
    target_attachment_id: input.attachmentId,
    target_processing_run_id: input.processingRunId,
    normalized_character_count: input.characterCount,
    extracted_passages: input.passages.map((passage) => ({
      ordinal: passage.ordinal,
      content: passage.content,
      page_number: passage.pageNumber,
      start_offset: passage.startOffset,
      end_offset: passage.endOffset,
      start_line: passage.startLine,
      end_line: passage.endLine,
    })),
  });

  if (error) {
    repositoryError("finalize-document-processing", error.message, error.code);
  }
}

export async function failAttachmentProcessing(
  supabase: SupabaseServerClient,
  input: {
    workspaceId: string;
    attachmentId: string;
    processingRunId: string;
    failureCode: DocumentFailureCode;
    failureMessage: string;
  },
): Promise<void> {
  const { error } = await supabase.rpc("fail_attachment_processing", {
    target_workspace_id: input.workspaceId,
    target_attachment_id: input.attachmentId,
    target_processing_run_id: input.processingRunId,
    processing_failure_code: input.failureCode,
    processing_failure_message: input.failureMessage.slice(0, 500),
  });

  if (error) {
    repositoryError("fail-document-processing", error.message, error.code);
  }
}

export async function deleteAttachmentRecord(
  supabase: SupabaseServerClient,
  workspaceId: string,
  attachmentId: string,
): Promise<boolean> {
  const { data, error } = await supabase.rpc("delete_attachment_record", {
    target_workspace_id: workspaceId,
    target_attachment_id: attachmentId,
  });

  if (error) {
    repositoryError("delete-document-record", error.message, error.code);
  }

  return data === true;
}

export async function searchWorkspaceSources(
  supabase: SupabaseServerClient,
  input: { workspaceId: string; query: string; limit: number },
): Promise<SourceSearchResult[]> {
  const { data, error } = await supabase.rpc("search_workspace_sources", {
    target_workspace_id: input.workspaceId,
    source_query: input.query,
    result_limit: input.limit,
  });

  if (error) {
    repositoryError("search-document-sources", error.message, error.code);
  }

  return (data ?? []).map((row) => ({
    sourceId: row.source_id,
    attachmentId: row.attachment_id,
    fileName: row.file_name,
    mediaType:
      row.media_type === "text/markdown" ? "text/markdown" : "text/plain",
    ordinal: row.ordinal,
    content: row.content,
    pageNumber: row.page_number,
    startLine: row.start_line,
    endLine: row.end_line,
    rank: row.rank,
  }));
}

export async function uploadDocumentObject(
  supabase: SupabaseServerClient,
  input: {
    objectPath: string;
    mediaType: string;
    bytes: Uint8Array;
  },
): Promise<void> {
  const { error } = await supabase.storage
    .from(DOCUMENT_STORAGE_BUCKET)
    .upload(input.objectPath, input.bytes, {
      contentType: input.mediaType,
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    repositoryError("upload-document-object", error.message);
  }
}

export async function removeDocumentObject(
  supabase: SupabaseServerClient,
  objectPath: string,
): Promise<void> {
  const { data, error } = await supabase.storage
    .from(DOCUMENT_STORAGE_BUCKET)
    .remove([objectPath]);

  if (error) {
    repositoryError("delete-document-object", error.message);
  }

  if (!data || data.length !== 1) {
    repositoryError(
      "delete-document-object",
      "The private document object was not removed.",
    );
  }
}

export async function createDocumentDownloadUrl(
  supabase: SupabaseServerClient,
  objectPath: string,
  expiresInSeconds = 60,
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(DOCUMENT_STORAGE_BUCKET)
    .createSignedUrl(objectPath, expiresInSeconds, { download: true });

  if (error || !data?.signedUrl) {
    repositoryError(
      "create-document-download-url",
      error?.message ?? "The authorized download URL could not be created.",
    );
  }

  return data.signedUrl;
}
