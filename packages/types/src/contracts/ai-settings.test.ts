import { describe, expect, test } from "bun:test";
import {
  openRouterApiKeySchema,
  openRouterModelCatalogQuerySchema,
  openRouterModelIdSchema,
  openRouterModelSchema,
  userAiSettingsSchema,
} from "./ai-settings";

const timestamp = "2026-08-08T00:00:00.000Z";

describe("P5 OpenRouter user settings contracts", () => {
  test("accepts opaque user-owned keys without hardcoding a prefix", () => {
    expect(openRouterApiKeySchema.parse("opaque-user-key-1234567890")).toBe(
      "opaque-user-key-1234567890",
    );
    expect(openRouterApiKeySchema.safeParse("short").success).toBe(false);
    expect(
      openRouterApiKeySchema.safeParse("key with whitespace 123456").success,
    ).toBe(false);
  });

  test("accepts dynamic OpenRouter model IDs and variants", () => {
    for (const modelId of [
      "vendor/model",
      "vendor/model:free",
      "organization/model.preview-2026",
      "router/auto",
    ]) {
      expect(openRouterModelIdSchema.parse(modelId)).toBe(modelId);
    }

    expect(openRouterModelIdSchema.safeParse(" model with spaces ").success).toBe(
      false,
    );
    expect(openRouterModelIdSchema.safeParse("/missing-author").success).toBe(
      false,
    );
  });

  test("keeps saved credentials masked and model selection optional", () => {
    expect(
      userAiSettingsSchema.parse({
        provider: "openrouter",
        connected: true,
        modelId: null,
        keyLastFour: "9Ab_",
        keyLabel: "Personal key",
        isFreeTier: true,
        connectedAt: timestamp,
        updatedAt: timestamp,
      }),
    ).toMatchObject({
      connected: true,
      modelId: null,
      keyLastFour: "9Ab_",
    });
  });

  test("bounds and defaults live model search", () => {
    expect(
      openRouterModelCatalogQuerySchema.parse({
        query: "  free llama  ",
        freeOnly: true,
      }),
    ).toEqual({
      query: "free llama",
      sort: "name",
      freeOnly: true,
      limit: 100,
    });
  });

  test("validates live model metadata without assuming one provider", () => {
    expect(
      openRouterModelSchema.parse({
        id: "vendor/current-model:free",
        canonicalSlug: "vendor/current-model",
        name: "Current Model",
        description: "A live catalog model.",
        createdAt: timestamp,
        contextLength: 131072,
        maxCompletionTokens: 8192,
        inputModalities: ["text"],
        outputModalities: ["text"],
        supportedParameters: ["max_tokens"],
        pricing: {
          prompt: "0",
          completion: "0",
          request: "0",
          image: "0",
        },
        isFree: true,
        expiresAt: null,
      }).id,
    ).toBe("vendor/current-model:free");
  });
});
