import { describe, expect, test } from "bun:test";
import {
  DOCUMENT_MAX_BYTES,
  attachmentProcessingRunSchema,
  beginAttachmentProcessingInputSchema,
  documentFailureCodeSchema,
  extractedPassageInputSchema,
  searchWorkspaceSourcesInputSchema,
} from "./document-source";

const workspaceId = "3a6d91fa-5aaf-4eb6-8fc5-b47d137fe75f";
const attachmentId = "4b7e02ab-6bb0-4fc7-9ad6-c58e2480f86a";
const userId = "5c8f13bc-7cc1-4ad8-8be7-d69f3591097b";
const runId = "6d9024cd-8dd2-4be9-9cf8-e7a046a21a8c";
const timestamp = "2026-08-08T00:00:00.000Z";

describe("P3 document source contracts", () => {
  test("accepts a bounded normalized upload command", () => {
    expect(
      beginAttachmentProcessingInputSchema.parse({
        workspaceId,
        fileName: "  ملاحظات.md  ",
        mediaType: "text/markdown",
        byteSize: 2048,
        contentSha256: "a".repeat(64),
        processor: " kiteb-text ",
        processorVersion: " 1.0.0 ",
      }),
    ).toEqual({
      workspaceId,
      fileName: "ملاحظات.md",
      mediaType: "text/markdown",
      byteSize: 2048,
      contentSha256: "a".repeat(64),
      processor: "kiteb-text",
      processorVersion: "1.0.0",
    });
  });

  test("rejects oversized or malformed upload metadata", () => {
    expect(
      beginAttachmentProcessingInputSchema.safeParse({
        workspaceId,
        fileName: "notes.txt",
        mediaType: "text/plain",
        byteSize: DOCUMENT_MAX_BYTES + 1,
        contentSha256: "invalid",
        processor: "kiteb-text",
        processorVersion: "1.0.0",
      }).success,
    ).toBe(false);
  });

  test("requires real passage offsets and line locators", () => {
    expect(
      extractedPassageInputSchema.safeParse({
        ordinal: 0,
        content: "العربية and English",
        pageNumber: null,
        startOffset: 0,
        endOffset: 19,
        startLine: 1,
        endLine: 1,
      }).success,
    ).toBe(true);

    expect(
      extractedPassageInputSchema.safeParse({
        ordinal: 0,
        content: "invalid",
        pageNumber: null,
        startOffset: -1,
        endOffset: 0,
        startLine: 0,
        endLine: 0,
      }).success,
    ).toBe(false);
  });

  test("trims and bounds workspace search", () => {
    expect(
      searchWorkspaceSourcesInputSchema.parse({
        workspaceId,
        query: "  قرار المشروع  ",
      }),
    ).toEqual({
      workspaceId,
      query: "قرار المشروع",
      limit: 8,
    });

    expect(
      searchWorkspaceSourcesInputSchema.safeParse({
        workspaceId,
        query: "x",
        limit: 21,
      }).success,
    ).toBe(false);
  });

  test("keeps document failures machine-readable", () => {
    expect(documentFailureCodeSchema.options).toContain("INVALID_UTF8");
    expect(documentFailureCodeSchema.options).toContain("DUPLICATE_DOCUMENT");
    expect(documentFailureCodeSchema.options).toContain(
      "STORAGE_DELETE_FAILED",
    );
  });

  test("validates durable processing attempts", () => {
    expect(
      attachmentProcessingRunSchema.parse({
        id: runId,
        workspaceId,
        attachmentId,
        createdBy: userId,
        attempt: 1,
        processor: "kiteb-text",
        processorVersion: "1.0.0",
        status: "complete",
        sourceCount: 3,
        characterCount: 1800,
        failureCode: null,
        failureMessage: null,
        startedAt: timestamp,
        completedAt: timestamp,
        createdAt: timestamp,
        updatedAt: timestamp,
      }).status,
    ).toBe("complete");
  });
});
