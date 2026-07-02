"use client";

import { Reveal, Stagger, StaggerItem } from "./primitives";

type ServiceFootLink = { href: string; label: string };
type Service = {
  cls: string;
  roman: string;
  pill: string;
  name: string;
  desc: string;
  list: string[];
  foot: { pre: string; em: string; post: string; links: ServiceFootLink[] };
};

const services: Service[] = [
  {
    cls: "service service-cream",
    roman: "I.",
    pill: "AI Training",
    name: "AI training workshops & coaching",
    desc: "Practical AI training for teams just getting started, and for teams that already stalled. Hands-on, not slideware.",
    list: [
      "Half-day exec primers",
      "Engineering bootcamps (Claude Code, Cursor, agents)",
      "1:1 coaching for founders & leads",
      "Custom playbooks for your workflows",
    ],
    foot: {
      pre: "",
      em: "",
      post: "1-2 weeks",
      links: [],
    },
  },
  {
    cls: "service service-maroon",
    roman: "II.",
    pill: "Custom Apps",
    name: "Custom AI apps & agents",
    desc: "Custom AI apps and internal tools built to fit your team. Dashboards, agents, and automation that actually runs.",
    list: [
      "Claude / OpenAI-powered apps",
      "Internal dashboards & ops tools",
      "Skill packs for Claude Code, Codex, OpenClaw",
      "End-to-end automation (think Zapier, but real)",
    ],
    foot: {
      pre: "",
      em: "",
      post: "3-6 weeks",
      links: [],
    },
  },
  {
    cls: "service service-turquoise",
    roman: "III.",
    pill: "Identity",
    name: "Brand & website",
    desc: "For companies whose work has outgrown how they look online. We design and build it end to end.",
    list: [
      "Marketing & landing redesigns",
      "Framer Motion · Next.js · Tailwind",
      "Brand systems that scale",
      "Copy that doesn't sound like a robot",
    ],
    foot: { pre: "", em: "", post: "2-4 weeks", links: [] },
  },
];

export function Services() {
  return (
    <section id="services" className="section section-services">
      <div className="frame">
        <Reveal className="section-head section-head-center">
          <p className="eyebrow eyebrow-maroon">
            <span className="eyebrow-line" />
            What we do
          </p>
          <h2 className="section-title">
            Three ways we can <em>help</em>.
          </h2>
          <p className="section-sub">
            AI training often turns into custom apps, and those apps usually
            need clearer words around them. Pick whichever sounds most like your
            problem and we&apos;ll sort out the rest.
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
                {s.foot.links?.map((link) => (
                  <span key={link.href}>
                    <br />
                    <a href={link.href}>{link.label}</a>
                  </span>
                ))}
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
