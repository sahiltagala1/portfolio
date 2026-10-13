import Image from "next/image";
import Link from "next/link";
import { Contact } from "@/components/Chrome";
import { PinIcon } from "@/components/Icons";
import { Marquee } from "@/components/Marquee";
import { Orbit } from "@/components/Orbit";
import { TypedRoles } from "@/components/TypedRoles";
import { notes } from "@/lib/notes";
import { capabilities, experience, featured, profile, projects, toolbelt } from "@/lib/content";

const demos = [
  {
    tag: "Explainability",
    title: "Explain a flag",
    text: "Pick a reading and see which features pushed the model to flag it.",
    href: "/playground/#flag",
  },
  {
    tag: "Evaluation",
    title: "Split the data",
    text: "Why a test score can mislead when the data shifts over time.",
    href: "/playground/#split",
  },
  {
    tag: "Integrations",
    title: "Roaming authorisation",
    text: "Who decides when one system cannot reach another.",
    href: "/playground/#roaming",
  },
];

export default function Home() {
  const others = projects.filter((p) => p.slug !== featured.slug);
  const results = featured.caseStudy?.results ?? [];

  return (
    <>
      <main id="main">
        <section className="hero" aria-labelledby="hero-title">
          <Orbit />
          <p className="kicker">
            <span className="kicker-dot" aria-hidden="true" />
            {profile.role} · {profile.location}
          </p>
          {profile.photo && (
            <div className="intro">
              <span className="avatar">
                <Image src={profile.photo.avatar} alt="" width={240} height={240} priority />
              </span>
              <div className="intro-text">
                <p className="intro-hello">Hi, I&apos;m {profile.shortName}.</p>
                <TypedRoles roles={profile.roles} />
              </div>
            </div>
          )}
          <h1 id="hero-title" className="display">
            <span className="line">
              <span>{profile.headline.first}</span>
            </span>{" "}
            <span className="line">
              <span>
                <em>{profile.headline.accent}</em>
                {profile.headline.rest}
              </span>
            </span>
          </h1>
          <p className="lede hero-lede">{profile.summary}</p>
          {profile.availability && (
            <p className="status">
              <span className="status-dot" aria-hidden="true" />
              {profile.availability}
            </p>
          )}
          <ul className="actions">
            <li>
              <Link className="btn btn-solid" href="/#work">
                See my work
              </Link>
            </li>
            <li>
              <Link className="btn" href={`/work/${featured.slug}/`}>
                Read the dissertation case study
              </Link>
            </li>
          </ul>
        </section>

        <Marquee items={toolbelt} />

        {profile.photo && (
          <section id="about" className="about" aria-labelledby="about-title">
            <figure className="photo-card">
              <div className="photo-frame">
                <Image
                  src={profile.photo.full.src}
                  alt={profile.photo.alt}
                  width={profile.photo.full.width}
                  height={profile.photo.full.height}
                  sizes="(max-width: 52rem) 90vw, 28rem"
                />
                <span className="photo-tag">
                  <PinIcon />
                  Bengaluru → Dublin
                </span>
              </div>
              <figcaption>
                <span className="photo-name">
                  {profile.shortName}
                  <span>.</span>
                </span>
                <span className="photo-meta">
                  Software engineer
                  <br />
                  MSc Data Science
                </span>
              </figcaption>
            </figure>
            <div className="about-text">
              <p className="eyebrow">About</p>
              <h2 id="about-title" className="about-title">
                {profile.about.title.before}
                <em>{profile.about.title.accent}</em>
                {profile.about.title.after}
              </h2>
              <p className="about-lead">{profile.about.lead}</p>
              {profile.about.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>
        )}

        <section id="background" aria-labelledby="background-title">
          <div className="section-head">
            <p className="eyebrow">Experience</p>
            <h2 id="background-title">
              Where I&apos;ve <em>been</em>
            </h2>
            <p className="lede">
              I worked on charging infrastructure before I studied it. The dissertation came out of
              knowing what that data looks like from the inside.
            </p>
          </div>
          <ol className="timeline">
            {experience.map((e) => (
              <li key={e.title}>
                <h3>{e.title}</h3>
                <p className="meta">{e.meta}</p>
                {e.points.length > 0 && (
                  <ul>
                    {e.points.map((pt) => (
                      <li key={pt}>{pt}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ol>
        </section>

        <section id="work" aria-labelledby="work-title">
          <div className="section-head">
            <p className="eyebrow">Selected work</p>
            <h2 id="work-title">
              Selected <em>work</em>
            </h2>
          </div>

          <article className="feature">
            <div className="feature-text">
              <p className="eyebrow">
                {featured.context} · {featured.track}
              </p>
              <h3>{featured.title}</h3>
              <p>{featured.summary}</p>
              <p>
                The hard part was the evaluation. The mix of garages in the data shifted over time,
                so I split by time within each garage to get results I could trust.
              </p>
              <Tags items={featured.technologies} />
              <p>
                <Link className="more" href={`/work/${featured.slug}/`}>
                  Read the case study
                </Link>
              </p>
              {featured.sourceUrl && (
                <p>
                  <a className="more" href={featured.sourceUrl} rel="noopener noreferrer">
                    View the dissertation code on GitHub
                  </a>
                </p>
              )}
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
                  <p>
                    <a className="more" href={p.sourceUrl} rel="noopener noreferrer">
                      View source for {p.title} on GitHub
                    </a>
                  </p>
                )}
                {p.liveUrl && (
                  <p>
                    <a className="more" href={p.liveUrl} rel="noopener noreferrer">
                      View {p.title} live
                    </a>
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section id="playground" aria-labelledby="playground-title">
          <div className="section-head">
            <p className="eyebrow">Playground</p>
            <h2 id="playground-title">
              Ideas small enough to <em>try</em>
            </h2>
          </div>
          <ul className="demo-cards">
            {demos.map((d) => (
              <li key={d.href}>
                <Link href={d.href} className="demo-card">
                  <span className="demo-card-tag">{d.tag}</span>
                  <span className="demo-card-title">{d.title}</span>
                  <span className="demo-card-text">{d.text}</span>
                  <span className="demo-card-go" aria-hidden="true">
                    Try it →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section id="notes" aria-labelledby="notes-title">
          <div className="section-head">
            <p className="eyebrow">Writing</p>
            <h2 id="notes-title">
              Things I <em>wrote</em> down
            </h2>
          </div>
          <ul className="note-list">
            {notes.map((n) => (
              <li key={n.slug}>
                <h3>
                  <Link href={`/notes/${n.slug}/`}>{n.title}</Link>
                </h3>
                <p>{n.summary}</p>
              </li>
            ))}
          </ul>
        </section>

        <section id="capabilities" aria-labelledby="capabilities-title">
          <div className="section-head">
            <p className="eyebrow">Skills</p>
            <h2 id="capabilities-title">
              What I can <em>do</em>, and where
            </h2>
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
      {items.map((t) => (
        <li key={t}>{t}</li>
      ))}
    </ul>
  );
}
