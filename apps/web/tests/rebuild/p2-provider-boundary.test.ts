import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const webRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const repoRoot = resolve(webRoot, "../..");
const readWeb = (path: string) =>
  readFileSync(resolve(webRoot, path), "utf8");
const readRepo = (path: string) =>
  readFileSync(resolve(repoRoot, path), "utf8");

describe("P2 provider and conversation boundary", () => {
  test("ships one persistent conversation route graph", () => {
    const required = [
      "src/app/(app)/workspaces/[workspaceId]/conversations/page.tsx",
      "src/app/(app)/workspaces/[workspaceId]/conversations/archived/page.tsx",
      "src/app/(app)/workspaces/[workspaceId]/conversations/loading.tsx",
      "src/app/(app)/workspaces/[workspaceId]/conversations/error.tsx",
      "src/app/(app)/workspaces/[workspaceId]/conversations/[conversationId]/page.tsx",
      "src/app/(app)/workspaces/[workspaceId]/conversations/[conversationId]/loading.tsx",
      "src/app/(app)/workspaces/[workspaceId]/conversations/[conversationId]/not-found.tsx",
      "src/app/api/v1/workspaces/[workspaceId]/conversations/route.ts",
      "src/app/api/v1/workspaces/[workspaceId]/conversations/[conversationId]/route.ts",
      "src/app/api/v1/workspaces/[workspaceId]/conversations/[conversationId]/stream/route.ts",
    ];

    for (const path of required) {
      expect(existsSync(resolve(webRoot, path))).toBe(true);
    }
  });

  test("uses the OpenAI Responses stream without provider-side history", () => {
    const provider = readWeb("src/lib/ai/openai-provider.ts");

    expect(provider).toContain('`${this.baseUrl}/responses`');
    expect(provider).toContain('stream: true');
    expect(provider).toContain('store: false');
    expect(provider).toContain('response.output_text.delta');
    expect(provider).toContain('response.completed');
    expect(provider).not.toContain('NEXT_PUBLIC_OPENAI');
    expect(provider).not.toContain('dangerouslySetInnerHTML');
  });

  test("keeps provider secrets in a server-only capability module", () => {
    const config = readWeb("src/lib/ai/config.ts");
    const publicEnvironment = readWeb("src/config/env.ts");

    expect(config).toContain('import "server-only"');
    expect(config).toContain('process.env.OPENAI_API_KEY');
    expect(config).toContain('P2_ALLOW_FIXTURE_PROVIDER');
    expect(config).toContain('process.env.NODE_ENV === "production"');
    expect(publicEnvironment).not.toContain('OPENAI_API_KEY');
    expect(publicEnvironment).not.toContain('AI_PROVIDER');
  });

  test("normalizes provider events before sending them to the browser", () => {
    const streamRoute = readWeb(
      "src/app/api/v1/workspaces/[workspaceId]/conversations/[conversationId]/stream/route.ts",
    );
    const client = readWeb(
      "src/components/conversations/conversation-shell.tsx",
    );

    for (const event of [
      'type: "ready"',
      'type: "delta"',
      'type: "complete"',
      'type: "failed"',
      'type: "cancelled"',
      'type: "heartbeat"',
    ]) {
      expect(streamRoute).toContain(event);
    }

    expect(streamRoute).toContain("finishConversationGeneration");
    expect(streamRoute).toContain("checkpointConversationGeneration");
    expect(client).toContain("conversationStreamEventSchema.safeParse");
    expect(client).toContain("AbortController");
    expect(client).toContain("retryMessageId");
  });

  test("keeps PostgreSQL as the only durable conversation authority", () => {
    const repository = readWeb("src/lib/conversations/repository.ts");
    const migration = readRepo(
      "supabase/migrations/202608080006_p2_conversation_generations.sql",
    );
    const inheritedService = readRepo("apps/api/services/chat_service.py");

    expect(repository).toContain('from("messages")');
    expect(repository).toContain('from("message_generations")');
    expect(repository).toContain('rpc("begin_conversation_turn"');
    expect(migration).toContain("create table public.message_generations");
    expect(migration).toContain("begin_conversation_turn");
    expect(inheritedService).toContain("In-memory storage for demo");
    expect(repository).not.toContain("new Map<string, Conversation");
  });

  test("renders text, URLs, and code without raw HTML injection", () => {
    const renderer = readWeb("src/components/conversations/message-content.tsx");

    expect(renderer).toContain('dir="auto"');
    expect(renderer).toContain('dir="ltr"');
    expect(renderer).toContain('rel="noreferrer noopener"');
    expect(renderer).not.toContain("dangerouslySetInnerHTML");
    expect(renderer).not.toContain("innerHTML");
  });
});
