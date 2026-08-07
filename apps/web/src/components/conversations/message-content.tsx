import type { ReactNode } from "react";

const fencedCodePattern = /```([\w.+-]*)\r?\n([\s\S]*?)```/gu;
const urlPattern = /(https?:\/\/[^\s<>"']+)/gu;

function linkedText(text: string): ReactNode[] {
  return text.split(urlPattern).map((part, index) => {
    if (/^https?:\/\//u.test(part)) {
      return (
        <a
          key={`${part}-${index}`}
          href={part}
          target="_blank"
          rel="noreferrer noopener"
          dir="ltr"
          className="break-all font-medium text-primary underline decoration-primary/35 underline-offset-4 hover:decoration-primary"
        >
          {part}
        </a>
      );
    }

    return <span key={`${index}-${part.slice(0, 12)}`}>{part}</span>;
  });
}

export function MessageContent({ content }: { content: string }) {
  const nodes: ReactNode[] = [];
  let cursor = 0;
  let block = 0;

  for (const match of content.matchAll(fencedCodePattern)) {
    const index = match.index ?? 0;
    const before = content.slice(cursor, index);

    if (before) {
      nodes.push(
        <p
          key={`text-${block}`}
          dir="auto"
          className="whitespace-pre-wrap break-words leading-8"
        >
          {linkedText(before)}
        </p>,
      );
    }

    const language = match[1]?.trim();
    const code = match[2] ?? "";
    nodes.push(
      <div
        key={`code-${block}`}
        className="my-4 overflow-hidden rounded-2xl border border-border/70 bg-foreground text-background"
      >
        {language && (
          <div
            dir="ltr"
            className="border-b border-background/15 px-4 py-2 text-xs font-semibold text-background/60"
          >
            {language}
          </div>
        )}
        <pre
          dir="ltr"
          className="overflow-x-auto p-4 text-left text-sm leading-7"
        >
          <code>{code.replace(/\s+$/u, "")}</code>
        </pre>
      </div>,
    );

    cursor = index + match[0].length;
    block += 1;
  }

  const remaining = content.slice(cursor);
  if (remaining || nodes.length === 0) {
    nodes.push(
      <p
        key={`text-${block}`}
        dir="auto"
        className="whitespace-pre-wrap break-words leading-8"
      >
        {linkedText(remaining)}
      </p>,
    );
  }

  return <div className="min-w-0">{nodes}</div>;
}
