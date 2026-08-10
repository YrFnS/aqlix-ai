"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { usePathname } from "next/navigation";

const modalSelector = '[role="dialog"][aria-modal="true"]';
const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'summary',
  '[contenteditable="true"]',
  '[tabindex]:not([tabindex="-1"])',
].join(",");

function isVisible(element: HTMLElement): boolean {
  const style = window.getComputedStyle(element);
  return (
    element.getClientRects().length > 0 &&
    style.visibility !== "hidden" &&
    style.display !== "none"
  );
}

function focusableElements(dialog: HTMLElement): HTMLElement[] {
  return Array.from(
    dialog.querySelectorAll<HTMLElement>(focusableSelector),
  ).filter(isVisible);
}

function activeModal(): HTMLElement | null {
  const dialogs = Array.from(
    document.querySelectorAll<HTMLElement>(modalSelector),
  ).filter(isVisible);
  return dialogs.at(-1) ?? null;
}

function focusMainContent(event: MouseEvent<HTMLAnchorElement>): void {
  const main = document.querySelector<HTMLElement>("main");
  if (!main) return;

  event.preventDefault();
  if (!main.id) main.id = "main-content";
  if (!main.hasAttribute("tabindex")) main.tabIndex = -1;

  main.focus({ preventScroll: true });
  main.scrollIntoView({ block: "start" });
  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}${window.location.search}#${main.id}`,
  );
}

export function AccessibilityRuntime() {
  const pathname = usePathname();
  const [announcement, setAnnouncement] = useState("");
  const activeDialogRef = useRef<HTMLElement | null>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const focusFrameRef = useRef<number | null>(null);

  useEffect(() => {
    document.documentElement.dataset.appHydrated = "true";
    return () => {
      delete document.documentElement.dataset.appHydrated;
    };
  }, []);

  useEffect(() => {
    setAnnouncement("");
    const timer = window.setTimeout(() => {
      const title = document.title.split("|")[0]?.trim() || "الصفحة";
      setAnnouncement(`تم تحميل ${title}`);
    }, 80);

    return () => window.clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    const syncDialog = () => {
      const nextDialog = activeModal();
      if (nextDialog === activeDialogRef.current) return;

      if (!activeDialogRef.current && nextDialog) {
        restoreFocusRef.current =
          document.activeElement instanceof HTMLElement
            ? document.activeElement
            : null;
      }

      activeDialogRef.current = nextDialog;

      if (focusFrameRef.current !== null) {
        window.cancelAnimationFrame(focusFrameRef.current);
      }

      if (nextDialog) {
        if (!nextDialog.hasAttribute("tabindex")) nextDialog.tabIndex = -1;
        focusFrameRef.current = window.requestAnimationFrame(() => {
          const first = focusableElements(nextDialog)[0];
          (first ?? nextDialog).focus({ preventScroll: true });
        });
        return;
      }

      const restoreTarget = restoreFocusRef.current;
      restoreFocusRef.current = null;
      if (restoreTarget?.isConnected) {
        focusFrameRef.current = window.requestAnimationFrame(() => {
          restoreTarget.focus({ preventScroll: true });
        });
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const dialog = activeDialogRef.current;
      if (!dialog) return;

      const focusable = focusableElements(dialog);
      if (focusable.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      const current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;

      if (event.shiftKey && (!current || current === first || !dialog.contains(current))) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        (!current || current === last || !dialog.contains(current))
      ) {
        event.preventDefault();
        first.focus();
      }
    };

    const observer = new MutationObserver(syncDialog);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "hidden", "aria-hidden", "style"],
    });
    document.addEventListener("keydown", handleKeyDown, true);
    syncDialog();

    return () => {
      observer.disconnect();
      document.removeEventListener("keydown", handleKeyDown, true);
      if (focusFrameRef.current !== null) {
        window.cancelAnimationFrame(focusFrameRef.current);
      }
    };
  }, []);

  return (
    <>
      <a
        href="#main-content"
        onClick={focusMainContent}
        className="fixed start-4 top-4 z-[120] -translate-y-24 rounded-xl border border-line-strong bg-surface-overlay px-4 py-3 text-sm font-semibold text-foreground shadow-surface-md outline-none transition-transform duration-fast focus:translate-y-0 focus-visible:ring-4 focus-visible:ring-ring/30"
      >
        تجاوز إلى المحتوى
      </a>
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {announcement}
      </div>
    </>
  );
}
