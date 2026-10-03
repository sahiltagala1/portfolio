import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Contact } from "@/components/Chrome";
import { notes } from "@/lib/notes";

export const dynamicParams = false;

export function generateStaticParams() {
  return notes.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata(props: PageProps<"/notes/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const note = notes.find((n) => n.slug === slug);
  if (!note) return {};
  return {
    title: note.title,
    description: note.summary,
    alternates: { canonical: `/notes/${note.slug}/` },
    openGraph: { type: "article", title: note.title, description: note.summary, url: `/notes/${note.slug}/`, images: ["/og.png"] },
  };
}

export default async function NotePage(props: PageProps<"/notes/[slug]">) {
  const { slug } = await props.params;
  const index = notes.findIndex((n) => n.slug === slug);
  if (index === -1) notFound();
  const note = notes[index];
  const next = notes[(index + 1) % notes.length];

  return (
    <>
      <main id="main" className="case">
        <article className="note">
          <header className="case-head">
            <p className="eyebrow"><Link href="/notes/">Notes</Link>{note.date ? ` · ${note.date}` : ""}</p>
            <h1>{note.title}</h1>
            <p className="lede">{note.summary}</p>
          </header>
          <div className="note-body">
            {note.body.map((p) => <p key={p}>{p}</p>)}
          </div>
          <p><Link className="btn btn-solid" href={note.demo.href}>{note.demo.label}</Link></p>
        </article>
        <p className="case-next">
          <span className="eyebrow">Next note</span>
          <Link className="more" href={`/notes/${next.slug}/`}>{next.title}</Link>
        </p>
      </main>
      <Contact />
    </>
  );
}
