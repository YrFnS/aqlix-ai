"use client";

import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import {
  Check,
  Clipboard,
  KeyRound,
  PlugZap,
  RefreshCw,
  Search,
  ShieldCheck,
  Unplug,
} from "lucide-react";
import type {
  OpenRouterModel,
  OpenRouterModelCatalog,
  OpenRouterModelSort,
  UserAiSettings,
} from "@iraqi-ai/types";
import { Button } from "@/components/ui/button";

interface OpenRouterSettingsProps {
  initialSettings: UserAiSettings;
}

interface ApiFailure {
  ok?: false;
  error?: {
    message?: string;
    fieldErrors?: Record<string, string[]>;
  };
}

function failureMessage(payload: ApiFailure, fallback: string): string {
  const fieldMessage = Object.values(payload.error?.fieldErrors ?? {})
    .flat()
    .find(Boolean);
  return [payload.error?.message, fieldMessage].filter(Boolean).join(" · ") || fallback;
}

function formatInteger(value: number | null): string {
  return value === null
    ? "—"
    : new Intl.NumberFormat("en-US").format(value);
}

function pricePerMillion(value: string | null): string {
  if (value === null) return "—";
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return value;
  if (numeric === 0) return "$0";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 4,
  }).format(numeric * 1_000_000);
}

function ModelCard({
  model,
  selected,
  selecting,
  onSelect,
}: {
  model: OpenRouterModel;
  selected: boolean;
  selecting: boolean;
  onSelect: (modelId: string) => void;
}) {
  const [copied, setCopied] = useState(false);

  return (
    <article className="rounded-3xl border border-border/70 bg-card p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            {model.isFree && (
              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[0.68rem] font-semibold text-primary">
                Free
              </span>
            )}
            {selected && (
              <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[0.68rem] font-semibold">
                <Check className="h-3 w-3" aria-hidden="true" />
                Current
              </span>
            )}
          </div>
          <h3 dir="auto" className="mt-3 text-lg font-semibold">
            {model.name}
          </h3>
          <button
            type="button"
            dir="ltr"
            className="mt-2 inline-flex max-w-full items-center gap-2 text-left font-mono text-xs text-muted-foreground hover:text-foreground"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(model.id);
                setCopied(true);
                window.setTimeout(() => setCopied(false), 1600);
              } catch {
                setCopied(false);
              }
            }}
          >
            <span className="truncate">{model.id}</span>
            <Clipboard className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span className="sr-only">{copied ? "Copied" : "Copy model ID"}</span>
          </button>
        </div>

        <Button
          type="button"
          variant={selected ? "outline" : "default"}
          className="shrink-0 rounded-full"
          disabled={selected || selecting}
          onClick={() => onSelect(model.id)}
        >
          {selecting ? (
            <RefreshCw className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : selected ? (
            <Check className="h-4 w-4" aria-hidden="true" />
          ) : (
            <PlugZap className="h-4 w-4" aria-hidden="true" />
          )}
          {selected ? "Selected" : "Use model"}
        </Button>
      </div>

      {model.description && (
        <p dir="auto" className="mt-4 line-clamp-3 text-sm leading-7 text-muted-foreground">
          {model.description}
        </p>
      )}

      <dl className="mt-5 grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
        <div className="rounded-2xl bg-secondary/55 p-3">
          <dt className="text-muted-foreground">Context</dt>
          <dd dir="ltr" className="mt-1 font-semibold">
            {formatInteger(model.contextLength)}
          </dd>
        </div>
        <div className="rounded-2xl bg-secondary/55 p-3">
          <dt className="text-muted-foreground">Input / 1M</dt>
          <dd dir="ltr" className="mt-1 font-semibold">
            {pricePerMillion(model.pricing.prompt)}
          </dd>
        </div>
        <div className="rounded-2xl bg-secondary/55 p-3">
          <dt className="text-muted-foreground">Output / 1M</dt>
          <dd dir="ltr" className="mt-1 font-semibold">
            {pricePerMillion(model.pricing.completion)}
          </dd>
        </div>
        <div className="rounded-2xl bg-secondary/55 p-3">
          <dt className="text-muted-foreground">Output modes</dt>
          <dd dir="ltr" className="mt-1 truncate font-semibold">
            {model.outputModalities.join(", ") || "text"}
          </dd>
        </div>
      </dl>
    </article>
  );
}

