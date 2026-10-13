import Link from "next/link";
import { caseStudies, profile, projects } from "@/lib/content";
import { notes } from "@/lib/notes";
import { ContactForm } from "./ContactForm";
import { CopyButton } from "./CopyButton";
import { ArrowUpRightIcon, DownloadIcon } from "./Icons";
import { Palette, type PaletteItem } from "./Palette";
import { ThemeToggle } from "./ThemeToggle";

const FORM_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID || profile.contactFormId;

const paletteItems: PaletteItem[] = [
  { label: "Start", hint: "Home", href: "/" },
  {
    label: "Background",
    hint: "Experience and education",
    href: "/#background",
  },
  { label: "Work", hint: "All projects", href: "/#work" },
  ...caseStudies.map((p) => ({
    label: p.title,
    hint: "Case study",
    href: `/work/${p.slug}/`,
  })),
  ...projects
    .filter((p) => !p.caseStudy)
    .map((p) => ({
      label: p.title,
      hint: `Project · ${p.track}`,
      href: `/#${p.slug}`,
    })),
  { label: "Playground", hint: "All demos", href: "/playground/" },
  {
    label: "Explain a flag",
    hint: "Demo · anomaly reasons",
    href: "/playground/#flag",
  },
  {
    label: "Split the data",
    hint: "Demo · train and test sets",
    href: "/playground/#split",
  },
  {
    label: "Roaming authorisation",
    hint: "Demo · OCPI whitelist",
    href: "/playground/#roaming",
  },
  { label: "Notes", hint: "All notes", href: "/notes/" },
  ...notes.map((n) => ({
    label: n.title,
    hint: "Note",
    href: `/notes/${n.slug}/`,
  })),
  { label: "Capabilities", hint: "What I can do", href: "/#capabilities" },
  { label: "Contact", hint: "Get in touch", href: "/#contact" },
  ...profile.links.map((l) => ({
    label: l.label,
    hint: "Opens another site",
    href: l.href,
  })),
  ...(profile.resumeUrl ? [{ label: "CV", hint: "PDF", href: profile.resumeUrl }] : []),
];

export function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="site-name">
          {profile.shortName}
          <span>.</span>
        </Link>
        <nav aria-label="Main">
          <ul>
            <li>
              <Link href="/#background">Background</Link>
            </li>
            <li>
              <Link href="/#work">Work</Link>
            </li>
            <li>
              <Link href="/playground/">Playground</Link>
            </li>
            <li>
              <Link href="/notes/">Notes</Link>
            </li>
            <li>
              <Link href="/#contact">Contact</Link>
            </li>
          </ul>
        </nav>
        <div className="header-tools">
          <Palette items={paletteItems} />
          <ThemeToggle />
          {profile.resumeUrl && (
            <a
              className="btn btn-solid btn-cv"
              href={profile.resumeUrl}
              aria-label="Download CV (PDF)"
            >
              <DownloadIcon />
              <span className="cv-label">
                <span className="long">Download </span>CV
              </span>
            </a>
          )}
        </div>
      </div>
    </header>
  );
}

export function Contact() {
  return (
    <footer className="contact" id="contact">
      <div className="contact-intro">
        <p className="eyebrow">Unplug · 90 min</p>
        <h2>Hiring in software engineering or data science? I&apos;d like to hear about it.</h2>
        {profile.availability && <p className="lede">{profile.availability}</p>}
        {profile.email && (
          <div className="contact-email">
            <a id="contact-email" className="email-link" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
            <CopyButton text={profile.email} label="email address" targetId="contact-email" />
          </div>
        )}
        <ul className="contact-links">
          {profile.links.map((l) => (
            <li key={l.href}>
              <a href={l.href} rel="noopener noreferrer">
                {l.label} profile
                <ArrowUpRightIcon />
              </a>
            </li>
          ))}
        </ul>
        <p className="fine">
          {profile.name} · {profile.location}
        </p>
      </div>

      {FORM_ID && (
        <div className="contact-card">
          <div className="section-head">
            <p className="eyebrow">Send a message</p>
            <h3>Tell me about the role or the project.</h3>
          </div>
          <ContactForm
            formId={FORM_ID}
            fallback={
              profile.email
                ? `You can also email ${profile.email}.`
                : "You can also reach me through LinkedIn."
            }
          />
        </div>
      )}
    </footer>
  );
}
