"use client";

import {
  useEffect,
  useId,
  useMemo,
  useState,
} from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Clipboard,
  Download,
  FileSearch,
  FileText,
  Hash,
  Search,
  Settings,
  ShieldCheck,
  X,
} from "lucide-react";
import type { DocumentDetail } from "@iraqi-ai/types";
import { Button } from "@/components/ui/button";
import { motionSpring } from "@/lib/motion";
import { DocumentDeleteButton } from "./document-delete-button";

type SourcePassage = DocumentDetail["sources"][number];

function formatBytes(value: number): string {
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KiB`;
  return `${(value / (1024 * 1024)).toFixed(2)} MiB`;
}

function formatTimestamp(value: string): string {
  return new Intl.DateTimeFormat("ar-IQ", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function locatorFor(source: SourcePassage): string {
  if (source.pageNumber) return `صفحة ${source.pageNumber}`;
  if (source.startLine && source.endLine) {
    return `الأسطر ${source.startLine}–${source.endLine}`;
  }
  return `المقطع ${source.ordinal + 1}`;
}

function passagePreview(value: string): string {
  const normalized = value.replace(/\s+/gu, " ").trim();
  return normalized.length <= 94
    ? normalized
    : `${normalized.slice(0, 91).trimEnd()}…`;
}

function PassageNavigation({
  sources,
  selectedSourceId,
  query,
  onQueryChange,
  onSelect,
}: {
  sources: SourcePassage[];
  selectedSourceId: string | null;
  query: string;
  onQueryChange: (value: string) => void;
  onSelect: (sourceId: string) => void;
}) {
  return (
    <div className="flex min-h-full flex-col p-3">
      <div className="px-2 pb-3">
        <p className="text-xs font-semibold text-primary">مقاطع المستند</p>
        <p className="mt-1 text-xs leading-5 text-ink-muted">
          {sources.length.toLocaleString("ar-IQ")} مقطعاً قابلاً للفتح
        </p>
      </div>

      <label className="relative block">
        <span className="sr-only">البحث داخل مقاطع المستند</span>
        <Search
          className="pointer-events-none absolute inset-y-0 start-3 my-auto h-4 w-4 text-ink-subtle"
          aria-hidden="true"
        />
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          dir="auto"
          maxLength={500}
          placeholder="ابحث داخل المستند"
          className="min-h-11 w-full rounded-xl border border-line/80 bg-surface-raised ps-10 pe-3 text-sm outline-none placeholder:text-ink-subtle focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/20"
        />
      </label>

      <div className="mt-3 space-y-1.5">
        {sources.length > 0 ? (
          sources.map((source) => {
            const selected = source.id === selectedSourceId;
            return (
              <button
                key={source.id}
                id={`source-${source.id}`}
                type="button"
                onClick={() => onSelect(source.id)}
                aria-current={selected ? "true" : undefined}
                className={`block w-full scroll-mt-24 rounded-xl border px-3 py-3 text-start outline-none transition-[border-color,background-color,box-shadow] duration-fast focus-visible:ring-4 focus-visible:ring-ring/20 ${
                  selected
                    ? "border-primary/30 bg-brand-soft text-foreground shadow-surface-xs"
                    : "border-transparent text-ink-muted hover:border-line/80 hover:bg-surface-raised hover:text-foreground"
                }`}
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold text-primary">
                    S{source.ordinal + 1}
                  </span>
                  <span className="text-[0.68rem] text-ink-subtle">
                    {locatorFor(source)}
                  </span>
                </span>
                <span
                  dir="auto"
                  className="mt-2 block line-clamp-2 text-xs leading-5"
                >
                  {passagePreview(source.content)}
                </span>
              </button>
            );
          })
        ) : (
          <div className="rounded-xl border border-dashed border-line p-5 text-center text-xs leading-6 text-ink-muted">
            لا يوجد مقطع مطابق داخل هذا المستند.
          </div>
        )}
      </div>
    </div>
  );
}

function DocumentInspectorPanel({
  workspaceId,
  document,
  canWrite,
  workspaceArchived,
}: {
  workspaceId: string;
  document: DocumentDetail;
  canWrite: boolean;
  workspaceArchived: boolean;
}) {
  const attachment = document.attachment;
  const latestRun = document.processingRuns[0] ?? null;

  return (
    <div className="space-y-5 p-4">
      <section>
        <p className="text-xs font-semibold text-primary">بيانات المستند</p>
        <dl className="mt-3 space-y-3 text-xs">
          <div className="rounded-xl border border-line/70 bg-surface-raised p-3">
            <dt className="text-ink-subtle">الحجم والنوع</dt>
            <dd className="mt-1 font-semibold">
              <span dir="ltr">{formatBytes(attachment.byteSize)}</span>
              <span aria-hidden="true"> · </span>
              <span dir="ltr">{attachment.mediaType}</span>
            </dd>
          </div>
          <div className="rounded-xl border border-line/70 bg-surface-raised p-3">
            <dt className="text-ink-subtle">وقت الرفع</dt>
            <dd className="mt-1 font-semibold">
              {formatTimestamp(attachment.createdAt)}
            </dd>
          </div>
          <div className="rounded-xl border border-line/70 bg-surface-raised p-3">
            <dt className="text-ink-subtle">المعالج</dt>
            <dd dir="ltr" className="mt-1 break-all font-mono font-semibold">
              {latestRun
                ? `${latestRun.processor}@${latestRun.processorVersion}`
                : attachment.processorVersion ?? "غير متاح"}
            </dd>
          </div>
          <div className="rounded-xl border border-line/70 bg-surface-raised p-3">
            <dt className="text-ink-subtle">SHA-256</dt>
            <dd dir="ltr" className="mt-1 break-all font-mono text-[0.68rem]">
              {attachment.contentSha256 ?? "غير متاح"}
            </dd>
          </div>
        </dl>
      </section>

      <section className="border-t border-line/70 pt-5">
        <p className="text-xs font-semibold text-primary">سجل المعالجة</p>
        <div className="mt-3 space-y-3">
          {document.processingRuns.length > 0 ? (
            document.processingRuns.map((run) => (
              <div
                key={run.id}
                className="relative rounded-xl border border-line/70 bg-surface-raised p-3 text-xs"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold">
                    محاولة {run.attempt.toLocaleString("ar-IQ")}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[0.65rem] font-semibold ${
                      run.status === "complete"
                        ? "bg-brand-soft text-primary"
                        : run.status === "failed"
                          ? "bg-destructive/10 text-destructive"
                          : "bg-surface-sunken text-ink-muted"
                    }`}
                  >
                    {run.status}
                  </span>
                </div>
                <p className="mt-2 text-ink-muted">
                  {run.sourceCount.toLocaleString("ar-IQ")} passages ·{" "}
                  {run.characterCount.toLocaleString("ar-IQ")} characters
                </p>
                <p className="mt-1 text-ink-subtle">
                  {formatTimestamp(run.startedAt)}
                </p>
                {run.failureCode ? (
                  <p className="mt-2 leading-5 text-destructive">
                    {run.failureCode} · {run.failureMessage}
                  </p>
                ) : null}
              </div>
            ))
          ) : (
            <p className="rounded-xl bg-surface-sunken p-3 text-xs leading-6 text-ink-muted">
              لا توجد محاولة معالجة محفوظة.
            </p>
          )}
        </div>
      </section>

      <section className="border-t border-line/70 pt-5">
        <div className="flex items-start gap-3 rounded-xl bg-surface-sunken p-3 text-xs leading-6 text-ink-muted">
          <ShieldCheck
            className="mt-1 h-4 w-4 shrink-0 text-primary"
            aria-hidden="true"
          />
          <p>
            الملف خاص بالمساحة. المقاطع معروضة كنص آمن ولا تتحول إلى HTML.
          </p>
        </div>
      </section>

      <section className="border-t border-line/70 pt-5">
        <p className="text-xs font-semibold text-destructive">حذف المستند</p>
        <p className="mt-2 text-xs leading-6 text-ink-muted">
          تُزال البايتات الخاصة أولاً، ثم السجل والمقاطع المشتقة بعد نجاح التخزين.
        </p>
        <div className="mt-3">
          {canWrite ? (
            <DocumentDeleteButton
              workspaceId={workspaceId}
              attachmentId={attachment.id}
              fileName={attachment.fileName}
            />
          ) : (
            <div className="rounded-xl bg-surface-sunken p-3 text-xs leading-6 text-ink-muted">
              {workspaceArchived
                ? "استعد مساحة العمل قبل حذف مستند."
                : "عضوية القراءة لا تسمح بالحذف."}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export function DocumentWorkspace({
  workspaceId,
  document,
  canWrite,
  workspaceArchived,
}: {
  workspaceId: string;
  document: DocumentDetail;
  canWrite: boolean;
  workspaceArchived: boolean;
}) {
  const shouldReduceMotion = useReducedMotion();
  const passagePanelId = useId();
  const inspectorPanelId = useId();
  const [passagePanelOpen, setPassagePanelOpen] = useState(false);
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(
    document.sources[0]?.id ?? null,
  );
  const [copyState, setCopyState] = useState<
    "idle" | "passage" | "link" | "failed"
  >("idle");
  const attachment = document.attachment;

  const filteredSources = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("ar");
    if (!normalized) return document.sources;
    return document.sources.filter((source) =>
      `${source.content} ${locatorFor(source)} S${source.ordinal + 1}`
        .toLocaleLowerCase("ar")
        .includes(normalized),
    );
  }, [document.sources, query]);

  const selectedSource = useMemo(
    () =>
      document.sources.find((source) => source.id === selectedSourceId) ??
      document.sources[0] ??
      null,
    [document.sources, selectedSourceId],
  );
  const selectedIndex = selectedSource
    ? document.sources.findIndex((source) => source.id === selectedSource.id)
    : -1;

  useEffect(() => {
    const selectFromHash = () => {
      const hash = window.location.hash;
      if (!hash.startsWith("#source-")) return;
      const sourceId = hash.slice("#source-".length);
      if (document.sources.some((source) => source.id === sourceId)) {
        setSelectedSourceId(sourceId);
      }
    };

    selectFromHash();
    window.addEventListener("hashchange", selectFromHash);
    return () => window.removeEventListener("hashchange", selectFromHash);
  }, [document.sources]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setPassagePanelOpen(false);
      setInspectorOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!passagePanelOpen && !inspectorOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [inspectorOpen, passagePanelOpen]);

  const selectSource = (sourceId: string) => {
    setSelectedSourceId(sourceId);
    setPassagePanelOpen(false);
    const nextHash = `#source-${sourceId}`;
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${window.location.search}${nextHash}`,
    );
  };

  const moveSelection = (direction: -1 | 1) => {
    if (selectedIndex < 0) return;
    const next = document.sources[selectedIndex + direction];
    if (next) selectSource(next.id);
  };

  const copyPassage = async () => {
    if (!selectedSource) return;
    try {
      await navigator.clipboard.writeText(selectedSource.content);
      setCopyState("passage");
      window.setTimeout(() => setCopyState("idle"), 1600);
    } catch {
      setCopyState("failed");
    }
  };

  const copyLink = async () => {
    if (!selectedSource) return;
    try {
      const url = new URL(window.location.href);
      url.hash = `source-${selectedSource.id}`;
      await navigator.clipboard.writeText(url.toString());
      setCopyState("link");
      window.setTimeout(() => setCopyState("idle"), 1600);
    } catch {
      setCopyState("failed");
    }
  };

  const passageNavigation = (
    <PassageNavigation
      sources={filteredSources}
      selectedSourceId={selectedSource?.id ?? null}
      query={query}
      onQueryChange={setQuery}
      onSelect={selectSource}
    />
  );
  const inspector = (
    <DocumentInspectorPanel
      workspaceId={workspaceId}
      document={document}
      canWrite={canWrite}
      workspaceArchived={workspaceArchived}
    />
  );

  return (
    <section className="flex min-h-[44rem] flex-col overflow-hidden rounded-2xl border border-line/80 bg-surface-raised shadow-surface-md lg:h-[calc(100svh-8.5rem)]">
      <header className="flex min-h-16 items-center gap-3 border-b border-line/75 bg-surface-overlay/90 px-3 backdrop-blur-xl sm:px-4">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-xl lg:hidden"
          onClick={() => {
            setInspectorOpen(false);
            setPassagePanelOpen(true);
          }}
          aria-label="فتح مقاطع المستند"
          aria-haspopup="dialog"
          aria-controls={passagePanelId}
        >
          <FileSearch className="h-5 w-5" aria-hidden="true" />
        </Button>

        <Button asChild variant="ghost" size="icon" className="rounded-xl">
          <Link
            href={`/workspaces/${workspaceId}/sources`}
            aria-label="العودة إلى مكتبة المصادر"
          >
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Link>
        </Button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className={`h-2 w-2 shrink-0 rounded-full ${
                attachment.status === "ready"
                  ? "bg-primary"
                  : attachment.status === "failed"
                    ? "bg-destructive"
                    : "bg-ink-subtle"
              }`}
              aria-hidden="true"
            />
            <h1
              dir="auto"
              className="truncate font-arabic-heading text-base font-semibold sm:text-lg"
              title={attachment.fileName}
            >
              {attachment.fileName}
            </h1>
          </div>
          <p className="mt-0.5 truncate text-xs text-ink-muted">
            {attachment.sourceCount.toLocaleString("ar-IQ")} مقطع ·{" "}
            {attachment.mediaType}
          </p>
        </div>

        {attachment.status === "ready" ? (
          <Button asChild variant="outline" className="hidden rounded-xl sm:inline-flex">
            <Link
              href={`/api/v1/workspaces/${workspaceId}/sources/${attachment.id}/download`}
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              تنزيل
            </Link>
          </Button>
        ) : null}

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-xl xl:hidden"
          onClick={() => {
            setPassagePanelOpen(false);
            setInspectorOpen(true);
          }}
          aria-label="فتح بيانات المستند"
          aria-haspopup="dialog"
          aria-controls={inspectorPanelId}
        >
          <Settings className="h-5 w-5" aria-hidden="true" />
        </Button>
      </header>

      <div className="grid min-h-0 flex-1 lg:grid-cols-[19rem_minmax(0,1fr)] xl:grid-cols-[19rem_minmax(0,1fr)_21rem]">
        <aside
          className="hidden min-h-0 overflow-y-auto border-e border-line/75 bg-surface-sunken/45 lg:block"
          aria-label="مقاطع المستند"
        >
          {passageNavigation}
        </aside>

        <main className="relative min-h-0 min-w-0 overflow-y-auto bg-surface px-4 py-6 sm:px-7 sm:py-8">
          {attachment.status === "failed" ? (
            <div className="mx-auto mb-5 flex max-w-4xl items-start gap-3 rounded-xl border border-destructive/25 bg-destructive/10 p-4 text-sm">
              <AlertTriangle
                className="mt-1 h-4 w-4 shrink-0 text-destructive"
                aria-hidden="true"
              />
              <div>
                <p className="font-semibold text-destructive">
                  {attachment.failureCode ?? "PROCESSING_FAILED"}
                </p>
                <p className="mt-1 leading-6 text-ink-muted">
                  {attachment.failureReason ??
                    "فشلت المعالجة ولم تُنشأ مقاطع بديلة أو محتوى مفبرك."}
                </p>
              </div>
            </div>
          ) : null}

          {selectedSource ? (
            <article className="mx-auto max-w-4xl">
              <div className="flex flex-col gap-4 border-b border-line/70 pb-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-primary">
                      S{selectedSource.ordinal + 1}
                    </span>
                    <span className="text-xs text-ink-muted">
                      {locatorFor(selectedSource)}
                    </span>
                  </div>
                  <p className="mt-3 text-xs text-ink-subtle">
                    offsets {selectedSource.startOffset}–{selectedSource.endOffset}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-xl"
                    onClick={() => void copyPassage()}
                  >
                    {copyState === "passage" ? (
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    ) : (
                      <Clipboard className="h-3.5 w-3.5" aria-hidden="true" />
                    )}
                    {copyState === "passage" ? "نُسخ المقطع" : "نسخ المقطع"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="rounded-xl"
                    onClick={() => void copyLink()}
                  >
                    {copyState === "link" ? (
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    ) : (
                      <Hash className="h-3.5 w-3.5" aria-hidden="true" />
                    )}
                    {copyState === "link" ? "نُسخ الرابط" : "رابط ثابت"}
                  </Button>
                </div>
              </div>

              <pre
                dir="auto"
                className="whitespace-pre-wrap break-words py-7 font-sans text-sm leading-8 text-foreground sm:text-[0.95rem] sm:leading-9"
              >
                {selectedSource.content}
              </pre>

              <div className="flex items-center justify-between gap-3 border-t border-line/70 pt-5">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl"
                  disabled={selectedIndex <= 0}
                  onClick={() => moveSelection(-1)}
                >
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  السابق
                </Button>
                <span className="text-xs text-ink-muted">
                  {(selectedIndex + 1).toLocaleString("ar-IQ")} /{" "}
                  {document.sources.length.toLocaleString("ar-IQ")}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl"
                  disabled={selectedIndex >= document.sources.length - 1}
                  onClick={() => moveSelection(1)}
                >
                  التالي
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>

              {copyState === "failed" ? (
                <p className="mt-3 text-xs text-destructive" role="alert">
                  تعذر النسخ إلى الحافظة.
                </p>
              ) : null}
            </article>
          ) : (
            <div className="flex min-h-full flex-col items-center justify-center px-4 text-center">
              <FileText className="h-8 w-8 text-primary" aria-hidden="true" />
              <h2 className="mt-4 font-arabic-heading text-2xl font-semibold">
                لا توجد مقاطع محفوظة
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-ink-muted">
                لم تُنشأ نتيجة بديلة أو نص مثال لهذا المستند.
              </p>
            </div>
          )}
        </main>

        <aside
          className="hidden min-h-0 overflow-y-auto border-s border-line/75 bg-surface-sunken/35 xl:block"
          aria-label="بيانات المستند"
        >
          {inspector}
        </aside>
      </div>

      <AnimatePresence>
        {passagePanelOpen ? (
          <div className="fixed inset-0 z-[70] lg:hidden">
            <motion.button
              type="button"
              className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
              initial={shouldReduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0 }}
              transition={shouldReduceMotion ? { duration: 0 } : undefined}
              onClick={() => setPassagePanelOpen(false)}
              aria-label="إغلاق مقاطع المستند"
            />
            <motion.aside
              id={passagePanelId}
              role="dialog"
              aria-modal="true"
              aria-label="مقاطع المستند"
              initial={shouldReduceMotion ? false : { x: "100%" }}
              animate={{ x: 0 }}
              exit={shouldReduceMotion ? undefined : { x: "100%" }}
              transition={motionSpring}
              className="absolute inset-y-0 right-0 w-[min(92vw,23rem)] overflow-y-auto border-l border-line/80 bg-surface-overlay shadow-surface-lg backdrop-blur-xl"
            >
              <div className="sticky top-0 z-10 flex justify-end border-b border-line/75 bg-surface-overlay/95 p-3 backdrop-blur-xl">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="rounded-xl"
                  onClick={() => setPassagePanelOpen(false)}
                  aria-label="إغلاق مقاطع المستند"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </Button>
              </div>
              {passageNavigation}
            </motion.aside>
          </div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {inspectorOpen ? (
          <div className="fixed inset-0 z-[70] xl:hidden">
            <motion.button
              type="button"
              className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
              initial={shouldReduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0 }}
              transition={shouldReduceMotion ? { duration: 0 } : undefined}
              onClick={() => setInspectorOpen(false)}
              aria-label="إغلاق بيانات المستند"
            />
            <motion.aside
              id={inspectorPanelId}
              role="dialog"
              aria-modal="true"
              aria-label="بيانات المستند"
              initial={shouldReduceMotion ? false : { x: "-100%" }}
              animate={{ x: 0 }}
              exit={shouldReduceMotion ? undefined : { x: "-100%" }}
              transition={motionSpring}
              className="absolute inset-y-0 left-0 w-[min(94vw,25rem)] overflow-y-auto border-r border-line/80 bg-surface-overlay shadow-surface-lg backdrop-blur-xl"
            >
              <div className="sticky top-0 z-10 flex justify-end border-b border-line/75 bg-surface-overlay/95 p-3 backdrop-blur-xl">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="rounded-xl"
                  onClick={() => setInspectorOpen(false)}
                  aria-label="إغلاق بيانات المستند"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </Button>
              </div>
              {inspector}
            </motion.aside>
          </div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
