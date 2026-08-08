import type {
  DraftGeneration,
  DraftProposalStreamEvent,
  ProviderFailureCode,
} from "@iraqi-ai/types";
import {
  continueDraftInputSchema,
  DRAFT_MAX_CONTENT_LENGTH,
} from "@iraqi-ai/types";
import {
  AiProviderError,
  createAiProvider,
  emptyProviderUsage,
  getRequestedProviderIdentity,
  isAbortError,
} from "@/lib/ai";
import { requireApiUser } from "@/lib/api/auth";
import { jsonFailure, zodFieldErrors } from "@/lib/api/responses";
import { buildDraftContinuationPrompt } from "@/lib/drafts/continuation";
import type { BegunDraftGeneration } from "@/lib/drafts/repository";
import {
  beginDraftGeneration,
  checkpointDraftGeneration,
  finishDraftGeneration,
  getDraft,
  getDraftGeneration,
  DraftRepositoryError,
} from "@/lib/drafts/repository";
import { getWorkspaceAccess } from "@/lib/workspaces/repository";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ workspaceId: string; draftId: string }>;
};

type StreamFailure = {
  code: ProviderFailureCode;
  message: string;
  retryable: boolean;
};

const encoder = new TextEncoder();

function encodeEvent(event: DraftProposalStreamEvent): Uint8Array {
  return encoder.encode(
    `event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`,
  );
}

function failureDetails(error: unknown): StreamFailure {
  if (error instanceof AiProviderError) {
    return {
      code: error.code,
      message: error.message,
      retryable: error.retryable,
    };
  }

  if (error instanceof DraftRepositoryError) {
    return {
      code: "PERSISTENCE_ERROR",
      message: "The draft proposal state could not be persisted.",
      retryable: true,
    };
  }

  return {
    code: "UNKNOWN_PROVIDER_ERROR",
    message: "Draft continuation failed unexpectedly.",
    retryable: true,
  };
}

