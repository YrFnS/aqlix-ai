import {
  DOCUMENT_MAX_BYTES,
  type DocumentFailureCode,
  type DocumentMediaType,
  type ExtractedPassageInput,
} from "@iraqi-ai/types";

export const DOCUMENT_PROCESSOR_NAME = "tuppra-text";
export const DOCUMENT_PROCESSOR_VERSION = "1.0.0";

const MAX_LINE_CHARACTERS = 20_000;
const TARGET_PASSAGE_CHARACTERS = 1_200;
const MAX_PASSAGE_CHARACTERS = 1_600;
const MIN_BREAK_DISTANCE = 500;

const disallowedControlPattern =
  /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/u;

export class DocumentProcessingError extends Error {
  constructor(
    public readonly code: DocumentFailureCode,
    message: string,
  ) {
    super(message);
    this.name = "DocumentProcessingError";
  }
}

export interface PreparedDocument {
  fileName: string;
  mediaType: DocumentMediaType;
  byteSize: number;
  contentSha256: string;
  normalizedText: string;
  passages: ExtractedPassageInput[];
}

function extensionFor(fileName: string): string {
  const index = fileName.lastIndexOf(".");
  return index < 0 ? "" : fileName.slice(index + 1).toLowerCase();
}

export function sanitizeDocumentFileName(value: string): string {
  const baseName = value.split(/[\\/]/u).at(-1)?.trim() ?? "";

  if (!baseName || baseName.length > 255 || disallowedControlPattern.test(baseName)) {
    throw new DocumentProcessingError(
      "UNSUPPORTED_FILE_TYPE",
      "The document filename is invalid.",
    );
  }

  return baseName;
}

export function resolveDocumentMediaType(
  fileName: string,
  declaredMediaType: string,
): DocumentMediaType {
  const extension = extensionFor(fileName);
  const declared = declaredMediaType.trim().toLowerCase();

  if (extension === "txt") {
    if (declared && declared !== "text/plain") {
      throw new DocumentProcessingError(
        "MEDIA_TYPE_MISMATCH",
        "The file extension and declared media type do not match.",
      );
    }
    return "text/plain";
  }

  if (extension === "md" || extension === "markdown") {
    if (
      declared &&
      declared !== "text/markdown" &&
      declared !== "text/x-markdown" &&
      declared !== "text/plain" &&
      declared !== "application/octet-stream"
    ) {
      throw new DocumentProcessingError(
        "MEDIA_TYPE_MISMATCH",
        "The file extension and declared media type do not match.",
      );
    }
    return "text/markdown";
  }

  throw new DocumentProcessingError(
    "UNSUPPORTED_FILE_TYPE",
    "Only UTF-8 text and Markdown documents are supported in this phase.",
  );
}

export function validateDocumentByteSize(byteSize: number): void {
  if (byteSize < 1) {
    throw new DocumentProcessingError("FILE_EMPTY", "The document is empty.");
  }

  if (byteSize > DOCUMENT_MAX_BYTES) {
    throw new DocumentProcessingError(
      "FILE_TOO_LARGE",
      "The document exceeds the 2 MiB limit.",
    );
  }
}

export function decodeAndNormalizeDocument(bytes: Uint8Array): string {
  validateDocumentByteSize(bytes.byteLength);

  let decoded: string;
  try {
    decoded = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    throw new DocumentProcessingError(
      "INVALID_UTF8",
      "The document is not valid UTF-8 text.",
    );
  }

  const withoutBom = decoded.startsWith("\ufeff") ? decoded.slice(1) : decoded;
  const normalized = withoutBom.replace(/\r\n?/gu, "\n");

  if (disallowedControlPattern.test(normalized)) {
    throw new DocumentProcessingError(
      "DISALLOWED_CONTROL_CONTENT",
      "The document contains unsupported control characters.",
    );
  }

  if (!normalized.trim()) {
    throw new DocumentProcessingError(
      "FILE_EMPTY",
      "The document contains no readable text.",
    );
  }

  for (const line of normalized.split("\n")) {
    if (line.length > MAX_LINE_CHARACTERS) {
      throw new DocumentProcessingError(
        "LINE_TOO_LONG",
        "A document line exceeds the supported length.",
      );
    }
  }

  return normalized;
}

export async function sha256Hex(bytes: Uint8Array): Promise<string> {
  const ownedBuffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(ownedBuffer).set(bytes);
  const digest = await crypto.subtle.digest("SHA-256", ownedBuffer);
  return Array.from(new Uint8Array(digest), (value) =>
    value.toString(16).padStart(2, "0"),
  ).join("");
}

