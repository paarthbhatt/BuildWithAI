import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import SiteShell from "@/components/SiteShell";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Agentic Premier League",
  description: "Stadium Overcrowding Advisory Dashboard",
  metadataBase: new URL("http://localhost:3000"),
  openGraph: {
    title: "Agentic Premier League",
    description: "Real-time stadium pulse dashboard for gate monitoring and crowd advisories.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${outfit.variable} antialiased bg-[#050B14] text-slate-200 font-sans min-h-screen selection:bg-blue-500/30`}>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
