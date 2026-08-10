"use client";

import { useState, type ComponentType } from "react";
import {
  BookOpenCheck,
  Check,
  FilePenLine,
  Files,
  MessageSquareText,
  Sparkles,
} from "lucide-react";

interface JourneyStage {
  id: "ask" | "ground" | "draft" | "continue";
  label: string;
  labelEn: string;
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
}

const stages: JourneyStage[] = [
  {
    id: "ask",
    label: "اسأل",
    labelEn: "Ask",
    icon: MessageSquareText,
  },
  {
    id: "ground",
    label: "اربط السياق",
    labelEn: "Ground",
    icon: Files,
  },
  {
    id: "draft",
    label: "أنشئ مسودة",
    labelEn: "Draft",
    icon: FilePenLine,
  },
  {
    id: "continue",
    label: "راجع وطوّر",
    labelEn: "Continue",
    icon: Sparkles,
  },
];

function AskPreview() {
  return (
    <div className="grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
      <aside className="rounded-3xl border border-border/70 bg-secondary/35 p-4">
        <p className="text-xs font-semibold text-muted-foreground">مساحة العمل</p>
        <div className="mt-4 space-y-2">
          <div className="rounded-2xl border border-primary/25 bg-primary/5 p-3">
            <p className="text-sm font-semibold">قرار إطلاق المشروع</p>
            <p className="mt-1 text-xs text-muted-foreground">محادثة جديدة</p>
          </div>
          <div className="rounded-2xl border border-border/70 bg-background p-3 text-xs text-muted-foreground">
            المصادر اختيارية في هذه الخطوة
          </div>
        </div>
      </aside>

      <div className="flex min-h-72 flex-col rounded-3xl border border-border/70 bg-background p-5 sm:p-6">
        <div className="self-end max-w-[88%] rounded-3xl rounded-bl-md bg-primary px-5 py-4 text-sm leading-7 text-primary-foreground shadow-sm">
          لخّص قرار الإطلاق، وحدد ما يحتاج موافقة هذا الأسبوع.
        </div>
        <div className="mt-auto rounded-2xl border border-border/70 bg-card px-4 py-3 text-sm text-muted-foreground shadow-sm">
          اكتب بالعربية أو English، وابدأ بسؤال واحد واضح.
        </div>
      </div>
    </div>
  );
}

