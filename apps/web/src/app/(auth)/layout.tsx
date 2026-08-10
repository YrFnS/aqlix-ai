import type { ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BrandMark } from "@/components/brand/brand-mark";
import { brand } from "@/config/brand";

export const metadata: Metadata = {
  title: "الحساب",
  description: `Account access for ${brand.name}`,
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  const year = new Date().getFullYear();

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-canvas">
      <div
        className="pointer-events-none absolute -left-48 -top-48 h-[34rem] w-[34rem] rounded-full bg-primary/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-48 top-1/3 h-[30rem] w-[30rem] rounded-full bg-brand-soft/80 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-35"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--ink) / 0.03) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--ink) / 0.03) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "linear-gradient(to bottom, black, transparent 82%)",
        }}
        aria-hidden="true"
      />

      <header className="relative z-10 border-b border-line/70 bg-canvas/75 backdrop-blur-xl">
        <div className="container-responsive flex h-[4.5rem] items-center justify-between gap-4">
          <Link
            href={brand.links.home}
            className="rounded-xl outline-none transition-opacity hover:opacity-80 focus-visible:ring-4 focus-visible:ring-ring/20"
            aria-label={`${brand.name} home`}
          >
            <BrandMark size="sm" />
          </Link>

          <div className="flex items-center gap-4 text-sm">
            <Link
              href={brand.links.documentation}
              className="hidden rounded-md font-medium text-ink-muted outline-none transition-colors hover:text-foreground focus-visible:ring-4 focus-visible:ring-ring/20 sm:inline-flex"
            >
              المستندات
            </Link>
            <Link
              href={brand.links.home}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-surface-raised px-4 font-semibold text-foreground shadow-surface-xs outline-none transition-[border-color,background-color,box-shadow] hover:border-line-strong hover:bg-surface-sunken focus-visible:ring-4 focus-visible:ring-ring/20"
            >
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
              العودة للرئيسية
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="w-full max-w-6xl">{children}</div>
      </main>

      <footer className="relative z-10 border-t border-line/70 bg-canvas/70 backdrop-blur-xl">
        <div className="container-responsive flex flex-col gap-2 py-5 text-xs leading-6 text-ink-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {brand.name}
          </p>
          <p>جلسات الحساب تقود إلى المساحات المسموح لك بالوصول إليها فقط.</p>
        </div>
      </footer>
    </div>
  );
}
