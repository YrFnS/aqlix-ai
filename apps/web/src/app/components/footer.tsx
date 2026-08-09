import Link from "next/link";
import { brand } from "@/config/brand";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border/70 bg-card/50">
      <div className="container-responsive grid gap-8 py-10 sm:grid-cols-[1fr_auto] sm:items-end">
        <div className="max-w-xl space-y-3">
          <p className="font-arabic-heading text-xl font-semibold">
            {brand.name}
          </p>
          <p className="text-sm leading-7 text-muted-foreground">
            {brand.descriptionAr}
          </p>
          <p className="text-xs leading-6 text-muted-foreground">
            اسم المنتج النهائي قيد المراجعة، وهذه المعاينة ليست إعلاناً عن
            جاهزية تجارية أو قانونية.
          </p>
        </div>

        <div className="space-y-3 text-sm text-muted-foreground sm:text-left">
          <div className="flex flex-wrap gap-x-5 gap-y-2 sm:justify-end">
            <Link
              href={brand.links.documentation}
              className="transition-colors hover:text-foreground"
            >
              المستندات
            </Link>
            <Link
              href={brand.links.signIn}
              className="transition-colors hover:text-foreground"
            >
              تسجيل الدخول
            </Link>
          </div>
          <p>
            © {year} {brand.name}. Product rebuild in progress.
          </p>
        </div>
      </div>
    </footer>
  );
}
