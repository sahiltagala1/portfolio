import { WHITELISTS, WHITELIST_MEANING, authorize } from "@/lib/roaming";

const LINKS = [
  { label: "Provider reachable", reachable: true },
  { label: "Provider unreachable", reachable: false },
];

/** Two radio groups, eight precomputed outcomes, no JavaScript. */
export function RoamingDemo() {
  return (
    <div className="ro">
      <fieldset className="demo-picks">
        <legend>The card&apos;s whitelist setting, chosen in advance by the driver&apos;s provider</legend>
        <div className="demo-options">
          {WHITELISTS.map((w, i) => (
            <label key={w} className="demo-option">
              <input type="radio" name="whitelist" id={`wl-${i}`} className={`demo-radio ro-w-${i}`} defaultChecked={i === 3} />
              <span className="demo-option-body"><code>{w}</code></span>
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset className="demo-picks">
        <legend>The network at the moment the driver taps</legend>
        <div className="demo-options">
          {LINKS.map((l, i) => (
            <label key={l.label} className="demo-option">
              <input type="radio" name="link" id={`link-${i}`} className={`demo-radio ro-l-${i}`} defaultChecked={i === 1} />
              <span className="demo-option-body">{l.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {WHITELISTS.map((w, wi) =>
        LINKS.map((l, li) => {
          const o = authorize(w, l.reachable);
          return (
            <article key={`${w}-${li}`} className={`ro-panel ro-panel-${wi}-${li}`}>
              <h3>
                <span className={o.allowed ? "ro-badge ro-yes" : "ro-badge ro-no"}>
                  {o.allowed ? "✓ Charging starts" : "✕ Charging refused"}
                </span>
              </h3>
              <p className="ro-meaning"><code>{w}</code>: {WHITELIST_MEANING[w]}</p>
              <ol className="ro-steps">
                {o.steps.map((s) => <li key={s}>{s}</li>)}
              </ol>
              <p className="demo-verdict">
                Decided by:{" "}
                <strong>
                  {o.decidedBy === "nobody"
                    ? "nobody. The only party allowed to decide could not be reached."
                    : o.decidedBy === "live answer"
                      ? "the provider, with a live answer."
                      : "the operator, from its stored copy of the card."}
                </strong>
              </p>
            </article>
          );
        }),
      )}
      <p className="demo-caveat">
        A simplified picture of the whitelist types in OCPI, the roaming protocol I worked with at Numocity. Here the
        provider always says yes when it can be reached, and with <code>ALLOWED</code> the operator chooses to ask.
      </p>
    </div>
  );
}
