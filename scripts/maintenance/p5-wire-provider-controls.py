from pathlib import Path

replacements = {
    Path(
        "apps/web/src/app/api/v1/workspaces/[workspaceId]/conversations/"
        "[conversationId]/stream/route.ts"
    ): (
        "const provider = createAiProvider();",
        """const provider = createAiProvider({
            supabase: auth.context.supabase,
            workspaceId: parsed.data.workspaceId,
            operation: \"conversation\",
            generationId: turn.generationId,
          });""",
    ),
    Path(
        "apps/web/src/app/api/v1/workspaces/[workspaceId]/drafts/[draftId]/"
        "continue/stream/route.ts"
    ): (
        "const provider = createAiProvider();",
        """const provider = createAiProvider({
            supabase: auth.context.supabase,
            workspaceId: parsed.data.workspaceId,
            operation: \"draft\",
            generationId: begun.generationId,
          });""",
    ),
}

for path, (old, new) in replacements.items():
    content = path.read_text(encoding="utf-8")
    count = content.count(old)
    if count != 1:
        raise SystemExit(f"Expected one provider factory call in {path}, found {count}")
    path.write_text(content.replace(old, new), encoding="utf-8")
    print(f"Updated {path}")
