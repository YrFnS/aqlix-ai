import { describe, expect, test } from "bun:test";
import {
  conversationStreamEventSchema,
  createConversationInputSchema,
  providerFailureCodeSchema,
  streamConversationInputSchema,
  updateConversationInputSchema,
} from "./conversation";

const workspaceId = "3a6d91fa-5aaf-4eb6-8fc5-b47d137fe75f";
const conversationId = "4b7e02ab-6bb0-4fc7-9ad6-c58e2480f86a";
const messageId = "5c8f13bc-7cc1-4ad8-8be7-d69f3591097b";
const generationId = "6d9024cd-8dd2-4be9-9cf8-e7a046a21a8c";
const userId = "7ea135de-9ee3-4cfa-ad09-f8b157b32b9d";
const timestamp = "2026-08-08T00:00:00.000Z";

describe("P2 conversation contracts", () => {
  test("normalizes conversation titles", () => {
    expect(
      createConversationInputSchema.parse({
        workspaceId,
        title: "  قرار المشروع  ",
      }),
    ).toEqual({
      workspaceId,
      title: "قرار المشروع",
    });
  });

  test("requires one update field", () => {
    expect(
      updateConversationInputSchema.safeParse({ workspaceId, conversationId })
        .success,
    ).toBe(false);
  });

  test("accepts exactly one new-message or retry command", () => {
    expect(
      streamConversationInputSchema.parse({
        workspaceId,
        conversationId,
        content: "  مرحبا English 2026  ",
      }),
    ).toEqual({
      workspaceId,
      conversationId,
      content: "مرحبا English 2026",
      direction: "auto",
    });

    expect(
      streamConversationInputSchema.safeParse({
        workspaceId,
        conversationId,
        retryMessageId: messageId,
      }).success,
    ).toBe(true);

    expect(
      streamConversationInputSchema.safeParse({
        workspaceId,
        conversationId,
        content: "new",
        retryMessageId: messageId,
      }).success,
    ).toBe(false);

    expect(
      streamConversationInputSchema.safeParse({ workspaceId, conversationId })
        .success,
    ).toBe(false);
  });

  test("validates normalized completion events with telemetry", () => {
    const event = conversationStreamEventSchema.parse({
      type: "complete",
      message: {
        id: messageId,
        workspaceId,
        conversationId,
        createdBy: userId,
        role: "assistant",
        status: "complete",
        content: "تم / done",
        direction: "auto",
        sequence: 1,
        createdAt: timestamp,
        updatedAt: timestamp,
        generation: {
          id: generationId,
          workspaceId,
          conversationId,
          messageId,
          createdBy: userId,
          provider: "openai",
          requestedModel: "gpt-5-mini",
          returnedModel: "gpt-5-mini",
          providerResponseId: "resp_123",
          status: "complete",
          inputTokens: 10,
          outputTokens: 20,
          reasoningTokens: 0,
          totalTokens: 30,
          firstTokenLatencyMs: 180,
          latencyMs: 640,
          failureCode: null,
          failureMessage: null,
          startedAt: timestamp,
          completedAt: timestamp,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      },
    });

    expect(event.type).toBe("complete");
  });

  test("rejects unsupported stream event types", () => {
    expect(
      conversationStreamEventSchema.safeParse({
        type: "provider.raw.delta",
        delta: "unsafe",
      }).success,
    ).toBe(false);
  });

  test("keeps provider failures machine-readable", () => {
    expect(providerFailureCodeSchema.options).toContain(
      "PROVIDER_UNCONFIGURED",
    );
    expect(providerFailureCodeSchema.options).toContain("STREAM_CANCELLED");
    expect(providerFailureCodeSchema.options).toContain("PERSISTENCE_ERROR");
  });
});
