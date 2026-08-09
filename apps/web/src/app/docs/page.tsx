import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpLeft,
  BookOpen,
  Check,
  FileText,
  ShieldCheck,
} from "lucide-react";
import { brand } from "@/config/brand";

export const metadata: Metadata = {
  title: "خطة المنتج",
  description: `Verified ${brand.name} rebuild status, product loop, active capabilities, and operational-readiness boundaries.`,
};

const phases = [
  {
    phase: "P0",
    title: "الأساس الموثوق",
    status: "مكتمل",
    description:
      "هوية مؤقتة صادقة، نطاق مركز، Bun موحد، RTL/Arabic foundation، وبوابات جودة بلا ادعاءات جاهزية غير مثبتة.",
  },
  {
    phase: "P1",
    title: "الحساب ومساحة العمل",
    status: "مكتمل",
    description:
      "Supabase Auth، جلسات محمية، PostgreSQL، RLS، أدوار المالك والمحرر والقارئ، ودورة حياة كاملة لمساحات العمل.",
  },
  {
    phase: "P2",
    title: "المحادثة الثنائية",
    status: "مكتمل",
    description:
      "رسائل متدفقة ومحفوظة، Stop، retry، أخطاء مزود صريحة، قياس التوليد، وعزل الحسابات داخل مساحة العمل.",
  },
  {
    phase: "P3",
    title: "المصادر والمراجع",
    status: "مكتمل",
    description:
      "ملفات TXT وMarkdown خاصة، استخراج حتمي، مقاطع قابلة للفحص، بحث داخل المساحة، وإجابات موثقة بمراجع دائمة.",
  },
  {
    phase: "P4",
    title: "المسودات والعمل القابل لإعادة الاستخدام",
    status: "مكتمل على فرع P4",
    description:
      "ستة هياكل أولية، محرر عربي/English، إصدارات غير قابلة لإعادة الكتابة، منشأ محفوظ، تصدير UTF-8، واقتراحات منفصلة قبل التطبيق.",
  },
  {
    phase: "P5",
    title: "الجاهزية التشغيلية",
    status: "التالي",
    description:
      "النشر، النسخ الاحتياطي والاستعادة، المراقبة، الحدود والتكلفة، مراجعة الأمن والخصوصية، وتدقيق التراخيص والمنشأ.",
  },
] as const;

const completedLoop = [
  {
    label: "Ask",
    text: "اسأل بالعربية أو English داخل محادثة محفوظة.",
  },
  {
    label: "Ground",
    text: "استخدم مصادر خاصة وافتح المقطع الداعم نفسه.",
  },
  {
    label: "Draft",
    text: "حوّل الإجابة إلى عمل قابل للتحرير مع منشأ وإصدارات.",
  },
  {
    label: "Continue",
    text: "راجع اقتراحاً متدفقاً ثم طبّقه كإصدار جديد أو ارفضه.",
  },
] as const;

