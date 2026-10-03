import Link from "next/link";
import { Contact } from "@/components/Chrome";
import { SessionStrip } from "@/components/SessionStrip";
import { FlagExplainer } from "@/components/FlagExplainer";
import { notes } from "@/lib/notes";
import { capabilities, experience, featured, profile, projects } from "@/lib/content";

export default function Home() {
  const others = projects.filter((p) => p.slug !== featured.slug);
  const results = featured.caseStudy?.results ?? [];

  return (
    <>
      <main id="main">
        <section className="hero" aria-labelledby="hero-title">
          <p className="eyebrow">Plug in · {profile.name} · {profile.location}</p>
          <h1 id="hero-title">{profile.positioning}</h1>
          <p className="lede">{profile.summary}</p>
          {profile.availability && <p className="lede lede-strong">{profile.availability}</p>}
          <ul className="actions">
            <li><Link className="btn btn-solid" href="/#flag">Explain a flag</Link></li>
            <li><Link className="btn" href={`/work/${featured.slug}/`}>Read the dissertation case study</Link></li>
          </ul>
          <SessionStrip />
        </section>

        <section id="background" aria-labelledby="background-title">
          <div className="section-head">
            <p className="eyebrow">Ramp · 0 to 8 min</p>
            <h2 id="background-title">Background</h2>
            <p className="lede">
              I worked on charging infrastructure before I studied it. The dissertation came out of knowing what
              that data looks like from the inside.
            </p>
          </div>
          <ol className="timeline">
            {experience.map((e) => (
              <li key={e.title}>
                <h3>{e.title}</h3>
                <p className="meta">{e.meta}</p>
                <ul>
                  {e.points.map((pt) => <li key={pt}>{pt}</li>)}
                </ul>
              </li>
            ))}
          </ol>
        </section>

        <section id="work" aria-labelledby="work-title">
          <div className="section-head">
            <p className="eyebrow">Steady state · 8 to 62 min</p>
            <h2 id="work-title">Work</h2>
          </div>

          <article className="feature">
            <div className="feature-text">
              <p className="eyebrow">{featured.context} · {featured.track}</p>
              <h3>{featured.title}</h3>
              <p>{featured.summary}</p>
              <p>
                The hard part was the evaluation. The mix of garages in the data shifted over time, so I split by
                time within each garage to get results I could trust.
              </p>
              <Tags items={featured.technologies} />
              <p><Link className="more" href={`/work/${featured.slug}/`}>Read the case study</Link></p>
            </div>
            <dl className="results">
              {results.map((r) => (
                <div key={r.label}>
                  <dt>{r.label}</dt>
                  <dd>{r.value}</dd>
                </div>
              ))}
            </dl>
          </article>

          <ul className="projects">
            {others.map((p) => (
              <li key={p.slug} id={p.slug}>
                <p className="eyebrow">{[p.track, p.context].filter(Boolean).join(" · ")}</p>
                <h3>{p.title}</h3>
                <p>{p.summary}</p>
                <Tags items={p.technologies} />
                {p.sourceUrl && (
                  <p><a className="more" href={p.sourceUrl} rel="noopener noreferrer">View source for {p.title} on GitHub</a></p>
                )}
                {p.liveUrl && (
                  <p><a className="more" href={p.liveUrl} rel="noopener noreferrer">View {p.title} live</a></p>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section id="flag" aria-labelledby="flag-title">
          <div className="section-head">
            <p className="eyebrow">Minute 52 · Flag</p>
            <h2 id="flag-title">A flag is only useful if it says why.</h2>
            <p className="lede">
              That idea is my dissertation. Here is a small version of it you can try: one charging session, four
              readings, and the reasons behind each verdict.
            </p>
          </div>
          <FlagExplainer />
          <p>
            <Link className="more" href="/playground/">Two more demos in the playground: splitting data, and roaming authorisation</Link>
          </p>
        </section>

        <section id="notes" aria-labelledby="notes-title">
          <div className="section-head">
            <p className="eyebrow">Session log</p>
            <h2 id="notes-title">Notes</h2>
          </div>
          <ul className="note-list">
            {notes.map((n) => (
              <li key={n.slug}>
                <h3><Link href={`/notes/${n.slug}/`}>{n.title}</Link></h3>
                <p>{n.summary}</p>
              </li>
            ))}
          </ul>
        </section>

        <section id="capabilities" aria-labelledby="capabilities-title">
          <div className="section-head">
            <p className="eyebrow">Taper · 62 to 90 min</p>
            <h2 id="capabilities-title">What I can do, and where I did it</h2>
          </div>
          <dl className="caps">
            {capabilities.map((c) => (
              <div key={c.title}>
                <dt>{c.title}</dt>
                <dd>
                  {c.body}
                  <span className="evidence">Used in: {c.evidence}</span>
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </main>
      <Contact />
    </>
  );
}

function Tags({ items }: { items: string[] }) {
  return (
    <ul className="tags" aria-label="Technologies">
      {items.map((t) => <li key={t}>{t}</li>)}
    </ul>
  );
}
