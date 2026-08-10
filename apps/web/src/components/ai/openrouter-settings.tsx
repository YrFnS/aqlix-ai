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
import { ActivityOrb } from "@/components/conversations/activity-orb";
import { Button } from "@/components/ui/button";
import { Surface } from "@/components/ui/surface";

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
    <article className="h-full">
      <Surface
        tone="raised"
        elevation="xs"
        radius="2xl"
        padding="md"
        className={`flex h-full flex-col transition-[border-color,box-shadow] duration-fast ${
          selected
            ? "border-primary/30 shadow-surface-sm"
            : "hover:border-primary/20 hover:shadow-surface-sm"
        }`}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              {model.isFree ? (
                <span className="rounded-full bg-brand-soft px-2.5 py-1 text-[0.68rem] font-semibold text-primary">
                  Free
                </span>
              ) : null}
              {selected ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-surface-sunken px-2.5 py-1 text-[0.68rem] font-semibold text-foreground">
                  <Check className="h-3 w-3" aria-hidden="true" />
                  Current
                </span>
              ) : null}
            </div>
            <h3 dir="auto" className="mt-3 text-lg font-semibold">
              {model.name}
            </h3>
            <button
              type="button"
              dir="ltr"
              className="mt-2 inline-flex max-w-full items-center gap-2 rounded-md text-left font-mono text-xs text-ink-muted outline-none transition-colors hover:text-foreground focus-visible:ring-4 focus-visible:ring-ring/20"
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
              {copied ? (
                <Check className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              ) : (
                <Clipboard className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              )}
              <span className="sr-only">
                {copied ? "Copied" : "Copy model ID"}
              </span>
            </button>
          </div>

          <Button
            type="button"
            variant={selected ? "outline" : "default"}
            className="shrink-0 rounded-xl"
            disabled={selected || selecting}
            onClick={() => onSelect(model.id)}
          >
            {selecting ? (
              <ActivityOrb state="working" size="sm" />
            ) : selected ? (
              <Check className="h-4 w-4" aria-hidden="true" />
            ) : (
              <PlugZap className="h-4 w-4" aria-hidden="true" />
            )}
            {selected ? "Selected" : "Use model"}
          </Button>
        </div>

        {model.description ? (
          <p
            dir="auto"
            className="mt-4 line-clamp-3 text-sm leading-7 text-ink-muted"
          >
            {model.description}
          </p>
        ) : null}

        <dl className="mt-5 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
          <div className="rounded-xl bg-surface-sunken/70 p-3">
            <dt className="text-ink-subtle">Context</dt>
            <dd dir="ltr" className="mt-1 font-semibold">
              {formatInteger(model.contextLength)}
            </dd>
          </div>
          <div className="rounded-xl bg-surface-sunken/70 p-3">
            <dt className="text-ink-subtle">Input / 1M</dt>
            <dd dir="ltr" className="mt-1 font-semibold">
              {pricePerMillion(model.pricing.prompt)}
            </dd>
          </div>
          <div className="rounded-xl bg-surface-sunken/70 p-3">
            <dt className="text-ink-subtle">Output / 1M</dt>
            <dd dir="ltr" className="mt-1 font-semibold">
              {pricePerMillion(model.pricing.completion)}
            </dd>
          </div>
          <div className="rounded-xl bg-surface-sunken/70 p-3">
            <dt className="text-ink-subtle">Output modes</dt>
            <dd dir="ltr" className="mt-1 truncate font-semibold">
              {model.outputModalities.join(", ") || "text"}
            </dd>
          </div>
        </dl>
      </Surface>
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
    <div className="grid gap-8 xl:grid-cols-[22rem_minmax(0,1fr)]">
      <aside className="xl:sticky xl:top-24 xl:self-start">
        <Surface
          tone="raised"
          elevation="sm"
          radius="2xl"
          padding="md"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-primary">OpenRouter BYOK</p>
              <h2 className="mt-2 font-arabic-heading text-xl font-semibold">
                اتصال الحساب
              </h2>
            </div>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-primary">
              <KeyRound className="h-4 w-4" aria-hidden="true" />
            </span>
          </div>
          <p className="mt-3 text-sm leading-7 text-ink-muted">
            يتحقق الخادم من المفتاح ثم يخزنه مشفراً. لا تعيد الواجهة المفتاح الخام
            بعد الحفظ.
          </p>

          {settings.connected ? (
            <div className="mt-5 space-y-4">
              <div className="rounded-xl border border-primary/25 bg-brand-soft/55 p-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-raised text-primary shadow-surface-xs">
                    <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold">Connected</p>
                    <p dir="ltr" className="mt-1 text-xs text-ink-muted">
                      •••• {settings.keyLastFour}
                    </p>
                    <p className="mt-1 truncate text-xs text-ink-muted">
                      {settings.keyLabel || "OpenRouter API key"}
                    </p>
                    {settings.isFreeTier === true ? (
                      <span className="mt-2 inline-flex rounded-full bg-surface-raised px-2 py-0.5 text-[0.65rem] font-semibold text-primary">
                        Free-tier key
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-surface-sunken p-4">
                <p className="text-xs text-ink-subtle">النموذج الحالي</p>
                <p
                  dir="ltr"
                  className="mt-2 break-all font-mono text-xs font-semibold"
                >
                  {settings.modelId ?? "لم يُختر نموذج بعد"}
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full justify-start rounded-xl"
                disabled={disconnecting}
                onClick={() => void disconnect()}
              >
                {disconnecting ? (
                  <ActivityOrb state="working" size="sm" />
                ) : (
                  <Unplug className="h-4 w-4" aria-hidden="true" />
                )}
                Disconnect
              </Button>
            </div>
          ) : (
            <form onSubmit={connect} className="mt-5 space-y-4">
              <label className="space-y-2 text-xs font-semibold">
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
                  className="min-h-12 w-full rounded-xl border border-input bg-surface-raised px-4 font-mono text-sm outline-none placeholder:text-ink-subtle focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/20"
                />
              </label>
              <p className="text-xs leading-6 text-ink-muted">
                Use a key with its own spending limit in your OpenRouter dashboard.
              </p>
              <Button
                type="submit"
                className="w-full rounded-xl"
                disabled={!apiKey.trim() || connecting}
              >
                {connecting ? (
                  <ActivityOrb state="working" size="sm" />
                ) : (
                  <PlugZap className="h-4 w-4" aria-hidden="true" />
                )}
                Validate and connect
              </Button>
            </form>
          )}

          {connectionError ? (
            <div
              className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm leading-7 text-destructive"
              role="alert"
            >
              {connectionError}
            </div>
          ) : null}
          {connectionNotice ? (
            <div
              className="mt-4 rounded-xl border border-primary/25 bg-brand-soft/55 px-4 py-3 text-sm leading-7"
              role="status"
              aria-live="polite"
            >
              {connectionNotice}
            </div>
          ) : null}
        </Surface>

        <Surface
          tone="muted"
          elevation="none"
          radius="xl"
          padding="sm"
          className="mt-4 text-xs leading-6 text-ink-muted"
        >
          <div className="flex items-start gap-3">
            <ShieldCheck
              className="mt-1 h-4 w-4 shrink-0 text-primary"
              aria-hidden="true"
            />
            <p>
              المفتاح محفوظ في Vault. اختيار النموذج يُتحقق منه مباشرةً قبل حفظ
              المعرّف في حسابك.
            </p>
          </div>
        </Surface>
      </aside>

      <section className="min-w-0 space-y-6">
        <div className="flex flex-col gap-4 border-b border-line/70 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-primary">Live model catalog</p>
            <h2 className="mt-2 font-arabic-heading text-3xl font-semibold">
              ابحث واختر نموذجاً متاحاً لحسابك
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-ink-muted">
              القائمة تُطلب مباشرةً من OpenRouter باستخدام مفتاحك. لا يوجد نموذج
              افتراضي مخفي أو قائمة ثابتة داخل التطبيق.
            </p>
          </div>
          {settings.modelId ? (
            <span className="max-w-full rounded-xl border border-line/70 bg-surface-raised px-4 py-3 text-xs shadow-surface-xs">
              <span className="text-ink-subtle">Current model</span>
              <span
                dir="ltr"
                className="mt-1 block max-w-[24rem] truncate font-mono font-semibold"
                title={settings.modelId}
              >
                {settings.modelId}
              </span>
            </span>
          ) : null}
        </div>

        {!settings.connected ? (
          <Surface
            tone="muted"
            elevation="none"
            radius="2xl"
            padding="lg"
            className="text-center"
          >
            <KeyRound className="mx-auto h-7 w-7 text-primary" aria-hidden="true" />
            <h3 className="mt-4 font-arabic-heading text-2xl font-semibold">
              اربط المفتاح أولاً
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-ink-muted">
              Connect an OpenRouter key to load the models available to that
              account.
            </p>
          </Surface>
        ) : (
          <>
            <Surface
              tone="raised"
              elevation="xs"
              radius="2xl"
              padding="sm"
            >
              <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_13rem_auto]">
                <label className="relative">
                  <span className="sr-only">Search OpenRouter models</span>
                  <Search
                    className="pointer-events-none absolute inset-y-0 start-4 my-auto h-4 w-4 text-ink-subtle"
                    aria-hidden="true"
                  />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    maxLength={200}
                    dir="auto"
                    placeholder="Search by model name or ID"
                    className="min-h-12 w-full rounded-xl border border-input bg-surface-raised ps-11 pe-4 text-sm outline-none placeholder:text-ink-subtle focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/20"
                  />
                </label>
                <label>
                  <span className="sr-only">Sort models</span>
                  <select
                    value={sort}
                    onChange={(event) =>
                      setSort(event.target.value as OpenRouterModelSort)
                    }
                    className="min-h-12 w-full rounded-xl border border-input bg-surface-raised px-4 text-sm outline-none focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/20"
                  >
                    <option value="name">Name</option>
                    <option value="newest">Newest</option>
                    <option value="context">Largest context</option>
                    <option value="prompt_price">Lowest input price</option>
                    <option value="completion_price">Lowest output price</option>
                  </select>
                </label>
                <label className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-input bg-surface-raised px-4 text-sm font-semibold">
                  <input
                    type="checkbox"
                    checked={freeOnly}
                    onChange={(event) => setFreeOnly(event.target.checked)}
                    className="h-4 w-4 accent-primary"
                  />
                  Free only
                </label>
              </div>

              <details className="mt-3 rounded-xl border border-line/70 bg-surface-sunken/45">
                <summary className="min-h-11 cursor-pointer px-4 py-3 text-xs font-semibold text-ink-muted outline-none focus-visible:ring-4 focus-visible:ring-ring/20">
                  اختيار متقدم بمعرّف نموذج دقيق
                </summary>
                <div className="flex flex-col gap-3 border-t border-line/70 p-4 sm:flex-row sm:items-end">
                  <label className="min-w-0 flex-1 space-y-2 text-xs font-semibold">
                    <span>Or paste an exact model ID</span>
                    <input
                      value={manualModelId}
                      onChange={(event) => setManualModelId(event.target.value)}
                      maxLength={255}
                      dir="ltr"
                      placeholder="author/model or author/model:free"
                      className="min-h-11 w-full rounded-xl border border-input bg-surface-raised px-3 font-mono text-xs outline-none focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/20"
                    />
                  </label>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-xl"
                    disabled={!manualModelId.trim() || Boolean(selectingModel)}
                    onClick={() => void selectModel(manualModelId.trim())}
                  >
                    Validate and use
                  </Button>
                </div>
              </details>
            </Surface>

            {catalogError ? (
              <div
                className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm leading-7 text-destructive"
                role="alert"
              >
                {catalogError}
              </div>
            ) : null}

            <div className="flex items-center justify-between gap-3 text-xs text-ink-muted">
              <span className="inline-flex items-center gap-2">
                {catalogLoading ? (
                  <ActivityOrb state="searching" size="sm" />
                ) : null}
                {catalogLoading
                  ? "Loading live models…"
                  : `${catalog?.total ?? 0} matching models`}
              </span>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="rounded-xl"
                disabled={catalogLoading}
                onClick={() => setRefreshIndex((value) => value + 1)}
              >
                <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                Refresh
              </Button>
            </div>

            {catalogLoading && !catalog ? (
              <Surface
                tone="muted"
                elevation="none"
                radius="2xl"
                padding="lg"
                className="flex min-h-64 flex-col items-center justify-center text-center"
              >
                <ActivityOrb state="searching" />
                <p className="mt-4 text-sm text-ink-muted">
                  جاري قراءة النماذج المتاحة لحسابك…
                </p>
              </Surface>
            ) : catalog?.models.length ? (
              <div className="grid gap-4 2xl:grid-cols-2">
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
              <Surface
                tone="muted"
                elevation="none"
                radius="2xl"
                padding="lg"
                className="text-center"
              >
                <Search className="mx-auto h-7 w-7 text-primary" aria-hidden="true" />
                <h3 className="mt-4 font-arabic-heading text-2xl font-semibold">
                  لا يوجد نموذج مطابق
                </h3>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-ink-muted">
                  No current model matches these live filters. Change the search
                  or clear the free-only filter.
                </p>
              </Surface>
            )}

            {settings.modelId && !currentModel && catalog ? (
              <p className="text-xs leading-6 text-ink-muted">
                The current model is saved but is outside this filtered result set.
              </p>
            ) : null}
          </>
        )}
      </section>
    </div>
  );
}
