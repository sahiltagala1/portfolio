import Link from "next/link";
import { caseStudies, profile, projects } from "@/lib/content";
import { notes } from "@/lib/notes";
import { ContactForm } from "./ContactForm";
import { Palette, type PaletteItem } from "./Palette";

const FORM_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID;

const paletteItems: PaletteItem[] = [
  { label: "Start", hint: "Home", href: "/" },
  { label: "Background", hint: "Experience and education", href: "/#background" },
  { label: "Work", hint: "All projects", href: "/#work" },
  ...caseStudies.map((p) => ({ label: p.title, hint: "Case study", href: `/work/${p.slug}/` })),
  ...projects.filter((p) => !p.caseStudy).map((p) => ({ label: p.title, hint: `Project · ${p.track}`, href: `/#${p.slug}` })),
  { label: "Playground", hint: "All demos", href: "/playground/" },
  { label: "Explain a flag", hint: "Demo · anomaly reasons", href: "/playground/#flag" },
  { label: "Split the data", hint: "Demo · train and test sets", href: "/playground/#split" },
  { label: "Roaming authorisation", hint: "Demo · OCPI whitelist", href: "/playground/#roaming" },
  { label: "Notes", hint: "All notes", href: "/notes/" },
  ...notes.map((n) => ({ label: n.title, hint: "Note", href: `/notes/${n.slug}/` })),
  { label: "Capabilities", hint: "What I can do", href: "/#capabilities" },
  { label: "Contact", hint: "Get in touch", href: "/#contact" },
  ...profile.links.map((l) => ({ label: l.label, hint: "Opens another site", href: l.href })),
  ...(profile.resumeUrl ? [{ label: "CV", hint: "PDF", href: profile.resumeUrl }] : []),
];

export function Header() {
  return (
    <header className="site-header">
      <Link href="/" className="site-name">{profile.name}</Link>
      <nav aria-label="Main">
        <ul>
          <li><Link href="/#background">Background</Link></li>
          <li><Link href="/#work">Work</Link></li>
          <li><Link href="/playground/">Playground</Link></li>
          <li><Link href="/notes/">Notes</Link></li>
          <li><Link href="/#contact">Contact</Link></li>
        </ul>
      </nav>
      <Palette items={paletteItems} />
    </header>
  );
}

export function Contact() {
  return (
    <footer className="contact" id="contact">
      <p className="eyebrow">Unplug · 90 min</p>
      <h2>Hiring for a graduate role in Dublin? I&apos;d like to hear about it.</h2>
      {profile.availability && <p className="lede">{profile.availability}</p>}
      <ul className="contact-links">
        {profile.email && (
          <li><a className="btn btn-solid" href={`mailto:${profile.email}`}>{profile.email}</a></li>
        )}
        {profile.resumeUrl && (
          <li><a className="btn" href={profile.resumeUrl}>Download CV (PDF)</a></li>
        )}
        {profile.links.map((l) => (
          <li key={l.href}>
            <a className="btn" href={l.href} rel="noopener noreferrer">{l.label} profile</a>
          </li>
        ))}
      </ul>
      {FORM_ID && (
        <ContactForm
          formId={FORM_ID}
          fallback={profile.email ? `You can also email ${profile.email}.` : "You can also reach me through GitHub."}
        />
      )}
      <p className="fine">{profile.location}</p>
    </footer>
  );
}
