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
      "src/app/api/v1/workspaces/[workspaceId]/conversations/[conversationId]/messages/route.ts",
      "src/app/api/v1/workspaces/[workspaceId]/conversations/[conversationId]/stream/route.ts",
    ];

    for (const path of required) {
      expect(existsSync(resolve(webRoot, path))).toBe(true);
    }
  });

  test("uses the user-selected OpenRouter stream as the primary provider", () => {
    const provider = readWeb("src/lib/ai/openrouter-provider.ts");
    const config = readWeb("src/lib/ai/config.ts");

    expect(provider).toContain("/chat/completions");
    expect(provider).toContain("model: this.requestedModel");
    expect(provider).toContain("stream: true");
    expect(provider).toContain("parseOpenRouterStream");
    expect(config).toContain('default("openrouter")');
    expect(config).toContain("resolveUserOpenRouterRuntime");
    expect(config).not.toContain('default("gpt-');
    expect(provider).not.toContain("NEXT_PUBLIC_OPENROUTER");
    expect(provider).not.toContain("dangerouslySetInnerHTML");
  });

  test("retains explicit managed OpenAI compatibility without provider-side history", () => {
    const provider = readWeb("src/lib/ai/openai-provider.ts");
    const config = readWeb("src/lib/ai/config.ts");

    expect(provider).toContain('`${this.baseUrl}/responses`');
    expect(provider).toContain("stream: true");
    expect(provider).toContain("store: false");
    expect(provider).toContain("response.output_text.delta");
    expect(provider).toContain("response.completed");
    expect(config).toContain("!config.OPENAI_API_KEY || !config.OPENAI_MODEL");
    expect(provider).not.toContain("NEXT_PUBLIC_OPENAI");
  });

  test("keeps credentials in server-only modules and Vault-backed settings", () => {
    const config = readWeb("src/lib/ai/config.ts");
    const settings = readWeb("src/lib/ai/user-settings.ts");
    const migration = readRepo(
      "supabase/migrations/202608080018_p5_user_openrouter_settings.sql",
    );
    const publicEnvironment = readWeb("src/config/env.ts");

    expect(config).toContain('import "server-only"');
    expect(settings).toContain('import "server-only"');
    expect(config).toContain("resolveUserOpenRouterRuntime");
    expect(migration).toContain("vault.create_secret");
    expect(migration).toContain("vault.decrypted_secrets");
    expect(config).toContain("P2_ALLOW_FIXTURE_PROVIDER");
    expect(config).toContain('config.APP_ENV === "production"');
    expect(config).toContain('config.APP_ENV === "staging"');
    expect(publicEnvironment).not.toContain("OPENAI_API_KEY");
    expect(publicEnvironment).not.toContain("OPENROUTER_API_KEY");
    expect(publicEnvironment).not.toContain("AI_PROVIDER");
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
    expect(streamRoute).toContain("resolveAiRuntimeConfig");
    expect(client).toContain("conversationStreamEventSchema.safeParse");
    expect(client).toContain("AbortController");
    expect(client).toContain("retryMessageId");
  });

  test("batches stream deltas and respects the reader's scroll position", () => {
    const client = readWeb(
      "src/components/conversations/conversation-shell.tsx",
    );

    expect(client).toContain("pendingDeltasRef");
    expect(client).toContain("window.requestAnimationFrame(flushPendingDeltas)");
    expect(client).toContain("shouldAutoScrollRef");
    expect(client).toContain("AUTO_SCROLL_THRESHOLD_PX");
    expect(client).toContain("onScroll={updateAutoScrollPreference}");
    expect(client).toContain("readyReceived && !terminalReceived");
    expect(client).not.toContain("router.refresh()");
    expect(client).not.toContain("scrollIntoView");
    expect(client).not.toContain('behavior: "smooth"');
  });

  test("loads only bounded visible message pages and their telemetry", () => {
    const pageRepository = readWeb(
      "src/lib/conversations/message-pages.ts",
    );
    const detailPage = readWeb(
      "src/app/(app)/workspaces/[workspaceId]/conversations/[conversationId]/page.tsx",
    );
    const detailRoute = readWeb(
      "src/app/api/v1/workspaces/[workspaceId]/conversations/[conversationId]/route.ts",
    );
    const messageRoute = readWeb(
      "src/app/api/v1/workspaces/[workspaceId]/conversations/[conversationId]/messages/route.ts",
    );

    expect(pageRepository).toContain("limit + 1");
    expect(pageRepository).toContain('.order("sequence", { ascending: false })');
    expect(pageRepository).toContain('.lt("sequence", input.beforeSequence)');
    expect(pageRepository).toContain('.in("message_id", assistantMessageIds)');
    expect(pageRepository).toContain("visibleRows.slice");
    expect(detailPage).toContain("listConversationMessagePage");
    expect(detailPage).not.toContain("listConversationMessages(");
    expect(detailRoute).toContain("messagePage.messages");
    expect(detailRoute).toContain("nextCursor: messagePage.nextCursor");
    expect(messageRoute).toContain("listConversationMessagesInputSchema");
  });

  test("prepends older pages while preserving the visual scroll anchor", () => {
    const client = readWeb(
      "src/components/conversations/conversation-shell.tsx",
    );

    expect(client).toContain("useLayoutEffect");
    expect(client).toContain("prependPositionRef");
    expect(client).toContain("viewport.scrollHeight - position.scrollHeight");
    expect(client).toContain("تحميل رسائل أقدم");
    expect(client).toContain("conversationMessagePageSchema.safeParse");
    expect(client).toContain("loadedOlderRef");
    expect(client).toContain("DraftFromConversationPanel");
  });

  test("aggregates conversation counts in PostgreSQL instead of scanning messages", () => {
    const summaries = readWeb("src/lib/conversations/summaries.ts");
    const collectionPage = readWeb(
      "src/app/(app)/workspaces/[workspaceId]/conversations/page.tsx",
    );
    const archivedPage = readWeb(
      "src/app/(app)/workspaces/[workspaceId]/conversations/archived/page.tsx",
    );
    const collectionRoute = readWeb(
      "src/app/api/v1/workspaces/[workspaceId]/conversations/route.ts",
    );
    const migration = readRepo(
      "supabase/migrations/202608100004_p2_conversation_pagination.sql",
    );

    expect(summaries).toContain('"list_conversation_summaries"');
    expect(collectionPage).toContain("listConversationSummaries");
    expect(archivedPage).toContain("listConversationSummaries");
    expect(collectionRoute).toContain("listConversationSummaries");
    expect(collectionPage).not.toContain("listConversations(");
    expect(collectionRoute).not.toContain("listConversations(");
    expect(migration).toContain("count(message.id)::integer");
    expect(migration).toContain("max(message.created_at)");
    expect(migration).toContain(
      "messages_workspace_conversation_sequence_desc_idx",
    );
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

  test("renders structured Markdown without enabling raw HTML", () => {
    const renderer = readWeb("src/components/conversations/message-content.tsx");
    const rendererTest = readWeb("tests/rebuild/message-markdown.test.ts");

    expect(renderer).toContain('dir="auto"');
    expect(renderer).toContain('dir="ltr"');
    expect(renderer).toContain('rel="noreferrer noopener"');
    expect(renderer).toContain('kind: "heading"');
    expect(renderer).toContain('kind: "unordered-list"');
    expect(renderer).toContain('kind: "ordered-list"');
    expect(renderer).toContain('kind: "blockquote"');
    expect(renderer).toContain('kind: "table"');
    expect(renderer).toContain('kind: "code"');
    expect(renderer).toContain("safeLink");
    expect(rendererTest).toContain("keeps raw HTML inert");
    expect(renderer).not.toContain("dangerouslySetInnerHTML");
    expect(renderer).not.toContain("innerHTML");
  });
});
