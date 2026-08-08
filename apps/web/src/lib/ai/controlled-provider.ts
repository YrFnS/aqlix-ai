import "server-only";

import type { AiGenerationOperation } from "@iraqi-ai/types";
import type { SupabaseServerClient } from "@iraqi-ai/supabase-client/server";
import {
  AiControlRepositoryError,
  estimateProviderInputTokens,
  reserveAiGenerationPermit,
} from "./controls";
import {
  AiProviderError,
  type AiProvider,
  type AiProviderStreamEvent,
  type AiProviderStreamInput,
} from "./provider";

export interface AiProviderControlContext {
  supabase: SupabaseServerClient;
  workspaceId: string;
  operation: AiGenerationOperation;
  generationId: string;
}

export class ControlledAiProvider implements AiProvider {
  readonly name: string;
  readonly requestedModel: string;

  constructor(
    private readonly delegate: AiProvider,
    private readonly maxOutputTokens: number,
    private readonly context: AiProviderControlContext,
  ) {
    this.name = delegate.name;
    this.requestedModel = delegate.requestedModel;
  }

  async *stream(
    input: AiProviderStreamInput,
  ): AsyncGenerator<AiProviderStreamEvent, void, undefined> {
    try {
      await reserveAiGenerationPermit(this.context.supabase, {
        workspaceId: this.context.workspaceId,
        operation: this.context.operation,
        generationId: this.context.generationId,
        estimatedInputTokens: estimateProviderInputTokens(
          input.messages,
          input.instructions,
        ),
        reservedOutputTokens: this.maxOutputTokens,
      });
    } catch (error) {
      if (error instanceof AiProviderError) throw error;

      if (error instanceof AiControlRepositoryError) {
        throw new AiProviderError(
          "PERSISTENCE_ERROR",
          "The workspace AI budget could not be reserved safely.",
          true,
        );
      }

      throw error;
    }

    yield* this.delegate.stream(input);
  }
}
