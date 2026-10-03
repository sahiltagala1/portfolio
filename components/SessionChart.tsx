import { PHASES, RATED_KW, SESSION_MINUTES, expectedPower, type Reading } from "@/lib/session";

/**
 * Server-rendered SVG of the session. No client JavaScript.
 * Geometry is exported so HTML hit targets can be laid over the drawing.
 */
export const CHART = { width: 720, height: 360, left: 62, right: 14, top: 18, bottom: 62, maxKw: 10 };

export const xOf = (minute: number) =>
  CHART.left + ((CHART.width - CHART.left - CHART.right) * minute) / SESSION_MINUTES;
export const yOf = (kw: number) =>
  CHART.top + (CHART.height - CHART.top - CHART.bottom) * (1 - kw / CHART.maxKw);

type Props = {
  session: Reading[];
  flagged: number[];
  /** Minutes drawn as large selectable markers, in order. */
  picks?: number[];
  title: string;
  description: string;
  id: string;
};

export function SessionChart({ session, flagged, picks = [], title, description, id }: Props) {
  const line = session.map((r, i) => `${i ? "L" : "M"}${xOf(r.minute).toFixed(1)} ${yOf(r.powerKw).toFixed(1)}`).join(" ");
  const expected = session
    .map((r, i) => `${i ? "L" : "M"}${xOf(r.minute).toFixed(1)} ${yOf(expectedPower(r.minute)).toFixed(1)}`)
    .join(" ");
  const floor = yOf(0);
  const flaggedSet = new Set(flagged);

  return (
    <svg
      className="chart"
      viewBox={`0 0 ${CHART.width} ${CHART.height}`}
      role="img"
      aria-labelledby={`${id}-t ${id}-d`}
    >
      <title id={`${id}-t`}>{title}</title>
      <desc id={`${id}-d`}>{description}</desc>

      {[0, 5, 10].map((kw) => (
        <g key={kw}>
          <line className="chart-grid" x1={CHART.left} x2={CHART.width - CHART.right} y1={yOf(kw)} y2={yOf(kw)} />
          <text className="chart-text" x={CHART.left - 10} y={yOf(kw)} textAnchor="end" dominantBaseline="middle">
            {kw}
          </text>
        </g>
      ))}
      <text className="chart-text" x={CHART.left - 10} y={yOf(7.5) } textAnchor="end" dominantBaseline="middle">
        kW
      </text>

      <line className="chart-limit" x1={CHART.left} x2={CHART.width - CHART.right} y1={yOf(RATED_KW)} y2={yOf(RATED_KW)} />
      <path className="chart-expected" d={expected} fill="none" />
      <path className="chart-line" d={line} fill="none" />

      {[0, 30, 60, 90].map((m) => (
        <text key={m} className="chart-text" x={xOf(m)} y={floor + 22} textAnchor={m === 0 ? "start" : m === 90 ? "end" : "middle"} dominantBaseline="middle">
          {m === 90 ? "90 min" : m}
        </text>
      ))}
      {PHASES.map((p, i) => (
        <g key={p.id}>
          {i > 0 && <line className="chart-phase" x1={xOf(p.from)} x2={xOf(p.from)} y1={CHART.top} y2={floor} />}
          <text
            className="chart-text chart-phase-name"
            x={i === 0 ? xOf(0) : xOf((p.from + p.to) / 2)}
            y={floor + 50}
            textAnchor={i === 0 ? "start" : "middle"}
            dominantBaseline="middle"
          >
            {p.name}
          </text>
        </g>
      ))}

      {session
        .filter((r) => flaggedSet.has(r.minute) && !picks.includes(r.minute))
        .map((r) => (
          <circle key={r.minute} className="chart-flag-minor" cx={xOf(r.minute)} cy={yOf(r.powerKw)} r={5} />
        ))}

      {picks.map((minute, i) => {
        const r = session[minute];
        const cx = xOf(minute);
        const cy = yOf(r.powerKw);
        const isFlag = flaggedSet.has(minute);
        return (
          <g key={minute} className={`chart-pick chart-pick-${i}`}>
            <circle className="chart-ring" cx={cx} cy={cy} r={17} fill="none" />
            {isFlag ? (
              <path className="chart-flag" d={`M${cx} ${cy - 10} L${cx + 9.5} ${cy + 7} L${cx - 9.5} ${cy + 7} Z`} />
            ) : (
              <circle className="chart-normal" cx={cx} cy={cy} r={8} />
            )}
          </g>
        );
      })}
    </svg>
  );
}
