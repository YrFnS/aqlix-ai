import "server-only";

import type {
  Draft,
  DraftDetail,
  DraftGeneration,
  DraftGenerationAction,
  DraftKind,
  DraftProvenance,
  DraftVersion,
  ProviderFailureCode,
  SaveDraftInput,
  Tables,
} from "@iraqi-ai/types";
import {
  contentDirectionSchema,
  draftGenerationActionSchema,
  draftGenerationStatusSchema,
  draftKindSchema,
  draftStatusSchema,
  draftVersionSourceSchema,
} from "@iraqi-ai/types";
import type { SupabaseServerClient } from "@iraqi-ai/supabase-client/server";

type DraftRow = Tables<"drafts">;
type DraftVersionRow = Tables<"draft_versions">;
type DraftProvenanceRow = Tables<"draft_provenance">;
type DraftGenerationRow = Tables<"draft_generations">;

export class DraftRepositoryError extends Error {
  constructor(
    public readonly operation: string,
    message: string,
    public readonly databaseCode?: string,
  ) {
    super(message);
    this.name = "DraftRepositoryError";
  }
}

function repositoryError(
  operation: string,
  message: string,
  databaseCode?: string,
): never {
  throw new DraftRepositoryError(operation, message, databaseCode);
}

function parseDirection(value: string): "auto" | "rtl" | "ltr" {
  const parsed = contentDirectionSchema.safeParse(value);
  return parsed.success ? parsed.data : "auto";
}

function parseDraftKind(value: string): DraftKind {
  const parsed = draftKindSchema.safeParse(value);
  return parsed.success ? parsed.data : "freeform";
}

