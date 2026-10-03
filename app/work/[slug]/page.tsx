import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Contact } from "@/components/Chrome";
import { caseStudies } from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudies.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const project = caseStudies.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/work/${project.slug}/` },
    openGraph: { type: "article", title: project.title, description: project.summary, url: `/work/${project.slug}/`, images: ["/og.png"] },
  };
}

export default async function CaseStudyPage(props: PageProps<"/work/[slug]">) {
  const { slug } = await props.params;
  const project = caseStudies.find((p) => p.slug === slug);
  if (!project?.caseStudy) notFound();
  const cs = project.caseStudy;

  return (
    <>
      <main id="main" className="case">
        <header className="case-head">
          <p className="eyebrow"><Link href="/#work">Work</Link> · Case study</p>
          <h1>{project.title}</h1>
          <p className="lede">{project.summary}</p>
          <dl className="facts">
            {cs.facts.map((f) => (
              <div key={f.label}>
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        </header>

        <section aria-labelledby="problem">
          <h2 id="problem">The problem</h2>
          {cs.problem.map((p) => <p key={p}>{p}</p>)}
        </section>

        <section aria-labelledby="approach">
          <h2 id="approach">The approach</h2>
          {cs.approach.map((p) => <p key={p}>{p}</p>)}
          <p>
            <Link className="more" href="/#flag">Try a simplified version of the idea</Link>
          </p>
        </section>

        <section aria-labelledby="decisions">
          <h2 id="decisions">{cs.decisions.length > 1 ? "Decisions that mattered" : "The decision that mattered"}</h2>
          {cs.decisions.map((d) => (
            <div key={d.title} className="decision">
              <h3>{d.title}</h3>
              {d.alternative && (
                <p><span className="tag-label">What went wrong first</span>{d.alternative}</p>
              )}
              <p><span className="tag-label">What I did</span>{d.approach}</p>
            </div>
          ))}
        </section>

        <section aria-labelledby="outcome">
          <h2 id="outcome">The outcome</h2>
          {cs.outcome.map((p) => <p key={p}>{p}</p>)}
          {cs.results && (
            <dl className="results results-row">
              {cs.results.map((r) => (
                <div key={r.label}>
                  <dt>{r.label}</dt>
                  <dd>{r.value}</dd>
                </div>
              ))}
            </dl>
          )}
          {cs.comparison && (
            <div className="scroll-x" tabIndex={0} role="group" aria-label="Model comparison table">
              <table className="cmp">
                <caption>{cs.comparison.caption}</caption>
                <thead>
                  <tr>{cs.comparison.columns.map((c) => <th key={c} scope="col">{c}</th>)}</tr>
                </thead>
                <tbody>
                  {cs.comparison.rows.map((row, i) => (
                    <tr key={row[0]} className={i === cs.comparison!.highlight ? "cmp-mine" : undefined}>
                      <th scope="row">{row[0]}{i === cs.comparison!.highlight && <span className="cmp-tag"> · this work</span>}</th>
                      {row.slice(1).map((v, j) => <td key={j}>{v}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {cs.limitations && (
          <section aria-labelledby="limits">
            <h2 id="limits">What this does not show</h2>
            <ul className="limits">
              {cs.limitations.map((l) => <li key={l}>{l}</li>)}
            </ul>
          </section>
        )}

        {project.sourceUrl && (
          <p><a className="btn btn-solid" href={project.sourceUrl} rel="noopener noreferrer">View the code and notebooks on GitHub</a></p>
        )}

        <p className="case-next">
          <Link className="btn" href="/#work">See the rest of my work</Link>
        </p>
      </main>
      <Contact />
    </>
  );
}
