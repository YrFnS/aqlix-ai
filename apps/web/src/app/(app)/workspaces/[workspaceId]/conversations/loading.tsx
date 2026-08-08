function CardSkeleton() {
  return (
    <div className="rounded-3xl border border-border/70 bg-card p-6" aria-hidden="true">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div className="h-5 w-20 animate-pulse rounded-full bg-secondary" />
          <div className="h-7 w-2/3 animate-pulse rounded-xl bg-secondary" />
        </div>
        <div className="h-12 w-12 animate-pulse rounded-2xl bg-secondary" />
      </div>
      <div className="mt-5 h-4 w-4/5 animate-pulse rounded bg-secondary" />
      <div className="mt-7 h-11 w-full animate-pulse rounded-full bg-secondary" />
    </div>
  );
}

export default function ConversationsLoading() {
  return (
    <div
      className="mx-auto max-w-7xl space-y-6"
      role="status"
      aria-live="polite"
      aria-label="جاري تحميل المحادثات"
    >
      <header className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8">
        <div className="h-11 w-44 animate-pulse rounded-full bg-secondary" />
        <div className="mt-6 h-12 w-80 max-w-full animate-pulse rounded-2xl bg-secondary" />
        <div className="mt-4 h-5 w-full max-w-2xl animate-pulse rounded bg-secondary" />
      </header>

      <div className="grid gap-6 xl:grid-cols-[0.72fr_1.28fr]">
        <section className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8">
          <div className="h-8 w-48 animate-pulse rounded-xl bg-secondary" />
          <div className="mt-7 h-12 animate-pulse rounded-2xl bg-secondary" />
          <div className="mt-5 h-12 animate-pulse rounded-full bg-secondary" />
        </section>
        <section className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8">
          <div className="h-8 w-52 animate-pulse rounded-xl bg-secondary" />
          <div className="mt-7 grid gap-4 md:grid-cols-2">
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </section>
      </div>
      <span className="sr-only">جاري تحميل السجل المحفوظ.</span>
    </div>
  );
}
