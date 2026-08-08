import "server-only";

import type { AiRuntimeConfig } from "./config";
import {
  ControlledAiProvider,
  type AiProviderControlContext,
} from "./controlled-provider";
import { FixtureAiProvider } from "./fixture-provider";
import { OpenAiResponsesProvider } from "./openai-provider";
import { OpenRouterChatProvider } from "./openrouter-provider";
import type { AiProvider } from "./provider";

export function createAiProvider(
  config: AiRuntimeConfig,
  controls?: AiProviderControlContext,
): AiProvider {
  const provider =
    config.provider === "fixture"
      ? new FixtureAiProvider()
      : config.provider === "openai"
        ? new OpenAiResponsesProvider(config)
        : new OpenRouterChatProvider(config);

  return controls
    ? new ControlledAiProvider(provider, config.maxOutputTokens, controls)
    : provider;
}

export * from "./config";
export * from "./provider";
