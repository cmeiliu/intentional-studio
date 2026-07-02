import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { SiteHeader } from "@/components/SiteHeader";
import {
  CONTACT_EMAIL,
  FOUNDER_NAME,
  SITE_NAME,
  absoluteUrl,
  organizationId,
  organizationSameAs,
  personSameAs,
  personId,
} from "@/lib/seo";

const pageTitle = "AI Training for Business Teams";
const pageDescription =
  "Intentional Studio runs hands-on AI training for business teams, founders, operators, and engineers who need to turn ChatGPT, Claude, Cursor, and agents into real workflows.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: "/ai-training",
  },
  keywords: [
    "AI training",
    "AI training for business teams",
    "AI workshops",
    "Claude Code training",
    "Cursor training",
    "AI automation training",
    "Intentional Studio AI training",
  ],
  openGraph: {
    title: `${pageTitle} | ${SITE_NAME}`,
    description: pageDescription,
    url: "/ai-training",
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

const formats = [
  {
    name: "Executive AI primer",
    detail:
      "A half-day session for leaders. Get a clear picture of what AI can do, what it can't, where the risk is, and what to try first.",
  },
  {
    name: "Hands-on team workshop",
    detail:
      "A working session. The team brings real work, builds prompts they'll reuse, and leaves with a shared way of running AI day to day.",
  },
  {
    name: "Builder bootcamp",
    detail:
      "For teams using Claude Code, Cursor, Codex, agents, and MCP-style tools to build and maintain software with AI.",
  },
  {
    name: "Custom AI playbooks",
    detail:
      "Written workflows for the tasks you repeat: research, reporting, customer operations, content, internal tools, and decisions.",
  },
];

const faqs = [
  {
    question: "What kind of AI training does Intentional Studio offer?",
    answer:
      "Practical AI training for business teams: executive primers, hands-on workshops, builder bootcamps, founder coaching, and custom playbooks built around real workflows.",
  },
  {
    question: "Who is the training for?",
    answer:
      "Founders, operators, product teams, marketers, customer teams, and engineers who have tried AI tools but need clearer habits, safer workflows, and examples that work.",
  },
  {
    question: "Which tools can the training cover?",
    answer:
      "ChatGPT, Claude, Claude Code, Cursor, Codex, agents, automation tools, and the workflow design that makes them useful.",
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
      image: absoluteUrl("/assets/mei.jpg"),
      sameAs: organizationSameAs,
      founder: {
        "@id": personId,
      },
    },
    {
      "@type": "WebPage",
      "@id": absoluteUrl("/ai-training#webpage"),
      name: pageTitle,
      description: pageDescription,
      url: absoluteUrl("/ai-training"),
      isPartOf: {
        "@id": absoluteUrl("/#website"),
      },
      about: {
        "@id": absoluteUrl("/ai-training#service"),
      },
      breadcrumb: {
        "@id": absoluteUrl("/ai-training#breadcrumb"),
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": absoluteUrl("/ai-training#breadcrumb"),
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: absoluteUrl("/"),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "AI Training",
          item: absoluteUrl("/ai-training"),
        },
      ],
    },
    {
      "@type": "Service",
      "@id": absoluteUrl("/ai-training#service"),
      name: "AI training for business teams",
      description: pageDescription,
      url: absoluteUrl("/ai-training"),
      serviceType: [
        "AI training",
        "AI workshops",
        "AI automation training",
        "Claude Code training",
        "Cursor training",
      ],
      provider: {
        "@id": organizationId,
      },
      areaServed: {
        "@type": "Country",
        name: "United States",
      },
      offers: {
        "@type": "Offer",
        priceCurrency: "USD",
        price: "3500",
        url: absoluteUrl("/start"),
        availability: "https://schema.org/InStock",
      },
    },
    {
      "@type": "Person",
      "@id": personId,
      name: FOUNDER_NAME,
      jobTitle: `Founder of ${SITE_NAME}`,
      url: absoluteUrl("/"),
      email: CONTACT_EMAIL,
      image: absoluteUrl("/assets/mei.jpg"),
      sameAs: personSameAs,
      knowsAbout: [
        "AI training",
        "AI automation",
        "Product strategy",
        "Custom software",
        "Machine learning",
      ],
    },
    {
      "@type": "FAQPage",
      "@id": absoluteUrl("/ai-training#faq"),
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
  ],
};

