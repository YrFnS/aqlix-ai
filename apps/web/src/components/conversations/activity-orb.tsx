"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export type ActivityOrbState =
  | "working"
  | "searching"
  | "composing"
  | "shaping";

const stateLabels: Record<ActivityOrbState, string> = {
  working: "جاري العمل",
  searching: "جاري البحث في المصادر",
  composing: "جاري إنشاء الاستجابة",
  shaping: "جاري تشكيل المسودة",
};

const stateMotion: Record<
  ActivityOrbState,
  { rotate: number; scale: number[]; offset: number }
> = {
  working: { rotate: 360, scale: [0.86, 1, 0.9], offset: 0 },
  searching: { rotate: -360, scale: [0.78, 1.05, 0.82], offset: 0.55 },
  composing: { rotate: 360, scale: [0.9, 1.08, 0.92], offset: 1.05 },
  shaping: { rotate: -360, scale: [0.82, 1, 0.88], offset: 1.55 },
};

export function ActivityOrb({
  state = "working",
  size = "md",
  label,
  className,
}: {
  state?: ActivityOrbState;
  size?: "sm" | "md";
  label?: string;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();
  const motionState = stateMotion[state];
  const dimension = size === "sm" ? "h-6 w-6" : "h-10 w-10";
  const dot = size === "sm" ? "h-1.5 w-1.5" : "h-2.5 w-2.5";

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center rounded-full border border-primary/20 bg-brand-soft/65 shadow-surface-xs",
        dimension,
        className,
      )}
      role="status"
      aria-label={label ?? stateLabels[state]}
    >
      <motion.span
        className="absolute inset-[18%] rounded-full border border-primary/30"
        animate={
          shouldReduceMotion
            ? undefined
            : { rotate: motionState.rotate, scale: motionState.scale }
        }
        transition={{
          rotate: {
            duration: 3.2 + motionState.offset,
            ease: "linear",
            repeat: Number.POSITIVE_INFINITY,
          },
          scale: {
            duration: 1.7 + motionState.offset / 2,
            ease: "easeInOut",
            repeat: Number.POSITIVE_INFINITY,
          },
        }}
        aria-hidden="true"
      />
      <motion.span
        className={cn("rounded-full bg-primary", dot)}
        animate={
          shouldReduceMotion
            ? undefined
            : { scale: [0.75, 1.1, 0.78], opacity: [0.65, 1, 0.72] }
        }
        transition={{
          duration: 1.45 + motionState.offset / 3,
          ease: "easeInOut",
          repeat: Number.POSITIVE_INFINITY,
        }}
        aria-hidden="true"
      />
      <motion.span
        className={cn(
          "absolute rounded-full bg-primary/55",
          size === "sm" ? "h-1 w-1" : "h-1.5 w-1.5",
        )}
        style={{ insetInlineEnd: "14%", insetBlockStart: "20%" }}
        animate={
          shouldReduceMotion
            ? undefined
            : { y: [0, 3, 0], opacity: [0.4, 0.9, 0.4] }
        }
        transition={{
          duration: 1.25 + motionState.offset / 4,
          ease: "easeInOut",
          repeat: Number.POSITIVE_INFINITY,
        }}
        aria-hidden="true"
      />
      <span className="sr-only">{label ?? stateLabels[state]}</span>
    </span>
  );
}