export default function ProductPlanPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="relative overflow-hidden rounded-3xl border border-border/70 bg-foreground p-6 text-background sm:p-10">
          <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-primary/30 blur-3xl" />
          <div className="relative grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-background/20 bg-background/5 px-3 py-1.5 text-xs font-semibold text-background/75">
                <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                {brand.name}
              </div>
              <h1 className="mt-6 text-balance font-arabic-heading text-4xl font-semibold sm:text-6xl">
                خطة منتج قابلة للتحقق، لا قائمة وعود
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-9 text-background/65 sm:text-lg">
                {brand.name} مساحة عمل عربية أولاً وثنائية اللغة لتحويل
                المحادثات والمستندات إلى عمل واضح وقابل لإعادة الاستخدام. الحلقة
                الأساسية تعمل الآن على فرع P4، بينما تبقى الجاهزية التشغيلية
                والإطلاق العام ضمن P5.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/workspaces"
                  className="inline-flex min-h-12 items-center gap-2 rounded-full bg-background px-5 text-sm font-semibold text-foreground transition-colors hover:bg-background/90"
                >
                  فتح مساحات العمل
                  <ArrowUpLeft className="h-4 w-4" aria-hidden="true" />
                </Link>
                <span className="inline-flex min-h-12 items-center gap-2 rounded-full border border-background/20 px-5 text-sm font-semibold text-background/75">
                  <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                  Production ready: No
                </span>
              </div>
            </div>

            <div className="rounded-3xl border border-background/15 bg-background/5 p-5 backdrop-blur">
              <div className="flex items-center gap-3">
                <ShieldCheck
                  className="h-5 w-5 text-primary"
                  aria-hidden="true"
                />
                <p className="text-sm font-semibold">نطاق مثبت بالاختبارات</p>
              </div>
              <p className="mt-3 text-sm leading-7 text-background/60">
                الحسابات، RLS، المحادثة، التخزين الخاص، المراجع، المسودات،
                الإصدارات، التصدير، والاقتراحات لها عقود PostgreSQL ورحلات متصفح
                حقيقية. هذا لا يعادل اعتماداً أمنياً أو جاهزية تشغيلية.
              </p>
            </div>
          </div>
        </header>

        <section className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8">
          <p className="text-sm font-semibold text-primary">الحلقة الأساسية</p>
          <h2 className="mt-2 font-arabic-heading text-3xl font-semibold">
            Ask → Ground → Draft → Continue
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {completedLoop.map((step, index) => (
              <article
                key={step.label}
                className="rounded-3xl border border-border/70 bg-background p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-xs font-semibold text-primary">
                    0{index + 1}
                  </span>
                  <Check className="h-4 w-4 text-primary" aria-hidden="true" />
                </div>
                <h3 dir="ltr" className="mt-5 text-xl font-semibold">
                  {step.label}
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {step.text}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-primary">المراحل</p>
              <h2 className="mt-2 font-arabic-heading text-3xl font-semibold">
                ما يعمل وما بقي
              </h2>
            </div>
            <FileText className="h-6 w-6 text-primary" aria-hidden="true" />
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {phases.map((phase) => (
              <article
                key={phase.phase}
                className="rounded-3xl border border-border/70 bg-card p-6"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-xs font-semibold text-primary">
                    {phase.phase}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[0.68rem] font-semibold ${
                      phase.phase === "P5"
                        ? "bg-secondary text-muted-foreground"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    {phase.status}
                  </span>
                </div>
                <h3 className="mt-5 font-arabic-heading text-xl font-semibold">
                  {phase.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {phase.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8">
            <p className="text-sm font-semibold text-primary">يعمل الآن</p>
            <h2 className="mt-2 font-arabic-heading text-2xl font-semibold">
              رحلة محفوظة ومعزولة
            </h2>
            <p className="mt-4 text-sm leading-8 text-muted-foreground">
              يمكن للمالك أو المحرر إنشاء مساحة، رفع مصدر مدعوم، الحصول على
              إجابة موثقة، تحويلها إلى مسودة، حفظ الإصدارات، استعادة لقطة، تصدير
              UTF-8، ومراجعة اقتراح قبل تطبيقه. القارئ يراجع ويصدّر فقط، والحساب
              الخارجي لا يرى البيانات.
            </p>
          </article>

          <article className="rounded-3xl border border-destructive/20 bg-card p-6 sm:p-8">
            <p className="text-sm font-semibold text-destructive">
              غير معتمد بعد
            </p>
            <h2 className="mt-2 font-arabic-heading text-2xl font-semibold">
              الإطلاق العام والاعتماد
            </h2>
            <p className="mt-4 text-sm leading-8 text-muted-foreground">
              لا تدّعي الخطة دعم PDF أو DOCX أو OCR، تعاوناً لحظياً، استقلالية
              وكلاء، اعتماد WCAG، امتثالاً أمنياً أو خصوصياً، جودة تخصصية، نسخاً
              احتياطياً مجرباً، مراقبة تشغيلية، أو جاهزية إنتاج. هذه أعمال P5 أو
              مراحل لاحقة.
            </p>
          </article>
        </section>
      </div>
    </main>
  );
}
