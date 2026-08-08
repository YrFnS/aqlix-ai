import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import "./rebuild.css";

export const metadata: Metadata = {
  title: "الصفحة غير موجودة | Kiteb",
  description: "The requested Kiteb page does not exist.",
};

export default function GlobalNotFound() {
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center justify-center px-4 py-12 sm:px-6">
          <section className="w-full rounded-3xl border border-border/70 bg-card p-6 text-center shadow-sm sm:p-10">
            <p className="text-sm font-semibold text-primary">404</p>
            <h1 className="mt-3 font-arabic-heading text-3xl font-semibold sm:text-5xl">
              الصفحة غير موجودة
            </h1>
            <p className="mt-4 text-sm leading-8 text-muted-foreground sm:text-base">
              لم نتمكن من العثور على الصفحة المطلوبة. The requested page does
              not exist.
            </p>
            <Link
              href="/"
              className="mt-7 inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              العودة إلى البداية
            </Link>
          </section>
        </main>
      </body>
    </html>
  );
}
