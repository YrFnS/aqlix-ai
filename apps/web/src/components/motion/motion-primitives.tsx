"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import {
  liftInVariants,
  motionSpring,
  staggerContainerVariants,
} from "@/lib/motion";

interface MotionContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageReveal({ children, className }: MotionContainerProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : "hidden"}
      animate="visible"
      variants={liftInVariants}
      className={cn("min-w-0", className)}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({ children, className }: MotionContainerProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : "hidden"}
      animate="visible"
      variants={staggerContainerVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: MotionContainerProps) {
  return (
    <motion.div variants={liftInVariants} className={className}>
      {children}
    </motion.div>
  );
}

export function MotionSurface({ children, className }: MotionContainerProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      layout
      whileHover={shouldReduceMotion ? undefined : { y: -2 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.995 }}
      transition={motionSpring}
      className={className}
    >
      {children}
    </motion.div>
  );
}
