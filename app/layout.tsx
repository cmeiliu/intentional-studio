import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Intentional Studio - Mei Liu",
  description:
    "An AI practice run by Mei Liu. Teaching, custom software, and website redesigns for businesses that want to actually use AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
