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

const pageTitle = "AI Training for Business Teams: Field Guide";
const pageDescription =
  "A practical guide to AI training for business teams: when training is the right move, what a workshop should cover, and how to turn AI habits into repeatable workflows.";
const pagePath = "/guides/ai-training-for-business-teams";

const essentials = [
  {
    name: "Task judgment",
    detail:
      "People need to know which work belongs in AI, which work needs human judgment, and which work should stay outside the tool.",
  },
  {
    name: "Prompt systems",
    detail:
      "Teams need reusable ways to brief the model, include context, request formats, and make expectations explicit.",
  },
  {
    name: "Review habits",
    detail:
      "Good training teaches people how to check claims, inspect sources, compare outputs, and catch confident errors before work ships.",
  },
  {
    name: "Workflow design",
    detail:
      "The real value appears when prompts, docs, approvals, handoffs, and automations become one repeatable way of working.",
  },
];

const signals = [
  "The team has ChatGPT, Claude, or Cursor seats but uses them inconsistently.",
  "Leaders want AI adoption, but no one has agreed what good use looks like.",
  "One or two people have strong AI habits that have not spread across the team.",
  "The company is considering automation before the workflow is clearly understood.",
  "People are worried about accuracy, privacy, voice, or review quality.",
];

const faqs = [
  {
    question: "What should AI training for business teams include?",
    answer:
      "AI training for business teams should include task selection, prompt systems, tool-specific workflows, output review, privacy rules, examples from the team's actual work, and a plan for what to automate later.",
  },
  {
    question: "When is AI training better than building a custom app?",
    answer:
      "AI training is better first when the team does not yet have shared judgment, review habits, or a clear repeated workflow. Custom apps make more sense after the workflow is valuable, repeated, and specific enough to deserve software.",
  },
  {
    question: "Who should attend an AI training workshop?",
    answer:
      "The best group usually includes leaders, operators, product or marketing owners, customer-facing teammates, and builders who will turn repeatable work into playbooks or internal tools.",
  },
  {
    question: "What should a team have after AI training?",
    answer:
      "A team should leave with reusable prompts, workflow examples, review standards, tool norms, and a short list of processes that may deserve automation or a custom AI app.",
  },
];

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: pagePath,
  },
  keywords: [
    "AI training for business teams",
    "AI training guide",
    "AI workshop for teams",
    "business AI adoption",
    "Claude training",
    "Cursor training",
    "AI automation training",
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
        "AI training",
        "AI adoption",
        "AI automation",
        "Product strategy",
        "Custom software",
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
        "AI training for business teams",
        "AI workshops",
        "AI adoption",
        "Workflow design",
      ],
      keywords:
        "AI training for business teams, AI workshops, business AI adoption, Claude training, Cursor training, AI automation training",
      mentions: [
        {
          "@id": absoluteUrl("/ai-training#service"),
        },
        {
          "@id": absoluteUrl("/custom-apps#service"),
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
          name: "AI Training for Business Teams",
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

export default function AiTrainingGuidePage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="flex flex-1 flex-col">
        <SiteHeader />
        <main className="flex-1 pt-24">
          <article>
            <section className="frame py-16 md:py-24">
              <p className="eyebrow eyebrow-turquoise">
                <span className="eyebrow-line" />
                AI training guide
              </p>
              <div className="mt-5 grid gap-10 lg:grid-cols-[1fr_0.72fr]">
                <h1 className="h2 text-ink">
                  AI training for business teams that need{" "}
                  <span className="ital text-burgundy-deep">
                    usable judgment
                  </span>
                  .
                </h1>
                <div className="self-end text-lg leading-relaxed text-ink-2">
                  <p>
                    AI training for business teams is worth doing when people
                    have access to powerful tools but do not yet share the same
                    habits, standards, prompts, or review process.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link href="/ai-training" className="btn btn-primary">
                      See AI training
                    </Link>
                    <Link href="/custom-apps" className="btn btn-ghost">
                      Compare custom apps &rarr;
                    </Link>
                  </div>
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
                    Start with training when the team needs judgment before
                    more software.
                  </h2>
                </div>
                <div className="space-y-5 text-base leading-relaxed text-ink-2">
                  <p>
                    The best AI training is not a tour of features. It teaches
                    people how to decide what to ask, how to include context,
                    how to check the answer, and how to move the work back into
                    the business without creating a quality problem.
                  </p>
                  <p>
                    Intentional Studio treats training as the first layer of AI
                    adoption. The goal is not to make everyone a prompt
                    hobbyist. The goal is to give the team enough shared
                    judgment to know what belongs in a prompt, what belongs in a
                    playbook, and what deserves a custom app.
                  </p>
                </div>
              </div>
            </section>

            <section className="section bg-cream">
              <div className="frame">
                <div className="section-head">
                  <p className="eyebrow eyebrow-turquoise">
                    <span className="eyebrow-line" />
                    Decision signals
                  </p>
                  <h2 className="section-title">
                    AI training is the right first move when these are true.
                  </h2>
                </div>
                <ul className="grid gap-4 md:grid-cols-2">
                  {signals.map((signal) => (
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
                  <p className="eyebrow eyebrow-maroon">
                    <span className="eyebrow-line" />
                    What to teach
                  </p>
                  <h2 className="section-title">
                    A useful workshop turns vague enthusiasm into repeatable
                    work.
                  </h2>
                  <p className="section-sub">
                    The details change by team, but the core curriculum should
                    always cover these four layers.
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {essentials.map((item) => (
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
                  <p className="eyebrow eyebrow-turquoise">
                    <span className="eyebrow-line" />
                    Training or software
                  </p>
                  <h2 className="section-title mt-5">
                    Use training to find the workflows worth building.
                  </h2>
                </div>
                <div className="space-y-5 text-base leading-relaxed text-ink-2">
                  <p>
                    A team can waste a lot of money automating a process it
                    does not understand. Training gives the team a safer way to
                    learn where AI helps, where review is needed, and where the
                    repeated work is stable enough for software.
                  </p>
                  <p>
                    Once a workflow shows up again and again, a custom AI app
                    may become the better answer: a dashboard, agent,
                    automation suite, intake tool, or internal workflow app that
                    removes manual handoffs.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link href="/custom-apps" className="btn btn-ghost">
                      Read about custom apps &rarr;
                    </Link>
                    <Link href="/answers" className="btn btn-ghost">
                      See direct answers
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
                    Plain answers about AI training for teams.
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
                  Want this for your team?
                </p>
                <h2 className="contact-title">
                  Bring the work. I&apos;ll shape the training around it.
                </h2>
                <p className="contact-sub">
                  Send the team, the tools, and the workflow that feels stuck.
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
