import Link from "next/link";
import { ArrowUpLeft } from "lucide-react";
import { brand } from "@/config/brand";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border/70 bg-card/55">
      <div className="container-responsive grid gap-8 py-10 sm:grid-cols-[1fr_auto] sm:items-end">
        <div className="max-w-xl">
          <div className="flex items-center gap-3">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary text-sm font-bold text-primary-foreground"
              aria-hidden="true"
            >
              T
            </span>
            <p className="font-arabic-heading text-xl font-semibold">
              {brand.name}
            </p>
          </div>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            {brand.descriptionAr}
          </p>
          <p className="mt-2 text-xs leading-6 text-muted-foreground">
            يوضح الدليل أنواع الملفات والصيغ والقدرات المتاحة حالياً داخل المنتج.
          </p>
        </div>

        <div className="space-y-4 text-sm text-muted-foreground sm:text-left">
          <div className="flex flex-wrap gap-x-5 gap-y-2 sm:justify-end">
            <Link
              href={brand.links.documentation}
              className="transition-colors hover:text-foreground"
            >
              الدليل
            </Link>
            <Link
              href={brand.links.signIn}
              className="transition-colors hover:text-foreground"
            >
              تسجيل الدخول
            </Link>
            <Link
              href={brand.links.registration}
              className="inline-flex items-center gap-1.5 font-semibold text-primary transition-colors hover:text-primary/80"
            >
              إنشاء حساب
              <ArrowUpLeft className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
          <p dir="ltr" className="text-xs">
            © {year} {brand.name}. Arabic-first bilingual AI workspace.
          </p>
        </div>
      </div>
    </footer>
  );
}
