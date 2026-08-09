import Link from "next/link";
import {
  ArrowUpLeft,
  BookOpen,
  CheckCircle2,
  FileText,
  Languages,
  MessageSquare,
  PenLine,
  ShieldCheck,
} from "lucide-react";
import { brand } from "@/config/brand";

const workflow = [
  {
    step: "01",
    title: "اسأل",
    titleEn: "Ask",
    description:
      "ابدأ بسؤال أو مهمة واضحة بالعربية أو الإنجليزية، من دون اختيار وكيل أو بناء تدفق معقّد.",
    icon: MessageSquare,
  },
  {
    step: "02",
    title: "أضف السياق",
    titleEn: "Ground",
    description:
      "اربط السؤال بالمستندات ذات الصلة، وابقِ المصادر مرئية وقابلة للفحص أثناء العمل.",
    icon: BookOpen,
  },
  {
    step: "03",
    title: "أنشئ العمل",
    titleEn: "Draft",
    description:
      "حوّل النتيجة إلى ملخص أو مقارنة أو رسالة أو مذكرة قابلة للتعديل والحفظ والمتابعة.",
    icon: PenLine,
  },
];

const principles = [
  {
    title: "العربية جزء من البنية",
    description:
      "اتجاه النص، المحتوى المختلط، لوحة المفاتيح، المستندات، والتحرير تُصمَّم للعربية والإنجليزية من البداية.",
    icon: Languages,
  },
  {
    title: "المصادر قبل الاستعراض",
    description:
      "الهدف هو فهم الإجابة ومصدرها وحدودها، لا إخفاء العمل خلف مؤثرات أو مصطلحات وكلاء مبهمة.",
    icon: FileText,
  },
  {
    title: "حالة المنتج واضحة",
    description:
      "لن نعرض بيانات تجريبية كأنها حقيقية، أو نعلن جاهزية وامتثالاً وأرقام أداء قبل وجود دليل قابل للتكرار.",
    icon: ShieldCheck,
  },
];

