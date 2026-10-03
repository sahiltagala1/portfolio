import type { Metadata } from "next";
import Link from "next/link";
import { Contact } from "@/components/Chrome";
import { FlagExplainer } from "@/components/FlagExplainer";
import { RoamingDemo } from "@/components/RoamingDemo";
import { SplitDemo } from "@/components/SplitDemo";

const description = "Three small demos of ideas from Mohammed Sahil Tagala's work: explaining an anomaly flag, splitting data honestly, and roaming authorisation in EV charging.";

export const metadata: Metadata = {
  title: "Playground",
  description,
  alternates: { canonical: "/playground/" },
  openGraph: { title: "Playground", description, url: "/playground/", images: ["/og.png"] },
};

export default function Playground() {
  return (
    <>
      <main id="main">
        <header className="hero">
          <p className="eyebrow">Playground · Three demos</p>
          <h1>Ideas from my work, small enough to try.</h1>
          <p className="lede">
            Each demo uses made-up data and leaves out most of the real system. Each one keeps the single idea I
            would want a colleague to take away.
          </p>
          <ul className="toc">
            <li><a href="#flag">Explain a flag</a></li>
            <li><a href="#split">Split the data</a></li>
            <li><a href="#roaming">Roaming authorisation</a></li>
          </ul>
        </header>

        <section id="flag" aria-labelledby="flag-title">
          <div className="section-head">
            <p className="eyebrow">From my dissertation · Explainability</p>
            <h2 id="flag-title">Explain a flag</h2>
            <p className="lede">A flag is only useful if it says why. Pick a reading and see what pushed the model.</p>
          </div>
          <FlagExplainer />
          <p><Link className="more" href="/notes/what-a-shap-value-says/">Read the note: what a SHAP value says, and what it doesn&apos;t</Link></p>
        </section>

        <section id="split" aria-labelledby="split-title">
          <div className="section-head">
            <p className="eyebrow">From my dissertation · Evaluation</p>
            <h2 id="split-title">Split the data</h2>
            <p className="lede">
              Three garages, one year. One is winding down and one opens halfway through. How you cut the data
              decides whether the test score means anything.
            </p>
          </div>
          <SplitDemo />
          <p><Link className="more" href="/notes/a-test-set-should-look-like-tomorrow/">Read the note: a test set should look like tomorrow</Link></p>
        </section>

        <section id="roaming" aria-labelledby="roaming-title">
          <div className="section-head">
            <p className="eyebrow">From Numocity · Integrations</p>
            <h2 id="roaming-title">Roaming authorisation</h2>
            <p className="lede">
              A driver taps a card from one company at a charger run by another. Should charging start if the
              card&apos;s own company cannot be reached?
            </p>
          </div>
          <RoamingDemo />
          <p><Link className="more" href="/notes/decide-who-is-trusted-before-the-network-goes-down/">Read the note: decide who is trusted before the network goes down</Link></p>
        </section>
      </main>
      <Contact />
    </>
  );
}
