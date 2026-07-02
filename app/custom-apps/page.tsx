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
  personSameAs,
  personId,
} from "@/lib/seo";

const pageTitle = "Custom AI Apps and Internal Tools";
const pageDescription =
  "Intentional Studio builds custom AI apps, internal tools, agents, dashboards, and automation systems for business workflows that off-the-shelf software cannot fit.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: "/custom-apps",
  },
  keywords: [
    "custom apps",
    "custom AI apps",
    "custom software",
    "AI agents",
    "internal tools",
    "business automation",
    "Intentional Studio custom apps",
  ],
  openGraph: {
    title: `${pageTitle} | ${SITE_NAME}`,
    description: pageDescription,
    url: "/custom-apps",
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

const builds = [
  {
    name: "Internal dashboards",
    detail:
      "One place for the metrics, decisions, and operational questions your team currently hunts across spreadsheets and shallow reports.",
  },
  {
    name: "AI agents and assistants",
    detail:
      "Claude and OpenAI-powered systems that research, summarize, draft, route, classify, or prepare work with human review built in.",
  },
  {
    name: "Automation suites",
    detail:
      "Connected workflows across forms, CRMs, calendars, inboxes, databases, and APIs when simple Zapier chains stop being enough.",
  },
  {
    name: "Custom workflow apps",
    detail:
      "Small, focused products for the exact process your team runs: intake, triage, booking, hiring, reporting, or customer operations.",
  },
];

const faqs = [
  {
    question: "What custom apps does Intentional Studio build?",
    answer:
      "Intentional Studio builds custom AI apps, internal dashboards, agents, automation suites, and workflow tools for business operations that do not fit standard software.",
  },
  {
    question: "When should a company build a custom app?",
    answer:
      "A custom app is worth considering when the workflow is repeated, valuable, specific to the business, and painful enough that spreadsheets, manual handoffs, or generic SaaS tools are slowing the team down.",
  },
  {
    question: "How long does a custom app project take?",
    answer:
      "Most first versions run in short 3-6 week cycles, with something usable at the end and documentation so the team can understand how the system works.",
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
      founder: {
        "@id": personId,
      },
    },
    {
      "@type": "WebPage",
      "@id": absoluteUrl("/custom-apps#webpage"),
      name: pageTitle,
      description: pageDescription,
      url: absoluteUrl("/custom-apps"),
      isPartOf: {
        "@id": absoluteUrl("/#website"),
      },
      about: {
        "@id": absoluteUrl("/custom-apps#service"),
      },
      breadcrumb: {
        "@id": absoluteUrl("/custom-apps#breadcrumb"),
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": absoluteUrl("/custom-apps#breadcrumb"),
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
          name: "Custom Apps",
          item: absoluteUrl("/custom-apps"),
        },
      ],
    },
    {
      "@type": "Service",
      "@id": absoluteUrl("/custom-apps#service"),
      name: "Custom AI apps and internal tools",
      description: pageDescription,
      url: absoluteUrl("/custom-apps"),
      serviceType: [
        "Custom app development",
        "Custom AI apps",
        "AI agents",
        "Internal tools",
        "Business automation",
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
        "Custom apps",
        "AI agents",
        "Internal tools",
        "Business automation",
        "Product strategy",
      ],
    },
    {
      "@type": "FAQPage",
      "@id": absoluteUrl("/custom-apps#faq"),
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

export default function CustomAppsPage() {
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
                Custom apps by Intentional Studio
              </p>
              <h1 className="h2 mt-5 text-ink">
                Custom AI apps for workflows{" "}
                <span className="ital text-burgundy-deep">
                  off-the-shelf software misses
                </span>
                .
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-relaxed text-ink-2">
                I build the small, specific systems teams keep trying to fake
                with spreadsheets, forms, and manual handoffs: dashboards,
                agents, automation suites, and internal tools that fit the way
                the business actually moves.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/start" className="btn btn-primary">
                  Scope a custom app
                </Link>
                <Link href="/ai-training" className="btn btn-ghost">
                  See AI training &rarr;
                </Link>
              </div>
            </div>
            <div className="grid content-center gap-3">
              {[
                ["8", "custom apps shipped"],
                ["3-6", "weeks for many first versions"],
                ["100%", "built by hand, with the tools"],
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
                <p className="eyebrow eyebrow-turquoise">
                  <span className="eyebrow-line" />
                  What I build
                </p>
                <h2 className="section-title">
                  Useful software for the work that keeps escaping the system.
                </h2>
                <p className="section-sub">
                  Custom app projects start with the bottleneck, not the tech
                  stack. The first version should make one valuable workflow
                  easier to run, measure, or hand off.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {builds.map((build) => (
                  <article
                    key={build.name}
                    className="rounded-2xl border border-ink/10 bg-cream p-6"
                  >
                    <h3 className="serif text-2xl text-ink">{build.name}</h3>
                    <p className="mt-3 leading-relaxed text-ink-2">
                      {build.detail}
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
                  How projects work
                </p>
                <h2 className="section-title mt-5">
                  Short cycles, visible progress, no lock-in.
                </h2>
              </div>
              <div className="space-y-5 text-base leading-relaxed text-ink-2">
                <p>
                  The work starts by watching the workflow and naming the first
                  useful version. From there, I build in short cycles so the
                  team sees working software early and can correct the shape
                  before the system gets heavy.
                </p>
                <p>
                  You get clean code, practical docs, and a product that fits
                  the process. If the better answer is training, a prompt
                  library, or a simpler automation, I will say that before we
                  build the larger thing.
                </p>
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
                  Build a custom app when the workflow is too specific for SaaS.
                </h2>
              </div>
              <div className="space-y-5 text-base leading-relaxed text-ink-2">
                <p>
                  A custom AI app is worth building when a team repeats the same
                  valuable workflow, the work depends on business-specific data
                  or judgment, and generic software forces too many manual
                  handoffs.
                </p>
                <p>
                  Intentional Studio builds focused first versions: internal
                  dashboards, AI agents, automation suites, intake tools,
                  research workflows, and operations apps that make one
                  important process easier to run.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/guides/custom-ai-apps-for-business"
                    className="btn btn-ghost"
                  >
                    Read the custom AI apps guide &rarr;
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
                  Plain answers for teams considering custom software.
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
                  Have a workflow worth building?
                </p>
                <h2 className="contact-title">
                  Tell me what the team is trying to make easier.
                </h2>
                <p className="contact-sub">
                  Send the website, the bottleneck, and the rough timeline.
                  I&apos;ll help pick the first version worth building.
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
