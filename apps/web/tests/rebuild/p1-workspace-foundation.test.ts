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

describe("P1 workspace foundation", () => {
  test("ships the complete persistent workspace route skeleton", () => {
    const requiredRoutes = [
      "src/app/(app)/workspaces/page.tsx",
      "src/app/(app)/workspaces/loading.tsx",
      "src/app/(app)/workspaces/error.tsx",
      "src/app/(app)/workspaces/archived/page.tsx",
      "src/app/(app)/workspaces/[workspaceId]/page.tsx",
      "src/app/(app)/workspaces/[workspaceId]/loading.tsx",
      "src/app/(app)/workspaces/[workspaceId]/not-found.tsx",
      "src/app/(app)/workspaces/[workspaceId]/settings/page.tsx",
    ];

    for (const path of requiredRoutes) {
      expect(existsSync(resolve(webRoot, path))).toBe(true);
    }
  });

  test("derives workspace ownership from the authenticated user", () => {
    const actions = readWeb("src/lib/workspaces/actions.ts");
    const repository = readWeb("src/lib/workspaces/repository.ts");

    expect(actions).toContain("requireAuthenticatedUser");
    expect(repository).toContain("owner_id: userId");
    expect(actions).not.toMatch(/formData\.get\(["']owner/i);
    expect(repository).not.toContain("SUPABASE_SERVICE_ROLE_KEY");
  });

  test("uses shared runtime contracts for web actions and API routes", () => {
    const actionSource = readWeb("src/lib/workspaces/actions.ts");
    const collectionApi = readWeb("src/app/api/v1/workspaces/route.ts");
    const itemApi = readWeb(
      "src/app/api/v1/workspaces/[workspaceId]/route.ts",
    );
    const lifecycleApi = readWeb(
      "src/app/api/v1/workspaces/[workspaceId]/archive/route.ts",
    );

    expect(actionSource).toContain("createWorkspaceInputSchema");
    expect(collectionApi).toContain("createWorkspaceInputSchema");
    expect(itemApi).toContain("updateWorkspaceInputSchema");
    expect(itemApi).toContain("deleteWorkspaceInputSchema");
    expect(lifecycleApi).toContain("setWorkspaceArchivedInputSchema");
  });

  test("keeps API authentication non-redirecting and session-derived", () => {
    const apiAuth = readWeb("src/lib/api/auth.ts");
    const apiResponses = readWeb("src/lib/api/responses.ts");

    expect(apiAuth).toContain("supabase.auth.getUser()");
    expect(apiAuth).toContain('"UNAUTHENTICATED"');
    expect(apiAuth).toContain("status: 401");
    expect(apiAuth).toContain("status: 503");
    expect(apiAuth).not.toContain("redirect(");
    expect(apiResponses).toContain('"x-request-id"');
  });

  test("defines a canonical PostgreSQL model with RLS and owner membership", () => {
    const migration = readRepo(
      "supabase/migrations/202608080001_p1_workspace_foundation.sql",
    );

    for (const table of [
      "workspaces",
      "workspace_members",
      "conversations",
      "messages",
      "attachments",
      "sources",
      "drafts",
    ]) {
      expect(migration).toContain(`create table public.${table}`);
      expect(migration).toContain(
        `alter table public.${table} enable row level security`,
      );
    }

    expect(migration).toContain("create_workspace_owner_membership");
    expect(migration).toContain("has_workspace_role");
    expect(migration).toContain("is_workspace_member");
  });

  test("keeps P1 intact while exposing conversation, source, and draft work", () => {
    const detail = readWeb(
      "src/app/(app)/workspaces/[workspaceId]/page.tsx",
    );
    const sources = readWeb(
      "src/app/(app)/workspaces/[workspaceId]/sources/page.tsx",
    );

    expect(detail).toContain(`/workspaces/${"${workspace.id}"}/conversations`);
    expect(detail).toContain("حوار محفوظ");
    expect(detail).toContain(`/workspaces/${"${workspace.id}"}/sources`);
    expect(detail).toContain("مصادر خاصة");
    expect(detail).toContain("المراجع المرتبطة بالمقاطع المستخدمة");
    expect(sources).toContain("Private bucket · RLS · 2 MiB");
    expect(detail).toContain(`/workspaces/${"${workspace.id}"}/drafts`);
    expect(detail).toContain("تحرير بإصدارات");
    expect(detail).toContain("سياق واحد، وصلاحيات مرتبطة بالعضوية");
    expect(detail).toContain("يبقى العمل المقترح منفصلاً");
    expect(detail).not.toContain("P2 + P3 · يعمل");
    expect(detail).not.toContain("P3 · يعمل");
    expect(detail).not.toContain("P4 · يعمل");
    expect(detail).not.toContain("غير مفعّل بعد");
    expect(detail).not.toMatch(/production[- ]ready/i);
  });

  test("keeps primary application navigation free from dead product routes", () => {
    const navigation = readWeb("src/components/navigation/app-nav.tsx");

    expect(navigation).toContain('href: "/workspaces"');
    expect(navigation).toContain('href: "/docs"');
    expect(navigation).not.toContain('href: "/chat"');
    expect(navigation).not.toContain('href: "/sources"');
    expect(navigation).not.toContain('href: "/drafts"');
    expect(navigation).not.toContain('href: "/settings"');
  });
});
