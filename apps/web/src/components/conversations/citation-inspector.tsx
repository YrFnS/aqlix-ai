"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { AlertTriangle, ArrowRight, FileSearch, Quote, X } from "lucide-react";
import type { DocumentDetail, MessageCitation } from "@iraqi-ai/types";
import { documentDetailSchema } from "@iraqi-ai/types";
import { Button } from "@/components/ui/button";
import { motionSpring } from "@/lib/motion";
import { ActivityOrb } from "./activity-orb";

function citationLocator(citation: MessageCitation): string {
  if (citation.pageNumberSnapshot) {
    return `صفحة ${citation.pageNumberSnapshot}`;
  }
  if (citation.startLineSnapshot && citation.endLineSnapshot) {
    return `الأسطر ${citation.startLineSnapshot}–${citation.endLineSnapshot}`;
  }
  return `المقطع ${citation.sourceOrdinalSnapshot + 1}`;
}

export function CitationInspector({
  workspaceId,
  citation,
  onClose,
}: {
  workspaceId: string;
  citation: MessageCitation | null;
  onClose: () => void;
}) {
  const shouldReduceMotion = useReducedMotion();
  const [document, setDocument] = useState<DocumentDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!citation?.attachmentId || !citation.sourceId) {
      setDocument(null);
      setLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();
    setDocument(null);
    setError(null);
    setLoading(true);

    const load = async () => {
      try {
        const response = await fetch(
          `/api/v1/workspaces/${workspaceId}/sources/${citation.attachmentId}`,
          { cache: "no-store", signal: controller.signal },
        );
        const payload = (await response.json()) as {
          ok?: boolean;
          data?: { document?: unknown };
          error?: { message?: string };
        };

        if (!response.ok || payload.ok !== true) {
          throw new Error(
            payload.error?.message || "The cited source could not be loaded.",
          );
        }

        const parsed = documentDetailSchema.safeParse(payload.data?.document);
        if (!parsed.success) {
          throw new Error("The cited source returned an invalid shape.");
        }

        setDocument(parsed.data);
      } catch (loadError) {
        if (controller.signal.aborted) return;
        setError(
          loadError instanceof Error
            ? loadError.message
            : "تعذر فتح المرجع / Citation inspection failed.",
        );
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    void load();
    return () => controller.abort();
  }, [citation, workspaceId]);

  const source = useMemo(() => {
    if (!citation || !document) return null;
    return (
      document.sources.find((item) => item.id === citation.sourceId) ??
      document.sources.find(
        (item) => item.ordinal === citation.sourceOrdinalSnapshot,
      ) ??
      null
    );
  }, [citation, document]);

  return (
    <AnimatePresence>
      {citation ? (
        <div className="absolute inset-0 z-30 flex justify-end">
          <motion.button
            type="button"
            className="absolute inset-0 bg-foreground/20 backdrop-blur-[2px]"
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0 }}
            transition={shouldReduceMotion ? { duration: 0 } : undefined}
            onClick={onClose}
            aria-label="إغلاق معاينة المرجع"
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={`معاينة المرجع ${citation.label}`}
            initial={shouldReduceMotion ? false : { x: "100%", opacity: 0.8 }}
            animate={{ x: 0, opacity: 1 }}
            exit={shouldReduceMotion ? undefined : { x: "100%", opacity: 0.8 }}
            transition={motionSpring}
            className="relative flex h-full w-[min(92%,28rem)] flex-col border-s border-line/80 bg-surface-overlay shadow-surface-lg backdrop-blur-xl"
          >
            <header className="flex items-start justify-between gap-4 border-b border-line/75 p-4 sm:p-5">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                  <Quote className="h-3.5 w-3.5" aria-hidden="true" />
                  [{citation.label}] · {citationLocator(citation)}
                </div>
                <h2
                  dir="auto"
                  className="mt-2 truncate font-arabic-heading text-lg font-semibold"
                  title={citation.fileNameSnapshot}
                >
                  {citation.fileNameSnapshot}
                </h2>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-xl"
                onClick={onClose}
                aria-label="إغلاق معاينة المرجع"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </Button>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
              {!citation.attachmentId || !citation.sourceId ? (
                <div className="rounded-xl border border-dashed border-line bg-surface-sunken p-4 text-sm leading-7 text-ink-muted">
                  المصدر الأصلي لم يعد متاحاً، لكن اسم الملف وموقع المقطع محفوظان
                  كلقطة مرجعية مع الرسالة.
                </div>
              ) : loading ? (
                <div className="flex min-h-56 flex-col items-center justify-center text-center">
                  <ActivityOrb state="searching" />
                  <p className="mt-4 text-sm font-semibold">جاري فتح المقطع الداعم</p>
                  <p className="mt-2 text-xs leading-6 text-ink-muted">
                    يتم تحميل المصدر المصرح به من مساحة العمل الحالية.
                  </p>
                </div>
              ) : error ? (
                <div
                  role="alert"
                  className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm leading-7"
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle
                      className="mt-1 h-4 w-4 shrink-0 text-destructive"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="font-semibold text-destructive">
                        تعذر فتح المقطع
                      </p>
                      <p className="mt-1 text-ink-muted">{error}</p>
                    </div>
                  </div>
                </div>
              ) : source ? (
                <div>
                  <div className="flex items-center justify-between gap-3 rounded-xl bg-brand-soft/60 px-3 py-2 text-xs">
                    <span className="font-semibold text-primary">
                      S{source.ordinal + 1}
                    </span>
                    <span className="text-ink-muted">
                      {source.startLine && source.endLine
                        ? `الأسطر ${source.startLine}–${source.endLine}`
                        : `المقطع ${source.ordinal + 1}`}
                    </span>
                  </div>
                  <pre
                    dir="auto"
                    className="mt-4 whitespace-pre-wrap break-words rounded-xl border border-line/75 bg-surface-raised p-4 font-sans text-sm leading-8 text-foreground shadow-surface-xs"
                  >
                    {source.content}
                  </pre>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-line bg-surface-sunken p-4 text-sm leading-7 text-ink-muted">
                  لم يعد المقطع موجوداً في المستند الحالي. تبقى لقطة المرجع
                  المحفوظة مع الرسالة متاحة للفحص.
                </div>
              )}
            </div>

            {citation.attachmentId ? (
              <footer className="border-t border-line/75 p-4 sm:p-5">
                <Button asChild variant="outline" className="w-full rounded-xl">
                  <Link
                    href={`/workspaces/${workspaceId}/sources/${citation.attachmentId}#source-${citation.sourceId ?? ""}`}
                  >
                    <FileSearch className="h-4 w-4" aria-hidden="true" />
                    فتح المستند الكامل
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </footer>
            ) : null}
          </motion.aside>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
