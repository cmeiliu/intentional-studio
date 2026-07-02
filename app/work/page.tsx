import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { SiteHeader } from "@/components/SiteHeader";
import {
  FOUNDER_NAME,
  SITE_NAME,
  absoluteUrl,
  organizationId,
  organizationSameAs,
  personSameAs,
  personId,
} from "@/lib/seo";

const pageTitle = "Intentional Studio Work and Proof";
const pageDescription =
  "Selected Intentional Studio work by Mei Liu: AI-native briefing tools, custom internal apps, operations dashboards, automation systems, and website redesigns.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: "/work",
  },
  keywords: [
    "Intentional Studio work",
    "Intentional Studio case studies",
    "custom AI apps examples",
    "AI training work",
    "internal tools portfolio",
    "Mei Liu projects",
  ],
  openGraph: {
    title: `${pageTitle} | ${SITE_NAME}`,
    description: pageDescription,
    url: "/work",
    type: "website",
    images: [
      {
        url: "/assets/mei.jpg",
        alt: `${FOUNDER_NAME}, founder of ${SITE_NAME}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${pageTitle} | ${SITE_NAME}`,
    description: pageDescription,
    images: [absoluteUrl("/assets/mei.jpg")],
  },
};

const projects = [
  {
    name: "Binance.US Skill Suite",
    year: "2026",
    type: "AI workflow tooling",
    href: "https://github.com/cmeiliu/binance-us-skills",
    summary:
      "A skill family for OpenClaw, Codex, and Claude Code that gives a crypto exchange research team an AI-native briefing workflow.",
    outcome:
      "Turned recurring research and briefing work into a reusable agentic toolkit with production-grade Claude tooling.",
    stack: ["Python", "Claude Code", "Agents", "OpenClaw"],
    keywords: ["AI agents", "research workflow", "Claude Code", "custom AI tooling"],
  },
  {
    name: "LipSmacking Foodie Tours",
    year: "2026",
    type: "Custom operations apps",
    summary:
      "Three connected apps for a Las Vegas food tour operator: a bookings dashboard, guide operations console, and email automation engine pulling from Rezdy.",
    outcome:
      "Moved operational work out of disconnected manual systems and into focused tools built around the way the team runs tours.",
    stack: ["Python", "React", "Rezdy API", "Automation"],
    keywords: ["custom apps", "internal tools", "operations dashboard", "automation"],
  },
  {
    name: "Hiring Insight Manager",
    year: "2025",
    type: "Custom internal tool",
    href: "https://github.com/cmeiliu/hiring-insight-manager",
    summary:
      "A hiring intelligence dashboard that replaces spreadsheet reviews and shallow ATS reports with answers hiring managers can use.",
    outcome:
      "Gave recruiting and hiring teams a clearer way to inspect pipeline quality, bottlenecks, and the questions behind hiring decisions.",
    stack: ["TypeScript", "React", "Dashboard"],
    keywords: ["custom dashboard", "internal tool", "hiring analytics", "business intelligence"],
  },
  {
    name: "YourNegotiations.com",
    year: "2026",
    type: "Website redesign",
    href: "https://github.com/cmeiliu/yournegotiations-redesign",
    summary:
      "A full UI and copy rebuild for a negotiation training company whose website needed to match the quality of the teaching.",
    outcome:
      "Rebuilt the public face with clearer positioning, a sharper visual system, and a modern Next.js implementation.",
    stack: ["TypeScript", "Next.js", "Framer Motion", "Copy"],
    keywords: ["website redesign", "training company", "Next.js", "positioning"],
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": organizationId,
      name: SITE_NAME,
      url: absoluteUrl("/"),
      logo: absoluteUrl("/intentional-studio-logo.svg"),
      sameAs: organizationSameAs,
      founder: {
        "@id": personId,
      },
    },
    {
      "@type": "Person",
      "@id": personId,
      name: FOUNDER_NAME,
      url: absoluteUrl("/about"),
      image: absoluteUrl("/assets/mei.jpg"),
      sameAs: personSameAs,
    },
    {
      "@type": "WebPage",
      "@id": absoluteUrl("/work#webpage"),
      name: pageTitle,
      description: pageDescription,
      url: absoluteUrl("/work"),
      isPartOf: {
        "@id": absoluteUrl("/#website"),
      },
      about: {
        "@id": organizationId,
      },
    },
    {
      "@type": "ItemList",
      "@id": absoluteUrl("/work#selected-work"),
      name: "Selected Intentional Studio work",
      itemListElement: projects.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "CreativeWork",
          name: project.name,
          description: project.summary,
          creator: {
            "@id": personId,
          },
          url: project.href ?? absoluteUrl("/work"),
          dateCreated: project.year,
          keywords: project.keywords.join(", "),
        },
      })),
    },
  ],
};