function isWhitespace(value: string): boolean {
  return /\s/u.test(value);
}

function skipWhitespace(text: string, offset: number): number {
  let cursor = offset;
  while (cursor < text.length && isWhitespace(text[cursor] ?? "")) cursor += 1;
  return cursor;
}

function trimWhitespaceEnd(text: string, start: number, end: number): number {
  let cursor = end;
  while (cursor > start && isWhitespace(text[cursor - 1] ?? "")) cursor -= 1;
  return cursor;
}

function findPreferredBreak(text: string, start: number, maximumEnd: number): number {
  const minimumEnd = Math.min(start + MIN_BREAK_DISTANCE, maximumEnd);
  const targetEnd = Math.min(start + TARGET_PASSAGE_CHARACTERS, maximumEnd);
  const region = text.slice(minimumEnd, maximumEnd);

  const paragraphBreak = region.lastIndexOf("\n\n");
  if (paragraphBreak >= 0) return minimumEnd + paragraphBreak + 2;

  const lineBreak = region.lastIndexOf("\n");
  if (lineBreak >= 0) return minimumEnd + lineBreak + 1;

  const targetRegion = text.slice(minimumEnd, targetEnd);
  const sentencePattern = /[.!?؟؛]\s/gu;
  let sentenceEnd = -1;
  for (const match of targetRegion.matchAll(sentencePattern)) {
    sentenceEnd = minimumEnd + (match.index ?? 0) + match[0].length;
  }
  if (sentenceEnd >= minimumEnd) return sentenceEnd;

  for (let cursor = maximumEnd - 1; cursor >= minimumEnd; cursor -= 1) {
    if (isWhitespace(text[cursor] ?? "")) return cursor + 1;
  }

  return maximumEnd;
}

function newlineOffsets(text: string): number[] {
  const offsets: number[] = [];
  for (let index = 0; index < text.length; index += 1) {
    if (text[index] === "\n") offsets.push(index);
  }
  return offsets;
}

function lineAtOffset(offsets: number[], offset: number): number {
  let low = 0;
  let high = offsets.length;

  while (low < high) {
    const middle = Math.floor((low + high) / 2);
    if ((offsets[middle] ?? Number.POSITIVE_INFINITY) < offset) {
      low = middle + 1;
    } else {
      high = middle;
    }
  }

  return low + 1;
}

export function chunkNormalizedDocument(text: string): ExtractedPassageInput[] {
  if (!text.trim()) {
    throw new DocumentProcessingError(
      "FILE_EMPTY",
      "The document contains no readable text.",
    );
  }

  const newlines = newlineOffsets(text);
  const passages: ExtractedPassageInput[] = [];
  let cursor = skipWhitespace(text, 0);

  while (cursor < text.length) {
    const maximumEnd = Math.min(cursor + MAX_PASSAGE_CHARACTERS, text.length);
    const selectedEnd =
      maximumEnd < text.length
        ? findPreferredBreak(text, cursor, maximumEnd)
        : maximumEnd;
    const contentEnd = trimWhitespaceEnd(text, cursor, selectedEnd);

    if (contentEnd <= cursor) {
      cursor = skipWhitespace(text, Math.max(selectedEnd, cursor + 1));
      continue;
    }

    passages.push({
      ordinal: passages.length,
      content: text.slice(cursor, contentEnd),
      pageNumber: null,
      startOffset: cursor,
      endOffset: contentEnd,
      startLine: lineAtOffset(newlines, cursor),
      endLine: lineAtOffset(newlines, Math.max(cursor, contentEnd - 1)),
    });

    cursor = skipWhitespace(text, Math.max(selectedEnd, contentEnd));
  }

  if (passages.length === 0) {
    throw new DocumentProcessingError(
      "EXTRACTION_FAILED",
      "No source passages could be extracted from the document.",
    );
  }

  return passages;
}

export async function prepareDocument(input: {
  fileName: string;
  declaredMediaType: string;
  bytes: Uint8Array;
}): Promise<PreparedDocument> {
  const fileName = sanitizeDocumentFileName(input.fileName);
  const mediaType = resolveDocumentMediaType(fileName, input.declaredMediaType);
  const normalizedText = decodeAndNormalizeDocument(input.bytes);
  const contentSha256 = await sha256Hex(input.bytes);
  const passages = chunkNormalizedDocument(normalizedText);

  return {
    fileName,
    mediaType,
    byteSize: input.bytes.byteLength,
    contentSha256,
    normalizedText,
    passages,
  };
}
