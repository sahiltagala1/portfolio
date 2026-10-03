import type { Metadata } from "next";
import Link from "next/link";
import { Contact } from "@/components/Chrome";
import { notes } from "@/lib/notes";

const description = "Short engineering notes by Mohammed Sahil Tagala on evaluation, explainability and EV charging protocols.";

export const metadata: Metadata = {
  title: "Notes",
  description,
  alternates: { canonical: "/notes/" },
  openGraph: { title: "Notes", description, url: "/notes/", images: ["/og.png"] },
};

export default function Notes() {
  return (
    <>
      <main id="main">
        <header className="hero">
          <p className="eyebrow">Session log · Notes</p>
          <h1>Things I learned the slow way.</h1>
          <p className="lede">Short notes. Each one has a demo you can try.</p>
        </header>
        <ul className="note-list">
          {notes.map((n) => (
            <li key={n.slug}>
              <h2><Link href={`/notes/${n.slug}/`}>{n.title}</Link></h2>
              <p>{n.summary}</p>
            </li>
          ))}
        </ul>
      </main>
      <Contact />
    </>
  );
}
