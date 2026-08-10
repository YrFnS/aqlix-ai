"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Menu, X } from "lucide-react";
import { BrandMark } from "@/components/brand/brand-mark";
import { Button } from "@/components/ui/button";

interface MobileMenuProps {
  items: Array<{ href: string; label: string }>;
}

export function MobileMenu({ items }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="touch-target rounded-full md:hidden"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? "إغلاق القائمة" : "فتح القائمة"}
        aria-expanded={isOpen}
        aria-controls={panelId}
      >
        {isOpen ? (
          <X className="h-5 w-5" aria-hidden="true" />
        ) : (
          <Menu className="h-5 w-5" aria-hidden="true" />
        )}
      </Button>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            className="fixed inset-0 z-50 md:hidden"
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <motion.button
              type="button"
              className="fixed inset-0 bg-foreground/45 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
              aria-label="إغلاق قائمة التنقل"
              initial={shouldReduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.nav
              id={panelId}
              aria-label="التنقل على الهاتف"
              className="safe-top fixed right-0 top-0 flex h-full w-[min(22rem,88vw)] flex-col border-l border-line bg-surface-overlay p-5 shadow-surface-lg backdrop-blur-xl"
              initial={shouldReduceMotion ? false : { x: "100%" }}
              animate={{ x: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { x: "100%" }}
              transition={{ type: "spring", stiffness: 360, damping: 34 }}
            >
              <div className="flex items-center justify-between gap-4 border-b border-line/70 pb-5">
                <BrandMark size="sm" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="touch-target rounded-full"
                  onClick={() => setIsOpen(false)}
                  aria-label="إغلاق القائمة"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </Button>
              </div>

              <div className="mt-6 flex flex-1 flex-col gap-2">
                {items.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={shouldReduceMotion ? false : { opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: shouldReduceMotion ? 0 : index * 0.035 }}
                  >
                    <Link
                      href={item.href}
                      className="touch-target flex min-h-12 items-center rounded-xl border border-transparent px-4 py-3 text-base font-medium text-foreground outline-none transition-colors hover:border-line hover:bg-surface-sunken focus-visible:ring-4 focus-visible:ring-ring/20"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <p className="border-t border-line/70 pt-5 text-xs leading-6 text-ink-subtle">
                السؤال، المصادر، والمسودة تبقى ضمن مساحة العمل نفسها.
              </p>
            </motion.nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
