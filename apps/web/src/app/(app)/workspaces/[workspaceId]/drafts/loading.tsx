function DraftSkeleton() {
  return (
    <div
      className="rounded-3xl border border-border/70 bg-card p-6"
      aria-hidden="true"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div className="h-5 w-24 animate-pulse rounded-full bg-secondary" />
          <div className="h-7 w-3/4 animate-pulse rounded-xl bg-secondary" />
        </div>
        <div className="h-12 w-12 animate-pulse rounded-2xl bg-secondary" />
      </div>
      <div className="mt-5 h-20 animate-pulse rounded-2xl bg-secondary" />
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="h-16 animate-pulse rounded-2xl bg-secondary" />
        <div className="h-16 animate-pulse rounded-2xl bg-secondary" />
      </div>
    </div>
  );
}

export default function DraftLibraryLoading() {
  return (
    <div
      className="mx-auto max-w-7xl space-y-6"
      role="status"
      aria-live="polite"
      aria-label="جاري تحميل المسودات"
    >
      <header className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8">
        <div className="h-11 w-44 animate-pulse rounded-full bg-secondary" />
        <div className="mt-7 h-12 w-80 max-w-full animate-pulse rounded-2xl bg-secondary" />
        <div className="mt-4 h-5 w-full max-w-2xl animate-pulse rounded bg-secondary" />
      </header>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <DraftSkeleton />
        <DraftSkeleton />
        <DraftSkeleton />
      </section>
      <span className="sr-only">
        جاري التحقق من العضوية وتحميل المسودات والإصدارات المحفوظة.
      </span>
    </div>
  );
}
