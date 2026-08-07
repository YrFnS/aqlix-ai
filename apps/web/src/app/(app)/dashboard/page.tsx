import Link from "next/link";
import {
  ArrowUpLeft,
  BookOpen,
  CheckCircle2,
  CircleDashed,
  FileText,
  MessageSquare,
  PenLine,
} from "lucide-react";
import { brand } from "@/config/brand";

const foundationItems = [
  "هوية واتجاه منتج موحّدان",
  "بنية عربية وRTL محفوظة لإعادة الاستخدام",
  "واجهة صادقة بلا أرقام نشاط تجريبية",
];

const nextMilestones = [
  {
    title: "مساحات عمل محفوظة",
    description: "إنشاء المساحة وفتحها وتسميتها وحذفها ببيانات دائمة.",
    phase: "P1",
    icon: BookOpen,
  },
  {
    title: "محادثة حقيقية ثنائية اللغة",
    description: "بث الإجابات، الحفظ، الإلغاء، إعادة المحاولة، وحالات فشل واضحة.",
    phase: "P2",
    icon: MessageSquare,
  },
  {
    title: "مستندات ومصادر قابلة للفحص",
    description: "رفع الملفات، معالجتها، ثم فتح المقطع الداعم للإجابة.",
    phase: "P3",
    icon: FileText,
  },
  {
    title: "مسودات قابلة لإعادة الاستخدام",
    description: "تحويل النتيجة إلى مذكرة أو ملخص أو مقارنة قابلة للتحرير والحفظ.",
    phase: "P4",
    icon: PenLine,
  },
];

export default function Dashboard() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="flex flex-col gap-6 rounded-3xl border border-border/70 bg-card p-6 sm:p-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
            <span className="h-2 w-2 rounded-full bg-primary" />
            P0 · Product foundation
          </div>
          <h1 className="mt-5 font-arabic-heading text-3xl font-semibold tracking-tight sm:text-5xl">
            مساحة العمل
          </h1>
          <p className="mt-4 text-base leading-8 text-muted-foreground sm:text-lg">
            هذه هي نقطة الدخول الجديدة لـ {brand.name}. أزلنا لوحة الأرقام
            التجريبية، ونبني الآن رحلة واحدة حقيقية من السؤال والمصدر إلى المسودة
            المحفوظة.
          </p>
        </div>
        <Link
          href={brand.links.documentation}
          className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full border border-border bg-background px-5 py-3 text-sm font-semibold transition-colors hover:bg-secondary"
        >
          راجع خطة التنفيذ
          <ArrowUpLeft className="h-4 w-4" aria-hidden="true" />
        </Link>
      </header>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-foreground p-6 text-background sm:p-8">
          <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-primary/30 blur-3xl" />
          <div className="relative">
            <p className="text-sm font-semibold text-background/65">
              تجربة المنتج المقصودة
            </p>
            <h2 className="mt-4 max-w-2xl font-arabic-heading text-3xl font-semibold leading-tight sm:text-4xl">
              ابدأ بسؤال، أضف المستندات، ثم حوّل الإجابة إلى عمل.
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-8 text-background/70 sm:text-base">
              الواجهة أدناه توضّح التسلسل المعتمد فقط. ستُفعّل الإجراءات عندما
              يكتمل التخزين الدائم وعقد الـAPI ومسار النموذج الحقيقي.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                { label: "سؤال أو مهمة", icon: MessageSquare },
                { label: "مستندات وسياق", icon: FileText },
                { label: "مسودة محفوظة", icon: PenLine },
              ].map(({ label, icon: Icon }, index) => (
                <div
                  key={label}
                  className="rounded-2xl border border-background/15 bg-background/5 p-4 backdrop-blur"
                >
                  <div className="flex items-center justify-between">
                    <Icon className="h-5 w-5 text-background" aria-hidden="true" />
                    <span className="text-[0.65rem] font-semibold text-background/45">
                      0{index + 1}
                    </span>
                  </div>
                  <p className="mt-5 text-sm font-semibold">{label}</p>
                  <p className="mt-2 text-xs text-background/50">قيد التنفيذ</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-primary">يعمل الآن</p>
              <h2 className="mt-2 text-xl font-semibold">أساس موثوق للبناء</h2>
            </div>
            <div className="rounded-2xl bg-primary/10 p-3 text-primary">
              <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
            </div>
          </div>

          <ul className="mt-7 space-y-4">
            {foundationItems.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm leading-7">
                <CheckCircle2
                  className="mt-1.5 h-4 w-4 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-7 rounded-2xl border border-border/70 bg-secondary/60 p-4">
            <p className="text-xs font-semibold text-foreground">غير متاح بعد</p>
            <p className="mt-2 text-xs leading-6 text-muted-foreground">
              الرسائل الحقيقية، رفع المستندات، الاستشهادات، والحفظ الدائم ليست
              مفعّلة في P0. لن نعرض نموذجاً وهمياً مكانها.
            </p>
          </div>
        </aside>
      </div>

      <section className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-primary">المراحل التالية</p>
            <h2 className="mt-2 font-arabic-heading text-2xl font-semibold sm:text-3xl">
              التنفيذ يتقدّم بقدرات مكتملة، لا بقائمة ميزات.
            </h2>
          </div>
          <p className="max-w-lg text-sm leading-7 text-muted-foreground">
            كل مرحلة لها رحلة مستخدم واختبارات خروج واضحة قبل بدء المرحلة التي
            تليها.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {nextMilestones.map(({ title, description, phase, icon: Icon }) => (
            <article
              key={phase}
              className="flex gap-4 rounded-2xl border border-border/70 bg-background p-5"
            >
              <div className="h-fit rounded-xl bg-secondary p-2.5 text-primary">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-semibold">{title}</h3>
                  <span className="rounded-full border border-border px-2.5 py-1 text-[0.65rem] font-semibold text-muted-foreground">
                    {phase}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  {description}
                </p>
                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <CircleDashed className="h-3.5 w-3.5" aria-hidden="true" />
                  مخطّط
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
