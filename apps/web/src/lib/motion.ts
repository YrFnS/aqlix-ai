import type { Transition, Variants } from "motion/react";

export const motionDurations = {
  fast: 0.14,
  base: 0.22,
  slow: 0.36,
} as const;

export const standardEase: [number, number, number, number] = [
  0.22, 1, 0.36, 1,
];

export const emphasizedEase: [number, number, number, number] = [
  0.16, 1, 0.3, 1,
];

export const exitEase: [number, number, number, number] = [0.4, 0, 1, 1];

export const motionTransition: Transition = {
  duration: motionDurations.base,
  ease: standardEase,
};

export const motionSpring: Transition = {
  type: "spring",
  stiffness: 320,
  damping: 30,
  mass: 0.82,
};

export const softSpring: Transition = {
  type: "spring",
  stiffness: 220,
  damping: 28,
  mass: 0.9,
};

export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: motionTransition,
  },
  exit: {
    opacity: 0,
    transition: {
      duration: motionDurations.fast,
      ease: exitEase,
    },
  },
};

export const liftInVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 14,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: motionDurations.slow,
      ease: emphasizedEase,
    },
  },
  exit: {
    opacity: 0,
    y: 8,
    transition: {
      duration: motionDurations.fast,
      ease: exitEase,
    },
  },
};

export const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.04,
      staggerChildren: 0.06,
    },
  },
};
