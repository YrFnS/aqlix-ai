import Link from "next/link";
import { ArrowRight, FileX2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DraftNotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center">
      <section className="w-full rounded-3xl border border-border/70 bg-card p-6 text-center shadow-lg shadow-foreground/5 sm:p-10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-primary">
          <FileX2 className="h-6 w-6" aria-hidden="true" />
        </div>
        <p className="mt-6 text-sm font-semibold text-primary">
          P4 · Missing or forbidden
        </p>
        <h1 className="mt-3 font-arabic-heading text-3xl font-semibold">
          المسودة غير متاحة
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-8 text-muted-foreground">
          قد تكون المسودة حُذفت، أو أن حسابك لا يملك عضوية في مساحة العمل. لا
          تكشف الصفحة إن كان المحتوى أو إصداراته موجودة داخل مساحة أخرى.
        </p>
        <Button asChild className="mt-7 rounded-full px-6">
          <Link href="/workspaces">
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
            العودة إلى مساحاتك
          </Link>
        </Button>
      </section>
    </div>
  );
}
