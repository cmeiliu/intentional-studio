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
    desc: "A recorded scoping call becomes requirements, tickets, and a working app. The custom tool no SaaS vendor sells, built mostly by agents and finished by hand.",
    stack: ["Next.js 16", "React 19", "Anthropic SDK", "Neon"],
    arrow: "Visit pebbled.ai ↗",
  },
  {
    href: "https://github.com/cmeiliu/binance-us-skills",
    tag: "Software · AI",
    tagCls: "workcard-tag tag-turquoise",
    year: "2026",
    title: "Binance.US Skill Suite",
    desc: "Five installable skills for OpenClaw, Codex, and Claude Code that walk a crypto exchange's users from first look to funded account. Daily briefings, single-asset research, funding, spot-trade review, and account status.",
    stack: ["Python", "Claude Code", "Agents"],
    arrow: "View on GitHub ↗",
  },
  {
    tag: "Software · Hospitality",
    tagCls: "workcard-tag tag-cream",
    year: "2026",
    title: "Lip Smacking Foodie Tours",
    desc: "Restaurant-outreach automation for one of Las Vegas's longest-running food-tour operators: reads the Rezdy manifest, uses Claude to parse dietary notes and celebrations, and renders per-restaurant email digests with an in-app approval UI.",
    stack: ["Python", "Claude", "Rezdy", "Gmail API"],
    arrow: "Private repo",
  },
  {
    tag: "Software · Events",
    tagCls: "workcard-tag tag-turquoise",
    year: "2026",
    title: "Camp Spin Off",
    desc: "A reserve-a-spot flow for a youth camp. Intent forms, instant email confirmations, and a PayPal deposit that locks in the registration on the spot. Families book at midnight and the team wakes up to confirmed spots.",
    stack: ["Next.js", "EmailJS", "PayPal"],
    arrow: "Private repo",
  },
  {
    tag: "Software · Home services",
    tagCls: "workcard-tag tag-maroon",
    year: "2026",
    title: "Northside Exteriors",
    desc: "A photo-to-quote tool for a home-services company. Describe the quote you send a hundred times a week once, then let it draft each new one from a photo. Quotes go out before lunch instead of after hours.",
    stack: ["Next.js", "Claude", "Vision"],
    arrow: "Private repo",
  },
  {
    tag: "Product · Platform",
    tagCls: "workcard-tag tag-turquoise",
    year: "2026",
    title: "Step Inside My World",
    desc: "An interactive portfolio platform, think LinkedIn but more customizable. Candidates show off real AI skills across different roles, and recruiters find the right people faster.",
    stack: ["Next.js", "TypeScript", "Vercel"],
    arrow: "Private repo",
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
            What we&apos;ve shipped
          </p>
          <h2 className="section-title">
            Selected <em>work</em>.
          </h2>
          <p className="section-sub">
            Recent work across AI, custom software, and brand.
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
