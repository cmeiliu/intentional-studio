"use client";

import { motion, useReducedMotion } from "motion/react";
import { EASE_OUT } from "@/lib/motion";
import { Magnetic, TiltCard, WordReveal } from "./primitives";

const heroTitle = [
  { text: "Intentional" },
  { text: "Studio" },
  { text: "helps" },
  { text: "businesses" },
  { text: "", br: true },
  { text: "actually use", em: true },
  { text: "AI." },
];

export function Hero() {
  const reduce = useReducedMotion();
  // Small helper: staggered fade-in for the hero body, timed to follow the headline.
  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, ease: EASE_OUT, delay },
        };

  return (
    <section id="top" className="hero">
      <div className="frame hero-frame">
        <div className="hero-text">
          <motion.p className="eyebrow" {...rise(0.05)}>
            <span className="eyebrow-line" />
            AI training, software &amp; brand
          </motion.p>

          <WordReveal className="hero-title" segments={heroTitle} />

          <motion.p className="hero-sub" {...rise(0.55)}>
            We run AI training that actually sticks, build the custom apps
            teams can&apos;t buy anywhere, and rebuild the websites that make
            good companies look dated.
          </motion.p>

          <motion.div className="hero-cta" {...rise(0.68)}>
            <Magnetic href="#contact" className="btn btn-primary">
              Get in touch
            </Magnetic>
            <Magnetic href="#work" className="btn btn-ghost" strength={0.25}>
              See recent work →
            </Magnetic>
          </motion.div>
        </div>

        <motion.div {...rise(0.35)}>
          <TiltCard className="hero-card">
            <div className="card-header">
              <span className="card-dot" />
              <span>The Studio · 2026</span>
            </div>
            <div className="card-portrait">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/mei.jpg" alt="Mei Liu, founder of Intentional Studio" />
              <span className="portrait-corner">M · L</span>
            </div>
            <div className="card-meta">
              <div className="card-row">
                <span className="card-key">Founder</span>
                <span className="card-val">Mei Liu</span>
              </div>
              <div className="card-row">
                <span className="card-key">Focus</span>
                <span className="card-val">AI training · Custom apps</span>
              </div>
            </div>
          </TiltCard>
        </motion.div>
      </div>
    </section>
  );
}
