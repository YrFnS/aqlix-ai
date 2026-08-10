"use client";

import { useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";
import {
  ArrowUpLeft,
  CheckCircle2,
  FileText,
  MessageSquareText,
  PenLine,
} from "lucide-react";
import { Surface } from "@/components/ui/surface";
import { cn } from "@/lib/utils";
import { motionSpring } from "@/lib/motion";

const steps = [
  {
    id: "ask",
    label: "اسأل",
    labelEn: "Ask",
    icon: MessageSquareText,
  },
  {
    id: "ground",
    label: "أضف السياق",
    labelEn: "Ground",
    icon: FileText,
  },
  {
    id: "draft",
    label: "أنشئ مسودة",
    labelEn: "Draft",
    icon: PenLine,
  },
] as const;

type StepId = (typeof steps)[number]["id"];

const transition = {
  duration: 0.36,
  ease: [0.22, 1, 0.36, 1] as const,
};

function ActivityMark({ step }: { step: StepId }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <span
      className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center"
      aria-hidden="true"
    >
      {[0, 1, 2].map((ring) => (
        <motion.span
          key={`${step}-${ring}`}
          className="absolute rounded-full border border-primary/25"
          style={{ width: 18 + ring * 8, height: 18 + ring * 8 }}
          initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.72 }}
          animate={
            shouldReduceMotion
              ? { opacity: 0.22, scale: 1 }
              : {
                  opacity: [0, 0.42 - ring * 0.08, 0.16],
                  scale: [0.72, 1.08, 1],
                }
          }
          transition={{ duration: 0.54 + ring * 0.08, delay: ring * 0.04 }}
        />
      ))}
      <span className="relative h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_18px_hsl(var(--primary)/0.45)]" />
    </span>
  );
}

function AskPanel() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-5 p-5 sm:p-6">
        <div className="max-w-[88%] rounded-2xl rounded-tr-sm bg-primary px-4 py-3 text-sm leading-7 text-primary-foreground shadow-surface-sm">
          لخّص قرارات الاجتماع، وحدد ما يحتاج متابعة هذا الأسبوع.
        </div>

        <div className="max-w-[92%] rounded-2xl rounded-tl-sm border border-line/70 bg-surface-raised p-4 shadow-surface-xs">
          <div className="mb-3 flex items-center gap-3">
            <ActivityMark step="ask" />
            <div>
              <p className="text-xs font-semibold text-primary">فهم المهمة</p>
              <p className="mt-0.5 text-[0.7rem] text-ink-subtle">
                سؤال واضح داخل مساحة محفوظة
              </p>
            </div>
          </div>
          <p className="text-sm leading-7 text-ink-muted">
            سأرتب القرارات حسب الأولوية، ثم أفصل عناصر المتابعة عن المعلومات التي
            تحتاج إلى تحقق من المصادر.
          </p>
        </div>
      </div>

      <div className="border-t border-line/70 bg-surface-sunken/70 p-4">
        <div className="flex min-h-12 items-center gap-3 rounded-xl border border-line bg-surface-raised px-4 shadow-surface-xs">
          <span className="flex-1 text-sm text-ink-subtle">
            اكتب سؤالاً أو مهمة…
          </span>
          <span className="rounded-lg bg-primary p-2 text-primary-foreground">
            <ArrowUpLeft className="h-4 w-4" aria-hidden="true" />
          </span>
        </div>
      </div>
    </div>
  );
}

function GroundPanel() {
  return (
    <div className="grid h-full gap-0 md:grid-cols-[0.43fr_0.57fr]">
      <div className="border-b border-line/70 bg-surface-sunken/65 p-4 md:border-b-0 md:border-l">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-primary">مصادر المساحة</p>
            <p className="mt-1 text-[0.7rem] text-ink-subtle">
              ملفات نصية خاصة وقابلة للفحص
            </p>
          </div>
          <ActivityMark step="ground" />
        </div>

        <div className="space-y-3">
          {[
            ["محضر-الاجتماع.md", "المقطع 04 · القرارات"],
            ["خطة-الإصدار.txt", "المقطع 02 · الأولويات"],
          ].map(([name, detail], index) => (
            <Surface
              key={name}
              tone={index === 0 ? "raised" : "default"}
              radius="lg"
              padding="sm"
              elevation={index === 0 ? "xs" : "none"}
              className={cn(index === 0 && "border-primary/30")}
            >
              <div className="flex items-start gap-3">
                <span className="rounded-md bg-brand-soft p-2 text-primary">
                  <FileText className="h-4 w-4" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p dir="auto" className="truncate text-xs font-semibold">
                    {name}
                  </p>
                  <p className="mt-1 text-[0.68rem] text-ink-subtle">{detail}</p>
                </div>
              </div>
            </Surface>
          ))}
        </div>
      </div>

      <div className="flex flex-col p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-primary">
              إجابة مرتبطة بالسياق
            </p>
            <p className="mt-1 text-[0.7rem] text-ink-subtle">
              كل مرجع يفتح المقطع الداعم
            </p>
          </div>
          <span className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[0.68rem] font-semibold text-primary">
            مصدران
          </span>
        </div>

        <div className="mt-6 space-y-4 text-sm leading-7 text-ink-muted">
          <p>
            ثُبّت نطاق الإصدار الأول حول المحادثات والمصادر والمسودات، مع تأجيل
            التوسعات التي لا تخدم المسار الأساسي.
            <sup className="mx-1 rounded bg-brand-soft px-1.5 py-0.5 text-[0.65rem] font-semibold text-primary">
              1
            </sup>
          </p>
          <p>
            المتابعة المطلوبة هذا الأسبوع هي توثيق مسؤول المراجعة وإغلاق قرار
            الاحتفاظ بالملفات قبل الاختبار التالي.
            <sup className="mx-1 rounded bg-brand-soft px-1.5 py-0.5 text-[0.65rem] font-semibold text-primary">
              2
            </sup>
          </p>
        </div>

        <div className="mt-auto pt-6">
          <div className="flex items-center gap-3 rounded-xl border border-line bg-surface-sunken/70 p-3 text-xs text-ink-muted">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            المصادر تبقى مرئية بدلاً من إخفائها خلف الإجابة.
          </div>
        </div>
      </div>
    </div>
  );
}

