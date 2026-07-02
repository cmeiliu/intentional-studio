"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";

/**
 * Scroll-reactive aurora. The orbs drift at different rates as you scroll,
 * so the background reads as intentional depth rather than a static blur.
 * Falls back to the plain (still) orbs under prefers-reduced-motion.
 */
export function Aurora() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 24, mass: 0.6 });

  // Each orb parallaxes a different distance/direction over the full scroll.
  const y1 = useTransform(smooth, [0, 1], [0, -120]);
  const y2 = useTransform(smooth, [0, 1], [0, 160]);
  const y3 = useTransform(smooth, [0, 1], [0, -200]);
  const y4 = useTransform(smooth, [0, 1], [0, 120]);
  const y5 = useTransform(smooth, [0, 1], [0, -160]);
  const y6 = useTransform(smooth, [0, 1], [0, 90]);
  const x1 = useTransform(smooth, [0, 1], [0, 60]);
  const x3 = useTransform(smooth, [0, 1], [0, -80]);

  if (reduce) {
    return (
      <div className="aurora" aria-hidden="true">
        <div className="orb o1" />
        <div className="orb o2" />
        <div className="orb o3" />
        <div className="orb o4" />
        <div className="orb o5" />
        <div className="orb o6" />
      </div>
    );
  }

  return (
    <div className="aurora" aria-hidden="true">
      <motion.div className="orb o1" style={{ y: y1, x: x1 }} />
      <motion.div className="orb o2" style={{ y: y2 }} />
      <motion.div className="orb o3" style={{ y: y3, x: x3 }} />
      <motion.div className="orb o4" style={{ y: y4 }} />
      <motion.div className="orb o5" style={{ y: y5 }} />
      <motion.div className="orb o6" style={{ y: y6 }} />
    </div>
  );
}
