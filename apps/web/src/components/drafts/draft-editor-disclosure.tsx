"use client";

import { ChevronDown } from "lucide-react";

export function DisclosureSummary({
  title,
  description,
  count,
}: {
  title: string;
  description: string;
  count?: number;
}) {
  return (
    <summary className="flex min-h-14 cursor-pointer list-none items-center gap-3 px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-primary [&::-webkit-details-marker]:hidden">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          {description}
        </p>
      </div>
      {count !== undefined && (
        <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-muted-foreground">
          {count}
        </span>
      )}
      <ChevronDown
        className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
        aria-hidden="true"
      />
    </summary>
  );
}
