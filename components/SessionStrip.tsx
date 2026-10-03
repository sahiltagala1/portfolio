import Link from "next/link";
import { SESSION_MINUTES, buildSession } from "@/lib/session";

const STOPS = [
  { at: "0 min · Ramp", label: "Background", href: "/#background" },
  { at: "8 min · Steady state", label: "Work", href: "/#work" },
  { at: "52 min · Flag", label: "Explain a flag", href: "/#flag" },
  { at: "62 min · Taper", label: "Capabilities", href: "/#capabilities" },
  { at: "90 min · Unplug", label: "Contact", href: "/#contact" },
];
const TOP_KW = 9;
const FLAG_MINUTE = 52;

/** The page laid out as one charging session. The drawing is decoration; the links are the content. */
export function SessionStrip() {
  const session = buildSession();
  const d = session.map((r, i) => `${i ? "L" : "M"}${r.minute} ${(TOP_KW - r.powerKw).toFixed(2)}`).join(" ");
  const flag = session[FLAG_MINUTE];
  return (
    <nav className="strip" aria-label="This page as one charging session">
      <div className="strip-trace" aria-hidden="true">
        <svg viewBox={`0 0 ${SESSION_MINUTES} ${TOP_KW}`} preserveAspectRatio="none">
          <path d={d} fill="none" />
        </svg>
        <span
          className="strip-flag"
          style={{ left: `${(FLAG_MINUTE / SESSION_MINUTES) * 100}%`, top: `${((TOP_KW - flag.powerKw) / TOP_KW) * 100}%` }}
        />
      </div>
      <ol>
        {STOPS.map((s) => (
          <li key={s.href}>
            <Link href={s.href}>
              <span>{s.at}</span>
              {s.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
