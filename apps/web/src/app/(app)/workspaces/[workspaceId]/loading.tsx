export default function WorkspaceDetailLoading() {
  return (
    <div
      className="mx-auto max-w-7xl space-y-6"
      role="status"
      aria-live="polite"
      aria-label="جاري تحميل مساحة العمل"
    >
      <header className="rounded-3xl border border-border/70 bg-foreground p-6 sm:p-8">
        <div className="h-11 w-40 animate-pulse rounded-full bg-background/10" />
        <div className="mt-7 h-6 w-28 animate-pulse rounded-full bg-background/10" />
        <div className="mt-5 h-12 w-2/3 animate-pulse rounded-2xl bg-background/10" />
        <div className="mt-4 h-5 w-full max-w-2xl animate-pulse rounded bg-background/10" />
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className="rounded-3xl border border-border/70 bg-card p-6"
            aria-hidden="true"
          >
            <div className="flex items-start justify-between">
              <div className="h-12 w-12 animate-pulse rounded-2xl bg-secondary" />
              <div className="h-6 w-10 animate-pulse rounded-full bg-secondary" />
            </div>
            <div className="mt-6 h-7 w-32 animate-pulse rounded-xl bg-secondary" />
            <div className="mt-4 space-y-2">
              <div className="h-4 w-full animate-pulse rounded bg-secondary" />
              <div className="h-4 w-4/5 animate-pulse rounded bg-secondary" />
            </div>
          </div>
        ))}
      </section>

      <section className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8">
        <div className="h-7 w-48 animate-pulse rounded-xl bg-secondary" />
        <div className="mt-4 h-4 w-full max-w-3xl animate-pulse rounded bg-secondary" />
      </section>
      <span className="sr-only">جاري التحقق من العضوية وتحميل المساحة.</span>
    </div>
  );
}
