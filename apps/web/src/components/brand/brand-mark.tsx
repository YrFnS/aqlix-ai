import { cn } from "@/lib/utils";

interface BrandMarkProps {
  className?: string;
  inverse?: boolean;
  showName?: boolean;
  size?: "sm" | "md";
}

export function BrandMark({
  className,
  inverse = false,
  showName = true,
  size = "md",
}: BrandMarkProps) {
  const isSmall = size === "sm";

  return (
    <span
      className={cn("inline-flex min-w-0 items-center gap-3", className)}
    >
      <span
        className={cn(
          "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-[0.9rem] border shadow-surface-xs",
          isSmall ? "h-9 w-9" : "h-11 w-11",
          inverse
            ? "border-white/15 bg-white/10"
            : "border-line/80 bg-surface-raised",
        )}
        aria-hidden="true"
      >
        <span
          className={cn(
            "absolute h-[42%] w-[48%] -translate-x-[15%] translate-y-[13%] rounded-[0.35rem] border",
            inverse
              ? "border-white/30 bg-white/10"
              : "border-primary/20 bg-brand-soft",
          )}
        />
        <span
          className={cn(
            "absolute h-[42%] w-[48%] translate-x-[12%] -translate-y-[12%] rounded-[0.35rem] border",
            inverse
              ? "border-white/55 bg-white/15"
              : "border-primary/40 bg-surface-raised",
          )}
        />
        <span
          className={cn(
            "absolute rounded-full",
            isSmall ? "h-1.5 w-1.5" : "h-2 w-2",
            inverse ? "bg-white" : "bg-primary",
          )}
          style={{ insetInlineEnd: "19%", insetBlockEnd: "18%" }}
        />
      </span>

      {showName ? (
        <span
          className={cn(
            "truncate font-arabic-heading font-semibold tracking-tight",
            isSmall ? "text-xl" : "text-2xl",
            inverse ? "text-white" : "text-foreground",
          )}
        >
          Tuppra
        </span>
      ) : null}
    </span>
  );
}
