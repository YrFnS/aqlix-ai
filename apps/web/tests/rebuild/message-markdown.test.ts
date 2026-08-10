import { describe, expect, test } from "bun:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MessageContent } from "../../src/components/conversations/message-content";

function render(content: string): string {
  return renderToStaticMarkup(createElement(MessageContent, { content }));
}

describe("safe chat Markdown renderer", () => {
  test("renders headings, emphasis, links, quotes, lists, tasks, tables, and code", () => {
    const html = render(`# عنوان رئيسي

فقرة فيها **نص عريض** و*نص مائل* و\`inline code\` و[رابط](https://example.test/docs).

> اقتباس قابل للقراءة

- عنصر أول
- [x] مهمة مكتملة
- [ ] مهمة مفتوحة

1. خطوة أولى
2. خطوة ثانية

| الحقل | القيمة |
| --- | --- |
| اللغة | العربية |
| Mode | English |

\`\`\`ts
const answer = 42;
\`\`\``);

    expect(html).toContain("<h1");
    expect(html).toContain("عنوان رئيسي</h1>");
    expect(html).toContain("<strong>نص عريض</strong>");
    expect(html).toContain("<em>نص مائل</em>");
    expect(html).toContain("inline code</code>");
    expect(html).toContain('href="https://example.test/docs"');
    expect(html).toContain('rel="noreferrer noopener"');
    expect(html).toContain("<blockquote");
    expect(html).toContain("<ul");
    expect(html).toContain('type="checkbox"');
    expect(html).toContain("<ol");
    expect(html).toContain("<table");
    expect(html).toContain("<th");
    expect(html).toContain("<td");
    expect(html).toContain("const answer = 42;");
  });

  test("keeps raw HTML inert and rejects unsafe link schemes", () => {
    const html = render(`<script>alert("xss")</script>

[unsafe](javascript:alert(1))

https://safe.example.test/path`);

    expect(html).toContain("&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;");
    expect(html).not.toContain("<script>");
    expect(html).not.toContain('href="javascript:');
    expect(html).toContain('href="https://safe.example.test/path"');
  });

  test("preserves mixed Arabic-English paragraphs and explicit line breaks", () => {
    const html = render("سطر عربي مع English 2026\nسطر ثانٍ");

    expect(html).toContain('dir="auto"');
    expect(html).toContain("سطر عربي مع English 2026");
    expect(html).toContain("<br/>");
    expect(html).toContain("سطر ثانٍ");
  });
});
