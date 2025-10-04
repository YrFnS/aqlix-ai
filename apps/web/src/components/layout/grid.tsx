import { cn } from "@/lib/utils";

interface GridProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: "sm" | "md" | "lg";
}

const gapClasses = {
  sm: "gap-2 sm:gap-3",
  md: "gap-4 sm:gap-6",
  lg: "gap-6 sm:gap-8",
};

export function Grid({
  children,
  className,
  cols = { xs: 1, sm: 2, lg: 3 },
  gap = "md",
}: GridProps) {
  const colClasses = `
    grid-cols-${cols.xs || 1}
    ${cols.sm ? `sm:grid-cols-${cols.sm}` : ""}
    ${cols.md ? `md:grid-cols-${cols.md}` : ""}
    ${cols.lg ? `lg:grid-cols-${cols.lg}` : ""}
    ${cols.xl ? `xl:grid-cols-${cols.xl}` : ""}
  `.trim();

  return (
    <div className={cn("grid", colClasses, gapClasses[gap], className)}>
      {children}
    </div>
  );
}
