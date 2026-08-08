import { describe, expect, test } from "bun:test";
import {
  aiGenerationDenialCodeSchema,
  updateWorkspaceAiLimitsInputSchema,
  workspaceAiLimitsSchema,
} from "./ai-controls";

const workspaceId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";

describe("P5 AI control contracts", () => {
  test("accepts bounded owner-managed workspace limits", () => {
    expect(
      updateWorkspaceAiLimitsInputSchema.parse({
        workspaceId,
        enabled: true,
        dailyRequestLimit: 100,
        dailyInputTokenLimit: 500000,
        dailyOutputTokenLimit: 100000,
        maxConcurrentGenerations: 2,
      }),
    ).toMatchObject({ enabled: true, maxConcurrentGenerations: 2 });
  });

  test("rejects zero limits and unsafe concurrency", () => {
    expect(
      updateWorkspaceAiLimitsInputSchema.safeParse({
        workspaceId,
        enabled: true,
        dailyRequestLimit: 0,
        dailyInputTokenLimit: 999,
        dailyOutputTokenLimit: 999,
        maxConcurrentGenerations: 21,
      }).success,
    ).toBe(false);
  });

  test("keeps provider denials machine-readable", () => {
    for (const code of [
      "PROVIDER_DISABLED",
      "PROVIDER_BUDGET_EXCEEDED",
      "PROVIDER_CONCURRENCY_LIMIT",
    ] as const) {
      expect(aiGenerationDenialCodeSchema.parse(code)).toBe(code);
    }
  });

  test("validates persisted usage and reset metadata", () => {
    expect(
      workspaceAiLimitsSchema.parse({
        workspaceId,
        enabled: true,
        dailyRequestLimit: 100,
        dailyInputTokenLimit: 500000,
        dailyOutputTokenLimit: 100000,
        maxConcurrentGenerations: 2,
        requestsUsed: 3,
        inputTokensUsed: 1200,
        outputTokensUsed: 400,
        activeGenerations: 1,
        resetsAt: "2026-08-09T00:00:00.000Z",
        updatedAt: "2026-08-08T19:00:00.000Z",
      }),
    ).toMatchObject({ requestsUsed: 3, activeGenerations: 1 });
  });
});
