import "server-only";

import type {
  OpenRouterKeyMetadata,
  OpenRouterModel,
  OpenRouterModelCatalog,
  OpenRouterModelCatalogQuery,
  OpenRouterModelSort,
} from "@iraqi-ai/types";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1";
const MAX_PROVIDER_ERROR_LENGTH = 500;

interface OpenRouterKeyResponse {
  data?: {
    label?: unknown;
    usage?: unknown;
    limit?: unknown;
    limit_remaining?: unknown;
    is_free_tier?: unknown;
    expires_at?: unknown;
  };
}

interface OpenRouterRawModel {
  id?: unknown;
  canonical_slug?: unknown;
  name?: unknown;
  description?: unknown;
  created?: unknown;
  context_length?: unknown;
  expiration_date?: unknown;
  architecture?: {
    input_modalities?: unknown;
    output_modalities?: unknown;
  } | null;
  supported_parameters?: unknown;
  pricing?: {
    prompt?: unknown;
    completion?: unknown;
    request?: unknown;
    image?: unknown;
  } | null;
  top_provider?: {
    max_completion_tokens?: unknown;
  } | null;
}

interface OpenRouterModelsResponse {
  data?: OpenRouterRawModel[];
}

export class OpenRouterCatalogError extends Error {
  constructor(
    public readonly operation: string,
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "OpenRouterCatalogError";
  }
}

function stringOrNull(value: unknown, maximum = 4000): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim();
  return normalized ? normalized.slice(0, maximum) : null;
}

function finiteNumberOrNull(value: unknown): number | null {
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) ? number : null;
}

function positiveIntegerOrNull(value: unknown): number | null {
  const number = finiteNumberOrNull(value);
  if (number === null || number <= 0) return null;
  return Math.floor(number);
}

function stringArray(value: unknown, maximum = 80): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim().slice(0, maximum))
    .filter(Boolean);
}