export function mapDraftRow(row: DraftRow): Draft {
  const status = draftStatusSchema.safeParse(row.status);

  return {
    id: row.id,
    workspaceId: row.workspace_id,
    conversationId: row.conversation_id,
    originMessageId: row.origin_message_id,
    createdBy: row.created_by,
    title: row.title,
    content: row.content,
    direction: parseDirection(row.direction),
    kind: parseDraftKind(row.kind),
    status: status.success ? status.data : "active",
    currentVersion: row.current_version,
    versionCount: row.version_count,
    provenanceCount: row.provenance_count,
    lastSavedAt: row.last_saved_at,
    archivedAt: row.archived_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapDraftVersionRow(row: DraftVersionRow): DraftVersion {
  const source = draftVersionSourceSchema.safeParse(row.source_kind);

  return {
    id: row.id,
    workspaceId: row.workspace_id,
    draftId: row.draft_id,
    versionNumber: row.version_number,
    createdBy: row.created_by,
    sourceKind: source.success ? source.data : "manual",
    title: row.title,
    content: row.content,
    direction: parseDirection(row.direction),
    kind: parseDraftKind(row.kind),
    generationId: row.generation_id,
    restoredFromVersion: row.restored_from_version,
    createdAt: row.created_at,
  };
}

export function mapDraftProvenanceRow(
  row: DraftProvenanceRow,
): DraftProvenance {
  return {
    id: row.id,
    workspaceId: row.workspace_id,
    draftId: row.draft_id,
    conversationId: row.conversation_id,
    originMessageId: row.origin_message_id,
    sourceId: row.source_id,
    attachmentId: row.attachment_id,
    citationOrder: row.citation_order,
    label: row.label,
    fileNameSnapshot: row.file_name_snapshot,
    mediaTypeSnapshot: row.media_type_snapshot,
    sourceOrdinalSnapshot: row.source_ordinal_snapshot,
    pageNumberSnapshot: row.page_number_snapshot,
    startLineSnapshot: row.start_line_snapshot,
    endLineSnapshot: row.end_line_snapshot,
    createdAt: row.created_at,
  };
}

export function mapDraftGenerationRow(
  row: DraftGenerationRow,
): DraftGeneration {
  const action = draftGenerationActionSchema.safeParse(row.action);
  const status = draftGenerationStatusSchema.safeParse(row.status);

  return {
    id: row.id,
    workspaceId: row.workspace_id,
    draftId: row.draft_id,
    createdBy: row.created_by,
    baseVersion: row.base_version,
    action: action.success ? action.data : "custom",
    instruction: row.instruction,
    provider: row.provider,
    requestedModel: row.requested_model,
    returnedModel: row.returned_model,
    providerResponseId: row.provider_response_id,
    status: status.success ? status.data : "failed",
    proposedContent: row.proposed_content,
    inputTokens: row.input_tokens,
    outputTokens: row.output_tokens,
    reasoningTokens: row.reasoning_tokens,
    totalTokens: row.total_tokens,
    firstTokenLatencyMs: row.first_token_latency_ms,
    latencyMs: row.latency_ms,
    failureCode: row.failure_code,
    failureMessage: row.failure_message,
    startedAt: row.started_at,
    completedAt: row.completed_at,
    appliedAt: row.applied_at,
    discardedAt: row.discarded_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listDrafts(
  supabase: SupabaseServerClient,
  workspaceId: string,
  status: "active" | "archived" = "active",
): Promise<Draft[]> {
  const { data, error } = await supabase
    .from("drafts")
    .select("*")
    .eq("workspace_id", workspaceId)
    .eq("status", status)
    .order("updated_at", { ascending: false });

  if (error) repositoryError("list-drafts", error.message, error.code);
  return (data ?? []).map(mapDraftRow);
}

export async function getDraft(
  supabase: SupabaseServerClient,
  workspaceId: string,
  draftId: string,
): Promise<Draft | null> {
  const { data, error } = await supabase
    .from("drafts")
    .select("*")
    .eq("workspace_id", workspaceId)
    .eq("id", draftId)
    .maybeSingle();

  if (error) repositoryError("get-draft", error.message, error.code);
  return data ? mapDraftRow(data) : null;
}

export async function getDraftDetail(
  supabase: SupabaseServerClient,
  workspaceId: string,
  draftId: string,
): Promise<DraftDetail | null> {
  const draft = await getDraft(supabase, workspaceId, draftId);
  if (!draft) return null;

  const [versionsResult, provenanceResult, generationsResult] =
    await Promise.all([
      supabase
        .from("draft_versions")
        .select("*")
        .eq("workspace_id", workspaceId)
        .eq("draft_id", draftId)
        .order("version_number", { ascending: false }),
      supabase
        .from("draft_provenance")
        .select("*")
        .eq("workspace_id", workspaceId)
        .eq("draft_id", draftId)
        .order("citation_order", { ascending: true }),
      supabase
        .from("draft_generations")
        .select("*")
        .eq("workspace_id", workspaceId)
        .eq("draft_id", draftId)
        .order("created_at", { ascending: false })
        .limit(20),
    ]);

  if (versionsResult.error) {
    repositoryError(
      "list-draft-versions",
      versionsResult.error.message,
      versionsResult.error.code,
    );
  }
  if (provenanceResult.error) {
    repositoryError(
      "list-draft-provenance",
      provenanceResult.error.message,
      provenanceResult.error.code,
    );
  }
  if (generationsResult.error) {
    repositoryError(
      "list-draft-generations",
      generationsResult.error.message,
      generationsResult.error.code,
    );
  }

  return {
    draft,
    versions: (versionsResult.data ?? []).map(mapDraftVersionRow),
    provenance: (provenanceResult.data ?? []).map(mapDraftProvenanceRow),
    generations: (generationsResult.data ?? []).map(mapDraftGenerationRow),
  };
}

export async function getDraftVersion(
  supabase: SupabaseServerClient,
  workspaceId: string,
  draftId: string,
  versionNumber: number,
): Promise<DraftVersion | null> {
  const { data, error } = await supabase
    .from("draft_versions")
    .select("*")
    .eq("workspace_id", workspaceId)
    .eq("draft_id", draftId)
    .eq("version_number", versionNumber)
    .maybeSingle();

  if (error) repositoryError("get-draft-version", error.message, error.code);
  return data ? mapDraftVersionRow(data) : null;
}

export async function createDraftFromMessage(
  supabase: SupabaseServerClient,
  input: {
    workspaceId: string;
    conversationId: string;
    messageId: string;
    kind: Exclude<DraftKind, "freeform">;
    title: string;
    content: string;
    direction: "auto" | "rtl" | "ltr";
  },
): Promise<{ draftId: string; currentVersion: number; provenanceCount: number }> {
  const { data, error } = await supabase.rpc("create_draft_from_message", {
    target_workspace_id: input.workspaceId,
    target_conversation_id: input.conversationId,
    target_message_id: input.messageId,
    requested_kind: input.kind,
    requested_title: input.title,
    requested_content: input.content,
    requested_direction: input.direction,
  });

  if (error) {
    repositoryError("create-draft-from-message", error.message, error.code);
  }

  const row = data?.[0];
  if (!row) repositoryError("create-draft-from-message", "No draft was created");

  return {
    draftId: row.draft_id,
    currentVersion: row.current_version,
    provenanceCount: row.provenance_count,
  };
}

export async function saveDraft(
  supabase: SupabaseServerClient,
  input: SaveDraftInput,
): Promise<{ versionNumber: number; created: boolean }> {
  const { data, error } = await supabase.rpc("save_draft_version", {
    target_workspace_id: input.workspaceId,
    target_draft_id: input.draftId,
    expected_version: input.expectedVersion,
    requested_title: input.title,
    requested_content: input.content,
    requested_direction: input.direction,
    requested_kind: input.kind,
    requested_source_kind: "manual",
    requested_restored_from_version: null,
  });

  if (error) repositoryError("save-draft", error.message, error.code);
  const row = data?.[0];
  if (!row) repositoryError("save-draft", "No draft version was returned");

  return { versionNumber: row.version_number, created: row.created };
}

export async function restoreDraftVersion(
  supabase: SupabaseServerClient,
  input: {
    workspaceId: string;
    draftId: string;
    expectedVersion: number;
    restoreVersion: number;
  },
): Promise<{ versionNumber: number; created: boolean }> {
  const version = await getDraftVersion(
    supabase,
    input.workspaceId,
    input.draftId,
    input.restoreVersion,
  );
  if (!version) repositoryError("restore-draft-version", "Version was not found");

  const { data, error } = await supabase.rpc("save_draft_version", {
    target_workspace_id: input.workspaceId,
    target_draft_id: input.draftId,
    expected_version: input.expectedVersion,
    requested_title: version.title,
    requested_content: version.content,
    requested_direction: version.direction,
    requested_kind: version.kind,
    requested_source_kind: "restored",
    requested_restored_from_version: input.restoreVersion,
  });

  if (error) repositoryError("restore-draft-version", error.message, error.code);
  const row = data?.[0];
  if (!row) repositoryError("restore-draft-version", "No version was restored");

  return { versionNumber: row.version_number, created: row.created };
}

export async function setDraftArchived(
  supabase: SupabaseServerClient,
  workspaceId: string,
  draftId: string,
  archived: boolean,
): Promise<boolean> {
  const { data, error } = await supabase.rpc("set_draft_archived", {
    target_workspace_id: workspaceId,
    target_draft_id: draftId,
    should_archive: archived,
  });

  if (error) repositoryError("set-draft-archived", error.message, error.code);
  return data === true;
}

export async function deleteDraft(
  supabase: SupabaseServerClient,
  workspaceId: string,
  draftId: string,
): Promise<boolean> {
  const { data, error } = await supabase.rpc("delete_draft_record", {
    target_workspace_id: workspaceId,
    target_draft_id: draftId,
  });

  if (error) repositoryError("delete-draft", error.message, error.code);
  return data === true;
}

export interface BegunDraftGeneration {
  generationId: string;
  baseVersion: number;
  baseTitle: string;
  baseContent: string;
  baseDirection: "auto" | "rtl" | "ltr";
  draftKind: DraftKind;
}

export async function beginDraftGeneration(
  supabase: SupabaseServerClient,
  input: {
    workspaceId: string;
    draftId: string;
    action: DraftGenerationAction;
    instruction: string;
    provider: string;
    requestedModel: string;
  },
): Promise<BegunDraftGeneration> {
  const { data, error } = await supabase.rpc("begin_draft_generation", {
    target_workspace_id: input.workspaceId,
    target_draft_id: input.draftId,
    requested_action: input.action,
    requested_instruction: input.instruction,
    requested_provider: input.provider,
    requested_model: input.requestedModel,
  });

  if (error) repositoryError("begin-draft-generation", error.message, error.code);
  const row = data?.[0];
  if (!row) repositoryError("begin-draft-generation", "No proposal was created");

  return {
    generationId: row.generation_id,
    baseVersion: row.base_version,
    baseTitle: row.base_title,
    baseContent: row.base_content,
    baseDirection: parseDirection(row.base_direction),
    draftKind: parseDraftKind(row.draft_kind),
  };
}

export async function getDraftGeneration(
  supabase: SupabaseServerClient,
  workspaceId: string,
  draftId: string,
  generationId: string,
): Promise<DraftGeneration | null> {
  const { data, error } = await supabase
    .from("draft_generations")
    .select("*")
    .eq("workspace_id", workspaceId)
    .eq("draft_id", draftId)
    .eq("id", generationId)
    .maybeSingle();

  if (error) repositoryError("get-draft-generation", error.message, error.code);
  return data ? mapDraftGenerationRow(data) : null;
}

export async function checkpointDraftGeneration(
  supabase: SupabaseServerClient,
  input: {
    workspaceId: string;
    draftId: string;
    generationId: string;
    content: string;
    firstTokenLatencyMs: number | null;
  },
): Promise<void> {
  const { error } = await supabase.rpc("checkpoint_draft_generation", {
    target_workspace_id: input.workspaceId,
    target_draft_id: input.draftId,
    target_generation_id: input.generationId,
    partial_content: input.content,
    first_token_ms: input.firstTokenLatencyMs,
  });

  if (error) repositoryError("checkpoint-draft-generation", error.message, error.code);
}

export async function finishDraftGeneration(
  supabase: SupabaseServerClient,
  input: {
    workspaceId: string;
    draftId: string;
    generationId: string;
    status: "complete" | "failed" | "cancelled";
    content: string;
    returnedModel: string | null;
    providerResponseId: string | null;
    inputTokens: number | null;
    outputTokens: number | null;
    reasoningTokens: number | null;
    totalTokens: number | null;
    firstTokenLatencyMs: number | null;
    latencyMs: number;
    failureCode: ProviderFailureCode | null;
    failureMessage: string | null;
  },
): Promise<void> {
  const { error } = await supabase.rpc("finish_draft_generation", {
    target_workspace_id: input.workspaceId,
    target_draft_id: input.draftId,
    target_generation_id: input.generationId,
    final_status: input.status,
    final_content: input.content,
    returned_provider_model: input.returnedModel,
    provider_response_identifier: input.providerResponseId,
    provider_input_tokens: input.inputTokens,
    provider_output_tokens: input.outputTokens,
    provider_reasoning_tokens: input.reasoningTokens,
    provider_total_tokens: input.totalTokens,
    first_token_ms: input.firstTokenLatencyMs,
    total_latency_ms: input.latencyMs,
    provider_failure_code: input.failureCode,
    provider_failure_message: input.failureMessage,
  });

  if (error) repositoryError("finish-draft-generation", error.message, error.code);
}

export async function applyDraftGeneration(
  supabase: SupabaseServerClient,
  workspaceId: string,
  draftId: string,
  generationId: string,
): Promise<number> {
  const { data, error } = await supabase.rpc("apply_draft_generation", {
    target_workspace_id: workspaceId,
    target_draft_id: draftId,
    target_generation_id: generationId,
  });

  if (error) repositoryError("apply-draft-generation", error.message, error.code);
  return data;
}

export async function discardDraftGeneration(
  supabase: SupabaseServerClient,
  workspaceId: string,
  draftId: string,
  generationId: string,
): Promise<boolean> {
  const { data, error } = await supabase.rpc("discard_draft_generation", {
    target_workspace_id: workspaceId,
    target_draft_id: draftId,
    target_generation_id: generationId,
  });

  if (error) repositoryError("discard-draft-generation", error.message, error.code);
  return data === true;
}
