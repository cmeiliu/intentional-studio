import type { Metadata } from "next";
import { Geist, JetBrains_Mono, Newsreader } from "next/font/google";
import Script from "next/script";
import { PostHogProvider } from "./PostHogProvider";
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

export const metadata: Metadata = {
  title: "Intentional Studio - Mei Liu",
  description:
    "An AI practice run by Mei Liu. Teaching, custom software, and website redesigns for businesses that want to actually use AI.",
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='16' fill='%236e1f2c'/%3E%3Cpath d='M16 0a16 16 0 0 1 0 32z' fill='%238fd6bc'/%3E%3C/svg%3E",
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
        <div className="aurora" aria-hidden="true">
          <div className="orb o1" />
          <div className="orb o2" />
          <div className="orb o3" />
          <div className="orb o4" />
          <div className="orb o5" />
          <div className="orb o6" />
        </div>
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
