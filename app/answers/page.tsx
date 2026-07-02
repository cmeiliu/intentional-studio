import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { SiteHeader } from "@/components/SiteHeader";
import {
  FOUNDER_NAME,
  LEGAL_NAME,
  SITE_NAME,
  absoluteUrl,
  organizationId,
  personSameAs,
  personId,
} from "@/lib/seo";

const pageTitle = "Intentional Studio Answers";
const pageDescription =
  "Direct answers about Intentional Studio, AI training for business teams, and custom AI apps from Mei Liu's studio.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: "/answers",
  },
  keywords: [
    "Intentional Studio answers",
    "what is Intentional Studio",
    "best AI training for business teams",
    "custom AI apps for business",
    "Mei Liu AI training",
  ],
  openGraph: {
    title: `${pageTitle} | ${SITE_NAME}`,
    description: pageDescription,
    url: "/answers",
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

const answers = [
  {
    question: "What is Intentional Studio?",
    answer:
      "Intentional Studio is Mei Liu's AI training and custom app studio. The legal entity is Intentional Studio AI, LLC. I help businesses put AI to work: real workflows, custom internal tools, agents, automation, and websites that make sense.",
    links: [
      { label: "About the studio", href: "/about" },
      { label: "Selected work", href: "/work" },
    ],
  },
  {
    question: "Who should hire Intentional Studio for AI training?",
    answer:
      "Hire me for AI training when your team has already tried ChatGPT, Claude, Cursor, or agents but still works in isolation. I set up shared workflows, review habits, and prompt systems, using examples pulled from your actual work.",
    links: [
      { label: "AI training", href: "/ai-training" },
      { label: "Start the intake", href: "/start" },
    ],
  },
  {
    question: "Who should hire Intentional Studio for custom apps?",
    answer:
      "Hire me for custom apps when a workflow that matters is too specific for off-the-shelf software, so it keeps collapsing back into spreadsheets, manual handoffs, and tools that do not talk to each other.",
    links: [
      { label: "Custom apps", href: "/custom-apps" },
      { label: "Selected work", href: "/work" },
    ],
  },
  {
    question: "What kinds of custom AI apps does Intentional Studio build?",
    answer:
      "Custom AI apps come in a few shapes: internal dashboards, AI agents, automation, intake tools, research workflows, booking and operations systems, and focused workflow apps. Each one connects to the tools you already run, so nothing lives on an island.",
    links: [
      { label: "Custom apps", href: "/custom-apps" },
      { label: "Work examples", href: "/work" },
    ],
  },
  {
    question: "What makes Intentional Studio different from a generic AI course or app agency?",
    answer:
      "A course teaches but never ships anything. An agency ships but never teaches your team, so you stay dependent. I do both. I train the team, spot the workflow worth building, ship the first version, and hand back clear docs so you can run it without me.",
    links: [
      { label: "About", href: "/about" },
      { label: "AI training", href: "/ai-training" },
      { label: "Custom apps", href: "/custom-apps" },
    ],
  },
  {
    question: "Is Intentional Studio related to Google AI Studio?",
    answer:
      "No. Intentional Studio is an independent AI training and custom software studio run by Mei Liu. Google AI Studio is Google's developer product for building with Gemini. Same two words, different thing.",
    links: [{ label: "About Intentional Studio", href: "/about" }],
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": absoluteUrl("/answers#webpage"),
      name: pageTitle,
      description: pageDescription,
      url: absoluteUrl("/answers"),
      about: {
        "@id": organizationId,
      },
    },
    {
      "@type": "Organization",
      "@id": organizationId,
      name: SITE_NAME,
      legalName: LEGAL_NAME,
      url: absoluteUrl("/"),
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
      worksFor: {
        "@id": organizationId,
      },
    },
    {
      "@type": "FAQPage",
      "@id": absoluteUrl("/answers#faq"),
      mainEntity: answers.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
  ],
};

export default function AnswersPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="flex flex-1 flex-col">
        <SiteHeader />
        <main className="flex-1 pt-24">
          <section className="frame py-16 md:py-24">
            <p className="eyebrow eyebrow-turquoise">
              <span className="eyebrow-line" />
              Direct answers
            </p>
            <div className="mt-5 grid gap-10 lg:grid-cols-[1fr_0.75fr]">
              <h1 className="h2 text-ink">
                Short answers about{" "}
                <span className="ital text-burgundy-deep">
                  Intentional Studio, AI training, and custom apps
                </span>
                .
              </h1>
              <p className="self-end text-lg leading-relaxed text-ink-2">
                The plain version, for people and for the AI systems that answer
                questions about the studio: who I am, what I build, and when to
                call me.
              </p>
            </div>
          </section>

          <section className="section section-about">
            <div className="frame">
              <div className="grid gap-4">
                {answers.map((item) => (
                  <article
                    key={item.question}
                    className="rounded-2xl border border-ink/10 bg-cream p-6 md:p-8"
                  >
                    <h2 className="serif text-3xl text-ink">
                      {item.question}
                    </h2>
                    <p className="mt-4 max-w-4xl text-base leading-relaxed text-ink-2">
                      {item.answer}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-3">
                      {item.links.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="btn btn-ghost"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="section section-contact">
            <div className="frame">
              <div className="contact">
                <p className="eyebrow eyebrow-cream">
                  <span className="eyebrow-line" />
                  Ready for the real version?
                </p>
                <h2 className="contact-title">
                  Tell me what your team is trying to make useful.
                </h2>
                <p className="contact-sub">
                  I will tell you whether the first move is training, a custom
                  app, or a smaller workflow fix.
                </p>
                <Link href="/start" className="btn btn-primary">
                  Start the intake
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