function fallbackGeneration(
  source: DraftGeneration,
  input: {
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
): DraftGeneration {
  const now = new Date().toISOString();

  return {
    ...source,
    status: input.status,
    proposedContent: input.content,
    returnedModel: input.returnedModel,
    providerResponseId: input.providerResponseId,
    inputTokens: input.inputTokens,
    outputTokens: input.outputTokens,
    reasoningTokens: input.reasoningTokens,
    totalTokens: input.totalTokens,
    firstTokenLatencyMs: input.firstTokenLatencyMs,
    latencyMs: input.latencyMs,
    failureCode: input.failureCode,
    failureMessage: input.failureMessage,
    completedAt: now,
    updatedAt: now,
  };
}

export async function POST(request: Request, context: RouteContext) {
  const auth = await requireApiUser(request);
  if (!auth.ok) return auth.response;

  const params = await context.params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonFailure("VALIDATION_ERROR", "Request body must be valid JSON.", {
      status: 422,
      requestId: auth.context.requestId,
    });
  }

  const record =
    typeof body === "object" && body !== null
      ? (body as Record<string, unknown>)
      : {};
  const parsed = continueDraftInputSchema.safeParse({
    workspaceId: params.workspaceId,
    draftId: params.draftId,
    action: record.action,
    instruction: record.instruction,
  });

  if (!parsed.success) {
    return jsonFailure("VALIDATION_ERROR", "Draft continuation is invalid.", {
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
    if (access.archivedAt) {
      return jsonFailure(
        "CONFLICT",
        "Archived workspaces are read-only. Restore the workspace before continuing a draft.",
        { status: 409, requestId: auth.context.requestId },
      );
    }
    if (access.role === "viewer") {
      return jsonFailure(
        "FORBIDDEN",
        "Viewer membership does not permit draft continuation.",
        { status: 403, requestId: auth.context.requestId },
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
    if (draft.status !== "active") {
      return jsonFailure(
        "CONFLICT",
        "Archived drafts are read-only. Restore the draft before continuing it.",
        { status: 409, requestId: auth.context.requestId },
      );
    }
  } catch (error) {
    console.error("Draft continuation authorization failed", {
      requestId: auth.context.requestId,
      error,
    });
    return jsonFailure(
      "PERSISTENCE_ERROR",
      "Draft access could not be verified.",
      { status: 503, requestId: auth.context.requestId },
    );
  }

  const providerIdentity = getRequestedProviderIdentity();
  let begun: BegunDraftGeneration;

  try {
    begun = await beginDraftGeneration(auth.context.supabase, {
      workspaceId: parsed.data.workspaceId,
      draftId: parsed.data.draftId,
      action: parsed.data.action,
      instruction: parsed.data.instruction,
      provider: providerIdentity.provider,
      requestedModel: providerIdentity.requestedModel,
    });
  } catch (error) {
    if (error instanceof DraftRepositoryError && error.databaseCode === "23505") {
      return jsonFailure(
        "CONFLICT",
        "Another draft proposal is already active. Stop or finish it first.",
        { status: 409, requestId: auth.context.requestId },
      );
    }

    console.error("Draft proposal creation failed", {
      requestId: auth.context.requestId,
      error,
    });
    return jsonFailure(
      "PERSISTENCE_ERROR",
      "The draft proposal could not be created.",
      { status: 503, requestId: auth.context.requestId },
    );
  }

  let initialGeneration: DraftGeneration | null;
  try {
    initialGeneration = await getDraftGeneration(
      auth.context.supabase,
      parsed.data.workspaceId,
      parsed.data.draftId,
      begun.generationId,
    );
  } catch (error) {
    console.error("Draft proposal initialization failed", {
      requestId: auth.context.requestId,
      error,
    });
    initialGeneration = null;
  }

  if (!initialGeneration) {
    try {
      await finishDraftGeneration(auth.context.supabase, {
        workspaceId: parsed.data.workspaceId,
        draftId: parsed.data.draftId,
        generationId: begun.generationId,
        status: "failed",
        content: "",
        returnedModel: null,
        providerResponseId: null,
        inputTokens: null,
        outputTokens: null,
        reasoningTokens: null,
        totalTokens: null,
        firstTokenLatencyMs: null,
        latencyMs: 0,
        failureCode: "PERSISTENCE_ERROR",
        failureMessage: "The durable proposal record could not be loaded.",
      });
    } catch (error) {
      console.error("Missing draft proposal finalization failed", {
        requestId: auth.context.requestId,
        error,
      });
    }

    return jsonFailure(
      "PERSISTENCE_ERROR",
      "The draft proposal record could not be initialized.",
      { status: 503, requestId: auth.context.requestId },
    );
  }

  const prompt = buildDraftContinuationPrompt({
    action: parsed.data.action,
    instruction: parsed.data.instruction,
    title: begun.baseTitle,
    content: begun.baseContent,
    direction: begun.baseDirection,
    kind: begun.draftKind,
  });
  const generationAbort = new AbortController();
  const abortFromRequest = () => generationAbort.abort(request.signal.reason);
  if (request.signal.aborted) {
    abortFromRequest();
  } else {
    request.signal.addEventListener("abort", abortFromRequest, { once: true });
  }

  let streamClosed = false;
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const send = (event: DraftProposalStreamEvent): boolean => {
        if (streamClosed) return false;
        try {
          controller.enqueue(encodeEvent(event));
          return true;
        } catch {
          streamClosed = true;
          generationAbort.abort();
          return false;
        }
      };

      const close = () => {
        if (streamClosed) return;
        streamClosed = true;
        request.signal.removeEventListener("abort", abortFromRequest);
        try {
          controller.close();
        } catch {
          // The browser may already have cancelled the stream.
        }
      };

      const run = async () => {
        const startedAt = performance.now();
        let firstTokenLatencyMs: number | null = null;
        let content = "";
        let lastCheckpointAt = startedAt;
        let lastCheckpointLength = 0;
        let returnedModel: string | null = null;
        let providerResponseId: string | null = null;
        let usage = emptyProviderUsage;

        send({ type: "ready", generation: initialGeneration });

        const heartbeat = setInterval(() => {
          send({ type: "heartbeat", at: new Date().toISOString() });
        }, 15000);

        const reloadOrFallback = async (input: {
          status: "complete" | "failed" | "cancelled";
          failureCode: ProviderFailureCode | null;
          failureMessage: string | null;
        }): Promise<DraftGeneration> => {
          try {
            const persisted = await getDraftGeneration(
              auth.context.supabase,
              parsed.data.workspaceId,
              parsed.data.draftId,
              begun.generationId,
            );
            if (persisted) return persisted;
          } catch (error) {
            console.error("Final draft proposal reload failed", {
              requestId: auth.context.requestId,
              error,
            });
          }

          return fallbackGeneration(initialGeneration, {
            status: input.status,
            content,
            returnedModel,
            providerResponseId,
            inputTokens: usage.inputTokens,
            outputTokens: usage.outputTokens,
            reasoningTokens: usage.reasoningTokens,
            totalTokens: usage.totalTokens,
            firstTokenLatencyMs,
            latencyMs: Math.max(0, Math.round(performance.now() - startedAt)),
            failureCode: input.failureCode,
            failureMessage: input.failureMessage,
          });
        };

        const persistFinal = async (input: {
          status: "complete" | "failed" | "cancelled";
          failureCode: ProviderFailureCode | null;
          failureMessage: string | null;
        }): Promise<DraftGeneration> => {
          await finishDraftGeneration(auth.context.supabase, {
            workspaceId: parsed.data.workspaceId,
            draftId: parsed.data.draftId,
            generationId: begun.generationId,
            status: input.status,
            content,
            returnedModel,
            providerResponseId,
            inputTokens: usage.inputTokens,
            outputTokens: usage.outputTokens,
            reasoningTokens: usage.reasoningTokens,
            totalTokens: usage.totalTokens,
            firstTokenLatencyMs,
            latencyMs: Math.max(0, Math.round(performance.now() - startedAt)),
            failureCode: input.failureCode,
            failureMessage: input.failureMessage,
          });

          return reloadOrFallback(input);
        };

        try {
          const provider = createAiProvider();

          for await (const event of provider.stream({
            messages: prompt.messages,
            instructions: prompt.instructions,
            signal: generationAbort.signal,
          })) {
            if (event.type === "delta") {
              if (content.length + event.delta.length > DRAFT_MAX_CONTENT_LENGTH) {
                throw new AiProviderError(
                  "PROVIDER_RESPONSE_INVALID",
                  "The proposed draft exceeded the supported content length.",
                  false,
                );
              }

              if (firstTokenLatencyMs === null) {
                firstTokenLatencyMs = Math.max(
                  0,
                  Math.round(performance.now() - startedAt),
                );
              }

              content += event.delta;
              send({
                type: "delta",
                generationId: begun.generationId,
                delta: event.delta,
              });

              const now = performance.now();
              if (
                lastCheckpointLength === 0 ||
                content.length - lastCheckpointLength >= 512 ||
                now - lastCheckpointAt >= 750
              ) {
                await checkpointDraftGeneration(auth.context.supabase, {
                  workspaceId: parsed.data.workspaceId,
                  draftId: parsed.data.draftId,
                  generationId: begun.generationId,
                  content,
                  firstTokenLatencyMs,
                });
                lastCheckpointAt = now;
                lastCheckpointLength = content.length;
              }
              continue;
            }

            returnedModel = event.returnedModel;
            providerResponseId = event.providerResponseId;
            usage = event.usage;
          }

          const completed = await persistFinal({
            status: "complete",
            failureCode: null,
            failureMessage: null,
          });
          send({ type: "complete", generation: completed });
        } catch (error) {
          if (generationAbort.signal.aborted || isAbortError(error)) {
            try {
              const cancelled = await persistFinal({
                status: "cancelled",
                failureCode: "STREAM_CANCELLED",
                failureMessage:
                  "Draft continuation was cancelled by the user.",
              });
              send({ type: "cancelled", generation: cancelled });
            } catch (persistenceError) {
              console.error("Cancelled draft proposal could not be finalized", {
                requestId: auth.context.requestId,
                persistenceError,
              });
            }
          } else {
            const failure = failureDetails(error);
            try {
              const failed = await persistFinal({
                status: "failed",
                failureCode: failure.code,
                failureMessage: failure.message,
              });
              send({
                type: "failed",
                generation: failed,
                code: failure.code,
                retryable: failure.retryable,
              });
            } catch (persistenceError) {
              console.error("Failed draft proposal could not be finalized", {
                requestId: auth.context.requestId,
                originalError: error,
                persistenceError,
              });
            }
          }
        } finally {
          clearInterval(heartbeat);
          close();
        }
      };

      void run();
    },
    cancel() {
      streamClosed = true;
      request.signal.removeEventListener("abort", abortFromRequest);
      generationAbort.abort(new DOMException("Cancelled", "AbortError"));
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-cache, no-transform",
      connection: "keep-alive",
      "x-accel-buffering": "no",
      "x-request-id": auth.context.requestId,
    },
  });
}
