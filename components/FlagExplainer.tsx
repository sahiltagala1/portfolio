import { DEFAULT_PICK, PICKS } from "@/lib/picks";
import { FLAG_THRESHOLD, MAX_RATIO, buildSession, explain, flaggedMinutes } from "@/lib/session";
import { CHART, SessionChart, xOf, yOf } from "./SessionChart";

/**
 * The signature interaction. It is built from radio buttons and CSS only:
 * it works with the keyboard (arrow keys), by touch, and with JavaScript
 * switched off. Everything is computed at build time from lib/session.ts.
 */
export function FlagExplainer() {
  const session = buildSession();
  const flagged = flaggedMinutes(session);
  const explained = PICKS.map((p) => ({ ...p, ...explain(session, p.minute) }));
  const span = MAX_RATIO - 1;

  return (
    <div className="ex">
      <fieldset className="ex-picks">
        <legend>Pick a reading and see why the model did or did not flag it</legend>
        <div className="ex-options">
          {explained.map((e, i) => (
            <label key={e.minute} className="ex-option">
              <input
                type="radio"
                name="reading"
                id={`reading-${i}`}
                className={`ex-radio ex-radio-${i}`}
                defaultChecked={i === DEFAULT_PICK}
              />
              <span className="ex-option-body">
                <span className="ex-mark" aria-hidden="true">{e.flagged ? "▲" : "●"}</span>
                <span>Minute {e.minute}</span>
                <span className="ex-status">{e.flagged ? "Flagged" : "Normal"}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="ex-chart">
        <SessionChart
          id="explainer"
          session={session}
          flagged={flagged}
          picks={PICKS.map((p) => p.minute)}
          title="Charging power over one fictional 90 minute session"
          description="Power ramps up to about 7.2 kilowatts, holds, then tapers. Triangles mark readings the model flagged at minutes 24, 40 and 52. A circle marks a normal reading at minute 78."
        />
        {explained.map((e, i) => (
          <label
            key={e.minute}
            htmlFor={`reading-${i}`}
            className="ex-hit"
            aria-hidden="true"
            style={{
              left: `${(xOf(e.minute) / CHART.width) * 100}%`,
              top: `${(yOf(e.reading.powerKw) / CHART.height) * 100}%`,
            }}
          />
        ))}
      </div>
      <p className="ex-key">
        <span><span className="key-line" aria-hidden="true" /> measured power</span>
        <span><span className="key-line key-dashed" aria-hidden="true" /> expected curve</span>
        <span><span className="key-line key-limit" aria-hidden="true" /> 7.4 kW rating</span>
      </p>

      <div className="ex-panels">
        {explained.map((e, i) => (
          <article key={e.minute} className={`ex-panel ex-panel-${i}`}>
            <h3>
              Minute {e.minute}: {e.reading.powerKw.toFixed(1)} kW, {e.flagged ? "flagged" : "not flagged"}
            </h3>
            <p className="ex-note">{e.note}</p>
            <ul className="ex-bars">
              {e.contributions.map((c) => {
                const toward = c.value > 0;
                const width = (Math.min(Math.abs(c.value), span) / span) * 50;
                return (
                  <li key={c.id}>
                    <span className="ex-feature">{c.label}</span>
                    <span className="ex-observed">{c.observed}</span>
                    <span className="ex-track" aria-hidden="true">
                      <span
                        className={toward ? "ex-bar ex-bar-toward" : "ex-bar ex-bar-away"}
                        style={toward ? { left: "50%", width: `${width}%` } : { right: "50%", width: `${width}%` }}
                      />
                    </span>
                    <span className="ex-value">
                      {fmt(c.value)} {toward ? "toward a flag" : "away"}
                    </span>
                  </li>
                );
              })}
            </ul>
            <p className="ex-sum">
              Score {fmt(e.score)}. {e.flagged ? "Above" : "Below"} {FLAG_THRESHOLD}, so this reading is{" "}
              <strong>{e.flagged ? "flagged" : "normal"}</strong>.
            </p>
          </article>
        ))}
      </div>

      <p className="ex-caveat">
        This is a teaching model with made-up data, far simpler than the LSTM in my dissertation. It keeps the
        property that matters: the pushes add up exactly to the score, which is how SHAP values relate to a
        model&apos;s output.
      </p>
    </div>
  );
}

function fmt(n: number): string {
  return (n < 0 ? "−" : "+") + Math.abs(n).toFixed(1);
}
