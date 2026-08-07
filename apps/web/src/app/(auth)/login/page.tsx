import type { Metadata } from "next";
import { FileText, Languages, ShieldCheck } from "lucide-react";
import { LoginForm } from "@/components/auth";
import { brand } from "@/config/brand";

export const metadata: Metadata = {
  title: "تسجيل الدخول",
  description: `Sign in to ${brand.name}`,
};

const productNotes = [
  {
    title: "العربية والإنجليزية",
    description: "واجهة واتجاه نص ومحتوى مختلط كجزء أساسي من المنتج.",
    icon: Languages,
  },
  {
    title: "السياق والمستندات",
    description: "المنتج يُعاد بناؤه حول مصادر قابلة للفحص ومسودات قابلة للحفظ.",
    icon: FileText,
  },
  {
    title: "حالة واضحة",
    description: "لا نعرض الوظائف المخططة كأنها مكتملة أو جاهزة للإنتاج.",
    icon: ShieldCheck,
  },
];

export default function LoginPage() {
  return (
    <div className="grid overflow-hidden rounded-[2rem] border border-border/70 bg-card shadow-2xl shadow-foreground/5 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="relative hidden overflow-hidden bg-foreground p-10 text-background lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute -left-20 top-12 h-72 w-72 rounded-full bg-primary/30 blur-3xl" />
        <div className="relative">
          <p className="text-sm font-semibold text-background/60">
            {brand.categoryAr}
          </p>
          <h1 className="mt-5 text-balance font-arabic-heading text-4xl font-semibold leading-tight">
            ارجع إلى السياق، وأكمل العمل من حيث توقفت.
          </h1>
          <p className="mt-5 text-sm leading-8 text-background/65">
            صفحة الدخول جزء من أساس إعادة البناء. الحفظ الدائم والمحادثة الحقيقية
            والمستندات ستُفعّل بحسب مراحل التنفيذ الموثقة.
          </p>
        </div>

        <div className="relative mt-12 space-y-4">
          {productNotes.map(({ title, description, icon: Icon }) => (
            <div
              key={title}
              className="flex gap-4 rounded-2xl border border-background/15 bg-background/5 p-4"
            >
              <div className="h-fit rounded-xl bg-background/10 p-2.5">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-semibold">{title}</p>
                <p className="mt-1 text-xs leading-6 text-background/55">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="flex min-h-[620px] items-center justify-center p-6 sm:p-10 lg:p-14">
        <div className="w-full max-w-md rounded-3xl border border-border/70 bg-background p-6 shadow-sm sm:p-8">
          <LoginForm
            redirectTo={brand.links.workspace}
            culturalMode="both"
            showRegisterLink={true}
          />
        </div>
      </section>
    </div>
  );
}
