"use client";

import { Reveal, Stagger, StaggerItem } from "./primitives";

const services = [
  {
    cls: "service service-cream",
    roman: "I.",
    pill: "Teaching",
    name: "Workshops & coaching",
    desc: "For teams just starting with AI, and for teams that have already stalled. We run hands-on, not slideware.",
    list: [
      "Half-day exec primers",
      "Engineering bootcamps (Claude Code, Cursor, agents)",
      "1:1 coaching for founders & leads",
      "Custom playbooks for your workflows",
    ],
    foot: { pre: "From ", em: "$3,500", post: " · 1–2 weeks" },
  },
  {
    cls: "service service-maroon",
    roman: "II.",
    pill: "Software",
    name: "Custom apps & agents",
    desc: "The tool no vendor sells you, because it only fits your team. Built to the shape of how you actually work — internal dashboards, AI agents, automation suites.",
    list: [
      "Claude / OpenAI-powered apps",
      "Internal dashboards & ops tools",
      "Skill packs for Claude Code, Codex, OpenClaw",
      "End-to-end automation (think Zapier, but real)",
    ],
    foot: { pre: "From ", em: "$12,000", post: " · 3–6 weeks" },
  },
  {
    cls: "service service-turquoise",
    roman: "III.",
    pill: "Identity",
    name: "Brand & website",
    desc: "For companies whose work has outgrown their public face. Designed and engineered by the same person — me — start to finish.",
    list: [
      "Marketing & landing redesigns",
      "Framer Motion · Next.js · Tailwind",
      "Brand systems that scale",
      "Copy that doesn't sound like a robot",
    ],
    foot: { pre: "From ", em: "$8,000", post: " · 2–4 weeks" },
  },
];

export function Services() {
  return (
    <section id="services" className="section section-services">
      <div className="frame">
        <Reveal className="section-head section-head-center">
          <p className="eyebrow eyebrow-maroon">
            <span className="eyebrow-line" />
            What I work on
          </p>
          <h2 className="section-title">
            Three rooms, <em>one studio</em>.
          </h2>
          <p className="section-sub">
            Most engagements pull from more than one. Pick the door that sounds
            most like your problem — we&apos;ll figure out the rest together.
          </p>
        </Reveal>

        <Stagger className="services" staggerChildren={0.1}>
          {services.map((s) => (
            <StaggerItem key={s.name} as="article" className={s.cls}>
              <div className="service-top">
                <span className="service-roman">{s.roman}</span>
                <span className="service-pill">{s.pill}</span>
              </div>
              <h3 className="service-name">{s.name}</h3>
              <p className="service-desc">{s.desc}</p>
              <ul className="service-list">
                {s.list.map((li) => (
                  <li key={li}>{li}</li>
                ))}
              </ul>
              <div className="service-foot">
                {s.foot.pre}
                <em>{s.foot.em}</em>
                {s.foot.post}
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
