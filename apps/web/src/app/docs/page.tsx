import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpLeft,
  BookOpen,
  Check,
  ChevronDown,
  Download,
  FileText,
  Key,
  Languages,
  MessageSquare,
  PenLine,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { Footer } from "@/app/components/footer";
import { MarketingNav } from "@/components/navigation/marketing-nav";
import { brand } from "@/config/brand";

export const metadata: Metadata = {
  title: "دليل الاستخدام",
  description:
    "ابدأ مع Tuppra: اربط النموذج، أنشئ مساحة، أضف المصادر، ثم حوّل الإجابات إلى مسودات محفوظة.",
};

const quickStart = [
  {
    step: "01",
    title: "اربط OpenRouter",
    description:
      "أدخل مفتاحك مرة واحدة، ثم اختر نموذجاً من القائمة المتاحة لحسابك.",
    href: "/settings/ai",
    action: "فتح إعدادات الذكاء الاصطناعي",
    icon: Key,
  },
  {
    step: "02",
    title: "أنشئ مساحة عمل",
    description:
      "استخدم مساحة مستقلة لكل مشروع أو عميل أو قرار حتى تبقى المحادثات والمصادر والمسودات منظمة.",
    href: "/workspaces",
    action: "فتح مساحات العمل",
    icon: BookOpen,
  },
  {
    step: "03",
    title: "أضف المصدر عند الحاجة",
    description:
      "ارفع ملف TXT أو Markdown بترميز UTF-8، ثم افحص المقاطع المستخرجة قبل استخدامها في المحادثة.",
    href: "/workspaces",
    action: "ابدأ من مساحة عمل",
    icon: FileText,
  },
  {
    step: "04",
    title: "اسأل ثم أنشئ المسودة",
    description:
      "أرسل السؤال، افتح المراجع إن وُجدت، ثم حوّل إجابة مكتملة إلى صيغة قابلة للتحرير والحفظ.",
    href: "/workspaces",
    action: "ابدأ العمل",
    icon: PenLine,
  },
] as const;

const workLoop = [
  {
    label: "Ask",
    title: "المحادثة",
    text: "اكتب السؤال بالعربية أو English. تبقى الرسائل محفوظة، ويمكن تحميل الرسائل الأقدم في المحادثات الطويلة.",
    icon: MessageSquare,
  },
  {
    label: "Ground",
    title: "المصادر",
    text: "فعّل استخدام مصادر المساحة عندما تريد إجابة مرتبطة بملفاتك. المراجع تفتح المقطع الداعم نفسه.",
    icon: BookOpen,
  },
  {
    label: "Draft",
    title: "المسودة",
    text: "اختر ملخصاً أو مقارنة أو رسالة أو مذكرة أو قائمة عمل أو ملاحظة قرار، ثم عدّل النص واحفظ إصداراً جديداً.",
    icon: PenLine,
  },
  {
    label: "Continue",
    title: "الاقتراح",
    text: "اطلب تحسيناً أو اختصاراً أو ترجمة أو متابعة. يبقى الاقتراح منفصلاً حتى تقرر تطبيقه أو رفضه.",
    icon: Sparkles,
  },
] as const;

const availableNow = [
  "محادثات عربية وإنجليزية ومحتوى مختلط الاتجاه.",
  "مساحات عمل بأدوار المالك والمحرر والقارئ.",
  "ملفات TXT وMarkdown الخاصة بترميز UTF-8.",
  "بحث داخل المصادر ومراجع مرتبطة بالمقاطع.",
  "ستة هياكل للمسودات مع سجل إصدارات واستعادة.",
  "تصدير آخر إصدار محفوظ بصيغ TXT وMarkdown وHTML.",
] as const;

const notAvailableYet = [
  "استخراج PDF أو DOCX أو OCR داخل المنتج.",
  "التحرير المتزامن بين عدة أشخاص في اللحظة نفسها.",
  "معالجة الصور أو الصوت كمصادر للمحادثة.",
  "تطبيق اقتراح الذكاء الاصطناعي تلقائياً من دون مراجعتك.",
  "ضمان دقة تخصصية أو استبدال مراجعة مختص في القرارات الحساسة.",
] as const;

