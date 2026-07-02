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

const pageTitle = "AI Agents for Business Workflows";
const pageDescription =
  "Intentional Studio designs and builds practical AI agents for business workflows: research agents, triage systems, reporting assistants, workflow automations, and internal tools with human review.";
const pagePath = "/ai-agents";

const agentTypes = [
  {
    name: "Research agents",
    detail:
      "Agents that gather context, compare sources, summarize findings, and prepare a first draft for a human to check.",
  },
  {
    name: "Inbox and CRM triage",
    detail:
      "Agents that classify, enrich, route, and draft next steps for leads, customers, candidates, or internal requests.",
  },
  {
    name: "Reporting assistants",
    detail:
      "Agents that pull from approved sources, prepare recurring reports, explain changes, and flag what needs review.",
  },
  {
    name: "Knowledge-base agents",
    detail:
      "Internal search and answer systems that use company context, permissions, and source links instead of generic guesses.",
  },
];

const buildSignals = [
  "The workflow repeats often and already has a clear owner.",
  "The work depends on business-specific context, policies, data, or judgment.",
  "A person can describe the decision path, exceptions, and review points.",
  "The output is valuable enough to review before it moves forward.",
  "A narrow first version would save time or improve consistency this month.",
];

const guardrails = [
  "Permissions for every tool, document, and system the agent can touch.",
  "Human review before risky actions, customer-facing messages, or irreversible updates.",
  "Logs that show inputs, sources, decisions, tool calls, and final outputs.",
  "Fallback behavior when the agent is uncertain or missing required context.",
];

