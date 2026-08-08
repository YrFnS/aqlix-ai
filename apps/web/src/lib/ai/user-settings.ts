import "server-only";

import type {
  OpenRouterKeyMetadata,
  UserAiSettings,
} from "@iraqi-ai/types";
import { userAiSettingsSchema } from "@iraqi-ai/types";
import type { SupabaseServerClient } from "@iraqi-ai/supabase-client/server";

interface RpcError {
  message: string;
  code?: string;
}

interface RpcResult<T> {
  data: T;
  error: RpcError | null;
}

type UntypedRpc = <T>(
  functionName: string,
  args?: Record<string, unknown>,
) => PromiseLike<RpcResult<T>>;

interface RawUserAiSettings {
  provider: string;
  connected: boolean;
  model_id: string | null;
  key_last_four: string | null;
  key_label: string | null;
  is_free_tier: boolean | null;
  connected_at: string | null;
  updated_at: string | null;
}

interface RawOpenRouterRuntime {
  api_key: string;
  model_id: string;
}

export interface UserOpenRouterRuntime {
  apiKey: string;
  modelId: string;
}

export class UserAiSettingsRepositoryError extends Error {
  constructor(
    public readonly operation: string,
    message: string,
    public readonly databaseCode?: string,
  ) {
    super(message);
    this.name = "UserAiSettingsRepositoryError";
  }
}

function rpcClient(supabase: SupabaseServerClient): UntypedRpc {
  return supabase.rpc.bind(supabase) as unknown as UntypedRpc;
}

function mapSettings(row: RawUserAiSettings | undefined): UserAiSettings {
  const candidate = row
    ? {
        provider: row.provider,
        connected: row.connected,
        modelId: row.model_id,
        keyLastFour: row.key_last_four,
        keyLabel: row.key_label,
        isFreeTier: row.is_free_tier,
        connectedAt: row.connected_at,
        updatedAt: row.updated_at,
      }
    : {
        provider: "openrouter",
        connected: false,
        modelId: null,
        keyLastFour: null,
        keyLabel: null,
        isFreeTier: null,
        connectedAt: null,
        updatedAt: null,
      };

  const parsed = userAiSettingsSchema.safeParse(candidate);
  if (!parsed.success) {
    throw new UserAiSettingsRepositoryError(
      "map-settings",
      "The saved AI settings returned an invalid shape.",
    );
  }

  return parsed.data;
}

async function settingsRpc(
  supabase: SupabaseServerClient,
  operation: string,
  functionName: string,
  args?: Record<string, unknown>,
): Promise<UserAiSettings> {
  const { data, error } = await rpcClient(supabase)<RawUserAiSettings[]>(
    functionName,
    args,
  );

  if (error) {
    throw new UserAiSettingsRepositoryError(
      operation,
      error.message,
      error.code,
    );
  }

  return mapSettings(data?.[0]);
}

export async function getUserAiSettings(
  supabase: SupabaseServerClient,
): Promise<UserAiSettings> {
  return settingsRpc(
    supabase,
    "get-user-ai-settings",
    "get_user_ai_settings",
  );
}

export async function saveUserOpenRouterCredential(
  supabase: SupabaseServerClient,
  input: {
    apiKey: string;
    metadata: OpenRouterKeyMetadata;
  },
): Promise<UserAiSettings> {
  return settingsRpc(
    supabase,
    "save-openrouter-credential",
    "save_user_openrouter_credential",
    {
      raw_api_key: input.apiKey,
      requested_key_label: input.metadata.label,
      requested_is_free_tier: input.metadata.isFreeTier,
    },
  );
}

export async function selectUserOpenRouterModel(
  supabase: SupabaseServerClient,
  modelId: string,
): Promise<UserAiSettings> {
  return settingsRpc(
    supabase,
    "select-openrouter-model",
    "set_user_openrouter_model",
    { requested_model_id: modelId },
  );
}

export async function resolveUserOpenRouterRuntime(
  supabase: SupabaseServerClient,
): Promise<UserOpenRouterRuntime | null> {
  const { data, error } = await rpcClient(supabase)<RawOpenRouterRuntime[]>(
    "resolve_user_openrouter_runtime",
  );

  if (error) {
    throw new UserAiSettingsRepositoryError(
      "resolve-openrouter-runtime",
      error.message,
      error.code,
    );
  }

  const row = data?.[0];
  if (!row?.api_key || !row.model_id) return null;

  return {
    apiKey: row.api_key,
    modelId: row.model_id,
  };
}

export async function disconnectUserOpenRouter(
  supabase: SupabaseServerClient,
): Promise<boolean> {
  const { data, error } = await rpcClient(supabase)<boolean>(
    "disconnect_user_openrouter",
  );

  if (error) {
    throw new UserAiSettingsRepositoryError(
      "disconnect-openrouter",
      error.message,
      error.code,
    );
  }

  return data === true;
}
