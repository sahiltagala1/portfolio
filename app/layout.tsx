import type { Metadata, Viewport } from "next";
import "@fontsource-variable/bricolage-grotesque/wght.css";
import "@fontsource/ibm-plex-sans/latin-400.css";
import "@fontsource/ibm-plex-sans/latin-500.css";
import "@fontsource/ibm-plex-sans/latin-600.css";
import "@fontsource/ibm-plex-mono/latin-400.css";
import "@fontsource/ibm-plex-mono/latin-500.css";
import "./globals.css";
import { Header } from "@/components/Chrome";
import { profile } from "@/lib/content";
import { IS_PRODUCTION_URL, SITE_URL } from "@/lib/site";

const description =
  "Sahil Tagala is a software engineer and data science graduate in Dublin. Two years of EV charging software at Numocity, an MSc in Data Science at TU Dublin, and a dissertation on explainable anomaly detection.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${profile.name}, software engineer and data scientist`, template: `%s · ${profile.name}` },
  description,
  alternates: { canonical: "/" },
  robots: IS_PRODUCTION_URL ? { index: true, follow: true } : { index: false, follow: false },
  openGraph: {
    type: "website",
    siteName: profile.name,
    title: `${profile.name}, software engineer and data scientist`,
    description,
    url: "/",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "A charging power trace with one flagged reading, beside the name Sahil Tagala" }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#EDF2F2" },
    { media: "(prefers-color-scheme: dark)", color: "#0C1719" },
  ],
};

const person = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  alternateName: "Mohammed Sahil Tagala",
  jobTitle: "Software Engineer",
  email: profile.email,
  url: SITE_URL,
  address: { "@type": "PostalAddress", addressLocality: "Dublin", addressCountry: "IE" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "Technological University Dublin" },
  sameAs: profile.links.map((l) => l.href),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IE">
      <body>
        <a className="skip" href="#main">Skip to content</a>
        <noscript><style>{".palette-open{display:none}"}</style></noscript>
        <div className="wrap">
          <Header />
          {children}
        </div>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }} />
      </body>
    </html>
  );
}
