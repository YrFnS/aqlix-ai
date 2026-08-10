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
  PenLine,
  Quote,
  RotateCcw,
  Save,
  Send,
  ShieldCheck,
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
import { ActivityOrb } from "@/components/conversations/activity-orb";
import { Button } from "@/components/ui/button";
import { Surface } from "@/components/ui/surface";
import {
  draftEditorValue,
  isDraftEditorDirty,
  type DraftEditorValue,
} from "@/lib/drafts/editor-state";
import { DraftWorkspaceFrame } from "./draft-workspace-frame";

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

type ViewMode = "editor" | "proposal";

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
    streaming: "جاري تشكيل الاقتراح",
    complete: "جاهز للمراجعة",
    failed: "فشل",
    cancelled: "أُلغي وحُفظ الجزئي",
    applied: "طُبق",
    discarded: "رُفض",
  };
  return labels[status];
}

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

function contentPreview(value: string): string {
  const normalized = value.replace(/\s+/gu, " ").trim();
  return normalized.length <= 86
    ? normalized
    : `${normalized.slice(0, 83).trimEnd()}…`;
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
  const [viewMode, setViewMode] = useState<ViewMode>("editor");
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
  const initialProposal =
    initialDetail.generations.find((generation) =>
      ["pending", "streaming", "complete", "failed", "cancelled"].includes(
        generation.status,
      ),
    ) ?? null;
  const [proposal, setProposal] = useState<DraftGeneration | null>(
    initialProposal,
  );
  const [proposalText, setProposalText] = useState(
    initialProposal?.proposedContent ?? "",
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [proposalError, setProposalError] = useState<string | null>(null);
  const proposalController = useRef<AbortController | null>(null);

  const dirty = useMemo(
    () => isDraftEditorDirty(detail.draft, editor),
    [detail.draft, editor],
  );
  const draftArchived = detail.draft.status === "archived";
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

  const parseDetailPayload = (payload: unknown): DraftDetail => {
    const parsed = draftDetailSchema.safeParse(payload);
    if (!parsed.success) throw new Error("Draft state returned an invalid shape.");
    return parsed.data;
  };

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

    const next = parseDetailPayload(payload.data?.detail);
    setDetail(next);
    return next;
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

      const next = parseDetailPayload(payload.data?.detail);
      acceptDetail(next);
      setNotice({
        tone: "success",
        message: payload.data?.createdVersion
          ? "حُفظ إصدار جديد / New immutable version saved."
          : "لا توجد تغييرات جديدة للحفظ / No new changes to save.",
      });
      router.refresh();
    } catch (error) {
      const message = errorMessage(
        error,
        "تعذر حفظ المسودة / Draft save failed.",
      );
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
    if (!canEdit || isSaving) return;
    if (dirty) {
      setNotice({
        tone: "error",
        message:
          "احفظ أو ألغِ تغييرات المحرر قبل استعادة إصدار / Save or clear editor changes before restoring a version.",
      });
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

      acceptDetail(parseDetailPayload(payload.data?.detail));
      setViewMode("editor");
      setNotice({
        tone: "success",
        message:
          "أُعيدت النسخة كإصدار جديد / Snapshot restored as a new immutable version.",
      });
      router.refresh();
    } catch (error) {
      setNotice({
        tone: "error",
        message: errorMessage(error, "Version restore failed."),
      });
    } finally {
      setIsSaving(false);
    }
  };

  const setArchived = async (archived: boolean) => {
    if (!canManageLifecycle || isGenerating) return;
    if (dirty) {
      setNotice({
        tone: "error",
        message:
          "احفظ التغييرات قبل تغيير حالة المسودة / Save changes before changing draft state.",
      });
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

      router.push(
        archived
          ? `/workspaces/${workspaceId}/drafts?status=archived`
          : `/workspaces/${workspaceId}/drafts/${detail.draft.id}?status=reopened`,
      );
      router.refresh();
    } catch (error) {
      setNotice({
        tone: "error",
        message: errorMessage(error, "Draft lifecycle failed."),
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
        message: errorMessage(error, "Draft deletion failed."),
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
    setViewMode("proposal");
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
        setProposalError(errorMessage(error, "Draft proposal failed."));
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

      acceptDetail(parseDetailPayload(payload.data?.detail));
      setProposal(null);
      setProposalText("");
      setViewMode("editor");
      setNotice({
        tone: "success",
        message:
          "طُبق الاقتراح كإصدار جديد / Proposal applied as a new immutable version.",
      });
      router.refresh();
    } catch (error) {
      setProposalError(errorMessage(error, "Proposal apply failed."));
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

      setDetail(parseDetailPayload(payload.data?.detail));
      setProposal(null);
      setProposalText("");
      setViewMode("editor");
      setNotice({
        tone: "info",
        message:
          "رُفض الاقتراح وبقي العمل المقبول دون تغيير / Proposal discarded; accepted work is unchanged.",
      });
      router.refresh();
    } catch (error) {
      setProposalError(errorMessage(error, "Proposal discard failed."));
    }
  };

  const toolbar = (
    <div className="inline-flex rounded-xl border border-line/75 bg-surface-sunken p-1">
      <button
        type="button"
        aria-pressed={viewMode === "editor"}
        onClick={() => setViewMode("editor")}
        className={`inline-flex min-h-9 items-center gap-2 rounded-lg px-3 text-xs font-semibold outline-none transition-colors focus-visible:ring-4 focus-visible:ring-ring/20 ${
          viewMode === "editor"
            ? "bg-surface-raised text-foreground shadow-surface-xs"
            : "text-ink-muted hover:text-foreground"
        }`}
      >
        <PenLine className="h-3.5 w-3.5" aria-hidden="true" />
        المحرر
      </button>
      <button
        type="button"
        aria-pressed={viewMode === "proposal"}
        onClick={() => setViewMode("proposal")}
        className={`inline-flex min-h-9 items-center gap-2 rounded-lg px-3 text-xs font-semibold outline-none transition-colors focus-visible:ring-4 focus-visible:ring-ring/20 ${
          viewMode === "proposal"
            ? "bg-surface-raised text-foreground shadow-surface-xs"
            : "text-ink-muted hover:text-foreground"
        }`}
      >
        <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
        الاقتراح
        {proposal || isGenerating ? (
          <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
        ) : null}
      </button>
    </div>
  );

  const versionsPanel = (
    <div className="p-3">
      <div className="px-2 pb-4">
        <p className="text-xs font-semibold text-primary">سجل الإصدارات</p>
        <p className="mt-1 text-xs leading-5 text-ink-muted">
          كل حفظ أو تطبيق ينشئ لقطة جديدة ولا يعيد كتابة التاريخ.
        </p>
      </div>

      <div className="relative ms-3 border-s border-line/80 ps-4">
        {detail.versions.map((version) => {
          const current = version.versionNumber === detail.draft.currentVersion;
          return (
            <article key={version.id} className="relative pb-5 last:pb-0">
              <span
                className={`absolute -start-[1.28rem] top-3 h-2.5 w-2.5 rounded-full border-2 border-surface-sunken ${
                  current ? "bg-primary" : "bg-line-strong"
                }`}
                aria-hidden="true"
              />
              <div
                className={`rounded-xl border p-3 ${
                  current
                    ? "border-primary/25 bg-brand-soft/55"
                    : "border-line/70 bg-surface-raised"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold text-primary">
                    v{version.versionNumber}
                  </span>
                  <span className="rounded-full bg-surface-sunken px-2 py-0.5 text-[0.65rem] text-ink-muted">
                    {version.sourceKind}
                  </span>
                </div>
                <p dir="auto" className="mt-2 truncate text-xs font-semibold">
                  {version.title}
                </p>
                <p dir="auto" className="mt-2 line-clamp-2 text-xs leading-5 text-ink-muted">
                  {contentPreview(version.content) || "Empty snapshot"}
                </p>
                <time
                  dateTime={version.createdAt}
                  className="mt-2 block text-[0.68rem] text-ink-subtle"
                >
                  {formatTimestamp(version.createdAt)}
                </time>
                {version.restoredFromVersion ? (
                  <p className="mt-1 text-[0.68rem] text-ink-subtle">
                    restored from v{version.restoredFromVersion}
                  </p>
                ) : null}
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button asChild variant="ghost" size="sm" className="rounded-lg">
                    <Link
                      href={`/workspaces/${workspaceId}/drafts/${detail.draft.id}/versions/${version.versionNumber}`}
                    >
                      عرض اللقطة
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </Button>
                  {canEdit && !current ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="rounded-lg"
                      disabled={dirty || isSaving}
                      onClick={() => void restoreVersion(version.versionNumber)}
                    >
                      <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                      استعادة
                    </Button>
                  ) : null}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );

  const inspectorPanel = (
    <div className="space-y-5 p-4">
      <section>
        <p className="text-xs font-semibold text-primary">حالة المسودة</p>
        <Surface
          tone="raised"
          elevation="xs"
          radius="xl"
          padding="sm"
          className="mt-3"
        >
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-semibold">
              {draftArchived ? "مؤرشفة للقراءة" : "نشطة"}
            </span>
            <span className="rounded-full bg-brand-soft px-2.5 py-1 text-xs font-semibold text-primary">
              v{detail.draft.currentVersion}
            </span>
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
            <div>
              <dt className="text-ink-subtle">الإصدارات</dt>
              <dd className="mt-1 font-semibold">
                {detail.draft.versionCount.toLocaleString("ar-IQ")}
              </dd>
            </div>
            <div>
              <dt className="text-ink-subtle">المراجع</dt>
              <dd className="mt-1 font-semibold">
                {detail.draft.provenanceCount.toLocaleString("ar-IQ")}
              </dd>
            </div>
          </dl>
          <p className="mt-3 text-xs leading-6 text-ink-muted">
            آخر حفظ {formatTimestamp(detail.draft.lastSavedAt)}
          </p>
        </Surface>
      </section>

      <section className="border-t border-line/70 pt-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold text-primary">المنشأ والمراجع</p>
          <Quote className="h-4 w-4 text-primary" aria-hidden="true" />
        </div>
        {detail.draft.conversationId ? (
          <Button asChild variant="outline" size="sm" className="mt-3 w-full rounded-xl">
            <Link
              href={`/workspaces/${workspaceId}/conversations/${detail.draft.conversationId}`}
            >
              فتح المحادثة الأصلية
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </Button>
        ) : null}

        {detail.provenance.length > 0 ? (
          <div className="mt-3 space-y-2">
            {detail.provenance.map((provenance) => {
              const body = (
                <>
                  <span className="rounded-full bg-brand-soft px-2 py-0.5 font-mono text-[0.65rem] font-semibold text-primary">
                    [{provenance.label}]
                  </span>
                  <span dir="auto" className="min-w-0 flex-1 truncate">
                    {provenance.fileNameSnapshot}
                  </span>
                  <span className="text-ink-subtle">
                    {provenanceLocator(provenance)}
                  </span>
                </>
              );

              return provenance.sourceId && provenance.attachmentId ? (
                <Link
                  key={provenance.id}
                  href={`/workspaces/${workspaceId}/sources/${provenance.attachmentId}#source-${provenance.sourceId}`}
                  className="flex min-h-11 items-center gap-2 rounded-xl border border-line/70 bg-surface-raised px-3 py-2 text-xs outline-none transition-colors hover:border-primary/30 hover:bg-brand-soft/35 focus-visible:ring-4 focus-visible:ring-ring/20"
                >
                  {body}
                  <ExternalLink
                    className="h-3.5 w-3.5 shrink-0"
                    aria-hidden="true"
                  />
                </Link>
              ) : (
                <div
                  key={provenance.id}
                  className="flex min-h-11 items-center gap-2 rounded-xl border border-dashed border-line bg-surface-sunken px-3 py-2 text-xs"
                  title="The original source is no longer available."
                >
                  {body}
                  <FileWarning
                    className="h-3.5 w-3.5 shrink-0 text-ink-muted"
                    aria-hidden="true"
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <p className="mt-3 rounded-xl bg-surface-sunken p-3 text-xs leading-6 text-ink-muted">
            أُنشئت المسودة من إجابة بلا مراجع محفوظة؛ لا تُعرض على أنها موثقة
            تلقائياً.
          </p>
        )}
      </section>

      <section className="border-t border-line/70 pt-5">
        <p className="text-xs font-semibold text-primary">التصدير</p>
        <p className="mt-2 text-xs leading-6 text-ink-muted">
          آخر إصدار محفوظ بصيغ UTF-8 آمنة. HTML مستقل بلا scripts أو موارد
          خارجية. PDF وDOCX غير مفعّلين.
        </p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {(["txt", "md", "html"] as const).map((format) => (
            <Button
              key={format}
              type="button"
              variant="outline"
              size="sm"
              className="rounded-xl px-2 uppercase"
              onClick={() => download(format)}
            >
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              {format}
            </Button>
          ))}
        </div>
      </section>

      <section className="border-t border-line/70 pt-5">
        <div className="flex items-start gap-3 rounded-xl bg-surface-sunken p-3 text-xs leading-6 text-ink-muted">
          <ShieldCheck
            className="mt-1 h-4 w-4 shrink-0 text-primary"
            aria-hidden="true"
          />
          <p>
            العمل المقبول منفصل عن الاقتراح. الاستعادة والتطبيق يضيفان إصداراً
            جديداً ولا يغيران اللقطات السابقة.
          </p>
        </div>
      </section>

      <section className="border-t border-line/70 pt-5">
        <p className="text-xs font-semibold text-primary">دورة الحياة</p>
        {canManageLifecycle ? (
          <div className="mt-3 space-y-2">
            <Button
              type="button"
              variant="outline"
              className="w-full justify-start rounded-xl"
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
            <Button
              type="button"
              variant="destructive"
              className="w-full justify-start rounded-xl"
              disabled={dirty || isGenerating}
              onClick={() => void removeDraft()}
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              حذف المسودة وتاريخها
            </Button>
          </div>
        ) : (
          <p className="mt-3 rounded-xl bg-surface-sunken p-3 text-xs leading-6 text-ink-muted">
            {workspaceArchived
              ? "استعد مساحة العمل قبل تغيير حالة المسودة."
              : "عضوية القراءة لا تسمح بالأرشفة أو الحذف."}
          </p>
        )}
      </section>
    </div>
  );

  const editorCanvas = (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="border-b border-line/70 bg-surface-overlay/75 px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
          <label className="min-w-0 flex-1">
            <span className="sr-only">عنوان المسودة</span>
            <input
              aria-label="عنوان المسودة"
              value={editor.title}
              onChange={(event) => updateEditor({ title: event.target.value })}
              maxLength={200}
              readOnly={!canEdit}
              dir="auto"
              className="min-h-11 w-full border-0 bg-transparent px-0 font-arabic-heading text-2xl font-semibold outline-none ring-0 placeholder:text-ink-subtle focus:border-0 focus:ring-0 read-only:cursor-default"
            />
          </label>

          <div className="grid shrink-0 grid-cols-2 gap-2 lg:w-[20rem]">
            <label>
              <span className="sr-only">نوع المسودة</span>
              <select
                aria-label="نوع المسودة"
                value={editor.kind}
                onChange={(event) =>
                  updateEditor({ kind: event.target.value as DraftKind })
                }
                disabled={!canEdit}
                className="min-h-10 w-full rounded-xl border border-line/80 bg-surface-raised px-3 text-xs outline-none focus-visible:ring-4 focus-visible:ring-ring/20 disabled:bg-surface-sunken"
              >
                {kindOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="sr-only">اتجاه محتوى المسودة</span>
              <select
                aria-label="اتجاه محتوى المسودة"
                value={editor.direction}
                onChange={(event) =>
                  updateEditor({
                    direction: event.target.value as "auto" | "rtl" | "ltr",
                  })
                }
                disabled={!canEdit}
                className="min-h-10 w-full rounded-xl border border-line/80 bg-surface-raised px-3 text-xs outline-none focus-visible:ring-4 focus-visible:ring-ring/20 disabled:bg-surface-sunken"
              >
                <option value="auto">تلقائي</option>
                <option value="rtl">RTL</option>
                <option value="ltr">LTR</option>
              </select>
            </label>
          </div>
        </div>
      </div>

      <label className="flex min-h-0 flex-1 flex-col">
        <span className="sr-only">محتوى المسودة</span>
        <textarea
          aria-label="محتوى المسودة"
          value={editor.content}
          onChange={(event) => updateEditor({ content: event.target.value })}
          maxLength={100000}
          readOnly={!canEdit}
          dir={editor.direction}
          className="min-h-[32rem] flex-1 resize-none border-0 bg-surface px-5 py-6 text-sm font-normal leading-8 outline-none ring-0 placeholder:text-ink-subtle focus:border-0 focus:ring-0 read-only:cursor-default sm:px-8 sm:py-8 sm:text-[0.95rem] sm:leading-9"
        />
      </label>

      <div className="flex flex-col gap-3 border-t border-line/70 bg-surface-overlay/90 px-3 py-3 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:px-4">
        <div className="flex flex-wrap items-center gap-2 text-xs text-ink-muted">
          <span
            className={`inline-flex min-h-8 items-center gap-2 rounded-lg px-2.5 font-semibold ${
              saveState === "saved"
                ? "bg-brand-soft text-primary"
                : saveState === "error"
                  ? "bg-destructive/10 text-destructive"
                  : "bg-surface-sunken"
            }`}
            role="status"
            aria-live="polite"
          >
            {saveState === "saving" ? (
              <ActivityOrb state="working" size="sm" />
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
                ? `محفوظ · v${detail.draft.currentVersion}`
                : saveState === "error"
                  ? "فشل الحفظ"
                  : "تغييرات غير محفوظة"}
          </span>
          <span>
            {editor.content.length.toLocaleString("ar-IQ")} / ١٠٠٬٠٠٠
          </span>
          <span className="hidden sm:inline">Ctrl/Cmd+S</span>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="ghost"
            className="rounded-xl"
            onClick={() => void copyEditor()}
          >
            <Clipboard className="h-4 w-4" aria-hidden="true" />
            {copyState === "copied"
              ? "نُسخ"
              : copyState === "failed"
                ? "فشل النسخ"
                : "نسخ"}
          </Button>
          {canEdit ? (
            <Button
              type="button"
              className="rounded-xl"
              disabled={!dirty || isSaving}
              onClick={() => void saveDraft()}
            >
              {isSaving ? (
                <ActivityOrb state="working" size="sm" />
              ) : (
                <Save className="h-4 w-4" aria-hidden="true" />
              )}
              حفظ إصدار
            </Button>
          ) : null}
        </div>
      </div>

      {saveError ? (
        <p className="border-t border-destructive/20 bg-destructive/10 px-4 py-3 text-sm leading-7 text-destructive" role="alert">
          {saveError}
        </p>
      ) : null}
    </div>
  );

  const proposalCanvas = (
    <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
      <div className="mx-auto max-w-5xl space-y-5">
        <div className="flex flex-col gap-4 border-b border-line/70 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold text-primary">مراجعة الاقتراح</p>
            <h2 className="mt-2 font-arabic-heading text-2xl font-semibold">
              اقتراح منفصل عن العمل المقبول
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-ink-muted">
              يقرأ المزود آخر إصدار محفوظ فقط. لا يتغير المحرر حتى تطبيق الاقتراح
              صراحةً كإصدار جديد.
            </p>
          </div>
          {proposal ? (
            <span className="rounded-full bg-surface-sunken px-3 py-1.5 text-xs font-semibold text-ink-muted">
              base v{proposal.baseVersion} · {generationLabel(proposal.status)}
            </span>
          ) : null}
        </div>

        <div className="grid gap-5 xl:grid-cols-[19rem_minmax(0,1fr)]">
          <Surface
            tone="raised"
            elevation="xs"
            radius="2xl"
            padding="md"
            className="h-fit xl:sticky xl:top-0"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-primary">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs text-ink-muted">تعليمات المراجعة</p>
                <p className="mt-1 text-sm font-semibold">Continue with AI</p>
              </div>
            </div>

            {canEdit ? (
              <div className="mt-5 space-y-4">
                <label className="space-y-2 text-xs font-semibold">
                  <span>الإجراء</span>
                  <select
                    aria-label="إجراء اقتراح المسودة"
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
                    className="min-h-11 w-full rounded-xl border border-line/80 bg-surface-raised px-3 text-sm font-normal outline-none focus-visible:ring-4 focus-visible:ring-ring/20"
                  >
                    {actionOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2 text-xs font-semibold">
                  <span>التعليمات</span>
                  <textarea
                    aria-label="تعليمات اقتراح المسودة"
                    value={instruction}
                    onChange={(event) => setInstruction(event.target.value)}
                    maxLength={2000}
                    rows={7}
                    disabled={isGenerating}
                    dir="auto"
                    className="w-full resize-y rounded-xl border border-line/80 bg-surface-raised px-3 py-3 text-sm font-normal leading-7 outline-none focus-visible:ring-4 focus-visible:ring-ring/20"
                  />
                </label>

                {isGenerating ? (
                  <Button
                    type="button"
                    variant="destructive"
                    className="w-full rounded-xl"
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
                    className="w-full rounded-xl"
                    disabled={!instruction.trim() || dirty}
                    onClick={() => void startProposal()}
                  >
                    <Send className="h-4 w-4" aria-hidden="true" />
                    بدء اقتراح
                  </Button>
                )}

                {dirty ? (
                  <p className="text-xs leading-6 text-ink-muted">
                    احفظ تغييرات المحرر أولاً حتى يستند الاقتراح إلى إصدار واضح.
                  </p>
                ) : null}
              </div>
            ) : (
              <p className="mt-5 rounded-xl bg-surface-sunken p-3 text-xs leading-6 text-ink-muted">
                {workspaceArchived
                  ? "مساحة العمل مؤرشفة؛ الاقتراحات للقراءة فقط حتى استعادة المساحة."
                  : draftArchived
                    ? "استعد المسودة قبل طلب اقتراح جديد."
                    : "عضوية القراءة لا تسمح بإرسال المسودة إلى المزود."}
              </p>
            )}
          </Surface>

          <div className="min-w-0 space-y-4">
            {isGenerating ? (
              <div className="flex items-center gap-3 rounded-xl bg-brand-soft/60 px-4 py-3 text-sm text-ink-muted">
                <ActivityOrb state="shaping" size="sm" />
                <span>جاري تشكيل اقتراح منفصل وحفظ حالته…</span>
              </div>
            ) : null}

            {proposalError ? (
              <div
                role="alert"
                className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm leading-7 text-destructive"
              >
                {proposalError}
              </div>
            ) : null}

            <div className="grid gap-4 2xl:grid-cols-2">
              <Surface
                tone="muted"
                elevation="none"
                radius="2xl"
                padding="md"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-primary">المقبول</p>
                    <h3 className="mt-1 font-arabic-heading text-lg font-semibold">
                      الإصدار {detail.draft.currentVersion}
                    </h3>
                  </div>
                  <Check className="h-4 w-4 text-primary" aria-hidden="true" />
                </div>
                <pre
                  dir={editor.direction}
                  className="mt-4 max-h-[32rem] overflow-auto whitespace-pre-wrap break-words rounded-xl bg-surface-raised p-4 font-sans text-sm leading-8"
                >
                  {editor.content}
                </pre>
              </Surface>

              <Surface
                tone="raised"
                elevation="xs"
                radius="2xl"
                padding="md"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-primary">المقترح</p>
                    <h3 className="mt-1 font-arabic-heading text-lg font-semibold">
                      {proposal ? generationLabel(proposal.status) : "لا يوجد اقتراح"}
                    </h3>
                  </div>
                  {isGenerating ? (
                    <ActivityOrb state="shaping" size="sm" />
                  ) : (
                    <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
                  )}
                </div>

                {proposalText ? (
                  <pre
                    dir="auto"
                    className="mt-4 max-h-[32rem] overflow-auto whitespace-pre-wrap break-words rounded-xl bg-surface-sunken/55 p-4 font-sans text-sm leading-8"
                  >
                    {proposalText}
                  </pre>
                ) : (
                  <div className="mt-4 flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-line bg-surface-sunken/35 p-6 text-center">
                    <Sparkles className="h-6 w-6 text-primary" aria-hidden="true" />
                    <p className="mt-3 text-sm leading-7 text-ink-muted">
                      اكتب تعليمات واضحة، وسيظهر الاقتراح هنا من دون تغيير العمل
                      المقبول.
                    </p>
                  </div>
                )}

                {proposal?.status === "complete" ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button
                      type="button"
                      className="rounded-xl"
                      disabled={dirty}
                      onClick={() => void applyProposal()}
                    >
                      <Check className="h-4 w-4" aria-hidden="true" />
                      تطبيق كإصدار جديد
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-xl"
                      onClick={() => void discardProposal()}
                    >
                      <X className="h-4 w-4" aria-hidden="true" />
                      رفض الاقتراح
                    </Button>
                  </div>
                ) : null}

                {proposal ? (
                  <details className="mt-4 rounded-xl border border-line/70 bg-surface-sunken/45 text-xs">
                    <summary className="min-h-10 cursor-pointer px-3 py-2 font-semibold text-ink-muted outline-none focus-visible:ring-4 focus-visible:ring-ring/20">
                      تفاصيل التوليد
                    </summary>
                    <p dir="ltr" className="border-t border-line/70 p-3 text-ink-muted">
                      {proposal.returnedModel ?? proposal.requestedModel}
                      {proposal.totalTokens !== null
                        ? ` · ${proposal.totalTokens} tokens`
                        : ""}
                      {proposal.latencyMs !== null
                        ? ` · ${(proposal.latencyMs / 1000).toFixed(1)}s`
                        : ""}
                    </p>
                  </details>
                ) : null}
              </Surface>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {notice ? (
        <Surface
          tone={notice.tone === "info" ? "muted" : "raised"}
          elevation="xs"
          radius="xl"
          padding="sm"
          className={
            notice.tone === "error"
              ? "border-destructive/30 bg-destructive/10 text-destructive"
              : notice.tone === "success"
                ? "border-primary/25 bg-brand-soft/60"
                : undefined
          }
          role={notice.tone === "error" ? "alert" : "status"}
          aria-live={notice.tone === "error" ? "assertive" : "polite"}
        >
          <div className="flex items-start gap-3 text-sm leading-7">
            {notice.tone === "error" ? (
              <AlertTriangle
                className="mt-1 h-4 w-4 shrink-0 text-destructive"
                aria-hidden="true"
              />
            ) : notice.tone === "success" ? (
              <Check
                className="mt-1 h-4 w-4 shrink-0 text-primary"
                aria-hidden="true"
              />
            ) : (
              <FileClock
                className="mt-1 h-4 w-4 shrink-0 text-primary"
                aria-hidden="true"
              />
            )}
            <p>{notice.message}</p>
          </div>
        </Surface>
      ) : null}

      <DraftWorkspaceFrame
        title={editor.title || detail.draft.title}
        subtitle={`v${detail.draft.currentVersion} · ${
          kindOptions.find((option) => option.value === editor.kind)?.label ??
          editor.kind
        }`}
        status={draftArchived ? "archived" : "active"}
        toolbar={toolbar}
        versions={versionsPanel}
        inspector={inspectorPanel}
      >
        {viewMode === "editor" ? editorCanvas : proposalCanvas}
      </DraftWorkspaceFrame>
    </div>
  );
}