function DraftPanel() {
  return (
    <div className="h-full p-5 sm:p-6">
      <div className="flex items-center justify-between gap-4 border-b border-line/70 pb-4">
        <div>
          <p className="text-xs font-semibold text-primary">مذكرة قرار</p>
          <p className="mt-1 text-[0.7rem] text-ink-subtle">
            مسودة قابلة للتحرير والحفظ بإصدارات
          </p>
        </div>
        <ActivityMark step="draft" />
      </div>

      <div className="mt-5 rounded-xl border border-line/70 bg-surface-raised p-5 shadow-surface-xs">
        <h3 className="font-arabic-heading text-xl font-semibold">
          قرارات الإصدار الأول وخطوات المتابعة
        </h3>
        <div className="mt-5 space-y-4 text-sm leading-7 text-ink-muted">
          {[
            "اعتماد نطاق يربط السؤال بالمصادر ثم يحوّل النتيجة إلى مسودة.",
            "تحديد مسؤول مراجعة المصادر قبل بدء الاختبار التالي.",
            "توثيق قرار الاحتفاظ بالملفات داخل إعدادات المساحة.",
          ].map((item) => (
            <div key={item} className="flex items-start gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <p>{item}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-line/70 bg-surface-sunken/65 px-4 py-3">
          <p className="text-[0.68rem] font-semibold text-ink-subtle">الحالة</p>
          <p className="mt-1 text-xs font-semibold">مسودة محفوظة</p>
        </div>
        <div className="rounded-xl border border-line/70 bg-surface-sunken/65 px-4 py-3">
          <p className="text-[0.68rem] font-semibold text-ink-subtle">الاتجاه</p>
          <p className="mt-1 text-xs font-semibold">عربي · RTL</p>
        </div>
      </div>
    </div>
  );
}

export function WorkflowPreview() {
  const [activeStep, setActiveStep] = useState<StepId>("ask");
  const shouldReduceMotion = useReducedMotion();

  return (
    <Surface
      tone="overlay"
      elevation="lg"
      radius="2xl"
      padding="none"
      className="relative mx-auto w-full max-w-2xl overflow-hidden"
    >
      <div className="flex items-center justify-between gap-4 border-b border-line/70 bg-surface-raised/75 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-3">
          <span className="h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_16px_hsl(var(--primary)/0.4)]" />
          <div>
            <p className="text-xs font-semibold">مساحة مشروع</p>
            <p dir="ltr" className="mt-0.5 text-[0.65rem] text-ink-subtle">
              Interactive product preview
            </p>
          </div>
        </div>
        <span className="rounded-full border border-line/70 bg-surface-sunken px-3 py-1 text-[0.68rem] font-semibold text-ink-muted">
          عربي + English
        </span>
      </div>

      <div className="grid grid-cols-3 border-b border-line/70 bg-surface/70 p-2">
        {steps.map((step) => {
          const Icon = step.icon;
          const isActive = activeStep === step.id;

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => setActiveStep(step.id)}
              aria-pressed={isActive}
              className={cn(
                "relative flex min-h-14 items-center justify-center gap-2 rounded-lg px-2 text-xs font-semibold outline-none transition-colors duration-fast focus-visible:ring-4 focus-visible:ring-ring/20",
                isActive
                  ? "text-primary"
                  : "text-ink-muted hover:bg-surface-sunken hover:text-foreground",
              )}
            >
              {isActive ? (
                <motion.span
                  layoutId="workflow-active-step"
                  className="absolute inset-0 rounded-lg border border-primary/20 bg-brand-soft/65"
                  transition={motionSpring}
                  aria-hidden="true"
                />
              ) : null}
              <Icon className="relative h-4 w-4" aria-hidden="true" />
              <span className="relative">
                {step.label}
                <span dir="ltr" className="ms-1 hidden text-[0.62rem] opacity-65 sm:inline">
                  {step.labelEn}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="relative min-h-[430px] bg-surface-base" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeStep}
            className="absolute inset-0"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 10, scale: 0.992 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.996 }}
            transition={transition}
          >
            {activeStep === "ask" ? <AskPanel /> : null}
            {activeStep === "ground" ? <GroundPanel /> : null}
            {activeStep === "draft" ? <DraftPanel /> : null}
          </motion.div>
        </AnimatePresence>
      </div>
    </Surface>
  );
}