export function OpenRouterSettings({
  initialSettings,
}: OpenRouterSettingsProps) {
  const [settings, setSettings] = useState(initialSettings);
  const [apiKey, setApiKey] = useState("");
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [connectionNotice, setConnectionNotice] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);

  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<OpenRouterModelSort>("name");
  const [freeOnly, setFreeOnly] = useState(false);
  const [catalog, setCatalog] = useState<OpenRouterModelCatalog | null>(null);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [selectingModel, setSelectingModel] = useState<string | null>(null);
  const [manualModelId, setManualModelId] = useState("");
  const [refreshIndex, setRefreshIndex] = useState(0);

  const currentModel = useMemo(
    () => catalog?.models.find((model) => model.id === settings.modelId) ?? null,
    [catalog, settings.modelId],
  );

  useEffect(() => {
    if (!settings.connected) {
      setCatalog(null);
      setCatalogError(null);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setCatalogLoading(true);
      setCatalogError(null);

      try {
        const params = new URLSearchParams({
          q: query,
          sort,
          free: String(freeOnly),
          limit: "100",
        });
        const response = await fetch(`/api/v1/ai/models?${params}`, {
          cache: "no-store",
          signal: controller.signal,
        });
        const payload = (await response.json()) as {
          ok?: boolean;
          data?: { catalog?: OpenRouterModelCatalog };
          error?: { message?: string };
        };

        if (!response.ok || payload.ok !== true || !payload.data?.catalog) {
          throw new Error(
            payload.error?.message || "The live model catalog could not be loaded.",
          );
        }

        setCatalog(payload.data.catalog);
      } catch (error) {
        if (!controller.signal.aborted) {
          setCatalogError(
            error instanceof Error
              ? error.message
              : "The live model catalog could not be loaded.",
          );
        }
      } finally {
        if (!controller.signal.aborted) setCatalogLoading(false);
      }
    }, 350);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [freeOnly, query, refreshIndex, settings.connected, sort]);

  const connect = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!apiKey.trim() || connecting) return;

    setConnecting(true);
    setConnectionError(null);
    setConnectionNotice(null);

    try {
      const response = await fetch("/api/v1/ai/settings", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ apiKey }),
      });
      const payload = (await response.json()) as {
        ok?: boolean;
        data?: { settings?: UserAiSettings };
        error?: ApiFailure["error"];
      };

      if (!response.ok || payload.ok !== true || !payload.data?.settings) {
        throw new Error(
          failureMessage(
            { ok: false, error: payload.error },
            "OpenRouter could not be connected.",
          ),
        );
      }

      setSettings(payload.data.settings);
      setApiKey("");
      setConnectionNotice(
        "تم التحقق من المفتاح وتخزينه بشكل مشفر. اختر نموذجاً حياً للبدء.",
      );
    } catch (error) {
      setConnectionError(
        error instanceof Error
          ? error.message
          : "OpenRouter could not be connected.",
      );
    } finally {
      setConnecting(false);
    }
  };

  const disconnect = async () => {
    if (disconnecting) return;
    const confirmed = window.confirm(
      "Remove the encrypted OpenRouter key and selected model from this account?",
    );
    if (!confirmed) return;

    setDisconnecting(true);
    setConnectionError(null);
    setConnectionNotice(null);

    try {
      const response = await fetch("/api/v1/ai/settings", {
        method: "DELETE",
      });
      const payload = (await response.json()) as {
        ok?: boolean;
        data?: { settings?: UserAiSettings };
        error?: { message?: string };
      };
      if (!response.ok || payload.ok !== true || !payload.data?.settings) {
        throw new Error(
          payload.error?.message || "The OpenRouter connection could not be removed.",
        );
      }

      setSettings(payload.data.settings);
      setCatalog(null);
      setManualModelId("");
      setConnectionNotice("تم حذف المفتاح المشفر والنموذج المختار من الحساب.");
    } catch (error) {
      setConnectionError(
        error instanceof Error
          ? error.message
          : "The OpenRouter connection could not be removed.",
      );
    } finally {
      setDisconnecting(false);
    }
  };

  const selectModel = async (modelId: string) => {
    if (!modelId.trim() || selectingModel) return;
    setSelectingModel(modelId);
    setCatalogError(null);

    try {
      const response = await fetch("/api/v1/ai/model", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ modelId }),
      });
      const payload = (await response.json()) as {
        ok?: boolean;
        data?: { settings?: UserAiSettings };
        error?: ApiFailure["error"];
      };
      if (!response.ok || payload.ok !== true || !payload.data?.settings) {
        throw new Error(
          failureMessage(
            { ok: false, error: payload.error },
            "The model could not be selected.",
          ),
        );
      }

      setSettings(payload.data.settings);
      setManualModelId("");
      setConnectionNotice(`Model selected: ${modelId}`);
    } catch (error) {
      setCatalogError(
        error instanceof Error ? error.message : "The model could not be selected.",
      );
    } finally {
      setSelectingModel(null);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-primary">OpenRouter BYOK</p>
            <h2 className="mt-2 font-arabic-heading text-2xl font-semibold">
              مفتاحك أنت، وليس مفتاح المنصة
            </h2>
            <p className="mt-3 text-sm leading-8 text-muted-foreground">
              يتحقق الخادم من المفتاح مرة واحدة ثم يخزنه مشفراً في Supabase Vault.
              بعد الحفظ لا تعيد الواجهة المفتاح الخام. يمكن استبداله أو حذفه في أي
              وقت.
            </p>
          </div>
          <div className="rounded-2xl bg-primary/10 p-3 text-primary">
            <KeyRound className="h-5 w-5" aria-hidden="true" />
          </div>
        </div>

        {settings.connected ? (
          <div className="mt-7 rounded-3xl border border-primary/25 bg-primary/5 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="inline-flex items-center gap-2 font-semibold">
                  <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
                  Connected · •••• {settings.keyLastFour}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {settings.keyLabel || "OpenRouter API key"}
                  {settings.isFreeTier === true ? " · Free-tier key" : ""}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                className="rounded-full"
                disabled={disconnecting}
                onClick={() => void disconnect()}
              >
                {disconnecting ? (
                  <RefreshCw className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Unplug className="h-4 w-4" aria-hidden="true" />
                )}
                Disconnect
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={connect} className="mt-7 space-y-4">
            <label className="space-y-2 text-sm font-semibold">
              <span>OpenRouter API key</span>
              <input
                value={apiKey}
                onChange={(event) => setApiKey(event.target.value)}
                type="password"
                autoComplete="off"
                spellCheck={false}
                maxLength={512}
                dir="ltr"
                placeholder="Paste your key once"
                className="min-h-12 w-full rounded-2xl border border-input bg-background px-4 font-mono text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
            </label>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-6 text-muted-foreground">
                Use a key with its own spending limit in your OpenRouter dashboard.
              </p>
              <Button
                type="submit"
                className="rounded-full"
                disabled={!apiKey.trim() || connecting}
              >
                {connecting ? (
                  <RefreshCw className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <PlugZap className="h-4 w-4" aria-hidden="true" />
                )}
                Validate and connect
              </Button>
            </div>
          </form>
        )}

        {connectionError && (
          <div className="mt-4 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm leading-7 text-destructive" role="alert">
            {connectionError}
          </div>
        )}
        {connectionNotice && (
          <div className="mt-4 rounded-2xl border border-primary/25 bg-primary/10 px-4 py-3 text-sm leading-7" role="status">
            {connectionNotice}
          </div>
        )}
      </section>

      <section className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-primary">Live model catalog</p>
            <h2 className="mt-2 font-arabic-heading text-2xl font-semibold">
              ابحث واختر بدون قائمة ثابتة
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              القائمة تُطلب مباشرةً من OpenRouter باستخدام مفتاحك وتراعي إعدادات
              المزود والخصوصية الخاصة بحسابك. لا يوجد نموذج افتراضي مخفي في الكود.
            </p>
          </div>
          {settings.modelId && (
            <div className="max-w-full rounded-2xl bg-secondary/60 px-4 py-3 text-xs">
              <p className="text-muted-foreground">Current model</p>
              <p dir="ltr" className="mt-1 truncate font-mono font-semibold">
                {settings.modelId}
              </p>
            </div>
          )}
        </div>

        {!settings.connected ? (
          <div className="mt-7 rounded-3xl border border-dashed border-border bg-secondary/25 p-8 text-center text-sm leading-7 text-muted-foreground">
            Connect an OpenRouter key to load the models available to that account.
          </div>
        ) : (
          <>
            <div className="mt-7 grid gap-3 lg:grid-cols-[1fr_13rem_auto]">
              <label className="relative">
                <span className="sr-only">Search OpenRouter models</span>
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  maxLength={200}
                  dir="auto"
                  placeholder="Search by model name or ID"
                  className="min-h-12 w-full rounded-2xl border border-input bg-background pl-11 pr-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
              </label>
              <label>
                <span className="sr-only">Sort models</span>
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value as OpenRouterModelSort)}
                  className="min-h-12 w-full rounded-2xl border border-input bg-background px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <option value="name">Name</option>
                  <option value="newest">Newest</option>
                  <option value="context">Largest context</option>
                  <option value="prompt_price">Lowest input price</option>
                  <option value="completion_price">Lowest output price</option>
                </select>
              </label>
              <label className="inline-flex min-h-12 items-center gap-2 rounded-2xl border border-input bg-background px-4 text-sm font-semibold">
                <input
                  type="checkbox"
                  checked={freeOnly}
                  onChange={(event) => setFreeOnly(event.target.checked)}
                  className="h-4 w-4 accent-primary"
                />
                Free only
              </label>
            </div>

            <div className="mt-4 flex flex-col gap-3 rounded-2xl bg-secondary/45 p-4 sm:flex-row sm:items-end">
              <label className="flex-1 space-y-2 text-xs font-semibold">
                <span>Or paste an exact model ID</span>
                <input
                  value={manualModelId}
                  onChange={(event) => setManualModelId(event.target.value)}
                  maxLength={255}
                  dir="ltr"
                  placeholder="author/model or author/model:free"
                  className="min-h-11 w-full rounded-xl border border-input bg-background px-3 font-mono text-xs outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
              </label>
              <Button
                type="button"
                variant="outline"
                className="rounded-full"
                disabled={!manualModelId.trim() || Boolean(selectingModel)}
                onClick={() => void selectModel(manualModelId.trim())}
              >
                Validate and use
              </Button>
            </div>

            {catalogError && (
              <div className="mt-4 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm leading-7 text-destructive" role="alert">
                {catalogError}
              </div>
            )}

            <div className="mt-6 flex items-center justify-between gap-3 text-xs text-muted-foreground">
              <span>
                {catalogLoading
                  ? "Loading live models…"
                  : `${catalog?.total ?? 0} matching models`}
              </span>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="rounded-full"
                disabled={catalogLoading}
                onClick={() => setRefreshIndex((value) => value + 1)}
              >
                <RefreshCw className={catalogLoading ? "h-3.5 w-3.5 animate-spin" : "h-3.5 w-3.5"} aria-hidden="true" />
                Refresh
              </Button>
            </div>

            {catalogLoading && !catalog ? (
              <div className="mt-6 flex min-h-64 items-center justify-center rounded-3xl border border-dashed border-border">
                <RefreshCw className="h-6 w-6 animate-spin text-primary" aria-hidden="true" />
              </div>
            ) : catalog?.models.length ? (
              <div className="mt-6 grid gap-4 xl:grid-cols-2">
                {catalog.models.map((model) => (
                  <ModelCard
                    key={model.id}
                    model={model}
                    selected={settings.modelId === model.id}
                    selecting={selectingModel === model.id}
                    onSelect={(modelId) => void selectModel(modelId)}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-3xl border border-dashed border-border bg-secondary/25 p-8 text-center text-sm leading-7 text-muted-foreground">
                No current model matches these live filters. Change the search or clear the free-only filter.
              </div>
            )}

            {settings.modelId && !currentModel && catalog && (
              <p className="mt-4 text-xs leading-6 text-muted-foreground">
                The current model is saved but is outside this filtered result set.
              </p>
            )}
          </>
        )}
      </section>
    </div>
  );
}
