"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileMenuProps {
  items: Array<{ href: string; label: string }>;
}

export function MobileMenu({ items }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="touch-target md:hidden"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? "إغلاق القائمة" : "فتح القائمة"}
        aria-expanded={isOpen}
        aria-controls={panelId}
      >
        {isOpen ? (
          <X className="h-6 w-6" aria-hidden="true" />
        ) : (
          <Menu className="h-6 w-6" aria-hidden="true" />
        )}
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="fixed inset-0 bg-foreground/45 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
            aria-label="إغلاق قائمة التنقل"
          />

          <nav
            id={panelId}
            aria-label="التنقل على الهاتف"
            className="safe-top fixed right-0 top-0 h-full w-72 border-l border-border bg-background p-6 shadow-2xl"
          >
            <div className="mb-6 flex justify-end">
              <Button
                variant="ghost"
                size="icon"
                className="touch-target"
                onClick={() => setIsOpen(false)}
                aria-label="إغلاق القائمة"
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </Button>
            </div>

            <div className="flex flex-col gap-3">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="touch-target rounded-xl px-4 py-3 text-base font-medium transition-colors hover:bg-accent"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
