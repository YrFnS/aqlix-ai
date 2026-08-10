import type { ReactNode } from "react";

type MarkdownBlock =
  | { kind: "paragraph"; content: string }
  | { kind: "heading"; level: number; content: string }
  | { kind: "blockquote"; content: string }
  | { kind: "unordered-list"; items: ListItem[] }
  | { kind: "ordered-list"; items: ListItem[]; start: number }
  | { kind: "table"; headers: string[]; rows: string[][] }
  | { kind: "code"; language: string; content: string }
  | { kind: "rule" };

type ListItem = {
  content: string;
  checked: boolean | null;
};

const headingPattern = /^(#{1,6})\s+(.+)$/u;
const unorderedListPattern = /^\s*[-+*]\s+(?:\[([ xX])\]\s+)?(.+)$/u;
const orderedListPattern = /^\s*(\d+)[.)]\s+(.+)$/u;
const blockquotePattern = /^\s*>\s?(.*)$/u;
const fencePattern = /^```([\w.+-]*)\s*$/u;
const tableSeparatorCellPattern = /^:?-{3,}:?$/u;
const rulePattern = /^\s{0,3}(?:(?:-\s*){3,}|(?:\*\s*){3,}|(?:_\s*){3,})$/u;
const inlinePattern =
  /(`[^`\n]+`|\[[^\]\n]+\]\(https?:\/\/[^\s)]+\)|\*\*[^*\n]+\*\*|__[^_\n]+__|~~[^~\n]+~~|\*[^*\n]+\*|_[^_\n]+_|https?:\/\/[^\s<>"']+)/gu;

function splitTableRow(line: string): string[] {
  let value = line.trim();
  if (value.startsWith("|")) value = value.slice(1);
  if (value.endsWith("|")) value = value.slice(0, -1);
  return value.split("|").map((cell) => cell.trim());
}

function isTableStart(lines: string[], index: number): boolean {
  const header = lines[index];
  const separator = lines[index + 1];
  if (!header?.includes("|") || !separator?.includes("|")) return false;

  const headerCells = splitTableRow(header);
  const separatorCells = splitTableRow(separator);
  return (
    headerCells.length > 0 &&
    headerCells.length === separatorCells.length &&
    separatorCells.every((cell) => tableSeparatorCellPattern.test(cell))
  );
}

function isBlockStart(lines: string[], index: number): boolean {
  const line = lines[index] ?? "";
  return (
    fencePattern.test(line) ||
    headingPattern.test(line) ||
    unorderedListPattern.test(line) ||
    orderedListPattern.test(line) ||
    blockquotePattern.test(line) ||
    rulePattern.test(line) ||
    isTableStart(lines, index)
  );
}

function parseMarkdownBlocks(content: string): MarkdownBlock[] {
  const lines = content.replaceAll("\r\n", "\n").split("\n");
  const blocks: MarkdownBlock[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index] ?? "";

    if (!line.trim()) {
      index += 1;
      continue;
    }

    const fence = line.match(fencePattern);
    if (fence) {
      const codeLines: string[] = [];
      index += 1;
      while (index < lines.length && !/^```\s*$/u.test(lines[index] ?? "")) {
        codeLines.push(lines[index] ?? "");
        index += 1;
      }
      if (index < lines.length) index += 1;
      blocks.push({
        kind: "code",
        language: fence[1]?.trim() ?? "",
        content: codeLines.join("\n").replace(/\s+$/u, ""),
      });
      continue;
    }

    const heading = line.match(headingPattern);
    if (heading) {
      blocks.push({
        kind: "heading",
        level: heading[1]?.length ?? 2,
        content: heading[2] ?? "",
      });
      index += 1;
      continue;
    }

    if (rulePattern.test(line)) {
      blocks.push({ kind: "rule" });
      index += 1;
      continue;
    }

    if (isTableStart(lines, index)) {
      const headers = splitTableRow(line);
      const rows: string[][] = [];
      index += 2;

      while (index < lines.length) {
        const row = lines[index] ?? "";
        if (!row.trim() || !row.includes("|")) break;
        rows.push(splitTableRow(row));
        index += 1;
      }

      blocks.push({ kind: "table", headers, rows });
      continue;
    }

    const unordered = line.match(unorderedListPattern);
    if (unordered) {
      const items: ListItem[] = [];
      while (index < lines.length) {
        const match = (lines[index] ?? "").match(unorderedListPattern);
        if (!match) break;
        items.push({
          checked:
            match[1] === undefined
              ? null
              : match[1].toLowerCase() === "x",
          content: match[2] ?? "",
        });
        index += 1;
      }
      blocks.push({ kind: "unordered-list", items });
      continue;
    }

    const ordered = line.match(orderedListPattern);
    if (ordered) {
      const items: ListItem[] = [];
      const start = Number.parseInt(ordered[1] ?? "1", 10);
      while (index < lines.length) {
        const match = (lines[index] ?? "").match(orderedListPattern);
        if (!match) break;
        items.push({ checked: null, content: match[2] ?? "" });
        index += 1;
      }
      blocks.push({ kind: "ordered-list", items, start });
      continue;
    }

    const quote = line.match(blockquotePattern);
    if (quote) {
      const quoteLines: string[] = [];
      while (index < lines.length) {
        const match = (lines[index] ?? "").match(blockquotePattern);
        if (!match) break;
        quoteLines.push(match[1] ?? "");
        index += 1;
      }
      blocks.push({ kind: "blockquote", content: quoteLines.join("\n") });
      continue;
    }

    const paragraphLines = [line];
    index += 1;
    while (
      index < lines.length &&
      (lines[index] ?? "").trim() &&
      !isBlockStart(lines, index)
    ) {
      paragraphLines.push(lines[index] ?? "");
      index += 1;
    }
    blocks.push({ kind: "paragraph", content: paragraphLines.join("\n") });
  }

  return blocks;
}

function textWithBreaks(text: string, keyPrefix: string): ReactNode[] {
  return text.split("\n").flatMap((line, index, all) => {
    const nodes: ReactNode[] = [
      <span key={`${keyPrefix}-line-${index}`}>{line}</span>,
    ];
    if (index < all.length - 1) {
      nodes.push(<br key={`${keyPrefix}-break-${index}`} />);
    }
    return nodes;
  });
}

function safeLink(value: string): string | null {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

function renderInline(content: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let cursor = 0;
  let tokenIndex = 0;

  for (const match of content.matchAll(inlinePattern)) {
    const index = match.index ?? 0;
    if (index > cursor) {
      nodes.push(
        ...textWithBreaks(
          content.slice(cursor, index),
          `${keyPrefix}-plain-${tokenIndex}`,
        ),
      );
    }

    const token = match[0];
    const key = `${keyPrefix}-token-${tokenIndex}`;

    if (token.startsWith("`")) {
      nodes.push(
        <code
          key={key}
          dir="auto"
          className="rounded-md bg-secondary px-1.5 py-0.5 font-mono text-[0.92em] text-foreground"
        >
          {token.slice(1, -1)}
        </code>,
      );
    } else if (token.startsWith("[")) {
      const link = token.match(/^\[([^\]\n]+)\]\((https?:\/\/[^\s)]+)\)$/u);
      const href = link?.[2] ? safeLink(link[2]) : null;
      if (link && href) {
        nodes.push(
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noreferrer noopener"
            className="break-words font-medium text-primary underline decoration-primary/35 underline-offset-4 hover:decoration-primary"
          >
            {link[1]}
          </a>,
        );
      } else {
        nodes.push(<span key={key}>{token}</span>);
      }
    } else if (token.startsWith("**") || token.startsWith("__")) {
      nodes.push(<strong key={key}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith("~~")) {
      nodes.push(<del key={key}>{token.slice(2, -2)}</del>);
    } else if (token.startsWith("*") || token.startsWith("_")) {
      nodes.push(<em key={key}>{token.slice(1, -1)}</em>);
    } else {
      const href = safeLink(token);
      nodes.push(
        href ? (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noreferrer noopener"
            dir="ltr"
            className="break-all font-medium text-primary underline decoration-primary/35 underline-offset-4 hover:decoration-primary"
          >
            {token}
          </a>
        ) : (
          <span key={key}>{token}</span>
        ),
      );
    }

    cursor = index + token.length;
    tokenIndex += 1;
  }

  if (cursor < content.length || nodes.length === 0) {
    nodes.push(
      ...textWithBreaks(
        content.slice(cursor),
        `${keyPrefix}-tail-${tokenIndex}`,
      ),
    );
  }

  return nodes;
}

