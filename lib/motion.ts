import type { Transition, Variants } from "motion/react";

/**
 * Shared motion system.
 *
 * The whole point of this file: every animation on the site pulls from the same
 * small set of easings, springs, and variants. That consistency — not the number
 * of effects — is what separates a designed feel from effects sprinkled on.
 */

/** Signature ease — a soft, weighted "settle" (same curve used across the CSS). */
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;
/** Gentle ease for smaller, quicker moves. */
export const EASE = [0.22, 0.61, 0.36, 1] as const;

/** Springs for interaction (cursor tilt, magnetic pull, nav). */
export const SPRING_SOFT: Transition = { type: "spring", stiffness: 150, damping: 20, mass: 0.6 };
export const SPRING_SNAPPY: Transition = { type: "spring", stiffness: 320, damping: 24, mass: 0.5 };

/** Standard entrance for a single element. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: EASE_OUT },
  },
};

/** Slightly larger rise for hero-scale elements. */
export const fadeUpLg: Variants = {
  hidden: { opacity: 0, y: 34 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.95, ease: EASE_OUT },
  },
};

/** Container that cascades its children in. Pair with `fadeUp` on each child. */
export const stagger = (delayChildren = 0, staggerChildren = 0.08): Variants => ({
  hidden: {},
  show: {
    transition: { delayChildren, staggerChildren },
  },
});

/** Per-word headline reveal — each word rises independently. */
export const wordContainer: Variants = {
  hidden: {},
  show: { transition: { delayChildren: 0.05, staggerChildren: 0.055 } },
};
export const word: Variants = {
  hidden: { opacity: 0, y: "0.5em" },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT } },
};

/** Shared viewport config so every section reveals with the same timing feel. */
export const inView = { once: true, amount: 0.2, margin: "0px 0px -60px 0px" } as const;
