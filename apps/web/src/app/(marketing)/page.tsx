import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpLeft,
  BookOpen,
  CheckCircle2,
  FileSearch,
  FileText,
  Languages,
  MessageSquareText,
  PenLine,
  ShieldCheck,
} from "lucide-react";
import {
  MotionSurface,
  Stagger,
  StaggerItem,
} from "@/components/motion/motion-primitives";
import { WorkflowPreview } from "@/components/marketing/workflow-preview";
import { Button } from "@/components/ui/button";
import { Surface } from "@/components/ui/surface";
import { brand } from "@/config/brand";

export const metadata: Metadata = {
  title: "مساحة عمل عربية للسؤال والسياق والمسودات",
  description: brand.descriptionAr,
};

const journey = [
  {
    number: "01",
    title: "اسأل داخل سياق واضح",
    titleEn: "Ask",
    description:
      "ابدأ بسؤال أو مهمة بالعربية أو الإنجليزية داخل مساحة تحفظ المحادثة وتبقيها مرتبطة بعملك.",
    icon: MessageSquareText,
  },
  {
    number: "02",
    title: "اربط الإجابة بمصادرك",
    titleEn: "Ground",
    description:
      "أضف ملفات TXT وMarkdown الخاصة بالمساحة، ثم افتح المقاطع التي تدعم كل مرجع بدلاً من التعامل مع الإجابة كصندوق مغلق.",
    icon: FileSearch,
  },
  {
    number: "03",
    title: "حوّل النتيجة إلى عمل",
    titleEn: "Draft",
    description:
      "أنشئ ملخصاً أو مقارنة أو رسالة أو مذكرة، واحفظها كمسودة قابلة للتحرير والمتابعة بإصدارات واضحة.",
    icon: PenLine,
  },
] as const;

const principles = [
  {
    title: "العربية ليست طبقة ترجمة",
    description:
      "اتجاه الواجهة والنص المختلط والحقول والمستندات تُعامل كجزء أساسي من المنتج، مع بقاء الإنجليزية طبيعية وواضحة.",
    icon: Languages,
  },
  {
    title: "السياق يبقى قابلاً للفحص",
    description:
      "المصادر والمقاطع الداعمة تظل مرئية وقابلة للفتح، حتى تعرف ما الذي استندت إليه الإجابة وما الذي لم تجده.",
    icon: BookOpen,
  },
  {
    title: "العمل المقبول منفصل عن المقترح",
    description:
      "تبقى الاقتراحات مستقلة عن المسودة المحفوظة حتى تطبّقها صراحةً، وتظل الإصدارات السابقة قابلة للرجوع إليها.",
    icon: ShieldCheck,
  },
] as const;

const capabilityNotes = [
  "مساحات مرتبطة بالعضوية والصلاحيات",
  "محادثات محفوظة وقابلة للمتابعة",
  "مصادر نصية خاصة ومراجع قابلة للفتح",
  "مسودات قابلة للتحرير والحفظ بإصدارات",
] as const;

