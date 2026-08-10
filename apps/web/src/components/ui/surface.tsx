import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const surfaceVariants = cva("relative border text-foreground", {
  variants: {
    tone: {
      default: "border-line/80 bg-surface",
      raised: "border-line/70 bg-surface-raised",
      muted: "border-line/70 bg-surface-sunken",
      overlay: "border-line/70 bg-surface-overlay/95 backdrop-blur-xl",
      transparent: "border-transparent bg-transparent",
      inverse: "border-white/10 bg-foreground text-background",
    },
    elevation: {
      none: "shadow-none",
      xs: "shadow-surface-xs",
      sm: "shadow-surface-sm",
      md: "shadow-surface-md",
      lg: "shadow-surface-lg",
    },
    radius: {
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      xl: "rounded-xl",
      "2xl": "rounded-2xl",
    },
    padding: {
      none: "p-0",
      sm: "p-4",
      md: "p-5 sm:p-6",
      lg: "p-6 sm:p-8",
    },
  },
  defaultVariants: {
    tone: "default",
    elevation: "none",
    radius: "xl",
    padding: "md",
  },
});

type SurfaceProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof surfaceVariants>;

export function Surface({
  className,
  tone,
  elevation,
  radius,
  padding,
  ...props
}: SurfaceProps) {
  return (
    <div
      data-slot="surface"
      className={cn(
        surfaceVariants({ tone, elevation, radius, padding }),
        className,
      )}
      {...props}
    />
  );
}

export { surfaceVariants };
