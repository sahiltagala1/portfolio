import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <main id="main" className="hero">
      <p className="eyebrow">404 · No reading at this address</p>
      <h1>This page isn&apos;t part of the session.</h1>
      <p className="lede">The link may be old, or the address may have a typo.</p>
      <ul className="actions">
        <li><Link className="btn btn-solid" href="/">Go to the start</Link></li>
        <li><Link className="btn" href="/#work">See my work</Link></li>
      </ul>
    </main>
  );
}
