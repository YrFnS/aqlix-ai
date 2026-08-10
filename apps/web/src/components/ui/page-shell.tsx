import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

const shellWidths = {
  compact: "max-w-4xl",
  default: "max-w-6xl",
  wide: "max-w-7xl",
  fluid: "max-w-none",
} as const;

interface PageShellProps extends HTMLAttributes<HTMLDivElement> {
  width?: keyof typeof shellWidths;
}

export function PageShell({
  className,
  width = "wide",
  ...props
}: PageShellProps) {
  return (
    <div
      data-slot="page-shell"
      className={cn("mx-auto w-full space-y-6", shellWidths[width], className)}
      {...props}
    />
  );
}

interface PageHeaderProps
  extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <header
      data-slot="page-header"
      className={cn(
        "flex flex-col gap-6 border-b border-line/70 pb-6 sm:pb-8 lg:flex-row lg:items-end lg:justify-between",
        className,
      )}
      {...props}
    >
      <div className="max-w-3xl">
        {eyebrow ? (
          <div className="text-sm font-semibold text-primary">{eyebrow}</div>
        ) : null}
        <h1 className="mt-2 text-balance font-arabic-heading text-3xl font-semibold tracking-tight sm:text-5xl">
          {title}
        </h1>
        {description ? (
          <div className="mt-4 text-base leading-8 text-ink-muted sm:text-lg">
            {description}
          </div>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-wrap gap-3">{actions}</div>
      ) : null}
    </header>
  );
}

interface PageSectionProps
  extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}

export function PageSection({
  title,
  description,
  actions,
  className,
  children,
  ...props
}: PageSectionProps) {
  return (
    <section
      data-slot="page-section"
      className={cn("space-y-5", className)}
      {...props}
    >
      {title || description || actions ? (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            {title ? (
              <h2 className="font-arabic-heading text-2xl font-semibold">
                {title}
              </h2>
            ) : null}
            {description ? (
              <div className="mt-2 text-sm leading-7 text-ink-muted">
                {description}
              </div>
            ) : null}
          </div>
          {actions ? (
            <div className="flex shrink-0 flex-wrap gap-3">{actions}</div>
          ) : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}
