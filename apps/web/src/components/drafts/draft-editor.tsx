"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  Archive,
  ArchiveRestore,
  Check,
  Clipboard,
  Download,
  ExternalLink,
  FileClock,
  FileWarning,
  GitBranch,
  LoaderCircle,
  Quote,
  RotateCcw,
  Save,
  Send,
  Sparkles,
  Square,
  Trash2,
  X,
} from "lucide-react";
import type {
  DraftDetail,
  DraftGeneration,
  DraftGenerationAction,
  DraftKind,
  DraftProposalStreamEvent,
} from "@iraqi-ai/types";
import {
  draftDetailSchema,
  draftProposalStreamEventSchema,
} from "@iraqi-ai/types";
import { Button } from "@/components/ui/button";
import {
  draftEditorValue,
  isDraftEditorDirty,
  type DraftEditorValue,
} from "@/lib/drafts/editor-state";

interface DraftEditorProps {
  workspaceId: string;
  initialDetail: DraftDetail;
  canEdit: boolean;
  canManageLifecycle: boolean;
  workspaceArchived: boolean;
}

type Notice = {
  tone: "success" | "error" | "info";
  message: string;
} | null;

const kindOptions: Array<{ value: DraftKind; label: string }> = [
  { value: "freeform", label: "مسودة حرة" },
  { value: "summary", label: "ملخص" },
  { value: "comparison", label: "مقارنة" },
  { value: "email", label: "رسالة" },
  { value: "memo", label: "مذكرة" },
  { value: "checklist", label: "قائمة عمل" },
  { value: "decision_note", label: "ملاحظة قرار" },
];

const actionOptions: Array<{
  value: DraftGenerationAction;
  label: string;
  instruction: string;
}> = [
  {
    value: "improve",
    label: "تحسين الوضوح",
    instruction: "Improve clarity and structure while preserving the meaning.",
  },
  {
    value: "shorten",
    label: "اختصار",
    instruction: "Shorten the draft without losing its essential meaning.",
  },
  {
    value: "expand",
    label: "توسيع",
    instruction: "Expand the draft with useful detail and better transitions.",
  },
  {
    value: "translate_ar",
    label: "ترجمة إلى العربية",
    instruction: "Translate the complete draft into clear Arabic.",
  },
  {
    value: "translate_en",
    label: "Translate to English",
    instruction: "Translate the complete draft into clear English.",
  },
  {
    value: "continue",
    label: "متابعة الكتابة",
    instruction: "Continue the draft naturally from its current ending.",
  },
  {
    value: "custom",
    label: "تعليمات مخصصة",
    instruction: "Revise the draft according to this instruction.",
  },
];

function mergeGeneration(
  detail: DraftDetail,
  generation: DraftGeneration,
): DraftDetail {
  const byId = new Map(
    detail.generations.map((candidate) => [candidate.id, candidate]),
  );
  byId.set(generation.id, generation);

  return {
    ...detail,
    generations: Array.from(byId.values()).sort((left, right) =>
      right.createdAt.localeCompare(left.createdAt),
    ),
  };
}

async function parseEventStream(
  response: Response,
  onEvent: (event: DraftProposalStreamEvent) => void,
): Promise<void> {
  if (!response.body) throw new Error("The proposal stream is unavailable.");

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  const processFrame = (frame: string) => {
    const data = frame
      .split(/\r?\n/u)
      .filter((line) => line.startsWith("data:"))
      .map((line) => line.slice(5).trimStart())
      .join("\n")
      .trim();

    if (!data) return;

    let value: unknown;
    try {
      value = JSON.parse(data);
    } catch {
      throw new Error("The server returned an invalid proposal event.");
    }

    const parsed = draftProposalStreamEventSchema.safeParse(value);
    if (!parsed.success) {
      throw new Error("The server returned an unsupported proposal event.");
    }

    onEvent(parsed.data);
  };

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      while (true) {
        const boundary = buffer.match(/\r?\n\r?\n/u);
        if (!boundary || boundary.index === undefined) break;

        const frame = buffer.slice(0, boundary.index);
        buffer = buffer.slice(boundary.index + boundary[0].length);
        processFrame(frame);
      }
    }

    buffer += decoder.decode();
    if (buffer.trim()) processFrame(buffer);
  } finally {
    reader.releaseLock();
  }
}

