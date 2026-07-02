"use client";

import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";

export function Topbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 32));

  return (
    <motion.header
      className={`topbar${scrolled ? " scrolled" : ""}`}
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="topbar-inner">
        <a href="#top" className="brand">
          <span className="brand-mark" />
          Intentional Studio
        </a>
        <nav className="topnav">
          <a href="/about">About</a>
          <a href="/ai-training">AI Training</a>
          <a href="/custom-apps">Custom Apps</a>
          <a href="/work">Work</a>
          <a href="/guides">Guides</a>
          <a href="/answers">Answers</a>
          <a href="/learn">Learn</a>
          <a href="/start" className="topnav-cta">
            Get in touch →
          </a>
        </nav>
      </div>
    </motion.header>
  );
}
