"use client";

import type { ReactNode } from "react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";
import {
  Archive,
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Cpu,
  FileSearch,
  FileText,
  LogOut,
  Menu,
  MessageSquareText,
  PenLine,
  Search,
  Settings,
  X,
} from "lucide-react";
import { BrandMark } from "@/components/brand/brand-mark";
import { Button } from "@/components/ui/button";
import { brand } from "@/config/brand";
import {
  emphasizedEase,
  exitEase,
  motionDurations,
  motionSpring,
} from "@/lib/motion";
import { signOutAction } from "@/lib/auth/actions";
import { cn } from "@/lib/utils";
import { NavLink } from "./nav-link";

const primaryNavItems = [
  {
    href: "/workspaces",
    label: "مساحات العمل",
    description: "المساحات النشطة والأرشيف",
    icon: BookOpen,
    exact: false,
  },
  {
    href: "/settings/ai",
    label: "إعدادات الذكاء الاصطناعي",
    description: "المزوّد والنموذج وحدود الاستخدام",
    icon: Cpu,
    exact: true,
  },
  {
    href: "/docs",
    label: "المستندات",
    description: "نطاق المنتج وحدوده الحالية",
    icon: FileText,
    exact: true,
  },
] as const;

const workspaceSections = [
  {
    suffix: "",
    label: "نظرة عامة",
    description: "مداخل العمل وإعدادات المساحة",
    icon: BookOpen,
    exact: true,
  },
  {
    suffix: "/conversations",
    label: "المحادثات",
    description: "الأسئلة والإجابات المحفوظة",
    icon: MessageSquareText,
    exact: false,
  },
  {
    suffix: "/sources",
    label: "المصادر",
    description: "الملفات والمقاطع القابلة للفحص",
    icon: FileSearch,
    exact: false,
  },
  {
    suffix: "/drafts",
    label: "المسودات",
    description: "التحرير والإصدارات والتصدير",
    icon: PenLine,
    exact: false,
  },
  {
    suffix: "/settings",
    label: "إعدادات المساحة",
    description: "الاسم واللغة وحدود الوصول",
    icon: Settings,
    exact: false,
  },
] as const;

type CommandItem = {
  href: string;
  label: string;
  description: string;
  keywords: string;
  icon: typeof BookOpen;
};

type Breadcrumb = {
  label: string;
  href?: string;
};

type RouteContext = {
  eyebrow: string;
  title: string;
  breadcrumbs: Breadcrumb[];
};

interface AppNavProps {
  userEmail: string;
  children: ReactNode;
}

function getWorkspaceId(pathname: string): string | null {
  const segments = pathname.split("/").filter(Boolean);

  if (
    segments[0] !== "workspaces" ||
    !segments[1] ||
    segments[1] === "archived"
  ) {
    return null;
  }

  return segments[1];
}

function getRouteContext(
  pathname: string,
  workspaceId: string | null,
): RouteContext {
  if (pathname === "/workspaces") {
    return {
      eyebrow: "مساحة العمل",
      title: "مساحات العمل",
      breadcrumbs: [{ label: "مساحات العمل" }],
    };
  }

  if (pathname === "/workspaces/archived") {
    return {
      eyebrow: "مساحة العمل",
      title: "الأرشيف",
      breadcrumbs: [
        { label: "مساحات العمل", href: "/workspaces" },
        { label: "الأرشيف" },
      ],
    };
  }

  if (workspaceId) {
    const workspaceBase = `/workspaces/${workspaceId}`;
    const segments = pathname.split("/").filter(Boolean);
    const section = segments[2];
    const baseBreadcrumbs: Breadcrumb[] = [
      { label: "مساحات العمل", href: "/workspaces" },
      {
        label: "المساحة",
        href: section ? workspaceBase : undefined,
      },
    ];

    if (section === "conversations") {
      return {
        eyebrow: "داخل المساحة",
        title: "المحادثات",
        breadcrumbs: [...baseBreadcrumbs, { label: "المحادثات" }],
      };
    }

    if (section === "sources") {
      return {
        eyebrow: "داخل المساحة",
        title: "المصادر",
        breadcrumbs: [...baseBreadcrumbs, { label: "المصادر" }],
      };
    }

    if (section === "drafts") {
      return {
        eyebrow: "داخل المساحة",
        title: "المسودات",
        breadcrumbs: [...baseBreadcrumbs, { label: "المسودات" }],
      };
    }

    if (section === "settings") {
      return {
        eyebrow: "داخل المساحة",
        title: "إعدادات المساحة",
        breadcrumbs: [...baseBreadcrumbs, { label: "الإعدادات" }],
      };
    }

    return {
      eyebrow: "داخل المساحة",
      title: "نظرة عامة",
      breadcrumbs: baseBreadcrumbs,
    };
  }

  if (pathname === "/settings/ai") {
    return {
      eyebrow: "الحساب",
      title: "إعدادات الذكاء الاصطناعي",
      breadcrumbs: [{ label: "إعدادات الذكاء الاصطناعي" }],
    };
  }

  if (pathname === "/docs") {
    return {
      eyebrow: "Tuppra",
      title: "المستندات",
      breadcrumbs: [{ label: "المستندات" }],
    };
  }

  return {
    eyebrow: brand.shortName,
    title: "مساحة العمل",
    breadcrumbs: [{ label: "مساحة العمل" }],
  };
}

