import type { ReactNode } from "react";
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  Info,
  Languages,
  PenLine,
} from "lucide-react";
import { BrandMark } from "@/components/brand/brand-mark";
import { Surface } from "@/components/ui/surface";
import { cn } from "@/lib/utils";

interface AuthFrameProps {
  eyebrow: ReactNode;
  title: ReactNode;
  description: ReactNode;
  icon: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}

const features = [
  {
    title: "عربي أولاً، وثنائي اللغة",
    description: "اتجاه صحيح للواجهة وللنص المختلط من البداية.",
    icon: Languages,
  },
  {
    title: "مصادر تبقى قابلة للفحص",
    description: "المستندات والمقاطع الداعمة تظل جزءاً من السياق.",
    icon: FileText,
  },
  {
    title: "عمل قابل للحفظ والمتابعة",
    description: "حوّل النتيجة إلى مسودة، ثم تابعها بإصدارات واضحة.",
    icon: PenLine,
  },
] as const;

export function AuthFrame({
  eyebrow,
  title,
  description,
  icon,
  children,
  footer,
}: AuthFrameProps) {
  return (
    <Surface
      tone="overlay"
      elevation="lg"
      radius="2xl"
      padding="none"
      className="grid min-h-[650px] overflow-hidden lg:grid-cols-[0.88fr_1.12fr]"
      data-auth-frame="true"
    >
      <aside className="relative hidden overflow-hidden bg-foreground p-8 text-background lg:flex lg:flex-col lg:justify-between xl:p-10">
        <div
          className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-primary/30 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-36 right-1/4 h-80 w-80 rounded-full bg-background/10 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(hsl(var(--background) / 0.12) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--background) / 0.12) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
          aria-hidden="true"
        />

        <div className="relative z-10">
          <BrandMark inverse />
          <p className="mt-10 text-sm font-semibold text-background/60">
            مساحة واحدة للسؤال والسياق والعمل
          </p>
          <h2 className="mt-4 max-w-md text-balance font-arabic-heading text-3xl font-semibold leading-tight xl:text-4xl">
            عد إلى عملك من دون أن تبدأ السياق من جديد.
          </h2>
          <p className="mt-5 max-w-md text-sm leading-8 text-background/65">
            حسابك يربطك بمساحاتك ومحادثاتك ومصادرك ومسوداتك، مع بقاء حدود الوصول
            مرتبطة بعضوية كل مساحة.
          </p>
        </div>

        <div className="relative z-10 mt-10 space-y-3">
          {features.map(({ title: featureTitle, description: featureDescription, icon: Icon }) => (
            <div
              key={featureTitle}
              className="flex gap-4 rounded-xl border border-background/15 bg-background/5 p-4 backdrop-blur-sm"
            >
              <span className="h-fit rounded-lg bg-background/10 p-2.5 text-background">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold">{featureTitle}</p>
                <p className="mt-1 text-xs leading-6 text-background/55">
                  {featureDescription}
                </p>
              </div>
            </div>
          ))}
        </div>
      </aside>

      <section className="flex items-center justify-center p-6 sm:p-10 lg:p-12 xl:p-16">
        <div className="w-full max-w-md">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/15 bg-brand-soft text-primary shadow-surface-xs">
            {icon}
          </div>

          <div className="mt-6">
            <p className="text-sm font-semibold text-primary">{eyebrow}</p>
            <h1 className="mt-2 text-balance font-arabic-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              {title}
            </h1>
            <div className="mt-3 text-sm leading-7 text-ink-muted">
              {description}
            </div>
          </div>

          <div className="mt-7">{children}</div>

          {footer ? (
            <div className="mt-6 border-t border-line/70 pt-5 text-center text-sm text-ink-muted">
              {footer}
            </div>
          ) : null}
        </div>
      </section>
    </Surface>
  );
}

type AuthNoticeTone = "error" | "success" | "info";

const noticeStyles: Record<AuthNoticeTone, string> = {
  error: "border-destructive/30 bg-destructive/10 text-foreground",
  success: "border-primary/25 bg-brand-soft/65 text-foreground",
  info: "border-line bg-surface-sunken text-ink-muted",
};

const noticeIconStyles: Record<AuthNoticeTone, string> = {
  error: "bg-destructive/10 text-destructive",
  success: "bg-primary/10 text-primary",
  info: "bg-surface-raised text-ink-muted",
};

const noticeIcons = {
  error: AlertCircle,
  success: CheckCircle2,
  info: Info,
} as const;

export function AuthNotice({
  tone,
  children,
  className,
}: {
  tone: AuthNoticeTone;
  children: ReactNode;
  className?: string;
}) {
  const Icon = noticeIcons[tone];

  return (
    <Surface
      padding="sm"
      radius="lg"
      elevation="xs"
      className={cn(noticeStyles[tone], className)}
      role={tone === "error" ? "alert" : "status"}
      aria-live={tone === "error" ? "assertive" : "polite"}
    >
      <div className="flex items-start gap-3 text-sm leading-7">
        <span className={cn("mt-0.5 rounded-md p-2", noticeIconStyles[tone])}>
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>{children}</div>
      </div>
    </Surface>
  );
}
