"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import type {
  DraftDetail,
  DraftGeneration,
  DraftGenerationAction,
} from "@iraqi-ai/types";
import { draftDetailSchema } from "@iraqi-ai/types";
import {
  draftEditorValue,
  isDraftEditorDirty,
  type DraftEditorValue,
} from "@/lib/drafts/editor-state";
import {
  actionOptions,
  errorMessage,
  mergeGeneration,
  parseEventStream,
} from "./draft-editor-utils";

export interface DraftEditorProps {
  workspaceId: string;
  initialDetail: DraftDetail;
  canEdit: boolean;
  canManageLifecycle: boolean;
  workspaceArchived: boolean;
}

export type DraftNotice = {
  tone: "success" | "error" | "info";
  message: string;
} | null;

function useDraftEditorController({
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
  const [notice, setNotice] = useState<DraftNotice>(null);
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
  const visibleVersions = detail.versions.slice(0, 3);
  const olderVersions = detail.versions.slice(3);
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
    if (!parsed.success) {
      throw new Error("Draft state returned an invalid shape.");
    }
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
      throw new Error(
        payload.error?.message || "Draft state could not be reloaded.",
      );
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
        throw new Error(
          payload.error?.message || "The draft could not be saved.",
        );
      }

      acceptDetail(parseDetailPayload(payload.data?.detail));
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
        throw new Error(
          payload.error?.message || "Version restore failed.",
        );
      }

      acceptDetail(parseDetailPayload(payload.data?.detail));
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
        throw new Error(
          payload.error?.message || "Draft lifecycle failed.",
        );
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
        throw new Error(
          payload.error?.message || "Draft deletion failed.",
        );
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

  const selectAction = (nextAction: DraftGenerationAction) => {
    setAction(nextAction);
    const option = actionOptions.find(
      (candidate) => candidate.value === nextAction,
    );
    setInstruction(option?.instruction ?? "Revise the draft.");
    setProposalError(null);
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
      setProposalError(
        "تعليمات الاستمرار مطلوبة / A revision instruction is required.",
      );
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
          body: JSON.stringify({
            action,
            instruction: boundedInstruction,
          }),
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

  const stopProposal = () => {
    proposalController.current?.abort(
      new DOMException("Cancelled by user", "AbortError"),
    );
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
        throw new Error(
          payload.error?.message || "Proposal apply failed.",
        );
      }

      acceptDetail(parseDetailPayload(payload.data?.detail));
      setProposal(null);
      setProposalText("");
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
        throw new Error(
          payload.error?.message || "Proposal discard failed.",
        );
      }

      setDetail(parseDetailPayload(payload.data?.detail));
      setProposal(null);
      setProposalText("");
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

  return {
    workspaceId,
    detail,
    editor,
    canEdit,
    canManageLifecycle,
    workspaceArchived,
    dirty,
    draftArchived,
    visibleVersions,
    olderVersions,
    saveState,
    isSaving,
    saveError,
    notice,
    copyState,
    action,
    instruction,
    proposal,
    proposalText,
    isGenerating,
    proposalError,
    updateEditor,
    saveDraft,
    copyEditor,
    download,
    restoreVersion,
    setArchived,
    removeDraft,
    selectAction,
    setInstruction,
    startProposal,
    stopProposal,
    applyProposal,
    discardProposal,
  };
}

type DraftEditorContextValue = ReturnType<typeof useDraftEditorController>;

const DraftEditorContext = createContext<DraftEditorContextValue | null>(null);

export function DraftEditorProvider({
  children,
  ...props
}: DraftEditorProps & { children: ReactNode }) {
  const value = useDraftEditorController(props);
  return (
    <DraftEditorContext.Provider value={value}>
      {children}
    </DraftEditorContext.Provider>
  );
}

export function useDraftEditorContext(): DraftEditorContextValue {
  const context = useContext(DraftEditorContext);
  if (!context) {
    throw new Error("Draft editor components must be rendered inside its provider.");
  }
  return context;
}
