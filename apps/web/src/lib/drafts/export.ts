import type { Draft, DraftExportFormat } from "@iraqi-ai/types";

export interface DraftExportPayload {
  body: string;
  contentType: string;
  extension: DraftExportFormat;
  downloadName: string;
}

function normalizeFileStem(value: string): string {
  const normalized = value
    .normalize("NFKC")
    .replace(/[\u0000-\u001f\u007f]/gu, "")
    .replace(/[\\/:*?"<>|]/gu, "-")
    .replace(/\s+/gu, " ")
    .trim()
    .replace(/[. ]+$/u, "");

  const fallback = normalized || "draft";
  return fallback.length <= 120
    ? fallback
    : fallback.slice(0, 120).trimEnd();
}

export function escapeDraftHtml(value: string): string {
  return value
    .replace(/&/gu, "&amp;")
    .replace(/</gu, "&lt;")
    .replace(/>/gu, "&gt;")
    .replace(/"/gu, "&quot;")
    .replace(/'/gu, "&#39;");
}

function standaloneHtml(draft: Draft): string {
  const title = escapeDraftHtml(draft.title);
  const content = escapeDraftHtml(draft.content);

  return `<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <style>
    :root { color-scheme: light; }
    body {
      margin: 0 auto;
      max-width: 880px;
      padding: 48px 24px;
      background: #ffffff;
      color: #171717;
      font-family: system-ui, -apple-system, "Segoe UI", Tahoma, Arial, sans-serif;
      line-height: 1.8;
    }
    h1 { margin: 0 0 24px; font-size: 2rem; line-height: 1.35; }
    pre {
      margin: 0;
      white-space: pre-wrap;
      overflow-wrap: anywhere;
      font: inherit;
      unicode-bidi: plaintext;
    }
    .meta { margin-bottom: 24px; color: #666666; font-size: 0.875rem; }
  </style>
</head>
<body>
  <main>
    <h1 dir="auto">${title}</h1>
    <p class="meta" dir="ltr">Version ${draft.currentVersion}</p>
    <pre dir="auto">${content}</pre>
  </main>
</body>
</html>
`;
}

export function buildDraftExport(
  draft: Draft,
  format: DraftExportFormat,
): DraftExportPayload {
  const stem = normalizeFileStem(draft.title);

  if (format === "txt") {
    return {
      body: `${draft.title}\n\n${draft.content}\n`,
      contentType: "text/plain; charset=utf-8",
      extension: format,
      downloadName: `${stem}.txt`,
    };
  }

  if (format === "md") {
    return {
      body: `# ${draft.title}\n\n${draft.content}\n`,
      contentType: "text/markdown; charset=utf-8",
      extension: format,
      downloadName: `${stem}.md`,
    };
  }

  return {
    body: standaloneHtml(draft),
    contentType: "text/html; charset=utf-8",
    extension: format,
    downloadName: `${stem}.html`,
  };
}

export function contentDispositionFileName(fileName: string): string {
  const asciiFallback = fileName
    .replace(/[^\x20-\x7e]/gu, "_")
    .replace(/["\\]/gu, "_");
  return `attachment; filename="${asciiFallback}"; filename*=UTF-8''${encodeURIComponent(fileName)}`;
}
