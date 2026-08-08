function DocumentSkeleton() {
  return (
    <div className="rounded-3xl border border-border/70 bg-card p-6" aria-hidden="true">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div className="h-5 w-20 animate-pulse rounded-full bg-secondary" />
          <div className="h-7 w-3/4 animate-pulse rounded-xl bg-secondary" />
        </div>
        <div className="h-12 w-12 animate-pulse rounded-2xl bg-secondary" />
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="h-16 animate-pulse rounded-2xl bg-secondary" />
        <div className="h-16 animate-pulse rounded-2xl bg-secondary" />
      </div>
    </div>
  );
}

export default function WorkspaceSourcesLoading() {
  return (
    <div
      className="mx-auto max-w-7xl space-y-6"
      role="status"
      aria-live="polite"
      aria-label="جاري تحميل المصادر"
    >
      <header className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8">
        <div className="h-11 w-44 animate-pulse rounded-full bg-secondary" />
        <div className="mt-6 h-12 w-80 max-w-full animate-pulse rounded-2xl bg-secondary" />
        <div className="mt-4 h-5 w-full max-w-2xl animate-pulse rounded bg-secondary" />
      </header>

      <div className="grid gap-6 xl:grid-cols-[0.72fr_1.28fr]">
        <section className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8">
          <div className="h-8 w-48 animate-pulse rounded-xl bg-secondary" />
          <div className="mt-7 h-44 animate-pulse rounded-3xl bg-secondary" />
          <div className="mt-4 h-12 animate-pulse rounded-full bg-secondary" />
        </section>
        <section className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8">
          <div className="h-8 w-52 animate-pulse rounded-xl bg-secondary" />
          <div className="mt-6 h-12 animate-pulse rounded-2xl bg-secondary" />
          <div className="mt-7 h-32 animate-pulse rounded-3xl bg-secondary" />
        </section>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <DocumentSkeleton />
        <DocumentSkeleton />
        <DocumentSkeleton />
      </section>
      <span className="sr-only">
        جاري التحقق من العضوية وتحميل الملفات والمقاطع المحفوظة.
      </span>
    </div>
  );
}
