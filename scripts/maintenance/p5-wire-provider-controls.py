from pathlib import Path

conversation = Path(
    "apps/web/src/app/api/v1/workspaces/[workspaceId]/conversations/"
    "[conversationId]/stream/route.ts"
)
draft = Path(
    "apps/web/src/app/api/v1/workspaces/[workspaceId]/drafts/[draftId]/"
    "continue/stream/route.ts"
)


def replace_once(path: Path, old: str, new: str, label: str) -> None:
    content = path.read_text(encoding="utf-8")
    count = content.count(old)
    if count != 1:
        raise SystemExit(
            f"Expected one {label} in {path}, found {count}"
        )
    path.write_text(content.replace(old, new), encoding="utf-8")


for path in (conversation, draft):
    replace_once(
        path,
        "  getRequestedProviderIdentity,\n",
        "  getFallbackProviderIdentity,\n  resolveAiRuntimeConfig,\n",
        "provider identity import",
    )

    replace_once(
        path,
        "  const providerIdentity = getRequestedProviderIdentity();\n",
        """  let aiRuntimeConfig: Awaited<
    ReturnType<typeof resolveAiRuntimeConfig>
  > | null = null;
  let providerConfigurationFailure: AiProviderError | null = null;

  try {
    aiRuntimeConfig = await resolveAiRuntimeConfig(auth.context.supabase, {
      requestOrigin: new URL(request.url).origin,
    });
  } catch (error) {
    providerConfigurationFailure =
      error instanceof AiProviderError
        ? error
        : new AiProviderError(
            \"UNKNOWN_PROVIDER_ERROR\",
            \"The user AI connection could not be resolved.\",
            true,
          );
  }

  const providerIdentity = aiRuntimeConfig
    ? {
        provider: aiRuntimeConfig.provider,
        requestedModel: aiRuntimeConfig.requestedModel,
      }
    : getFallbackProviderIdentity();
""",
        "provider identity resolution",
    )

replace_once(
    conversation,
    """          const provider = createAiProvider({
            supabase: auth.context.supabase,
            workspaceId: parsed.data.workspaceId,
            operation: \"conversation\",
            generationId: turn.generationId,
          });""",
    """          if (providerConfigurationFailure || !aiRuntimeConfig) {
            throw (
              providerConfigurationFailure ??
              new AiProviderError(
                \"PROVIDER_UNCONFIGURED\",
                \"Connect OpenRouter and select a model in AI settings.\",
                false,
              )
            );
          }

          const provider = createAiProvider(aiRuntimeConfig, {
            supabase: auth.context.supabase,
            workspaceId: parsed.data.workspaceId,
            operation: \"conversation\",
            generationId: turn.generationId,
          });""",
    "conversation provider factory",
)

replace_once(
    draft,
    """          const provider = createAiProvider({
            supabase: auth.context.supabase,
            workspaceId: parsed.data.workspaceId,
            operation: \"draft\",
            generationId: begun.generationId,
          });""",
    """          if (providerConfigurationFailure || !aiRuntimeConfig) {
            throw (
              providerConfigurationFailure ??
              new AiProviderError(
                \"PROVIDER_UNCONFIGURED\",
                \"Connect OpenRouter and select a model in AI settings.\",
                false,
              )
            );
          }

          const provider = createAiProvider(aiRuntimeConfig, {
            supabase: auth.context.supabase,
            workspaceId: parsed.data.workspaceId,
            operation: \"draft\",
            generationId: begun.generationId,
          });""",
    "draft provider factory",
)

print(f"Updated {conversation}")
print(f"Updated {draft}")
