import "server-only";

import { getAiRuntimeConfig } from "./config";
import { FixtureAiProvider } from "./fixture-provider";
import { OpenAiResponsesProvider } from "./openai-provider";
import type { AiProvider } from "./provider";

export function createAiProvider(): AiProvider {
  const config = getAiRuntimeConfig();

  if (config.provider === "fixture") {
    return new FixtureAiProvider();
  }

  return new OpenAiResponsesProvider(config);
}

export * from "./config";
export * from "./provider";
