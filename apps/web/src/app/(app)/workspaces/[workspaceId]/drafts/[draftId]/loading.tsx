export default function DraftCanvasLoading() {
  return (
    <div
      className="mx-auto max-w-7xl space-y-6"
      role="status"
      aria-live="polite"
      aria-label="جاري تحميل المسودة والإصدارات"
    >
      <header className="rounded-3xl border border-border/70 bg-foreground p-6 sm:p-8">
        <div className="h-11 w-44 animate-pulse rounded-full bg-background/10" />
        <div className="mt-7 h-6 w-32 animate-pulse rounded-full bg-background/10" />
        <div className="mt-5 h-12 w-2/3 animate-pulse rounded-2xl bg-background/10" />
        <div className="mt-4 h-5 w-full max-w-2xl animate-pulse rounded bg-background/10" />
      </header>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8">
          <div className="h-8 w-48 animate-pulse rounded-xl bg-secondary" />
          <div className="mt-6 h-12 animate-pulse rounded-2xl bg-secondary" />
          <div className="mt-4 h-[34rem] animate-pulse rounded-3xl bg-secondary" />
        </div>
        <div className="space-y-6">
          <div className="h-64 animate-pulse rounded-3xl bg-secondary" />
          <div className="h-48 animate-pulse rounded-3xl bg-secondary" />
        </div>
      </section>
      <span className="sr-only">
        جاري تحميل المحتوى المقبول والإصدارات والمنشأ ومحاولات الاستمرار.
      </span>
    </div>
  );
}