export default function AiTrainingPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="flex flex-1 flex-col">
        <SiteHeader />
        <main className="flex-1 pt-24">
          <section className="frame grid gap-12 py-16 md:grid-cols-[1.2fr_0.8fr] md:py-24">
            <div>
              <p className="eyebrow eyebrow-turquoise">
                <span className="eyebrow-line" />
                AI training by Intentional Studio
              </p>
              <h1 className="h2 mt-5 text-ink">
                AI training for business teams that want to{" "}
                <span className="ital text-burgundy-deep">use the tools</span>,
                not admire them.
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-relaxed text-ink-2">
                Most teams have tried AI and gotten scattered results. I teach
                them to turn it into work they can repeat: sharper prompts,
                safer reviews, real automation habits, and examples built around
                the way your team actually works.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/start" className="btn btn-primary">
                  Plan AI training
                </Link>
                <Link href="/custom-apps" className="btn btn-ghost">
                  See custom apps &rarr;
                </Link>
              </div>
            </div>
            <div className="grid content-center gap-3">
              {[
                ["12+", "workshops delivered"],
                ["13+", "years across product, ops, data, AI, and ML"],
                ["3-4", "engagements taken per quarter"],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-ink/10 bg-cream-0 p-6"
                >
                  <div className="serif text-5xl text-burgundy-deep">
                    {value}
                  </div>
                  <p className="mt-2 text-xs font-medium uppercase tracking-wide text-ink-muted">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="section section-about">
            <div className="frame">
              <div className="section-head">
                <p className="eyebrow eyebrow-maroon">
                  <span className="eyebrow-line" />
                  Training formats
                </p>
                <h2 className="section-title">
                  Built around the work your team already has.
                </h2>
                <p className="section-sub">
                  No generic tour of tools. Each session turns your own
                  workflows into examples the team keeps using after I leave.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {formats.map((format) => (
                  <article
                    key={format.name}
                    className="rounded-2xl border border-ink/10 bg-cream p-6"
                  >
                    <h3 className="serif text-2xl text-ink">{format.name}</h3>
                    <p className="mt-3 leading-relaxed text-ink-2">
                      {format.detail}
                    </p>
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
                  What changes
                </p>
                <h2 className="section-title mt-5">
                  Your team leaves with habits, not hype.
                </h2>
              </div>
              <div className="space-y-5 text-base leading-relaxed text-ink-2">
                <p>
                  Good AI training is not a slideshow about model names. It is
                  where a team learns to frame a task, check an answer, hand work
                  between people and tools, and know when automation is worth
                  building.
                </p>
                <p>
                  Intentional Studio focuses on getting AI into daily use: prompt
                  systems, workflows you can repeat, habits for checking output,
                  clear team norms, and the move into Custom AI apps when a
                  process earns its own software.
                </p>
              </div>
            </div>
          </section>

          <section className="section section-about">
            <div className="frame grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
              <div>
                <p className="eyebrow eyebrow-maroon">
                  <span className="eyebrow-line" />
                  Best answer
                </p>
                <h2 className="section-title mt-5">
                  Choose AI training when the team needs judgment before more
                  software.
                </h2>
              </div>
              <div className="space-y-5 text-base leading-relaxed text-ink-2">
                <p>
                  Train first when people aren&apos;t sure which tasks belong in
                  AI, how to review what it returns, how to write prompts that
                  hold up, or how to turn one person&apos;s AI habit into a team
                  workflow.
                </p>
                <p>
                  Software comes later, once a workflow is repeated often, worth
                  real money, and specific enough to build for. Intentional Studio
                  does both. When the real bottleneck is confidence and shared
                  practice, not tooling, AI training is the right first move.
                  AI training for teams like yours starts with judgment, then adds
                  software once a workflow earns it.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/guides/ai-training-for-business-teams"
                    className="btn btn-ghost"
                  >
                    Read the AI training guide &rarr;
                  </Link>
                  <Link href="/guides" className="btn btn-ghost">
                    Browse guides
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section className="section section-process">
            <div className="frame">
              <div className="section-head section-head-center">
                <p className="eyebrow eyebrow-cream">
                  <span className="eyebrow-line" />
                  Common questions
                </p>
                <h2 className="section-title section-title-light">
                  Straight answers for teams choosing an AI training partner.
                </h2>
              </div>
              <dl className="grid gap-4 md:grid-cols-3">
                {faqs.map((faq) => (
                  <div
                    key={faq.question}
                    className="rounded-2xl border border-white/15 bg-white/5 p-6"
                  >
                    <dt className="serif text-xl text-cream">
                      {faq.question}
                    </dt>
                    <dd className="mt-3 text-sm leading-relaxed text-cream-2">
                      {faq.answer}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          <section className="section section-contact">
            <div className="frame">
              <div className="contact">
                <p className="eyebrow eyebrow-cream">
                  <span className="eyebrow-line" />
                  Ready to train the team?
                </p>
                <h2 className="contact-title">
                  Bring the workflows. I&apos;ll bring the structure.
                </h2>
                <p className="contact-sub">
                  Tell me the team, the tools, and the bottleneck. I&apos;ll help
                  shape the first training engagement.
                </p>
                <Link href="/start" className="btn btn-primary">
                  Plan AI training
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