function headingClass(level: number): string {
  if (level === 1) return "text-2xl sm:text-3xl";
  if (level === 2) return "text-xl sm:text-2xl";
  if (level === 3) return "text-lg sm:text-xl";
  return "text-base sm:text-lg";
}

export function MessageContent({ content }: { content: string }) {
  const blocks = parseMarkdownBlocks(content);

  return (
    <div className="min-w-0 space-y-4">
      {blocks.map((block, index) => {
        const key = `${block.kind}-${index}`;

        if (block.kind === "code") {
          return (
            <div
              key={key}
              className="overflow-hidden rounded-2xl border border-border/70 bg-foreground text-background"
            >
              {block.language && (
                <div
                  dir="ltr"
                  className="border-b border-background/15 px-4 py-2 text-xs font-semibold text-background/60"
                >
                  {block.language}
                </div>
              )}
              <pre
                dir="ltr"
                className="overflow-x-auto p-4 text-left text-sm leading-7"
              >
                <code>{block.content}</code>
              </pre>
            </div>
          );
        }

        if (block.kind === "heading") {
          const Heading = `h${Math.min(block.level, 6)}` as keyof JSX.IntrinsicElements;
          return (
            <Heading
              key={key}
              dir="auto"
              className={`font-arabic-heading font-semibold leading-snug ${headingClass(block.level)}`}
            >
              {renderInline(block.content, key)}
            </Heading>
          );
        }

        if (block.kind === "blockquote") {
          return (
            <blockquote
              key={key}
              dir="auto"
              className="border-s-4 border-primary/45 bg-secondary/45 px-4 py-3 text-muted-foreground"
            >
              {renderInline(block.content, key)}
            </blockquote>
          );
        }

        if (block.kind === "unordered-list") {
          return (
            <ul key={key} dir="auto" className="space-y-2 ps-6 leading-8">
              {block.items.map((item, itemIndex) => (
                <li
                  key={`${key}-${itemIndex}`}
                  className={item.checked === null ? "list-disc" : "list-none"}
                >
                  {item.checked !== null && (
                    <input
                      type="checkbox"
                      checked={item.checked}
                      readOnly
                      tabIndex={-1}
                      aria-hidden="true"
                      className="me-2 h-4 w-4 align-middle accent-primary"
                    />
                  )}
                  {renderInline(item.content, `${key}-${itemIndex}`)}
                </li>
              ))}
            </ul>
          );
        }

        if (block.kind === "ordered-list") {
          return (
            <ol
              key={key}
              dir="auto"
              start={block.start}
              className="list-decimal space-y-2 ps-6 leading-8"
            >
              {block.items.map((item, itemIndex) => (
                <li key={`${key}-${itemIndex}`}>
                  {renderInline(item.content, `${key}-${itemIndex}`)}
                </li>
              ))}
            </ol>
          );
        }

        if (block.kind === "table") {
          return (
            <div key={key} className="overflow-x-auto rounded-2xl border border-border/70">
              <table dir="auto" className="w-full min-w-[32rem] border-collapse text-sm">
                <thead className="bg-secondary/70 text-foreground">
                  <tr>
                    {block.headers.map((header, cellIndex) => (
                      <th
                        key={`${key}-header-${cellIndex}`}
                        scope="col"
                        className="border-b border-border px-4 py-3 text-start font-semibold"
                      >
                        {renderInline(header, `${key}-header-${cellIndex}`)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row, rowIndex) => (
                    <tr key={`${key}-row-${rowIndex}`} className="border-b border-border/60 last:border-0">
                      {block.headers.map((_, cellIndex) => (
                        <td
                          key={`${key}-cell-${rowIndex}-${cellIndex}`}
                          className="px-4 py-3 align-top text-muted-foreground"
                        >
                          {renderInline(
                            row[cellIndex] ?? "",
                            `${key}-cell-${rowIndex}-${cellIndex}`,
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        if (block.kind === "rule") {
          return <hr key={key} className="border-border/80" />;
        }

        return (
          <p key={key} dir="auto" className="break-words leading-8">
            {renderInline(block.content, key)}
          </p>
        );
      })}
    </div>
  );
}