export default function WorkPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="flex flex-1 flex-col">
        <SiteHeader />
        <main className="flex-1 pt-24">
          <section className="frame py-16 md:py-24">
            <p className="eyebrow eyebrow-turquoise">
              <span className="eyebrow-line" />
              Work by Intentional Studio
            </p>
            <div className="mt-5 grid gap-10 lg:grid-cols-[1fr_0.72fr]">
              <div>
                <h1 className="h2 text-ink">
                  Proof that the studio ships{" "}
                  <span className="ital text-burgundy-deep">
                    practical AI and custom software
                  </span>
                  .
                </h1>
              </div>
              <div className="self-end text-lg leading-relaxed text-ink-2">
                <p>
                  Most client work is private. These examples show the pattern:
                  find the workflow, make the system concrete, and leave behind
                  software or training the team can actually use.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/custom-apps" className="btn btn-primary">
                    See custom apps
                  </Link>
                  <Link href="/ai-training" className="btn btn-ghost">
                    See AI training &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section className="section section-about">
            <div className="frame">
              <div className="section-head">
                <p className="eyebrow eyebrow-maroon">
                  <span className="eyebrow-line" />
                  Selected proof
                </p>
                <h2 className="section-title">
                  AI tooling, internal apps, operations systems, and websites.
                </h2>
              </div>

              <div className="grid gap-5">
                {projects.map((project) => (
                  <article
                    key={project.name}
                    className="rounded-2xl border border-ink/10 bg-cream p-6 md:p-8"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-3">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-burgundy-deep">
                          {project.type} / {project.year}
                        </p>
                        <h3 className="serif mt-2 text-3xl text-ink">
                          {project.name}
                        </h3>
                      </div>
                      {project.href ? (
                        <a
                          href={project.href}
                          target="_blank"
                          rel="noopener"
                          className="workcard-arrow"
                        >
                          View source &rarr;
                        </a>
                      ) : (
                        <span className="workcard-arrow">Private work</span>
                      )}
                    </div>
                    <div className="mt-6 grid gap-6 md:grid-cols-2">
                      <p className="leading-relaxed text-ink-2">
                        {project.summary}
                      </p>
                      <p className="leading-relaxed text-ink-2">
                        {project.outcome}
                      </p>
                    </div>
                    <div className="workcard-stack mt-6 mb-0">
                      {project.stack.map((item) => (
                        <span key={item}>{item}</span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="section bg-cream">
            <div className="frame grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
              <div>
                <p className="eyebrow eyebrow-turquoise">
                  <span className="eyebrow-line" />
                  What the examples have in common
                </p>
                <h2 className="section-title mt-5">
                  The work starts small and earns complexity.
                </h2>
              </div>
              <div className="space-y-5 text-base leading-relaxed text-ink-2">
                <p>
                  Intentional Studio is not trying to replace a full product
                  team. The sweet spot is the important workflow no one owns:
                  the dashboard, agent, automation, training system, or website
                  that would make a team faster if it finally existed.
                </p>
                <p>
                  The same pattern applies to AI training and custom apps. We
                  start with the real work, build or teach around that work, and
                  hand back something the team can maintain.
                </p>
              </div>
            </div>
          </section>

          <section className="section section-contact">
            <div className="frame">
              <div className="contact">
                <p className="eyebrow eyebrow-cream">
                  <span className="eyebrow-line" />
                  Have similar work?
                </p>
                <h2 className="contact-title">
                  Bring the messy workflow. We will find the first useful build.
                </h2>
                <p className="contact-sub">
                  Send the context, the bottleneck, and the rough timeline.
                  I will help turn it into a clear next step.
                </p>
                <Link href="/start" className="btn btn-primary">
                  Scope the first build
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
