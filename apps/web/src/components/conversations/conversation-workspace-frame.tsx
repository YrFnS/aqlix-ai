"use client";

import type { ReactNode } from "react";
import { useEffect, useId, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { MessageSquareText, Settings, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motionSpring } from "@/lib/motion";

export function ConversationWorkspaceFrame({
  title,
  subtitle,
  status,
  history,
  inspector,
  children,
}: {
  title: string;
  subtitle?: string;
  status?: "active" | "archived";
  history: ReactNode;
  inspector: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();
  const historyPanelId = useId();
  const inspectorPanelId = useId();
  const [historyOpen, setHistoryOpen] = useState(false);
  const [inspectorOpen, setInspectorOpen] = useState(false);

  useEffect(() => {
    setHistoryOpen(false);
    setInspectorOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setHistoryOpen(false);
      setInspectorOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!historyOpen && !inspectorOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [historyOpen, inspectorOpen]);

  return (
    <section className="flex min-h-[42rem] flex-col overflow-hidden rounded-2xl border border-line/80 bg-surface-raised shadow-surface-md lg:h-[calc(100svh-8.5rem)]">
      <header className="flex min-h-16 items-center gap-3 border-b border-line/75 bg-surface-overlay/90 px-3 backdrop-blur-xl sm:px-4">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-xl lg:hidden"
          onClick={() => {
            setInspectorOpen(false);
            setHistoryOpen(true);
          }}
          aria-label="فتح قائمة المحادثات"
          aria-haspopup="dialog"
          aria-controls={historyPanelId}
        >
          <MessageSquareText className="h-5 w-5" aria-hidden="true" />
        </Button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className={`h-2 w-2 shrink-0 rounded-full ${
                status === "archived" ? "bg-ink-subtle" : "bg-primary"
              }`}
              aria-hidden="true"
            />
            <h1
              dir="auto"
              className="truncate font-arabic-heading text-base font-semibold sm:text-lg"
              title={title}
            >
              {title}
            </h1>
          </div>
          {subtitle ? (
            <p className="mt-0.5 truncate text-xs text-ink-muted">{subtitle}</p>
          ) : null}
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-xl xl:hidden"
          onClick={() => {
            setHistoryOpen(false);
            setInspectorOpen(true);
          }}
          aria-label="فتح تفاصيل المحادثة"
          aria-haspopup="dialog"
          aria-controls={inspectorPanelId}
        >
          <Settings className="h-5 w-5" aria-hidden="true" />
        </Button>
      </header>

      <div className="grid min-h-0 flex-1 lg:grid-cols-[18rem_minmax(0,1fr)] xl:grid-cols-[18rem_minmax(0,1fr)_21rem]">
        <aside
          className="hidden min-h-0 overflow-y-auto border-e border-line/75 bg-surface-sunken/45 lg:block"
          aria-label="قائمة المحادثات"
        >
          {history}
        </aside>

        <div className="relative flex min-h-0 min-w-0 flex-col">{children}</div>

        <aside
          className="hidden min-h-0 overflow-y-auto border-s border-line/75 bg-surface-sunken/35 xl:block"
          aria-label="تفاصيل المحادثة"
        >
          {inspector}
        </aside>
      </div>

      <AnimatePresence>
        {historyOpen ? (
          <div className="fixed inset-0 z-[70] lg:hidden">
            <motion.button
              type="button"
              className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
              initial={shouldReduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0 }}
              transition={shouldReduceMotion ? { duration: 0 } : undefined}
              onClick={() => setHistoryOpen(false)}
              aria-label="إغلاق قائمة المحادثات"
            />
            <motion.aside
              id={historyPanelId}
              role="dialog"
              aria-modal="true"
              aria-label="قائمة المحادثات"
              initial={shouldReduceMotion ? false : { x: "100%" }}
              animate={{ x: 0 }}
              exit={shouldReduceMotion ? undefined : { x: "100%" }}
              transition={motionSpring}
              className="absolute inset-y-0 right-0 w-[min(90vw,22rem)] overflow-y-auto border-l border-line/80 bg-surface-overlay shadow-surface-lg backdrop-blur-xl"
            >
              <div className="sticky top-0 z-10 flex justify-end border-b border-line/75 bg-surface-overlay/95 p-3 backdrop-blur-xl">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="rounded-xl"
                  onClick={() => setHistoryOpen(false)}
                  aria-label="إغلاق قائمة المحادثات"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </Button>
              </div>
              {history}
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
              aria-label="إغلاق تفاصيل المحادثة"
            />
            <motion.aside
              id={inspectorPanelId}
              role="dialog"
              aria-modal="true"
              aria-label="تفاصيل المحادثة"
              initial={shouldReduceMotion ? false : { x: "-100%" }}
              animate={{ x: 0 }}
              exit={shouldReduceMotion ? undefined : { x: "-100%" }}
              transition={motionSpring}
              className="absolute inset-y-0 left-0 w-[min(92vw,24rem)] overflow-y-auto border-r border-line/80 bg-surface-overlay shadow-surface-lg backdrop-blur-xl"
            >
              <div className="sticky top-0 z-10 flex justify-end border-b border-line/75 bg-surface-overlay/95 p-3 backdrop-blur-xl">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="rounded-xl"
                  onClick={() => setInspectorOpen(false)}
                  aria-label="إغلاق تفاصيل المحادثة"
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
