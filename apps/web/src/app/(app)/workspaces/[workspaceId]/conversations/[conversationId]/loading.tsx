export default function ConversationDetailLoading() {
  return (
    <div
      className="mx-auto max-w-7xl space-y-6"
      role="status"
      aria-live="polite"
      aria-label="جاري تحميل المحادثة"
    >
      <header className="rounded-3xl border border-border/70 bg-foreground p-6 sm:p-8">
        <div className="h-11 w-40 animate-pulse rounded-full bg-background/10" />
        <div className="mt-7 h-6 w-28 animate-pulse rounded-full bg-background/10" />
        <div className="mt-5 h-12 w-2/3 animate-pulse rounded-2xl bg-background/10" />
        <div className="mt-4 h-5 w-full max-w-2xl animate-pulse rounded bg-background/10" />
      </header>

      <section className="min-h-[70vh] rounded-3xl border border-border/70 bg-card p-5 sm:p-7">
        <div className="space-y-6">
          <div className="mr-auto h-28 w-3/4 animate-pulse rounded-3xl bg-secondary" />
          <div className="ml-auto h-20 w-2/3 animate-pulse rounded-3xl bg-primary/15" />
          <div className="mr-auto h-40 w-4/5 animate-pulse rounded-3xl bg-secondary" />
        </div>
        <div className="mt-10 h-28 animate-pulse rounded-3xl bg-secondary" />
      </section>
      <span className="sr-only">
        جاري التحقق من العضوية وتحميل الرسائل ومحاولات التوليد.
      </span>
    </div>
  );
}
