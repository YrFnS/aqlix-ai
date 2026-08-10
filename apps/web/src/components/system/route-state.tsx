import type { ReactNode } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/ui/page-shell";
import { Surface } from "@/components/ui/surface";

export function RouteFailureState({
  eyebrow = "تعذر إكمال الطلب",
  title,
  description,
  reset,
  backHref,
  backLabel = "العودة إلى مساحات العمل",
  reference,
}: {
  eyebrow?: string;
  title: string;
  description: ReactNode;
  reset?: () => void;
  backHref?: string;
  backLabel?: string;
  reference?: string;
}) {
  return (
    <PageShell
      width="default"
      className="flex min-h-[68vh] items-center justify-center py-8 sm:py-12"
    >
      <Surface
        tone="raised"
        elevation="md"
        radius="2xl"
        padding="lg"
        className="w-full max-w-3xl border-destructive/25 text-center"
        role="alert"
        aria-live="assertive"
      >
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/10 text-destructive">
          <AlertTriangle className="h-6 w-6" aria-hidden="true" />
        </span>
        <p className="mt-6 text-sm font-semibold text-destructive">{eyebrow}</p>
        <h1 className="mt-3 text-balance font-arabic-heading text-3xl font-semibold sm:text-4xl">
          {title}
        </h1>
        <div className="mx-auto mt-4 max-w-2xl text-sm leading-8 text-ink-muted sm:text-base">
          {description}
        </div>

        {reference ? (
          <p className="mx-auto mt-5 w-fit rounded-lg bg-surface-sunken px-3 py-1.5 font-mono text-[0.68rem] text-ink-subtle">
            <span className="font-sans">مرجع الخطأ: </span>
            <span dir="ltr">{reference}</span>
          </p>
        ) : null}

        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          {reset ? (
            <Button type="button" onClick={reset} className="rounded-full px-6">
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              إعادة المحاولة
            </Button>
          ) : null}
          {backHref ? (
            <Button asChild variant="outline" className="rounded-full px-6">
              <Link href={backHref}>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
                {backLabel}
              </Link>
            </Button>
          ) : null}
        </div>
      </Surface>
    </PageShell>
  );
}

function SkeletonCard() {
  return (
    <Surface
      tone="raised"
      elevation="xs"
      radius="2xl"
      padding="md"
      className="h-full"
      aria-hidden="true"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1 space-y-3">
          <div className="skeleton h-5 w-24 rounded-full" />
          <div className="skeleton h-7 w-4/5 rounded-lg" />
        </div>
        <div className="skeleton h-11 w-11 rounded-xl" />
      </div>
      <div className="skeleton mt-5 h-4 w-full rounded" />
      <div className="skeleton mt-2 h-4 w-3/4 rounded" />
      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="skeleton h-14 rounded-xl" />
        <div className="skeleton h-14 rounded-xl" />
      </div>
    </Surface>
  );
}

export function RouteLoadingState({
  label,
  metricCount = 3,
  cardCount = 3,
  sidebar = false,
}: {
  label: string;
  metricCount?: number;
  cardCount?: number;
  sidebar?: boolean;
}) {
  return (
    <PageShell
      width="wide"
      className="space-y-8"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={label}
    >
      <div className="space-y-8" aria-hidden="true">
        <div className="space-y-4 py-2">
          <div className="skeleton h-5 w-32 rounded-full" />
          <div className="skeleton h-11 w-[min(100%,32rem)] rounded-xl" />
          <div className="skeleton h-5 w-full max-w-3xl rounded" />
          <div className="skeleton h-5 w-4/5 max-w-2xl rounded" />
        </div>

        <div
          className="grid gap-3"
          style={{ gridTemplateColumns: `repeat(${metricCount}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: metricCount }, (_, index) => (
            <Surface
              key={index}
              tone="raised"
              elevation="xs"
              radius="xl"
              padding="sm"
            >
              <div className="skeleton h-4 w-20 rounded" />
              <div className="skeleton mt-3 h-8 w-16 rounded-lg" />
            </Surface>
          ))}
        </div>

        <div
          className={
            sidebar
              ? "grid gap-6 xl:grid-cols-[21rem_minmax(0,1fr)]"
              : "space-y-6"
          }
        >
          {sidebar ? (
            <Surface
              tone="raised"
              elevation="sm"
              radius="2xl"
              padding="md"
              className="h-fit"
            >
              <div className="skeleton h-6 w-40 rounded-lg" />
              <div className="skeleton mt-4 h-4 w-full rounded" />
              <div className="skeleton mt-2 h-4 w-4/5 rounded" />
              <div className="skeleton mt-6 h-40 rounded-2xl" />
              <div className="skeleton mt-4 h-11 rounded-xl" />
            </Surface>
          ) : null}

          <div className="min-w-0 space-y-5">
            <Surface
              tone="raised"
              elevation="xs"
              radius="2xl"
              padding="sm"
            >
              <div className="skeleton h-12 rounded-xl" />
            </Surface>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: cardCount }, (_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <span className="sr-only">{label}</span>
    </PageShell>
  );
}
