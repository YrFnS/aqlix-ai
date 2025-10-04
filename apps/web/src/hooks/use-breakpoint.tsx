import { useMediaQuery } from "./use-media-query";

type Breakpoint = "sm" | "md" | "lg" | "xl" | "2xl";

const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export function useBreakpoint(breakpoint: Breakpoint) {
  return useMediaQuery(`(min-width: ${breakpoints[breakpoint]}px)`);
}

export function useCurrentBreakpoint(): Breakpoint | "xs" {
  const is2xl = useBreakpoint("2xl");
  const isXl = useBreakpoint("xl");
  const isLg = useBreakpoint("lg");
  const isMd = useBreakpoint("md");
  const isSm = useBreakpoint("sm");

  if (is2xl) return "2xl";
  if (isXl) return "xl";
  if (isLg) return "lg";
  if (isMd) return "md";
  if (isSm) return "sm";
  return "xs";
}
