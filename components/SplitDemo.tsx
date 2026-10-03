import { GARAGES, MONTHS, split, type SplitResult } from "@/lib/split";

const OPTIONS = [
  { id: "chronological", label: "Split by date alone" },
  { id: "stratified", label: "Split by date within each garage" },
] as const;

const pct = (n: number) => `${Math.round(n * 100)}%`;

/** Radio buttons and CSS only, like the flag explainer. Works without JavaScript. */
export function SplitDemo() {
  const results = OPTIONS.map((o) => ({ ...o, result: split(o.id) }));
  return (
    <div className="sp">
      <fieldset className="demo-picks">
        <legend>Choose how to split a year of sessions into training and test data</legend>
        <div className="demo-options">
          {results.map((o, i) => (
            <label key={o.id} className="demo-option">
              <input type="radio" name="split" id={`split-${i}`} className={`demo-radio sp-radio-${i}`} defaultChecked={i === 0} />
              <span className="demo-option-body">{o.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {results.map((o, i) => (
        <div key={o.id} className={`sp-panel sp-panel-${i}`}>
          <div className="scroll-x" tabIndex={0} role="group" aria-label={`Sessions per garage per month, ${o.label.toLowerCase()}`}>
            <table className="sp-table">
              <caption>Sessions per month. Plain cells train the model. Striped cells test it.</caption>
              <thead>
                <tr>
                  <th scope="col">Month</th>
                  {Array.from({ length: MONTHS }, (_, m) => <th key={m} scope="col">{m + 1}</th>)}
                </tr>
              </thead>
              <tbody>
                {GARAGES.map((g) => (
                  <tr key={g.id}>
                    <th scope="row">{g.name}</th>
                    {o.result.cells[g.id].map((c, m) => <SplitCell key={m} train={c.train} test={c.test} />)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Mixes result={o.result} />
          <p className="demo-verdict">
            {o.id === "chronological" ? (
              <>
                <strong>The two sets disagree.</strong> Garage C is {pct(o.result.trainMix.C)} of training and{" "}
                {pct(o.result.testMix.C)} of the test. A low score here could mean a weak model, or only a new garage.
              </>
            ) : (
              <>
                <strong>The two sets match.</strong> Each garage gives its earlier sessions to training and its later
                ones to the test, so the test still comes from the future and the mix stays the same.
              </>
            )}
          </p>
        </div>
      ))}
      <p className="demo-caveat">
        Invented numbers, chosen to make the effect easy to see. My dissertation data had the same kind of shift, and
        the second split is the one I used.
      </p>
    </div>
  );
}

function SplitCell({ train, test }: { train: number; test: number }) {
  const total = train + test;
  if (total === 0) return <td className="sp-empty"><span className="sr">none</span></td>;
  const kind = test === 0 ? "train" : train === 0 ? "test" : "both";
  return (
    <td className={`sp-cell sp-${kind}`}>
      {total}
      <span className="sr">
        {kind === "both" ? `, ${train} training and ${test} test` : kind === "train" ? ", training" : ", test"}
      </span>
    </td>
  );
}

function Mixes({ result }: { result: SplitResult }) {
  const rows = [
    { name: "Training set", mix: result.trainMix, total: result.trainTotal },
    { name: "Test set", mix: result.testMix, total: result.testTotal },
  ];
  return (
    <div className="sp-mixes">
      {rows.map((r) => (
        <div key={r.name} className="sp-mix">
          <p className="sp-mix-name">{r.name} <span>{r.total} sessions</span></p>
          <div className="sp-bar" aria-hidden="true">
            {GARAGES.map((g, i) => <span key={g.id} className={`sp-seg sp-seg-${i}`} style={{ width: `${r.mix[g.id] * 100}%` }} />)}
          </div>
          <ul className="sp-legend">
            {GARAGES.map((g, i) => (
              <li key={g.id}><span className={`sp-swatch sp-seg-${i}`} aria-hidden="true" />{g.name} {pct(r.mix[g.id])}</li>
            ))}
          </ul>
        </div>
      ))}
      <p className="sp-gap">Mismatch between the two mixes: <strong>{pct(result.gap)}</strong></p>
    </div>
  );
}