function isoFromUnixSeconds(value: unknown): string | null {
  const seconds = finiteNumberOrNull(value);
  if (seconds === null || seconds <= 0) return null;
  const date = new Date(seconds * 1000);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function isoTimestampOrNull(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function pricingValue(value: unknown): string | null {
  if (typeof value === "string") return value.slice(0, 80);
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return null;
}

function zeroPrice(value: string | null): boolean {
  if (value === null || value === "") return true;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed === 0;
}

function mapModel(raw: OpenRouterRawModel): OpenRouterModel | null {
  const id = stringOrNull(raw.id, 255);
  const name = stringOrNull(raw.name, 255) ?? id;
  if (!id || !name || !/^[A-Za-z0-9][A-Za-z0-9._:/-]*$/u.test(id)) {
    return null;
  }

  const pricing = {
    prompt: pricingValue(raw.pricing?.prompt),
    completion: pricingValue(raw.pricing?.completion),
    request: pricingValue(raw.pricing?.request),
    image: pricingValue(raw.pricing?.image),
  };

  return {
    id,
    canonicalSlug: stringOrNull(raw.canonical_slug, 255),
    name,
    description: stringOrNull(raw.description),
    createdAt: isoFromUnixSeconds(raw.created),
    contextLength: positiveIntegerOrNull(raw.context_length),
    maxCompletionTokens: positiveIntegerOrNull(
      raw.top_provider?.max_completion_tokens,
    ),
    inputModalities: stringArray(raw.architecture?.input_modalities, 32),
    outputModalities: stringArray(raw.architecture?.output_modalities, 32),
    supportedParameters: stringArray(raw.supported_parameters),
    pricing,
    isFree:
      id.endsWith(":free") ||
      (zeroPrice(pricing.prompt) &&
        zeroPrice(pricing.completion) &&
        zeroPrice(pricing.request)),
    expiresAt: isoTimestampOrNull(raw.expiration_date),
  };
}

async function providerErrorMessage(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as {
      error?: { message?: unknown };
      message?: unknown;
    };
    const message =
      typeof body.error?.message === "string"
        ? body.error.message
        : typeof body.message === "string"
          ? body.message
          : "";
    return message.slice(0, MAX_PROVIDER_ERROR_LENGTH);
  } catch {
    return "";
  }
}

async function openRouterGet(
  path: string,
  apiKey: string,
): Promise<Response> {
  let response: Response;
  try {
    response = await fetch(`${OPENROUTER_API_URL}${path}`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${apiKey}`,
        accept: "application/json",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });
  } catch {
    throw new OpenRouterCatalogError(
      "request",
      "OpenRouter could not be reached.",
    );
  }

  if (!response.ok) {
    const providerMessage = await providerErrorMessage(response);
    throw new OpenRouterCatalogError(
      "request",
      providerMessage ||
        (response.status === 401 || response.status === 403
          ? "OpenRouter rejected this API key."
          : "OpenRouter rejected the request."),
      response.status,
    );
  }

  return response;
}

export async function inspectOpenRouterKey(
  apiKey: string,
): Promise<OpenRouterKeyMetadata> {
  const response = await openRouterGet("/key", apiKey);
  const body = (await response.json()) as OpenRouterKeyResponse;
  const data = body.data;
  if (!data) {
    throw new OpenRouterCatalogError(
      "inspect-key",
      "OpenRouter returned invalid key metadata.",
    );
  }

  return {
    label: stringOrNull(data.label, 120),
    usage: finiteNumberOrNull(data.usage),
    limit: finiteNumberOrNull(data.limit),
    limitRemaining: finiteNumberOrNull(data.limit_remaining),
    isFreeTier: data.is_free_tier === true,
    expiresAt: isoTimestampOrNull(data.expires_at),
  };
}

function compareModels(
  sort: OpenRouterModelSort,
): (left: OpenRouterModel, right: OpenRouterModel) => number {
  const price = (value: string | null) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : Number.POSITIVE_INFINITY;
  };

  return (left, right) => {
    if (sort === "context") {
      return (
        (right.contextLength ?? 0) - (left.contextLength ?? 0) ||
        left.name.localeCompare(right.name)
      );
    }
    if (sort === "prompt_price") {
      return (
        price(left.pricing.prompt) - price(right.pricing.prompt) ||
        left.name.localeCompare(right.name)
      );
    }
    if (sort === "completion_price") {
      return (
        price(left.pricing.completion) - price(right.pricing.completion) ||
        left.name.localeCompare(right.name)
      );
    }
    if (sort === "newest") {
      return (
        (right.createdAt ? Date.parse(right.createdAt) : 0) -
          (left.createdAt ? Date.parse(left.createdAt) : 0) ||
        left.name.localeCompare(right.name)
      );
    }
    return left.name.localeCompare(right.name);
  };
}

export async function listOpenRouterModels(
  apiKey: string,
  query: OpenRouterModelCatalogQuery,
): Promise<OpenRouterModelCatalog> {
  const response = await openRouterGet("/models/user", apiKey);
  const body = (await response.json()) as OpenRouterModelsResponse;
  if (!Array.isArray(body.data)) {
    throw new OpenRouterCatalogError(
      "list-models",
      "OpenRouter returned an invalid model catalog.",
    );
  }

  const needle = query.query.trim().toLocaleLowerCase();
  const mapped = body.data
    .map(mapModel)
    .filter((model): model is OpenRouterModel => model !== null)
    .filter((model) =>
      model.outputModalities.length === 0
        ? true
        : model.outputModalities.includes("text"),
    );
  const filtered = mapped
    .filter((model) => !query.freeOnly || model.isFree)
    .filter((model) => {
      if (!needle) return true;
      return (
        model.id.toLocaleLowerCase().includes(needle) ||
        model.name.toLocaleLowerCase().includes(needle) ||
        model.description?.toLocaleLowerCase().includes(needle) === true
      );
    })
    .sort(compareModels(query.sort));

  return {
    models: filtered.slice(0, query.limit),
    total: filtered.length,
    filteredForConnectedUser: true,
    fetchedAt: new Date().toISOString(),
  };
}

export async function requireOpenRouterModel(
  apiKey: string,
  modelId: string,
): Promise<OpenRouterModel> {
  const catalog = await listOpenRouterModels(apiKey, {
    query: modelId,
    sort: "name",
    freeOnly: false,
    limit: 200,
  });
  const model = catalog.models.find((candidate) => candidate.id === modelId);
  if (!model) {
    throw new OpenRouterCatalogError(
      "validate-model",
      "The selected model is not available for this OpenRouter key.",
      404,
    );
  }

  return model;
}