function GroundPreview() {
  return (
    <div className="grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
      <aside className="rounded-3xl border border-border/70 bg-secondary/35 p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold text-muted-foreground">المصادر</p>
          <span className="rounded-full bg-background px-2 py-1 text-[0.65rem] text-muted-foreground">
            2
          </span>
        </div>
        <div className="mt-4 space-y-3">
          {[
            ["قرار-المشروع.md", "المقطع 3"],
            ["ملاحظات-الفريق.txt", "الأسطر 18–24"],
          ].map(([name, locator]) => (
            <div
              key={name}
              className="rounded-2xl border border-border/70 bg-background p-3"
            >
              <div className="flex items-start gap-3">
                <span className="rounded-xl bg-primary/10 p-2 text-primary">
                  <BookOpenCheck className="h-4 w-4" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p dir="auto" className="truncate text-xs font-semibold">
                    {name}
                  </p>
                  <p className="mt-1 text-[0.68rem] text-muted-foreground">
                    {locator}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </aside>

      <div className="rounded-3xl border border-border/70 bg-background p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold text-primary">إجابة مرتبطة بالمصادر</p>
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[0.68rem] font-semibold text-primary">
            مرجعان
          </span>
        </div>
        <div className="mt-5 space-y-4 text-sm leading-8 text-foreground">
          <p>
            يثبت القرار نطاق الإصدار الأول ويجعل مراجعة الأمان شرطاً قبل الإطلاق
            <span className="mx-1 rounded-md bg-primary/10 px-1.5 py-0.5 text-xs font-semibold text-primary">
              S1
            </span>
          </p>
          <p>
            ويحدد اجتماع الفريق ثلاثة عناصر تحتاج موافقة المالك هذا الأسبوع
            <span className="mx-1 rounded-md bg-primary/10 px-1.5 py-0.5 text-xs font-semibold text-primary">
              S2
            </span>
          </p>
        </div>
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <div className="rounded-2xl border border-border/70 bg-card p-3 text-xs text-muted-foreground">
            افتح S1 لمراجعة المقطع نفسه
          </div>
          <div className="rounded-2xl border border-border/70 bg-card p-3 text-xs text-muted-foreground">
            تبقى أسماء الملفات محفوظة مع الإجابة
          </div>
        </div>
      </div>
    </div>
  );
}

function DraftPreview() {
  return (
    <div className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
      <div className="rounded-3xl border border-border/70 bg-background p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-primary">مذكرة قرار</p>
            <h3 className="mt-1 font-arabic-heading text-xl font-semibold">
              قرار إطلاق المشروع
            </h3>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
            <Check className="h-3.5 w-3.5" aria-hidden="true" />
            الإصدار 1 محفوظ
          </span>
        </div>
        <div className="mt-5 rounded-3xl border border-border/70 bg-card p-5 text-sm leading-8">
          <p className="font-semibold">القرار</p>
          <p className="mt-2 text-muted-foreground">
            اعتماد نطاق الإصدار الأول، مع إبقاء الإطلاق مشروطاً بإغلاق مراجعة
            الأمان والموافقات الثلاث المعلّقة.
          </p>
          <p className="mt-5 font-semibold">الإجراءات التالية</p>
          <ul className="mt-2 space-y-2 text-muted-foreground">
            <li>• تعيين مالك لكل موافقة.</li>
            <li>• توثيق نتيجة مراجعة الأمان.</li>
          </ul>
        </div>
      </div>

      <aside className="space-y-3">
        <div className="rounded-3xl border border-border/70 bg-secondary/35 p-4">
          <p className="text-xs font-semibold text-muted-foreground">المنشأ</p>
          <p className="mt-3 text-sm font-semibold">المحادثة + مرجعان</p>
          <p className="mt-2 text-xs leading-6 text-muted-foreground">
            يمكن العودة إلى الإجابة والمقاطع الداعمة من المسودة.
          </p>
        </div>
        <div className="rounded-3xl border border-border/70 bg-background p-4">
          <p className="text-xs font-semibold text-muted-foreground">التصدير</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
            {['TXT', 'Markdown', 'HTML'].map((format) => (
              <span key={format} className="rounded-full bg-secondary px-3 py-1.5">
                {format}
              </span>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}

function ContinuePreview() {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="rounded-3xl border border-border/70 bg-background p-5 sm:p-6">
        <p className="text-xs font-semibold text-muted-foreground">النص المقبول</p>
        <h3 className="mt-2 font-arabic-heading text-lg font-semibold">
          الإصدار 2
        </h3>
        <p className="mt-4 text-sm leading-8 text-muted-foreground">
          اعتماد نطاق الإصدار الأول مع ربط الإطلاق بنتيجة مراجعة الأمان.
        </p>
      </div>

      <div className="rounded-3xl border border-primary/30 bg-primary/5 p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold text-primary">اقتراح للمراجعة</p>
          <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
        </div>
        <p className="mt-4 text-sm leading-8">
          اعتماد نطاق الإصدار الأول، وتسجيل نتيجة مراجعة الأمان ومالك القرار قبل
          تحديد موعد الإطلاق.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-2 text-xs font-semibold">
          <span className="inline-flex min-h-10 items-center justify-center rounded-full bg-primary px-4 text-primary-foreground">
            تطبيق كإصدار جديد
          </span>
          <span className="inline-flex min-h-10 items-center justify-center rounded-full border border-border bg-background px-4">
            رفض الاقتراح
          </span>
        </div>
      </div>
    </div>
  );
}

function PreviewPanel({ stage }: { stage: JourneyStage["id"] }) {
  switch (stage) {
    case "ask":
      return <AskPreview />;
    case "ground":
      return <GroundPreview />;
    case "draft":
      return <DraftPreview />;
    case "continue":
      return <ContinuePreview />;
  }
}

export function ProductJourneyPreview() {
  const [activeStage, setActiveStage] =
    useState<JourneyStage["id"]>("ground");

  return (
    <section className="relative rounded-[2rem] border border-border/80 bg-card/95 p-3 shadow-2xl shadow-foreground/10 backdrop-blur">
      <div className="overflow-hidden rounded-[1.5rem] border border-border/75 bg-background">
        <div className="flex flex-col gap-4 border-b border-border/70 p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">رحلة عمل واحدة</p>
              <p className="mt-1 text-xs text-muted-foreground">
                اختر خطوة لمعاينة ما يحدث داخل Tuppra
              </p>
            </div>
            <span className="rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-muted-foreground">
              معاينة توضيحية
            </span>
          </div>

          <div
            className="grid grid-cols-2 gap-2 lg:grid-cols-4"
            aria-label="خطوات رحلة Tuppra"
          >
            {stages.map(({ id, label, labelEn, icon: Icon }) => {
              const active = activeStage === id;
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={active}
                  aria-controls="tuppra-journey-panel"
                  onClick={() => setActiveStage(id)}
                  className={`flex min-h-12 items-center gap-3 rounded-2xl border px-3 text-start transition-colors ${
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border/70 bg-card text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span className="min-w-0">
                    <span className="block truncate text-xs font-semibold">
                      {label}
                    </span>
                    <span
                      dir="ltr"
                      className={`mt-0.5 block truncate text-[0.65rem] ${
                        active ? "text-primary-foreground/70" : "text-muted-foreground"
                      }`}
                    >
                      {labelEn}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div
          id="tuppra-journey-panel"
          data-preview-step={activeStage}
          className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 p-4 duration-300 sm:p-5"
        >
          <PreviewPanel stage={activeStage} />
        </div>
      </div>
    </section>
  );
}
