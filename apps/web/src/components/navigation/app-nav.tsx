"use client";

import Link from "next/link";
import { LayoutGrid, Menu, Settings, User, X } from "lucide-react";
import { NavLink } from "./nav-link";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { brand } from "@/config/brand";

const navItems = [
  {
    href: "/dashboard",
    label: "مساحة العمل",
    icon: LayoutGrid,
  },
  {
    href: "/settings",
    label: "الإعدادات",
    icon: Settings,
  },
  {
    href: "/profile",
    label: "الملف الشخصي",
    icon: User,
  },
];

export function AppNav() {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isMobile && (
        <Button
          variant="outline"
          size="icon"
          className="fixed right-4 top-4 z-50 bg-background shadow-sm"
          onClick={() => setIsOpen((open) => !open)}
          aria-label={isOpen ? "إغلاق التنقل" : "فتح التنقل"}
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <X className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Menu className="h-5 w-5" aria-hidden="true" />
          )}
        </Button>
      )}

      <aside
        className={cn(
          "border-l border-border/70 bg-card p-5",
          "hidden w-72 shrink-0 md:sticky md:top-0 md:block md:h-screen",
          isMobile && isOpen && "fixed inset-y-0 right-0 z-40 block w-72 shadow-2xl",
          isMobile && !isOpen && "hidden",
        )}
      >
        <div className="flex h-full flex-col">
          <Link
            href={brand.links.home}
            className="flex items-center justify-between gap-4 rounded-2xl px-3 py-2"
            onClick={() => setIsOpen(false)}
          >
            <div>
              <p className="font-arabic-heading text-2xl font-semibold tracking-tight">
                {brand.name}
              </p>
              <p dir="ltr" className="mt-1 text-xs text-muted-foreground">
                {brand.category}
              </p>
            </div>
            <span className="h-2.5 w-2.5 rounded-full bg-primary shadow-sm shadow-primary/40" />
          </Link>

          <div className="my-6 h-px bg-border/70" />

          <nav className="flex flex-col gap-2" aria-label="التنقل الرئيسي">
            {navItems.map(({ href, label, icon: Icon }) => (
              <NavLink
                key={href}
                href={href}
                exact
                className="flex min-h-12 items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                activeClassName="bg-primary text-primary-foreground shadow-sm hover:bg-primary hover:text-primary-foreground"
                onClick={() => setIsOpen(false)}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto rounded-2xl border border-border/70 bg-secondary/60 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold text-foreground">مرحلة الأساس</p>
              <span dir="ltr" className="text-[0.65rem] font-semibold text-primary">
                P0
              </span>
            </div>
            <p className="mt-2 text-xs leading-6 text-muted-foreground">
              الواجهة الحالية توضّح اتجاه المنتج. المحادثة الحقيقية، المستندات،
              والحفظ الدائم تدخل في المراحل التالية.
            </p>
            <Link
              href={brand.links.documentation}
              className="mt-3 inline-flex text-xs font-semibold text-primary hover:underline"
              onClick={() => setIsOpen(false)}
            >
              راجع خارطة الطريق
            </Link>
          </div>
        </div>
      </aside>

      {isMobile && isOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-foreground/35 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
          aria-label="إغلاق قائمة التنقل"
        />
      )}
    </>
  );
}