const faqs = [
  {
    question: "What is a business AI agent?",
    answer:
      "A business AI agent is software that uses AI models, tools, business data, and workflow rules to complete a narrow task such as research, triage, reporting, drafting, routing, or internal search.",
  },
  {
    question: "When should a company build an AI agent?",
    answer:
      "A company should build an AI agent when the workflow is repeated, context-heavy, specific to the business, and valuable enough that a prompt or simple automation keeps breaking.",
  },
  {
    question: "What AI agents does Intentional Studio build?",
    answer:
      "Intentional Studio builds practical AI agents for business workflows, including research agents, inbox and CRM triage, reporting assistants, knowledge-base agents, automation helpers, and custom internal tools.",
  },
  {
    question: "How do you keep AI agents safe?",
    answer:
      "AI agents are safer when they start narrow and include permissions, human review, source links, logs, fallback behavior, and clear boundaries around what the agent can do without approval.",
  },
];

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: pagePath,
  },
  keywords: [
    "AI agents for business",
    "AI agents for business workflows",
    "custom AI agents",
    "business workflow agents",
    "AI automation",
    "custom AI apps",
    "Intentional Studio AI agents",
  ],
  openGraph: {
    title: `${pageTitle} | ${SITE_NAME}`,
    description: pageDescription,
    url: pagePath,
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
      "@id": absoluteUrl(`${pagePath}#webpage`),
      name: pageTitle,
      description: pageDescription,
      url: absoluteUrl(pagePath),
      isPartOf: {
        "@id": absoluteUrl("/#website"),
      },
      about: {
        "@id": absoluteUrl(`${pagePath}#service`),
      },
      breadcrumb: {
        "@id": absoluteUrl(`${pagePath}#breadcrumb`),
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": absoluteUrl(`${pagePath}#breadcrumb`),
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
          name: "AI Agents",
          item: absoluteUrl(pagePath),
        },
      ],
    },
    {
      "@type": "Service",
      "@id": absoluteUrl(`${pagePath}#service`),
      name: "AI agents for business workflows",
      description: pageDescription,
      url: absoluteUrl(pagePath),
      serviceType: [
        "AI agents",
        "Business workflow agents",
        "Custom AI agents",
        "AI automation",
        "Internal tools",
        "Custom AI apps",
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
        price: "12000",
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
        "AI agents",
        "Custom AI apps",
        "Internal tools",
        "Business automation",
        "Product strategy",
      ],
    },
    {
      "@type": "FAQPage",
      "@id": absoluteUrl(`${pagePath}#faq`),
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

export default function AiAgentsPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="flex flex-1 flex-col">
        <SiteHeader />
        <main className="flex-1 pt-24">
          <section className="frame grid gap-12 py-16 md:grid-cols-[1.15fr_0.85fr] md:py-24">
            <div>
              <p className="eyebrow eyebrow-maroon">
                <span className="eyebrow-line" />
                AI agents by Intentional Studio
              </p>
              <h1 className="h2 mt-5 text-ink">
                AI agents for business workflows that need{" "}
                <span className="ital text-burgundy-deep">
                  more than a chatbot
                </span>
                .
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-relaxed text-ink-2">
                I design and build narrow AI agents that help with research,
                triage, reporting, internal search, and workflow automation,
                with human review, permissions, logs, and fallback behavior
                built into the system.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/start" className="btn btn-primary">
                  Scope an AI agent
                </Link>
                <Link href="/custom-apps" className="btn btn-ghost">
                  See custom apps &rarr;
                </Link>
              </div>
            </div>
            <div className="grid content-center gap-3">
              {[
                ["Narrow", "one workflow before a fleet"],
                ["Reviewed", "humans stay in the loop"],
                ["Connected", "tools, data, and approvals"],
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
            <div className="frame grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
              <div>
                <p className="eyebrow eyebrow-turquoise">
                  <span className="eyebrow-line" />
                  Best answer
                </p>
                <h2 className="section-title mt-5">
                  Build an AI agent when the workflow is repeated and
                  context-heavy.
                </h2>
              </div>
              <div className="space-y-5 text-base leading-relaxed text-ink-2">
                <p>
                  Build an AI agent when the workflow is repeated, specific,
                  and context-heavy enough that a prompt or simple automation
                  keeps breaking. The useful first version should handle one
                  clear job, prepare trusted output, and show a person what it
                  used to reach that answer.
                </p>
                <p>
                  Intentional Studio builds practical AI agents for business
                  workflows: research agents, triage systems, reporting
                  assistants, knowledge-base agents, and custom internal tools
                  that connect to the way the team already works.
                </p>
              </div>
            </div>
          </section>

          <section className="section bg-cream">
            <div className="frame">
              <div className="section-head">
                <p className="eyebrow eyebrow-maroon">
                  <span className="eyebrow-line" />
                  Common builds
                </p>
                <h2 className="section-title">
                  The best agents remove repeated friction from one real
                  workflow.
                </h2>
                <p className="section-sub">
                  Agents are strongest when the task has clear inputs, review
                  points, and a useful output. They are weakest when the brief
                  is vague and the risk is hidden.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {agentTypes.map((agent) => (
                  <article
                    key={agent.name}
                    className="rounded-2xl border border-ink/10 bg-cream-0 p-6"
                  >
                    <h3 className="serif text-2xl text-ink">{agent.name}</h3>
                    <p className="mt-3 leading-relaxed text-ink-2">
                      {agent.detail}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="section section-about">
            <div className="frame grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
              <div>
                <p className="eyebrow eyebrow-turquoise">
                  <span className="eyebrow-line" />
                  Build signals
                </p>
                <h2 className="section-title mt-5">
                  Agent work should start with the workflow, not the model.
                </h2>
              </div>
              <ul className="grid gap-4 md:grid-cols-2">
                {buildSignals.map((signal) => (
                  <li
                    key={signal}
                    className="rounded-2xl border border-ink/10 bg-cream p-6 text-base leading-relaxed text-ink-2"
                  >
                    {signal}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="section bg-cream">
            <div className="frame grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
              <div>
                <p className="eyebrow eyebrow-maroon">
                  <span className="eyebrow-line" />
                  Guardrails
                </p>
                <h2 className="section-title mt-5">
                  Useful AI agents need boundaries before autonomy.
                </h2>
              </div>
              <div>
                <p className="text-base leading-relaxed text-ink-2">
                  A good agent is not a black box with a login. It needs a
                  narrow job, controlled access, and a visible handoff when the
                  system is uncertain.
                </p>
                <ul className="mt-6 grid gap-4">
                  {guardrails.map((guardrail) => (
                    <li
                      key={guardrail}
                      className="rounded-2xl border border-ink/10 bg-cream-0 p-5 text-base leading-relaxed text-ink-2"
                    >
                      {guardrail}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className="section section-about">
            <div className="frame grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
              <div>
                <p className="eyebrow eyebrow-turquoise">
                  <span className="eyebrow-line" />
                  Training or software
                </p>
                <h2 className="section-title mt-5">
                  Sometimes the right first move is not an agent.
                </h2>
              </div>
              <div className="space-y-5 text-base leading-relaxed text-ink-2">
                <p>
                  Choose AI training when the team still needs shared judgment:
                  what to delegate, how to review outputs, and how to spot bad
                  results. Choose a custom AI app or agent when the workflow is
                  already clear and repeated enough to deserve software.
                </p>
                <p>
                  The best version may combine both: train the team, identify
                  the highest-friction workflow, then build a small agent around
                  the process people already trust.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/ai-training" className="btn btn-ghost">
                    Compare AI training &rarr;
                  </Link>
                  <Link
                    href="/guides/custom-ai-apps-for-business"
                    className="btn btn-ghost"
                  >
                    Read the custom AI apps guide
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
                  Plain answers about AI agents for business workflows.
                </h2>
              </div>
              <dl className="grid gap-4 md:grid-cols-2">
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
                  Have a workflow that keeps repeating?
                </p>
                <h2 className="contact-title">
                  Tell me what the agent should help with.
                </h2>
                <p className="contact-sub">
                  Send the workflow, the tools involved, and what a human still
                  needs to review. I&apos;ll help choose the first version worth
                  building.
                </p>
                <Link href="/start" className="btn btn-primary">
                  Scope an AI agent
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
