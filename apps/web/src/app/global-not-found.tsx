import type { Metadata } from "next";
import Link from "next/link";
import { amiri, cairo, inter, notoSansArabic } from "@/lib/fonts";
import { brand } from "@/config/brand";
import "./globals.css";

export const metadata: Metadata = {
  title: `الصفحة غير موجودة | ${brand.name}`,
  description: `The requested ${brand.name} page does not exist.`,
};

export default function GlobalNotFound() {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`
        ${inter.variable}
        ${notoSansArabic.variable}
        ${cairo.variable}
        ${amiri.variable}
      `.trim()}
    >
      <body
        data-ui-foundation="p0"
        className="min-h-screen bg-background font-sans text-foreground antialiased"
      >
        <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center justify-center px-4 py-12 sm:px-6">
          <section className="w-full rounded-2xl border border-line/70 bg-surface-raised p-6 text-center shadow-surface-md sm:p-10">
            <p className="text-sm font-semibold text-primary">404</p>
            <h1 className="mt-3 font-arabic-heading text-3xl font-semibold sm:text-5xl">
              الصفحة غير موجودة
            </h1>
            <p className="mt-4 text-sm leading-8 text-ink-muted sm:text-base">
              لم نتمكن من العثور على الصفحة المطلوبة. The requested page does
              not exist.
            </p>
            <Link
              href="/"
              className="mt-7 inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-surface-xs transition-[opacity,box-shadow,transform] duration-fast ease-standard hover:-translate-y-px hover:opacity-90 hover:shadow-surface-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20"
            >
              العودة إلى البداية
            </Link>
          </section>
        </main>
      </body>
    </html>
  );
}
