import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { SiteHeader } from "@/components/SiteHeader";
import {
  FOUNDER_NAME,
  SITE_NAME,
  absoluteUrl,
  organizationId,
  personSameAs,
  personId,
} from "@/lib/seo";

const pageTitle = "Intentional Studio AI Guides";
const pageDescription =
  "Field guides from Intentional Studio on AI training for business teams, custom AI apps, internal tools, agents, automation, and practical AI adoption.";

const guides = [
  {
    title: "AI training for business teams guide",
    href: "/guides/ai-training-for-business-teams",
    summary:
      "How to tell if your team needs AI training, what a workshop should cover, and the point where training should become a custom app.",
    eyebrow: "Training",
  },
  {
    title: "Custom AI apps for business guide",
    href: "/guides/custom-ai-apps-for-business",
    summary:
      "When a workflow is worth building software for, what to put in the first version, and where AI agents earn their place.",
    eyebrow: "Custom apps",
  },
];

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: "/guides",
  },
  keywords: [
    "AI training guide",
    "custom AI apps guide",
    "business AI adoption",
    "AI agents for business",
    "Intentional Studio guides",
  ],
  openGraph: {
    title: `${pageTitle} | ${SITE_NAME}`,
    description: pageDescription,
    url: "/guides",
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
      "@type": "CollectionPage",
      "@id": absoluteUrl("/guides#webpage"),
      name: pageTitle,
      description: pageDescription,
      url: absoluteUrl("/guides"),
      isPartOf: {
        "@id": absoluteUrl("/#website"),
      },
      about: {
        "@id": organizationId,
      },
      breadcrumb: {
        "@id": absoluteUrl("/guides#breadcrumb"),
      },
      mainEntity: {
        "@id": absoluteUrl("/guides#item-list"),
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": absoluteUrl("/guides#breadcrumb"),
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
      ],
    },
    {
      "@type": "ItemList",
      "@id": absoluteUrl("/guides#item-list"),
      name: "Intentional Studio AI and custom app guides",
      itemListElement: guides.map((guide, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Article",
          headline: guide.title,
          description: guide.summary,
          url: absoluteUrl(guide.href),
          author: {
            "@id": personId,
          },
          publisher: {
            "@id": organizationId,
          },
        },
      })),
    },
  ],
};

export default function GuidesPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="flex flex-1 flex-col">
        <SiteHeader />
        <main className="flex-1 pt-24">
          <section className="frame py-16 md:py-24">
            <p className="eyebrow eyebrow-turquoise">
              <span className="eyebrow-line" />
              Intentional Studio guides
            </p>
            <div className="mt-5 grid gap-10 lg:grid-cols-[1fr_0.72fr]">
              <h1 className="h2 text-ink">
                Field guides for{" "}
                <span className="ital text-burgundy-deep">
                  AI training and Custom AI apps
                </span>
                .
              </h1>
              <p className="self-end text-lg leading-relaxed text-ink-2">
                Field notes on practical AI training and custom AI apps. How Intentional Studio decides where AI belongs. Train the team
                when judgment is the bottleneck. Build software when the
                workflow has outgrown doing it by hand.
              </p>
            </div>
          </section>

          <section className="section section-about">
            <div className="frame">
              <div className="grid gap-5 md:grid-cols-2">
                {guides.map((guide) => (
                  <article
                    key={guide.href}
                    className="rounded-2xl border border-ink/10 bg-cream p-6 md:p-8"
                  >
                    <p className="text-xs font-medium uppercase tracking-wide text-burgundy-deep">
                      {guide.eyebrow}
                    </p>
                    <h2 className="serif mt-3 text-3xl text-ink">
                      {guide.title}
                    </h2>
                    <p className="mt-4 text-base leading-relaxed text-ink-2">
                      {guide.summary}
                    </p>
                    <Link href={guide.href} className="btn btn-ghost mt-6">
                      Read the guide &rarr;
                    </Link>
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
                  Want this applied to your work?
                </p>
                <h2 className="contact-title">
                  Bring the workflow and I&apos;ll help you pick the right move.
                </h2>
                <p className="contact-sub">
                  Sometimes that&apos;s training. Sometimes it&apos;s a custom
                  app. Sometimes it&apos;s a small fix that gets the team
                  unstuck.
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