function formatTimestamp(value: string): string {
  return new Intl.DateTimeFormat("ar-IQ", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function provenanceLocator(
  provenance: DraftDetail["provenance"][number],
): string {
  if (provenance.pageNumberSnapshot) {
    return `صفحة ${provenance.pageNumberSnapshot}`;
  }
  if (provenance.startLineSnapshot && provenance.endLineSnapshot) {
    return `الأسطر ${provenance.startLineSnapshot}–${provenance.endLineSnapshot}`;
  }
  return `المقطع ${provenance.sourceOrdinalSnapshot + 1}`;
}

function generationLabel(status: DraftGeneration["status"]): string {
  const labels: Record<DraftGeneration["status"], string> = {
    pending: "بانتظار المزود",
    streaming: "جاري الاقتراح",
    complete: "جاهز للمراجعة",
    failed: "فشل",
    cancelled: "أُلغي وحُفظ الجزئي",
    applied: "طُبق",
    discarded: "رُفض",
  };
  return labels[status];
}

export function DraftEditor({
  workspaceId,
  initialDetail,
  canEdit,
  canManageLifecycle,
  workspaceArchived,
}: DraftEditorProps) {
  const router = useRouter();
  const [detail, setDetail] = useState(initialDetail);
  const [editor, setEditor] = useState<DraftEditorValue>(() =>
    draftEditorValue(initialDetail.draft),
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice>(null);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">(
    "idle",
  );
  const [action, setAction] = useState<DraftGenerationAction>("improve");
  const [instruction, setInstruction] = useState(
    actionOptions[0]?.instruction ?? "Improve the draft.",
  );
  const [proposal, setProposal] = useState<DraftGeneration | null>(() =>
    initialDetail.generations.find((generation) =>
      ["pending", "streaming", "complete", "failed", "cancelled"].includes(
        generation.status,
      ),
    ) ?? null,
  );
  const [proposalText, setProposalText] = useState(
    proposal?.proposedContent ?? "",
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [proposalError, setProposalError] = useState<string | null>(null);
  const proposalController = useRef<AbortController | null>(null);

  const dirty = useMemo(
    () => isDraftEditorDirty(detail.draft, editor),
    [detail.draft, editor],
  );
  const saveState = isSaving
    ? "saving"
    : saveError
      ? "error"
      : dirty
        ? "unsaved"
        : "saved";

  const updateEditor = (patch: Partial<DraftEditorValue>) => {
    setEditor((current) => ({ ...current, ...patch }));
    setSaveError(null);
    setNotice(null);
  };

  const acceptDetail = useCallback((next: DraftDetail) => {
    setDetail(next);
    setEditor(draftEditorValue(next.draft));
    setSaveError(null);
  }, []);

  const reloadDetail = useCallback(async (): Promise<DraftDetail> => {
    const response = await fetch(
      `/api/v1/workspaces/${workspaceId}/drafts/${detail.draft.id}`,
      { cache: "no-store" },
    );
    const payload = (await response.json()) as {
      ok?: boolean;
      data?: { detail?: unknown };
      error?: { message?: string };
    };

    if (!response.ok || payload.ok !== true) {
      throw new Error(payload.error?.message || "Draft state could not be reloaded.");
    }

    const parsed = draftDetailSchema.safeParse(payload.data?.detail);
    if (!parsed.success) {
      throw new Error("Draft state returned an invalid shape.");
    }

    setDetail(parsed.data);
    return parsed.data;
  }, [detail.draft.id, workspaceId]);

  const saveDraft = useCallback(async () => {
    if (!canEdit || !dirty || isSaving) return;

    setIsSaving(true);
    setSaveError(null);
    setNotice(null);

    try {
      const response = await fetch(
        `/api/v1/workspaces/${workspaceId}/drafts/${detail.draft.id}`,
        {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            expectedVersion: detail.draft.currentVersion,
            ...editor,
          }),
        },
      );
      const payload = (await response.json()) as {
        ok?: boolean;
        data?: { detail?: unknown; createdVersion?: boolean };
        error?: { message?: string };
      };

      if (!response.ok || payload.ok !== true) {
        throw new Error(payload.error?.message || "The draft could not be saved.");
      }

      const parsed = draftDetailSchema.safeParse(payload.data?.detail);
      if (!parsed.success) {
        throw new Error("The saved draft returned an invalid shape.");
      }

      acceptDetail(parsed.data);
      setNotice({
        tone: "success",
        message: payload.data?.createdVersion
          ? "حُفظ إصدار جديد / New immutable version saved."
          : "لا توجد تغييرات جديدة للحفظ / No new changes to save.",
      });
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "تعذر حفظ المسودة / Draft save failed.";
      setSaveError(message);
      setNotice({ tone: "error", message });
    } finally {
      setIsSaving(false);
    }
  }, [
    acceptDetail,
    canEdit,
    detail.draft.currentVersion,
    detail.draft.id,
    dirty,
    editor,
    isSaving,
    router,
    workspaceId,
  ]);

  useEffect(() => {
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!dirty) return;
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  useEffect(() => {
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        void saveDraft();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [saveDraft]);

  const copyEditor = async () => {
    try {
      await navigator.clipboard.writeText(editor.content);
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 1800);
    } catch {
      setCopyState("failed");
    }
  };

  const download = (format: "txt" | "md" | "html") => {
    if (dirty) {
      setNotice({
        tone: "error",
        message:
          "احفظ التغييرات قبل التصدير / Save changes before exporting the accepted version.",
      });
      return;
    }

    window.location.assign(
      `/api/v1/workspaces/${workspaceId}/drafts/${detail.draft.id}/export?format=${format}`,
    );
  };

  const restoreVersion = async (versionNumber: number) => {
    if (!canEdit || dirty || isSaving) {
      if (dirty) {
        setNotice({
          tone: "error",
          message:
            "احفظ أو ألغِ تغييرات المحرر قبل استعادة إصدار / Save or clear editor changes before restoring a version.",
        });
      }
      return;
    }

    setIsSaving(true);
    setNotice(null);
    try {
      const response = await fetch(
        `/api/v1/workspaces/${workspaceId}/drafts/${detail.draft.id}/versions`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            expectedVersion: detail.draft.currentVersion,
            restoreVersion: versionNumber,
          }),
        },
      );
      const payload = (await response.json()) as {
        ok?: boolean;
        data?: { detail?: unknown };
        error?: { message?: string };
      };
      if (!response.ok || payload.ok !== true) {
        throw new Error(payload.error?.message || "Version restore failed.");
      }

      const parsed = draftDetailSchema.safeParse(payload.data?.detail);
      if (!parsed.success) throw new Error("Restored draft returned an invalid shape.");
      acceptDetail(parsed.data);
      setNotice({
        tone: "success",
        message:
          "أُعيدت النسخة كإصدار جديد / Snapshot restored as a new immutable version.",
      });
      router.refresh();
    } catch (error) {
      setNotice({
        tone: "error",
        message:
          error instanceof Error ? error.message : "Version restore failed.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const setArchived = async (archived: boolean) => {
    if (!canManageLifecycle || dirty || isGenerating) {
      if (dirty) {
        setNotice({
          tone: "error",
          message:
            "احفظ التغييرات قبل تغيير حالة المسودة / Save changes before changing draft state.",
        });
      }
      return;
    }

    try {
      const response = await fetch(
        `/api/v1/workspaces/${workspaceId}/drafts/${detail.draft.id}/archive`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ archived }),
        },
      );
      const payload = (await response.json()) as {
        ok?: boolean;
        error?: { message?: string };
      };
      if (!response.ok || payload.ok !== true) {
        throw new Error(payload.error?.message || "Draft lifecycle failed.");
      }

      if (archived) {
        router.push(`/workspaces/${workspaceId}/drafts?status=archived`);
      } else {
        router.push(
          `/workspaces/${workspaceId}/drafts/${detail.draft.id}?status=reopened`,
        );
      }
      router.refresh();
    } catch (error) {
      setNotice({
        tone: "error",
        message:
          error instanceof Error ? error.message : "Draft lifecycle failed.",
      });
    }
  };

  const removeDraft = async () => {
    if (!canManageLifecycle || dirty || isGenerating) return;
    const confirmed = window.confirm(
      "حذف المسودة وكل إصداراتها ومحاولات الاستمرار؟\n\nDelete this draft, every version, and every proposal?",
    );
    if (!confirmed) return;

    try {
      const response = await fetch(
        `/api/v1/workspaces/${workspaceId}/drafts/${detail.draft.id}`,
        { method: "DELETE" },
      );
      const payload = (await response.json()) as {
        ok?: boolean;
        error?: { message?: string };
      };
      if (!response.ok || payload.ok !== true) {
        throw new Error(payload.error?.message || "Draft deletion failed.");
      }

      router.push(`/workspaces/${workspaceId}/drafts?status=deleted`);
      router.refresh();
    } catch (error) {
      setNotice({
        tone: "error",
        message:
          error instanceof Error ? error.message : "Draft deletion failed.",
      });
    }
  };

  const startProposal = async () => {
    if (!canEdit || isGenerating) return;
    if (dirty) {
      setProposalError(
        "احفظ التغييرات قبل طلب اقتراح / Save the accepted draft before requesting a proposal.",
      );
      return;
    }

    const boundedInstruction = instruction.trim();
    if (!boundedInstruction) {
      setProposalError("تعليمات الاستمرار مطلوبة / A revision instruction is required.");
      return;
    }

    const controller = new AbortController();
    proposalController.current = controller;
    setIsGenerating(true);
    setProposalError(null);
    setProposal(null);
    setProposalText("");

    try {
      const response = await fetch(
        `/api/v1/workspaces/${workspaceId}/drafts/${detail.draft.id}/continue/stream`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ action, instruction: boundedInstruction }),
          signal: controller.signal,
        },
      );
      const contentType = response.headers.get("content-type") ?? "";
      if (!response.ok || !contentType.includes("text/event-stream")) {
        const payload = (await response.json().catch(() => null)) as {
          error?: { message?: string };
        } | null;
        throw new Error(
          payload?.error?.message ||
            `Draft proposal failed with status ${response.status}.`,
        );
      }

      await parseEventStream(response, (event) => {
        if (event.type === "ready") {
          setProposal(event.generation);
          setProposalText(event.generation.proposedContent);
          setDetail((current) => mergeGeneration(current, event.generation));
          return;
        }

        if (event.type === "delta") {
          setProposalText((current) => `${current}${event.delta}`);
          setProposal((current) =>
            current
              ? {
                  ...current,
                  status: "streaming",
                  proposedContent: `${current.proposedContent}${event.delta}`,
                }
              : current,
          );
          return;
        }

        if (
          event.type === "complete" ||
          event.type === "failed" ||
          event.type === "cancelled"
        ) {
          setProposal(event.generation);
          setProposalText(event.generation.proposedContent);
          setDetail((current) => mergeGeneration(current, event.generation));
          if (event.type === "failed") {
            setProposalError(
              `${event.code}: ${event.generation.failureMessage ?? "Proposal failed."}`,
            );
          }
        }
      });
    } catch (error) {
      if (controller.signal.aborted) {
        await new Promise((resolve) => window.setTimeout(resolve, 250));
        try {
          const refreshed = await reloadDetail();
          const latest = refreshed.generations[0] ?? null;
          setProposal(latest);
          setProposalText(latest?.proposedContent ?? "");
        } catch {
          setProposalError(
            "أُوقف الاقتراح لكن تعذر تحديث حالته المحفوظة / Proposal stopped, but saved state could not be refreshed.",
          );
        }
      } else {
        setProposalError(
          error instanceof Error ? error.message : "Draft proposal failed.",
        );
      }
    } finally {
      proposalController.current = null;
      setIsGenerating(false);
    }
  };

  const applyProposal = async () => {
    if (!proposal || proposal.status !== "complete" || dirty) return;

    try {
      const response = await fetch(
        `/api/v1/workspaces/${workspaceId}/drafts/${detail.draft.id}/continue/${proposal.id}/apply`,
        { method: "POST" },
      );
      const payload = (await response.json()) as {
        ok?: boolean;
        data?: { detail?: unknown };
        error?: { message?: string };
      };
      if (!response.ok || payload.ok !== true) {
        throw new Error(payload.error?.message || "Proposal apply failed.");
      }

      const parsed = draftDetailSchema.safeParse(payload.data?.detail);
      if (!parsed.success) throw new Error("Applied draft returned an invalid shape.");
      acceptDetail(parsed.data);
      setProposal(null);
      setProposalText("");
      setNotice({
        tone: "success",
        message:
          "طُبق الاقتراح كإصدار جديد / Proposal applied as a new immutable version.",
      });
      router.refresh();
    } catch (error) {
      setProposalError(
        error instanceof Error ? error.message : "Proposal apply failed.",
      );
    }
  };

  const discardProposal = async () => {
    if (!proposal || proposal.status !== "complete") return;

    try {
      const response = await fetch(
        `/api/v1/workspaces/${workspaceId}/drafts/${detail.draft.id}/continue/${proposal.id}/discard`,
        { method: "POST" },
      );
      const payload = (await response.json()) as {
        ok?: boolean;
        data?: { detail?: unknown };
        error?: { message?: string };
      };
      if (!response.ok || payload.ok !== true) {
        throw new Error(payload.error?.message || "Proposal discard failed.");
      }

      const parsed = draftDetailSchema.safeParse(payload.data?.detail);
      if (!parsed.success) throw new Error("Discarded draft returned an invalid shape.");
      setDetail(parsed.data);
      setProposal(null);
      setProposalText("");
      setNotice({
        tone: "info",
        message:
          "رُفض الاقتراح وبقي العمل المقبول دون تغيير / Proposal discarded; accepted work is unchanged.",
      });
      router.refresh();
    } catch (error) {
      setProposalError(
        error instanceof Error ? error.message : "Proposal discard failed.",
      );
    }
  };

  const draftArchived = detail.draft.status === "archived";
  const latestVersions = detail.versions;

  return (
    <div className="space-y-6">
      {notice && (
        <div
          role={notice.tone === "error" ? "alert" : "status"}
          className={`rounded-2xl border px-4 py-3 text-sm leading-7 ${
            notice.tone === "error"
              ? "border-destructive/30 bg-destructive/10 text-destructive"
              : notice.tone === "success"
                ? "border-primary/30 bg-primary/10 text-foreground"
                : "border-border bg-secondary/60 text-muted-foreground"
          }`}
        >
          {notice.message}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <section className="rounded-3xl border border-border/70 bg-card p-5 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-primary">المحرر المقبول</p>
              <h2 className="mt-2 font-arabic-heading text-2xl font-semibold">
                الإصدار {detail.draft.currentVersion}
              </h2>
            </div>
            <div
              className={`inline-flex min-h-10 items-center gap-2 rounded-full px-3 text-xs font-semibold ${
                saveState === "saved"
                  ? "bg-primary/10 text-primary"
                  : saveState === "error"
                    ? "bg-destructive/10 text-destructive"
                    : "bg-secondary text-muted-foreground"
              }`}
              role="status"
              aria-live="polite"
            >
              {saveState === "saving" ? (
                <LoaderCircle className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
              ) : saveState === "saved" ? (
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
              ) : saveState === "error" ? (
                <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
              ) : (
                <FileClock className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              {saveState === "saving"
                ? "جاري الحفظ"
                : saveState === "saved"
                  ? "محفوظ"
                  : saveState === "error"
                    ? "فشل الحفظ"
                    : "تغييرات غير محفوظة"}
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm font-semibold sm:col-span-2">
              <span>العنوان</span>
              <input
                value={editor.title}
                onChange={(event) => updateEditor({ title: event.target.value })}
                maxLength={200}
                readOnly={!canEdit}
                dir="auto"
                className="min-h-12 w-full rounded-2xl border border-input bg-background px-4 text-sm font-normal outline-none focus-visible:ring-2 focus-visible:ring-primary read-only:cursor-default read-only:bg-secondary/45"
              />
            </label>

            <label className="space-y-2 text-sm font-semibold">
              <span>نوع العمل</span>
              <select
                value={editor.kind}
                onChange={(event) =>
                  updateEditor({ kind: event.target.value as DraftKind })
                }
                disabled={!canEdit}
                className="min-h-12 w-full rounded-2xl border border-input bg-background px-4 text-sm font-normal outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:bg-secondary/45"
              >
                {kindOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2 text-sm font-semibold">
              <span>اتجاه المحتوى</span>
              <select
                value={editor.direction}
                onChange={(event) =>
                  updateEditor({
                    direction: event.target.value as "auto" | "rtl" | "ltr",
                  })
                }
                disabled={!canEdit}
                className="min-h-12 w-full rounded-2xl border border-input bg-background px-4 text-sm font-normal outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:bg-secondary/45"
              >
                <option value="auto">تلقائي</option>
                <option value="rtl">RTL</option>
                <option value="ltr">LTR</option>
              </select>
            </label>

            <label className="space-y-2 text-sm font-semibold sm:col-span-2">
              <span>المحتوى</span>
              <textarea
                value={editor.content}
                onChange={(event) => updateEditor({ content: event.target.value })}
                maxLength={100000}
                rows={22}
                readOnly={!canEdit}
                dir={editor.direction}
                className="w-full resize-y rounded-3xl border border-input bg-background px-5 py-4 text-sm font-normal leading-8 outline-none focus-visible:ring-2 focus-visible:ring-primary read-only:cursor-default read-only:bg-secondary/35"
              />
            </label>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-6 text-muted-foreground">
              {editor.content.length.toLocaleString("ar-IQ")} / 100,000 · Ctrl/Cmd+S
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                className="rounded-full"
                onClick={() => void copyEditor()}
              >
                <Clipboard className="h-4 w-4" aria-hidden="true" />
                {copyState === "copied"
                  ? "نُسخ"
                  : copyState === "failed"
                    ? "فشل النسخ"
                    : "نسخ"}
              </Button>
              {canEdit && (
                <Button
                  type="button"
                  className="rounded-full"
                  disabled={!dirty || isSaving}
                  onClick={() => void saveDraft()}
                >
                  {isSaving ? (
                    <LoaderCircle
                      className="h-4 w-4 animate-spin"
                      aria-hidden="true"
                    />
                  ) : (
                    <Save className="h-4 w-4" aria-hidden="true" />
                  )}
                  حفظ إصدار
                </Button>
              )}
            </div>
          </div>

          {saveError && (
            <p className="mt-3 text-sm leading-7 text-destructive" role="alert">
              {saveError}
            </p>
          )}
        </section>

        <aside className="space-y-6">
          <section className="rounded-3xl border border-border/70 bg-card p-5 sm:p-6">
            <p className="text-sm font-semibold text-primary">المنشأ</p>
            <h2 className="mt-2 font-arabic-heading text-xl font-semibold">
              المحادثة والمراجع
            </h2>

            {detail.draft.conversationId && (
              <Link
                href={`/workspaces/${workspaceId}/conversations/${detail.draft.conversationId}`}
                className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-full border border-border bg-background px-4 text-xs font-semibold transition-colors hover:bg-secondary"
              >
                فتح المحادثة الأصلية
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            )}

            {detail.provenance.length > 0 ? (
              <div className="mt-5 space-y-3">
                {detail.provenance.map((provenance) => {
                  const body = (
                    <>
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 font-mono text-[0.65rem] font-semibold text-primary">
                        [{provenance.label}]
                      </span>
                      <span dir="auto" className="min-w-0 flex-1 truncate">
                        {provenance.fileNameSnapshot}
                      </span>
                      <span className="text-muted-foreground">
                        {provenanceLocator(provenance)}
                      </span>
                    </>
                  );

                  if (provenance.sourceId && provenance.attachmentId) {
                    return (
                      <Link
                        key={provenance.id}
                        href={`/workspaces/${workspaceId}/sources/${provenance.attachmentId}#source-${provenance.sourceId}`}
                        className="flex min-h-11 items-center gap-2 rounded-2xl border border-border bg-background px-3 py-2 text-xs transition-colors hover:border-primary/40 hover:bg-secondary"
                      >
                        {body}
                        <ExternalLink
                          className="h-3.5 w-3.5 shrink-0"
                          aria-hidden="true"
                        />
                      </Link>
                    );
                  }

                  return (
                    <div
                      key={provenance.id}
                      className="flex min-h-11 items-center gap-2 rounded-2xl border border-dashed border-border bg-secondary/45 px-3 py-2 text-xs"
                      title="The original source is no longer available."
                    >
                      {body}
                      <FileWarning
                        className="h-3.5 w-3.5 shrink-0 text-muted-foreground"
                        aria-hidden="true"
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="mt-5 text-sm leading-7 text-muted-foreground">
                أُنشئت هذه المسودة من إجابة بلا مراجع محفوظة. لا تُعرض على أنها
                موثقة تلقائياً.
              </p>
            )}
          </section>

          <section className="rounded-3xl border border-border/70 bg-card p-5 sm:p-6">
            <p className="text-sm font-semibold text-primary">التصدير</p>
            <h2 className="mt-2 font-arabic-heading text-xl font-semibold">
              UTF-8 فقط في P4
            </h2>
            <p className="mt-3 text-xs leading-6 text-muted-foreground">
              التصدير يستخدم آخر إصدار محفوظ. HTML مستقل وآمن بلا scripts أو
              موارد خارجية. PDF وDOCX غير مفعّلين.
            </p>
            <div className="mt-5 grid grid-cols-3 gap-2">
              {(["txt", "md", "html"] as const).map((format) => (
                <Button
                  key={format}
                  type="button"
                  variant="outline"
                  className="rounded-2xl px-2 uppercase"
                  onClick={() => download(format)}
                >
                  <Download className="h-3.5 w-3.5" aria-hidden="true" />
                  {format}
                </Button>
              ))}
            </div>
          </section>
        </aside>
      </div>

      <section className="rounded-3xl border border-primary/25 bg-card p-5 shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-primary">Continue with AI</p>
            <h2 className="mt-2 font-arabic-heading text-2xl font-semibold">
              اقتراح منفصل لا يكتب فوق عملك
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              يقرأ المزود آخر إصدار مقبول فقط. الاقتراح المتدفق يبقى منفصلاً حتى
              تطبيقه كإصدار جديد، ويمكن رفضه أو إيقافه مع حفظ النص الجزئي.
            </p>
          </div>
          <div className="rounded-2xl bg-primary/10 p-3 text-primary">
            <Sparkles className="h-5 w-5" aria-hidden="true" />
          </div>
        </div>

        {canEdit ? (
          <div className="mt-6 grid gap-5 xl:grid-cols-[0.7fr_1.3fr]">
            <div className="space-y-4">
              <label className="space-y-2 text-sm font-semibold">
                <span>الإجراء</span>
                <select
                  value={action}
                  disabled={isGenerating}
                  onChange={(event) => {
                    const nextAction = event.target.value as DraftGenerationAction;
                    setAction(nextAction);
                    const option = actionOptions.find(
                      (candidate) => candidate.value === nextAction,
                    );
                    setInstruction(option?.instruction ?? "Revise the draft.");
                    setProposalError(null);
                  }}
                  className="min-h-12 w-full rounded-2xl border border-input bg-background px-4 text-sm font-normal outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {actionOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2 text-sm font-semibold">
                <span>التعليمات</span>
                <textarea
                  value={instruction}
                  onChange={(event) => setInstruction(event.target.value)}
                  maxLength={2000}
                  rows={6}
                  disabled={isGenerating}
                  dir="auto"
                  className="w-full resize-y rounded-2xl border border-input bg-background px-4 py-3 text-sm font-normal leading-7 outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
              </label>

              {isGenerating ? (
                <Button
                  type="button"
                  variant="destructive"
                  className="w-full rounded-full"
                  onClick={() =>
                    proposalController.current?.abort(
                      new DOMException("Cancelled by user", "AbortError"),
                    )
                  }
                >
                  <Square className="h-4 w-4" aria-hidden="true" />
                  إيقاف وحفظ الجزئي
                </Button>
              ) : (
                <Button
                  type="button"
                  className="w-full rounded-full"
                  disabled={!instruction.trim() || dirty}
                  onClick={() => void startProposal()}
                >
                  <Send className="h-4 w-4" aria-hidden="true" />
                  بدء اقتراح
                </Button>
              )}

              {proposalError && (
                <div
                  role="alert"
                  className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm leading-7 text-destructive"
                >
                  {proposalError}
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-border bg-background p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-primary">
                    proposal review
                  </p>
                  <h3 className="mt-1 font-arabic-heading text-xl font-semibold">
                    {proposal ? generationLabel(proposal.status) : "لا يوجد اقتراح"}
                  </h3>
                </div>
                {proposal && (
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">
                    base v{proposal.baseVersion}
                  </span>
                )}
              </div>

              {proposalText ? (
                <pre
                  dir="auto"
                  className="mt-5 max-h-[34rem] overflow-auto whitespace-pre-wrap break-words rounded-2xl bg-secondary/35 p-4 font-sans text-sm leading-8"
                >
                  {proposalText}
                </pre>
              ) : (
                <div className="mt-5 flex min-h-64 items-center justify-center rounded-2xl border border-dashed border-border bg-secondary/20 p-6 text-center text-sm leading-7 text-muted-foreground">
                  سيظهر الاقتراح المتدفق هنا من دون تغيير المحرر المقبول.
                </div>
              )}

              {proposal?.status === "complete" && (
                <div className="mt-5 flex flex-wrap gap-2">
                  <Button
                    type="button"
                    className="rounded-full"
                    disabled={dirty}
                    onClick={() => void applyProposal()}
                  >
                    <Check className="h-4 w-4" aria-hidden="true" />
                    تطبيق كإصدار جديد
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full"
                    onClick={() => void discardProposal()}
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                    رفض الاقتراح
                  </Button>
                </div>
              )}

              {proposal && (
                <p className="mt-4 text-xs leading-6 text-muted-foreground">
                  {proposal.returnedModel ?? proposal.requestedModel}
                  {proposal.totalTokens !== null
                    ? ` · ${proposal.totalTokens} tokens`
                    : ""}
                  {proposal.latencyMs !== null
                    ? ` · ${(proposal.latencyMs / 1000).toFixed(1)}s`
                    : ""}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-6 rounded-2xl bg-secondary/55 p-4 text-sm leading-7 text-muted-foreground">
            {workspaceArchived
              ? "مساحة العمل مؤرشفة؛ الاقتراحات للقراءة فقط حتى استعادة المساحة."
              : draftArchived
                ? "استعد المسودة قبل طلب اقتراح جديد."
                : "عضوية القراءة لا تسمح بإرسال المسودة إلى المزود."}
          </div>
        )}
      </section>

      <section className="rounded-3xl border border-border/70 bg-card p-5 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-primary">Version history</p>
            <h2 className="mt-2 font-arabic-heading text-2xl font-semibold">
              لقطات غير قابلة لإعادة الكتابة
            </h2>
          </div>
          <div className="rounded-2xl bg-secondary p-3 text-primary">
            <GitBranch className="h-5 w-5" aria-hidden="true" />
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {latestVersions.map((version) => (
            <article
              key={version.id}
              className="rounded-2xl border border-border/70 bg-background p-4"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                      v{version.versionNumber}
                    </span>
                    <span className="rounded-full bg-secondary px-2.5 py-1 text-xs text-muted-foreground">
                      {version.sourceKind}
                    </span>
                    {version.versionNumber === detail.draft.currentVersion && (
                      <span className="text-xs font-semibold text-foreground">
                        الحالي
                      </span>
                    )}
                  </div>
                  <p dir="auto" className="mt-3 truncate font-semibold">
                    {version.title}
                  </p>
                  <p className="mt-2 line-clamp-2 text-xs leading-6 text-muted-foreground">
                    {version.content.replace(/\s+/gu, " ") || "Empty snapshot"}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {formatTimestamp(version.createdAt)}
                    {version.restoredFromVersion
                      ? ` · restored from v${version.restoredFromVersion}`
                      : ""}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  <Link
                    href={`/workspaces/${workspaceId}/drafts/${detail.draft.id}/versions/${version.versionNumber}`}
                    className="inline-flex min-h-10 items-center gap-2 rounded-full border border-border bg-background px-4 text-xs font-semibold transition-colors hover:bg-secondary"
                  >
                    عرض اللقطة
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                  {canEdit &&
                    version.versionNumber !== detail.draft.currentVersion && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="rounded-full"
                        disabled={dirty || isSaving}
                        onClick={() => void restoreVersion(version.versionNumber)}
                      >
                        <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                        استعادة
                      </Button>
                    )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-border/70 bg-card p-5 sm:p-8">
          <p className="text-sm font-semibold text-primary">حالة المسودة</p>
          <h2 className="mt-2 font-arabic-heading text-2xl font-semibold">
            {draftArchived ? "مؤرشفة للقراءة" : "نشطة وقابلة للمتابعة"}
          </h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            آخر حفظ {formatTimestamp(detail.draft.lastSavedAt)} · {detail.draft.versionCount}{" "}
            إصدار · {detail.draft.provenanceCount} مرجع منشأ.
          </p>
          {canManageLifecycle && (
            <Button
              type="button"
              variant="outline"
              className="mt-6 rounded-full"
              disabled={dirty || isGenerating}
              onClick={() => void setArchived(!draftArchived)}
            >
              {draftArchived ? (
                <ArchiveRestore className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Archive className="h-4 w-4" aria-hidden="true" />
              )}
              {draftArchived ? "استعادة إلى العمل" : "نقل إلى الأرشيف"}
            </Button>
          )}
        </div>

        <div className="rounded-3xl border border-destructive/25 bg-card p-5 sm:p-8">
          <p className="text-sm font-semibold text-destructive">منطقة دائمة</p>
          <h2 className="mt-2 font-arabic-heading text-2xl font-semibold">
            حذف كل تاريخ المسودة
          </h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            يحذف المسودة وإصداراتها ومنشأها ومحاولات الاستمرار. لا يحذف المحادثة
            أو الملفات الأصلية.
          </p>
          {canManageLifecycle ? (
            <Button
              type="button"
              variant="destructive"
              className="mt-6 rounded-full"
              disabled={dirty || isGenerating}
              onClick={() => void removeDraft()}
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              حذف المسودة
            </Button>
          ) : (
            <p className="mt-6 text-sm text-muted-foreground">
              لا تملك صلاحية حذف هذه المسودة.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