export default function Home() {
  return (
    <div className="overflow-hidden">
      <section className="relative isolate border-b border-line/70 py-16 sm:py-20 lg:py-24">
        <div
          className="pointer-events-none absolute -left-48 -top-40 h-[34rem] w-[34rem] rounded-full bg-primary/10 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-48 top-28 h-[30rem] w-[30rem] rounded-full bg-brand-soft/80 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(hsl(var(--ink) / 0.035) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--ink) / 0.035) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            maskImage: "linear-gradient(to bottom, black, transparent 88%)",
          }}
          aria-hidden="true"
        />

        <div className="container-responsive relative grid gap-14 lg:grid-cols-[0.92fr_1.08fr] lg:items-center xl:gap-20">
          <Stagger className="max-w-3xl">
            <StaggerItem>
              <div className="inline-flex items-center gap-3 rounded-full border border-primary/20 bg-brand-soft/65 px-4 py-2 text-xs font-semibold text-primary shadow-surface-xs">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-primary/35" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                مساحة عمل عربية أولاً · Arabic-first workspace
              </div>
            </StaggerItem>

            <StaggerItem>
              <p className="mt-8 text-sm font-semibold text-primary">
                {brand.categoryAr}
              </p>
              <h1 className="mt-4 max-w-4xl text-balance font-arabic-heading text-4xl font-semibold leading-[1.16] tracking-tight sm:text-5xl lg:text-6xl xl:text-[4.4rem]">
                أحضر السياق.
                <span className="block text-primary">حوّله إلى عمل واضح.</span>
              </h1>
            </StaggerItem>

            <StaggerItem>
              <p className="mt-7 max-w-2xl text-lg leading-9 text-ink-muted sm:text-xl">
                ابدأ بسؤال، اربطه بمصادرك، ثم حوّل النتيجة إلى مسودة يمكنك حفظها
                وتطويرها—من دون أن تضيع بين أدوات منفصلة أو تبدأ السياق من جديد.
              </p>
            </StaggerItem>

            <StaggerItem>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="rounded-full">
                  <Link href={brand.links.workspace}>
                    افتح مساحة العمل
                    <ArrowUpLeft className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full">
                  <Link href="/#product">شاهد كيف يعمل</Link>
                </Button>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="mt-8 flex max-w-2xl items-start gap-3 text-sm leading-7 text-ink-muted">
                <CheckCircle2
                  className="mt-1 h-4 w-4 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <p>
                  المسار المعروض يعكس القدرات المتاحة في المنتج: مساحات محفوظة،
                  مصادر نصية قابلة للفحص، ومسوّدات قابلة للمتابعة.
                </p>
              </div>
            </StaggerItem>
          </Stagger>

          <div className="relative">
            <div
              className="pointer-events-none absolute inset-x-16 -top-14 h-48 rounded-full bg-primary/15 blur-3xl"
              aria-hidden="true"
            />
            <WorkflowPreview />
          </div>
        </div>

        <div className="container-responsive relative mt-14 lg:mt-20">
          <Surface
            tone="overlay"
            elevation="xs"
            radius="2xl"
            padding="sm"
            className="grid gap-px overflow-hidden bg-line/70 p-px sm:grid-cols-2 lg:grid-cols-4"
          >
            {capabilityNotes.map((note) => (
              <div
                key={note}
                className="flex min-h-20 items-center gap-3 bg-surface-raised px-4 py-4 text-sm font-medium"
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>{note}</span>
              </div>
            ))}
          </Surface>
        </div>
      </section>

      <section id="product" className="scroll-mt-24 py-20 sm:py-28">
        <div className="container-responsive">
          <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold text-primary">مسار واحد متكامل</p>
              <h2 className="mt-4 text-balance font-arabic-heading text-3xl font-semibold leading-tight sm:text-5xl">
                من السؤال إلى المسودة، من دون فقدان السياق.
              </h2>
            </div>
            <p className="max-w-2xl text-lg leading-8 text-ink-muted lg:justify-self-end">
              لا تحتاج إلى اختيار وكيل أو بناء تدفق معقّد. كل خطوة واضحة، وكل
              انتقال يحافظ على ما سبقها داخل مساحة العمل نفسها.
            </p>
          </div>

          <Stagger className="mt-12 grid gap-5 lg:grid-cols-3">
            {journey.map(({ number, title, titleEn, description, icon: Icon }) => (
              <StaggerItem key={number} className="h-full">
                <MotionSurface className="h-full">
                  <Surface
                    tone="raised"
                    elevation="xs"
                    radius="2xl"
                    padding="lg"
                    className="flex h-full flex-col transition-[border-color,box-shadow] duration-base ease-standard hover:border-primary/30 hover:shadow-surface-md"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <span className="rounded-lg bg-brand-soft p-3 text-primary">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span className="font-mono text-xs font-semibold tracking-[0.18em] text-ink-subtle">
                        {number}
                      </span>
                    </div>
                    <h3 className="mt-7 font-arabic-heading text-2xl font-semibold">
                      {title}
                    </h3>
                    <p
                      dir="ltr"
                      className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary"
                    >
                      {titleEn}
                    </p>
                    <p className="mt-5 flex-1 text-sm leading-7 text-ink-muted">
                      {description}
                    </p>
                  </Surface>
                </MotionSurface>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section
        id="capabilities"
        className="scroll-mt-24 border-y border-line/70 bg-surface-sunken/55 py-20 sm:py-28"
      >
        <div className="container-responsive">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-primary">قدرات تخدم العمل</p>
            <h2 className="mt-4 text-balance font-arabic-heading text-3xl font-semibold leading-tight sm:text-5xl">
              واجهة هادئة فوق بنية تحفظ السياق والملكية.
            </h2>
            <p className="mt-6 text-lg leading-8 text-ink-muted">
              كل جزء من التجربة موجود لخدمة مهمة واضحة: العثور على السياق، فهم
              الإجابة، ثم الاحتفاظ بالنتيجة كعمل قابل للاستخدام.
            </p>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-12">
            <Surface
              tone="inverse"
              elevation="lg"
              radius="2xl"
              padding="lg"
              className="overflow-hidden lg:col-span-7"
            >
              <div
                className="pointer-events-none absolute -left-28 -top-28 h-80 w-80 rounded-full bg-primary/25 blur-3xl"
                aria-hidden="true"
              />
              <div className="relative z-10 grid gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-end">
                <div>
                  <span className="inline-flex rounded-full border border-background/15 bg-background/5 px-3 py-1 text-xs font-semibold text-background/70">
                    Arabic-first by structure
                  </span>
                  <h3 className="mt-5 text-balance font-arabic-heading text-3xl font-semibold leading-tight text-background">
                    العربية والإنجليزية في الواجهة نفسها، من دون حلول ترقيعية.
                  </h3>
                  <p className="mt-4 text-sm leading-8 text-background/65">
                    أسماء المساحات والمحادثات والمستندات تستخدم اتجاهها الطبيعي،
                    بينما تبقى بنية الواجهة ثابتة وقابلة للقراءة.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="rounded-xl border border-background/15 bg-background/5 p-4">
                    <p className="text-xs text-background/50">رسالة عربية</p>
                    <p className="mt-2 text-sm leading-7 text-background">
                      لخّص القرارات، ثم اكتب next steps بالإنجليزية.
                    </p>
                  </div>
                  <div dir="ltr" className="rounded-xl border border-background/15 bg-background/5 p-4 text-left">
                    <p className="text-xs text-background/50">Mixed content</p>
                    <p className="mt-2 text-sm leading-7 text-background">
                      Keep the project name as Tuppra, then continue the draft in Arabic.
                    </p>
                  </div>
                </div>
              </div>
            </Surface>

            <Surface
              tone="raised"
              elevation="xs"
              radius="2xl"
              padding="lg"
              className="lg:col-span-5"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="rounded-lg bg-brand-soft p-3 text-primary">
                  <FileText className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="rounded-full bg-surface-sunken px-3 py-1 text-xs font-semibold text-ink-muted">
                  TXT + Markdown
                </span>
              </div>
              <h3 className="mt-7 font-arabic-heading text-2xl font-semibold">
                مصادر خاصة ومقاطع قابلة للفتح
              </h3>
              <p className="mt-4 text-sm leading-7 text-ink-muted">
                أضف الملفات إلى مساحة محددة، وابحث داخلها، وافتح المقطع المستخدم
                في المرجع من دون مغادرة سياق العمل.
              </p>
            </Surface>

            <Surface
              tone="raised"
              elevation="xs"
              radius="2xl"
              padding="lg"
              className="lg:col-span-5"
            >
              <span className="rounded-lg bg-brand-soft p-3 text-primary">
                <PenLine className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-7 font-arabic-heading text-2xl font-semibold">
                مسودات لا تختفي بعد المحادثة
              </h3>
              <p className="mt-4 text-sm leading-7 text-ink-muted">
                حرّر العنوان والمحتوى والاتجاه، احفظ إصداراً جديداً، ثم صدّر
                النسخة المقبولة بصيغ نصية آمنة.
              </p>
            </Surface>

            <Surface
              tone="muted"
              elevation="none"
              radius="2xl"
              padding="lg"
              className="lg:col-span-7"
            >
              <div className="grid gap-6 sm:grid-cols-[auto_1fr] sm:items-start">
                <span className="rounded-lg bg-surface-raised p-3 text-primary shadow-surface-xs">
                  <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-arabic-heading text-2xl font-semibold">
                    حدود المساحة واضحة
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-ink-muted">
                    العضوية تحدد من يفتح المساحة ومن يحررها. تبقى المحادثات
                    والمصادر والمسودات مرتبطة بالسياق نفسه بدلاً من الانتشار عبر
                    صفحات منفصلة بلا علاقة واضحة.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {["مالك", "محرر", "قارئ"].map((role) => (
                      <span
                        key={role}
                        className="rounded-full border border-line bg-surface-raised px-3 py-1.5 text-xs font-semibold text-ink-muted"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Surface>
          </div>
        </div>
      </section>

      <section id="principles" className="scroll-mt-24 py-20 sm:py-28">
        <div className="container-responsive grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          <div className="max-w-xl lg:sticky lg:top-28">
            <p className="text-sm font-semibold text-primary">مبادئ التجربة</p>
            <h2 className="mt-4 text-balance font-arabic-heading text-3xl font-semibold leading-tight sm:text-5xl">
              أقل ضجيجاً، وأكثر وضوحاً في كل خطوة.
            </h2>
            <p className="mt-6 text-lg leading-8 text-ink-muted">
              الحركة تشرح الانتقال والحالة، والواجهة تمنح العمل المساحة الأكبر،
              واللغة تصف ما يستطيع المستخدم فعله بدلاً من كشف تفاصيل التنفيذ.
            </p>
          </div>

          <Stagger className="space-y-4">
            {principles.map(({ title, description, icon: Icon }, index) => (
              <StaggerItem key={title}>
                <Surface
                  tone={index === 1 ? "muted" : "raised"}
                  elevation={index === 1 ? "none" : "xs"}
                  radius="2xl"
                  padding="lg"
                  className="grid gap-5 sm:grid-cols-[auto_1fr_auto] sm:items-start"
                >
                  <span className="rounded-lg bg-brand-soft p-3 text-primary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-arabic-heading text-xl font-semibold">
                      {title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-ink-muted">
                      {description}
                    </p>
                  </div>
                  <span className="font-mono text-xs text-ink-subtle">
                    0{index + 1}
                  </span>
                </Surface>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="pb-20 sm:pb-28">
        <div className="container-responsive">
          <Surface
            tone="inverse"
            elevation="lg"
            radius="2xl"
            padding="lg"
            className="overflow-hidden"
          >
            <div
              className="pointer-events-none absolute -right-20 -top-28 h-80 w-80 rounded-full bg-primary/30 blur-3xl"
              aria-hidden="true"
            />
            <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold text-background/60">
                  ابدأ من سياق حقيقي
                </p>
                <h2 className="mt-4 text-balance font-arabic-heading text-3xl font-semibold leading-tight text-background sm:text-5xl">
                  أنشئ مساحة، أضف ما تعرفه، وابدأ العمل.
                </h2>
                <p className="mt-5 max-w-2xl text-base leading-8 text-background/65">
                  يمكنك البدء بمساحة فارغة، ثم إضافة المحادثات والمصادر والمسودات
                  حسب احتياجك من دون بيانات مثال مفروضة داخل حسابك.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full bg-background text-foreground hover:bg-background/90"
                >
                  <Link href={brand.links.registration}>
                    إنشاء حساب
                    <ArrowUpLeft className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="ghost"
                  className="rounded-full border border-background/20 bg-background/5 text-background hover:bg-background/10 hover:text-background focus-visible:ring-background/30"
                >
                  <Link href={brand.links.documentation}>اقرأ المستندات</Link>
                </Button>
              </div>
            </div>
          </Surface>
        </div>
      </section>
    </div>
  );
}
