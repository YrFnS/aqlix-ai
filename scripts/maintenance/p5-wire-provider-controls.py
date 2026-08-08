from pathlib import Path

conversation_route = Path(
    "apps/web/src/app/api/v1/workspaces/[workspaceId]/conversations/"
    "[conversationId]/stream/route.ts"
)
draft_route = Path(
    "apps/web/src/app/api/v1/workspaces/[workspaceId]/drafts/[draftId]/"
    "continue/stream/route.ts"
)
conversation_contract = Path("packages/types/src/contracts/conversation.ts")
draft_contract = Path("packages/types/src/contracts/draft.ts")
settings_component = Path(
    "apps/web/src/components/ai/openrouter-settings.tsx"
)
openrouter_client = Path("apps/web/src/lib/ai/openrouter-client.ts")
ai_config = Path("apps/web/src/lib/ai/config.ts")
tsconfig = Path("apps/web/tsconfig.rebuild.json")


def replace_or_confirm(path: Path, old: str, new: str, label: str) -> None:
    content = path.read_text(encoding="utf-8")
    if old in content:
        count = content.count(old)
        if count != 1:
            raise SystemExit(
                f"Expected one {label} in {path}, found {count}"
            )
        path.write_text(content.replace(old, new), encoding="utf-8")
        print(f"Updated {label}: {path}")
        return

    if new in content:
        print(f"Already updated {label}: {path}")
        return

    raise SystemExit(f"Could not find old or new {label} in {path}")


for path in (conversation_route, draft_route):
    replace_or_confirm(
        path,
        "  getRequestedProviderIdentity,\n",
        "  getFallbackProviderIdentity,\n  resolveAiRuntimeConfig,\n",
        "provider identity import",
    )

    replace_or_confirm(
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

replace_or_confirm(
    conversation_route,
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

replace_or_confirm(
    draft_route,
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

for path, prefix in (
    (conversation_contract, "messageGenerationSchema"),
    (draft_contract, "draftGenerationSchema"),
):
    content = path.read_text(encoding="utf-8")
    old_requested = 'requestedModel: z.string().min(1).max(160),'
    new_requested = 'requestedModel: z.string().min(1).max(255),'
    old_returned = 'returnedModel: z.string().min(1).max(160).nullable(),'
    new_returned = 'returnedModel: z.string().min(1).max(255).nullable(),'
    if old_requested in content:
        content = content.replace(old_requested, new_requested, 1)
    elif new_requested not in content:
        raise SystemExit(f"Could not update requested model length in {path}")
    if old_returned in content:
        content = content.replace(old_returned, new_returned, 1)
    elif new_returned not in content:
        raise SystemExit(f"Could not update returned model length in {path}")
    path.write_text(content, encoding="utf-8")
    print(f"Aligned dynamic model IDs in {prefix}: {path}")

component = settings_component.read_text(encoding="utf-8")
component = component.replace("  LoaderCircle,\n", "")
component = component.replace("<LoaderCircle", "<RefreshCw")
if "const [refreshIndex, setRefreshIndex] = useState(0);" not in component:
    component = component.replace(
        '  const [manualModelId, setManualModelId] = useState(\"\");\n',
        '  const [manualModelId, setManualModelId] = useState(\"\");\n'
        '  const [refreshIndex, setRefreshIndex] = useState(0);\n',
        1,
    )
component = component.replace(
    "  }, [freeOnly, query, settings.connected, sort]);",
    "  }, [freeOnly, query, refreshIndex, settings.connected, sort]);",
    1,
)
component = component.replace(
    'onClick={() => setQuery((current) => `${current} ` .trimEnd())}',
    'onClick={() => setRefreshIndex((value) => value + 1)}',
    1,
)
settings_component.write_text(component, encoding="utf-8")
print(f"Updated catalog refresh and icon compatibility: {settings_component}")

client = openrouter_client.read_text(encoding="utf-8")
if 'from "./openrouter-endpoint"' not in client:
    client = client.replace(
        '} from "@iraqi-ai/types";\n\n',
        '} from "@iraqi-ai/types";\nimport { resolveOpenRouterBaseUrl } from "./openrouter-endpoint";\n\n',
        1,
    )
client = client.replace(
    'const OPENROUTER_API_URL = "https://openrouter.ai/api/v1";\n',
    "",
    1,
)
client = client.replace(
    "response = await fetch(`${OPENROUTER_API_URL}${path}`, {",
    "response = await fetch(`${resolveOpenRouterBaseUrl()}${path}`, {",
    1,
)
openrouter_client.write_text(client, encoding="utf-8")
print(f"Wired safe OpenRouter endpoint resolution: {openrouter_client}")

config_source = ai_config.read_text(encoding="utf-8")
if 'from "./openrouter-endpoint"' not in config_source:
    config_source = config_source.replace(
        'import { AiProviderError } from "./provider";\n',
        'import { resolveOpenRouterBaseUrl } from "./openrouter-endpoint";\n'
        'import { AiProviderError } from "./provider";\n',
        1,
    )
config_source = config_source.replace(
    "baseUrl: config.OPENROUTER_BASE_URL.replace(/\\/$/u, \"\"),",
    "baseUrl: resolveOpenRouterBaseUrl(),",
    1,
)
ai_config.write_text(config_source, encoding="utf-8")
print(f"Wired safe OpenRouter endpoint resolution: {ai_config}")

config = tsconfig.read_text(encoding="utf-8")
insertions = (
    (
        '    "src/app/(app)/workspaces/[workspaceId]/drafts/[draftId]/versions/[versionNumber]/page.tsx",\n',
        '    "src/app/(app)/workspaces/[workspaceId]/drafts/[draftId]/versions/[versionNumber]/page.tsx",\n'
        '    "src/app/(app)/settings/ai/page.tsx",\n',
    ),
    (
        '    "src/app/api/health/ready/route.ts",\n',
        '    "src/app/api/health/ready/route.ts",\n'
        '    "src/app/api/v1/ai/settings/route.ts",\n'
        '    "src/app/api/v1/ai/models/route.ts",\n'
        '    "src/app/api/v1/ai/model/route.ts",\n',
    ),
    (
        '    "src/components/conversations/conversation-card.tsx",\n',
        '    "src/components/ai/openrouter-settings.tsx",\n'
        '    "src/components/conversations/conversation-card.tsx",\n',
    ),
    (
        '    "src/lib/ai/openai-provider.ts",\n',
        '    "src/lib/ai/openai-provider.ts",\n'
        '    "src/lib/ai/openrouter-client.ts",\n'
        '    "src/lib/ai/openrouter-endpoint.ts",\n'
        '    "src/lib/ai/openrouter-provider.ts",\n'
        '    "src/lib/ai/openrouter-stream.ts",\n'
        '    "src/lib/ai/user-settings.ts",\n',
    ),
)
for old, new in insertions:
    if new in config:
        continue
    if old not in config:
        raise SystemExit(f"Could not find tsconfig insertion point: {old}")
    config = config.replace(old, new, 1)
tsconfig.write_text(config, encoding="utf-8")
print(f"Added active OpenRouter graph to {tsconfig}")
