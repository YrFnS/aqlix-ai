import Link from "next/link";
import {
  ArrowUpLeft,
  BookOpenCheck,
  Check,
  FileClock,
  FileText,
  Languages,
  MessageSquareText,
  PenLine,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { ProductJourneyPreview } from "@/components/marketing/product-journey-preview";
import { brand } from "@/config/brand";

const workflow = [
  {
    step: "01",
    title: "اسأل بوضوح",
    titleEn: "Ask",
    description:
      "ابدأ بسؤال أو مهمة بالعربية أو الإنجليزية داخل محادثة تبقى محفوظة في مساحة العمل.",
    icon: MessageSquareText,
  },
  {
    step: "02",
    title: "اربط السياق",
    titleEn: "Ground",
    description:
      "أضف ملفات TXT أو Markdown عندما تحتاج إلى إجابة مرتبطة بمقاطع يمكن فتحها ومراجعتها.",
    icon: BookOpenCheck,
  },
  {
    step: "03",
    title: "حوّلها إلى مسودة",
    titleEn: "Draft",
    description:
      "أنشئ ملخصاً أو مقارنة أو رسالة أو مذكرة أو قائمة عمل قابلة للتحرير والحفظ.",
    icon: PenLine,
  },
  {
    step: "04",
    title: "راجع ثم طوّر",
    titleEn: "Continue",
    description:
      "اطلب اقتراحاً، افحصه منفصلاً عن النص المقبول، ثم طبّقه كإصدار جديد أو ارفضه.",
    icon: Sparkles,
  },
] as const;

const strengths = [
  {
    title: "العربية وEnglish في المساحة نفسها",
    description:
      "اتجاه النص والمحتوى المختلط والتحرير مصممة للعمل الثنائي اللغة، لا كإضافة لاحقة.",
    icon: Languages,
  },
  {
    title: "المصدر يبقى قابلاً للفتح",
    description:
      "المراجع تقود إلى المقطع الداعم، وتنتقل لقطة المنشأ مع المسودة حتى يبقى السياق مفهوماً.",
    icon: FileText,
  },
  {
    title: "كل تغيير مهم له إصدار",
    description:
      "احفظ لقطات واضحة، راجع النسخ السابقة، واستعد نسخة قديمة من دون الكتابة فوق تاريخ العمل.",
    icon: FileClock,
  },
] as const;

const outcomes = [
  {
    title: "مذكرة قرار",
    description:
      "اجمع سؤالاً ومصادر وموافقات معلّقة في وثيقة واحدة قابلة للمراجعة.",
  },
  {
    title: "مقارنة واضحة",
    description:
      "حوّل إجابة طويلة إلى خيارات وفروقات وخطوات تالية يمكن للفريق مناقشتها.",
  },
  {
    title: "رسالة أو قائمة عمل",
    description:
      "انقل النتيجة من المحادثة إلى صيغة عملية تستطيع تعديلها وتصديرها.",
  },
] as const;

export default function Home() {
  return (
    <div className="overflow-hidden">
      <section className="relative border-b border-border/70 bg-background">
        <div className="pointer-events-none absolute -left-40 top-16 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-40 bottom-10 h-[28rem] w-[28rem] rounded-full bg-accent/80 blur-3xl" />

        <div className="container-responsive relative grid gap-12 py-14 lg:grid-cols-[0.86fr_1.14fr] lg:items-center lg:py-20 xl:gap-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-semibold text-primary shadow-sm">
              <span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
              {brand.categoryAr}
            </div>

            <h1 className="mt-7 text-balance font-arabic-heading text-4xl font-semibold leading-[1.18] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
              من سؤال مبعثر إلى{" "}
              <span className="text-primary">مسودة موثّقة.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-9 text-muted-foreground sm:text-xl">
              اجمع المحادثة والمصادر والمسودة في مكان واحد. اسأل بالعربية أو
              الإنجليزية، افتح المقطع الذي استندت إليه الإجابة، ثم احفظ النتيجة
              كعمل يمكنك مراجعته وتطويره.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={brand.links.registration}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/15 transition-transform hover:-translate-y-0.5"
              >
                ابدأ مساحة عمل
                <ArrowUpLeft className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                شاهد طريقة العمل
              </Link>
            </div>

            <div className="mt-8 grid max-w-2xl gap-2 sm:grid-cols-3">
              {[
                "عربية + English",
                "مصادر قابلة للفتح",
                "إصدارات محفوظة",
              ].map((item) => (
                <div
                  key={item}
                  className="flex min-h-11 items-center gap-2 rounded-2xl border border-border/70 bg-card/70 px-3 text-xs font-semibold text-muted-foreground backdrop-blur"
                >
                  <Check className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-3xl lg:mx-0">
            <div className="pointer-events-none absolute inset-x-20 -top-8 h-40 rounded-full bg-primary/15 blur-3xl" />
            <ProductJourneyPreview />
          </div>
        </div>
      </section>

      <section className="border-b border-border/70 bg-card/45 py-8">
        <div className="container-responsive grid gap-3 sm:grid-cols-3">
          {strengths.map(({ title, description, icon: Icon }) => (
            <article
              key={title}
              className="flex gap-4 rounded-3xl border border-border/70 bg-background p-5"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-sm font-semibold">{title}</h2>
                <p className="mt-2 text-xs leading-6 text-muted-foreground">
                  {description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="py-20 sm:py-28">
        <div className="container-responsive">
          <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold text-primary">كيف يعمل Tuppra</p>
              <h2 className="mt-4 text-balance font-arabic-heading text-3xl font-semibold leading-tight sm:text-5xl">
                رحلة واحدة تحافظ على السياق من البداية إلى النهاية.
              </h2>
            </div>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground lg:justify-self-end">
              لا تحتاج إلى بناء تدفق أو توزيع المهمة بين أدوات منفصلة. ابدأ
              بالمحادثة، أضف المصادر عند الحاجة، ثم حوّل أفضل نتيجة إلى عمل محفوظ.
            </p>
          </div>

          <div className="mt-12 grid gap-4 lg:grid-cols-4">
            {workflow.map(({ step, title, titleEn, description, icon: Icon }) => (
              <article
                key={step}
                className="group relative rounded-3xl border border-border/75 bg-card p-6 transition-transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="font-mono text-xs font-semibold tracking-[0.16em] text-muted-foreground">
                    {step}
                  </span>
                </div>
                <h3 className="mt-7 font-arabic-heading text-xl font-semibold">
                  {title}
                </h3>
                <p dir="ltr" className="mt-1 text-xs font-semibold text-primary">
                  {titleEn}
                </p>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="why-tuppra"
        className="border-y border-border/70 bg-foreground py-20 text-background sm:py-28"
      >
        <div className="container-responsive grid gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
          <div className="max-w-xl lg:sticky lg:top-28">
            <p className="text-sm font-semibold text-background/60">
              لماذا Tuppra
            </p>
            <h2 className="mt-4 text-balance font-arabic-heading text-3xl font-semibold leading-tight sm:text-5xl">
              أقل تشتيتاً من صندوق دردشة، وأكثر مرونة من محرر منفصل.
            </h2>
            <p className="mt-6 text-lg leading-8 text-background/65">
              القيمة ليست في إجابة مؤقتة فقط، بل في الاحتفاظ بالمصدر والقرار
              والنسخ السابقة داخل مساحة يمكن الرجوع إليها.
            </p>
          </div>

          <div className="space-y-4">
            <article className="rounded-3xl border border-background/15 bg-background/5 p-6 backdrop-blur">
              <div className="flex items-center gap-3">
                <Languages className="h-5 w-5 text-primary" aria-hidden="true" />
                <h3 className="text-lg font-semibold">العربية ليست وضعاً ثانوياً</h3>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div dir="rtl" className="rounded-2xl bg-background/10 p-4 text-sm leading-7">
                  راجع قرار الإطلاق وحدد الخطوة التالية.
                </div>
                <div dir="ltr" className="rounded-2xl bg-background/10 p-4 text-sm leading-7">
                  Review the launch decision and define the next step.
                </div>
              </div>
            </article>

            <article className="rounded-3xl border border-background/15 bg-background/5 p-6 backdrop-blur">
              <div className="flex items-center gap-3">
                <BookOpenCheck className="h-5 w-5 text-primary" aria-hidden="true" />
                <h3 className="text-lg font-semibold">المصدر قريب من الجملة</h3>
              </div>
              <p className="mt-4 text-sm leading-8 text-background/65">
                عندما تكون الإجابة مرتبطة بالمستندات، تظهر المراجع كروابط إلى
                المقاطع الداعمة بدلاً من إخفائها خلف ملخص عام.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-background/10 px-4 py-2 text-xs font-semibold">
                <span className="rounded-md bg-primary px-1.5 py-0.5 text-primary-foreground">
                  S1
                </span>
                فتح قرار-المشروع.md · المقطع 3
              </div>
            </article>

            <article className="rounded-3xl border border-background/15 bg-background/5 p-6 backdrop-blur">
              <div className="flex items-center gap-3">
                <FileClock className="h-5 w-5 text-primary" aria-hidden="true" />
                <h3 className="text-lg font-semibold">التطوير لا يمحو التاريخ</h3>
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-2 text-xs font-semibold">
                {["v1 · منشأ", "v2 · تحرير", "v3 · استعادة", "v4 · اقتراح مقبول"].map(
                  (version, index) => (
                    <span
                      key={version}
                      className={`rounded-full px-3 py-2 ${
                        index === 3
                          ? "bg-primary text-primary-foreground"
                          : "bg-background/10 text-background/75"
                      }`}
                    >
                      {version}
                    </span>
                  ),
                )}
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="use-cases" className="py-20 sm:py-28">
        <div className="container-responsive">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold text-primary">من الإجابة إلى نتيجة</p>
            <h2 className="mt-4 text-balance font-arabic-heading text-3xl font-semibold leading-tight sm:text-5xl">
              أنشئ الصيغة التي يحتاجها العمل فعلاً.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              ابدأ من إجابة مكتملة، ثم اختر الهيكل الأقرب لما تريد إرساله أو
              مراجعته أو تنفيذه.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {outcomes.map((outcome, index) => (
              <article
                key={outcome.title}
                className="rounded-3xl border border-border/75 bg-card p-6"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary font-mono text-xs font-semibold text-primary">
                  0{index + 1}
                </span>
                <h3 className="mt-6 font-arabic-heading text-xl font-semibold">
                  {outcome.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {outcome.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border/70 bg-card/55 py-16 sm:py-20">
        <div className="container-responsive">
          <div className="relative overflow-hidden rounded-[2rem] bg-primary p-7 text-primary-foreground sm:p-10 lg:p-12">
            <div className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full bg-background/15 blur-3xl" />
            <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-background/10 px-3 py-1.5 text-xs font-semibold">
                  <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  مساحة واحدة، وسياق واضح
                </div>
                <h2 className="mt-5 text-balance font-arabic-heading text-3xl font-semibold leading-tight sm:text-5xl">
                  ابدأ بالسؤال. أضف المصدر عندما تحتاجه. احتفظ بالعمل.
                </h2>
                <p className="mt-5 max-w-2xl text-base leading-8 text-primary-foreground/75">
                  يشرح الدليل أنواع الملفات والصيغ المتاحة وخطوات ربط النموذج،
                  حتى تبدأ بما يعمل فعلاً داخل المنتج.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link
                  href={brand.links.registration}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-background px-6 py-3 text-sm font-semibold text-foreground transition-transform hover:-translate-y-0.5"
                >
                  إنشاء حساب
                  <ArrowUpLeft className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href={brand.links.documentation}
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-primary-foreground/25 px-6 py-3 text-sm font-semibold transition-colors hover:bg-primary-foreground/10"
                >
                  افتح دليل الاستخدام
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
