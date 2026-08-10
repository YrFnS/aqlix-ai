import Link from "next/link";
import { ArrowUpLeft } from "lucide-react";
import { BrandMark } from "@/components/brand/brand-mark";
import { brand } from "@/config/brand";

const links = [
  { href: "/#how-it-works", label: "كيف يعمل" },
  { href: "/#capabilities", label: "القدرات" },
  { href: "/#principles", label: "المبادئ" },
  { href: brand.links.documentation, label: "الدليل" },
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-line/70 bg-surface-sunken/45">
      <div className="container-responsive grid gap-10 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <div className="max-w-2xl">
          <BrandMark size="sm" />
          <p className="mt-5 max-w-xl text-sm leading-7 text-ink-muted">
            {brand.descriptionAr} اسأل، أضف السياق، ثم حوّل النتيجة إلى عمل يمكنك
            حفظه ومتابعته.
          </p>
          <p className="mt-4 max-w-xl text-xs leading-6 text-ink-subtle">
            يوضح الدليل أنواع الملفات والحدود الحالية قبل أن تبدأ. Tuppra is an
            Arabic-first bilingual AI workspace، ولا تعرض قدرات أو ادعاءات غير
            منفذة.
          </p>
        </div>

        <div className="space-y-5 lg:text-left">
          <nav
            aria-label="روابط تذييل الصفحة"
            className="flex flex-wrap gap-x-5 gap-y-3 lg:justify-end"
          >
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md text-sm font-medium text-ink-muted outline-none transition-colors hover:text-foreground focus-visible:ring-4 focus-visible:ring-ring/20"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-3 text-xs text-ink-subtle sm:flex-row sm:items-center sm:justify-between lg:justify-end lg:gap-6">
            <p>
              © {year} {brand.name}
            </p>
            <Link
              href={brand.links.signIn}
              className="inline-flex items-center gap-2 rounded-md font-semibold text-primary outline-none hover:underline focus-visible:ring-4 focus-visible:ring-ring/20"
            >
              تسجيل الدخول
              <ArrowUpLeft className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
