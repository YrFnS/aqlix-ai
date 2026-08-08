import type {
  ConversationMessage,
  ConversationStreamEvent,
  ProviderFailureCode,
} from "@iraqi-ai/types";
import { streamConversationInputSchema } from "@iraqi-ai/types";
import {
  AiProviderError,
  createAiProvider,
  emptyProviderUsage,
  getFallbackProviderIdentity,
  resolveAiRuntimeConfig,
  isAbortError,
} from "@/lib/ai";
import { requireApiUser } from "@/lib/api/auth";
import { jsonFailure, zodFieldErrors } from "@/lib/api/responses";
import {
  buildGroundingInstructions,
  labelGroundingSources,
  MAX_GROUNDING_SOURCES,
  resolveGroundedCitations,
  type LabeledGroundingSource,
} from "@/lib/conversations/grounding";
import type { BegunConversationTurn } from "@/lib/conversations/repository";
import {
  beginConversationTurn,
  checkpointConversationGeneration,
  finishConversationGeneration,
  finishGroundedConversationGeneration,
  getConversation,
  getConversationMessage,
  getConversationProviderHistory,
  setGenerationGroundingContext,
  ConversationRepositoryError,
} from "@/lib/conversations/repository";
import {
  searchWorkspaceSources,
  DocumentRepositoryError,
} from "@/lib/documents/repository";
import { getWorkspaceAccess } from "@/lib/workspaces/repository";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ workspaceId: string; conversationId: string }>;
};

type StreamFailure = {
  code: ProviderFailureCode;
  message: string;
  retryable: boolean;
};

const encoder = new TextEncoder();

function encodeEvent(event: ConversationStreamEvent): Uint8Array {
  return encoder.encode(
    `event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`,
  );
}

function fallbackMessage(
  source: ConversationMessage,
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
    citationCount?: number;
  },
): ConversationMessage {
  const now = new Date().toISOString();

  return {
    ...source,
    status: input.status,
    content: input.content,
    updatedAt: now,
    generation: source.generation
      ? {
          ...source.generation,
          status: input.status,
          returnedModel: input.returnedModel,
          providerResponseId: input.providerResponseId,
          inputTokens: input.inputTokens,
          outputTokens: input.outputTokens,
          reasoningTokens: input.reasoningTokens,
          totalTokens: input.totalTokens,
          firstTokenLatencyMs: input.firstTokenLatencyMs,
          latencyMs: input.latencyMs,
          citationCount:
            input.citationCount ?? source.generation.citationCount,
          failureCode: input.failureCode,
          failureMessage: input.failureMessage,
          completedAt: now,
          updatedAt: now,
        }
      : null,
  };
}

