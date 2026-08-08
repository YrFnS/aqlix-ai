export default function SourceDocumentLoading() {
  return (
    <div
      className="mx-auto max-w-7xl space-y-6"
      role="status"
      aria-live="polite"
      aria-label="جاري تحميل المستند والمقاطع"
    >
      <header className="rounded-3xl border border-border/70 bg-foreground p-6 sm:p-8">
        <div className="h-11 w-40 animate-pulse rounded-full bg-background/10" />
        <div className="mt-7 h-6 w-32 animate-pulse rounded-full bg-background/10" />
        <div className="mt-5 h-12 w-2/3 animate-pulse rounded-2xl bg-background/10" />
        <div className="mt-4 h-5 w-full max-w-2xl animate-pulse rounded bg-background/10" />
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="h-32 animate-pulse rounded-3xl border border-border/70 bg-card"
            aria-hidden="true"
          />
        ))}
      </section>

      <section className="space-y-4">
        <div className="h-8 w-56 animate-pulse rounded-xl bg-secondary" />
        <div className="h-48 animate-pulse rounded-3xl bg-secondary" />
        <div className="h-48 animate-pulse rounded-3xl bg-secondary" />
      </section>
      <span className="sr-only">
        جاري تحميل بيانات الملف الخاص والمقاطع والعناوين الثابتة.
      </span>
    </div>
  );
}
