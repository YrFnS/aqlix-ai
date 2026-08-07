function WorkspaceCardSkeleton() {
  return (
    <div className="rounded-3xl border border-border/70 bg-card p-6" aria-hidden="true">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div className="h-5 w-20 animate-pulse rounded-full bg-secondary" />
          <div className="h-7 w-2/3 animate-pulse rounded-xl bg-secondary" />
        </div>
        <div className="h-12 w-12 animate-pulse rounded-2xl bg-secondary" />
      </div>
      <div className="mt-5 space-y-2">
        <div className="h-4 w-full animate-pulse rounded bg-secondary" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-secondary" />
        <div className="h-4 w-3/5 animate-pulse rounded bg-secondary" />
      </div>
      <div className="mt-6 h-11 w-32 animate-pulse rounded-full bg-secondary" />
    </div>
  );
}

export default function WorkspacesLoading() {
  return (
    <div
      className="mx-auto max-w-7xl space-y-6"
      role="status"
      aria-live="polite"
      aria-label="جاري تحميل مساحات العمل"
    >
      <header className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8">
        <div className="h-6 w-40 animate-pulse rounded-full bg-secondary" />
        <div className="mt-5 h-12 w-72 max-w-full animate-pulse rounded-2xl bg-secondary" />
        <div className="mt-4 h-5 w-full max-w-2xl animate-pulse rounded bg-secondary" />
      </header>

      <div className="grid gap-6 xl:grid-cols-[0.72fr_1.28fr]">
        <section className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8">
          <div className="h-7 w-44 animate-pulse rounded-xl bg-secondary" />
          <div className="mt-7 space-y-5">
            <div className="h-12 animate-pulse rounded-2xl bg-secondary" />
            <div className="h-28 animate-pulse rounded-2xl bg-secondary" />
            <div className="h-12 animate-pulse rounded-2xl bg-secondary" />
            <div className="h-12 animate-pulse rounded-full bg-secondary" />
          </div>
        </section>

        <section className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8">
          <div className="h-7 w-48 animate-pulse rounded-xl bg-secondary" />
          <div className="mt-7 grid gap-4 md:grid-cols-2">
            <WorkspaceCardSkeleton />
            <WorkspaceCardSkeleton />
          </div>
        </section>
      </div>
      <span className="sr-only">جاري تحميل البيانات المحفوظة.</span>
    </div>
  );
}
