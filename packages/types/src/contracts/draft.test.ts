import { describe, expect, test } from "bun:test";
import {
  continueDraftInputSchema,
  createDraftFromMessageInputSchema,
  draftExportFormatSchema,
  draftGenerationSchema,
  draftProposalStreamEventSchema,
  restoreDraftVersionInputSchema,
  saveDraftInputSchema,
} from "./draft";

const workspaceId = "3a6d91fa-5aaf-4eb6-8fc5-b47d137fe75f";
const conversationId = "4b7e02ab-6bb0-4fc7-9ad6-c58e2480f86a";
const messageId = "5c8f13bc-7cc1-4ad8-8be7-d69f3591097b";
const draftId = "6d9024cd-8dd2-4be9-9cf8-e7a046a21a8c";
const generationId = "7ea135de-9ee3-4cfa-ad09-f8b157b32b9d";
const userId = "8fb246ef-aff4-4dfb-be1a-09c268c43cae";
const timestamp = "2026-08-08T00:00:00.000Z";

function completeGeneration() {
  return draftGenerationSchema.parse({
    id: generationId,
    workspaceId,
    draftId,
    createdBy: userId,
    baseVersion: 2,
    action: "improve",
    instruction: "Improve clarity.",
    provider: "fixture",
    requestedModel: "fixture-bilingual-v1",
    returnedModel: "fixture-bilingual-v1",
    providerResponseId: "fixture_response",
    status: "complete",
    proposedContent: "اقتراح محفوظ / saved proposal",
    inputTokens: 10,
    outputTokens: 12,
    reasoningTokens: 0,
    totalTokens: 22,
    firstTokenLatencyMs: 50,
    latencyMs: 240,
    failureCode: null,
    failureMessage: null,
    startedAt: timestamp,
    completedAt: timestamp,
    appliedAt: null,
    discardedAt: null,
    createdAt: timestamp,
    updatedAt: timestamp,
  });
}

describe("P4 draft contracts", () => {
  test("accepts deterministic draft creation kinds but rejects freeform conversion", () => {
    expect(
      createDraftFromMessageInputSchema.parse({
        workspaceId,
        conversationId,
        messageId,
        kind: "decision_note",
      }),
    ).toEqual({ workspaceId, conversationId, messageId, kind: "decision_note" });

    expect(
      createDraftFromMessageInputSchema.safeParse({
        workspaceId,
        conversationId,
        messageId,
        kind: "freeform",
      }).success,
    ).toBe(false);
  });

  test("normalizes accepted draft titles and requires optimistic version identity", () => {
    expect(
      saveDraftInputSchema.parse({
        workspaceId,
        draftId,
        expectedVersion: 3,
        title: "  قرار المشروع  ",
        content: "العربية and English 2026",
        direction: "auto",
        kind: "memo",
      }),
    ).toEqual({
      workspaceId,
      draftId,
      expectedVersion: 3,
      title: "قرار المشروع",
      content: "العربية and English 2026",
      direction: "auto",
      kind: "memo",
    });

    expect(
      saveDraftInputSchema.safeParse({
        workspaceId,
        draftId,
        expectedVersion: 0,
        title: "invalid",
        content: "",
        direction: "auto",
        kind: "freeform",
      }).success,
    ).toBe(false);
  });

  test("validates restore and bounded continuation commands", () => {
    expect(
      restoreDraftVersionInputSchema.safeParse({
        workspaceId,
        draftId,
        expectedVersion: 4,
        restoreVersion: 1,
      }).success,
    ).toBe(true);

    expect(
      continueDraftInputSchema.parse({
        workspaceId,
        draftId,
        action: "custom",
        instruction: "  Keep [S1] and improve mixed RTL/LTR flow.  ",
      }).instruction,
    ).toBe("Keep [S1] and improve mixed RTL/LTR flow.");

    expect(
      continueDraftInputSchema.safeParse({
        workspaceId,
        draftId,
        action: "custom",
        instruction: " ",
      }).success,
    ).toBe(false);
  });

  test("limits export to implemented UTF-8 formats", () => {
    expect(draftExportFormatSchema.options).toEqual(["txt", "md", "html"]);
    expect(draftExportFormatSchema.safeParse("pdf").success).toBe(false);
    expect(draftExportFormatSchema.safeParse("docx").success).toBe(false);
  });

  test("accepts normalized terminal proposal events and rejects raw provider events", () => {
    const event = draftProposalStreamEventSchema.parse({
      type: "complete",
      generation: completeGeneration(),
    });
    expect(event.type).toBe("complete");

    expect(
      draftProposalStreamEventSchema.safeParse({
        type: "response.output_text.delta",
        delta: "raw provider event",
      }).success,
    ).toBe(false);
  });

  test("keeps failed proposal telemetry machine-readable", () => {
    const failed = draftProposalStreamEventSchema.parse({
      type: "failed",
      generation: {
        ...completeGeneration(),
        status: "failed",
        proposedContent: "partial",
        failureCode: "PROVIDER_TIMEOUT",
        failureMessage: "Timed out.",
      },
      code: "PROVIDER_TIMEOUT",
      retryable: true,
    });

    expect(failed.type).toBe("failed");
    if (failed.type === "failed") {
      expect(failed.code).toBe("PROVIDER_TIMEOUT");
      expect(failed.generation.proposedContent).toBe("partial");
    }
  });
});
