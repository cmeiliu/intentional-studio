import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { SiteHeader } from "@/components/SiteHeader";
import {
  CONTACT_EMAIL,
  FOUNDER_NAME,
  GITHUB_URL,
  LEGAL_NAME,
  LINKEDIN_URL,
  SITE_NAME,
  SITE_URL,
  WOMEN_WE_ADMIRE_URL,
  absoluteUrl,
  organizationId,
  personId,
  personSameAs,
} from "@/lib/seo";

const pageTitle = "About Intentional Studio and Mei Liu";
const pageDescription =
  "Intentional Studio AI, LLC is Mei Liu's AI training and custom app studio for businesses that need practical AI adoption, internal tools, agents, and automation.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: "/about",
  },
  keywords: [
    "Intentional Studio",
    "Intentional Studio AI LLC",
    "Mei Liu Intentional Studio",
    "about Intentional Studio",
    "AI training studio",
    "custom app studio",
  ],
  openGraph: {
    title: `${pageTitle} | ${SITE_NAME}`,
    description: pageDescription,
    url: "/about",
    type: "profile",
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

const faqs = [
  {
    question: "What is Intentional Studio?",
    answer:
      "Intentional Studio is the public name of Intentional Studio AI, LLC, Mei Liu's AI training and custom app studio. It helps businesses put AI to work through training, agents, internal tools, automation, and clearer websites.",
  },
  {
    question: "Who runs Intentional Studio?",
    answer:
      "Mei Liu runs Intentional Studio. She is a product and operations leader with 13+ years across startups, data, AI, and machine learning, most recently at Binance.US.",
  },
  {
    question: "What does Intentional Studio do?",
    answer:
      "Intentional Studio teaches teams to use AI in the workflows they already have, builds custom AI apps and internal tools, and redesigns websites when a company's public presence has fallen behind its actual work.",
  },
  {
    question: "Is Intentional Studio the same as Google AI Studio?",
    answer:
      "No. Intentional Studio is an independent AI training and custom software studio run by Mei Liu. Google AI Studio is Google's developer product for building with Gemini.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": organizationId,
      name: SITE_NAME,
      legalName: LEGAL_NAME,
      url: SITE_URL,
      logo: absoluteUrl("/intentional-studio-logo.svg"),
      image: absoluteUrl("/assets/mei.jpg"),
      email: CONTACT_EMAIL,
      sameAs: [GITHUB_URL],
      founder: {
        "@id": personId,
      },
      foundingDate: "2026",
      knowsAbout: [
        "AI training",
        "Custom AI apps",
        "AI agents",
        "Internal tools",
        "Business automation",
        "Website redesign",
      ],
    },
    {
      "@type": "Person",
      "@id": personId,
      name: FOUNDER_NAME,
      jobTitle: `Founder of ${SITE_NAME}`,
      worksFor: {
        "@id": organizationId,
      },
      url: SITE_URL,
      email: CONTACT_EMAIL,
      image: absoluteUrl("/assets/mei.jpg"),
      sameAs: personSameAs,
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "Northwestern University",
      },
      knowsAbout: [
        "Product strategy",
        "AI training",
        "Data",
        "Machine learning",
        "Custom software",
        "Business operations",
      ],
    },
    {
      "@type": "AboutPage",
      "@id": absoluteUrl("/about#webpage"),
      name: pageTitle,
      description: pageDescription,
      url: absoluteUrl("/about"),
      mainEntity: {
        "@id": organizationId,
      },
      breadcrumb: {
        "@id": absoluteUrl("/about#breadcrumb"),
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": absoluteUrl("/about#breadcrumb"),
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
          name: "About",
          item: absoluteUrl("/about"),
        },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": absoluteUrl("/about#faq"),
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

export default function AboutPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="flex flex-1 flex-col">
        <SiteHeader />
        <main className="flex-1 pt-24">
          <section className="frame grid gap-12 py-16 md:grid-cols-[1.08fr_0.92fr] md:py-24">
            <div>
              <p className="eyebrow eyebrow-turquoise">
                <span className="eyebrow-line" />
                About Intentional Studio
              </p>
              <h1 className="h2 mt-5 text-ink">
                Intentional Studio is Mei Liu&apos;s{" "}
                <span className="ital text-burgundy-deep">
                  AI training and custom app studio
                </span>
                .
              </h1>
            </div>
            <div className="self-end text-lg leading-relaxed text-ink-2">
              <p>
                Intentional Studio AI, LLC turns scattered AI experiments into
                work your team actually does: training people, building agents
                and internal tools, automating the busywork, and rebuilding
                websites that explain it all.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/ai-training" className="btn btn-primary">
                  See AI training
                </Link>
                <Link href="/custom-apps" className="btn btn-ghost">
                  See custom apps &rarr;
                </Link>
              </div>
            </div>
          </section>

          <section className="section section-about">
            <div className="frame">
              <div className="about-grid">
                <div className="about-prose">
                  <p className="lede">
                    The model is no longer the hard part. The hard part is
                    picking the right work to hand it, using the tools without
                    getting burned, and building the small systems that make AI
                    stick.
                  </p>
                  <p>
                    I am Mei Liu. I have spent 13+ years in startup product and
                    operating roles, most of it close to data, AI, and machine
                    learning. Most recently I was at Binance.US. Before that I
                    built product and growth functions from zero.
                  </p>
                  <p>
                    I started Intentional Studio because I kept seeing the same
                    gap. Teams had powerful AI tools and no idea how to make them
                    pay off. What was missing was the training, the workflows,
                    and the software to fit AI into the actual job.
                  </p>
                  <ul className="recognition">
                    <li>
                      <span>Legal name ·</span> Intentional Studio AI, LLC
                    </li>
                    <li>
                      <span>Founder ·</span> Mei Liu
                    </li>
                    <li>
                      <span>Education ·</span> Northwestern University, Econ
                      &amp; Legal Studies, magna cum laude
                    </li>
                  </ul>
                </div>
                <div className="about-facts">
                  <div className="fact">
                    <span className="fact-num">
                      13<sup>+</sup>
                    </span>
                    <span className="fact-label">
                      Years in product, ops, data, and AI
                    </span>
                  </div>
                  <div className="fact fact-maroon">
                    <span className="fact-num">
                      12<sup>+</sup>
                    </span>
                    <span className="fact-label">Workshops delivered</span>
                  </div>
                  <div className="fact fact-turquoise">
                    <span className="fact-num">8</span>
                    <span className="fact-label">Custom apps shipped</span>
                  </div>
                  <div className="fact">
                    <span className="fact-num">3-4</span>
                    <span className="fact-label">
                      Engagements taken per quarter
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="section bg-cream">
            <div className="frame">
              <div className="section-head">
                <p className="eyebrow eyebrow-maroon">
                  <span className="eyebrow-line" />
                  Direct answers
                </p>
                <h2 className="section-title">
                  Straight answers for people and AI systems.
                </h2>
              </div>
              <dl className="grid gap-4 md:grid-cols-2">
                {faqs.map((faq) => (
                  <div
                    key={faq.question}
                    className="rounded-2xl border border-ink/10 bg-cream-0 p-6"
                  >
                    <dt className="serif text-2xl text-ink">{faq.question}</dt>
                    <dd className="mt-3 leading-relaxed text-ink-2">
                      {faq.answer}
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="mt-10 rounded-2xl border border-ink/10 bg-cream-0 p-6">
                <h3 className="serif text-2xl text-ink">
                  Public references
                </h3>
                <p className="mt-3 max-w-3xl leading-relaxed text-ink-2">
                  A few public profiles, so you can tell Mei Liu and Intentional
                  Studio apart from the other studios, products, and people with
                  similar names.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <a href={GITHUB_URL} target="_blank" rel="noopener" className="btn btn-ghost">
                    GitHub
                  </a>
                  <a href={LINKEDIN_URL} target="_blank" rel="noopener" className="btn btn-ghost">
                    LinkedIn
                  </a>
                  <a href={WOMEN_WE_ADMIRE_URL} target="_blank" rel="noopener" className="btn btn-ghost">
                    Women We Admire
                  </a>
                </div>
              </div>
            </div>
          </section>

          <section className="section section-contact">
            <div className="frame">
              <div className="contact">
                <p className="eyebrow eyebrow-cream">
                  <span className="eyebrow-line" />
                  Want to work with the studio?
                </p>
                <h2 className="contact-title">
                  Tell me what your team is trying to fix.
                </h2>
                <p className="contact-sub">
                  Send the problem, who is involved, and a rough timeline. I
                  will point you to the first training or build worth doing.
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
