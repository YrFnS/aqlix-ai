import { cn } from "@/lib/utils";

interface StackProps {
  children: React.ReactNode;
  className?: string;
  direction?: "row" | "col";
  spacing?: "sm" | "md" | "lg";
  responsive?: boolean; // Stack on mobile, flex-row on desktop
}

const spacingClasses = {
  row: {
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
  },
  col: {
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
  },
};

export function Stack({
  children,
  className,
  direction = "col",
  spacing = "md",
  responsive = false,
}: StackProps) {
  const directionClass = responsive
    ? "flex-col sm:flex-row"
    : direction === "row"
      ? "flex-row"
      : "flex-col";

  return (
    <div
      className={cn(
        "flex",
        directionClass,
        spacingClasses[direction][spacing],
        className,
      )}
    >
      {children}
    </div>
  );
}