function getAccountInitial(email: string): string {
  const initial = email.trim().charAt(0);
  return initial ? initial.toUpperCase() : "T";
}

function NavigationPanel({
  collapsed,
  workspaceId,
  userEmail,
  mobile = false,
  onNavigate,
}: {
  collapsed: boolean;
  workspaceId: string | null;
  userEmail: string;
  mobile?: boolean;
  onNavigate: () => void;
}) {
  const workspaceBase = workspaceId ? `/workspaces/${workspaceId}` : null;

  return (
    <div className="flex h-full min-h-0 flex-col px-3 py-4">
      <Link
        href={brand.links.workspace}
        className={cn(
          "flex min-h-12 items-center rounded-xl outline-none transition-colors duration-fast ease-standard hover:bg-surface-sunken focus-visible:ring-4 focus-visible:ring-ring/20",
          collapsed ? "justify-center px-1" : "justify-between gap-3 px-2",
        )}
        aria-label={`${brand.name} — مساحات العمل`}
        onClick={onNavigate}
      >
        <BrandMark showName={!collapsed} size="sm" />
        {!collapsed ? (
          <span className="rounded-full border border-line/70 bg-surface-raised px-2 py-1 text-[0.65rem] font-semibold text-ink-muted">
            Workspace
          </span>
        ) : null}
      </Link>

      <div className="my-4 h-px bg-line/70" />

      <nav className="space-y-1" aria-label="التنقل الرئيسي">
        {!collapsed ? (
          <p className="px-3 pb-2 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
            التطبيق
          </p>
        ) : null}

        {primaryNavItems.map(({ href, label, icon: Icon, exact }) => (
          <NavLink
            key={href}
            href={href}
            exact={exact}
            title={collapsed ? label : undefined}
            className={cn(
              "group flex min-h-11 items-center rounded-xl text-sm font-medium outline-none transition-[color,background-color,box-shadow] duration-fast ease-standard focus-visible:ring-4 focus-visible:ring-ring/20",
              collapsed
                ? "justify-center px-2"
                : "gap-3 px-3",
            )}
            activeClassName="bg-brand-soft text-primary shadow-surface-xs hover:text-primary"
            onClick={onNavigate}
          >
            <Icon className="h-[1.05rem] w-[1.05rem] shrink-0" aria-hidden="true" />
            <span className={collapsed ? "sr-only" : "truncate"}>{label}</span>
          </NavLink>
        ))}
      </nav>

      {workspaceBase ? (
        <>
          <div className="my-4 h-px bg-line/70" />
          <nav className="space-y-1" aria-label="تنقل مساحة العمل">
            {!collapsed ? (
              <p className="px-3 pb-2 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
                المساحة الحالية
              </p>
            ) : null}

            {workspaceSections.map(
              ({ suffix, label, icon: Icon, exact }) => {
                const href = `${workspaceBase}${suffix}`;

                return (
                  <NavLink
                    key={href}
                    href={href}
                    exact={exact}
                    title={collapsed ? label : undefined}
                    className={cn(
                      "group flex min-h-11 items-center rounded-xl text-sm font-medium outline-none transition-[color,background-color,box-shadow] duration-fast ease-standard focus-visible:ring-4 focus-visible:ring-ring/20",
                      collapsed
                        ? "justify-center px-2"
                        : "gap-3 px-3",
                    )}
                    activeClassName="bg-primary text-primary-foreground shadow-surface-sm hover:text-primary-foreground"
                    onClick={onNavigate}
                  >
                    <Icon
                      className="h-[1.05rem] w-[1.05rem] shrink-0"
                      aria-hidden="true"
                    />
                    <span className={collapsed ? "sr-only" : "truncate"}>
                      {label}
                    </span>
                  </NavLink>
                );
              },
            )}
          </nav>
        </>
      ) : null}

      <div className="mt-auto pt-5">
        {mobile ? (
          <div className="rounded-xl border border-line/80 bg-surface-sunken p-3">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground">
                {getAccountInitial(userEmail)}
              </span>
              <div className="min-w-0">
                <p className="text-xs font-semibold">الحساب الحالي</p>
                <p
                  dir="ltr"
                  className="mt-0.5 truncate text-xs text-ink-muted"
                  title={userEmail}
                >
                  {userEmail}
                </p>
              </div>
            </div>
            <form action={signOutAction} className="mt-3">
              <Button
                type="submit"
                variant="outline"
                className="w-full justify-start rounded-lg"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                تسجيل الخروج
              </Button>
            </form>
          </div>
        ) : collapsed ? (
          <div
            className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl border border-line/80 bg-surface-raised text-sm font-semibold text-primary shadow-surface-xs"
            title={userEmail}
            aria-label={`الحساب: ${userEmail}`}
          >
            {getAccountInitial(userEmail)}
          </div>
        ) : (
          <div className="rounded-xl border border-line/70 bg-surface-sunken px-3 py-3">
            <p className="text-xs font-semibold text-foreground">
              {brand.taglineAr}
            </p>
            <p className="mt-1 text-xs leading-6 text-ink-muted">
              انتقل بين السياق والمصادر والعمل المحفوظ من مكان واحد.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export function AppNav({ userEmail, children }: AppNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const mobilePanelId = useId();
  const commandPanelId = useId();
  const accountMenuId = useId();
  const accountRef = useRef<HTMLDivElement>(null);
  const commandInputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [railPreferenceLoaded, setRailPreferenceLoaded] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [query, setQuery] = useState("");
  const workspaceId = getWorkspaceId(pathname);
  const routeContext = getRouteContext(pathname, workspaceId);

  const commandItems = useMemo<CommandItem[]>(() => {
    const primary = primaryNavItems.map(
      ({ href, label, description, icon }) => ({
        href,
        label,
        description,
        keywords: `${label} ${description}`,
        icon,
      }),
    );

    if (!workspaceId) return primary;

    const workspaceBase = `/workspaces/${workspaceId}`;
    const contextual = workspaceSections.map(
      ({ suffix, label, description, icon }) => ({
        href: `${workspaceBase}${suffix}`,
        label,
        description,
        keywords: `${label} ${description} مساحة العمل`,
        icon,
      }),
    );

    return [...contextual, ...primary];
  }, [workspaceId]);

  const filteredCommandItems = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("ar");
    if (!normalized) return commandItems;

    return commandItems.filter((item) =>
      item.keywords.toLocaleLowerCase("ar").includes(normalized),
    );
  }, [commandItems, query]);

  useEffect(() => {
    const saved = window.localStorage.getItem("tuppra:rail-collapsed");
    if (saved === "true") setIsCollapsed(true);
    setRailPreferenceLoaded(true);
  }, []);

  useEffect(() => {
    if (!railPreferenceLoaded) return;
    window.localStorage.setItem(
      "tuppra:rail-collapsed",
      String(isCollapsed),
    );
  }, [isCollapsed, railPreferenceLoaded]);

  useEffect(() => {
    setIsOpen(false);
    setCommandOpen(false);
    setAccountOpen(false);
    setQuery("");
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        (event.metaKey || event.ctrlKey) &&
        event.key.toLocaleLowerCase() === "k"
      ) {
        event.preventDefault();
        setIsOpen(false);
        setAccountOpen(false);
        setCommandOpen((open) => !open);
        return;
      }

      if (event.key === "Escape") {
        setIsOpen(false);
        setCommandOpen(false);
        setAccountOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!commandOpen) return;
    const frame = window.requestAnimationFrame(() => {
      commandInputRef.current?.focus();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [commandOpen]);

  useEffect(() => {
    if (!isOpen && !commandOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [commandOpen, isOpen]);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (
        accountRef.current &&
        !accountRef.current.contains(event.target as Node)
      ) {
        setAccountOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  const openCommandPalette = () => {
    setAccountOpen(false);
    setIsOpen(false);
    setCommandOpen(true);
  };

  const navigateToFirstCommand = () => {
    const first = filteredCommandItems[0];
    if (!first) return;
    setCommandOpen(false);
    router.push(first.href);
  };

  return (
    <div className="app-shell min-h-svh bg-canvas">
      <div className="flex min-h-svh">
        <aside
          className={cn(
            "sticky top-0 hidden h-svh shrink-0 overflow-hidden border-l border-line/80 bg-surface/92 backdrop-blur-xl transition-[width] duration-slow ease-emphasized md:block",
            isCollapsed ? "w-[5.25rem]" : "w-72",
          )}
          aria-label="شريط مساحة العمل"
        >
          <NavigationPanel
            collapsed={isCollapsed}
            workspaceId={workspaceId}
            userEmail={userEmail}
            onNavigate={() => undefined}
          />
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 border-b border-line/75 bg-canvas/88 backdrop-blur-xl">
            <div
              className="flex min-h-16 items-center gap-3 px-4 sm:px-6 lg:px-8"
              aria-label="شريط أوامر التطبيق"
            >
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="rounded-xl md:hidden"
                onClick={() => {
                  setAccountOpen(false);
                  setCommandOpen(false);
                  setIsOpen(true);
                }}
                aria-label="فتح التنقل"
                aria-expanded={isOpen}
                aria-controls={mobilePanelId}
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </Button>

              <div className="min-w-0 flex-1 py-2">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-ink-subtle">
                  {routeContext.eyebrow}
                </p>
                <div className="mt-0.5 flex min-w-0 items-center gap-1.5 overflow-hidden text-sm">
                  {routeContext.breadcrumbs.map((crumb, index) => (
                    <span
                      key={`${crumb.label}-${index}`}
                      className="flex min-w-0 items-center gap-1.5"
                    >
                      {index > 0 ? (
                        <ChevronLeft
                          className="h-3.5 w-3.5 shrink-0 text-ink-subtle"
                          aria-hidden="true"
                        />
                      ) : null}
                      {crumb.href ? (
                        <Link
                          href={crumb.href}
                          className="truncate text-ink-muted transition-colors hover:text-foreground focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20"
                        >
                          {crumb.label}
                        </Link>
                      ) : (
                        <span className="truncate font-semibold text-foreground">
                          {crumb.label}
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="hidden rounded-xl md:inline-flex"
                  onClick={() => setIsCollapsed((collapsed) => !collapsed)}
                  aria-label={
                    isCollapsed ? "توسيع شريط التنقل" : "تصغير شريط التنقل"
                  }
                  aria-pressed={isCollapsed}
                >
                  {isCollapsed ? (
                    <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  )}
                </Button>

                <button
                  type="button"
                  className="hidden min-h-11 items-center gap-3 rounded-xl border border-line/80 bg-surface-raised px-3 text-sm text-ink-muted shadow-surface-xs outline-none transition-[border-color,background-color,color,box-shadow] duration-fast ease-standard hover:border-line-strong hover:text-foreground hover:shadow-surface-sm focus-visible:ring-4 focus-visible:ring-ring/20 sm:inline-flex"
                  onClick={openCommandPalette}
                  aria-haspopup="dialog"
                  aria-controls={commandPanelId}
                >
                  <Search className="h-4 w-4" aria-hidden="true" />
                  <span>انتقل إلى…</span>
                  <kbd className="rounded-md border border-line bg-surface-sunken px-1.5 py-0.5 font-sans text-[0.65rem] text-ink-subtle">
                    ⌘K
                  </kbd>
                </button>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="rounded-xl sm:hidden"
                  onClick={openCommandPalette}
                  aria-label="فتح لوحة الانتقال"
                  aria-haspopup="dialog"
                  aria-controls={commandPanelId}
                >
                  <Search className="h-5 w-5" aria-hidden="true" />
                </Button>

                <div className="relative" ref={accountRef}>
                  <button
                    type="button"
                    className="flex min-h-11 items-center gap-2 rounded-xl border border-line/80 bg-surface-raised p-1.5 pe-2 outline-none transition-[border-color,box-shadow] duration-fast ease-standard hover:border-line-strong hover:shadow-surface-sm focus-visible:ring-4 focus-visible:ring-ring/20"
                    onClick={() => {
                      setCommandOpen(false);
                      setAccountOpen((open) => !open);
                    }}
                    aria-label="فتح قائمة الحساب"
                    aria-haspopup="menu"
                    aria-expanded={accountOpen}
                    aria-controls={accountMenuId}
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-semibold text-primary-foreground">
                      {getAccountInitial(userEmail)}
                    </span>
                    <ChevronDown
                      className={cn(
                        "hidden h-3.5 w-3.5 text-ink-muted transition-transform duration-fast sm:block",
                        accountOpen && "rotate-180",
                      )}
                      aria-hidden="true"
                    />
                  </button>

                  <AnimatePresence>
                    {accountOpen ? (
                      <motion.div
                        id={accountMenuId}
                        role="menu"
                        initial={
                          shouldReduceMotion
                            ? false
                            : { opacity: 0, y: -6, scale: 0.98 }
                        }
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={
                          shouldReduceMotion
                            ? undefined
                            : { opacity: 0, y: -4, scale: 0.985 }
                        }
                        transition={motionSpring}
                        className="absolute end-0 top-[calc(100%+0.6rem)] z-50 w-72 overflow-hidden rounded-xl border border-line/80 bg-surface-overlay p-2 shadow-surface-lg backdrop-blur-xl"
                      >
                        <div className="rounded-lg bg-surface-sunken p-3">
                          <p className="text-xs font-semibold">الحساب الحالي</p>
                          <p
                            dir="ltr"
                            className="mt-1 truncate text-xs text-ink-muted"
                            title={userEmail}
                          >
                            {userEmail}
                          </p>
                        </div>

                        <div className="mt-2 space-y-1">
                          <Link
                            href="/settings/ai"
                            role="menuitem"
                            className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium outline-none transition-colors hover:bg-surface-sunken focus-visible:ring-4 focus-visible:ring-ring/20"
                          >
                            <Cpu className="h-4 w-4" aria-hidden="true" />
                            إعدادات الذكاء الاصطناعي
                          </Link>
                          <Link
                            href="/docs"
                            role="menuitem"
                            className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium outline-none transition-colors hover:bg-surface-sunken focus-visible:ring-4 focus-visible:ring-ring/20"
                          >
                            <FileText className="h-4 w-4" aria-hidden="true" />
                            المستندات
                          </Link>
                        </div>

                        <div className="my-2 h-px bg-line/70" />
                        <form action={signOutAction}>
                          <Button
                            type="submit"
                            variant="ghost"
                            role="menuitem"
                            className="w-full justify-start rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive"
                          >
                            <LogOut className="h-4 w-4" aria-hidden="true" />
                            تسجيل الخروج
                          </Button>
                        </form>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </header>

          <main className="app-main min-w-0 px-4 pb-12 pt-6 sm:px-6 sm:pt-8 lg:px-10">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={pathname}
                initial={
                  shouldReduceMotion ? false : { opacity: 0, y: 10 }
                }
                animate={{ opacity: 1, y: 0 }}
                exit={
                  shouldReduceMotion ? undefined : { opacity: 0, y: -5 }
                }
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : {
                        duration: motionDurations.base,
                        ease: emphasizedEase,
                      }
                }
                className="page-frame min-w-0"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      <AnimatePresence>
        {isOpen ? (
          <div className="fixed inset-0 z-50 md:hidden">
            <motion.button
              type="button"
              className="absolute inset-0 bg-foreground/45 backdrop-blur-sm"
              initial={shouldReduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0 }}
              transition={{
                duration: shouldReduceMotion ? 0 : motionDurations.fast,
                ease: exitEase,
              }}
              onClick={() => setIsOpen(false)}
              aria-label="إغلاق قائمة التنقل"
            />

            <motion.aside
              id={mobilePanelId}
              role="dialog"
              aria-modal="true"
              aria-label="التنقل على الهاتف"
              initial={shouldReduceMotion ? false : { x: "100%" }}
              animate={{ x: 0 }}
              exit={shouldReduceMotion ? undefined : { x: "100%" }}
              transition={motionSpring}
              className="absolute inset-y-0 right-0 w-[min(88vw,22rem)] border-l border-line/80 bg-surface-overlay shadow-surface-lg backdrop-blur-xl"
            >
              <div className="absolute left-3 top-3 z-10">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="rounded-xl"
                  onClick={() => setIsOpen(false)}
                  aria-label="إغلاق التنقل"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </Button>
              </div>

              <NavigationPanel
                collapsed={false}
                workspaceId={workspaceId}
                userEmail={userEmail}
                mobile
                onNavigate={() => setIsOpen(false)}
              />
            </motion.aside>
          </div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {commandOpen ? (
          <div className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[12vh] sm:pt-[16vh]">
            <motion.button
              type="button"
              className="absolute inset-0 bg-foreground/45 backdrop-blur-md"
              initial={shouldReduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0 }}
              transition={{
                duration: shouldReduceMotion ? 0 : motionDurations.fast,
                ease: exitEase,
              }}
              onClick={() => setCommandOpen(false)}
              aria-label="إغلاق لوحة الانتقال"
            />

            <motion.section
              id={commandPanelId}
              role="dialog"
              aria-modal="true"
              aria-label="لوحة الانتقال"
              initial={
                shouldReduceMotion
                  ? false
                  : { opacity: 0, y: 16, scale: 0.985 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={
                shouldReduceMotion
                  ? undefined
                  : { opacity: 0, y: 8, scale: 0.99 }
              }
              transition={motionSpring}
              className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-line/80 bg-surface-overlay shadow-surface-lg backdrop-blur-xl"
            >
              <div className="flex items-center gap-3 border-b border-line/75 px-4 sm:px-5">
                <Search
                  className="h-5 w-5 shrink-0 text-ink-muted"
                  aria-hidden="true"
                />
                <input
                  ref={commandInputRef}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      navigateToFirstCommand();
                    }
                  }}
                  type="search"
                  dir="auto"
                  placeholder="ابحث عن صفحة أو مساحة عمل…"
                  className="min-h-16 min-w-0 flex-1 border-0 bg-transparent px-0 text-base outline-none ring-0 placeholder:text-ink-subtle focus:border-0 focus:ring-0"
                  aria-label="البحث في صفحات التطبيق"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="rounded-xl"
                  onClick={() => setCommandOpen(false)}
                  aria-label="إغلاق لوحة الانتقال"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </Button>
              </div>

              <div className="max-h-[min(28rem,55vh)] overflow-y-auto p-2 sm:p-3">
                {filteredCommandItems.length > 0 ? (
                  <div className="space-y-1">
                    {filteredCommandItems.map((item) => {
                      const Icon = item.icon;
                      const active =
                        pathname === item.href ||
                        pathname.startsWith(`${item.href}/`);

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="group grid min-h-14 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl px-3 outline-none transition-colors duration-fast ease-standard hover:bg-surface-sunken focus-visible:ring-4 focus-visible:ring-ring/20"
                          onClick={() => setCommandOpen(false)}
                        >
                          <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-line/75 bg-surface-raised text-primary shadow-surface-xs">
                            <Icon className="h-4 w-4" aria-hidden="true" />
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-semibold text-foreground">
                              {item.label}
                            </span>
                            <span className="mt-0.5 block truncate text-xs text-ink-muted">
                              {item.description}
                            </span>
                          </span>
                          {active ? (
                            <span className="h-2 w-2 rounded-full bg-primary" aria-label="الصفحة الحالية" />
                          ) : (
                            <ChevronLeft
                              className="h-4 w-4 text-ink-subtle transition-transform duration-fast group-hover:-translate-x-0.5"
                              aria-hidden="true"
                            />
                          )}
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="px-6 py-12 text-center">
                    <p className="text-sm font-semibold">لا توجد نتيجة مطابقة</p>
                    <p className="mt-2 text-xs leading-6 text-ink-muted">
                      جرّب اسم الصفحة أو نوع العمل الذي تريد فتحه.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between gap-4 border-t border-line/75 bg-surface-sunken/70 px-4 py-3 text-[0.68rem] text-ink-muted sm:px-5">
                <span>Enter لفتح أول نتيجة</span>
                <span>Esc للإغلاق</span>
              </div>
            </motion.section>
          </div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
