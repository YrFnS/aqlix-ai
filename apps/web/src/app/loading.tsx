export default function RootLoading() {
  return (
    <div
      className="mx-auto flex min-h-[70vh] w-full max-w-7xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8"
      role="status"
      aria-live="polite"
      aria-label="جاري تحميل الصفحة"
    >
      <div className="w-full max-w-4xl space-y-6" aria-hidden="true">
        <div className="h-12 w-56 animate-pulse rounded-full bg-secondary" />
        <div className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8">
          <div className="h-10 w-3/4 animate-pulse rounded-2xl bg-secondary" />
          <div className="mt-5 h-5 w-full animate-pulse rounded bg-secondary" />
          <div className="mt-3 h-5 w-5/6 animate-pulse rounded bg-secondary" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="h-32 animate-pulse rounded-3xl bg-secondary" />
            <div className="h-32 animate-pulse rounded-3xl bg-secondary" />
          </div>
        </div>
      </div>
      <span className="sr-only">
        جاري تجهيز الصفحة والتحقق من الجلسة والبيانات المحفوظة.
      </span>
    </div>
  );
}