function failureDetails(error: unknown): StreamFailure {
  if (error instanceof AiProviderError) {
    return {
      code: error.code,
      message: error.message,
      retryable: error.retryable,
    };
  }

  if (
    error instanceof ConversationRepositoryError ||
    error instanceof DocumentRepositoryError
  ) {
    return {
      code: "PERSISTENCE_ERROR",
      message: "Conversation or source state could not be persisted.",
      retryable: true,
    };
  }

  return {
    code: "UNKNOWN_PROVIDER_ERROR",
    message: "Generation failed unexpectedly.",
    retryable: true,
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

  const bodyRecord =
    typeof body === "object" && body !== null
      ? (body as Record<string, unknown>)
      : {};
  const parsed = streamConversationInputSchema.safeParse({
    workspaceId: params.workspaceId,
    conversationId: params.conversationId,
    content: bodyRecord.content,
    direction: bodyRecord.direction,
    retryMessageId: bodyRecord.retryMessageId,
    groundingMode: bodyRecord.groundingMode,
  });

  if (!parsed.success) {
    return jsonFailure("VALIDATION_ERROR", "Conversation turn is invalid.", {
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
        "Conversation was not found or is not available to this account.",
        { status: 404, requestId: auth.context.requestId },
      );
    }

    if (access.archivedAt) {
      return jsonFailure(
        "CONFLICT",
        "Archived workspaces are read-only. Restore the workspace before generating messages.",
        { status: 409, requestId: auth.context.requestId },
      );
    }

    if (access.role === "viewer") {
      return jsonFailure(
        "FORBIDDEN",
        "Viewer membership does not permit message generation.",
        { status: 403, requestId: auth.context.requestId },
      );
    }

    const conversation = await getConversation(
      auth.context.supabase,
      parsed.data.workspaceId,
      parsed.data.conversationId,
    );

    if (!conversation) {
      return jsonFailure(
        "NOT_FOUND",
        "Conversation was not found or is not available to this account.",
        { status: 404, requestId: auth.context.requestId },
      );
    }

    if (conversation.status !== "active") {
      return jsonFailure(
        "CONFLICT",
        "Archived conversations cannot generate new messages.",
        { status: 409, requestId: auth.context.requestId },
      );
    }
  } catch (error) {
    console.error("Conversation stream authorization failed", {
      requestId: auth.context.requestId,
      error,
    });
    return jsonFailure(
      "PERSISTENCE_ERROR",
      "Conversation access could not be verified.",
      { status: 503, requestId: auth.context.requestId },
    );
  }

  let aiRuntimeConfig: Awaited<
    ReturnType<typeof resolveAiRuntimeConfig>
  > | null = null;
  let providerConfigurationFailure: AiProviderError | null = null;

  try {
    aiRuntimeConfig = await resolveAiRuntimeConfig(auth.context.supabase, {
      requestOrigin: new URL(request.url).origin,
    });
  } catch (error) {
    providerConfigurationFailure =
      error instanceof AiProviderError
        ? error
        : new AiProviderError(
            "UNKNOWN_PROVIDER_ERROR",
            "The user AI connection could not be resolved.",
            true,
          );
  }

  const providerIdentity = aiRuntimeConfig
    ? {
        provider: aiRuntimeConfig.provider,
        requestedModel: aiRuntimeConfig.requestedModel,
      }
    : getFallbackProviderIdentity();
  let turn: BegunConversationTurn;

  try {
    turn = await beginConversationTurn(auth.context.supabase, {
      workspaceId: parsed.data.workspaceId,
      conversationId: parsed.data.conversationId,
      content: parsed.data.content ?? null,
      direction: parsed.data.direction,
      provider: providerIdentity.provider,
      requestedModel: providerIdentity.requestedModel,
      retryMessageId: parsed.data.retryMessageId,
    });
  } catch (error) {
    console.error("Conversation turn creation failed", {
      requestId: auth.context.requestId,
      error,
    });
    return jsonFailure(
      "PERSISTENCE_ERROR",
      "The conversation turn could not be created.",
      { status: 503, requestId: auth.context.requestId },
    );
  }

  let groundingSources: LabeledGroundingSource[] = [];
  let groundingInstructions: string | undefined;
  let initialFailure: StreamFailure | null = null;

  if (parsed.data.groundingMode === "workspace_sources") {
    try {
      const results = await searchWorkspaceSources(auth.context.supabase, {
        workspaceId: parsed.data.workspaceId,
        query: turn.promptContent.trim().slice(0, 500),
        limit: MAX_GROUNDING_SOURCES,
      });
      groundingSources = labelGroundingSources(results);

      await setGenerationGroundingContext(auth.context.supabase, {
        workspaceId: parsed.data.workspaceId,
        conversationId: parsed.data.conversationId,
        messageId: turn.assistantMessageId,
        generationId: turn.generationId,
        groundingMode: "workspace_sources",
        retrievedSourceCount: groundingSources.length,
      });

      if (groundingSources.length === 0) {
        initialFailure = {
          code: "NO_RELEVANT_SOURCES",
          message:
            "No relevant ready passage was found in this workspace. No provider answer was generated.",
          retryable: true,
        };
      } else {
        groundingInstructions = buildGroundingInstructions(groundingSources);
      }
    } catch (error) {
      console.error("Grounding preparation failed", {
        requestId: auth.context.requestId,
        error,
      });
      initialFailure = failureDetails(error);

      try {
        await setGenerationGroundingContext(auth.context.supabase, {
          workspaceId: parsed.data.workspaceId,
          conversationId: parsed.data.conversationId,
          messageId: turn.assistantMessageId,
          generationId: turn.generationId,
          groundingMode: "workspace_sources",
          retrievedSourceCount: 0,
        });
      } catch (contextError) {
        console.error("Grounding failure context could not be recorded", {
          requestId: auth.context.requestId,
          contextError,
        });
      }
    }
  }

  let userMessage: ConversationMessage | null;
  let assistantMessage: ConversationMessage | null;

  try {
    [userMessage, assistantMessage] = await Promise.all([
      turn.userMessageId
        ? getConversationMessage(
            auth.context.supabase,
            parsed.data.workspaceId,
            parsed.data.conversationId,
            turn.userMessageId,
          )
        : Promise.resolve(null),
      getConversationMessage(
        auth.context.supabase,
        parsed.data.workspaceId,
        parsed.data.conversationId,
        turn.assistantMessageId,
      ),
    ]);
  } catch (error) {
    console.error("Conversation turn initialization failed", {
      requestId: auth.context.requestId,
      error,
    });

    try {
      await finishConversationGeneration(auth.context.supabase, {
        workspaceId: parsed.data.workspaceId,
        conversationId: parsed.data.conversationId,
        messageId: turn.assistantMessageId,
        generationId: turn.generationId,
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
        failureMessage: "The durable turn could not be initialized.",
      });
    } catch (finalizationError) {
      console.error("Conversation initialization finalization failed", {
        requestId: auth.context.requestId,
        finalizationError,
      });
    }

    return jsonFailure(
      "PERSISTENCE_ERROR",
      "The assistant generation record could not be initialized.",
      { status: 503, requestId: auth.context.requestId },
    );
  }

  if (!assistantMessage || !assistantMessage.generation) {
    try {
      await finishConversationGeneration(auth.context.supabase, {
        workspaceId: parsed.data.workspaceId,
        conversationId: parsed.data.conversationId,
        messageId: turn.assistantMessageId,
        generationId: turn.generationId,
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
        failureMessage: "The durable assistant generation record is unavailable.",
      });
    } catch (error) {
      console.error("Missing generation finalization failed", {
        requestId: auth.context.requestId,
        error,
      });
    }

    return jsonFailure(
      "PERSISTENCE_ERROR",
      "The assistant generation record could not be loaded.",
      { status: 503, requestId: auth.context.requestId },
    );
  }

  const durableAssistantMessage = assistantMessage;
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
      const send = (event: ConversationStreamEvent): boolean => {
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

        send({
          type: "ready",
          conversationId: parsed.data.conversationId,
          userMessage,
          assistantMessage: durableAssistantMessage,
        });

        const heartbeat = setInterval(() => {
          send({ type: "heartbeat", at: new Date().toISOString() });
        }, 15000);

        const reloadOrFallback = async (input: {
          status: "complete" | "failed" | "cancelled";
          failureCode: ProviderFailureCode | null;
          failureMessage: string | null;
          citationCount?: number;
        }): Promise<ConversationMessage> => {
          try {
            const persisted = await getConversationMessage(
              auth.context.supabase,
              parsed.data.workspaceId,
              parsed.data.conversationId,
              turn.assistantMessageId,
            );
            if (persisted) return persisted;
          } catch (error) {
            console.error("Final conversation message reload failed", {
              requestId: auth.context.requestId,
              error,
            });
          }

          return fallbackMessage(durableAssistantMessage, {
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
            citationCount: input.citationCount,
          });
        };

        const persistFinal = async (input: {
          status: "complete" | "failed" | "cancelled";
          failureCode: ProviderFailureCode | null;
          failureMessage: string | null;
        }): Promise<ConversationMessage> => {
          const latencyMs = Math.max(0, Math.round(performance.now() - startedAt));

          await finishConversationGeneration(auth.context.supabase, {
            workspaceId: parsed.data.workspaceId,
            conversationId: parsed.data.conversationId,
            messageId: turn.assistantMessageId,
            generationId: turn.generationId,
            status: input.status,
            content,
            returnedModel,
            providerResponseId,
            inputTokens: usage.inputTokens,
            outputTokens: usage.outputTokens,
            reasoningTokens: usage.reasoningTokens,
            totalTokens: usage.totalTokens,
            firstTokenLatencyMs,
            latencyMs,
            failureCode: input.failureCode,
            failureMessage: input.failureMessage,
          });

          return reloadOrFallback(input);
        };

        const persistGroundedComplete = async (): Promise<ConversationMessage> => {
          const citations = resolveGroundedCitations(content, groundingSources);
          const latencyMs = Math.max(0, Math.round(performance.now() - startedAt));

          await finishGroundedConversationGeneration(auth.context.supabase, {
            workspaceId: parsed.data.workspaceId,
            conversationId: parsed.data.conversationId,
            messageId: turn.assistantMessageId,
            generationId: turn.generationId,
            content,
            returnedModel,
            providerResponseId,
            inputTokens: usage.inputTokens,
            outputTokens: usage.outputTokens,
            reasoningTokens: usage.reasoningTokens,
            totalTokens: usage.totalTokens,
            firstTokenLatencyMs,
            latencyMs,
            citations,
          });

          return reloadOrFallback({
            status: "complete",
            failureCode: null,
            failureMessage: null,
            citationCount: citations.length,
          });
        };

        try {
          if (initialFailure) {
            throw new AiProviderError(
              initialFailure.code,
              initialFailure.message,
              initialFailure.retryable,
            );
          }

          if (providerConfigurationFailure || !aiRuntimeConfig) {
            throw (
              providerConfigurationFailure ??
              new AiProviderError(
                "PROVIDER_UNCONFIGURED",
                "Connect OpenRouter and select a model in AI settings.",
                false,
              )
            );
          }

          const provider = createAiProvider(aiRuntimeConfig, {
            supabase: auth.context.supabase,
            workspaceId: parsed.data.workspaceId,
            operation: "conversation",
            generationId: turn.generationId,
          });
          const history = await getConversationProviderHistory(
            auth.context.supabase,
            parsed.data.workspaceId,
            parsed.data.conversationId,
          );

          for await (const event of provider.stream({
            messages: history,
            signal: generationAbort.signal,
            instructions: groundingInstructions,
          })) {
            if (event.type === "delta") {
              if (firstTokenLatencyMs === null) {
                firstTokenLatencyMs = Math.max(
                  0,
                  Math.round(performance.now() - startedAt),
                );
              }

              content += event.delta;
              send({
                type: "delta",
                messageId: turn.assistantMessageId,
                delta: event.delta,
              });

              const now = performance.now();
              if (
                lastCheckpointLength === 0 ||
                content.length - lastCheckpointLength >= 512 ||
                now - lastCheckpointAt >= 750
              ) {
                await checkpointConversationGeneration(auth.context.supabase, {
                  workspaceId: parsed.data.workspaceId,
                  conversationId: parsed.data.conversationId,
                  messageId: turn.assistantMessageId,
                  generationId: turn.generationId,
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

          const completed =
            parsed.data.groundingMode === "workspace_sources"
              ? await persistGroundedComplete()
              : await persistFinal({
                  status: "complete",
                  failureCode: null,
                  failureMessage: null,
                });
          send({ type: "complete", message: completed });
        } catch (error) {
          if (generationAbort.signal.aborted || isAbortError(error)) {
            try {
              const cancelled = await persistFinal({
                status: "cancelled",
                failureCode: "STREAM_CANCELLED",
                failureMessage: "Generation was cancelled by the user.",
              });
              send({ type: "cancelled", message: cancelled });
            } catch (persistenceError) {
              console.error("Cancelled generation could not be finalized", {
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
                message: failed,
                code: failure.code,
                retryable: failure.retryable,
              });
            } catch (persistenceError) {
              console.error("Failed generation could not be finalized", {
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
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
      "x-request-id": auth.context.requestId,
    },
  });
}
