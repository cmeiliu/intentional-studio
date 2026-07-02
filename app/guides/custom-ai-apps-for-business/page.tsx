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

const pageTitle = "Custom AI Apps for Business: Field Guide";
const pageDescription =
  "A practical guide to custom AI apps for business: when to build, what the first version should include, and how internal tools, agents, and automation should fit real workflows.";
const pagePath = "/guides/custom-ai-apps-for-business";

const appTypes = [
  {
    name: "Internal dashboards",
    detail:
      "Dashboards that answer operational questions instead of only displaying charts people still have to interpret by hand.",
  },
  {
    name: "AI assistants and agents",
    detail:
      "Systems that research, classify, draft, summarize, route, or prepare work with review points built into the workflow.",
  },
  {
    name: "Automation suites",
    detail:
      "Connected processes across forms, CRMs, inboxes, calendars, spreadsheets, databases, and APIs.",
  },
  {
    name: "Workflow apps",
    detail:
      "Focused tools for intake, triage, booking, reporting, hiring, customer operations, research, or approval flows.",
  },
];

const buildSignals = [
  "The workflow is repeated often enough that manual handoffs are now a real cost.",
  "The work depends on business-specific data, judgment, permissions, or approvals.",
  "Generic software captures part of the process but leaves the team stitching the rest together.",
  "The process is valuable enough that speed, quality, or consistency would change the business.",
  "A trained human can describe the workflow clearly enough to design the first version.",
];

const faqs = [
  {
    question: "What is a custom AI app for business?",
    answer:
      "A custom AI app is software built around a company's specific workflow, often combining AI models, business data, human review, dashboards, agents, and automation into one usable system.",
  },
  {
    question: "When should a business build a custom AI app?",
    answer:
      "A business should build a custom AI app when a repeated, valuable workflow is too specific for standard SaaS and keeps falling back into spreadsheets, manual handoffs, or disconnected tools.",
  },
  {
    question: "What should the first version include?",
    answer:
      "The first version should focus on one valuable workflow, the data needed to run it, the human review points, the outputs the team trusts, and enough documentation to maintain the system.",
  },
  {
    question: "How do custom AI apps reduce risk?",
    answer:
      "They reduce risk when the workflow includes clear permissions, review states, logs, fallback behavior, and a narrow first version instead of trying to automate every edge case at once.",
  },
];

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: pagePath,
  },
  keywords: [
    "custom AI apps for business",
    "custom AI apps guide",
    "AI agents for business",
    "internal tools",
    "business automation",
    "custom software for workflows",
  ],
  openGraph: {
    title: `${pageTitle} | ${SITE_NAME}`,
    description: pageDescription,
    url: pagePath,
    type: "article",
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
      sameAs: organizationSameAs,
      founder: {
        "@id": personId,
      },
    },
    {
      "@type": "Person",
      "@id": personId,
      name: FOUNDER_NAME,
      jobTitle: `Founder of ${SITE_NAME}`,
      url: absoluteUrl("/about"),
      email: CONTACT_EMAIL,
      image: absoluteUrl("/assets/mei.jpg"),
      sameAs: personSameAs,
      knowsAbout: [
        "Custom AI apps",
        "AI agents",
        "Internal tools",
        "Business automation",
        "Product strategy",
      ],
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
      breadcrumb: {
        "@id": absoluteUrl(`${pagePath}#breadcrumb`),
      },
      mainEntity: {
        "@id": absoluteUrl(`${pagePath}#article`),
      },
    },
    {
      "@type": "Article",
      "@id": absoluteUrl(`${pagePath}#article`),
      headline: pageTitle,
      description: pageDescription,
      url: absoluteUrl(pagePath),
      datePublished: "2026-07-02",
      dateModified: "2026-07-02",
      inLanguage: "en-US",
      isAccessibleForFree: true,
      author: {
        "@id": personId,
      },
      publisher: {
        "@id": organizationId,
      },
      image: absoluteUrl("/assets/mei.jpg"),
      mainEntityOfPage: {
        "@id": absoluteUrl(`${pagePath}#webpage`),
      },
      about: [
        "Custom AI apps",
        "Internal tools",
        "AI agents",
        "Business automation",
      ],
      keywords:
        "custom AI apps for business, custom software, AI agents, internal tools, business automation, workflow apps",
      mentions: [
        {
          "@id": absoluteUrl("/custom-apps#service"),
        },
        {
          "@id": absoluteUrl("/ai-training#service"),
        },
      ],
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
          name: "Guides",
          item: absoluteUrl("/guides"),
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Custom AI Apps for Business",
          item: absoluteUrl(pagePath),
        },
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

