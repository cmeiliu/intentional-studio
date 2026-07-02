"use client";

import { motion } from "motion/react";
import { fadeUp } from "@/lib/motion";
import { Reveal, Stagger } from "./primitives";
import type { ReactNode } from "react";

type Card = {
  href?: string;
  tag: string;
  tagCls: string;
  year: string;
  title: ReactNode;
  desc: string;
  stack: string[];
  arrow: string;
};

const cards: Card[] = [
  {
    href: "https://pebbled.ai",
    tag: "Platform · AI",
    tagCls: "workcard-tag tag-maroon",
    year: "2026",
    title: "Pebbled",
    desc: "The platform behind this studio. A recorded scoping call turns into requirements, tickets, and a working custom app — the custom tool no SaaS vendor sells, auto-built and hand-finished by the team.",
    stack: ["Next.js 16", "React 19", "Anthropic SDK", "Neon"],
    arrow: "Visit pebbled.ai ↗",
  },
  {
    href: "https://github.com/cmeiliu/binance-us-skills",
    tag: "Software · AI",
    tagCls: "workcard-tag tag-turquoise",
    year: "2026",
    title: "Binance.US Skill Suite",
    desc: "Five installable skills for OpenClaw, Codex, and Claude Code that move a crypto exchange's users from market awareness to account action — daily briefings, single-asset research, funding, spot-trade review, and account-status checks.",
    stack: ["Python", "Claude Code", "Agents"],
    arrow: "View on GitHub ↗",
  },
  {
    tag: "Software · Hospitality",
    tagCls: "workcard-tag tag-cream",
    year: "2026",
    title: "Lip Smacking Foodie Tours",
    desc: "Restaurant-outreach automation for one of Las Vegas's longest-running food-tour operators: reads the Rezdy manifest, uses Claude to parse dietary notes and celebrations, and renders per-restaurant email digests with a Google-Sheet approval UI.",
    stack: ["Python", "Claude", "Rezdy", "Gmail API"],
    arrow: "Private repo",
  },
  {
    tag: "Software · Events",
    tagCls: "workcard-tag tag-turquoise",
    year: "2026",
    title: "Camp Spin Off",
    desc: "A reserve-a-spot flow for a youth camp: attendee-intent forms, instant email confirmations, and a PayPal deposit that closes registration at the moment of intent — so families book at midnight and the team wakes up to confirmed spots.",
    stack: ["Next.js", "EmailJS", "PayPal"],
    arrow: "Private repo",
  },
  {
    tag: "Software · Home services",
    tagCls: "workcard-tag tag-maroon",
    year: "2026",
    title: "Northside Exteriors",
    desc: "A photo-to-quote tool for a home-services company. Describe the quote you send a hundred times a week once, then let it draft each one from a photo of the job — quotes out before lunch instead of after hours.",
    stack: ["Next.js", "Claude", "Vision"],
    arrow: "Private repo",
  },
  {
    href: "https://github.com/cmeiliu/bleached-portal",
    tag: "Software · Client portal",
    tagCls: "workcard-tag tag-cream",
    year: "2026",
    title: "Bleached Portal",
    desc: "A client portal built on Pebbled's stack — Next.js 16, React 19, Tailwind v4 — shipping with an in-app support copilot and on-demand, privacy-masked session replay from its very first version.",
    stack: ["Next.js 16", "React 19", "PostHog"],
    arrow: "View on GitHub ↗",
  },
];

function CardInner({ c }: { c: Card }) {
  return (
    <>
      <div className={c.tagCls}>{c.tag}</div>
      <div className="workcard-year">{c.year}</div>
      <h3 className="workcard-title">{c.title}</h3>
      <p className="workcard-desc">{c.desc}</p>
      <div className="workcard-stack">
        {c.stack.map((s) => (
          <span key={s}>{s}</span>
        ))}
      </div>
      <span className="workcard-arrow">{c.arrow}</span>
    </>
  );
}

export function Work() {
  return (
    <section id="work" className="section section-work">
      <div className="frame">
        <Reveal className="section-head">
          <p className="eyebrow eyebrow-turquoise">
            <span className="eyebrow-line" />
            Browse my recent
          </p>
          <h2 className="section-title">
            Selected <em>work</em>.
          </h2>
          <p className="section-sub">
            Most of what I ship is private. These are the ones I&apos;m allowed to
            talk about.
          </p>
        </Reveal>

        <Stagger className="work-grid" staggerChildren={0.09}>
          {cards.map((c, i) =>
            c.href ? (
              <motion.a
                key={i}
                variants={fadeUp}
                href={c.href}
                target="_blank"
                rel="noopener"
                className="workcard"
              >
                <CardInner c={c} />
              </motion.a>
            ) : (
              <motion.div key={i} variants={fadeUp} className="workcard">
                <CardInner c={c} />
              </motion.div>
            ),
          )}
        </Stagger>

        <Reveal as="p" className="work-footer">
          More on{" "}
          <a href="https://github.com/cmeiliu/" target="_blank" rel="noopener">
            github.com/cmeiliu
          </a>{" "}
          ↗
        </Reveal>
      </div>
    </section>
  );
}
