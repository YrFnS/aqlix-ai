"use client";

import { useIsMobile } from "@/hooks/use-mobile";

interface ResponsiveWrapperProps {
  children: React.ReactNode;
  mobile?: React.ReactNode;
  desktop?: React.ReactNode;
}

export function ResponsiveWrapper({
  children,
  mobile,
  desktop,
}: ResponsiveWrapperProps) {
  const isMobile = useIsMobile();

  if (mobile && isMobile) return <>{mobile}</>;
  if (desktop && !isMobile) return <>{desktop}</>;
  return <>{children}</>;
}
