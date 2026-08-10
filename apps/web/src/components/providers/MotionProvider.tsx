"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import { motionTransition } from "@/lib/motion";

export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={motionTransition}>
      {children}
    </MotionConfig>
  );
}