export default function CustomAiAppsGuidePage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="flex flex-1 flex-col">
        <SiteHeader />
        <main className="flex-1 pt-24">
          <article>
            <section className="frame py-16 md:py-24">
              <p className="eyebrow eyebrow-maroon">
                <span className="eyebrow-line" />
                Custom AI apps guide
              </p>
              <div className="mt-5 grid gap-10 lg:grid-cols-[1fr_0.72fr]">
                <h1 className="h2 text-ink">
                  Custom AI apps for business workflows{" "}
                  <span className="ital text-burgundy-deep">
                    standard tools cannot hold
                  </span>
                  .
                </h1>
                <div className="self-end text-lg leading-relaxed text-ink-2">
                  <p>
                    Custom AI apps are worth building when a workflow is
                    repeated, valuable, business-specific, and too important to
                    keep patching together with spreadsheets and generic tools.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link href="/custom-apps" className="btn btn-primary">
                      See custom apps
                    </Link>
                    <Link href="/ai-training" className="btn btn-ghost">
                      Compare AI training &rarr;
                    </Link>
                  </div>
                </div>
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
                    Build custom software when the workflow has become part of
                    the business.
                  </h2>
                </div>
                <div className="space-y-5 text-base leading-relaxed text-ink-2">
                  <p>
                    A custom AI app should not start with the model. It should
                    start with the repeated work: who starts it, what data is
                    needed, where judgment enters, what output the team trusts,
                    and what happens when the system is uncertain.
                  </p>
                  <p>
                    Intentional Studio builds narrow first versions for these
                    workflows: internal dashboards, agents, automation suites,
                    intake tools, research systems, and operations apps that fit
                    how the team already works.
                  </p>
                </div>
              </div>
            </section>

            <section className="section bg-cream">
              <div className="frame">
                <div className="section-head">
                  <p className="eyebrow eyebrow-maroon">
                    <span className="eyebrow-line" />
                    Build signals
                  </p>
                  <h2 className="section-title">
                    A custom AI app is the right move when these are true.
                  </h2>
                </div>
                <ul className="grid gap-4 md:grid-cols-2">
                  {buildSignals.map((signal) => (
                    <li
                      key={signal}
                      className="rounded-2xl border border-ink/10 bg-cream-0 p-6 text-base leading-relaxed text-ink-2"
                    >
                      {signal}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section className="section section-about">
              <div className="frame">
                <div className="section-head">
                  <p className="eyebrow eyebrow-turquoise">
                    <span className="eyebrow-line" />
                    Common builds
                  </p>
                  <h2 className="section-title">
                    Good custom apps make one important workflow easier to run.
                  </h2>
                  <p className="section-sub">
                    The software can use AI heavily or lightly. The standard is
                    whether it makes the business process clearer, faster, and
                    easier to review.
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {appTypes.map((item) => (
                    <article
                      key={item.name}
                      className="rounded-2xl border border-ink/10 bg-cream p-6"
                    >
                      <h3 className="serif text-2xl text-ink">{item.name}</h3>
                      <p className="mt-3 leading-relaxed text-ink-2">
                        {item.detail}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            <section className="section bg-cream">
              <div className="frame grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
                <div>
                  <p className="eyebrow eyebrow-maroon">
                    <span className="eyebrow-line" />
                    First version
                  </p>
                  <h2 className="section-title mt-5">
                    The first version should be smaller than the dream.
                  </h2>
                </div>
                <div className="space-y-5 text-base leading-relaxed text-ink-2">
                  <p>
                    A useful first version names the workflow boundary, the
                    inputs, the review moments, and the output that would make
                    the work easier this month. It does not need to solve every
                    edge case to be valuable.
                  </p>
                  <p>
                    If the team cannot describe the workflow yet, start with AI
                    training or a working session. If the workflow is clear and
                    painful, build the smallest system that removes the repeated
                    drag.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link href="/ai-training" className="btn btn-ghost">
                      Read about AI training &rarr;
                    </Link>
                    <Link href="/work" className="btn btn-ghost">
                      See selected work
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
                    Plain answers about custom AI apps for business.
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
          </article>

          <section className="section section-contact">
            <div className="frame">
              <div className="contact">
                <p className="eyebrow eyebrow-cream">
                  <span className="eyebrow-line" />
                  Have a workflow worth building?
                </p>
                <h2 className="contact-title">
                  Tell me where the current system breaks.
                </h2>
                <p className="contact-sub">
                  I&apos;ll help decide whether the first move is a custom app,
                  training, or a smaller workflow fix.
                </p>
                <Link href="/start" className="btn btn-primary">
                  Scope a custom app
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
