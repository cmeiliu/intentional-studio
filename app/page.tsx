import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { About } from "@/components/home/About";
import { Contact } from "@/components/home/Contact";
import { Footer } from "@/components/home/Footer";
import { Hero } from "@/components/home/Hero";
import { Process } from "@/components/home/Process";
import { Services } from "@/components/home/Services";
import { Testimonials } from "@/components/home/Testimonials";
import { Topbar } from "@/components/home/Topbar";
import { Work } from "@/components/home/Work";
import {
  CONTACT_EMAIL,
  FOUNDER_NAME,
  GITHUB_URL,
  LEGAL_NAME,
  SITE_NAME,
  SITE_URL,
  absoluteUrl,
  organizationId,
  personSameAs,
  personId,
  websiteId,
} from "@/lib/seo";

const pageDescription =
  "Intentional Studio is Mei Liu's AI training and custom app studio for businesses that want practical AI adoption, internal tools, automation, agents, and websites that explain the work clearly.";

export const metadata: Metadata = {
  title: "Intentional Studio | AI Training & Custom Apps",
  description: pageDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Intentional Studio | AI Training & Custom Apps",
    description: pageDescription,
    url: "/",
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
    title: "Intentional Studio | AI Training & Custom Apps",
    description: pageDescription,
    images: [absoluteUrl("/assets/mei.jpg")],
  },
};

const homeJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": organizationId,
      name: SITE_NAME,
      legalName: LEGAL_NAME,
      url: SITE_URL,
      mainEntityOfPage: absoluteUrl("/about"),
      logo: absoluteUrl("/intentional-studio-logo.svg"),
      image: absoluteUrl("/assets/mei.jpg"),
      email: CONTACT_EMAIL,
      founder: {
        "@id": personId,
      },
      sameAs: [GITHUB_URL],
      knowsAbout: [
        "AI training",
        "Custom apps",
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
      mainEntityOfPage: absoluteUrl("/about"),
      email: CONTACT_EMAIL,
      image: absoluteUrl("/assets/mei.jpg"),
      sameAs: personSameAs,
      alumniOf: "Northwestern University",
      knowsAbout: [
        "AI training",
        "Product strategy",
        "Data",
        "Machine learning",
        "Custom software",
      ],
    },
    {
      "@type": "WebSite",
      "@id": websiteId,
      name: SITE_NAME,
      url: SITE_URL,
      inLanguage: "en-US",
      publisher: {
        "@id": organizationId,
      },
    },
    {
      "@type": "ProfessionalService",
      "@id": absoluteUrl("/#professional-service"),
      name: SITE_NAME,
      url: SITE_URL,
      image: absoluteUrl("/assets/mei.jpg"),
      founder: {
        "@id": personId,
      },
      areaServed: {
        "@type": "Country",
        name: "United States",
      },
      serviceType: [
        "AI training",
        "Custom app development",
        "Custom AI apps",
        "AI agents",
        "Internal tools",
        "Website redesign",
      ],
    },
    {
      "@type": "Service",
      "@id": absoluteUrl("/ai-training#service"),
      name: "AI training workshops and coaching",
      url: absoluteUrl("/ai-training"),
      provider: {
        "@id": organizationId,
      },
      offers: {
        "@type": "Offer",
        priceCurrency: "USD",
        price: "3500",
        url: absoluteUrl("/start"),
      },
    },
    {
      "@type": "Service",
      "@id": absoluteUrl("/custom-apps#service"),
      name: "Custom AI apps and internal tools",
      url: absoluteUrl("/custom-apps"),
      provider: {
        "@id": organizationId,
      },
      offers: {
        "@type": "Offer",
        priceCurrency: "USD",
        price: "12000",
        url: absoluteUrl("/start"),
      },
    },
  ],
};

export default function Home() {
  return (
    <>
      <JsonLd data={homeJsonLd} />
      <Topbar />
      <Hero />
      <About />
      <Services />
      <Work />
      <Process />
      <Testimonials />
      <Contact />
      <Footer />
    </>
  );
}