export default function Home() {
  return (
    <div className="overflow-hidden">
      <section className="relative border-b border-border/70 bg-background">
        <div className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-accent blur-3xl" />

        <div className="container-responsive relative grid min-h-[calc(100svh-4rem)] gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-3 rounded-full border border-border/80 bg-card/80 px-4 py-2 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <span>إعادة بناء المنتج</span>
              <span className="text-border">/</span>
              <span dir="ltr" className="uppercase tracking-[0.14em]">
                Product reset
              </span>
            </div>

            <p className="mt-8 text-sm font-semibold text-primary">
              {brand.categoryAr}
            </p>
            <h1 className="mt-4 max-w-3xl text-balance font-arabic-heading text-4xl font-semibold leading-[1.2] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
              حوّل مستنداتك ومحادثاتك إلى{" "}
              <span className="text-primary">عمل واضح.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-9 text-muted-foreground sm:text-xl">
              {brand.descriptionAr} نبني مساراً واحداً متكاملاً: سؤال، مصادر
              قابلة للفحص، ثم مسودة يمكنك حفظها وتطويرها.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href={brand.links.workspace}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/15 transition-transform hover:-translate-y-0.5"
              >
                استكشف مساحة العمل
                <ArrowUpLeft className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href={brand.links.documentation}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                اقرأ خطة إعادة البناء
              </Link>
            </div>

            <div className="mt-8 flex max-w-2xl items-start gap-3 rounded-2xl border border-border/70 bg-secondary/50 p-4 text-sm leading-7 text-muted-foreground">
              <CheckCircle2
                className="mt-1 h-4 w-4 shrink-0 text-primary"
                aria-hidden="true"
              />
              <p>
                <strong className="font-semibold text-foreground">
                  حالة صادقة:
                </strong>{" "}
                اسم المنتج النهائي قيد المراجعة، والمنتج في مرحلة إعادة البناء.
                هذه الصفحة تشرح الاتجاه المعتمد ولا تدّعي اكتمال الوظائف بعد.
              </p>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-2xl lg:mx-0">
            <div className="pointer-events-none absolute inset-x-16 -top-10 h-40 rounded-full bg-primary/15 blur-3xl" />
            <div className="relative rounded-[2rem] border border-border/80 bg-card/90 p-3 shadow-2xl shadow-foreground/10 backdrop-blur">
              <div className="overflow-hidden rounded-[1.45rem] border border-border/80 bg-background">
                <div className="flex items-center justify-between border-b border-border/70 px-5 py-4">
                  <div>
                    <p className="text-sm font-semibold">مساحة عمل تجريبية</p>
                    <p dir="ltr" className="mt-1 text-xs text-muted-foreground">
                      Product direction preview
                    </p>
                  </div>
                  <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                    قيد البناء
                  </span>
                </div>

                <div className="grid min-h-[440px] md:grid-cols-[0.38fr_0.62fr]">
                  <aside className="border-b border-border/70 bg-secondary/35 p-4 md:border-b-0 md:border-l">
                    <div className="mb-4 flex items-center justify-between">
                      <p className="text-xs font-semibold text-muted-foreground">
                        المصادر
                      </p>
                      <span className="text-[0.65rem] text-muted-foreground">
                        2
                      </span>
                    </div>
                    <div className="space-y-3">
                      <div className="rounded-xl border border-border/70 bg-card p-3">
                        <div className="flex items-start gap-3">
                          <div className="rounded-lg bg-primary/10 p-2 text-primary">
                            <FileText className="h-4 w-4" aria-hidden="true" />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-xs font-semibold">
                              تقرير المشروع.pdf
                            </p>
                            <p className="mt-1 text-[0.65rem] text-muted-foreground">
                              مصدر مرتبط بالسؤال
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="rounded-xl border border-dashed border-border bg-background/70 p-3">
                        <p className="text-xs font-medium">ملاحظات الاجتماع</p>
                        <p className="mt-1 text-[0.65rem] text-muted-foreground">
                          سياق إضافي
                        </p>
                      </div>
                    </div>
                  </aside>

                  <div className="flex flex-col p-5 sm:p-6">
                    <div className="self-end rounded-2xl rounded-bl-sm bg-primary px-4 py-3 text-sm leading-7 text-primary-foreground">
                      لخّص القرارات، ووضّح ما يحتاج متابعة هذا الأسبوع.
                    </div>

                    <div className="mt-5 rounded-2xl border border-border/70 bg-card p-4 shadow-sm">
                      <div className="mb-4 flex items-center justify-between gap-4">
                        <p className="text-xs font-semibold text-primary">
                          إجابة مرتبطة بالمصادر
                        </p>
                        <span className="rounded-md bg-secondary px-2 py-1 text-[0.65rem] text-muted-foreground">
                          معاينة
                        </span>
                      </div>
                      <div className="space-y-3 text-sm leading-7 text-muted-foreground">
                        <p>
                          اتُّفق على تثبيت نطاق الإصدار الأول، مع حصر التنفيذ في
                          مسار المستندات والمحادثة والمسودات.
                          <sup className="mx-1 font-semibold text-primary">
                            1
                          </sup>
                        </p>
                        <p>
                          تحتاج سياسة الاحتفاظ بالملفات ومسؤولية مراجعة المصادر
                          إلى قرار موثّق قبل الاختبار المغلق.
                          <sup className="mx-1 font-semibold text-primary">
                            2
                          </sup>
                        </p>
                      </div>
                    </div>

                    <div className="mt-auto pt-5">
                      <div className="flex items-center justify-between rounded-2xl border border-primary/20 bg-primary/5 p-4">
                        <div>
                          <p className="text-xs font-semibold text-primary">
                            الخطوة التالية
                          </p>
                          <p className="mt-1 text-sm font-medium">
                            حوّل النتيجة إلى مذكرة قرار
                          </p>
                        </div>
                        <div className="rounded-full bg-primary p-2 text-primary-foreground">
                          <PenLine className="h-4 w-4" aria-hidden="true" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="product"
        className="border-b border-border/70 bg-card/40 py-20 sm:py-28"
      >
        <div className="container-responsive">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-primary">
              مسار المنتج الأول
            </p>
            <h2 className="mt-4 text-balance font-arabic-heading text-3xl font-semibold leading-tight sm:text-5xl">
              لا مزيد من العروض المنفصلة. مسار واحد من السؤال إلى العمل.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              الإصدار الأول يركّز على رحلة يمكن اختبارها بالكامل، بدلاً من توسيع
              قائمة الميزات قبل اكتمال الأساس.
            </p>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {workflow.map(
              ({ step, title, titleEn, description, icon: Icon }) => (
                <article
                  key={step}
                  className="group rounded-3xl border border-border/80 bg-background p-6 transition-transform hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between">
                    <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <span className="text-xs font-semibold tracking-[0.18em] text-muted-foreground">
                      {step}
                    </span>
                  </div>
                  <h3 className="mt-7 text-xl font-semibold">{title}</h3>
                  <p
                    dir="ltr"
                    className="mt-1 text-xs uppercase tracking-[0.16em] text-primary"
                  >
                    {titleEn}
                  </p>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground">
                    {description}
                  </p>
                </article>
              ),
            )}
          </div>
        </div>
      </section>

      <section id="principles" className="py-20 sm:py-28">
        <div className="container-responsive grid gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
          <div className="max-w-xl lg:sticky lg:top-28">
            <p className="text-sm font-semibold text-primary">
              مبادئ إعادة البناء
            </p>
            <h2 className="mt-4 text-balance font-arabic-heading text-3xl font-semibold leading-tight sm:text-5xl">
              منتج أكثر هدوءاً، وأكثر دقة، وأسهل في الثقة.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              كل قرار جديد يُقاس بقدرته على تحسين الفهم، حفظ السياق، وإنهاء مهمة
              حقيقية للمستخدم.
            </p>
          </div>

          <div className="space-y-4">
            {principles.map(({ title, description, icon: Icon }, index) => (
              <article
                key={title}
                className="grid gap-5 rounded-3xl border border-border/80 bg-card p-6 sm:grid-cols-[auto_1fr_auto] sm:items-start"
              >
                <div className="rounded-2xl bg-secondary p-3 text-primary">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {description}
                  </p>
                </div>
                <span className="text-xs font-semibold text-muted-foreground">
                  0{index + 1}
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border/70 bg-foreground py-20 text-background sm:py-24">
        <div className="container-responsive grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-background/65">
              الأساس قبل التوسّع
            </p>
            <h2 className="mt-4 text-balance font-arabic-heading text-3xl font-semibold leading-tight sm:text-5xl">
              نبدأ برحلة واحدة تعمل فعلاً، ثم نضيف القدرات التي يثبت احتياجها.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-background/70">
              الدفعات، الوكلاء المتعددون، الصوت، الأتمتة، والتخصصات المهنية
              مؤجلة إلى أن يكتمل مسار السؤال والمصدر والمسودة ببيانات حقيقية
              واختبارات قابلة للتكرار.
            </p>
          </div>
          <Link
            href={brand.links.documentation}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-background px-6 py-3 text-sm font-semibold text-foreground transition-transform hover:-translate-y-0.5"
          >
            راجع خارطة الطريق
            <ArrowUpLeft className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}