const troubleshooting = [
  {
    question: "لماذا لا تبدأ الاستجابة؟",
    answer:
      "افتح إعدادات الذكاء الاصطناعي وتأكد من اتصال مفتاح OpenRouter واختيار نموذج. قد تمنع حدود مساحة العمل بدء توليد جديد أيضاً.",
  },
  {
    question: "لماذا لا تظهر مراجع مع الإجابة؟",
    answer:
      "ارفع مصدراً مدعوماً داخل المساحة، وانتظر اكتمال معالجته، ثم فعّل خيار استخدام مصادر مساحة العمل قبل إرسال السؤال.",
  },
  {
    question: "لماذا لا أستطيع تعديل المسودة؟",
    answer:
      "قد تكون المسودة أو مساحة العمل مؤرشفة، أو قد يكون دورك قارئاً. استعد العنصر أو اطلب صلاحية محرر من مالك المساحة.",
  },
  {
    question: "كيف أعود إلى نص سابق؟",
    answer:
      "افتح سجل الإصدارات في صفحة المسودة. يمكنك عرض أي لقطة، ثم استعادتها كإصدار جديد من دون حذف النسخ اللاحقة.",
  },
] as const;

export default function GuidePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <MarketingNav />

      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border/70 bg-foreground py-16 text-background sm:py-24">
          <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/30 blur-3xl" />
          <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />

          <div className="container-responsive relative grid gap-10 lg:grid-cols-[1.18fr_0.82fr] lg:items-end">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-background/15 bg-background/5 px-3 py-1.5 text-xs font-semibold text-background/70">
                <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                دليل {brand.name}
              </div>
              <h1 className="mt-6 text-balance font-arabic-heading text-4xl font-semibold leading-tight sm:text-6xl">
                ابدأ من السؤال، وانتهِ بعمل يمكنك مراجعته.
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-9 text-background/65 sm:text-lg">
                يشرح هذا الدليل المسار الكامل داخل Tuppra، والملفات والصيغ
                المتاحة، وما تحتاج إلى إعداده قبل أول محادثة.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/workspaces"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-background px-5 text-sm font-semibold text-foreground transition-transform hover:-translate-y-0.5"
                >
                  فتح مساحات العمل
                  <ArrowUpLeft className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/settings/ai"
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-background/20 px-5 text-sm font-semibold text-background transition-colors hover:bg-background/10"
                >
                  إعداد النموذج
                </Link>
              </div>
            </div>

            <aside className="rounded-3xl border border-background/15 bg-background/5 p-5 backdrop-blur sm:p-6">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-primary" aria-hidden="true" />
                <h2 className="font-arabic-heading text-xl font-semibold">
                  قبل أن تبدأ
                </h2>
              </div>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-background/65">
                <li className="flex gap-3">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  تحتاج إلى حساب OpenRouter ومفتاح API خاص بك.
                </li>
                <li className="flex gap-3">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  ضع حد إنفاق مناسباً من لوحة OpenRouter قبل العمل الطويل.
                </li>
                <li className="flex gap-3">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  لا تشارك مفاتيحك أو بياناتك الحساسة داخل محادثة عامة.
                </li>
              </ul>
            </aside>
          </div>
        </section>

        <section id="quick-start" className="py-20 sm:py-28">
          <div className="container-responsive">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold text-primary">البدء السريع</p>
              <h2 className="mt-4 text-balance font-arabic-heading text-3xl font-semibold sm:text-5xl">
                أربع خطوات لأول نتيجة محفوظة.
              </h2>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">
                يمكنك البدء من دون مصدر، ثم إضافة الملفات عندما تحتاج إلى إجابة
                مرتبطة بسياق مشروعك.
              </p>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-2">
              {quickStart.map(
                ({ step, title, description, href, action, icon: Icon }) => (
                  <article
                    key={step}
                    className="group rounded-3xl border border-border/75 bg-card p-6"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span className="font-mono text-xs font-semibold tracking-[0.16em] text-muted-foreground">
                        {step}
                      </span>
                    </div>
                    <h3 className="mt-6 font-arabic-heading text-xl font-semibold">
                      {title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      {description}
                    </p>
                    <Link
                      href={href}
                      className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-full border border-border bg-background px-4 text-xs font-semibold transition-colors group-hover:border-primary/30 group-hover:bg-secondary"
                    >
                      {action}
                      <ArrowUpLeft className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </article>
                ),
              )}
            </div>
          </div>
        </section>

        <section className="border-y border-border/70 bg-card/50 py-20 sm:py-28">
          <div className="container-responsive">
            <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
              <div>
                <p className="text-sm font-semibold text-primary">المسار الكامل</p>
                <h2 className="mt-4 text-balance font-arabic-heading text-3xl font-semibold sm:text-5xl">
                  Ask → Ground → Draft → Continue
                </h2>
              </div>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground lg:justify-self-end">
                كل خطوة تحفظ علاقتها بما قبلها، حتى لا تنفصل المسودة عن السؤال
                أو المصدر الذي بدأ منه العمل.
              </p>
            </div>

            <div className="mt-12 grid gap-4 lg:grid-cols-4">
              {workLoop.map(({ label, title, text, icon: Icon }, index) => (
                <article
                  key={label}
                  className="rounded-3xl border border-border/75 bg-background p-6"
                >
                  <div className="flex items-center justify-between gap-3">
                    <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                    <span className="font-mono text-xs text-muted-foreground">
                      0{index + 1}
                    </span>
                  </div>
                  <p dir="ltr" className="mt-6 text-xs font-semibold text-primary">
                    {label}
                  </p>
                  <h3 className="mt-1 font-arabic-heading text-xl font-semibold">
                    {title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-28">
          <div className="container-responsive grid gap-6 lg:grid-cols-2">
            <article className="rounded-[2rem] border border-primary/25 bg-primary/5 p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-primary" aria-hidden="true" />
                <p className="text-sm font-semibold text-primary">متاح الآن</p>
              </div>
              <h2 className="mt-4 font-arabic-heading text-3xl font-semibold">
                القدرات التي يمكنك الاعتماد عليها داخل الواجهة
              </h2>
              <ul className="mt-6 space-y-3">
                {availableNow.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-7">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-[2rem] border border-border/75 bg-card p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                <p className="text-sm font-semibold text-muted-foreground">
                  ليس ضمن الواجهة الحالية
                </p>
              </div>
              <h2 className="mt-4 font-arabic-heading text-3xl font-semibold">
                حدود واضحة قبل بدء العمل
              </h2>
              <ul className="mt-6 space-y-3">
                {notAvailableYet.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-sm leading-7 text-muted-foreground"
                  >
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground"
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section className="border-y border-border/70 bg-secondary/35 py-20 sm:py-24">
          <div className="container-responsive grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-primary" aria-hidden="true" />
                <p className="text-sm font-semibold text-primary">حل المشكلات</p>
              </div>
              <h2 className="mt-4 font-arabic-heading text-3xl font-semibold sm:text-4xl">
                إجابات سريعة للحالات الشائعة
              </h2>
              <p className="mt-5 text-sm leading-8 text-muted-foreground">
                تبدأ معظم المشاكل من اتصال النموذج أو حالة المساحة أو نوع الملف.
              </p>
            </div>

            <div className="space-y-3">
              {troubleshooting.map((item) => (
                <details
                  key={item.question}
                  className="group rounded-3xl border border-border/75 bg-background"
                >
                  <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-primary [&::-webkit-details-marker]:hidden">
                    {item.question}
                    <ChevronDown
                      className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
                      aria-hidden="true"
                    />
                  </summary>
                  <p className="border-t border-border/70 px-5 py-4 text-sm leading-8 text-muted-foreground">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-24">
          <div className="container-responsive grid gap-5 md:grid-cols-3">
            <article className="rounded-3xl border border-border/75 bg-card p-6">
              <Languages className="h-5 w-5 text-primary" aria-hidden="true" />
              <h2 className="mt-5 font-arabic-heading text-xl font-semibold">
                اترك الاتجاه تلقائياً غالباً
              </h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                استخدم RTL أو LTR يدوياً فقط عندما تحتاج إلى فرض اتجاه محدد على
                المسودة.
              </p>
            </article>
            <article className="rounded-3xl border border-border/75 bg-card p-6">
              <Download className="h-5 w-5 text-primary" aria-hidden="true" />
              <h2 className="mt-5 font-arabic-heading text-xl font-semibold">
                احفظ قبل التصدير
              </h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                التصدير يستخدم آخر إصدار محفوظ، لذلك احفظ التغييرات المهمة أولاً.
              </p>
            </article>
            <article className="rounded-3xl border border-border/75 bg-card p-6">
              <BookOpen className="h-5 w-5 text-primary" aria-hidden="true" />
              <h2 className="mt-5 font-arabic-heading text-xl font-semibold">
                الأرشفة لا تحذف العمل
              </h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                يمكنك استعادة مساحة أو محادثة أو مسودة مؤرشفة والعودة إلى العمل
                عليها.
              </p>
            </article>
          </div>
        </section>

        <section className="border-t border-border/70 bg-card/55 py-16 sm:py-20">
          <div className="container-responsive">
            <div className="rounded-[2rem] bg-primary p-7 text-primary-foreground sm:p-10">
              <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
                <div className="max-w-3xl">
                  <div className="flex items-center gap-2 text-xs font-semibold text-primary-foreground/70">
                    <Users className="h-4 w-4" aria-hidden="true" />
                    ابدأ بمشروع واحد
                  </div>
                  <h2 className="mt-4 text-balance font-arabic-heading text-3xl font-semibold sm:text-5xl">
                    أنشئ مساحة، جرّب السؤال الأول، ثم أضف السياق الذي تحتاجه.
                  </h2>
                </div>
                <Link
                  href="/workspaces"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-background px-6 py-3 text-sm font-semibold text-foreground transition-transform hover:-translate-y-0.5"
                >
                  فتح Tuppra
                  <ArrowUpLeft className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
