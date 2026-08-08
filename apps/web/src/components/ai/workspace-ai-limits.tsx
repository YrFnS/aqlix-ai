"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Gauge,
  RefreshCw,
  Save,
  ShieldCheck,
} from "lucide-react";
import {
  workspaceAiLimitsSchema,
  type WorkspaceAiLimits,
  type WorkspaceRole,
} from "@iraqi-ai/types";
import { Button } from "@/components/ui/button";

interface WorkspaceAiLimitsPanelProps {
  workspaceId: string;
  initialLimits: WorkspaceAiLimits;
  workspaceRole: WorkspaceRole;
  workspaceArchived: boolean;
}

function number(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatReset(value: string): string {
  return new Intl.DateTimeFormat("ar-IQ", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function percent(used: number, limit: number): number {
  if (limit <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((used / limit) * 100)));
}

function UsageMeter({
  label,
  used,
  limit,
}: {
  label: string;
  used: number;
  limit: number;
}) {
  const value = percent(used, limit);

  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <div className="flex items-center justify-between gap-3 text-xs">
        <span className="font-semibold">{label}</span>
        <span dir="ltr" className="font-mono text-muted-foreground">
          {number(used)} / {number(limit)}
        </span>
      </div>
      <div
        className="mt-3 h-2 overflow-hidden rounded-full bg-secondary"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
      >
        <div
          className="h-full rounded-full bg-primary transition-[width]"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export function WorkspaceAiLimitsPanel({
  workspaceId,
  initialLimits,
  workspaceRole,
  workspaceArchived,
}: WorkspaceAiLimitsPanelProps) {
  const [limits, setLimits] = useState(initialLimits);
  const [form, setForm] = useState(() => ({
    enabled: initialLimits.enabled,
    dailyRequestLimit: initialLimits.dailyRequestLimit,
    dailyInputTokenLimit: initialLimits.dailyInputTokenLimit,
    dailyOutputTokenLimit: initialLimits.dailyOutputTokenLimit,
    maxConcurrentGenerations: initialLimits.maxConcurrentGenerations,
  }));
  const [isSaving, setIsSaving] = useState(false);
  const [notice, setNotice] = useState<{
    tone: "success" | "error";
    message: string;
  } | null>(null);

  const isOwner = workspaceRole === "owner";
  const canManage = isOwner && !workspaceArchived;
  const dirty = useMemo(
    () =>
      form.enabled !== limits.enabled ||
      form.dailyRequestLimit !== limits.dailyRequestLimit ||
      form.dailyInputTokenLimit !== limits.dailyInputTokenLimit ||
      form.dailyOutputTokenLimit !== limits.dailyOutputTokenLimit ||
      form.maxConcurrentGenerations !== limits.maxConcurrentGenerations,
    [form, limits],
  );

  const updateNumber = (
    field:
      | "dailyRequestLimit"
      | "dailyInputTokenLimit"
      | "dailyOutputTokenLimit"
      | "maxConcurrentGenerations",
    value: string,
  ) => {
    const parsed = Number.parseInt(value, 10);
    setForm((current) => ({
      ...current,
      [field]: Number.isFinite(parsed) ? parsed : 0,
    }));
    setNotice(null);
  };

  const save = async () => {
    if (!canManage || !dirty || isSaving) return;

    setIsSaving(true);
    setNotice(null);

    try {
      const response = await fetch(
        `/api/v1/workspaces/${workspaceId}/ai/limits`,
        {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(form),
        },
      );
      const payload = (await response.json()) as {
        ok?: boolean;
        data?: { limits?: unknown };
        error?: { message?: string };
      };

      if (!response.ok || payload.ok !== true) {
        throw new Error(
          payload.error?.message || "Workspace AI limits could not be saved.",
        );
      }

      const parsed = workspaceAiLimitsSchema.safeParse(payload.data?.limits);
      if (!parsed.success) {
        throw new Error("The saved AI-limit response is invalid.");
      }

      setLimits(parsed.data);
      setForm({
        enabled: parsed.data.enabled,
        dailyRequestLimit: parsed.data.dailyRequestLimit,
        dailyInputTokenLimit: parsed.data.dailyInputTokenLimit,
        dailyOutputTokenLimit: parsed.data.dailyOutputTokenLimit,
        maxConcurrentGenerations: parsed.data.maxConcurrentGenerations,
      });
      setNotice({
        tone: "success",
        message:
          "حُفظت حدود الذكاء الاصطناعي / Workspace AI limits saved.",
      });
    } catch (error) {
      setNotice({
        tone: "error",
        message:
          error instanceof Error
            ? error.message
            : "تعذر حفظ الحدود / AI-limit save failed.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-primary">
            P5 · Resource controls
          </p>
          <h2 className="mt-2 font-arabic-heading text-2xl font-semibold">
            حدود الاستخدام والتزامن
          </h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            تحمي هذه الحدود موارد Kiteb حتى عندما يستخدم كل شخص مفتاح OpenRouter
            الخاص به. هي حدود يومية داخل التطبيق وليست وعداً بتكلفة أو رصيد لدى
            OpenRouter.
          </p>
        </div>
        <div className="rounded-2xl bg-primary/10 p-3 text-primary">
          <Gauge className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <UsageMeter
          label="Requests today"
          used={limits.requestsUsed}
          limit={limits.dailyRequestLimit}
        />
        <UsageMeter
          label="Input tokens today"
          used={limits.inputTokensUsed}
          limit={limits.dailyInputTokenLimit}
        />
        <UsageMeter
          label="Output tokens today"
          used={limits.outputTokensUsed}
          limit={limits.dailyOutputTokenLimit}
        />
        <UsageMeter
          label="Active generations"
          used={limits.activeGenerations}
          limit={limits.maxConcurrentGenerations}
        />
      </div>

      <div className="mt-4 flex flex-col gap-2 rounded-2xl bg-secondary/45 p-4 text-xs leading-6 text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <span>
          Daily counters reset at {formatReset(limits.resetsAt)}.
        </span>
        <span className="inline-flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
          PostgreSQL permit authority
        </span>
      </div>

      {isOwner ? (
        <div className="mt-7 border-t border-border pt-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold">Owner controls</p>
              <p className="mt-1 text-xs leading-6 text-muted-foreground">
                New generations are denied before the provider call when a limit
                is reached.
              </p>
            </div>
            <label className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-background px-4 text-sm font-semibold">
              <input
                type="checkbox"
                checked={form.enabled}
                disabled={!canManage || isSaving}
                onChange={(event) => {
                  setForm((current) => ({
                    ...current,
                    enabled: event.target.checked,
                  }));
                  setNotice(null);
                }}
                className="h-4 w-4 accent-primary"
              />
              AI enabled
            </label>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm font-semibold">
              <span>Daily requests</span>
              <input
                type="number"
                min={1}
                max={10000}
                value={form.dailyRequestLimit}
                disabled={!canManage || isSaving}
                onChange={(event) =>
                  updateNumber("dailyRequestLimit", event.target.value)
                }
                className="min-h-12 w-full rounded-2xl border border-input bg-background px-4 text-sm font-normal outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:bg-secondary/45"
              />
            </label>

            <label className="space-y-2 text-sm font-semibold">
              <span>Maximum concurrent generations</span>
              <input
                type="number"
                min={1}
                max={20}
                value={form.maxConcurrentGenerations}
                disabled={!canManage || isSaving}
                onChange={(event) =>
                  updateNumber("maxConcurrentGenerations", event.target.value)
                }
                className="min-h-12 w-full rounded-2xl border border-input bg-background px-4 text-sm font-normal outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:bg-secondary/45"
              />
            </label>

            <label className="space-y-2 text-sm font-semibold">
              <span>Daily input tokens</span>
              <input
                type="number"
                min={1000}
                max={100000000}
                value={form.dailyInputTokenLimit}
                disabled={!canManage || isSaving}
                onChange={(event) =>
                  updateNumber("dailyInputTokenLimit", event.target.value)
                }
                className="min-h-12 w-full rounded-2xl border border-input bg-background px-4 text-sm font-normal outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:bg-secondary/45"
              />
            </label>

            <label className="space-y-2 text-sm font-semibold">
              <span>Daily output tokens</span>
              <input
                type="number"
                min={1000}
                max={100000000}
                value={form.dailyOutputTokenLimit}
                disabled={!canManage || isSaving}
                onChange={(event) =>
                  updateNumber("dailyOutputTokenLimit", event.target.value)
                }
                className="min-h-12 w-full rounded-2xl border border-input bg-background px-4 text-sm font-normal outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:bg-secondary/45"
              />
            </label>
          </div>

          {workspaceArchived && (
            <div className="mt-4 flex gap-3 rounded-2xl border border-border bg-secondary/45 p-4 text-sm leading-7 text-muted-foreground">
              <AlertTriangle
                className="mt-1 h-4 w-4 shrink-0"
                aria-hidden="true"
              />
              Restore the workspace before changing AI limits.
            </div>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button
              type="button"
              className="rounded-full"
              disabled={!canManage || !dirty || isSaving}
              onClick={() => void save()}
            >
              {isSaving ? (
                <RefreshCw
                  className="h-4 w-4 animate-spin"
                  aria-hidden="true"
                />
              ) : (
                <Save className="h-4 w-4" aria-hidden="true" />
              )}
              Save AI limits
            </Button>
            {dirty && (
              <span className="text-xs text-muted-foreground">
                Unsaved limit changes
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-6 rounded-2xl bg-secondary/45 p-4 text-sm leading-7 text-muted-foreground">
          Your {workspaceRole} role can inspect current usage. Only the workspace
          owner can change these limits.
        </div>
      )}

      {notice && (
        <div
          role={notice.tone === "error" ? "alert" : "status"}
          className={`mt-4 rounded-2xl border px-4 py-3 text-sm leading-7 ${
            notice.tone === "error"
              ? "border-destructive/30 bg-destructive/10 text-destructive"
              : "border-primary/30 bg-primary/10"
          }`}
        >
          {notice.message}
        </div>
      )}
    </section>
  );
}
