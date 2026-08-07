import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@/config/brand";

export const metadata: Metadata = {
  title: "الحساب",
  description: `Sign in to ${brand.name}`,
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const year = new Date().getFullYear();

  return (
    <div className="flex min-h-screen flex-col bg-secondary/25">
      <header className="border-b border-border/70 bg-background/85 backdrop-blur-xl">
        <div className="container-responsive flex h-16 items-center justify-between gap-4">
          <Link href={brand.links.home} className="flex items-center gap-3">
            <span className="font-arabic-heading text-2xl font-semibold tracking-tight">
              {brand.name}
            </span>
            <span className="hidden rounded-full border border-border bg-card px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-[0.14em] text-muted-foreground sm:inline-flex">
              {brand.status}
            </span>
          </Link>
          <Link
            href={brand.links.documentation}
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            المستندات
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center p-4 py-10 sm:p-8">
        <div className="w-full max-w-6xl">{children}</div>
      </main>

      <footer className="border-t border-border/70 bg-background/75">
        <div className="container-responsive flex flex-col gap-3 py-6 text-xs leading-6 text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {brand.name}. Product rebuild in progress.
          </p>
          <p>
            اسم عمل مؤقت · لا توجد مطالبة بالجاهزية التجارية أو القانونية.
          </p>
        </div>
      </footer>
    </div>
  );
}
