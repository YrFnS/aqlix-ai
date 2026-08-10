import { PageShell } from "@/components/ui/page-shell";
import { Surface } from "@/components/ui/surface";

export default function RootLoading() {
  return (
    <PageShell
      width="wide"
      className="flex min-h-[70vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8"
      role="status"
      aria-live="polite"
      aria-label="جاري تحميل الصفحة"
    >
      <div className="w-full max-w-4xl space-y-6" aria-hidden="true">
        <div className="h-12 w-56 animate-pulse rounded-full bg-secondary" />
        <Surface tone="raised" elevation="sm" radius="2xl" padding="lg">
          <div className="h-10 w-3/4 animate-pulse rounded-lg bg-secondary" />
          <div className="mt-5 h-5 w-full animate-pulse rounded-sm bg-secondary" />
          <div className="mt-3 h-5 w-5/6 animate-pulse rounded-sm bg-secondary" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="h-32 animate-pulse rounded-xl bg-secondary" />
            <div className="h-32 animate-pulse rounded-xl bg-secondary" />
          </div>
        </Surface>
      </div>
      <span className="sr-only">
        جاري تجهيز الصفحة والتحقق من الجلسة والبيانات المحفوظة.
      </span>
    </PageShell>
  );
}
