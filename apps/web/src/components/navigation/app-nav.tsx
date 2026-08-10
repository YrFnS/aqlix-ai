"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Cpu,
  FileText,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { NavLink } from "./nav-link";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { brand } from "@/config/brand";
import { signOutAction } from "@/lib/auth/actions";

const navItems = [
  {
    href: "/workspaces",
    label: "مساحات العمل",
    icon: BookOpen,
    exact: false,
  },
  {
    href: "/settings/ai",
    label: "إعدادات الذكاء الاصطناعي",
    icon: Cpu,
    exact: true,
  },
  {
    href: "/docs",
    label: "الدليل",
    icon: FileText,
    exact: true,
  },
] as const;

interface AppNavProps {
  userEmail: string;
}

export function AppNav({ userEmail }: AppNavProps) {
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
          aria-controls="application-navigation"
        >
          {isOpen ? (
            <X className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Menu className="h-5 w-5" aria-hidden="true" />
          )}
        </Button>
      )}

      <aside
        id="application-navigation"
        className={cn(
          "border-l border-border/70 bg-card p-5",
          "hidden w-72 shrink-0 md:sticky md:top-0 md:block md:h-screen",
          isMobile && isOpen && "fixed inset-y-0 right-0 z-40 block w-72 shadow-2xl",
          isMobile && !isOpen && "hidden",
        )}
      >
        <div className="flex h-full flex-col">
          <Link
            href={brand.links.workspace}
            className="flex items-center gap-3 rounded-2xl px-3 py-2"
            onClick={() => setIsOpen(false)}
          >
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary text-sm font-bold text-primary-foreground shadow-sm shadow-primary/20"
              aria-hidden="true"
            >
              T
            </span>
            <div className="min-w-0">
              <p className="font-arabic-heading text-2xl font-semibold tracking-tight">
                {brand.name}
              </p>
              <p className="mt-1 truncate text-xs text-muted-foreground">
                {brand.taglineAr}
              </p>
            </div>
          </Link>

          <div className="my-6 h-px bg-border/70" />

          <nav className="flex flex-col gap-2" aria-label="التنقل الرئيسي">
            {navItems.map(({ href, label, icon: Icon, exact }) => (
              <NavLink
                key={href}
                href={href}
                exact={exact}
                className="flex min-h-12 items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                activeClassName="bg-primary text-primary-foreground shadow-sm hover:bg-primary hover:text-primary-foreground"
                onClick={() => setIsOpen(false)}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto space-y-3">
            <div className="rounded-2xl border border-border/70 bg-secondary/60 p-4">
              <p className="text-xs font-semibold text-foreground">
                من السؤال إلى العمل
              </p>
              <p className="mt-2 text-xs leading-6 text-muted-foreground">
                ابدأ بمحادثة، أضف مصادر عند الحاجة، ثم حوّل أفضل إجابة إلى مسودة
                يمكنك حفظها وتطويرها.
              </p>
            </div>

            <div className="rounded-2xl border border-border/70 bg-background p-4">
              <p className="text-xs font-semibold text-foreground">الحساب</p>
              <p
                dir="ltr"
                className="mt-1 truncate text-xs text-muted-foreground"
                title={userEmail}
              >
                {userEmail}
              </p>
              <form action={signOutAction} className="mt-3">
                <Button
                  type="submit"
                  variant="outline"
                  className="w-full justify-start rounded-xl"
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  تسجيل الخروج
                </Button>
              </form>
            </div>
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
