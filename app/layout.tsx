import type { Metadata } from "next";
import { Geist, JetBrains_Mono, Newsreader } from "next/font/google";
import Script from "next/script";
import { PostHogProvider } from "./PostHogProvider";
import { Aurora } from "@/components/home/Aurora";
import {
  FOUNDER_NAME,
  SITE_NAME,
  SITE_URL,
  absoluteUrl,
} from "@/lib/seo";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const siteDescription =
  "Intentional Studio is Mei Liu's AI training and custom app studio for businesses that want practical AI adoption, internal tools, automation, agents, and websites that explain the work clearly.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: `${SITE_NAME} | AI Training & Custom Apps by ${FOUNDER_NAME}`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    siteDescription,
  keywords: [
    "Intentional Studio",
    "Mei Liu",
    "AI training",
    "AI training for businesses",
    "custom apps",
    "custom AI apps",
    "AI agents",
    "business automation",
    "internal tools",
  ],
  authors: [{ name: FOUNDER_NAME, url: SITE_URL }],
  creator: FOUNDER_NAME,
  publisher: SITE_NAME,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${SITE_NAME} | AI Training & Custom Apps by ${FOUNDER_NAME}`,
    description: siteDescription,
    url: "/",
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/assets/mei.jpg",
        alt: `${FOUNDER_NAME}, founder of ${SITE_NAME}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | AI Training & Custom Apps`,
    description: siteDescription,
    images: [absoluteUrl("/assets/mei.jpg")],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/intentional-studio-logo.svg",
    shortcut: "/intentional-studio-logo.svg",
    apple: "/intentional-studio-logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const instantlyPid = process.env.NEXT_PUBLIC_INSTANTLY_PID;
  return (
    <html
      lang="en"
      className={`${geist.variable} ${newsreader.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <Aurora />
        <div className="grain" aria-hidden="true" />
        <PostHogProvider>
          <div className="app-stage flex min-h-[100dvh] flex-col">
            {children}
          </div>
        </PostHogProvider>
        {instantlyPid ? (
          <Script
            id="instantly-pixel"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'pid':i});var f=d.getElementsByTagName(s)[0],j=d.createElement(s);j.async=true;j.src='https://leadsy.ai/pixel.js';f.parentNode.insertBefore(j,f);})(window,document,'script','leadsy','${instantlyPid}');`,
            }}
          />
        ) : null}
      </body>
    </html>
  );
}
