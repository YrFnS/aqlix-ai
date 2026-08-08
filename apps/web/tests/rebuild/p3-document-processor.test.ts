import { describe, expect, test } from "bun:test";
import {
  DocumentProcessingError,
  chunkNormalizedDocument,
  decodeAndNormalizeDocument,
  prepareDocument,
  resolveDocumentMediaType,
  sanitizeDocumentFileName,
  sha256Hex,
} from "../../src/lib/documents/processor";

const encode = (value: string) => new TextEncoder().encode(value);

describe("P3 deterministic text document processor", () => {
  test("normalizes safe display names and supported media types", () => {
    expect(sanitizeDocumentFileName("folder\\ملاحظات.md")).toBe("ملاحظات.md");
    expect(resolveDocumentMediaType("notes.txt", "text/plain")).toBe(
      "text/plain",
    );
    expect(resolveDocumentMediaType("notes.md", "text/plain")).toBe(
      "text/markdown",
    );
  });

  test("rejects unsupported and mismatched formats", () => {
    expect(() => resolveDocumentMediaType("report.pdf", "application/pdf")).toThrow(
      DocumentProcessingError,
    );

    try {
      resolveDocumentMediaType("notes.txt", "application/pdf");
      throw new Error("Expected media type mismatch");
    } catch (error) {
      expect(error).toBeInstanceOf(DocumentProcessingError);
      expect((error as DocumentProcessingError).code).toBe("MEDIA_TYPE_MISMATCH");
    }
  });

  test("strictly decodes UTF-8, removes BOM, and normalizes newlines", () => {
    const decoded = decodeAndNormalizeDocument(
      encode("\ufeffالعربية\r\nEnglish 2026\rhttps://example.test"),
    );

    expect(decoded).toBe("العربية\nEnglish 2026\nhttps://example.test");
  });

  test("rejects invalid UTF-8, control content, and empty text", () => {
    for (const [bytes, code] of [
      [new Uint8Array([0xff, 0xfe]), "INVALID_UTF8"],
      [encode("safe\u0000unsafe"), "DISALLOWED_CONTROL_CONTENT"],
      [encode("  \n\t  "), "FILE_EMPTY"],
    ] as const) {
      try {
        decodeAndNormalizeDocument(bytes);
        throw new Error("Expected document validation failure");
      } catch (error) {
        expect(error).toBeInstanceOf(DocumentProcessingError);
        expect((error as DocumentProcessingError).code).toBe(code);
      }
    }
  });

  test("creates deterministic contiguous passage ordinals and exact offsets", () => {
    const text = [
      "المقدمة العربية مع English و2026.",
      "",
      "فقرة ثانية تحتوي رابط https://example.test ومعلومات إضافية.",
      "",
      "A long English section. ".repeat(120),
    ].join("\n");

    const first = chunkNormalizedDocument(text);
    const second = chunkNormalizedDocument(text);

    expect(first).toEqual(second);
    expect(first.length).toBeGreaterThan(1);

    for (const [index, passage] of first.entries()) {
      expect(passage.ordinal).toBe(index);
      expect(passage.pageNumber).toBeNull();
      expect(passage.startOffset).toBeGreaterThanOrEqual(0);
      expect(passage.endOffset).toBeGreaterThan(passage.startOffset);
      expect(passage.startLine).toBeGreaterThan(0);
      expect(passage.endLine).toBeGreaterThanOrEqual(passage.startLine);
      expect(text.slice(passage.startOffset, passage.endOffset)).toBe(
        passage.content,
      );
      expect(passage.content.length).toBeLessThanOrEqual(1600);
    }
  });

  test("produces a stable SHA-256 digest", async () => {
    expect(await sha256Hex(encode("abc"))).toBe(
      "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
    );
  });

  test("prepares mixed Arabic-English Markdown without model processing", async () => {
    const prepared = await prepareDocument({
      fileName: "قرار.md",
      declaredMediaType: "text/markdown",
      bytes: encode("# قرار\n\nالعربية وEnglish مع الرقم 2026."),
    });

    expect(prepared.mediaType).toBe("text/markdown");
    expect(prepared.normalizedText).toContain("English");
    expect(prepared.passages).toHaveLength(1);
    expect(prepared.contentSha256).toHaveLength(64);
  });
});
