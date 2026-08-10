"use client";

import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import {
  Check,
  ChevronDown,
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

const INITIAL_MODEL_COUNT = 12;
const MODEL_PAGE_SIZE = 12;

function failureMessage(payload: ApiFailure, fallback: string): string {
  const fieldMessage = Object.values(payload.error?.fieldErrors ?? {})
    .flat()
    .find(Boolean);
  return (
    [payload.error?.message, fieldMessage].filter(Boolean).join(" · ") ||
    fallback
  );
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
    <article
      className={`rounded-3xl border p-5 transition-colors ${
        selected
          ? "border-primary/40 bg-primary/5"
          : "border-border/70 bg-card"
      }`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            {model.isFree && (
              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[0.68rem] font-semibold text-primary">
                مجاني
              </span>
            )}
            {selected && (
              <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[0.68rem] font-semibold">
                <Check className="h-3 w-3" aria-hidden="true" />
                النموذج الحالي
              </span>
            )}
          </div>
          <h3 dir="auto" className="mt-3 text-lg font-semibold">
            {model.name}
          </h3>
          <button
            type="button"
            dir="ltr"
            aria-label={copied ? "تم نسخ معرّف النموذج" : "نسخ معرّف النموذج"}
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
          </button>
        </div>

        <Button
          type="button"
          aria-label={selected ? "Selected" : "Use model"}
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
          {selected ? "مختار" : "استخدام النموذج"}
        </Button>
      </div>

      {model.description && (
        <p
          dir="auto"
          className="mt-4 line-clamp-2 text-sm leading-7 text-muted-foreground"
        >
          {model.description}
        </p>
      )}

      <details className="group mt-4 rounded-2xl border border-border/70 bg-background/65">
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-3 text-xs font-semibold outline-none focus-visible:ring-2 focus-visible:ring-primary [&::-webkit-details-marker]:hidden">
          التفاصيل والأسعار
          <ChevronDown
            className="h-3.5 w-3.5 text-muted-foreground transition-transform group-open:rotate-180"
            aria-hidden="true"
          />
        </summary>
        <dl className="grid grid-cols-2 gap-2 border-t border-border/70 p-3 text-xs sm:grid-cols-4">
          <div className="rounded-xl bg-secondary/55 p-3">
            <dt className="text-muted-foreground">حجم السياق</dt>
            <dd dir="ltr" className="mt-1 font-semibold">
              {formatInteger(model.contextLength)}
            </dd>
          </div>
          <div className="rounded-xl bg-secondary/55 p-3">
            <dt className="text-muted-foreground">الإدخال / مليون</dt>
            <dd dir="ltr" className="mt-1 font-semibold">
              {pricePerMillion(model.pricing.prompt)}
            </dd>
          </div>
          <div className="rounded-xl bg-secondary/55 p-3">
            <dt className="text-muted-foreground">الإخراج / مليون</dt>
            <dd dir="ltr" className="mt-1 font-semibold">
              {pricePerMillion(model.pricing.completion)}
            </dd>
          </div>
          <div className="rounded-xl bg-secondary/55 p-3">
            <dt className="text-muted-foreground">أنواع الإخراج</dt>
            <dd dir="ltr" className="mt-1 truncate font-semibold">
              {model.outputModalities.join(", ") || "text"}
            </dd>
          </div>
        </dl>
      </details>
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
  const [visibleCount, setVisibleCount] = useState(INITIAL_MODEL_COUNT);

  const currentModel = useMemo(
    () => catalog?.models.find((model) => model.id === settings.modelId) ?? null,
    [catalog, settings.modelId],
  );
  const orderedModels = useMemo(() => {
    const models = catalog?.models ?? [];
    if (!settings.modelId) return models;
    const selected = models.find((model) => model.id === settings.modelId);
    if (!selected) return models;
    return [selected, ...models.filter((model) => model.id !== selected.id)];
  }, [catalog, settings.modelId]);
  const visibleModels = orderedModels.slice(0, visibleCount);
  const hasMoreModels = visibleCount < orderedModels.length;

  useEffect(() => {
    setVisibleCount(INITIAL_MODEL_COUNT);
  }, [freeOnly, query, sort]);

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
            payload.error?.message || "تعذر تحميل قائمة النماذج المتاحة.",
          );
        }

        setCatalog(payload.data.catalog);
      } catch (error) {
        if (!controller.signal.aborted) {
          setCatalogError(
            error instanceof Error
              ? error.message
              : "تعذر تحميل قائمة النماذج المتاحة.",
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
            "تعذر التحقق من مفتاح OpenRouter.",
          ),
        );
      }

      setSettings(payload.data.settings);
      setApiKey("");
      setConnectionNotice(
        "تم التحقق من المفتاح وحفظه بأمان. اختر نموذجاً للبدء.",
      );
    } catch (error) {
      setConnectionError(
        error instanceof Error
          ? error.message
          : "تعذر التحقق من مفتاح OpenRouter.",
      );
    } finally {
      setConnecting(false);
    }
  };

  const disconnect = async () => {
    if (disconnecting) return;
    const confirmed = window.confirm(
      "هل تريد إزالة مفتاح OpenRouter والنموذج المختار من هذا الحساب؟",
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
          payload.error?.message || "تعذر فصل اتصال OpenRouter.",
        );
      }

      setSettings(payload.data.settings);
      setCatalog(null);
      setManualModelId("");
      setConnectionNotice("تم فصل المفتاح والنموذج المختار من الحساب.");
    } catch (error) {
      setConnectionError(
        error instanceof Error ? error.message : "تعذر فصل اتصال OpenRouter.",
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
            "تعذر اختيار هذا النموذج.",
          ),
        );
      }

      setSettings(payload.data.settings);
      setManualModelId("");
      setConnectionNotice(`تم اختيار النموذج: ${modelId}`);
    } catch (error) {
      setCatalogError(
        error instanceof Error ? error.message : "تعذر اختيار هذا النموذج.",
      );
    } finally {
      setSelectingModel(null);
    }
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[20rem_minmax(0,1fr)] xl:items-start">
      <aside className="xl:sticky xl:top-6">
        <section className="rounded-3xl border border-border/70 bg-card p-5 shadow-sm sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-primary">الاتصال</p>
              <h2 className="mt-1 font-arabic-heading text-xl font-semibold">
                مفتاح OpenRouter
              </h2>
            </div>
            <div className="rounded-2xl bg-primary/10 p-2.5 text-primary">
              <KeyRound className="h-4 w-4" aria-hidden="true" />
            </div>
          </div>
          <p className="mt-3 text-xs leading-6 text-muted-foreground">
            أدخل مفتاحك مرة واحدة. بعد التحقق لا تعرض الواجهة قيمته الكاملة مرة
            أخرى.
          </p>

          {settings.connected ? (
            <div className="mt-5 rounded-2xl border border-primary/25 bg-primary/5 p-4">
              <p className="inline-flex items-center gap-2 font-semibold">
                <ShieldCheck
                  className="h-4 w-4 text-primary"
                  aria-hidden="true"
                />
                متصل · •••• {settings.keyLastFour}
              </p>
              <p className="mt-2 text-xs leading-6 text-muted-foreground">
                {settings.keyLabel || "مفتاح OpenRouter"}
                {settings.isFreeTier === true ? " · مفتاح خطة مجانية" : ""}
              </p>
              {settings.modelId ? (
                <div className="mt-4 rounded-xl bg-background px-3 py-2.5 text-xs">
                  <p className="text-muted-foreground">النموذج الحالي</p>
                  <p
                    dir="ltr"
                    className="mt-1 truncate font-mono font-semibold"
                  >
                    {settings.modelId}
                  </p>
                </div>
              ) : (
                <p className="mt-4 text-xs leading-6 text-muted-foreground">
                  الاتصال جاهز. اختر نموذجاً من القائمة.
                </p>
              )}
              <Button
                type="button"
                aria-label="Disconnect"
                variant="outline"
                className="mt-4 w-full rounded-full"
                disabled={disconnecting}
                onClick={() => void disconnect()}
              >
                {disconnecting ? (
                  <RefreshCw
                    className="h-4 w-4 animate-spin"
                    aria-hidden="true"
                  />
                ) : (
                  <Unplug className="h-4 w-4" aria-hidden="true" />
                )}
                فصل الاتصال
              </Button>
            </div>
          ) : (
            <form onSubmit={connect} className="mt-5 space-y-4">
              <label className="space-y-2 text-sm font-semibold">
                <span>مفتاح OpenRouter API</span>
                <input
                  aria-label="OpenRouter API key"
                  value={apiKey}
                  onChange={(event) => setApiKey(event.target.value)}
                  type="password"
                  autoComplete="off"
                  spellCheck={false}
                  maxLength={512}
                  dir="ltr"
                  placeholder="OpenRouter key"
                  className="min-h-12 w-full rounded-2xl border border-input bg-background px-4 font-mono text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
              </label>
              <p className="text-xs leading-6 text-muted-foreground">
                استخدم مفتاحاً له حد إنفاق مستقل من لوحة OpenRouter الخاصة بك.
              </p>
              <Button
                type="submit"
                aria-label="Validate and connect"
                className="w-full rounded-full"
                disabled={!apiKey.trim() || connecting}
              >
                {connecting ? (
                  <RefreshCw
                    className="h-4 w-4 animate-spin"
                    aria-hidden="true"
                  />
                ) : (
                  <PlugZap className="h-4 w-4" aria-hidden="true" />
                )}
                تحقق واتصل
              </Button>
            </form>
          )}

          {connectionError && (
            <div
              className="mt-4 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm leading-7 text-destructive"
              role="alert"
            >
              {connectionError}
            </div>
          )}
          {connectionNotice && (
            <div
              className="mt-4 rounded-2xl border border-primary/25 bg-primary/10 px-4 py-3 text-sm leading-7"
              role="status"
            >
              {connectionNotice}
            </div>
          )}
        </section>
      </aside>

      <section className="min-w-0 rounded-3xl border border-border/70 bg-card p-5 shadow-sm sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold text-primary">اختيار النموذج</p>
            <h2 className="mt-1 font-arabic-heading text-2xl font-semibold">
              ابحث ثم اختر
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
              تظهر النماذج المتاحة لهذا الحساب مباشرةً، ويمكن تغيير الاختيار في
              أي وقت.
            </p>
          </div>
          {settings.modelId && (
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
              نموذج مختار
            </span>
          )}
        </div>

        {!settings.connected ? (
          <div className="mt-6 rounded-3xl border border-dashed border-border bg-secondary/25 p-8 text-center text-sm leading-7 text-muted-foreground">
            اربط مفتاح OpenRouter أولاً لعرض النماذج المتاحة لهذا الحساب.
          </div>
        ) : (
          <>
            <div className="mt-6 grid gap-3 lg:grid-cols-[minmax(0,1fr)_12rem_auto]">
              <label className="relative">
                <span className="sr-only">Search OpenRouter models</span>
                <Search
                  className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <input
                  aria-label="Search OpenRouter models"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  maxLength={200}
                  dir="auto"
                  placeholder="ابحث باسم النموذج أو المعرّف"
                  className="min-h-12 w-full rounded-2xl border border-input bg-background pl-11 pr-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
              </label>
              <label>
                <span className="sr-only">Sort models</span>
                <select
                  aria-label="Sort models"
                  value={sort}
                  onChange={(event) =>
                    setSort(event.target.value as OpenRouterModelSort)
                  }
                  className="min-h-12 w-full rounded-2xl border border-input bg-background px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <option value="name">الاسم</option>
                  <option value="newest">الأحدث</option>
                  <option value="context">أكبر سياق</option>
                  <option value="prompt_price">أقل سعر إدخال</option>
                  <option value="completion_price">أقل سعر إخراج</option>
                </select>
              </label>
              <label className="inline-flex min-h-12 items-center gap-2 rounded-2xl border border-input bg-background px-4 text-sm font-semibold">
                <input
                  aria-label="Free only"
                  type="checkbox"
                  checked={freeOnly}
                  onChange={(event) => setFreeOnly(event.target.checked)}
                  className="h-4 w-4 accent-primary"
                />
                النماذج المجانية فقط
              </label>
            </div>

            <details className="group mt-3 rounded-2xl border border-border/70 bg-secondary/25">
              <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-primary [&::-webkit-details-marker]:hidden">
                اختيار نموذج بمعرّفه الكامل
                <ChevronDown
                  className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <div className="flex flex-col gap-3 border-t border-border/70 p-4 sm:flex-row sm:items-end">
                <label className="flex-1 space-y-2 text-xs font-semibold">
                  <span>الصق معرّف النموذج الكامل</span>
                  <input
                    aria-label="Exact model ID"
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
                  aria-label="Validate and use"
                  variant="outline"
                  className="rounded-full"
                  disabled={!manualModelId.trim() || Boolean(selectingModel)}
                  onClick={() => void selectModel(manualModelId.trim())}
                >
                  تحقق واستخدم
                </Button>
              </div>
            </details>

            {catalogError && (
              <div
                className="mt-4 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm leading-7 text-destructive"
                role="alert"
              >
                {catalogError}
              </div>
            )}

            <div className="mt-5 flex items-center justify-between gap-3 text-xs text-muted-foreground">
              <span>
                {catalogLoading
                  ? "جاري تحميل النماذج…"
                  : `${catalog?.total ?? 0} نموذج مطابق`}
              </span>
              <Button
                type="button"
                aria-label="Refresh"
                size="sm"
                variant="ghost"
                className="rounded-full"
                disabled={catalogLoading}
                onClick={() => setRefreshIndex((value) => value + 1)}
              >
                <RefreshCw
                  className={
                    catalogLoading
                      ? "h-3.5 w-3.5 animate-spin"
                      : "h-3.5 w-3.5"
                  }
                  aria-hidden="true"
                />
                تحديث
              </Button>
            </div>

            {catalogLoading && !catalog ? (
              <div className="mt-5 flex min-h-64 items-center justify-center rounded-3xl border border-dashed border-border">
                <RefreshCw
                  className="h-6 w-6 animate-spin text-primary"
                  aria-hidden="true"
                />
              </div>
            ) : visibleModels.length ? (
              <div className="mt-5 grid gap-4 2xl:grid-cols-2">
                {visibleModels.map((model) => (
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
              <div className="mt-5 rounded-3xl border border-dashed border-border bg-secondary/25 p-8 text-center text-sm leading-7 text-muted-foreground">
                لا يوجد نموذج يطابق عوامل التصفية الحالية. غيّر البحث أو ألغِ
                خيار النماذج المجانية فقط.
              </div>
            )}

            {hasMoreModels && (
              <div className="mt-5 flex justify-center">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full px-7"
                  onClick={() =>
                    setVisibleCount((value) => value + MODEL_PAGE_SIZE)
                  }
                >
                  عرض المزيد من النماذج
                </Button>
              </div>
            )}

            {settings.modelId && !currentModel && catalog && (
              <p className="mt-4 text-xs leading-6 text-muted-foreground">
                النموذج الحالي محفوظ، لكنه لا يظهر ضمن نتائج التصفية الحالية.
              </p>
            )}
          </>
        )}
      </section>
    </div>
  );
}
