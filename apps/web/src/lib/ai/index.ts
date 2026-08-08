import "server-only";

import { getAiRuntimeConfig } from "./config";
import {
  ControlledAiProvider,
  type AiProviderControlContext,
} from "./controlled-provider";
import { FixtureAiProvider } from "./fixture-provider";
import { OpenAiResponsesProvider } from "./openai-provider";
import type { AiProvider } from "./provider";

export function createAiProvider(
  controls?: AiProviderControlContext,
): AiProvider {
  const config = getAiRuntimeConfig();
  const provider =
    config.provider === "fixture"
      ? new FixtureAiProvider()
      : new OpenAiResponsesProvider(config);

  return controls
    ? new ControlledAiProvider(provider, config.maxOutputTokens, controls)
    : provider;
}

export * from "./config";
export * from "./provider";
